"use server";

import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/prisma";
import { getVisitor } from "@/lib/visitor";

export type EndorsementState = {
  /** Endorsement count per project slug. */
  counts: Record<string, number>;
  /** Slugs the current visitor has already endorsed. */
  endorsed: string[];
};

export type EndorseResult =
  | { ok: true; count: number; endorsed: boolean }
  | { ok: false; message: string };

const slugSchema = z.string().min(1).max(100).regex(/^[a-z0-9-]+$/);

/** Counts for every project, plus which ones this visitor has endorsed. */
export async function getEndorsements(): Promise<EndorsementState> {
  const empty: EndorsementState = { counts: {}, endorsed: [] };
  if (!hasDatabase) return empty;

  try {
    const visitor = await getVisitor();
    const projects = await prisma.project.findMany({
      select: {
        slug: true,
        _count: { select: { endorsements: true } },
        endorsements: { where: { visitorHash: visitor.hash }, select: { id: true } },
      },
    });

    return {
      counts: Object.fromEntries(projects.map((p) => [p.slug, p._count.endorsements])),
      endorsed: projects.filter((p) => p.endorsements.length > 0).map((p) => p.slug),
    };
  } catch (error) {
    console.warn("[endorsements] Could not load counts:", (error as Error).message);
    return empty;
  }
}

/** Toggle the current visitor's endorsement of a project. */
export async function toggleEndorsement(slug: string): Promise<EndorseResult> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return { ok: false, message: "Unknown project." };
  if (!hasDatabase) {
    return { ok: false, message: "Endorsements are unavailable right now." };
  }

  try {
    const visitor = await getVisitor();
    const project = await prisma.project.findUnique({
      where: { slug: parsed.data },
      select: { id: true },
    });
    if (!project) return { ok: false, message: "Unknown project." };

    const key = { projectId: project.id, visitorHash: visitor.hash };
    const removed = await prisma.endorsement.deleteMany({ where: key });
    if (removed.count === 0) {
      await prisma.endorsement.upsert({
        where: { projectId_visitorHash: key },
        update: {},
        create: key,
      });
    }

    const count = await prisma.endorsement.count({ where: { projectId: project.id } });
    return { ok: true, count, endorsed: removed.count === 0 };
  } catch (error) {
    console.error("[endorsements] Toggle failed:", error);
    return { ok: false, message: "Could not save your endorsement. Please try again." };
  }
}

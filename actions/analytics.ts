"use server";

import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/prisma";
import { getVisitor } from "@/lib/visitor";

const pageViewSchema = z.object({
  path: z.string().startsWith("/").max(200),
  referrer: z.string().max(500).optional(),
});

const BOT_PATTERN = /bot|crawl|spider|slurp|headless|lighthouse|preview/i;

/**
 * Record a page view. Fire-and-forget: analytics must never break the page,
 * so every failure is swallowed.
 */
export async function trackPageView(input: { path: string; referrer?: string }): Promise<void> {
  if (!hasDatabase) return;

  const parsed = pageViewSchema.safeParse(input);
  if (!parsed.success) return;

  try {
    const visitor = await getVisitor();
    if (BOT_PATTERN.test(visitor.userAgent)) return;

    await prisma.pageView.create({
      data: {
        path: parsed.data.path,
        referrer: parsed.data.referrer || null,
        visitorHash: visitor.dailyHash,
      },
    });
  } catch (error) {
    console.warn("[analytics] Page view not recorded:", (error as Error).message);
  }
}

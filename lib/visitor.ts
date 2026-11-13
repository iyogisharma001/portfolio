import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

const SALT = process.env.VISITOR_HASH_SALT ?? "dev-only-salt-change-me";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export type Visitor = {
  /** Stable per visitor. Used for rate limiting and one-endorsement-per-project. */
  hash: string;
  /** Rotates every UTC day, so page views can't be linked across days. */
  dailyHash: string;
  userAgent: string;
};

/**
 * Identify the current visitor without cookies and without storing their IP:
 * only salted SHA-256 hashes ever reach the database.
 */
export async function getVisitor(): Promise<Visitor> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";
  const userAgent = (headerList.get("user-agent") ?? "unknown").slice(0, 300);
  const day = new Date().toISOString().slice(0, 10);

  return {
    hash: sha256(`${SALT}:${ip}:${userAgent}`),
    dailyHash: sha256(`${SALT}:${day}:${ip}:${userAgent}`),
    userAgent,
  };
}

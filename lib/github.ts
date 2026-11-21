import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { profile } from "@/lib/data";

export type RepoStats = {
  name: string;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
};

export type LiveStats = {
  repos: Record<string, RepoStats>;
  /** The most recently pushed public, non-fork repository. */
  latest: RepoStats | null;
  leetcodeSolved: number | null;
  /** ISO time the data was fetched, or null when every source failed. */
  fetchedAt: string | null;
};

const HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-site",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

type ApiRepo = {
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  private: boolean;
};

async function fetchRepos(): Promise<RepoStats[]> {
  const res = await fetch(
    `https://api.github.com/users/${profile.githubHandle}/repos?per_page=100&sort=pushed`,
    { headers: HEADERS, signal: AbortSignal.timeout(6000) },
  );
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const data = (await res.json()) as ApiRepo[];
  return data
    .filter((repo) => !repo.fork && !repo.private && repo.name !== profile.githubHandle)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
    }));
}

async function fetchLeetCodeSolved(): Promise<number> {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
    body: JSON.stringify({
      query:
        "query($u:String!){matchedUser(username:$u){submitStatsGlobal{acSubmissionNum{difficulty count}}}}",
      variables: { u: profile.leetcodeHandle },
    }),
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`LeetCode responded ${res.status}`);
  const json = (await res.json()) as {
    data?: { matchedUser?: { submitStatsGlobal?: { acSubmissionNum?: { difficulty: string; count: number }[] } } };
  };
  const all = json.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum?.find(
    (entry) => entry.difficulty === "All",
  );
  if (typeof all?.count !== "number") throw new Error("LeetCode returned no count");
  return all.count;
}

/**
 * Live data from GitHub and LeetCode, cached for an hour. Each source fails
 * independently, so one outage never takes the other (or the page) down.
 */
export async function getLiveStats(): Promise<LiveStats> {
  "use cache";
  cacheLife("hours");
  cacheTag("live-stats");

  const [repos, leetcode] = await Promise.allSettled([fetchRepos(), fetchLeetCodeSolved()]);

  if (repos.status === "rejected") console.warn("[github] repos unavailable:", String(repos.reason));
  if (leetcode.status === "rejected") console.warn("[leetcode] stats unavailable:", String(leetcode.reason));

  const repoList = repos.status === "fulfilled" ? repos.value : [];
  const anyOk = repos.status === "fulfilled" || leetcode.status === "fulfilled";

  return {
    repos: Object.fromEntries(repoList.map((repo) => [repo.name, repo])),
    latest: repoList[0] ?? null,
    leetcodeSolved: leetcode.status === "fulfilled" ? leetcode.value : null,
    fetchedAt: anyOk ? new Date().toISOString() : null,
  };
}

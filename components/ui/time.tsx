"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/format";

const subscribeToClock = (callback: () => void) => {
  const id = window.setInterval(callback, 30_000);
  return () => window.clearInterval(id);
};

/** Current time in a timezone, rendered only on the client to avoid hydration drift. */
export function LocalTime({ timeZone, label }: { timeZone: string; label: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const stop = subscribeToClock(tick);
    return () => {
      window.clearTimeout(first);
      stop();
    };
  }, []);

  if (!now) return <span className="tabular-nums">--:-- {label}</span>;
  const time = new Intl.DateTimeFormat("en-IN", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);
  return (
    <time className="tabular-nums" dateTime={now.toISOString()}>
      {time} {label}
    </time>
  );
}

const absolute = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** "3 days ago" on the client; a plain date on the server and before hydration. */
export function TimeAgo({ iso }: { iso: string }) {
  const [label, setLabel] = useState(() => absolute.format(new Date(iso)));

  useEffect(() => {
    const id = window.setTimeout(() => setLabel(timeAgo(iso)), 0);
    return () => window.clearTimeout(id);
  }, [iso]);

  return (
    <time dateTime={iso} title={absolute.format(new Date(iso))}>
      {label}
    </time>
  );
}

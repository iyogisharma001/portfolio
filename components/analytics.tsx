"use client";

import { useEffect } from "react";
import { trackPageView } from "@/actions/analytics";

let tracked = false;

/** Records one page view per page load. Renders nothing. */
export function Analytics() {
  useEffect(() => {
    if (tracked) return;
    tracked = true;
    void trackPageView({
      path: window.location.pathname,
      referrer: document.referrer || undefined,
    }).catch(() => {
      // Analytics is best-effort.
    });
  }, []);

  return null;
}

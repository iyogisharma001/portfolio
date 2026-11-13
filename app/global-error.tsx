"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown by the root layout itself. It
 * replaces the layout, so it renders its own <html> and <body> and avoids
 * depending on any app styles or components.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#09090b",
          color: "#e4e4e7",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, margin: 0, color: "#fff" }}>Something went wrong.</h1>
          <p style={{ color: "#a1a1aa", margin: "12px 0 28px" }}>
            The site hit an unexpected error. Please try again.
          </p>
          <button
            onClick={() => retry()}
            style={{
              height: 44,
              padding: "0 20px",
              borderRadius: 999,
              border: 0,
              background: "#fff",
              color: "#09090b",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

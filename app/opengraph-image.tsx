import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, generated at build time. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(900px 500px at 15% 0%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(800px 500px at 100% 100%, rgba(34,211,238,0.25), transparent 60%), #09090b",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              color: "#09090b",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa" }}>{profile.location}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3 }}>{profile.name}</div>
          <div style={{ fontSize: 40, color: "#67e8f9", marginTop: 8 }}>
            {`${profile.headline} · Backend & ML from first principles`}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa" }}>
          Node.js · TypeScript · Python · C++ · 500+ DSA problems solved
        </div>
      </div>
    ),
    size,
  );
}

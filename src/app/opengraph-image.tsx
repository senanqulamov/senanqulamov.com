import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name}, engineer, founder, listener`;

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
          background: "radial-gradient(circle at 75% 35%, #3b3566 0%, #0d0e18 45%, #07080D 100%)",
          color: "#ECEBF2",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, opacity: 0.7 }}>senanqulamov.com</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>Senan</div>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>Qulamov</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>
          Tech Lead at PMIS (BP) · Founder of BidBary · Seven years a therapist
        </div>
      </div>
    ),
    size,
  );
}

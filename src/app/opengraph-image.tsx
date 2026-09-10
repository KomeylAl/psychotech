import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

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
          background: "#071525",
          color: "#E8EEF5",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            letterSpacing: 6,
            color: "#5EB0E8",
          }}
        >
          PSYCHO TECH
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.15 }}>
            Psychology × Technology
          </div>
          <div style={{ fontSize: 28, color: "#8BA4BB", maxWidth: 760 }}>
            Software at the intersection of mind and machine.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Architecture Kata - ソフトウェアアーキテクチャを、実践で学ぶ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 80,
            display: "flex",
            gap: 12,
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(255,255,255,0.9)" }} />
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(255,255,255,0.6)" }} />
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(255,255,255,0.35)" }} />
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            padding: "8px 20px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.15)",
            marginBottom: 32,
          }}
        >
          Architecture Kata
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>ソフトウェアアーキテクチャを、</span>
          <span>実践で学ぶ</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.5,
          }}
        >
          グループで議論し、トレードオフを言語化する研修ツール
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          github.com/tomota53/architecture-kata-public
        </div>
      </div>
    ),
    { ...size }
  );
}

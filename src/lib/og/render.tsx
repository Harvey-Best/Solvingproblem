import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Shared look for Open Graph images: warm paper, blue glow, Fraunces headline. */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0e1b2c";
const MUTED = "#4b5563";
const LINE = "#d7d7d3";
const GRAD = "linear-gradient(120deg, #1d4ed8, #0369a1, #0e7490)";

async function loadFonts() {
  const dir = join(process.cwd(), "src/lib/og/fonts");
  const [display, displayItalic, sans] = await Promise.all([
    readFile(join(dir, "fraunces-600.woff")),
    readFile(join(dir, "fraunces-600-italic.woff")),
    readFile(join(dir, "geist-500.woff")),
  ]);
  return [
    { name: "Fraunces", data: display, weight: 600 as const, style: "normal" as const },
    { name: "Fraunces", data: displayItalic, weight: 600 as const, style: "italic" as const },
    { name: "Geist", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          display: "flex",
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundImage: GRAD,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
        </svg>
      </div>
      <span style={{ fontFamily: "Fraunces", fontSize: 34, color: INK }}>Home Doctor</span>
    </div>
  );
}

function Frame({ children, footer }: { children: React.ReactNode; footer: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "56px 64px",
        backgroundColor: "#f4f2ec",
        backgroundImage:
          "radial-gradient(circle at 92% 8%, rgba(147,197,253,0.75), rgba(244,242,236,0) 42%), radial-gradient(circle at 4% 96%, rgba(103,232,249,0.45), rgba(244,242,236,0) 40%)",
        fontFamily: "Geist",
        color: INK,
      }}
    >
      <Logo />
      <div style={{ display: "flex", flex: 1 }}>{children}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `2px solid ${LINE}`,
          paddingTop: 22,
          fontSize: 24,
          color: MUTED,
        }}
      >
        <span>{footer}</span>
        <span
          style={{
            display: "flex",
            backgroundImage: GRAD,
            color: "#fff",
            borderRadius: 999,
            padding: "10px 24px",
            fontSize: 24,
          }}
        >
          Diagnose my problem
        </span>
      </div>
    </div>
  );
}

const CHART: [string, string][] = [
  ["Diagnosis", "Worn cartridge"],
  ["Severity", "Fix soon"],
  ["Verdict", "DIY · 30–45 min"],
  ["Part", "Cartridge · $12–$35"],
  ["Pro price", "$150–$300"],
];

/** The site-wide card: the landing headline plus a sample diagnosis chart. */
export async function renderHomeOgImage() {
  return new ImageResponse(
    (
      <Frame footer="First diagnosis free · No signup">
        <div style={{ display: "flex", alignItems: "center", gap: 48, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontFamily: "Fraunces",
                fontSize: 72,
                lineHeight: 1.04,
                letterSpacing: -0.5,
              }}
            >
              Point your phone at the problem. Know what&apos;s wrong in&nbsp;
              <span style={{ fontStyle: "italic", color: "#1d4ed8" }}>30 seconds.</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 380,
              padding: "22px 26px",
              backgroundColor: "#fffefa",
              border: `2px solid ${LINE}`,
              borderRadius: 24,
              boxShadow: "0 24px 40px -24px rgba(14,27,44,0.45)",
              transform: "rotate(2deg)",
            }}
          >
            <span style={{ fontSize: 16, letterSpacing: 3, color: MUTED }}>HOUSE CALL · CHART</span>
            {CHART.map(([k, v], i) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "11px 0",
                  borderBottom: i === CHART.length - 1 ? "none" : `2px dashed ${LINE}`,
                  fontSize: 22,
                }}
              >
                <span style={{ color: MUTED }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await loadFonts() }
  );
}

/** A guide's card: its title, with the guide's section list underneath. */
export async function renderGuideOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <Frame footer="Quick answer · Causes · Costs · When to call a pro">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
          <span style={{ fontSize: 26, letterSpacing: 4, color: "#1d4ed8", textTransform: "uppercase" }}>{eyebrow}</span>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontFamily: "Fraunces",
              fontSize: title.length > 52 ? 64 : 76,
              lineHeight: 1.06,
              letterSpacing: -0.5,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: await loadFonts() }
  );
}

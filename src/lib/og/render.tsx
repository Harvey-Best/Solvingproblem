import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import {
  DIY_VERDICT_META,
  HAZARD_LABEL,
  SEVERITY_META,
  categoryLabel,
  type DiyVerdict,
  type Severity,
} from "@/lib/diagnosis-meta";
import { shortTimeEstimate, type PublicDiagnosis, type ShareCardFormat } from "@/lib/share";
import { SITE, canonicalOrigin } from "@/lib/site";
import { formatUsd } from "@/lib/utils";

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

function Frame({
  children,
  footer,
  cta = "Diagnose my problem",
}: {
  children: React.ReactNode;
  footer: string;
  cta?: string;
}) {
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
          {cta}
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

// ---------------------------------------------------------------------------
// Share cards for a shared diagnosis (/og/share/<shareId>): wide for link
// previews, square for Instagram and stories.
// ---------------------------------------------------------------------------

export const SHARE_CARD_SIZES: Record<ShareCardFormat, { width: number; height: number }> = {
  wide: OG_SIZE,
  square: { width: 1080, height: 1080 },
};

const PRIMARY = "#1d4ed8";
const RED = "#dc2626";

/** SEVERITY_META / DIY_VERDICT_META badge colors, spelled out for Satori (no Tailwind here). */
const SEVERITY_CHIP: Record<Severity, { bg: string; fg: string; border: string }> = {
  cosmetic: { bg: "#dde8fd", fg: "#1e3a8a", border: "#dde8fd" },
  fix_soon: { bg: "#fef3c7", fg: "#78350f", border: "#fcd34d" },
  urgent: { bg: "#ffedd5", fg: "#7c2d12", border: "#fdba74" },
  call_pro_now: { bg: RED, fg: "#ffffff", border: "#b91c1c" },
};

const VERDICT_CHIP: Record<DiyVerdict, { bg: string; image?: string; fg: string }> = {
  diy: { bg: PRIMARY, image: GRAD, fg: "#ffffff" },
  diy_if_handy: { bg: "#f59e0b", fg: "#ffffff" },
  call_pro: { bg: INK, fg: "#f4f2ec" },
};

function WarningIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function Chip({
  children,
  bg,
  image,
  fg,
  border,
  size,
}: {
  children: React.ReactNode;
  bg: string;
  image?: string;
  fg: string;
  border?: string;
  size: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: Math.round(size * 0.35),
        padding: `${Math.round(size * 0.36)}px ${Math.round(size * 0.8)}px`,
        borderRadius: 999,
        backgroundColor: bg,
        // Satori chokes on undefined style values, so only set it when there is one.
        ...(image ? { backgroundImage: image } : {}),
        color: fg,
        border: `2px solid ${border ?? bg}`,
        fontSize: size,
      }}
    >
      {children}
    </div>
  );
}

const formatUsdTo = (low: number, high: number) =>
  Math.round(low) === Math.round(high) ? formatUsd(low) : `${formatUsd(low)} to ${formatUsd(high)}`;

function clampText(text: string, max: number) {
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

function titleSize(title: string, [short, medium, long]: [number, number, number]) {
  return title.length <= 22 ? short : title.length <= 44 ? medium : long;
}

type ShareFact = { label: string; value: string; tone?: "price" | "danger" };

function shareFacts(d: PublicDiagnosis): ShareFact[] {
  const time = shortTimeEstimate(d.time_estimate);
  const facts: ShareFact[] = [
    { label: "Pro price", value: formatUsdTo(d.pro_cost_range.low, d.pro_cost_range.high), tone: "price" },
  ];
  if (d.diy_verdict !== "call_pro" && time) facts.push({ label: "DIY time", value: time });
  if (d.diy_verdict !== "call_pro" && d.parts.count > 0) {
    facts.push({ label: d.parts.count === 1 ? "Part" : "Parts", value: formatUsdTo(d.parts.low, d.parts.high) });
  }
  return facts;
}

function ShareChips({ d, size, hazards = true }: { d: PublicDiagnosis; size: number; hazards?: boolean }) {
  const severity = SEVERITY_CHIP[d.severity];
  const verdict = VERDICT_CHIP[d.diy_verdict];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
      <Chip bg={severity.bg} fg={severity.fg} border={severity.border} size={size}>
        {d.severity === "call_pro_now" && <WarningIcon size={size} color="#ffffff" />}
        <span>{SEVERITY_META[d.severity].label}</span>
      </Chip>
      <Chip bg={verdict.bg} image={verdict.image} fg={verdict.fg} size={size}>
        <span>{DIY_VERDICT_META[d.diy_verdict].label}</span>
      </Chip>
      {(hazards ? d.hazards.slice(0, 2) : []).map((h) => (
        <Chip key={h} bg="#fef2f2" fg="#7f1d1d" border="#fca5a5" size={size}>
          <WarningIcon size={size} color={RED} />
          <span>{HAZARD_LABEL[h]}</span>
        </Chip>
      ))}
    </div>
  );
}

function Eyebrow({ d, size }: { d: PublicDiagnosis; size: number }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 4, color: PRIMARY, textTransform: "uppercase" }}>
      {`${categoryLabel(d.category)} · Diagnosed from a photo`}
    </span>
  );
}

function ShareCardWide({ d }: { d: PublicDiagnosis }) {
  const title = clampText(d.title, 80);
  return (
    <Frame footer={SITE.tagline}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
        <Eyebrow d={d} size={22} />
        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontFamily: "Fraunces",
            fontSize: titleSize(title, [84, 68, 56]),
            lineHeight: 1.04,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 24 }}>
          <ShareChips d={d} size={25} />
        </div>
        <div style={{ display: "flex", gap: 56, marginTop: 28 }}>
          {shareFacts(d).map((f) => (
            <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 17, letterSpacing: 3, color: MUTED, textTransform: "uppercase" }}>{f.label}</span>
              <span style={{ fontFamily: "Fraunces", fontSize: 42, color: f.tone === "price" ? PRIMARY : INK }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function ShareCardSquare({ d }: { d: PublicDiagnosis }) {
  const title = clampText(d.title, 80);
  const rows: ShareFact[] = [
    ...shareFacts(d),
    ...(d.hazards.length > 0
      ? [{ label: "Safety", value: d.hazards.map((h) => HAZARD_LABEL[h]).join(", "), tone: "danger" as const }]
      : []),
  ];
  return (
    <Frame footer="Know what's wrong in 30 seconds." cta={`Try it free · ${new URL(canonicalOrigin()).host}`}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
        <Eyebrow d={d} size={24} />
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontFamily: "Fraunces",
            fontSize: titleSize(title, [100, 84, 68]),
            lineHeight: 1.04,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 30 }}>
          <ShareChips d={d} size={28} hazards={false} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            padding: "10px 34px",
            backgroundColor: "#fffefa",
            border: `2px solid ${LINE}`,
            borderRadius: 28,
            boxShadow: "0 24px 40px -24px rgba(14,27,44,0.45)",
          }}
        >
          {rows.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 24,
                padding: "20px 0",
                borderBottom: i === rows.length - 1 ? "none" : `2px dashed ${LINE}`,
              }}
            >
              <span style={{ fontSize: 26, color: MUTED }}>{row.label}</span>
              <span
                style={{
                  fontFamily: row.tone === "danger" ? "Geist" : "Fraunces",
                  fontSize: row.tone === "danger" ? 30 : 44,
                  color: row.tone === "price" ? PRIMARY : row.tone === "danger" ? "#b91c1c" : INK,
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** A shared diagnosis as a PNG: "wide" 1200x630 for link previews, "square" 1080x1080 for stories. */
export async function renderShareCardImage(
  d: PublicDiagnosis,
  format: ShareCardFormat,
  init?: { headers?: Record<string, string> }
) {
  return new ImageResponse(format === "square" ? <ShareCardSquare d={d} /> : <ShareCardWide d={d} />, {
    ...SHARE_CARD_SIZES[format],
    fonts: await loadFonts(),
    headers: init?.headers,
  });
}

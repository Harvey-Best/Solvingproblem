import type { HouseCallTheme } from "@/components/landing/house-call";

export const GREEN: HouseCallTheme = {
  slug: "green",
  colors: {
    bg: "#F4F1E9",
    ink: "#13201A",
    muted: "#53615A",
    line: "#DAD6C9",
    accent: "#0C7D4C",
    accentInk: "#FFFFFF",
    accentSoft: "#D6EEDF",
    illSoft: "#BFE3CC",
    onDark: "#8EDDB0",
  },
};

export const GREEN_GRADIENT: HouseCallTheme = {
  ...GREEN,
  slug: "green-gradient",
  gradient: {
    from: "#1F8A3B",
    via: "#0C7D4C",
    to: "#0B7F7A",
    softFrom: "#DDF1D8",
    softTo: "#D2EEEA",
    glowA: "#86EFAC",
    glowB: "#5EEAD4",
  },
};

export const PURPLE: HouseCallTheme = {
  slug: "purple",
  colors: {
    bg: "#F5F2EC",
    ink: "#1C1631",
    muted: "#5F5871",
    line: "#DDD6D9",
    accent: "#6D28D9",
    accentInk: "#FFFFFF",
    accentSoft: "#ECE4FC",
    illSoft: "#D9CCFA",
    onDark: "#C4B5FD",
  },
  gradient: {
    from: "#7C3AED",
    via: "#5B45E6",
    to: "#2563EB",
    softFrom: "#EDE3FF",
    softTo: "#DCE7FF",
    glowA: "#C4B5FD",
    glowB: "#93C5FD",
  },
};

export const BLUE: HouseCallTheme = {
  slug: "blue",
  colors: {
    bg: "#F4F2EC",
    ink: "#0E1B2C",
    muted: "#51607A",
    line: "#D7D7D3",
    accent: "#1D4ED8",
    accentInk: "#FFFFFF",
    accentSoft: "#DDE8FD",
    illSoft: "#C6D9FC",
    onDark: "#93C5FD",
  },
  gradient: {
    from: "#1D4ED8",
    via: "#0369A1",
    to: "#0E7490",
    softFrom: "#DCE7FF",
    softTo: "#D3F1F6",
    glowA: "#93C5FD",
    glowB: "#67E8F9",
  },
};

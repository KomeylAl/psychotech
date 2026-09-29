const DEFAULT_BRAND = "#2f7cc4";
const DEFAULT_ACCENT = "#c96b32";

export const DEFAULT_TEXT_COLORS = {
  textColor: "#1c232c",
  headingColor: "#141a22",
  mutedColor: "#3f4b58",
  hintColor: "#5a6570",
  placeholderColor: "#6b7682",
  textColorDark: "#ede8e1",
  headingColorDark: "#f5f1ea",
  mutedColorDark: "#c9c2b8",
  hintColorDark: "#b8b0a6",
  placeholderColorDark: "#a39b91",
} as const;

export type ThemeTextColors = {
  textColor?: string | null;
  headingColor?: string | null;
  mutedColor?: string | null;
  hintColor?: string | null;
  placeholderColor?: string | null;
  textColorDark?: string | null;
  headingColorDark?: string | null;
  mutedColorDark?: string | null;
  hintColorDark?: string | null;
  placeholderColorDark?: string | null;
};

export type ThemeColorsInput = ThemeTextColors & {
  brandColor?: string | null;
  accentColor?: string | null;
};

export function normalizeHex(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const raw = value.trim();
  const withHash = raw.startsWith("#") ? raw : `#${raw}`;
  if (!/^#[0-9A-Fa-f]{6}$/.test(withHash)) return fallback;
  return withHash.toLowerCase();
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

function mix(hex: string, target: string, amount: number) {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return rgbToHex(
    a.r + (b.r - a.r) * amount,
    a.g + (b.g - a.g) * amount,
    a.b + (b.b - a.b) * amount,
  );
}

function lighten(hex: string, amount: number) {
  return mix(hex, "#ffffff", amount);
}

function darken(hex: string, amount: number) {
  return mix(hex, "#000000", amount);
}

function contrastInk(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#0e141a" : "#f7fbff";
}

export function buildThemeCss(input: ThemeColorsInput = {}) {
  const brand = normalizeHex(input.brandColor, DEFAULT_BRAND);
  const accent = normalizeHex(input.accentColor, DEFAULT_ACCENT);

  const light = {
    brand,
    brandBright: lighten(brand, 0.14),
    brandDeep: darken(brand, 0.18),
    accent,
    accentBright: lighten(accent, 0.14),
    onBrand: contrastInk(brand),
    onAccent: contrastInk(accent),
    ink: normalizeHex(input.textColor, DEFAULT_TEXT_COLORS.textColor),
    heading: normalizeHex(input.headingColor, DEFAULT_TEXT_COLORS.headingColor),
    muted: normalizeHex(input.mutedColor, DEFAULT_TEXT_COLORS.mutedColor),
    hint: normalizeHex(input.hintColor, DEFAULT_TEXT_COLORS.hintColor),
    placeholder: normalizeHex(input.placeholderColor, DEFAULT_TEXT_COLORS.placeholderColor),
  };

  const dark = {
    brand: lighten(brand, 0.22),
    brandBright: lighten(brand, 0.36),
    brandDeep: lighten(brand, 0.08),
    accent: lighten(accent, 0.18),
    accentBright: lighten(accent, 0.3),
    onBrand: contrastInk(lighten(brand, 0.22)),
    onAccent: contrastInk(lighten(accent, 0.18)),
    ink: normalizeHex(input.textColorDark, DEFAULT_TEXT_COLORS.textColorDark),
    heading: normalizeHex(input.headingColorDark, DEFAULT_TEXT_COLORS.headingColorDark),
    muted: normalizeHex(input.mutedColorDark, DEFAULT_TEXT_COLORS.mutedColorDark),
    hint: normalizeHex(input.hintColorDark, DEFAULT_TEXT_COLORS.hintColorDark),
    placeholder: normalizeHex(
      input.placeholderColorDark,
      DEFAULT_TEXT_COLORS.placeholderColorDark,
    ),
  };

  return `:root{
  --brand:${light.brand};
  --brand-bright:${light.brandBright};
  --brand-deep:${light.brandDeep};
  --accent:${light.accent};
  --accent-bright:${light.accentBright};
  --on-brand:${light.onBrand};
  --on-accent:${light.onAccent};
  --ink:${light.ink};
  --heading:${light.heading};
  --muted:${light.muted};
  --hint:${light.hint};
  --placeholder:${light.placeholder};
  --foreground:${light.ink};
  --muted-foreground:${light.muted};
  --card-foreground:${light.ink};
  --popover-foreground:${light.ink};
  --secondary-foreground:${light.ink};
  --sidebar-foreground:${light.ink};
}
html.dark{
  --brand:${dark.brand};
  --brand-bright:${dark.brandBright};
  --brand-deep:${dark.brandDeep};
  --accent:${dark.accent};
  --accent-bright:${dark.accentBright};
  --on-brand:${dark.onBrand};
  --on-accent:${dark.onAccent};
  --ink:${dark.ink};
  --heading:${dark.heading};
  --muted:${dark.muted};
  --hint:${dark.hint};
  --placeholder:${dark.placeholder};
  --foreground:${dark.ink};
  --muted-foreground:${dark.muted};
  --card-foreground:${dark.ink};
  --popover-foreground:${dark.ink};
  --secondary-foreground:${dark.ink};
  --sidebar-foreground:${dark.ink};
}`;
}

export { DEFAULT_BRAND, DEFAULT_ACCENT };

const DEFAULT_BRAND = "#2f7cc4";
const DEFAULT_ACCENT = "#c96b32";

export const DEFAULT_TEXT_COLORS = {
  textColor: "#1c232c",
  headingColor: "#0f1419",
  mutedColor: "#2f3a46",
  navColor: "#2a3440",
  labelColor: "#3a4552",
  hintColor: "#4a5563",
  placeholderColor: "#5c6775",
  eyebrowColor: "#c96b32",
  textColorDark: "#f0ebe4",
  headingColorDark: "#faf7f2",
  mutedColorDark: "#d2cbc2",
  navColorDark: "#ddd6cd",
  labelColorDark: "#cfc8bf",
  hintColorDark: "#c4bdb4",
  placeholderColorDark: "#b5aea4",
  eyebrowColorDark: "#e08a4a",
} as const;

export type ThemeTextColors = {
  [K in keyof typeof DEFAULT_TEXT_COLORS]?: string | null;
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

function pick(
  input: ThemeTextColors,
  key: keyof typeof DEFAULT_TEXT_COLORS,
) {
  return normalizeHex(input[key], DEFAULT_TEXT_COLORS[key]);
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
    ink: pick(input, "textColor"),
    heading: pick(input, "headingColor"),
    muted: pick(input, "mutedColor"),
    nav: pick(input, "navColor"),
    label: pick(input, "labelColor"),
    hint: pick(input, "hintColor"),
    placeholder: pick(input, "placeholderColor"),
    eyebrow: pick(input, "eyebrowColor"),
  };

  const dark = {
    brand: lighten(brand, 0.22),
    brandBright: lighten(brand, 0.36),
    brandDeep: lighten(brand, 0.08),
    accent: lighten(accent, 0.18),
    accentBright: lighten(accent, 0.3),
    onBrand: contrastInk(lighten(brand, 0.22)),
    onAccent: contrastInk(lighten(accent, 0.18)),
    ink: pick(input, "textColorDark"),
    heading: pick(input, "headingColorDark"),
    muted: pick(input, "mutedColorDark"),
    nav: pick(input, "navColorDark"),
    label: pick(input, "labelColorDark"),
    hint: pick(input, "hintColorDark"),
    placeholder: pick(input, "placeholderColorDark"),
    eyebrow: pick(input, "eyebrowColorDark"),
  };

  const block = (t: typeof light) => `
  --brand:${t.brand};
  --brand-bright:${t.brandBright};
  --brand-deep:${t.brandDeep};
  --accent:${t.accent};
  --accent-bright:${t.accentBright};
  --on-brand:${t.onBrand};
  --on-accent:${t.onAccent};
  --ink:${t.ink};
  --heading:${t.heading};
  --muted:${t.muted};
  --nav:${t.nav};
  --label:${t.label};
  --hint:${t.hint};
  --placeholder:${t.placeholder};
  --eyebrow:${t.eyebrow};
  --foreground:${t.ink};
  --muted-foreground:${t.muted};
  --card-foreground:${t.ink};
  --popover-foreground:${t.ink};
  --secondary-foreground:${t.ink};
  --sidebar-foreground:${t.ink};
`;

  return `:root{${block(light)}}
html.dark{${block(dark)}}`;
}

export { DEFAULT_BRAND, DEFAULT_ACCENT };

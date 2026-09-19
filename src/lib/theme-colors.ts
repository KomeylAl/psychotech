const DEFAULT_BRAND = "#2f7cc4";
const DEFAULT_ACCENT = "#c96b32";

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

export function buildThemeCss(
  brandInput?: string | null,
  accentInput?: string | null,
) {
  const brand = normalizeHex(brandInput, DEFAULT_BRAND);
  const accent = normalizeHex(accentInput, DEFAULT_ACCENT);

  const light = {
    brand,
    brandBright: lighten(brand, 0.14),
    brandDeep: darken(brand, 0.18),
    accent,
    accentBright: lighten(accent, 0.14),
    onBrand: contrastInk(brand),
    onAccent: contrastInk(accent),
  };

  const dark = {
    brand: lighten(brand, 0.22),
    brandBright: lighten(brand, 0.36),
    brandDeep: lighten(brand, 0.08),
    accent: lighten(accent, 0.18),
    accentBright: lighten(accent, 0.3),
    onBrand: contrastInk(lighten(brand, 0.22)),
    onAccent: contrastInk(lighten(accent, 0.18)),
  };

  return `:root{
  --brand:${light.brand};
  --brand-bright:${light.brandBright};
  --brand-deep:${light.brandDeep};
  --accent:${light.accent};
  --accent-bright:${light.accentBright};
  --on-brand:${light.onBrand};
  --on-accent:${light.onAccent};
}
html.dark{
  --brand:${dark.brand};
  --brand-bright:${dark.brandBright};
  --brand-deep:${dark.brandDeep};
  --accent:${dark.accent};
  --accent-bright:${dark.accentBright};
  --on-brand:${dark.onBrand};
  --on-accent:${dark.onAccent};
}`;
}

export { DEFAULT_BRAND, DEFAULT_ACCENT };

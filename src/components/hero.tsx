import type { Keyword, SiteSettings } from "@/generated/prisma/client";

function MindField() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <div className="grid-veil rounded-full" />
      <svg viewBox="0 0 400 400" className="relative z-10 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-bright)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="168" fill="url(#glow)" className="pulse-ring" />
        <circle cx="200" cy="200" r="148" fill="none" stroke="var(--brand)" strokeOpacity="0.2" />
        <circle cx="200" cy="200" r="108" fill="none" stroke="var(--sage)" strokeOpacity="0.35" />
        <circle cx="200" cy="200" r="68" fill="none" stroke="url(#ring)" strokeOpacity="0.8" />
        <g className="orbit">
          <circle cx="200" cy="52" r="5" fill="var(--accent)" />
          <circle cx="348" cy="200" r="3.5" fill="var(--brand)" />
        </g>
        <g className="orbit-rev">
          <circle cx="64" cy="248" r="4" fill="var(--sage-bright)" />
          <circle cx="300" cy="92" r="3" fill="var(--accent-bright)" />
        </g>
        <path
          d="M86 206 H130 L148 164 L172 248 L196 188 L214 206 H314"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="wave-draw"
        />
        <path
          d="M200 128 v86 M168 146 c0 42 14.5 68 32 68s32-26 32-68"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="166" cy="248" r="6" fill="var(--accent)" />
        <circle cx="234" cy="248" r="6" fill="var(--brand)" />
        <path d="M166 248 h68" stroke="var(--sage)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="200" cy="200" r="3" fill="#fff" />
      </svg>
      <div className="float-y absolute start-[8%] top-[14%] rounded-full border border-line bg-canvas-soft/80 px-3 py-1.5 text-xs text-sage backdrop-blur">
        Cognition
      </div>
      <div
        className="float-y absolute end-[6%] bottom-[18%] rounded-full border border-line bg-canvas-soft/80 px-3 py-1.5 text-xs text-accent backdrop-blur"
        style={{ animationDelay: "1.2s" }}
      >
        Computation
      </div>
    </div>
  );
}

type HeroProps = {
  settings: SiteSettings;
  keywords: Keyword[];
};

export function Hero({ settings, keywords }: HeroProps) {
  const words = keywords.map((item) => item.word);

  return (
    <section id="top" className="relative overflow-hidden px-5 pt-10 pb-20 sm:px-8 sm:pt-16 lg:pt-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-canvas-soft/70 px-3 py-1.5 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-brand" />
            <span className="font-display tracking-[0.18em] uppercase">{settings.tagline}</span>
          </p>
          <h1 className="max-w-xl text-[2.15rem] leading-[1.25] font-semibold tracking-tight sm:text-5xl lg:text-[3.35rem] lg:leading-[1.2]">
            {settings.heroTitleLine1}
            <span className="mt-1 block text-brand-bright">{settings.heroTitleHighlight}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-muted sm:text-lg">
            {settings.heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#products" className="btn-primary">
              {settings.heroCtaPrimary}
              <span aria-hidden>←</span>
            </a>
            <a href="#contact" className="btn-ghost">
              {settings.heroCtaSecondary}
            </a>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-8">
            <div>
              <dt className="text-xs text-muted">{settings.heroStat1Label}</dt>
              <dd className="mt-1 text-sm font-medium">{settings.heroStat1Value}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{settings.heroStat2Label}</dt>
              <dd className="mt-1 text-sm font-medium">{settings.heroStat2Value}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{settings.heroStat3Label}</dt>
              <dd className="mt-1 text-sm font-medium">{settings.heroStat3Value}</dd>
            </div>
          </dl>
        </div>
        <MindField />
      </div>
      {words.length > 0 ? (
        <div className="mt-16 overflow-hidden border-y border-line py-4">
          <div className="marquee-track gap-10 px-6 text-sm text-muted" aria-hidden>
            {[...words, ...words].map((word, index) => (
              <span key={`${word}-${index}`} className="flex items-center gap-10">
                <span>{word}</span>
                <span className={index % 2 === 0 ? "text-accent" : "text-sage"} aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

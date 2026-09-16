type LogoProps = {
  logoUrl?: string | null;
  name?: string;
  nameFa?: string;
};

export function Logo({
  logoUrl,
  name = "PSYCHO TECH",
  nameFa = "سایکو تک",
}: LogoProps) {
  return (
    <a
      href="#top"
      className="group flex items-center gap-2.5 text-ink no-underline"
      aria-label={`${nameFa}، بازگشت به بالا`}
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-line bg-canvas-soft">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="size-full object-contain p-1" />
        ) : (
          <svg viewBox="0 0 32 32" className="size-6" aria-hidden>
            <path
              d="M16 6.5v12.2M10.6 9c0 4.8 2.4 7.8 5.4 7.8s5.4-3 5.4-7.8"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="1.85"
              strokeLinecap="round"
            />
            <circle cx="10.8" cy="23.2" r="1.5" fill="var(--accent)" />
            <circle cx="21.2" cy="23.2" r="1.5" fill="var(--accent)" />
            <path
              d="M10.8 23.2h10.4"
              stroke="var(--accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className="leading-tight">
        <span className="font-display block text-[0.95rem] font-semibold tracking-[0.08em]">
          {name}
        </span>
        <span className="block text-[0.7rem] text-muted">{nameFa}</span>
      </span>
    </a>
  );
}

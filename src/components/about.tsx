import { Reveal } from "@/components/reveal";
import type { SiteSettings, ValueItem } from "@/generated/prisma/client";

type AboutProps = {
  settings: SiteSettings;
  values: ValueItem[];
};

export function About({ settings, values }: AboutProps) {
  return (
    <section id="about" className="scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <p className="eyebrow">{settings.aboutEyebrow}</p>
          <h2 className="mt-3 max-w-sm text-3xl font-semibold tracking-tight sm:text-4xl">
            {settings.aboutTitle}
          </h2>
        </Reveal>
        <div className="space-y-6 text-base leading-8 text-muted">
          <Reveal delay={80}>
            <p>{settings.aboutParagraph1}</p>
          </Reveal>
          <Reveal delay={140}>
            <p>{settings.aboutParagraph2}</p>
          </Reveal>
        </div>
      </div>
      <div className="mx-auto mt-16 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value, index) => {
          const tones = ["text-brand", "text-accent", "text-sage", "text-accent-bright"] as const;
          return (
            <Reveal key={value.id} delay={index * 80}>
              <article className="glass h-full rounded-3xl p-6">
                <span className={`font-display text-xs ${tones[index] ?? "text-accent"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{value.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

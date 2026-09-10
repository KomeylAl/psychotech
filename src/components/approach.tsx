import { Reveal } from "@/components/reveal";
import type { ApproachStep, SiteSettings } from "@/generated/prisma/client";

type ApproachProps = {
  settings: SiteSettings;
  steps: ApproachStep[];
};

export function Approach({ settings, steps }: ApproachProps) {
  return (
    <section id="approach" className="scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{settings.approachEyebrow}</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {settings.approachTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-muted leading-8">
            {settings.approachDescription}
          </p>
        </Reveal>
        <ol className="mt-14 divide-y divide-line border-y border-line">
          {steps.map((step, index) => (
            <li key={step.id}>
              <Reveal delay={index * 70}>
                <div className="grid gap-3 py-8 md:grid-cols-[7rem_1fr_1.4fr] md:items-baseline">
                  <span className="font-display text-sm tracking-[0.18em] text-accent">
                    {step.indexLabel}
                  </span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted leading-8">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

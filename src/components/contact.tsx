import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import type { SiteSettings } from "@/generated/prisma/client";

export function Contact({ settings }: { settings: SiteSettings }) {
  return (
    <section id="contact" className="scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <p className="eyebrow">{settings.contactEyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {settings.contactTitle}
          </h2>
          <p className="mt-4 leading-8 text-muted">{settings.contactDescription}</p>
          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="text-muted">ایمیل</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${settings.email}`}
                  className="font-display text-brand"
                  dir="ltr"
                >
                  {settings.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">موقعیت</dt>
              <dd className="mt-1">{settings.location}</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={100}>
          <ContactForm
            successTitle={settings.contactSuccessTitle}
            successText={settings.contactSuccessText}
          />
        </Reveal>
      </div>
    </section>
  );
}

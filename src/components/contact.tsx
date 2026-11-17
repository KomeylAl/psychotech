import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { SiteSettings } from "@/generated/prisma/client";

export function Contact({
  settings,
  locale,
  asPage = false,
}: {
  settings: SiteSettings;
  locale: Locale;
  asPage?: boolean;
}) {
  const Heading = asPage ? "h1" : "h2";
  const dict = getDictionary(locale);

  return (
    <section id="contact" className={asPage ? "px-5 pt-10 pb-24 sm:px-8 sm:pt-16" : "scroll-mt-24 px-5 py-24 sm:px-8"}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal immediate={asPage}>
          <p className="eyebrow">{settings.contactEyebrow}</p>
          <Heading className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {settings.contactTitle}
          </Heading>
          <p className="mt-4 leading-8 text-muted">{settings.contactDescription}</p>
          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="text-muted">{dict.contact.email}</dt>
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
              <dt className="text-muted">{dict.contact.location}</dt>
              <dd className="mt-1">{settings.location}</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={100}>
          <ContactForm
            locale={locale}
            successTitle={settings.contactSuccessTitle}
            successText={settings.contactSuccessText}
          />
        </Reveal>
      </div>
    </section>
  );
}

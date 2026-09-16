import { Reveal } from "@/components/reveal";
import type { SiteSettings, TeamMember } from "@/generated/prisma/client";

function Avatar({
  initials,
  imageUrl,
  index,
}: {
  initials: string;
  imageUrl?: string | null;
  index: number;
}) {
  const shifts = ["translate-x-1", "-translate-x-1", "translate-y-1", "-translate-y-0.5"];
  const glow = index % 2 === 0 ? "var(--brand)" : "var(--accent)";
  const tone = index % 2 === 0 ? "text-brand" : "text-accent";

  return (
    <div
      className="relative mb-6 grid aspect-[5/4] place-items-center overflow-hidden rounded-2xl border border-line"
      style={{
        background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${glow} 28%, transparent), transparent 55%), linear-gradient(180deg, var(--canvas-soft), var(--canvas))`,
      }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <>
          <span className={`font-display text-5xl font-semibold ${tone} ${shifts[index] ?? ""}`}>
            {initials}
          </span>
          <span
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `linear-gradient(to left, color-mix(in srgb, ${glow} 18%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, ${glow} 18%, transparent) 1px, transparent 1px)`,
              backgroundSize: "22px 22px",
            }}
          />
        </>
      )}
    </div>
  );
}

type TeamProps = {
  settings: SiteSettings;
  team: TeamMember[];
};

export function Team({ settings, team }: TeamProps) {
  return (
    <section id="team" className="scroll-mt-24 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{settings.teamEyebrow}</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {settings.teamTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-muted leading-8">{settings.teamDescription}</p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <Reveal key={member.id} delay={index * 80}>
              <article className="glass h-full rounded-3xl p-5">
                <Avatar initials={member.initials} imageUrl={member.imageUrl} index={index} />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className={`mt-1 text-sm ${index % 2 === 0 ? "text-brand" : "text-accent"}`}>
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">{member.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

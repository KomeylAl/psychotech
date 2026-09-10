"use client";

import { useEffect, useMemo, useState } from "react";
import type { NavLink } from "@/components/header";

export function SideRail({ nav }: { nav: NavLink[] }) {
  const items = useMemo(() => [{ href: "#top", label: "آغاز" }, ...nav], [nav]);
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const ids = items.map((item) => item.href.slice(1));
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      className="pointer-events-none fixed end-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      aria-label="موقعیت بخش‌ها"
    >
      <ol className="pointer-events-auto flex flex-col items-center gap-3">
        {items.map((item) => {
          const isActive = active === item.href;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                title={item.label}
                className="group relative grid size-4 place-items-center"
              >
                <span
                  className={`block rounded-full transition-all ${
                    isActive
                      ? "size-2.5 bg-brand shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_25%,transparent)]"
                      : "size-1.5 bg-muted/70 group-hover:bg-ink"
                  }`}
                />
                <span className="pointer-events-none absolute end-full me-3 hidden rounded-full border border-line bg-canvas-soft px-2 py-1 text-[0.7rem] text-muted whitespace-nowrap group-hover:block">
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

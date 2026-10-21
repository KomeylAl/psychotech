"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealVariant = "up" | "fade" | "scale";

const pendingClass: Record<RevealVariant, string> = {
  up: "reveal-pending",
  fade: "reveal-fade-pending",
  scale: "reveal-scale-pending",
};

const visibleClass: Record<RevealVariant, string> = {
  up: "reveal",
  fade: "reveal-fade",
  scale: "reveal-scale",
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    const fallback = window.setTimeout(() => setVisible(true), 1400);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  if (immediate) {
    return (
      <div className={`rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${visible ? visibleClass[variant] : pendingClass[variant]} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

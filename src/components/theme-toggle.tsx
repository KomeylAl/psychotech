"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
      setReady(true);
    };
    sync();
    window.addEventListener("pt-theme", sync);
    return () => window.removeEventListener("pt-theme", sync);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("pt-theme", next);
    window.dispatchEvent(new Event("pt-theme"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`grid size-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand/50 hover:bg-brand/10 ${className}`}
      aria-label={theme === "dark" ? "رفتن به تم روشن" : "رفتن به تم تیره"}
      title={theme === "dark" ? "تم روشن" : "تم تیره"}
    >
      {ready && theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1 6 18M18 6l1.1-1.1"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
          <path
            d="M16.5 13.2A6.4 6.4 0 0 1 10.8 7 6.2 6.2 0 1 0 16.5 13.2Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

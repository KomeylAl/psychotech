"use client";

import { useEffect, useState } from "react";
import { recordPostView } from "@/app/[locale]/blog/view-action";
import { formatViewCount } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const inflight = new Map<string, Promise<number | null>>();

function loadView(postId: string) {
  const pending = inflight.get(postId);
  if (pending) return pending;
  const request = recordPostView(postId);
  inflight.set(postId, request);
  return request;
}

export function PostViews({
  postId,
  initialCount,
  track = false,
  locale = "fa",
}: {
  postId: string;
  initialCount: number;
  track?: boolean;
  locale?: Locale;
}) {
  const [count, setCount] = useState(initialCount);
  const dict = getDictionary(locale);

  useEffect(() => {
    if (!track) return;
    let active = true;
    loadView(postId).then((next) => {
      if (active && typeof next === "number") setCount(next);
    });
    return () => {
      active = false;
    };
  }, [postId, track]);

  return <span>{dict.viewCount(formatViewCount(count, locale))}</span>;
}

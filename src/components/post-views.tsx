"use client";

import { useEffect, useState } from "react";
import { recordPostView } from "@/app/blog/view-action";
import { formatViewCount } from "@/lib/blog";

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
}: {
  postId: string;
  initialCount: number;
  track?: boolean;
}) {
  const [count, setCount] = useState(initialCount);

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

  return <span>{formatViewCount(count)} بازدید</span>;
}

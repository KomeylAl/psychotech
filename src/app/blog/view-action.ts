"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const VIEW_COOKIE_HOURS = 6;

export async function recordPostView(postId: string): Promise<number | null> {
  if (!postId || postId.length > 64) return null;

  const post = await prisma.blogPost.findFirst({
    where: {
      id: postId,
      status: "published",
      publishedAt: { lte: new Date() },
    },
    select: { id: true, viewCount: true },
  });
  if (!post) return null;

  const jar = await cookies();
  const key = `pt_view_${post.id}`;
  if (jar.get(key)) return post.viewCount;

  const updated = await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
    select: { viewCount: true },
  });

  jar.set(key, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: VIEW_COOKIE_HOURS * 60 * 60,
  });

  return updated.viewCount;
}

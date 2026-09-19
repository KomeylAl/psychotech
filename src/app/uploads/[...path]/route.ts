import { readFile, stat } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { resolveUploadPath } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

type RouteParams = { path: string[] };

export async function GET(
  _request: Request,
  context: { params: Promise<RouteParams> },
) {
  const { path: segments } = await context.params;
  const relative = segments.join("/");
  const absolute = resolveUploadPath(relative);

  if (!absolute) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const info = await stat(absolute);
    if (!info.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const data = await readFile(absolute);
    const ext = path.extname(absolute).toLowerCase();
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}

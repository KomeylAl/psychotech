import { randomBytes } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/gif",
]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/gif": "gif",
};

export function uploadsRoot() {
  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR);
  }
  // Prefer Docker/host persistence folder; fall back to public for local dev.
  return path.join(process.cwd(), "storage", "uploads");
}

export function resolveUploadPath(relativePath: string) {
  const normalized = relativePath.replace(/^[/\\]+/, "").replace(/\\/g, "/");
  if (!normalized || normalized.includes("..")) {
    return null;
  }

  const root = uploadsRoot();
  const absolute = path.resolve(root, normalized);
  const relative = path.relative(root, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return absolute;
}

export function isUploadUrl(url: string | null | undefined): url is string {
  return Boolean(url && url.startsWith("/uploads/"));
}

export async function deleteUpload(url: string | null | undefined) {
  if (!isUploadUrl(url)) return;
  const relative = url.replace(/^\/uploads\//, "");
  const absolute = resolveUploadPath(relative);
  if (!absolute) return;
  try {
    await unlink(absolute);
  } catch {
    // File may already be gone
  }
}

export async function saveUpload(
  file: File | null | undefined,
  folder: "brand" | "products" | "team",
): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;

  if (file.size > MAX_BYTES) {
    throw new Error("حجم تصویر نباید بیشتر از ۲ مگابایت باشد.");
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED_TYPES.has(type)) {
    throw new Error("فرمت تصویر مجاز نیست. PNG، JPG، WEBP، SVG یا ICO آپلود کنید.");
  }

  const ext = EXT_BY_TYPE[type] ?? "bin";
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const dir = path.join(uploadsRoot(), folder);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);

  return `/uploads/${folder}/${name}`;
}

export function fileFromForm(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}

export async function resolveImageUpdate(options: {
  formData: FormData;
  fileKey: string;
  removeKey: string;
  currentUrl: string | null | undefined;
  folder: "brand" | "products" | "team";
}): Promise<string | null | undefined> {
  const { formData, fileKey, removeKey, currentUrl, folder } = options;
  const remove = strFlag(formData, removeKey);
  const uploaded = await saveUpload(fileFromForm(formData, fileKey), folder);

  if (uploaded) {
    if (currentUrl && currentUrl !== uploaded) {
      await deleteUpload(currentUrl);
    }
    return uploaded;
  }

  if (remove) {
    await deleteUpload(currentUrl);
    return null;
  }

  return undefined;
}

function strFlag(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "1" || value === "on" || value === "true";
}

import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

/** Renders TipTap HTML as-is; falls back to Markdown for older posts. */
export function renderPostContent(source: string): string {
  const value = source?.trim() || "";
  if (!value) return "";

  if (value.startsWith("<")) {
    return value;
  }

  return marked.parse(value, { async: false }) as string;
}

export function renderMarkdown(source: string): string {
  return renderPostContent(source);
}

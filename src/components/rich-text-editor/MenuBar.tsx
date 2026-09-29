"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
      label: "عنوان ۱",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
      label: "عنوان ۲",
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
      label: "عنوان ۳",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
      label: "ضخیم",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
      label: "ایتالیک",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
      label: "خط‌خورده",
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
      label: "راست‌چین",
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
      label: "وسط‌چین",
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
      label: "چپ‌چین",
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
      label: "لیست",
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
      label: "لیست عددی",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
      label: "هایلایت",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 rounded-xl border border-line bg-canvas-soft/80 p-1.5",
      )}
    >
      {options.map((option) => (
        <Toggle
          key={option.label}
          type="button"
          size="sm"
          variant="outline"
          pressed={option.pressed}
          onPressedChange={() => option.onClick()}
          aria-label={option.label}
          title={option.label}
          className="data-[pressed]:border-brand/40 data-[pressed]:bg-brand/15 data-[pressed]:text-brand"
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}

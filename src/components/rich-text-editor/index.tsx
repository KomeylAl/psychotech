"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import MenuBar from "./MenuBar";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc me-5",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal me-5",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose-blog min-h-[220px] rounded-xl border border-line bg-canvas px-4 py-3 outline-none focus-visible:border-brand/60 focus-visible:ring-4 focus-visible:ring-brand/15",
          "[&_mark]:rounded-sm [&_mark]:bg-accent/25 [&_mark]:px-0.5",
        ),
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  return (
    <div className={cn("space-y-2", className)}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Label } from "@/components/ui/label";

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-56 animate-pulse rounded-xl border border-line bg-canvas-soft" />
  ),
});

type RichTextFieldProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  hint?: string;
};

export function RichTextField({
  name,
  label = "محتوا",
  defaultValue = "",
  hint,
}: RichTextFieldProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <input type="hidden" id={name} name={name} value={value} />
      <RichTextEditor content={defaultValue} onChange={setValue} />
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

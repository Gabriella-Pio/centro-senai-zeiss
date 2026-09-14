"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@cem/ui";
import "./copy-value-btn.css";

const icon = { size: 16, strokeWidth: 1.75, "aria-hidden": true as const };

interface CopyValueButtonProps {
  value: string;
  ariaLabel: string;
  copiedAriaLabel: string;
  className?: string;
}

async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  document.body.removeChild(field);
}

export function CopyValueButton({
  value,
  ariaLabel,
  copiedAriaLabel,
  className,
}: CopyValueButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await writeClipboard(value);
      setCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className={cn("copy-value-btn", className)}
      onClick={handleCopy}
      aria-label={copied ? copiedAriaLabel : ariaLabel}
      aria-live="polite"
    >
      {copied ? <Check {...icon} /> : <Copy {...icon} />}
    </button>
  );
}

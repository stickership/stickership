"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/icons";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = location.href;
    if (navigator.share) return navigator.share({ title, url }).catch(() => {});
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button type="button" onClick={share} aria-label="Share" className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-brand-yellow">
      <ShareIcon />
      {copied && <span className="absolute -bottom-7 whitespace-nowrap rounded bg-black px-2 py-0.5 text-[11px] text-white">Link copied</span>}
    </button>
  );
}

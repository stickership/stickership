"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

function remaining() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 0);
  const s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  return [0, Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
}

const labels = ["Days", "Hours", "Mins", "Secs"];

export function AnnouncementBar() {
  const [t, setT] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const tick = () => setT(remaining());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-[90] bg-pop text-ink">
      <div className="mx-auto flex h-10 max-w-[1600px] items-center justify-center gap-3 px-4 font-mono text-[12px] font-bold uppercase tracking-wide md:h-11 md:text-sm">
        <span>
          Every sticker ₹10 <span className="hidden sm:inline">· drop ends in</span>
        </span>
        <span className="flex items-center gap-1" aria-label={`${t[1]} hours ${t[2]} minutes ${t[3]} seconds left`}>
          {t.slice(1).map((v, i) => (
            <span key={labels[i + 1]} className="rounded-md bg-ink px-1.5 py-0.5 tabular-nums text-slime">
              {pad(v)}
              <span className="text-[9px] text-white/60">{labels[i + 1][0].toLowerCase()}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

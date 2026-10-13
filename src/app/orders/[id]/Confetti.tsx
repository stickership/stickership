"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = ["#ff3d8b", "#c8f31d", "#7cc4ff", "#ffffff", "#15111c"];

export function Confetti({ id }: { id: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const c = ref.current!;
    const key = `confetti:${id}`;
    try {
      if (sessionStorage.getItem(key) || matchMedia("(prefers-reduced-motion: reduce)").matches) return void (c.style.display = "none");
      sessionStorage.setItem(key, "1");
    } catch {}
    const ctx = c.getContext("2d")!;
    const w = (c.width = innerWidth);
    const h = (c.height = innerHeight);
    const bits = Array.from({ length: 160 }, (_, i) => ({
      x: i % 2 ? w * 0.1 : w * 0.9,
      y: h * 0.7,
      vx: (i % 2 ? 1 : -1) * (4 + Math.random() * 9),
      vy: -(10 + Math.random() * 12),
      r: Math.random() * Math.PI,
      vr: Math.random() * 0.3 - 0.15,
      s: 6 + Math.random() * 8,
      color: COLORS[i % COLORS.length],
    }));
    let frame = 0;
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of bits) {
        b.vy += 0.35;
        b.vx *= 0.99;
        b.x += b.vx;
        b.y += b.vy;
        b.r += b.vr;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.r);
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
        ctx.restore();
      }
      if (++frame < 220) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [id]);

  return done ? null : <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[300]" />;
}

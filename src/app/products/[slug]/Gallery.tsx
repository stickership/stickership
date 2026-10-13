"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(images.length > 1);

  const go = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    if (!auto || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go((active + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [auto, active, images.length]);

  return (
    <div className="mx-auto w-full max-w-[560px] lg:sticky lg:top-24 lg:self-start">
      <div className="die-cut relative overflow-hidden bg-white" onPointerDown={() => setAuto(false)} onMouseEnter={() => setAuto(false)}>
        <div
          ref={track}
          onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <div key={src} className="relative aspect-square w-full shrink-0 snap-center">
              <Image src={src} alt={i ? `${title} – view ${i + 1}` : title} fill priority={i === 0} sizes="(min-width:990px) 560px, 100vw" className="object-contain p-4" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => (setAuto(false), go(i))}
                className={`h-2 rounded-full border border-ink transition-all ${i === active ? "w-6 bg-ink" : "w-2 bg-white"}`}
              />
            ))}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 hidden gap-2 md:flex">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => (setAuto(false), go(i))}
              className={`relative size-16 overflow-hidden rounded-xl border-2 bg-white transition-transform ${i === active ? "-rotate-3 border-ink" : "border-ink/15 hover:border-ink"}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

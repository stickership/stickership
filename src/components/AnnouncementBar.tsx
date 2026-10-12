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
    <div className="relative z-[90] h-[43px] bg-brand-red lg:h-16">
      <div className="flex h-full items-center justify-center gap-1.5 px-0 py-1 lg:gap-6 lg:px-7 lg:py-2">
        <p className="font-sans text-[15px] font-bold leading-[19.5px] text-white lg:text-2xl lg:leading-[28.8px]">
          STICKERS @ ₹10 · ENDS IN:
        </p>
        <div className="flex h-[35px] w-40 items-center justify-center gap-[1px] lg:h-12 lg:w-56 lg:gap-[2.7px]">
          {t.map((v, i) => (
            <div key={labels[i]} className="flex items-center">
              {i > 0 && (
                <span className="w-[4px] pb-[1px] text-center font-serif text-sm font-medium text-timer-pink lg:w-1.5 lg:pb-0.5 lg:text-xl">
                  :
                </span>
              )}
              <div className="flex h-[35px] w-[35px] flex-col items-center justify-center lg:h-12 lg:w-12">
                <span className="font-sans text-[19px] font-semibold leading-[19px] text-timer-gold lg:text-[27px] lg:leading-[27px]">
                  {pad(v)}
                </span>
                <span className="font-sans text-[7.5px] font-medium leading-[7.5px] text-timer-pink lg:text-[10.75px] lg:leading-[10.75px]">
                  {labels[i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

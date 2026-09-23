"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 font-[family-name:var(--font-inter)]">


      <section className="bg-[#15161c] border border-zinc-800/90 rounded-2xl p-8 sm:p-12 lg:p-14 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start gap-4 z-10 max-w-xl">
            
            <span className="font-[family-name:var(--font-oswald)] text-[#ccff00] text-xs sm:text-sm font-extralight tracking-widest uppercase">
              WORKOUT LIBRARY
            </span>

            <h1 className="font-[family-name:var(--font-oswald)] text-xl sm:text-6xl lg:text-5xl font- uppercase tracking-tight text-white leading-[1.05]">
              TRAIN WITH INTENT. LOG <br />EVERY SET.
            </h1>

            <p className="font-[family-name:var(--font-inter)] text-zinc-400 text-xs sm:text-sm lg:text-[15px] leading-relaxed font-normal mt-1">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.
            </p>

            <a
              href="#library"
              className="mt-3 inline-flex items-center gap-2 bg-[#ccff00] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-[#b8e600] active:scale-95 transition-all shadow-sm"
            >
              <span>BROWSE WORKOUTS</span>
              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
            </a>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-square flex items-center justify-center">
              <Image
                src="/banner.png"
                alt="FitLog Hero Model"
                width={460}
                height={460}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
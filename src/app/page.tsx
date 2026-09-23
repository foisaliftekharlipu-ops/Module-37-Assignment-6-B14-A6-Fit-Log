"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, Loader2 } from "lucide-react";
import WorkoutCard from "@/components/WorkoutCard";
import { Workout } from "@/types/workout";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
        const data = await res.json();
        const workoutList = Array.isArray(data) ? data : data.data || [];
        setWorkouts(workoutList);
      } catch (err) {
        console.error("Failed to fetch workouts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkouts();
  }, []);

  return (
    <div className="flex flex-col gap-14 font-[family-name:var(--font-inter)]">
      {/* 2. 🅱️ Hero / Banner Section */}
      <section className="bg-[#15161c] border border-zinc-800/90 rounded-2xl p-8 sm:p-12 lg:p-14 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4 z-10 max-w-xl">
            <span className="font-[family-name:var(--font-oswald)] text-[#ccff00] text-xs sm:text-sm font-semibold tracking-widest uppercase">
              WORKOUT LIBRARY
            </span>

            <h1 className="font-[family-name:var(--font-oswald)] text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-[1.05]">
              TRAIN WITH INTENT. LOG <br />
              EVERY SET.
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

          {/* Right Banner Image */}
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

      {/* 3. ⚖️ The Library Section */}
      <section id="library" className="w-full scroll-mt-24">
        {/* Section Heading & Subtitle */}
        <div className="mb-8 pb-4">
          <h2 className="font-[family-name:var(--font-oswald)] text-2xl sm:text-4xl font-extralight uppercase text-white">
            THE LIBRARY
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-normal">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        {/* 3x4 Responsive Cards Grid */}
        {loading ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#ccff00]" />
            <p className="text-sm font-medium">Loading lifts from library…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
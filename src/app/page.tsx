"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WorkoutCard from "@/components/WorkoutCard";

interface WorkoutItem {
  id: string | number;
  name: string;
  image?: string;
  category?: string | string[];
  equipment?: string | string[];
  difficulty?: string;
  sets?: number | string;
  reps?: string;
  duration?: number | string;
  calories?: number | string;
  rating?: number | string;
}

export default function HomePage() {
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkouts() {
      try {
        setLoading(true);
        const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data.data || [];
          setWorkouts(items);
        }
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  return (

    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 font-(family-name:--font-inter)">
      <div className="space-y-12">
        
        <section className="grid items-center gap-10 rounded-2xl border border-zinc-800 bg-[#12141a] p-8 lg:grid-cols-2 lg:p-12">
          
          {/* Left Column: Text & CTA */}
          <div className="space-y-5">
            <span className="text-[#ccff00] text-xs font-bold uppercase tracking-wider block">
              WORKOUT LIBRARY
            </span>

            <h1 className="font-(family-name:--font-oswald) text-4xl sm:text-5xl lg:text-5xl font-normal uppercase tracking-wide text-white leading-tight">
              TRAIN WITH INTENT. LOG EVERY SET.
            </h1>

            <p className="text-zinc-400 text-base leading-relaxed">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.
            </p>

            <div>
              <Link
                href="#library"
                className="inline-flex items-center justify-center bg-[#ccff00] hover:bg-[#b8e600] text-black text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95"
              >
                Browse Workouts
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="relative w-full aspect-5/4 flex items-center justify-center">
            <Image
              src="/banner.png"
              alt="Gym Illustration"
              width={500}
              height={400}
              className="object-contain w-full h-auto"
              priority
            />
          </div>

        </section>

        {/* The Library Section */}
        <section id="library" className="space-y-6 scroll-mt-20">
          <div className="space-y-1">
            <h2 className="font-(family-name:--font-oswald) text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
              THE LIBRARY
            </h2>
            <p className="text-zinc-400 text-sm">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {/* Loading Spinner */}
          {loading ? (
            <div className="min-h-87.5 flex flex-col items-center justify-center gap-3 text-zinc-400">
              <div className="w-10 h-10 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading exercises…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={{ ...workout }} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWorkout } from "@/context/WorkoutContext";

export default function Navbar() {
  const { todayPlan, savedWorkouts } = useWorkout();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#0b0b0d]/90 backdrop-blur-md">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        <Link 
          href="/" 
          onClick={() => setActiveMenu(null)}
          className="flex items-center gap-2 select-none"
        >
          <Image
            src="/logo.png"
            alt="FitLog Logo"
            width={22}
            height={22}
            className="w-5 h-5 object-contain -scale-x-100"
            priority
          />
          <span className="font-[family-name:var(--font-oswald)] font-thin text-2xl tracking-wider text-white leading-none pt-0.5">
            FITLOG
          </span>
        </Link>

    
        <div className="flex items-center gap-2 font-sans text-[13px] sm:text-[14px]">
          <Link
            href="/"
            onClick={() => setActiveMenu("workouts")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors duration-150 ${
              activeMenu === "workouts"
                ? "bg-[#18191e] text-[#ccff00] font-semibold"
                : "text-zinc-300 hover:bg-[#18191e] hover:text-white"
            }`}
          >
            Workouts
          </Link>
          <Link
            href="/my-plan"
            onClick={() => setActiveMenu("my-plan")}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors duration-150 ${
              activeMenu === "my-plan"
                ? "bg-[#18191e] text-[#ccff00] font-semibold"
                : "text-zinc-300 hover:bg-[#18191e] hover:text-white"
            }`}
          >
            My Plan
          </Link>
        </div>


        <div className="flex items-center gap-3 font-sans">
          <Link
            href="/my-plan"
            onClick={() => setActiveMenu("my-plan")}
            className="flex items-center gap-2 bg-[#ccff00] text-black text-xs font-bold px-3.5 py-1.5 rounded-full hover:bg-[#b8e600] active:scale-95 transition-all"
          >
            <span>Plan</span>
            <span className="bg-black text-[#ccff00] w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold">
              {todayPlan.length}
            </span>
          </Link>
          <Link
            href="/my-plan"
            onClick={() => setActiveMenu("my-plan")}
            className="flex items-center gap-2 border border-zinc-700 text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-full hover:border-zinc-500 hover:text-white active:scale-95 transition-all"
          >
            <span>Saved</span>
            <span className="bg-zinc-800 text-zinc-300 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold">
              {savedWorkouts.length}
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
}
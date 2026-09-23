"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";

export default function Navbar() {
  const pathname = usePathname();
  const { todayPlan, savedWorkouts } = useWorkout();

  const isWorkoutActive = pathname === "/";
  const isMyPlanActive = pathname === "/my-plan";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#0e0e10]/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#ccff00] p-1.5 rounded text-black font-black flex items-center justify-center">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="font-extrabold tracking-wider text-xl uppercase font-sans text-white">
            FIT<span className="text-[#ccff00]">LOG</span>
          </span>
        </Link>

        {/* Middle: Links */}
        <div className="flex items-center gap-6 text-sm font-semibold tracking-wide uppercase">
          <Link
            href="/"
            className={`transition-colors duration-150 pb-1 border-b-2 ${
              isWorkoutActive
                ? "text-[#ccff00] border-[#ccff00]"
                : "text-zinc-400 border-transparent hover:text-white"
            }`}
          >
            Workout
          </Link>
          <Link
            href="/my-plan"
            className={`transition-colors duration-150 pb-1 border-b-2 ${
              isMyPlanActive
                ? "text-[#ccff00] border-[#ccff00]"
                : "text-zinc-400 border-transparent hover:text-white"
            }`}
          >
            My Plan
          </Link>
        </div>

        {/* Right: Counters */}
        <div className="flex items-center gap-3">
          <Link
            href="/my-plan"
            className="flex items-center gap-1.5 bg-[#ccff00] text-black text-xs font-bold px-3 py-1 rounded-full hover:opacity-90 transition-opacity"
          >
            <span>Plan</span>
            <span className="bg-black text-[#ccff00] w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
              {todayPlan.length}
            </span>
          </Link>
          <Link
            href="/my-plan"
            className="flex items-center gap-1.5 border border-zinc-700 text-zinc-200 text-xs font-semibold px-3 py-1 rounded-full hover:border-zinc-500 transition-colors"
          >
            <span>Saved</span>
            <span className="bg-zinc-800 text-zinc-300 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
              {savedWorkouts.length}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
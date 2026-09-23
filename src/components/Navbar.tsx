"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";

export default function Navbar() {
  const pathname = usePathname();
  const { todayPlan, savedWorkouts, activeTab, setActiveTab } = useWorkout();

  const isWorkoutsActive = pathname === "/";
  const isMyPlanPage = pathname.startsWith("/my-plan");

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0b0d] border-b border-zinc-900 font-[family-name:var(--font-inter)]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-oswald)] text-xl font-bold tracking-wider text-white"
        >
          <Dumbbell className="w-5 h-5 text-[#ccff00]" />
          <span>FITLOG</span>
        </Link>

        {/* Center Links */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
              isWorkoutsActive
                ? "bg-[#1a1d23] text-[#c4f000] font-bold"
                : "text-zinc-200 hover:bg-[#1a1d23] hover:text-[#c4f000]"
            }`}
          >
            Workouts
          </Link>

          <Link
            href="/my-plan"
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
              isMyPlanPage
                ? "bg-[#1a1d23] text-[#c4f000] font-bold"
                : "text-zinc-200 hover:bg-[#1a1d23] hover:text-[#c4f000]"
            }`}
          >
            My Plan
          </Link>
        </nav>

        {/* Right Badges (Plan & Saved) */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          {/* Plan Badge */}
          <Link
            href="/my-plan"
            onClick={() => setActiveTab("plan")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 ${
              isMyPlanPage && activeTab === "plan"
                ? "bg-[#1a1d23] text-[#c4f000] font-bold"
                : "text-zinc-300 hover:bg-[#1a1d23] hover:text-[#c4f000]"
            }`}
          >
            <span>Plan</span>
            <span className="bg-[#ccff00] text-black font-bold px-2 py-0.5 rounded-full text-[11px] leading-none">
              {todayPlan.length}
            </span>
          </Link>

          {/* Saved Badge */}
          <Link
            href="/my-plan"
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 ${
              isMyPlanPage && activeTab === "saved"
                ? "bg-[#1a1d23] text-[#c4f000] font-bold"
                : "text-zinc-300 hover:bg-[#1a1d23] hover:text-[#c4f000]"
            }`}
          >
            <span>Saved</span>
            <span className="border border-zinc-700 bg-zinc-900 text-zinc-200 px-2 py-0.5 rounded-full text-[11px] leading-none">
              {savedWorkouts.length}
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
}
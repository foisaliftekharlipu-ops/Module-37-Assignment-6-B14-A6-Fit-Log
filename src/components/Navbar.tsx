"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Dumbbell, Menu, X } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { todayPlan, savedWorkouts, activeTab, setActiveTab } = useWorkout();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0b0d] border-b border-zinc-900 font-(family-name:--font-inter)">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link
            href="/"
            onClick={() => {
              setActiveNav(null);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 font-(family-name:--font-oswald) text-lg sm:text-xl font-bold tracking-wider text-white hover:opacity-90 transition-opacity"
          >
            <Dumbbell className="w-5 h-5 text-[#ccff00]" />
            <span>FITLOG</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
          <Link
            href="/"
            onClick={() => setActiveNav("workouts")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
              activeNav === "workouts"
                ? "bg-[#1a1d23] text-[#ccff00]"
                : "text-zinc-300 hover:bg-[#1a1d23] hover:text-[#ccff00]"
            }`}
          >
            Workouts
          </Link>

          <Link
            href="/my-plan"
            onClick={() => setActiveNav("my-plan")}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 ${
              activeNav === "my-plan"
                ? "bg-[#1a1d23] text-[#ccff00]"
                : "text-zinc-300 hover:bg-[#1a1d23] hover:text-[#ccff00]"
            }`}
          >
            My Plan
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
          <Link
            href="/my-plan"
            onClick={() => {
              setActiveTab("plan");
              setActiveNav("my-plan");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-zinc-300 hover:bg-[#1a1d23] transition-colors"
          >
            <span>Plan</span>
            <span
              suppressHydrationWarning
              className={`font-bold px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] min-w-4 text-center ${
                activeTab === "plan"
                  ? "bg-[#ccff00] text-black"
                  : "border border-zinc-700 bg-transparent text-white"
              }`}
            >
              {mounted ? todayPlan.length : 0}
            </span>
          </Link>

          <Link
            href="/my-plan"
            onClick={() => {
              setActiveTab("saved");
              setActiveNav("my-plan");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-zinc-300 hover:bg-[#1a1d23] transition-colors"
          >
            <span>Saved</span>
            <span
              suppressHydrationWarning
              className={`font-bold px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] min-w-4 text-center ${
                activeTab === "saved"
                  ? "bg-[#ccff00] text-black"
                  : "border border-zinc-700 bg-transparent text-white"
              }`}
            >
              {mounted ? savedWorkouts.length : 0}
            </span>
          </Link>
        </div>
      </div>

      {/* মোবাইল ড্রয়ার */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-[#0e1015] px-4 py-3 flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => {
              setActiveNav("workouts");
              setMobileMenuOpen(false);
            }}
            className={`px-3 py-2 rounded-xl text-sm font-semibold ${
              activeNav === "workouts"
                ? "bg-[#1a1d23] text-[#ccff00]"
                : "text-zinc-300 hover:bg-[#1a1d23] hover:text-[#ccff00]"
            }`}
          >
            Workouts
          </Link>
          <Link
            href="/my-plan"
            onClick={() => {
              setActiveNav("my-plan");
              setMobileMenuOpen(false);
            }}
            className={`px-3 py-2 rounded-xl text-sm font-semibold ${
              activeNav === "my-plan"
                ? "bg-[#1a1d23] text-[#ccff00]"
                : "text-zinc-300 hover:bg-[#1a1d23] hover:text-[#ccff00]"
            }`}
          >
            My Plan
          </Link>
        </div>
      )}
    </header>
  );
}

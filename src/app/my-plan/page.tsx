"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Star, ChevronDown, Check, X } from "lucide-react";
import { useWorkout, Workout } from "@/context/WorkoutContext";
import toast from "react-hot-toast";

export default function MyPlanPage() {
  const {
    todayPlan = [],
    savedWorkouts = [],
    activeTab,
    setActiveTab,
    removeFromPlan,
    removeFromSaved,
  } = useWorkout();


  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [sortBy, setSortBy] = useState<"duration" | "calories" | "rating">("duration");

  const isSavedTab = activeTab === "saved";
  const currentList: Workout[] = isSavedTab ? savedWorkouts : todayPlan;

  const extractNumber = (val: string | number | undefined | null): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const match = String(val).match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const getCaloriesValue = (item: Workout): number => {
    const rawObj = item as unknown as Record<string, string | number | undefined>;
    const raw =
      item.calories ??
      rawObj.caloriesBurned ??
      rawObj.calories_burned ??
      rawObj.calorie ??
      rawObj.kcal;
    return extractNumber(raw);
  };

  const getDurationValue = (item: Workout): number => {
    const rawObj = item as unknown as Record<string, string | number | undefined>;
    const raw = item.duration ?? rawObj.time ?? rawObj.durationMinutes;
    return extractNumber(raw);
  };

  const getRatingValue = (item: Workout): number => {
    return extractNumber(item.rating);
  };

  const sortedList = [...currentList].sort((a, b) => {
    if (sortBy === "duration") return getDurationValue(b) - getDurationValue(a);
    if (sortBy === "calories") return getCaloriesValue(b) - getCaloriesValue(a);
    if (sortBy === "rating") return getRatingValue(b) - getRatingValue(a);
    return 0;
  });

  const totalExercises = currentList.length;
  const totalMinutes = currentList.reduce((acc, item) => acc + getDurationValue(item), 0);
  const totalCalories = currentList.reduce((acc, item) => acc + getCaloriesValue(item), 0);

  const handleMarkAsDone = (id: string | number) => {
    if (typeof removeFromPlan === "function") {
      removeFromPlan(id, true);
    }
    toast.success("Workout logged — nice work");
  };

  const handleRemove = (id: string | number) => {
    if (isSavedTab && typeof removeFromSaved === "function") {
      removeFromSaved(id);
    } else if (typeof removeFromPlan === "function") {
      removeFromPlan(id);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 font-(family-name:--font-inter)">
      <div className="space-y-6">
        
        <p className="text-zinc-400 text-xs sm:text-sm">
          Cap of five lifts for today. Finish them, then load more.
        </p>

        {/* Metrics Summary Row */}
        <div className="grid grid-cols-3 bg-[#12141a] border border-zinc-800/80 rounded-2xl p-4 sm:p-6 lg:p-8">
          {/* Exercises */}
          <div className="flex flex-col gap-1 border-r border-zinc-800 pr-2 sm:pr-6">
            <span className="text-zinc-400 text-[11px] sm:text-xs font-semibold">Exercises</span>
            <span
              suppressHydrationWarning
              className="font-(family-name:--font-oswald) text-2xl sm:text-3xl lg:text-4xl font-bold text-[#ccff00]"
            >
              {mounted ? totalExercises : 0}
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col gap-1 border-r border-zinc-800 px-2 sm:px-6">
            <span className="text-zinc-400 text-[11px] sm:text-xs font-semibold">Minutes</span>
            <span
              suppressHydrationWarning
              className="font-(family-name:--font-oswald) text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
            >
              {mounted ? totalMinutes : 0}
            </span>
          </div>

          {/* Calories */}
          <div className="flex flex-col gap-1 pl-2 sm:pl-6">
            <span className="text-zinc-400 text-[11px] sm:text-xs font-semibold">Calories</span>
            <span
              suppressHydrationWarning
              className="font-(family-name:--font-oswald) text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
            >
              {mounted ? totalCalories : 0}
            </span>
          </div>
        </div>

        {/* Tabs & Sort Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-1 bg-[#12141a] p-1 rounded-xl border border-zinc-800/80">
            <button
              type="button"
              onClick={() => setActiveTab("plan")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 outline-none hover:bg-[#0a0a0a] ${
                !isSavedTab
                  ? "bg-[#0a0a0a] text-[#ccff00]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Today&apos;s Plan
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 outline-none hover:bg-[#0a0a0a] ${
                isSavedTab
                  ? "bg-[#0a0a0a] text-[#ccff00]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Saved
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Sort By</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "duration" | "calories" | "rating")
                }
                className="appearance-none bg-[#12141a] border border-zinc-800 text-white rounded-xl px-3 py-1.5 pr-8 text-xs font-medium cursor-pointer focus:outline-none"
              >
                <option value="duration">Duration</option>
                <option value="calories">Calories</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
            </div>
          </div>
        </div>

        {/* List / Empty State */}
        {!mounted ? (
          <div className="w-full bg-[#12141a] border border-zinc-800/80 rounded-3xl py-14 px-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-8 h-8 border-3 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-xs sm:text-sm">Loading workouts…</p>
          </div>
        ) : sortedList.length === 0 ? (
          <div className="w-full bg-[#12141a] border border-zinc-800/80 rounded-3xl py-14 px-6 flex flex-col items-center justify-center text-center gap-3">
            <h3 className="font-(family-name:--font-oswald) text-2xl font-bold uppercase text-white tracking-wider">
              NOTHING HERE YET
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Browse the library and add a lift to get today moving.
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center justify-center bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(204,255,0,0.25)] hover:scale-105 active:scale-95"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedList.map((workout) => {
              const cal = getCaloriesValue(workout);
              const dur = getDurationValue(workout);

              return (
                <div
                  key={String(workout.id)}
                  className="bg-[#12141a] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                    <div className="relative w-full aspect-video md:w-20 md:h-20 md:aspect-square rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                      <Image
                        src={workout.image || "/banner.png"}
                        alt={workout.name || "Workout"}
                        fill
                        sizes="(max-width: 768px) 100vw, 80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <h4 className="font-(family-name:--font-oswald) text-lg sm:text-xl font-bold uppercase tracking-wide text-white">
                        {workout.name}
                      </h4>
                      <p className="text-zinc-400 text-xs sm:text-sm">
                        {Array.isArray(workout.equipment)
                          ? workout.equipment.join(", ")
                          : workout.equipment || "Bodyweight"}
                      </p>

                      <div className="flex items-center gap-3 text-zinc-400 text-xs mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                          {dur ? `${dur} min` : "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#ccff00]" />
                          {cal ? `${cal} kcal` : "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          {workout.rating ?? "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-2 md:pt-0">
                    <Link
                      href={`/workout/${workout.id}`}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-white border border-zinc-700/80 bg-transparent hover:bg-zinc-800/60 transition-colors whitespace-nowrap"
                    >
                      View Details
                    </Link>

                    {!isSavedTab && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsDone(workout.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_15px_rgba(204,255,0,0.25)] transition-all duration-200 whitespace-nowrap"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        <span>Mark as Done</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(workout.id)}
                      className="p-2 text-zinc-400 hover:text-white transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
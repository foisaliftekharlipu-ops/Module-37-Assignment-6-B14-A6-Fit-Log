"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Clock, Flame, Star } from "lucide-react";
import { useWorkout, Workout } from "@/context/WorkoutContext";
import toast from "react-hot-toast";

const getCalorieValue = (item: Workout): number => {
  const raw = item as unknown as Record<string, unknown>;
  const val =
    raw.calories ??
    raw.caloriesBurned ??
    raw.calorie ??
    raw.calories_burned ??
    0;
  return Number(val) || 0;
};

const getDurationValue = (item: Workout): number => {
  const raw = item as unknown as Record<string, unknown>;
  const val =
    raw.duration ??
    raw.time ??
    raw.durationMinutes ??
    0;
  return Number(val) || 0;
};

export default function MyPlanPage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const {
    todayPlan,
    savedWorkouts,
    activeTab,
    setActiveTab,
    removeFromPlan,
    removeFromSaved,
  } = useWorkout();

  const [sortBy, setSortBy] = useState<string>("default");

  const currentItems = activeTab === "plan" ? todayPlan : savedWorkouts;

  const totalMinutes = useMemo(() => {
    return currentItems.reduce((acc, curr) => acc + getDurationValue(curr), 0);
  }, [currentItems]);

  const totalCalories = useMemo(() => {
    return currentItems.reduce((acc, curr) => acc + getCalorieValue(curr), 0);
  }, [currentItems]);

  const sortedItems = useMemo(() => {
    const items = [...currentItems];
    if (sortBy === "duration") {
      items.sort((a, b) => getDurationValue(b) - getDurationValue(a));
    } else if (sortBy === "calories") {
      items.sort((a, b) => getCalorieValue(b) - getCalorieValue(a));
    }
    return items;
  }, [currentItems, sortBy]);

  const handleMarkAsDone = (id: string | number) => {
    removeFromPlan(id, true);
    toast.success("Workout logged — nice work");
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-3.5 sm:px-4 py-8 font-(family-name:--font-inter)">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white font-(family-name:--font-oswald)">
          MY PLAN
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Cap of five lifts for today. Finish them, then load more.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 bg-[#12141a] border border-zinc-800/80 rounded-2xl p-4 sm:p-6 divide-x divide-zinc-800/60">
        <div className="px-1 sm:px-2">
          <span className="text-[10px] sm:text-xs text-zinc-400 font-medium block">Exercises</span>
          <p
            suppressHydrationWarning
            className="text-2xl sm:text-4xl font-bold text-[#ccff00] mt-1 font-(family-name:--font-oswald)"
          >
            {mounted ? currentItems.length : 0}
          </p>
        </div>
        <div className="px-2 sm:px-4">
          <span className="text-[10px] sm:text-xs text-zinc-400 font-medium block">Minutes</span>
          <p
            suppressHydrationWarning
            className="text-2xl sm:text-4xl font-bold text-white mt-1 font-(family-name:--font-oswald)"
          >
            {mounted ? totalMinutes : 0}
          </p>
        </div>
        <div className="px-2 sm:px-4">
          <span className="text-[10px] sm:text-xs text-zinc-400 font-medium block">Calories</span>
          <p
            suppressHydrationWarning
            className="text-2xl sm:text-4xl font-bold text-white mt-1 font-(family-name:--font-oswald)"
          >
            {mounted ? totalCalories : 0}
          </p>
        </div>
      </div>

      {/* Tab & Sort Row */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="relative flex items-center bg-[#12141a] p-1 rounded-xl border border-zinc-800 select-none">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-[#181a20] border border-zinc-700/60 transition-transform duration-300 ease-in-out pointer-events-none ${
              activeTab === "plan" ? "translate-x-0" : "translate-x-full"
            }`}
          />

          <button
            type="button"
            onClick={() => setActiveTab("plan")}
            className={`relative z-10 w-28 sm:w-32 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors duration-200 cursor-pointer ${
              activeTab === "plan" ? "text-[#ccff00]" : "text-zinc-400 hover:text-white"
            }`}
          >
            Today&apos;s Plan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`relative z-10 w-24 sm:w-28 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors duration-200 cursor-pointer ${
              activeTab === "saved" ? "text-[#ccff00]" : "text-zinc-400 hover:text-white"
            }`}
          >
            Saved
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400">
          <span className="text-zinc-500 whitespace-nowrap">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#12141a] text-zinc-200 border border-zinc-800 rounded-lg px-2 sm:px-3 py-1.5 outline-none text-xs cursor-pointer hover:border-zinc-700"
          >
            <option value="default">Duration</option>
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
          </select>
        </div>
      </div>

      {/* Empty State vs Item List */}
      {!mounted || sortedItems.length === 0 ? (
        <div className="border border-dashed border-zinc-800/80 rounded-3xl p-12 sm:p-20 text-center flex flex-col items-center justify-center min-h-95 bg-transparent">
          <h2 className="font-(family-name:--font-oswald) text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
            NOTHING HERE YET
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-2 max-w-sm">
            Browse the library and add a lift to get today moving.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
          >
            Go to workouts
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedItems.map((item: Workout) => {
            const raw = item as unknown as Record<string, unknown>;
            const cal = getCalorieValue(item);
            const duration = getDurationValue(item);
            const rating = raw.rating ?? raw.rate ?? raw.stars;

            const equipmentText = Array.isArray(item.equipment)
              ? item.equipment.join(", ")
              : item.equipment || "Barbell";

            return (
              <div
                key={String(item.id)}
                className="bg-[#12141a] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:border-zinc-700/80"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative w-full aspect-16/10 md:w-20 md:h-20 md:aspect-square rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                    <Image
                      src={item.image || "/banner.png"}
                      alt={item.name || "Workout"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 80px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-(family-name:--font-oswald) text-lg sm:text-xl font-bold uppercase text-white tracking-wide">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{equipmentText}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                        {duration ? `${duration} min` : "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#ccff00]" />
                        {cal ? `${cal} kcal` : "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {rating !== undefined && rating !== null ? `${rating}` : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800/60">
                  <Link
                    href={`/workout/${item.id}`}
                    className="text-xs font-semibold text-zinc-300 hover:text-white px-3.5 py-2 rounded-lg border border-zinc-800 hover:bg-zinc-800/50 transition-colors text-center shrink-0"
                  >
                    View Details
                  </Link>

                  {activeTab === "plan" && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsDone(item.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Check className="w-3.5 h-3.5 stroke-3" />
                      <span>Mark as Done</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "plan") {
                        removeFromPlan(item.id);
                      } else {
                        removeFromSaved(item.id);
                      }
                    }}
                    className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
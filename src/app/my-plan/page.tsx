"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Clock, Flame, Star, ChevronDown } from "lucide-react";
import { useWorkout } from "@/context/WorkoutContext";
import toast from "react-hot-toast";

const workoutDataMap: Record<string, { duration: number; calories: number; rating: number }> = {
  "barbell bench press": { duration: 25, calories: 180, rating: 4.8 },
  "pull-up": { duration: 15, calories: 120, rating: 4.7 },
  "back squat": { duration: 30, calories: 240, rating: 4.9 },
  "overhead press": { duration: 20, calories: 150, rating: 4.6 },
  "dumbbell bicep curl": { duration: 12, calories: 80, rating: 4.3 },
  "hollow-body plank": { duration: 10, calories: 60, rating: 4.4 },
  "burpee": { duration: 12, calories: 160, rating: 4.2 },
  "conventional deadlift": { duration: 28, calories: 260, rating: 4.9 },
  "push-up": { duration: 10, calories: 90, rating: 4.5 },
  "walking lunge": { duration: 18, calories: 170, rating: 4.4 },
  "russian twist": { duration: 8, calories: 70, rating: 4.1 },
  "kettlebell swing": { duration: 16, calories: 200, rating: 4.7 },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCalories(item: any): number {
  if (!item) return 180;
  const raw = item.calories ?? item.calories_burned ?? item.caloriesBurned ?? item.calorie;
  if (typeof raw === "number" && !isNaN(raw) && raw > 0) return raw;
  if (typeof raw === "string") {
    const matched = raw.match(/\d+/);
    if (matched) {
      const num = parseInt(matched[0], 10);
      if (num > 0) return num;
    }
  }

  const name = String(item.name || "").toLowerCase().trim();
  if (workoutDataMap[name]) return workoutDataMap[name].calories;

  for (const [key, val] of Object.entries(workoutDataMap)) {
    if (name.includes(key) || key.includes(name)) {
      return val.calories;
    }
  }
  return 180;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDuration(item: any): number {
  if (!item) return 25;
  const raw = item.duration ?? item.time ?? item.duration_min;
  if (typeof raw === "number" && !isNaN(raw) && raw > 0) return raw;
  if (typeof raw === "string") {
    const matched = raw.match(/\d+/);
    if (matched) {
      const num = parseInt(matched[0], 10);
      if (num > 0) return num;
    }
  }

  const name = String(item.name || "").toLowerCase().trim();
  if (workoutDataMap[name]) return workoutDataMap[name].duration;

  for (const [key, val] of Object.entries(workoutDataMap)) {
    if (name.includes(key) || key.includes(name)) {
      return val.duration;
    }
  }
  return 25;
}

export default function MyPlanPage() {
  const [sortBy, setSortBy] = useState<"duration" | "calories" | "rating">("duration");
  const [completedWorkouts, setCompletedWorkouts] = useState<Record<string | number, boolean>>({});

  const {
    todayPlan,
    savedWorkouts,
    activeTab,
    setActiveTab,
    removeFromTodayPlan,
    removeFromSaved,
  } = useWorkout();

  const totalExercises = todayPlan.length;
  const totalMinutes = todayPlan.reduce((acc, curr) => acc + getDuration(curr), 0);
  const totalCalories = todayPlan.reduce((acc, curr) => acc + getCalories(curr), 0);

  const sortList = (list: typeof todayPlan) => {
    return [...list].sort((a, b) => {
      if (sortBy === "duration") return getDuration(b) - getDuration(a);
      if (sortBy === "calories") return getCalories(b) - getCalories(a);
      if (sortBy === "rating") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      return 0;
    });
  };

  const currentList = sortList(activeTab === "plan" ? todayPlan : savedWorkouts);

  const handleMarkAsDone = (id: string | number) => {
    const isCurrentlyDone = !!completedWorkouts[id];
    setCompletedWorkouts((prev) => ({
      ...prev,
      [id]: !isCurrentlyDone,
    }));

    if (!isCurrentlyDone) {
      toast.success("Workout logged — nice work");
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto py-2 flex flex-col gap-6 font-[family-name:var(--font-inter)]">
      
      {/* Heading */}
      <div className="flex flex-col gap-1.5 pt-2">
        <h1 className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl font-bold uppercase tracking-wide text-white leading-none">
          MY PLAN
        </h1>
        <p className="text-zinc-400 text-xs sm:text-[13px] font-normal">
          Cap of five lifts for today. Finish them, then load more.
        </p>
      </div>

      {/* Metrics */}
      <div className="bg-[#121318] border border-zinc-800/80 rounded-2xl grid grid-cols-3 divide-x divide-zinc-800/70 py-6 px-4 sm:px-8">
        <div className="flex flex-col gap-1 px-4 sm:px-6">
          <span className="text-zinc-400 text-xs font-medium">Exercises</span>
          <span className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl font-bold text-[#ccff00] leading-none">
            {totalExercises}
          </span>
        </div>

        <div className="flex flex-col gap-1 px-4 sm:px-6">
          <span className="text-zinc-400 text-xs font-medium">Minutes</span>
          <span className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl font-bold text-white leading-none">
            {totalMinutes}
          </span>
        </div>

        <div className="flex flex-col gap-1 px-4 sm:px-6">
          <span className="text-zinc-400 text-xs font-medium">Calories</span>
          <span className="font-[family-name:var(--font-oswald)] text-3xl sm:text-4xl font-bold text-white leading-none">
            {totalCalories}
          </span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="inline-flex items-center bg-[#181920] border border-zinc-800/80 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("plan")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
              activeTab === "plan"
                ? "bg-[#0c0d10] text-[#ccff00] shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 bg-transparent"
            }`}
          >
            Today&apos;s Plan
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-150 ${
              activeTab === "saved"
                ? "bg-[#0c0d10] text-[#ccff00] shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 bg-transparent"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <span className="text-zinc-400 text-xs font-medium">Sort By</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-[#121318] border border-zinc-800/90 text-white text-xs font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-[#ccff00] cursor-pointer min-w-[120px]"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Workout Card List */}
      <div className="flex flex-col gap-3">
        {currentList.length === 0 ? (
          <div className="border border-dashed border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-zinc-400 text-sm">
              {activeTab === "plan"
                ? "No exercises in today's plan yet."
                : "No saved workouts found."}
            </p>
            <Link
              href="/#library"
              className="text-xs font-bold text-black bg-[#ccff00] hover:bg-[#b8e600] px-4 py-2 rounded-lg transition-colors"
            >
              BROWSE WORKOUTS
            </Link>
          </div>
        ) : (
          currentList.map((item) => {
            const isDone = !!completedWorkouts[item.id];
            const equipmentText = Array.isArray(item.equipment)
              ? item.equipment.join(", ")
              : item.equipment || "Barbell, Bench";

            const caloriesVal = getCalories(item);
            const durationVal = getDuration(item);
            const nameKey = String(item.name || "").toLowerCase().trim();
            const ratingVal = item.rating || workoutDataMap[nameKey]?.rating || 4.8;

            return (
              <div
                key={item.id}
                className="bg-[#121318] border border-zinc-800/80 hover:border-zinc-700/80 transition-all rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                    <Image
                      src={item.image || "/banner.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-[family-name:var(--font-oswald)] text-lg sm:text-xl font-bold uppercase text-white tracking-wide leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-zinc-400 text-xs font-normal">
                      {equipmentText}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-zinc-300 pt-0.5 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>{durationVal} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>{caloriesVal} kcal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>{ratingVal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <Link
                    href={`/workout/${item.id}`}
                    className="border border-zinc-700/90 hover:border-zinc-500 bg-[#161820] text-zinc-200 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                  >
                    View Details
                  </Link>

                  {activeTab === "plan" && (
                    <button
                      onClick={() => handleMarkAsDone(item.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                        isDone
                          ? "bg-zinc-700 text-zinc-300"
                          : "bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-sm"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isDone ? "Completed" : "Mark as Done"}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (activeTab === "plan") {
                        removeFromTodayPlan(item.id);
                        toast.success("Removed from plan");
                      } else {
                        removeFromSaved(item.id);
                        toast.success("Removed from saved");
                      }
                    }}
                    className="p-2 text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarPlus,
  Bookmark,
  ChevronLeft,
  Check,
} from "lucide-react";
import { useWorkout, Workout } from "@/context/WorkoutContext";
import toast from "react-hot-toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WorkoutDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const workoutId = resolvedParams.id;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    todayPlan = [],
    savedWorkouts = [],
    addToPlan,
    toggleSaveWorkout,
  } = useWorkout();

  useEffect(() => {
    async function fetchWorkout() {
      try {
        setLoading(true);
        const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
        if (res.ok) {
          const data: unknown = await res.json();
          const items: Workout[] = Array.isArray(data)
            ? (data as Workout[])
            : ((data as { data?: Workout[] })?.data || []);

          const matched = items.find(
            (item: Workout) =>
              String(
                item.id ??
                  (item as unknown as { _id?: string | number })._id
              ) === String(workoutId)
          );
          if (matched) {
            setWorkout(matched);
          }
        }
      } catch (err) {
        console.error("Failed to load workout details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkout();
  }, [workoutId]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-3 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Loading workout details…</p>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 text-center">
        <h2 className="font-(family-name:--font-oswald) text-2xl font-bold uppercase text-white tracking-wide">
          Workout Not Found
        </h2>
        <p className="text-zinc-400 text-sm mt-2">
          The requested workout could not be located in the library.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ccff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Workouts
        </Link>
      </main>
    );
  }

  const inPlan = todayPlan.some(
    (item) => String(item.id) === String(workout.id)
  );
  const alreadySaved = savedWorkouts.some(
    (item) => String(item.id) === String(workout.id)
  );

  const isCapReached = todayPlan.length >= 5;

  const handlePlanClick = () => {
    if (inPlan) {
      toast.error("Already added to today's plan");
      return;
    }
    if (isCapReached) {
      toast.error("Daily cap reached: Maximum 5 workouts allowed");
      return;
    }
    addToPlan(workout);
  };

  const handleSaveClick = () => {
    if (alreadySaved) {
      toast.error("Already in your saved list");
    } else {
      toggleSaveWorkout(workout);
    }
  };

  const rawItem = workout as unknown as Record<string, unknown>;

  const caloriesVal: string = String(
    rawItem.calories ??
      rawItem.caloriesBurned ??
      rawItem.calorie ??
      rawItem.calories_burned ??
      "180"
  );

  const durationVal: string = String(
    rawItem.duration ??
      rawItem.time ??
      rawItem.durationMinutes ??
      "25"
  );

  const ratingVal: string = String(
    rawItem.rating ??
      rawItem.rate ??
      rawItem.stars ??
      "4.8"
  );

  const difficultyVal: string = String(
    rawItem.difficulty ??
      rawItem.level ??
      "Intermediate"
  );

  const setsVal: string = String(rawItem.sets ?? "4");
  const repsVal: string = String(rawItem.reps ?? "6-8");

  const equipmentText: string = Array.isArray(workout.equipment)
    ? workout.equipment.join(", ")
    : String(workout.equipment || "Barbell, Bench");

  const tags: string[] = [];
  if (workout.category) tags.push(workout.category);
  if (workout.muscle && !tags.includes(workout.muscle)) tags.push(workout.muscle);
  if (tags.length === 0) tags.push("Chest", "Arms");

  const instructionsList: string[] = Array.isArray(workout.instructions)
    ? (workout.instructions as string[])
    : typeof workout.instructions === "string"
    ? (workout.instructions as string)
        .split(/(?:\r\n|\r|\n|\.\s+)/)
        .map((s: string) => s.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter((s: string) => s.length > 0)
    : [
        "Lie on the bench with eyes under the bar and feet planted.",
        "Take the bar off the rack with locked elbows and lower to mid-chest.",
        "Press up in a slight arc until elbows lock without bouncing.",
        "Keep shoulder blades pinched and a natural arch in the back.",
      ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:py-10 font-(family-name:--font-inter)">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-5 relative w-full aspect-4/5 sm:aspect-square lg:aspect-auto lg:h-full min-h-120 rounded-3xl overflow-hidden bg-[#12141a] border border-zinc-800/80 shadow-2xl">
          <Image
            src={workout.image || "/banner.png"}
            alt={workout.name || "Workout"}
            fill
            unoptimized
            priority
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <h1 className="font-(family-name:--font-oswald) text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white">
              {workout.name}
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
              {(rawItem.description as string) ||
                "A compound press that builds chest thickness, triceps, and pressing power from a stable bench."}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#ccff00] text-black text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 bg-[#12141a] border border-zinc-800/80 rounded-2xl p-5 divide-y divide-zinc-800/60 text-xs">
              <div className="flex items-center justify-between py-2.5 first:pt-0">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase">EQUIPMENT</span>
                <span className="text-zinc-200 font-medium">{equipmentText}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase">DIFFICULTY</span>
                <span className="text-zinc-200 font-medium">{difficultyVal}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase">SETS</span>
                <span className="text-zinc-200 font-medium">{setsVal}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase">REPS</span>
                <span className="text-zinc-200 font-medium">{repsVal}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase">DURATION</span>
                <span className="text-zinc-200 font-medium">{durationVal} min</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase">CALORIES</span>
                <span className="text-zinc-200 font-medium">{caloriesVal} kcal</span>
              </div>
              <div className="flex items-center justify-between py-2.5 last:pb-0">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase">RATING</span>
                <span className="text-zinc-200 font-medium">{ratingVal}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-(family-name:--font-oswald) text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                INSTRUCTIONS
              </h3>
              <ol className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed list-none">
                {instructionsList.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-300 font-semibold">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 mt-8 pt-2">
            <button
              type="button"
              onClick={handlePlanClick}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-all duration-200 cursor-pointer ${
                inPlan || isCapReached
                  ? "bg-[#181a20] border border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  : "bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_20px_rgba(204,255,0,0.25)]"
              }`}
            >
              {inPlan ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>
                {inPlan
                  ? "Already in Plan"
                  : isCapReached
                  ? "Daily Cap Reached (5/5)"
                  : "Add to today's plan"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSaveClick}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 cursor-pointer ${
                alreadySaved
                  ? "border border-zinc-800 bg-[#181a20] text-zinc-300 hover:border-zinc-700"
                  : "border border-zinc-800 bg-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  alreadySaved ? "text-[#ccff00] stroke-[2.5]" : "text-zinc-400"
                }`}
              />
              <span>{alreadySaved ? "Already Saved" : "Save for later"}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
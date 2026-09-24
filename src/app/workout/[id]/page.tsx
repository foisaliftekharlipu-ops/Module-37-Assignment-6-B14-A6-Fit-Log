"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWorkout, Workout } from "@/context/WorkoutContext";
import { Dumbbell, Bookmark } from "lucide-react";

export default function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = "then" in params ? use(params) : params;
  const { id } = resolvedParams;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const { todayPlan, addToPlan, toggleSaveWorkout, isInPlan, isSaved } = useWorkout();

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);
        if (res.ok) {
          const json = await res.json();
          const raw = json.data || json;

          const formattedWorkout: Workout = {
            ...raw,
            calories:
              raw.calories ??
              raw.caloriesBurned ??
              raw.calories_burned ??
              raw.calorie ??
              raw.kcal,
            duration: raw.duration ?? raw.durationMinutes ?? raw.time,
          };

          setWorkout(formattedWorkout);
        }
      } catch (err) {
        console.error("Failed to fetch detail:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 flex items-center justify-center font-(family-name:--font-inter)">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-10 h-10 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading details…</p>
        </div>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 text-center font-(family-name:--font-inter)">
        <h2 className="font-(family-name:--font-oswald) text-2xl font-bold uppercase text-white">
          Workout Not Found
        </h2>
        <Link href="/" className="text-[#ccff00] hover:underline mt-4 inline-block text-sm">
          Return to Library
        </Link>
      </main>
    );
  }

  const categories = Array.isArray(workout.category)
    ? workout.category
    : workout.category
    ? [workout.category]
    : ["Back", "Arms"];

  const inPlan = isInPlan(workout.id);
  const alreadySaved = isSaved(workout.id);
  const isCapReached = todayPlan.length >= 5 && !inPlan;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 font-(family-name:--font-inter)">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        
        {/* Left: Image */}
        <div className="relative w-full min-h-95 sm:min-h-115 lg:min-h-130 h-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <Image
            src={workout.image || "/banner.png"}
            alt={workout.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#1a1d24] text-[#ccff00] border border-zinc-800 rounded-full text-[11px] font-bold uppercase tracking-wider"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="font-(family-name:--font-oswald) text-4xl sm:text-5xl font-bold uppercase text-white tracking-wide">
              {workout.name}
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              {workout.description ||
                "Bodyweight vertical pull that hammers lats, biceps, and grip while improving relative strength."}
            </p>
          </div>

          {/* Specs Table */}
          <div className="bg-[#12141a] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 divide-y divide-zinc-800/60 text-xs sm:text-[13px]">
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider">EQUIPMENT</span>
              <span className="text-white font-medium">
                {Array.isArray(workout.equipment)
                  ? workout.equipment.join(", ")
                  : workout.equipment || "Pull-up Bar"}
              </span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider">DIFFICULTY</span>
              <span className="text-white font-medium">{workout.difficulty || "Intermediate"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider">SETS</span>
              <span className="text-white font-medium">{workout.sets || "4"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider">REPS</span>
              <span className="text-white font-medium">{workout.reps || "6-10"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider">DURATION</span>
              <span className="text-white font-medium">
                {typeof workout.duration === "number"
                  ? `${workout.duration} min`
                  : workout.duration || "15 min"}
              </span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider">CALORIES</span>
              <span className="text-white font-medium">
                {typeof workout.calories === "number"
                  ? `${workout.calories} kcal`
                  : workout.calories
                  ? `${workout.calories} kcal`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-400 font-semibold uppercase tracking-wider">RATING</span>
              <span className="text-white font-medium">{workout.rating || "4.7"}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-(family-name:--font-oswald) text-lg sm:text-xl font-bold uppercase text-white tracking-wide">
              INSTRUCTIONS
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {workout.instructions && workout.instructions.length > 0 ? (
                workout.instructions.map((step, idx) => <li key={idx}>{step}</li>)
              ) : (
                <>
                  <li>Hang from the bar with a shoulder-width overhand grip.</li>
                  <li>Brace your core and pull your chest toward the bar.</li>
                  <li>Pause at the top with elbows tucked, then lower with control.</li>
                  <li>Avoid kipping unless you are training a specific variation.</li>
                </>
              )}
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => addToPlan(workout)}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                inPlan
                  ? "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                  : isCapReached
                  ? "bg-zinc-800/80 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                  : "bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[0_0_20px_rgba(204,255,0,0.25)] hover:scale-105 active:scale-95"
              }`}
            >
              <Dumbbell className="w-4 h-4" />
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
              onClick={() => toggleSaveWorkout(workout)}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                alreadySaved
                  ? "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  : "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-white active:scale-95"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${alreadySaved ? "text-[#ccff00]" : "text-zinc-400"}`} />
              <span>{alreadySaved ? "Already Saved" : "Save for later"}</span>
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle, Bookmark, ArrowLeft, Loader2 } from "lucide-react";
import { useWorkout, WorkoutItem } from "@/context/WorkoutContext";
import toast from "react-hot-toast";

interface WorkoutDetail {
  id: string | number;
  name: string;
  description?: string;
  subtitle?: string;
  image?: string;
  category?: string | string[];
  equipment?: string | string[];
  difficulty?: string;
  sets?: number | string;
  reps?: string;
  duration?: number | string;
  calories?: number | string;
  rating?: number | string;
  instructions?: string[];
}

const workoutCategoryMap: Record<string, string[]> = {
  "barbell bench press": ["Chest", "Arms"],
  "pull-up": ["Back", "Arms"],
  "back squat": ["Legs", "Core"],
  "overhead press": ["Shoulders", "Arms"],
  "dumbbell bicep curl": ["Arms"],
  "hollow-body plank": ["Core"],
  "burpee": ["Full Body"],
  "conventional deadlift": ["Back", "Legs"],
  "push-up": ["Chest", "Arms", "Core"],
  "walking lunge": ["Legs"],
  "russian twist": ["Core"],
  "kettlebell swing": ["Full Body", "Shoulders"],
};

export default function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const workoutId = resolvedParams.id;

  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToTodayPlan, saveWorkout, todayPlan, savedWorkouts } = useWorkout();

  useEffect(() => {
    async function fetchWorkoutData() {
      try {
        setLoading(true);
        const res = await fetch(`https://api.abcz.workers.dev/api/fitlog/${workoutId}`);
        if (res.ok) {
          const data = await res.json();
          const item = data.data || data;
          if (item && (item.id || item.name)) {
            setWorkout(item);
            setLoading(false);
            return;
          }
        }

        const listRes = await fetch("https://api.abcz.workers.dev/api/fitlog");
        const listData = await listRes.json();
        const workoutList: WorkoutDetail[] = Array.isArray(listData) ? listData : listData.data || [];
        
        const found = workoutList.find(
          (w) => String(w.id) === String(workoutId)
        );
        setWorkout(found || null);
      } catch (err) {
        console.error("Failed to load workout details", err);
      } finally {
        setLoading(false);
      }
    }

    if (workoutId) {
      fetchWorkoutData();
    }
  }, [workoutId]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3 text-zinc-400 font-[family-name:var(--font-inter)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#ccff00]" />
        <p className="text-sm font-medium">Loading workout details…</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-center font-[family-name:var(--font-inter)]">
        <p className="text-zinc-400 text-base">Workout not found.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ccff00] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to library
        </Link>
      </div>
    );
  }

  const normalizedName = workout.name?.toLowerCase().trim() || "";
  const rawCategories = workout.category;
  let categories: string[] = [];

  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories = rawCategories.map((c) => (typeof c === "object" ? (c as any)?.name || "" : String(c)));
  } else if (typeof rawCategories === "string" && rawCategories.trim() !== "") {
    categories = rawCategories.split(",").map((c) => c.trim());
  }

  if (categories.length === 0 && workoutCategoryMap[normalizedName]) {
    categories = workoutCategoryMap[normalizedName];
  } else if (categories.length === 0) {
    categories = ["Full Body"];
  }

  const equipmentText = Array.isArray(workout.equipment)
    ? workout.equipment.join(", ")
    : workout.equipment || "Barbell, Bench";

  const defaultInstructions = [
    "Lie on the bench with eyes under the bar and feet planted.",
    "Unrack with locked elbows and lower the bar to mid-chest.",
    "Press up in a slight arc until elbows lock without bouncing.",
    "Keep shoulder blades pinched and a natural arch in the back.",
  ];

  const instructionsList =
    Array.isArray(workout.instructions) && workout.instructions.length > 0
      ? workout.instructions
      : defaultInstructions;

  const handleAddToPlan = () => {
    const exists = todayPlan.some((item) => String(item.id) === String(workout.id));
    if (exists) {
      toast.error("Already in your plan");
      return;
    }
    addToTodayPlan(workout as WorkoutItem);
    toast.success("Added to today's plan");
  };

  const handleSaveForLater = () => {
    const exists = savedWorkouts.some((item) => String(item.id) === String(workout.id));
    if (exists) {
      toast.error("Already in your saved list");
      return;
    }
    saveWorkout(workout as WorkoutItem);
    toast.success("Saved for later");
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto py-6 px-4 sm:px-6 font-[family-name:var(--font-inter)]">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO LIBRARY</span>
      </Link>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        
        {/* Left Column: Visual Media */}
        <div className="lg:col-span-6 w-full flex">
          <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 min-h-[380px]">
            <Image
              src={workout.image || "/banner.png"}
              alt={workout.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            {/* Header Info */}
            <div className="flex flex-col gap-2">
              <h1 className="font-[family-name:var(--font-oswald)] text-4xl sm:text-5xl font-bold uppercase tracking-wide text-white leading-none">
                {workout.name}
              </h1>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-normal">
                {workout.description ||
                  workout.subtitle ||
                  "A compound press that builds chest thickness, triceps, and pressing power from a stable bench."}
              </p>

              {/* Category Tag Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="bg-[#ccff00] text-black text-[11px] font-bold tracking-tight px-2.5 py-0.5 rounded-full capitalize"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Specs Table */}
            <div className="bg-[#121318] border border-zinc-800/80 rounded-xl overflow-hidden shadow-inner">
              <div className="divide-y divide-zinc-800/70 text-xs">
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">EQUIPMENT</span>
                  <span className="text-zinc-200 font-medium">{equipmentText}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">DIFFICULTY</span>
                  <span className="text-zinc-200 font-medium">{workout.difficulty || "Intermediate"}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">SETS</span>
                  <span className="text-zinc-200 font-medium">{workout.sets || 4}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">REPS</span>
                  <span className="text-zinc-200 font-medium">{workout.reps || "6-8"}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">DURATION</span>
                  <span className="text-zinc-200 font-medium">{workout.duration || 25} min</span>
                </div>
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">CALORIES</span>
                  <span className="text-zinc-200 font-medium">{workout.calories || 180} kcal</span>
                </div>
                <div className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold text-[11px]">RATING</span>
                  <span className="text-zinc-200 font-medium">{workout.rating || 4.8}</span>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="flex flex-col gap-2">
              <h2 className="font-[family-name:var(--font-oswald)] text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                INSTRUCTIONS
              </h2>
              <ol className="flex flex-col gap-2 text-xs sm:text-[13px] text-zinc-300 font-normal leading-relaxed">
                {instructionsList.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#ccff00] select-none font-bold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleAddToPlan}
              className="inline-flex items-center gap-2 bg-[#ccff00] hover:bg-[#b8e600] active:scale-95 text-black text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Add to today&apos;s plan</span>
            </button>

            <button
              onClick={handleSaveForLater}
              className="inline-flex items-center gap-2 border border-zinc-700/80 hover:border-zinc-500 text-zinc-200 bg-transparent hover:text-white active:scale-95 text-xs font-medium px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save for later</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
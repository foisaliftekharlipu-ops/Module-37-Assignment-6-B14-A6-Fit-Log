"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Star } from "lucide-react";

interface WorkoutCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workout: any;
}

// ডিজাইনের এক্সাক্ট ওয়ার্কআউট অনুযায়ী ক্যাটাগরি ম্যাপিং
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

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const workoutName = workout?.name || "";
  const normalizedName = workoutName.toLowerCase().trim();

  // ১. এপিআই ডেটা চেক করা
  const rawCategories =
    workout?.category ||
    workout?.categories ||
    workout?.target_muscle ||
    workout?.muscle_groups ||
    workout?.body_part;

  let categories: string[] = [];

  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    categories = rawCategories.map((c) =>
      typeof c === "object" ? c?.name || "" : String(c)
    );
  } else if (typeof rawCategories === "string" && rawCategories.trim() !== "") {
    categories = rawCategories.split(",").map((c) => c.trim());
  }

  // ২. যদি এপিআই থেকে না পাওয়া যায়, তবে নামের সাথে মিলিয়ে মেন্টরের নির্দিষ্ট পিল বসানো
  if (categories.length === 0 && workoutCategoryMap[normalizedName]) {
    categories = workoutCategoryMap[normalizedName];
  } else if (categories.length === 0) {
    categories = ["Fitness"];
  }

  // ইকুইপমেন্ট হ্যান্ডলিং
  const rawEquipment = workout?.equipment || workout?.equipments;
  const equipmentText = Array.isArray(rawEquipment)
    ? rawEquipment.join(", ")
    : typeof rawEquipment === "string"
    ? rawEquipment
    : "Bodyweight";

  return (
    <Link
      href={`/workout/${workout.id || workout._id}`}
      className="group flex flex-col bg-[#16181f] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-[#ccff00]/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/70"
    >
      {/* 1. Top Illustration / Image */}
      <div className="relative w-full aspect-[16/10] bg-zinc-900 overflow-hidden">
        <Image
          src={workout?.image || "/banner.png"}
          alt={workoutName || "Workout"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* 2. Card Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Category Tag Pills */}
          <div className="flex flex-wrap items-center gap-1.5 min-h-[22px]">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="bg-[#ccff00] text-black text-[11px] font-bold tracking-tight px-2.5 py-0.5 rounded-full capitalize leading-none"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Workout Name */}
          <h3 className="font-[family-name:var(--font-oswald)] text-xl font-bold uppercase tracking-wide text-white leading-tight mt-1 group-hover:text-[#ccff00] transition-colors">
            {workoutName}
          </h3>

          {/* Equipment Line */}
          <p className="text-zinc-400 text-xs font-normal line-clamp-1">
            {equipmentText}
          </p>
        </div>

        {/* 3. Stats Row with Neon Icons */}
        <div className="flex items-center gap-4 text-xs text-zinc-300 font-medium pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>{workout?.duration ?? 0} min</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>{workout?.calories ?? 0} kcal</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>{workout?.rating ?? 4.5}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
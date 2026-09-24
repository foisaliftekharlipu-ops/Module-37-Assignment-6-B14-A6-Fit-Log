"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Flame, Star } from "lucide-react";

interface WorkoutCardProps {
  workout: Record<string, unknown>;
}

const workoutStatsMap: Record<
  string,
  { categories: string[]; duration: number; calories: number; rating: number }
> = {
  "barbell bench press": {
    categories: ["Chest", "Arms"],
    duration: 25,
    calories: 180,
    rating: 4.8,
  },
  "pull-up": {
    categories: ["Back", "Arms"],
    duration: 15,
    calories: 120,
    rating: 4.7,
  },
  "back squat": {
    categories: ["Legs", "Core"],
    duration: 30,
    calories: 240,
    rating: 4.9,
  },
  "overhead press": {
    categories: ["Shoulders", "Arms"],
    duration: 20,
    calories: 150,
    rating: 4.6,
  },
  "dumbbell bicep curl": {
    categories: ["Arms"],
    duration: 12,
    calories: 80,
    rating: 4.3,
  },
  "hollow-body plank": {
    categories: ["Core"],
    duration: 10,
    calories: 60,
    rating: 4.4,
  },
  burgee: {
    categories: ["Full Body"],
    duration: 12,
    calories: 160,
    rating: 4.2,
  },
  "conventional deadlier": {
    categories: ["Back", "Legs"],
    duration: 28,
    calories: 260,
    rating: 4.9,
  },
  "push-up": {
    categories: ["Chest", "Arms", "Core"],
    duration: 10,
    calories: 90,
    rating: 4.5,
  },
  "walking lunge": {
    categories: ["Legs"],
    duration: 18,
    calories: 170,
    rating: 4.4,
  },
  "russian twist": {
    categories: ["Core"],
    duration: 8,
    calories: 70,
    rating: 4.1,
  },
  "kettleful swing": {
    categories: ["Full Body", "Shoulders"],
    duration: 16,
    calories: 200,
    rating: 4.7,
  },
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const workoutName = typeof workout?.name === "string" ? workout.name : "";
  const normalizedName = workoutName.toLowerCase().trim();
  const fallback = workoutStatsMap[normalizedName];

  const rawCategories =
    workout?.category ||
    workout?.categories ||
    workout?.target_muscle ||
    workout?.muscle_groups;

  let categories: string[] = [];
  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    categories = rawCategories.map((c: unknown) => {
      if (typeof c === "object" && c !== null && "name" in c) {
        return String((c as { name: unknown }).name || "");
      }
      return String(c ?? "");
    });
  } else if (typeof rawCategories === "string" && rawCategories.trim() !== "") {
    categories = rawCategories.split(",").map((c) => c.trim());
  }

  if (categories.length === 0 && fallback) {
    categories = fallback.categories;
  } else if (categories.length === 0) {
    categories = ["Fitness"];
  }

  const rawCalories =
    workout?.calories ??
    workout?.calories_burned ??
    workout?.caloriesBurned ??
    workout?.calorie;

  let caloriesVal = 0;
  if (typeof rawCalories === "number" && rawCalories > 0) {
    caloriesVal = rawCalories;
  } else if (typeof rawCalories === "string") {
    const matched = rawCalories.match(/\d+/);
    if (matched && parseInt(matched[0], 10) > 0) {
      caloriesVal = parseInt(matched[0], 10);
    }
  }

  if (caloriesVal === 0) {
    caloriesVal = fallback?.calories || 180;
  }

  const rawDuration = workout?.duration ?? workout?.time;
  let durationVal = 0;
  if (typeof rawDuration === "number" && rawDuration > 0) {
    durationVal = rawDuration;
  } else if (typeof rawDuration === "string") {
    const matched = rawDuration.match(/\d+/);
    if (matched && parseInt(matched[0], 10) > 0) {
      durationVal = parseInt(matched[0], 10);
    }
  }

  if (durationVal === 0) {
    durationVal = fallback?.duration || 25;
  }

  const rawRating = workout?.rating;
  const ratingVal =
    typeof rawRating === "number" || typeof rawRating === "string"
      ? rawRating
      : fallback?.rating || 4.8;

  const rawEquipment = workout?.equipment || workout?.equipments;
  const equipmentText = Array.isArray(rawEquipment)
    ? rawEquipment.join(", ")
    : typeof rawEquipment === "string"
      ? rawEquipment
      : "Barbell, Bench";

  const imageSrc =
    typeof workout?.image === "string" && workout.image.trim() !== ""
      ? workout.image
      : typeof workout?.thumbnail === "string" &&
          workout.thumbnail.trim() !== ""
        ? workout.thumbnail
        : "/banner.png";

  return (
    <Link
      href={`/workout/${workout.id || workout._id}`}
      className="group flex flex-col bg-[#16181f] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-[#ccff00]/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/70"
    >
      <div className="relative w-full aspect-16/10 bg-zinc-900 overflow-hidden">
        <Image
          src={imageSrc}
          alt={workoutName || "Workout"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5 min-h-5.5">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="bg-[#ccff00] text-black text-[11px] font-bold tracking-tight px-2.5 py-0.5 rounded-full capitalize leading-none"
              >
                {cat}
              </span>
            ))}
          </div>

          <h3 className="font-[--font-oswald] text-xl font-bold uppercase tracking-wide text-white leading-tight mt-1 group-hover:text-[#ccff00] transition-colors">
            {workoutName}
          </h3>

          <p className="text-zinc-400 text-xs font-normal line-clamp-1">
            {equipmentText}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-300 font-medium pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>{durationVal} min</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>{caloriesVal} kcal</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#ccff00]" />
            <span>{ratingVal}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

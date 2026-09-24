"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Flame, Star } from "lucide-react";
import { Workout } from "@/context/WorkoutContext";

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    const raw = workout as unknown as Record<string, unknown>;
    return (
      (raw.image as string) ||
      (raw.img as string) ||
      (raw.thumbnail as string) ||
      (raw.imageUrl as string) ||
      "/banner.png"
    );
  });

  const rawItem = workout as unknown as Record<string, unknown>;

  const caloriesVal =
    rawItem.calories ??
    rawItem.caloriesBurned ??
    rawItem.calorie ??
    rawItem.calories_burned ??
    0;

  const durationVal =
    rawItem.duration ??
    rawItem.time ??
    rawItem.durationMinutes ??
    0;

  const ratingVal =
    rawItem.rating ??
    rawItem.rate ??
    rawItem.stars;

  const equipmentText = Array.isArray(workout.equipment)
    ? workout.equipment.join(", ")
    : workout.equipment || "Bodyweight";

  const tags: string[] = [];
  if (workout.category) {
    const category = Array.isArray(workout.category)
      ? workout.category.join(", ")
      : workout.category;
    tags.push(category);
  }
  if (workout.muscle && !tags.includes(workout.muscle)) tags.push(workout.muscle);

  return (
    <Link
      href={`/workout/${workout.id}`}
      className="bg-[#12141a] border border-zinc-800/80 rounded-3xl overflow-hidden flex-col transition-all duration-300 hover:border-zinc-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#ccff00] focus:border-[#ccff00] active:ring-2 active:ring-[#ccff00] active:border-[#ccff00] group block cursor-pointer select-none"
    >
      <div className="relative w-full aspect-4/3 bg-zinc-900 overflow-hidden">
        <Image
          src={imgSrc}
          alt={workout.name || "Workout"}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgSrc("/banner.png")}
        />
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#ccff00] text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-(family-name:--font-oswald) text-xl font-bold uppercase tracking-wide text-white group-hover:text-[#ccff00] transition-colors">
            {workout.name}
          </h3>

          <p className="text-xs text-zinc-400 mt-1">{equipmentText}</p>

          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
              {durationVal ? `${durationVal} min` : "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#ccff00]" />
              {caloriesVal ? `${caloriesVal} kcal` : "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {ratingVal !== undefined && ratingVal !== null ? `${ratingVal}` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
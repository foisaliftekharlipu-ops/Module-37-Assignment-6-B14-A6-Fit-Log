export const workoutImageMap: Record<string, string> = {
  "barbell bench press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80",
  "pull-up": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80",
  "back squat": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
  "overhead press": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80",
  "dumbbell bicep curl": "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&auto=format&fit=crop&q=80",
  "hollow-body plank": "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80",
  "burpee": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
  "conventional deadlift": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
  "push-up": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80",
  "walking lunge": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80",
  "russian twist": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80",
  "kettlebell swing": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
};

export const defaultWorkoutImage =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80";

export function getWorkoutImage(workout: Record<string, unknown> | null | undefined): string {
  const name = String(workout?.name || "").toLowerCase().trim();
  const rawImg = workout?.image || workout?.imageUrl || workout?.thumbnail || workout?.img;

  if (typeof rawImg === "string" && rawImg.includes("img.magnific.com")) {
    return workoutImageMap[name] || defaultWorkoutImage;
  }

  if (typeof rawImg === "string" && rawImg.trim() !== "") {
    return rawImg;
  }

  return workoutImageMap[name] || defaultWorkoutImage;
}
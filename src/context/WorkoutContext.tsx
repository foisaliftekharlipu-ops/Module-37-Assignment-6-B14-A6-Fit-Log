"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

export interface Workout {
  id: string | number;
  _id?: string | number;
  name: string;
  category?: string;
  muscle?: string;
  equipment?: string | string[];
  duration?: number | string;
  calories?: number | string;
  rating?: number | string;
  image?: string;
  instructions?: string;
}

export interface WorkoutContextType {
  todayPlan: Workout[];
  savedWorkouts: Workout[];
  activeTab: "plan" | "saved";
  setActiveTab: (tab: "plan" | "saved") => void;
  addToPlan: (workout: Workout) => void;
  removeFromPlan: (id: string | number, silent?: boolean) => void;
  clearPlan: () => void;
  saveWorkout: (workout: Workout) => void;
  addToSaved: (workout: Workout) => void;
  removeFromSaved: (id: string | number) => void;
  toggleSaveWorkout: (workout: Workout) => void;
  isSaved: (id: string | number) => boolean;
  isInPlan: (id: string | number) => boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [todayPlan, setTodayPlan] = useState<Workout[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const storedPlan = localStorage.getItem("fitlog_todayPlan");
      return storedPlan ? JSON.parse(storedPlan) : [];
    } catch (e) {
      console.error("Failed to load plan from localStorage:", e);
      return [];
    }
  });
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const storedSaved = localStorage.getItem("fitlog_savedWorkouts");
      return storedSaved ? JSON.parse(storedSaved) : [];
    } catch (e) {
      console.error("Failed to load saved workouts from localStorage:", e);
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");

  useEffect(() => {
    localStorage.setItem("fitlog_todayPlan", JSON.stringify(todayPlan));
  }, [todayPlan]);

  useEffect(() => {
    localStorage.setItem(
      "fitlog_savedWorkouts",
      JSON.stringify(savedWorkouts)
    );
  }, [savedWorkouts]);

  const isInPlan = (id: string | number) => {
    return todayPlan.some((item) => String(item.id) === String(id));
  };

  const isSaved = (id: string | number) => {
    return savedWorkouts.some((item) => String(item.id) === String(id));
  };

  const addToPlan = (workout: Workout) => {
    if (isInPlan(workout.id)) {
      toast.error("Already added to today's plan");
      return;
    }
    if (todayPlan.length >= 5) {
      toast.error("Cap reached: Maximum 5 workouts allowed per day");
      return;
    }
    setTodayPlan((prev) => [...prev, workout]);
    toast.success("Added to today's plan");
  };

  const removeFromPlan = (id: string | number, silent = false) => {
    setTodayPlan((prev) => prev.filter((item) => String(item.id) !== String(id)));
    if (!silent) {
      toast.success("Removed from today's plan");
    }
  };

  const clearPlan = () => {
    setTodayPlan([]);
    toast.success("Plan cleared");
  };

  const removeFromSaved = (id: string | number) => {
    setSavedWorkouts((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
    toast.success("Removed from saved workouts");
  };

  const toggleSaveWorkout = (workout: Workout) => {
    if (isSaved(workout.id)) {
      setSavedWorkouts((prev) =>
        prev.filter((item) => String(item.id) !== String(workout.id))
      );
      toast.success("Removed from saved workouts");
    } else {
      setSavedWorkouts((prev) => [...prev, workout]);
      toast.success("Saved to workout bookmarks");
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        todayPlan,
        savedWorkouts,
        activeTab,
        setActiveTab,
        addToPlan,
        removeFromPlan,
        clearPlan,
        saveWorkout: toggleSaveWorkout,
        addToSaved: toggleSaveWorkout,
        removeFromSaved,
        toggleSaveWorkout,
        isSaved,
        isInPlan,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
}
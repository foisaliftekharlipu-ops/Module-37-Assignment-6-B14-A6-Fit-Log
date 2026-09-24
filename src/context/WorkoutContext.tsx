"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const defaultWorkoutStats: Record<string, { duration: number; calories: number; rating: number }> = {
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

export interface WorkoutItem {
  id: string | number;
  name: string;
  image?: string;
  category?: string | string[];
  equipment?: string | string[];
  difficulty?: string;
  sets?: number | string;
  reps?: string;
  duration?: number | string;
  calories?: number | string;
  rating?: number | string;
  completedSets?: number;
}

interface WorkoutContextType {
  todayPlan: WorkoutItem[];
  savedWorkouts: WorkoutItem[];
  activeTab: "plan" | "saved";
  setActiveTab: (tab: "plan" | "saved") => void;
  addToTodayPlan: (workout: WorkoutItem) => void;
  removeFromTodayPlan: (id: string | number) => void;
  saveWorkout: (workout: WorkoutItem) => void;
  removeFromSaved: (id: string | number) => void;
  clearAll: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [todayPlan, setTodayPlan] = useState<WorkoutItem[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<WorkoutItem[]>([]);
  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem("fitlog_todayPlan");
      const storedSaved = localStorage.getItem("fitlog_savedWorkouts");
      if (storedPlan) setTodayPlan(JSON.parse(storedPlan));
      if (storedSaved) setSavedWorkouts(JSON.parse(storedSaved));
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fitlog_todayPlan", JSON.stringify(todayPlan));
    }
  }, [todayPlan, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fitlog_savedWorkouts", JSON.stringify(savedWorkouts));
    }
  }, [savedWorkouts, isLoaded]);

  const normalizeItem = (workout: WorkoutItem): WorkoutItem => {
    const nameKey = String(workout.name || "").toLowerCase().trim();
    const fallback = defaultWorkoutStats[nameKey] || { duration: 25, calories: 180, rating: 4.8 };
    
    let finalCalories = Number(workout.calories);
    if (!finalCalories || isNaN(finalCalories)) {
      const matched = String(workout.calories || "").match(/\d+/);
      finalCalories = matched ? parseInt(matched[0], 10) : fallback.calories;
    }

    let finalDuration = Number(workout.duration);
    if (!finalDuration || isNaN(finalDuration)) {
      const matched = String(workout.duration || "").match(/\d+/);
      finalDuration = matched ? parseInt(matched[0], 10) : fallback.duration;
    }

    return {
      ...workout,
      calories: finalCalories,
      duration: finalDuration,
      rating: workout.rating || fallback.rating,
      completedSets: workout.completedSets || 0,
    };
  };

  const addToTodayPlan = (workout: WorkoutItem) => {
    if (todayPlan.length >= 5) {
      toast.error("Cap reached: You can only add up to 5 lifts for today!");
      return;
    }
    const prepared = normalizeItem(workout);
    setTodayPlan((prev) => {
      if (prev.some((item) => String(item.id) === String(prepared.id))) return prev;
      return [...prev, prepared];
    });
  };

  const removeFromTodayPlan = (id: string | number) => {
    setTodayPlan((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const saveWorkout = (workout: WorkoutItem) => {
    const prepared = normalizeItem(workout);
    setSavedWorkouts((prev) => {
      if (prev.some((item) => String(item.id) === String(prepared.id))) return prev;
      return [...prev, prepared];
    });
  };

  const removeFromSaved = (id: string | number) => {
    setSavedWorkouts((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const clearAll = () => {
    setTodayPlan([]);
    setSavedWorkouts([]);
    localStorage.removeItem("fitlog_todayPlan");
    localStorage.removeItem("fitlog_savedWorkouts");
  };

  return (
    <WorkoutContext.Provider
      value={{
        todayPlan,
        savedWorkouts,
        activeTab,
        setActiveTab,
        addToTodayPlan,
        removeFromTodayPlan,
        saveWorkout,
        removeFromSaved,
        clearAll,
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
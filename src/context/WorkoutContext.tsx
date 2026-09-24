"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface Workout {
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
  instructions?: string[];
  description?: string;
}

interface WorkoutContextType {
  todayPlan: Workout[];
  savedWorkouts: Workout[];
  activeTab: "plan" | "saved";
  setActiveTab: (tab: "plan" | "saved") => void;
  addToPlan: (workout: Workout) => void;
  removeFromPlan: (id: string | number, silent?: boolean) => void;
  removeFromSaved: (id: string | number) => void;
  toggleSaveWorkout: (workout: Workout) => void;
  isSaved: (id: string | number) => boolean;
  isInPlan: (id: string | number) => boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [todayPlan, setTodayPlan] = useState<Workout[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const storedPlan = localStorage.getItem("fitlog_todayPlan");
      return storedPlan ? JSON.parse(storedPlan) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const storedSaved = localStorage.getItem("fitlog_savedWorkouts");
      return storedSaved ? JSON.parse(storedSaved) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");

  useEffect(() => {
    localStorage.setItem("fitlog_todayPlan", JSON.stringify(todayPlan));
  }, [todayPlan]);

  useEffect(() => {
    localStorage.setItem("fitlog_savedWorkouts", JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);

  const isInPlan = (id: string | number) =>
    todayPlan.some((w) => String(w.id) === String(id));

  const isSaved = (id: string | number) =>
    savedWorkouts.some((w) => String(w.id) === String(id));

  // Cap of 5 lifts হ্যান্ডলিং সহ addToPlan
  const addToPlan = (workout: Workout) => {
    if (isInPlan(workout.id)) {
      toast.error("Already in your plan");
      return;
    }

    if (todayPlan.length >= 5) {
      toast.error("You have reached the daily cap of 5 workouts");
      return;
    }

    setTodayPlan((prev) => [...prev, workout]);
    toast.success("Added to today's plan");
  };

  const removeFromPlan = (id: string | number, silent = false) => {
    setTodayPlan((prev) => prev.filter((w) => String(w.id) !== String(id)));
    if (!silent) {
      toast.success("Removed from plan");
    }
  };

  const removeFromSaved = (id: string | number) => {
    setSavedWorkouts((prev) => prev.filter((w) => String(w.id) !== String(id)));
    toast.success("Removed from saved list");
  };

  const toggleSaveWorkout = (workout: Workout) => {
    if (isSaved(workout.id)) {
      toast.error("Already in your saved list");
      return;
    }
    setSavedWorkouts((prev) => [...prev, workout]);
    toast.success("Saved for later");
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
  if (!context) throw new Error("useWorkout must be used within WorkoutProvider");
  return context;
}
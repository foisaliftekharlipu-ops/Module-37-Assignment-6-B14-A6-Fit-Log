"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Workout } from "@/types/workout";

interface WorkoutContextType {
  todayPlan: Workout[];
  savedWorkouts: Workout[];
  addToPlan: (workout: Workout) => void;
  saveForLater: (workout: Workout) => void;
  removeFromPlan: (id: string | number) => void;
  removeFromSaved: (id: string | number) => void;
  markAsDone: (id: string | number) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [todayPlan, setTodayPlan] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const localPlan = localStorage.getItem("fitlog_today_plan");
      const localSaved = localStorage.getItem("fitlog_saved");
      if (localPlan) setTodayPlan(JSON.parse(localPlan));
      if (localSaved) setSavedWorkouts(JSON.parse(localSaved));
    } catch {
      console.error("Failed to load workouts from localStorage");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fitlog_today_plan", JSON.stringify(todayPlan));
      localStorage.setItem("fitlog_saved", JSON.stringify(savedWorkouts));
    }
  }, [todayPlan, savedWorkouts, isLoaded]);

  const addToPlan = (workout: Workout) => {
    if (todayPlan.length >= 5) {
      toast.error("Cap reached! Maximum 5 lifts allowed for today.");
      return;
    }
    if (todayPlan.some((w) => String(w.id) === String(workout.id))) {
      toast("Already in today's plan!", { icon: "⚠️" });
      return;
    }
    setTodayPlan((prev) => [...prev, { ...workout, isDone: false }]);
    toast.success("Added to today's plan!");
  };

  const saveForLater = (workout: Workout) => {
    if (savedWorkouts.some((w) => String(w.id) === String(workout.id))) {
      toast("Already saved!", { icon: "⚠️" });
      return;
    }
    setSavedWorkouts((prev) => [...prev, workout]);
    toast.success("Saved for later!");
  };

  const removeFromPlan = (id: string | number) => {
    setTodayPlan((prev) => prev.filter((w) => String(w.id) !== String(id)));
    toast.success("Workout removed from plan!");
  };

  const removeFromSaved = (id: string | number) => {
    setSavedWorkouts((prev) => prev.filter((w) => String(w.id) !== String(id)));
    toast.success("Removed from saved list!");
  };

  const markAsDone = (id: string | number) => {
    setTodayPlan((prev) =>
      prev.map((w) => (String(w.id) === String(id) ? { ...w, isDone: !w.isDone } : w))
    );
    toast.success("Workout marked as done!");
  };

  return (
    <WorkoutContext.Provider
      value={{
        todayPlan,
        savedWorkouts,
        addToPlan,
        saveForLater,
        removeFromPlan,
        removeFromSaved,
        markAsDone,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error("useWorkout must be used within WorkoutProvider");
  return context;
};
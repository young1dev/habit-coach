import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as api from "./api";
import type { Archetype } from "./types";

export const queryKeys = {
  habits: ["habits"] as const,
  history: ["history"] as const,
  stats: ["stats"] as const,
};

export function useHabits() {
  return useQuery({ queryKey: queryKeys.habits, queryFn: api.getHabits });
}

export function useHistory() {
  return useQuery({ queryKey: queryKeys.history, queryFn: api.getHistory });
}

export function useStats() {
  return useQuery({ queryKey: queryKeys.stats, queryFn: api.getStats });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; archetype: Archetype }) => api.createHabit(input),
    onSuccess: (habit) => {
      qc.invalidateQueries({ queryKey: queryKeys.habits });
      toast.success(`"${habit.name}" created`);
    },
    onError: () => toast.error("Could not create the habit. Please try again."),
  });
}

export function useUpdateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; name: string; archetype: Archetype }) =>
      api.updateHabit(input.id, { name: input.name, archetype: input.archetype }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.habits });
      toast.success("Habit updated");
    },
    onError: () => toast.error("Could not update the habit."),
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteHabit(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.habits });
      qc.invalidateQueries({ queryKey: queryKeys.history });
      toast.success("Habit deleted");
    },
    onError: () => toast.error("Could not delete the habit."),
  });
}

export function usePredict() {
  return useMutation({
    mutationFn: api.predict,
    onError: () => toast.error("Prediction failed. Check your connection and retry."),
  });
}

export function useLogOutcome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.logOutcome,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.history });
      qc.invalidateQueries({ queryKey: queryKeys.habits });
      toast.success("Outcome logged for today");
    },
    onError: () => toast.error("Could not log today's outcome."),
  });
}

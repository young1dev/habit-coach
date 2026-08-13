import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListTodo, Plus } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitFormDialog, type HabitFormValues } from "@/components/habits/HabitFormDialog";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateHabit, useDeleteHabit, useHabits, useUpdateHabit } from "@/lib/queries";
import type { Habit } from "@/lib/types";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits — ZICO Habit Intelligence" },
      {
        name: "description",
        content: "Manage every tracked habit, its archetype, streak and completion rate.",
      },
      { property: "og:title", content: "Habits — ZICO Habit Intelligence" },
      {
        property: "og:description",
        content: "Manage every tracked habit, its archetype, streak and completion rate.",
      },
    ],
  }),
  component: HabitsPage,
});

function HabitsPage() {
  const habits = useHabits();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Habit | null>(null);

  const handleSubmit = async (values: HabitFormValues) => {
    if (editing) {
      await updateHabit.mutateAsync({ id: editing.id, ...values });
    } else {
      await createHabit.mutateAsync(values);
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Your library"
        title="Habits"
        description="Each habit trains its own view of your day. Archetypes shape how the model weighs your inputs."
        action={
          <Button
            className="hidden rounded-full sm:inline-flex"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add habit
          </Button>
        }
      />

      <div className="mt-8">
        {habits.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-3xl" />
            ))}
          </div>
        ) : habits.data?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {habits.data.map((habit, index) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                index={index}
                onEdit={(h) => {
                  setEditing(h);
                  setFormOpen(true);
                }}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ListTodo}
            title="No habits yet"
            description="Create your first habit to start generating daily predictions."
            action={
              <Button className="rounded-full" onClick={() => setFormOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" /> Add habit
              </Button>
            }
          />
        )}
      </div>

      <Button
        size="icon"
        className="fixed bottom-24 right-5 z-30 h-14 w-14 rounded-full shadow-lift sm:hidden"
        onClick={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        aria-label="Add habit"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <HabitFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        habit={editing}
        pending={createHabit.isPending || updateHabit.isPending}
        onSubmit={handleSubmit}
      />

      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete "${pendingDelete?.name ?? ""}"?`}
        description="This removes the habit and its logged history. This action cannot be undone."
        confirmLabel="Delete habit"
        destructive
        onConfirm={() => {
          if (pendingDelete) deleteHabit.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </PageContainer>
  );
}

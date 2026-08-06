import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ARCHETYPES, type Archetype, type Habit } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "Give the habit a name of at least 2 characters").max(60),
  archetype: z.enum([
    "Student",
    "Professional",
    "Deep Worker",
    "Early Bird",
    "Night Owl",
    "Recovery",
    "Custom",
  ]),
});

export type HabitFormValues = z.infer<typeof schema>;

export function HabitFormDialog({
  open,
  onOpenChange,
  habit,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null | undefined;
  pending?: boolean | undefined;
  onSubmit: (values: HabitFormValues) => void;
}) {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", archetype: "Student" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: habit?.name ?? "",
        archetype: (habit?.archetype ?? "Student") as Archetype,
      });
    }
  }, [open, habit, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{habit ? "Edit habit" : "Create habit"}</DialogTitle>
          <DialogDescription>
            Archetypes tune the model to the rhythm of your day.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit name</FormLabel>
                  <FormControl>
                    <Input placeholder="Deep work — 90 minutes" className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="archetype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Archetype</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select an archetype" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl">
                      {ARCHETYPES.map((archetype) => (
                        <SelectItem key={archetype} value={archetype}>
                          {archetype}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full" disabled={pending}>
                {pending ? <LoadingSpinner label="Saving" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

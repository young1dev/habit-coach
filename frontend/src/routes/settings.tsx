import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Info, Laptop, Moon, Smartphone, Sun, Upload } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";


import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useTheme, type ThemeMode } from "@/lib/theme";
import { clearAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ZICO Habit Intelligence" },
      {
        name: "description",
        content: "Choose your theme, review the active prediction model, and export or import data.",
      },
      { property: "og:title", content: "Settings — ZICO Habit Intelligence" },
      {
        property: "og:description",
        content: "Theme, model information and data portability for ZICO.",
      },
    ],
  }),
  component: SettingsPage,
});

const THEMES: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-6">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const queryClient = useQueryClient();

const handleLogout = () => {
  clearAuth();
  queryClient.clear();
  navigate({ to: "/auth", replace: true });
};
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const [importOpen, setImportOpen] = useState(false);

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Preferences"
        title="Settings"
        description="Personalize the interface and manage your habit data."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel title="Theme" description="Applies instantly across the app.">
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.value}
                type="button"
                onClick={() => setMode(theme.value)}
                aria-pressed={mode === theme.value}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 text-xs font-semibold transition-all",
                  mode === theme.value
                    ? "border-primary bg-primary-soft text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <theme.icon className="h-4 w-4" />
                {theme.label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Model information" description="Which model is scoring your check-ins.">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Current model</dt>
              <dd className="font-semibold">Default Student Model</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Version</dt>
              <dd className="font-semibold tabular-nums">v0.9.2</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Personalized model</dt>
              <dd className="rounded-full bg-warning-soft px-2.5 py-1 text-[11px] font-semibold text-warning">
                Unlocks at 30 logged days
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Device information" description="Detected context used for local defaults.">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                <Smartphone className="h-4 w-4" />
              </span>
              <span className="min-w-0 truncate text-muted-foreground">
                Platform detection is handled on the client at runtime.
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Timezone</span>
              <span className="font-semibold">Auto (system)</span>
            </div>
          </div>
        </Panel>

        <Panel title="Data" description="Move your habit history between devices.">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => toast.success("Export started — your data will download shortly.")}
            >
              <Download className="mr-1.5 h-4 w-4" /> Export data
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setImportOpen(true)}>
              <Upload className="mr-1.5 h-4 w-4" /> Import data
            </Button>
          </div>
        </Panel>

        <Panel title="About" description="ZICO Habit Intelligence">
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Info className="h-4 w-4" />
            </span>
            <p className="leading-relaxed">
              ZICO combines a machine-learning completion model with an LLM coach so each day starts
              with a realistic plan instead of a guess. Frontend build v1.0.
            </p>
          </div>
        </Panel>
      </div>

      <Button
        variant="destructive"
        className="rounded-full"
        onClick={() => {
          clearAuth();
          queryClient.clear();
          navigate({ to: "/auth", replace: true });
        }}
      >
        Log Out
      </Button>

      <ConfirmationDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import habit data?"
        description="Importing replaces your current local habits and logs with the contents of the file."
        confirmLabel="Import and replace"
        onConfirm={() => toast.success("Import complete — 42 logs restored.")}
      />

    </PageContainer>
  );
}

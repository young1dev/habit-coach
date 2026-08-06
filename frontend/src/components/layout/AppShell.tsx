import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarCheck,
  History,
  LayoutDashboard,
  ListTodo,
  Settings,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListTodo },
  { to: "/checkin", label: "Check-in", icon: CalendarCheck },
  { to: "/history", label: "History", icon: History },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-sm font-bold leading-tight">ZICO</span>
            <span className="block text-[11px] text-muted-foreground">Habit Intelligence</span>
          </span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.to)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="rounded-2xl bg-primary-soft p-4">
          <p className="text-xs font-semibold text-accent-foreground">Default Student Model</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Personalized model unlocks after 30 logged days.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2.5 px-4 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0 truncate font-display text-sm font-bold">
              ZICO Habit Intelligence
            </span>
          </div>
        </header>

        <main className="pb-24 lg:pb-0">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-xl lg:hidden">
        <ul className="grid grid-cols-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  isActive(item.to) ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

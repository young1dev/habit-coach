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
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListTodo },
  { to: "/checkin", label: "Check-in", icon: CalendarCheck },
  { to: "/history", label: "History", icon: History },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(to));

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar/80 px-4 py-6 backdrop-blur-xl lg:flex">
        <div className="glass-panel rounded-[28px] p-3">
          <Link to="/dashboard" className="flex items-center gap-3 px-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-lift">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-bold leading-tight">ZICO</span>
              <span className="block text-[11px] text-muted-foreground">Habit Intelligence</span>
            </span>
          </Link>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive(item.to)
                  ? "bg-gradient-to-r from-primary-soft to-violet-100 text-primary shadow-soft"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <span className={cn(
                "grid h-8 w-8 place-items-center rounded-xl border border-current/10",
                isActive(item.to) ? "bg-white/70" : "bg-transparent",
              )}>
                <item.icon className="h-4 w-4 shrink-0" />
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="glass-panel rounded-[24px] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Default model</p>
          <p className="mt-2 text-sm font-semibold text-foreground">Stay consistent</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Personalized coaching unlocks after 30 logged days.
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2.5 px-4 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-soft">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0 truncate font-display text-sm font-bold">
              ZICO
            </span>
          </div>
        </header>

        <main className="pb-24 lg:pb-0">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl lg:hidden">
        <ul className="grid grid-cols-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-all duration-200",
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

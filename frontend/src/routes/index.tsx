import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ShieldCheck, TicketsPlane, TriangleAlert, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Habit Coach — Smarter habit tracking" },
      {
        name: "description",
        content:
          "A calmer, smarter way to track habits, predict momentum, and stay on course with daily AI guidance.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const featureList = [
    "Predict your chances of success each day",
    "Track routines that actually compound over time",
    "Get AI coaching tied to your sleep, mood, and consistency etc.",
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div>
            <div className="font-display text-2xl font-bold  tracking-tighter text-slate-900">Habit Coach</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Daily momentum</div>
          </div>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" asChild className="rounded-full text-slate-700 hover:bg-transparent border border-slate-200 hover:text-slate-900">
            <Link to="/auth/login">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
            <Link to="/auth/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-14">
          <div>
            <h1 className="mt-6 max-w-xl font-display text-4xl font-bold tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
              Small habits. Big momentum. Clearer decisions.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Habit Coach helps you stay consistent with a calmer daily system: track what matters, predict risk early, and get practical AI coaching before routines slip.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
              >
                <Link to="/auth/register">
                  Get Started for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-slate-200 bg-white text-slate-700 hover:border-[#6F896C] hover:bg-[#F7F6F0] hover:text-[#252A25]"
              >
                <Link to="/auth/login">Sign in</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-700">
              {featureList.map((item) => (
                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:justify-self-center">
            <div className="absolute -inset-10 rounded-[40px] bg-blue-500/25 blur-3xl" />

            <div className="relative z-10 overflow-hidden rounded-[16px]
                  border border-white/70
                  translate-x-5 -translate-y-10 
                  shadow-[0_30px_80px_-15px_rgba(37,99,235,0.35)]
                  ">
              <img
                src="../ui-preview.png"
                alt="Habit Coach mobile dashboard"
                className="h-[520px] w-full object-cover object-top"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {[
            { title: "Smart check-ins", text: "Capture mood, workload, and consistency in under a minute.", icon: TicketsPlane },
            { title: "Daily risk model", text: "See what is likely to derail momentum before it happens.", icon: TriangleAlert },
            { title: "Gentle accountability", text: "Get practical prompts that support your habits instead of judging them.", icon: Lightbulb },
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

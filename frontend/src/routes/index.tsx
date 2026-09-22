import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, PlayCircle, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

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
    "Get AI coaching tied to your sleep, mood, and consistency",
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="font-display text-lg font-bold tracking-[-0.04em] text-slate-900">Habit Coach</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Daily momentum</div>
          </div>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" asChild className="rounded-full text-slate-700 hover:bg-white">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
            <Link to="/auth">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
              <TrendingUp className="h-3.5 w-3.5 text-slate-700" />
              Built for consistent progress
            </div>

            <h1 className="mt-6 max-w-xl font-display text-4xl font-bold tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
              Small habits. Big momentum. Clearer decisions.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Habit Coach helps you stay consistent with a calmer daily system: track what matters, predict risk early, and get practical AI coaching before routines slip.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                <Link to="/auth">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                <Link to="/auth">See the product</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-700">
              {featureList.map((item) => (
                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:justify-self-end">
            <div className="absolute -inset-5 -z-10 rounded-[38px] bg-[radial-gradient(circle,_rgba(15,23,42,0.04),transparent_60%)] blur-3xl" />
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-3 shadow-[0_30px_80px_rgba(15,23,42,0.06)]">
              <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950">
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/85 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-slate-300">
                  <span>Habit Coach</span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">Live</span>
                </div>

                <video
                  className="h-[440px] w-full object-cover opacity-95"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                >
                  <source src="https://cdn.coverr.co/videos/coverr-working-on-the-laptop-1560040388886/1080p.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-slate-900/70 p-3 shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Today</p>
                      <p className="mt-1 text-lg font-semibold text-white">89% chance of completion</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                      Stable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {[
            { title: "Smart check-ins", text: "Capture mood, workload, and consistency in under a minute." },
            { title: "Daily risk model", text: "See what is likely to derail momentum before it happens." },
            { title: "Gentle accountability", text: "Get practical prompts that support your habits instead of judging them." },
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <PlayCircle className="h-5 w-5" />
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

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-border bg-card/90 p-5 shadow-lift backdrop-blur-xl sm:p-7">
        <div className="mb-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Habit Coach
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin((value) => !value)}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {isLogin
              ? "Don't have an account? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/LoginForm";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-border bg-card/90 p-5 shadow-lift backdrop-blur-xl sm:p-7">
        <div className="mb-6 text-center">
          <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.04em] text-foreground">
            {"Welcome back"}
          </h1>
        </div>

        {<LoginForm />}

        <div className="mt-6 text-center">
          <Link
            to="/auth/register"
            className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
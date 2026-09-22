import { useLogin } from "@/lib/queries";
import { useState } from "react";

export function LoginForm() {
    const loginMutation = useLogin();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        loginMutation.mutate({
            username,
            password,
        });
    }

    return (
        <div className="rounded-[28px] border border-border bg-card/90 p-6 shadow-soft sm:p-7">
            <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Welcome back</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    Sign in
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Your habit progress is waiting.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        htmlFor="login-username"
                        className="text-sm font-medium text-foreground"
                    >
                        Username
                    </label>

                    <input
                        id="login-username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Enter your username"
                        autoComplete="username"
                        required
                        className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.75 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="login-password"
                        className="text-sm font-medium text-foreground"
                    >
                        Password
                    </label>

                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.75 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full rounded-2xl bg-gradient-to-r from-primary to-violet-500 px-4 py-2.75 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
}
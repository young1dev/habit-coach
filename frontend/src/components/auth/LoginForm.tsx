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
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to continue to Habit Coach.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        htmlFor="login-username"
                        className="text-sm font-medium"
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
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="login-password"
                        className="text-sm font-medium"
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
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    Sign in
                </button>
            </form>
        </div>
    );
}
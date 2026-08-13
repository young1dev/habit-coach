import { useRegister } from "@/lib/queries";
import { useState } from "react";

export function RegisterForm() {
    const registerMutation = useRegister();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== confirmPassword) {
            return;
        }
        registerMutation.mutate({
            username,
            email,
            password,
        });

        console.log({
            username,
            email,
            password,
        });
    }

    return (
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Create your account
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Start building better habits with Habit Coach.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        htmlFor="register-username"
                        className="text-sm font-medium"
                    >
                        Username
                    </label>

                    <input
                        id="register-username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Choose a username"
                        autoComplete="username"
                        required
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="register-email"
                        className="text-sm font-medium"
                    >
                        Email
                    </label>

                    <input
                        id="register-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="register-password"
                        className="text-sm font-medium"
                    >
                        Password
                    </label>

                    <input
                        id="register-password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="register-confirm-password"
                        className="text-sm font-medium"
                    >
                        Confirm password
                    </label>

                    <input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        required
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary"
                    />

                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-sm text-destructive">
                            Passwords do not match.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    Create account
                </button>
            </form>
        </div>
    );
}
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
    }

    return (
        <div className="rounded-[28px] border border-border bg-card/90 p-6 shadow-soft sm:p-7">
            <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Start fresh</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    Create account
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Build a stronger routine with smarter coaching.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        htmlFor="register-username"
                        className="text-sm font-medium text-foreground"
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
                        className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.75 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="register-email"
                        className="text-sm font-medium text-foreground"
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
                        className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.75 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="register-password"
                        className="text-sm font-medium text-foreground"
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
                        className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.75 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="register-confirm-password"
                        className="text-sm font-medium text-foreground"
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
                        className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.75 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />

                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-sm text-destructive">
                            Passwords do not match.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full rounded-2xl bg-gradient-to-r from-primary to-violet-500 px-4 py-2.75 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {registerMutation.isPending ? "Creating account..." : "Create account"}
                </button>
            </form>
        </div>
    );
}
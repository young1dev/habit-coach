import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const Route = createFileRoute("/auth/register")({
    component: RegisterPage,
});

function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
            <div className="w-full max-w-lg rounded-[32px] border border-border bg-card/90 p-5 shadow-lift backdrop-blur-xl sm:p-7">

                {<RegisterForm />}

                <div className="mt-6 text-center">
                    <Link
                        to="/auth/login"
                        className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </main>
    );
}
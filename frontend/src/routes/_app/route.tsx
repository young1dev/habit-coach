import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const Route = createFileRoute("/_app")({
    component: AppLayout,
});

function AppLayout() {
    return (
        <AuthGuard>
            <AppShell>
                <Outlet />
            </AppShell>
        </AuthGuard>
    );
}
import { Navigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AUTH_EVENT, clearAuth, isAuthenticated } from "@/lib/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const publicPaths = ["/", "/auth/login", "/auth/register"];
  const isPublicPath = publicPaths.includes(location.pathname);

  useEffect(() => {
    const syncAuth = () => {
      const valid = isAuthenticated();
      if (!valid) {
        clearAuth();
      }

      setAuthenticated(valid);
      setChecked(true);
    };

    syncAuth();
    window.addEventListener(AUTH_EVENT, syncAuth);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncAuth);
    };
  }, [location.pathname]);

  if (!checked) {
    return null;
  }

  if (!authenticated && !isPublicPath) {
    return <Navigate to="/auth/login" replace />;
  }

  if (authenticated && (location.pathname === "/auth/login" || location.pathname === "/")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
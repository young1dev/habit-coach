import { Navigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AUTH_EVENT, clearAuth, isAuthenticated } from "@/lib/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

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

  if (!authenticated && location.pathname !== "/auth" && location.pathname !== "/") {
    return <Navigate to="/auth" replace />;
  }

  if (authenticated && (location.pathname === "/auth" || location.pathname === "/")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
import { Navigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { getToken } from "@/lib/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(getToken() !== null);
    setChecked(true);
  }, [location.pathname]);

  if (!checked) {
    return null;
  }

  if (!authenticated && location.pathname !== "/auth") {
    return <Navigate to="/auth" replace />;
  }

  if (authenticated && location.pathname === "/auth") {
    return <Navigate to="/" replace />;
  }

  return children;
}
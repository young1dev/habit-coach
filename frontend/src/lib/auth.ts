import type { LoginResponse } from "./types";

export const AUTH_KEY = "habit-coach-auth";

export function saveAuth(data: LoginResponse) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function getAuth(): LoginResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(AUTH_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function getToken(): string | null {
  return getAuth()?.access_token ?? null;
}

export function clearAuth() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
import type { LoginResponse } from "./types";

export const AUTH_KEY = "habit-coach-auth";
export const AUTH_EVENT = "habit-coach-auth-changed";

function notifyAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

export function saveAuth(data: LoginResponse) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  notifyAuthChanged();
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
  notifyAuthChanged();
}

export function logoutAndRedirect() {
  clearAuth();
  if (typeof window !== "undefined") {
    window.location.assign("/auth");
  }
}

export function isTokenExpired(): boolean {
  const auth = getAuth();
  if (!auth?.access_token) {
    return true;
  }

  try {
    const [, payloadSegment = ""] = auth.access_token.split(".");
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded));
    return typeof payload.exp === "number" && Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken() && !isTokenExpired();
}

export function ensureValidAuth(): boolean {
  if (!isAuthenticated()) {
    clearAuth();
    return false;
  }

  return true;
}
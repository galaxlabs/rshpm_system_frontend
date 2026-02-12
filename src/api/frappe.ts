import { postForm, getJSON, clearCsrf } from "./http";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "";

/**
 * Minimal Frappe client for SPA
 * - Normal username/password login (no OTP)
 * - Cookie session (`sid`) with credentials: include
 * - No frappe.sessions.get
 */
export const Frappe = {
  async login(usr: string, pwd: string) {
    if (!usr?.trim() || !pwd?.trim()) {
      throw new Error("Username and password are required");
    }

    // Force clear old session first to ensure password is validated on this login attempt.
    // Use form logout endpoint because CSRF may not exist yet on login page.
    await postForm("/api/method/logout", {}, API_BASE).catch(() => undefined);
    clearCsrf();
    const pre = await getJSON<any>("/api/method/frappe.auth.get_logged_user", API_BASE).catch(() => null);
    if (pre?.message && pre.message !== "Guest") {
      throw new Error("Previous session is still active. Please clear browser cookies and retry.");
    }

    // Frappe login expects form-encoded in most setups
    const loginRes = await postForm<any>("/api/method/login", { usr, pwd }, API_BASE);
    // after login, CSRF token is injected into boot; refresh cached token if needed
    clearCsrf();

    // Verify authenticated user via app API endpoint.
    const me = await getJSON<any>("/api/method/rshpm_system.api.auth.whoami", API_BASE);
    const actualUser = me?.message?.user;
    if (!actualUser || actualUser === "Guest") {
      throw new Error("Login failed");
    }

    // Guard against stale-session false positives when wrong password is supplied.
    const maybeLoginMsg = String(loginRes?.message || "").toLowerCase();
    if (!maybeLoginMsg.includes("logged in")) {
      throw new Error("Invalid username or password");
    }
  },

  async logout() {
    await postForm("/api/method/logout", {}, API_BASE);
    clearCsrf();
  },

  async whoami(): Promise<{ user: string; full_name?: string; roles?: string[]; user_type?: string } | null> {
    try {
      const res = await getJSON<any>("/api/method/rshpm_system.api.auth.whoami", API_BASE);
      const user = res?.message?.user;
      if (!user || user === "Guest") return null;
      return {
        user,
        full_name: res?.message?.full_name,
        roles: res?.message?.roles || [],
        user_type: res?.message?.user_type,
      };
    } catch {
      return null;
    }
  },

  async call<T>(methodPath: string, args: Record<string, any> = {}) {
    return await postJSON<T>(methodPath, args, API_BASE);
  },
};

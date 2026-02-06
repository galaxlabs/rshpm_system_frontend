import { postJSON, postForm, getJSON, clearCsrf } from "./http";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "";

/**
 * Minimal Frappe client for SPA
 * - Normal username/password login (no OTP)
 * - Cookie session (`sid`) with credentials: include
 * - No frappe.sessions.get
 */
export const Frappe = {
  async login(usr: string, pwd: string) {
    // Frappe login expects form-encoded in most setups
    await postForm("/api/method/login", { usr, pwd }, API_BASE);
    // after login, CSRF token is injected into boot; refresh cached token if needed
    clearCsrf();
  },

  async logout() {
    await postJSON("logout", {}, API_BASE);
    clearCsrf();
  },

  async whoami(): Promise<{ user: string; full_name?: string; roles?: string[]; user_type?: string } | null> {
    // Works without desk meta access, and doesn't require sessions.get
    // For guests, it returns "Guest"
    const res = await getJSON<any>("/api/method/frappe.auth.get_logged_user", API_BASE);
    const user = res?.message;
    if (!user || user === "Guest") return null;
    return { user };
  },

  async call<T>(methodPath: string, args: Record<string, any> = {}) {
    return await postJSON<T>(methodPath, args, API_BASE);
  },
};

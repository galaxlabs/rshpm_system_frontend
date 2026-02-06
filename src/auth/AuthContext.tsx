import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Frappe } from "@/api/frappe";

type AuthUser = {
  id: string;
  full_name?: string;
  user_type?: string;
  roles?: string[];
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  login: (usr: string, pwd: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const me = await Frappe.whoami();

      const u = me?.user;
      if (!u || u === "Guest") {
        setUser(null);
        return;
      }

      setUser({
        id: u,
        full_name: me?.full_name,
        user_type: me?.user_type,
        roles: me?.roles || [],
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(usr: string, pwd: string) {
    setLoading(true);
    try {
      await Frappe.login(usr, pwd);
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await Frappe.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({ user, loading, login, logout, refresh }),
    [user, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

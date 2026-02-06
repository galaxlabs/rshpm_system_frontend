import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(usr, pwd);
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8">
        <div className="text-2xl font-black text-slate-900 mb-1">Login</div>
        <div className="text-slate-600 mb-6">Use your Frappe username + password</div>

        <label className="block text-sm font-semibold text-slate-700 mb-2">Username / Email</label>
        <input
          className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-4"
          value={usr}
          onChange={(e) => setUsr(e.target.value)}
        />

        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <input
          type="password"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 mb-4"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />

        {err ? <div className="text-red-600 text-sm mb-3">{err}</div> : null}

        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

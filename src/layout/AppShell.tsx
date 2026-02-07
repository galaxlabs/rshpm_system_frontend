// src/layout/AppShell.tsx
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { DOCTYPES } from "@/modules/rshpm/doctypeRegistry";
import { ModeToggle } from "@/components/mode-toggle";

export default function AppShell() {
  const { user, logout } = useAuth();

  const displayName =
    (user as any)?.full_name ||
    (user as any)?.id ||
    (user as any)?.name ||
    "User";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="w-72 bg-card border-r border-border min-h-screen p-4">
          <div className="font-black text-lg mb-6">RSHPM Admin</div>

          <nav className="space-y-1 mb-6">
            <Link className="block px-3 py-2 rounded-lg hover:bg-muted" to="/rshpm">
              Dashboard
            </Link>
          </nav>

          <div className="text-xs font-semibold text-muted-foreground mb-2">Masters</div>
          <nav className="space-y-1">
            {DOCTYPES.map((d) => (
              <Link
                key={d.doctype}
                className="block px-3 py-2 rounded-lg hover:bg-muted"
                to={`/rshpm/${encodeURIComponent(d.doctype)}`}
              >
                {d.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="h-14 bg-card border-b border-border px-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Logged in: <span className="text-foreground font-semibold">{displayName}</span>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

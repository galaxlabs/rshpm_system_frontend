// src/app/NotFound.tsx
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const loc = useLocation();

  return (
    <div className="p-10 space-y-3">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <div className="text-sm text-slate-600">Path: {loc.pathname}</div>

      <div className="flex gap-2">
        <Link className="px-3 py-2 rounded border text-sm" to="/rshpm">
          Go to Dashboard
        </Link>
        <Link className="px-3 py-2 rounded border text-sm" to="/rshpm/Property">
          Properties
        </Link>
      </div>
    </div>
  );
}

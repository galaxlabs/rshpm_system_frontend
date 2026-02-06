import React from "react";
import { DOCTYPES } from "@/modules/rshpm/doctypeRegistry";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="text-2xl font-black text-slate-900">Dashboard</div>
        <div className="text-slate-600 mt-1">
         (Property, Client, Booking)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DOCTYPES.map((d) => (
          <Link
            key={d.doctype}
            to={`/doctype/${encodeURIComponent(d.doctype)}`}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:bg-slate-50"
          >
            <div className="font-bold text-slate-900">{d.label}</div>
            <div className="text-sm text-slate-600 mt-1">Open list</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

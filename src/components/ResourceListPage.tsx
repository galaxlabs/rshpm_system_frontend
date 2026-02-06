// src/components/ResourceListPage.tsx
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listResources, deleteResource } from "@/api/resource";
import {
  getDoctypeConfig,
  labelForListField,
  visibleListFields,
} from "@/modules/rshpm/doctypeRegistry";

type Props = {
  doctype: string;
  basePath: string; // e.g. "/rshpm/property"
};

export default function ResourceListPage({ doctype, basePath }: Props) {
  const cfg = getDoctypeConfig(doctype);
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || "1");
  const limit = Number(params.get("limit") || "20");
  const start = (page - 1) * limit;

  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fields = React.useMemo(() => {
    if (!cfg) return ["name"];
    const lf = visibleListFields(cfg);
    // Ensure "name" always exists for actions
    return Array.from(new Set(["name", ...lf]));
  }, [cfg]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listResources({
        doctype,
        fields,
        limit,
        start,
        order_by: "modified desc",
      });
      setRows(res.data || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctype, start, limit]);

  async function onDelete(name: string) {
    if (!confirm(`Delete ${doctype}: ${name}?`)) return;
    try {
      await deleteResource(doctype, name);
      await load();
    } catch (e: any) {
      alert(e?.message || String(e));
    }
  }

  if (!cfg) {
    return (
      <div className="p-6">
        <div className="text-red-600">Doctype not registered: {doctype}</div>
      </div>
    );
  }

  const listFields = visibleListFields(cfg);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{cfg.label}</h1>
          <div className="text-sm text-slate-500">{doctype}</div>
        </div>

        <Link
          to={`${basePath}/new`}
          className="px-3 py-2 rounded-md bg-black text-white text-sm"
        >
          Create
        </Link>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <button
          className="px-2 py-1 rounded border"
          disabled={page <= 1 || loading}
          onClick={() => {
            params.set("page", String(Math.max(1, page - 1)));
            setParams(params);
          }}
        >
          Prev
        </button>
        <div className="text-slate-600">Page {page}</div>
        <button
          className="px-2 py-1 rounded border"
          disabled={loading || rows.length < limit}
          onClick={() => {
            params.set("page", String(page + 1));
            setParams(params);
          }}
        >
          Next
        </button>
      </div>

      {loading && <div className="text-slate-600">Loading...</div>}
      {error && <div className="text-red-600 whitespace-pre-wrap">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                {listFields.map((f) => (
                  <th key={f} className="px-3 py-2 font-medium text-slate-700">
                    {labelForListField(cfg, f)}
                  </th>
                ))}
                <th className="px-3 py-2 font-medium text-slate-700 w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-t">
                  {listFields.map((f) => (
                    <td key={f} className="px-3 py-2">
                      {String(r?.[f] ?? "")}
                    </td>
                  ))}

                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Link
                        to={`${basePath}/${encodeURIComponent(r.name)}`}
                        className="px-2 py-1 rounded border text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(r.name)}
                        className="px-2 py-1 rounded border text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-6 text-slate-500"
                    colSpan={listFields.length + 1}
                  >
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

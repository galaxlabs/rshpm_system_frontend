// src/modules/rshpm/pages/DoctypeFormPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDoctypeConfig,
  resolveDoctypeName,
  visibleFormFields,
  type FormField,
} from "@/modules/rshpm/doctypeRegistry";
import {
  listResources,
  getResource,
  createResource,
  updateResource,
} from "@/api/resource";

type Props = {
  mode: "new" | "edit";
};

function groupBySection(fields: FormField[]) {
  const out: Record<string, FormField[]> = {};
  for (const f of fields) {
    const section = f.section?.trim() || "Main";
    if (!out[section]) out[section] = [];
    out[section].push(f);
  }
  return out;
}

function InputField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: any;
  onChange: (v: any) => void;
}) {
  const disabled = !!field.readOnly;

  if (field.type === "Text") {
    return (
      <textarea
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "Check") {
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-slate-700">{field.label}</span>
      </label>
    );
  }

  if (field.type === "Select") {
    const options = (field.options || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    return (
      <select
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "Link") {
    return (
      <LinkField
        linkDoctype={field.options || ""}
        value={value ?? ""}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }

  // fallback (Data/Int/Float/Currency/Date)
  const inputType = field.type === "Date" ? "date" : "text";

  return (
    <input
      type={inputType}
      className="w-full rounded-xl border border-slate-200 px-3 py-2"
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function LinkField({
  linkDoctype,
  value,
  disabled,
  onChange,
}: {
  linkDoctype: string;
  value: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!linkDoctype) return;
      setLoading(true);
      try {
        const term = q.trim();
        const filters = term ? [[linkDoctype, "name", "like", `%${term}%`]] : undefined;

        const res = await listResources<{ name: string }>({
          doctype: linkDoctype,
          fields: ["name"],
          filters,
          order_by: "modified desc",
          limit: 20,
          start: 0,
        });

        if (!alive) return;
        setItems((res?.data || []).map((r) => ({ name: r.name })));
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [linkDoctype, q]);

  async function quickCreateCompany() {
    const company_name = prompt("Company Name?");
    if (!company_name) return;

    const abbr = prompt("Abbr? (e.g. GL)") || company_name.slice(0, 3).toUpperCase();

    try {
      const created = await createResource<any>("Company", {
        company_name,
        abbr,
        default_currency: "PKR",
        country: "Pakistan",
      });

      const newName = created?.data?.name;
      if (newName) {
        onChange(newName);
        setQ("");
      }
    } catch (e: any) {
      alert(e?.message || "Company create failed");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
          placeholder={`Search ${linkDoctype}…`}
          value={q}
          disabled={disabled}
          onChange={(e) => setQ(e.target.value)}
        />

        {linkDoctype === "Company" && (
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-3 py-2 text-white"
            onClick={quickCreateCompany}
            disabled={disabled}
          >
            + Company
          </button>
        )}
      </div>

      <select
        className="w-full rounded-xl border border-slate-200 px-3 py-2"
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{loading ? "Loading…" : "Select…"}</option>
        {items.map((it) => (
          <option key={it.name} value={it.name}>
            {it.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function DoctypeFormPage({ mode }: Props) {
  const { doctype: rawDoctype, name } = useParams();
  const nav = useNavigate();
  const doctype = resolveDoctypeName(rawDoctype || "");

  const cfg = useMemo(() => (doctype ? getDoctypeConfig(doctype) : null), [doctype]);
  const formFields = useMemo(() => (cfg ? visibleFormFields(cfg) : []), [cfg]);

  const isNew = mode === "new";

  const [doc, setDoc] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!doctype || !cfg) return;

    (async () => {
      setLoading(true);
      try {
        if (isNew) {
          setDoc({});
        } else if (name) {
          const res = await getResource<any>(doctype, name);
          setDoc(res?.data || {});
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [doctype, name, isNew, cfg]);

  function validateRequired() {
    const missing: string[] = [];
    for (const f of formFields) {
      if (f.hidden || f.readOnly) continue;
      if (!f.required) continue;
      const v = doc[f.fieldname];
      if (v === undefined || v === null || String(v).trim() === "") missing.push(f.label);
    }
    return missing;
  }

  async function save() {
    if (!doctype || !cfg) return;
    setSaving(true);

    try {
      const missing = validateRequired();
      if (missing.length) {
        alert(`Missing required: ${missing.join(", ")}`);
        return;
      }

      // Send only editable registry fields
      const payload: Record<string, any> = {};
      for (const f of formFields) {
        if (f.hidden || f.readOnly) continue;
        payload[f.fieldname] = doc[f.fieldname];
      }

      if (isNew) {
        const created = await createResource<any>(doctype, payload);
        const newName = created?.data?.name;
        alert("Created");
        if (newName) {
          nav(`/rshpm/${encodeURIComponent(doctype)}/${encodeURIComponent(newName)}`);
        } else {
          nav(`/rshpm/${encodeURIComponent(doctype)}`);
        }
      } else if (name) {
        await updateResource<any>(doctype, name, payload);
        alert("Saved");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!cfg) return <div className="p-6">Unknown Doctype</div>;
  if (loading) return <div className="p-6">Loading…</div>;

  const grouped = groupBySection(formFields);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{cfg.label}</div>
          <h1 className="text-2xl font-black text-slate-900">
            {isNew ? `New ${cfg.label}` : name}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-300 px-3 py-2"
            onClick={() => nav(-1)}
          >
            Back
          </button>
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-3 py-2 text-white"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : isNew ? "Create" : "Save"}
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([section, fields]) => (
        <div key={section} className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-black text-slate-900">{section}</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.fieldname} className="space-y-1">
                {f.type !== "Check" && (
                  <label className="text-sm font-semibold text-slate-700">
                    {f.label}
                    {f.required ? <span className="text-red-600"> *</span> : null}
                  </label>
                )}

                <InputField
                  field={f}
                  value={doc[f.fieldname]}
                  onChange={(v) => setDoc((d) => ({ ...d, [f.fieldname]: v }))}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getDoctypeConfig,
//   visibleFormFields,
//   type FormField,
// } from "@/modules/rshpm/doctypeRegistry";
// import {
//   listResources,
//   getResource,
//   createResource,
//   updateResource,
// } from "@/api/resource";

// function groupBySection(fields: FormField[]) {
//   const out: Record<string, FormField[]> = {};
//   for (const f of fields) {
//     const section = (f as any).section || "Main";
//     if (!out[section]) out[section] = [];
//     out[section].push(f);
//   }
//   return out;
// }

// function InputField({
//   field,
//   value,
//   onChange,
// }: {
//   field: FormField;
//   value: any;
//   onChange: (v: any) => void;
// }) {
//   const disabled = !!field.readOnly;

//   if (field.type === "Text") {
//     return (
//       <textarea
//         className="w-full rounded-xl border border-slate-200 px-3 py-2"
//         value={value ?? ""}
//         disabled={disabled}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     );
//   }

//   if (field.type === "Check") {
//     return (
//       <label className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           checked={!!value}
//           disabled={disabled}
//           onChange={(e) => onChange(e.target.checked)}
//         />
//         <span className="text-slate-700">{field.label}</span>
//       </label>
//     );
//   }

//   if (field.type === "Select") {
//     const options = (field.options || "")
//       .split("\n")
//       .map((x) => x.trim())
//       .filter(Boolean);

//     return (
//       <select
//         className="w-full rounded-xl border border-slate-200 px-3 py-2"
//         value={value ?? ""}
//         disabled={disabled}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="">Select…</option>
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//     );
//   }

//   if (field.type === "Link") {
//     return (
//       <LinkField
//         linkDoctype={field.options || ""}
//         value={value ?? ""}
//         disabled={disabled}
//         onChange={onChange}
//       />
//     );
//   }

//   // Basic fallback input (Data/Int/Float/Currency/Date etc)
//   const inputType = field.type === "Date" ? "date" : "text";

//   return (
//     <input
//       type={inputType}
//       className="w-full rounded-xl border border-slate-200 px-3 py-2"
//       value={value ?? ""}
//       disabled={disabled}
//       onChange={(e) => onChange(e.target.value)}
//     />
//   );
// }

// function LinkField({
//   linkDoctype,
//   value,
//   disabled,
//   onChange,
// }: {
//   linkDoctype: string;
//   value: string;
//   disabled?: boolean;
//   onChange: (v: string) => void;
// }) {
//   const [q, setQ] = useState("");
//   const [items, setItems] = useState<{ name: string }[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     let alive = true;

//     async function load() {
//       if (!linkDoctype) return;
//       setLoading(true);
//       try {
//         const term = q.trim();
//         const filters = term
//           ? [[linkDoctype, "name", "like", `%${term}%`]]
//           : undefined;

//         const res = await listResources<{ name: string }>({
//           doctype: linkDoctype,
//           fields: ["name"],
//           filters,
//           order_by: "modified desc",
//           limit: 20,
//           start: 0,
//         });

//         if (!alive) return;
//         setItems((res?.data || []).map((r) => ({ name: r.name })));
//       } finally {
//         if (alive) setLoading(false);
//       }
//     }

//     load();
//     return () => {
//       alive = false;
//     };
//   }, [linkDoctype, q]);

//   async function quickCreateCompany() {
//     const company_name = prompt("Company Name?");
//     if (!company_name) return;

//     const abbr =
//       prompt("Abbr? (e.g. GL)") || company_name.slice(0, 3).toUpperCase();

//     try {
//       const created = await createResource<any>("Company", {
//         company_name,
//         abbr,
//         default_currency: "PKR",
//         country: "Pakistan",
//       });

//       const newName = created?.data?.name;
//       if (newName) {
//         onChange(newName);
//         setQ("");
//       }
//     } catch (e: any) {
//       alert(e?.message || "Company create failed");
//     }
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex gap-2">
//         <input
//           className="flex-1 rounded-xl border border-slate-200 px-3 py-2"
//           placeholder={`Search ${linkDoctype}…`}
//           value={q}
//           disabled={disabled}
//           onChange={(e) => setQ(e.target.value)}
//         />

//         {linkDoctype === "Company" && (
//           <button
//             type="button"
//             className="rounded-xl bg-slate-900 px-3 py-2 text-white"
//             onClick={quickCreateCompany}
//             disabled={disabled}
//           >
//             + Company
//           </button>
//         )}
//       </div>

//       <select
//         className="w-full rounded-xl border border-slate-200 px-3 py-2"
//         value={value ?? ""}
//         disabled={disabled}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <option value="">{loading ? "Loading…" : "Select…"}</option>
//         {items.map((it) => (
//           <option key={it.name} value={it.name}>
//             {it.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default function DoctypeFormPage() {
//   const { doctype, name } = useParams();
//   const nav = useNavigate();

//   const cfg = useMemo(() => (doctype ? getDoctypeConfig(doctype) : null), [doctype]);
//   const formFields = useMemo(() => (cfg ? visibleFormFields(cfg) : []), [cfg]);
//   const isNew = name === "new";

//   const [doc, setDoc] = useState<Record<string, any>>({});
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (!doctype || !cfg) return;

//     (async () => {
//       setLoading(true);
//       try {
//         if (isNew) {
//           setDoc({});
//         } else if (name) {
//           const res = await getResource<any>(doctype, name);
//           setDoc(res?.data || {});
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [doctype, name, isNew, cfg]);

//   function validateRequired() {
//     const missing: string[] = [];
//     for (const f of formFields) {
//       if (f.hidden || f.readOnly) continue;
//       if (!f.required) continue;
//       const v = doc[f.fieldname];
//       if (v === undefined || v === null || String(v).trim() === "") {
//         missing.push(f.label);
//       }
//     }
//     return missing;
//   }

//   async function save() {
//     if (!doctype || !cfg) return;
//     setSaving(true);

//     try {
//       const missing = validateRequired();
//       if (missing.length) {
//         alert(`Missing required: ${missing.join(", ")}`);
//         return;
//       }

//       // ✅ Only send registry fields (and not readOnly/hidden)
//       const payload: Record<string, any> = {};
//       for (const f of formFields) {
//         if ((f as any).hidden || (f as any).readOnly) continue;
//         payload[f.fieldname] = doc[f.fieldname];
//       }

//       if (isNew) {
//         const created = await createResource<any>(doctype, payload);
//         const newName = created?.data?.name;
//         alert("Created");
//         if (newName) {
//           nav(`/doctype/${encodeURIComponent(doctype)}/${encodeURIComponent(newName)}`);
//         } else {
//           nav(-1);
//         }
//       } else if (name) {
//         await updateResource<any>(doctype, name, payload);
//         alert("Saved");
//       }
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (!cfg) return <div className="p-6">Unknown Doctype</div>;
//   if (loading) return <div className="p-6">Loading…</div>;

//   const grouped = groupBySection(formFields);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <div className="text-sm text-slate-500">{cfg.label}</div>
//           <h1 className="text-2xl font-black text-slate-900">
//             {isNew ? `New ${cfg.label}` : name}
//           </h1>
//         </div>
//         <div className="flex gap-2">
//           <button
//             type="button"
//             className="rounded-xl border border-slate-300 px-3 py-2"
//             onClick={() => nav(-1)}
//           >
//             Back
//           </button>
//           <button
//             type="button"
//             className="rounded-xl bg-slate-900 px-3 py-2 text-white"
//             onClick={save}
//             disabled={saving}
//           >
//             {saving ? "Saving…" : isNew ? "Create" : "Save"}
//           </button>
//         </div>
//       </div>

//       {Object.entries(grouped).map(([section, fields]) => (
//         <div key={section} className="rounded-3xl border border-slate-200 bg-white p-6">
//           <h3 className="mb-4 text-lg font-black text-slate-900">{section}</h3>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             {fields.map((f) => (
//               <div key={f.fieldname} className="space-y-1">
//                 {f.type !== "Check" && (
//                   <label className="text-sm font-semibold text-slate-700">
//                     {f.label}
//                     {f.required ? <span className="text-red-600"> *</span> : null}
//                   </label>
//                 )}
//                 <InputField
//                   field={f}
//                   value={doc[f.fieldname]}
//                   onChange={(v) => setDoc((d) => ({ ...d, [f.fieldname]: v }))}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

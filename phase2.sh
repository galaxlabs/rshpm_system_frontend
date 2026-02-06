#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/api src/modules/rshpm/pages src/modules/rshpm/registry src/layout src/app

# -----------------------------
# src/api/resource.ts
# -----------------------------
cat > src/api/resource.ts <<'EOF'
type ListArgs = {
  doctype: string;
  fields?: string[];
  filters?: any[];
  or_filters?: any[];
  order_by?: string;
  limit?: number;
  start?: number;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "";

function qs(params: Record<string, any>) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    u.set(k, typeof v === "string" ? v : JSON.stringify(v));
  });
  return u.toString();
}

async function req<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data as T;
}

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function csrfHeader() {
  const t = getCookie("csrf_token");
  return t ? { "X-Frappe-CSRF-Token": t } : {};
}

export async function listResource<T>(args: ListArgs): Promise<{ data: T[]; total?: number }> {
  const q = qs({
    fields: args.fields || ["name"],
    filters: args.filters,
    or_filters: args.or_filters,
    order_by: args.order_by,
    limit_page_length: args.limit ?? 20,
    limit_start: args.start ?? 0,
  });

  const res = await fetch(`${API_BASE}/api/resource/${encodeURIComponent(args.doctype)}?${q}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = json?.message || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  const totalHeader = res.headers.get("X-Total-Count");
  const total = totalHeader ? parseInt(totalHeader, 10) : undefined;

  return { data: json?.data || [], total };
}

export async function getResource<T>(doctype: string, name: string): Promise<T> {
  const r = await req<{ data: T }>(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
  return r.data;
}

export async function insertResource<T>(doctype: string, doc: any): Promise<T> {
  const r = await req<{ data: T }>(`/api/resource/${encodeURIComponent(doctype)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...csrfHeader(),
    },
    body: JSON.stringify(doc),
  });
  return r.data;
}

export async function updateResource<T>(doctype: string, name: string, doc: any): Promise<T> {
  const r = await req<{ data: T }>(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...csrfHeader(),
    },
    body: JSON.stringify(doc),
  });
  return r.data;
}

export async function deleteResource(doctype: string, name: string): Promise<void> {
  await req(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, {
    method: "DELETE",
    headers: { ...csrfHeader() },
  });
}
EOF

# -----------------------------
# src/modules/rshpm/doctypeRegistry.ts
# -----------------------------
cat > src/modules/rshpm/doctypeRegistry.ts <<'EOF'
export type FieldType = "Data" | "Int" | "Float" | "Currency" | "Date" | "Select" | "Link" | "Text" | "Check";

export type FormField = {
  fieldname: string;
  label: string;
  type: FieldType;
  options?: string;
  required?: boolean;
  readOnly?: boolean;
};

export type DoctypeConfig = {
  doctype: string;
  label: string;
  titleField?: string;
  listFields: string[];
  searchFields?: string[];
  formFields: FormField[];
};

export const DOCTYPES: DoctypeConfig[] = [
  {
    doctype: "Property",
    label: "Property",
    titleField: "plot_number",
    listFields: ["name", "plot_number", "block", "housing_scheme", "status", "total_cost"],
    searchFields: ["name", "plot_number", "unique_id"],
    formFields: [
      { fieldname: "plot_number", label: "Plot Number", type: "Data", required: true },
      { fieldname: "unique_id", label: "Unique ID", type: "Data" },
      { fieldname: "housing_scheme", label: "Housing Scheme", type: "Link", options: "Housing Scheme" },
      { fieldname: "block", label: "Block", type: "Link", options: "Block" },
      { fieldname: "status", label: "Status", type: "Select", options: "Inventory\nReserved\nBooked\nAllotted\nPossession\nTransferred" },
      { fieldname: "unit_type", label: "Unit Type", type: "Data" },
      { fieldname: "area_value", label: "Area Value", type: "Float" },
      { fieldname: "area_unit", label: "Area Unit", type: "Data" },
      { fieldname: "total_cost", label: "Total Cost", type: "Currency" },
    ],
  },
  {
    doctype: "Client",
    label: "Client",
    titleField: "full_name",
    listFields: ["name", "full_name", "mobile_number", "email_address", "kyc_status"],
    searchFields: ["name", "full_name", "mobile_number", "cnic_number", "email_address"],
    formFields: [
      { fieldname: "full_name", label: "Full Name", type: "Data", required: true },
      { fieldname: "father_name", label: "Father Name", type: "Data" },
      { fieldname: "cnic_number", label: "CNIC", type: "Data", required: true },
      { fieldname: "mobile_number", label: "Mobile", type: "Data", required: true },
      { fieldname: "email_address", label: "Email", type: "Data" },
      { fieldname: "company", label: "Company", type: "Link", options: "Company" },
      { fieldname: "kyc_status", label: "KYC Status", type: "Select", options: "Unverified\nVerified\nRejected" },
      { fieldname: "address", label: "Address", type: "Text" },
    ],
  },
  {
    doctype: "Booking",
    label: "Booking",
    titleField: "name",
    listFields: ["name", "booking_date", "customer", "property", "status", "net_total", "total_paid", "remaining_balance"],
    searchFields: ["name", "customer", "property"],
    formFields: [
      { fieldname: "booking_date", label: "Booking Date", type: "Date" },
      { fieldname: "company", label: "Company", type: "Link", options: "Company" },
      { fieldname: "customer", label: "Client", type: "Link", options: "Client", required: true },
      { fieldname: "property", label: "Property", type: "Link", options: "Property", required: true },
      { fieldname: "status", label: "Status", type: "Select", options: "Reserved\nBooked\nAllotted\nPossession\nCancelled" },
      { fieldname: "total_cost", label: "Total Cost", type: "Currency" },
      { fieldname: "discount", label: "Discount", type: "Currency" },
      { fieldname: "net_total", label: "Net Total", type: "Currency", readOnly: true },
      { fieldname: "down_payment_amount", label: "Down Payment", type: "Currency" },
      { fieldname: "payment_plan_type", label: "Payment Plan Type", type: "Select", options: "Installments\nFull Payment" },
      { fieldname: "total_installments", label: "Total Installments", type: "Int" },
      { fieldname: "installment_interval", label: "Installment Interval (Months)", type: "Int" },
      { fieldname: "grace_days", label: "Grace Days", type: "Int" },
    ],
  },
];

export function getDoctypeConfig(doctype: string) {
  return DOCTYPES.find((d) => d.doctype === doctype);
}
EOF

echo "✅ Phase-2 files generated."

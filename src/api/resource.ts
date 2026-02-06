// src/api/resource.ts

export type ListArgs = {
  doctype: string;
  fields?: string[];
  filters?: any[];
  or_filters?: any[];
  order_by?: string;
  limit?: number;
  start?: number;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "";

function encodeJSON(v: any) {
  return encodeURIComponent(JSON.stringify(v));
}

function buildListUrl(args: ListArgs) {
  const fields = args.fields?.length ? args.fields : ["name"];
  const limit = args.limit ?? 20;
  const start = args.start ?? 0;

  let url =
    `${API_BASE}/api/resource/${encodeURIComponent(args.doctype)}` +
    `?fields=${encodeJSON(fields)}` +
    `&limit_page_length=${limit}` +
    `&limit_start=${start}`;

  if (args.filters?.length) url += `&filters=${encodeJSON(args.filters)}`;
  if (args.or_filters?.length) url += `&or_filters=${encodeJSON(args.or_filters)}`;
  if (args.order_by) url += `&order_by=${encodeURIComponent(args.order_by)}`;

  return url;
}

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg =
      (data as any)?.exception ||
      (data as any)?.message ||
      (data as any)?._error_message ||
      `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data as T;
}

// --------------------
// Named functions
// --------------------

export async function listResources<T = any>(
  args: ListArgs
): Promise<{ data: T[] }> {
  const res = await fetch(buildListUrl(args), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return jsonOrThrow(res);
}

export async function getResource<T = any>(
  doctype: string,
  name: string
): Promise<{ data: T }> {
  const res = await fetch(
    `${API_BASE}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
    {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    }
  );
  return jsonOrThrow(res);
}

export async function createResource<T = any>(
  doctype: string,
  doc: Partial<T> | Record<string, any>
): Promise<{ data: T }> {
  const res = await fetch(`${API_BASE}/api/resource/${encodeURIComponent(doctype)}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(doc),
  });
  return jsonOrThrow(res);
}

export async function updateResource<T = any>(
  doctype: string,
  name: string,
  doc: Partial<T> | Record<string, any>
): Promise<{ data: T }> {
  const res = await fetch(
    `${API_BASE}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(doc),
    }
  );
  return jsonOrThrow(res);
}

export async function deleteResource(
  doctype: string,
  name: string
): Promise<{ message: string }> {
  const res = await fetch(
    `${API_BASE}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { Accept: "application/json" },
    }
  );
  return jsonOrThrow(res);
}

// --------------------
// Convenience wrapper
// --------------------

export const ResourceAPI = {
  list: listResources,
  get: getResource,
  create: createResource,
  update: updateResource,
  delete: deleteResource,
};

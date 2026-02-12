let csrfToken: string | null = null;

type AnyJson = Record<string, any>;

function parseServerMessage(payload: any): string | null {
  try {
    if (!payload?._server_messages) return null;
    const decoded = JSON.parse(payload._server_messages);
    if (Array.isArray(decoded) && decoded.length) {
      const first = JSON.parse(decoded[0]);
      return first?.message || null;
    }
  } catch {}
  return null;
}

function readCsrfFromWindow(): string | null {
  const w: any = window as any;
  return w?.frappe?.csrf_token || w?.csrf_token || null;
}

export async function ensureCsrf(): Promise<string | null> {
  if (csrfToken) return csrfToken;

  // ✅ No frappe.sessions.get (some deployments return 403)
  csrfToken = readCsrfFromWindow();
  return csrfToken;
}

export function clearCsrf() {
  csrfToken = null;
}

export async function getJSON<T>(url: string, apiBase = ""): Promise<T> {
  const res = await fetch(`${apiBase}${url}`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const payload: AnyJson = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = payload?.message || parseServerMessage(payload) || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return payload as T;
}

export async function postJSON<T>(
  methodPath: string,
  args: AnyJson = {},
  apiBase = ""
): Promise<T> {
  const token = await ensureCsrf();

  const res = await fetch(`${apiBase}/api/method/${methodPath}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { "X-Frappe-CSRF-Token": token } : {}),
    },
    body: JSON.stringify(args),
  });

  const payload: AnyJson = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = payload?.message || parseServerMessage(payload) || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  if (payload?.exc) {
    const msg = parseServerMessage(payload) || "Server error";
    throw new Error(msg);
  }

  return (payload?.message ?? payload) as T;
}

export async function postForm<T>(
  url: string,
  form: Record<string, string>,
  apiBase = ""
): Promise<T> {
  const body = new URLSearchParams(form);

  const res = await fetch(`${apiBase}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const payload: AnyJson = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = payload?.message || parseServerMessage(payload) || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  // Some Frappe auth failures can be returned with 200 + exception payload.
  if (payload?.exc || payload?.exception) {
    const msg =
      parseServerMessage(payload) ||
      payload?.message ||
      payload?.exception ||
      "Server error";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  return payload as T;
}

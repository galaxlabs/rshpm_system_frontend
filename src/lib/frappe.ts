export async function frappeMethod<T>(
  method: string,
  params?: Record<string, any>
): Promise<T> {
  const url = new URL(`/api/method/${method}`, window.location.origin)

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return
      url.searchParams.set(k, String(v))
    })
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include", // important: frappe session cookie
    headers: { "Accept": "application/json" },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`)
  }
  return data.message as T
}

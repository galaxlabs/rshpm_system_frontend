import * as React from "react"
import { useNavigate } from "react-router-dom"
import { usePaymentsList } from "./api"

// If you already have shadcn/ui components, use them:
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return v
}

function DocStatusPill({ docstatus }: { docstatus: 0 | 1 | 2 }) {
  const text = docstatus === 0 ? "Draft" : docstatus === 1 ? "Submitted" : "Cancelled"
  const cls =
    docstatus === 1
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : docstatus === 2
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-slate-50 text-slate-700 border-slate-200"
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {text}
    </span>
  )
}

export default function PaymentsListPage() {
  const nav = useNavigate()

  // list state
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)

  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebouncedValue(search, 350)

  // filters (Frappe style drawer)
  const [fromDate, setFromDate] = React.useState("")
  const [toDate, setToDate] = React.useState("")
  const [docstatus, setDocstatus] = React.useState<"" | 0 | 1 | 2>("")
  const [paymentMode, setPaymentMode] = React.useState("")
  const [paymentType, setPaymentType] = React.useState("")

  const q = usePaymentsList({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
    docstatus: docstatus === "" ? "" : docstatus,
    payment_mode: paymentMode || undefined,
    payment_type: paymentType || undefined,
    sort_by: "payment_date",
    sort_order: "desc",
  })

  const total = q.data?.total ?? 0
  const rows = q.data?.rows ?? []
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // if filters/search change, reset to first page
  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, fromDate, toDate, docstatus, paymentMode, paymentType, pageSize])

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Payments</h1>
          <p className="text-sm text-muted-foreground">Search, filter and open payment vouchers.</p>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Filters</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[380px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>

              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Docstatus</Label>
                  <Select
                    value={docstatus === "" ? "all" : String(docstatus)}
                    onValueChange={(v) => setDocstatus(v === "all" ? "" : (Number(v) as 0 | 1 | 2))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="0">Draft</SelectItem>
                      <SelectItem value="1">Submitted</SelectItem>
                      <SelectItem value="2">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Mode</Label>
                  <Select value={paymentMode || "all"} onValueChange={(v) => setPaymentMode(v === "all" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank">Bank</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Type</Label>
                  <Select value={paymentType || "all"} onValueChange={(v) => setPaymentType(v === "all" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Token">Token</SelectItem>
                      <SelectItem value="Down Payment">Down Payment</SelectItem>
                      <SelectItem value="Installment">Installment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFromDate("")
                      setToDate("")
                      setDocstatus("")
                      setPaymentMode("")
                      setPaymentType("")
                    }}
                  >
                    Reset
                  </Button>
                  <Button onClick={() => {/* drawer close handled by user */}}>Apply</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by Payment ID, receipt, booking, customer, property…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
              <SelectItem value="100">100 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="sticky top-0 bg-card z-10 border-b">
              <tr className="text-muted-foreground">
                <th className="text-left font-medium p-3">Payment</th>
                <th className="text-left font-medium p-3">Date</th>
                <th className="text-left font-medium p-3">Customer</th>
                <th className="text-left font-medium p-3">Property</th>
                <th className="text-left font-medium p-3">Booking</th>
                <th className="text-left font-medium p-3">Mode</th>
                <th className="text-left font-medium p-3">Type</th>
                <th className="text-right font-medium p-3">Amount</th>
                <th className="text-left font-medium p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {q.isLoading ? (
                <tr><td className="p-4" colSpan={9}>Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td className="p-4" colSpan={9}>No payments found.</td></tr>
              ) : (
                rows.map((r, idx) => (
                  <tr
                    key={r.name}
                    className={`cursor-pointer border-b hover:bg-muted/40 ${idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"}`}
                    onClick={() => nav(`/payments/${r.name}`)}
                  >
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3">{r.payment_date}</td>
                    <td className="p-3">{r.customer || "-"}</td>
                    <td className="p-3">{r.property || "-"}</td>
                    <td className="p-3">{r.booking || "-"}</td>
                    <td className="p-3">{r.payment_mode || "-"}</td>
                    <td className="p-3">{r.payment_type || "-"}</td>
                    <td className="p-3 text-right">{(r.amount_paid ?? 0).toLocaleString()}</td>
                    <td className="p-3"><DocStatusPill docstatus={r.docstatus} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between p-3 text-sm">
          <div className="text-muted-foreground">
            {total === 0 ? "0 results" : `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total}`}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <div className="text-muted-foreground">
              Page {page} / {totalPages}
            </div>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {q.isError ? (
        <div className="text-sm text-destructive">
          {(q.error as Error)?.message || "Failed to load payments."}
        </div>
      ) : null}
    </div>
  )
}

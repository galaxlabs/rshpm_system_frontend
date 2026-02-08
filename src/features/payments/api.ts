import { useQuery } from "@tanstack/react-query"
import { frappeMethod } from "@/lib/frappe"

export type PaymentRow = {
  name: string
  payment_date: string
  customer?: string
  property?: string
  booking?: string
  amount_paid?: number
  payment_mode?: string
  payment_type?: string
  received_by?: string
  docstatus: 0 | 1 | 2
  modified: string
}

export type PaymentsListResponse = {
  ok: boolean
  page: number
  page_size: number
  total: number
  rows: PaymentRow[]
}

export type PaymentsListParams = {
  page: number
  page_size: number
  search?: string
  from_date?: string
  to_date?: string
  docstatus?: 0 | 1 | 2 | ""
  payment_mode?: string
  payment_type?: string
  customer?: string
  property?: string
  booking?: string
  sort_by?: "payment_date" | "modified" | "creation" | "amount_paid" | "name"
  sort_order?: "asc" | "desc"
}

export function usePaymentsList(params: PaymentsListParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () =>
      frappeMethod<PaymentsListResponse>(
        "rshpm_system.api.staff_portal.list_payments",
        params
      ),
    staleTime: 10_000,
  })
}

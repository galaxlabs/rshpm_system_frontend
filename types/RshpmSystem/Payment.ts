import { PaymentAllocation } from './PaymentAllocation'

export interface Payment{
	name: string
	creation: string
	modified: string
	owner: string
	modified_by: string
	docstatus: 0 | 1 | 2
	parent?: string
	parentfield?: string
	parenttype?: string
	idx?: number
	/**	Is Advance : Check	*/
	is_advance?: 0 | 1
	/**	 : Select	*/
	naming_series?: "PAY-.YYYY.-.#####"
	/**	Payment Date : Date	*/
	payment_date: string
	/**	Amount Paid : Currency	*/
	amount_paid?: number
	/**	Receipt/Invoice Number : Data	*/
	receiptinvoice_number?: string
	/**	Received By : Link - User	*/
	received_by?: string
	/**	Unallocated Amount : Currency	*/
	unallocated_amount?: number
	/**	Company : Link - Property Company	*/
	company?: string
	/**	Reference No : Small Text	*/
	reference_no?: string
	/**	Booking : Link - Booking	*/
	booking: string
	/**	Customer : Link - Client	*/
	customer?: string
	/**	Property : Link - Property	*/
	property?: string
	/**	Payment Mode : Select	*/
	payment_mode?: "Cash" | "Bank" | "Cheque" | "Online"
	/**	Payment Type : Select	*/
	payment_type?: "Token" | "Down Payment" | "Installment"
	/**	Amended From : Link - Payment	*/
	amended_from?: string
	/**	Approved By : Link - User	*/
	approved_by?: string
	/**	Payment Allocation : Table - Payment Allocation	*/
	payment_allocation?: PaymentAllocation[]
}
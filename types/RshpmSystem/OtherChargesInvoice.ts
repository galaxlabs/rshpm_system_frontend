import { OtherChargesInvoiceItem } from './OtherChargesInvoiceItem'

export interface OtherChargesInvoice{
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
	/**	Company : Link - Company	*/
	company?: string
	/**	Property : Link - Property	*/
	property?: string
	/**	Allocation Method : Select	*/
	allocation_method?: "Spread Across Remaining Installments" | "Add to Next Installment" | "Create New Installment"
	/**	Total Amount : Currency	*/
	total_amount?: number
	/**	Booking : Link - Booking	*/
	booking: string
	/**	Customer : Link - Client	*/
	customer?: string
	/**	Posting Date : Date	*/
	posting_date: string
	/**	Effective From : Date	*/
	effective_from?: string
	/**	Items : Table - Other Charges Invoice Item	*/
	items?: OtherChargesInvoiceItem[]
	/**	Amended From : Link - Other Charges Invoice	*/
	amended_from?: string
}
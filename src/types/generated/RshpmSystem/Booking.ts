import { InstallmentScheduleTable } from './InstallmentScheduleTable'

export interface Booking{
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
	/**	Booking Date : Date	*/
	booking_date: string
	/**	Total Cost : Currency	*/
	total_cost?: number
	/**	Discount : Currency	*/
	discount?: number
	/**	Net Total : Currency	*/
	net_total?: number
	/**	Customer : Link - Client	*/
	customer: string
	/**	Property : Link - Property	*/
	property: string
	/**	Company : Link - Company	*/
	company: string
	/**	Payment Plan Type : Select	*/
	payment_plan_type?: "Fixed" | "Custom"
	/**	Down Payment Amount : Currency	*/
	down_payment_amount?: number
	/**	Next Due Date : Date	*/
	next_due_date?: string
	/**	Down Payment Paid : Currency	*/
	down_payment_paid?: number
	/**	Remaining Balance : Currency	*/
	remaining_balance?: number
	/**	Advance Amount : Currency	*/
	advance_amount?: number
	/**	Installments Paid Total : Currency	*/
	installments_paid_total?: number
	/**	Total Paid : Currency	*/
	total_paid?: number
	/**	Overdue Amount : Currency	*/
	overdue_amount?: number
	/**	Down Payment Percentage : Percent	*/
	down_payment_percentage?: number
	/**	Installment Interval : Select	*/
	installment_interval?: "Monthly" | "Quarterly" | "Custom"
	/**	Penalty Rule : Data	*/
	penalty_rule?: string
	/**	Total Installments : Int	*/
	total_installments?: number
	/**	Grace Days : Int	*/
	grace_days?: number
	/**	Status : Select	*/
	status?: "Draft" | "Submitted" | "Allotted" | "Active" | "Completed" | "Cancelled"
	/**	Installment Schedule : Table - Installment Schedule Table	*/
	installment_schedule?: InstallmentScheduleTable[]
	/**	Amended From : Link - Booking	*/
	amended_from?: string
}
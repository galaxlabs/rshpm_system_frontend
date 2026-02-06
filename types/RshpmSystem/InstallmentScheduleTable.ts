
export interface InstallmentScheduleTable{
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
	/**	Installment Name : Data	*/
	installment_name?: string
	/**	Due Amount : Currency	*/
	due_amount?: number
	/**	Status : Select	*/
	status?: "Unpaid" | "Partially Paid" | "Paid" | "Overdue"
	/**	Due Date : Date	*/
	due_date?: string
	/**	Paid Amount : Currency	*/
	paid_amount?: number
	/**	Last Payment Date : Date	*/
	last_payment_date?: string
}
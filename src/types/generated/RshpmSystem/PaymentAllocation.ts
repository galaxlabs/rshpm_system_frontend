
export interface PaymentAllocation{
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
	/**	Allocated Date : Date	*/
	allocated_date?: string
	/**	Note : Small Text	*/
	note?: string
	/**	Attachments : Select	*/
	attachments_typ?: "Deposit Slip" | "Screenshot" | "Receipt Scan"
	/**	Attach Image : Attach Image	*/
	attach_image?: string
	/**	Attach File : Attach	*/
	attach_file?: string
	/**	Allocated Amount : Currency	*/
	allocated_amount?: number
	/**	Schedule Row ID : Data	*/
	schedule_row_name?: string
	/**	Due Date : Date	*/
	due_date?: string
}
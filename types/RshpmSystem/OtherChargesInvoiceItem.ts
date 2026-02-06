
export interface OtherChargesInvoiceItem{
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
	/**	Charge Type : Link - Charge Type	*/
	charge_type?: string
	/**	Description : Data	*/
	description?: string
	/**	Amount : Currency	*/
	amount?: number
}
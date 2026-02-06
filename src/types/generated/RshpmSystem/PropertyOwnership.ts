
export interface PropertyOwnership{
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
	/**	Property : Link - Property	*/
	property: string
	/**	Ownership Start Date : Date	*/
	ownership_start_date?: string
	/**	Ownership End Date : Date	*/
	ownership_end_date?: string
	/**	Remarks : Small Text	*/
	remarks?: string
	/**	Owner Client : Link - Client	*/
	owner_client?: string
	/**	Ownership Status : Select	*/
	ownership_status?: string
	/**	Booking : Link - Booking	*/
	booking?: string
	/**	Amended From : Link - Property Ownership	*/
	amended_from?: string
}
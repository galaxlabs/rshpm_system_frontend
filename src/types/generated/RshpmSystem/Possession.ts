
export interface Possession{
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
	/**	Possession Date : Date	*/
	possession_date: string
	/**	Company : Link - Company	*/
	company?: string
	/**	Booking : Link - Booking	*/
	booking?: string
	/**	Property : Link - Property	*/
	property?: string
	/**	Client : Link - Property	*/
	client?: string
	/**	Notes : Small Text	*/
	notes?: string
	/**	Final Clearance Check : Check	*/
	final_clearance_check?: 0 | 1
	/**	 : Select	*/
	naming_series?: "POS-.YYYY.-.#####"
}
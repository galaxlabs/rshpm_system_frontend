
export interface Allotment{
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
	/**	 : Select	*/
	naming_series?: "ALT-.YYYY.-.#####"
	/**	Company : Link - Company	*/
	company: string
	/**	Booking : Link - Booking	*/
	booking: string
	/**	Client : Link - Client	*/
	client?: string
	/**	Property : Link - Property	*/
	property?: string
	/**	Allotment Date : Date	*/
	allotment_date?: string
	/**	Total Price : Currency	*/
	total_price?: number
	/**	Terms : Text Editor	*/
	terms?: string
	/**	Signed Copy : Attach	*/
	signed_copy?: string
	/**	Amended From : Link - Allotment	*/
	amended_from?: string
}

export interface Watchlist{
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
	/**	Active : Check	*/
	active?: 0 | 1
	/**	Company : Link - Company	*/
	company?: string
	/**	CNIC Normalized : Data	*/
	cnic_normalized?: string
	/**	Phone Normalized : Data	*/
	phone_normalized?: string
	/**	Reason : Data	*/
	reason?: string
	/**	Flagged By : Data	*/
	flagged_by?: string
}
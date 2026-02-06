
export interface PropertyPriceHistory{
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
	/**	Base Price : Currency	*/
	base_price?: number
	/**	Discount : Currency	*/
	discount?: number
	/**	Final Price : Currency	*/
	final_price?: number
}
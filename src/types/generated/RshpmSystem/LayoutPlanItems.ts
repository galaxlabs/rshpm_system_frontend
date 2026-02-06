
export interface LayoutPlanItems{
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
	/**	Property No : Data	*/
	property_no?: string
	/**	Area : Data	*/
	area?: string
	/**	Type : Data	*/
	type?: string
	/**	Coordinates : Data	*/
	coordinates?: string
}
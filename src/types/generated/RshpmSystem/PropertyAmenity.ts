
export interface PropertyAmenity{
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
	/**	Included : Check	*/
	included?: 0 | 1
	/**	Amenity : Link - Amenity	*/
	amenity?: string
	/**	Value : Data	*/
	value?: string
	/**	Notes : Small Text	*/
	notes?: string
	/**	Extra Cost : Currency	*/
	extra_cost?: number
}
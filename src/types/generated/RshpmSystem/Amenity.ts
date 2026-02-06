
export interface Amenity{
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
	/**	Is Active : Check	*/
	is_active?: 0 | 1
	/**	Amenity Name : Data	*/
	amenity_name?: string
	/**	Category : Link - Amenity Category	*/
	category?: string
	/**	Description : Small Text	*/
	description?: string
}
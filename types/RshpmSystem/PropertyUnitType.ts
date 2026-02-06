
export interface PropertyUnitType{
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
	/**	Unit Type Name : Data	*/
	unit_type_name?: string
	/**	Code : Data	*/
	code?: string
	/**	Active : Check	*/
	is_active?: 0 | 1
}
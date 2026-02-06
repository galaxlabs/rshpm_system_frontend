
export interface HousingScheme{
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
	/**	Project Name : Data	*/
	project_name?: string
	/**	Location : Data	*/
	location?: string
	/**	Developer : Data	*/
	developer?: string
	/**	Phase : Data	*/
	phase?: string
	/**	Company : Link - Company	*/
	company?: string
}
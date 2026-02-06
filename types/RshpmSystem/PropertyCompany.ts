
export interface PropertyCompany{
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
	/**	Company Name : Data	*/
	company_name?: string
	/**	Legal Name : Data	*/
	legal_name?: string
	/**	Logo : Attach Image	*/
	logo?: string
	/**	Address : Data	*/
	address?: string
	/**	Phone : Phone	*/
	phone?: string
	/**	Email : Data	*/
	email?: string
	/**	Tax Id : Data	*/
	tax_id?: string
	/**	Default Currency : Data	*/
	default_currency?: string
	/**	Company Code : Data	*/
	company_code: string
}
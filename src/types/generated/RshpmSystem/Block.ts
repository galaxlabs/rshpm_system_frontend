
export interface Block{
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
	/**	Block Name : Data	*/
	block_name?: string
	/**	Total Number of Plots : Int	*/
	total_number_of_plots?: number
	/**	Amended From : Link - Block	*/
	amended_from?: string
	/**	Company : Link - Company	*/
	company?: string
}
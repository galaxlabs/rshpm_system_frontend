import { LayoutPlanItems } from './LayoutPlanItems'

export interface BlockLayoutPlan{
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
	/**	Project Name : Link - Block	*/
	project_name?: string
	/**	File No : Link - Block	*/
	file_no?: string
	/**	Block : Link - Block	*/
	block?: string
	/**	Approved Map : Attach	*/
	approved_map?: string
	/**	list of plots : Data	*/
	plots_list?: string
	/**	Status : Select	*/
	status?: "Draft" | "Submitted" | "Approved"
	/**	Layout Plan Items : Table - Layout Plan Items	*/
	layout_plan_items?: LayoutPlanItems[]
	/**	Amended From : Link - Block Layout Plan	*/
	amended_from?: string
}
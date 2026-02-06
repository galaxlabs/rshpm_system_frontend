
export interface FollowUps{
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
	/**	Date : Date	*/
	date?: string
	/**	Remarks : Small Text	*/
	remarks?: string
	/**	Next Ection Date : Date	*/
	next_action_date?: string
}
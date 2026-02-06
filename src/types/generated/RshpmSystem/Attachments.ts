
export interface Attachments{
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
	/**	Document Types : Link - Document Types	*/
	document_types?: string
	/**	Required : Check	*/
	required?: 0 | 1
	/**	Received : Check	*/
	received?: 0 | 1
	/**	Attachment : Attach	*/
	attachment?: string
}
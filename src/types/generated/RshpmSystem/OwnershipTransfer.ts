import { Attachments } from './Attachments'

export interface OwnershipTransfer{
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
	/**	Booking : Link - Booking	*/
	booking?: string
	/**	Property : Link - Property	*/
	property: string
	/**	Transfer Type : Select	*/
	transfer_type?: string
	/**	Transfer Date : Date	*/
	transfer_date?: string
	/**	Remarks : Small Text	*/
	remarks?: string
	/**	From Client : Link - Client	*/
	from_client: string
	/**	To Client : Link - Client	*/
	to_client: string
	/**	Transfer Fee : Currency	*/
	transfer_fee?: number
	/**	Company : Link - Company	*/
	company: string
	/**	Transfer Fee Paid : Link - Payment	*/
	transfer_fee_paid?: string
	/**	Original Documents Returned : Check	*/
	original_documents_returned?: 0 | 1
	/**	Documents Return Log : Small Text	*/
	document_return_log?: string
	/**	Required Docs : Table - Attachments	*/
	required_docs?: Attachments[]
	/**	Amended From : Link - Ownership Transfer	*/
	amended_from?: string
}
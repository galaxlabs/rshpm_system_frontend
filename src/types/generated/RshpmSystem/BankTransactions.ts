
export interface BankTransactions{
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
	/**	Company : Link - Company	*/
	company?: string
	/**	Amount : Currency	*/
	amount?: number
	/**	Reference : Small Text	*/
	reference?: string
	/**	Bank Account : Data	*/
	bank_account?: string
	/**	Txn Date : Data	*/
	txn_date?: string
	/**	Sender Account : Data	*/
	sender_account?: string
	/**	Status : Select	*/
	status?: "Unmatched" | "Matched" | "Investigate"
	/**	Matched Payment : Link - Payment	*/
	matched_payment?: string
}
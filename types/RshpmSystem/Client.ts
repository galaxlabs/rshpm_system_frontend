
export interface Client{
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
	/**	Full Name : Data	*/
	full_name?: string
	/**	Father Name : Data	*/
	father_name?: string
	/**	CNIC Number : Data	*/
	cnic_number: string
	/**	Date of Birth : Date	*/
	date_of_birth?: string
	/**	Company : Link - Company	*/
	company?: string
	/**	Reletion With Nominee : Select	*/
	reletion_with_nominee?: "Wife" | "Father" | "Mother" | "Son" | "Doughter" | "Sister" | "Brother"
	/**	KYC Status : Select	*/
	kyc_status?: "Unverified" | "Verified" | "Rejected"
	/**	 : Data	*/
	naming_series?: string
	/**	User : Link - User	*/
	user?: string
	/**	Mobile Number : Data	*/
	mobile_number: string
	/**	Email Address : Data	*/
	email_address?: string
	/**	Address : Small Text	*/
	address?: string
	/**	Cnic Normalized : Data	*/
	cnic_normalized?: string
	/**	Phone Normalized : Data	*/
	phone_normalized?: string
	/**	Risk Flags : Small Text	*/
	risk_flags?: string
	/**	Nominee Name : Data	*/
	nominee_name?: string
	/**	Profile Picture : Attach Image	*/
	profile_picture?: string
	/**	Nominee CNIC : Data	*/
	nominee_cnic?: string
	/**	Nominee Mobile : Data	*/
	nominee_mobile?: string
	/**	Attachments : Table - Attachments	*/
	attachments?: any
}
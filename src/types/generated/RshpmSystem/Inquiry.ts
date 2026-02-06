import { FollowUps } from './FollowUps'

export interface Inquiry{
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
	/**	First Name : Data	*/
	first_name?: string
	/**	Last Name  : Data	*/
	last_name?: string
	/**	Full Name : Data	*/
	full_name?: string
	/**	Interested Scheme : Link - Housing Scheme	*/
	interested_scheme?: string
	/**	Property Type : Select	*/
	property_type?: "Plot" | "House" | "Shop" | "Apartment" | "Other"
	/**	Block : Link - Block	*/
	block?: string
	/**	Client : Link - Client	*/
	client?: string
	/**	Assigned To : Link - User	*/
	assigned_to?: string
	/**	Mobile : Data	*/
	phone?: string
	/**	CNIC : Data	*/
	cnic?: string
	/**	Address : Small Text	*/
	address?: string
	/**	Budget  : Data	*/
	budget?: string
	/**	Notes : Small Text	*/
	notes?: string
	/**	Status : Select	*/
	status?: "New" | "Contacted" | "Follow-up" | "Converted" | "Closed" | "Qualified" | "Lost"
	/**	Follow Ups : Table - Follow Ups	*/
	follow_ups?: FollowUps[]
	/**	 : Data	*/
	cnic_normalized?: string
	/**	 : Data	*/
	phone_normalized?: string
	/**	 : Data	*/
	naming_series?: string
	/**	 : Datetime	*/
	converted_on?: string
	/**	 : Link - User	*/
	converted_by?: string
}
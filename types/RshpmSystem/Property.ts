
export interface Property{
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
	/**	Plot Number : Data	*/
	plot_number: string
	/**	Area : Float	*/
	area_text: number
	/**	Area (Sqft) : Float	*/
	area_value?: number
	/**	Area Unit : Select	*/
	area_unit: "Kanal" | "Marla" | "Sqyd" | "Sqft"
	/**	Total Cost : Currency	*/
	total_cost: number
	/**	Property Type : Select	*/
	property_type?: "Residential" | "Commercial" | "Plot"
	/**	Reserved Till : Datetime	*/
	reserved_till?: string
	/**	Current Owner : Link - Property Ownership	*/
	current_owner?: string
	/**	Naming Series : Select	*/
	naming_series?: "PROP-.YYYY.-.#####"
	/**	Block : Link - Block	*/
	block: string
	/**	Status : Select	*/
	status?: "Inventory" | "Reserved" | "Booked" | "Allotted" | "Possession" | "Transferred" | "Cancelled" | "Blocked"
	/**	Unit Type : Link - Property Unit Type	*/
	unit_type: string
	/**	Unique ID : Data	*/
	unique_id?: string
	/**	QR Code : Attach Image	*/
	qr_code?: string
	/**	Current Booking : Link - Booking	*/
	current_booking?: string
	/**	Booked By : Data	*/
	booked_by?: string
	/**	Is Owner Locked : Check	*/
	is_owner_locked?: 0 | 1
	/**	Company : Link - Property Company	*/
	company?: string
	/**	Housing Scheme : Link - Housing Scheme	*/
	housing_scheme: string
	/**	Amenities : Table - Property Amenity	*/
	amenities?: any
	/**	Property Price History : Table - Property Price History	*/
	property_price_history?: any
	/**	Description : Text Editor	*/
	description?: string
	/**	Location : Geolocation	*/
	location?: any
}
// src/modules/rshpm/doctypeRegistry.ts

export type FieldType =
  | "Data"
  | "Int"
  | "Float"
  | "Currency"
  | "Date"
  | "Select"
  | "Link"
  | "Text"
  | "Check";

export type FormField = {
  fieldname: string;      // API fieldname
  label: string;          // UI label
  type: FieldType;
  options?: string;       // Link: doctype name, Select: newline-separated options
  required?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  section?: string;       // ✅ UI grouping (e.g., "Nominee")
};

export type DoctypeConfig = {
  doctype: string;
  label: string;
  titleField?: string;

  // list page
  listFields: string[];
  listLabels?: Record<string, string>;
  hiddenListFields?: string[];

  // form page
  formFields: FormField[];

  // search
  searchFields?: string[];
};

export const DOCTYPES: DoctypeConfig[] = [
  {
    doctype: "Property",
    label: "Property",
    titleField: "plot_number",

    listFields: ["name", "plot_number", "block", "housing_scheme", "status", "total_cost"],
    listLabels: {
      name: "ID",
      plot_number: "Plot #",
      block: "Block",
      housing_scheme: "Scheme",
      status: "Status",
      total_cost: "Total Cost",
    },

    searchFields: ["name", "plot_number"],

    formFields: [
      { fieldname: "naming_series", label: "Naming Series", type: "Select", options: "PROP-.YYYY.-.#####", required: true },
      { fieldname: "plot_number", label: "Plot Number", type: "Data", required: true },

      { fieldname: "housing_scheme", label: "Housing Scheme", type: "Link", options: "Housing Scheme", required: true },
      { fieldname: "block", label: "Block", type: "Link", options: "Block", required: true },

      { fieldname: "unit_type", label: "Unit Type", type: "Select", options: "Plot\nHouse\nShop\nApartment\nOther", required: true },

      { fieldname: "area_text", label: "Area", type: "Float", required: true },
      { fieldname: "area_unit", label: "Area Unit", type: "Select", options: "Kanal\nMarla\nSqyd\nSqft", required: true },
      { fieldname: "total_cost", label: "Total Cost", type: "Currency", required: true },

      {
        fieldname: "status",
        label: "Status",
        type: "Select",
        options: "Inventory\nReserved\nBooked\nAllotted\nPossession\nTransferred\nCancelled\nBlocked",
      },

      { fieldname: "property_type", label: "Property Type", type: "Select", options: "Residential\nCommercial\nPlot" },
      { fieldname: "company", label: "Company", type: "Link", options: "Company" },
      { fieldname: "description", label: "Description", type: "Text" },

      // internal/system
      { fieldname: "area_value", label: "Area (Sqft)", type: "Float", readOnly: true },
      { fieldname: "unique_id", label: "Unique ID", type: "Data", hidden: true },
      { fieldname: "qr_code", label: "QR Code", type: "Data", hidden: true },
      { fieldname: "current_booking", label: "Current Booking", type: "Link", options: "Booking", hidden: true },
      { fieldname: "booked_by", label: "Booked By", type: "Data", hidden: true },
      { fieldname: "is_owner_locked", label: "Is Owner Locked", type: "Check", hidden: true },
      { fieldname: "current_owner", label: "Current Owner", type: "Link", options: "Property Ownership", hidden: true },
      { fieldname: "reserved_till", label: "Reserved Till", type: "Date", hidden: true },
    ],
  },

  {
    doctype: "Client",
    label: "Client",
    titleField: "full_name",

    listFields: ["name", "full_name", "mobile_number", "email_address", "kyc_status"],
    listLabels: {
      name: "Client ID",
      full_name: "Full Name",
      mobile_number: "Mobile",
      email_address: "Email",
      kyc_status: "KYC",
    },

    formFields: [
      { fieldname: "full_name", label: "Full Name", type: "Data", required: true },
      { fieldname: "father_name", label: "Father Name", type: "Data" },
      { fieldname: "cnic_number", label: "CNIC", type: "Data", required: true },
      { fieldname: "mobile_number", label: "Mobile", type: "Data", required: true },
      { fieldname: "email_address", label: "Email", type: "Data" },
      { fieldname: "company", label: "Company", type: "Link", options: "Company" },
      { fieldname: "kyc_status", label: "KYC Status", type: "Select", options: "Unverified\nVerified\nRejected" },

      // Nominee section
      { fieldname: "nominee_name", label: "Nominee Name", type: "Data", section: "Nominee" },
      { fieldname: "nominee_cnic", label: "Nominee CNIC", type: "Data", section: "Nominee" },
      { fieldname: "reletion_with_nominee", label: "Relation With Nominee", type: "Data", section: "Nominee" },
      { fieldname: "nominee_phone", label: "Nominee Phone", type: "Data", section: "Nominee" },

      // internal/system
      { fieldname: "cnic_normalized", label: "CNIC Normalized", type: "Data", hidden: true },
      { fieldname: "phone_normalized", label: "Phone Normalized", type: "Data", hidden: true },
      { fieldname: "user", label: "User", type: "Link", options: "User", hidden: true },
    ],
  },

  {
    doctype: "Booking",
    label: "Booking",
    titleField: "name",

    listFields: ["name", "booking_date", "customer", "property", "status", "net_total", "total_paid", "remaining_balance"],
    listLabels: {
      name: "Booking ID",
      booking_date: "Date",
      customer: "Client",
      property: "Property",
      status: "Status",
      net_total: "Net Total",
      total_paid: "Paid",
      remaining_balance: "Balance",
    },

    formFields: [
      { fieldname: "booking_date", label: "Booking Date", type: "Date" },
      { fieldname: "company", label: "Company", type: "Link", options: "Company" },
      { fieldname: "customer", label: "Client", type: "Link", options: "Client", required: true },
      { fieldname: "property", label: "Property", type: "Link", options: "Property", required: true },
      { fieldname: "status", label: "Status", type: "Select", options: "Reserved\nBooked\nAllotted\nPossession\nCancelled" },

      { fieldname: "total_cost", label: "Total Cost", type: "Currency" },
      { fieldname: "discount", label: "Discount", type: "Currency" },

      { fieldname: "net_total", label: "Net Total", type: "Currency", readOnly: true },
      { fieldname: "total_paid", label: "Total Paid", type: "Currency", readOnly: true },
      { fieldname: "remaining_balance", label: "Remaining Balance", type: "Currency", readOnly: true },

      { fieldname: "down_payment_amount", label: "Down Payment", type: "Currency" },
      { fieldname: "payment_plan_type", label: "Payment Plan Type", type: "Select", options: "Installments\nFull Payment" },
      { fieldname: "total_installments", label: "Total Installments", type: "Int" },
      { fieldname: "installment_interval", label: "Installment Interval (Months)", type: "Int" },
      { fieldname: "grace_days", label: "Grace Days", type: "Int" },

      // internal/derived
      { fieldname: "advance_amount", label: "Advance Amount", type: "Currency", hidden: true },
      { fieldname: "overdue_amount", label: "Overdue Amount", type: "Currency", hidden: true },
      { fieldname: "next_due_date", label: "Next Due Date", type: "Date", hidden: true },
    ],
  },
];

export function getDoctypeConfig(doctype: string) {
  return DOCTYPES.find((d) => d.doctype === doctype);
}

export function visibleFormFields(cfg: DoctypeConfig) {
  return cfg.formFields.filter((f) => !f.hidden);
}

export function visibleListFields(cfg: DoctypeConfig) {
  const hidden = new Set(cfg.hiddenListFields || []);
  return cfg.listFields.filter((f) => !hidden.has(f));
}

export function labelForListField(cfg: DoctypeConfig, fieldname: string) {
  if (cfg.listLabels?.[fieldname]) return cfg.listLabels[fieldname];
  const ff = cfg.formFields.find((x) => x.fieldname === fieldname);
  return ff?.label || fieldname;
}

export function groupFieldsBySection(fields: FormField[]) {
  // Default section name for fields without explicit section
  const DEFAULT = "Details";
  const map = new Map<string, FormField[]>();

  for (const f of fields) {
    if (f.hidden) continue;
    const key = f.section?.trim() || DEFAULT;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(f);
  }

  return Array.from(map.entries()).map(([section, items]) => ({ section, items }));
}

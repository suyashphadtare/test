frappe.listview_settings['Sales Order'] = {
	add_fields: ["tabSales_Order.`grand_total`", "tabSales_Order.`company`", "tabSales_Order.`currency`",
		"tabSales_Order.`customer`", "tabSales_Order.`customer_name`", "tabSales_Order.`per_billed`",
		"tabSales_Order.`per_delivered`", "tabSales_Order.`delivery_date`"],
	filters: [["per_delivered", "<", 100]]
};

# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe

def execute():
	for si in frappe.db.sql_list("""select name
		from tabSales_Invoice
		where ifnull(update_stock,0) = 1 and docstatus = 1 and exists(
			select name from tabSales_Invoice_Item where parent=tabSales_Invoice.name and
				ifnull(so_detail, "") != "")"""):

		invoice = frappe.get_doc("Sales Invoice", si)
		invoice.update_qty()

# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe

def execute():
	# udpate sales cycle
	for d in ['Sales Invoice', 'Sales Order', 'Quotation', 'Delivery Note']:
		frappe.db.sql("""update `tab%s` set taxes_and_charges=charge""" % d)

	# udpate purchase cycle
	for d in ['Purchase Invoice', 'Purchase Order', 'Supplier Quotation', 'Purchase Receipt']:
		frappe.db.sql("""update `tab%s` set taxes_and_charges=purchase_other_charges""" % d)
	
	frappe.db.sql("""update tabPurchase_Taxes_and_Charges set parentfield='other_charges'""")

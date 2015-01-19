# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors

from __future__ import unicode_literals
import frappe

def execute():
	missing_line = """{{ address_line1 }}<br>"""
	for name, template in frappe.db.sql("select name, template from tabAddress_Template"):
		if missing_line not in template:
			d = frappe.get_doc("Address Template", name)
			d.template = missing_line + d.template
			d.save()

# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe

def execute():
	frappe.reload_doc('buying', 'Print Format', 'Purchase Order Classic')
	frappe.reload_doc('buying', 'Print Format', 'Purchase Order Modern')
	frappe.reload_doc('buying', 'Print Format', 'Purchase Order Spartan')
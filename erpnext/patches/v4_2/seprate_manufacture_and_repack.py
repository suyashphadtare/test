# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe

def execute():
	frappe.db.sql("""update tabStock_Entry set purpose='Manufacture' where purpose='Manufacture/Repack' and ifnull(production_order,"")!="" """)
	frappe.db.sql("""update tabStock_Entry set purpose='Repack' where purpose='Manufacture/Repack' and ifnull(production_order,"")="" """)
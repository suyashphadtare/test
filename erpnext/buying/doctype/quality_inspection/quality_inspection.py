# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe


from frappe.model.document import Document

class QualityInspection(Document):

	def get_item_specification_details(self):
		self.set('qa_specification_details', [])
		specification = frappe.db.sql("select specification, value from tabItem_Quality_Inspection_Parameter \
			where parent = '%s' order by idx" % (self.item_code))
		for d in specification:
			child = self.append('qa_specification_details', {})
			child.specification = d[0]
			child.value = d[1]
			child.status = 'Accepted'

	def on_submit(self):
		if self.purchase_receipt_no:
			frappe.db.sql("""update tabPurchase_Receipt_Item t1, tabPurchase_Receipt t2 
				set t1.qa_no = %s, t2.modified = %s 
				where t1.parent = %s and t1.item_code = %s and t1.parent = t2.name""",  
				(self.name, self.modified, self.purchase_receipt_no, 
					self.item_code))
		

	def on_cancel(self):
		if self.purchase_receipt_no:
			frappe.db.sql("""update tabPurchase_Receipt_Item t1, tabPurchase_Receipt t2 
				set t1.qa_no = '', t2.modified = %s
				where t1.parent = %s and t1.item_code = %s and t1.parent = t2.name""", 
				(self.modified, self.purchase_receipt_no, self.item_code))


def item_query(doctype, txt, searchfield, start, page_len, filters):
	if filters.get("from"):
		from frappe.widgets.reportview import get_match_cond
		filters.update({
			"txt": txt,
			"mcond": get_match_cond(filters["from"]),
			"start": start,
			"page_len": page_len
		})
		return frappe.db.sql("""select item_code from `tab%(from)s` 
			where parent='%(parent)s' and docstatus < 2 and item_code like '%%%(txt)s%%' %(mcond)s
			order by item_code limit %(start)s, %(page_len)s""" % filters)
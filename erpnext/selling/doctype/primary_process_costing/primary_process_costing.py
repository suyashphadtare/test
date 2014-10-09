# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PrimaryProcessCosting(Document):
	
	def set_pp_total(self,idx):
		for d in self.get("primary_process"):
			total += d.price_with_markup
		self.rm_total_price=total
		return "done"

	def create_new_rfq(self,idx):
		for item in self.get('primary_process'):
			if item.idx==idx:
				rmrfq=frappe.new_doc("Primary Process RFQ")
				rmrfq.save(ignore_permissions=True)
				mq=rmrfq.append('primary_process_rfq_details',{})
				mq.mat_spec_and_type=item.spec
				rmrfq.save(ignore_permissions=True)
				item.quote_ref=rmrfq.name
		return "done"

	def update_new_rfq(self,idx):
		rfq_name=frappe.db.sql("select name from `tabPrimary Process RFQ` order by creation desc limit 1",as_list=1)
		if rfq_name:
			for item in self.get('primary_process'):
				if item.idx==idx:
					mrfq=frappe.get_doc("Primary Process RFQ",rfq_name[0][0])
					crfq=mrfq.append("primary_process_rfq_details",{})
					crfq.mat_spec_and_type=item.spec
					mrfq.save(ignore_permissions=True)
					item.quote_ref=mrfq.name
		return "done"

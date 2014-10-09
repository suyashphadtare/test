# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RawMaterialCostSheet(Document):
	
	def set_rm_total(self,idx):
		total=0
		for d in self.get("raw_material_costing_details"):
			total += d.price_with_markup
		
		self.rm_total_price=total
		return "done"

	def create_new_rfq(self,idx):
		for item in self.get('raw_material_costing_details'):
			if item.idx==idx:
				rmrfq=frappe.new_doc("Material RFQ")
				rmrfq.save(ignore_permissions=True)
				mq=rmrfq.append('material_rfq_details',{})
				mq.mat_spec_and_type=item.spec
				mq.od=item.od
				mq.id=item.id
				mq.lg=item.lg
				rmrfq.save(ignore_permissions=True)
				item.quote_ref=rmrfq.name
		return "done"

	def update_new_rfq(self,idx):
		rfq_name=frappe.db.sql("select name from `tabMaterial RFQ` order by creation desc limit 1",as_list=1)
		if rfq_name:
			for item in self.get('raw_material_costing_details'):
				if item.idx==idx:
					mrfq=frappe.get_doc("Material RFQ",rfq_name[0][0])
					crfq=mrfq.append("material_rfq_details",{})
					crfq.mat_spec_and_type=item.spec
					crfq.od=item.od
					crfq.id=item.id
					crfq.lg=item.lg
					mrfq.save(ignore_permissions=True)
					item.quote_ref=mrfq.name
		return "done"


				
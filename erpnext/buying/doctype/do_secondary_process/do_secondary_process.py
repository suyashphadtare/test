# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc

class DOSecondaryProcess(Document):
	def make_do(self):
		for d in self.get('secondary_process_details'):
			coc=frappe.new_doc("Certificate Of Conformance")
			coc.client_name=self.requested_by
			coc.do_no=self.name
			coc.po_no=self.po_secondary_process
			coc.part_name=d.part_name
			coc.drawing_no=d.drawing_no
			coc.part_no=d.part_no
			coc.job_no=d.job_order
			coc.batch_no=d.batch_no
			coc.quantity=d.qty
			coc.save(ignore_permissions=True)
			coc.coc_no=coc.name
			coc.save(ignore_permissions=True)
		return "done"

@frappe.whitelist()
def get_po(source_name, target_doc=None):
	return _get_po(source_name, target_doc)

def _get_po(source_name, target_doc=None, ignore_permissions=False):
	
	doclist = get_mapped_doc("PO Secondary Process", source_name, {
			"PO Secondary Process": {
				"doctype": "DO Secondary Process",
			},
            "SP Costing Details": {
                "doctype": "SP Costing Details"                    
            }
			
	}, target_doc,ignore_permissions=ignore_permissions)

	return doclist
frappe.provide("erpnext.buying");
{% include 'buying/doctype/purchase_common/purchase_common.js' %};

erpnext.buying.PoMaterialController = frappe.ui.form.Controller.extend({
	refresh: function(doc, cdt, cdn) {
		 
		this.frm.dashboard.reset();
			
		if(doc.docstatus == 1){
			cur_frm.add_custom_button(__('Make Purchase Order'),
					this.make_purchase_order, frappe.boot.doctype_icons["Purchase Receipt"]);
			cur_frm.add_custom_button(__('Make DO'),
					this.make_do, frappe.boot.doctype_icons["Purchase Receipt"]);
	
		}
	},
	make_purchase_order: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.buying.doctype.po_material.po_material.make_purchase_order",
			frm: cur_frm
		})
	},
	make_do: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.buying.doctype.do_material.do_material.get_po",
			frm: cur_frm
		})
	},
	
	tc_name: function() {
			var me = this;
		if(this.frm.doc.tc_name) {
			return this.frm.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Terms and Conditions",
					fieldname: "terms",
					filters: { name: this.frm.doc.tc_name },
				},
			});
		}
	},
	
});


$.extend(cur_frm.cscript, new erpnext.buying.PoMaterialController({frm: cur_frm}));

cur_frm.cscript.job_order=function(){
	return frappe.call({
			doc: cur_frm.doc,
			method: "get_details",
			callback: function(r) {
				refresh_field(['raw_material_details','qty']);
			}
		});
}

cur_frm.cscript.supplier=function(doc,cdt,cdn){
	frappe.call({
		method: "erpnext.buying.doctype.po_material.po_material.get_address",
		args:{"supplier":doc.supplier},
		callback: function(r) {
			if(r.message)
				cur_frm.set_value("address_display", r.message)
			refresh_field("address_display")
		}
	});
}


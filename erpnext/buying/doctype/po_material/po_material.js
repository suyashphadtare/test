frappe.provide("erpnext.buying");
{% include 'buying/doctype/purchase_common/purchase_common.js' %};

erpnext.buying.PoMaterialController = frappe.ui.form.Controller.extend({
	refresh: function(doc, cdt, cdn) {
		 
		this.frm.dashboard.reset();
			
		if(doc.docstatus == 1){
			alert("hii")
			cur_frm.add_custom_button(__('Make Purchase Order'),
					this.make_purchase_order, frappe.boot.doctype_icons["Purchase Receipt"]);
	
		}
	},
	make_purchase_order: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.buying.doctype.po_material.po_material.make_purchase_order",
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

cur_frm.cscript.qty1=function(doc,cdt,cdn){
	console.log(this.frm.wrapper)
	me=this
	qty=doc.qty1
	this.field_list=[]
	for (i=0;i<qty;i++){
		l=parseInt(i)+1
		this.field_list[i]='q'+l
	}
	$.each(this.field_list,function(i, field) {
		console.log($(me.frm.wrapper).find(".form-column col-md-12"))
		/*frappe.ui.form.make_control({
			df: {
				"fieldtype": "Data",
				"fieldname": field,
			},
			parent:$(me.frm.wrapper).find(".form-column col-md-12"),
			frm: cur_frm
		}).make_input()*/
	})
	
}
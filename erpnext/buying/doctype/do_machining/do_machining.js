frappe.provide("erpnext.buying");
{% include 'buying/doctype/purchase_common/purchase_common.js' %};

erpnext.buying.DOMachining = frappe.ui.form.Controller.extend({
	refresh: function(doc, cdt, cdn) {
		 
		this.frm.dashboard.reset();
			
		if(doc.docstatus == 1){
			cur_frm.add_custom_button(__('Create DO'),cur_frm.cscript.make_do, "icon-truck");
		}
	},
});

$.extend(cur_frm.cscript, new erpnext.buying.DOMachining({frm: cur_frm}));



cur_frm.cscript.po_machining=function(doc,cdt,cdn){
	frappe.model.map_current_doc({
		method: "erpnext.buying.doctype.do_machining.do_machining.get_po",
		source_name:doc.po_machining,
	})
}
cur_frm.cscript.make_do=function(doc,cdt,cdn){
		return frappe.call({
			doc: cur_frm.doc,
			method: "make_do",
			callback: function(r) {
				if (r.message){
					msgprint(__("Do\' Created."));
				}
			}
		})
}
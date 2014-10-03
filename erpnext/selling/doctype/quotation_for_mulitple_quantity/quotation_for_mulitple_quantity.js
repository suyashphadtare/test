cur_frm.cscript.tname = "Multiple Quantity Item";
cur_frm.cscript.fname = "multiple_quantity_item";
cur_frm.cscript.other_fname = "other_charges";
cur_frm.cscript.sales_team_fname = "sales_team";


{% include 'selling/sales_common.js' %}
{% include 'accounts/doctype/sales_taxes_and_charges_master/sales_taxes_and_charges_master.js' %}
{% include 'utilities/doctype/sms_control/sms_control.js' %}
{% include 'accounts/doctype/sales_invoice/pos.js' %}


erpnext.selling.QuotationController = erpnext.selling.SellingController.extend({
	onload: function(doc, dt, dn) {
		var me = this;
		this._super(doc, dt, dn);
		if(doc.__islocal){
			get_server_fields('set_label','','',doc,dt,dn,1,function(r){refresh_field('multiple_quantity_item');
			 refresh_field('quantity_lable');
			})
		}
	},
	refresh: function(doc, dt, dn) {
		this._super(doc, dt, dn);
		// console.log(cur_frm)
		if(doc.docstatus == 1 && doc.status!=='Lost') {
			cur_frm.add_custom_button(__('Make Sales Order'),
				cur_frm.cscript['Make Sales Order']);
			if(doc.status!=="Ordered") {
				cur_frm.add_custom_button(__('Set as Lost'),
					cur_frm.cscript['Declare Order Lost'], "icon-exclamation");
			}
			cur_frm.appframe.add_button(__('Send SMS'), cur_frm.cscript.send_sms, "icon-mobile-phone");
		}

		if (!doc.__islocal) {
			cur_frm.communication_view = new frappe.views.CommunicationList({
				list: frappe.get_list("Communication", {"parent": doc.name, "parenttype": "Quotation"}),
				parent: cur_frm.fields_dict.communication_html.wrapper,
				doc: doc,
				recipients: doc.contact_email
			});
		}
		this.toggle_reqd_lead_customer();

	},

	quotation_to: function() {
		var me = this;
		if (this.frm.doc.quotation_to == "Lead") {
			this.frm.set_value("customer", null);
			this.frm.set_value("contact_person", null);
		} else if (this.frm.doc.quotation_to == "Customer") {
			this.frm.set_value("lead", null);
		}

		this.toggle_reqd_lead_customer();
	},

	toggle_reqd_lead_customer: function() {
		var me = this;

		this.frm.toggle_reqd("lead", this.frm.doc.quotation_to == "Lead");
		this.frm.toggle_reqd("customer", this.frm.doc.quotation_to == "Customer");

		// to overwrite the customer_filter trigger from queries.js
		$.each(["customer_address", "shipping_address_name"],
			function(i, opts) {
				me.frm.set_query(opts, me.frm.doc.quotation_to==="Lead"
					? erpnext.queries["lead_filter"] : erpnext.queries["customer_filter"]);
			}
		);
	},

	tc_name: function() {
		this.get_terms();
	},

	validate_company_and_party: function(party_field) {
			return this._super(party_field);
	},

	lead: function() {
		var me = this;
		frappe.call({
			method: "erpnext.selling.doctype.lead.lead.get_lead_details",
			args: { "lead": this.frm.doc.lead },
			callback: function(r) {
				if(r.message) {
					me.frm.updating_party_details = true;
					me.frm.set_value(r.message);
					me.frm.refresh();
					me.frm.updating_party_details = false;

				}
			}
		})
	},
	item_code:function(doc,cdt,cdn){
		var row = frappe.get_doc(cdt, cdn);
		get_server_fields('get_item_details',row.item_code,'',doc,cdt,cdn,1,function(r){
			console.log(r)
			refresh_field('multiple_quantity_item')	
		})
		
	}
});

cur_frm.script_manager.make(erpnext.selling.QuotationController);

cur_frm.cscript['Make Sales Order'] = function() {
	frappe.model.open_mapped_doc({
		method: "erpnext.selling.doctype.quotation_for_mulitple_quantity.quotation_for_mulitple_quantity.make_sales_order",
		frm: cur_frm
	})
}

cur_frm.cscript['Declare Order Lost'] = function(){
	var dialog = new frappe.ui.Dialog({
		title: "Set as Lost",
		fields: [
			{"fieldtype": "Text", "label": __("Reason for losing"), "fieldname": "reason",
				"reqd": 1 },
			{"fieldtype": "Button", "label": __("Update"), "fieldname": "update"},
		]
	});

	dialog.fields_dict.update.$input.click(function() {
		args = dialog.get_values();
		if(!args) return;
		return cur_frm.call({
			method: "declare_order_lost",
			doc: cur_frm.doc,
			args: args.reason,
			callback: function(r) {
				if(r.exc) {
					msgprint(__("There were errors."));
					return;
				}
				dialog.hide();
				cur_frm.refresh();
			},
			btn: this
		})
	});
	dialog.show();

}

cur_frm.cscript.on_submit = function(doc, cdt, cdn) {
	if(cint(frappe.boot.notification_settings.quotation))
		cur_frm.email_doc(frappe.boot.notification_settings.quotation_message);
}

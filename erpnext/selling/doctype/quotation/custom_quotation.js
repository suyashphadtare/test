

cur_frm.cscript.rfq_material = function() {
	return frappe.call({
			doc: cur_frm.doc,
			method: "get_rfq",
			args:{
				field_name:"raw_material_costing",
				clild_doc_type:"Raw Material Costing Details",
				parent_cost:"Raw Material Cost Sheet",
				child_docname:"raw_material_costing_details",
				rfq_doctype:"Material RFQ",
				rfq_child:"material_rfq_details"
			},
			callback: function(r) {
				if(r.exc) {
					msgprint(__("There were errors."));
					return;
				}
				else if (r.message){
					msgprint(__("{0} RFQ's Updated.",[r.message]));
				}
				cur_frm.refresh();
			}
		});
	
}

cur_frm.cscript.rfq_pp = function() {
	return frappe.call({
		doc: cur_frm.doc,
		method: "get_rfq",
		args:{
			field_name:"primary_process_costing",
			clild_doc_type:"Primary Process Details",
			parent_cost:"Primary Process Costing",
			child_docname:"primary_process",
			rfq_doctype:"Primary Process RFQ",
			rfq_child:"primary_process_rfq_details"
			},
		callback: function(r) {
			if(r.exc) {
				msgprint(__("There were errors."));
				return;
				}
				else if (r.message){
					msgprint(__("{0} RFQ's Updated.",[r.message]));
				}
				cur_frm.refresh();
			}
		});
}

cur_frm.cscript.rfq_sp = function() {
	return frappe.call({
			doc: cur_frm.doc,
			method: "get_rfq",
			args:{
				field_name:"secondary_process_costing",
				clild_doc_type:"Secondary Process Details",
				parent_cost:"Secondary Process Costing",
				child_docname:"secondary_process",
				rfq_doctype:"Secondary Process RFQ",
				rfq_child:"secondary_process_rfq_details"

			},
			callback: function(r) {
				if(r.exc) {
					msgprint(__("There were errors."));
					return;
				}
				else if (r.message){
					msgprint(__("{0} RFQ's Updated.",[r.message]));
				}
				cur_frm.refresh();
			}
		});
}

cur_frm.cscript.rfq_sm = function() {
	return frappe.call({
			doc: cur_frm.doc,
			method: "get_rfq",
			args:{
				field_name:"sub_machining_costing",
				clild_doc_type:"Sub Machining Details",
				parent_cost:"Sub Machining Costing",
				child_docname:"sub_machining",
				rfq_doctype:"Sub Machining RFQ",
				rfq_child:"sub_machining_rfq_details"

			},
			callback: function(r) {
				if(r.exc) {
					msgprint(__("There were errors."));
					return;
				}
				else if (r.message){
					msgprint(__("{0} RFQ's Updated.",[r.message]));
				}
				cur_frm.refresh();
			}

		});
}
//anand
cur_frm.cscript.raw_material_costing=function(doc,cdt,cdn){
	var d = locals[cdt][cdn]
	if (d.raw_material_costing){
	return $c_obj(doc, 'get_rm_total_price', d.idx, function(r, rt) {
			refresh_field('quotation_details');
		});
	}
}
//anand
cur_frm.cscript.primary_process_costing=function(doc,cdt,cdn){
	var d = locals[cdt][cdn]
	if (d.primary_process_costing){
	return $c_obj(doc, 'get_pp_total_price', d.idx, function(r, rt) {
			refresh_field('quotation_details');
		});
	}
}
//anand
cur_frm.cscript.sub_machining_costing=function(doc,cdt,cdn){
	var d = locals[cdt][cdn]
	if (d.sub_machining_costing){
	return $c_obj(doc, 'get_sm_total_price', d.idx, function(r, rt) {
			refresh_field('quotation_details');
		});
	}
}
//anand
cur_frm.cscript.secondary_process_costing=function(doc,cdt,cdn){
	var d = locals[cdt][cdn]
	if (d.secondary_process_costing){
	return $c_obj(doc, 'get_sp_total_price', d.idx, function(r, rt) {
			refresh_field('quotation_details');
		});
	}
}
//anand
cur_frm.cscript.machining_cost=function(doc,cdt,cdn){
	var d = locals[cdt][cdn]
	return $c_obj(doc, 'set_rate', d.idx, function(r, rt) {
			refresh_field('quotation_details');
		});
}
//anand
cur_frm.cscript.quantity=function(doc,cdt,cdn){
	var d = locals[cdt][cdn]
	d.qty=d.quantity
	refresh_field('rate')
	refresh_field('quotation_details');

}

cur_frm.fields_dict["quotation_details"].grid.get_field("raw_material_costing").get_query = function(doc) {
	return {
		filters: {
			'docstatus': 0
		}
	}
}
cur_frm.fields_dict["quotation_details"].grid.get_field("primary_process_costing").get_query = function(doc) {
	return {
		filters: {
			'from_quotation': doc.name
		}
	}
}
cur_frm.fields_dict["quotation_details"].grid.get_field("secondary_process_costing").get_query = function(doc) {
	return {
		filters: {
			'from_quotation': doc.name
		}
	}
}
cur_frm.fields_dict["quotation_details"].grid.get_field("sub_machining_costing").get_query = function(doc) {
	return {
		filters: {
			'from_quotation': doc.name
		}
	}
}
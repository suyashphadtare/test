cur_frm.cscript.mark_percent=function(doc,cdt,cdn){
	var d = frappe.get_doc(cdt, cdn);
	rate=d.unit_cost*d.mark_percent
	d.price_with_markup=rate
   	return $c_obj(doc, 'set_pp_total', d.idx, function(r, rt) {
			refresh_field("primary_process")
			refresh_field("pp_total")
		});
}

cur_frm.cscript.new_rfq=function(doc,cdt,cdn){
	var d = locals[cdt][cdn];
	return $c_obj(doc, 'create_new_rfq', d.idx, function(r, rt) {
			refresh_field("primary_process")
			refresh_field("quote_ref")
	});
}

cur_frm.cscript.current_rfq=function(doc,cdt,cdn){
	var d = locals[cdt][cdn];
	return $c_obj(doc, 'update_new_rfq', d.idx, function(r, rt) {
			refresh_field("primary_process")
			refresh_field("quote_ref")
	});
}



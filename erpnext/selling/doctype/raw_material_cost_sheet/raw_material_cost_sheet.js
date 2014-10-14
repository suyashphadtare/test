cur_frm.cscript.onload=function(){
	console.log(this)
}
//anand
cur_frm.cscript.unit_cost=function(doc,cdt,cdn){
	var d = frappe.get_doc(cdt, cdn);
	rate=d.unit_cost*d.lg
	d.price=rate
	refresh_field("raw_material_costing_details")
}
//anand
cur_frm.cscript.mark_percent=function(doc,cdt,cdn){
	var d = frappe.get_doc(cdt, cdn);
	rate=d.exchange_rate*d.price*d.mark_percent	
	d.price_with_markup=rate
	return $c_obj(doc, 'set_rm_total', d.idx, function(r, rt) {
			refresh_field("raw_material_costing_details")
			refresh_field("rm_total_price")
		});
    
}

cur_frm.cscript.new_rfq=function(doc,cdt,cdn){
	var d = locals[cdt][cdn];
	return $c_obj(doc, 'create_new_rfq', d.idx, function(r, rt) {
			refresh_field("raw_material_costing_details")
			refresh_field("quote_ref")
	});
}

cur_frm.cscript.current_rfq=function(doc,cdt,cdn){
	var d = locals[cdt][cdn];
	return $c_obj(doc, 'update_new_rfq', d.idx, function(r, rt) {
			refresh_field("raw_material_costing_details")
			refresh_field("quote_ref")
	});
}

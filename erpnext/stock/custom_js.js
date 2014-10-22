cur_frm.cscript.onload=function(doc,cdt,cdn){
	check_label(doc,cdt,cdn);

}

cur_frm.cscript.material_type=function(doc,cdt,cdn){
	check_label(doc,cdt,cdn);
}

check_label=function(doc,cdt,cdn){
	if (doc.material_type=='Raw Material'){
		label='Raw Spec'
		cur_frm.cscript.set_label(label);
	}
	else if (doc.material_type=='Processes'){
		label='Process'
		cur_frm.cscript.set_label(label);
	}
	else if(doc.material_type=='Sub-Machining'){
		label='Machining'
		cur_frm.cscript.set_label(label);
	}
	else{
		label='Item'
		cur_frm.cscript.set_label(label);	
	}
}

cur_frm.cscript.set_label=function(label){
	cur_frm.fields_dict.item_code.set_label(label+' '+'Code', cur_frm.doc);
	cur_frm.fields_dict.item_name.set_label(label+' '+'Name', cur_frm.doc);
    cur_frm.fields_dict.item_group.set_label(label+' '+'Type', cur_frm.doc);
}
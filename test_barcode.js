frappe.ui.form.on('Test Barcode', {
	barcode: function(frm) {
		let barcode_field = frm.fields_dict["barcode"];

		let show_description = function(idx, exist = null) {
			if (exist) {
				frappe.show_alert({
					message: __('Row #{0}: Qty increased by 1', [idx]),
					indicator: 'green'
				});
			} else {
				frappe.show_alert({
					message: __('Row #{0}: Item added', [idx]),
					indicator: 'green'
				});
			}
		}

		if(frm.doc.barcode) {
			frappe.call({
				method: "erpnext.selling.page.point_of_sale.point_of_sale.search_serial_or_batch_or_barcode_number",
				args: { search_value: frm.doc.barcode }
			}).then(r => {
				const data = r && r.message;
				if (!data || Object.keys(data).length === 0) {
					frappe.show_alert({
						message: __('Cannot find Item with this Barcode'),
						indicator: 'red'
					});
					return;
				}

				let cur_grid = frm.fields_dict.test.grid;

				let row_to_modify = null;
				if (frm.doc.test){
				const existing_item_row = frm.doc.test.find(d => d.item === data.item_code);
				const blank_item_row = frm.doc.test.find(d => !d.item);

				if (existing_item_row) {
					row_to_modify = existing_item_row;
				} else if (blank_item_row) {
					row_to_modify = blank_item_row;
				}
			}

				if (!row_to_modify) {
					// add new row
					row_to_modify = frappe.model.add_child(frm.doc, cur_grid.doctype, 'test');
				}

				show_description(row_to_modify.idx, row_to_modify.item);

				frm.from_barcode = frm.from_barcode ? frm.from_barcode + 1 : 1;
				frappe.model.set_value(row_to_modify.doctype, row_to_modify.name, {
					item: data.item_code,
					qty: (row_to_modify.qty || 0) + 1
				});

				barcode_field.set_value('');
				refresh_field("test");
			});
		}
		return false;
	},
});

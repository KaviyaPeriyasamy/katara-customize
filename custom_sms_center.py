import frappe
from erpnext.selling.doctype.sms_center.sms_center import SMSCenter

class ERPNextSMSCenter(SMSCenter):
	@frappe.whitelist()
	def create_receiver_list(self):
		if self.send_to == 'All Clients (Members)':
			rec = frappe.db.sql("""select client_name, mobile_no from `tabClient` where 
				ifnull(mobile_no,'')!='' and docstatus != 2 and membership_status='Member'""")
		
		elif self.send_to == 'All Clients (Non-Members)':
			rec = frappe.db.sql("""select client_name, mobile_no from `tabClient` where
				ifnull(mobile_no,'')!='' and docstatus != 2 and membership_status='Non-Member'""")

		elif self.send_to == 'All Clients':
			rec = frappe.db.sql("""select client_name, mobile_no from `tabClient` where 
				ifnull(mobile_no,'')!='' and docstatus != 2""")
		super(ERPNextSMSCenter, self).create_receiver_list()

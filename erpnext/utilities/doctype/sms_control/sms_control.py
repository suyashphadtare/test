# Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe, json

from frappe.utils import nowdate, cstr
from frappe import msgprint, throw, _


from frappe.model.document import Document

class SMSControl(Document):

	def validate_receiver_nos(self,receiver_list):
		validated_receiver_list = []
		for d in receiver_list:
			# remove invalid character
			invalid_char_list = [' ', '+', '-', '(', ')']
			for x in invalid_char_list:
				d = d.replace(x, '')

			validated_receiver_list.append(d)

		if not validated_receiver_list:
			throw(_("Please enter valid mobile nos"))

		return validated_receiver_list


	def get_sender_name(self):
		"returns name as SMS sender"
		sender_name = frappe.db.get_value('Global Defaults', None, 'sms_sender_name') or \
			'ERPNXT'
		if len(sender_name) > 6 and \
				frappe.db.get_default("country") == "India":
			throw("""As per TRAI rule, sender name must be exactly 6 characters.
				Kindly change sender name in Setup --> Global Defaults.
				Note: Hyphen, space, numeric digit, special characters are not allowed.""")
		return sender_name

	def get_contact_number(self, arg):
		"returns mobile number of the contact"
		args = json.loads(arg)
		number = frappe.db.sql("""select mobile_no, phone from tabContact where name=%s and %s=%s""" %
			('%s', args['key'], '%s'), (args['contact_name'], args['value']))
		return number and (number[0][0] or number[0][1]) or ''

	def send_form_sms(self, arg):
		"called from client side"
		args = json.loads(arg)
		self.send_sms([cstr(args['number'])], cstr(args['message']))

	def send_sms(self, receiver_list, msg, sender_name = ''):
		receiver_list = self.validate_receiver_nos(receiver_list)

		arg = {
			'receiver_list' : receiver_list,
			'message'		: msg,
			'sender_name'	: sender_name or self.get_sender_name()
		}

		if frappe.db.get_value('SMS Settings', None, 'sms_gateway_url'):
			ret = self.send_via_gateway(arg)
			msgprint(ret)

	def send_via_gateway(self, arg):
		ss = frappe.get_doc('SMS Settings', 'SMS Settings')
		args = {ss.message_parameter : arg.get('message')}
		for d in ss.get("static_parameter_details"):
			args[d.parameter] = d.value

		resp = []
		for d in arg.get('receiver_list'):
			args[ss.receiver_parameter] = d
			resp.append(self.send_request(ss.sms_gateway_url, args))

		return resp

	# Send Request
	# =========================================================
	def send_request(self, gateway_url, args):
		import httplib, urllib
		server, api_url = self.scrub_gateway_url(gateway_url)
		conn = httplib.HTTPConnection(server)  # open connection
		headers = {}
		headers['Accept'] = "text/plain, text/html, */*"
		conn.request('GET', api_url + urllib.urlencode(args), headers = headers)    # send request
		resp = conn.getresponse()     # get response
		resp = resp.read()
		return resp

	# Split gateway url to server and api url
	# =========================================================
	def scrub_gateway_url(self, url):
		url = url.replace('http://', '').strip().split('/')
		server = url.pop(0)
		api_url = '/' + '/'.join(url)
		if not api_url.endswith('?'):
			api_url += '?'
		return server, api_url


	# Create SMS Log
	# =========================================================
	def create_sms_log(self, arg, sent_sms):
		sl = frappe.get_doc('SMS Log')
		sl.sender_name = arg['sender_name']
		sl.sent_on = nowdate()
		sl.receiver_list = cstr(arg['receiver_list'])
		sl.message = arg['message']
		sl.no_of_requested_sms = len(arg['receiver_list'])
		sl.no_of_sent_sms = sent_sms
		sl.save()

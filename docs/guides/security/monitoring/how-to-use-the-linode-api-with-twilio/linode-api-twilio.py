import os
import sys
from linode_api4 import LinodeClient
from linode_api4 import SupportTicket
from twilio.rest import Client

try:
    twilio_account_sid = os.environ['TWILIO_ACCOUNT_SID']
    twilio_auth_token = os.environ['TWILIO_AUTH_TOKEN']
    twilio_from_phone_number = os.environ['TWILIO_FROM_PHONE_NUMBER']
    twilio_to_phone_number = os.environ['TWILIO_TO_PHONE_NUMBER']
    linode_api_token = os.environ['LINODE_API_TOKEN']
except KeyError:
    print("Please ensure that the following environment variables are set when running the script: ")
    print("TWILIO_ACCOUNT_SID")
    print("TWILIO_AUTH_TOKEN")
    print("TWILIO_FROM_PHONE_NUMBER")
    print("TWILIO_TO_PHONE_NUMBER")
    print("LINODE_API_TOKEN")
    sys.exit(1)

linode_client = LinodeClient(linode_api_token)
twilio_client = Client(twilio_account_sid, twilio_auth_token)

all_support_tickets = linode_client.support.tickets()
open_support_tickets = linode_client.support.tickets(SupportTicket.status == "open")

if len(open_support_tickets) > 0:
    most_recent_ticket = open_support_tickets[0]
    message_text = 'You have %s open Linode support tickets. ' \
        'Your newest support ticket is: \n\n' \
        '%s\n' \
        'https://cloud.linode.com/support/tickets/%s' % \
        (len(open_support_tickets), most_recent_ticket.summary, most_recent_ticket.id)

elif len(all_support_tickets) > 0:
    most_recent_ticket = all_support_tickets[0]
    message_text = 'You currently have no open Linode support tickets. ' \
        'Your most recent support ticket was:\n\n' \
        '%s\n' \
        'https://cloud.linode.com/support/tickets/%s' % \
        (most_recent_ticket.summary, most_recent_ticket.id)

else:
    message_text = 'You do not have any Linode support tickets.'

message = twilio_client.messages.create(
    body = message_text,
    from_ = twilio_from_phone_number,
    to = twilio_to_phone_number
)

print("Twilio message created with ID: %s" % (message.sid))
import os
import sys
from linode_api4 import LinodeClient
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

account_network_transfer = linode_client.account.transfer()
pool_used_ratio = account_network_transfer.used/account_network_transfer.quota

summary_text = "Linode network transfer pool statistics"

transfer_statistics_text = 'Used: %sGB\n' \
    'Transfer pool size: %sGB\n' \
    'Percent of pool used: %s%%\n\n' \
    'https://www.linode.com/docs/guides/network-transfer/' % \
    (account_network_transfer.used,
    account_network_transfer.quota,
    round(pool_used_ratio * 100, 4))

message_text = ('%s:\n\n%s' % (summary_text, transfer_statistics_text))

message = twilio_client.messages.create(
    body = message_text,
    from_ = twilio_from_phone_number,
    to = twilio_to_phone_number
)

print("Twilio message created with ID: %s" % (message.sid))
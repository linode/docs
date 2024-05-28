import os
import sys
import imaplib
import email
from twilio.rest import Client

try:
    twilio_account_sid = os.environ['TWILIO_ACCOUNT_SID']
    twilio_auth_token = os.environ['TWILIO_AUTH_TOKEN']
    twilio_from_phone_number = os.environ['TWILIO_FROM_PHONE_NUMBER']
    twilio_to_phone_number = os.environ['TWILIO_TO_PHONE_NUMBER']
    email_username = os.environ['EMAIL_USERNAME']
    email_password = os.environ['EMAIL_PASSWORD']
    email_server = os.environ['EMAIL_SERVER']
except KeyError:
    print("Please ensure that the following environment variables are set when running the script: ")
    print("TWILIO_ACCOUNT_SID")
    print("TWILIO_AUTH_TOKEN")
    print("TWILIO_FROM_PHONE_NUMBER")
    print("TWILIO_TO_PHONE_NUMBER")
    print("EMAIL_USERNAME")
    print("EMAIL_PASSWORD")
    print("EMAIL_SERVER")
    sys.exit(1)

twilio_client = Client(twilio_account_sid, twilio_auth_token)

mail = imaplib.IMAP4_SSL(email_server)
mail.login(email_username, email_password)

mail.select('INBOX')
status, email_search_data = mail.search(None, 'FROM', '"Linode Alerts"')

mail_ids = []
for mail_ids_string in email_search_data:
    mail_ids += mail_ids_string.decode("utf-8").split()

if len(mail_ids) == 0:
    print("No email matching search found.")
    sys.exit(0)

mail_ids.reverse()
status, email_data = mail.fetch(mail_ids[0], '(RFC822)')

response_part = email_data[0]
if isinstance(response_part, tuple):
    parsed_email = email.message_from_bytes(response_part[1])
    email_subject = parsed_email['subject']
    email_body = parsed_email.get_payload()

    message_text = 'New notification from Linode Alerts:\n\n' \
        'Message subject: \n%s\n\n' \
        'Message body: \n%s\n' % \
        (email_subject,
        email_body)
else:
    message_text = "Unable to parse email message with ID: %s" % mail_ids[0]

mail.close()
mail.logout()

message = twilio_client.messages.create(
    body = message_text,
    from_ = twilio_from_phone_number,
    to = twilio_to_phone_number
)

print("Twilio message created with ID: %s" % (message.sid))
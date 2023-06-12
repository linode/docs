import os
import sys
import imaplib
import email
import datetime
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
yesterday = datetime.date.today() - datetime.timedelta(1)
status, email_search_data = mail.search(None,
    'FROM', '"Linode Alerts"',
    'SINCE', yesterday.strftime("%d-%b-%Y"),
    'SUBJECT', '"CPU Usage"')

mail_ids = []
for mail_ids_string in email_search_data:
    mail_ids += mail_ids_string.decode("utf-8").split()

if len(mail_ids) == 0:
    print("No email matching search found.")
    sys.exit(0)

mail_ids.reverse()

def send_message(message_text):
    message = twilio_client.messages.create(
        body = message_text,
        from_ = twilio_from_phone_number,
        to = twilio_to_phone_number
    )

    print("Twilio message created with ID: %s" % (message.sid))

now_timestamp = datetime.datetime.now().timestamp()
EMAIL_AGE_LIMIT_IN_SECONDS = 60

for mail_id in mail_ids:
    status, email_data = mail.fetch(mail_id, '(RFC822)')

    response_part = email_data[0]
    if isinstance(response_part, tuple):
        parsed_email = email.message_from_bytes(response_part[1])
        email_subject = parsed_email['subject']
        email_body = parsed_email.get_payload()

        email_datestring = parsed_email['date']
        email_datetime = email.utils.parsedate_to_datetime(email_datestring)
        email_timestamp = email_datetime.timestamp()

        if now_timestamp - email_timestamp < EMAIL_AGE_LIMIT_IN_SECONDS:
            message_text = 'New notification from Linode Alerts:\n\n' \
                'Message subject: \n%s\n\n' \
                'Message body: \n%s\n' % \
                (email_subject,
                email_body)

            send_message(message_text)

mail.close()
mail.logout()


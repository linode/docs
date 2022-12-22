import os
import sys
import poplib
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

mail = poplib.POP3_SSL(email_server)
mail.user(email_username)
mail.pass_(email_password)

pop_list_response, pop_list_data, pop_list_size = mail.list()
num_messages = len(pop_list_data)
if num_messages == 0:
    print("No email retrieved by poplib.")
    sys.exit(0)

def send_message(message_text):
    message = twilio_client.messages.create(
        body = message_text,
        from_ = twilio_from_phone_number,
        to = twilio_to_phone_number
    )

    print("Twilio message created with ID: %s" % (message.sid))

end_of_email_interval_datetime = datetime.datetime.now().replace(second=0, microsecond=0)
end_of_email_interval_timestamp = end_of_email_interval_datetime.timestamp()
EMAIL_INTERVAL_LENGTH_IN_SECONDS = 60

for i in range(num_messages):
    mail_id = num_messages - i
    pop_retr_response, pop_retr_data, pop_retr_size = mail.retr(mail_id)

    email_as_string = b'\n'.join(pop_retr_data)
    parsed_email = email.message_from_bytes(email_as_string)

    received_header = parsed_email['received']
    try:
        received_header_parts = received_header.split('\n')
        email_received_datestring = received_header_parts[-1].strip(' \t')
        email_received_datetuple = email.utils.parsedate_tz(email_received_datestring)
        email_received_timestamp = email.utils.mktime_tz(email_received_datetuple)
    except:
        print("Could not parse date from received header for email:")
        print("From: %s" % parsed_email['from'])
        print("Subject: %s" % parsed_email['subject'])
        print("Date: %s" % parsed_email['date'])
        print("Received header: %s\n" % received_header)
        continue

    email_age = end_of_email_interval_timestamp - email_received_timestamp
    if email_age >= EMAIL_INTERVAL_LENGTH_IN_SECONDS:
        break
    if email_age < 0:
        continue

    email_from = parsed_email['from']
    if email_from == 'Linode Alerts <noreply@linode.com>':
        email_subject = parsed_email['subject']
        email_body = parsed_email.get_payload()
        message_text = 'New notification from Linode Alerts:\n\n' \
            'Message subject: \n%s\n\n' \
            'Message body: \n%s\n' % \
            (email_subject,
            email_body)
        send_message(message_text)

mail.close()
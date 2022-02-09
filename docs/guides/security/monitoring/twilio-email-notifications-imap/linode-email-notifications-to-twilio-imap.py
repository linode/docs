import os
import sys
import imaplib
import email
import datetime
import math
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

## Log into the server.
mail = imaplib.IMAP4_SSL(email_server)
mail.login(email_username, email_password)

## Select the inbox.
mail.select('"[Gmail]/All Mail"')

TIME_LIMIT_IN_MINUTES = 1440 # default to showing emails that are within the last day
if len(sys.argv) == 2:
    try:
        TIME_LIMIT_IN_MINUTES = int(sys.argv[1])
    except ValueError:
        pass

print("TIME_LIMIT_IN_MINUTES: " + str(TIME_LIMIT_IN_MINUTES))

print("before search")
## Look for Linode messages
number_of_days_to_search_mail = math.ceil(TIME_LIMIT_IN_MINUTES/(60*24))
print("number of days to search mail: " + str(number_of_days_to_search_mail))

status, email_search_data = mail.search(None, 'FROM', '"Linode Alerts"', 'SINCE', (datetime.date.today() - datetime.timedelta(number_of_days_to_search_mail)).strftime("%d-%b-%Y"))

## The search result data will come as a single large entity,
## which must then be split into separate blocks of one message each.
mail_ids = []
print("email search data: ")
print(email_search_data)
for block in email_search_data:
    mail_ids += block.split()

def send_message(message_text):
    message = twilio_client.messages.create(
        body = message_text,
        from_ = twilio_from_phone_number,
        to = twilio_to_phone_number
    )

    print(message.sid)

now_timestamp = datetime.datetime.now().timestamp()

print("Number of emails found: " + str(len(mail_ids)))
mail_ids.reverse()

for mail_id in mail_ids:
    # Fetch each of the mesasages in turn.
    status, email_data = mail.fetch(mail_id, '(RFC822)')

    response_part = email_data[0]
    # Each message data element should contain a tuple with the
    # heading, content, and closing.
    if isinstance(response_part, tuple):
        # Since the heading and closing aren't needed, the code
        # processes just the message content.
        message = email.message_from_bytes(response_part[1])

        # Using the content, it's possible to obtain the subject
        # of the message (we already know who its from because
        # of the search conducted earlier).

        email_subj = message['subject']
        subj_parts = email_subj.split(" - ")
        content = message.get_payload()
        message_text = ('Message Type: %s\nSpecifics: %s\n%s' %
        (subj_parts[0], subj_parts[1], content))


        if (now_timestamp - email.utils.parsedate_to_datetime(message['date']).timestamp()) / 60 < TIME_LIMIT_IN_MINUTES:
            send_message(message_text)

        ## If this is an actual alert, then send a text.
        # if subj_parts[0] == "Linode Alert":
        #     send_message(message)

mail.close()
mail.logout()


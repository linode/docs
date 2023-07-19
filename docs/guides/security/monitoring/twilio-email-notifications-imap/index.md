---
slug: twilio-email-notifications-imap
description: "Linode sends system notifications via email. This guide shows how to use the Python imaplib module to intercept those emails and forward them to text messages with the Twilio API."
keywords: ['twilio notify']
tags: ['email']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-28
modified_by:
  name: Linode
title: "Create an Email Notification System Using Twilio (IMAP)"
relations:
  platform:
    key: twilio-email-notifications
    keywords:
      - email protocol: IMAP
external_resources:
- '[imaplib — IMAP4 Client Library — PyMOTW 3](https://pymotw.com/3/imaplib/index.html)'
- '[imaplib — IMAP4 protocol client — Python 3.10.2 documentation](https://docs.python.org/3/library/imaplib.html)'
- '[email — An email and MIME handling package — Python 3.10.2 documentation](https://docs.python.org/3/library/email.html)'
aliases: ['/guides/create-an-imap-email-notification-system-using-twilio/']
authors: ["John Mueller"]
---

By default, Linode sends system notifications via email. For example, email notifications are delivered when Linode Compute Instances are rebooted, when they receive hardware maintenance, and when they exceed a CPU usage threshold. You may also want to receive these notifications via text message. This guide shows how to set up a custom script that auto-forwards email notifications to text message.

The auto-forwarding system leverages the API of Twilio, a cloud communications service, along with the IMAP protocol for email. The instructions in this guide focus on how to parse Linode email notifications, but they could be adapted to email from other services as well.

## In this Guide

- In the [Forward an Email to Text Message](#forward-an-email-to-text-message) section, a script is created that focuses on the fundamentals of parsing email in Python and how to interact with the Twilio API. This includes:

    - Searching email with the imaplib Python module

    - Fetching an email's contents with imaplib

    - Parsing the contents with the Python email module

    - Using the `messages.create()` endpoint of the Twilio API client.

- In the [Auto-Forward Email to Text Message](#auto-forward-email-to-text-message) section, the script is updated to run periodically and check for all Linode system notification emails since the last time the script ran.

- In the [Search Email by Subject with Imaplib](#search-email-by-subject-with-imaplib) section, the script is updated to only forward emails that match a keyword in the emails' subject. This allows you to limit forwarding to specific kinds of notifications.

## Before You Begin

1. This guide shows how to set up the email-to-text forwarding system on a Linode instance. A Linode instance is used because it can remain powered on at all times.

    If you want to implement the notification system, [create a Linode in the Cloud Manager](/docs/products/compute/compute-instances/get-started/). The lowest cost Shared CPU instance type is appropriate for this guide. If you already have a Linode instance that you want to set up the notification system on, you can use that instead of a new instance. This guide was tested with Ubuntu 20.04, but should also work with other Linux distributions and versions.

    After you create your Linode, follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to reduce the threat of a system compromise. Specifically, make sure you [Add a Limited User Account](/docs/products/compute/compute-instances/guides/set-up-and-secure/#add-a-limited-user-account) to the Linode. The notification system in this guide should be installed under a limited Linux user.

1.  Another guide in our library, [How to Use the Linode API with Twilio](/docs/guides/how-to-use-the-linode-api-with-twilio/), shows the prerequisite steps for using the Twilio API. Follow this guide, starting with its [Before You Begin](/docs/guides/how-to-use-the-linode-api-with-twilio/#before-you-begin) section, up to and including the [Install the Twilio Python Helper Library](/docs/guides/how-to-use-the-linode-api-with-twilio/#install-the-twilio-python-helper-library) section.

    The guide instructs you to install the Twilio API client for Python. When following these instructions, run the commands under the limited Linux user on your Linode instance.

1. This guide instructs you to create a Python script from within an SSH session on your Linode. You need to install and use a terminal text editor to write the script on your Linode. Common text editors include [nano](/docs/guides/use-nano-to-edit-files-in-linux/) (the easiest option for terminal beginners), [emacs](https://www.gnu.org/software/emacs/), and [vim](https://www.vim.org/).

1. Your email service needs to support IMAP, and support for IMAP may need to be manually enabled. For example, [Gmail has an option to turn on IMAP access in its settings](https://support.google.com/mail/answer/7126229?hl=en#zippy=%2Cstep-check-that-imap-is-turned-on).

## Forward an Email to Text Message

This section provides a code example that connects to and searches an email server with IMAP. The script then shows how to fetch and parse the most recent Linode system notification email. The Linode system notification emails are from a sender named `Linode Alert`, so the script searches for this string in the `FROM` field. The parsed information from the email is delivered in a text message via the Twilio API.

The script in this section is updated in the next section to incorporate auto-forwarding behavior.

### Import Modules and Initialize Service Credentials

1.  Log into your Linode under your limited Linux user [using SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Create a new file named `forward-last-email-to-text-message.py` with your preferred terminal text editor. For example, when using `nano`, run:

        nano forward-last-email-to-text-message.py

1.  Copy this snippet into the file:

    {{< file "forward-last-email-to-text-message.py">}}
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
{{< /file >}}

    {{< disclosure-note "About the code" >}}
This code imports several modules that are used later in the code:

- The `os` module, which can be used to read environment variables from your terminal. The module is used in the `try` block to load your API tokens, Twilio phone numbers, and email IMAP email server credentials. A later section in this guide shows how to set those environment variables before running the script.

    Alternatively, you could directly list the token and phone number values in the script. However, it's a good practice to avoid doing this. For example, if you listed your secrets inside the code and then uploaded your code to a public code repository like GitHub, they would be publicly visible.

    The `except KeyError` statement is executed if any of the environment variables are not set. A message is printed in the console that tells you which variables are expected by the script. The `sys` module an the `sys.exit()` method immediately exits the script in this case.

- [The `imaplib` module](https://docs.python.org/3/library/imaplib.html#module-imaplib) is used to connect to an IMAP server, and [the `email` module](https://docs.python.org/3/library/email.html#module-email) is used to parse email messages. These are used in a later section in this guide.

- [The `twilio` module](https://www.twilio.com/docs/libraries/python) is used to interact with the Twilio API. This is used in a later section in this guide.
{{< /disclosure-note >}}

### Create the Twilio API Python Client

Copy and paste the code from this snippet to the bottom of your script:

{{< file "forward-last-email-to-text-message.py">}}
# copy and paste to bottom of file:

twilio_client = Client(twilio_account_sid, twilio_auth_token)
{{< /file >}}

This line creates a new client object that can interact with the Twilio API.

### Log into the IMAP Server with Imaplib

Copy and paste the code from this snippet to the bottom of your script:

{{< file "forward-last-email-to-text-message.py">}}
# copy and paste to bottom of file:

mail = imaplib.IMAP4_SSL(email_server)
mail.login(email_username, email_password)
{{< /file >}}

{{< disclosure-note "About the code" >}}
- The first line [configures a secure connection](https://docs.python.org/3/library/imaplib.html#imaplib.IMAP4_SSL) to your email server.

- The second line [logs into the server](https://docs.python.org/3/library/imaplib.html#imaplib.IMAP4.login).
{{< /disclosure-note >}}

### Search Email by Sender with Imaplib

Copy and paste the code from this snippet to the bottom of your script:

{{< file "forward-last-email-to-text-message.py">}}
# copy and paste to bottom of file:

mail.select('INBOX')
status, email_search_data = mail.search(None, 'FROM', '"Linode Alerts"')

mail_ids = []
for mail_ids_string in email_search_data:
    mail_ids += mail_ids_string.decode("utf-8").split()
{{< /file >}}

You may want to retrieve mail from a mailbox with a specific name, instead of `INBOX`. For example, if you use Gmail and want to search all of your mail, remove the existing `mail.select()` function call and insert this new one:

    mail.select('"[Gmail]/All Mail"')

{{< disclosure-note "About the code" >}}
- The first line [selects a mailbox](https://docs.python.org/3/library/imaplib.html#imaplib.IMAP4.select) that mail should be retrieved from in the subsequent `search()` command.

- The second line [searches the mailbox](https://docs.python.org/3/library/imaplib.html#imaplib.IMAP4.search) and returns a list of email ID numbers. The contents of each email is not returned, and the next section shows how to fetch the email contents.

    The first argument to the function allows you to specify [a character set for the strings that appear in the search criterion](https://datatracker.ietf.org/doc/html/rfc3501#section-6.4.4), which is US-ASCII by default. This argument is optional in the IMAP standard, and by passing `None` the example code is choosing not to specify a CHARSET.

    The remaining arguments to the function constitute the search criterion. Multiple search criterion can be passed, but this example code only specifies the sender of the email.

    The sender string is wrapped in double-quotes and single-quotes, which means that the double-quotes are preserved in the search. Without wrapping the double-quotes, the search would be executed as `FROM:Linode Alerts` instead of `FROM:"Linode Alerts"`. The former would match any emails from any Linode email address that feature the word `Alerts` in the email. The correct search matches email from the `Linode Alerts` sender.

- Lines 6-8 parse the returned list of email ID numbers in the `email_search_data` variable. The value of this variable is a space-separated list of email IDs, wrapped in an array. For example, it might look like this: `['3 9 23 51']`.

    Five mail IDs are listed in this example, which means that the searched mailbox contains five emails from the `Linode Alert` sender. Lines 6-8 split the string in this variable and create a new array of mail IDs. The previous example would result in a new `mail_ids` array equal to: `['3','9','23','51']`.
{{< /disclosure-note >}}

### Fetch Email with Imaplib

Copy and paste the code from this snippet to the bottom of your script:

{{< file "forward-last-email-to-text-message.py">}}
# copy and paste to bottom of file:

if len(mail_ids) == 0:
    print("No email matching search found.")
    sys.exit(0)

mail_ids.reverse()
status, email_data = mail.fetch(mail_ids[0], '(RFC822)')
{{< /file >}}

{{< disclosure-note "About the code" >}}
- Lines 3-5 exit the script if no emails matching the search were found.

- Line 7: The mail IDs array is originally ordered oldest to newest. This line reverses the array so that the first item corresponds to the newest matching email.

- Line 8 [fetches the contents](https://docs.python.org/3/library/imaplib.html#imaplib.IMAP4.fetch) of the first (newest) matching email. The first argument for this function is a mail ID. You can also pass a comma-separated string of mail IDs (e.g. `'3,9,23'`), and the contents of each specified email is returned in an array.

    The second argument for the `mail.fetch()` function allows you to specify which parts of the email should be retrieved. By specifying `(RFC822)`, the entire [RFC-822](https://datatracker.ietf.org/doc/html/rfc822) formatted email is returned, which includes the email headers and body.

    You can specify other values in the second argument to retrieve just parts of the email. For example, you could retrieve only the headers of the email. This is described in [PyMOTW's imaplib article](https://pymotw.com/3/imaplib/index.html#fetching-messages).
{{< /disclosure-note >}}

### Parse Email with the Python Email Module

Copy and paste the code from this snippet to the bottom of your script:

{{< file "forward-last-email-to-text-message.py">}}
# copy and paste to bottom of file:

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

mail.close()
mail.logout()
{{< /file >}}

{{< disclosure-note "About the code" >}}
This section of code parses the `email_data` variable returned by the `mail.fetch()` function. The value of this variable is an array that contains the contents of the fetched emails. This is an example of what the array might look like:

{{< output >}}
[(b'23 (RFC822 {4191}', b'Delivered-To: youremail@emaildomain.com\r\nReceive
d:\r\nX-Google-Smtp-Source:\r\nX-Received:\r\nARC-Seal:\r\nARC-Message-Signature
:\r\nARC-Authentication-Results:\r\nReturn-Path: <noreply@linode.com>\r\nReceive
d:\r\nReceived-SPF:\r\nAuthentication-Results:\r\nDate: Tue, 7 Dec 2021 12:45:10
 -0500 (EST)\r\nDKIM-Signature:\r\nFrom: Linode Alerts <noreply@linode.com>\r\nT
o: youremail@emaildomain.com\r\nMessage-ID:\r\nSubject: Linode Events Notificati
on - yourlinodeusername\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charse
t=UTF-8\r\nContent-Transfer-Encoding: 7bit\r\nX-Mailer:\r\n\r\nHello yourlinodeu
sername! The following activity has recently occurred:\r\n\r\n * example-linode-
instance - (100000001) System Shutdown - Completed Tue, 7 Dec 2021 17:35:20 GMT\
r\n * example-linode-instance - (100000002) System Boot - My Ubuntu 20.04 LTS Pr
ofile - Completed Tue, 7 Dec 2021 17:35:32 GMT\r\n\r\nYou can change your notifi
cation settings via https://cloud.linode.com/profile.\r\n\r\n---\r\n\r\nReduce D
eployment Times with Custom Images - https://www.linode.com/products/images/\r\n
Durable File Storage with S3-Compatible Object Storage - https://www.linode.com/
products/object-storage/ \r\n'), b')']
{{< /output >}}

Note that this string has been line-wrapped so that it fits into 80 character columns. This has been done so that it is more legible in this guide, but it would normally appear on one line. As well, some of the header elements have been redacted.

There are two elements in the example array:

- The first element of the array is a tuple. The first element of the tuple contains the mail ID (23 in this example), the message parts returned (or RFC822 if retrieving the whole email), and the number of bytes of data in the response (4191 in this example).

    The second element of the tuple are the headers and body of the email.

- The second element of the array is a string that contains the closing parentheses (`')')`), which is a closing sequence for the server's response.

The email headers and body contain the `\r\n` character sequence that represents a new line. Here's what the array and tuple look like with these characters replaced with new lines, which may be more legible:

{{< output >}}
[(b'115375 (RFC822 {4191}', b'Delivered-To: youremail@emaildomain.com
Received:
X-Google-Smtp-Source:
X-Received:
ARC-Seal:
ARC-Message-Signature:
ARC-Authentication-Results:
Return-Path: <noreply@linode.com>
Received:
Received-SPF:
Authentication-Results:
Date: Tue, 7 Dec 2021 12:45:10 -0500 (EST)
DKIM-Signature:
From: Linode Alerts <noreply@linode.com>
To: youremail@emaildomain.com
Message-ID:
Subject: Linode Events Notification - yourlinodeusername
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit
X-Mailer:

Hello yourlinodeusername! The following activity has recently occurred:

 * example-linode-instance - (100000001) System Shutdown - Completed Tue, 7 Dec 2021 17:35:20 GMT
 * example-linode-instance - (100000002) System Boot - My Ubuntu 20.04 LTS Profile - Completed Tue, 7 Dec 2021 17:35:32 GMT

You can change your notification settings via https://cloud.linode.com/profile.

---

Reduce Deployment Times with Custom Images - https://www.linode.com/products/images/
Durable File Storage with S3-Compatible Object Storage - https://www.linode.com/products/object-storage/
'), b')']
{{< /output >}}

The code parses this array as follows:

- Lines 3-4 get the first element of the array and make sure that its value is a tuple.

- Line 5: to parse the information in the email headers and body, the [`email` module](https://docs.python.org/3/library/email.html) is used. The [`message_from_bytes` function in this module](https://docs.python.org/3/library/email.parser.html#email.message_from_bytes) parses the RFC-822 formatted email and returns an [email.message.Message object](https://docs.python.org/3/library/email.compat32-message.html#email.message.Message).

- Line 6: The Message object has a dictionary interface that can be used to query for different headers in the email. This interface is used to get the subject of the email.

- Line 7: The Message object has a [`get_payload` method](https://docs.python.org/3/library/email.compat32-message.html#email.message.Message.get_payload) that returns the content of the email. For emails that are *not* [multipart](https://en.wikipedia.org/wiki/MIME#Multipart_messages), this returns a string. Linode Alert emails are not multipart and consist of plain text. For multipart emails, this method returns a list of child Message objects. This is more complicated to parse, and is outside the scope of this guide.

- Line 9 composes the message body that is sent via text message in the next section. The `\n` character sequence appears in this string. These characters [insert newlines in the message](https://support.twilio.com/hc/en-us/articles/223181468-How-do-I-Add-a-Line-Break-in-my-SMS-or-MMS-Message-).

- Lines 15-16 close the IMAP connection.
{{< /disclosure-note >}}

### Create and Send a Text Message with Twilio

1. Copy and paste the code from this snippet to the bottom of your script:

    {{< file "forward-last-email-to-text-message.py">}}
# copy and paste to bottom of file:

message = twilio_client.messages.create(
    body = message_text,
    from_ = twilio_from_phone_number,
    to = twilio_to_phone_number
)

print("Twilio message created with ID: %s" % (message.sid))
{{< /file >}}

    {{< disclosure-note "About the code" >}}
The `create` method tells the Twilio API to create *and* immediately send a new text message:

- The text string composed in the last section is used as the body of the message.

- The `from_` phone number corresponds to the new number that you selected in the Twilio console earlier in the guide.

- The `to` number corresponds with your personal or testing phone number that you signed up to Twilio with.

The `create` method returns a reference to the Twilio [message resource](https://www.twilio.com/docs/sms/api/message-resource) that was created. The last line prints the unique ID of the message.
{{< /disclosure-note >}}

1. After appending the above snippet, save the file and exit your text editor.

    {{< note respectIndent=false >}}
The code example is now complete. Your script should now look like the code in [this file](forward-last-email-to-text-message.py).
{{< /note >}}

### Run the Code

1.  Before you run the script, set the [environment variables](/docs/guides/how-to-set-linux-environment-variables/) that the script expects in your terminal. In your SSH session with your Linode, run the following commands. After the `=` symbol in each command, insert the corresponding value:

        export TWILIO_ACCOUNT_SID=
        export TWILIO_AUTH_TOKEN=
        export TWILIO_FROM_PHONE_NUMBER=
        export TWILIO_TO_PHONE_NUMBER=
        export EMAIL_USERNAME=
        export EMAIL_PASSWORD=
        export EMAIL_SERVER=

    For example, the filled-in commands could look like:

    {{< output >}}
export TWILIO_ACCOUNT_SID=96af3vrYKQG6hrcYCC743mR27XhBzXb8wQ
export TWILIO_AUTH_TOKEN=LD9NWYXZzp3d3k7Mq7ME6L8QJJ8zu73r
export TWILIO_FROM_PHONE_NUMBER=+122233344444
export TWILIO_TO_PHONE_NUMBER=+15556667777
export EMAIL_USERNAME=youremail@yourdomain.com
export EMAIL_PASSWORD=bKfoAoV8Awo8e9CVTFTYKEdo
export EMAIL_SERVER=imap.yourdomain.com
{{< /output >}}

    The values for each variable are as follows:

    | Variable | Value |
    |----------|-------|
    | TWILIO_ACCOUNT_SID | The Twilio account SID [located in your Twilio console](/docs/guides/how-to-use-the-linode-api-with-twilio/#locate-your-twilio-api-credentials) |
    | TWILIO_AUTH_TOKEN | The Twilio auth token [located in your Twilio console](/docs/guides/how-to-use-the-linode-api-with-twilio/#locate-your-twilio-api-credentials). The phone number needs to be entered using [E.164](https://www.twilio.com/docs/glossary/what-e164) formatting. |
    | TWILIO_FROM_PHONE_NUMBER | The new number that you selected in the Twilio console [when you first signed up](/docs/guides/how-to-use-the-linode-api-with-twilio/#sign-up-for-twilio) |
    | TWILIO_TO_PHONE_NUMBER | Your personal or testing phone number that you signed up to Twilio with. The phone number needs to be entered using [E.164](https://www.twilio.com/docs/glossary/what-e164) formatting. |
    | EMAIL_USERNAME | Your email address. |
    | EMAIL_PASSWORD | Your password for your email. Note that some services may require you to create an app-specific password for the IMAP connection. For example, [Google requires you to create an app-specific password](https://support.google.com/accounts/answer/185833) if you use 2-step verification/2FA on your account. |
    | EMAIL_SERVER | The server you should connect to. Check with your email service for the correct value. For Gmail, `imap.gmail.com` is used. |

1.  Run the script:

        python3 forward-last-email-to-text-message.py

    If successful, the script generates output like the following:

    {{< output >}}
Twilio message created with ID: 9FKgk3Vokgx4hVC4937nx2kAraiG7qXDx8
{{< /output >}}

    A few moments later, you should receive a text message similar to:

    {{< output >}}
Sent from your Twilio trial account - New notification from Linode Alerts:

Message subject:
Linode Events Notification - yourlinodeusername

Message body:
Hello yourlinodeusername! The following activity has recently occurred:

 * example-linode-instance - (100000001) System Shutdown - Completed Tue, 7 Dec 2021 17:35:20 GMT
 * example-linode-instance - (100000002) System Boot - My Ubuntu 20.04 LTS Profile - Completed Tue, 7 Dec 2021 17:35:32 GMT

You can change your notification settings via https://cloud.linode.com/profile.

---

Reduce Deployment Times with Custom Images - https://www.linode.com/products/images/
Durable File Storage with S3-Compatible Object Storage - https://www.linode.com/products/object-storage/
{{< /output >}}

    If you receive an error message when you run the script, review the [Troubleshooting](#troubleshooting) section.

1.  If you have not previously received an email from Linode Alerts, you can generate a new one by performing certain actions in the Cloud Manager. For example, if you reboot your Linode, a new Linode Event Notification email is sent after a few minutes. After receiving this email, re-run the script to verify that it works.

## Auto-Forward Email to Text Message

The code example from the last section sends the most recent Linode Alert email as a text message when you run the script. This section shows how to automatically deliver a text message whenever a new email is received, without having to manually run the script.

This auto-forwarding system has two parts:

- The example code is [updated to search recent email by date](#iterate-through-recent-emails). The script iterates through the matching emails and creates a text message for each of them, instead of just forwarding the single most recent email. Specifically, it fetches the content for any Linode Alert email from the past 60 seconds and forwards it to Twilio.

- A [cron](/docs/guides/schedule-tasks-with-cron/) job is created to run the script every minute. This means that every time the script is run, it checks for emails that have been received since the last time the script was run.

### Search Email by Date with Imaplib

1.  In your SSH session with your Linode, create a new file named `autoforward-email-to-text-message.py` with your preferred terminal text editor. For example, when using `nano`, run:

        nano autoforward-email-to-text-message.py

1.  Copy this snippet into the file. Then, save the file and exit your text editor.

    {{< file "autoforward-email-to-text-message.py">}}
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
    'SINCE', yesterday.strftime("%d-%b-%Y"))

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
{{< /file >}}

As in the previous section, you may want to retrieve mail from a mailbox with a specific name, instead of `INBOX`. For example, if you use Gmail and want to search all of your mail, remove the existing `mail.select()` function call and insert this new one:

    mail.select('"[Gmail]/All Mail"')

{{< disclosure-note "About the code" >}}
The example code is similar to the code from the previous section. The updated lines of code are:

- On line 5, the [`datetime` module](https://docs.python.org/3/library/datetime.html) is imported. This is used later in the code to search for email by date.

- Lines 33-36 show how to use the `SINCE` IMAP search command to search email by date. The IMAP protocol can search by date, but not by time. The expectation for the script is that it should only forward emails from the last 60 seconds. To resolve this problem, the script searches for the past day of email, and another line of code later in the script filters these emails by time.

    Note that all emails from yesterday and today are searched for, instead of just searching from email from today. This handles an edge-case for the script when it is invoked at midnight. When invoked at midnight, the script should check for email since 11:59PM on the previous day. If only today's emails were searched for, it would not find those emails.

- Lines 48-55 create a `send_message` function that handles the creation of text messages with the Twilio API. This function accepts the message body text that should be sent.

- Line 57 captures the current time that the script is run as a [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time).

- Line 58 defines the maximum age (in seconds) of an email that should be forwarded to text message (60 seconds).

- Line 60 sets up a loop that iterates through all email IDs that matched the IMAP search.

- Line 61 fetches the email in each iteration of the loop.

- Line 69 uses the dictionary interface of the email.message.Message object to retrieve a string that represents the date and time of the email. For the example email in the previous section, this was equal to `Tue, 7 Dec 2021 12:45:10 -0500 (EST)`.

- Line 70 uses the [parsedate_to_datetime](https://docs.python.org/3/library/email.utils.html#email.utils.parsedate_to_datetime) function of the Python email module to convert the datetime string to a [datetime.datetime object](https://docs.python.org/3/library/datetime.html#datetime.datetime).

- Line 71 gets the Unix timestamp from the datetime object.

- The `if` condition on line 73 compares the age of the email and the current time for the script. This only evaluates to true for emails that are less than a minute old. If true, the text message is prepared and sent via the `send_message` function.
{{< /disclosure-note >}}

### Set Up a Cron Job

[Cron](/docs/guides/schedule-tasks-with-cron/) is a Linux tool that runs processes at different time intervals that you specify. Follow these instructions to set up a cron job for the new script:

1.  In your SSH session, start the *crontab* editor:

        crontab -e

1.  A text file appears in your text editor. This file has some commented-out lines (which begin with `# `) that tell you to set up a new scheduled task in the file. Below these comments, copy and paste the following lines:

    {{< file >}}
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_PHONE_NUMBER=
TWILIO_TO_PHONE_NUMBER=
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_SERVER=

* * * * * python3 /home/exampleuser/autoforward-email-to-text-message.py
{{< /file >}}

    The first seven lines define your environment variables. The last line represents the scheduled task. The `* * * * *` at the start of the line represents when the task should run. Specifically, this string says that the task should run [every minute](https://crontab.guru/#*_*_*_*_*).

1. After the `=` symbol in each of the first five lines, insert the corresponding value. The values are the same as they were in the previous [Run the Code](#run-the-code) section.

    For example, the filled-in crontab file could look like:

    {{< output >}}
TWILIO_ACCOUNT_SID=96af3vrYKQG6hrcYCC743mR27XhBzXb8wQ
TWILIO_AUTH_TOKEN=LD9NWYXZzp3d3k7Mq7ME6L8QJJ8zu73r
TWILIO_FROM_PHONE_NUMBER=+122233344444
TWILIO_TO_PHONE_NUMBER=+15556667777
EMAIL_USERNAME=youremail@yourdomain.com
EMAIL_PASSWORD=bKfoAoV8Awo8e9CVTFTYKEdo
EMAIL_SERVER=imap.yourdomain.com

0 14 * * * python3 /home/exampleuser/autoforward-email-to-text-message.py
{{< /output >}}

1.  On the last line, update the file path to the Python script (e.g. `/home/exampleuser/autoforward-email-to-text-message.py`) so that it matches the path of the file on your server.

1.  Save the crontab file in your text editor and exit the editor. The script now runs at the start of every minute on your server, and the auto-forwarding system is complete.

1.  To test that the auto-forwarding system works, trigger a new Linode Alert email in the Cloud Manager. For example, if you reboot your Linode, a new Linode Event Notification email is sent after a few minutes. After the email arrives in your mailbox, the script is run within the next 60 seconds, and the text message is delivered.

    If you do not receive a text message after triggering a Linode Alert email, try visiting the [Troubleshooting](#troubleshooting) section of this guide for help.

## Search Email by Subject with Imaplib

Emails sent from Linode Alerts can feature several different kinds of notifications, including:

- Linode compute instance reboots, new compute instance configurations, and block storage attachments/detachments

- CPU usage alerts

- Disk IO rate alerts

- Outbound and inbound traffic rate alerts

You may only want to receive text messages for certain kinds of notifications. Each kind of Linode notification features specific keywords in the subject of the email. You can search for these keywords to filter your text message notifications.

Follow these steps to only forward CPU usage alerts to text:

1. In your `autoforward-email-to-text-message.py`, remove lines 34-36:

    {{< file "autoforward-email-to-text-message.py" >}}
# remove the following lines:

# status, email_search_data = mail.search(None,
#     'FROM', '"Linode Alerts"',
#     'SINCE', yesterday.strftime("%d-%b-%Y"))
{{< /file >}}

1. Insert these new lines of code in the same position as the removed lines:

    {{< file "autoforward-email-to-text-message.py">}}
# insert where previous lines were removed:

status, email_search_data = mail.search(None,
    'FROM', '"Linode Alerts"',
    'SINCE', yesterday.strftime("%d-%b-%Y"),
    'SUBJECT', '"CPU Usage"')
{{< /file >}}

This new code adds the `SUBJECT` IMAP search command to the search criterion. Note that the subject string that is searched for should be wrapped in double and single quotes.

1.  After inserting the above snippet, save the file.

    {{< note respectIndent=false >}}
Your script should now look like the code in [this file](autoforward-email-with-matching-subject-to-text-message.py).
{{< /note >}}

1.  The updated script is automatically run by the cron job. CPU usage alerts are sent when a Linode on your account exceeds a threshold percentage. The Linodes on your account may or may not currently this threshold, so you may not receive any notifications.

    You can test that the update code works by temporarily [lowering the CPU usage alert threshold](/docs/products/compute/compute-instances/guides/resource-usage-email-alerts/) for one of your Linodes. By default, this value is set to 90%.

## Next Steps

The auto-forwarding system is now complete, and it includes email filtering by subject keyword. You can make adjustments to the search criterion to change this filtering behavior. For example, you could search for the string `traffic rate` to only forward notifications about spikes in your Linodes' networking. You can also tweak the [alert threshold values](/docs/products/compute/compute-instances/guides/resource-usage-email-alerts/) for different resources in the Cloud Manager.

In addition to forwarding emails to text, you may want to forward information from the Linode API to text. The [Using the Linode API with Twilio](/docs/guides/how-to-use-the-linode-api-with-twilio/) and [Monitor your Linode's Network Transfer Pool with Twilio](/docs/guides/monitor-linode-network-transfer-pool-with-twilio/) guides show how to combine the Linode and Twilio APIs.

Twilio's API offers many other features as well. For example, you can forward notifications to more than one phone number using the [Messaging Service resource](https://www.twilio.com/docs/messaging/services/api#messaging-services-resource). Twilio's [quick start guides](https://www.twilio.com/docs/quickstart) are helpful when exploring the Twilio API.

## Troubleshooting

Several troubleshooting scenarios are outlined in the [Troubleshooting](/docs/guides/how-to-use-the-linode-api-with-twilio/#troubleshooting) section of the [How to Use the Linode API with Twilio](/docs/guides/how-to-use-the-linode-api-with-twilio/) guide. Review that section for possible solutions.

When troubleshooting email forwarding, remember that you can trigger new Linode system notifications by:

- Rebooting a Linode in the Cloud Manager.

- Temporarily lowering [alert threshold values](/docs/products/compute/compute-instances/guides/resource-usage-email-alerts/).

As well, the following possible solution may help:

### Incorrect Email Server Credentials

You may see this error:

{{< output >}}
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/lib/python3.6/imaplib.py", line 598, in login
    raise self.error(dat[-1])
imaplib.error: b'[AUTHENTICATIONFAILED] Invalid credentials (Failure)'
{{< /output >}}

This indicates that your email password or username are incorrect. Verify that you have set these correctly in environment variables as described in the [Run the Code](#run-the-code) section. Some services may require you to create an app-specific password for the IMAP connection if you use 2-step verification/2FA on your account. (e.g. [Gmail](https://support.google.com/accounts/answer/185833))
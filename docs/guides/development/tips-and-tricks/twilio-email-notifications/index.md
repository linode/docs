---
slug: create-an-email-notification-system-using-twilio
author:
  name: John Mueller
  email: john@johnmuellerbooks.com
description: "By default, Linode sends system notifications to a single email address. In this guide, you can see how to use Twilio to intercept those email messages and redirect them to an email distribution that works for your needs."
og_description: "By default, Linode sends system notifications to a single email address. In this guide, you can see how to use Twilio to intercept those email messages and redirect them to an email distribution that works for your needs."
keywords: ['twilio notify']
tags: ['email']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-11
modified_by:
  name: Linode
title: "Create an Email Notification System Using Twilio"
h1_title: "Create an Email Notification System Using Twilio"
enable_h1: true
contributor:
  name: John Mueller
  link:
---

By default, Linode sends system notifications to a single email address. However, you can [use Twilio to extend the manner in which it does so](/docs/guides/development/tips-and-tricks/twilio-system-notifications). There are plenty of reasons to change the way things work – most of which benefit system administrators.

Perhaps several administrators and managers should be informed if certain events occur. Or you might want to send clients heads-up messages to minimize downtime disruptions. And you want to be sure that misconfigurations don't cause errors.

Using Twilio and a programming language of your choice (such as Python), you can intercept the Linode email message, and then output it in the form that works for you. This way you can send Linode notifications to as many people as needed, using email, SMS, or voice. This guide shows you how to achieve that with email.

## Notification Prerequisites

To work with this example, beyond your Linode account, at a minimum you need an email account (either POP3 or IMAP4) and a Twilio account.

The Twilio account provides access to a variety of notification types, including SMS, voice, video, and push notifications. You can explore the process without a financial investment. You can get a [free trial Twilio account](https://www.twilio.com/try-twilio?promo=ZLP3eg) that has a $10 usage credit, which is more than enough to work through this article and perform a little experimentation besides. The one thing missing from Twilio is email notifications, which you can add by getting a [free SendGrid account](https://signup.sendgrid.com/). The free account permits you to send up to 40,000 emails for 30 days, then up to 100 emails per day.

When you set up Twilio, you verify your information using both an email message and either a phone call or SMS text message. After the verification, you answer some simple questions, such as how you plan to use Twilio; they modify the initial dashboard you see, so answering the questions correctly is important. The one setting that's important for this article is that _you want to send notifications_. It would also be a good idea to tell Twilio that you want to use code to interact with the service and select Python as your language. (You could use another language, but choose Python, for now, to follow along).

Once inside the dashboard, get a free trial number that lets you work with the Twilio voice, SMS, and MMS features.

Before you can send a message using Python, you must have Twilio's helper library installed. (Find the instructions [here](https://www.twilio.com/docs/libraries/python).) The example code uses version `6.53.0`.

In addition to the helper library, you must also [verify the number you plan to use for testing](https://www.twilio.com/console/phone-numbers/verified). A trial account only allows text verification. It's not possible to send messages to an unverified account when using a trial version.

At this point, your setup is complete enough to do some experimentation using this article. The [quick start guides](https://www.twilio.com/docs/quickstart) are especially helpful once you complete this article.

## Intercept the Email Using POP3

To begin with, this section demonstrates how to process email using POP3. You can also intercept the email using IMAP4, which is explained in [this section](/docs/guides/create-an-email-notification-system-using-twilio/#intercept-the-email-using-imap4).

{{< note >}}
None of the credentials in this article are real, so you must supply them before you can run the code. With this in mind, it's a great idea to create a block for your email credential information that is separate from the operational code, as shown in the below example.
{{< /note >}}

    Email = "Your Email Address"
    Password = "Your Password"
    Server = "POP Server Address"

At this point, you can start processing the messages in the inbox. The code is selective in what it processes and how it processes it.

{{< file example.py python >}}
import poplib
from email.parser import Parser

## Log into the email server using POP3.
mail = poplib.POP3_SSL(Server)
mail.user(Email)
mail.pass_(Password)

## Obtain the number of messages
NumMessages = len(mail.list()[1])

## Process each email in turn.
for i in range(NumMessages):

    ## Obtain message data.
    resp, lines, octets = mail.retr(i+1)
    msg_content = b'\r\n'.join(lines).decode('utf-8')
    msg = Parser().parsestr(msg_content)
    email_from = msg.get('From')

    ## Check for emails from Linode Alerts.
    if email_from == 'Linode Alerts <noreply@linode.com>':
        email_subj = msg.get('Subject')
        subj_parts = email_subj.split(" - ")
        content = msg.get_payload(decode=True)
        print('Message Type: %s\r\nSpecifics: %s\r\n%s' %
              (subj_parts[0], subj_parts[1], str(content, 'utf-8')))

    ## If this is an actual alert, then send a text.
    if subj_parts[0] == "Linode Alert":
        SendText('Message Type: %s\r\nSpecifics: %s\r\n%s' %
              (subj_parts[0], subj_parts[1], str(content, 'utf-8')))

mail.close()
{{< /file >}}

The code begins by logging into the email account. It then sees how many messages are in the inbox. If there are any messages, it enters a loop.

To find the Linode alert message, you must process every message in the inbox as far as needed to determine from whom the message is sent. The sender to look for is `Linode Alerts <noreply@linode.com>`. You could have messages in there from anyone, including spam messages that just happened to pop by, so it's important to perform this step of using `msg.get('From')` to detect the sender.

The subject line tells you about the message type and some sort of specific data about the message. The elements are divided from each other with a hyphen (`-`).

## Once You Have an Alert, What Do You Do With It?

Linode sends all sorts of messages, not just alerts. For example, you might receive a Linode Events Notification when someone changes the server configuration. That might be something to log or even for an administrator to review, but you don't want to tell everyone about it. So, the next step is to split the subject line into parts and determine if the Linode message type that you have is a "Linode Alert". Once this determination is made, then you can tell someone about it. The example sends a text message.

If you have worked with email in Python before, you may notice that this code takes a few shortcuts. For example, it does not check for a multipart message because none of the Linode messages are multipart, which makes things considerably easier. This example also relies on simplified content processing because the messages you get from Linode are text.

## Intercept the Email Using IMAP4

The process for working with IMAP4 is similar to POP3 but different enough that you can't simply use the same code. Here's the code for an IMAP4 version of the previous example.

{{< file example.py python >}}
import imaplib

## Log into the server.
mail = imaplib.IMAP4_SSL(Server)
mail.login(Email, Password)

## Select the inbox.
mail.select('inbox')

## Look for Linode messages.
status, data = mail.search(None, 'FROM', 'Linode Alerts')

## The search result data will come as a single large entity,
## which must then be split into separate blocks of one message each.
for block in data:
    mail_ids += block.split()

for i in mail_ids:
    # Fetch each of the mesasages in turn.
    status, data = mail.fetch(i, '(RFC822)')

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
        print('Message Type: %s\r\nSpecifics: %s\r\n%s' %
          (subj_parts[0], subj_parts[1], str(content, 'utf-8')))

        ## If this is an actual alert, then send a text.
        if subj_parts[0] == "Linode Alert":
            SendText('Message Type: %s\r\nSpecifics: %s\r\n%s' %
                  (subj_parts[0], subj_parts[1], str(content, 'utf-8')))

mail.close()
mail.logout()
{{< /file >}}

The major difference is mostly in how you log in (which is simpler because it requires just one call) and how the messages are found using `mail.search(None, 'FROM', 'Linode Alerts')`. This approach saves time and resources because you don't download and check all of the messages; you check only those that are pertinent. Otherwise, the processing is essentially the same.

## Send a Message Using Python

As we are demonstrating using the Twilio trial version, the following simple example shows you how to send an SMS message to just one phone number. However, the technique works for entire lists of phone numbers.
{{< note >}}
Ensure you keep track of your Trial Balance entry on the Twilio Dashboard; the cost of even a simple message will use up your trial dollars quickly.
{{< /note >}}

- Whether you use POP3 or IMAP4 to obtain the messages, you use code as shown in the following example to set up Twilio access.

{{< file example.py python >}}
from twilio.rest import Client

# Configure your account SID and Authorization Token.
account_sid = "Your SID"
auth_token = "Your Token"
client = Client(account_sid, auth_token)
{{< /file >}}

- After setting up Twilio, you can then start sending SMS messages using the following approach:

{{< file example.py python >}}
def SendText(message):
    message = client.messages.create(
             body = message,
             from_ = '+1 Your Trial Number',
             to = '+1 Your Verified Number'
         )

    print(message.sid)
{{< /file >}}

The previous sections of code used `SendText()` after finding each alert message. Because this is a trial, you use your trial number as a sender and your verified number (it must be a smartphone) as the recipient. Seeing the text on your phone may take a few minutes.

## Create Custom Notification System

Even though the code in this article looks basic, you have everything you need to start sending SMS notifications. Adding support for other notification types is a matter of creating the appropriate functions for those notifications. You could process the `client.messages.create()` calls in a loop to accommodate as many numbers as needed. The point is that this system augments what Linode provides natively to allow notification of as many parties as needed.

---
slug: twilio-notify
author:
  name: John Mueller
  email: john@johnmuellerbooks.com
description: 'Learn how to write software to poll a single email address. Then use the captured data to send out as many notifications as you need using Twilio.'
og_description: 'Learn how to write software to poll a single email address. Then use the captured data to send out as many notifications as you need using Twilio.'
keywords: ['twilio email']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-25
modified_by:
  name: Linode
title: "Create an email notification system using Twilio"
h1_title: "Create an email notification system using Twilio"
contributor:
  name: John Mueller
  link:
---
# Create an email notification system using Twilio

By default, Linode sends system notifications by email. But that&#39;s just the start. With Twilio, you can poll an email address, and then use the captured data to send out as many notifications as you need.

## Intercept the e-mail messages

Linode&#39;s notification features send notifications to an e-mail address – just _one_ e-mail address. That is helpful for many situations. However, it is not efficient if you have many people to notify, some of whom apparently only check their e-mail once a year. When a system goes pear-shaped, people need to know immediately.

Instead, you can write software to poll the single e-mail address. Then use the captured data to send out as many notifications as you need using as many methods as you need.

This section addresses e-mail interception using Python, but you can use other languages as well. The best choices for languages are Node.js, C#, PHP, Ruby, Python, Java, or cURL because Twilio provides good example code using these languages.

When reading e-mail from a server, your application needs either a POP3 library, such as [poplib](https://docs.python.org/3/library/poplib.html), or an IMAP4 library, such as [imaplib](https://docs.python.org/3/library/imaplib.html). Use IMAP4 when you can, as it allows synchronization between the client and the server. However, your mail server might only support POP3, so check first.

Here&#39;s the process you normally use to intercept the e-mails using a polling approach:

1. Connect and log into the e-mail server.
2. Select the inbox.
3. Search for Linode notifications and place each one you find into a list.
4. Fetch the notifications using the list.
5. Save the subject and message content for each message.
6. Optionally delete each notification after processing it, which involves:

 -  Move the message to the trash folder.
 - Set any required message flags.
 - Expunge the trash folder; the act of expunging permanently removes the message.

7. Log off the e-mail server.

## Create a Twilio binding

To send a message using Twilio, you must [bind a target identity, such as a user, to the address used by the notification channel](https://www.twilio.com/docs/notify/api/binding-resource).

When working with Python, you import Client from the twilio.rest library to perform this task. Create a client, then use the `client.notify.services()` function to define the binding. If you previously defined a binding for a particular target, you can simply fetch it for reuse later. Because Twilio stores the bindings as resources, you must specifically delete a binding when you no longer need it.

## Send a simple Twilio notification

At this point, you have a message and a binding resource to use to [send a notification](https://www.twilio.com/docs/notify/send-notifications). However, before you can send the message, you must [define which service](https://www.twilio.com/docs/messaging/services/api) to use to send the notification. The process varies by the kind of service: [phone number](https://www.twilio.com/docs/messaging/services/api/phonenumber-resource), [short code](https://www.twilio.com/docs/messaging/services/api/shortcode-resource), or [alphabetical sender](https://www.twilio.com/docs/messaging/services/api/alphasender-resource).

Twilio supports two types of notifications: transactional and bulk. The difference between the two is in how much information you supply. A transactional notification relies on a tag to address a particular target, rather than a group of targets. Twilio highly recommends that you go the transactional route to ensure that people who don&#39;t want to see your notifications don&#39;t receive one.

For iOS or Android clients, the user has to allow push notifications and then register for notifications. The extra work on these platforms is to ensure that the notification provides the correct appearance and features, such as a badge.

## Test your setup

It&#39;s wise to perform a test. Otherwise, you won&#39;t know whether your system will work. You need confidence that Linode notifications reach the right people when there&#39;s a problem.

The easiest method is to ensure everyone knows that you&#39;ll be testing the setup and then set a Linode threshold low enough to generate a notification. The notification will end up in the e-mail you setup, whereupon your application will process the information and use it to generate a Twilio notification. At this point, everyone should receive a notification message.

The failure point over which you have the most control is your application to intercept and monitor the e-mail message. You could create a test harness to artificially generate the required e-mail messages and then verify the application output before the application creates a Twilio notification. This setup would help you ensure that the fault, when one occurs, is less likely to occur in your custom application.

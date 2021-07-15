---
slug: how-to-receive-system-notifications-from-twilio
author:
  name: John Mueller
  email: john@johnmuellerbooks.com
description: 'By default, Linode sends system notifications by email. But you can use Twilio to send SMS messages and notifications to system monitoring tools – a boon for any network administrator. In this guide, you can see how its API works, and how you can connect services to make your life easier.'
og_description: 'By default, Linode sends system notification by email. But you can use Twilio to send SMS messages and notifications to system monitoring tools – a boon for any network administrator. In this guide, you can see how its API works, and how you can connect services to make your life easier.'
keywords: ['twilio notify']
tags: ['email']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-11
modified_by:
  name: Linode
title: "How to Receive System Notifications From Twilio"
h1_title: "Receive System Notifications From Twilio"
enable_h1: true
contributor:
  name: John Mueller
  link:
---

[Twilio](https://www.twilio.com/) links internet and telecom networks, creating connections using text messages, emails, phone calls, video, and intelligent chatbots.

When you first explore the service, it may appear customer service-oriented, especially for marketing purposes. However, Twilio also has value to anyone who needs [operations support](https://www.twilio.com/solutions/operations), including network administrators.

Among the capabilities is sending notifications using a variety of methods. The Twilio API support makes it possible to programmatically contact people who should know about Linode events, such as employees, departments, and third parties.

In other words, if the system goes down or encounters another problem, you can send a text message to the people who need to respond.

## A Quick Word About Personal Access Tokens

Before you can work with Twilio or Linode, you need access tokens that identify you or your organization. Otherwise, you can't gain access to the resources you need, because these tokens keep your setup secure.

When working with Twilio, this means providing three kinds of information: account [String Identifier (SID)](https://www.twilio.com/docs/glossary/what-is-a-sid), authorization token, and notify (or other) service SID. To obtain your Twilio access token, perform the following:

1. Log into your Twilio account.
1. Locate the account SID and authorization token on your project Twilio Dashboard.
1. Obtain the appropriate [service SID](https://www.twilio.com/docs/messaging/services/api) using the Twilio Console.

Linode usually doesn't require that you interact with it programmatically to send out notifications; you can configure it to send the appropriate notifications. However, if you do need to interact with Linode programmatically, [generate an API key](/docs/guides/api-key/) using the Linode Manager and use it when writing your code.

## Configure the Linode Notification Thresholds

Linode thresholds inform you about server conditions when you configure it using the following steps:

1. Set up your Linode using the [Getting Started with Linode](/docs/getting-started/) and [How to Secure Your Server](/docs/security/securing-your-server/) guides.

1. Configure the [Linode Cloud Manager](/docs/products/tools/cloud-manager/guides/) to [produce email alerts](/docs/guides/monitoring-and-maintaining-your-server/#configure-linode-cloud-manager-email-alerts).

At this point, we have Linode configured to let someone know when something goes wrong, and Twilio IDs set up. It's time to put the two of them together.

There are a few ways to do this. To begin with, you can [create an email notification system using Twilio](/docs/guides/development/tips-and-tricks/create-an-email-notification-system-using-twilio).

---
slug: twilio-notify
author:
  name: John Mueller
  email: john@johnmuellerbooks.com
description: 'By default, Linode sends system notification by email. But you can use Twilio to send SMS messages and notifications to system monitoring tools – a boon for any network administrator. Here&#39;s how its API works, and how you can connect services to make your life easier.'
og_description: 'By default, Linode sends system notification by email. But you can use Twilio to send SMS messages and notifications to system monitoring tools – a boon for any network administrator. Here&#39;s how its API works, and how you can connect services to make your life easier.'
keywords: ['twilio notify']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-25
modified_by:
  name: Linode
title: "How to receive system notifications from Twilio"
h1_title: "How to receive system notifications from Twilio"
contributor:
  name: John Mueller
  link:
---

# How to receive system notifications from Twilio

[Twilio](https://www.twilio.com/) links internet and telecom networks, creating connections using text messages, emails, phone calls, video, and intelligent chatbots.

When you first explore the service, it may appear customer service-oriented, especially for marketing purposes. However, Twilio also has value to anyone who needs [operations support](https://www.twilio.com/solutions/operations), including network administrators.

Among the capabilities is sending notifications using a variety of methods. The Twilio API support makes it possible to programmatically contact people who should know about a Linode events, such as employees, departments, and third parties.

In other words: If the system goes down or encounters another problem, you can send a text message to the people who need to respond.

## A quick word about personal access tokens

Before you can work with Twilio or Linode, you need access tokens that identify you or your organization. Otherwise, you can&#39;t gain access to the resources you need, because these tokens keep your setup secure.

When working with Twilio, this means providing three kinds of information: account [String Identifier (SID)](https://www.twilio.com/docs/glossary/what-is-a-sid), authorization token, and notify (or other) service SID. To obtain your Twilio access token:

1. Log into your Twilio account.
2. Locate the account SID and authorization token on your project Twilio Dashboard.
3. Obtain the appropriate [service SID](https://www.twilio.com/docs/messaging/services/api) using the Twilio Console.

Linode usually doesn&#39;t require that you interact with it programmatically to send out notifications; you can configure it to send the appropriate notifications. However, if you do need to interact with Linode programmatically, [generate an API key](https://www.linode.com/docs/guides/api-key/) using the Linode Manager and use it when writing your code.

Then you can configure the Linode notification thresholds. Linode thresholds inform you about server conditions when you configure it using these steps:

1. Set up your Linode using the [Getting Started](https://www.linode.com/docs/getting-started/) and [Securing your Server](https://www.linode.com/docs/security/securing-your-server/) guides.
2. Configure the [Linode Cloud Manager](https://www.linode.com/docs/products/tools/cloud-manager/guides/) to [produce email alerts](https://www.linode.com/docs/guides/monitoring-and-maintaining-your-server/).

At this point, we have Linode configured to let someone know when something goes wrong, and Twilio IDs set up. It&#39;s time to put the two of them together.

There are a few ways to do this. To begin with, you can [create an email notification system using Twilio](twilio-email-notifications/index.md).

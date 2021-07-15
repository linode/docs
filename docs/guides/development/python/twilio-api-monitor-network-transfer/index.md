---
slug: monitor-your-linodes-network-transfer-pool
author:
  name: John Mueller
description: 'You can use Twilio notifications along with the Linode API to send you important alerts about your Linode infrastructure. This guide shows you how to use Twilio and Linode''s Python Library to receive alerts about your Linode''s network transfer usage.'
og_description: 'You can use Twilio notifications along with the Linode API to send you important alerts about your Linode infrastructure. This guide shows you how to use Twilio and Linode''s Python Library to receive alerts about your Linode''s network transfer usage.'
keywords: ['twilio notifications']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-30
modified_by:
  name: Linode
title: "Monitor your Linode's Network Transfer Pool"
h1_title: "Twilio Notifications: Use Twilio and the Linode API to Monitor your Linode's Network Transfer Pool"
enable_h1: true
contributor:
  name: John Mueller
---

When you configure a Linode, you define a specific amount of bandwidth to use to transfer data with that Linode. The network transfer pool is the total amount of bandwidth for all of the Linode’s associated with your account. If one Linode exceeds its network transfer capacity, but there is still bandwidth available in other Linodes, then you aren’t charged for the overage. Note that your quota only applies to traffic on the public network, traffic on the private network doesn't count toward your total. See our [Network Transfer Quota](/docs/guides/network-transfer-quota/) guide for more information.

It’s important to keep track of just how much bandwidth you do have and to do something about it when you reach your limit. You can always click the Monthly Network Transfer Pool link in the Linodes tab to display the current value as shown in Figure 1, but this is an inconvenient way to keep track and you might forget to check it, which is where the [Network Transfer View endpoint](/docs/api/linode-instances/#network-transfer-view) comes into play. By combining this API with Twilio, you can send regular notifications of network transfer pool status, along with alerts when it appears that you may go over your allotment.

## Install the API

Before you can do much with the Linode API, you need to install the prerequisites. The examples in this article focus on Python, so you use the `pip` utility to perform this task. Begin by opening an Anaconda or other prompt that has access to your Python development environment. Type `pip install linode_api4` and press **Enter**. When you see the success message, then you are ready to begin using the API.

To access the API, you need an API token, which is not supplied by default. The [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api) guide tells you how to generate an API token that you can use for accessing your Linode. Then, perform a test to ensure you can actually access your Linode using the API. The following code provides access to some simple statistics for the first Linode in your setup.

{{< file "main.py">}}
from linode_api4 import LinodeClient

client = LinodeClient('Your API Token')
thisInstance = client.linode.instances()[0]

print('Instance Name: ', thisInstance.label)
print('Instance CPU Alerts Setting: ', thisInstance.alerts.cpu)

{{< /file >}}

The code shows three basic steps in working with the API.

1. Import the required Linode API version 4.
1. Create a client to access the data, then use it to access a specific instance.
1. Obtain any required instance information.

The output you see should match your Linode. You can find additional information about the data you can retrieve about an instance using the [Linode Instances endpoint](/docs/api/linode-instances/). If the output doesn't match your Linode or you see an error, then something isn’t quite right with your setup and you need to work with it before moving forward.

## Access the Transfer Data

Now that you know you have access to the Linode API, you can check on the status of the network transfer pool. The information you receive tells you the quota size (how much bandwidth you can use each month), the amount of bandwidth you’ve already used, and the billable amount of any overage. Following is the code that is used to perform this task.

{{< file "main.py" >}}
from linode_api4 import LinodeClient

client = LinodeClient('Your API Token')
thisInstance = client.linode.instances()[0]
transfer = thisInstance.transfer

print("Quota (in GB): ", transfer.quota)
print("Used (in bytes): ", transfer.used)
percentUsed = ((transfer.used/1073741824)/transfer.quota)*100
print("Percent Used: %f percent." % percentUsed)
print("Billable: ", transfer.billable)

{{< /file >}}

This code looks a lot like the test code you used earlier, but a bit more detailed. You access the Linode API using the same technique, but now you want the transfer data. It’s important to remember to convert the bytes reported by `transfer.used` to GB before you perform the percentage calculation because `transfer.quota` is in GB. When running this code on a Linode that you had set up for the test purpose, you might see output like the folllowing:

{{< output >}}
Quota (in GB):  791
Used (in bytes):  1304284
Percent Used: 0.000154 percent.
Billable:  0
{{ /output >}}

## Send a Notification

You could have any number of reasons for sending a notification. For example, you might simply want a daily status report delivered to your smartphone as a text. In this case, you configure your Python app to perform the check each day using the API call in the previous section and then use this code to send the notification:

{{< file "main.py">}}
from twilio.rest import Client

# Configure your account SID and Authorization Token

account_sid = "Your SID"
auth_token = "Your Token"
client = Client(account_sid, auth_token)

content = ('Quota (in GB): %s'
    '\r\nUsed (in bytes): %s'
    '\r\nPercent Used: %f percent.'
    '\r\nBillable: %s') % \
    (transfer.quota, transfer.used, percentUsed, transfer.billable)

message = 'Message Type: Network Transfer Pool\r\nSpecifics: %s' % \
    (content)

text = twClient.messages.create(
         body = message,
         from_ = '+1 Your Trial Number',
         to = '+1 Your Verified Number'
     )

print(text.sid)

{{< /file >}}

This code assumes that you have at least a [trial Twilio account](https://www.twilio.com/try-twilio). This account provides you with both a SID and an authentication token to use for API calls. You must also set the account up to provide both a trial number (used to send texts) and a verified number (used to receive texts).

---
slug: monitor-linode-network-transfer-pool-with-twilio
description: "This guide shows you how to use Twilio and Linode's Python Library to receive alerts about your Linode's network transfer usage."
keywords: ['twilio notifications']
tags: ['python', 'monitoring']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-07
modified_by:
  name: Linode
title: "Twilio Notifications: Use Twilio and the Linode API to Monitor your Linode's Network Transfer Pool"
title_meta: "Monitor your Linode's Network Transfer Pool"
authors: ["John Mueller"]
---

Each Linode account has a monthly *outbound* network transfer pool. The network transfer pool is the total amount of free outbound bandwidth that is shared between all the Linode services in your account.

{{< note respectIndent=false >}}
For more information on how your network transfer pool's size is computed, and which services can consume your outbound network transfer pool, review the [Transfer Allowance](/docs/products/platform/get-started/guides/network-transfer/#transfer-allowance) section of the [Network Transfer Usage and Costs](/docs/products/platform/get-started/guides/network-transfer/) guide.
{{< /note >}}

It's important to keep track of how much bandwidth your account has. If you use more than your pool size in a given month, then you are billed an overage fee for that month. If you observe that you have used a high percentage of your transfer pool, then you can start to plan or budget for a possible transfer overage. Linode provides a few ways to monitor your transfer usage:

- The [Cloud Manager](/docs/products/platform/get-started/guides/network-transfer/#cloud-manager) displays your current transfer usage.

- The [Linode CLI](/docs/products/platform/get-started/guides/network-transfer/#linode-cli) can report your current transfer usage.

- Linode sends [email alerts](/docs/products/platform/get-started/guides/network-transfer/#email-alerts) at 80%, 90%, and 100% of your transfer usage.

Using Twilio, you can also build a custom text message notification system for your transfer usage. Such a system would periodically send notifications to help you be aware of your transfer usage without manually checking on it. You can also configure the system to send notifications at custom transfer usage percents, instead of the standard 80%, 90%, and 100% Linode email alerts. This custom notification system relies on the [Network Transfer View endpoint](/docs/api/linode-instances/#network-transfer-view) of the Linode API.

## In this Guide

- In the [Send Network Transfer Usage in a Text Message](#send-network-transfer-usage-in-a-text-message) section, a Python script is demonstrated that queries the [Network Transfer View endpoint](/docs/api/linode-instances/#network-transfer-view) of the Linode API. The information from this endpoint is embedded in a text message that is delivered via the Twilio API.

- The [Set Up a Cron Job](#set-up-a-cron-job) section shows how to periodically call the Python script, so that you can frequently be informed of your network transfer usage.

- The [Set a Notification Threshold](#set-a-notification-threshold) section updates the Python script so that a text message is only set if you have exceeded a certain percentage of your pool size.

- The [Set an Overage Threshold](#set-an-overage-threshold) section further updates the Python script so that the text message notification also shows your billed overage amount if you have exceeded your pool size.

## Before You Begin

1. This guide shows how to set up the notification system on a Linode instance. A Linode instance is used because it can remain powered on at all times.

    If you want to implement the notification system, [create a Linode in the Cloud Manager](/docs/products/compute/compute-instances/get-started/). The lowest-cost Shared CPU instance type is appropriate for this guide. If you already have a Linode instance that you want to set up the notification system on, you can use that instead of a new instance. This guide was tested with Ubuntu 20.04, but should also work with other Linux distributions and versions.

    After you create your Linode, follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to reduce the threat of a system compromise. Specifically, make sure you [Add a Limited User Account](/docs/products/compute/compute-instances/guides/set-up-and-secure/#add-a-limited-user-account) to the Linode. The notification system in this guide should be installed under a limited Linux user.

1.  Another guide in our library, [How to Use the Linode API with Twilio](/docs/guides/how-to-use-the-linode-api-with-twilio/), shows the prerequisite steps for using the Linode API and Twilio API together. Follow this guide, starting with its [Before You Begin](/docs/guides/how-to-use-the-linode-api-with-twilio/#before-you-begin) section, up to and including the [Install the Python Bindings for the Linode API](/docs/guides/how-to-use-the-linode-api-with-twilio/#install-the-python-bindings-for-the-linode-api) section.

    The guide instructs you to install the Linode API and Twilio API clients for Python. When following these instructions, run the commands under the limited Linux user on your Linode instance.

    {{< note respectIndent=false >}}
The prerequisite guide instructs you to select the **Account** resource [when creating the Linode API key](/docs/guides/how-to-use-the-linode-api-with-twilio/#get-a-linode-api-token). This resource is also used for the [Network Transfer View endpoint](/docs/api/linode-instances/#network-transfer-view) that's accessed by the network transfer usage notification system in the current guide.
{{< /note >}}

1. This guide instructs you to create a Python script from within an SSH session on your Linode. You need to install and use a terminal text editor to write the script on your Linode. Common text editors include [nano](/docs/guides/use-nano-to-edit-files-in-linux/) (the easiest option for terminal beginners), [emacs](https://www.gnu.org/software/emacs/), and [vim](https://www.vim.org/).

## Send Network Transfer Usage in a Text Message

This section shows how to write a Python script that queries the [Network Transfer View endpoint](/docs/api/linode-instances/#network-transfer-view) of the Linode API. The information returned by the endpoint is embedded in a text message that is sent via the Twilio API to your phone number.

The last part of this section shows how to run the script manually to deliver a single text notification. [The next section](#set-up-a-cron-job) shows how to periodically run the script.

### Import Modules and Initialize Service Credentials

1.  Log into your Linode under your limited Linux user [using SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Create a new file named `transfer-pool-notification-twilio.py` with your preferred terminal text editor. For example, when using `nano`, run:

        nano transfer-pool-notification-twilio.py

1.  Copy this snippet into the file:

    {{< file "transfer-pool-notification-twilio.py">}}
import os
import sys
from linode_api4 import LinodeClient
from twilio.rest import Client

try:
    twilio_account_sid = os.environ['TWILIO_ACCOUNT_SID']
    twilio_auth_token = os.environ['TWILIO_AUTH_TOKEN']
    twilio_from_phone_number = os.environ['TWILIO_FROM_PHONE_NUMBER']
    twilio_to_phone_number = os.environ['TWILIO_TO_PHONE_NUMBER']
    linode_api_token = os.environ['LINODE_API_TOKEN']
except KeyError:
    print("Please ensure that the following environment variables are set when running the script: ")
    print("TWILIO_ACCOUNT_SID")
    print("TWILIO_AUTH_TOKEN")
    print("TWILIO_FROM_PHONE_NUMBER")
    print("TWILIO_TO_PHONE_NUMBER")
    print("LINODE_API_TOKEN")
    sys.exit(1)
{{< /file >}}

    {{< disclosure-note "About the code" >}}
This code imports the relevant Linode and Twilio API modules. It also imports the `os` module, which can be used to read environment variables from your terminal. The module is used by the code example to load your API tokens and Twilio phone numbers. A later section in this guide shows how to set those environment variables before running the script.

Alternatively, you could directly list the token and phone number values in the script. However, it's a good practice to avoid doing this. For example, if you listed your secrets inside the code and then uploaded your code to a public code repository like GitHub, they would be publicly visible.

The `except KeyError` statement is executed if any of the environment variables are not set. A message is printed in the console that tells you which variables are expected by the script. The `sys.exit()` method immediately exits the script in this case.
{{< /disclosure-note >}}

### Create Linode API and Twilio API Python Clients

Copy and paste the code from this snippet to the bottom of your script:

{{< file "transfer-pool-notification-twilio.py">}}
# copy and paste to bottom of file:

linode_client = LinodeClient(linode_api_token)
twilio_client = Client(twilio_account_sid, twilio_auth_token)
{{< /file >}}

These lines create new client objects that can interact with the Linode and Twilio APIs.

### Access the Transfer Data

Copy and paste the code from this snippet to the bottom of your script:

{{< file "transfer-pool-notification-twilio.py">}}
# copy and paste to bottom of file:

account_network_transfer = linode_client.account.transfer()
pool_used_ratio = account_network_transfer.used/account_network_transfer.quota
{{< /file >}}

{{< disclosure-note "About the code" >}}
The first line queries the Linode API to get an object that contains information about your account's network transfer pool for the current month. The Python binding for the [Network Utilization View](/docs/api/account/#network-utilization-view) endpoint is accessed. The documentation for this endpoint shows the `account:read_only` authorization is needed to access it. This is why the Account resource was specified in the [Before You Begin](#get-a-linode-api-token) section.

This endpoint returns an object that has three properties:

- `billable`: The amount of your transfer pool, in GB, that is billable for the current month. This is zero if you haven't exceeded the size of your transfer pool.

- `quota`: The current size of your monthly network transfer pool, in GB.

- `used`: The amount of your network transfer pool used in the current month, in GB.

The second line of this code computes the ratio of the used transfer amount to the total pool size. For example, if your account has a 1000GB pool, and you have used 250GB of the pool this month, then the `pool_used_ratio` is .25, or 25%.

These properties and the computed `pool_used_ratio` are included in the text message body in the next section.
{{< /disclosure-note >}}

### Prepare Twilio Text Message Body

Copy and paste the code from this snippet to the bottom of your script:

{{< file "transfer-pool-notification-twilio.py">}}
# copy and paste to bottom of file:

summary_text = "Linode network transfer pool statistics"

transfer_statistics_text = 'Used: %sGB\n' \
    'Transfer pool size: %sGB\n' \
    'Percent of pool used: %s%%\n\n' \
    'https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/' % \
    (account_network_transfer.used,
    account_network_transfer.quota,
    round(pool_used_ratio * 100, 4))

message_text = ('%s:\n\n%s' % (summary_text, transfer_statistics_text))
{{< /file >}}

{{< disclosure-note "About the code" >}}
The code in this snippet prepares the content that is used in the text message.

- Lines 5-11: The properties from the account network transfer API object are inserted into the message, along with a link to our guide that explains how Linode's network transfer works.

- Line 11: The computed `pool_used_ratio` from the previous section is multiplied by 100 and [rounded](https://www.w3schools.com/python/ref_func_round.asp) to within four digits of precision. This is done to present the ratio as a percentage. For example, a `pool_used_ratio` equal to .25 is presented as 25%.

- Line 13 combines a summary text string with the transfer statistics string.

The `\n` character sequence appears in the message text strings. These characters [insert newlines in the message](https://support.twilio.com/hc/en-us/articles/223181468-How-do-I-Add-a-Line-Break-in-my-SMS-or-MMS-Message-).
{{< /disclosure-note >}}

### Create and Send a Text Message with Twilio

1. Copy and paste the code from this snippet to the bottom of your script:

    {{< file "transfer-pool-notification-twilio.py">}}
# copy and paste to bottom of file:

message = twilio_client.messages.create(
    body = content,
    from_ = twilio_from_phone_number,
    to = twilio_to_phone_number
)

print("Twilio message created with ID: %s" % (message.sid))
{{< /file >}}

    {{< disclosure-note "About the code" >}}
The `create` method tells the Twilio API to create *and* immediately send a new text message:

- The text string from the last section is used as the body of the message.

- The `from_` phone number corresponds to the new number that you selected in the Twilio console earlier in the guide.

- The `to` number corresponds with your personal or testing phone number that you signed up to Twilio with.

The `create` method returns a reference to the Twilio [message resource](https://www.twilio.com/docs/sms/api/message-resource) that was created. The last line prints the unique ID of the message.
{{< /disclosure-note >}}

1. After appending the above snippet, save the file and exit your text editor.

    {{< note respectIndent=false >}}
The code example is now complete. Your script should now look like the code in [this file](transfer-pool-notification-twilio.py).
{{< /note >}}

### Run the Code

1.  Before you run the script, set the [environment variables](/docs/guides/how-to-set-linux-environment-variables/) that the script expects in your terminal. In your SSH session with your Linode, run the following commands. After the `=` symbol in each command, insert the corresponding value:

        export TWILIO_ACCOUNT_SID=
        export TWILIO_AUTH_TOKEN=
        export TWILIO_FROM_PHONE_NUMBER=
        export TWILIO_TO_PHONE_NUMBER=
        export LINODE_API_TOKEN=

    For example, the filled-in commands could look like:

    {{< output >}}
export TWILIO_ACCOUNT_SID=96af3vrYKQG6hrcYCC743mR27XhBzXb8wQ
export TWILIO_AUTH_TOKEN=LD9NWYXZzp3d3k7Mq7ME6L8QJJ8zu73r
export TWILIO_FROM_PHONE_NUMBER=+122233344444
export TWILIO_TO_PHONE_NUMBER=+15556667777
export LINODE_API_TOKEN=bKfoAoV8Awo8e9CVTFTYKEdojkpHdD8BNU6UvV66izq6KjduPikfQTGHYmo3vFv6
{{< /output >}}

    The values for each variable are as follows:

    | Variable | Value |
    |----------|-------|
    | TWILIO_ACCOUNT_SID | The Twilio account SID [located in your Twilio console](/docs/guides/how-to-use-the-linode-api-with-twilio/#locate-your-twilio-api-credentials) |
    | TWILIO_AUTH_TOKEN | The Twilio auth token [located in your Twilio console](/docs/guides/how-to-use-the-linode-api-with-twilio/#locate-your-twilio-api-credentials). The phone number needs to be entered using [E.164](https://www.twilio.com/docs/glossary/what-e164) formatting. |
    | TWILIO_FROM_PHONE_NUMBER | The new number that you selected in the Twilio console [when you first signed up](/docs/guides/how-to-use-the-linode-api-with-twilio/#sign-up-for-twilio) |
    | TWILIO_TO_PHONE_NUMBER | Your personal or testing phone number that you signed up to Twilio with. The phone number needs to be entered using [E.164](https://www.twilio.com/docs/glossary/what-e164) formatting. |
    | LINODE_API_TOKEN | [The Linode API token that you generated](/docs/guides/how-to-use-the-linode-api-with-twilio/#get-a-linode-api-token) and recorded |

1.  Run the script:

        python3 transfer-pool-notification-twilio.py

    If successful, the script generates output like the following:

    {{< output >}}
Twilio message created with ID: 9FKgk3Vokgx4hVC4937nx2kAraiG7qXDx8
{{< /output >}}

    A few moments later, you should receive a text message similar to:

    {{< output >}}
Sent from your Twilio trial account - Linode network transfer pool statistics:

Used: 100GB
Transfer pool size: 1000GB
Percent of pool used: 10.0%

https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/
{{< /output >}}

    If you receive an error message when you run the script, review the [Troubleshooting](#troubleshooting) section.

## Set Up a Cron Job

The notification system should be set up to run periodically on its own. By sending periodic notifications, you can be informed of your transfer usage throughout the month.

To run the Python script automatically, set up a cron job on your Linode. [Cron](/docs/guides/schedule-tasks-with-cron/) is a Linux tool that runs processes at different time intervals that you specify.

1.  In your SSH session, start the *crontab* editor:

        crontab -e

1.  A text file appears in your text editor. This file has some commented-out lines (which begin with `# `) that tell you to set up a new scheduled task in the file. Below these comments, copy and paste the following lines:

    {{< file >}}
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_PHONE_NUMBER=
TWILIO_TO_PHONE_NUMBER=
LINODE_API_TOKEN=

0 14 * * * python3 /home/exampleuser/transfer-pool-notification-twilio.py
{{< /file >}}

    The first five lines define your environment variables. The last line represents the scheduled task. The `0 14 * * *` at the start of the line represents when the task should run. Specifically, this string says that the task should run [at 2PM every day](https://crontab.guru/#0_14_*_*_*).

1.  After the `=` symbol in each of the first five lines, insert the corresponding value. The values are the same as they were in the previous [Run the Code](#run-the-code) section.

    For example, the filled-in crontab file could look like:

    {{< output >}}
TWILIO_ACCOUNT_SID=96af3vrYKQG6hrcYCC743mR27XhBzXb8wQ
TWILIO_AUTH_TOKEN=LD9NWYXZzp3d3k7Mq7ME6L8QJJ8zu73r
TWILIO_FROM_PHONE_NUMBER=+122233344444
TWILIO_TO_PHONE_NUMBER=+15556667777
LINODE_API_TOKEN=bKfoAoV8Awo8e9CVTFTYKEdojkpHdD8BNU6UvV66izq6KjduPikfQTGHYmo3vFv6

0 14 * * * python3 /home/exampleuser/transfer-pool-notification-twilio.py
{{< /output >}}

1.  On the last line, update the file path to the Python script (e.g. `/home/exampleuser/transfer-pool-notification-twilio.py`) so that it matches the path of the file on your system.

1.  Save the crontab file in your text editor and exit the editor. If it's still morning for you, you should receive a notification at 2PM of the current day. If it's in the afternoon, a notification is sent at 2PM the next day.

### (Optional) Adjusting the Scheduled Notification Time

You might want to be informed of your network transfer usage more frequently, or at a different time of day. To alter the task scheduling, run `crontab -e` again. Then, adjust the scheduling string for the task:

- Using `0 * * * *` would run the task at the start of every hour.

- Using `* * * * *` would run the task every minute. This is useful if you're testing the script to make sure it works as expected. You probably would not want to keep this schedule after you've finished testing.

Our [Schedule Tasks with Cron](/docs/guides/schedule-tasks-with-cron/) guide shows how other scheduled times can be set.

After changing the scheduling string, save the crontab file in your text editor and exit the editor.

## Set a Notification Threshold

The cron job sends you a periodic message with your network transfer statistics, regardless of how much of the transfer pool you have used. You may only want to receive a message whenever you have exceeded a percentage of your transfer pool. This can be achieved by altering the script:

1. In your `transfer-pool-notification-twilio.py`, remove lines 27-45:

    {{< file "transfer-pool-notification-twilio.py">}}
# remove the following lines:

# summary_text = "Linode network transfer pool statistics"
#
# transfer_statistics_text = 'Used: %sGB\n' \
#     'Transfer pool size: %sGB\n' \
#     'Percent of pool used: %s%%\n\n' \
#     'https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/' % \
#     (account_network_transfer.used,
#     account_network_transfer.quota,
#     round(pool_used_ratio * 100, 4))
#
# message_text = ('%s:\n\n%s' % (summary_text, transfer_statistics_text))
#
# message = twilio_client.messages.create(
#     body = message_text,
#     from_ = twilio_from_phone_number,
#     to = twilio_to_phone_number
# )
#
# print("Twilio message created with ID: %s" % (message.sid))
{{< /file >}}

1. Then, copy and paste these new lines of code to the file:

    {{< file "transfer-pool-notification-twilio.py">}}
# copy and paste to bottom of file:

def send_message(message_text):
    message = twilio_client.messages.create(
        body = message_text,
        from_ = twilio_from_phone_number,
        to = twilio_to_phone_number
    )

    print("Twilio message created with ID: %s" % (message.sid))

USAGE_NOTIFICATION_THRESHOLD_RATIO = .7

if pool_used_ratio > USAGE_NOTIFICATION_THRESHOLD_RATIO:
    summary_text = "You have used more than %s%% of your Linode account's network transfer pool" % \
        (USAGE_NOTIFICATION_THRESHOLD_RATIO * 100)

    transfer_statistics_text = 'Used: %sGB\n' \
        'Transfer pool size: %sGB\n' \
        'Percent of pool used: %s%%\n\n' \
        'https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/' % \
        (account_network_transfer.used,
        account_network_transfer.quota,
        round(pool_used_ratio * 100, 4))

    message_text = ('%s:\n\n%s' % (summary_text, transfer_statistics_text))

    send_message(message_text)
{{< /file >}}

    {{< disclosure-note "About the code" >}}
- Lines 3-10: To make the code a bit more readable, the create message request for the Twilio API is wrapped inside a new function called `send_message`. This function accepts the message body text that should be sent.

- On line 12, a threshold ratio is defined. You can change this number to be any positive number. The default in the script is `.7`, or 70% of the transfer pool. Setting this to `1` would implement a 100% pool usage threshold.

- On line 14, the computed `pool_used_ratio` is compared with the threshold ratio number.

- If it is greater, then the `send_message` function is called on line 28, and a text message is sent via Twilio.

- The summary text used for the text message body (lines 15-16) is updated in this new section of code. The new summary text tells the user what the threshold ratio is and presents that ratio as a percentage.
{{< /disclosure-note >}}

1. After appending the above snippet, save the file.

    {{< note respectIndent=false >}}
The updated code for this section is now complete. Your script should now look like the code in [this file](transfer-pool-notification-with-threshold-twilio.py).
{{< /note >}}

1. The updated script is automatically run the next time your cron job is scheduled. If your account has used more network transfer than the notification threshold from the script, then a text message is sent. The message should be similar to:

    {{< output >}}
Sent from your Twilio trial account - You have used more than 70% of your Linode account's network transfer pool:

Used: 800GB
Transfer pool size: 1000GB
Percent of pool used: 80.0%

https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/
{{< /output >}}

1. Your account may not have used more network transfer than the notification threshold. If you want to test the new code to make sure it works, you could temporarily change the value of the `USAGE_NOTIFICATION_THRESHOLD_RATIO` variable in the script to a lower number.

    For example, if you set `USAGE_NOTIFICATION_THRESHOLD_RATIO = 0` in your code, then the if statement is always true. This means that a text message is always sent when the script runs.

    {{< note respectIndent=false >}}
When testing, it can also be helpful to change the cron job schedule to run every minute, which is described in the [Adjusting the Scheduled Notification Time](#optional-adjusting-the-scheduled-notification-time) section.
{{< /note >}}

    If you do not receive a text message when testing with a threshold of `0`, then try visiting the [Troubleshooting](#troubleshooting) section of this guide for help.

1. After testing the code, you can revert the `USAGE_NOTIFICATION_THRESHOLD_RATIO` back to `.7`, or to another custom ratio. For example, if you only want to be notified if you use more than 85% of your transfer pool, set this number to `.85`.

## Set an Overage Threshold

The cron job now uses a threshold ratio and only sends a text message if you have used more than that ratio of your transfer pool. You may also want to know if you have used more than 100% of your pool, and what your overage cost is. This can be achieved by altering the script:

1. In your `transfer-pool-notification-twilio.py`, remove lines 38-52:

    {{< file "transfer-pool-notification-twilio.py">}}
# remove the following lines:

# if pool_used_ratio > USAGE_NOTIFICATION_THRESHOLD_RATIO:
#     summary_text = "You have used more than %s%% of your Linode account's network transfer pool" % \
#         (USAGE_NOTIFICATION_THRESHOLD_RATIO * 100)
#
#     transfer_statistics_text = 'Used: %sGB\n' \
#         'Transfer pool size: %sGB\n' \
#         'Percent of pool used: %s%%\n\n' \
#         'https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/' % \
#         (account_network_transfer.used,
#         account_network_transfer.quota,
#         round(pool_used_ratio * 100, 4))
#
#     message_text = ('%s:\n\n%s' % (summary_text, transfer_statistics_text))
#
#     send_message(message_text)
{{< /file >}}

1. Then, copy and paste these new lines of code to the file:

    {{< file "transfer-pool-notification-twilio.py">}}
# copy and paste to bottom of file:

OVERAGE_NOTIFICATION_THRESHOLD_RATIO = 1
BILLABLE_TRANSFER_COST_PER_GB = .01

if pool_used_ratio > OVERAGE_NOTIFICATION_THRESHOLD_RATIO:
    summary_text = "WARNING: You have used more than %s%% of your Linode account's network transfer pool" % \
        (OVERAGE_NOTIFICATION_THRESHOLD_RATIO * 100)

    transfer_statistics_text = 'Used: %sGB\n' \
        'Transfer pool size: %sGB\n' \
        'Percent of pool used: %s%%\n' \
        'Overage amount: %sGB\n' \
        'Overage amount cost: $%s\n\n' \
        'https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/' % \
        (account_network_transfer.used,
        account_network_transfer.quota,
        round(pool_used_ratio * 100, 4),
        account_network_transfer.billable,
        account_network_transfer.billable * BILLABLE_TRANSFER_COST_PER_GB)

    message_text = ('%s:\n\n%s' % (summary_text, transfer_statistics_text))

    send_message(message_text)

elif pool_used_ratio > USAGE_NOTIFICATION_THRESHOLD_RATIO:
    summary_text = "You have used more than %s%% of your Linode account's network transfer pool" % \
        (USAGE_NOTIFICATION_THRESHOLD_RATIO * 100)

    transfer_statistics_text = 'Used: %sGB\n' \
        'Transfer pool size: %sGB\n' \
        'Percent of pool used: %s%%\n\n' \
        'https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/' % \
        (account_network_transfer.used,
        account_network_transfer.quota,
        round(pool_used_ratio * 100, 4))

    message_text = ('%s:\n\n%s' % (summary_text, transfer_statistics_text))

    send_message(message_text)
{{< /file >}}

    {{< disclosure-note "About the code" >}}
- Line 3 defines a new overage notification threshold ratio and sets it to `1` (representing 100% of your transfer pool size).

- Line 4 defines a variable to store the cost of network transfer overage, which is [$.01 per GB](/docs/products/platform/get-started/guides/network-transfer/#usage-costs).

- On line 6, the computed `pool_used_ratio` is compared with the overage threshold ratio number.

- If it is greater, then a different text message is prepared and sent in lines 6-24.

- Line 7: the summary text is now prepended with `WARNING: `, to add extra emphasis for the message.

- The transfer statistics text now includes the overage amount of your network transfer (line 13), which is stored in the `billable` property of the network transfer API object (line 19). The overage fee is also included in the message (line 14). It is computed by multiplying the `billable` property with the overage cost per GB (line 20).

- Lines 26-40 contain the same case as the code from the previous [Set a Notification Threshold](#set-a-notification-threshold) section. If you have not used more than 100% of your transfer, then a notice is still sent if you have used more than the original notification threshold.
{{< /disclosure-note >}}

1. After appending the above snippet, save the file.

    {{< note respectIndent=false >}}
The updated code for this section is now complete. Your script should now look like the code in [this file](transfer-pool-notification-with-overage-threshold-twilio.py).
{{< /note >}}

1. The updated script is automatically run the next time your cron job is scheduled. If your account has used more network transfer than 100% of your transfer pool, then a text message is sent. The message should be similar to:

    {{< output >}}
Sent from your Twilio trial account - WARNING: You have used more than 0% of your Linode account's network transfer pool:

Used: 1500GB
Transfer pool size: 1000GB
Percent of pool used: 150.0%
Overage amount: 500GB
Overage amount cost: $5.0

https://www.linode.com/docs/products/platform/get-started/guides/network-transfer/
{{< /output >}}

1. Your account may not have used more than 100% of your network transfer pool. If you want to test the new code to make sure it works, you could temporarily change the value of the `OVERAGE_NOTIFICATION_THRESHOLD_RATIO` variable in the script to a lower number.

    For example, if you set `OVERAGE_NOTIFICATION_THRESHOLD_RATIO = 0` in your code, then the first if statement is always true. This means that a text message is always sent when the script runs.

    {{< note respectIndent=false >}}
When testing, it can also be helpful to change the cron job schedule to run every minute, which is described in the [Adjusting the Scheduled Notification Time](#optional-adjusting-the-scheduled-notification-time) section.
{{< /note >}}

    If you do not receive a text message when testing with an overage threshold of `0`, then try visiting the [Troubleshooting](#troubleshooting) section of this guide for help.

1. After testing the code, you can revert the `OVERAGE_NOTIFICATION_THRESHOLD_RATIO` back to `1`.

## Troubleshooting

Several troubleshooting scenarios are outlined in the [Troubleshooting](/docs/guides/how-to-use-the-linode-api-with-twilio/#troubleshooting) section of the [How to Use the Linode API with Twilio](/docs/guides/how-to-use-the-linode-api-with-twilio/) guide. Review that section for possible solutions.

As well, the following possible solution may help:

### Incorrect File Path for Script in Crontab

If you can [manually run the script](#run-the-code), but it does not run from your cron job, then the wrong script filepath may be set in your crontab.

1.  In your SSH session, navigate to the directory that you have stored your `transfer-pool-notification-twilio.py` script in.

1.  Get the absolute path of your directory:

        pwd

    The output of the `pwd` command shows the directory:

    {{< output >}}
/home/exampleuser/
{{< /output >}}

1.  Look at your current crontab file:

        crontab -l

1.  In the output from the previous command, find the line for your notification script. This should look like  `0 14 * * * python3 /home/exampleuser/transfer-pool-notification-twilio.py`.

1.  If the directory on this line is different from the directory of the script on your system, then you need to update the line in your crontab. Open the crontab editor:

        crontab -e

1.  Update the line that calls your script with the correct directory, then save the crontab file in your text editor.
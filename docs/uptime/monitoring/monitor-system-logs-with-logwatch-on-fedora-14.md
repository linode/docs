---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use Logwatch to monitor system logs and generate reports.'
keywords: ["logwatch", "security", "logging", "audit"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['server-monitoring/logwatch/fedora-14/']
modified: 2013-10-01
modified_by:
  name: Linode
published: 2011-04-05
title: Monitor System Logs with Logwatch on Fedora 14
---



Logwatch is a utility used to monitor system logs and create reports. These reports include failed login attempts, successful login attempts, and storage space used/available.

Before installing Logwatch, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Update System Packages

You will need to make sure that your system and installed packages are up to date by issuing the following command:

    yum update

Once this has completed, you are ready to install Logwatch.

# Install Logwatch

Issue the following command to install Logwatch:

    yum install logwatch

Logwatch requires a mail transport agent (MTA) to send its reports. Logwatch will automatically use an already installed MTA, such as [postfix](/docs/email/postfix/) or [exim](/docs/email/exim/). If you do not have MTA installed, issue the following command to install exim:

    yum install exim

# Configure Logwatch

Once you have installed Logwatch, you will need to configure it to email you the reports it generates. You are encouraged to look through the entire configuration, but you may safely use Logwatch after editing the lines below.

{{< file "/usr/share/logwatch/default.conf/logwatch.conf" ini >}}
MailTo = myemail@mydomain.com
MailFrom = logwatch@mydomain.com

{{< /file >}}


The `MailTo` and `MailFrom` directives should be valid email addresses.

Issue the following command to test your Logwatch installation:

    logwatch

Once you have issued this command, you will need to check your email to make sure that Logwatch is working. Be sure to check your spam folder as these emails may be seen as spam.

# Adding a Cron Job for Logwatch

You can add a cron job for Logwatch in order to receive daily emails of new reports. You can add a new entry to your crontab by running `crontab -e`. The following example cron job runs Logwatch at 1 AM each day, issuing you an email report of the daily activity:

    # m h dom mon dow   command
    0 1  * * *          /usr/sbin/logwatch

Congratulations! You can now monitor system logs with Logwatch!




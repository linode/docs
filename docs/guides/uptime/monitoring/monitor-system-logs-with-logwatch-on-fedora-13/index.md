---
slug: monitor-system-logs-with-logwatch-on-fedora-13
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will show you how to use the logwatch utility to monitor system logs, generate reports, and monitor failed login attempts, and more on Fedora 13.'
keywords: ["logwatch", "security", "logging", "audit"]
tags: ["monitoring","fedora"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/uptime/monitoring/monitor-system-logs-with-logwatch-on-fedora-13/','/server-monitoring/logwatch/fedora-13/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2010-10-25
title: Monitor System Logs with Logwatch on Fedora 13
relations:
    platform:
        key: install-logwatch-monitoring
        keywords:
            - distribution: Fedora 13
---



Logwatch is a utility used to monitor system logs and create reports. These reports include failed login attempts, successful login attempts, and storage space used/available.

Before installing Logwatch, it is assumed that you have followed our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/guides/introduction-to-linux-concepts/), [beginner's guide](/docs/guides/linode-beginners-guide/) and [administration basics guide](/docs/guides/linux-system-administration-basics/).

## Update System Packages

You will need to make sure that your system and installed packages are up to date by issuing the following command:

    yum update

Once this has completed, you are ready to install Logwatch.

## Install Logwatch

Issue the following command to install Logwatch:

    yum install logwatch

## Configure Logwatch

Once you have installed Logwatch, you will need to configure it to email you the reports it generates. You are encouraged to look through the entire configuration, but you may safely use Logwatch after editing the lines below.

{{< file "/usr/share/logwatch/default.conf/logwatch.conf" ini >}}
MailTo = myemail@mydomain.com
MailFrom = logwatch@mydomain.com

{{< /file >}}


The `MailTo` and `MailFrom` directives should be valid email addresses.

Issue the following command to test your logwatch installation:

    logwatch

Once you have issued this command, you will need to check your email to make sure that logwatch is working. Be sure to check your spam folder as these emails may be seen as spam.

## Adding a Cron Job for Logwatch

You can add a cron job for Logwatch in order to receive daily emails of new reports. You can add a new entry to your crontab by running `crontab -e`. The following example cron job runs Logwatch at 1 AM each day, issuing you an email report of the daily activity:

    # m h dom mon dow   command
    0 1  * * *          /usr/sbin/logwatch

Congratulations! You can now monitor system logs with Logwatch!




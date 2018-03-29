---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Configuring Exim to serve as a lightweight, send-only SMTP server on Ubuntu 10.04 LTS (Lucid).'
keywords: ["exim", "exim ubuntu 10.04", "send email ubuntu", "mail server", "linux mail", "smtp server", "ubuntu exim"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/exim/send-only-mta-ubuntu-10-04-lucid/']
modified: 2013-09-26
modified_by:
  name: Linode
published: 2010-05-03
title: 'Send-only Mail Server with Exim on Ubuntu 10.04 LTS (Lucid)'
---



Many Linux server applications need to send email; cron jobs use mail services to deliver reports on jobs that have run, web applications require mail support for user registration functions, and other applications may need to send alerts via SMTP. This guide will help you install and configure the lightweight Exim MTA (Mail Transfer Agent) on your Ubuntu 10.04 LTS (Lucid) Linode.

You'll gain the ability to send mail from `localhost` through either a traditional "sendmail" style interface, or via port 25 locally. As this guide is not intended to provide a full send/receive mail solution, please refer to our other [email guides](/docs/email/) for ways to implement such configurations.

We assume that you've already followed the steps outlined in our [getting started](/docs/getting-started/) guide. If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/platform/linode-beginners-guide/) and [administration basics guide](/docs/tools-reference/linux-system-administration-basics/). Make sure you're logged into your Linode as "root" via SSH before proceeding.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started/#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

# Install Required Packages

Make sure you have the "universe" repositories enabled. Your `/etc/apt/sources.list` file should resemble this:

{{< file "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ lucid main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ lucid main restricted

deb http://security.ubuntu.com/ubuntu lucid-security main restricted
deb-src http://security.ubuntu.com/ubuntu lucid-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ lucid universe
deb-src http://us.archive.ubuntu.com/ubuntu/ lucid universe
deb http://us.archive.ubuntu.com/ubuntu/ lucid-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ lucid-updates universe

deb http://security.ubuntu.com/ubuntu lucid-security universe
deb-src http://security.ubuntu.com/ubuntu lucid-security universe

{{< /file >}}


Issue the following commands to update your package repositories, upgrade your system, and install Exim:

    apt-get update
    apt-get upgrade
    apt-get install exim4-daemon-light mailutils

# Configure Exim for Local Mail Service

Issue the following command to start Exim configuration:

    dpkg-reconfigure exim4-config

You'll be presented with a welcome screen, followed by a screen asking what type mail delivery you'd like to support. Choose the option for "internet site" and select "Ok" to continue.

[![Exim4 mail delivery type configuration on Ubuntu 10.04 LTS (Lucid).](/docs/assets/134-01-exim4-ubuntu-10-04-general.png)](/docs/assets/134-01-exim4-ubuntu-10-04-general.png)

Enter your system's FQDN (fully qualified domain name) in the "mail name" configuration screen.

[![Exim4 system mail name configuration on Ubuntu 10.04 LTS (Lucid).](/docs/assets/135-02-exim4-ubuntu-10-04-mail-name.png)](/docs/assets/135-02-exim4-ubuntu-10-04-mail-name.png)

Enter "127.0.0.1" when asked which IP address to listen on for SMTP connections.

[![Exim4 listening IP address configuration on Ubuntu 10.04 LTS (Lucid).](/docs/assets/136-03-exim4-ubuntu-10-04-ip-listen.png)](/docs/assets/136-03-exim4-ubuntu-10-04-ip-listen.png)

Make sure you list your FQDN, hostname, and localhost entries when you're asked which destinations mail should be accepted for.

[![Exim4 mail destination configuration on Ubuntu 10.04 LTS (Lucid).](/docs/assets/137-04-exim4-ubuntu-10-04-local-domains.png)](/docs/assets/137-04-exim4-ubuntu-10-04-local-domains.png)

Leave the relay domains and relay machines fields blank.

[![Exim4 relay domains configuration on Ubuntu 10.04 LTS (Lucid).](/docs/assets/138-05-exim4-ubuntu-10-04-relay-domains.png)](/docs/assets/138-05-exim4-ubuntu-10-04-relay-domains.png)

Select "No" when asked whether to keep DNS queries to a minimum.

[![Exim4 DNS queries configuration on Ubuntu 10.04 LTS (Lucid).](/docs/assets/140-07-exim4-ubuntu-10-04-dns-queries.png)](/docs/assets/140-07-exim4-ubuntu-10-04-dns-queries.png)

You may select either "mbox" or "Maildir" when asked about the delivery method used for incoming mail. While many utilities use mbox format, Maildir format can make handling individual locally delivered mail messages easier, and is widely supporting by a range of applications.

[![Exim4 mail format configuration on Ubuntu 10.04 LTS (Lucid).](/docs/assets/141-08-exim4-ubuntu-10-04-mail-format.png)](/docs/assets/141-08-exim4-ubuntu-10-04-mail-format.png)

Accept the default "non-split" option for your mail configuration file. Enter at least one external email address (choose one that you check frequently) in addition to "root" when asked to specify postmaster mail recipients.

[![Exim4 postmaster recipient configuration on Ubuntu 10.04 LTS (Lucid).](/docs/assets/142-10-exim4-ubuntu-10-04-postmater-mail.png)](/docs/assets/142-10-exim4-ubuntu-10-04-postmater-mail.png)

# Test Your Mail Configuration

Issue the following command to send a test email, substituting an external email address for `someone@somedomain.com`.

    echo "This is a test." | mail -s Testing someone@somedomain.com

Congratulations! You've configured Exim to send email from your Linode.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Exim Homepage](http://www.exim.org/)
- [Email Guides](/docs/email/)




---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Configuring Exim to serve as a lightweight, send-only SMTP server on Ubuntu 11.04 (Natty).'
keywords: ["exim ubuntu 11.04", "exim", "send email ubuntu", "mail server", "linux mail", "smtp server", "ubuntu exim"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/exim/send-only-mta-ubuntu-11-04-natty/']
modified: 2013-02-18
modified_by:
  name: Linode
published: 2011-06-14
title: 'Send-only Mail Server with Exim on Ubuntu 11.04 (Natty)'
---



Many Linux server applications need to send email; cron jobs use mail services to deliver reports on jobs that have run, web applications require mail support for user registration functions, and other applications may need to send alerts via SMTP. This guide will help you install and configure the lightweight Exim MTA (Mail Transfer Agent) on your Ubuntu 11.04 (Natty) Linode.

You'll gain the ability to send mail from `localhost` through either a traditional "sendmail" style interface, or via port 25 locally. As this guide is not intended to provide a full send/receive mail solution, please refer to our other [email guides](/docs/email/) for ways to implement such configurations.

It is assumed that you've already followed the steps outlined in our [getting started](/docs/getting-started/) guide. If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). Make sure you're logged into your Linode as "root" via SSH before proceeding.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

# Configure Exim for Local Mail Service

Issue the following commands to update your package repositories, upgrade your system, and install Exim:

    apt-get update
    apt-get upgrade
    apt-get install exim4-daemon-light mailutils

Issue the following command to start Exim configuration:

    dpkg-reconfigure exim4-config

You'll be presented with a welcome screen, followed by a screen asking what type mail delivery you'd like to support. Choose the option for "internet site" and select "Ok" to continue.

[![Exim4 mail delivery type configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/754-01-exim4-ubuntu-11.04-general.png)](/docs/assets/754-01-exim4-ubuntu-11.04-general.png)

Enter your system's FQDN (fully qualified domain name) in the "mail name" configuration screen.

[![Exim4 system mail name configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/762-02-exim4-ubuntu-11.04-mail-name.png)](/docs/assets/762-02-exim4-ubuntu-11.04-mail-name.png)

Enter "127.0.0.1" when asked which IP address to listen on for SMTP connections.

[![Exim4 listening IP address configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/755-03-exim4-ubuntu-11.04-ip-listen.png)](/docs/assets/755-03-exim4-ubuntu-11.04-ip-listen.png)

Make sure you list your FQDN, hostname, and localhost entries when you're asked which destinations mail should be accepted for.

[![Exim4 mail destination configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/756-04-exim4-ubuntu-11.04-local-domains.png)](/docs/assets/756-04-exim4-ubuntu-11.04-local-domains.png)

Leave the relay domains and relay machines fields blank.

[![Exim4 relay domains configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/757-05-exim4-ubuntu-11.04-relay-domains.png)](/docs/assets/757-05-exim4-ubuntu-11.04-relay-domains.png)

[![Exim4 relay machines configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/758-06-exim4-ubuntu-11.04-relay-machines.png)](/docs/assets/758-06-exim4-ubuntu-11.04-relay-machines.png)

Select "No" when asked whether to keep DNS queries to a minimum.

[![Exim4 DNS queries configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/759-07-exim4-ubuntu-11.04-dns-queries.png)](/docs/assets/759-07-exim4-ubuntu-11.04-dns-queries.png)

You may select either "mbox" or "Maildir" when asked about the delivery method used for incoming mail. While many utilities use mbox format, Maildir format can make handling individual locally delivered mail messages easier, and is widely supporting by a range of applications.

[![Exim4 mail format configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/760-08-exim4-ubuntu-11.04-mail-format.png)](/docs/assets/760-08-exim4-ubuntu-11.04-mail-format.png)

Accept the default "non-split" option for your mail configuration file.

[![Exim4 mail configuration file specification on Ubuntu 11.04 LTS (Lucid).](/docs/assets/760-08-exim4-ubuntu-11.04-mail-format.png)](/docs/assets/760-08-exim4-ubuntu-11.04-mail-format.png)

Enter at least one external email address (choose one that you check frequently) in addition to "root" when asked to specify postmaster mail recipients.

[![Exim4 postmaster recipient configuration on Ubuntu 11.04 LTS (Lucid).](/docs/assets/761-10-exim4-ubuntu-11.04-postmater-mail.png)](/docs/assets/761-10-exim4-ubuntu-11.04-postmater-mail.png)

# Test Your Mail Configuration

Issue the following command to send a test email, substituting an external email address for `someone@example.com`.

    echo "This is a test." | mail -s Testing someone@example.com

Congratulations! You've configured Exim to send email from your Linode.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Exim Homepage](http://www.exim.org/)
- [Email Guides](/docs/email/)




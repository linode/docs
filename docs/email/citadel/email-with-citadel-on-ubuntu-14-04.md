---
deprecated: false
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up an email and groupware server using Citadel on an Ubuntu 14.04 LTS (Truly Tahr) Linode.'
keywords: ["citadel", "citadel ubuntu 14.04", "ubuntu 14.04 mail server", "groupware", "email server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2014-09-20
modified_by:
  name: Linode
published: 2012-11-05
title: 'Email with Citadel on Ubuntu 14.04 LTS (Truly Tahr)'
external_resources:
 - '[Citadel Home Page](http://www.citadel.org/doku.php)'
 - '[Citadel FAQ](http://www.citadel.org/doku.php?id=faq:start)'
 - '[Citadel Documentation](http://www.citadel.org/doku.php?id=documentation:start)'
 - '[Spamassassin Home Page](http://spamassassin.apache.org/)'
 - '[Spamassassin Wiki](http://wiki.apache.org/spamassassin/)'
 - '[Spamassassin Documentation](http://spamassassin.apache.org/doc.html)'
---

Citadel is a groupware suite that provides system administrators with an easy method to set up and manage email, calendars, mailing lists and other collaboration tools. It also features an automated installation process and versatile deployment options that allow the application to be scaled across multiple servers.

{{< caution >}}
There is a known bug that prevents Citadel from running properly on 32-bit Linodes. Please see [the Ubuntu bugtracker](https://bugs.launchpad.net/ubuntu/+source/citadel/+bug/911732) for more information.
{{< /caution >}}

## Prerequisites

Before installing Citadel, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

This guide also assumes that you wish to run Citadel by itself on this server on port 80 or 443 for browser-based access.

{{< note >}}
If you intend to install Citadel alongside another web server package such as Apache or nginx, select the "internal" option when asked about web server integration. Be sure to specify unique ports for Citadel such as 8080 for HTTP or 4343 for HTTPS.
{{< /note >}}

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Installing Citadel

Issue the following commands to install any outstanding package updates:

    apt-get update
    apt-get upgrade

Issue the following commands to install the `citadel-suite`, `spamassassin` and `amavisd-new` packages:

    apt-get install citadel-suite spamassassin amavisd-new

The installation process will prompt you to answer a couple of questions. Use the answers provided below:

-   Enter `0.0.0.0` for listen address
-   Select `Internal` for authentication method
-   Specify your admin `<username>`
-   Enter an admin `<password>`
-   Select `Internal` for web server integration
-   Enter `80` for Webcit HTTP port
-   Enter `443` for the Webcit HTTPS port (or enter -1 to disable it)
-   Select your desired language

If you need to reconfigure these options later, you can use the following command:

    dpkg-reconfigure citadel-server

To edit the ports later, you will need to edit the file `/etc/default/webcit`.

## Enabling Spamassassin Filtering

Edit the `/etc/mailname` file to reflect your system's domain name:

{{< file "/etc/mailname" >}}
name.example.com

{{< /file >}}


You'll need to edit the SpamAssassin configuration file to enable spamd:

{{< file "/etc/default/spamassassin" >}}
# Change to one to enable spamd
ENABLED=1

{{< /file >}}

Start the spamassassin service as follows:

    service spamassassin start

Please note that you'll finish enabling SpamAssassin support within Citadel later in the "Notes" section.

## Running Citadel

Customize the login banner for your Citadel server by editing the relevant file:

{{< file "/etc/citadel/messages/hello" >}}
Citadel Groupware Server Login

{{< /file >}}

Use the following startup script to initialize Citadel.

    service citadel restart

Visit the web interface in your Web browser. Using our preceding example, the Web address to visit would look like:

    https://name.example.com

The SSL certificate for your Citadel web interface will be self-signed; accept it to continue. If you don't get a login page in your web browser, you may need to start "webcit" with the following command:

    webcit -d

## Notes for Running Citadel

At this point, your email system should be fully functional and can be configured through the Webcit interface. When you log in for the first time as "Administrator", you will not need a password. However, it is recommended that you set a password as soon as possible under the "Advanced" tab.

To finish enabling SpamAssassin support, select "Administration" in the control panel. Next, click "Domain names and Internet mail configuration". Enter "127.0.0.1" in the box for the SpamAssassin host.

## Lost Password Recovery

If you lose the password to your administrator account, re-run the setup as follows:

    dpkg-reconfigure citadel-server

Specify a different name for the admin user and restart Citadel as follows:

    service citadel restart

You should be able to log in as the new admin user with no password. You may then reset the password for your original administrator account. After this is done, log back in as the original administrator and delete the temporary admin account.

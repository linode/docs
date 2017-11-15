---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up an email and groupware server using Citadel on a Debian 5 (Lenny) Linode.'
keywords: ["citadel", "debian mail server", "groupware", "email server", "email howto"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/citadel/debian-5-lenny/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2009-11-09
title: 'Email with Citadel on Debian 5 (Lenny)'
---



Citadel is a groupware suite that provides system administrators with an easy method to set up and manage email, calendars, mailing lists and other collaboration tools. It also features an automated installation process and versatile deployment options that allow the application to be scaled across multiple servers.

Before installing Citadel, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

This guide also assumes that you wish to run Citadel by itself on this server on port 80 or 443 for browser-based access. **Please note:** If you intend to install Citadel alongside another web server package such as Apache or nginx, select the "internal" option when asked about web server integration. Be sure to specify unique ports for Citadel such as 8080 for HTTP or 4343 for HTTPS.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#sph_set-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Installing Citadel

Issue the following commands to install any outstanding package updates:

    apt-get update
    apt-get upgrade

Issue the following commands to install the `citadel-suite`, `spamassassin` and `amavisd-new` packages:

    apt-get install citadel-suite spamassassin amavisd-new

The installation process will prompt you to answer a couple of questions. Choose "Internal" for web server integration and enter "80" when asked the "Webcit HTTP port" question. If you need to reconfigure any of these options later, you can use the following command:

    dpkg-reconfigure citadel-server

# Enabling Spamassassin Filtering

Edit the `/etc/mailname` file to reflect your system's domain name:

{{< file "/etc/mailname" >}}
username.example.com

{{< /file >}}


You'll need to edit the SpamAssassin configuration file to enable spamd:

{{< file "/etc/default/spamassassin" >}}
# Change to one to enable spamd
ENABLED=1

{{< /file >}}


Start the spamassassin service as follows:

    /etc/init.d/spamassassin start

Please note that you'll finish enabling SpamAssassin support within Citadel later in the "Notes" section.

# Running Citadel

Customize the logon banner for your Citadel server by editing the relevant file:

{{< file "/usr/share/citadel-server/messages/hello" >}}
Citadel Groupware Server Login

{{< /file >}}


Use the following startup script to initialize Citadel.

    /etc/init.d/citadel restart

Visit the web interface in your Web browser. Using our preceding example, the Web address to visit would look like:

    https://username.example.com

The SSL certificate for your Citadel web interface will be self-signed; accept it to continue. If you don't get a login page in your web browser, you may need to start "webcit" with the following command:

    webcit -d

# Notes for Running Citadel

At this point, your email system should be fully functional and can be configured through the Webcit interface. When you log in for the first time as "Administrator", you will not need a password. However, it is recommended that you set a password as soon as possible under the "Advanced" tab.

To finish enabling SpamAssassin support, select "Administration" in the control panel. Next, click "Domain names and Internet mail configuration". Enter "127.0.0.1" in the box for the SpamAssassin host.

# Lost Password Recovery

If you lose the password to your administrator account, re-run the setup as follows:

    dpkg-reconfigure citadel-server

Specify a different name for the admin user and restart Citadel as follows:

    /etc/init.d/citadel restart

You should be able to log in as the new admin user with no password. You may then reset the password for your original administrator account. After this is done, log back in as the original administrator and delete the temporary admin account.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Citadel Home Page](http://www.citadel.org/doku.php)
- [Citadel FAQ](http://www.citadel.org/doku.php?id=faq:start)
- [Citadel Documentation](http://www.citadel.org/doku.php?id=documentation:start)
- [Spamassassin Home Page](http://spamassassin.apache.org/)
- [Spamassassin Wiki](http://wiki.apache.org/spamassassin/)
- [Spamassassin Documentation](http://spamassassin.apache.org/doc.html)




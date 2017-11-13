---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use the GNU Mailman software to manage email listservs.'
keywords: ["mailman", "listserv", "email", "postfix"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/mailman/debian-6-squeeze/']
modified: 2011-05-23
modified_by:
  name: Linode
published: 2011-04-05
title: 'Manage Email Lists with GNU Mailman on Debian 6 (Squeeze)'
---

GNU Mailman is a commonly used Listserv Management application that allows users to create and manage discussion and announcement email lists. Mailman includes support for numerous features including a web-based administrative interface, multiple domains, lists, and complex moderation and access control tools. The Mailman software is primarily written in the Python programing language and has been a popular choice for managing email lists for more than a decade.

Be sure to review this guide in its entirety before beginning the procedure outlined below. If you have an existing mail system configured before you begin this, take special care to ensure that installing Mailman will not conflict with delivery of existing mail.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

# Installing Mailman

Before proceeding with the installation of Mailman, make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Mailman can be configured to use a number of different mail transfer agents. We recommend using the postfix MTA, though mailman will work with whatever MTA you have installed. If you do not have any MTA installed, issue the following command to install postfix:

    apt-get install postfix

During the postfix installation, you will want to select "**Internet Site**" as the "General type of mail configuration." You will also want to set the host or domain name for your server as the system name, (e.g. `example.com` or similar.) Now install Mailman with the following command:

    apt-get install mailman

During the Mailman installation, you will be required to specify the languages that you wish your Mailman instance support. Select all required languages before continuing. The installation process will also provide a note regarding the next step of the installation process, which you can accept and allow the installation process to continue.

# Configure Mailman

Consider the "[Configure Virtual Hosting](/docs/email/mailman/manage-email-lists-with-gnu-mailman-on-debian-6-squeeze#configure-virtual-hosting)" section before preceding. In most cases where you will be hosting you will want to skip this section and continue with that procedure. Mailman requires a "base" list, from which it can send email to welcome new members to lists and send password reminders when needed. Create this list by issuing the following command:

    newlist mailman

During the list creation process, Mailman will prompt you for the administrators email address and an initial mailman password. Mailman will then produce the following output that you will want to include in your `/etc/aliases` file.

{{< file-excerpt "/etc/aliases" >}}
\#\# mailman mailing list mailman: "|/var/lib/mailman/mail/mailman post mailman" mailman-admin: "|/var/lib/mailman/mail/mailman admin mailman" mailman-bounces: "|/var/lib/mailman/mail/mailman bounces mailman" mailman-confirm: "|/var/lib/mailman/mail/mailman confirm mailman" mailman-join: "|/var/lib/mailman/mail/mailman join mailman" mailman-leave: "|/var/lib/mailman/mail/mailman leave mailman" mailman-owner: "|/var/lib/mailman/mail/mailman owner mailman" mailman-request: "|/var/lib/mailman/mail/mailman request mailman" mailman-subscribe: "|/var/lib/mailman/mail/mailman subscribe mailman" mailman-unsubscribe: "|/var/lib/mailman/mail/mailman unsubscribe mailman"
{{< /file-excerpt >}}


Replace `example.com` and `lists.example.com` with the relevant domains for your instance. Ensure that you have configured the [MX Records](/docs/dns-guides/introduction-to-dns#mx) for both domains that you want to receive email with. Additionally, add the following lines to your `/etc/postfix/master.cf` file:

{{< file-excerpt "/etc/postfix/master.cf" >}}
mailman unix  -       n       n       -       -       pipe
  flags=FR user=list
  argv=/var/lib/mailman/bin/postfix-to-mailman.py ${nexthop} ${mailbox}

{{< /file-excerpt >}}


These lines enable postfix to hand off email to Mailman for processing directly. Add the following line to the `/etc/postfix/transport` file, modifying `lists.example.com` as needed.

{{< file-excerpt "/etc/postfix/transport" >}}
lists.example.com   mailman:

# Configure Virtual Hosting


Finally, modify the `/etc/mailman/mm_cfg.py` file to set the following values. After you've edited the `/etc/postfix/transport` file, and after every successive edit of this file, issue the following command to rebuild postfix's transport database:

{{< file-excerpt "/etc/aliases" >}}
relay_domains = $mydestination, lists.example.com
relay_recipient_maps = hash:/var/lib/mailman/data/virtual-mailman
transport_maps = hash:/etc/postfix/transport
mailman_destination_recipient_limit = 1
{{< /file-excerpt >}}

This controls how Mailman processes the mail that it receives from postfix. Continue configuring Mailman by editing following file to update Mailman to interact properly with postfix:

{{< file-excerpt "/etc/postfix/master.cf" >}}
mailman unix  -       n       n       -       -       pipe
  flags=FR user=list
  argv=/var/lib/mailman/bin/postfix-to-mailman.py ${nexthop} ${mailbox}

{{< /file-excerpt >}}


{{< /file-excerpt >}}

{{< file-excerpt "/etc/postfix/transport" >}}
lists.example.com   mailman:

{{< /file-excerpt >}}

Ensure that the fields `DEFAULT_EMAIL_HOST` and `DEFAULT_URL_HOST` match the sub-domain you are using for lists (e.g. `lists.example.com`,) as follows:

{{< file-excerpt "/etc/mailman/mm\\_cfg.py" >}}
#-------------------------------------------------------------
# Default domain for email addresses of newly created MLs
DEFAULT_EMAIL_HOST = 'lists.example.com'
#-------------------------------------------------------------
# Default host for web interface of newly created MLs
DEFAULT_URL_HOST   = 'lists.example.com'
#-------------------------------------------------------------
# Required when setting any of its arguments.
add_virtualhost(DEFAULT_URL_HOST, DEFAULT_EMAIL_HOST)

{{< /file-excerpt >}}

{{< file-excerpt "/etc/mailman/mm\\_cfg.py" >}}
MTA = 'Postfix'
POSTFIX_STYLE_VIRTUAL_DOMAINS = ['lists.example.com']
# alias for postmaster, abuse and mailer-daemon
DEB_LISTMASTER = 'postmaster@example.com'

{{< /file-excerpt >}}


If you need to configure additional domains for use, ensure that you've made the proper additions to the `relay_domains` field in the `main.cf` file and `/etc/postfix/transport` file. Append an item to the `POSTFIX_STYLE_VIRTUAL_DOMAINS` line and create additional `add_virtualhost` calls in the following form for every new domain:

{{< file-excerpt "/etc/mailman/mm\\_cfg.py" >}}
#-------------------------------------------------------------
# Default domain for email addresses of newly created MLs
DEFAULT_EMAIL_HOST = 'lists.example.com'
#-------------------------------------------------------------
# Default host for web interface of newly created MLs
DEFAULT_URL_HOST   = 'lists.example.com'
#-------------------------------------------------------------
# Required when setting any of its arguments.
add_virtualhost(DEFAULT_URL_HOST, DEFAULT_EMAIL_HOST)

{{< /file-excerpt >}}


# Modify the following line, if it exists
POSTFIX_STYLE_VIRTUAL_DOMAINS = ['lists.example.com', 'lists.example.org']

{{< file-excerpt "/etc/mailman/mm\\_cfg.py" >}}
add_virtualhost('lists.example.org', 'lists.example.org')

# Modify the following line, if it exists
POSTFIX_STYLE_VIRTUAL_DOMAINS = ['lists.example.com', 'lists.example.org']

{{< /file-excerpt >}}


Ensure that your domains have valid MX and [A Records](/docs/dns-guides/introduction-to-dns#types-of-dns-records) that point to your Linode. When you've finished configuring Mailman, issue the following commands to create the default list (which will prompt you to enter an address for the list administrator and a password), restart postfix, and start Mailman for the first time:

    newlist mailman
    /etc/init.d/postfix restart
    /etc/init.d/mailman start

If you created lists using the `/etc/aliases` method, you will have to recreate those lists by issuing the following commands.:

    /var/lib/mailman/bin/genaliases
    postmap /var/lib/mailman/data/virtual-mailman

From this point forward, you can create new lists by issuing `newlist` commands as root. Additionally, all administration and functions of the Mailman lists can be accomplished by way of the web based interface.

# Configuring Mailman with Alternate Mail Configurations

If you wish to deploy Mailman on a system that has an existing mail set up, such as the [Postfix with Dovecot and MySQL](/docs/email/postfix/dovecot-mysql-debian-6-squeeze) or the [Postfix with Dovecot and System Users](/docs/email/postfix/dovecot-system-users-debian-6-squeeze) configurations described in other documents, consider the following recommendations:

Complete your basic mail configuration according to the appropriate guide before beginning to install and configure Mailman.

It is absolutely crucial that the `DEFAULT_EMAIL_HOST` and `DEFAULT_URL_HOST` are **not** served by your previously configured email system. Any additional domains served by mailman by way of the `add_virtualhost` function must also **not** overlap any domains served by another domain on this host. If these domains overlap there will be collisions, and neither system will function as expected.

In all other respects, as long as you deploy Mailman with virtual hosting on its own domain using Mailman with an existing email solution poses no complications. Congratulations, you now have a fully functional email list management solution!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Official GNU Mailman Site](http://www.gnu.org/software/mailman/index.html)
- [GNU Mailman Wiki](http://wiki.list.org/dashboard.action)
- [GNU Mailman Documentation](http://staff.imsa.edu/~ckolar/mailman/)




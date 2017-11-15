---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use system user accounts, postfix, and dovecot to provide'
keywords: ["postfix", "dovecot", "system users", "email"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/postfix/dovecot-system-users-ubuntu-10-04-lucid/']
modified: 2013-09-25
modified_by:
  name: Linode
published: 2010-11-09
expiryDate: 2015-09-25
title: 'Postfix, Dovecot, and System User Accounts on Ubuntu 10.04 (Lucid)'
deprecated: true
---



Postfix is a popular mail transfer agent or "MTA". This document will allow you to create a mail system using Postfix as the core component and aims to provide a simple email solution that uses system user accounts for authentication and mail delivery and Dovecot for remote mailbox access. If you do not need to authenticate to Postfix for SMTP service or use POP or IMAP to download email, you may consider using the [Basic Email Gateway with Postfix](/docs/email/postfix/gateway-ubuntu-10-04-lucid) document to install a more minimal email system. If you plan to host a larger number of domains and email aliases, you may want to consider a more sophisticated hosting solution like the [Email Server with Postfix, MySQL and Dovecot](/docs/email/postfix/dovecot-mysql-ubuntu-10-04-lucid/).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Software

Issue the following commands to install any outstanding package updates:

    apt-get update
    apt-get upgrade

Issue the following commands to install all required software:

    apt-get install libsasl2-2 libsasl2-modules sasl2-bin postfix
    apt-get install dovecot-postfix

During the installation process, the package manager will prompt you for the responses to a few questions to complete the Postfix installation. To the first question regarding the type of mail server you want to configure, select "Internet Site" and continue as in the following image:

[![Selecting the Postfix mail server configuration type on a Ubuntu 10.04 (Lucid) system.](/docs/assets/89-postfix-courier-mysql-02-mail-server-type-2.png)](/docs/assets/89-postfix-courier-mysql-02-mail-server-type-2.png)

The next prompt will ask for the system mail name. This should correspond to the fully qualified domain name (FQDN) that points to your Linode's IP address. In this example, we're using a machine specific hostname for our server. Set the reverse DNS for your Linode's IP address to the fully qualified domain name you assign as the system mail name. You will be able to send mail from additional domains as configured later in this document. See the following example:

[![Selecting the Postfix system mail name on a Ubuntu 10.04 (Lucid) system.](/docs/assets/90-postfix-courier-mysql-02-mail-server-type-3.png)](/docs/assets/90-postfix-courier-mysql-02-mail-server-type-3.png)

# SASL Authentication

Edit the `/etc/default/saslauthd` file to allow the SASL authentication daemon to start. Uncommon or add the following line:

{{< file-excerpt "/etc/default/saslauthd" >}}
START=yes
{{< /file-excerpt >}}

Create the `/etc/postfix/sasl/smtpd.conf` file, and insert the following line:

{{< file "/etc/postfix/sasl/smtpd.conf" >}}
pwcheck_method: saslauthd
{{< /file >}}

Issue the following command to start the SASL daemon for the first time:

    /etc/init.d/saslauthd start

# Configure SSL

SSL or TLS provides a method of encrypting the communication between your remote users and your mail servers. While this does not encrypt your email messages from end to end, it does ensure that your login credentials are transmitted securely and that communications are secure between your client machine and the email server.

Issue the following sequence of commands to install the prerequisites and [generate a self-signed SSL certificate](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate):

    apt-get install openssl
    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/ssl/certs/ssl-mail.pem -keyout /etc/ssl/private/ssl-mail.key

Be sure to generate a certificate with a "Common Name" that corresponds to the host name that your users will connect your mail server (e.g. `mail.example.com`).

Mail clients may have an issue with certificates generated in this manner because they are not signed by a recognized certificate authority. Consider our documentation for generating [commercial ssl certificates](/docs/security/ssl/obtaining-a-commercial-ssl-certificate) if you need a commercially verified certificate.

You can use any SSL certificate with Postfix. If you already have a commercial certificate or another SSL certificate for your web server, you can use these `.pem` and `.key` files.

# Postfix

At this point you should be able to send email using your Postfix instance by authenticating with SMTP. Authentication credentials are your [system user accounts](/docs/tools-reference/linux-users-and-groups/).

Consider the [basic email gateway guide](/docs/email/postfix/gateway-ubuntu-10-04-lucid) for more information regarding Postfix virtual hosting configuration. If you need to deliver mail locally, continue for documentation of mail routing and the Dovecot POP3/IMAP server.

### Configure Mail Delivery

The above Postfix configuration makes it possible to *send* mail using postfix. If your server receives email, Postfix requires additional configuration to deliver mail locally. Edit the `main.cf` file to insert or modify the following configuration directives:

{{< file-excerpt "/etc/postfix/main.cf" >}}
myhostname = lollipop.example.com
virtual_alias_maps = hash:/etc/postfix/virtual
home_mailbox = mail/
{{< /file-excerpt >}}

Issue the following command to ensure that new user accounts have a `~/mail` directory:

    mkdir /etc/skel/mail/

Every existing user that receives email will also need to make their own `Maildir`, by issuing the following command:

    mkdir ~/mail/

Create a `/etc/postfix/virtual` file to map incoming email addresses to their destinations. Consider the following example:

{{< file "/etc/postfix/virtual" >}}
<username@example.com> username <username@example.net> username <username@example.com> username

<fore@example.com> <foreman@example.com> <fore@example.net> <foreman@example.com> <fore@example.com> <foreman@example.com>

<team@example.com> username, <foreman@example.com> <team@example.net> username, <foreman@example.com> <team@example.com> username, <foreman@example.com>
{{< /file >}}

Here, all mail sent to the three addresses beginning with the characters `username@` are delivered to the local user "username" and deposited to a Maildir in the `/home/username/mail/` directory. The three addresses that begin with the characters `fore@` are delivered to the email address `foreman@example.com`. The final set of three email addresses beginning with `team@` are both delivered locally and sent to the `foreman@example.com` email address.

You can add additional lines in the same format as the above to control how all incoming email is delivered to local or external destinations. Remember that incoming email has no firm relationship to the name of the user account.

Edit the `/etc/alias` file to add the following line. This will to reroute all local mail delivered to the root user to another user account. In the following example, all mail delivered to `root` will be delivered to the `username` user's mail box.

{{< file-excerpt "/etc/aliases" >}}
root: username
{{< /file-excerpt >}}

When you have configured mail delivery issue the following command to recreate the aliases database, rebuild the virtual alias database, and restart the mail server:

    postalias /etc/alias

    postmap /etc/postfix/virtual /etc/init.d/postfix restart

# Dovecot

Dovecot is a contemporary POP3/IMAP server that makes it possible to access and download mail from your mail server remotely onto your local system.

### Configure Remote Mail Access

Edit the following configuration directive in the `/etc/dovecot/conf.d/01-dovecot-postfix.conf` file to select the services that Dovecot will provide.

{{< file-excerpt "/etc/dovecot/conf.d/01-dovecot-postfix.conf" >}}
protocols = imap imaps pop3 pop3s
{{< /file-excerpt >}}

The `protocols` directive enables `imap` and `pop3` services within Dovecot along with their SSL-encrypted alternatives. You may remove any of these services if you do not want Dovecot to provide `imap`, `pop3` or ssl services.

Edit the following directives in `/etc/dovecot/conf.d/01-dovecot-postfix.conf` to ensure that Dovecot can find your user's Maildirs:

{{< file-excerpt "/etc/dovecot/conf.d/01-dovecot-postfix.conf" >}}
mail_location = maildir:~/mail:LAYOUT=fs
{{< /file-excerpt >}}

Once configured, issue the following command to restart the Dovecot instance:

    /etc/init.d/dovecot restart

You may now access email by configuring a local email client to contact the server you have set up. Authentication credentials are the same as the system user accounts. These accounts can be configured outside of this document at any time.

# Organize Mail Services

This document describes a complete email system configuration. How you use and manage your system from this point forward is beyond the scope of this document. At the same time, we do encourage you to give some thought to the organization of your user accounts and email delivery. Keeping a well organized and easy to manage system is crucial for sustainable use of this system.

Organizational structure is crucial in this kind of deployment because delivery of inbound email addresses are configured independently of user accounts. Furthermore, email accounts and user accounts need not correspond or reference each other. This may be confusing for some users. To help resolve this confusion you may want to establish a systematic convention for email addresses and corresponding user accounts to the mail server.

Remember that system user accounts may provide access to other services on the system. Unless this access is specifically prohibited, all system user accounts will have SSH access to the server using the same credentials that are used for logging into the email services.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Basic Email Gateway with Postfix on Ubuntu 10.04 (Lucid)](/docs/email/postfix/gateway-ubuntu-10-04-lucid)




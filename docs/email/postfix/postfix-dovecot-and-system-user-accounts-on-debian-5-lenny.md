---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use system user accounts, postfix, and dovecot to provide'
keywords: ["postfix", "dovecot", "system users", "email"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/postfix/dovecot-system-users-debian-5-lenny/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2011-02-17
title: 'Postfix, Dovecot, and System User Accounts on Debian 5 (Lenny)'
---



Postfix is a popular mail transfer agent or "MTA". This document will allow you to create a mail system using Postfix as the core component and aims to provide a simple email solution that uses system user accounts for authentication and mail delivery and Dovecot for remote mailbox access. If you do not need to authenticate to Postfix for SMTP service or use POP or IMAP to download email, you may consider using the [Basic Email Gateway with Postfix](/docs/email/postfix/gateway-debian-5-lenny) document to install a more minimal email system.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Software

Issue the following commands to install any outstanding package updates:

    apt-get update
    apt-get upgrade

Issue the following command to install all required software:

    apt-get install libsasl2-2 libsasl2-modules sasl2-bin postfix dovecot-common dovecot-imapd dovecot-pop3d

During the installation process, the package manager will prompt you for the responses to a few questions to complete the Postfix installation. To the first question regarding the type of mail server you want to configure, select "Internet Site" and continue as in the following image:

[![Selecting the Postfix mail server configuration type on a Debian 5 (Lenny) system.](/docs/assets/87-postfix-courier-mysql-02-mail-server-type-2.png)](/docs/assets/87-postfix-courier-mysql-02-mail-server-type-2.png)

The next prompt will ask for the system mail name. This should correspond to the fully qualified domain name (FQDN) that points to your Linode's IP address. In this example, we're using a machine specific hostname for our server. Set the reverse DNS for your Linode's IP address to the fully qualified domain name you assign as the system mail name. You will be able to send mail from additional domains as configured later in this document. See the following example:

[![Selecting the Postfix system mail name on a Debian 5 (Lenny) system.](/docs/assets/88-postfix-courier-mysql-02-mail-server-type-3.png)](/docs/assets/88-postfix-courier-mysql-02-mail-server-type-3.png)

# SASL Authentication

Edit the `/etc/default/saslauthd` file to allow the SASL authentication daemon to start. Uncommon or add the following line:

{{< file-excerpt "/etc/default/saslauthd" ini >}}
START=yes

{{< /file-excerpt >}}


Create the `/etc/postfix/sasl/smtpd.conf` file, and insert the following line:

{{< file "/etc/postfix/sasl/smtpd.conf" ini >}}
pwcheck_method: saslauthd

{{< /file >}}


Issue the following command to start the SASL daemon for the first time:

    /etc/init.d/saslauthd start

# Configure SSL

SSL or TLS provides a method of encrypting the communication between your remote users and your mail servers. While this does not encrypt your email messages from end to end, it does ensure that your login credentials are transmitted securely and that communications are secure between your client machine and the email server.

Issue the following sequence of commands to install the prerequisites and [generate a self-signed SSL certificate](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate):

    apt-get install openssl
    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/ssl/postfix.pem -keyout /etc/ssl/postfix.key

Be sure to generate a certificate with a "Common Name" that corresponds to the host name that your users will connect your mail server (e.g. `mail.example.com`).

Mail clients may have an issue with certificates generated in this manner because they are not signed by a recognized certificate authority. Consider our documentation for generating [commercial ssl certificates](/docs/security/ssl/obtaining-a-commercial-ssl-certificate) if you need a commercially verified certificate.

You can use any SSL certificate with Postfix. If you already have a commercial certificate or another SSL certificate for your web server, you can use these `.pem` and `.key` files.

# Postfix

### Configure Outbound Mail Service

Edit the `/etc/postfix/main.cf` file to edit or add the following lines:

{{< file-excerpt "/etc/postfix/main.cf" ini >}}
smtpd_tls_cert_file=/etc/ssl/postfix.pem
smtpd_tls_key_file=/etc/ssl/postfix.key

smtp_use_tls = yes
smtpd_use_tls = yes
smtp_tls_note_starttls_offer = yes
smtpd_tls_loglevel = 1
smtpd_tls_received_header = yes

smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes

smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $myhostname
smtpd_sasl_application_name = smtpd
broken_sasl_auth_clients = yes

smtpd_recipient_restrictions = reject_unknown_sender_domain, reject_unknown_recipient_domain, reject_unauth_pipelining, permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination

{{< /file-excerpt >}}


These settings make it possible for the SASL authentication process to interact with Postfix, and for Postfix to use the SSL certificate generated above. If you're using an SSL certificate with a different name, modify the first two lines of this configuration section.

When all modifications to the Postfix configuration are complete, issue the following command to restart Postfix to allow these configuration changes to take effect:

    /etc/init.d/postfix restart

At this point you should be able to send email using your Postfix instance by authenticating with SMTP. Authentication credentials are your [system user accounts](/docs/tools-reference/linux-users-and-groups/).

Consider the [basic email gateway guide](/docs/email/postfix/gateway-debian-5-lenny) for more information regarding Postfix virtual hosting configuration. If you need to deliver mail locally, continue for documentation of mail routing and the Dovecot POP3/IMAP server.

### Configure Mail Delivery

The above Postfix configuration makes it possible to *send* mail using postfix. If your server receives email, Postfix requires additional configuration to deliver mail locally. Edit the `main.cf` file to insert or modify the following configuration directives:

{{< file-excerpt "/etc/postfix/main.cf" ini >}}
myhostname = lollipop.example.com
virtual_alias_maps = hash:/etc/postfix/virtual
home_mailbox = mail/

{{< /file-excerpt >}}


Issue the following command to ensure that new user accounts have a `~/mail` directory:

    mkdir /etc/skel/mail/

Every existing user that receives email will also need to make their own `Maildir`, by issuing the following command:

    mkdir ~/mail/

Create a `/etc/postfix/virtual` file to map incoming email addresses to their destinations. Consider the following example:

{{< file >}}
/etc/postfix/virtual
{{< /file >}}

> <username@example.com> username <username@example.net> username <username@example.com> username
>
> <fore@example.com> <foreman@example.com> <fore@example.net> <foreman@example.com> <fore@example.com> <foreman@example.com>
>
> <team@example.com> username, <foreman@example.com> <team@example.net> username, <foreman@example.com> <team@example.com> username, <foreman@example.com>

Here, all mail sent to the three addresses beginning with the characters `username@` are delivered to the local user "username" and deposited to a Maildir in the `/home/username/mail/` directory. The three addresses that begin with the characters `fore@` are delivered to the email address `foreman@example.com`. The final set of three email addresses beginning with `team@` are both delivered locally and sent to the `foreman@example.com` email address.

You can add additional lines in the same format as the above to control how all incoming email is delivered to local or external destinations. Remember that incoming email has no firm relationship to the name of the user account.

Edit the `/etc/alias` file to add the following line. This will to reroute all local mail delivered to the root user to another user account. In the following example, all mail delivered to `root` will be delivered to the `username` user's mail box.

{{< file-excerpt >}}
/etc/aliases
{{< /file-excerpt >}}

> root: username

When you have configured mail delivery issue the following command to recreate the aliases database, rebuild the virtual alias database, and restart the mail server:

    postalias /etc/alias

> postmap /etc/postfix/virtual /etc/init.d/postfix restart

# Dovecot

Dovecot is a contemporary POP3/IMAP server that makes it possible to access and download mail from your mail server remotely onto your local system.

### Configure Remote Mail Access

Issue the following command to create a back up of the default `/etc/dovecot/dovecot.conf` file and remove the original. Then recreate it using the following template:

    cp /etc/dovecot/dovecot.conf /etc/dovecot/dovecot.conf-backup
    rm /etc/dovecot/dovecot.conf

{{< file >}}
/etc/dovecot/dovecot.conf
{{< /file >}}

> protocols = imap imaps pop3 pop3s log\_timestamp = "%Y-%m-%d %H:%M:%S " mail\_privileged\_group = mail ssl\_cert\_file = /etc/ssl/postfix.pem ssl\_key\_file = /etc/ssl/postfix.key mail\_location = maildir:\~/mail:LAYOUT=fs
>
> protocol imap { }
>
> protocol pop3 {
> :   pop3\_uidl\_format = %08Xu%08Xv
>
> }
>
> protocol managesieve {
> :   sieve=\~/.dovecot.sieve sieve\_storage=\~/sieve
>
> }
>
> auth default {
> :   mechanisms = plain login passdb pam { } userdb passwd { } socket listen { client { path = /var/spool/postfix/private/auth mode = 0660 user = postfix group = postfix } }
>
> > }
>
> dict { }
>
> plugin { }

Modify the `ssl` configuration directives if you're using ssl certificates located at alternate paths. Once configured, issue the following command to restart the Dovecot instance:

    /etc/init.d/dovecot restart

You may now access email by configuring a local email client to contact the server you have set up. Authentication credentials are the same as the system user accounts. These accounts can be configured outside of this document at any time.

# Organize Mail Services

This document describes a complete email system configuration. How you use and manage your system from this point forward is beyond the scope of this document. At the same time, we do encourage you to give some thought to the organization of your user accounts and email delivery. Keeping a well organized and easy to manage system is crucial for sustainable use of this system.

Organizational structure is crucial in this kind of deployment because delivery of inbound email addresses are configured independently of user accounts. Furthermore, email accounts and user accounts need not correspond or reference each other. This may be confusing for some users. To help resolve this confusion you may want to establish a systematic convention for email addresses and corresponding user accounts to the mail server.

Remember that system user accounts may provide access to other services on the system. Unless this access is specifically prohibited, all system user accounts will have SSH access to the server using the same credentials that are used for logging into the email services.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Basic Email Gateway with Postfix on Debian 5 (Lenny)](/docs/email/postfix/gateway-debian-5-lenny)




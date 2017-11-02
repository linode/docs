---
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to running a mail server on your Linode.'
keywords: ["mail server", "linode guide", "running a mail server", "linode quickstart guide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['mailserver/']
modified: 2014-04-13
modified_by:
  name: Alex Fornuto
published: 2013-06-05
title: Running a Mail Server
---

If you've followed along with the quick start guides up to this point, you've managed to [install Linux](/docs/getting-started), [secure your Linode](/docs/securing-your-server), and [start hosting a website](/docs/hosting-website). Now it's time to set up email. This guide explains how to install a mail server on your Linode and create mail accounts for your own domains. First, we'll help you decide whether to run your own mail server or let a third-party mail service handle it for you. Then we'll show you how a mail server works, present common mail server configurations, and provide basic instructions for getting a mail server up and running.

![Running a Mail Server](/docs/assets/mail_server_tg.png "Running a Mail Server")

## Should You Run a Mail Server?

First, you'll need to decide whether or not you want to run your own mail server. If you do, you'll have control over your domain's email, but you'll also have to deal with the hassles associated with setting up and running some pretty complex software. Using a third-party mail service is easier, but you'll sacrifice control and flexibility. In this section, we'll be discussing the benefits and drawbacks to running your own mail server, as well as how to choose an external mail service, if you decide to go that route.

### Benefits

If you want or need full control of your email, running your own mail server just might be the ideal solution. Doing so allows you to store your own email, access the mail server's logs, and access the raw email files in a user's mailbox. There are several benefits to running a mail server:

-   Full control over both the server and your email
-   Pick the applications you want to use, and then tune them for your needs
-   Access the raw mail files in users' server mailboxes
-   View logs for incoming and outgoing messages
-   View logs for connection and authorization attempts from local mail clients for IMAP, POP3, and SMTP
-   Enjoy having mail for \$0.00 more than the price of your Linode

The greatest benefit: When something goes wrong, you can investigate and fix things yourself instead of calling a third-party mail service provider. So when someone at your company claims that an email got lost, or Outlook suddenly stopped working even though they didn't change *anything*, you'll be able to see what actually happened and make adjustments if necessary.

### Drawbacks

By now you know that running your own mail server isn't for the faint of heart. Setting up the software is tricky, filtering spam is a pain, and keeping everything running smoothly is challenging. For these reasons and others, we recommend that you carefully consider all of your options before deciding to run a mail server. Here are a couple of the drawbacks:

-   Configuration is complicated
-   Troubleshooting problems is a pain
-   Downtime can result in lost email
-   Spam and virus filtering need to be tuned just right to block unwanted emails and allow legitimate ones
-   If a spammer discovers an exploit, they could use your Linode to send spam, and your IP address could be black-listed

And here's the biggest drawback: You're on the hook for everything related to your email. Maintaining, upgrading, and troubleshooting the mail server is your responsibility. It's a huge commitment!

### External Mail Services

If the prospect of managing your own mail server is too daunting, you should consider using a third-party mail service. For a monthly or annual fee, these services provide managed mail servers and take care of all hosting, maintenance, and troubleshooting tasks. You won't have as much control when something goes wrong, but you also won't need to worry about the pitfalls of running a mail server. There are dozens of third-party mail services available, but we recommend checking out these services:

-   [Fastmail](https://www.fastmail.fm) has good uptime and fast IMAP. It's paid and has capped storage.
-   [Google Apps](http://www.google.com/intl/en/enterprise/apps/business/) uses the top-notch Gmail interface and has great uptime. It's paid and the IMAP implementation is unusual. We have a [guide](/docs/email/google-mail) on how to use Google Apps with your Linode.
-   [Office 365](https://login.microsoftonline.com/) is the successor to Outlook.com and can support custom domains for email, amongst other services.

If you decide to use an outside mail service, you will still need to set up [DNS](/docs/networking/dns/dns-manager) for your mail, using the settings provided by the third-party mail service.

## How Mail Servers Work

Every mail server that lets you send and receive email with a local mail client has three separate software components - a Mail Transfer Agent (MTA), a Mail Delivery Agent (MDA), and an IMAP/POP3 server. The MTA relays mail between your Linode and the wider Internet, whether it's delivering an outside email to one of your users, or sending an email from one of your users. Accepted incoming mail gets added to the MTA's queue on the server. The MDA takes mail from the MTA's queue and saves it to individual mailboxes on your Linode. The IMAP/POP3 server manages users and their mailboxes as they check their email over IMAP/POP3 connections.

How does it work? First, an incoming message is directed to your Linode via DNS. Once it passes through the MTA and MDA, it is stored in the user's mailbox on the server. When the message is requested, the IMAP/POP3 server mediates the connection between your Linode and the user's local mail client. Outgoing mail is sent from the user's local mail client, processed by your Linode's MTA, and is then sent to its destination on the Internet.

[![An incoming message goes through DNS, the MTA, the MDA, the mailbox, the IMAP/POP3 server, and finally to the local mail client. An outgoing message goes from the local mail client, through the MTA, and out to the Internet.](/docs/assets/1300-mail_server.jpg)](/docs/assets/1300-mail_server.jpg)

There are also add-on components that you may want to install for webmail, spam filtering, virus scanning, and mailing list organizers. To receive mail, users can install local mail clients like Apple Mail, Outlook, and Thunderbird on their personal computers. You'll learn more about each of these components in the following sections.

## Choosing Mail Server Components

The next step is choosing the components for your mail server. There are several software packages that can be used as MTAs, MDAs, and IMAP/POP3 servers, and we'll be presenting some of the most popular options in this section. While all of the components presented in this guide are solid choices, we recommend that you use Postfix as your MTA and Dovecot as your MDA and IMAP/POP3 server. These are the packages we'll be using in later examples.

### Mail Transfer Agents

MTAs are responsible for handling SMTP connections to your Linode from both outside senders and your own users. When your Linode is asked to relay an email, it decides what to do with the email based on the rules you give it. The MTA delivers the message locally if it is sent to a user you host on your Linode, relays it to another server if it was sent from one of your authorized users, and rejects it if it's neither to nor from a user on your Linode.

Here are the most popular MTA services available:

-   [Courier Mail Server](http://www.courier-mta.org) comes with Courier-IMAP, which is the popular part of the Courier mail server suite, but Courier-MTA also includes mail relaying features. It's a simpler MTA but somewhat limited.
-   [Exim](http://www.exim.org) is modern and oriented towards flexibility. It's secure, but not quite as security-oriented as Postfix. It's very customizable, but is one of the most complex MTAs to configure. We have guides for [Exim on Ubuntu 12.04](/docs/email/exim/send-only-mta-ubuntu-12-04-precise-pangolin) and [Exim on Debian 6](/docs/email/exim/send-only-mta-debian-6-squeeze).
-   [Postfix](http://www.postfix.org) is part of our [recommended mail server build](/docs/email/postfix/email-with-postfix-dovecot-and-mysql). It's modern, security-oriented, and very flexible, although not quite as flexible as Exim. It is slightly simpler to set up than Exim.
-   [Qmail](http://www.qmail.org/top.html) is one of the older modern MTAs and supports Maildir-style directories. It's still very popular, but is no longer supported.
-   [Sendmail](http://www.sendmail.com/sm/open_source/) is a legacy MTA that still has a large following and good support. Don't expect the most modern options and security, though.
-   [Zimbra](http://www.zimbra.com) is an all-in-one mail service that's much simpler to install than other options, but less customizable. We have guides for [Zimbra on Ubuntu 10.04](/docs/email/zimbra/install-zimbra-ubuntu-10-04-lucid), [Zimbra on Debian 6](/docs/email/zimbra/install-zimbra-debian-6-squeeze), and [Zimbra on CentOS 5](/docs/email/zimbra/install-zimbra-centos-5).

### Mail Delivery Agents

MDAs move email from the MTA's queue to individual mailboxes on your Linode (for example, your mailbox could be located at `/var/mail/example.com/user/`). MDAs are also known as Local Delivery Agents (LDAs). Different MTAs support different types of mailboxes. The most common types are the older **mbox** mailboxes which store all the messages together in a single file, and **Maildir** mailboxes which store each email in a separate file and support multiple folders. MDAs are often bundled with other mail-related software.

Here are the most popular MDAs available:

-   [Cyrus's MDA](http://www.cyrusimap.org/index.php) is part of the Cyrus IMAP/POP3 server. Cyrus is a modern, security-oriented IMAP/POP3 server designed to run on servers where users do not log in directly.
-   [Deliver](http://linux.die.net/man/8/deliver) is a simple Linux mail delivery utility, which is configured in the Imapd configuration files by default.
-   [Dovecot's LDA](http://wiki2.dovecot.org/LDA) and [Dovecot's LMTP server](http://wiki2.dovecot.org/LMTP) are part of the Dovecot IMAP/POP3 server. Dovecot is a lightweight, modern, and configurable mail server.
-   [maildrop](http://www.courier-mta.org/maildrop/) is Courier's MDA. Courier is an all-in-one mail server.
-   [Postfix's MDA](http://www.postfix.org/OVERVIEW.html#delivering) is part of the Postfix MTA software. Postfix is a modern, security-oriented, and flexible MTA.
-   [Procmail](http://www.procmail.org) is a legacy MDA.
-   [Sendmail's MDA](http://www.sendmail.com/sm/open_source/) is part of the Sendmail MTA software. Sendmail is an older MTA that is still very popular MTA.

### IMAP and POP3 Servers

An IMAP or POP3 server handles connections from incoming IMAP or POP3 clients like Microsoft Outlook and Apple Mail. The server manages client access to the mailboxes and raw mail files so that the email is displayed in a user-friendly way.

Most servers and clients support both IMAP and POP3. POP3 clients connect to the server at specified intervals and download all of a user's messages, without leaving copies on the server by default. POP3 was developed when most people used only one device to access one email account. IMAP is a newer protocol designed for multi-device users. IMAP clients stay continuously connected to the server and IMAP mailboxes mirror the mailboxes on your Linode. IMAP and POP3 both have secure versions (IMAPS and SSL-POP) which use SSL encryption for mail transfer. Always use the secure version whenever possible.

Here are the most popular IMAP and POP3 servers available:

-   [Citad.l](http://www.citadel.org) is an all-in-one mail service that includes mail, calendars, instant messaging, mailing lists, and other collaboration tools. It's open source and geared towards small and medium-sized organizations. We have guides for [Citadel on Ubuntu 12.04](/docs/email/citadel/ubuntu-12-04-precise-pangolin) and [Citadel on Debian 6](/docs/email/citadel/debian-6-squeeze).
-   [Courier](http://www.courier-mta.org) has a very popular IMAP server called [Courier IMAP](http://www.courier-mta.org/imap/). It's an all-in-one mail server software suite, but Courier IMAP can be installed by itself if that's the only part you need.
-   [Cyrus](http://www.cyrusimap.org/index.php) is a modern, security-oriented IMAP/POP3 server designed to work on sealed servers where users do not log in directly.
-   [DBMail](http://www.dbmail.org) is an open source project that stores mail in databases instead of flat files.
-   [Dovecot](http://www.dovecot.org) is a lightweight, modern, and configurable mail server, and is part of our [recommended mail server build](/docs/email/postfix/email-with-postfix-dovecot-and-mysql).
-   [Xmail](http://www.xmailserver.org) is a full-featured POP3 server, but does not support IMAP.
-   [Zimbra](http://www.zimbra.com) is an all-in-one mail service that's much simpler to install than other options, but less customizable. We have guides for [Zimbra on Ubuntu 10.04](/docs/email/zimbra/install-zimbra-ubuntu-10-04-lucid), [Zimbra on Debian 6](/docs/email/zimbra/install-zimbra-debian-6-squeeze), and [Zimbra CentOS 5](/docs/email/zimbra/install-zimbra-centos-5).

## Building Your Mail Server

Now that you understand how a mail server works and you've chosen the primary components, it's time to build your mail server. If you can't decide which software is best for you, you can always use our recommended build with Postfix as your MTA and Dovecot as your MDA and IMAP/POP3 server. It's what we'll use in the examples below. Let's get building!

### SSL Certificate

The first step is to obtain and install an SSL certificate. An SSL certificate encrypts connections to your mail server, protecting passwords and email from harmful surveillance. It's possible to run a mail server without this protection, but we don't recommend it. If you follow our recommended build, you will absolutely need an SSL certificate.

Any type of SSL certificate will work, but some certificates have different degrees of trustworthiness for your users. If you want the highest level of trustworthiness, you should [purchase a signed SSL certificate](/docs/security/ssl/obtaining-a-commercial-ssl-certificate) from a reputable company. You can also use a free self-signed certificate if you are comfortable with the warnings it generates. You can [make your own](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate), or, if you're following our recommended build, you can use the one that comes with Dovecot by default. Decide what type of SSL certificate you need and acquire and install it now.

### Software Installation

The second step is installing and configuring the MTA, MDA, and IMAP/POP3 server. You'll also probably want to install a database server like MySQL or PostgreSQL to help you manage your domains, email addresses, user credentials, aliases, etc. Providing step-by-step instructions for every possible mail server build is beyond the scope of this article. For detailed instructions, see our [Postfix, Dovecot, and MySQL](/docs/email/postfix/email-with-postfix-dovecot-and-mysql) guide. Go ahead and install and configure the software you've chosen for your mail server build now.

{{< note >}}
We've written a variety of mail server guides, including guides for older software versions and other mail-related services. See the [Email Server Guides](/docs/email) webpage for more information.
{{< /note >}}

### DNS Records

The third step is to create the DNS records, which help email reach your Linode. The right DNS records also help designate your Linode as a legitimate mail server. In this section, you'll learn how to set the appropriate MX, SPF, and PTR records for your domain and Linode.

{{< note >}}
You should lower the time to live (TTL) on your existing DNS records to the lowest allowed value at least 24-48 hours before you make any other DNS changes. That way, any changes you make later will propagate quickly. It's also a good idea to keep your old mail server running for at least 48 hours after you start directing mail to your Linode, just in case the DNS changes take a while to propagate.
{{< /note >}}

#### MX Records

MX records tell the Internet where to send your domain's email. If someone sends an email to `user@example.com`, the outgoing server looks up the DNS settings for `example.com`. When it finds the MX record pointing to your Linode, it sends the message to your Linode.

You'll need an MX record for each domain and subdomain for which you want to receive mail on your Linode. You can also set multiple MX records with different priorities for the same domain. This creates fallback mail servers for your domain in case the first one on the list is down. Lower numbers have a higher priority. Your MX record has a domain or subdomain, TTL (time to live), type (which is MX), and a priority and target (can be a domain or an IP that resolves to your Linode).

A typical MX record looks like this:

    example.com         86400   MX      10      example.com
    example.com         86400   MX      10      12.34.56.78
    mail.example.com    86400   MX      10      12.34.56.78

If you use Linode's [DNS Manager](/docs/dns-manager), you'll need to point your MX records to a target domain or subdomain that resolves to your Linode. Make sure that domain or subdomain has an A record that points to the correct IP address.

#### SPF Records

SPF records help establish the legitimacy of your mail server and reduce the chances of spoofing, which occurs when someone fakes the headers on an email to make it look like it's coming from your domain, even though the message did not originate from your Linode. Spammers sometimes try to do this to get around spam filters. An SPF record for your domain tells other receiving mail servers which outgoing server(s) are valid sources of email, so they can reject spoofed email from your domain that has originated from unauthorized servers.

In your SPF record, you should list all the mail servers from which you send mail, and then exclude all the others. Your SPF record will have a domain or subdomain, TTL (time to live, type (which is TXT, or SPF if your name server supports it), and text (which starts with "v=spf1" and contains the SPF record settings).

If your Linode is the only mail server you use, you should be able to use the example record below. With this SPF record, the receiving server will check the IP addresses of both the sending server and the IP address of `example.com`. If the IPs match, the check passes. If not, the check will "soft fail" (i.e., the message will be marked but will not automatically be rejected for failing the SPF check).

    example.com     86400   TXT     "v=spf1 a ~all"

{{< note >}}
Make sure your SPF records are not too strict. If you accidentally exclude a legitimate mail server, its messages could get marked as spam. We strongly recommend visiting [openspf.org](http://www.openspf.org/SPF_Record_Syntax) to learn how SPF records work and how to construct one that works for your setup. Their [examples](http://www.openspf.org/FAQ/Examples) are also helpful.
{{< /note >}}

#### Reverse DNS

If you haven't yet [set reverse DNS](/docs/hosting-website#setting-reverse-dns) for your mail server's domain or subdomain, do so now for the sake of your mail server. The reverse DNS for your mail server *must* match the hostname of your Linode. If your Linode's reverse DNS and hostname do not match, email from your server may get rejected with the warning "Reverse DNS does not match SMTP Banner." If you need to check or set the hostname, see our [Getting Started](/docs/getting-started#setting-the-hostname) article.

## Next Steps

At this point, you should have a basic mail server up and running. There's a bit more to do, however, if you want to provide your users with the best possible mail experience. This includes adding spam and virus filtering to protect your users, setting up mail clients, providing a webmail solution, and adding any extras you want, such as mailing lists.

### Spam and Virus Protection

Outgoing spam, or spam originating from your Linode, is bad news for everyone involved. It annoys the recipients, and it also gives your server a bad reputation, which makes it harder for you to send legitimate emails. You should take steps to ensure that your Linode is not used as an "open relay" server, which would allow anyone to send messages anywhere using your server. To prevent your Linode from being used as an open relay, make a list of allowed domains and users for your MTA, and make sure it rejects everything else.

There are also a few other scenarios where your server could be sending spam. Your server or an installed application might get hacked, one of your users might have a compromised account, or you may be sending out email messages that are getting marked as spam. (This is more likely to occur in the case of mass mailings.) The best way to stay on top of outgoing spam is to keep an eye on your outgoing mail logs and pay attention to bounceback errors.

{{< note >}}
If you do get added to a block list, take steps to mitigate the source of the spam. Then you will have to contact the mail provider that blocked you and follow their steps to be allowed to send mail again.
{{< /note >}}

Incoming spam can also be a problem. Spam filters help you deal with spam sent to your own users. They let you filter incoming messages based on origin, content, etc. Some spam contains viruses, which can cause more serious damage to recipients.

Here are some of the most popular spam and virus filter services:

-   [Amavis](http://www.amavis.org) is an open source content filter for email that integrates directly with your MTA. It does some checking on its own, and can also be used in conjunction with more robust spam and virus filters.
-   [Clam AntiVirus](http://www.clamav.net/lang/en/) is a popular, free, and open-source virus scanner.
-   [SpamAssassin](http://spamassassin.apache.org) is a very popular free spam filter.

### Mail Clients

Mail clients are an integral part of the email experience for your users. Microsoft Outlook, Apple Mail, and Mozilla Thunderbird are all examples of mail clients. Most mail clients are compatible with most mail servers – you just need to make a note of the settings you configured on the server side, and make sure you use compatible settings on the client side. Here are some to consider:

-   Protocols: Choose IMAP or POP3 for receiving, and SMTP for sending.
-   Encryption: Choose SSL and/or TLS encryption, based on your server settings. Ideally, you should make everyone use encryption all the time.
-   Authentication: Make sure the format of the credentials entered in the mail client matches the format expected by the server. Sometimes just the "user" part of the email address is the username, and sometimes the entire email address, including the `@` sign, is the username. You can also have usernames that are not related to their corresponding email addresses, but this is not recommended.
-   Mailbox format: Make sure your users will be able to read, create, and use all of the folders they need.
-   Ports: Not only do your mail client(s) and server have to work on the same ports, but your internet service provider has to allow them as well.

Here are some of the typical mail ports:

-   110 for POP3
-   995 for SSL-POP (encrypted)
-   143 for IMAP
-   993 for IMAPS (encrypted)
-   25 for SMTP (sometimes blocked by ISPs)
-   587 for SMTP (actually the preferred non-encrypted port for outgoing connections from mail clients)
-   465 for SSMTP (encrypted)

{{< note >}}
If you're using a firewall, be sure to edit the rules for your mail server's ports. See [these instructions](/docs/securing-your-server#creating-a-firewall) for more information.
{{< /note >}}

### Webmail

Webmail is a type of mail client that can be installed on your server and accessed from a web browser. It allows your users to access their email from your website (example: `http://example.com/mail` anywhere they have access to the Internet. Running a web server is a prerequisite for running a webmail client, so you should follow the [Hosting a Website](/docs/hosting-website) guide if you want to run webmail on your Linode, in addition to installing a mail server.

Here are some of the most popular webmail clients:

-   [Citadel](http://www.citadel.org) is an all-in-one mail service that includes mail, calendars, instant messaging, mailing lists, and other collaboration tools. It's open source and geared towards small and medium-sized organizations. We have guides for [Citadel on Ubuntu 12.04](/docs/email/citadel/ubuntu-12-04-precise-pangolin) and [Citadel on Debian 6](/docs/email/citadel/debian-6-squeeze/).
-   [Horde Webmail](http://www.horde.org/apps/webmail) is an open-source IMAP client paired with some additional functions like account management and calendars.
-   [RoundCube](http://roundcube.net) is an IMAP client with modern functionality and a clean layout.
-   [SquirrelMail](http://squirrelmail.org) is a solid option, but has an older user interface. Visit our guide to [Install SquirrelMail on Ubuntu 16.04 or Debian 8](/docs/email/clients/install-squirrelmail-on-ubuntu-16-04-or-debian-8)
-   [Zimbra](http://www.zimbra.com) is an all-in-one mail service that's much simpler to install than other options, but less customizable. We have guides for [Zimbra on Ubuntu 10.04](/docs/email/zimbra/install-zimbra-ubuntu-10-04-lucid), [Zimbra on Debian 6](/docs/email/zimbra/install-zimbra-debian-6-squeeze), and [Zimbra CentOS 5](/docs/email/zimbra/install-zimbra-centos-5).

### Extras

There are many other add-ons that can round out the functionality of your mail server. For example, you may want to incorporate mailing list software, user administration so users can change their own passwords, or calendar coordination, just to name a few.

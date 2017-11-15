---
author:
  name: Linode
  email: docs@linode.com
description: 'Manage email retrieval via multiple protocols with Fetchmail.'
keywords: ["mail", "fetchmail", "unix", "esr", "mda"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/fetchmail/']
modified: 2013-09-11
modified_by:
  name: Linode
published: 2010-01-07
title: Using Fetchmail to Retrieve Email
external_resources:
 - '[Mailfilter MDA](http://mailfilter.sourceforge.net/)'
 - '[Maildrop MDA](http://www.courier-mta.org/maildrop/)'
 - '[Procmail MDA](http://www.procmail.org/)'
---

![Using Fetchmail to Retrieve Email](/docs/assets/using-fetchmail-to-retrieve-email.jpg "Using Fetchmail to Retrieve Email")

The `fetchmail` program is a classic UNIX and Unix-like utility used to retrieve email from remote servers and deliver it to local users on a server. There are a number of different scenarios where fetchmail is used. Fetchmail is a popular tool for manually downloading email from a POP or IMAP server for personal use on a local machine. Another common application uses fetchmail to create an "email gateway," where email is collected from a number of different accounts or from a large centralized server and provided to the user in a manageable situation.

If you're new to Linode we always recommend completing our [getting started guide](/docs/getting-started/) before beginning a tutorial. If you're new to Linux we also recommend considering the [beginners guide](/docs/beginners-guide/) and the many documents in the [Tools & Reference](/docs/tools-reference/) section. If you need a more full featured email stack, consider one of our other [email guides](/content/email/).

## Installing Fetchmail

Fetchmail must be installed on whatever computer you need to download mail *to*. This document is applicable for users of desktop Linux who need to download email from their Linodes and users who need to download email to their Linodes from external sources. Fetchmail runs on nearly every UNIX like operating system and is even installed by default on Apple's Macintosh OS X system.

To install `fetchmail` on Debian and Ubuntu systems, issue the following command:

    apt-get update
    apt-get upgrade --show-upgraded
    apt-get install fetchmail

To install `fetchmail` on CentOS and Fedora systems, issue the following command:

    yum install fetchmail

To install `fetchmail` on Arch Linux systems, issue the following command:

    pacman -S fetchmail

To install `fetchmail` on Gentoo Linux systems, issue the following command:

    emerge fetchmail

Once installed you can begin to configure fetchmail.

## Introduction to .fetchmailrc Syntax

Fetchmail processes configuration options specified on the command line by default. More conventionally, however, administrators store settings in the `~/.fetchmailrc` file. Still, any options specified in the command line will override directives set in the configuration file.

You can specify a number of different accounts in your `~/.fetchmailrc` and even use fetchmail to deliver email to a number of different local users. Let's consider a number of examples, beginning with a very simple line:

{{< file-excerpt ".fetchmailrc" >}}
poll example.com protocol pop3 username "username" password "XXX"

{{< /file-excerpt >}}


This assumes that the username on the remote pop3 server is the same as the local user. In this case, mail will be delivered to the default system mail spool using in an `mbox` format and located at `/var/mail/username`. Allow us to consider the following example:

{{< file-excerpt ".fetchmailrc" >}}
poll mail.example.com protocol pop3:
     username "admin" password "dir3cti0n" is "username" here;
     username "fore" password "0rd3r" is "foreman" here;

poll mail.example.org protocol pop3 with option sslproto '':
     user "betty" password "p1nk" mda "/usr/bin/procmail -d %T":   user "betty" password "p1nk" mda "/usr/bin/procmail -d %T"

{{< /file-excerpt >}}


In the first specification, fetchmail is told to check the `mail.example.com` server, using the POP3 protocol, for the users `admin` and `fore`." Also, the "`is "[username]" here;` directive is used to clarify the relationship between a remote user (i.e. `admin` and `fore`) and users on the local machine (i.e. `username` and `foreman`).

In the second example, a single account (i.e. `betty`) is retrieved from the remote server (i.e. `mail.dexample.org`) and passed to the MDA `procmail` utility. Additionally, account has the `sslproto` option is enabled to encrypt this traffic using `ssl`.

Fetchmail requires that the `~/.fetchmailrc` file have the [access permissions](/docs/tools-reference/linux-users-and-groups) of 600. Permissions of 600 equate to read and writeable by the user account which "owns" the file with no permissions granted to group or other users. To achieve this, issue the following command:

    chmod 600 ~/.fetchmailrc

## Using Special Syntaxes for Additional Clarity

Fetchmail provides a number of syntactic niceties in an effort to make `.fetchmailrc` files easier to read. For instance, the words `and`, `with`, `has`, `wants`, and `options` are ignored by fetchmail. Additionally, the punctuation characters `:`, `;`, and `,` are ignored when `fetchmail` reads the configuration file.

While it is possible to specify credentials for a server on one line, more often configurations are specified over a number of different lines. Fetchmail is insensitive to whitespace except when it occurs in quoted strings, although in these circumstances it's possible to escape carriage return characters with backslashes. All characters following a `#` character on any given line are considered comments and ignored by fetchmail.

Entries for new servers begin with the word `poll`. Fetchmail will check all "poll" entries for new mail every time it runs. You can specify server entries with the work `skip` and cause fetchmail to ignore these entries unless they are specified on the command line. This `skip` functionality is intended make it easy to disable checking mail servers that have gone off line or for testing purposes.

## Running Fetchmail for One User

Once the `.fetchmailrc` file is configured, fetchmail can be invoked simply by issuing the following command:

    fetchmail

When invoked from the command line, fetchmail will `poll` all of the configured servers from the `.fetchmailrc` file and deliver the messages to the default mail spool for that user in `/var/mail/` or hand the messages off to the specified `mda` command.

Fetchmail will deliver the message to the current user's mailbox under the following conditions:

-   There is no `mda` is specified for the account in question in the `.fetchmailrc`.
-   There are no local users are specified with the `is "[local-user]" here;` syntax in the account specification within the `.fetchmailrc` file.
-   There are no corresponding local users for the remote usernames on the server.

If fetchmail is running as the root user, it will drop privileges to deliver messages to specific user accounts. If fetchmail is unable to deliver messages as root it will deposit them in the system's "postmaster" account. The postmaster account defaults to postmaster, and the mail spool is located at `/var/mail/postmaster`, unless modified by a global option.

When fetchmail has completed this process it will quit until it is invoked again. If you want fetchmail to run as a daemon process, consider using the daemon option, either by specifying a global option as described below or by specifying the `-d` option on the command line. For example:

    fetchmail -d 300

In the above example, fetchmail will poll mail sources for new mail every 300 seconds, or once every five minutes.

## Global Settings

In addition to the configuration options described above, fetchmail provides a number of additional "global" configuration options. These allow you to configure the behavior of fetchmail with regards to all of the servers that it polls. These options are included at the beginning of the file and begin with the word `set`. Here is an example:

{{< file-excerpt ".fetchmailrc" >}}
set daemon [seconds] set postmaster "username"

set logfile "\~/logs/fetchmail.log" set syslog

{{< /file-excerpt >}}


The following sections will explain the functionality of these settings.

### Daemon Mode

The `daemon` setting with an interval specification (in seconds,) will cause fetchmail to daemonize itself and run as a background service. In this mode, each mail server will be polled on the interval specified. If you need to poll from different accounts with different frequencies you can specify the `interval $NUM` where `$NUM` is the number of intervals. Consider the following excerpt:

{{< file-excerpt ".fetchmailrc" >}}
set daemon 60

poll mail.example.com protocol pop3 with option interval 3:
     user "admin" password "r00t" mda "/usr/bin/procmail -d %T"

poll mail.example.org protocol pop3 with option ssl, interval 20:
     user "feedback" password "h3ck1e" mda "/usr/bin/procmail -d %T"

{{< /file-excerpt >}}


In this example the `daemon` is set to run every 60 seconds. Fetchmail is set to poll the `example.com` server every second interval, or every three minutes. At the same time, the `example.org` account will be polled every 20 intervals, or once every twenty minutes.

### Postmaster

The `set postmaster` option allows you to configure where otherwise undeliverable will be delivered. Given the following example:

{{< file-excerpt ".fetchmailrc" >}}
set postmaster "username"

poll email.example.com protocol pop3:
     username "username" password "dir3cti0n";
     username "fore" password "0rd3r";
     username "gigs" password "p@rty";

{{< /file-excerpt >}}


Assuming that there are system user accounts for `username` and `fore`, mail downloaded from these accounts will be deposited in `/var/mail/username` and `/var/mail/fore` respectively. However, if there is no system account for a `gigs` user this mail would be deposited in the `username` user's mail spool (i.e. `/var/mail/username`) because the `username` user is set as the postmaster for this fetchmail session.

### Logging

When invoked from the command line, `fetchmail` generates output regarding its activities to standard out. If this is undesirable behavior you can use the logging directives to specify an alternate record keeping behavior. Let us consider the following directives:

{{< file-excerpt ".fetchmailrc" >}}
set syslog set logfile "\~/logs/fetchmail.log"

{{< /file-excerpt >}}


The first directive tells fetchmail to store all logging information in the system log. The location of this log may vary depending on your system configuration, but is typically located in `/var/log/mail.log`. The `logfile` directive allows the user to specify a file in which to store logging information. In this example logs are kept in the `logs/` directory and `fetchmail.log` of the user's home directory for the user account that executes fetchmail.

## Additional Fetchmail Functionality

This document has only covered a minimal subset of fetcmhail's functionality. Indeed fetchmail is renowned for its extreme flexibility and versatility. This section will provide an overview of this functionality.

### Alternate Mail Protocols

Typically, fetchmail is used to retrieve email from POP3 mailboxes; however, it also contains support for alternate protocols. Supported protocols include IMAP, POP3 with Kerberos, and ESTMTP. Example syntax for displaying alternate protocols is as follows:

{{< file-excerpt ".fetchmailrc" >}}
poll email.example.com protocol imap:
     username "username" password "dir3cti0n";
poll mail.example.org protocol kpop:
     username "fore" password "0rd3r";
poll email.example.net protocol etrn:
     username "gigs" password "p@rty";
poll mail.example.info protocol auto:
     username "gigs" password "p@rty";

{{< /file-excerpt >}}


Fetchmail is able to deduce which variant of the IMAP protocol is used. The `KPOP` option forces fetchmail to authenticate to a POP3 protocol with Kerberos V4 authentication on port 1109. The `ETRN` option allows fetchmail to receive email with the ESMTP protocol. You can also specify `auto` as a protocol option. In this case, fetchmail will try to determine which protocol your server supports when connecting.

### Alternate Methods for Authentication

Fetchmail provides a number of alternate options for authenticating to your mail server, if you are uncomfortable storing your passwords in your `.fetchmailrc` file. First, fetchmail will look in a `~/.netrc` file for log in credentials, before prompting for passwords on the command line. An example `.netrc` file is as follows:

{{< file-excerpt ".netrc" >}}
machine email.example.com
        login username
        password d1r3ct1on
machine mail.example.org
        login jeff
        password d@nc3
machine mail.example.net
        login gigs
        p@RFI3s

{{< /file-excerpt >}}


The `ftp` UNIX utility also uses the `.netrc` file, so you can use this feature to avoid duplicating. If usernames are not provided in a `.netrc` file or in `.fetchmailrc`, fetchmail will try to connect to the remote server using the current user's username on the local system to connect to the remote server. The fetchmail program accepts alternate usernames with the `-u` option. This command takes the following syntax:

    fetchmail -u username example.com

In this example, fetchmail will connect with the username `username` to the server at `example.com`. All of these authentication options, including specifying credentials in the `.fetchmailrc` will allow fetchmail to successfully retrieve email. However, in contemporary deployments, specifying usernames and passwords in the `.fetchmailrc` file is the most popular and efficient option by far.

### Workflows with Fetchmail

The deployment profile of programs like `fetchmail` has changed a great deal in recent history. Where once users needed a program like fetchmail to retrieve email from their Internet service providers, it is now very plausible to run your own fully fledged email server. Fetchmail also predates the development and proliferation of web-based email and "Email as a Service" providers like Fastmail.fm and Google's Gmail offerings.

Nevertheless, programs like fetchmail remain useful in some contexts. Fetchmail is often used to retrieve email from email service providers and download this data to users' local machines. Other users deploy fetchmail as part of scripts or running in daemon mode to deliver mail to a small private IMAP service, for example. This makes it possible to access mail that is delivered to multiple addresses that are not hosted on the email gateway. Fetchmail makes it possible to centralize and collect email from a number of different sources into a single manageable archive, without needing to control the configuration and routing of mail on those remote servers. In this way, fetchmail remains a valuable and useful tool.

---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide shows how-to configure getmail to download email from remote servers.'
keywords: ["email", "getmail", "mda"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/getmail/']
modified: 2017-08-22
modified_by:
  name: Linode
published: 2010-02-01
title: Retrieve Email Using Getmail
external_resources:
 - '[Official Getmail Documentation](http://pyropus.ca/software/getmail/documentation.html)'
 - '[Mailfilter MDA](http://mailfilter.sourceforge.net/)'
 - '[Maildrop MDA](http://www.courier-mta.org/maildrop/)'
 - '[Procmail MDA](http://www.procmail.org/)'
---

Getmail is a simple mail retriever. In many ways, the software is a response to the complexity of [fetchmail](/docs/email/fetchmail/). Getmail provides a simple and efficient tool for downloading email from POP (Post Office Protocol) and IMAP (Internet Messaged Access Protocol) servers.

You can use getmail to download email from your Linode's mail server powered by [Citadel](/docs/email/citadel/) or [Dovecot](/docs/email/postfix/) or you can use getmail on your Linode to download email from one or more third-party mail providers (as long as POP or IMAP is supported) and deliver it to a local email gateway.

Before getting started with Getmail, we assume that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and the [administration basics guide](/docs/using-linux/administration-basics).

## Install Getmail

Before proceeding, make sure your system is up to date. If you're using Arch or Gentoo, you'll want to refresh your repositories. If you're using Debian, Ubuntu, CentOS, or Fedora, you'll want to update your repositories and upgrade all packages to their latest versions. Select from the following commands, depending on what operating system you're running:

Debian or Ubuntu:

    apt-get update
    apt-get upgrade --show-upgraded

CentOS or Fedora:

    yum update

Arch:

    pacman -Sy

Gentoo:

    emerge --sync

Since getmail is included by default in most distributions' software repositories, its installation is straightforward. Issue the following command to install getmail on:

Debian or Ubuntu:

    apt-get install getmail4

Gentoo:

    emerge getmail

Arch:

    pacman -S getmail

For CentOS, you will need to install the RPMForge Repo before you can install getmail. Download the rpmforge-release package. Choose either the 32-bit or the 64-bit version:

32 Bit:

    wget http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.2-2.el6.rf.i686.rpm

64 Bit:

    wget http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.2-2.el6.rf.x86_64.rpm

Install DAG's GPG key:

    rpm --import http://apt.sw.be/RPM-GPG-KEY.dag.txt

Verify the package you have downloaded:

    rpm -K rpmforge-release-0.5.2-2.el6.rf.*.rpm

Install the package:

    rpm -i rpmforge-release-0.5.2-2.el6.rf.*.rpm

Lastly, install getmail using yum:

    yum install getmail

With getmail installed successfully, you can begin to configure mail retrieval.

## Basic Getmail Configuration

All getmail configuration occurs in the `.getmail/` folder in the user's home directory. The configuration is stored in a `getmailrc` file. If you need to check multiple accounts, specify each account as a file beneath the `~/.getmail/` directory. Create the required directories and files, and set their permissions with the following commands:

    mkdir ~/.getmail/
    chmod 700 ~/.getmail/
    touch ~/.getmail/getmailrc

The following file provides a basic template for a getmail configuration file:

{{< file "~/.getmail/getmailrc" >}}
[retriever]
type = SimplePOP3SSLRetriever
server = pop.example.com
port = 995
username = foreman
password = s1d30fd4nc3r6

[destination]
type = Maildir
path = ~/mail/

[options]
delete = true
message_log = ~/.getmail/log-foreman-example

{{< /file >}}


In this example we see the following features:

-   Mail is downloaded using the POP3S, or POP3 with SSL method. Consider using the `SimpleIMAPSSLRetriever` for IMAP with SSL mail accounts. If your mail server does not support SSL, use the `SimplePOP3Retriever` or `SimpleIMAPRetriever` types.
-   The mail server, port number, and log in credentials are specified in the `[retriever]` directive. In this case, the server is located at `pop.example.com` and runs on port `110`. The account credentials are for the user `foreman` with the password `s1d30fd4nc3r6`.
-   The mail will be delivered into a `Maildir` formatted mailbox, located at `~/mail/`. Note that this will deliver mail into the `mail/` directory in the home directory (e.g. `/home/foreman/mail/`) of the user that runs `getmail`. Ensure that your Maildir exists before running `getmail` for the first time. Issue the following command to create a Maildir in `~/mail/` directory:

        mkdir -p ~/mail/cur/
        mkdir -p ~/mail/new/
        mkdir -p ~/mail/tmp/

-   The option `delete = true` tells getmail to remove the mail from the server after it retrieves messages. If you would like to simply copy the messages from the server and leave them intact on the server set this value to `false`.
-   A log of getmail operations is logged at `~/.getmail/log-foreman-example` in the home directory of the user who executes getmail.

Modify the required options to suit the needs of your desired deployment. This includes: retriever type, server information, authentication credentials, mailbox destinations and log locations. When your `~/.getmail/getmailrc` configuration is complete, you can run getmail by issuing the following command at a regular user prompt:

    getmail

Congratulations! You've successfully configured getmail in a basic mail delivery setup.

## Advanced Getmail Configuration

Getmail is capable of delivering mail in a number of different situations beyond just downloading email from a single mail account. This section provides an overview of several more advanced uses of getmail.

### Use an External Filtering Utility

If you want to use an external program to filter the email retrieved from getmail, modify the destination configuration options in the `getmailrc` file to resemble the following:

{{< file-excerpt "~/.getmail/getmailrc" >}}
[destination]
type = MDA_external
path = /usr/bin/procmail
arguments = ("-f", "%(sender)")

{{< /file-excerpt >}}


In this example, when getmail retrieves mail, it is passed to `procmail` for additional filtering rather than delivering directly to a Maildir. Procmail, like other mail delivery agents (MDAs) performs additional filtering after mail has been retrieved and before it is delivered to a users' mail store. You may use getmail with any MDA of your choice.

### Check Multiple Email Accounts

If you want to retrieve mail from more than one server, create a getmail configuration file for each server from which you need to download email. Then, when you call getmail, issue the command in the following form:

    getmail --rcfile getmailrc0 --rcfile getmailrc1 --rcfile /home/foreman/mail/getmailrc

You can specify as many `rcfiles` as you like on the command line in this format. If a path is not specified getmail assumes the files are located in the `~/.getmail/` directory. In the above example, the files `getmailrc0` and `getmailrc1` are located in the `~/.getmail/` directory.

The final file is located in the `/home/foreman/mail` directory and is specified with an absolute path. In this manner you may specify as many accounts as you need, and organize your configuration files with whatever system makes the most sense in context of your deployment.

### Check Email Regularly Using Cron

If you would like your system to check for email regularly, you can run the `getmail` command regularly with cron. For a more detailed explanation of cron, you may consider the [introduction to cron](/docs/linux-tools/utilities/cron) guide. To add the "cron job", issue the following command to edit your cronjobs:

    crontab -e

Add an entry to poll getmail every five minutes by adding the following line to the crontab:

{{< file-excerpt "crontab" >}}
*/5 * * * * getmail --quiet

{{< /file-excerpt >}}


Adding this line will cause getmail to retrieve new mail as specified in the `~/.getmail/getmailrc` file every five minutes. The `quiet` flag suppresses all non-error output, which is desirable when running in a "daemon" mode. You may specify any option for the cronjob that you can specify on the command line, including multiple `getmailrc` files. After the crontab is properly configured, save the file. Getmail will now retrieve new mail every five minutes as specified in the appropriate `getmailrc` files.

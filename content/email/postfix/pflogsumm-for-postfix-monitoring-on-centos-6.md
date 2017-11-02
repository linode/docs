---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Receive daily emails with Postfix mail server stats from Pflogsumm.'
keywords: ["pflogsumm", " postfix", " monitoring", " mail server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/postfix/pflogsumm-centos-6/']
contributor:
    name: Robert Accettura
modified: 2014-02-05
modified_by:
  name: Linode
published: 2014-02-05
title: Pflogsumm for Postfix Monitoring on CentOS 6
external_resources:
 - '[Pflogsumm](http://jimsun.linxnet.com/postfix_contrib.html)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

Pflogsumm is a simple Perl script that monitors your [Postfix](/docs/email/postfix) mail server's activity. This guide will show you how to install Pflogsumm on CentOS 6 and configure it to send you a daily email with your mail server stats.

 {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites

Make sure these prerequisites are installed:

-   [Postfix](/docs/email/postfix)
-   Perl 5.004
-   Perl's Date::Calc module

Perl 5.004 will most likely be installed by default. Run this command to install the **Date::Calc** module:

    sudo yum install perl-Date-Calc

Finally, you will need to locate your Postfix log. On most CentOS systems, this is `/var/log/maillog` by default.

## Installing Pflogsumm

In this section, you will install and configure Pflogsumm.

1.  Move to the `/usr/local` directory:

        sudo cd /usr/local/

2.  Use **curl** to download Pflogsumm:

        sudo curl -O http://jimsun.linxnet.com/downloads/pflogsumm-1.1.3.tar.gz

3.  Expand the files:

        sudo tar -xzf pflogsumm-1.1.3.tar.gz

4.  Rename the Pflogsumm directory:

        sudo mv pflogsumm-1.1.3 pflogsumm

5.  Make the Pflogsumm directory executable:

        sudo chmod +x pflogsumm/pflogsumm.pl

## Testing

Test the script by running the following command. Make sure you substitute **/var/log/maillog** with your actual Postfix log location.

    sudo perl /usr/local/pflogsumm/pflogsumm.pl /var/log/maillog

You will see a large amount of information regarding your mail server, which we'll go over in the next section.

## Reading Output

Your report output will contain the following information in an easy-to-read textual format perfect for email:

-   Total number of:
    :   -   Messages received, delivered, forwarded, deferred, bounced and rejected
        -   Bytes in messages received and delivered
        -   Sending and Recipient Hosts/Domains
        -   Senders and Recipients
        -   Optional SMTPD totals for number of connections, number of hosts/domains connecting, average connect time and total connect time

-   Per-Day Traffic Summary (for multi-day logs)
-   Per-Hour Traffic (daily average for multi-day logs)
-   Optional Per-Hour and Per-Day SMTPD connection summaries
-   Sorted in descending order:
    :   -   Recipient Hosts/Domains by message count, including:
            :   -   Number of messages sent to recipient host/domain
                -   Number of bytes in messages
                -   Number of defers
                -   Average delivery delay
                -   Maximum delivery delay

        -   Sending Hosts/Domains by message and byte count
        -   Optional Hosts/Domains SMTPD connection summary
        -   Senders by message count
        -   Recipients by message count
        -   Senders by message size
        -   Recipients by message size with an option to limit these reports to the top nn.

-   A Semi-Detailed Summary of:
    :   -   Messages deferred
        -   Messages bounced
        -   Messages rejected

-   Summaries of warnings, fatal errors, and panics
-   Summary of master daemon messages
-   Optional detail of messages received, sorted by domain, then sender-in-domain, with a list of recipients-per-message.
-   Optional output of "mailq" run

This list was taken from the [Pflogsumm](http://jimsun.linxnet.com/postfix_contrib.html) website, where you can read additional information about the output.

## Scheduling Reports with Cron

Now you'll set up a Cron job to run the Pflogsumm Perl script and send the mail server stats to you as a daily email. This is great for monitoring your mail server. The example below schedules the email for 1:01 PM every day. For details on how to customize the time the email is sent, you should read the [Cron](/docs/linux-tools/utilities/cron) article.

1.  Open the **root** user's Crontab by running the following command:

        sudo crontab -e

2.  Add the following line, being sure to replace **/var/log/maillog** with the mail server location, and <**YOUREMAIL@YOURDOMAIN.TLD*>\* with the email address where you want to receive the stats. It's usually a good idea to choose an email address that's not on this Postfix server.

    {{< file >}}
root's Crontab
{{< /file >}}

    {{< note >}}
If this is your first time using Cron, you will have to select your preferred text editor.
{{< /note >}}

3.  Save the changes to your Cron file. For **nano**, this is `Ctrl-x y`.

     {{< note >}}
Non-root users will not have permission to access the mail log.
{{< /note >}}

You will now receive daily emails with your Postfix mail server stats. It's a great way to keep track of what your server is doing.
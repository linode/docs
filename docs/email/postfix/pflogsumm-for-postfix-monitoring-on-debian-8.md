---
author:
  name: Hao Deng
  email: dommyet@gmail.com
description: 'Receive daily emails with Postfix mail server stats from Pflogsumm.'
keywords: 'pflogsumm, postfix, monitoring, mail server'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributor:
    name: Hao Deng
    link: https://www.dommyet.me
title: Pflogsumm for Postfix Monitoring on Debian 8
external_resources:
 - '[Pflogsumm](http://jimsun.linxnet.com/postfix_contrib.html)'
 - '[Pflogsumm for Postfix Monitoring on CentOS 6](https://www.linode.com/docs/email/postfix/pflogsumm-for-postfix-monitoring-on-centos-6)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

Pflogsumm is a simple Perl script that monitors your [Postfix](/docs/email/postfix) mail server's activity. This guide will show you how to install Pflogsumm on Debian 8 and configure it to send you a daily email with your mail server stats, and how to prevent Pflogsumm from double counting if your mail server has a content filter such as Amavis.

 {: .note }
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Prerequisites

You need to locate your Postfix log first. [Postfix](/docs/email/postfix) uses syslog to process its logging, therefore on Debian systems, it should be `/var/log/mail.log` by default.

You also need to install Pflogsumm from repository, run the following commands to do so.

    sudo apt-get update
    sudo apt-get install pflogsumm

## Testing

Test Pflogsumm by running the following command.

    pflogsumm /var/log/mail.log

You will see a large amount of information regarding your mail server, which we'll go over in the next section.

## Scheduling Reports with Cron

Now you'll set up a Cron job to run the Pflogsumm and send the mail server stats of the previous day to you as a daily email. This is great for monitoring your mail server. For details on how to customize the time the email is sent, you should read the [Cron](/docs/linux-tools/utilities/cron) article.

1.  Create a script in system-wide Cron job directory, for example **pflogsumm**:

        sudo nano /etc/cron.daily/pflogsumm

2.  Edit the script, make sure you replace **postmaster@example.com** with your desired address.

{: .file }
/etc/cron.daily/pflogsumm
:   ~~~ conf
    #!/bin/sh
    #
    # Send daily postfix log summaries
    #

    pflogsumm -d yesterday /var/log/mail.log | mail -s "Postfix log summaries" postmaster@example.com
    ~~~

3.  Save the changes. For **nano**, this is `Ctrl-x y`.

4.  Make the script executable:

        sudo chmod +x /etc/cron.daily/pflogsumm

You will now receive daily emails with your Postfix mail server stats of the previous day.

## Double counting

If you have a content filter such as Amavis working with the Postfix mail server, Pflogsumm will have double counting problem, every single received and delivered mail will be count twice.

This happens because as Postfix received a inbound mail, it delivers the mail to a content filter such as Amavis. Amavis will start processing the mail by verifying its DKIM signature or scanning with Spamassassin or ClamAV. After Amavis finishes the job, the mail is send back to Postfix ready to be delivered to user mailbox. Therefore for a single mail, Postfix has to receive and deliver it twice because of the content filter.

Unfortunately, Pflogsumm does not come with workaround solution. To prevent it from double counting, a script is needed to first delete the duplicated entries from the log file, then run Pflogsumm to parse and generate report using the procesed log file.

You should look into the actual `/var/log/mail.log` on your server and find the log entries related to Amavis, assuming your Amavis is listening to local port 10024 to receive mails, and Postfix listening to local port 10025 to receive scanned mails from Amavis.

{: .file-excerpt }
/var/log/mail.log
:   ~~~ conf
    Oct  1 05:07:51 mail postfix/smtp[11665]: 1B7CF20AB1: to=<mailinglist@example.com>, relay=127.0.0.1[127.0.0.1]:10024, delay=1.9, delays=0.46/0.01/0.01/1.4, dsn=2.0.0, status=sent (250 2.0.0 from MTA(smtp:[127.0.0.1]:10025): 250 2.0.0 Ok: queued as 8A5D720D85)
    ~~~

{: .file-excerpt }
/var/log/mail.log
:   ~~~ conf
    Oct  1 05:07:51 mail postfix/smtpd[11670]: connect from mail.example.com[127.0.0.1]
    ~~~

What we need to do now is to conclude two patterns that match these duplicated entries, then use them to delete these entries from the log file. Here is the script:

{: .file }
/etc/cron.daily/pflogsumm
:   ~~~ conf
    #!/bin/sh
    #
    # Send daily postfix log summaries
    #

    grep -v "MTA(smtp:\[127.0.0.1\]:10025)" /var/log/mail.log > /tmp/temp1_daily.txt
    grep -v "mail.neverlandusercontent.com\[127.0.0.1\]" /tmp/temp1_daily.txt > /tmp/temp2_daily.txt

    pflogsumm -d yesterday /tmp/temp2_daily.txt | mail -s "Postfix log summaries" postmaster@example.com

    rm -f /tmp/temp1_daily.txt /tmp/temp2_daily.txt
    ~~~

**Reversed Grep** is used twice to process the original log file to delete the entries related to Amavis. Save the script and you will now receive daily emails with your Postfix mail server stats of the previous day, with the double counting problem solved.

---
slug: logwatch-monitor-system-logs
description: "This guide shows you how to use logwatch, a Linux utility used to monitor system logs and create reports for critical and non-critical events."
keywords: ["logwatch", "security", "logging", "audit", "logs"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-08-12
modified_by:
  name: Elle Krout
published: 2015-08-12
title: "Monitor System Logs with Logwatch"
tags: ["monitoring"]
aliases: ['/uptime/monitoring/monitor-systems-logwatch/','/guides/monitor-systems-logwatch/','/server-monitoring/logwatch/ubuntu-12-04-precise-pangolin/','/uptime/monitoring/monitor-system-logs-with-logwatch-on-ubuntu-12-04-precise-pangolin/','/guides/monitor-system-logs-with-logwatch-on-ubuntu-12-04-precise-pangolin/','/server-monitoring/logwatch/ubuntu-10-10-maverick/','/uptime/monitoring/monitor-system-logs-with-logwatch-on-ubuntu-10-10-maverick/','/guides/monitor-system-logs-with-logwatch-on-ubuntu-10-10-maverick/','/server-monitoring/logwatch/ubuntu-10-04-lucid/','/uptime/monitoring/monitor-system-logs-with-logwatch-on-ubuntu-10-04-lucid/','/guides/monitor-system-logs-with-logwatch-on-ubuntu-10-04-lucid/','/server-monitoring/logwatch/fedora-14/','/uptime/monitoring/monitor-system-logs-with-logwatch-on-fedora-14/','/guides/monitor-system-logs-with-logwatch-on-fedora-14/','/uptime/monitoring/monitor-system-logs-with-logwatch-on-fedora-13/','/server-monitoring/logwatch/fedora-13/','/guides/monitor-system-logs-with-logwatch-on-fedora-13/','/uptime/monitoring/monitor-system-logs-with-logwatch-on-debian-5-lenny/','/server-monitoring/logwatch/debian-5-lenny/','/guides/monitor-system-logs-with-logwatch-on-debian-5-lenny/','/server-monitoring/logwatch/','/uptime/monitoring/logwatch-log-monitoring/','/guides/logwatch-log-monitoring/']
image: monitor-system-logs-logwatch.jpg
authors: ["Elle Krout"]
---

*Logwatch* is a log parsing program that analyzes and generates daily reports on your system's log activity. Logwatch does not provide real time alerts, but instead creates a digest organized by systems for ease of review. More advanced users can also pair Logwatch with custom analysis scripts to fine-tune their reports.

By default, Logwatch uses Sendmail to send digests.

{{< note respectIndent=false >}}
The steps required in this guide require root privileges. Be sure to run the steps below as **root**. If logged in as a superuser, it is recommended that you `su` into root. For more information on privileges see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Logwatch and Sendmail

### Ubuntu

1.  Update your system:

        sudo apt update && sudo apt upgrade

1.  Install Logwatch and Sendmail:

        sudo apt install logwatch sendmail

### Debian

1.  Update your system:

        sudo apt update && sudo apt upgrade

2.  Install Logwatch and Sendmail:

        sudo apt install logwatch sendmail-bin sendmail

### CentOS Stream, AlmaLinux, Rocky Linux, and Fedora

1.  Update your system:

        sudo dnf update

2.  Install Logwatch and Sendmail:

        sudo dnf install logwatch sendmail

3.  Start Sendmail:

        sudo systemctl start sendmail

### CentOS 7

1.  Update your system:

        sudo yum update

2.  Install Logwatch and Sendmail:

        sudo yum install logwatch sendmail

3.  Start Sendmail:

        sudo systemctl start sendmail

### Arch Linux

1.  Update your system:

        pacman -Syu

2.  Install Logwatch and Postfix, to replace the default Sendmail, which is not in Arch's repositories.

        pacman -S logwatch postfix

    Logwatch will prompt you to select which cron provider to use. Select the default, *cronie*.

    {{< note respectIndent=false >}}
Other SMTP clients can also be used for delivering Logwatch messages.
{{< /note >}}

3.  Edit the `/etc/postfix/main.cf` file to add your domain information, and allow for send-only mail, replacing `hostname.example.com` with your own hostname and domain:

    {{< file "/etc/postfix/main.cf" aconf >}}
myhostname = hostname.example.com
inet_interfaces = loopback-only
{{< /file >}}

    {{< note respectIndent=false >}}
Both A/AAAA, and MX records will need to be set for your domain.
{{< /note >}}

4.  Edit `/etc/postfix/aliases` to uncomment `root` and alias it to `root@hostname.example.com`, replacing `hostname.example.com` with your own hostname and domain:

    {{< file "/etc/postfix/aliases" >}}
root:           root@hostname.example.com
{{< /file >}}

5.  Run `newaliases` after editing the aliases list.

6.  Start postfix:

        systemctl start postfix

## Configure Logwatch

The default configuration file for Logwatch is located at `/usr/share/logwatch/default.conf/logwatch.conf`. This file contains information on which directories for Logwatch to track, how the digest is output, where the digest is sent to, and which services of which to keep track.

The following settings are the most comment configuration changes that will need to be made. Others can be found in the `logwatch.conf` file, explained in the comments.

{{< note respectIndent=false >}}
If Logwatch initially does not appear to run, within the `logwatch.conf` file, change the `Details` setting to `Med`.
{{< /note >}}

### Log Directories

By default, Logwatch digests will include all logs contained within `/var/log`. If any other directories contain logs, such as website directories, they can be added by including additional `LogDir` lines. For example:

{{< file "/usr/share/logwatch/default.conf/logwatch.conf" >}}
LogDir = /var/log
LogDir = /var/www/example.com/logs


{{< /file >}}


### Print Logwatch Digest to Console

The default Logwatch configuration will output the digest to your Linode's console. This is defined with the `Output` variable, which is set to `stdout` by default. This option is feasible if you are only planning on manually running Logwatch, but does not save or send the logs to you for later perusal.


### Email Logwatch Digest

The Logwatch digest can be sent to local users or external email addresses, in plain text or HTML formats.

{{< note respectIndent=false >}}
Prior to sending mail externally or locally ensure you have Sendmail installed on the Linode. If you choose to use a different MTA client, change the `mailer` line in the Logwatch configuration file to contain the directory of your chosen MTA, or alias `/usr/sbin/sendmail` to your MTA.

If using Arch, and you followed the above install instructions, Sendmail is already aliased to msmtp.
{{< /note >}}

1.  Change the `Output` value to `mail`. If you wish to receive the messages in HTML format change the `Format` value to `html`.

2.  Change the `MailTo` address to a valid email address, or local account user. For example, to send mail to the `root` user change the line to read:

    {{< file "/usr/share/logwatch/default.conf/logwatch.conf" >}}
MailTo = root


{{< /file >}}


3.  Change the `MailFrom` value to a valid email address, or to a local user. This can also be left as `Logwatch`.


### Save Logwatch Digest to File

Logwatch digests can also be saved to a file on your system.

1.  Change the `Output` value to `file`.

2.  Find and uncomment (remove the hashmark [**#**]) the `Filename` value. Set the path and filename in which you wish to save your Logwatch digests.


## Run Logwatch

### Run Logwatch Manually

Logwatch can be run manually at any time by inputting the `logwatch` command to your console. This command can be appended with a number of options to change the default output to suit your needs:

- `--detail`: Can be set to low, med, high, or any numerical values between 1 and 10. Defines how detailed the report will be.
- `--logdir`: The directory containing the log files you wish to gain reports on.
- `--service`: The service definition that you wish to report on.
- `--output`: How you want the file to be sent: Standard output (`stdout`), mail, or file.
- `--format`: Plain text or HTML.
- `--mailto`: The local user or email address to send the report to.

### Run Logwatch through Cron

Logwatch often works best when configured to run daily and send or save a report to view later. This can be achieved by setting Logwatch up to run as a cronjob.

1.  Open the crontab:

        crontab -e

2.  Add a line for Logwatch. The following code is configured to run at 00:30 each day:

    {{< file "/etc/crontab" >}}
30 0  * * *          /usr/sbin/logwatch


{{< /file >}}


    For more information on adjusting your crontab scheduling, reference our guide on [Scheduling Tasks with Cron](/docs/guides/schedule-tasks-with-cron/).

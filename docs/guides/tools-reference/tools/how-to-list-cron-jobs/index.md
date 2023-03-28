---
slug: how-to-list-cron-jobs
description: 'This guide explains how to display currently scheduled cron jobs, and list cron jobs satisfying various criteria.'
keywords: ['List cron job','View cron job','Display cron job','Cron job linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-14
modified_by:
  name: Linode
title: "List Cron Jobs on Linux"
title_meta: "How to List Cron Jobs on Linux"
external_resources:
- '[Wikipedia Cron Page](https://en.wikipedia.org/wiki/Cron)'
- '[Crontab Man Page](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html)'
- '[Ubuntu cron documentation](https://help.ubuntu.com/community/CronHowto)'
authors: ["Jeff Novotny"]
---

All Linux distributions are equipped with the `cron` utility, which allows users to schedule jobs to run at certain fixed times. Cron jobs can be scheduled at the user or root level, or by software applications. This guide explains how to view cron jobs on Linux and how to list cron jobs by user or schedule.

## Introduction to Cron Jobs

Cron jobs are typically used for recurring tasks such as maintenance, clean up, and backing up files. Every cron entry maps to a schedule and a specific command or script. The Linux system automatically runs these `cron` commands based on the specified schedule. Cron jobs can be associated with the root account or an individual user. Software applications also use the `cron` functionality to automatically schedule ongoing tasks.

On Linux, cron jobs are stored in various files, where each line in the file represents a different job. Every individual user has a file for their cron jobs. On Ubuntu, these files are found at `/var/spool/cron/crontabs`, but the location varies across Linux distributions. System-wide jobs are saved in the `/etc/crontab` file (which should not be used by individual users) or the various `etc/cron.*` files. System daemons and applications are expected to add their cron tasks to the `etc/cron.d` directory.

The schedule for a cron job is specified using a formal syntax. The initial five fields describe the minute, hour, day of the month, month, and day of the week when the job must run. There are also keywords, such as `@hourly`, for simplifying common entries. The `*` symbol is a wildcard meaning "always". This example demonstrates a sample `crontab` entry to run the `delete-cache` script every day at midnight.

{{< output >}}
0 0 * * * /opt/bin/delete-cache
{{< /output >}}

There are a variety of methods used to display the cron jobs. Cron jobs can be listed on a per-user or per-application basis. It is also possible to list all jobs sharing a specific schedule. These instructions are designed for Ubuntu 22.04, but are valid for most recent releases of Ubuntu. The `cron` utility works similarly in other Linux distributions, but the names and locations of the files might differ.

For more information about creating cron jobs, see the Linode guides to [Scheduling Cron Jobs](/docs/guides/schedule-tasks-with-cron/) and [Running Cron Jobs at Boot](/docs/guides/run-jobs-or-scripts-using-crontab-on-boot/). On Ubuntu systems, use the `man crontab` command to view user information.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Listing Active Cron Jobs

The Linux `cron` utility provides an easy method for listing all the active cron jobs. However, the method differs slightly between user jobs and system jobs.

### Listing Cron Jobs for the Active User

To list all cron jobs for the active user, run the `crontab -l` command while logged into the account. This displays the contents of the user's cron file. It prints the introductory file information along with any cron job entries. If user `x` does not have a `crontab` file, Ubuntu displays the message `no crontab for x`.

```command
crontab -l
```

In this example, the user has three jobs scheduled. One runs hourly, the second daily, and the third runs on the 15th day of every month.

{{< output >}}
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command
0 * * * * date >> ~/clock.txt
0 0 * * * mk_backup.exe
0 0 15 * * cleanup.py
{{< /output >}}

### Listing System-Wide Cron Jobs

The system-wide root cron jobs are located in the `/etc/crontab` file. The file contents can be displayed using any text editor, or utilities like `cat` and `more`. `sudo` is not required to display the system cron jobs.

```command
cat /etc/crontab
```

{{< output >}}
# /etc/crontab: system-wide crontab
# Unlike any other crontab you don't have to run the `crontab'
# command to install the new version when you edit this file
# and files in /etc/cron.d. These files also have username fields,
# that none of the other crontabs do.

SHELL=/bin/sh
# You can also override PATH, but by default, newer versions inherit it from the environment
#PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed
17 *	* * *	root    cd / && run-parts --report /etc/cron.hourly
25 6	* * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6	* * 7	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6	1 * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
#
{{< /output >}}

{{< note respectIndent=false >}}
The `crontab` command is not used to display the system-wide cron jobs. Additionally, the `etc/crontab` file should not be confused with the `crontab` account for the root user.
{{< /note >}}

##  Listing Cron Jobs by Time

Linux maintains directories for hourly, daily, weekly, and monthly cron jobs. These directories are located in the parent `/etc/` directory. Scripts can be placed inside these directories based on when they should run. For example, weekly scripts can be added to `/etc/cron.weekly/`. These are directories, not `crontab` files, so `ls` must be used to display the scripts. These commands do not list any user `crontab` entries running with these schedules.

### Listing Daily Cron Jobs

The daily cron scripts are found at `/etc/cron.daily/`. To view the daily cron jobs, use the following commands. Remember, these entries refer to scripts, not `crontab` entries.

```command
ls -l  /etc/cron.daily
```

{{< output >}}
total 24
-rwxr-xr-x 1 root root  376 Oct 26  2021 apport
-rwxr-xr-x 1 root root 1478 Apr  8 10:22 apt-compat
-rwxr-xr-x 1 root root  123 Dec  5  2021 dpkg
-rwxr-xr-x 1 root root  377 Jan 24 15:37 logrotate
-rwxr-xr-x 1 root root 1330 Mar 17 19:03 man-db
-rwxr-xr-x 1 root root  518 Feb  2  2021 sysstat
{{< /output >}}

To see the contents of one of these scripts, use the `cat` command or open the file in a text editor.

```command
cat /etc/cron.daily/man-db
```

### Listing Hourly Cron Jobs

The `/etc/cron.hourly/` directory contains the scripts that run hourly. To see a list of the hourly cron jobs, use the following command:

```command
ls -l  /etc/cron.hourly
```

{{< note respectIndent=false >}}
The output of this command for the hourly, weekly, and monthly directories resembles the previous example and is not displayed.
{{< /note >}}

### Listing Weekly Cron Jobs

Weekly cron jobs are found at `/etc/cron.weekly`. To see all weekly cron jobs, use this command:

```command
ls -l /etc/cron.weekly
```

### Listing Monthly Cron Jobs

Linux systems also allow users to run scripts on a monthly basis. These jobs are stored in `/etc/cron.monthly`. To display all monthly cron jobs, run the following command:

```command
ls -l /etc/cron.monthly
```

## Listing Cron Jobs by User

The `crontab` command can be used with the `-u` option to view all cron jobs owned by a specific user. Specify the command in the format `sudo crontab -l -u username`, replacing `username` with the actual user name of the user. `sudo` authorization is required to view the `crontab` file for another user.

```command
sudo crontab -l -u example-user
```

## How to List Cron Jobs by Software Application

Software applications can also register recurring tasks as cron jobs. Ubuntu designates the `/etc/cron.d` directory for this purpose. Each file in this directory contains a list of jobs in `crontab` format. To list the software-specific cron files, list the contents of the `cron.d` directory.

```command
ls -l /etc/cron.d
```

{{< output >}}
-rw-r--r-- 1 root root 201 Jan  8  2022 e2scrub_all
-rw-r--r-- 1 root root 396 Feb  2  2021 sysstat
{{< /output >}}

To see the contents of one of these files, use `cat` or a text editor.

```command
cat /etc/cron.d/sysstat
```

{{< output >}}
# The first element of the path is a directory where the debian-sa1
# script is located
PATH=/usr/lib/sysstat:/usr/sbin:/usr/sbin:/usr/bin:/sbin:/bin

# Activity reports every 10 minutes everyday
5-55/10 * * * * root command -v debian-sa1 > /dev/null && debian-sa1 1 1

# Additional run at 23:59 to rotate the statistics file
59 23 * * * root command -v debian-sa1 > /dev/null && debian-sa1 60 2
{{< /output >}}

{{< note respectIndent=false >}}
Do not modify these files or delete any entries from this directory. This directory is designed for the use of software applications, although other users can add cron jobs here. However, under normal circumstances Linux account users should add their cron jobs to their personal `crontab` file.
{{< /note >}}

## Conclusion

The Linux cron job infrastructure is used to automatically schedule recurring tasks. There are `crontab` files for each user account, including the root account. Users can display all active cron jobs using the `crontab -l` command. It is also possible to list system-wide cron jobs and view cron jobs that are scheduled hourly, daily, weekly, or monthly. For more information on the `cron` command on Linux, see the [cron man page](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html). The [Ubuntu cron documentation](https://help.ubuntu.com/community/CronHowto) also contains some helpful examples.
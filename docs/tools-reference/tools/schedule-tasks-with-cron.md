---
author:
  name: Linode
  email: docs@linode.com
description: 'Using cron to run programs at specified times on your Linux server.'
keywords: ["cron", "cron tutorial", "crontab", "cron linux", "administration", "linux", "systems", "automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/utilities/cron/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2009-12-15
title: Schedule Tasks with Cron
external_resources:
 - '[Wikipdia article on cron](http://en.wikipedia.org/wiki/Cron)'
 - '[Administration Basics](/docs/using-linux/administration-basics)'
---

`cron` is a classic utility found on Linux and UNIX systems for running tasks at predetermined intervals. Systems administrators and developers of Linux applications use `cron` for automating and managing recurring tasks.

Since `cron` is a standard component of modern Linux systems, this documentation is applicable regardless of your choice in distribution. If you are new to Linode we strongly recommend consulting the [getting started guide](/docs/getting-started/) and the [beginners guide](/docs/beginners-guide) to facilitate the setup and configuration of your server. If you're new to using Linux in general, you may find the [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts) helpful.

Before we get started, there are a couple of terms associated with `cron` that are non-obvious. First, the job or **cronjob** refers to the task, script, or application that `cron` runs. Second, **crontab** refers to each user's list of cronjobs.

![Title graphic](/docs/assets/schedule_tasks_with_cron_smg.png)

## Using crontab

To see a listing of the current user's cronjobs, issue the following command:

    crontab -l

This will produce, as standard output, something that resembles the following:

    */20 * * * * /home/username/bin/rebuild-dns-zones
    */40 * * * * /home/username/bin/delete-session-files >/dev/null 2>&1
    */10 * * * * rm /srv/example.com/app/session/*

In this example, `cron`:

-   Runs the `rebuild-dns-zones` script every twenty minutes.
-   Runs the `delete-session-files` script every forty minutes, and sends all output, including standard error, to `/dev/null`.
-   Deletes all files in the `/srv/example.com/app/session/` directory every ten minutes.

We'll explore each aspect of these commands later in this document. To edit the current user's `crontab` file, issue the following command:

    crontab -e

This will open a [text editor](/docs/tools-reference/linux-system-administration-basics/#edit-text) and allow you to edit the `crontab`.

## Basic cron Use

Entries in the `crontab` file come in a specific format. Each job is described on one and only one line. Each line begins with a specification of the interval, and ends with a command to be run at that interval.

`cronjobs` are executed with the default system shell, as if run from the command line prefixed with the following command:

    /bin/sh -c

You can run any kind of script, command, or executable with `cron`.

### Specifying Dates For cron

The syntax of `crontab` entries may be a bit confusing if you are new to `cron`. Each `cron` line begins with five asterisks:

    * * * * *

These represent the interval of repetition with which tasks are processed. In order, the asterisks represent:

1.  Minute
2.  Hour
3.  Day of month
4.  Month
5.  Day of week

**Minutes** are specified as a number from 0 to 59. **Hours** are specified as numbers from 0 to 23. **Days of the month** are specified as numbers from 1 to 31. **Months** are specified as numbers from 1 to 12. **Days of the week** are specified as numbers from 0 to 7, with Sunday represented as either/both 0 and 7.

### Special cron Operators

`cron` also provides a number of operators that allow you to specify more complex repetition intervals. They are:

-   The `/` operator "steps through" or "skips" a specified units. Therefore `*/3` in the hour field, will run the specified job, at 12:00 am, 3:00am, 6:00am, 9:00am, 12:00pm, 3:00pm, 6:00pm, and 9:00pm. A `*/3` in the "day of month" field, runs the given task on the 3rd, 6th, 9th, 12th, 15th, 18th, 21st, and 29th of every month.
-   The `,` operator allows you to specify a list of times for repetition. Comma separated lists of times must not contain a space.
-   The `-` operator specifies a range of values. `2-4` in the month field will run a task in Feburary, March, and April. `1-5` in the day of week field will run a task every weekday.

Fields in crontab entries are separated by spaces. If you are using special cron operators, be particularly careful to avoid unintentional spaces in your command.

### Special cron Syntax

There are also a number of special `cron` schedule shortcuts that you can use to specify common intervals to `cron`. These are specified on the `crontab` entry in place of the conventional five column date specification. These special interval statements are:

-   `@yearly` and `@annually` both run the specified task **every year** at 12:00am on the 1st of January. This equivalent to specifying `0 0 1 1 *` on the `crontab` line.
-   `@daily` and `@midnight` both run the cronjob **every day** at 12:00am. This is equivalent to the following `cron` syntax: `0 0 * * *`.
-   `@monthly` runs the job **once a month**, on the 1st, at 12:00am. In standard `cron` syntax this is equivalent to: `0 0 1 * *`.
-   `@weekly` runs the job **once a week** at 12:00am on Sunday. This is the same as specifying `0 0 * * 0` on the `crontab` line.
-   `@hourly` runs the job at the top of every hour. In standard `cron` syntax this is equivalent to: `0 * * * *`.
-   The `@reboot` statement runs the specified command once, at start up. Generally boot-time tasks are managed by scripts in the `/etc/inittab.d` files, but `@reboot` cronjobs may be useful for users who don't have access to edit the `init` scripts.

### Examples of crontab entries

Allow us to consider several of examples of `crontab` entries:

{{< file-excerpt >}}
crontab
{{< /file-excerpt >}}

> 45 16 1,15 \* \* /opt/bin/payroll-bi-monthly 45 4 \* \* 5 /opt/bin/payroll-weekly

In the first example, the `/opt/bin/payroll-bi-monthly` application is run at 4:45pm (`45 16`), on the 1st and 15th of every month (`1,15`). In the second example the `/opt/bin/payroll-weekly` is run at 4:45am (`45 4`) every Friday (`4`).

{{< file-excerpt >}}
crontab
{{< /file-excerpt >}}

> 1 0 \* \* \* /opt/bin/cal-update-daily 1 0 */2* \* /opt/bin/cal-update

These `cronjobs` will both run at 12:01am (`1 0`). The `cal-update-daily` job will run every day. The `cal-update` job will run will run every other day.

{{< file-excerpt >}}
crontab
{{< /file-excerpt >}}

> */20* \* \* \* /home/username/bin/rebuild-dns-zones 30 */2* \* \* /opt/bin/backup-static-files 0 \* \* \* \* /opt/bin/compress-static-files @hourly /opt/bin/compress-static-files

In the first example, the `rebuild-dns-zones` script is run every twenty minutes. In the second example, the `backup-static-files` program is run at 30 past the hour, (i.e. the "bottom of the hour") every other hour. In the final *two* examples, the `compress-static-files` script is run at the beginning of *every* hour.

## Advanced cron Use

Now that you have a more firm grasp of how to use `cron`, you may wonder how exactly to use cronjobs. As `cron` is simply a tool for scheduling jobs, it can be used in a number of different applications and situations to accomplish a wide variety of tasks. Consider the following possibilities:

### Running Jobs as Other Users

You can use `cron` to regularly run tasks as another user on the system. With root access, issue the following command:

    crontab -u www-data -e

This will allow you to edit the `crontab` for the `www-data` user. You can run cronjobs as the root user, or as any user on the system. This is useful if you want to restrict the ability of a script to write to certain files. While the ability to run jobs as system users is extremely powerful, it can sometimes be confusing to manage a large number of `crontab` files dispersed among a number of system users. Also, carefully consider the security implications of running a cronjob with more privileges than is required.

### Redirecting Job Output

By default, `cron` will send email to the executing user's email box with any output or errors that would normally be sent to the standard output or standard error. If you don't care about the standard output, you can redirect this to `/dev/null`. Append the following to the end of the line in your `crontab` file:

    >/dev/null

This will only redirect output that is sent to "standard out," (e.g. `stdout`). If your script generates an error, `cron` will still send the error to your email. If you want to ignore all output, even error messages, append the following to the end of the line in your `crontab` file:

    >/dev/null 2>&1

While this can clean up your email box of unwanted email, redirecting all output to `/dev/null` can cause you to miss important errors if something goes wrong and a cronjob begins to generate errors.

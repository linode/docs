---
author:
  name: Christopher S. Aker
  email: caker@linode.com
description: 'This tutorial will teach you how to generate and manipulate dates using the Linux date command including examples and help with formatting.'
keywords: ["date", "time", "linux commands", "shell", "timey wimey"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/date/','tools-reference/tools/linux-date-command/']
modified: 2017-08-21
modified_by:
  name: Linode
published: 2010-08-23
title: How to Use the Date Command in Linux
---

The `date` command displays the current date and time. It can also be used to display or calculate a date in a format you specify. The super-user (root) can use it to set the system clock.

![Learn how to use the linux date command](/docs/assets/linux_date_command_smg.jpg)

## Use the Linux date Command

When used without options, the `date` command displays the current system date and time, including the day of the week, month, time, timezone, and year:

    date
    Thu Apr 13 10:04:04 EDT 2017

To operate on a specific date, you can provide one with the `-d` flag:

    date -d "1974-01-04"
    Fri Jan  4 00:00:00 EST 1974

`date` has many display formatting options. Provide `date` with the formatting string by prefixing it with a plus sign:

    date +"Week number: %V Year: %y"
    Week number: 33 Year: 10

The format string is then output with each formatting token substituted by its value. `%V` is the formatting option to display the current week number, and `%y` represents the last two digits of the year.

### Formatting Options

Run `date --help` to display a list of formatting options.

Here's a small sample of the formatting tokens `date` supports:

| Token | Output |
| ------| ------------|
| %a    | locale's abbreviated weekday name (e.g., Sun) |
| %A    | locale's full weekday name (e.g., Sunday) |
| %b    | locale's abbreviated month name (e.g., Jan) |
| %B    | locale's full month name (e.g., January) |
| %c    | locale's date and time (e.g., Thu Mar  3 23:05:25 2005) |
| %F    | full date; same as %Y-%m-%d |
| %s    | seconds since 1970-01-01 00:00:00 UTC |

For more details, run `man date` to view the entire man page.

### Override the Timezone

By default, `date` uses the timezone defined in `/etc/localtime`. The environment variable `TZ` can be used to override this behavior. For example:

    $ TZ=GMT date
    Fri Aug 20 15:15:36 GMT 2010

Valid timezones are defined in `/usr/share/zoneinfo/`.

## Examples

The following examples illustrate how you can use the `date` command to find the date and time at various points in time.

    $ date -d now
    Wed Aug 18 16:47:31 EDT 2010

    $ date -d today
    Wed Aug 18 16:47:32 EDT 2010

    $ date -d yesterday
    Tue Aug 17 16:47:33 EDT 2010

    $ date -d tomorrow
    Thu Aug 19 16:46:34 EDT 2010

    $ date -d sunday
    Sun Aug 22 00:00:00 EDT 2010

    $ date -d last-sunday
    Sun Aug 15 00:00:00 EDT 2010

Other valid date time strings include: `last-week`, `next-week`, `last-month`, `next-month`, `last-year`, and `next-year`.

### Seconds from epoch

`date` has other surprising uses. For example, it can be used to convert a given date/time to Unix epoch time (seconds since 00:00:00, Jan 1, 1970) and back. The following example will show you the seconds from epoch to the current time:

    $ date +%s
    1282163756

### Seconds from epoch to the provided date/time

    $ date -d "1974-01-04" +"%s"
    126507600

### Convert epoch to a date

    $ date -d "UTC 1970-01-01 126507600 secs"
    Fri Jan  4 00:00:00 EST 1974

    $ date -d @126507600
    Fri Jan  4 00:00:00 EST 1974

### Determine which day of the week a given date was

    $ date -d "1974-01-04" +"%A"
    Friday

## Use date in Scripts and Commands

You can assign the output of `date` to a shell variable and then use it later in your scripts. For instance:

    $ STARTTIME=`date`
    $ echo $STARTTIME
    Fri Aug 20 11:46:48 EDT 2010
    $ sleep 5
    $ echo $STARTTIME
    Fri Aug 20 11:46:48 EDT 2010

You can also use date to create filenames that contain the current day:

    tar cfz /backup-`date +%F`.tar.gz /home/caker/

This would tar and gzip the files in `/home/caker/` into a filename called `backup-2010-08-20.tar.gz`.

## Set the Date Manually from the Linux Terminal

If your system is running `ntpd`, and you've [set your timezone correctly](/docs/getting-started#set-the-timezone), you shouldn't have to change this setting. However, if you find you need to set the system clock manually, use the `--set` option. In this example, we're setting the date and time to 9:14pm on Thursday, April 13, 2017:

    date --set="20170413 21:14"

---
author:
  name: Christopher S. Aker
  email: caker@linode.com
description: 'Generate and manipulate dates with the date command.'
keywords: 'date,time,linux commands,shell'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['linux-tools/common-commands/date/']
modified: Tuesday, April 19th, 2011
modified_by:
  name: Linode
published: 'Monday, August 23rd, 2010'
title: Linux Date Command
---

The `date` command displays the current date and time. It can also be used to display a date in a format you specify. The super-user (root) can use it to set the system clock.

Usage
-----

With no options, the `date` command displays the current system date and time, including day-of-week, month, time, timezone, and year. For example:

    $ date
    Wed Aug 18 16:24:44 EDT 2010

To operate on a specific date, you can provide one with the -d flag. For example:

    $ date -d "1974-01-04"
    Fri Jan  4 00:00:00 EST 1974

`date` has many display formatting options. Provide `date` with the formatting string by prefixing it with a plus sign as follows:

    $ date +"Week number: %V Year: %y"
    Week number: 33 Year: 10

The format string is then outputted with each formatting token substituted by its value. %V is the formatting option to display the current week number, and %y represents the last two digits of the year.

### Formatting Options

Here's a small sample of the formatting tokens `date` supports:

    %a   locale's abbreviated weekday name (e.g., Sun)
    %A   locale's full weekday name (e.g., Sunday)
    %b   locale's abbreviated month name (e.g., Jan)
    %B   locale's full month name (e.g., January)
    %c   locale's date and time (e.g., Thu Mar  3 23:05:25 2005)
    %F   full date; same as %Y-%m-%d
    %s   seconds since 1970-01-01 00:00:00 UTC

Running `date --help` will display the list of formatting options, while `man date` will show you the entire man page with much more detail.

### Override the Timezone

By default, `date` uses the timezone defined in `/etc/localtime`. The environment variable `TZ` can be used to override this behavior. For example:

    $ TZ=GMT date
    Fri Aug 20 15:15:36 GMT 2010

Valid timezones are defined in `/usr/share/zoneinfo/`.

Examples
--------

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

Using date in Scripts and Commands
----------------------------------

You can assign the output of `date` to a shell variable and then use it later in your scripts. For instance:

    $ STARTTIME=`date`
    $ echo $STARTTIME
    Fri Aug 20 11:46:48 EDT 2010
    $ sleep 5
    $ echo $STARTTIME
    Fri Aug 20 11:46:48 EDT 2010

You can also use date to create filenames that contain the current day.

    tar cfz /backup-`date +%F`.tar.gz /home/caker/

This would tar and gzip the files in `/home/caker/` into a filename called `backup-2010-08-20.tar.gz`.

Setting the Date
----------------

Setting the date should not be needed if you're running ntpd to keep good time and have set your timezone correctly. However, if you find you need to set the system clock, here's an example:

    date --set="20101231 23:59"




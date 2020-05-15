---
author:
  name: Jason McIntosh
  email: jmac@jmac.org
description: 'Learn how to install, configure, and run Bise, a simple analytics tool that measures the size of your website’s recurring readership.'
keywords: ["Bise", "Apache", "Analytics", "Blogging"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-05
modified_by:
  name: Linode
title: 'Measure your website's recurring readership with Bise'
contributor:
  name: Jason McIntosh
  link: https://jmac.org/
external_resources:
  - [Bise's README file, containing concise instructions](https://golang.org)'
  - [Meditations upon Bise's motivations and intended use, written by its developer](https://fogknife.com/2018-01-17-more-thoughts-on-counting-blog-readership.html)
---

## Introduction

**Bise** is a command-line program that generates simple reports about a website's *regular readership* size, as a concept distinct from total hits or unique visitors. It uses raw web server access logs as its input data, and bases its output on a number of user-configurable metrics.

Typical output looks like this:

    April 19 - May 03
    Source                 Uniques Regulars
    ---------------------------------------
    All visitors              1227      179
    RSS feed                   232      111
    JSON feed                    8        2
    Front page                 426       54
    From Twitter                39        1
    From web searches          910        6

Intended for use by bloggers and other people who self-host content on their own websites, Bise means to complement more thorough visitor-analysis tools with this simple, specific report regarding estimated audience size.

In this guide you will:

* [Set up Bise](#installing-bise) for use on your Linux-based system

* [See readership-level reports](#running-bise-from-the-command-line) based on your website's access logs

* [Fine-tune Bise](#configuring-bise) to match your posting frequency and desired readership data

* [Use Bise with Cron](#running-bise-as-a-cron-task) to have it mail you regular reports

* [Have Bise output JSON data](#getting-json-data-instead-of-a-table) that other programs can process

### Regarding "regular readers"

Bise defines a "regular reader" as any visitor website who meets the following criteria:

1. They do not appear to be an automated indexer, crawler, or some other kind of bot.

1. They spent at least two sessions visiting your website, with each session separated by at least a day, during the last couple of weeks or so.

Bise disregards bots because it is interested only in human readership. It then gives special consideration to those who visit more than once, in order to separate one-time or very occasional visitors from readers who, through their repeated visits, show a deeper and sustained interest in the work that your website posts.

So, if your website's logs indicate that a user at a certain IP address spent a few minutes on the first of the month clicking around your website a bit, and then returned to click around a bit more a week later, Bise would could that user as a "regular" when considering your website's readership during the first half of that month.

## Before you begin

To use Bise, you should have the following:

* A website running on Apache, or another web server configured to write out its access logs in Apache-style "common" or "combined" format.

* Access to those logs! Bise needs read-access to those log files in order to work. (See also the section "If you don't have read-access to the logs", below.)

* [Cpanminus](/docs/development/perl/manage-cpan-modules-with-cpan-minus), to install Bise's prerequisite libraries.

* [Cron](/docs/tools-reference/tools/schedule-tasks-with-cron/), if you plan to run Bise on a regular schedule. Any Linux machine almost certainly has this installed as well.

    Any other scheduling software that can run command-line scripts for you will also work, but this guide will demonstrate using Bise with Cron, specifically.

## Installing Bise

At the time of this writing, Bise lacks any kind of one-step installation solution; you will instead have to fetch it from its public source repository, and manage the installation of its prerequisites yourself. You can accomplish this in a handful of steps.

1. First, [visit Bise's page on GitHub](https://github.com/jmacdotorg/bise) and download or clone its source directory.

    Alternately, use `git` on the command line to clone it locally:
    

        git clone https://github.com/jmacdotorg/bise.git

    
1. Set your current working directory to your new `bise` directory.

        cd bise

1. Install Bise's prerequisites, using `cpanm`.

    **If you already have `cpanm` installed on your machine**, you can run this command to automatically install all the Perl libraries that Bise needs:
    
        sudo cpanm --installdeps .
    
{{ <note> }}
You can leave out the `sudo` from this command if you'd rather install the libraries in your home directory's `perl5/` subdirectory, rather than installing them as root at system level. Doing so may require you to follow up with a bit of further configuration to allow the `perl` command to subsequently load libraries from that location; if so, the command's output will print further guidance.
{{ </note> }}

    **If you do not have `cpanm` installed**, then you have two options:
    
    * Install `cpanm`, as described in [this Linode guide](/docs/development/perl/manage-cpan-modules-with-cpan-minus/). Then, run the command described above.
    
    **Or,**
    
    * Run this command, which will load and run a temporary copy of `cpanm` and then proceed to install Bise's dependencies:
    
            curl -fsSL https://cpanmin.us | perl - --installdeps .
            
1. Finally, let's create a fresh configuration file by copying the example config into the location that Bise expects to read its setup from.

        cp conf/conf-example.yaml conf/conf.yaml
    
Once you have completed all these steps, try running `bin/bise`. The program should run immediately, printing a table with a lot of zeros, and then exiting.

    April 18 - May 02
    Source                 Uniques Regulars
    ---------------------------------------
    All visitors                 0        0
    RSS feed                     0        0
    JSON feed                    0        0
    Front page                   0        0
    From Twitter                 0        0
    From web searches            0        0


If you see something that looks like the above output, then you have successfully installed Bise's prerequisite libraries, and set Bise up with a default configuration file.

You *could* further customize Bise's installation by by moving the executable file found in `bin/bise` to some other location, such as `/usr/local/bin`, and then subsequently running Bise with its `-c` command-line option in order to specify a config-file path. However, Bise by default looks for a config file in `../conf/config.yaml`, relative to its own location on the filesystem -- which happens to work nicely with its initial location at the end of the above steps. As such, the rest of this guide will assume you're running Bise out of `bin/bise`, within a copy of its cloned or downloaded source directory.

Returning our attention to that output table, we must admit that it doesn't look very interesting, reporting only rows of zeroes. This happened because we did not passed it any logs to analyze! Let's amend that in order to see some more meaningful data, and then we will proceed to explore Bise's configuration file so that we can fine-tune its behavior.

## Running Bise from the command line

To use Bise effectively, you've first got to **determine the location of your website's access logs**, and then **make sure you have read-access to them**.

### Locating your website's access logs

The location of your website's access logs varies by instance, of course, but you should be able to determine this through your web server software's configuration files.

On a typical Debian-based setup, Apache keeps its logs in `/var/log/apache2/`. Within that directory, access logs (as opposed to error logs) have filenames that begin with "`access.log`", followed (if not the current log file) a numerical suffix. Older access files may also be `gzip`ped, ending with a `.gz` extension.

And in this case, those are the files that Bise wants to know about!

### Running Bise with logs

To run Bise meaningfully, specify as command-line arguments the access logs that you'd like it to process. Bise is able to scan both plain-text and `gzip`-archived log files.

Bise will scan the provided log files in order from newest to oldest, stopping once it reaches reports from more than two weeks ago. As such, you can use a fileglob to hand it all the access logs in your log directory, and Bise will process only those files it needs to before delivering its report.

For example, to run Bise with all your Apache server's access logs, if they have the default locatins and filename conventions:

bin/bise /var/log/apache2/*access.log*

Bise may take a few moments to process this data, especially for websites that receive (and log) significant levels of traffic. On finishing its scan, Bise should print a table containing interestingly non-zero numbers, like this:

    April 19 - May 03
    Source                 Uniques Regulars
    ---------------------------------------
    All visitors              1227      179
    RSS feed                   232      111
    JSON feed                    8        2
    Front page                 426       54
    From Twitter                39        1
    From web searches          910        6
    
In this table, the "Uniques" column expresses a count of unique IP addresses that don't appear to belong to bots, and "Regulars" counts returning visitors meeting the criteria described earlier in this article.

The six rows in this table are defined by `conf/config.yml`. We'll take a closer look at that file below, and learn how to customize Bise's output.

### If you don't have read-access to the logs

By default, Apache keeps its log files visible to only administrative users, and your own user account might not have the right permissions to read them. If you receive a `Permission denied` error when attempting to view the contents of your machine's log directory (via e.g. `ls -l /var/log/apache2/`), then this is the case with your Apache setup, and Bise won't work until you resolve this situation.

There are myriad ways to address this, assuming that you have `sudo` rights on the machine. You could, for instance, simply run Bise as root, via the `sudo` command -- a relatively safe procedure, since Bise has a strictly read-only relationship with its data.

As a still-safer alternative, consider adding yourself to the group that owns `/var/log/apache2/`. On Debian, this group is typically `adm` -- so executing the command

```
sudo adduser [your-username] adm
```

should give you the necessary read-access to the log directory, after you log out of the system and log back in again.

## Configuring Bise

Open the file `conf/config.yaml` in your favorite text editor. As its main task, the file defines the rows appearing in Bise's output table: not just their presence and labels, but the criteria that each row uses to come up with its count of unique and regular non-bot vistors to your website. It also lets you define a couple of other, optional behavioral settings for Bise.

Let's step through the file's available configuration directives, starting with that report setup.

### Report configuration

Bise's default configuration file defines six rows, in some cases including comments that clarify its activity. If you're happy with the behavior of these rows, you can certainly continue using them as-is! You can also modify or remove these report-row directives, or add new ones, depending upon your needs.

There are four kinds of rows you can define, each of which works examines a different part of access logs to determine whether a given access should count towards its total or not.

#### A note about regular expressions

Three of the row types involve the use of regular expressions. You should probably understand [the basics of this text-processing technology](/docs/tools-reference/tools/how-to-grep-for-text-in-files/#regular-expression-overview) before defining your own row definitions with any of these types.

Note also that Bise ignores whitespace in regular expressions, allowing you to write more complex regexes with inline comments, as one of the examples below will illustrate.

#### path

Row definitions with a `test_type` set to "`path`" will count any access whose requested URL path matches the value of `test`, exactly.

The following row definition will count any request for the the path "`/`", and only that path, as a "Front page" access:

```
- label: Front page
  test_type: path
  test: /
```

#### path_regex

Counts any access whose requested URL path matches the value of `test`, evaluated as a regular expression.

The following "All vistors" definition from the default configuration will match any request path that ends in an HTML, XML, or JSON filename, as well as any request ending in "`/`". (Yes, this means that a request for "`/`", in the default configuration, will match both this row and the "Front page" one defined above.)

```
- label: All visitors
  test_type: path_regex
  test: |
    /$           # Match all requests whose paths end in '/'.
    |html$|htm$  # And all explicit requests for .html or .htm files.
    |xml$|json$  # And all requests for .xml (RSS) and .json (feed) files.
```

As noted earlier, Bise's regular expression processor ignores whitespace, allowing configuration files to add newlines and commentary in the middle of regexes like this.

#### referer_regex

Counts any access whose referer URL matches the value of `test`, evaluated as a regular expression.

This line from the default configuration will count as "From Twitter" any visit that arrived by way of a `t.co`-based URL (that is, one making use of Twitter's own URL shortening service, and thus which probably came from a link posted to Twitter).

```
- label: From Twitter
  test_type: referer_regex
  test: \bt\.co\b
```
#### agent_regex

Counts any access whose User-agent string matches the value of `test`, evaluated as a regular expression.

This configuration (not found in the default file) would add a row to the output table describing visits from clients using Perl's LWP toolkit:

```
- label: Using LWP
  test_type: agent_regex
  test: libwww-perl
```

### Other configuration options

The configuration file lets you set these optional directives as well:

* **days_to_consider**: The number of days that Bise will examine, when it scans logs. Defaults to 14 (that is, two weeks).

* **regular_interval_days**: The minimum number of days in between a visitor's earliest and most recent visits in order for Bise to count that visitor as a "regular" reader. Defaults to 1.

## Running Bise as a cron task

Once you have Bise creating meaningful reports about your website's readership, consider having your system run it regularly -- once a week, perhaps -- by way of [the Cron utility](/docs/tools-reference/tools/schedule-tasks-with-cron/). Because of Cron's normal behavior of mailing you anything a scheduled program prints as output or error messages, you can use Cron to receive an email updating you periodically about your website's readership levels.

This `crontab` line will run Bise at 12 AM every Monday, for example, mailing you the results:

```
0 0 * * 1 /home/your-username/bise/bin/bise /var/log/apache2/access.log*
```

You will want to tune the precise syntax of the command to your own Bise setup, of course.

## Getting JSON data instead of a table

Bise can output a JSON data structure instead of a plain-text table, allowing you to feed its results as data into other programs. Accomplishing this is as easy as running the `bise` program with an additional `-j` flag:

```
{"start_time":"2020-04-20T18:02:18","reports":[{"uniques":1213,"regulars":155,"label":"All visitors"},{"uniques":226,"label":"RSS feed","regulars":103},{"uniques":11,"label":"JSON feed","regulars":2},{"uniques":426,"label":"Front page","regulars":46},{"uniques":33,"regulars":0,"label":"From Twitter"},{"uniques":917,"label":"From web searches","regulars":5},{"uniques":2,"label":"Using LWP","regulars":0}],"end_time":"2020-05-04T18:02:18"}
```

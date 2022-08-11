---
slug: measure-your-websites-recurring-readership-with-bise
author:
  name: Jason McIntosh
  email: jmac@jmac.org
description: "Learn how to install, configure, and run Bise, a simple analytics tool that measures the size of your website’s recurring readership."
og_description: "Learn how to install, configure, and run Bise, a simple analytics tool that measures the size of your website’s recurring readership."
keywords: ["Bise", "Apache", "Analytics", "Blogging"]
tags: ["web server","apache","analytics"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-08-17
modified_by:
  name: Linode
title: "How to Measure a Website's Recurring Readership with Bise"
h1_title: "Measuring your Website's Recurring Readership with Bise"
enable_h1: true
image: MeasureWebsiteRecReader_Bise.png
contributor:
  name: Jason McIntosh
  link: https://jmac.org/
external_resources:
  - "[Bise's README file, containing concise instructions](https://github.com/jmacdotorg/bise/blob/master/README.md)"
  - "[Meditations upon Bise's motivations and intended use, written by its developer](https://fogknife.com/2018-01-17-more-thoughts-on-counting-blog-readership.html)"
aliases: ['/web-servers/apache/measure-your-websites-recurring-readership-with-bise/']
---

## Introduction

**Bise** is a command-line program that generates simple reports about a website's [*regular readership*](#regular-readers) size, as a concept distinct from total hits or unique visitors. It uses raw web server access logs as its input data, and bases its output on a number of user-configurable metrics.

Typical output looks like this:

{{< output >}}
April 19 - May 03
Source                 Uniques Regulars
---------------------------------------
All visitors              1227      179
RSS feed                   232      111
JSON feed                    8        2
Front page                 426       54
From Twitter                39        1
From web searches          910        6
{{< /output >}}

{{< note >}}
Bise assumes that the logs it analyzes are written in the [Common Log Format](https://en.wikipedia.org/wiki/Common_Log_Format). For example, Apache writes logs in this format by default.
{{< /note >}}

Bise is intended for use by bloggers and other people who self-host content on their own websites. It aims to complement more thorough visitor-analysis tools with this simple, specific report regarding estimated audience size.

In this guide you will:

* [Set up Bise](#installing-bise) for use on your Linux-based system

* [See readership-level reports](#running-bise-from-the-command-line) based on your website's access logs

* [Fine-tune Bise](#configuring-bise) to match your posting frequency and desired readership data

* [Use Bise with Cron](#running-bise-as-a-cron-task) to have it mail you regular reports

* [Have Bise output JSON data](#getting-json-data-instead-of-a-table) that other programs can process

### Regular Readers

Bise defines a *regular reader* as any visitor website who meets the following criteria:

1. They do not appear to be an automated indexer, crawler, or some other kind of bot.

1. They spent at least two sessions visiting your website, with each session separated by at least a day, during the last couple of weeks or so.

Bise disregards bots because it is interested only in human readership. It then gives special consideration to those who visit more than once, in order to separate one-time or very occasional visitors from readers who, through their repeated visits, show a deeper and sustained interest in the work that your website posts.

So, if your website's logs indicate that a user at a certain IP address spent a few minutes on the first of the month clicking around your website a bit, and then returned to click around a bit more a week later, Bise would consider that user as a "regular" when analyzing your website's readership during the first half of that month.

## Before You Begin

To use Bise, you should have the following:

* A website running on Apache, or another web server configured to write out its access logs in the Common Log Format. Visit the [Apache section](/docs/web-servers/apache/) for help with installing Apache.

* Access to those logs! Bise needs read-access to those log files in order to work. The [If You Don't Have Read-Access to the Logs](#if-you-don-t-have-read-access-to-the-logs) section will provide suggestions if you don't currently have read access.

* [Cpanminus](/docs/development/perl/manage-cpan-modules-with-cpan-minus), to install Bise's prerequisite libraries.

* [Cron](/docs/guides/schedule-tasks-with-cron/), if you plan to run Bise on a regular schedule. Any Linux machine almost certainly has this installed as well.

    {{< note >}}
Any other scheduling software that can run command-line scripts for you will also work, but this guide will demonstrate using Bise with Cron, specifically.
{{< /note >}}

## Installing Bise

At the time of this writing, Bise lacks any kind of one-step installation solution. You will instead have to fetch it from its public source repository and manage the installation of its prerequisites yourself:

1. First, [visit Bise's page on GitHub](https://github.com/jmacdotorg/bise) and [download or clone its source directory](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).

    Alternately, use `git` on the command line to clone it locally:


        git clone https://github.com/jmacdotorg/bise.git

    {{< note >}}
You can follow the [How to Install Git](/docs/guides/how-to-install-git-on-linux-mac-and-windows/) guide if `git` is not installed on your system.
{{< /note >}}

1. In your terminal, set your current working directory to your new `bise` directory:

        cd bise

1. Create a fresh configuration file by copying the example config that's included in the cloned repository:

        cp conf/conf-example.yaml conf/conf.yaml

    {{< note >}}
By default, Bise expects to read its setup configuration from the `conf/conf.yaml` location. This will be explained further in the [Test Bise](#test-bise) section.
{{< /note >}}

### Install Prerequisites

Install Bise's prerequisites using `cpanm`:

- **If you already have `cpanm` installed on your machine**, you can run this command to automatically install all the Perl libraries that Bise needs:

        sudo cpanm --installdeps .

- **If you do not have `cpanm` installed**, then you have two options:

    * Install `cpanm`, as described in [this Linode guide](/docs/guides/manage-cpan-modules-with-cpan-minus/). Then, run the command described above.

    * Run this command, which will load and run a temporary copy of `cpanm` and then proceed to install Bise's dependencies:

            curl -fsSL https://cpanmin.us | perl - --sudo --installdeps .

{{< note >}}
You can leave out the `sudo` command or the `--sudo` option from the above commands. If you do, the libraries will be installed in your home directory's `perl5/` subdirectory, rather than installing them as root at system level. Doing so may require further configuration to allow `perl` to load libraries from that location. When run without `sudo`, the install command's output will show this further guidance.
{{< /note >}}

### Test Bise

The cloned repository contains a `bin/` folder, and the Bise binary is located in this folder. Once you have completed the steps in the previous section, try running:

    bin/bise

The program should run immediately, printing a table with a lot of zeros, and then exiting:

{{< output >}}
April 18 - May 02
Source                 Uniques Regulars
---------------------------------------
All visitors                 0        0
RSS feed                     0        0
JSON feed                    0        0
Front page                   0        0
From Twitter                 0        0
From web searches            0        0
{{< /output >}}

If you see something that looks like the above output, then you have successfully installed Bise's prerequisite libraries and set Bise up with a default configuration file.

By default, Bise looks for a config file in `../conf/conf.yaml`, relative to its own location on the filesystem. In your cloned repository, you previously created a configuration file in this location. So, the command runs as expected.

You could further customize Bise's installation by moving the executable file found in `bin/bise` to some other location, such as `/usr/local/bin`. You would then need to run Bise with its `-c` command-line option. This option specifies a config-file path.

{{< note >}}
The rest of this guide will assume you're running Bise out of `bin/bise`, within the copy of its cloned or downloaded source directory.
{{< /note >}}

## Running Bise from the Command Line

Returning our attention to the output table from the previous section, we must admit that it doesn't look very interesting, reporting only rows of zeroes. This happened because we did not pass it any logs to analyze! Let's amend that in order to see some more meaningful data. Then we will proceed to [explore Bise's configuration file](#configuration-bile) in the next section so that we can fine-tune its behavior.

To use Bise effectively, you need to:

- Determine the location of your website's access logs, and then:
- Make sure you have read-access to them

### Locating your Website's Access Logs

The location of your website's access logs varies by instance. On a typical Debian-based setup, Apache keeps its logs in `/var/log/apache2/`. On CentOS, Apache logs are kept in `/var/log/httpd/`. If your logs are not in either of these directories, then you should be able to determine their location through your web server software's configuration files.

Within that directory, access logs (as opposed to error logs) have filenames that begin with `access.log`. Past access logs will have a numerical suffix in the filename. Older access files may also be `gzip`-archived, ending with a `.gz` extension. These are the files that Bise wants to know about.

### Running Bise with Logs

Bise accepts the location of your access logs as a command line argument. Bise is able to scan both plain-text and `gzip`-archived log files.

Bise will scan the provided log files in order from newest to oldest. It will stop once it reaches reports from more than two weeks ago. You can use a [fileglob](https://en.wikipedia.org/wiki/Glob_(programming)) to hand it all the access logs in your log directory. Bise will process only those files it needs to before delivering its report.

For example, this command will run Bise with all your Apache server's access logs:

    bin/bise /var/log/apache2/*access.log*

{{< note >}}
This example assumes that your access logs have the default locations and filename conventions.
{{< /note >}}

Bise may take a few moments to process this data, especially for websites that receive (and log) significant levels of traffic. On finishing its scan, Bise should print a table containing interesting non-zero numbers, like this:

{{< output >}}
April 19 - May 03
Source                 Uniques Regulars
---------------------------------------
All visitors              1227      179
RSS feed                   232      111
JSON feed                    8        2
Front page                 426       54
From Twitter                39        1
From web searches          910        6
{{< /output >}}

In this table, the `Uniques` column expresses a count of unique IP addresses that don't appear to belong to bots. The `Regulars` column counts returning visitors meeting the criteria [described earlier in this article](#regular-readers).

Bise's output can be customized. The six rows in this table are defined by `conf/conf.yaml`. We'll take a closer look at that file in the [Configuring Bise](#configuring-bise) section.

### If You Don't Have Read-Access to the Logs

By default, Apache keeps its log files visible to only administrative users. Your own user account might not have the right permissions to read them. Bise won't work until you resolve this situation.

{{< note >}}
If you receive a `Permission denied` error when attempting to view the contents of your machine's log directory, then this is the case with your Apache setup:

    ls -l /var/log/apache2/
{{< /note >}}

There are several ways to address this. These two methods assume that you have `sudo` rights on the machine:

- You could run Bise as root, via the `sudo` command. This is a relatively safe procedure, since Bise has a strictly read-only relationship with its data.

- As a safer alternative, you could add yourself to the group that owns `/var/log/apache2/`. On Debian, this group is typically `adm`. Executing this command should give you the necessary read-access to the log directory:

        sudo adduser [your-username] adm

    {{< note >}}
After adding yourself to the group, you will need to log out of the system and log back in again. Then, you can run Bise successfully.
{{< /note >}}

## Configuring Bise

Open the file `conf/conf.yaml` in your favorite text editor. As its main task, the file defines the rows appearing in Bise's output table. This includes:

- Each row's presence in Bise's output
- The row's label
- The criteria that each row uses to come up with its count of unique and regular non-bot visitors to your website

It also lets you define a couple of other, optional behavioral settings for Bise.

### Default Configuration

Bise's default configuration file defines six rows. On some lines, it includes comments that clarify its activity:

{{< file "conf/conf.yaml" yaml >}}
reports:
    - label: All visitors
      test_type: path_regex
      test: |
        /$           # Match all requests whose paths end in '/'.
        |html$|htm$  # And all explicit requests for .html or .htm files.
        |xml$|json$  # And all requests for .xml (RSS) and .json (feed) files.

    - label: RSS feed
      test_type: path
      test: /atom.xml

    - label: JSON feed
      test_type: path
      test: /feed.json

    - label: Front page
      test_type: path
      test: /

    - label: From Twitter
      test_type: referer_regex
      test: \bt\.co\b # Match all reqs referred from Twitter's "t.co" URLs.

    - label: From web searches
      test_type: referer_regex
      test: \bgoogle.com|\bduckduckgo.com|\bbing.com
{{< /file >}}

If you're happy with the behavior of the default rows, you can certainly continue using them as-is! You can also modify or remove these report-row directives, or add new ones, depending upon your needs.

There are four kinds of rows you can define, each of which examines a different part of your access logs. These correspond to the values for the `test_type` parameter: [path](#test-type-path), [path_regex](#test-type-path-regex), [referer_regex](#test-type-referer-regex), and [agent_regex](#test-type-agent-regex).

{{< note >}}
Three of the row types involve the use of regular expressions. You should probably understand [the basics of this text-processing technology](/docs/tools-reference/tools/how-to-grep-for-text-in-files/#regular-expression-overview) before defining your own row definitions with any of these types.

Note also that Bise ignores whitespace in regular expressions, allowing you to write more complex regexes with inline comments, as one of the examples below will illustrate.
{{< /note >}}

Let's step through the file's available `test_type` configuration directives, and then examine the [other configuration options](#other-configuration-options).

### test_type: path

Row definitions with a `test_type` set to `path` will count any access whose requested URL path matches the value of `test`, exactly.

The following row definition will count any request for the path `/`, and only that path, as a "Front page" access:

{{< file "" yaml >}}
- label: Front page
  test_type: path
  test: /
{{< /file >}}

### test_type: path_regex

Counts any access whose requested URL path matches the value of `test`, evaluated as a regular expression.

The following "All visitors" definition from the default configuration will match any request path that ends in an HTML, XML, or JSON filename, as well as any request ending in `/`. This means that a request for `/`, in the default configuration, will match both this row and the "Front page" one defined above.

{{< file "" yaml >}}
- label: All visitors
  test_type: path_regex
  test: |
    /$           # Match all requests whose paths end in '/'.
    |html$|htm$  # And all explicit requests for .html or .htm files.
    |xml$|json$  # And all requests for .xml (RSS) and .json (feed) files.
{{< /file >}}

As noted earlier, Bise's regular expression processor ignores whitespace, allowing configuration files to add newlines and commentary in the middle of regexes like this.

### test_type: referer_regex

Counts any access whose referer URL matches the value of `test`, evaluated as a regular expression.

This line from the default configuration will count any visit that arrived by way of a `t.co`-based URL as "From Twitter". `t.co` is Twitter's own URL shortening service. Therefore, a matching request probably came from a link posted to Twitter.

{{< file "" yaml >}}
- label: From Twitter
  test_type: referer_regex
  test: \bt\.co\b
{{< /file >}}

### test_type: agent_regex

Counts any access whose User-agent string matches the value of `test`, evaluated as a regular expression.

This configuration (not found in the default file) would add a row to the output table describing visits from clients using [Perl's LWP toolkit](https://metacpan.org/pod/LWP):

{{< file "" yaml >}}
- label: Using LWP
  test_type: agent_regex
  test: libwww-perl
{{< /file >}}

### Other configuration options

The configuration file lets you set these optional directives as well:

* `days_to_consider`: The number of days that Bise will examine when it scans logs. Defaults to 14 (that is, two weeks).

* `regular_interval_days`: The minimum number of days in between a visitor's earliest and most recent visits in order for Bise to count that visitor as a "regular" reader. Defaults to 1.

## Running Bise as a cron Task

Once you have Bise creating meaningful reports about your website's readership, consider having your system run it regularly. For example, you could automatically run the report once a week. The [Cron utility](/docs/guides/schedule-tasks-with-cron/) can be used to schedule this task.

Cron's normal behavior is to mail you anything a scheduled program prints as output or error messages. So, you can use Cron to receive periodic emails about your website's readership levels.

For example, this `crontab` line will run Bise at 12AM every Monday and mail you the results:

    0 0 * * 1 /home/your-username/bise/bin/bise /var/log/apache2/access.log*

You will want to tune the precise syntax of the command to your own Bise setup, of course.

## Getting JSON data instead of a table

Bise can output a JSON data structure instead of a plain-text table, allowing you to feed its results as data into other programs. Accomplishing this is as easy as running the `bise` program with an additional `-j` flag.

The output will look similar to this:

{{< output >}}
{
    "start_time":"2020-04-20T18:02:18",
    "reports":[
        {
            "uniques":1213,
            "regulars":155,
            "label":"All visitors"
        },
        {
            "uniques":226,
            "label":"RSS feed",
            "regulars":103
        },
        {
            "uniques":11,
            "label":"JSON feed",
            "regulars":2
        },
        {
            "uniques":426,
            "label":"Front page",
            "regulars":46
        },
        {
            "uniques":33,
            "regulars":0,
            "label":"From Twitter"
        },
        {
            "uniques":917,
            "label":"From web searches",
            "regulars":5
        },
        {
            "uniques":2,
            "label":"Using LWP",
            "regulars":0
        }
    ],
    "end_time":"2020-05-04T18:02:18"
}
{{< /output >}}

{{< note >}}
This example output has been formatted with line breaks and whitespace. By default, your output will appear as a single line.
{{< /note >}}
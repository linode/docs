---
slug: how-to-use-sar
author:
  name: Steven J. Vaughan-Nichols
  email: sjvn@vna1.com
description: "This guide shows you the basics of sar, the Linux system activity reporter, including installation, configuration, and basic commands."
keywords: ['sar command in linux']
tags: ["linux","monitoring"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-19
image: UseSystemActivityReporter.png
modified_by:
  name: Linode
title: "How to Use the System Activity Reporter (sar)"
h1_title: "Using the System Activity Reporter (sar)"
enable_h1: true
contributor:
  name: Steven J. Vaughan-Nichols
  link: http://www.twitter.com/sjvn
---

The System Activity Reporter ([Sar](https://linux.die.net/man/1/sar)) is a utility program for analyzing Linux system performance. Sar is a do-it-all monitoring tool that is part of the [Sysstat system resource utilities package](https://github.com/sysstat/sysstat). Linux administrators should learn sar for its wide range of utility features. It measures CPU activity; memory/paging; interrupts; device load; network; process and thread allocation; and swap space utilization. Data is gathered in the `/proc` filesystem. By default, sar collects data once for every 10-minute mark of each hour. This guide shows you how to install and configure sar on your Debian or Ubuntu Linux system. You also learn several useful commands to get you started collecting data about your Linux system's activity.

## Before You Begin

If you are using a Linode, make sure you run the steps in this section to configure your Linode, secure your server, and update your system's packages.

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

## Install and Configure sar

The open-source sar program is frequently used, but it's not included in most Linux distributions. You must install it as part of the `sysstat` package. This section shows you how to install sar on the Debian/Ubuntu Linux distributions.

1. Install sar, if it is not already installed on your system:

        sudo apt-get install sysstat

1. Sar must be enabled before it can begin to collect data. Using your preferred text editor, open the `/etc/default/sysstat` configuration file, and change the value of `ENABLED` to `true`.

    {{< file "/etc/default/sysstat" >}}
#
# Default settings for /etc/init.d/sysstat, /etc/cron.d/sysstat
# and /etc/cron.daily/sysstat files
#

# Should sadc collect system activity informations? Valid values
# are "true" and "false". Please do not put other values, they
# will be overwritten by debconf!
ENABLED="true"
{{</ file >}}


1. Other sar configuration data is kept in the files `/etc/cron.d/sysstat` and `/etc/sysstat/sysstat`. The defaults should work well for you, but at some point you may want to change them. You can modify these files to update your settings. View your current sar settings to verify that the default values work for your desired configuration:

        sudo cat /etc/cron.d/sysstat
        sudo cat /etc/sysstat/sysstat


    A typical `/etc/cron.d/sysstat` file resembles the following example:

    {{< file "/etc/cron.d/sysstat" >}}
# The first element of the path is a directory where the debian-sa1
# script is located
PATH=/usr/lib/sysstat:/usr/sbin:/usr/sbin:/usr/bin:/sbin:/bin

# Activity reports every 10 minutes everyday
5-55/10 * * * * root command -v debian-sa1 > /dev/null && debian-sa1 1 1

# Additional run at 23:59 to rotate the statistics file
59 23 * * * root command -v debian-sa1 > /dev/null && debian-sa1 60 2
{{</ file >}}

    The most commonly modified variable is the frequency setting for how often sar runs. It is controlled by the line:

    {{< file "/etc/cron.d/sysstat" >}}
...
5-55/10 * * * * root command -v debian-sa1 > /dev/null && debian-sa1 1 1
...
{{</ file >}}

    By default, the `debian-sa1` script runs every 10 minutes and collects sar data for historical reference. This data is written to the `/var/log/sysstat/saXX` file, where `XX` is the day of the month. For example, if today is the 24th day of the month, `sa1` writes the sar data to `/var/log/sysstat/sa24`. To change the logging frequency to one minute, change `5-55/10` to `5-55/1`. To make it 2 minutes, change it to `5/55/2`, and so on.

    {{< note >}}
Note that the `/var/log/sysstat/saXX` is a binary file; a text editor can't display these files properly.
{{</ note >}}

    Frequently-used variables are set in the `/etc/sysstat/sysstat` file. These include the length of time log files should be kept; when log files should be compressed; and which compression algorithm should be used. The example below displays a typical `/etc/sysstat/sysstat` file:

    {{< output >}}
# sysstat configuration file. See sysstat(5) manual page.

# How long to keep log files (in days).
# Used by sa2(8) script
# If value is greater than 28, then use sadc's option -D to prevent older
# data files from being overwritten. See sadc(8) and sysstat(5) manual pages.
HISTORY=7

# Compress (using xz, gzip or bzip2) sa and sar files older than (in days):
COMPRESSAFTER=10

# Parameters for the system activity data collector (see sadc(8) manual page)
# which are used for the generation of log files.
# By default contains the `-S DISK' option responsible for generating disk
# statisitcs. Use `-S XALL' to collect all available statistics.
SADC_OPTIONS="-S DISK"

# Directory where sa and sar files are saved. The directory must exist.
SA_DIR=/var/log/sysstat
{{</ output >}}


## Using sar

You can run sar both as an interactive program and in shell programs. There are two ways to run sar:

- `sar` followed by an option, without a saXX data file. This command displays the current day's saXX data to the standard output (`stdout`).
- `sar` followed by an option, and additionally specifying a saXX data file using the `-f` flag. This reports the performance data for that particular day.

1. Run sar using one of its collected data files. Ensure you replace the `sa24` with a sar data file that exists on your system. The number corresponds to the day of the month for which the data was collected. The example command displays the cumulative real-time CPU usage of all CPU cores on the 24th day of the current month:

        sudo sar -u -f /var/log/sysstat/sa24

    The sar command returns a similar output:

    {{< output >}}
Linux 4.19.0-13-amd64 (li900-72) 	02/19/2021 	_x86_64_	(2 CPU)

01:45:01 PM     CPU     %user     %nice   %system   %iowait    %steal     %idle
01:55:01 PM     all      0.13      0.00      0.07      0.01      0.01     99.78
02:05:01 PM     all      0.13      0.00      0.06      0.00      0.01     99.80
Average:        all      0.13      0.00      0.06      0.00      0.01     99.79
{{</ output >}}

The data displayed is the following:

- **Linux 4.19.0-13-amd64**: the Linux kernel version
- **(li900-72)**: The hostname where the sar data was collected
- **02/19/2021**: The date when the sar data was collected
- **_x86_64_**: The system architecture
- **(2 CPU)**: Number of CPU cores available

    As is typical for powerful Linux utilities, you can get basic information or you can delve deep into the system. For example, you might want to know if your server is suffering from a spike in activity on a given date, during a particular time, or an earlier date.

Here are some simple, useful sar examples to illustrate the information you can gather.

### Total CPU Usage

- `sar -u`: Displays CPU usage for the current day collected until that point
- `sar -u 1 3`: Displays real-time CPU usage every second, three times
- `sar -u -f /var/log/sysstat/sa24`: Displays CPU usage for the month's 24th day

For example, issuing `sar -u`, displays the following output:

{{< output >}}
Linux 4.19.0-13-amd64 (li900-72) 	02/19/2021 	_x86_64_	(2 CPU)

01:45:01 PM     CPU     %user     %nice   %system   %iowait    %steal     %idle
01:55:01 PM     all      0.13      0.00      0.07      0.01      0.01     99.78
02:05:01 PM     all      0.13      0.00      0.06      0.00      0.01     99.80
02:15:01 PM     all      0.12      0.00      0.06      0.00      0.01     99.80
02:25:01 PM     all      0.16      0.00      0.07      0.00      0.02     99.75
Average:        all      0.14      0.00      0.06      0.00      0.01     99.78
{{</ output >}}

### View CPU Usage for Each CPU or Core

- `sar -P ALL`: Displays current day's CPU usage by all cores
- `sar -P ALL 1 3`: Displays real-time CPU usage for all cores every second, three times
- `sar -P 1`: Displays CPU usage for core number 1 for the current day. Cores are counted starting with 0.
- `sar -P 1 1 3`: Displays real-time CPU usage for core number 1, every second, three times.
- `sar -P ALL -f /var/log/sysstat/sa24`: Displays CPU usage broken down by all cores for the month's 24th day.

For example, issuing `sar -P ALL`, displays the following output:

{{< output >}}
Linux 4.19.0-13-amd64 (li900-72) 	02/19/2021 	_x86_64_	(2 CPU)

01:45:01 PM     CPU     %user     %nice   %system   %iowait    %steal     %idle
01:55:01 PM     all      0.13      0.00      0.07      0.01      0.01     99.78
01:55:01 PM       0      0.09      0.00      0.06      0.00      0.01     99.83
01:55:01 PM       1      0.18      0.00      0.08      0.01      0.01     99.73

01:55:01 PM     CPU     %user     %nice   %system   %iowait    %steal     %idle
02:05:01 PM     all      0.13      0.00      0.06      0.00      0.01     99.80
02:05:01 PM       0      0.16      0.00      0.07      0.00      0.01     99.76
02:05:01 PM       1      0.11      0.00      0.05      0.01      0.01     99.83

02:05:01 PM     CPU     %user     %nice   %system   %iowait    %steal     %idle
02:15:01 PM     all      0.12      0.00      0.06      0.00      0.01     99.80
02:15:01 PM       0      0.14      0.00      0.07      0.00      0.01     99.78
02:15:01 PM       1      0.11      0.00      0.05      0.01      0.01     99.83

02:15:01 PM     CPU     %user     %nice   %system   %iowait    %steal     %idle
02:25:01 PM     all      0.16      0.00      0.07      0.00      0.02     99.75
02:25:01 PM       0      0.18      0.00      0.07      0.00      0.03     99.72
02:25:01 PM       1      0.15      0.00      0.06      0.01      0.02     99.77

Average:        CPU     %user     %nice   %system   %iowait    %steal     %idle
Average:        all      0.14      0.00      0.06      0.00      0.01     99.78
Average:          0      0.14      0.00      0.07      0.00      0.02     99.77
Average:          1      0.14      0.00      0.06      0.01      0.01     99.79
{{</ output >}}

### Display Free, Available, and Used Memory

- `sar -r`: Displays data about the memory usage on your system. To view a detailed explanation for each column, issue the `man sar` command, and search for each column name. For example, to learn about `kbmemfree`, once you are viewing the sar manual pages, issue the `/kbmemfree` command.
- `sar -r 1 3`: Displays memory use for every second for the last three seconds.
- `sar -r -f /var/log/sysstat/sa24`: Displays memory use on the 24th day of the current month.

For example, issuing `sar -r`, displays the following output:

{{< output >}}
Linux 4.19.0-13-amd64 (li900-72) 	02/19/2021 	_x86_64_	(2 CPU)

01:45:01 PM kbmemfree   kbavail kbmemused  %memused kbbuffers  kbcached  kbcommit   %commit  kbactive   kbinact   kbdirty
01:55:01 PM   3440536   3687488     56048      1.39     44168    442188    163488      3.58    153340    360960        16
02:05:01 PM   3442196   3689216     54436      1.35     44168    442236    160228      3.51    152160    360860        12
02:15:01 PM   3441952   3689160     54512      1.35     44180    442420    164400      3.60    151640    360928        28
02:25:01 PM   3441644   3688940     54528      1.35     44180    442488    162752      3.56    151552    361000        32
02:35:01 PM   3441456   3688816     54788      1.36     44180    442552    159448      3.49    152888    361060        16
Average:      3441557   3688724     54862      1.36     44175    442377    162063      3.55    152316    360962        21
{{</ output >}}

### Swap Space Used

- `sar -S`: Displays the current day's swap space usage statistics. To view a detailed explanation for each column, issue the `man sar` command, and search for each column name. For example, to learn about `kbswpfree`, once you are viewing the sar manual pages, issue the `/kbswpfree` command.
- `sar -S 1 3`: Displays swap memory data for every second during the last three seconds.
- `sar -S -f /var/log/sysstat/sa24`: Displays swap memory use on the 24th day of the current month.

For example, issuing `sar -S`, displays the following output:

{{< output >}}
Linux 4.19.0-13-amd64 (li900-72) 	02/19/2021 	_x86_64_	(2 CPU)

01:45:01 PM kbswpfree kbswpused  %swpused  kbswpcad   %swpcad
01:55:01 PM    524284         0      0.00         0      0.00
02:05:01 PM    524284         0      0.00         0      0.00
02:15:01 PM    524284         0      0.00         0      0.00
02:25:01 PM    524284         0      0.00         0      0.00
02:35:01 PM    524284         0      0.00         0      0.00
02:45:01 PM    524284         0      0.00         0      0.00
Average:       524284         0      0.00         0      0.00
{{</ output >}}

### I/O Transactions

- `sar -b`: Displays I/O transactions for the current day. To view a detailed explanation for each column, issue the `man sar` command, and search for each column name. For example, to learn about `tps`, once you are viewing the sar manual pages, issue the `/tps` command.
- `sar -b 1 3`: Displays I/O transactions data for every second during the last three seconds.
- `sar -b -f /var/log/sysstat/sa24`: Displays I/O transaction data on the 24th day of the current month.

For example, issuing `sar -b`, displays the following output:

{{< output >}}
Linux 4.19.0-13-amd64 (li900-72) 	02/19/2021 	_x86_64_	(2 CPU)

01:45:01 PM       tps      rtps      wtps   bread/s   bwrtn/s
01:55:01 PM      0.45      0.01      0.43      0.32      6.96
02:05:01 PM      0.36      0.00      0.36      0.00      5.25
02:15:01 PM      0.38      0.01      0.36      0.51      5.39
02:25:01 PM      0.37      0.00      0.37      0.00      5.47
02:35:01 PM      0.36      0.00      0.36      0.00      5.36
02:45:01 PM      0.47      0.11      0.35      6.33      5.41
Average:         0.40      0.02      0.37      1.19      5.64
{{</ output >}}

### Going further

There are numerous other sar commands, options, and flags. See the [sar Linux manual pages](https://linux.die.net/man/1/sar) for more information or issue the `man sar` command to read the manual pages on your Linux system.
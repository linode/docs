---
slug: how-to-use-vmstat
author:
  name: Steven J. Vaughan-Nichols
  email: sjvn@vna1.com
description: 'Among the built-in Linux system monitoring tool is vmstat. Its primary job is to measure virtual memory system usage Here&#39;s how to use it.'
og_description: 'Among the built-in Linux system monitoring tool is vmstat. Its primary job is to measure virtual memory system usage Here&#39;s how to use it.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-18
modified_by:
  name: Linode
title: "How to Use Vmstat"
h1_title: "h1 title displayed in the guide."
contributor:
  name: Steven J. Vaughan-Nichols
  link: http://www.twitter.com/sjvn
---

[Vmstat](https://linux.die.net/man/8/vmstat) is a built-in Linux system monitoring tool. Its primary job is measuring a system's usage of virtual memory. No matter how powerful it is, a Linux server has a finite amount of random access memory (RAM). A Linux system can run out of RAM for several reasons, such as demands on the operating system and its running applications. When this happens, the Linux kernel *swaps* or *pages* out programs to the computer's storage devices, called *swap space*. Typically, this is a reserved area of hard drive or solid-state drive storage. It's used as virtual memory when RAM is unavoidable. As RAM is freed up, the swapped-out data or code is swapped back into the main RAM-based memory.

System performance drops drastically when swapping happens. That's because the server's swap I/O speed is much slower than RAM even if the hardware – such as fast SSD – is used for virtual memory. In addition, when Linux uses virtual memory it spends more of its CPU cycles on managing virtual memory swapping.

That means that Linux system administrators have to pay attention to a server's memory usage. Nobody wants a system to slow down. When it does, and admins need to troubleshoot, virtual memory is a likely culprit. Since virtual memory has an outsized impact on system performance, vmstat is essential for monitoring it. In addition to monitoring virtual memory paging, vmstat also measures processes, I/O, CPU, and disk scheduling.

## Getting Started with vmstat

You can run `vmstat` both as an interactive program and in shell programs. When you run vmstat without any parameters, it shows system values based on the averages for each element since the server was last rebooted. These results are not a snapshot of current values.

Run vmstat using the following command:

        vmstat

You see a similar output:

{{< output >}}
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 0  0      0 1171312  69752 2231152    0    0     0    13   10   23  0  0 100  0  0
{{</ output >}}

Notice how vmstat returns information about the system's processes, memory, swap, io, system interrupts and context switches, and CPU. To learn more about each column and value, view the manual pages for vmstat by issuing the `man vmstat` command and searching for each specific area. For example, once you are viewing the vmstat manual pages, to view more information about the `swap` column, issue the `/swap` command.

The vmstat command-line options provide more information about your system. The vmstat syntax is as follows:

        vmstat [options] [delay] [count]]

- **Options**: vmstat command settings
- **Delay**: the time interval between updates. If no delay is specified, the report runs as an average since the last reboot.
- **Count**: the number of updates printed after the given delay interval. If no count is set, the default is an infinite number of updates every `x` seconds (where x = delay).

For example, you can issue the following command to run vmstat every five second, five times on an idle system:

        vmstat 5 5

Your output should resemble the following:

{{< output >}}
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0      0 1166396  70768 2233228    0    0     0    13   10   24  0  0 100  0  0
 0  0      0 1165568  70776 2233352    0    0     0     8  121  224  0  0 99  0  0
 0  0      0 1166608  70784 2233352    0    0     0    53  108  209  0  0 100  0  0
 0  0      0 1166608  70784 2233352    0    0     0     0   75  176  0  0 100  0  0
 0  0      0 1166576  70788 2233352    0    0     0     4   76  177  0  0 100  0  0
{{</ output >}}

### Common vmstat Options

By default, vmstat displays memory and swap numbers in kilobytes. This can be changed to a thousand bytes, a million bytes, or a megabyte, using the `-S` flag modified by one of the following options:

- **k**: 1,000 bytes
- **K**: 1,024 bytes
- **m**: 1,000,000 bytes
- **M**: 1,048,576 bytes

To show the data updated five times every five seconds with the memory and swap statistics displayed in megabytes, use the command:

        vmstat -S M 5 5

Your output should resemble the following:

{{< output >}}
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0      0   1139     69   2181    0    0     0    13   10   24  0  0 100  0  0
 0  0      0   1139     69   2181    0    0     0     1   81  180  0  0 100  0  0
 0  0      0   1139     69   2181    0    0     0     1   82  183  0  0 100  0  0
 0  0      0   1139     69   2181    0    0     0     0   85  183  0  0 100  0  0
 0  0      0   1139     69   2181    0    0     0     0   79  178  0  0 100  0  0
 {{</ output >}}

vmstat can be run continually without a count argument. To stop such a report, use the break character (`^C` or `Control+C`).

The `-a` option presents the systems&#39; active and inactive memory.

![vmstat -a](vmstat_03.png)

The `-f` option shows the number of forks (any process that spawns another process while still active) since the last system boot.

![vmstat -f](vmstat_04.png)

The `-s` option displays memory statistics and CPU and I/O event counters.

![vmstat -s](vmstat_05.png)

The `-d` option shows read/write stats for the server&#39;s storage devices.

![vmstat -d](vmstat_06.png)

![cache](vmstat_07.png)

To display [slabinfo](https://man7.org/linux/man-pages/man5/slabinfo.5.html), which Linux uses to manage memory above the page level, vmstat must be run as the root user with the -m flag.

![slabinfo](vmstat_08.png)

Its output can be long, so in interactive mode it&#39;s often piped through the [less](https://man7.org/linux/man-pages/man1/less.1.html) command:

`sudo vmstat -m | less`

![long results](vmstat_09.png)

The output has five columns.

- Cache: Name of the cache
- Num: The number of currently active objects in this cache
- Total: The total number of available objects in this cache
- Size: The size of each object in the cache
- Pages: The total number of memory pages that have (at least) one object currently associated with this cache

To show a disk activity summary report, run vmstat with the `-D` flag.

Next time you have a virtual memory slowdown, you&#39;ll be ready to address the problem – once you are armed with information from vmstat.
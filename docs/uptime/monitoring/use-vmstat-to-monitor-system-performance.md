---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the vmstat tool to monitor your system''s virtual memory usage.'
keywords: ["virtual memory", "memory", "linux", "ram", "usage", "troubleshooting."]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/vmstat/']
modified: 2017-10-04
modified_by:
  name: Linode
published: 2010-10-13
title: Use vmstat to Monitor System Performance
external_resources:
 - '[Linux Ate My Ram](http://www.linuxatemyram.com/)'
 - '[Memory Usage on Linux](http://chrisjohnston.org/2009/why-on-linux-am-i-seeing-so-much-ram-usage)'
---

![Use vmstat to Monitor System Performance](/docs/assets/use-vmstat-to-monitor-system-performance.jpg "Use vmstat to Monitor System Performance")

## What is vmstat?

`vmstat` is a tool that collects and reports data about your system's memory, swap, and processor resource utilization in real time. It can be used to determine the root cause of performance and issues related to memory use.

## How to Use vmstat

Use the `vmstat` command to run the program. Consider the following output:

    $ vmstat
    procs -----------memory---------- ---swap-- -----io---- -system-- ----cpu----
     r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
     0  0   3532 148760  50700 1397880    0    0     1     2    6    6  3  1 97  0

This data provides an average view of virtual memory and system usage since the last reboot. Often, the following form of the command is used:

    vmstat [interval] [count]

In this example, the first line of data provides the average since the last boot time. Subsequent reports, until `[count]` is reached, report data on the current state of the system every `[interval]` seconds.

## vmstat Commands

`vmstat` is often run with an interval of 1 second for a small number of seconds depending on kind of problem the administrator is trying to diagnose. The following example illustrates an interval of one (1) second twenty (20) times:

    $ vmstat 1 20
    procs -----------memory---------- ---swap-- -----io---- -system-- ----cpu----
     r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
     0  0   3996 168488  57100 1368636    0    0     1     2    0    0  3  1 97  0
     0  0   3996 168604  57100 1368728    0    0     0     0  144  303  1  0 100  0
     0  0   3996 168604  57100 1368984    0    0   256     0  162  464  1  0 99  0
     0  0   3996 168604  57100 1368972    0    0     0     0  239  638  3  0 97  0
     0  0   3996 168604  57100 1368952    0    0     0     0  242  529  1  1 99  0
     0  0   3996 168604  57100 1368952    0    0     0     0  148  430  1  0 99  0
     1  0   3996 168604  57100 1368952    0    0     0     0  222  451  6  0 94  0
     0  0   3996 168604  57100 1368952    0    0     0     0  141  270  2  0 98  0
     0  0   3996 168604  57100 1368952    0    0     0     0  166  450  1  0 99  0
     0  0   3996 168604  57100 1368952    0    0     0     0  133  410  0  0 99  0
     0  0   3996 168604  57100 1368952    0    0     0     0  196  398  0  0 99  0
     0  0   3996 168604  57100 1368952    0    0     0     0  187  510  1  0 100  0
     0  0   3996 168604  57108 1368952    0    0     0    16  263  677  2  0 97  1
     0  0   3996 168604  57108 1368952    0    0     0     0  205  431  1  0 98  0
     0  0   3996 168604  57108 1368964    0    0     0     0  179  467  1  0 98  0
     0  0   3996 168604  57108 1368964    0    0     0     0  169  446  2  0 98  0
     0  0   3996 168604  57108 1368964    0    0     0     0  202  365  2  0 98  0
     0  0   3996 168604  57108 1369208    0    0   256     0  226  458  2  1 96  0
     0  0   3996 168604  57108 1369208    0    0     0    40  202  501  2  0 98  0
     0  0   3996 168604  57108 1369220    0    0     0     0  154  295  2  0 98  0

You may run `vmstat` without a `[count]` argument if you want ongoing reports of the system's status in real time. In these cases, intervals of 30 seconds or more may be desirable.

    $ vmstat 30
    procs -----------memory---------- ---swap-- -----io---- -system-- ----cpu----
     r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
     0  0   3996 167868  57108 1369788    0    0     1     2    0    0  3  1 97  0
     0  0   3996 167860  57108 1369920    0    0     0     0  274  604  2  0 98  0
     0  0   3996 167860  57108 1369928    0    0     0     0  196  481  1  0 98  0
     0  0   3996 167860  57116 1369908    0    0     0    12  164  414  1  1 97  1
     0  0   3996 167860  57116 1369892    0    0     0     0  168  320  0  0 100  0
     0  0   3996 167860  57116 1369884    0    0     0     0  142  398  1  0 99  0
     0  0   3996 167860  57116 1369880    0    0     0     0  175  450  1  1 98  0
    ^C

You may choose to direct this output to a file for logging instead of leaving it running endlessly in a background terminal session. To stop the `vmstat` process, send the break character (`^C` or Control+C) as above.

In the default operation, `vmstat` displays memory statistics in kilobytes. `vmstat` considers a single kilobyte equal to 1024 bytes. To generate `vmstat` reports where 1 kilobyte is equal to 1000 bytes, use the following form:

    $ vmstat -S k 1 10
    procs -----------memory---------- ---swap-- -----io---- -system-- ----cpu----
     r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
     0  0   4091 150192  58982 1422041    0    0     1     2    0    0  3  1 97  0
     0  0   4091 150183  58982 1422381    0    0   256     0  201  518  1  0 99  0
     2  0   4091 150183  58982 1422356    0    0     0     0  638 1356  7  1 92  0
     0  0   4091 150183  58982 1422360    0    0     0     0  859 1087  5  2 93  0
     0  0   4091 150183  58982 1422331    0    0     0     0  404 1100  2  0 97  0
     0  0   4091 150183  58982 1422331    0    0     0     0  281  601  2  0 97  0
     0  0   4091 150183  58982 1422327    0    0     0     0  279  468  3  0 97  0
     0  0   4091 150183  58982 1422331    0    0     0     0  250  572  3  0 97  0
     0  0   4091 150183  58990 1422323    0    0     0    16  280  598  4  0 95  1
     0  0   4091 150183  58998 1422319    0    0     0    52  270  451  3  0 96  1

`vmstat` can also display reports with memory sizes reported in megabytes. `vmstat` reports with the argument `-S m` will consider a single megabyte equal to 1000 kilobytes as follows:

    $ vmstat -S m 1 10
    procs -----------memory---------- ---swap-- -----io---- -system-- ----cpu----
     r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
     0  0      4    169 58   1404    0    0 1     2    0    0  3  1 97  0
     0  0      4    169 58   1405    0    0 0     0  194  508  1  0 98  0
     0  0      4    169 58   1405    0    0 0     0  154  443  0  0 99  0
     0  0      4    169 58   1405    0    0 0     0  192  380  0  0 100  0
     0  0      4    169 58   1405    0    0 0     0  287  766  3  0 97  0
     1  0      4    169 58   1405    0    0 0     0  222  583  1  1 99  0
     0  0      4    169 58   1405    0    0 0    36  166  304  1  0 99  0
     0  0      4    169 58   1405    0    0 0     0  189  473  1  0 99  0
     0  0      4    169 58   1405    0    0 0     0  164  430  1  0 99  0
     0  0      4    169 58   1405    0    0 0     0  186  343  0  0 100  0

`vmstat` is also able to display megabytes such that a single megabyte is equal to 1024 kilobytes with the argument `-S M`. Consider the following example:

    $ vmstat -S M 1 10
    procs -----------memory---------- ---swap-- -----io---- -system-- ----cpu----
     r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa
     0  0      3    162 55   1339    0    0 1     2    0    0  3  1 97  0
     0  0      3    162 55   1339    0    0 0     0  425  700  1  1 98  0
     0  0      3    162 55   1339    0    0 0     0  712  997  1  2 97  0
     0  0      3    162 55   1339    0    0 0    20  479 1079  3  0 96  1
     0  0      3    162 55   1339    0    0 0     0  264  406  2  0 98  0
     0  0      3    162 55   1339    0    0 0     0  273  552  3  0 97  0
     0  0      3    162 55   1339    0    0 0     0  218  467  1  0 99  0
     0  0      3    162 55   1339    0    0 0     0  250  434  1  0 99  0
     0  0      3    162 55   1339    0    0 0     0  200  444  2  0 98  0
     0  0      3    162 55   1339    0    0 0     0  313  771  3  1 96  0

## How to Interpret vmstat Output

`vmstat` reports describe the current state of a Linux system. Information regarding the running state of a system is useful when diagnosing performance related issues. Often [Linode Support](/docs/platform/support) will request `vmstat` reports in order to more conclusively diagnose some issues; however, with a little background in what all of the data represents, you can interpret this data yourself.

The output of `vmstat` is displayed in a number of columns. The following sections provide brief overviews of the data reported in each column.

### Procs

The `procs` data reports the number of processing jobs waiting to run and allows you to determine if there are processes "blocking" your system from running smoothly.

The `r` column displays the total number of processes waiting for access to the processor. The `b` column displays the total number of processes in a "sleep" state.

These values are often `0`.

### Memory

The information displayed in the `memory` section provides the same data about [memory usage](/docs/tools-reference/linux-system-administration-basics/#check-current-memory-usage) as the command `free -m`.

The `swapd` or "swapped" column reports how much memory has been swapped out to a swap file or disk. The `free` column reports the amount of unallocated memory. The `buff` or "buffers" column reports the amount of allocated memory in use. The `cache` column reports the amount of allocated memory that could be swapped to disk or unallocated if the resources are needed for another task.

### Swap

The `swap` section reports the rate that memory is sent to or retrieved from the swap system. By reporting "swapping" separately from total disk activity, `vmstat` allows you to determine how much disk activity is related to the swap system.

The `si` column reports the amount of memory that is moved from swap to "real" memory per second. The `so` column reports the amount of memory that is moved to swap from "real" memory per second.

### I/O

The `io` section reports the amount of input and output activity per second in terms of blocks read and blocks written.

The `bi` column reports the number of blocks received, or "blocks in", from a disk per second. The `bo` column reports the number of blocks sent, or "blocks out", to a disk per second.

### System

The `system` section reports data that reflects the number of system operations per second.

The `in` column reports the number of system interrupts per second, including interrupts from system clock. The `cs` column reports the number of context switches that the system makes in order to process all tasks.

### CPU

The `cpu` section reports on the use of the system's CPU resources. The columns in this section always add to 100 and reflect "percentage of available time".

The `us` column reports the amount of time that the processor spends on userland tasks, or all non-kernel processes. The `sy` column reports the amount of time that the processor spends on kernel related tasks. The `id` column reports the amount of time that the processor spends idle. The `wa` column reports the amount of time that the processor spends waiting for IO operations to complete before being able to continue processing tasks.

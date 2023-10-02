---
slug: linux-system-monitoring-fundamentals
description: "This guide discusses the system monitoring tools you can use to reassure your server is functioning properly and help you deal with strange behaviors."
keywords: ['linux system monitoring']
tags: ["linux","monitoring"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-19
image: LinuxSysMonFundamentals.png
modified_by:
  name: Linode
title: "Linux System Monitoring Fundamentals"
authors: ["Steven J. Vaughan-Nichols"]
---

The only way to know that your Linux-server-based applications and services are running well is to measure what's going on in the server and its connectivity status. Linux system monitoring tools reassure you when things are working right, and help you recognize odd behavior, performance anomalies, and their source when the server misbehaves. Once you've mastered these dedicated applications – most of which are built into the operating system – you'll be well on your way to Linux system administrator expertise.

All server monitoring programs have a few things in common. They set a goal of ensuring that a server is performing optimally, they provide information that lets Linux administrators understand what's going on, and sometimes automate their responses to those situations. The Linux system monitor tools accomplish this by gathering data on each server's key performance indicators (KPIs), network connectivity, and application availability.

Specifically, you use Linux system monitoring programs to ensure that:

- The hardware is working.
- The server is up and running.
- The server resources are sufficient for mission-critical applications and services to work at peak performance.
- No resource bottlenecks are slowing things down.
- System administrators are alerted when a KPI fails to meet its specified metric.
- Data is presented in a visual manner – such as dashboards, graphs, and weather maps — to visualize trends that aren't obvious in raw data.

These programs do this by tracking:

- The server's real-time status
- Data collected over time to enable analysis of long-term trends.
- Data collected to determine the best use of server resources for mission-critical applications. For example, does [InnoDB](https://en.wikipedia.org/wiki/InnoDB) or [MyISAM](https://en.wikipedia.org/wiki/MyISAM) work best for the database storage engine?

Specifically, Linux system monitors look at:

- Memory usage
- CPU usage
- Storage usage, including disk space and Input/Output Operations per Second (IOPS)
- Network usage

A server's system load – a term you hear often in these discussions – usually encompasses the usage of memory, CPU, and storage.

## Getting started with Linux system monitoring tools

Dozens of Linux server system monitoring commands are built into the operating system. They include very simple commands like [top](/docs/guides/top-htop-iotop/), which by default displays Linux processes in CPU activity order. These tools also can be highly complex, such as sar, which collects, reports, and saves a wide variety of system activity information.

There are, of course, many higher-level system monitoring programs for all distributions that permit you to monitor any Linux server. These include [Glance](https://nicolargo.github.io/glances/), a Python-based cross-platform system monitoring tool; [htop](https://htop.dev/), another cross-platform system monitor, which uses [ncurses](http://www.gnu.org/software/ncurses/) for its display; and [Netdata](https://www.netdata.cloud/), a distributed server system monitoring program. However, as useful as these can be, they all rely on lower-level programs.

Four important Linux system monitoring tools are worthwhile to examine in more detail.

[Sar](https://linux.die.net/man/1/sar): System Activity Reporter (sar) is part of the [Sysstat system resource utilities package](https://github.com/sysstat/sysstat). Sar is a do-it-all monitoring tool. It measures CPU activity; memory/paging; interrupts; device load; network; process and thread allocation; and swap space utilization. Sar can be used interactively, but its real value is that it keeps data logs over a long period of time, which you can use to troubleshoot recurring problems and produce reports. To learn more, read our [How to Use the System Activity Reporter (sar)](/docs/guides/how-to-use-sar) guide.

[Vmstat](https://linux.die.net/man/8/vmstat): This virtual memory statistics reporter is a built-in Linux command-line tool. In addition to reporting in detail on virtual memory usage, vmstat also gathers information on memory usage, memory paging, processes, I/O, CPU, and storage scheduling. Unlike sar, vmstat starts on boot. It's used to report on cumulative activity since the last reboot. Our [Use vmstat to Monitor System Performance](/docs/guides/use-vmstat-to-monitor-system-performance) guide includes more information about getting started with this monitoring tool.

[Monitorix](https://www.monitorix.org/): Monitorix is a free, open-source tool that monitors multiple Linux services and system resources. Monitorix, from version 3.0 on, comes with its own web server. This makes it useful for remote Linux system monitoring. Originally designed for the [Red Hat Enterprise Linux (RHEL)](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) operating system family, Monitorix now works on all major Linux server distributions. Read our [How to use Monitorix for System Monitoring](/docs/guides/how-to-use-monitorix-for-system-monitoring) guide to learn more.

[Nethogs](https://github.com/raboof/nethogs): This free and open-source program extends the net top tool that tracks bandwidth by process. For example, you might discern that the amount of outbound traffic has increased on your Linux server, but Nethogs helps you identify which process is generating the usage spikes. Other network monitoring utilities only break down the traffic by protocol or subnet. Read our [Get Started Using Nethogs for Network Usage Monitoring](/docs/guides/get-started-using-nethogs-for-network-usage-monitoring) guide to learn more about this tool.
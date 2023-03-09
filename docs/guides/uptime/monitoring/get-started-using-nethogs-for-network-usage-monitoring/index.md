---
slug: get-started-using-nethogs-for-network-usage-monitoring
description: "Learn how to install and use Nethogs, a free and open-source program designed to track network usage"
keywords: ['how to use nethogs']
tags: ["linux","monitoring"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-19
image: UsingNethogs_NetworkMonitoring.png
modified_by:
  name: Linode
title: "Using Nethogs to Monitor Network Usage"
title_meta: "How to Use Nethogs to Monitor Network Usage"
authors: ["Steven J. Vaughan-Nichols"]
---

[Nethogs](https://github.com/raboof/nethogs) is a free, open-source program used to track network usage. It extends the net top tool to track bandwidth by process. For example, `net top` may show that outbound traffic increased on a Linux server by protocol or subnet. But nethogs makes it easier for Linux administrators to identify which process is generating the usage spikes.

Nethogs gathers its data from the files within the `/proc/net` directories. It does not rely on a special kernel module or driver. It works on any Linux system, but it doesn't work well on other related server operating systems such as [FreeBSD](https://www.freebsd.org/).

Using the collected data, nethogs displays both `process IDs` (`PID`) and the program's name. This makes it easy to identify which programs may be misbehaving, because you can see the programs that are using more than their fair share of available bandwidth.

When the Linux networking monitoring tool is started, nethogs displays current networking data. It picks up this data by using both `proc` data and [`libpcap`](https://man7.org/linux/man-pages/man3/libcap.3.html) for user-level packet capture. Nethogs then displays the data as a text-based chart, using [ncurses](https://linux.die.net/man/3/ncurses). As long as you have the program running in the foreground, the nethogs display is constantly updated.

## Before You Begin

If you are using a Linode, make sure you run the steps in this section to configure your Linode, secure your server, and update your system's packages.

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

## Installing nethogs

Many Linux distributions come with nethogs already installed. However, if that is not the case, this section shows you how to install nethogs on a Debian or Ubuntu distribution.

1. Install nethogs:

        sudo apt-get install nethogs

## Common Nethogs Commands

Nethogs is commonly run as an interactive program. But it also can be used in shell programs, or as a graphical program with the [nethogs-qt](http://slist.lilotux.net/linux/nethogs-qt/index_en.html) Qt-based GUI.

The nethogs Linux networking system monitoring program's syntax is as follows:

        nethogs [option] [port name]

Nethogs defaults to constantly measuring traffic to and from the `eth0` port when the utility is run without any options:

        sudo nethogs

In the example below, nethogs reports an Ubuntu Linux workstation copying a Server Message Block (SMB) file from a Samba server, the Chrome web browser, a background Slack messaging client, and an idle Evolution e-mail client.

![sudo nethogs](nethogs_02.png)

Use the `-d` flag to instruct nethogs to use a refresh rate. This is measured in seconds. For example, to refresh the display every five seconds:

        sudo nethogs -d 5

![sudo nethogs -d 5](nethogs_03.png)

To add a refresh rate of five seconds and device name to monitor the `eno1` device bandwidth use the command:

        sudo nethogs -d 5 eno1

![sudo nethogs -d 5 eno1](nethogs_04.png)

Nethogs can also be used to monitor multiple network ports at once. For instance, to collect data from `eth0` and `eth1` ports:

        sudo nethogs -d 5 eth0 eth1

### Control nethogs Interactively

While nethogs is running you can use the following interactive commands:

- **`-m`**: Change the units that are displayed for used network bandwidth. The available units are kilobytes/sec, total kilobytes, total bytes, and total megabytes.
- **`-r`**: Sort by magnitude of received traffic
- **`-s`**: Sort by magnitude of sent traffic
- **`-q`**: Hit quit to the shell prompt

For example, below is a nethogs display showing the traffic by total megabytes in received order.

![nethogs display showing the traffic by total megabytes in received order](nethogs_05.png)

It can be difficult to troubleshoot a Linux system that is behaving erratically. Using nethogs provides easy-to-read data that you can use to spot the applications that are using more resources than expected.
---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to monitoring and maintaining your server.
keywords: ["monitor", "monitoring", "maintaining", "maintenance"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['monitoring-and-maintaining/']
modified: 2017-02-22
modified_by:
  name: Linode
published: 2012-08-22
title: Monitoring and Maintaining Your Server
---

Now that your Linode is up and running, it's time to think about monitoring and maintaining your server. This guide introduces the essential tools and skills you'll need to keep your server in tip-top shape. You'll learn how to monitor the availability and performance of your system, manage your logs, and update your server's software.

## Availability Monitoring

The *availability* of your servers, and the websites and web applications you host on them, can be critically important. If you generate income from a blog or charge subscription fees for your web application, downtime can have a severe impact on your bottom line. Using an availability monitoring tool can help you rapidly detect and resolve service disruptions, thereby mitigating the impact on your web sites and web applications.

### Assessing Your Needs

Not everyone needs to monitor the availability of their server. For example, if you use your Linode to host a personal picture gallery website for friends and family, the occasional service interruption probably won't bother you. The small inconvenience of your website going offline for a few minutes doesn't justify the time it would take to set up and configure an availability monitoring tool.

If you depend on your website or web application for your livelihood, an availability monitoring tool is practically a necessity. Once set up, the tool actively watches your servers and services and alerts you when they're unavailable. You'll be able to troubleshoot the problem and restore service as quickly as possible.

Whether you use one Linode or dozens of them, mission-critical servers and services should be watched by an independent monitoring tool that can keep tabs on their availability. The tool should have an automated method of detecting service-related incidents and be able to notify you via email, text message, or SMS. That way you'll know that a server or service is down within minutes of it having failed.

### Finding the Right Tool

There are several different availability monitoring tools available. Your decision should be based on how many servers you'll be monitoring:

-   **Multiple Servers**: If you run more than one server, [Nagios](/docs/uptime/monitoring/install-nagios-4-on-ubuntu-debian-8) makes an ideal monitoring tool. This free and flexible framework makes it possible to keep an eye on a broad range of infrastructural components and network services. After installing the Nagios server and client packages, one Linode will act as the primary server to monitor the other servers.
-   **Single Server**: If you only run a single server, you might want to use a third-party service to monitor your Linode. (You could install Nagios, but if your server goes down, Nagios will go down with it.) You could also use a network diagnostic tool like [MTR](/docs/linux-tools/mtr) to diagnose and isolate networking errors.
-   **Linode Longview**: [Longview](/docs/platform/longview/longview) is Linode's own monitoring and graphing service. It offers real time data that can be used to help identify system issues. Using Longview in conjunction with a notification service like Nagios can help you to identify issues faster, and get your system up and running sooner.

If you need an availability monitoring tool for one or more server, take a look at Nagios or MTR now.

### Configuring Shutdown Watchdog

Shutdown Watchdog, also known as *Lassie*, is a Linode Manager feature capable of automatically rebooting your Linode if it powers off unexpectedly. Lassie is not technically an availability monitoring tool, but it can help get your Linode back online fast if it's accidentally powered off.

Here's how to turn Lassie on and off:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select your Linode. The Linode's dashboard appears.
4.  Click the **Settings** tab. The Shutdown Watchdog settings appear, as shown below.

[![Configuring Shutdown Watchdog](/docs/assets/1105-monitor3-small.png)](/docs/assets/1107-monitor3.png)

5.  Select an option from the **Lassie is currently** menu, as shown below.
6.  Click **Save Changes**.

You have successfully configured Lassie. If you turned the feature on, your Linode will automatically reboot if it is powered off unexpectedly in the future.

## Performance Monitoring

*Performance* monitoring tools record vital server and service performance metrics. Similar to a vehicle's dashboard, which has gauges for things like speed and oil pressure, performance monitoring tools provide valuable insight into the inner workings of your virtual server. With practice, you'll be able to review this information and determine whether your server is in good health.

### Getting Started in the Linode Manager

If you're new to performance monitoring, you can get started by logging in to the Linode Manager. There are four simple graphs available on the Dashboard and in the Graphs section:

-   **CPU Utilization:** Monitor how your Linode's CPU cores are being utilized. Note that each of your Linode's CPU cores is capable of 100% utilization, which means you could see this graph spike well over 100%, depending on your Linode plan size.
-   **Network Traffic:** Keep tabs on how much incoming and outgoing bandwidth your server is using.
-   **IPv6 Network Traffic:** Wondering if any of your visitors are using IPv6? Check this graph to see how much bandwidth has been transferred over IPv6.
-   **Disk IO:** Watch for [disk input/output bottlenecks](/docs/troubleshooting/troubleshooting/#is-there-a-disk-io-bottleneck).

When you first start monitoring the graphs, you won't know what numbers are normal. Don't worry. With time and practice, you'll learn what the graphs are supposed to look like when your server is operating normally. Then you'll be able to spot performance abnormalities before they turn into full-blown problems.

### Configuring Linode Manager Email Alerts

The Linode Manager allows you to configure *email alerts* that automatically notify you via email if certain performance thresholds are reached. For example, if you set the threshold for CPU Usage to 90% percent, you'll be notified if your Linode's average CPU usage is greater than 90% for over 2 hours.

Here's how to turn on and customize the alerts:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select your Linode. The Linode's dashboard appears.
4.  Click the **Settings** tab. The *Email Alert Thresholds* settings appear, as shown below.

[![Configuring Linode Manager Email Alerts](/docs/assets/1104-monitor2-small.png)](/docs/assets/1103-monitor2.png)

5.  To enable an email alert, select the **Enabled** checkbox.
6.  To configure the threshold for an alert, set a value in the text field.
7.  Click **Save Changes** to save the email alert thresholds.

You have successfully configured email alerts in the Linode Manager.

 {{< note >}}
If you receive an email threshold alert from the Linode Manager, don't panic. There's not necessarily anything wrong with your Linode. For example, your server may be operating above the threshold if you're compiling software or if a major website just linked to your blog.
{{< /note >}}

### Using Linode Longview

Our custom monitoring and graphing tool [Longview](/docs/platform/longview/longview) can give you a detailed breakdown of system performance and resource usage. Longview can be used to monitor any virtual server or computer running Linux - including systems not hosted by Linode. On our platform, Longview, in conjunction with the Linode Manager email alerts, can help you to know quickly when your system is overloaded, and find out why.

### Using Third-Party Tools

The graphs in the Linode Manager provide basic information for things like CPU utilization and bandwidth consumption. That's good information as far as it goes, but it won't sate the appetite of true geeks who crave detailed statistics on a server's disk, network, system, and service performance. For that kind of information, you'll need to install and configure a third-party performance monitoring tool.

There are several free third-party performance monitoring tools available for your Linode:

-   Munin: Munin is a system and network monitoring tool that generates graphs of resource usage in an accessible web based interface. Munin also makes it possible to monitor multiple Linodes with a single installation.
-   Cacti: If you have advanced monitoring needs, try Cacti. It allows you to monitor larger systems and more complex deployments with its plugin framework and web-based interface.
-   [Nagios](/docs/server-monitoring/nagios): Nagios is primarily used as an availability monitoring tool, but it can also be configured to monitor performance. For more information, check out the [graphing and trending add-ons](http://exchange.nagios.org/directory/Addons/Graphing-and-Trending).

If you need a third-party performance monitoring tool, take a look at Munin, Cacti, or Nagios now.

## Managing Logs

Important events that occur on your system — things like login attempts or services being restarted — are recorded in your server's *logs*. Similar to car maintenance records and completed tax forms, which provide a paper trail in the event of a problem or discrepancy, log files keep track of system events. You might review logs when troubleshooting errors, tracking usage, or investigating unusual behavior on your system. Of course, it's easy to forget about log files until you need them. Do yourself a favor by automating log rotation and implementing a log monitoring utility now!

### Rotating Logs

As more and more events are logged, the log files on your server get bigger and bigger. Left unchecked, those files can start consuming a surprising amount of disk space. Enter [logrotate](/docs/linux-tools/utilities/logrotate), a utility that automatically archives and compresses current log files after a certain interval, creates new log files, and deletes the *really* old log files. After you configure `logrotate`, your system will automatically handle the entire process.

Use the [logrotate guide](/docs/linux-tools/utilities/logrotate) to get started.

### Monitoring System Logs

It's important to keep an eye on the events recorded in your system logs. But unless you're the type of person who loves scanning through hundreds of lines of log entries, you won't want to open log files unless absolutely necessary. Fortunately, there's an easier way to learn about the most important system events fast. [Logwatch](/docs/server-monitoring/logwatch) is a customizable utility that can automatically parse system logs and email you detailed reports highlighting notable events.

Use the [Logwatch guides](/docs/server-monitoring/logwatch) to get started.

## Updating Software

Linux distributions are frequently updated to fix bugs, add new features, and patch security vulnerabilities. To take advantage of the new packages and patches, you'll need to remember to perform some simple steps every once in a while. This section shows you what to do.

### Updating Installed Packages

You learned about the importance of regularly updating your server's packages in the [Getting Started](/docs/getting-started) quick start guide. It's worth mentioning here again. If nothing else, installing updates is a fast and easy way to mitigate vulnerabilities on your server.

To check for software updates and install them in Ubuntu or Debian, enter the following commands, one by one:

    apt-get update
    apt-get upgrade --show-upgraded

{{< note >}}
If you're using a distribution other than Ubuntu or Debian, you can learn more about package management by reading our [Linux Package Management guide](/docs/using-linux/package-management).
{{< /note >}}

There are ways to automate the installation of software updates, but this is not recommended. You should always manually review the lists of available patches before installing updates.

### Applying Kernel Updates

When you first sign up for Linode and create a virtual server, the Linode Manager automatically creates a [configuration profile](/docs/platform/disk-images/disk-images-and-configuration-profiles/#configuration-profiles) with the latest kernel selected. We [update the kernels](http://www.linode.com/kernels/) as necessary and make them available in the Linode Manager. In most cases, new kernels will automatically be selected in the configuration profile in the Linode Manager — once we release a new kernel, all you have to do is reboot your Linode to start using it.

Here's how to check for a new kernel and start using it on your Linode:

1.  First, check what version kernel your Linode is currently using. Log in to your Linode and execute the following command:

        cat /proc/version

2.  Examine the output and remember the version number (in this case, 3.15.4). It should match the latest available version of the kernel in the Linode Manager, as you'll see in just a minute:

        Linux version 3.15.4-x86_64-linode45 (maker@build) (gcc version 4.4.5 (Debian 4.4.5-8) ) #1 SMP Mon Jul 7 08:42:36 EDT 2014

3.  Log in to the [Linode Manager](https://manager.linode.com).
4.  Click the **Linodes** tab.
5.  Select your Linode. The Linode's dashboard appears.
6.  Select the active configuration profile by clicking the link, as shown below.

[![Selecting the active configuration profile](/docs/assets/1195-monitor6-1.png)](/docs/assets/1195-monitor6-1.png)

7.  From the **Kernel** menu, verify that **Latest 64 bit** is selected, as shown below.

 {{< note >}}
Be sure to select the correct kernel (32- or 64-bit) for your distribution. The 64-bit kernels are available by selecting **Latest 64 bit**.
{{< /note >}}

[![Selecting the latest kernel](/docs/assets/1194-monitor7.png)](/docs/assets/1194-monitor7.png)

8.  If the latest current kernel is not selected, select it now. And if the currently selected kernel's version number doesn't match the number you found in step 2 of this procedure, you'll need to reboot your Linode to start using the new kernel.
9.  If you selected a new kernel, click **Save Changes**. The Linode's dashboard appears.
10. Click **Reboot** to reboot your Linode and start using the new kernel.

After your Linode starts up, it will be using the most up-to-date kernel available.

### Upgrading to a New Release

Linux distributions such as Ubuntu and Fedora use version numbers to identify the individual versions, or *releases*, of the operating system. It's important to know which release your server is running, as releases are usually supported for one or more years. After support for your release is discontinued, you won't be able to download or apply critical security packages, which can put your server at risk.

There are two ways to upgrade a Linode running an unsupported release. You can upgrade your existing server to the next release, or you can create a new Linode with the newest release available and transfer your files from the old server:

-   To upgrade your server, use one of our [Upgrading Guides](/docs/upgrading) or check the distribution's website for instructions.
-   To create a new Linode and transfer your files from the old server, use our [Getting Started](/docs/getting-started) guide and then [migrate the disk](/docs/migrate-to-linode/disk-images/migrating-a-server-to-your-linode) from the old server to transfer the files, or use an FTP client.

 {{< note >}}
Check the distribution's website to learn when support for your release will be discontinued. Ubuntu offers a *long-term support* (LTS) release that is supported for five years.
{{< /note >}}

---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to installing and using Linode Longview.
keywords: ["system monitoring", "longview", "troubleshooting"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['longview/', 'uptime/longview/']
modified: 2017-05-26
modified_by:
  name: Angel Guarisma
published: 2013-03-27
title: Longview
---

Longview is our Linux system statistics graphing service. It tracks important metrics for CPU, memory, and network use, both aggregate and per-process, and it provides real-time graphs that can help you pinpoint performance problems. This guide shows you how to start monitoring systems with Longview.

![Our guide to installing and using Linode Longview.](/docs/assets/longview_smg.png "Our guide to installing and using Linode Longview.")

Longview can be used to monitor any virtual server or computer running Linux - including systems not hosted by Linode. Features include:

-   Up-to-the-minute information about each system
-   Open-source client application
-   Zoomable graphs with contextual data
-   Process statistics including CPU, memory, and IO usage

To access Longview, log in to the [Linode Manager](https://manager.linode.com) and click the **Longview** tab.

[![Linode Longview.](/docs/assets/1371-lv_overview_network_sm.png)](/docs/assets/1372-lv_overview_network.png)

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible.

3. This guide uses `iptables` for firewall configuration. If you followed our [Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw) guide, you learned about ufw: a manager for iptables. In this guide we chose to interface directly with `iptables`, instead of using `ufw`. You can use both, interchangeably without issue.

## Adding Systems

To add a Longview system, first add a system to the Longview interface in the Linode Manager. Then install the Longview client application on your system. At that point, the Longview client application will start transferring your system statistics to Linode's servers.

 {{< note >}}
Longview can monitor any Linux system running a supported distribution - including systems not hosted by Linode.
{{< /note >}}

### Supported Distributions

Before adding your system to Longview, you should verify that your Linux distribution is supported. Longview is currently supported on the following distributions:

-   Ubuntu 10.04, 12.04, 14.04, and 16.04
-   Debian 6, 7, and 8
-   CentOS 5, 6, and 7
-   Fedora 17, 18, and 19

The Longview client may work on other distributions, but at this time we cannot provide support for distributions other than the ones listed here.

### Installing the Client

To start monitoring a system with Longview, you'll need to add the system to the Longview interface in the Linode Manager and then install the Longview client application. Here's how to add a new system to Longview:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **Longview** tab. The webpage shown below appears.

    [![Adding a system to Linode Longview.](/docs/assets/1369-lv_overview_mem_sm.png)](/docs/assets/1370-lv_overview_mem.png)

3.  Click **Add Client**. The webpage shown below appears.

    [![Adding a system to Linode Longview.](/docs/assets/1383-lv_install.png)](/docs/assets/1383-lv_install.png)

4.  Copy the Longview installation command to your clipboard.
5.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#log-in-for-the-first-time).
6.  Paste the Longview installation command into the terminal window, and then press Return. The Longview client will be installed on your system.

You have successfully installed the Longview client on your system. Longview will start collecting system-level data immediately. Repeat this process to add additional systems to Longview.

### Manually Installing the Client

If the installation process described above doesn't work, you'll need to manually install the Longview client. Follow the instructions for your distribution, as described below. You should only attempt to manually install the Longview client if you were unable to complete the instructions in the previous section.

#### Debian and Ubuntu

If you're running a Debian or Ubuntu distribution, follow these steps to manually install the Longview client on your system:

1.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#log-in-for-the-first-time).
2.  Find the name of your distribution by entering the following command. For example, if you're running Ubuntu 12.04, the output will be `precise`. Remember this name - you'll need it later.

        lsb_release -sc

3.  Create a file to hold the repository by entering the following command:

        sudo nano /etc/apt/sources.list.d/longview.list

4.  Paste the following line into the terminal window, replacing `precise` with the name of your distribution:

        deb http://apt-longview.linode.com/ precise main

5.  Save the changes to the file by pressing **Control-X**, and then **Y**.
6.  Download the key to your system by entering the following command:

        sudo wget https://apt-longview.linode.com/linode.gpg

7.  Move the key by entering the following command:

        sudo mv linode.gpg /etc/apt/trusted.gpg.d/linode.gpg

8.  Create a directory for the API key file by entering the following command:

        sudo mkdir -p /etc/linode/

9.  Create a file to hold your API key by entering the following command:

        sudo nano /etc/linode/longview.key

10. Log in to the [Linode Manager](https://manager.linode.com).
11. Select the **Longview** tab.
12. Click **Add Client**. The box shown below appears.

    [![Manually adding a system to Linode Longview.](/docs/assets/1383-lv_install.png)](/docs/assets/1383-lv_install.png)

13. Click **go back** to return to the Linode dashboard.
14. Click the **i** button, as shown below.

    [![Manually adding a system to Linode Longview.](/docs/assets/1391-lv_overview_swap_i_crop.png)](/docs/assets/1391-lv_overview_swap_i_crop.png)

15. Copy the API key to your clipboard, as shown below.

    [![Manually adding a system to Linode Longview.](/docs/assets/1379-lv_api_sm.png)](/docs/assets/1380-lv_api.png)

16. Back in the terminal window, paste the API key into the `longview.key` file.
17. Save the changes to the file by pressing **Control-X**, and then **Y**.
18. Install the Longview client by entering the following commands, one by one:

        sudo apt-get update
        sudo apt-get install -y linode-longview

Congratulations! The Longview client is now installed on your Ubuntu or Debian system.

#### Fedora and CentOS

If you're running a Fedora or CentOS distribution, follow these steps to manually install the Longview client on your system:

1.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#log-in-for-the-first-time).
2.  Create a file to hold the repository by entering the following command:

        sudo nano /etc/yum.repos.d/longview.repo

3.  Paste the following lines into the terminal window, where `DIST` is the name of your distribution (e.g., "Fedora"), and `REV` is your distribution's version number (e.g., "17") :

        [longview]
        name=Longview Repo
        baseurl=https://yum-longview.linode.com/DIST/REV/noarch/
        enabled=1
        gpgcheck=1

 {{< note >}}
You can find your distribution's name and version number by entering the following command: `cat /etc/redhat-release`
{{< /note >}}

4.  Save the changes to the file by pressing **Control-X**, and then **Y**.
5.  Download the key to your system by entering the following command:

        sudo wget https://yum-longview.linode.com/linode.key

6.  Import the key by entering the following command:

        sudo rpm --import linode.key

7.  Create a directory for the API key file by entering the following command:

        sudo mkdir -p /etc/linode/

8.  Create a file to hold your API key by entering the following command:

        sudo nano /etc/linode/longview.key

9.  Log in to the [Linode Manager](https://manager.linode.com).
10. Select the **Longview** tab.
11. Click **Add Client**. The box shown below appears.

    [![Manually adding a system to Linode Longview.](/docs/assets/1383-lv_install.png)](/docs/assets/1383-lv_install.png)

12. Click **go back** to return to the Linode dashboard.
13. Click the **i** button, as shown below.

    [![Manually adding a system to Linode Longview.](/docs/assets/1391-lv_overview_swap_i_crop.png)](/docs/assets/1391-lv_overview_swap_i_crop.png)

14. Copy the API key to your clipboard, as shown below.

    [![Manually adding a system to Linode Longview.](/docs/assets/1379-lv_api_sm.png)](/docs/assets/1380-lv_api.png)

15. Back in the terminal window, paste the API key into the `longview.key` file.
16. Save the changes to the file by pressing **Control-X**, and then **Y**.
17. Install the Longview client by entering the following commands, one by one:

        sudo yum install -y linode-longview

Congratulations! The Longview client is now installed on your Fedora or CentOS system.

#### All Distros

Follow these commands to install Longview on your Linode manually:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **Longview** tab. The webpage shown below appears.

    [![Adding a system to Linode Longview.](/docs/assets/1369-lv_overview_mem_sm.png)](/docs/assets/1370-lv_overview_mem.png)

3.  Click **Add Client**. The webpage shown below appears.

    [![Adding a system to Linode Longview.](/docs/assets/1383-lv_install.png)](/docs/assets/1383-lv_install.png)

4.  Copy the Longview installation command to your clipboard.
5.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#log-in-for-the-first-time).
6.  Paste the Longview installation command into the terminal window, and then press Return. The Longview client will be installed on your system.
7.  View the output as Longview's core dependencies are installed. If you're missing any core dependencies, you'll need to look up the corresponding error and install or reconfigure the appropriate item. On a successful installation, you should see output like the following:

        Installing dependencies in to: /opt/linode/longview
        ==== Installing Longview core dependencies ====
        Successfully installed URI-1.60

        ...

        Successfully installed DBI-1.630
        29 distributions installed

    {{< note >}}
If you don't have MySQL installed, you'll receive an error about dependencies for Longview-MySQL. You can safely ignore the error if MySQL isn't installed. Here's an example of the output:

==== Installing Longview-MySQL dependencies ==== ! Configure failed for DBD-mysql-4.025. See /root/.cpanm/work/1384896259.21932/build.log for details. ==== Translating Headers ==== /usr/include/syscall.h -\> /usr/include/syscall.ph

...
{{< /note >}}

Congratulations! The Longview client is now installed.

### Firewall Rules

If your Linode has a firewall, it will need to allow communication with Longview's aggregation host. To do so, you will need to allow traffic destined for 'longview.linode.com' to be routed through your firewall. The following rules should allow your Linode to provide its metrics to the Longview application:

1. You will want to edit your INPUT chain so that traffic is routed to your Linode.

        iptables -I INPUT -s longview.linode.com -j ACCEPT

2. In order for your Linode to provide its metrics to Longview you will want to allow the same address through the OUTPUT chain of your Firewall.

        iptables -I OUTPUT -d longview.linode.com -j ACCEPT

If you followed the instructions for setting up a firewall in our [Securing Your Server](/docs/security/securing-your-server) guide, go back to [this section](/docs/security/securing-your-server#step_6) to find additional rules for Longview.

### Labeling Systems

If you plan on monitoring multiple systems with Longview, you should create *labels* for the systems to differentiate them. This will make them easier to find in the Linode Manager. Here's how to label the systems monitored by Longview:

1.  In the Linode Manager, select the **Longview** tab. The webpage shown below appears.

    [![Manually adding a system to Linode Longview.](/docs/assets/1391-lv_overview_swap_i_crop.png)](/docs/assets/1391-lv_overview_swap_i_crop.png)

2.  Locate the system you want to label, and then click the **i** button. The webpage shown below appears.

    [![Labeling systems in Linode Longview.](/docs/assets/1385-lv_label_sm.png)](/docs/assets/1386-lv_label.png)

3.  In the **Label** field, enter a name for the system.
4.  Click **Save Changes**.

You have successfully changed the system's Longview label. Repeat this process to change the labels for the other systems you're monitoring with Longview.

## Viewing Statistics

Now that the Longview client is installed on your system, you can use Longview to monitor your system's performance. If you've just installed the client application, please note that the graphs can take a couple of minutes to appear while the Longview systems start collecting data from your system.

### Overview Tab

The **Overview** tab provides all of your system's most important statistics in one place, as shown below. You can see your system's CPU and memory usage, network and disk I/O transfer, and the top processes. The information on the graphs is correlated, so when you move your pointer over one graph, data points are automatically displayed on the other graphs at the same time, making it easy to troubleshoot problems with your system.

[![The Linode Longview Overview tab.](/docs/assets/1389-lv_overview_numbered_sm.png)](/docs/assets/1390-lv_overview_numbered.png)

1.  Percentage of CPU time spent in wait (on disk), in user space, and in kernel space.
2.  Total amount of RAM memory that is being used, and the amount of memory in cache, in buffers, and in swap.
3.  Amount of network data that has been transferred to and from your system.
4.  Basic information about system, including the operating system name and version, processor speed, uptime, and available updates.
5.  Server load average.
6.  Top processes on the system. To access detailed information about the processes running on your system, select the **Process Explorer** link to open the *Process Explorer* tab.
7.  Disk input/output (I/O). This is the amount of data being read from, or written to, the system's hard disk.

This tab is simply designed to give you a basic idea of what's going on with your system. To see in-depth performance information, you'll need to open the other tabs, as described below.

### Network Tab

The **Network** tab allows you to monitor the inbound and outbound traffic to your system, as shown below. The graph at the top of the page shows the combined inbound and outbound data transfer. The other graphs show the data transfer over the IPv4 and IPv6 public and private networks.

 {{< note >}}
If you are monitoring a non-Linode system, only a single graph will be shown for each network interface.
{{< /note >}}

[![The Network tab in Linode Longview.](/docs/assets/1387-lv_network_sm.png)](/docs/assets/1406-lv_network.png)

The data for the IPv4 and IPv6 public and private networks is updated every 5 minutes. To show or hide inbound or outbound traffic, click **Inbound** or **Outbound** in the legend. The graph will be updated to show only the data that is selected.

### Disks Tab

The **Disks** tab displays information about the disks mounted on your system. Select a disk from the left column, and Longview displays the disk's IO, available space, and inodes.

[![The Process Explorer tab in Linode Longview.](/docs/assets/1381-lv_disks_sm.png)](/docs/assets/1382-lv_disks.png)

As with the graphs on the other Longview tabs, you can show or hide the read and write lines on the IO graph by clicking **Read** or **Write**.

### Process Explorer Tab

The **Process Explorer** tab displays all of the processes that were running on your system during the selected time interval, as shown below. Select a process to examine its CPU, memory, and IO consumption.

[![The Process Explorer tab in Linode Longview.](/docs/assets/1392-lv_processexplorer_sm.png)](/docs/assets/1393-lv_processexplorer.png)

If you have a large number of processes running on your system, you can enter the name of the process in the **Filter** field to search for it, or you can click the **More** link at the bottom of the webpage to scroll through all of the processes.

### System Tab

The **System** tab provides general background information about your system, as shown below. At the top of the page, you can see statistics about the operating system, processor, and physical RAM. On the bottom half of the page, you can find detailed information about services that are actively listening for a connection, the current active connections to your system, and any available package updates that need to be installed.

[![The System Info tab in Linode Longview: Listening Services.](/docs/assets/1404-lv_system_sm.png)](/docs/assets/1405-lv_system.png)

To inspect the services that are actively waiting for a connection, select the **listening services** link, as shown above. Any processes waiting for a connection will appear in the lower-right corner of the page. This is a good way to verify that your services are running and listening on a particular port.

[![The System Info tab in Linode Longview: Active Connections.](/docs/assets/1399-lv_system_connections_sm.png)](/docs/assets/1400-lv_system_connections.png)

See who's connected to your system by selecting the **active connections** link, as shown above. All users with active connections are displayed.

 {{< note >}}
The `root` user may also appear in the list if there is an active SSH connection. That's because SSH runs as `root` before dropping privileges to the non-root account, and it never closes the file handle. This *does not* necessarily mean that the `root` user is connected via SSH.
{{< /note >}}

[![The System Info tab in Linode Longview: Available Packages.](/docs/assets/1402-lv_updates_sm.png)](/docs/assets/1403-lv_updates.png)

If there are updates available for your system's distribution, you can see them by selecting the **available package updates** link, as shown above. The available updates are listed by name, current version number, and new version number. To install the updates, you'll need to log in to your system and [update the installed packages](/docs/uptime/monitoring-and-maintaining-your-server/#updating-installed-packages).

## Using the Interface

To take full advantage of Longview's features, you'll need to learn how to view more data in the graphs and narrow their focus to a specific period in time. By changing the viewing history, you'll be able to see statistics for a longer period of time. And by zooming in on a graph, you'll narrow the graph's display to a specific point in time.

### Viewing History

By default, Longview displays statistics for the past twelve hours. However, if you've [upgraded to Longview Pro](#upgrading-to-longview-pro), you can change Longview's *viewing history* to review your system's statistics for a different time interval, like the previous 24 hours, or the last 30 days. This is a great way to investigate performance issues that occurred in the past. To change the viewing history, select a different interval from the viewing history menu in the top-right corner, as shown below.

[![Viewing history in Linode Longview.](/docs/assets/1460-longview_12hrs.png)](/docs/assets/1460-longview_12hrs.png)

All of the graphs will be updated to display data for the time interval you selected. To reset the time interval and reenable live updating, select **Past 30 minutes (live)** from the viewing history menu.

 {{< note >}}
If you have selected a time interval other than **Past 30 minutes (live)**, the graphs will not be automatically updated with new data.
{{< /note >}}

### Zooming

Longview allows you to *zoom* in on graphs to take a close look at a specific time interval. For example, if you saw a major spike in CPU usage that lasted 19 minutes, you could zoom in on that 19 minute interval to see the graphs in more detail. To zoom in, click and drag the pointer to select a specific portion of the graph, as shown below.

![Zooming in Linode Longview.](/docs/assets/1397-lv_zoom_crop_sm.png)

All of the graphs will be updated to display data for the time interval you selected. The graphs will stay set to the time interval you selected until you *reset the zoom*.

[![Zooming in Linode Longview.](/docs/assets/1233-longview29.png)](/docs/assets/1233-longview29.png)

When you're ready to reset the zoom and restore all of the graphics to the default 30 minute time interval, select the **Reset Zoom** link in the top-right corner, as shown above.

## Upgrading to Longview Pro

The free version of Longview updates every 5 minutes and provides only twelve hours of performance history. Upgrade to Longview Pro to get 60-second data resolution and start saving your entire system history.

Longview Pro is available at a tiered pricing plan. The default level for a new Longview account is **Longview Free**. To change your plan level, follow these instructions:

1.  Click the **Longview** tab.

    [![Linode Longview.](/docs/assets/1371-lv_overview_network_sm.png)](/docs/assets/1372-lv_overview_network.png)

2.  At the bottom of the overview page, click the **Subscription options** link. You will be taken to the plan selection page:

    [![The Longview subscription page.](/docs/assets/1377-lv_subscription_sm.png)](/docs/assets/1378-lv_subscription.png)

3.  Select the plan level from the list using the radio buttons. The plan options are as follows:
    -   **Longview Free:** Up to 10 clients, free.
    -   **Longview Pro 3 pack:** Up to 3 clients, for \$20 per month.
    -   **Longview Pro 10 pack:** Up to 10 clients, for \$40 per month.
    -   **Longview Pro 40 pack:** Up to 40 clients, for \$100 per month.
    -   **Longview Pro 100 pack:** Up to 100 clients, for \$200 per month.

4.  Click **Continue \>\>**.
5.  Review your order, then click **Complete Order**.

Longview will start collecting more than twelve hours of performance data after you upgrade.

## Troubleshooting

If you're experiencing problems with the Longview client application, please perform the following steps:

-   [Check the list of supported Linux distributions](#supported-distributions).
-   [Install all available package updates](/docs/uptime/monitoring-and-maintaining-your-server/#updating-installed-packages). Longview requires Perl 5.8 or later.
-   Check that your system is [using the latest kernel](/docs/uptime/monitoring-and-maintaining-your-server/#applying-kernel-updates). Use a newer kernel if possible. Linux 2.6.18 is supported, but does not include full functionality.
-   Make sure the Longview client is running on your system by entering the following command:

        service longview status

-   If the Longview client is not currently running, start it by entering the following command:

        service longview start

-   Check the Longview log for errors. The log file is located in `/var/log/linode/longview.log`.
-   Start the Longview client in "debug" mode for increased logging verbosity. Enter the following commands, one by one:

        service longview stop

    **Debian/Ubuntu:** :

        /etc/init.d/longview debug

    **Fedora/CentOS:** :

        /opt/linode/longview/Linode/Longview.pl debug

-   Verify that the Longview client can communicate with our servers. Add the following line to your [firewall rules](/docs/securing-your-server#configure-a-firewall):

        iptables -A OUTPUT -p tcp --dport 443 -d longview.linode.com -j ACCEPT

If you still need assistance after performing these steps, please open a [support ticket](/docs/platform/support/#contacting-linode-support).

## Updating Longview

Periodically, you will receive notices that a Longview update is available. To update the client, run the following command on your Linode via SSH:

Debian and Ubuntu:

    apt-get update
    apt-get install linode-longview

Fedora and CentOS:

    yum update linode-longview

On Debian and Ubuntu systems, you may receive a request to update your `init.d` script. You should choose **Y** for **Yes**:

    Configuration file `/etc/init.d/longview'
     ==> File on system created by you or by a script.
     ==> File also in package provided by package maintainer.
       What would you like to do about it ?  Your options are:
        Y or I  : install the package maintainer's version
        N or O  : keep your currently-installed version
          D     : show the differences between the versions
          Z     : start a shell to examine the situation
     The default action is to keep your current version.
    *** longview (Y/I/N/O/D/Z) [default=N] ? y

Your Longview client will now be up to date.

## Disabling Longview

To disable Longview on a system, you'll need to remove it from the Longview interface in the Linode Manager and then uninstall the Longview client application from the system.

### Removing Systems from Longview

First, you should remove a system from the Longview interface in the Linode Manager. Here's how:

1.  In the Linode Manager, select the **Longview** tab. The webpage shown below appears.

    [![Removing systems from Linode Longview.](/docs/assets/1388-lv_overview_mem_x_crop.png)](/docs/assets/1388-lv_overview_mem_x_crop.png)

2.  Locate the system you want to label, and then click the **X** button. The Remove Verification webpage appears.
3.  Click **Remove this system from Longview** to remove the system.

The system has been removed from the Longview interface in the Linode Manager. Repeat this process to remove other systems from Longview.

### Uninstalling the Longview Client

Next, you should remove the Longview client application from the system you want to stop monitoring. Here's how:

1.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#log-in-for-the-first-time).
2.  If you are using Debian or Ubuntu, enter the following command into the terminal window:

        sudo apt-get remove linode-longview

3.  If you are using Fedora or CentOS, enter the following command into the terminal window:

        sudo yum remove linode-longview

4.  If you are using another distribution, enter the following command into the terminal window:

        sudo rm -rf /opt/linode/longview

The Longview client application will be removed from your system. This completes the Longview removal process.

## Longview Apps

The Longview Apps extend Longview's statistics reporting to specific services running on your Linode.

-   [Longview App for Apache](/docs/longview/longview-for-apache)
-   [Longview App for Nginx](/docs/longview/longview-for-nginx)
-   [Longview App for MySQL](/docs/longview/longview-for-mysql)

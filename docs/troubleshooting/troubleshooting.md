---
author:
  name: Linode
  email: docs@linode.com
description: Our guide to performing basic troubleshooting.
keywords: troubleshooting
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['quick-start-troubleshooting/']
modified: 2017-03-06
modified_by:
  name: Nick Brewer
published: 2012-04-05
title: Troubleshooting
---

We know it's frustrating when you run into problems with your Linode. That's why we've created this introductory troubleshooting checklist. Use it to diagnose and resolve basic issues with your Linode through a process of elimination. Here's how:

-   Select the issue that best describes your problem
-   Follow the troubleshooting steps in the order they are presented
-   Once you've identified a problem, try fixing it with the suggested solutions
-   If you can't find your problem in this guide, take a look at the [troubleshooting manuals](/docs/troubleshooting)

If the issue you're experiencing isn't listed here, or if the recommended solution doesn't help, please feel free to [contact our Support team](/docs/support).

## Linode is Slow or Unresponsive

Use the following checklist if your Linode is running slowly or is completely unresponsive when you try to connect.

### Is the Linode powered on?

You can turn off a Linode, just like a physical computer. If you attempt to connect to your Linode when it's powered off, nothing will happen. To start troubleshooting, verify that your Linode is powered on. Here's how to check:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linode** tab. A list of your Linodes appears.
3.  Select a Linode. The Linode's dashboard appears, as shown below.

[![Check Linode boot status.](/docs/assets/952-troubleshooting1-1-small.png)](/docs/assets/953-troubleshooting1-1.png)

4.  Review the *Server Status* box on the sidebar to determine whether or not the server is powered on.
5.  If the server is powered off, click the **Boot** button to turn it on. Wait a couple of minutes for the server to boot.

If your Linode is already powered on, please continue to the next section.

### Can you ping the Linode?

Now that you've established that your Linode is turned on, you should verify that it is connected to the Internet and responding to ICMP packets. Here's how:

1.  Open a terminal application on your computer.
2.  Enter the following command, replacing `123.456.789.0` with the IP address of your Linode:

        ping 123.456.789.0

3.  The terminal application should be able to ping your server, as shown below:

        beaver:.ssh linodedemo$ ping 123.456.789.0
        PING 123.456.789.0 (123.456.789.0): 56 data bytes
        64 bytes from 123.456.789.0: icmp_seq=0 ttl=47 time=94.589 ms
        64 bytes from 123.456.789.0: icmp_seq=1 ttl=47 time=89.512 ms
        64 bytes from 123.456.789.0: icmp_seq=2 ttl=47 time=90.714 ms

4.  If you cannot ping the server, there may be a problem. Skip to the next section and try accessing the Linode with LISH. By default, your server is configured to respond to `ping`, but if you configured your firewall to block ICMP packets, the absence of a response is normal.
5.  If there is packet loss or high latency, follow the instructions in [Are you experiencing network issues?](#id3) This section can help you diagnose and isolate networking errors.

If you can successfully ping the server, please to continue to the next section.

### Can you log in to LISH?

To verify that your Linode is operating correctly, you should try to log in with the Linode Shell (LISH), which provides out of band access to your Linode from the Linode Manager. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linode** tab. A list of your Linodes appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click the **Remote Access** tab.
5.  Select the **Launch Lish Ajax Console** link. The LISH console window appears.
6.  Log in as `root` or another user. If you don't see a login prompt, press Enter. If you can't log in, [reset the root password](/docs/platform/accounts-and-passwords/#resetting-the-root-password) and try again.
7.  If the console is not responding, [contact Linode support](/docs/support).

    If you can log in, continue to the next section, even if there are error messages visible on the console.

    {{< note >}}
For more information about LISH, see [this guide](/docs/networking/using-the-linode-shell-lish).
{{< /note >}}

### Is your disk full?

If your Linode's disk is full, this can cause performance degradation and instability for your applications. Use the following command to determine the free space on your Linode's filesystem:

    df -h

The output will look similar to this:

    Filesystem      Size  Used Avail Use% Mounted on
	/dev/root       189G  166G   14G  93% /
	devtmpfs        3.9G     0  3.9G   0% /dev
	tmpfs           3.9G   16K  3.9G   1% /dev/shm
	tmpfs           3.9G  399M  3.6G  10% /run
	tmpfs           5.0M     0  5.0M   0% /run/lock
	tmpfs           3.9G     0  3.9G   0% /sys/fs/cgroup
	tmpfs           799M     0  799M   0% /run/user/1000

In this example, you can see that the root filesystem is 93% full. Here's a command you can use to list all files over 200MB on your root filesystem:

	sudo find / -xdev -type f -size +200M -exec ls -lah {} \;

You can adjust the `+200M` value in this command as needed, to search for files above a specific size.


#### Deleted Files

If a service deletes a file that it is no longer using, the file remains on your disk until the next time the service has been rebooted. In this example you'll see how deleted files belonging to Apache can take up space.

Use the following command to check for deleted files that are currently open:

	sudo lsof | grep deleted  | numfmt --field=8 --to=iec

This command will check the output of `lsof` for files marked as deleted, and will convert the file sizes so that they're more easily readable. In this example Apache is holding on to several old files:

	apache2   32341         www-data   13u      REG                8,0          0        24K /tmp/.ZendSem.OmCTIC (deleted)
	apache2   32341         www-data   14w      REG               0,19          0       243M /run/lock/apache2/proxy.13748 (deleted)
	apache2   32341         www-data   15w      REG               0,19          0       243M /run/lock/apache2/mpm-accept.13748 (deleted)
	apache2   32342         www-data   12w      REG               0,19          0       158M /run/lock/apache2/ssl-cache.13747 (deleted)
	apache2   32342         www-data   13u      REG                8,0          0        24K /tmp/.ZendSem.OmCTIC (deleted)
	apache2   32342         www-data   14w      REG               0,19          0       243M /run/lock/apache2/proxy.13748 (deleted)
	apache2   32342         www-data   15wW     REG               0,19          0       243M /run/lock/apache2/mpm-accept.13748 (deleted)
	apache2   32343         www-data   12w      REG               0,19          0       158M /run/lock/apache2/ssl-cache.13747 (deleted)

To free up this space, you can simply restart the Apache process on your Linode.

### Is the Linode out of memory?

The applications on your Linode require a certain amount of physical memory to function correctly. If all of the available physical memory is consumed, your Linode could slow down, display out of memory errors, or become unresponsive. Here's how to tell if your Linode is out of memory:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linode** tab. A list of your Linodes appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Click the **Remote Access** tab.
5.  Select the **Launch Lish Ajax Console** link. The LISH console window appears. If memory errors are displayed in the LISH console, stop some running services to free up memory or upgrade to larger plan.
6.  Your Linode might be out of memory even if you do not see any error messages in the LISH console. Execute the following command in the LISH console or a terminal window to determine whether or not your Linode still has free memory available:

        free -m

7.  Examine the output. The free memory available (in megabytes) is shown in the *-/+ buffers/cache* column and the *free* row, as shown below.

	[![Check free memory.](/docs/assets/941-troubleshooting3-1.png)](/docs/assets/941-troubleshooting3-1.png)

8.  A lack of free memory may indicate that an application is consuming all of your available memory. To see a list of running processes sorted by memory usage, execute the following command in the LISH console or a terminal window:

        ps -eo pmem,pcpu,rss,vsize,args --sort -pmem | less

9.  If an application is consuming all of your available memory, you have three options. You can kill the application, change the application's settings to reduce its memory footprint, or [upgrade your Linode](/docs/upgrading) to a larger plan.
10. To reduce the memory footprint of common applications like Apache and MySQL, see [Troubleshooting Memory and Networking Issues](/docs/troubleshooting/memory-networking).

If your Linode is not out of memory, continue to the next section.

### Are you experiencing network issues?

Network issues between your desktop computer and the data center can make your server appear slow or unavailable. You can check for issues with *upstream providers* by following the instructions in [Diagnosing Network Issues with MTR](/docs/linux-tools/mtr) to generate *my traceroute* (MTR) reports. MTR combines the functionality of the ping and traceroute programs in a single tool that can help diagnose and isolate networking problems. If the MTR reports indicate that there is a networking issue, use the following list to try resolving the issue yourself before contacting Linode support:

-   Most routing issues displayed in MTR reports are temporary and clear up within 24 hours.
-   If you have experienced degraded service for an extended period of time, you can contact a service provider about the issues you're experiencing. Be sure to send MTR reports and any other relevant data.
-   Network congestion over long distances and during peak times is normal. We recommended positioning hosts and resources as geographically close to the targeted audience as possible.

When contacting [Linode support](/docs/support) for assistance, please include the output of two MTR reports; one from your local network to your Linode, and another from your Linode to your local network's IP address. You can use a website such as [whatsmyip.org](http://www.whatsmyip.org/) to determine the IP address of your local network. If you're not able to connect to your Linode over SSH, you can connect using the [Lish](/docs/networking/using-the-linode-shell-lish) console to generate a report.

### Is there a Disk I/O bottleneck?

Disk input/output (I/O) bottlenecks can occur when an application or service is reading or writing an excessive amount of information to disk and the processor has to wait to process the information. High I/O wait can significantly slow down your server. Here's how to tell if your server currently has an I/O bottleneck:

1.  Open a terminal window and log in to your Linode via SSH.
2.  Enter `top` to access the `top` monitoring utility. The screen shown below appears.

	[![Check for Disk I/O bottleneck.](/docs/assets/939-troubleshooting2.png)](/docs/assets/939-troubleshooting2.png)

3.  Examine the I/O wait percentage, as shown above. If the number is zero, your server does not currently have a bottleneck.
4.  If your I/O wait percentage is above zero, verify that your server has enough free memory available. In many cases, high I/O is an indication that your server has started "swapping," or using disk space as memory.
5.  If your server has free memory available and is not using swap space, use `iotop` or [vmstat](/docs/uptime/monitoring/use-vmstat-to-monitor-system-performance) to find the application responsible for the excessive I/O. Databases are the usual suspects. You may need to stop and/or reconfigure the application.

 {{< note >}}
You must run `iotop` as `root` or with `sudo`.
{{< /note >}}

6.  If you cannot determine the source of the IO bottleneck, contact [Linode support](/docs/support) for assistance.

Since `top` only reports what is currently happening, and most I/O issues are temporary, it helps to have a monitoring utility set up so you can see a graph of I/O trends and spot potential issues *before* they become major problems. See the guides in [Server Monitoring](/docs/uptime/monitoring/) for instructions on setting up a server monitoring utility.

## Website is Not Loading

Use the following checklist if your website is not loading when you try to connect to it.

 {{< note >}}
You should follow all steps in the [Linode is Slow or Unresponsive](#linode-is-slow-or-unresponsive) section before using this checklist.
{{< /note >}}

### Have you added DNS records?

To host a website with a domain name, you must set the domain's name servers to point to Linode. You also need to add DNS records for the domain in the Linode Manager. For instructions, see [Adding DNS Records](/docs/websites/hosting-a-website/#add-dns-records). Please note that it can take up to 24 hours for DNS changes to be reflected.

Continue to the next section if you have pointed your domain name at Linode, added DNS records, and waited at least 24 hours.

### Is the web server running?

A web server like Apache should automatically start when you boot your Linode and stay running until you shut it down. However, web servers occasionally crash and need to be manually restarted. If your website is unresponsive, you should verify that the web server is running. Here's how:

1.  Open a terminal window and log in to your Linode via SSH.
2.  If you are running Apache, enter the following command. (If you are using a different web server, replace `apache2` with the name of your web server.) :

        sudo service apache2 status

3.  If Apache is running, you will see the following status message:

        Apache is running (pid 25931)

4.  If Apache is not running, try starting it by entering the following command:

        sudo service apache2 start

5.  Apache should start normally. If it doesn't, you'll need to troubleshoot the issue to resolution.

If the web server is running, continue to the next section.

### Is the database running?

The database running on your Linode is an integral part of many content management systems, like WordPress and Drupal. Like the web server, databases occasionally crash and need to be manually restarted. If your website is unresponsive, you should verify that the database is running. Here's how:

1.  If you are running MySQL, enter the following command. (If you are using a different database, replace `mysql` with the name of your database.) :

        sudo service mysql status

2.  If MySQL is running, you will see the following status message:

        mysql start/running, process 20611

3.  If MySQL is not running, try starting it by entering the following command:

        sudo service mysql start

4.  MySQL should start normally. If it doesn't, you'll need to troubleshoot the issue to resolution.

If the database is running, continue to the next section.

### Is port 80 or 443 blocked?

All web traffic is transferred over ports 80 and 443, so it's important to leave these ports open in your server's firewall. (Port 443 is generally only used for secure traffic encrypted with an SSL certificate.) If you previously configured an `iptables` firewall for your server and your website is unresponsive, you should check the firewall rules and verify that those ports are not blocked. Here's how:

1.  Check your Linode's default firewall rules by entering the following command:

        sudo iptables -L -nv

2.  Examine the output. If you previously configured a firewall with `iptables`, you should see the lines shown below:

        0  0 ACCEPT     tcp  --  *    *    0.0.0.0/0    0.0.0.0/0    tcp dpt:80
        0  0 ACCEPT     tcp  --  *    *    0.0.0.0/0    0.0.0.0/0    tcp dpt:443

3.  If those lines are not present, your firewall rules may be blocking traffic on ports 80 or 443. Review the instructions in [Creating a Firewall](/docs/securing-your-server/#configure-a-firewall) to revise and implement new firewall rules.
4.  Check for default `ACCEPT` and catch-all rules that send traffic transferred over ports 80 or 443 to `DROP` or `REJECT`.

If your firewall is not blocking ports 80 or 443, continue to the next section.

### Are the files in correct directory?

If your website is unavailable, verify that you uploaded the files for the website to the correct directory on your server. By default, Apache looks for files in `/usr/local/apache2`, but if you followed the instructions in the [Hosting a Website](/docs/hosting-website) guide, you'll want to place your files in `~/public/example.com/public`, where `example.com` is the name of your domain name.

If the files are in the correct directory, continue to the next section.

### Are virtual hosts correctly configured?

If you're hosting more than website on your Linode, verify that you correctly configured the virtual host configuration files. Review the instructions for [Configuring Name Based Virtual Hosts](/docs/websites/hosting-a-website#configure-name-based-virtual-hosts) and the [web server reference manuals](/docs/web-servers).

### Did you add a new IP address?

If you recently added a new IP address for an SSL certificate and it's not working, try rebooting your server. The reboot is required to activate the new IP address. You should have also configured a virtual host for the new IP address. Review the instructions for [Configuring Name Based Virtual Hosts](/docs/websites/hosting-a-website#configure-name-based-virtual-hosts) and the [web server reference manuals](/docs/web-servers).

## Can't Connect via SSH or FTP

Use the following checklist if you cannot connect to your Linode via SSH or an FTP client application.

 {{< note >}}
You should follow all steps in the [Linode is Slow or Unresponsive](#linode-is-slow-or-unresponsive) section before using this checklist.
{{< /note >}}

### Are you using Telnet or FTP?

Telnet and FTP are disabled on your Linode by default, and we strongly recommend that you do not use those protocols. Instead, please use Secure Shell (SSH) and SSH File Transfer Protocol (SFTP) - the secure versions of the Telnet and FTP protocols. All Linodes come with an SSH server enabled, and you can connect to port 22 with SSH and SFTP clients. For more information, see [Connecting to Your Linode](/docs/getting-started#connect-to-your-linode-via-ssh).

### Is port 22 blocked?

The SSH and SFTP protocols operate over port 22, so you will not be able to connect to your Linode if that port is blocked by your firewall rules. If you previously configured an `iptables` firewall for your server and you cannot connect to your server with a SSH or SFTP client, you should check the firewall rules and verify that those ports are not blocked. Here's how:

1.  Check your Linode's default firewall rules by entering the following command:

        sudo iptables -L -nv

2.  Examine the output. If you previously configured a firewall with `iptables`, you should see the line shown below:

        0  0 ACCEPT     tcp  --  *    *    0.0.0.0/0    0.0.0.0/0    state NEW tcp dpt:22

3.  If that line is not present, your firewall rules may be blocking traffic on ports 80 or 443. Review the instructions in [Securing Your Server](/docs/securing-your-server#configure-a-firewall) to revise and implement new firewall rules.
4.  Check for default `ACCEPT` and catch-all rules that send traffic transferred over port 22 to `DROP` or `REJECT`.

## Forgot My Username or Password

### Linode User/Root Password

If you've forgotten the password for the root user on your Linode, you can follow the our steps for [resetting the root password](/docs/platform/accounts-and-passwords/#resetting-the-root-password) from the Linode Manager.

Once you have access to your Linode as the root user, you can reset the password for any additional system users with the `passwd` command. In this case, we'll reset the password for the `example` user:

	passwd example

### Linode Manager User

*  If you forget your Linode Manager username, you can confirm it by supplying your email address [here](https://manager.linode.com/session/forgot/username).

*  Assuming you know your Linode Manager username, but you've forgotten the password, you can retrieve it [here](https://manager.linode.com/session/forgot/password).

If you've followed these steps, but you're still having trouble accessing your account, please [contact Support](/docs/platform/support#contacting-linode-support).

## Linode Manager is Displaying "Incorrect" Information

Use the following checklist if the Linode Manager is displaying "incorrect" information.

### Did you recently change your account?

If you recently created a new account, resized an existing Linode, or added extra bandwidth, the bandwidth displayed in the Linode Manager will be prorated for the amount of time left in the current billing cycle. For example, if you create an account on the 15th day of the month, the Manager will indicate that your account has been allocated half of the plan's bandwidth for the current month. This information is an accurate representation of the bandwidth available for the rest of the billing period. When then next billing period starts, the Manager will indicate that all of the plan's bandwidth is available.

### Did you add additional storage?

If you recently upgraded your plan, your Linode won't be able to take advantage of the additional space until you resize the disk. You can use the Linode Manager to see if there's additional storage space available for disks:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linode** tab. A list of your Linodes appears.
3.  Select a Linode. The Linode's dashboard appears.
4.  Examine the *Storage* pane on the sidebar, as shown below. If you have free storage space, you can allocate that space to your existing disks.

[![Resize disks.](/docs/assets/944-troubleshooting4-1.png)](/docs/assets/944-troubleshooting4-1.png)

Follow our steps for [resizing a disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#resizing-a-disk) to take advantage of the extra space.

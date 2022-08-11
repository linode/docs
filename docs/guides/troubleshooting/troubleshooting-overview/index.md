---
slug: troubleshooting-overview
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides you with a reference for common troubleshooting scenarios you may encounter when managing your Linode. Multiple sections are included.'
keywords: ['troubleshooting']
tags: ["linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/quick-start-troubleshooting/','/troubleshooting/troubleshooting/']
modified: 2019-02-01
modified_by:
  name: Linode
published: 2012-04-05
title: Troubleshooting Overview
---

This guide provides common troubleshooting scenarios you may encounter when managing your Linode. Each troubleshooting section provides ways to further diagnose your issue and, when applicable, corresponding steps to resolve it. We recommend using this guide in the following way:

-   Browse the guide's headings and select the issue that best describes your problem.

-   Follow the troubleshooting steps in the order they are presented.

-   Once you've confirmed a specific problem, try fixing it with the suggested solutions.

-   If you can't find your problem in this guide, take a look at some of our other [troubleshooting manuals](/docs/troubleshooting/).

{{< disclosure-note "Additional resources for help" >}}
This guide explains how to use different troubleshooting commands on your Linode. These commands can produce diagnostic information and logs that may expose the root of your connection issues. For some specific examples of diagnostic information, this guide also explains the corresponding cause of the issue and presents solutions for it.

If the information and logs you gather do not match a solution outlined here, consider searching the [Linode Community Site](https://www.linode.com/community/questions/) for posts that match your system's symptoms. Or, post a new question in the Community Site and include your commands' output.

Linode is not responsible for the configuration or installation of software on your Linode. Refer to Linode's [Scope of Support](/docs/guides/support/#scope-of-support) for a description of the issues with which Linode Support can help.
{{< /disclosure-note >}}

## Linode is Unresponsive

If your Linode is unresponsive, either at the Lish console or to basic network requests, read through the [Troubleshooting Basic Connection Issues](/docs/guides/troubleshooting-basic-connection-issues/) guide.

## Linode is Slow

{{< note >}}
You should follow all steps in the [Troubleshooting Basic Connection Issues](/docs/guides/troubleshooting-basic-connection-issues/) guide before using the checklist in this section.
{{< /note >}}

### Is your Disk Full?

If your Linode's disk is full, this can cause performance degradation and instability for your applications. Use the following command to determine the free space on your Linode's filesystem:

    df -h

The output will resemble the following example:

{{< output >}}
    Filesystem      Size  Used Avail Use% Mounted on
    /dev/root       189G  166G   14G  93% /
    devtmpfs        3.9G     0  3.9G   0% /dev
    tmpfs           3.9G   16K  3.9G   1% /dev/shm
    tmpfs           3.9G  399M  3.6G  10% /run
    tmpfs           5.0M     0  5.0M   0% /run/lock
    tmpfs           3.9G     0  3.9G   0% /sys/fs/cgroup
    tmpfs           799M     0  799M   0% /run/user/1000
{{</ output >}}

In the example output, you can see that the root filesystem is 93% full. Issue the following command to list all files over 200MB on your root filesystem:

    sudo find / -xdev -type f -size +200M -exec ls -lah {} \;

You can adjust the `+200M` value in this command, as needed, to search for files above a specific size.

#### Deleted Files

If a service deletes a file that it is no longer needed, the file remains on your disk until the next time the service has been rebooted. The following example demonstrates how deleted files belonging to Apache can continue to take up space after they have been deleted.

Use the following command to check for deleted files that are currently open:

    sudo lsof | grep deleted  | numfmt --field=8 --to=iec

This command will check the output of `lsof` for files marked as deleted, and will convert the file sizes so that they're more easily readable. In this example Apache is holding on to several old files:

{{< output >}}
    apache2   32341         www-data   13u      REG                8,0          0        24K /tmp/.ZendSem.OmCTIC (deleted)
    apache2   32341         www-data   14w      REG               0,19          0       243M /run/lock/apache2/proxy.13748 (deleted)
    apache2   32341         www-data   15w      REG               0,19          0       243M /run/lock/apache2/mpm-accept.13748 (deleted)
    apache2   32342         www-data   12w      REG               0,19          0       158M /run/lock/apache2/ssl-cache.13747 (deleted)
    apache2   32342         www-data   13u      REG                8,0          0        24K /tmp/.ZendSem.OmCTIC (deleted)
    apache2   32342         www-data   14w      REG               0,19          0       243M /run/lock/apache2/proxy.13748 (deleted)
    apache2   32342         www-data   15wW     REG               0,19          0       243M /run/lock/apache2/mpm-accept.13748 (deleted)
    apache2   32343         www-data   12w      REG               0,19          0       158M /run/lock/apache2/ssl-cache.13747 (deleted)
{{</ output >}}

To free up this space, you can simply restart the Apache service on your Linode. This command restarts the Apache service using [systemd](/docs/guides/what-is-systemd/) on Ubuntu 18.04:

    sudo systemd restart apache2

### Is the Linode Out of Memory?

The applications on your Linode require a certain amount of physical memory to function correctly. If all of the available physical memory is consumed, your Linode could slow down, display out of memory errors, or become unresponsive. Here's how to tell if your Linode is out of memory:

1.  Log in to the [Linode Cloud Manager](https://cloud.linode.com).
1.  Click the **Linodes** link in the sidebar to view a list of all your Linodes.
1.  Select a Linode to view its dashboard.
1.  Click on the **Launch Console** link in the upper-right hand corner to launch the LISH Console. The LISH console window appears. If memory errors are displayed in the LISH console, stop some running services to free up memory or [upgrade to a larger plan](/docs/guides/resizing-a-linode/).
1.  Read through the [Troubleshooting Memory and Networking Issues](/docs/guides/troubleshooting-memory-and-networking-issues/) guide for troubleshooting commands which display your memory use.
1.  If an application is consuming all of your available memory, you have three options. You can kill the application, change the application's settings to reduce its memory footprint, or [upgrade your Linode](https://www.linode.com/pricing) to a larger plan.

If your Linode is not out of memory, continue to the next section.

### Is there a Disk I/O Bottleneck?

Disk input/output (I/O) bottlenecks can occur when an application or service is reading or writing an excessive amount of information to disk and the processor has to wait to process the information. High I/O wait can significantly slow down your server. To determine if your server currently has an I/O bottleneck, follow the steps below:

1.  [Log in to your Linode via SSH](/docs/getting-started-new-manager/#connect-to-your-linode-via-ssh).
1.  Enter `top` to access the `top` monitoring utility. The screen shown below appears.

    ![Check for Disk I/O bottleneck.](939-troubleshooting2.png)

1.  Examine the I/O wait percentage, as shown above. If the number is zero, your server does not currently have a bottleneck.
1.  If your I/O wait percentage is above zero, verify that your server has enough [free memory available](/docs/troubleshooting/troubleshooting/#is-the-linode-out-of-memory). In many cases, high I/O is an indication that your server has started "swapping," or using disk space as memory.
1.  If your server has free memory available and is not using swap space, use `iotop` or [vmstat](/docs/guides/use-vmstat-to-monitor-system-performance/) to find the application responsible for the excessive I/O. Databases are often a source of excessive I/O. You may need to stop and/or reconfigure the application.

     {{< note >}}
You must run `iotop` as `root` or with `sudo`.
    {{< /note >}}

1.  If you cannot determine the source of the IO bottleneck, contact [Linode support](/docs/guides/support/) for assistance.

Since `top` only reports what is currently happening, and most I/O issues are temporary, it helps to have a monitoring utility set up so you can see a graph of I/O trends and spot potential issues *before* they become major problems. See the guides in [Server Monitoring](/docs/uptime/monitoring/) for instructions on setting up a server monitoring utility.

## Website is Not Loading

If your website is unresponsive or not loading correctly, read through the [Troubleshooting Web Servers, Databases, and Other Services](/docs/guides/troubleshooting-web-servers-databases-other-services/) guide.

{{< note >}}
You should follow all steps in the [Linode is Slow](#linode-is-slow) section before following the [Troubleshooting Web Servers, Databases, and Other Services](/docs/guides/troubleshooting-web-servers-databases-other-services/) guide.
{{< /note >}}

## Can't Connect via SSH or FTP

If you can't connect to your Linode over SSH, read through the [Troubleshooting SSH](/docs/guides/troubleshooting-ssh/) guide.

{{< note >}}
You should follow all steps in the [Linode is Slow](#linode-is-slow) section before following the [Troubleshooting SSH](/docs/guides/troubleshooting-ssh/) guide.
{{< /note >}}

### Are You Using Telnet or FTP?

Telnet and FTP are disabled on your Linode by default, and we strongly recommend that you do not use those protocols. Instead, please use Secure Shell (SSH) and SSH File Transfer Protocol (SFTP) -- the secure versions of the Telnet and FTP protocols. All Linodes come with an SSH server enabled, and you can connect to port 22 with SSH and SFTP clients. For more information, see [Connecting to Your Linode](/docs/guides/set-up-and-secure/#connect-to-the-instance).

## Forgot My Username or Password

### Linode User/Root Password

If you've forgotten the password for the root user on your Linode, you can follow the steps for [resetting your root password](/docs/guides/reset-the-root-password-on-your-linode/) from the Linode Manager.

Once you have access to your Linode as the root user, you can reset the password for any additional system users with the `passwd` command. The example resets the password for the `username` user:

    passwd username

### Linode Manager User

*  If you forget your Linode Manager username, you can confirm it by supplying your email address on the [Recover Username](https://login.linode.com/forgot/username) page.

*  Assuming you know your Linode Manager username, but you've forgotten the password, you can retrieve it on the [Forgot Password](https://login.linode.com/forgot/password) page.

If you've followed these steps, but you're still having trouble accessing your account, please [contact Support](https://www.linode.com/support/).

## Linode Manager is Displaying "Incorrect" Information

Use the following checklist if the Linode Manager is displaying "incorrect" information.

### Did You Recently Change your Account?

If you recently created a new account, resized an existing Linode, or added extra bandwidth, the bandwidth displayed in the Linode Cloud Manager will be prorated for the amount of time left in the current billing cycle. For example, if you create an account on the 15th day of the month, the Manager will indicate that your account has been allocated half of the plan's bandwidth for the current month. This information is an accurate representation of the bandwidth available for the rest of the billing period. When then next billing period starts, the Manager will indicate that all of the plan's bandwidth is available. View the [Billing and Payments](/docs/guides/understanding-billing-and-payments/) guide for more information.

### Did You Add Additional Storage?

If you recently upgraded your plan, your Linode won't be able to take advantage of the additional space until you resize the disk. You can use the Linode Cloud Manager to verify if there's additional storage space available for disks:

1.  Log in to the [Linode Cloud Manager](https://cloud.linode.com).
1.  Click the **Linodes** link in the sidebar to view a list of your Linodes.
1.  Select a Linode and the **Storage** tab.
1.  Compare the total available disk space with the **Size** Column in the **Disks** table. If you have free storage space, you can allocate that space to your existing disks, or create new disks as needed.

    ![Disk storage allocation](disk-storage-allocation.png)

    Follow our steps for [resizing a disk](/docs/guides/disks-and-storage/#resizing-a-disk) to take advantage of the extra space.
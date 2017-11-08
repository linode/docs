---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will help you set up your first Linode.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-10-10
modified_by:
  name: Linode
published: 2009-07-19
title: Getting Started with Linode
show_on_frontpage: true
title_short: "Getting Started"
weight: 10
icon: "book"
---

Thank you for choosing Linode as your cloud hosting provider! This guide will help you sign up for an account, set up a Linux distribution, boot your Linode, and perform some basic system administration tasks.

<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/35724r19mr?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div><script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Sign Up

If you haven't already signed up for a Linode account, start here.

1.  Create a new account at the [Sign Up page](https://manager.linode.com/signup).
2.  Sign in and enter your billing and account information. Most accounts are activated instantly, but some require manual review prior to activation. If your account is not immediately activated, you will receive an email with additional instructions.
3.  Select a Linode plan and datacenter location

    ![Available Linode plans](/docs/assets/linode-manager-select-plan.png)

If you're unsure of which datacenter to select, see our [speed test](http://www.linode.com/speedtest) to determine which location provides the best performance for your target audience. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for each of the datacenters to determine which of our facilities provides the best latency from your particular location.

## Provision Your Linode

After your Linode is created, you'll need to prepare it for operation by setting up a Linux distribution.

### Log in to the Linode Manager

The [Linode Manager](https://manager.linode.com) is a web-based control panel that allows you to manage your Linode virtual servers and services. Log in with the `username` and `password` you created when you signed up. After you've created your first Linode, you can use the Linode Manager to:

* Boot and shut down your virtual server,
* Access monitoring statistics,
* Update your billing and account information,
* Request support and perform other administrative tasks.

### Deploy an Image

After creating a new Linode, select it to open the Linode Manager Dashboard.

1.  Click on **Deploy an Image**.

    [![Linux Dashboard](/docs/assets/linode-manager-dashboard-newacct_small.png)](/docs/assets/linode-manager-dashboard-newacct.png)

    The *Deploy* page opens.

    [![Deploy a Linux Image](/docs/assets/linode-manager-deploy-an-image_small.png)](/docs/assets/linode-manager-deploy-an-image.png)

2.  Select a Linux distribution from the **Image** menu. You can choose from [Arch Linux](http://www.archlinux.org/), [CentOS](http://www.centos.org/), [Debian](http://www.debian.org/), [Fedora](http://fedoraproject.org/), [Gentoo](http://www.gentoo.org/), [openSUSE](http://www.opensuse.org/), [Slackware](http://www.slackware.com/), and [Ubuntu](http://www.ubuntu.com/) to install on your Linode. If you're new to the Linux operating system, consider selecting Ubuntu 16.04 LTS. Ubuntu is the most popular distribution among Linode customers and one of the most well-supported by online communities, so resolving any issues you may have should be simple.

3.  Enter a size for the disk in the **Deployment Disk Size** field. By default all of the available space is allocated, but you can set a lower size if you plan on cloning a disk or creating multiple configuration profiles. You can always create, resize, and delete disks later.

4.  Select a swap disk size from the **Swap Disk** menu.

5. Enter a root password for your Linode in the **Root Password** field. This password must be provided when you log in to your Linode via SSH and must be at least 6 characters long and contain characters from two of the following categories:

    -   lowercase and uppercase case letters
    -   numbers
    -   punctuation characters

6.  Click **Deploy**.

    You can use the Linode Manager's Dashboard to monitor the progress in real time as shown below.

    [![Provisioning Status](/docs/assets/linode-manager-provisioning-status_small.png)](/docs/assets/linode-manager-provisioning-status.png)

    When the deployment process is completed, your Linode's configuration profile will appear on the Dashboard.

    [![Configuration Profile](/docs/assets/linode-manager-configuration-profile_small.png)](/docs/assets/linode-manager-configuration-profile.png)

    {{< note >}}
Use a [StackScript](http://www.linode.com/stackscripts) to quickly deploy a customized Linux distribution. Some of the most popular StackScripts do things like install the Apache web server, configure a firewall, and set up the WordPress content management system. They're easy to use. Just find a StackScript, complete the form, and deploy.
{{< /note >}}

## Boot Your Linode

Your Linode is now provisioned with the distro of your choice but it's turned off, as indicated in the Dashboard.

Click **Boot** to turn on your Linode.

[![Boot your Linode](/docs/assets/linode-manager-power-on-linode_small.png)](/docs/assets/linode-manager-power-on-linode.png)

When booted, the **Server Status** will change from **Powered Off** to **Running** and there will be a successfully completed **System Boot** job in the **Host Job Queue**.

[![Linode Booted](/docs/assets/linode-manager-linode-booted_small.png)](/docs/assets/linode-manager-linode-booted.png)

## Connect to Your Linode via SSH

Communicating with your Linode is usually done using the secure shell (SSH) protocol. SSH encrypts all of the data transferred between the SSH client application on your computer and the Linode, including passwords and other sensitive information. There are SSH clients available for every operating system.

### SSH Overview

-   **Linux:** You can use a terminal window, regardless of desktop environment or window manager.
-   **Mac:** The *Terminal* application comes pre-installed with OS X and you can launch it from *Finder* > *Applications* > *Utilities*. You could also use the free [iTerm 2 application](http://www.iterm2.com/). For a walk-through of connecting to your Linode for the first time **with OS X** (which also directly applies to Linux), see the following video:

    <iframe width="560" height="315" src="https://www.youtube.com/embed/VVs9Ed-HkjE" frameborder="0" allowfullscreen></iframe>

-   **Windows:** There is no native SSH client, but you can use a free, open source application called [PuTTY](/docs/networking/using-putty). For a walk-through of connecting to your Linode in Windows using PuTTY, see the following video:

    <iframe width="560" height="315" src="https://www.youtube.com/embed/eEsCD7n17mk" frameborder="0" allowfullscreen></iframe>

### Find the IP Address of Your Linode

Your Linode has a unique *IP address* that identifies it to other devices and users on the internet. For the time being, you'll use the IP address to connect to your server. After you perform some of these initial configuration steps outlined in the Linode Quick Start Guides, you can use [DNS records](/docs/hosting-website#add-dns-records) to point a domain name at your server and give it a more recognizable and memorable identifier.

Find your Linode's IP address from the [Linode Manager](https://manager.linode.com).

1.  Click the **Linodes** tab.
2.  Select your Linode.
3.  Click the **Remote Access** tab.
4.  Copy the addresses in the Public IPs section.

    [![Public IPs.](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

In this example, the Linode's IPv4 address is *96.126.109.54* and its IPv6 address is *2600:3c03::f03c:91ff:fe70:cabd*. Unless your internet service provider supports IPv6, you'll want to the use the IPv4 address.

### Log In for the First Time

Once you have the IP address and an SSH client, you can log in via SSH. The following instructions are written for Linux and Mac OS X. If you're using PuTTY as your SSH client in Windows, follow [these instructions](/docs/networking/using-putty).

1.  Enter the following into your terminal window or application. Replace the example IP address with your Linode's IP address:

        ssh root@123.456.78.90

2.  If this is the first time connecting to your Linode, you'll see the authenticity warning below. This is because your SSH client has never encountered the server's key fingerprint before. Type `yes` and press **Enter** to continue connecting.

        The authenticity of host '123.456.78.90 (123.456.78.90)' can't be established.
        RSA key fingerprint is 11:eb:57:f3:a5:c3:e0:77:47:c4:15:3a:3c:df:6c:d2.
        Are you sure you want to continue connecting (yes/no)?

    After you enter `yes`, the client confirms the addition:

        Warning: Permanently added '123.456.78.90' (RSA) to the list of known hosts.

3.  The login prompt appears for you to enter the password you created for the `root` user above.

        root@123.456.78.90's password:

4.  The SSH client initiates the connection. You'll know you're logged in when the following prompt appears:

        root@li123-456:~#

 {{< note >}}
If you recently rebuilt an existing Linode, you might receive an error message when you try to
reconnect via SSH. SSH clients try to match the remote host with the known keys on your desktop computer, so when you rebuild your Linode, the remote host key changes.

To reconnect via SSH, revoke the key for that IP address.

For Linux and Mac OS X:

    ssh-keygen -R 123.456.789

For Windows, PuTTY users must remove the old host IP addresses manually. PuTTY's known hosts are in the registry entry:

HKEY_CURRENT_USER\Software\SimonTatham\PuTTY\SshHostKeys
{{< /note >}}

## Install Software Updates

The first thing you should do when connecting to your Linode is update the Linux distribution's software. This applies the latest security patches and bug fixes to help protect your Linode against unauthorized access.

Installing software updates should be performed *regularly*. If you need help remembering, try creating a monthly alert with the calendar application on your desktop computer.

### Ubuntu / Debian

    apt-get update && apt-get upgrade

{{< note >}}
Ubuntu may prompt you when the Grub package is updated. If prompted, select `keep the local version currently installed`.
{{< /note >}}

### CentOS

    yum update

### Fedora

    dnf upgrade

### Arch Linux

    pacman -Syu

### Gentoo

    emaint sync -a

After running a sync, it may end with a message that you should upgrade Portage using a `--oneshot` emerge comand. If so, run the Portage update. Then update the rest of the system:

    emerge --uDN @world

### Slackware

    slackpkg update
    slackpkg upgrade-all

## Setting the Hostname

Your system's hostname should be something unique. Some people name their servers after planets, philosophers, or animals. Note that the hostname has no relationship to websites or email services hosted on it, aside from providing a name for the system itself. Your hostname should *not* be "www" or anything too generic. If you want to assign your system a fully qualified domain name, see our guide on using your system's [hosts file](/docs/networking/dns/using-your-systems-hosts-file).

Once you're done, you can verify by running the command `hostname`.

### Arch / CentOS 7 / Debian 8 / Fedora / Ubuntu 16.04 and above

Replace `example_hostname` with one of your choice.

    hostnamectl set-hostname example_hostname

### Debian 7 / Slackware / Ubuntu 14.04

Replace `example_hostname` with one of your choice.

    echo "example_hostname" > /etc/hostname
    hostname -F /etc/hostname

{{< note >}}
Debian and Ubuntu include a line in their hosts file for a loopback domain by default (127.0.1.1), but even though they're closely related, the commands above to set a hostname don't change the loopback domain.

The result is the message when using sudo commands: *sudo: unable to resolve host* . To fix this, add your hostname to the hosts file as shown in the last example [here](/docs/networking/dns/using-your-systems-hosts-file).
{{< /note >}}

### CentOS 6

Replace `hostname` with one of your choice.

    echo "HOSTNAME=example_hostname" >> /etc/sysconfig/network
    hostname "hostname"

### Gentoo

Enter the following commands to set the hostname, replacing `example_hostname` with the hostname of your choice:

    echo "HOSTNAME=\"example_hostname\"" > /etc/conf.d/hostname
    /etc/init.d/hostname restart

## Set the Timezone

By default, a Linode's Linux image will be set to UTC time (also known as Greenwich Mean Time), but this can be changed. It may be better to use the same timezone which a majority of your users are located in, or that you live in to make log file timestamps more sensible.

### Debian / Ubuntu

    dpkg-reconfigure tzdata

### Arch Linux and CentOS 7

View the list of available time zones.

    timedatectl list-timezones

Use the `Up`, `Down`, `Page Up` and `Page Down` keys to navigate. Find the time zone which you want. Remember it, write it down or copy it as a mouse selection. Then press **q** to exit the list.

To set the time zone:

    timedatectl set-timezone 'America/New_York'

### Gentoo

View the list of available time zones.

    ls /usr/share/zoneinfo

Write the selected time zone to the `/etc/timezone` file.

*Example (for Eastern Standard Time)*:

    echo "EST" > /etc/timezone

Configure the `sys-libs/timezone-data` package, which will set `/etc/localtime` appropriately.

    emerge --config sys-libs/timezone-data

### Check the Time

View the current date and time according to your server.

    date

The output should look similar to: `Thu Feb 16 12:17:52 EST 2012`.

## Next Steps

Now that you have an up-to-date Linode, you'll need to secure your Linode and protect it from unauthorized access. Read the [Securing Your Server](/docs/security/securing-your-server) quick start guide to get going.

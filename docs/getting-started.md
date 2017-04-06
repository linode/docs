---
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to deploying your first Linode.'
keywords: 'linode guide,getting started,linode quickstart,quick start,boot,configuration profile,update,hostname,timezone,SSH'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Friday, March 3rd, 2017
modified_by:
  name: Linode
published: 'Sunday, July 19th, 2009'
title: Getting Started with Linode
---

Congratulations on selecting Linode as your cloud hosting provider! This guide will help you sign up for an account, deploy a Linux distribution, boot your Linode, and perform some basic system administration tasks.

<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/35724r19mr?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div><script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Sign Up

If you haven't already signed up for a Linode account, start here.

1.  Create a new account at the [Sign Up page](https://manager.linode.com/signup).
2.  Sign in and enter your billing and account information. Most accounts are activated instantly but some require manual review prior to activation. If your account is not immediately activated, you will receive an email with additional instructions.
3.  Select a Linode plan and data center location

    ![Available Linode plans](/docs/assets/linode-manager-select-plan.png)

If you're unsure of which data center to select, see our [speed test](http://www.linode.com/speedtest) to determine which location provides the best performance for your target audience. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for each of the data centers to determine which of our facilities provides the best latency from your particular location.

## Provisioning Your Linode

After your Linode is created, you'll need to prepare it for operation by deploying a Linux distribution.

### Logging in to the Linode Manager

The [Linode Manager](https://manager.linode.com) is a web-based control panel that allows you to manage your Linode virtual servers and services. Log in with the `username` and `password` you created when you signed up. After you've created your first Linode, you can use the Linode Manager to:

* Boot and shut down your virtual server,
* Access monitoring statistics,
* Update your billing and account information,
* Request support and perform other administrative tasks.

### Deploying an Image

After creating a new Linode, select it to open the Linode Manager Dashboard.

1.  Click on **Deploy an Image**.

    [![Linux Dashboard](/docs/assets/linode-manager-dashboard-newacct_small.png)](/docs/assets/linode-manager-dashboard-newacct.png)

    The *Deploy* page opens.

    [![Deploy a Linux Image](/docs/assets/linode-manager-deploy-an-image_small.png)](/docs/assets/linode-manager-deploy-an-image.png)

2.  Select a Linux distribution from the **Image** menu. You can choose from [Arch Linux](http://www.archlinux.org/), [CentOS](http://www.centos.org/), [Debian](http://www.debian.org/), [Fedora](http://fedoraproject.org/), [Gentoo](http://www.gentoo.org/), [openSUSE](http://www.opensuse.org/), [Slackware](http://www.slackware.com/), and [Ubuntu](http://www.ubuntu.com/) to install on your Linode. If you're new to the Linux operating system, consider selecting Ubuntu 16.04 LTS. Ubuntu is the most popular distribution among Linode customers and one of the most well supported by online communities, so resolving any issues you may have should be simple.

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

    {: .note }
    >
    > Use a [StackScript](http://www.linode.com/stackscripts) to quickly deploy a customized Linux distribution. Some of the most popular StackScripts do things like install the Apache web server, configure a firewall, and set up the WordPress content management system. They're easy to use. Just find a StackScript, complete the form, and deploy.

## Booting Your Linode

Your Linode is now provisioned with the distro of your choice but it's turned off, as indicated in the Dashboard.

Click **Boot** to turn on your Linode.

[![Boot your Linode](/docs/assets/linode-manager-power-on-linode_small.png)](/docs/assets/linode-manager-power-on-linode.png)

When booted, the **Server Status** will change from **Powered Off** to **Running** and there will be a successfully completed **System Boot** job in the **Host Job Queue**.

[![Linode Booted](/docs/assets/linode-manager-linode-booted_small.png)](/docs/assets/linode-manager-linode-booted.png)

## Connecting to Your Linode via SSH

Communicating with your Linode is usually done using the secure shell (SSH) protocol. SSH encrypts all of the data transferred between the SSH client application on your computer and the Linode, including passwords and other sensitive information. There are SSH clients available for every operating system.

### SSH Overview

-   **Linux:** You can use a terminal window, regardless of desktop environment or window manager.
-   **Mac:** The *Terminal* application comes pre-installed with OS X and you can launch it from *Finder* > *Applications* > *Utilities*. You could also use the free [iTerm 2 application](http://www.iterm2.com/). For a walkthrough of connecting to your Linode for the first time **with OS X** (which also directly applies to Linux), see the following video:

    <iframe width="560" height="315" src="https://www.youtube.com/embed/VVs9Ed-HkjE" frameborder="0" allowfullscreen></iframe>

-   **Windows:** There is no native SSH client but you can use a free, open source application called [PuTTY](/docs/networking/using-putty). For a walkthrough of connecting to your Linode in Windows using PuTTY, see the following video:

    <iframe width="560" height="315" src="https://www.youtube.com/embed/eEsCD7n17mk" frameborder="0" allowfullscreen></iframe>

    {: .note }
    >
    > These videos were created by [Treehouse](http://www.teamtreehouse.com), which is offering Linode customers a free one month trial. [Click here](http://teamtreehouse.com/join/free-month?utm_source=linode&utm_medium=partnership&utm_campaign=linode-2013&cid=1124) to start your free trial and start learning web design, web development, and more.

### Find the IP Address of Your Linode

Your Linode has a unique *IP address* that identifies it to other devices and users on the Internet. For the time being, you'll use the IP address to connect to your server. After you perform some of these initial configuration steps outlined in the Linode Quick Start Guides, you can use [DNS records](/docs/hosting-website#sph_adding-dns-records) to point a domain name at your server and give it a more recognizable and memorable identifier.

Find your Linode's IP address from the [Linode Manager](https://manager.linode.com).

1.  Click the **Linodes** tab.
2.  Select your Linode.
3.  Click the **Remote Access** tab.
4.  Copy the addresses in the Public IPs section.

    [![Public IPs.](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

In this example, the Linode's IPv4 address is *96.126.109.54* and its IPv6 address is *2600:3c03::f03c:91ff:fe70:cabd*. Unless your Internet service provider supports IPv6, you'll want to the use the IPv4 address.

### Logging in for the First Time

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

 {: .note }
>
> If you recently rebuilt an existing Linode, you might receive an error message when you try to
> reconnect via SSH. SSH clients try to match the remote host with the known keys on your desktop computer, so when you rebuild your Linode, the remote host key changes.
>
>To reconnect via SSH, revoke the key for that IP address.
>
>For Linux and Mac OS X:
>
> ~~~
> ssh-keygen -R 123.456.789
> ~~~
>
> For Windows, PuTTY users must remove the old host IP addresses manually. PuTTY's known hosts are in the registry entry:
>
>     HKEY_CURRENT_USER\Software\SimonTatham\PuTTY\SshHostKeys

## Installing Software Updates

The first thing you should do when connecting to your Linode is update the Linux distribution's software. This applies the latest security patches and bug fixes to help protect your Linode against unauthorized access.

Installing software updates should be performed *regularly*. If you need help remembering, try creating a monthly alert with the calendar application on your desktop computer.

### Ubuntu / Debian

    apt-get update && apt-get upgrade

{: .note }
>
>Ubuntu may prompt you when the Grub package is updated.
>If prompted, select `keep the local version currently installed`.

### CentOS

    yum update

### Fedora

    dnf upgrade

### Arch Linux

    pacman -Syu

### Gentoo

    emaint sync

{: .note}
>emaint is a [plugin](https://gentoo.org/support/news-items/2015-02-04-portage-sync-changes.html) for emerge, so `emerge --sync` is no longer used and that command now just calls `emaint sync`. The sync command uses the `auto` option by default. See [here](https://wiki.gentoo.org/wiki/Project:Portage/Sync#Operation) for more info on what that means and when you may want to change it. For more information on how to use `emaint`, refer to its [man page](https://dev.gentoo.org/~zmedico/portage/doc/man/emaint.1.html).

After running a sync, it may end with a message that you should upgrade Portage using a *--oneshot* emerge comand. If so, run the Portage update. Then update the rest of the system:
    
    emerge --uDN @world

### Slackware

    slackpkg update
    slackpkg upgrade-all

See the [Slackpkg documentation](http://slackpkg.org/documentation.html) for more information on package management in Slackware.

## Setting the Hostname

You'll need to set your system's hostname and fully qualified domain name (FQDN). Your hostname should be something unique. Some people name their servers after planets, philosophers, or animals. Note that the system's hostname has no relationship to websites or email services hosted on it, aside from providing a name for the system itself. Your hostname should *not* be "www" or anything too generic.

Once you're done, you can verify by running the command `hostname`.

{: .note }
>
> If you're unfamiliar with Linux, one of the first things you'll need to learn is how to use [nano](/docs/linux-tools/text-editors/nano), a text editor included with most distributions. To open a file for editing, type `nano file.txt` where "file.txt" is the name of the file you want to create or edit. If the file is not in your current working directory, specify the entire file path. For example, open the `hosts` file with:
>
>     nano /etc/hosts
>
>When you're finished editing, press `Control-X`, then `Y` to save the changes and `Enter` to confirm.

For a walkthrough of setting system's hostname and timezone, see the following video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/KFd66g4k4i8" frameborder="0" allowfullscreen></iframe>

{: .note }
>
> This video was created by [Treehouse](http://www.teamtreehouse.com), which is offering Linode customers a free one month trial. [Click here](http://teamtreehouse.com/join/free-month?utm_source=linode&utm_medium=partnership&utm_campaign=linode-2013&cid=1124) to start your free trial and start learning web design, web development, and more.

### Arch / CentOS 7 / Debian 8 / Fedora version 18 and above / Ubuntu 15.04 and above

Replace `hostname` with one of your choice.

    hostnamectl set-hostname hostname

### Debian 7 / Slackware / Ubuntu 14.04

Replace `example_hostname` with one of your choice.

    echo "example_hostname" > /etc/hostname
    hostname -F /etc/hostname

Check if the file `/etc/default/dhcpcd` exists, and it's contents.

    cat /etc/default/dhcpcd | grep SET_HOSTNAME

If the returned value is `SET_HOSTNAME='yes'`, edit `/etc/default/dhcpcd` and comment out the `SET_HOSTNAME` directive:

{: .file-excerpt }
/etc/default/dhcpcd
: ~~~
  #SET_HOSTNAME='yes'
  ~~~

### CentOS 6 / Fedora version 17 and below

Replace `hostname` with one of your choice.

    echo "HOSTNAME=hostname" >> /etc/sysconfig/network
    hostname "hostname"

### Gentoo

Enter the following commands to set the hostname, replacing `hostname` with the hostname of your choice:

    echo "HOSTNAME=\"hostname\"" > /etc/conf.d/hostname
    /etc/init.d/hostname restart

### Update /etc/hosts

Update the `/etc/hosts` file. This file creates static associations between IP addresses and hostnames, with higher priority than DNS.

1.  Every `hosts` file should begin with the line `127.0.0.1 localhost.localdomain localhost`, although the naming may be slightly different between Linux distributions. `127.0.0.1` is the [**loopback address**](https://en.wikipedia.org/wiki/Loopback#Virtual_loopback_interface), and is used to send IP traffic internally on the system. You can leave this line alone.

    Some distributions may also ship with a line for `127.0.1.1` in their `hosts file`. This is the loopback domain, and can be ignored in most cases.

2.  Add a line for your Linode's public IP address. You can associate this address with your Linode's **Fully Qualified Domain Name** (FQDN) if you have one, and with the local hostname you set in the steps above. In the example below, `203.0.113.10` is our public IP address, `hostname` is our local hostname, and `hostname.example.com` is our FQDN.

As with the hostname, the domain name part of your FQDN does not necessarily need to have any relationship to websites or other services hosted on the server (although it may if you wish). As an example, you might host "www.something.com" on your server, but the system's FQDN might be "mars.somethingelse.com."

{:.file }
/etc/hosts
: ~~~
  127.0.0.1 localhost.localdomain localhost
  203.0.113.10 hostname.example.com hostname
  ~~~

If you have IPv6 enabled on your Linode, you may also want to add an entry for your IPv6 address, as shown in this example:

{:.file }
/etc/hosts
: ~~~
  127.0.0.1 localhost.localdomain localhost
  203.0.113.10 hostname.example.com hostname
  2600:3c01::a123:b456:c789:d012 hostname.example.com hostname
  ~~~

The value you assign as your system's FQDN should have an "A" record in DNS pointing to your Linode's IPv4 address. For Linodes with IPv6 enabled, you should also set up a "AAAA" record in DNS pointing to your Linode's IPv6 address. For more information on configuring DNS, see [Adding DNS Records](/docs/hosting-website#sph_adding-dns-records).

## Setting the Timezone

By default, a Linode's Linux image will be set to UTC time (also known as Greenwich Mean Time) but this can be changed. It may be better to use the same timezone which a majority of your users are located in, or that you live in to make log file timestamps more sensible.

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

### All Other Distributions

Manually symlink a zone file in `/usr/share/zoneinfo` to `/etc/localtime`.

1.  View the list of available zone files.

        ls /usr/share/zoneinfo

2.  Then create the link using the zone file you want.

    *Example*:

        ln -sf /usr/share/zoneinfo/EST /etc/localtime ## for Eastern Standard Time

### Checking the Time

View the current date and time according to your server.

    date

The output should look similar to: `Thu Feb 16 12:17:52 EST 2012`.

## Next Steps

Now that you have an up-to-date Linode, you'll need to secure your Linode and protect it from unauthorized access. Read the [Securing Your Server](/docs/security/securing-your-server) quick start guide to get going.

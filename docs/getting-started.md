---
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to deploying your first Linode.'
keywords: 'linode guide,getting started,linode quickstart'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, July 1st, 2015
modified_by:
  name: Linode
published: 'Sunday, July 19th, 2009'
title: Getting Started
---

Congratulations on selecting Linode as your cloud hosting provider! We're glad you've decided to join our community, and we're excited to help you get started with your first Linode server. This guide will help you sign up for an account, deploy a Linux distribution, boot your Linode, and perform some basic system administration tasks. By the time you reach the end, you'll have a Linode up and running in the data center of your choice.

## Signing Up

If you haven't already signed up for a Linode account, do that first. Follow these steps:

1.  Visit the [Sign Up webpage](https://manager.linode.com/signup) and create a new account.
2.  Once you've signed in, enter your billing and account information. Most accounts are activated instantly, but some accounts require manual review prior to activation. If your account is not immediately activated, please check your email for additional instructions.
3.  Select a Linode plan and data center, as shown below.

    [![Available Linode plans.](/docs/assets/1744-getting-started1_small.png)](/docs/assets/1743-getting-started1.png)

If you don't know which data center to select, try downloading our [speed test](http://www.linode.com/speedtest) to find the location that provides the best performance for your target audience. European users may find that the London or Newark data centers offer the best performance, and many users in Asia and Australia select the Singapore or Fremont data centers. You can also generate [MTR reports](/docs/networking/diagnosing-network-issues-with-mtr/) for each of the data centers to determine which of our facilities provides the best latency from your particular location.

## Provisioning Your Linode

After your Linode is created, you'll need to prepare it for operation. In this section you'll log in to the Linode Manager and deploy a Linux distribution.

### Logging in to the Linode Manager

The [Linode Manager](https://manager.linode.com) is a web-based control panel that allows you to manage your Linode virtual servers and services. Log in now by entering the username and password you created when you signed up. After you've created your first Linode, you can use the Linode Manager to boot and shut down your virtual server, access monitoring statistics, update your billing and account information, request support, and perform other administrative tasks.

### Deploying an Image

After creating your new Linode, select it and then click on **Deploy an Image**. You'll be prompted to deploy a *Linux distribution*, as shown below. This is the operating system that will be installed on your Linode. You can choose from [Arch Linux](http://www.archlinux.org/), [CentOS](http://www.centos.org/), [Debian](http://www.debian.org/), [Fedora](http://fedoraproject.org/), [Gentoo](http://www.gentoo.org/), [openSUSE](http://www.opensuse.org/en/), [Slackware](http://www.slackware.com/), and [Ubuntu](http://www.ubuntu.com/).

[![Select a data center.](/docs/assets/902-linode-manager-2-2-small.png)](/docs/assets/896-linode-manager-2.png)

Here's how to deploy a Linux distribution:

1.  Select a Linux distribution from the **Image** menu. You should choose the distribution that you are most comfortable with. If you're new to the Linux operating system, consider selecting Ubuntu 14.04 LTS. Ubuntu is the most popular distribution among Linode customers, and the LTS version is a stable distribution we use as an example throughout this Library.
2.  Enter a size for the disk in the **Deployment Disk Size** field. By default, all of the available space is allocated, but you can set a lower size if you plan on cloning a disk or creating different configuration profiles. You can always create, resize, and delete disks later.
3.  Select a size for the swap disk from the **Swap Disk** menu. We strongly recommend using the default size.
4.  Enter a root password for your Linode in the **Root Password** field. The password must be at least 6 characters long and contain characters from two of the following categories: lower case letters, upper case letters, numbers, and punctuation. Don't forget this credential! You'll need it to log in to your Linode via SSH.
5.  Click **Deploy**.

 {: .note }
>
> Need to create a fully-functional Linode fast? Use a [StackScript](http://www.linode.com/stackscripts) to deploy a customized Linux distribution in a matter of minutes. Some of the most popular StackScripts do things like install the Apache web server, configure a firewall, and set up the WordPress content management system. They're easy to use. Just find a StackScript, complete the form, and deploy.

### Monitoring the Provisioning Status

When you click the **Deploy** button, the Linode Manager will start provisioning your server in the data center you selected, a process that can take several minutes to complete. You can use the Linode Manager's Dashboard to monitor the progress in real time, as shown below.

[![Select a data center.](/docs/assets/900-linode-manager-3-2-small.png)](/docs/assets/898-linode-manager-3.png)

Your Linode's configuration profile will appear on the Linode Manager Dashboard when the provisioning process is complete.

## Booting Your Linode

Your Linode is now fully provisioned and available in the data center you selected, but it's turned off. Here's how to boot your Linode:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select your Linode. The dashboard appears, as shown below.

    [![Select a data center.](/docs/assets/945-linode-manager-4-1-small.png)](/docs/assets/946-linode-manager-4-1.png)

4.  Click **Boot** to turn on your Linode. Notice how the boot job appears in the **Host Job Queue**, as shown below.

    [![Select a data center.](/docs/assets/1199-linode-manager-5-2-small.png)](/docs/assets/1200-linode-manager-5-2.png)

Now your Linode is running in the data center you selected.

## Connecting to Your Linode

It's time to connect to your Linode using the secure shell (SSH) protocol. SSH encrypts all of the data transferred between an *SSH client* on your computer and the Linode, effectively protecting your passwords and other sensitive information. There are SSH clients available for every operating system:

-   **Linux:** You can use a terminal window, no matter what GUI is installed.
-   **Mac:** Use the Terminal application that comes installed on every Mac. You can find it in the *Utilities* folder. You can also use the free [iTerm 2 application](http://www.iterm2.com/).
-   **Windows:** There is no native SSH client available, but you can use a free, open source application called [PuTTY](/docs/networking/using-putty).

To learn more about connecting to your Linode for the first time **with Windows**, please watch the following video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/eEsCD7n17mk?rel=0" frameborder="0" allowfullscreen></iframe>
To learn more about connecting to your Linode for the first time **with OS X**, please watch the following video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/VVs9Ed-HkjE" frameborder="0" allowfullscreen></iframe>

 {: .note }
>
> These videos were created by [Treehouse](http://www.teamtreehouse.com), which is offering Linode customers a free one month trial. [Click here](http://teamtreehouse.com/join/free-month?utm_source=linode&utm_medium=partnership&utm_campaign=linode-2013&cid=1124) to start your free trial and start learning web design, web development, and more.

### Finding the IP Address

Your Linode has a unique *IP address* that identifies it to other devices and users on the Internet. For the time being, you'll use the IP address to connect to your server. After you perform some of these initial configuration steps outlined in the Linode Quick Start Guides, you can use [DNS records](/docs/hosting-website#sph_adding-dns-records) to point a domain name at your server and give it a more recognizable and memorable identifier.

Here's how to find your Linode's IP address:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select your Linode.
4.  Click the **Remote Access** tab. The webpage shown below appears.

[![Public IPs.](/docs/assets/1711-remote_access_ips_small.png)](/docs/assets/1710-remote_access_ips.png)

5.  Copy the addresses in the Public IPs section.

In this example, the Linode's IPv4 address is *96.126.109.54* and its IPv6 address is *2600:3c03::f03c:91ff:fe70:cabd*. Unless your Internet service provider supports IPv6, you'll want to the use the IPv4 address.

### Logging in for the First Time

Once you have the IP address and an SSH client, you're ready to log in via SSH. Here's how:

 {: .note }
>
> The following instructions are written for Linux and Mac OS X users. If you're using PuTTY as your SSH client, follow [these instructions](/docs/networking/using-putty).

1.  Open the terminal window or application, type the following command, and then press Enter. Be sure to replace the example IP address with your Linode's IP address.

        ssh root@123.456.78.90

2.  If the warning shown below appears, type `yes` and press Enter to continue connecting.

        The authenticity of host '123.456.78.90 (123.456.78.90)' can't be established.
        RSA key fingerprint is 11:eb:57:f3:a5:c3:e0:77:47:c4:15:3a:3c:df:6c:d2.
        Are you sure you want to continue connecting (yes/no)?

3.  The log in prompt appears, as shown below. Enter the password you created for the `root` user.

        root@123.456.78.90's password:

4.  The SSH client initiates the connection. You know you are logged in when the following prompt appears:

        Warning: Permanently added '123.456.78.90' (RSA) to the list of known hosts.
        root@li123-456:~# 

Now you can start executing commands on your Linode.

 {: .note }
>
> If you recently rebuilt an existing Linode, you might receive an error message when you try to
> :   reconnect via SSH. That's because SSH clients try to match the remote host with the known keys on your desktop computer. When you rebuild your Linode, the remote host key changes. To fix this problem, edit the SSH known\_hosts file on your desktop computer and remove the entries for your Linode's IP address. Linux and Mac OS X users can edit the SSH `known_hosts` file by entering this command in a terminal window:
>
> ~~~
> nano ~/.ssh/known_hosts
> ~~~

{:.note}
> PuTTY users can find the known hosts in this registry entry:
>
>     HKEY_CURRENT_USER\Software\SimonTatham\PuTTY\SshHostKeys

## Setting the Hostname

You'll need to set your system's hostname and fully qualified domain name (FQDN). Your hostname should be something unique. Some people name their servers after planets, philosophers, or animals. Note that the system's hostname has no relationship to websites or email services hosted on it, aside from providing a name for the system itself. Your hostname should *not* be "www" or anything too generic.

 {: .note }
>
> If you're unfamiliar with Linux, one of the first things you'll need to learn is how to use [nano](/docs/linux-tools/text-editors/nano), a text editor included with most distributions. To open a file for editing, type `nano file.txt` where "file.txt" is the name of the file you want to create or edit. When you're finished editing, press `Control-X` and then `Y` to save the changes.

To learn more about setting your system's hostname and timezone, please watch the following video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/KFd66g4k4i8" frameborder="0" allowfullscreen></iframe>


{: .note }
>
> This video was created by [Treehouse](http://www.teamtreehouse.com), which is offering Linode customers a free one month trial. [Click here](http://teamtreehouse.com/join/free-month?utm_source=linode&utm_medium=partnership&utm_campaign=linode-2013&cid=1124) to start your free trial and start learning web design, web development, and more.

### Ubuntu 15.04 / Debian 8

Enter the following command to set the hostname, replacing `hostname` with the hostname of your choice:

    hostnamectl set-hostname hostname

### Ubuntu14.04 / Debian 7

Enter following commands to set the hostname, replacing `hostname` with the hostname of your choice:

    echo "hostname" > /etc/hostname
    hostname -F /etc/hostname

If it exists, edit the file `/etc/default/dhcpcd` to comment out the `SET_HOSTNAME` directive:

{: .file-excerpt }
/etc/default/dhcpcd
: ~~~
  #SET_HOSTNAME='yes'
  ~~~

### CentOS 7 / Fedora version 18 and above


Enter the following command to set the hostname, replacing `hostname` with the hostname of your choice:

    hostnamectl set-hostname hostname


### CentOS 6 / Fedora version 17 and below

Enter the following commands to set the hostname, replacing `hostname` with the hostname of your choice:

    echo "HOSTNAME=hostname" >> /etc/sysconfig/network
    hostname "hostname"

### Slackware

Enter the following commands to set the hostname, replacing `hostname` with the hostname of your choice:

    echo "hostname" > /etc/HOSTNAME
    hostname -F /etc/HOSTNAME

### Gentoo

Enter the following commands to set the hostname, replacing `hostname` with the hostname of your choice:

    echo "HOSTNAME=\"hostname\"" > /etc/conf.d/hostname
    /etc/init.d/hostname restart

### Arch Linux

Enter the following command to set the hostname, replacing `hostname` with the hostname of your choice:

    hostnamectl set-hostname hostname

### Update /etc/hosts

Next, edit your `/etc/hosts` file to resemble the following example, replacing `hostname` with your chosen hostname, `example.com` with your system's domain name, and `12.34.56.78` with your system's IP address. As with the hostname, the domain name part of your FQDN does not necessarily need to have any relationship to websites or other services hosted on the server (although it may if you wish). As an example, you might host "www.something.com" on your server, but the system's FQDN might be "mars.somethingelse.com."

{:.file }
/etc/hosts
: ~~~ 
  127.0.0.1 localhost.localdomain localhost 
  12.34.56.78 hostname.example.com hostname
  ~~~

If you have IPv6 enabled on your Linode, you will also want to add an entry for your IPv6 address, as shown in this example:

{:.file }
/etc/hosts
: ~~~
  127.0.0.1 localhost.localdomain localhost 
  12.34.56.78 hostname.example.com hostname 
  2600:3c01::a123:b456:c789:d012 hostname.example.com hostname
  ~~~

The value you assign as your system's FQDN should have an "A" record in DNS pointing to your Linode's IPv4 address. For Linodes with IPv6 enabled, you should also set up a "AAAA" record in DNS pointing to your Linode's IPv6 address. For more information on configuring DNS, see [Adding DNS Records](/docs/hosting-website#sph_adding-dns-records).

## Setting the Timezone

You can change your Linode's timezone to whatever you want it to be. It may be best to set it to the same timezone of most of your users. If you're unsure which timezone would be best, consider using universal coordinated time or UTC (also known as Greenwich Mean Time).

### Ubuntu / Debian

Enter the following command to access the timezone utility:

    dpkg-reconfigure tzdata

### Arch Linux and CentOS 7

Enter the following command to view a list of available time zones:

    timedatectl list-timezones

Use the up and down arrows to view all the available time zones. Then, press **CTRL-C** to exit the list of time zones.

Enter the following command to set the time zone:

    timedatectl set-timezone America/New_York

### All Other Distributions

Manually create a link from a zone file in `/usr/share/zoneinfo` to `/etc/localtime`. You must find the zone file for your timezone. See the examples below for common possibilities.

 {: .note }
>
> Use only one command (e.g. `ln -sf /usr/share/zoneinfo/UTC /etc/localtime`) to set the timezone. Do not paste the comment (e.g. `## for Universal Coordinated Time`) in to your terminal window.

    ln -sf /usr/share/zoneinfo/UTC /etc/localtime ## for Universal Coordinated Time

    ln -sf /usr/share/zoneinfo/EST /etc/localtime ## for Eastern Standard Time

    ln -sf /usr/share/zoneinfo/US/Central /etc/localtime ## for American Central

    ln -sf /usr/share/zoneinfo/US/Eastern /etc/localtime ## for American Eastern

### Checking the Time

Now try entering the following command to view the current date and time according to your server:

    date

The output should look similar to this: `Thu Feb 16 12:17:52 EST 2012`.

## Installing Software Updates

Now you need to install the available software updates for your Linode's Linux distribution. Doing so patches security holes in packages and helps protect your Linode against unauthorized access.

 {: .note }
>
> Installing software updates on your Linode is a task that you will need to perform regularly in future. If you need help remembering, try creating a monthly alert with the calendar application on your desktop computer.

### Ubuntu / Debian

Enter the following commands to check for and install software updates:

    apt-get update
    apt-get upgrade --show-upgraded

### CentOS / Fedora

Enter the following commands to check for and install software updates:

    yum update

### Arch Linux

Before you can update the system, you need to create entropy, initiate pacman-key and populate the keyring.

    haveged -w 1024
    pacman-key --init
    pkill haveged
    pacman-key --populate archlinux

You should now be set to update the system

    pacman -Syu

## Next Steps

Good work! Now you have an up-to-date Linode running in the data center of your choice. Next, you'll need to secure your Linode and protect it from unauthorized access. Read the [Securing Your Server](/docs/securing-your-server) quick start guide to get going!

 {: .note }
>
> From this point forward, all of the guides in the Linode Library are written for the Ubuntu and Debian distributions. If you're using a different distribution, keep in mind that the procedures and commands might not be exactly the same.




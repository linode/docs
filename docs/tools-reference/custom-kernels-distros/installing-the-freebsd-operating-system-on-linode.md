---
author:
  name: Rainbow
  email: rainbow@linode.com
description: 'Installing the FreeBSD Operating System on Linode'
keywords: 'freebsd,linode'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, September 16, 2015
modified_by:
  name: Rainbow
published: 'never'
title: 'Install FreeBSD on Your Linode'
external_resources:
 - '[The FreeBSD Handbook](https://www.freebsd.org/doc/handbook/)'
 - '[Using the Linode Shell (Lish)](/docs/troubleshooting/using-lish-the-linode-shell)'
 - '[Using the Graphic Shell (Glish) - BETA](/docs/networking/using-the-graphic-shell-glish)'
 - '[FreeBSD Handbook - Comparing BSD and Linux](https://www.freebsd.org/doc/en/articles/explaining-bsd/comparing-bsd-and-linux.html)'
 - '[FreeBSD Handbook - Linux® Binary Compatibility](https://www.freebsd.org/doc/handbook/linuxemu.html)'
 - '[FreeBSD Quickstart Guide for Linux® Users](https://www.freebsd.org/doc/en/articles/linux-users/article.html)' 
---

## Introduction (What is FreeBSD?)

[FreeBSD](https://www.freebsd.org/) is a Free and Open-Source Operating System based on the [Berkeley Software Distribution](https://en.wikipedia.org/wiki/Berkeley_Software_Distribution) originally developed at Berkeley Computer Systems Research Group from the late 1970's. BSD originally started as a series of addon programs and tweaks to Bell Labs UNIX®, implementing features and new programs (like the venerable vi editor's first release). Today, FreeBSD is used all over the world, including in some major video game consoles!

## FreeBSD Vs. Linux

FreeBSD is often compared to Linux, another well known Unix-like Operating System, and until recently, the only OS you could use on Linode, without lots of tweaks or workarounds. 

So what's the difference? Briefly, Linux is a term used for a group of operating systems that all use the Linux® kernel, GNU coreutils, and various distribution-specific tools. Common Linux distributions are Debian, CentOS, and Slackware. Many various flavors of Linux, also known as Distros, are offered by Linode officially. All of these are usually released under the GNU General Public License.

FreeBSD, as previously mentioned, grew out of various groups and movements originally involved with the original UNIX® codebase, however no UNIX® code currently remains. Every part of FreeBSD is developed in the same source tree, and code is released under the FreeBSD License, which is a permissive license, as opposed to the GNU GPL's copyleft stance. 

More information on the differences between these Operating Systems is available at the links included at the end of this article!

## Downloading your installation image

FreeBSD is not currently officially supported by Linode. ZFS, the filesystem we'll be using isn't either, so that means we'll be using RAW disks within the Linode Manager.

As such, we'll need to begin by creating the Linode, and making some changes before we get started.

1.  Create your Linode in your preferred datacenter.  For the purposes of this tutorial, we do recommend turning Lassie off, to prevent the watchdog from attempting to restart your Linode without your input.  You can disable Lassie in the Settings tab for your newly created Linode.

2.  [Create two Disk Images](https://www.linode.com/docs/migrate-to-linode/disk-images/disk-images-and-configuration-profiles#creating-a-blank-disk)
. Both images should be in the RAW format.

    - 1024 MB titled Installer
    - Remaining space - title this disk FreeBSD

3.  Create two configuration profiles with the following settings:

    Installation profile

	- Label: Installer
	- Kernel: Direct Disk
	- /dev/sda: FreeBSD
	- /dev/sdb: Installer
	- root / boot device: Standard /dev/sdb

    Boot Profile
	
    - Label: FreeBSD
	- Kernel: Direct Disk
	- /dev/sda: FreeBSD
	- root / boot device: Standard /dev/sda


You will need to disable all of the options under Filesystem/Boot Helpers in both profiles.

4.  Boot into Rescue Mode with the installer disk mounted to /dev/sda.

5.  Once in Rescue Mode, you'll want to run the following command, replacing latest with the latest memstick.img file from the [FreeBSD download page](ftp://ftp.freebsd.org/pub/FreeBSD/releases/amd64/amd64/ISO-IMAGES/):

        curl $latest | dd of=/dev/sda

    As of this guide's writing, the latest release version is 10.2.  The following command will download the 10.2 release image to your Linode:

        curl ftp://ftp.freebsd.org/pub/FreeBSD/releases/amd64/amd64/ISO-IMAGES/10.2/FreeBSD-10.2-RELEASE-amd64-memstick.img | dd of=/dev/sda

6.  After this command finishes, reboot into your Installer profile to start the installation.

## Installing FreeBSD

1.  Follow through the prompts, choosing appropriate variables for your setup.

    {: .note}
    >
    >For beginners, we suggest choosing ZFS (auto), and installing lib32 and src.

    [![Choose your packages.](/docs/assets/freebsd-optional-components.png)](/docs/assets/freebsd-optional-components.png)

2.  Configure your filesystem options.  We recommend using ZFS (auto).

    [![FreeBSD partition selection](/docs/assets/freebsd-partitioning.png)](/docs/assets/freebsd-partitioning.png)

3.  Confirm your disk partitioning selections.

    [![FreeBSD partition confirmation](/docs/assets/freebsd-partitioning-2.png)](/docs/assets/freebsd-partitioning-2.png)

    [![FreeBSD partition confirmation](/docs/assets/freebsd-partitioning-3.png)](/docs/assets/freebsd-partitioning-3.png)

    [![FreeBSD partition confirmation](/docs/assets/freebsd-partitioning-4.png)](/docs/assets/freebsd-partitioning-4.png)

    [![FreeBSD partition confirmation](/docs/assets/freebsd-partitioning-5.png)](/docs/assets/freebsd-partitioning-5.png)

4.  Set your root password for your new install.

    [![FreeBSD password prompt](/docs/assets/freebsd-password.png)](/docs/assets/freebsd-password.png)

5.  You'll next be presented with options for configuring networking.

    [![FreeBSD Network Configuration](/docs/assets/freebsd-network.png)](/docs/assets/freebsd-network.png)

6.  Choose yes to the following prompts, which will enable DHCP and SLAAC (for ipv6) on vtnet0

    [![FreeBSD Network Configuration](/docs/assets/freebsd-network-2.png)](/docs/assets/freebsd-network-2.png)

    [![FreeBSD Network Configuration](/docs/assets/freebsd-network-3.png)](/docs/assets/freebsd-network-3.png)

    [![FreeBSD Network Configuration](/docs/assets/freebsd-network-4.png)](/docs/assets/freebsd-network-4.png)

    [![FreeBSD Network Configuration](/docs/assets/freebsd-network-5.png)](/docs/assets/freebsd-network-5.png)

    [![FreeBSD Network Configuration](/docs/assets/freebsd-network-6.png)](/docs/assets/freebsd-network-6.png)

7.  Ensure that your clock is set to local time rather than UTC.

    [![FreeBSD Timezone Configuration](/docs/assets/freebsd-timezone.png)](/docs/assets/freebsd-timezone.png)

8.  Select the services that you wish to run on boot.

    [![FreeBSD Service Configuration](/docs/assets/freebsd-services.png)](/docs/assets/freebsd-services.png)

9.  You will now be presented with a prompt for final configuration.  From here, you can add additional users, and modify configurations that you've set up earlier on in the install process.

    [![FreeBSD Network Configuration](/docs/assets/freebsd-final-config.png)](/docs/assets/freebsd-final-config.png) 

10.  Finally, you'll be presented with a prompt, asking if you'd like to drop into a shell before rebooting. Choose yes here.

     [![FreeBSD Manual Configuration](/docs/assets/freebsd-manual-config.png)](/docs/assets/freebsd-manual-config.png)

11.  Use your favorite editor and insert the following text in the bottem of /boot/loader.conf. (FreeBSD ships with ee and nvi, linked as vi)

     {:.file }
     /boot/loader.conf
     : ~~~
      boot_multicons="YES"
      boot_serial="YES"
      comconsole_speed="115200"
      console="comconsole,vidconsole"
       ~~~

     These final steps are required to enable Lish, Glish, and make a few other changes.

12.  Reboot into the FreeBSD profile!

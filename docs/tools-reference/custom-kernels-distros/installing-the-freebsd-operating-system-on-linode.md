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
title: 'Installing the FreeBSD Operating System on Linode'
external_resources:
 - '[The FreeBSD Handbook](https://www.freebsd.org/doc/handbook/)'
 - '[Using the Linode Shell (Lish)](/docs/troubleshooting/using-lish-the-linode-shell)'
 - '[Using the Graphic Shell (Glish) - BETA](/docs/networking/using-the-graphic-shell-glish)'
 - '[FreeBSD Handbook - Comparing BSD and Linux](https://www.freebsd.org/doc/en/articles/explaining-bsd/comparing-bsd-and-linux.html)'
 - '[FreeBSD Handbook - Linux® Binary Compatibility](https://www.freebsd.org/doc/handbook/linuxemu.html)'
 - '[FreeBSD Quickstart Guide for Linux® Users](https://www.freebsd.org/doc/en/articles/linux-users/article.html)'
 - '[BSD vs Linux - A Rant](https://www.over-yonder.net/~fullermd/rants/bsd4linux/01)'

 
---

## Introduction (What is FreeBSD?)

FreeBSD is a Free and Open-Source Operating System originally developed at Berkeley CSRG back in the 80's.

BSD originally started as a series of addon programs and tweaks to Bell Labs UNIX®, implementing features
and new programs (like the venerable vi editor's first release).

A short time before CSRG shut down, a project was started to port BSD to the Intel 386 processor.
From patchkits to 386BSD, both FreeBSD and NetBSD spawned. Today FreeBSD is a Free and Open Source Operating System developed by many people around the world. Unlike Linux which is comprised of the Linux kernel, GNU utils, and various distribution tweaks, FreeBSD is a complete Operating System. The kernel and userland are all developed in the same source tree, meaning you can track FreeBSD development all the way back to when it first began!

Today, FreeBSD is used all over the world, including in some major video game consoles!


## Comparison to Linux

FreeBSD is often compared to Linux, another well known Unix-like Operating System, and until recently, the only OS you could use on Linode, without lots of tweaks or workarounds. 

So what's the difference? Briefly, Linux is a term used for a group of operating systems that all use the Linux® kernel, GNU coreutils, and various distribution-specific tools. Common Linux distributions are Debian, CentOS, and Slackware. All of those are currently offered by Linode officially. All of these are usually released under the GNU General Public License.

FreeBSD, as previously mentioned, grew out of various groups and movements originally involved with the original UNIX® codebase, however no UNIX® code currently remains. Every part of FreeBSD is developed in the same source tree, and code is released under the FreeBSD License, which is a permissive license, as opposed to the GNU GPL's copyleft stance. 

More information on the differences between these Operating Systems is available at the links included at the end of this article!


## The Installation

FreeBSD is not currently officially supported by Linode. ZFS, the filesystem we'll be using isn't either, so that means we'll be using RAW disks within the Linode Manager.

As such, we'll need to begin by creating the Linode, and making some changes before we get started.

First, create your Linode in your preferred Datacenter.
After doing so, please name your Linode, and turn Lassie off. You can do so in the Settings subtab for your Linode.
(Insert IMG1)

After you've done so, create two Disk Images. These should be type RAW.

* 800 MB titled Installer
* Remaining space - title this disk FreeBSD

Next, create two configuration profiles with the following settings:

(IMAGES YO)

Boot into Rescue Mode with the following settings: (IMAGE)

Once in Rescue Mode, you'll want to run 
	curl $latest | dd of=/dev/sda
replacing latest with the latest memstick.img file from ftp://ftp.freebsd.org/pub/FreeBSD/releases/amd64/amd64/ISO-IMAGES/

In this guide's case, we're running: 
	curl ftp://ftp.freebsd.org/pub/FreeBSD/releases/amd64/amd64/ISO-IMAGES/10.2/FreeBSD-10.2-RELEASE-amd64-memstick.img | dd of=/dev/sda


After this command finishes, reboot into your Installer profile.

Now the install begins.

Follow through the prompts, choosing appropriate variables for your setup.
For beginners, we suggest choosing ZFS (auto), and installing lib32 and src.
(IMAGES YO)

You'll next be presented with an option for networking.

Choose yes to the following prompts, which will enable DHCP and SLAAC (for ipv6) on vtnet0

(MOAR IMAGES)

Finally, you'll be presented with a prompt, asking if you'd like to drop into a shell before rebooting. Choose yes here.
We're going to enable Lish, Glish, and make a few other changes.

Use your favorite editor and insert the following text in the bottem of /boot/loader.conf (FreeBSD ships with ee and vi)

{: .file-excerpt }
/boot/loader.conf
:   ~~~
boot_multicons="YES"
boot_serial="YES"
comconsole_speed="115200"
console="comconsole,vidconsole"
    ~~~

After you've completed this, reboot into the FreeBSD profile!

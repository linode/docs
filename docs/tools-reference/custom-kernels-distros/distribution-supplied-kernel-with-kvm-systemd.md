---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'Instructions for configuring your Linode to run a native distribution-supplied kernel on KVM hosts. Written for distributions using systemd'
keywords: 'kvm,custom linux, kernel,custom linode,systemd,debian 8,centos,fedora'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, June 12, 2015
modified_by:
  name: Alex Fornuto
published: ''
title: 'Run a Distribution-Supplied Kernel on KVM Hosts using Systemd'
---

This guide explains how enable the kernels your OS provides for a Linode on a KVM based host. This is useful if you'd like to enable specific kernel features, or you'd prefer to handle kernel upgrades directly.

This guide is written for distributions that use `systemd`, which modifies boot behavior. these distributions include:

* Debian 8
* Centos 6 and above
* Fedora 20 and above
* Arch Linux

For distributions using `init`, please see our [other]() guide on installing a distribution-supplied kernel.

Before you get started, make sure you follow the steps outlined in our [Getting Started](/docs/getting-started) guide. Your Linode needs to be in a functional state. These steps should be performed as `root` on your Linode, via an SSH session.

## Installing the distribution provided kernel

1.  Ensure that your system is up to date, using the distribution's package manager.

2.  Use `uname` to identify the current kernel version:

        uname -a

    The output will be similar to that shown below:

        Linux localhost 4.0.4-x86_64-linode57 #1 SMP Thu May 21 11:01:47 EDT 2015 x86_64 x86_64 x86_64 GNU/Linux

3.  Make a note of the kernel you're currently using (`4.0.4-x86_64` in our example). You will be replacing it with the current latest kernel supplied by your Linux distribution.

4.  Install the Linux kernel. The package name differs based on your distribution:

    * Debian 8 (Jessie)

        * **32-bit:** :

              apt-get install linux-image-686-pae

        * **64-bit:** :

              apt-get install linux-image-amd64

    * CentOS and Fedora

        * **32-bit:** :

              yum install kernel-PAE.i686

        * **64-bit:** :

              yum install kernel-x86_64

    * Arch Linux

          pacman -S linux

6.  Ensure that the `grub2` (just `grub` on Arch Linux) package is installed, using your distribution's package manager.



## Configuring Grub

1.  Edit `/etc/default/grub` and add or change the following variables to match the following. There will be other variables in this file, but we are only concerned with those listed below:

	{:.file-excerpt }
	/etc/default/grub
	: ~~~

      GRUB_TIMEOUT=10

      GRUB_CMDLINE_LINUX="console=tty0 console=ttyS0,19200n8"

      GRUB_TERMINAL=serial

      GRUB_SERIAL_COMMAND="serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1"

      GRUB_DISABLE_LINUX_UUID=true

      GRUB_DEVICE=/dev/sda

      GRUB_DEVICE_BOOT=hd0

      LINUX_ROOT_DEVICE=hd0
	  ~~~

2.  Run the following command to update the bootloader.

    * Debian 8

          update-grub2

    * Fedora 22

          mkdir /boot/grub/
          grub2-mkconfig -o /boot/grub/grub.cfg

    * CentOS 7

          grub2-mkconfig -o /boot/grub/grub.cfg

    * Arch Linux

          grub-mkconfig -o /boot/grub/grub.cfg



Note that if you later install an updated kernel, you'll need to run this command again to update your GRUB menu. By default, the first kernel in the list will be booted.

## Rebooting into Grub2 Mode

1.  In your Linode's Dashboard, Click on **Edit** under the  Configuration Profiles section:

    [![Click on Edit](/docs/assets/edit_config_profile_small.png)](/docs/assets/edit_config_profile.png)

2.  In the *Boot Settings* section, select **GRUB 2** from the **Kernel** drop down menu:

    [![Select GRUB 2](/docs/assets/config_profile_grub2.png)](/docs/assets/config_profile_grub2.png)

3.  At the bottom of the page, click on **Save Changes**, then reboot your Linode. You can follow along with the boot process in the [LISH console](/docs/networking/using-the-linode-shell-lish).

4.  After logging back in to your Linode, run `uname -a` again to confirm the new kernel:

        Linux li63-119.members.linode.com 3.10.0-229.4.2.el7.x86_64.debug #1 SMP Wed May 13 10:20:16 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux

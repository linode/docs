---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'Instructions for configuring your Linode to run a native distribution-supplied kernel on KVM hosts. Written for distributions using systemd'
keywords: 'kvm,custom linux, kernel,custom linode,systemd,debian 8,centos,fedora'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, June 29th, 2015
modified_by:
  name: Alex Fornuto
published: 'Monday June 29th, 2015'
title: 'Run a Distribution-Supplied Kernel on a KVM Linode'
---

This guide explains how to enable the kernels your OS provides for a KVM Linode. This is useful if you'd like to enable specific kernel features, or you'd prefer to handle kernel upgrades directly. These steps have been tested on:

* Arch Linux
* CentOS 7
* Debian
* Fedora 22
* Ubuntu

Before you get started, make sure you follow the steps outlined in our [Getting Started](/docs/getting-started) guide. Your Linode needs to be in a functional state. These steps should be performed as `root` on your Linode, via an SSH session.

## Installing the Distribution Provided Kernel

1.  Ensure that your system is up to date, using the distribution's package manager.

2.  Use `uname` to identify the current kernel version:

        uname -a

    The output will be similar to that shown below:

        Linux localhost 4.0.4-x86_64-linode57 #1 SMP Thu May 21 11:01:47 EDT 2015 x86_64 x86_64 x86_64 GNU/Linux

3.  Make a note of the kernel you're currently using (`4.0.4-x86_64` in our example). You will be replacing it with the current latest kernel supplied by your Linux distribution.

4.  Install the Linux kernel. The package name differs based on your distribution:

    * Arch Linux

          pacman -S linux grub

    * CentOS 7

          yum install kernel grub2

    * Debian

          apt-get install linux-image-amd64 grub2

    * Fedora 22

          dnf install kernel-core grub2

    * Ubuntu

          apt-get install linux-image-virtual grub2

    {: .note }
    > During the installation of `grub` you may be asked which disk image to install to. Since Linode provides the grub bootloader, the system need only provide the `grub.cfg` file, and you don't need to install `grub` to your MBR.

5.  Verify the kernel version provided by your distribution in `/boot`:
 
        # ls /boot/vmlinuz*
        /boot/vmlinuz-3.16.0-4-amd64

## Configuring Grub

1.  Edit `/etc/default/grub` and add or change the following variables to match the following. There will be other variables in this file, but we are only concerned with those listed below:

	{:.file-excerpt }
	/etc/default/grub
	: ~~~
      GRUB_TIMEOUT=10
      GRUB_CMDLINE_LINUX="console=ttyS0,19200n8"
      GRUB_DISABLE_LINUX_UUID=true
      GRUB_SERIAL_COMMAND="serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1"
      GRUB_TERMINAL=serial
	  ~~~

2.  Run the following command to update the bootloader.

    * Arch Linux

          grub-mkconfig -o /boot/grub/grub.cfg

    * Debian 8 & Ubuntu 15.04

          update-grub

    * CentOS 7

          mkdir /boot/grub
          grub2-mkconfig -o /boot/grub/grub.cfg

    * Fedora 22 - Replace with the current kernel version

          dracut /boot/initrd-4.0.5-300.fc22.x86_64.img 4.0.5-300.fc22.x86_64 
          mkdir /boot/grub
          grub2-mkconfig -o /boot/grub/grub.cfg

Note that if you later install an updated kernel, you'll need to run this command again to update your GRUB menu. By default, the first kernel in the list will be booted.

## Rebooting into Grub2 Mode

1.  In your Linode's Dashboard, Click on **Edit** under the  Configuration Profiles section:

    [![Click on Edit](/docs/assets/edit_config_profile_small.png)](/docs/assets/edit_config_profile.png)

2.  In the *Boot Settings* section, select **GRUB 2** from the **Kernel** drop down menu:

    [![Select GRUB 2](/docs/assets/config_profile_grub2.png)](/docs/assets/config_profile_grub2.png)

3.  At the bottom of the page, click on **Save Changes**.

4.  Reboot your Linode. You can monitor the boot process in the [LISH console](/docs/networking/using-the-linode-shell-lish).

    {: .note }
    > During boot you may see this error message:
    >
    >     error: file `/boot/grub/i386-pc/all_video.mod' not found.
    >     Loading Linux linux ...
    >     Loading initial ramdisk ...
    >
    >     Press any key to continue...
    >
    > You can safely ignore it.

5.  After logging back in to your Linode, run `uname -a` again to confirm the new kernel:

        Linux li63-119.members.linode.com 3.10.0-229.4.2.el7.x86_64.debug #1 SMP Wed May 13 10:20:16 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux

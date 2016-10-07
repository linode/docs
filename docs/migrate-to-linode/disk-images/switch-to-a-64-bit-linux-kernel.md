---
deprecated: false
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Switch to a 64-bit Linux Kernel with Your Existing Distribution.'
keywords: 'kernel,64 bit,switch to a 64-bit linux kernel,64-bit distribution,ubuntu,centos,fedora,debian,arch linux,gentoo,32-bit,migrate,disk'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['switching-kernels/','migrate-to-linode/disk-images/switching-to-a-64bit-kernel/']
modified: Friday, October 7, 2016
modified_by:
  name: Edward Angert
published: 'Monday, April 14th, 2014'
title: 'Switch to a 64-bit Linux Kernel'
external_resources:
 - '[AMD Developer Central](http://developer.amd.com/community/blog/2008/03/06/myths-and-facts-about-64-bit-linux/)'
 - '[AskUbuntu](http://askubuntu.com/questions/81824/how-can-i-switch-a-32-bit-installation-to-a-64-bit-one)'
---

Before an existing Linode can be migrated to a new SSD host, you'll need to ensure that all configuration profiles on that Linode are configured to use the 64-bit kernel. This guide will show you how to make that switch, and warn about some of the more common issues to look out for when making this change.

## Switch to a 64-bit Kernel

1.  Next to your Configuration Profile, click **Edit**.

    [![.](/docs/assets/1728-64bit1v3_small.png)](/docs/assets/1727-64bit1v3.png)

2.  Under `Boot Settings` click on the **Kernel** drop down. Select the `Latest 64 bit` option.

    [![.](/docs/assets/1726-64bit-2v3.png)](/docs/assets/1726-64bit-2v3.png)

3.  Press **Save Changes**, which will take you back to your Linode Dashboard. Now reboot your Linode.

## Considerations

Switching to a 64-bit kernel does not mean you now have a 64-bit deployment of Linux. Until you redeploy, your user space and libraries will still be 32-bit. The 64-bit kernel will happily run software designed for 32-bit, but specific pieces of software may conflict with the new kernel.

The following is a list of software with known issues running on a 32-bit distribution with a 64-bit kernel. If you rely on any of these packages, we suggest a rebuild to a 64-bit distribution.

-   Xtables
-   OpeniSCSI
-   Java

If you're ready to rebuild your Linode using a 64-bit distribution, you can start by following the steps outlined [here](/docs/migrate-to-linode/disk-images/disk-images-and-configuration-profiles/) to create a second deployment. From there, you can copy your data to the new 64-bit version, then delete your old profile and disks.

Otherwise, find your Linux distribution of choice below to check for additional known issues.

 {: .note }
>
> This is a live guide, and additional information will continue to be added.

### Ubuntu and Debian

For Ubuntu and Debian users the Apt package management system will continue to download correct architecture version of software, despite the new kernel.

### CentOS and Fedora

When switching a 32-bit CentOS or Fedora build to use a 64-bit kernel, you need to configure its package manager (Yum) to explicitly download x86 architecture builds of updates to existing and new packages. If you haven't already, we recommend CentOS users switch to the package mirrors Linode provides. The instructions to switch to Linode's package mirrors are in the [package mirrors](/docs/package-mirrors) guide. Regardless of your decision to use our mirrors, you will want to run this command to ensure that only 32-bit packages are selected:

    sed -i 's/$basearch/i386/g' /etc/yum.repos.d/*

Once this is done, run a cleanup of yum:

    yum clean all

Now all future software installed from Yum will use the correct CPU architecture for your 32-bit user space.

### Arch Linux

The Arch package manager Pacman chooses what architecture-specific builds to download based on the kernel. After switching to the 64-bit kernel you will want to adjust this in `/etc/pacman.conf`:

{: .file-excerpt }
/etc/pacman.conf
:   ~~~
    Architecture=x86_64
    ~~~

### Gentoo

In Gentoo, all packages are compiled on the system. Ensure that the `-m32` flag is set in `CFLAGS`.
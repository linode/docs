---
deprecated: false
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Learn how to Switch to a 64-bit Linux Kernel with Your Existing Distribution.'
keywords: ["linux kernel", "64-bit", "switch kernel", "migrate", "disk"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['switching-kernels/','migrate-to-linode/disk-images/switching-to-a-64bit-kernel/','migrate-to-linode/disk-images/switch-to-a-64-bit-linux-kernel/']
modified: 2016-10-13
modified_by:
  name: Edward Angert
published: 2014-04-14
title: 'Switch to a 64-bit Linux Kernel'
external_resources:
 - '[ArchWiki](https://wiki.archlinux.org/index.php/Migrating_between_architectures)'
 - '[AskUbuntu](http://askubuntu.com/questions/81824/how-can-i-switch-a-32-bit-installation-to-a-64-bit-one)'
---

Before an existing Linode can be migrated to a new host, you'll need to ensure that all configuration profiles on that Linode are using a 64-bit kernel. This guide will show you how to make that switch, and warn about some of the more common issues to look out for in the process.

![Switch to a 64-bit Linux Kernel](/docs/assets/switch_to_a_64_bit_linux_kernel.png "Switch to a 64-bit Linux Kernel")

## Switch to a 64-bit Kernel

1.  Next to your Configuration Profile, click **Edit**.

    [![Select "Edit" to modify your Configuration Profile](/docs/assets/1728-64bit1v3_small.png)](/docs/assets/1727-64bit1v3.png)

2.  Under `Boot Settings` click on the **Kernel** drop down. Select the `Latest 64 bit` option.

    [![Select the latest 64-bit kernel from the dropdown menu.](/docs/assets/1726-64bit-2v3.png)](/docs/assets/1726-64bit-2v3.png)

3.  Press **Save Changes**, which will take you back to your Linode Dashboard. Now reboot your Linode.

## Considerations

Switching to a 64-bit kernel does not mean you now have a 64-bit deployment of Linux. Until you redeploy, your user space and libraries will still be 32-bit. The 64-bit kernel will happily run software designed for 32-bit, but specific pieces of software may conflict with the new kernel.

The following is a list of software with known issues running on a 32-bit distribution with a 64-bit kernel. If you rely on any of these packages, we suggest a rebuild to a 64-bit distribution.

-  Xtables
-  OpeniSCSI
-  Java

If you're ready to rebuild your Linode using a 64-bit distribution, you can start by following the steps outlined in our [Disks and Configuration Profiles](/docs/migrate-to-linode/disk-images/disk-images-and-configuration-profiles/) guide to create a second deployment. From there, you can copy your data to the new 64-bit version, then delete your old profile and disks.

Otherwise, find your Linux distribution of choice below to check for additional known issues.

### Ubuntu and Debian

For Ubuntu and Debian users, the Apt package management system will continue to download correct architecture version of software, despite the new kernel.

### CentOS and Fedora

When switching a 32-bit CentOS or Fedora build to use a 64-bit kernel, you need to configure the distro's package manager (Yum) to explicitly download x86 architecture builds of updates to existing and new packages. If you haven't already, we recommend CentOS users switch to the package mirrors Linode provides. The instructions to switch to Linode's package mirrors are in the [package mirrors](/docs/platform/package-mirrors) guide. Regardless of your decision to use our mirrors, you will want to run this command to ensure that only 32-bit packages are selected:

    sed -i 's/$basearch/i386/g' /etc/yum.repos.d/*

Once this is done, run a cleanup of yum:

    yum clean all

Now all future software installed from Yum will use the correct CPU architecture for your 32-bit user space.

### Arch Linux

The Arch package manager, Pacman, chooses what architecture-specific builds to download based on the kernel. After switching to the 64-bit kernel, adjust this setting in `/etc/pacman.conf`:

{{< file-excerpt "/etc/pacman.conf" >}}
Architecture=x86_64

{{< /file-excerpt >}}


### Gentoo

In Gentoo, all packages are compiled on the system. Ensure that the `-m32` flag is set in `CFLAGS`.

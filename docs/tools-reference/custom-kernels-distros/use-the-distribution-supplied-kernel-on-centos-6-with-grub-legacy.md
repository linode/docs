---
author:
  name: Linode
  email: docs@linode.com
description: 'Configure your CentOS 6 Linode to use the distribution-supplied kernel'
keywords: ["centos 6", " custom kernel", " grub legacy"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-03-10
modified_by:
  name: Nick Brewer
published: 2017-03-10
title: 'Use the Distribution-Supplied Kernel on CentOS 6 with Grub Legacy'
deprecated: false
---

This guide will show you how to install and use the distribution-supplied kernel for CentOS 6, with our **Grub Legacy** boot option.

Before you get started, make sure you follow the steps outlined in our [Getting Started](/docs/getting-started) guide. Your Linode needs to be in a functional state. These steps should be performed as `root` on your Linode, via an SSH session.

{{< note >}}
This guide is intended for Linodes running on our KVM hypervisor. For older Xen Linodes, see [this](/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub) guide.
{{< /note >}}

## Install the Kernel and Configure Grub


1.  Make sure your package repositories and installed packages are up to date by issuing the following command:

        yum update

2.  Issue the following command to install the default kernel for CentOS6:

        yum install kernel.x86_64

3. View the content of your `/boot` directory, and take note of the kernel version number and the name of your `initramfs` file:

		ls -la /boot
		total 20972
		dr-xr-xr-x  4 root root     4096 Mar 10 18:26 .
		dr-xr-xr-x 22 root root     4096 Mar 10 18:20 ..
		-rw-r--r--  1 root root   108108 Feb 24 14:37 config-2.6.32-642.15.1.el6.x86_64
		drwxr-xr-x  3 root root     4096 Mar 10 18:24 efi
		drwxr-xr-x  2 root root     4096 Mar 10 18:26 grub
		-rw-------  1 root root 14230393 Mar 10 18:24 initramfs-2.6.32-642.15.1.el6.x86_64.img
		-rw-r--r--  1 root root   215528 Feb 24 14:37 symvers-2.6.32-642.15.1.el6.x86_64.gz
		-rw-r--r--  1 root root  2618573 Feb 24 14:37 System.map-2.6.32-642.15.1.el6.x86_64
		-rwxr-xr-x  1 root root  4270000 Feb 24 14:37 vmlinuz-2.6.32-642.15.1.el6.x86_64
		-rw-r--r--  1 root root      171 Feb 24 14:37 .vmlinuz-2.6.32-642.15.1.el6.x86_64.hmac

	In this example, you would grab the kernel version that is appended to the `vmlinuz` file - `2.6.32-642.15.1.el6.x86_64`. You'd also take down the full name of the `initramfs` file, in this case `initramfs-2.6.32-642.15.1.el6.x86_64.img`.

4.  Create a file named `/boot/grub/menu.lst` with the following contents. Adjust the `kernel`, and `initrd` lines to reflect the actual file names found in the `/boot/` directory.

    {{< file "/boot/grub/menu.lst" >}}
timeout 5
title CentOS 6
	root (hd0)
	kernel /boot/vmlinuz-2.6.32-431.23.3.el6.x86_64 root=/dev/sda console=ttyS0,19200n8
	initrd /boot/initramfs-2.6.32-431.23.3.el6.x86_64.img


{{< /file >}}


5.  In the Linode Manager, edit your Linode's [configuration profile](/docs/platform/disk-images/disk-images-and-configuration-profiles/#editing-a-configuration-profile) by selecting the **Grub (Legacy)** option within the *Kernel* drop-down menu.

6.  Make sure the root device is specified as **/dev/sda**, and click **Save Profile** at the bottom of the page to confirm your changes.

7. Reboot your Linode from the **Dashboard** tab. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux li985-241.members.linode.com 2.6.32-642.15.1.el6.x86_64 #1 SMP Fri Feb 24 14:31:22 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux

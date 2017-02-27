---
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for configuring your Linode to run a native distribution-supplied kernel with PV-GRUB.'
keywords: 'pv-grub,pvgrub,custom linux kernel,custom linode'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['platform/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub/', 'custom-instances/pv-grub-howto/']
modified: 'February 27th, 2017'
modified_by:
  name: Nick Brewer
published: 'February 27th, 2017'
title: 'Run a Distribution-Supplied Kernel with Grub Legacy'
deprecated: false
---

{: .caution}
> This guide is for legacy Xen Linodes. For newer Linodes, consult our guide on how to [Run a Distribution-Supplied Kernel on a KVM Linode](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel-with-kvm).

Grub Legacy makes it possible to run your own kernel on your Linode, instead of using a host-supplied kernel. This is useful in cases where you'd like to enable specific kernel features, or you'd prefer to handle kernel 

These instructions are intended to be used with distributions that originally shipped with Grub Legacy. For instructions on setting up a Linode with Grub 2, please see [this](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel-with-kvm) guide. This guide provides instructions for a few of the more commonly used distros that ship with Grub Legacy:

*  [Ubuntu 12.04](#ubuntu-1204-precise)
*  [Debian 7 (Wheezy)](#debian-7-wheezy)
*  [CentOS 6](#centos-6)

Before you get started, make sure you follow the steps outlined in our [Getting Started](/docs/getting-started) guide. Your Linode needs to be in a functional state. These steps should be performed as `root` on your Linode, via an SSH session.



## Ubuntu 12.04 (Precise)

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update          
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Ubuntu 12.04, uninstall `grub2`, and install `grub`:

        apt-get install linux-virtual
        apt-get purge grub2 grub-pc
        apt-get install grub
        update-grub

    When you are asked which devices you would like to install `grub` on, leave all listed devices unchecked and select `Ok` to continue. When you are asked whether you would like to continue without installing GRUB, answer `yes`. When you are asked to confirm removal of GRUB 2 from `/boot/grub`, answer `yes`. When you are asked whether you would like a `menu.lst` file generated for you, answer `yes`.

3.  Edit the `/boot/grub/menu.lst` file as follows. As noted in the file, please do not uncomment entries that begin with the `#` character. First, locate the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	timeout 3
	~~~
	
4.  Edit the file to match the following excerpt. This will give you a bit of additional time at boot to select your desired kernel, in case you feel the need to go back to an older one in the future.

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	timeout 10
	~~~
	
5.  Next, locate the line containing `kopt` that resembles the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	# kopt=root=UUID=de400b9f-2578-488e-8664-250a8455a6fc ro
	~~~
	
6.  Edit it to match the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
    kopt=root=/dev/sda console=ttyS0 ro quiet
	~~~

7.  Next, locate the line containing "groot" that resembles the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	# groot=(hd0,0)
	~~~
	
8.  Change it to match the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	# groot=(hd0)
	~~~
	
9.  Issue the following command to update `grub`:

        update-grub

10. Next, open the file "/etc/init/ttyS0.conf" and verify that it matches the following excerpt:

    {: .file }
	/etc/init/ttyS0.conf
	: ~~~
		# ttyS0 - getty
		#
		# This service maintains a getty on ttyS0 from the point the system is
		# started until it is shut down again.

		start on stopped rc RUNLEVEL=[2345]
		stop on runlevel [!2345]

		respawn
		exec /sbin/getty -8 38400 ttyS0
	~~~

11. In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the kernel, depending on the version of Ubuntu you have deployed (32-bit or 64-bit).
12. Make sure the root device is specified as **sda**.
13. In the **Filesystem/Boot Helpers** section, disable the **Distro Helper** option.
14. Save your changes by clicking **Save Profile** at the bottom of the page.
15. Reboot your Linode from the **Dashboard** tab.
16. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux localhost 3.2.0-52-virtual #78-Ubuntu SMP Fri Jul 26 16:45:00 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux


## Debian 7 (Wheezy)

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update          
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Debian 7, along with the `grub` bootloader package:

    **32-bit Debian:** :

        apt-get install linux-image-686-pae
        mkdir /boot/grub
        apt-get install grub-legacy

    **64-bit Debian:** :

        apt-get install linux-image-amd64
        mkdir /boot/grub
        apt-get install grub-legacy

3.  Issue the following commands to generate an initial `/boot/grub/menu.lst` file:

        grub-set-default 1
        update-grub

4.  Edit the `/boot/grub/menu.lst` file as follows. As noted in the file, please do not uncomment entries that begin with the `#` character. First, locate the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	timeout 5
	~~~
	
5.  Change it to match the following excerpt. This will give you a bit of additional time at boot to select your desired kernel, in case you feel the need to go back to an older one in the future.

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	timeout 10
	~~~
	
6.  Next, locate the line containing `kopt` that resembles the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	# kopt=root=UUID=de400b9f-2578-488e-8664-250a8455a6fc ro
	~~~
	
7.  Change it to match the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	# kopt=root=/dev/sda console=ttyS0 ro quiet
	~~~
	
8.  Next, locate the line containing `groot=` and verify that it matches the following excerpt:

    {: .file-excerpt }
	/boot/grub/menu.lst
	: ~~~
	# groot=(hd0)
	~~~
	
9.  Issue the following command to update `grub`:

        update-grub

10. In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the kernel, depending on the version of Debian you have deployed (32-bit or 64-bit).
11. Make sure the root device is specified as **sda**.
12. In the **Filesystem/Boot Helpers** section, disable the **Distro Helper** option.
13. Save your changes by clicking **Save Profile** at the bottom of the page.
14. Reboot your Linode from the **Dashboard** tab.
15. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux li263-140 2.6.32-5-xen-686 #1 SMP Wed May 18 09:43:15 UTC 2011 i686 GNU/Linux


## CentOS 6

1.  Make sure your package repositories and installed packages are up to date by issuing the following command:

        yum update

2.  Run the following command to identify the kernel your CentOS system has provided:

        uname -a

3.  This command should provide output similar to that shown below:

        Linux li63-119 2.6.32-358.14.1.el6.x86_64 #1 SMP Tue Jul 16 23:51:20 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux

4.  Make a note of the kernel you're currently using (`2.6.32-358.14.1.el6.x86_64` in our example). You will be replacing it with the kernel shown in the configuration below.

5.  Issue the following command to install the default kernel for CentOS6:

    **32-bit CentOS:** :

        yum install kernel-PAE.i686

    **64-bit CentOS:** :

        yum install kernel.x86_64

6.  Create a file named `/boot/grub/menu.lst` with the following contents. Adjust the `title`, `kernel`, and `initrd` lines to reflect the actual file names found in the `/boot/` directory.

    {: .file }
	/boot/grub/menu.lst
	: ~~~
timeout 5
title CentOS (2.6.32-431.23.3.el6.x86_64)
	root (hd0)
	kernel /boot/vmlinuz-2.6.32-431.23.3.el6.x86_64 root=/dev/sda
	initrd /boot/initramfs-2.6.32-431.23.3.el6.x86_64.img
	~~~

7.  In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the **Kernel**, depending on the version of CentOS you have deployed (32-bit or 64-bit).
8.  Make sure the root device is specified as **sda**.
9.  Save your changes by clicking **Save Profile** at the bottom of the page.
10.  Reboot your Linode from the **Dashboard** tab.
11. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux li63-119 2.6.32-358.14.1.el6.x86_64 #1 SMP Tue Jul 16 23:51:20 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux

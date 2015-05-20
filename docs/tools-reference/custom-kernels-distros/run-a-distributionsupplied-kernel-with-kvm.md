---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Instructions for configuring your Linode to run a native distribution-supplied kernel on KVM hosts.'
keywords: 'kvm,custom linux kernel,custom linode'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, May 20th, 2015
modified_by:
  name: James Stewart
published: 'Wednesday, May 20th, 2015'
title: 'Run a Distribution-Supplied Kernel on KVM Hosts'
---

This guide will explain how to configure a custom kernel for a Linode residing on a KVM based host. This is useful in cases where you'd like to enable specific kernel features, or you'd prefer to handle kernel upgrades directly.

Before you get started, make sure you follow the steps outlined in our [Getting Started](/docs/getting-started) guide. Your Linode needs to be in a functional state. These steps should be performed as `root` on your Linode, via an SSH session.

Installing the distribution provided kernel
-------------------------------------------

Ubuntu 13.04 (Raring)
---------------------

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update          
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Ubuntu 13.04`:

        apt-get install linux-image-virtual


Ubuntu 12.04 (Precise)
----------------------

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update          
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Ubuntu 12.04:

        apt-get install linux-virtual

Ubuntu 10.04 LTS (Lucid)
------------------------

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update          
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Ubuntu 10.04 LTS:

        apt-get install linux-virtual

Debian 7 (Wheezy) / Debian 8 (Jessie)
-------------------------------------

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update          
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Debian 7:

    **32-bit Debian:** :

        apt-get install linux-image-686-pae

    **64-bit Debian:** :

        apt-get install linux-image-amd64

Debian 6 (Squeeze)
------------------

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update          
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Debian 6:

    **32-bit Debian:** :

        apt-get install linux-image-xen-686

    **64-bit Debian:** :

        apt-get install linux-image-xen-amd64

CentOS 6 and Newer
-------------------

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

        yum install kernel-x86_64

CentOS 5
--------

[Warren Togami](http://togami.com/) was kind enough to provide a script to automate getting a native CentOS 5 kernel up and running, including with SELinux support. We will use this script in the following instructions.

1.  Issue the following commands as `root` to retrieve and run the script:

        wget -O selinux.sh http://www.linode.com/docs/assets/542-centos5-native-kernel-selinux-enforcing.sh
        chmod +x selinux.sh
        ./selinux.sh


Fedora 17
---------

1.  Make sure your package repositories and installed packages are up to date by issuing the following command:

        yum update

2.  Issue the following command to install the default kernel for Fedora 13:

    **32-bit Fedora:** :

        yum install kernel-PAE.i686

    **64-bit Fedora:** :

        yum install kernel.x86_64


Configuring Grub
----------------

1.  Boot the Linode with the host provided kernel.

2.  Edit `/etc/default/grub and add or change the variables to match the following.

	{:.file }
	/etc/default/grub
	: ~~~
	  # If you change this file, run 'update-grub' afterwards to update
	  # /boot/grub/grub.cfg.
	  # For full documentation of the options in this file, see:
	  #   info -f grub -n 'Simple configuration'

	  GRUB_DEFAULT=0
	  GRUB_TIMEOUT=5
	  GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
	  GRUB_CMDLINE_LINUX_DEFAULT=""
	  GRUB_CMDLINE_LINUX="console=tty0 console=ttyS0,19200n8"

	  # Uncomment to enable BadRAM filtering, modify to suit your needs
	  # This works with Linux (no patch required) and with any kernel that obtains
	  # the memory map information from GRUB (GNU Mach, kernel of FreeBSD ...)
	  #GRUB_BADRAM="0x01234567,0xfefefefe,0x89abcdef,0xefefefef"

	  # Uncomment to disable graphical terminal (grub-pc only)
	  GRUB_TERMINAL=serial
	  GRUB_SERIAL_COMMAND="serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1"

	  # The resolution used on graphical terminal
	  # note that you can use only modes which your graphic card supports via VBE
	  # you can see them in real GRUB with the command `vbeinfo'
	  #GRUB_GFXMODE=640x480

	  # Uncomment if you don't want GRUB to pass "root=UUID=xxx" parameter to Linux
	  GRUB_DISABLE_LINUX_UUID=true
	  GRUB_DEVICE=/dev/sda
	  GRUB_DEVICE_BOOT=hd0
	  LINUX_ROOT_DEVICE=hd0
	  # Uncomment to disable generation of recovery mode menu entries
	  #GRUB_DISABLE_RECOVERY="true"
	  # Uncomment to get a beep at grub start
	  #GRUB_INIT_TUNE="480 440 1"
	  ~~~

3. In /etc/inittab change the line that says

		#T0:23:respawn:/sbin/getty -L ttyS0 9600 vt100

to

		T0:23:respawn:/sbin/getty -L ttyS0 115200 vt100

4.  Run the following command to update the bootloader.

		update-grub 

Note that if you later install an updated kernel, you'll need to add an entry for it to your `menu.lst` file. By default, the first kernel in the list will be booted.




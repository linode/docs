---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for configuring your Linode to run a custom compiled kernel with PV-GRUB.'
keywords: ["compile kernel", "kernel compiling", "pv-grub", "pvgrub", "custom linux kernel", "custom linode"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['platform/custom-kernels-distros/run-a-custom-compiled-kernel-with-pvgrub/',  'custom-instances/pv-grub-custom-compiled-kernel/']
modified: 2014-06-19
modified_by:
  name: Linode
published: 2010-07-17
title: 'Run a Custom Compiled Kernel with PV-GRUB'
---

For some use cases, you may wish to run a custom-compiled Linux kernel on your Linode. This can be useful if you need to enable certain kernel features that are unavailable in Linode-supplied or distribution-supplied kernels, or when you want to disable features that are compiled into such kernels. For example, some users may desire [SELinux](http://en.wikipedia.org/wiki/Security-Enhanced_Linux) support, which is not enabled in stock Linode kernels, and may not be enabled in some distribution-supplied kernels.

If you'd rather run a distribution-supplied kernel instead, please follow our guide for [running a distribution-supplied kernel](/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub). Before proceeding with these instructions, you should follow the steps outlined in our [getting started](/docs/getting-started/) guide. After doing so, make sure you are logged into your Linode as the "root" user via an SSH session.

## Prepare the System

Issue the following commands to update your package repositories and installed packages, install development tools required for compiling a kernel, and install the `ncurses` library.

Ubuntu and Debian:

    apt-get update
    apt-get upgrade --show-upgraded
    apt-get install -y build-essential libncurses5-dev

CentOS and Fedora:

    yum update
    yum install -y ncurses-devel make gcc bc

Arch Linux:

    pacman -Syu
    pacman -Sy base-devel ncurses

If this is the first time you've compiled a kernel on your Linode, issue the following command to remove any existing files in the `/boot` directory. This helps avoid confusion later, as certain distributions elect to install a pre-compiled kernel package along with their development packages.

    rm -rf /boot/*

## Compile and Install the Kernel

### Download Kernel Sources

1.  Download the latest 3.x kernel sources from [kernel.org](http://kernel.org/). A conventional location to download to is `/usr/src/kernels`, but it's not required.

        wget https://www.kernel.org/pub/linux/kernel/v3.x/linux-3.19.3.tar.xz

2.  Expand the archived file and change directory to it:

        tar -xvf linux-3.19.3.tar.xz
        cd linux-3.19.3

### Default Kernel Configuration

Your kernel must be properly configured to run under our environment. Some required configuration options may include:

-   CONFIG\_PARAVIRT=y
-   CONFIG\_PARAVIRT\_GUEST=y
-   CONFIG\_PARAVIRT\_CLOCK=y
-   CONFIG\_XEN=y
-   CONFIG\_XEN\_BLKDEV\_FRONTEND=y
-   CONFIG\_XEN\_NETDEV\_FRONTEND=y
-   CONFIG\_XEN\_SCRUB\_PAGES=y
-   CONFIG\_HVC\_XEN=y

It is recommended that you start with a kernel config from a running Linode kernel. All Linode kernels will expose their configuration via `/proc/config.gz`. For example:

    zcat /proc/config.gz > .config
    make oldconfig

`make oldconfig` will prompt you to answer any new configuration options not present in the old configuration file.

Changes to the kernel's configuration can be made with the `menuconfig` command. Enable any additional options you require, making sure to leave filesystem support (likely ext3 or ext4) compiled into the kernel (*not* configured as a module). For example, to enable SELinux support, check the option "Security options --\> NSA SELinux Support" in the configuration interface. :

    make menuconfig

Once your configuration options are set, exit the configuration interface and answer "y" when asked whether you would like to save your new kernel configuration.

### Build the Kernel

1.  Compile and install the kernel and modules:

        make -j3 bzImage
        make -j3 modules
        make
        make install
        make modules_install

2.  Give the kernel a more descriptive name. Modify the command as necessary to reflect the kernel version you've just compiled.

        mv /boot/vmlinuz /boot/vmlinuz-3.19.3-custom

3.  Create an `initrd` file. Aagain, adjust the filename to match your current kernel version:

        mkinitrd -o initrd-3.19.3-custom.img

3.  PV-GRUB will always look for `menu.lst` in the directory `/boot/grub`. Create this directory with the following command:

        mkdir /boot/grub

4.  Create a `menu.lst` file with the following contents. Adjust the "title" and "kernel" lines to reflect the actual filenames found in the `/boot` directory.

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 5

title Custom Compiled, kernel 3.19.3-custom
root (hd0)
kernel /boot/vmlinuz-3.19.3-custom root=/dev/xvda ro quiet

{{< /file-excerpt >}}


Note that there is no `initrd` line. With some distributions, the `initrd` image prepared during the kernel installation process will not work correctly with your Linode, and it isn't needed anyhow.


## Configure for PV-GRUB

In the Linode Manager, edit your Linode's configuration profile to use `pv-grub-x86_64` as the "Kernel". Make sure the root device is specified as `xvda`. Save your changes by clicking "Save Profile" at the bottom of the page, and reboot your Linode from the "Dashboard" tab.

Once your Linode has rebooted, log back into it and issue the command `uname -a`. You should see output similar to the following, indicating you're running your custom kernel:

    Linux li175-165 2.6.34.16-custom #1 SMP Sat Jul 17 17:09:58 EDT 2010 i686 i686 i386 GNU/Linux

Note that if you install an updated kernel, you'll need to add an entry for it to your `menu.lst` file. By default, the first kernel in the list will be booted. If you have multiple kernels installed, you can choose which one your Linode uses to boot by watching for the kernel list in the Lish console (see the "Console" tab in the Linode Manager). Congratulations, you've booted your Linode using a custom-compiled kernel!




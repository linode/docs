---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for configuring your Linode to run a custom compiled kernel with PV-GRUB on CentOS 7'
keywords: ["compile kernel", "kernel compiling", "pv-grub", "pvgrub", "custom linux kernel", "custom linode", " centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-04-14
modified_by:
  name: Linode
published: 2010-07-17
title: 'Custom Compiled Kernel with PV-GRUB on CentOS 7'
---

Running a custom-compiled Linux kernel is useful if you need to enable or disable certain kernel features that are unavailable in Linode-supplied or distribution-supplied kernels. For example, some users desire [SELinux](http://en.wikipedia.org/wiki/Security-Enhanced_Linux) support, which is not enabled in stock Linode kernels, and may not be enabled in some distribution-supplied kernels.

If you'd rather run a distribution-supplied kernel instead, please follow our guide for [Running a Distribution-Supplied Kernel](/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub).

Prior to these instructions, follow the steps outlined in our [Getting Started](/docs/getting-started/) guide. Then, make sure you are logged into your Linode as the `root` user.

## Prepare the System

Update your package repositories and installed packages, install the development tools required for compiling a kernel, and install the `ncurses` library.

    yum update
    yum install -y ncurses-devel make gcc bc

If this is the first time compiling a kernel on the Linode, issue the following command to remove any existing files in the `/boot` directory. This helps avoid confusion later, as certain distributions install a pre-compiled kernel package along with their development packages.

    rm -rf /boot/*

## Compile and Install the Kernel

### Download Kernel Sources

1.  Download the latest 3.x kernel sources from [kernel.org](http://kernel.org/). A conventional location to download to is `/usr/src/kernels/`.

        wget https://www.kernel.org/pub/linux/kernel/v3.x/linux-3.19.3.tar.xz

2.  Expand the archived file and change directories:

        tar -xvf linux-3.19.3.tar.xz
        cd linux-3.19.3

### Default Kernel Configuration

The kernel must be properly configured to run under the Linode environment. Some required configuration options may include:

-   CONFIG\_PARAVIRT=y
-   CONFIG\_PARAVIRT\_GUEST=y
-   CONFIG\_PARAVIRT\_CLOCK=y
-   CONFIG\_XEN=y
-   CONFIG\_XEN\_BLKDEV\_FRONTEND=y
-   CONFIG\_XEN\_NETDEV\_FRONTEND=y
-   CONFIG\_XEN\_SCRUB\_PAGES=y
-   CONFIG\_HVC\_XEN=y

It's recommended to start with a kernel config from a running Linode kernel. All Linode kernels expose their configuration via `/proc/config.gz`. For example:

    zcat /proc/config.gz > .config
    make oldconfig

`make oldconfig` prompts the user to answer any new configuration options not present in the old configuration file.

Changes to the kernel's configuration can be made with the `menuconfig` command. Enable any additional options, making sure to leave filesystem support (likely ext3 or ext4) compiled into the kernel (*not* configured as a module). For example, to enable SELinux support, check the option "Security options --\> NSA SELinux Support" in the configuration interface:

    make menuconfig

Once your configuration options are set, exit the configuration interface and answer "y" when asked whether you would like to save the new kernel configuration.

### Build the Kernel

1.  Compile and install the kernel and modules:

        make -j3 bzImage
        make -j3 modules
        make
        make install
        make modules_install

2.  Give the kernel a more descriptive name. Modify the command as necessary to reflect the kernel version you've just compiled.

        mv /boot/vmlinuz /boot/vmlinuz-3.19.3-custom

3.  Create an `initrd` file. Again, adjust the filename to match the current kernel version:

        mkinitrd -o initrd-3.19.3-custom.img

4.  PV-GRUB looks for `menu.lst` in the directory `/boot/grub`. Create this directory with the following command:

        mkdir /boot/grub

5.  Create a `menu.lst` file with the following contents. Adjust the "title" and "kernel" lines to reflect the actual filenames found in the `/boot` directory.

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 5

title Custom Compiled, kernel 3.19.3-custom
root (hd0)
kernel /boot/vmlinuz-3.19.3-custom root=/dev/xvda ro quiet

{{< /file-excerpt >}}


Note that there is no `initrd` line. With some distributions, the `initrd` image prepared during the kernel installation process does not work correctly with the Linode, and isn't needed anyhow.

## Configure for PV-GRUB

In the Linode Manager, edit your Linode's configuration profile to use `pv-grub-x86_64` as the "Kernel". Make sure the root device is specified as `xvda`. Save the changes by clicking **Save Profile** at the bottom of the page, and reboot your Linode from the "Dashboard" tab.

Once the Linode has rebooted, log back into it and issue the command `uname -a`. You should see output similar to the following, indicating you're running the custom kernel:

    Linux li175-165 3.19.3-custom #1 SMP Sat Jul 17 17:09:58 EDT 2010 i686 i686 i386 GNU/Linux

Note that if you install an updated kernel, you need to add an entry for it to your `menu.lst` file. By default, the first kernel in the list is booted. If you have multiple kernels installed, you can choose which kernel your Linode uses to boot by watching for the kernel list in the Lish console (see the "Console" tab in the Linode Manager). Congratulations, you've booted your Linode using a custom-compiled kernel!


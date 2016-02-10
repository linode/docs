---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: ''
keywords: 'compile kernel,kernel compiling,custom linux kernel,custom linode, centos'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, Febryary 10th, 2016
modified_by:
  name: Alex Fornuto
published: ''
title: 'Custom Compiled Kernel on CentOS'
---

Running a custom-compiled Linux kernel is useful if you need to enable or disable certain kernel features that are unavailable in Linode-supplied or distribution-supplied kernels. For example, some users desire [SELinux](http://en.wikipedia.org/wiki/Security-Enhanced_Linux) support, which is not enabled in stock Linode kernels, and may not be enabled in some distribution-supplied kernels.

If you'd rather run a distribution-supplied kernel instead, please follow our guide for [Running a Distribution-Supplied Kernel](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel-with-kvm).

Prior to these instructions, follow the steps outlined in our [Getting Started](/docs/getting-started/) guide. Then, make sure you are logged into your Linode as the `root` user.

## Prepare the System

Update your package repositories and installed packages, install the development tools required for compiling a kernel, and install the `ncurses` library.

    yum update
    yum install -y ncurses-devel make gcc bc openssl-devel grub2

If this is the first time compiling a kernel on the Linode, issue the following command to remove any existing files in the `/boot` directory. This helps avoid confusion later, as certain distributions install a pre-compiled kernel package along with their development packages.

    rm -rf /boot/*

##Compile and Install the Kernel

### Download Kernel Sources

1.  Download the latest 4.x kernel sources from [kernel.org](http://kernel.org/). A conventional location to download to is `/usr/src/`.

        wget https://cdn.kernel.org/pub/linux/kernel/v4.x/linux-4.4.1.tar.xz 

2.  Expand the archived file and change directories:

        tar -xvf linux-4.4.1.tar.xz 
        cd linux-4.4.1

### Default Kernel Configuration

The kernel must be properly configured to run under the Linode environment. Some required configuration options may include:

    CONFIG_KVM_GUEST=y
    CONFIG_VIRTIO_PCI=y
    CONFIG_VIRTIO_PCI_LEGACY=y
    CONFIG_SCSI_VIRTIO=y
    CONFIG_VIRTIO_NET=y
    CONFIG_SERIAL_8250=y
    CONFIG_SERIAL_8250_CONSOLE=y

It's recommended to start with a kernel config from a running Linode kernel. All Linode kernels expose their configuration via `/proc/config.gz`. For example:

    zcat /proc/config.gz > .config
    make oldconfig

`make oldconfig` prompts the user to answer any new configuration options not present in the old configuration file.

Changes to the kernel's configuration can be made with the `menuconfig` command. Enable any additional options, making sure to leave filesystem support (likely ext3 or ext4) compiled into the kernel (*not* configured as a module). For example, to enable SELinux support, check the option "Security options --\> NSA SELinux Support" in the configuration interface:

    make menuconfig

Once your configuration options are set, exit the configuration interface and answer "y" when asked whether you would like to save the new kernel configuration.

### Build the Kernel

1.  Compile and install the kernel and modules:

        make bzImage
        make modules
        make 
        make install
        make modules_install

    {: .note}
    > If you're using a Linode with multiple cores, you can use the `j` option to spawn multible simultaneous jobs to increase speed. For example:
    >    
    >     make -j2 bzImage

2.  Give the kernel a more descriptive name. Modify the command as necessary to reflect the kernel version you've just compiled.

        mv /boot/vmlinuz /boot/vmlinuz-4.4.1-custom

3.  Create an `initrd` file. Again, adjust the filename to match the current kernel version:

        mkinitrd /boot/initrd-4.4.1-custom.img /boot/vmlinuz-4.4.1-custom

4.  Edit `/etc/default/grub` and add or change the following variables to match. There will be other variables in this file, but we are only concerned with those listed below:

        GRUB_TIMEOUT=10
        GRUB_DISABLE_LINUX_UUID=true
        GRUB_CMDLINE_LINUX="console=tty1 console=ttyS0,19200n8"
        GRUB_SERIAL_COMMAND="serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1"
        GRUB_TERMINAL="serial console"

    Comment or remove any lines starting with `GRUB_HIDDEN`.

5.  Make the `grub` directory and build your GRUB configuration file:

        mkdir /boot/grub
        grub2-mkconfig -o /boot/grub/grub.cfg

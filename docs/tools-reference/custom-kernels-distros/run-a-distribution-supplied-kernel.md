---
author:
  name: Linode
  email: docs@linode.com
description: "Use the Linode Manager's GRUB 2 boot setting to run your distribution's native Linux kernel"
keywords: ["kvm", "custom linux", " kernel", "custom linode", "grub", "grub 2"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
aliases: ['run-a-distribution-supplied-kernel-with-kvm/']
modified: 2017-10-18
modified_by:
  name: Linode
published: 2015-06-29
title: 'Run a Distribution-Supplied Kernel'
---

![Run a Distribution-Supplied Kernel on a KVM Linode](/docs/assets/run-a-distribution-supplied-kernel-with-kvm.png "Run a Distribution-Supplied Kernel on a KVM Linode")

Your Linode runs on [KVM](https://www.linux-kvm.org/page/Main_Page), and is capable of using your choice of Linode's own kernel, or the upstream kernel provided by a Linux distribution's maintainers. Booting with Linode's kernel is enabled by default, with exception to CoreOS Container Linux, Fedora, and Ubuntu 17.10+ which boot their upstream kernels by default.

## Recommended Distributions

The steps in this section currently apply only to the distributions under *Recommended* in the Linode Manager's *Deploy an Image* dropdown.

![Deploy an image](/docs/assets/deploy-an-image-example.png "Deploy an image")

1.  Shut down your Linode from the Linode Manager.

2.  Click **Edit** to view a distribution's configuration profile options:

    ![Edit the configuration profile](/docs/assets/edit_config_profile_small.png "Edit the configuration profile")

3.  Under **Boot Settings** is a **Kernel** dropdown menu. By default, this will be set to the latest Linode-supplied 64 bit kernel:

    ![Our latest 64 bit kernel](/docs/assets/boot-settings-kernel-latest.png "Our latest 64 bit kernel")

4.  To switch to the distro's default kernel, select **GRUB 2** instead of the latest 64 bit.

    ![Selecting the distribution's kernel](/docs/assets/boot-settings-kernel-grub2.png "Selecting the distribution's kernel")

5.  Click **Save Changes** at the bottom of the page and reboot into the new kernel.

6.  Once booted, you can verify the kernel information with `uname`:

        [root@archlinux ~]# uname -r
        4.11.7-1-ARCH

If you want to switch back to the Linode kernel at any time:

1.  Shut down your Linode.
2.  Select the latest 64 bit Linode kernel using the steps above.
3.  Click **Save Changes** and reboot.

### Caveats

CentOS 7 and Fedora ship with SELinux installed and running in permissive mode. When switching from the Linode kernel to the CentOS or Fedora kernel, SELinux may need to run a relabeling of the filesystem to boot. When completed, the Linode will reboot and if you have Lassie enabled, you'll be back at the login prompt shortly. If you do not have Lassie enabled, you will need to manually click *Reboot* in the Linode Manager.

![SELinux filesystem relabel](/docs/assets/selinux-filesystem-relabel.png "SELinux filesystem relabel")

The relabel process is triggered by the empty `/.autorelabel` file.

    [root@li901-254 ~]# ls -a /
    .   .autorelabel  boot  etc   lib    lost+found  mnt  proc  run   srv  tmp  var
    ..  bin           dev   home  lib64  media       opt  root  sbin  sys  usr

## Older Distributions

If your system is unable to GRUB2 boot and instead shows you a Grub command line prompt in Lish like shown below, then you need to install the kernel and configure Grub. **This should only be necessary on Linodes which were created before February 2017.**

![Grub prompt](/docs/assets/grub-prompt.png "Grub prompt")

### Install the Kernel

1.  Ensure that your system is up to date using the distribution's package manager.

2.  Install the Linux kernel and Grub. During installation, you may be asked which disk image to install to. Since Linode provides the grub bootloader, your system need only provide the `grub.cfg` file. You also don't need to install `grub` to your MBR.

    **Arch Linux**

        pacman -S linux grub

    **CentOS**

        yum install kernel grub2

    **Debian**

        apt-get install linux-image-amd64 grub2

    **Gentoo**

    There are two main ways to install Gentoo's kernel: Manual configuration and using the `genkernel` tool. Which you use and how you configure the kernel will depend on your preferences, so see the [Gentoo Handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Kernel) for instructions.

    **Ubuntu**

        apt install linux-image grub2

When the installation finishes, you'll then see the kernel and other components in the `/boot` directory. For example:

    [root@archlinux ~]# ls /boot
    grub  initramfs-linux-fallback.img  initramfs-linux.img  vmlinuz-linux

### Configure Grub

After the kernel is installed, you'll need to configure the serial console and other Grub settings so you can use [Lish](/docs/networking/using-the-linode-shell-lish) and [Glish](/docs/networking/using-the-linode-graphical-shell-glish).

1.  Open `/etc/default/grub` in a text editor and go to the line beginning with `GRUB_CMDLINE_LINUX`. Remove the word `quiet` if present, and add `console=ttyS0,19200n8 net.ifnames=0`. Leave the other entries in the line. For example, on CentOS 7 you should have something similar to:

        GRUB_CMDLINE_LINUX="crashkernel=auto rhgb console=ttyS0,19200n8 net.ifnames=0"

2.  Then add or change the following options to match the following example. There will be other variables in this file, but we are only concerned with these lines.

    {{< file-excerpt "/etc/default/grub" >}}
GRUB_TERMINAL=serial
GRUB_DISABLE_OS_PROBER=true
GRUB_SERIAL_COMMAND="serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1"
GRUB_DISABLE_LINUX_UUID=true
GRUB_GFXPAYLOAD_LINUX=text

{{< /file-excerpt >}}


3.  Run the following command to prepare and update the bootloader:

    **Arch and Gentoo**

        grub-mkconfig -o /boot/grub/grub.cfg

    **CentOS**

    The .autorelabel file is necessary to queue the SELinux filesystem relabeling process when rebooting from the Linode kernel to the CentOS kernel.

        mkdir /boot/grub
        ln -s /boot/grub2/grub.cfg /boot/grub/grub.cfg
        grub2-mkconfig -o /boot/grub/grub.cfg
        touch /.autorelabel

    **Debian and Ubuntu**

        update-grub

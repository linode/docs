---
author:
  name: Nick Brewer
  email: docs@linode.com
published: 2017-03-02
description: 'Install a Custom Distribution or Linux Appliance on your KVM Linode.'
keywords: ["custom distro", "custom distribution", "advanced Linux", "kvm"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['tools-reference/custom-kernels-distros/running-a-custom-linux-distro-on-a-linode-vps/','tools-reference/custom-kernels-distros/custom-distro-on-kvm-linode/']
modified_by:
  name: Linode
modified: 2017-06-26
title: Install a Custom Distribution on a Linode
---

This guide will show you how to install and configure a custom distribution on your Linode.

![Install a Custom Distribution on a Linode](/docs/assets/install-a-custom-distribution-on-a-linode.png "Install a Custom Distribution on a Linode")

For the sake of organization, it has been split into two main sections:

*  [Install a Custom Distribution](#install-a-custom-distribution): shows you how to use the advantages of **Direct Disk Boot** to easily install the custom distribution.

*  [Linode Manager Compatibility](#linode-manager-compatibility): builds upon the steps in the first section, and offers instructions to make your custom distribution work with features of the Linode Manager such as disk resizing, helpers, and the [Linode Backup Service](/docs/platform/linode-backup-service).

This guide will use Debian 8 (Jessie) as an example, but the steps provided are generic in nature and should work with most distributions.

{{< note >}}
This guide entails installing a custom Linux distribution on your KVM Linode. If you're currently running a Xen Linode, you can [upgrade to KVM](/docs/platform/kvm-reference/#how-to-enable-kvm), or follow our older guide on [Running a Custom Linux Distribution on a Xen Linode](/docs/tools-reference/custom-kernels-distros/install-a-custom-distribution-on-a-xen-linode).
{{< /note >}}

## Advantages of KVM on Linode

Linodes running on our KVM hypervisor offer several advantages over Xen, particularly for those looking to install a custom operating system:

*  **Direct Disk Boot:** Direct disk booting allows you to boot from any disk with a Master Boot Record (MBR). This can be especially useful for operating systems that do not make use of the Grub bootloader, such as [FreeBSD](/docs/tools-reference/custom-kernels-distros/install-freebsd-on-linode).

*  **Full Virtualization:** Our KVM hypervisor offers a full virtualization option that simulates the experience of running directly from hardware. This can be useful for non-standard configurations.

*  **Glish:** KVM introduces the [Glish](/docs/networking/use-the-graphic-shell-glish) graphical console, which makes it easy to access your distribution's installer directly from a disk.

## Install a Custom Distribution

In this section you'll install your custom distro onto a raw disk, with the *direct disk boot* option. The end result will be a working custom install; however, it will not support disk resizing from within the Linode Manager, nor will it be compatible with the Backup Service.

### Prepare your Linode

1.  [Create two raw, unformatted disk images](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-blank-disk) from the Linode's Dashboard:

    * A disk labeled **Installer**. The size of this disk will depend upon the size of your distribution's installer, but it's recommended to make it slightly larger than the space taken up by the install media itself. For this example, the installer disk will be 100MB in size, giving us plenty of room for the Debian network installer.
    * A disk labelled **Boot**. If you *don't* plan to complete the next section on Linode Manager compatibility, this can take up the rest of the free space available on your Linode.

    {{< caution >}}
**Important**: If you intend to continue to the next section on [Linode Manager Compatibility](#linode-manager-compatibility), you should make your boot disk no larger than necessary - in this example we'll install Debian to a 2000MB disk.
{{< /caution >}}

2.  [Create two configuration profiles](/docs/platform/disk-images/disk-images-and-configuration-profiles/#configuration-profiles) and disable the options under **Filesystem / Boot Helpers** for each of them, as well as the [Lassie](/docs/uptime/monitoring-and-maintaining-your-server#configuring-shutdown-watchdog) shutdown watchdog under the **Settings** menu. Both profiles will use the **Direct Disk** option from the **Kernel** dropdown menu:

    **Installer profile**

    - Label: Installer
    - Kernel: Direct Disk
    - /dev/sda: *Boot* disk image.
    - /dev/sdb: *Installer* disk image.
    - root / boot device: Standard /dev/sdb

    **Boot profile**

    - Label: Boot
    - Kernel: Direct Disk
    - /dev/sda: *Boot* disk image.
    - root / boot device: Standard /dev/sda

### Download and Install Image

1.  Boot into [Rescue Mode](/docs/troubleshooting/rescue-and-rebuild#booting-into-rescue-mode) with your *Installer* disk mounted to `/dev/sda`, and connect to your Linode using the [Lish Console](/docs/networking/using-the-linode-shell-lish).

2.  Once in Rescue Mode, download your installation media and copy it to your *Installer* disk. In this example we're using the Debian network installer, but you can replace the URL in the first command with the location of the image you want to install:

    {{< note >}}
As an additional security step, you can use the keys provided in the same directory as the `iso` to [verify the authenticity](https://www.debian.org/CD/verify) of the image.
{{< /note >}}

        wget http://ftp.debian.org/debian/dists/stable/main/installer-amd64/current/images/netboot/mini.iso
        dd if=mini.iso of=/dev/sda

    {{< note >}}
If you would prefer to write the installer directly to the disk as it downloads, use:

curl http://ftp.debian.org/debian/dists/stable/main/installer-amd64/current/images/netboot/mini.iso | dd of=/dev/sda
{{< /note >}}

3.  Reboot into your *Installer* configuration profile, and open the [Glish](/docs/networking/use-the-graphic-shell-glish) graphical console from the **Remote Access** tab in your Linode's Dashboard. You'll see your distribution's installer, and you can begin the install process.

4.  During your installer's partitioning/installation phase, be sure to instruct it to use the `/dev/sda` volume. Most installers will create separate root and swap partitions, but you can adjust this as needed.

    {{< note >}}
Some installers offer an option to place `/boot` on a separate partition. If you intend to make use of the steps in the [second part](#linode-manager-compatibility) of this guide for Linode Manager compatibility, it's important that your `/boot` directory is located on the same partition as your root filesystem.
{{< /note >}}

5.  Once the installation completes, reboot into your *Boot* profile and open the Glish console. You will have access to a login prompt:

    [![Custom Distro Glish](/docs/assets/custom-distro-glish-small.png)](/docs/assets/custom-distro-glish.png)

### Configure Grub for Lish Access

At this point you can connect to your Linode via SSH or the Glish graphical console, however you will not be able to connect to your Linode using the Lish serial console. To fix this, update the following settings in your `/etc/default/grub` file:

{{< file-excerpt "/etc/default/grub" >}}
GRUB_TIMEOUT=10
GRUB_CMDLINE_LINUX="console=ttyS0,19200n8"
GRUB_TERMINAL=serial
GRUB_DISABLE_LINUX_UUID=true
GRUB_SERIAL_COMMAND="serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1"

{{< /file-excerpt >}}


Once you've finished editing `grub`, issue the appropriate command to apply your changes to your Grub configuration:

*   Ubuntu and Debian:

        update-grub

*   CentOS and Fedora:

        grub2-mkconfig -o /boot/grub2/grub.cfg

*   Arch Linux and Gentoo:

        grub-mkconfig -o /boot/grub/grub.cfg

{{< note >}}
If you're still not able to access your Linode via Lish after updating your GRUB configuration, a reboot may be required. If this is the case, make sure you're rebooting into your *Boot* configuration profile.
{{< /note >}}

## Linode Manager Compatibility

If you've followed the steps so far, you should have a working custom distribution with raw disks, using the *direct disk* boot option. While this setup is functional, it's not compatible with several features of the Linode Manager that require the ability to mount your filesystem, such as:

*  **Disk Resizing:** Since the Linode Manager cannot determine the amount of *used* storage space on a raw disk, it can only increase the size. The Linode Manager cannot be used to make a raw disk smaller, and it cannot resize the filesystem on the disk - this would need to be done manually.

*  **Backups:** The Linode Backup Service needs to be able to mount your filesystem, and does not support partitioned disks.

*  **Helpers:** Several helpful features within the Linode Manager, such as [root password resets](/docs/platform/accounts-and-passwords#resetting-the-root-password) and [Network Helper](/docs/platform/network-helper), need access to your filesystem in order to make changes.

This section covers how to move your custom installation over to an **ext4** formatted disk so it can take advantage of these tools.

### Prepare your Linode

1.  [Create a new ext4 disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-blank-disk). The new disk should be large enough to accommodate the root filesystem that was created on your raw disk. You can make this as large as you'd like, but you should leave enough space for a separate swap partition. For our example, we'll name this disk *Boot-New*.

2.  From the **Create a new Disk** page, create a swap disk by choosing *swap* for the disk type. The size of this disk will depend upon your needs, but it's recommended that you make it between 256-512MB to start. We'll label this disk *Swap*.

3.  [Create a new configuration profile](/docs/platform/disk-images/disk-images-and-configuration-profiles/#configuration-profiles) with a name of your choice. For this example, we'll call the new profile *Installer-New* and it will use the following options:

    **Installer-New profile**

    - Label: Installer-New
    - Kernel: GRUB 2
    - /dev/sda: *Boot-New* disk image.
    - /dev/sdb: *Swap* disk image.
    - root / boot device: Standard /dev/sda

### Update your fstab

You should still be booted into your *Boot* profile using direct disk boot. Before you update your `/etc/fstab` file, make sure you know the current root partition of your custom distro. You can use the `lsblk` command to confirm which partition has `/` as its mount point:

    root@custom-kvm:~# lsblk
    NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
    fd0      2:0    1    4K  0 disk
    sda      8:0    0  7.8G  0 disk
    └─sda1   8:1    0  7.5G  0 part /
    sr0     11:0    1 1024M  0 rom

In this case, we can see that the `/dev/sda1` partition is the location of our root filesystem. Next, update your `/etc/fstab` file to match the following:

    # <file system> <mount point>   <type>  <options>       <dump>  <pass>
    proc        /proc        proc    defaults                       0 0
    /dev/sda   /            ext4    noatime,errors=remount-ro      0 1
    /dev/sdb   none         swap    sw

Depending upon your distribution, it may use different parameters for your root disk under the "options" section. These can be adjusted as needed. Note that we're using `/dev/sda` instead of the `sda1` root partition that was identified previously.

### Configure Grub

1.  Confirm the location of your `grub.cfg` file. Some distributions (notably, CentOS and Fedora) place this file under the `/boot/grub2` directory, while others have it under `/boot/grub`. Your new setup will use our *Grub 2* mode, which looks for a configuration file under `/boot/grub/grub.cfg`. You can confirm if your `grub.cfg` is located in the necessary spot with the `ls` command:

        ls -la /boot/grub/grub.cfg

    If your distro places its Grub configuration under this directory, you should receive output similar to the following:

        root@custom-kvm:~# ls -la /boot/grub/grub.cfg
        -r--r--r-- 1 root root 5235 Dec 28 08:05 /boot/grub/grub.cfg

2.  If the Grub config is located under `/boot/grub2` instead, create a symlink to provide the correct configuration to the bootloader:

        mkdir /boot/grub
        ln -s /boot/grub2/grub.cfg /boot/grub/grub.cfg

3.  Update your `grub.cfg` file, replacing all instances of `/dev/sda1` with `/dev/sda`. Note that this command will need to be adjusted if your root filesystem is located on a partition other than `/dev/sda1`:

        sed -i -e 's$/dev/sda1$/dev/sda$g' /boot/grub/grub.cfg

    Keep in mind that if your `grub.cfg` is located under `/boot/grub2`, you should adjust this command to reflect that.

### Transfer your Root Filesystem to your Ext4 Disk

Now that you've updated the necessary configuration files, you're ready to move your root filesystem to the ext4 disk you created previously. To get started, boot your Linode into [Rescue Mode](/docs/troubleshooting/rescue-and-rebuild) with the following disk assignments:

*  *Boot* disk mounted to `/dev/sda`
*  *Boot-New* disk mounted to `/dev/sdb`

In Rescue Mode, connect via Lish and transfer your root filesystem from the `/dev/sda1` partition to your new ext4 disk:

    dd if=/dev/sda1 of=/dev/sdb bs=1M

Once the transfer completes, reboot into your *Installer-New* profile. You now have a custom distribution that works with the Linode Manager's extra features. In order to make use of the Backup Service, you'll need to remove the raw disks that were used during the installation process.

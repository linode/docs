---
deprecated: true
author:
  name: Quintin Riis
  email: docs@linode.com
description: Full Disk Encryption.
keywords: full disk encryption debian wheezy security cryptsetup
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2014-06-19
modified_by:
  name: Linode
published: 2013-07-05
title: Full Disk Encryption
---

Full disk encryption protects the information stored on your Linode's disks by converting it into unreadable code that can only be deciphered by authorized individuals. Nearly everything on the disk is encrypted, including the swap space and temporary files. This guide will help you implement full disk encryption on a Linode running Debian 7 (Wheezy). You'll learn how to:

-   Format and encrypt your disks
-   Install a base Debian 7 (Wheezy) system with `debootstrap`
-   Configure services and networking
-   Boot from the encrypted images

## Potential Drawbacks

Full disk encryption does a great job of keeping your data secure, but there are a few caveats. To decrypt and mount the disk, you'll need to enter the encryption passphrase in the console every time your Linode boots. And some Linode Manager tools may not work as expected if your disks are encrypted. You'll need to manually resize your filesystem if you want to resize your disk. You'll also need to implement your own backup solution since the [Linode Backup Service](/docs/backup-service) can't mount encrypted disks.

## Getting Started

Ready to encrypt your Linode's disks? Here's how to prepare a Linode for full disk encryption:

1.  Create a new Linode in the data center of your choice.
2.  Make at least three unformatted / raw disks for your Linode. You'll probably want to use the rest of your disk quota for your main disk.

    - A `/boot` image, which will be unencrypted. In most cases, 128-256MB will be suitable for /boot.
    - A swap image. You'll need to choose an appropriate swap size based your particular needs.
    - A `root` image to store the files in the root of your filesystem.

3.  After you have created these disks, you'll want to [boot into Finnix from the Rescue tab](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode). Ensure that your disks are attached as follows:

    - /boot xvda
    - swap xvdb
    - / xvdc

You've successfully created the disks for your Linode.

## Creating a Configuration Profile

Next, you'll need to create a configuration profile for the new Linode. Here's how to do it:

1.  [Create a new configuration profile](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-configuration-profile) in the Linode Manager.
2.  Select the `pv-grub-x86_64` kernel from the **Kernel** menu.
3.  In the **Block Device Assignment** section, select the disks you created in the previous section of this guide.
4.  Disable the **Automount devtmpfs** and **Distro Helper** settings.
5.  Save the configuration profile.

Congratulations! You're now ready to set up full disk encryption on your Linode.

## Enabling Full Disk Encryption

Now you're ready to enable full disk encryption on your Linode running Debian 7 (Wheezy). Here's how to do it:

1.  [Reboot into Finnix](/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode) from the **Rescue** tab in the Linode Manager.
2.  [Connect to LISH](/docs/using-lish-the-linode-shell), which will allow you to access the Linode's virtual console.
3.  Enter the following command to create an encrypted volume. You'll be prompted for a passphrase. Make sure that you enter a very strong passphrase, and that you store the passphrase in a physically secure location. Or better yet, memorize the passphrase and don't store it anywhere! :

        cryptsetup luksFormat /dev/xvdc

	{{< caution >}}
If you lose this passphrase your data will be irretrievable!
{{< /caution >}}

	{{< note >}}
You may receive a FATAL notice about loading a kernel module used for hardware crypto acceleration. This message can be safely ignored.
{{< /note >}}

4.  Open this encrypted device for access by entering the following command. Enter your passphrase when prompted.

        cryptsetup luksOpen /dev/xvdc crypt-xvdc

5.  Create the file systems by entering the following commands, one by one. Use `ext2` for `/boot`, and `ext4` for `/`. :

        mke2fs /dev/xvda
        mke2fs -j /dev/mapper/crypt-xvdc

6.  Create and activate your swap partition by entering the following commands, one by one:

        cryptsetup -d /dev/urandom create crypt-swap /dev/xvdb
        mkswap /dev/mapper/crypt-swap
        swapon /dev/mapper/crypt-swap

	{{< note >}}
Swap will not persist through reboots, so a random key will be used to encrypt swap data.
{{< /note >}}

7.  Mount the encrypted volume to make it writable by entering the following commands, one by one:

        mkdir mnt
        mount /dev/mapper/crypt-xvdc mnt/

You have successfully enabled full disk encryption, created the file systems, and mounted the encrypted volume.

### Installing Debian and Mounting the Disks

Now it's time to install Debian 7 (Wheezy) and mount the disks. Here's how to do it:

1.  Use `debootstrap` to install a minimal Debian installation by entering the following command:

        debootstrap --arch=amd64  --include=openssh-server,vim,nano,cryptsetup wheezy mnt/

2.  Mount `/dev/xvda` and a few other things in preparation for changing root into the newly created Debian system, then changing root into the new install. Enter the following commands, one by one:

        mount /dev/xvda mnt/boot/
        mount -o bind /dev mnt/dev/
        mount -o bind /dev/pts/ mnt/dev/pts
        mount -t proc /proc/ mnt/proc/
        mount -t sysfs /sys/ mnt/sys/
        chroot mnt/ /bin/bash

You have successfully installed Debian and mounted the disks on your Linode.

### Configuring Debian

Now that you're "inside" the newly installed Debian system, you'll need to make the following changes to create a system that boots and works correctly. Please follow these steps with care. Any error will mean your system will not boot! Here's how to configure Debian:

1.  Edit `/etc/crypttab` to match the following:

        crypt-xvdc      /dev/xvdc               none            luks
        crypt-swap      /dev/xvdb               /dev/urandom    swap

2.  Edit `/etc/fstab` to match the following:

        /dev/xvda               /boot   ext2    defaults
        /dev/mapper/crypt-xvdc  /       ext4    noatime,errors=remount-ro
        /dev/mapper/crypt-swap  none    swap    sw
        proc                    /proc   proc    defaults

3.  Modify `/etc/mtab` by entering the following command:

        cat /proc/mounts > /etc/mtab

4.  Configure console access. Note that your console must be configured correctly to boot. Edit `/etc/inittab` and find the following line:

        0:2345:respawn:/sbin/getty 38400 tty1

5.  Change the line in `/etc/inittab` to match the following:

        0:2345:respawn:/sbin/getty 38400 hvc0

6.  Install a kernel and a bootloader, and then configure the bootloader to boot your kernel by entering the following commands, one by one:

        mkdir /boot/grub
        apt-get install grub-legacy
        apt-get install linux-image-amd64

7.  Locate the following line in `/boot/grub/menu.lst`:

        # kopt=root=/dev/mapper/crypt-xvdc ro

8.  Change the line in `/boot/grub/menu.lst` to match the following. This will allow update-grub to properly generate a new menu.lst when you update your kernel.

        # kopt=root=/dev/mapper/crypt-xvdc console=hvc0 ro

9.  Run `update-grub` and generate a new `initramfs` by entering the following commands, one by one:

        update-grub
        update-initramfs -u

You have successfully configured Debian for full disk encryption.

### Tidying Up

You're almost finished! Just a couple more steps and you'll have a Linode with encrypted disks:

1.  You'll need to make some changes to the structure in `/boot` due to the way pvgrub expects to see your boot disk. Enter the following commands, one by one:

        cd /boot
        mkdir boot/
        mv grub boot/
        ln -nfs boot/grub grub

2.  Set the password for the root user by entering the following command:

        passwd

3.  Configure networking by editing `/etc/network/interfaces` to match the following:

        auto lo eth0
        iface lo inet loopback
        iface eth0 inet dhcp

4.  Now exit `chroot`, unmount your disks, and reboot. You can do this by detaching the screen session and entering the "reboot" command in LISH:

        exit
        umount -l mnt/
        ^a^d
        reboot 1

If everything is configured properly your Linode will boot and prompt you for the encryption passphrase. Enter the passphrase on your console to mount your encrypted disk and boot your Linode. Now you'll want to follow the steps in our [Getting Started](/docs/getting-started) guide.

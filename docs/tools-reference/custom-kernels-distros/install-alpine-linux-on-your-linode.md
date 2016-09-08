---
author:
  name: Andrew Leap
  email: andyleap@gmail.com
description: 'Alpine Linux is a small, security-oriented Linux distro. This guide explains how to install and configure Alpine Linux on a Linode'
keywords: 'alpine,alpine linux,custom,custom distro,install alpine linux,alpine linux packages'
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
modified: Thursday, March 31st, 2016
modified_by:
  name: Andrew Leap
published: 'Thursday, March 31st, 2016'
title: 'Install Alpine Linux on your Linode'
contributor:
  name: Andrew Leap
  link: http://github.com/andyleap
external_resources:
- '[Alpine Linux](http://www.alpinelinux.org/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[Alpine Linux](http://www.alpinelinux.org/) is a small, security oriented Linux distro.
It is regularly updated with security patches, and runs on the [grsecurity](https://grsecurity.net/) kernel.  All binaries are staticly linked and built against [musl libc](http://www.musl-libc.org/intro.html).


## Before You Begin

1.  Familiarize yourself with [Lish](https://www.linode.com/docs/networking/using-the-linode-shell-lish), as most of this guide will use Lish.

2.  Understand that installing Alpine in this manner will destroy all existing data on the disk images you install it on.  Back up all your data first.

3.  The initial portion of this guide will involve creating the disk images, so you may need to delete existing disk images to have enough free space.

4.  This guide assumes a consistent present working directory.  In most cases, it will be /alpine or a chroot of said directory.

## Setting up the Linode

### Drives

1.  Log in to the (Linode Manager)[https://manager.linode.com/linodes/] and select the Linode you will be installing Alpine Linux on.

2.  Create your boot disk image, this should be 128~256 MB, and the type should be ext4
{: .note}
>
> Boot drives will need to store your kernel and your initramfs.  Currently, Alpine will need about 21 MB for each kernel/initramfs combo, so even 128 MB will be enough for several kernel versions, just remember to keep an eye on `/boot` when you perform upgrades of the kernel.

3.  Create your root disk image, with as much space as you need, though if you want a swap disk image, make sure you leave room for it.  This disk image should be ext4 as well.

4.  (Optionally) Create your swap disk image with type swap. 
{: .note}
>
> 256~512 MB of swap is a good rough estimate.  You don't need as much swap as many guides might recommend.  A clean install of Alpine will wind up using less then 50 MB of ram when fully booted.

### Configuration

1. Create a new configuration profile for your Linode.  Choose Grub 2 in the kernel menu, which will use grub 2 to boot Alpine's kernel from your disk image, with all the helpers turned off, and your boot disk image as /dev/sda, your root disk image as /dev/sdb, and your swap as /dev/sdc.
[![Linode Config](/docs/assets/install-alpine-linux-config_small.png)](/docs/assets/install-alpine-linux-config.png)

## Initial Install of Alpine

### Boot into Recovery

1.  From the Linode Manager, reboot your linode into recovery mode, with your boot disk image as /dev/sda, your root disk image as /dev/sdb, and your swap as /dev/sdc.

2.  Using Lish, connect to the linode.  (If you are not familiar with Lish, there is a simple web interface for it located under Remote Access)

### Mount Drives

1.  Create a mount point for the root disk image
        mkdir /alpine

2.  Mount and enter the root partition
        mount /dev/sdb /alpine
        cd /alpine

3.  Create and mount the boot directory
        mkdir boot
        mount /dev/sda /alpine/boot

### Download initial APK tools

1.  Pick your desired release.  In most cases, you can use the latest-stable release, located at (http://nl.alpinelinux.org/alpine/latest-stable/)[http://nl.alpinelinux.org/alpine/latest-stable/]

2.  Identify the current version of the `apk-tools-static` package.  You will need to navigate into the `main/x86_64` directory of your chosen release.  For example, the latest stable would be (http://nl.alpinelinux.org/alpine/latest-stable/main/x86_64/)[http://nl.alpinelinux.org/alpine/latest-stable/main/x86_64/].  From there, simply search for `apk-tools-static`.  Once you have found it, you will need to copy the file's location.  (Right click, Copy Link Address)

3.  Download and extract the `apk-tools-static` package.  You should still be in `/alpine`
        curl -s `apk-tools-static.apk` | tar xz

4.  Perform initial distro install.  This will preform the install using the latest stable build of Alpine.
        ./sbin/apk.static --repository http://nl.alpinelinux.org/alpine/latest-stable/main/ --update-cache --allow-untrusted --root /alpine --initdb add alpine-base alpine-mirrors

### Initial setup

1.  Configure your fstab.  Note, you need a single hard tab between each column.
{: .file }
/alpine/etc/fstab
:   ~~~ conf
    /dev/sdb    /   ext4    defaults,noatime    0   0
    /dev/sda    /boot   ext4    defaults,noatime    0  1
    /dev/sdc    swap    swap    defaults    0   0
    ~~~

2.  Configure the inittab
{: .file }
/alpine/etc/inittab
:   ~~~ conf
    # /etc/inittab
    
    ::sysinit:/sbin/rc sysinit
    ::sysinit:/sbin/rc boot
    ::wait:/sbin/rc default
    
    # Put a getty on the serial port
    ttyS0::respawn:/sbin/getty -L ttyS0 115200 vt100
    
    # Stuff to do for the 3-finger salute
    ::ctrlaltdel:/sbin/reboot
    
    # Stuff to do before rebooting
    ::shutdown:/sbin/rc shutdown
    ~~~

3.  Create the Grub 2 boot config
        mkdir /alpine/boot/grub
{: .file }
/alpine/boot/grub/grub.cfg
:   ~~~ conf
    set root=(hd0)
    set default="Alpine Linux"
    set timeout=0
    
    menuentry "Alpine Linux" {
              linux /vmlinuz-grsec root=/dev/sdb modules=sd-mod,usb-storage,ext4 console=ttyS0 quiet
              initrd /initramfs-grsec
    }
    ~~~
    
4.  Configure mkinitfs
        mkdir /alpine/etc/mkinitfs
{: .file }
/alpine/etc/mkinitfs/mkinitfs.conf
:   ~~~ conf
    features="ata ide scsi virtio base ext4"
    ~~~

5.  Copy resolv.conf in
        cp /etc/resolv.conf /alpine/etc
        
6.  Add `ttyS0` to securetty to allow root login over Lish
        echo ttyS0 >> /alpine/etc/securetty

### Installing the kernel and creating the initramfs

1.  Bind proc and dev into the chroot
        mount --bind /proc /alpine/proc
        mount --bind /dev /alpine/dev

2.  Enter the chroot
        chroot /alpine /bin/sh

3.  Select a mirror.  You can use the `f` option to automatically pick the fastest mirror.
        setup-apkrepos

4.  Update packages
        apk update

5.  Set your hostname.
        setup-hostname -n `hostname`
{: .note}
>
> A good hostname should make it easy for you to identify which server you are on when you are connected to it.

6.  Configure important services to start automatically.
        rc-update add networking boot
        rc-update add urandom boot
        rc-update add cron

7.  Install the kernel
        apk add linux-grsec

8.  Exit and shutdown
        exit
        shutdown -h now
        
## Final Configuration

### Reboot into alpine

1.  Reboot into the Alpine Linux configuration you made earlier.  If it's the only one, this can be accomplished from Lish via `boot 1`

2.  Log in as root.  By default there is no password for root.

### Configuration

1.  Set a password for root
        passwd

2.  Create a user
        adduser `username`

3.  Install sudo
        apk add sudo

4.  Configure sudo to allow users in the group sudo to use sudo.  
        echo "%sudo   ALL=(ALL) ALL" >> /etc/sudoers
    Alternatively, you can allow passwordless sudo
        echo "%sudo   ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

5.  Create the sudo group and add your user to it.
        addgroup sudo
        adduser `username` sudo
        
6.  Install and configure sshd.  Alpine has a simple setup script to handle this.  I recommend the `openssh` server if you want sftp access, though `dropbear` is lighter if you just need ssh access
        setup-sshd

## Finished

### Next Steps

At this point, you should be able to ssh into your server.  Alpine is very lightweight, and doesn't install very much unless you ask it to.
For instance, you won't have a text editor to start off, and the only service running is your sshd.

Alpine has a decent browser for their package listings at (https://pkgs.alpinelinux.org/packages)[https://pkgs.alpinelinux.org/packages].
A few of the things to consider installing:
1.  Text editor: `nano` or `vim`
2.  Web server: `lighttpd`, `apache2`, or `nginx`
3.  Scripting languages: `php`, `perl`, or `python`
4.  Database servers: `mysql` or `postgresql`

Note that some of these combinations may require additional packages to interoperate.  Any of them can be installed via `apk add`, i.e. `apk add apache2 php mysql`.
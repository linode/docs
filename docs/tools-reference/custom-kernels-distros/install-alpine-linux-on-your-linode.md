---
author:
  name: Andrew Leap
  email: andyleap@gmail.com
description: 'Alpine Linux is a small, security-oriented Linux distro. This guide explains how to install and configure Alpine Linux on a Linode'
keywords: 'alpine,alpine linux,custom,custom distro,install alpine linux,alpine linux packages'
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
modified: Monday, September 12th, 2016
modified_by:
  name: Andrew Leap
published: 'Monday, September 12th, 2016'
title: 'Install Alpine Linux on your Linode'
contributor:
  name: Andrew Leap
  link: http://github.com/andyleap
external_resources:
- '[Alpine Linux](http://www.alpinelinux.org/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[Alpine Linux](http://www.alpinelinux.org/) is a small, security-oriented Linux distro.
It is regularly updated with security patches, and runs on the [grsecurity](https://grsecurity.net/) kernel. All binaries are statically linked and built against [musl libc](http://www.musl-libc.org/intro.html).

## Before You Begin

1.  Familiarize yourself with [Lish](https://www.linode.com/docs/networking/using-the-linode-shell-lish), as most of this guide will require an out-of-band connection.

2.  Back up *all* data on the images on which you intend to install Alpine. Installing Alpine in this manner will destroy all existing data on the disk images you install it on.

3.  The initial portion of this guide will involve creating the disk images, so you may need to delete existing disk images to have enough free space.

4.  This guide assumes a consistent present working directory, meaning all commands should be run from the same directory. In most cases, it will be `/alpine` or a chroot of said directory.

## Setting up the Linode

### Drives

1.  Log in to the [Linode Manager](https://manager.linode.com/linodes/) and select the Linode you will be installing Alpine Linux on.

2.  Create your boot disk image. This should be ~128-256 MB, and the type should be ext4.

    {: .note}
    >
    > Boot drives will need to store your kernel and your initramfs. Currently, Alpine will need about 21 MB for each kernel/initramfs combo, so even 128 MB is enough for several kernel versions, just remember to keep an eye on `/boot` when you perform upgrades of the kernel.

3.  Create your root disk image, with as much space as you need, though if you want a swap disk image, make sure you leave room for it. This disk image should be ext4 as well.

4.  Optionally, create a swap disk image with type **swap**. 

    {: .note}
    >
    > ~256-512 MB of swap is a good rough estimate. You don't need as much swap as many guides might recommend. A clean install of Alpine will use less than 50 MB of RAM when fully booted.

### Configuration

Create a new configuration profile for your Linode. Choose **GRUB 2** from the kernel menu, which will use GRUB 2 to boot Alpine's kernel from your disk image, with all the helpers turned off. Set your boot disk image as `/dev/sda`, your root disk image as `/dev/sdb`, and your swap disk image, if you created one, as `/dev/sdc`.

You should also turn off all the **Filesystem/Boot Helpers** for now. 

[![Linode Config](/docs/assets/install-alpine-linux-config_small.png)](/docs/assets/install-alpine-linux-config.png)

## Initial Install of Alpine

### Boot into Recovery

1.  From the Linode Manager, reboot your Linode into [rescue mode](https://www.linode.com/docs/troubleshooting/rescue-and-rebuild), with your boot disk image as `/dev/sda`, your root disk image as `/dev/sdb`, and your swap as /`dev/sdc`.

2.  Using Lish, connect to the Linode. If you are not familiar with Lish, there is a simple web interface for it located under the **Remote Access** in the Linode Manager.

### Mount Drives

1.  Create a mount point for the root disk image:
        
        mkdir /alpine

2.  Mount the root partition to the new `/alpine` directory and navigate to it:
        
        mount /dev/sdb /alpine
        cd /alpine

3.  Create a `boot` directory and mount the boot disk image to it:
        
        mkdir boot
        mount /dev/sda /alpine/boot

### Download Initial APK tools

1.  Select your desired Alpine Linux release. In most cases, you can use the [latest stable release](http://nl.alpinelinux.org/alpine/latest-stable/)

2.  Identify the current version of the `apk-tools-static` package. You will need to navigate into the `main/x86_64` directory of your chosen release. 

    For example, the latest stable version's `apk-tools-static` package can be found by visiting `http://nl.alpinelinux.org/alpine/latest-stable/main/x86_64/`. From there, simply search for `apk-tools-static`. Once you have found it, you will need to copy the file's location. To do this in most browsers, right click the filename and select **Copy Link Address**.

3.  Update the CA Certificates.  Finnix doesn't have them by default, and so `curl` will fail to download the `apk-tools-static` package if you are using https, as it won't be able to verify the ssl certificate.

    update-ca-certificates

4.  Download and extract the `apk-tools-static` package to your Linode. You should still be working in the `/alpine` directory when performing this step. Replace `address` in the following command with the address you copied in Step 2:
        
        curl -s address | tar xz

    If this fails with an error, ensure the guide 

5.  Perform the initial distro installation. This will use the latest stable build of Alpine.

        ./sbin/apk.static --repository http://nl.alpinelinux.org/alpine/latest-stable/main/ --update-cache --allow-untrusted --root /alpine --initdb add alpine-base alpine-mirrors

### Initial Setup

In this section, we will modify important system files. It is recommended that you make backup copies of these files before making changes.

1.  Configure your fstab. Note, you need a single hard tab between each column.

    {: .file }
    /alpine/etc/fstab
    :   ~~~ conf
        /dev/sdb    /       ext4    defaults,noatime    0   0
        /dev/sda    /boot   ext4    defaults,noatime    0  1
        /dev/sdc    swap    swap    defaults    0   0
        ~~~

2.  Configure the inittab:

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

3.  Create the GRUB 2 boot configuration directory:
        
        mkdir /alpine/boot/grub

    Create a new file, `grub.cfg` within this directory, and add the following contents:

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
    
4.  Create a `mkinitfs` directory:

        mkdir /alpine/etc/mkinitfs

    Create a new file, `mkinitfs.conf`, within this directory and add the following contents:

    {: .file }
    /alpine/etc/mkinitfs/mkinitfs.conf
    :   ~~~ conf
        features="ata ide scsi virtio base ext4"
        ~~~

5.  Copy the system's `resolv.conf` file into `/alpine/etc`:

        cp /etc/resolv.conf /alpine/etc
        
6.  Add `ttyS0` to securetty to allow root login over Lish
        
        echo ttyS0 >> /alpine/etc/securetty

### Install the Kernel and Create the initramfs

1.  Bind the `/proc` and `/dev` directories into the `/alpine` chroot:

        mount --bind /proc /alpine/proc
        mount --bind /dev /alpine/dev

2.  Enter the chroot:

        chroot /alpine /bin/sh

3.  Select a mirror to use when downloading or updating packages:
        
        setup-apkrepos

    You can select a mirror by entering its corresponding number, or enter `f` to automatically pick the fastest mirror.

4.  Update packages

        apk update

5.  Set your hostname, replacing `example` with a hostname of your choice:

        setup-hostname -n example

6.  Configure important services to start automatically. The following is a good starting point, but you can also add other services of your choosing:

        rc-update add networking boot
        rc-update add urandom boot
<<<<<<< HEAD
        
7.  Install the kernel:
=======
        rc-update add crond
>>>>>>> 61eb432052bc29a8d861a7c95e64795af157b679

        apk add linux-grsec

8.  Exit and shutdown

        exit
        shutdown -h now
        
## Final Configuration

### Reboot into Alpine

1.  Reboot into the Alpine Linux configuration you made earlier by selecting the button next to the profile in the Linode Manager and clicking **Boot**.  If this is the only configuration profile, this can also be accomplished from Lish using the `boot 1` command.

2.  Log in as `root`. You will not be prompted for a password since it has not been configured yet.

### Configuration

1.  Setup and start networking. Alpine has a handy script that'll configure the network interface file for you, and guide you through the various options. It's capable of advanced configs, like bridging, bonding and such, but for this, it's defaults should be good enough. Just press enter 3 times to accept the defaults of `eth0`, `dhcp`, and `no`, and then restart the networking service, and your Alpine install should have a functional network connection.

        setup-interfaces
        service networking restart

2.  Set a password for root:

        passwd

3.  Create a limited user account to avoid using root for all commands. Replace `example-user` with a username of your choice:

        adduser example-user

4.  Install `sudo`:

        apk add sudo

4.  Configure `sudo` to allow users in the sudo group to temporarily elevate their privileges:

=======
2.  Setup and start networking.  Alpine has a handy script that'll configure the network interface file for you, and guide you through the various options.  It's capable of advanced configs, like bridging, bonding and such, but for this, it's defaults should be good enough.  Just press enter 3 times to accept the defaults of `eth0`, `dhcp`, and `no`, and then restart the networking service, and your Alpine install should have a functional network connection.
        setup-interfaces
        service networking restart

3.  Create a user
        adduser `username`

4.  Install sudo
        apk add sudo

5.  Configure sudo to allow users in the group sudo to use sudo.  
>>>>>>> 61eb432052bc29a8d861a7c95e64795af157b679
        echo "%sudo   ALL=(ALL) ALL" >> /etc/sudoers

    Alternatively, you can allow passwordless sudo:

        echo "%sudo   ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

5.  Create the sudo group and add your user to it:

        addgroup sudo
        adduser `username` sudo
        
6.  Install and configure the SSH daemon (sshd). Alpine has a simple setup script to handle this. :
        
        setup-sshd

    We recommend the `openssh` server if you want SFTP access, although `dropbear` is lighter if you only need SSH access

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

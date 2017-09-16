---
 author:
 name: Linode Community
 email: docs@linode.com
description: 'OpenVZ is a software based OS virtualization tool enabling the deployment, management, and modification of isolated virtual Linux environments from within a host Linux distribution. An extensive array of pre-built OS templates in a variety of Linux distributions allow users to rapidly download and deploy virtual environments with ease.'
keywords: 'openvz, virtualization'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published:
modified:
modified_by:
  name: Linode
title: 'Install OpenVZ On Debian 9'
contributor:
   name: Andrew Lescher
   link: [Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)
external_resources:
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

Upon completing this guide, you will have installed OpenVZ on your Linode and learned how to download and deploy a virtual environment.

## Before You Begin

1. Working through this tutorial requires the use of a root user account, and is written as if commands are issued from the root user. Readers choosing to use a limited user account will need to prefix commands with `sudo` where required. If you have yet to create a limited user account, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

2. The instructions in this guide were written for and tested on Debian 9 only. They are unlikely to work for other Debian or Ubuntu distributions.

3. Certain essential modifications to your Debian 9 system are required to run OpenVZ. They include the removal and replacement of Systemd with SystemV, and the use of a custom Linux kernel. Before continuing, be certain any previously added software will be compatible with these changes.

4. Although not required, it is recommended to create a separate Ext4 filesystem partition for OpenVZ templates. By default, both the Debian 9 installer and the Linode Manager format newly created partitions with Ext4. For information on how to accomplish this configuration, follow the steps appropriate for your environment in the [Disks and Configuration Profiles](/docs/platform/disk-images/disk-images-and-configuration-profiles) guide.

# Install And Configure OpenVZ

## Remove The metadata_csum Feature From Ext4 Volumes

Before OpenVZ can be installed, the system must be configured for compatability. The Debian 9 distribution supports a new checksum feature which is incompatible with the custom OpenVZ kernel. Depending on your preference, you may choose to either remove metadata_csum from a mounted partition or reformat the affected partition to a compatible Ext4 volume. Choose either method and follow the instructions in the appropriate section below.

1. List available disk partitions.

        lsblk

2. Check if "metadata_csum" is installed in any mounted disk partitions shown in step 1 (not including the SWAP partition). Follow the below format for each partition, replacing "/dev/sda1" with the appropriate volume name. If the below command yields no output for mounted disk volumes, you may skip this section.

        dumpe2fs -h /dev/sda1 2>/dev/null | grep -e metadata_csum

### Remove "metadata_csum" From Mounted Partitions

1. Issue below commands to add code to the `fsck` file.

        echo copy_exec /sbin/e2fsck | sudo tee -a /usr/share/initramfs-tools/hooks/fsck
        echo copy_exec /sbin/tune2fs | sudo tee -a /usr/share/initramfs-tools/hooks/fsck

2. Create a new file and name it *tune*. Copy and paste the below text into this new file and save.

{: .file}
**/etc/initramfs-tools/scripts/local-premount/tune**
~~~ sh
#!/bin/sh

if [ "$readonly" != "y" ] ;
  then exit 0 ;
fi

e2fsck -f $Volume
tune2fs -O -metadata_csum $Volume
e2fsck -f $Volume
~~~

3. Update file properties and existing initramfs image to load the *tune* script.

        chmod 755 /etc/initramfs-tools/scripts/local-premount/tune
        update-initramfs -u -k all

4. Reboot your system with `shutdown -r now` and run the command below to verify that metadata_csum was disabled from all affected partitions. Again, replace "/dev/sda1" with the correct volume names.

        dumpe2fs -h /dev/sda1 2>/dev/null | grep -e metadata_csum

### Format a Compatible Ext4 Volume

1. Choose the Ext4 volume you would like to format and issue the command below, replacing `/dev/sda3` with your selected volume. An output of "0" indicates success.

{: .caution}
> Formatting a volume with the `mkfs` command may result in data loss.

        mkfs -t ext4 -O -metadata_csum /dev/sda3

## Replace Systemd with SystemV

1. Install SystemV utilities.

        apt install sysvinit-core sysvinit-utils

2. Reboot machine to release Systemd.

        shutdown -r now

3. Remove Systemd from your machine.

        apt --auto-remove remove systemd

4. Create file *avoid-systemd* and paste in contents below.

{: .file}
**/etc/apt/preferences.d/avoid-systemd**
~~~
Package: *systemd*
Pin: release *
Pin-Priority: -1
~~~

## Add OpenVZ Repository

1. Create a new repository source file and paste in the contents below.

{: .file}
**/etc/apt/sources.list.d/openvz.list**
~~~ list
deb http://download.openvz.org/debian jessie main
deb http://download.openvz.org/debian wheezy main
~~~

2. Add the repository key to your system.

        wget -qO - http://ftp.openvz.org/debian/archive.key | sudo apt-key add -

3. As of the publication date of this guide, the openvz repository key is invalid, and issuing the `apt update` command will generate a warning from the system. The command should nevertheless succeed. If it does not, update the system with the following argument.

        apt --allow-unauthenticated update

## Install OpenVZ Packages

1. Install OpenVZ with required packages.

        apt --allow-unauthenticated --install-recommends install linux-image-openvz-$(dpkg --print-architecture) vzdump ploop initramfs-tools dirmngr

2. The installation should create a new directory, `/vz`. If this directory does not exist after installation, create a symbolic link using the command below.

        ln -s /var/lib/vz/ /vz

3. Create file `vznet.conf` and add paste in the line below.

{: .file}
**/etc/vz/vznet.conf**
~~~ conf
EXTERNAL_SCRIPT="/usr/sbin/vznetaddbr"
~~~

4. This step is optional, and will cause OpenVZ virtual instances to stop when the OpenVZ service is stopped. If this behavior is desired, issue the command below.

        echo 'VE_STOP_MODE=stop' | sudo tee -a /etc/vz/vznet.conf

## Boot Into The OpenVZ Kernel

The system must be configured to boot the OpenVZ kernel each time the server is restarted.

1. Open the **grub.cfg** file in `less`, or your preferred text editor.

        less /boot/grub/grub.cfg

2. Within the **grub.cfg** file, look for a section resembling the following.

{: .file}
**/boot/grub/grub.cfg**
~~~ cfg
. . .

menuentry 'Debian GNU/Linux' --class debian --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-simple-e025e52b-91c4-4f64-962d-79f244caa92a' {
        gfxmode $linux_gfx_mode
        insmod gzio
        if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi
        insmod ext2
        set root='hd0'
        if [ x$feature_platform_search_hint = xy ]; then
          search --no-floppy --fs-uuid --set=root --hint-bios=hd0 --hint-efi=hd0 --hint-baremetal=ahci0  e025e52b-91c4-4f64-962d-79f244caa92a
        else
          search --no-floppy --fs-uuid --set=root e025e52b-91c4-4f64-962d-79f244caa92a
        fi
        echo    'Loading Linux 4.9.0-3-amd64 ...'
        linux   /boot/vmlinuz-4.9.0-3-amd64 root=/dev/sda ro console=ttyS0,19200n8 net.ifnames=0
        echo    'Loading initial ramdisk ...'
        initrd  /boot/initrd.img-4.9.0-3-amd64
}
submenu 'Advanced options for Debian GNU/Linux' $menuentry_id_option 'gnulinux-advanced-e025e52b-91c4-4f64-962d-79f244caa92a'

. . .
~~~

Write down the text in single quotes which appears directly after "submenu", which should be present after the first "menuentry" section. In this case, the text to copy would be **Advanced options for Debian GNU/Linux**.

3. Within the **grub.cfg** file underneath the "submenu" line, you will see multiple indented "menuentry" sections. These represent the available kernels. From these, you need to locate the newly installed OpenVZ kernel menu entry. It should look similar to the content below. Note that some will be recovery kernels and should be ignored.

{: .file}
**/boot/grub/grub.cfg**
~~~ cfg
. . .

        menuentry 'Debian GNU/Linux, with Linux 2.6.32-openvz-042stab123.9-amd64' --class debian --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-2.6.32-openvz-042stab123.9-amd64-advanced-e025e52b-91c4-4f64-962d-79f244caa92a' {
                gfxmode $linux_gfx_mode
                insmod gzio
                if [ x$grub_platform = xxen ]; then insmod xzio; insmod lzopio; fi
                insmod ext2
                set root='hd0'
                if [ x$feature_platform_search_hint = xy ]; then
                  search --no-floppy --fs-uuid --set=root --hint-bios=hd0 --hint-efi=hd0 --hint-baremetal=ahci0  e025e52b-91c4-4f64-962d-79f244caa92a
                else
                  search --no-floppy --fs-uuid --set=root e025e52b-91c4-4f64-962d-79f244caa92a
                fi
                echo    'Loading Linux 2.6.32-openvz-042stab123.9-amd64 ...'
                linux   /boot/vmlinuz-2.6.32-openvz-042stab123.9-amd64 root=/dev/sda ro console=ttyS0,19200n8 net.ifnames=0
                echo    'Loading initial ramdisk ...'
                initrd  /boot/initrd.img-2.6.32-openvz-042stab123.9-amd64
        }

. . .
~~~

Again, write down the text directly after "menuentry" in the single quotations. Here, the text to copy is **Debian GNU/Linux, with Linux 2.6.32-openvz-042stab123.9-amd64**.

4. Close the **grub.cfg** file and open **/etc/default/grub** in your preferred text editor. Locate the line that begins with `GRUB_DEFAULT=`. Delete the default value for this parameter and enter the text you copied in the previous steps, following the format below. With the example above, the value would be the following.

        GRUB_DEFAULT="Advanced options for Debian GNU/Linux>Debian GNU/Linux, with Linux 2.6.32-openvz-042stab123.9-amd64"

Note that both copied strings are separated with the carrot ">" character.

5. Save and close the **grub** file, and issue the below command to reload the grub bootloader with the new kernel value.

        update-grub

6. By default, kernel loading is not handled by Grub, but by the Linode Manager. Login to your Linode Manager and select your Linode. Click on your configuration profile. Under the "Boot Settings" section, select "GRUB 2" from the Kernel dropdown-list (see image below). Save your changes and exit.

![Linode Manager - Select Kernel](docs/assets/openvz_one.PNG)

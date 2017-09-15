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

1. Working through this tutorial requires the use of a limited user or root user account, and is written as if commands are issued from the root user. Readers choosing to use a limited user account will need to prefix commands with `sudo` where required. If you have yet to create a limited user account, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

2. The instructions in this guide were written for and tested on Debian 9 only. They are unlikely to work for other Debian or Ubuntu distributions.

3. Certain essential modifications to your Debian 9 system are required to run OpenVZ. They include the removal and replacement of Systemd with SystemV, and the use of a custom Linux kernel. Before continuing, be certain any previously added software will be compatible with these changes.

4. Although not required, it is recommended to create a separate Ext4 filesystem partition for OpenVZ templates. By default, both the Debian 9 installer and the Linode Manager format newly created partitions with Ext4. For information on how to accomplish this configuration, follow the steps appropriate for your environment in the [Disks and Configuration Profiles](/docs/platform/disk-images/disk-images-and-configuration-profiles) guide.

# Install And Configure OpenVZ

## Remove The metadata_csum Feature From Ext4 Volumes

Before OpenVZ can be installed, the system must be configured for compatability. The Debian 9 distribution supports a new checksum feature which is incompatible with the custom OpenVZ kernel. Depending on your preference, you may choose to either remove "metadata_csum" from a mounted partition or reformat the affected partition to a compatible Ext4 volume. Choose either method and follow the instructions in the appropriate section below.

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

if [ "$readonly" != "y" ] ;•
  then exit 0 ;•
fi

e2fsck -f $Volume
tune2fs -O -metadata_csum $Volume
e2fsck -f $Volume
~~~

3. Update file properties and existing initramfs image to load the *tune* script.

        chmod 755 /etc/initramfs-tools/scripts/local-premount/tune
        update-initramfs -u -k all

4. Reboot your system with `shutdown -r now` and run the command below to verify that metadata_csum was disabled from all affected partitions.

        dumpe2fs -h /dev/sda1 2>/dev/null | grep -e metadata_csum

### Format a Compatible Ext4 Volume

1. Choose the Ext4 volume you would like to format and issue the command below, replacing `/dev/sda3` with your selected volume. An output of "0" indicates success.

{: .caution}
> Formatting a volume will erase all data contained in the partition.

        mkfs -t ext4 -O -metadata_csum /dev/sda3



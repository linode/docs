---
author:
  name: Linode Community
  email: docs@Linode.com
description: 'This guide will show you how to install OpenVZ on your Linode and deploy a virtual environment.'
og_description: 'OpenVZ, a software-based OS virtualization tool that enables deployment, management, and modification of isolated, virtual Linux environments from within a host Linux distribution, can be installed and run on a Linode, using this guide.'
keywords: ["openvz", " virtualization", " docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-09-22
modified: 2017-09-25
modified_by:
  name: Linode
title: 'How to Install OpenVZ On Debian 9'
contributor:
   name: Andrew Lescher
   link: https://www.linkedin.com/in/andrew-lescher-87027940
external_resources:
  - '[Basic OpenVZ Operations](https://openvz.org/Basic_operations_in_OpenVZ_environment)'
  - '[OpenVZ User Contributed Templates](https://openvz.org/Download/template/precreated)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## What is OpenVZ?

OpenVZ is a software-based OS virtualization tool enabling the deployment, management, and modification of isolated virtual Linux environments from within a host Linux distribution. An extensive array of prebuilt OS templates in a variety of Linux distributions allow users to rapidly download and deploy virtual environments with ease.

### Before You Begin

1. Working through this tutorial requires a root user account, and is written as if commands are issued as the root user. Readers choosing to use a limited user account will need to prefix commands with `sudo` where required. If you have yet to create a limited user account, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

2. The instructions in this guide were written for and tested on Debian 9 only. They are unlikely to work for other Debian or Ubuntu distributions.

3. Certain essential modifications to your Debian 9 system are required to run OpenVZ, including the removal and replacement of Systemd with SystemV, and the use of a custom Linux kernel. Before continuing, be certain that all software currently installed on the machine will be compatible with these changes.

    {{< note >}}
Although not required, it is recommended to create a separate Ext4 filesystem partition for OpenVZ templates. By default, both the Debian 9 installer and the Linode Manager format newly created partitions with Ext4. For information on how to accomplish this configuration, follow the steps appropriate for your environment in the [Disks and Configuration Profiles](/docs/platform/disk-images/disk-images-and-configuration-profiles) guide.
{{< /note >}}

### Create A Separate Partition For OpenVZ Templates


{{< caution >}}
This step is optional.
{{< /caution >}}

If you intend to dedicate an entire Linode VPS to running OpenVZ and no other services, it's recommended to create separate partitions for the host server and its processes, and any OpenVZ virtual server templates. The following table illustrates the recommended partitioning scheme:

|:----------:|:-----------:|:-----------:|
| Partition | Description | Typical Size |
| /         | Root partition | 4-12 GB   |
| swap      | Paging partition | 2 times RAM or RAM + 2GB (depending on available hard drive space) |
| /vz       | Partition to host OpenVZ templates | All remaining hard drive space |

1. Log into your Linode Manager and select your Linode. Power down the machine, and verify the job completed by viewing the *Host Job Queue* section. Under the *Disks* tab, click *Create a new Disk*. Add a label of your choosing, select "ext4" in the *Type* drop-down menu, and allocate as much space as you can in the *Size* field. Click *Save Changes*; an optimal configuration will resemble the image below.

     ![Linode Manager - Partition Scheme](/docs/assets/openvz/openvz_two.PNG)

2. Under the *Dashboard* tab, click your main Configuration Profile. Under the *Block Device Assignment* tab, assign your new partition to an open device. Click *Save Changes* when finished.

    ![Linode Manager - Block Device Assignment](/docs/assets/openvz/openvz_three.PNG)

3. Boot the Linode and log in via SSH. Issue the command below to verify that the new disk has been created properly. The output will display your newly created disk.

       fdisk -l

4. Create a mount point for the new device:

        mkdir /vztemp

5. Mount the new disk. Be sure to replace **/dev/sdc** with your device name:

        mount /dev/sdc /vztemp

### Remove the Metadata_csum Feature From Ext4 Volumes

Before OpenVZ can be installed, the system must be configured for compatibility. Debian 9 supports a new checksum feature that is incompatible with custom OpenVZ kernels. Depending on your preference, you may choose to either remove metadata_csum from a mounted partition or reformat the affected partition to a compatible Ext4 volume. Choose either method and follow the instructions in the appropriate section below.

1. List available disk partitions.

        lsblk

2. Check if "metadata_csum" is installed in any mounted disk partitions shown in Step 1 (not including the SWAP partition). Follow the format below for each partition, replacing `/dev/sda1` with the appropriate volume name. If the below command yields no output for mounted disk volumes, you may skip this section.

        dumpe2fs -h /dev/sda1 2>/dev/null | grep -e metadata_csum

### Remove Metadata_csum From Mounted Partitions

1. Issue the commands below to add code to the `fsck` file:

        echo "copy_exec /sbin/e2fsck" | sudo tee -a /usr/share/initramfs-tools/hooks/fsck
        echo "copy_exec /sbin/tune2fs" | sudo tee -a /usr/share/initramfs-tools/hooks/fsck

2. Create a new file in the directory designated below and name it *tune*. Copy and paste the text below into this new file and save:

    {{< file "/etc/initramfs-tools/scripts/local-premount/tune" sh >}}
#!/bin/sh

if [ "$readonly" != "y" ] ;
then exit 0 ;
fi

e2fsck -f $Volume
tune2fs -O -metadata_csum $Volume
e2fsck -f $Volume

{{< /file >}}


3. Update file properties and existing initramfs image to load the *tune* script:

        chmod 755 /etc/initramfs-tools/scripts/local-premount/tune
        update-initramfs -u -k all

4. Reboot your system and run the command below to verify that metadata_csum was disabled from all affected partitions. Again, replace "/dev/sda1" with the correct volume names.

        dumpe2fs -h /dev/sda1 2>/dev/null | grep -e metadata_csum

### Format a Compatible Ext4 Volume

1. Choose the Ext4 volume you would like to format and issue the command below, replacing `/dev/sda3` with your selected volume. An output of "0" indicates success.

    {{< caution >}}
Formatting a volume with the `mkfs` command may result in data loss.
{{< /caution >}}

        mkfs -t ext4 -O -metadata_csum /dev/sda3

## Replace Systemd with SystemV

1. Install SystemV utilities.

        apt install sysvinit-core sysvinit-utils

2. From the Linode Manager, reboot your machine to release Systemd.

3. Remove Systemd from your machine:

        apt --auto-remove remove systemd

4. Create file `avoid-systemd` and paste in the contents below:

    {{< file "/etc/apt/preferences.d/avoid-systemd" >}}
Package: *systemd*
Pin: release *
Pin-Priority: -1

{{< /file >}}


### Add OpenVZ Repository

1. Create a new repository source file and paste in the contents below:

    {{< file "/etc/apt/sources.list.d/openvz.list" sourceslist >}}
deb http://download.openvz.org/debian jessie main
deb http://download.openvz.org/debian wheezy main

{{< /file >}}


2. Add the repository key to your system:

        wget -qO - http://ftp.openvz.org/debian/archive.key | sudo apt-key add -

3. As of this guide's publication date, the OpenVZ repository key is invalid, and issuing the `apt update` command will generate a warning from the system. The command should succeed. If it does not, update the system with the following argument:

        apt --allow-unauthenticated update

### Install OpenVZ Packages

1. Install OpenVZ with required packages.

        KPackage="linux-image-openvz-$(dpkg --print-architecture)"
        sudo apt --allow-unauthenticated --install-recommends install $KPackage vzdump ploop initramfs-tools dirmngr

2. The installation should create a new directory, `/vz`. If this directory does not exist after the installation, create a symbolic link using the command below:

        ln -s /var/lib/vz/ /vz

3. Create file `vznet.conf` and paste in the line below:

    {{< file "/etc/vz/vznet.conf" aconf >}}
EXTERNAL_SCRIPT="/usr/sbin/vznetaddbr"

{{< /file >}}


4. This step is optional, and will cause OpenVZ virtual instances to stop when the OpenVZ service is stopped. If this behavior is desired, issue the command below.

        echo 'VE_STOP_MODE=stop' | sudo tee -a /etc/vz/vznet.conf

## Boot Into The OpenVZ Kernel

The system must be configured to boot the OpenVZ kernel each time the server is restarted.

1. Open the `grub.cfg` file in `less`, or your preferred text editor:

        less /boot/grub/grub.cfg

2. Within the `grub.cfg` file, look for a section resembling the following:

    {{< file "/boot/grub/grub.cfg" cfg >}}
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

{{< /file >}}


       Copy the text entry preceeding `submenu`, in this example the text would be: **Advanced options for Debian GNU/Linux**.

3. Within the `grub.cfg` file underneath the "submenu" line, you will see multiple indented "menuentry" sections. These represent the available kernels. From these, you need to locate the newly installed OpenVZ kernel menu entry. It should look similar to the content below. Note that some will be recovery kernels and should be ignored:

    {{< file "/boot/grub/grub.cfg" cfg >}}
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

{{< /file >}}


         Again, write down the text directly after "menuentry" in single quotes. Here, the text to copy is **Debian GNU/Linux, with Linux 2.6.32-openvz-042stab123.9-amd64**.

4. Close the **grub.cfg** file and open **/etc/default/grub** in your preferred text editor. Locate the line that begins with `GRUB_DEFAULT=`. Delete the default value for this parameter and enter the text you copied in the previous steps, following the format below. With the example above, the value would be the following:

        GRUB_DEFAULT="Advanced options for Debian GNU/Linux>Debian GNU/Linux, with Linux 2.6.32-openvz-042stab123.9-amd64"

    Note that both copied strings are separated with the carrot ">" character.

5. Save and close the **grub** file, and issue the below command to reload the grub bootloader with the new kernel value:

        update-grub

6. By default, kernel loading is not handled by Grub, but by the Linode Manager. Login to your Linode Manager and select your Linode. Click on your configuration profile. Under the "Boot Settings" section, select "GRUB 2" from the Kernel dropdown-list (see image below). Save your changes and exit.

     ![Linode Manager - Select Kernel](/docs/assets/openvz/openvz_one.PNG)

7. Reboot your server and issue the command below to verify the OpenVZ kernel was loaded:

        uname -r

    If the OpenVZ kernel was not loaded, it is most likely the **grub** file that is misconfigured. Check and make certain the correct kernel was chosen and entered correctly.

### Download And Deploy An OS Template

1. Start the OpenVZ service:

        service vz start
        service vz status

2. Register with the official OpenVZ template repository:

        sudo gpg --recv-keys $(echo $(sudo gpg --batch --search-keys security@openvz.org 2>&1 | grep -ie ' key.*created' | sed -e 's|key|@|g' | cut -f 2 -d '@') | cut -f 1 -d ' ' | cut -f 1 -d ',')

3. Edit `/etc/vz/vz.conf` and change the following line to use `simfs` instead of `ploop`:

    {{< file-excerpt "/etc/vz/vz.conf" >}}
VE_LAYOUT=simfs

{{< /file-excerpt >}}


4. List available OS templates for download:

        vztmpl-dl --list-remote

5. From the available list of templates, select one to download. Using the format below, issue the following command, replacing *centos7-x86_64* with the template you selected:

        vztmpl-dl --gpg-check centos7-x86_64

6. OpenVZ refers to each installed OS template as a "Container." You must create a Container ID (CTID) for each downloaded template. Issue the below command, replacing [CTID] with any number (101 is recommended) and the CentOS 7 template name with your downloaded template.

        vzctl create [CTID] --ostemplate centos7-x86_64

7.  If you set up a separate disk partition for OpenVZ templates, use the command below to create the container within the new disk. Replace *--ostemplate* with your template name, and *--name* with a descriptive name of your choice:

        vzctl create [CTID] --ostemplate debian-8.0-x86_64 --layout simfs --name centos7 --private /vztemp/vz/private/$VEID --root /vztemp/vz/root/$VEID --config basic

8. A configuration file will now have been created for your OS template. The location of this file is specified as part of the output of the previous command. Open this file now to make the following changes below. The config file will be named in the [CTID].conf format.

    - Give your virtual environment an IP address. The recommended format is 192.168.0.[CTID]. In this case it would be 192.168.0.101.
    - Provide a nameserver. Google's nameserver (8.8.8.8) should be sufficient.
    - If you have trouble booting into your virtual environment, you may try changing **VE_LAYOUT** back to "ploop" from "simfs."

    You may also configure other options at your discrection, such as SWAP and RAM allocation. Save and close when finished.

    {{< file "/etc/vz/conf/101.conf" aconf >}}
. . .

# RAM
PHYSPAGES="0:256M"

# Swap
SWAPPAGES="0:512M"

# Disk quota parameters (in form of softlimit:hardlimit)
DISKSPACE="2G:2.2G"
DISKINODES="131072:144179"
QUOTATIME="0"

# CPU fair scheduler parameter
CPUUNITS="1000"

NETFILTER="stateless"
VE_ROOT="/var/lib/vz/root/$VEID"
VE_PRIVATE="/var/lib/vz/private/$VEID"
VE_LAYOUT="simfs"
OSTEMPLATE="centos7-x86_64"
ORIGIN_SAMPLE="vswap-256m"
NAMESERVER="8.8.8.8"
IP_ADDRESS="192.168.0.101/24"
HOSTNAME="centos-7"

{{< /file >}}


9. Boot into your newly created container using the commands below. Replace [CTID] with your container's CTID number. To exit any container session while leaving the virtual environment running, type `exit` in the command line.

        vzctl start [CTID]
        vzctl enter [CTID]

### Configure Internet Access To Containers

Containers have no way to access the internet or be accessed from the internet. The host server must be configured to pass on requests to and from each installed virtual environment.

### Configure Access From Container To Internet

{{< note >}}
You may need to login as root with `su -` in order to run the iptables-save commands in this section.
{{< /note >}}

1. On the host server, issue the following command using Iptables. Replace the brackets and contents with the appropriate information. For the container IP address, make sure to list it in CIDR notation. Include IP address and subnet, or `xxx.xxx.xxx.xxx/xx`, in order to encompass a range of IP addresses that will enable access to any containers added in the future. For example, entering 192.168.0.0/24 will setup routing for IP addresses 192.168.0.0 through 192.168.0.255:

        iptables -t nat -A POSTROUTING -s [container IP] -o eth0 -j SNAT --to [host server IP]

2. If you have `iptables-persistent` installed, skip this step. Save the new Iptables rules:

        iptables-save > /etc/iptables.conf

3. Configure your firewall to allow forwarded requests. If you are not using `iptables-persistent` save the rule:

        iptables -A FORWARD -s 192.168.0.0/24 -j ACCEPT
        iptables-save > /etc/iptables.conf

4. You should now have access to the internet from within your container environment. Try updating packages from your container to verify the connection.

### Configure Access From Internet To Container

1. If you need to access a specific service on your container from the internet, you will need to reserve a port on the host machine and route access through it. Issue the following command, replacing any bracketed values with the appropriate information:

        iptables -t nat -A PREROUTING -p tcp -d [host_ip] --dport [host_port_number] -i eth0 -j DNAT --to-destination [container_ip:container_port_number]

2. Save your new rule. Skip this step if you have `iptables-persistent` installed:

        iptables-save > /etc/iptables.conf

## Where To Go From Here

After installing OpenVZ, downloading a template, creating a container, and configuring internet access, your virtual environment will function exactly like any normal Linux environment: requiring regular updates, security configuration, etc. Most configuration can be done from the host server via OpenVZ commands.

See the "OpenVZ Basic Operations" link in the **External Resources** section to familiarize yourself with basic administration commands. Additional user-created templates can also be downloaded, which are not included in the main template listing. You can find these by following the "OpenVZ User Contributed Templates" link.

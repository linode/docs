---
author:
  name: Alex Fornuto
  email: docs@linode.com
published: 'Thursday, July 23rd, 2015'
description: 'How to run a custom Linux distribution or pre-built Linux appliance on your KVM Linode.'
keywords: 'custom distro,custom distribution,advanced Linux,kvm'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Alex Fornuto
modified: 'Thursday, July 23rd, 2015'
title: Install a Custom Distro on a Linode
---

This guide entails installing a custom Linux distribution on your KVM Linode. If you're currently running a Xen Linode, you can [upgrade](https://www.linode.com/docs/platform/kvm#how-to-enable-kvm), or follow our older guide on [Running a Custom Linux Distribution on a Xen Linode](/docs/tools-reference/custom-kernels-distros/running-a-custom-linux-distro-on-a-linode-vps).

While there are methods of installing operating systems in place on the Linode, they often create partition tables on the disk image which are incompatible with our Backups service, and prevent us from resizing the disk image properly. Therefore we will install the operating system on a virtual image locally, then copy the filesystem to the Linode.

This guide will use Debian as an example, but you're welcome to apply these steps to any compatible OS.

## Before You Begin

1.  Make sure you have a working installer ISO for the distribution. In our example, we've downloaded the Debian 8 ISO from the [Ubuntu Downloads](http://www.ubuntu.com/download/server) page.

2.  Have a virtual machine manager installed. In this example we'll be using Oracle's [VirtualBox](https://www.virtualbox.org/).

3.  A local copy of the [Finnix](http://www.finnix.org/) ISO.

## Install a Custom Distro

In this section you'll install your custom distro to a raw disk, with the *direct disk boot* option. The end result will leave you with a working custom install, however it will not support disk resizing from within the Linode Manager, nor will it be compatible with the Backup Service.

1.  [Create two raw disk images](/docs/migrate-to-linode/disk-images/disk-images-and-configuration-profiles#creating-a-blank-disk) from the Linode's Dashboard:

    * A disk labeled **Installer**. The size of this disk will depend upon the size of your distribution's installer, but it's recommended to make it slightly larger than the space taken up by the install media itself. For this example, the installer disk will be 100MB in size, giving us plenty of room for the Debian network installer.
    * A disk labelled **Boot**. This will take up the rest of the free space available on your Linode. **Important**: If you intend to continue to the next section on *making your custom distro work with the Linode Manager*, you should make your boot disk no larger than necessary - in this example we'll install Debian to a 2000MB disk.  

2.  [Create two configuration profiles](/docs/migrate-to-linode/disk-images/disk-images-and-configuration-profiles#configuration-profiles) and disable the options under **Filesystem / Boot Helpers** for each of them, as well as the [Lassie](/docs/uptime/monitoring-and-maintaining-your-server#configuring-shutdown-watchdog) shutdown watchdog under the **Settings** menu. Both profiles will use the **Direct Disk** option from the **Kernel** drop down menu:

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

3.  Boot into [Rescue Mode](/docs/troubleshooting/rescue-and-rebuild#booting-into-rescue-mode) with your *Installer* disk mounted to `/dev/sda`, and connect to your Linode using the [Lish Console](/docs/networking/using-the-linode-shell-lish).

4.  Once in Rescue Mode, download your installation media and copy it to your *Installer* disk. In this example we're using the Debian network installer:

    {: .note}
    > As an additional security step, you can use the keys provided in the same directory as the `iso` to [verify the authenticity](https://www.debian.org/CD/verify) of the image.

        wget http://ftp.debian.org/debian/dists/stable/main/installer-amd64/current/images/netboot/mini.iso
        dd if=mini.iso of=/dev/sda

5.  Reboot into your *Installer* configuration profile, and open the [Glish](/docs/networking/use-the-graphic-shell-glish) graphical console from the **Remote Access** tab in your Linode's Dashboard. You'll see your distribution's installer, and you can begin the install process.

6.  During your installer's partitioning / installation phase, be sure to instruct it to use the `/dev/sda` volume. Most installers will create separate root and swap partitions, but you can adjust this as needed.

    {: .note}
    > Some installers offer the option to place `/boot` on a separate partition. If you intend to make use of the steps in the second half of this guide, it's important that your `/boot` directory is located on the same partition as your root filesystem.

7.  Once the installation completes, reboot into your *Installer* profile and open the Glish console. You should have access to a login prompt:

    [![Custom Distro Glish](/docs/assets/custom-distro-glish-small.png)](/docs/assets/custom-distro-glish.png)
## Prepare the Linode

1.  From the [Linode Manager](https://manager.linode.com/) create a new Linode. Under the **Disks** section of the Linode Dashboard, click on **Create a new Disk**:

    [![Create a new disk..](/docs/assets/custom-distro-new-disk_small.png)](/docs/assets/custom-distro-new-disk.png)

2.  Label your new disk image and choose an appropriate size. Leave the Type as **ext4**. Once complete, click on **Save Changes**.

    [![Specify your new disk size and name..](/docs/assets/custom-distro-disk-image.png)](/docs/assets/custom-distro-disk-image.png)

    Repeat these steps for any additional disk images you wish to make, such as a swap disk.

3.  Select the **Create a new Configuration Profile** option. Assign a label, and select your disk images under **Block Device Assignment**. Remember this configuration, as you will need to modify your `/etc/fstab` file to match. If you choose a device assignment other than `/dev/sda` for root device, be sure to update the **root / boot device** drop-down menu:

    [![A custom configuration profile..](/docs/assets/custom-distro-config-profile_small.png)](/docs/assets/custom-distro-config-profile.png)

    {: .note }
    > At this point you have the option of using the Linux kernel provided by Linode, or the one provided by your distribution. For more information, check out our guide [Run a Distribution-Supplied Kernel on a KVM Linode](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel-with-kvm).

    Click on **Save Changes** once your profile is complete.

4.  Return to the Linode Dashboard, and select the **Rescue** tab. From there, click the **Reboot into Rescue Mode** button. Your Linode will now boot into the Finnix recovery image. Use the [Lish](/docs/networking/using-the-linode-shell-lish) shell to access your Linode.

5.  Run the following set of commands to create a root password and enable the SSH server:

        passwd
        service ssh start

## Copy the Disk Image

1.  Power down your local virtual machine, either via the VirtualBox interface, or by issuing the following command at the virtual machine's terminal:

        shutdown -h now

2.  Return to your virtual machine's storage settings and attach the Finnix ISO

    [![Select the Finnix ISO.](/docs/assets/custom-distro-finnix.png)](/docs/assets/custom-distro-finnix.png)

3.  Restart your virtual machine, and boot into the Finnix console. You can use `ls /dev/sd*` to verify the disk images and partitions:

        root@tty1:~# ls /dev/sd*
        /dev/sda /dev/sda1 /dev/sda2 /dev/sda5

4.  Copy the system partition to your Linode's system disk. Replace `/dev/sda1` with your system partition, `12.34.56.78` with your Linode's IP address, and `/dev/sda` with the target disk image on your Linode:

        dd if=/dev/sda1 | pv | ssh root@12.34.56.78 "dd of=/dev/sda"

    By piping our `dd` command through `pv`, we can track the progress of the transfer. The `dd` command will transfer the entire partition including empty space, this process will take some time.


## Configure the transferred image

1.  While still booted into Finnix on your Linode, mount the newly transferred disk:

        mount /dev/sda

2.  Remove the tty service for the graphic console:

        rm /media/sda/etc/systemd/system/getty.target.wants/getty\@tty1.service

3.  Open `/media/sda/etc/fstab` and replace the contents. You can use the example below as a template; be sure to modify for the block device assignment you chose:

    {: .file-excerpt }
    /media/sda/etc/fstab
    :   ~~~ conf
        # /etc/fstab: static file system information.
        #
        # Use 'blkid' to print the universally unique identifier for a
        # device; this may be used with UUID= as a more robust way to name devices
        # that works even if disks are added and removed. See fstab(5).
        #
        # <file system> <mount point>   <type>  <options>       <dump>  <pass>
        proc        /proc        proc    defaults                       0 0
        /dev/sda   /            ext4    noatime,errors=remount-ro      0 1
        /dev/sdb   none         swap    sw
        ~~~

4.  Unlink the `resolv.conf` file:

        unlink /media/sda/etc/resolv.conf
        echo "# resolv.conf - DNS resolver configuration file" > /media/sda/etc/resolv.conf
        echo "options rotate" > /media/sda/etc/resolv.conf.tail

5.  Reboot your Linode.

Your Linode should now be running your custom distro!

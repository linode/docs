---
author:
  name: Alex Fornuto
  email: docs@linode.com
published: 'Thursday, July 23rd, 2015'
description: 'How to run a custom Linux distribution or pre-built Linux appliance on your KVM Linode.'
keywords: 'custom distro,custom distribution,advanced Linux,kvm'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified_by:
  name: Alex Fornuto
modified: 'Thursday, July 23rd, 2015'
title: Run a Custom Distro on a KVM Linode
---

This guide entails installing a custom Linux distribution on your KVM Linode. If you're currently running a Xen Linode, you can [upgrade](https://www.linode.com/docs/platform/kvm#how-to-enable-kvm), or follow our older guide on [Running a Custom Linux Distribution on a Linode](/docs/tools-reference/custom-kernels-distros/running-a-custom-linux-distro-on-a-linode-vps).

While there are methods of installing operating systems in place on the Linode, they often create partition tables on the disk image which are incompatible with our Backups service, and prevent us from resizing the disk image properly. Therefore we will install the operating system on a virtual image locally, then copy the filesystem to the Linode.

For this guide we'll be using Ubuntu as an example, but you're welcome to apply these steps to any compatible OS. 

## Before You Begin

1.  Make sure you have a working installer ISO for the distribution. In our example, we've downloaded the Ubuntu 15.04 Server ISO from the [Ubuntu Downloads](http://www.ubuntu.com/download/server) page.

2.  Have a virtual machine manager installed. In this example we'll be using Oracle's [VirtualBox](https://www.virtualbox.org/).

3.  A local copy of the [Finnix](http://www.finnix.org/) ISO.

## Create the Virtual Machine

1.  From VirtualBox, create a new virtual machine:

    [![The VirtualBox interface.](/docs/assets/1164-vbvm1-1.png)](/docs/assets/1164-vbvm1-1.png)

2.  Name your new virtual machine based on your selected distribution.  In this example the virtual machine is named **Ubuntu 15.04**. VirtualBox should recognize the name and assign the correct type and version:

    [![A new virtual machine.](/docs/assets/custom-distro-new-image.png)](/docs/assets/custom-distro-new-image.png)

3.  Select the RAM and hard drive size for your virtual machine. Because we need to transfer the entire filesystem to the Linode, make your disk image as small as possible. In this example we've set the virtual machine to 512MB RAM and 2048MB of disk space.

4.  After you've created your new virtual machine, right-click on it and select **Settings**. From the **Storage** tab, select the IDE disk device, which should currently say `Empty`. Click on the disk icon to the right, and select **Choose a virtual CD/DVD disk file**. Select the Ubuntu install ISO.

    [![Assigning an ISO to the virtual machine..](/docs/assets/custom-distro-choose-iso_small.png)](/docs/assets/custom-distro-choose-iso.png)

5.  In the main VirtualBox window, select your new virtual machine and click on **Start**. Install the operating system as you would on any physical machine. Take note of what device and partition you install your system to.

    {: .caution }
    > Using disk encryption and/or LVM partition schemas will interfere with our Backups service, and may inhibit the ability to resize your Linode's disk images later. The same applies for file systems other than ext3/4.

    Ensure that the OpenSSH package is selected during the installation process. Without this package you will only be able to access your Linode through the [Lish](/docs/networking/using-the-linode-shell-lish) console.

    [![Select the OpenSSH package..](/docs/assets/custom-distro-select-openssh_small.png)](/docs/assets/custom-distro-select-openssh.png)


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


## Configure the transferred image.

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
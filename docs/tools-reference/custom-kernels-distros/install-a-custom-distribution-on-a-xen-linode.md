---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
published: 2009-08-18
description: 'How to run a custom Linux distribution or pre-built Linux appliance on your Linode.'
keywords: ["custom distro", "custom distribution", "advanced Linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['platform/custom-kernels-distros/running-a-custom-linux-distro-on-a-linode-vps/', 'custom-instances/custom-distro-howto/']
modified_by:
  name: Linode
modified: 2014-10-08
title: Install a Custom Distribution on a Xen Linode
---

If you'd like to run a Linux distribution on your Linode that isn't available from our distribution list, you can do so by following these instructions. This guide is handy for people who prefer distributions that aren't heavily used in the community, or for those interested in creating a highly customized Linux environment and porting it to their Linode.

{{< note >}}
This guide is intended for Linodes using our older Xen hypervisor. To installl a custom distribution on a new KVM Linode, see [this guide](/docs/tools-reference/custom-kernels-distros/install-a-custom-distribution-on-a-linode).
{{< /note >}}

## Creating the Virtual Machine

We'll use a free virtualization suite called [VirtualBox](https://www.virtualbox.org/) to install a Linux distribution locally, but you can also use another virtualization package, such as VMware or Parallels. If you already have a Linux virtual machine that you'd like to run on your Linode, skip to [Booting the Virtual Machine with Finnix](#booting-the-virtual-machine-with-finnix) .

 {{< note >}}
We're using Ubuntu 12.04 as the guest operating system in this guide, but you can install virtually any Linux distribution.
{{< /note >}}

Here's how to get started:

1.  Launch the VirtualBox application. The window shown below appears.

    [![The VirtualBox interface.](/docs/assets/1164-vbvm1-1.png)](/docs/assets/1164-vbvm1-1.png)

2.  Click the **New** button to create a new virtual machine on your personal computer. The window shown below appears.

    [![Naming a VM in VirtualBox.](/docs/assets/1165-vbvm2-1.png)](/docs/assets/1165-vbvm2-1.png)

3.  In the **Name** field, enter a name for the virtual machine.
4.  Select **Linux** from the **Type** menu, and select your Linux distribution from the **Version** menu.
5.  Click **Continue**. The window shown below appears.

    [![Allocating RAM in VirtualBox.](/docs/assets/1166-vbvm3.png)](/docs/assets/1166-vbvm3.png)

6.  Select the amount of RAM that will be allocated to the virtual machine on your personal computer. This value should match the amount of RAM provided by your Linode plan.
7.  Click **Continue**. The window shown below appears.

    [![Adding a virtual hard drive](/docs/assets/1167-vbvm4.png)](/docs/assets/1167-vbvm4.png)

8.  Select **Create a virtual hard drive now** and then click **Continue**. The window shown below appears.

    [![Adding a virtual hard drive](/docs/assets/1169-vbvm5.png)](/docs/assets/1169-vbvm5.png)

9.  Select **VDI (VirtualBox Disk)** and then click **Continue**. The window shown below appears.

    [![Adding a virtual hard drive](/docs/assets/1168-vbvm6.png)](/docs/assets/1168-vbvm6.png)

10. Select **Fixed size** and then click **Continue**. The window shown below appears.

    [![Setting the size of the virtual hard drive](/docs/assets/1170-vbvm7.png)](/docs/assets/1170-vbvm7.png)

11. Enter a name for the hard drive, and then select a size for the virtual machine's hard disk. You'll want to create a hard disk just a bit larger than will be necessary to hold your installed Linux distribution.
12. Click **Create**. It may take a minute or so for the hard disk to be created. After it's created, the window shown below appears.

    [![Adding a virtual hard drive](/docs/assets/1171-vbvm8.png)](/docs/assets/1171-vbvm8.png)

13. Click **Settings**, and then click **Storage**. The window shown below appears.

    [![Adding a virtual hard drive](/docs/assets/1174-vbvm9-2.png)](/docs/assets/1174-vbvm9-2.png)

14. From the **Storage Tree** window, select the **Empty** option under **Controller: IDE**.
15. Click the CD icon, and then select **Choose a virtual CD/DVD disk file**.
16. Select your Linux distribution install image, and then click **Open**.

    {{< note >}}
If you haven't already downloaded the image of the Linux distribution to your desktop computer, do that now.
{{< /note >}}

17. Click **Network**. The window shown below appears.

    [![Configuring networking.](/docs/assets/1175-vbvm10.png)](/docs/assets/1175-vbvm10.png)

18. From the **Attached to** menu, select **Bridged Adapter**. This setting will allow your virtual machine to be reached from anywhere on the local network.
19. Click **OK**.
20. You should see the *Oracle VM VirtualBox Manager* window again. Click **Start** to turn on the virtual machine.
21. Follow the distribution's installation instructions. When prompted to partition the disk, create a single partition for `/` and a small partition for `swap`, as shown below.

    {{< note >}}
You will need to ensure that your distribution's installer configures your partitions without LVM (Logical Volume Management), as disks created with LVM cannot be transferred to your Linode.
{{< /note >}}

    [![Partitioning the drive.](/docs/assets/1179-vbvm11.png)](/docs/assets/1179-vbvm11.png)

22. Select the packages you'd like installed on your server, such as OpenSSH server for easy remote administration, as shown below.

    [![Installing packages.](/docs/assets/1180-vbvm12.png)](/docs/assets/1180-vbvm12.png)

23. Complete the installation, and then shut down the virtual machine.

You have successfully created the virtual machine.

## Booting the Virtual Machine with Finnix

Now you need to boot the virtual machine with Finnix to transfer it to your Linode. Here's how to boot the virtual machine with Finnix:

1.  Download the latest Finnix ISO image from [finnix.org](http://www.finnix.org/). You'll use this image to boot the virtual machine and then transfer the virtual hard disks to your Linode.
2.  In the *Oracle VM VirtualBox Manager* window, click **Settings**, and then click **Storage**. The window shown below appears.

    [![Installing packages.](/docs/assets/1181-vbvm13.png)](/docs/assets/1181-vbvm13.png)

3.  Click the CD icon, and then select **Choose a virtual CD/DVD disk file**.
4.  Select your Linux distribution install image, and then click **Open**.
5.  Click **OK**.
6.  You should see the *Oracle VM VirtualBox Manager* window again. Click **Start** to turn on the virtual machine.

The virtual machine is now ready to be transferred to your Linode.

## Migrating the Virtual Machine to Your Linode

Above, you created a virtual machine and prepared it for transfer to your Linode.  The steps below will walk you through configuring a Linode for your custom image. In this how-to, we will start with a new Linode. However, the information provided can be applied to existing Linodes by adding new disks.

### Setting up your Configuration Profile

Start from the Linode Manager by configuring a Linode to boot your custom image.

1. Log in to the Linode Manager.

2. From the **Linodes** tab, select the **Add a Linode** option, which is located to the right of the page under your list of Linodes.

3. Select your plan and Linode location, then click **Add this Linode!**

4. Select the recently created Linode from the **Linodes** tab Linodes list.

5. Optionally, select **Settings** and change the **Linode Label** to Custom_Distro or similar. Then select **Save Changes**.

6. Select the newly labelled Custom_Distro Linode.

7. Select **Create a new Disk**. Label the new disk to "Custom_Distro" or similar. Select the **Type** as ext4. Ensure that the **Size** of the disk is at least as large as the **fixed size** of the virtual machine disk running on your local machine. In Step 10 of the [Creating the Virtual Machine](#creating-the-virtual-machine) section, we pictured the disk size as 3.00 GB or 3,000 MB. Continue with this size. Select **Save Changes**.

8. Now create the swap disk. Again, select **Create a new Disk**. This time set the **Label** as "Swap". Set the **Type** as **swap**. Finally, set the size to 256 MB or larger.

9. Next, create a configuration profile for the Linode by selecting **Create a new Configuration Profile**. Change the **Label** to "Custom_Distro" or similar. Under **Block Device Assignment** change **/dev/xvda** to **Custom_Distro** and **/dev/xvdb** to **Swap**. Notice that **root device** is set to **Standard: /dev/xvda** making the Custom_Distro disk the boot device. Warning, do not change the **root device** setting.

    [![Configuration Profile.](/docs/assets/config-profile-small.png)](/docs/assets/config-profile-large.png)

10. Select **Save Changes**.

11. Next, select the **Rescue** sub-tab, which is located on the same row as the **Dashboard** tab. Select **Reboot into Rescue Mode**. Monitor the **Host Job Queue** progress bar for the system shutdown and the system boot. It should take under a minute.

12. Once your Linode has booted into Finnix Rescue Mode, you should be able to connect to it via the [Lish Console](/docs/networking/using-the-linode-shell-lish/).

## Starting SSH in Finnix

In order to transfer the disks from the virtual machine to the Linode, you will need to start SSH on the Linode itself.

1.  Set the password for Finnix's root user by issuing the following command:

        passwd

2.  Start the SSH service by entering the following command:

        service ssh start

3.  Mount your Custom_Distro disk by entering the following command:

        mount /media/xvda

### Copying the Disk from VirtualBox to your Linode

The steps below will walk you through transferring your new disk from your local Virtual Machine to your Linode.

1. Mount your local disk by entering the following command at the prompt on your local virtual machine:

        mount /media/sda1

    {{< note >}}
/media/sda1 is typically where the disk lives, but it may be in a different directory path or filename depending on your configuration.
{{< /note >}}

2. Enter the command below to copy your disk to your Linode. Make sure to replace `12.34.56.78` with the IP address of your destination Linode:

        rsync -avz /media/sda1/ root@12.34.56.78:/media/xvda/

    {{< note >}}
You can monitor the progress of your transfer by running the following command at the Lish prompt on your Linode.

watch df -h
{{< /note >}}

3.  Once the rsync file transfer has completed, go back to your Lish console. Edit the /etc/fstab file by running the following command:

        nano /media/xvda/etc/fstab

    Modify the file to match the following:

    {{< file "/media/xvda/etc/fstab" >}}
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#<file system> <mount point>   <type>  <options>       <dump>  <pass>
proc /proc proc defaults 0 0
/dev/xvda       /       ext4    noatime,errors=remount-ro 0     1
/dev/xvdb       none    swap    sw      0       0

{{< /file >}}
~
6.  Exit and save the file by pressing `Ctrl+x`, type `y` to save your changes, and press `enter` to exit.

The disk has been transferred to your Linode. You should now be able to boot your Linode normally and log in [via SSH](https://www.linode.com/docs/getting-started#logging-in-for-the-first-time). Remember to use the username and password created during step 23 under the [Creating the Virtual Machine](#creating-the-virtual-machine) heading. Also, check your network configuration and if necessary refer to the [Linux Static IP Configuration](https://www.linode.com/docs/networking/linux-static-ip-configuration/) guide.

Congratulations, you have successfully transferred the custom distro disk from your local virtual machine to your Linode.

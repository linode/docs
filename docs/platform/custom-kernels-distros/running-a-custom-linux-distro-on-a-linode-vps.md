---
author:
  name: Linode
  email: docs@linode.com
description: 'How to run a custom Linux distro or pre-built Linux appliance on your Linode.'
keywords: 'custom distro,advanced Linux'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['custom-instances/custom-distro-howto/']
modified: Friday, April 19th, 2013
modified_by:
  name: Linode
published: 'Tuesday, August 18th, 2009'
title: Running a Custom Linux Distro on a Linode VPS
---

If you'd like to run a Linux distribution on your Linode that isn't available from our distribution list, you can do so by following these instructions. This guide is handy for people who prefer distributions that aren't heavily used in the community, or for those interested in creating a highly customized Linux environment and porting it to their Linode VPS.

Creating the Virtual Machine
----------------------------

We'll use a free virtualization suite called [VirtualBox](https://www.virtualbox.org/) to install a Linux distribution locally, but you can also use another virtualization package, such as VMware or Parallels. If you already have a Linux virtual machine that you'd like to run on your Linode, skip to [Set up Finnix and Copy your VM Image](#id1) .

 {: .note }
>
> We're using Ubuntu 12.04 as the guest operating system in this guide, but you can install virtually any Linux distribution.

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

9.  Select **VDI (VirtualBox Disk Image)** and then click **Continue**. The window shown below appears.

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

 {: .note }
>
> If you haven't already downloaded the image of the Linux distribution to your desktop computer, do that now.

17. Click **Network**. The window shown below appears.

    [![Configuring networking.](/docs/assets/1175-vbvm10.png)](/docs/assets/1175-vbvm10.png)

18. From the **Attached to** menu, select **Bridged Adapter**. This setting will allow your virtual machine to be reached from anywhere on the local network.
19. Click **OK**.
20. You should see the *Oracle VM VirtualBox Manager* window again. Click **Start** to turn on the virtual machine.
21. Follow the distribution's installation instructions. When prompted to partition the disk, create a single partition for `/` and a small partition for `swap`, as shown below.

    [![Partitioning the drive.](/docs/assets/1179-vbvm11.png)](/docs/assets/1179-vbvm11.png)

22. Select the packages you'd like installed on your server, such as OpenSSH server for easy remote administration, as shown below.

    [![Installing packages.](/docs/assets/1180-vbvm12.png)](/docs/assets/1180-vbvm12.png)

23. Complete the installation, and then shut down the virtual machine.

You have successfully created the virtual machine.

Booting the Virtual Machine with Finnix
---------------------------------------

Now you need to boot the virtual machine with Finnix to transfer it to your Linode. Here's how to boot the virtual machine with Finnix:

1.  Download the latest Finnix ISO image from [finnix.org](http://www.finnix.org/). You'll use this image to boot the virtual machine and then transfer the virtual hard disks to your Linode.
2.  In the *Oracle VM VirtualBox Manager* window, click **Settings**, and then click **Storage**. The window shown below appears.

    [![Installing packages.](/docs/assets/1181-vbvm13.png)](/docs/assets/1181-vbvm13.png)

3.  Click the CD icon, and then select **Choose a virtual CD/DVD disk file**.
4.  Select your Linux distribution install image, and then click **Open**.
5.  Click **OK**.
6.  You should see the *Oracle VM VirtualBox Manager* window again. Click **Start** to turn on the virtual machine.

The virtual machine is now ready to be transferred to your Linode.

Migrating the Virtual Machine to Your Linode
--------------------------------------------

Congratulations! You've installed a custom Linux distribution and prepared it for transfer to your Linode. The next step is migrating the virtual machine to your Linode. For more information, see [Copying a Disk Image Over SSH](/docs/migration/ssh-copy).




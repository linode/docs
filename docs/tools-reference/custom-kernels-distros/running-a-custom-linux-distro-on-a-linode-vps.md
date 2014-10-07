---
author:
  name: Linode
  email: docs@linode.com
description: 'How to run a custom Linux distro or pre-built Linux appliance on your Linode.'
keywords: 'custom distro,advanced Linux'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['platform/custom-kernels-distros/running-a-custom-linux-distro-on-a-linode-vps/', 'custom-instances/custom-distro-howto/']
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

Above, you installed a custom Linux distribution to a local virtual machine and prepared it for transfer to a Linode. Next, the destination Linode has to be configured for transfer through the Linode Manager web-interface, and then through Finnix. In this how-to, we will start with a new Linode. However, the information provided can be applied to existing Linodes by adding new disk images. 

###Linode Preparation for Migration in the Linode Manager
The below steps cover the destination Linode creation and configuration for the reception of a custom distro disk image. While this section covers the steps necessary through the Linode manager, the next section covers the steps necessary while logged into the Linode through Finnix. Let's start:

1. Log in to the Linode Manager. 

2. From the **Linodes** tab, select the **Add a Linode** option, which is located to the right of the page under your list of Linodes.

3. Select your plan and Linode location, then click **Add this Linode!**

4. Select the recently created Linode from the **Linodes** tab Linode list.

5. Optionally, select **Settings** and change the **Linode Label** to Custom_Distro or similar. Then select **Save Changes**.

6. Select the newly labelled Custom_Distro Linode. 

7. Select **Create a new Disk Image**. Label the new disk image to "Custom_Distro" or similar. Select the **Type** as ext4. Ensure that the **Size** of the disk image is at least as large as the **Fixed size** of the virtual machine disk image running on your local machine. In Step 10, above, under the "Creating the Virtual Machine" heading, we pictured the disk image size as 3.00 GB or 3,000 MB. Continue with this size. Select **Save Changes**.

8. Now create the swap disk image. Again, select **Create a new Disk Image**. This time set the **Label** as "Swap". Set the **Type** as **swap**. Finally, set the size to 256 MB or larger. 

9. Next, create a configuration profile for the Linode by selecting **Create a new Configuration Profile**. Change the **Label** to "Custom_Distro" or similar. Under **Block Device** change **/dev/xvda** to **Custom_Distro** and **/dev/xvdb** to **Swap**. Notice that **root device** is set to **Standard: /dev/xvda** making the Custom_Distro disk image the boot device. Warning, do not change the **root device** setting.  

    [![Configuration Profile.](/docs/assets/config-profile-small.png)](/docs/assets/config-profile-large.png)

10. Select **Save Changes**.

11. Next, select the **Rescue** sub-tab, which is located on the same row as the **Dashboard** tab. Select **Reboot into Rescue Mode**. Monitor the **Host Job Queue** progress bar for the system shutdown and the system boot. It should take under a minute. 

12. Now that the Linode is running in rescue mode, select the **Remote Access** sub-tab. Then, at the bottom of the page, select the hyperlink listed for **Lish via SSh**. 

13. A browser permission window may appear, if so select Launch Application. Then, a terminal window will appear with a password prompt. The password being requested is the same as your Linode Manager password. 

###Continued Linode Preparation for Migration in Finnix
Directly above, a Linode was created and partially configured for a disk image migration. To complete configuration, commands must be called while the Linode is booted and logged in from rescue mode. Rescue mode boots a Linode from the Finnix distribution. Finnix allows a command line interface that can be used to mount disk images.     

1.  Continuing from step 13 above, after the correct password has been entered, enter the name of the Linode that you wish to log in to. Previously, this guide suggested naming the Linode "Custom_Distro". You now should be at a Finnix, LISH, SSH, command-line prompt reading "root@hvc0:~#".

2.  Now, set a password for the Linode by entering the command:

        passwd

3.  Start the SSH application by entering the command:

        service ssh start

4.  Mount the Custom_Distro disk image, which was created with the Linode Manager browser interface, by entering the command:

        mount /media/xvda

5. Soon, you will be copying a large amount of data to your Linode. Optionally, you can monitor the transfer by entering the command:

        watch df -h


Using the Linode Manager and Finnix, you have now fully prepared the destination Linode for migration. The next sections will detail how to copy the custom distro from your local drive to the web hosted, destination Linode.

###Copying the Custom Distro from the Local Host to Linode

The commands in this section begin from the local Virtual Box instance running Finnix. We left this Finnix instance running under the previous section entitled, "Booting the Virtual Machine with Finnix". Now, we will mount the custom distro disk image and copy it to the Linode.

1. Mount the local custom distro disk image by entering the command:

        mount /media/sda1
 
    {: .note }
    >
    > /media/sda1 is typically where the disk image lives, but it may be in a different directory path or filename depending on your configuration.

2.  Next, upload the disk image to the Linode from your Virtual Box instance. Make sure to replace "Linode IP address" with the IP address of your destination Linode. The IP can be displayed from the **Remote Access** tab of the Linode Manager. Enter the following command:

        rsync -avz /media/sda1/ root@Linode IP address:/media/xvda/


3.  Now, from step 5 of the above section, you can monitor the data transfer in the Linode's Finnix instance. For an idea of how large your custom distro might be, by comparison, the Ubuntu Server 14.04.1 LTS distro is approximately 1.1 GB in size. When finished with the copy, the local, Virtual Box, Finnix instance will display a sent and recieved log. Once finished, the local, Virtual Box, Finnix instance can be powered down by closing the Virtual box window. 

4.  From the Linode's Finnix instance, exit the monitoring display by holding control and then pressing c.

5.  Edit the last 4 lines of the fstab file to reflect your Linode's disk image mount points by entering the command:

        nano /media/xvda/etc/fstab 

    And then modifying the text to:    

    {: .file }
    /media/xvda/etc/fstab
    :   ~~~
        #<file system> <mount point>   <type>  <options>       <dump>  <pass>
        proc /proc proc defaults 0 0
        /dev/xvda       /       ext4    noatime,errors=remount-ro 0     1
        /dev/xvdb       none    swap    sw      0       0
        ~~~~
6.  Exit and save the file by holding control and pressing c, enter yes to save, and press enter to exit. Now log out of the SSH session by entering the `exit` command. Then, close the SSH window. 

The custom distro has been transferred to and configured on the Linode. It should be fully functional and waiting to be booted and used. 

###Booting and Logging into the Custom Distro

Congratulations, the custom distro is now ready. In this section, you will re-boot the Linode with the custom disto disk image attached, and then sign in. 

1.  Return to the Linode Manager. The session has probably timed out, so log in again. From the **Dashboard** tab of the "Custom_Distro" Linode, select **Shut down**. 

2.  Once shutdown, select **Reboot**. 
 
3.  Once rebooted, select the **Remote Access** tab.

4.  Open a new SSH terminal window and log into the Linode. Remember to use the username and password created during step 23 under the "Creating the Virtual Machine" heading. So your login command should look something like `ssh custom_distro_username@LinodeIPaddress`.

5.  Once logged in, ping google.com to ensure that the network configuration is correct:
        
        ping google.com

    {: .note }
    >
    > Hold control and then press c to stop pinging, once stopped you should see a packet sent and packet received display. If your network configuration is not set correctly, then visit the [Linux Static IP Configuration](https://www.linode.com/docs/networking/linux-static-ip-configuration/) guide.  


Congratulations, you are now logged into your custom distro on your Linode. You have successfully transferred teh disk image from a local virtual machine to a Linode server. 







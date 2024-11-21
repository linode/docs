---
slug: migrate-from-azure-disk-storage-to-linode-block-storage
title: "Migrate From Azure Disk Storage to Linode Block Storage"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-11-18
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Introduction

This guide details the process of migrating a single volume from Azure Disk Storage to Linode Block Storage using the rsync file synchronization utility. While Azure Disk Storage serves a broader range of use cases than Linode Block Storage, this guide focuses on migrating Azure data disks, excluding OS and temporary disks.

The following topics are covered in this guide:

Linode Block Storage vs. Azure Disk Storage

Migration Considerations

Data Migration Workflow Diagram

Data Migration Instructions

Migration Costs

Also included are instructions for creating two sample data sets, one at 10GB and another at 100GB, to serve as examples for migrating data from Azure Disk Storage to Linode Block Storage.

## Linode Block Storage vs. Azure Disk Storage

When you first create an Azure Virtual Machine (VM), Azure Disk Storage creates two managed disks by default: an OS disk and data disk. Like Linode Block Storage volumes, Azure managed disks are also block-level storage volumes used with VMs. Unlike Azure Disk Storage, which fulfills multiple roles, Linode Block Storage is generally used for persistent data, not OS/boot disks or temporary data. These other roles are fulfilled by a Linode compute instance’s bundled disk. Linode’s bundled disk storage is also more suitable for certain applications like high-traffic databases.

## Migration Considerations
The following are important time, cost, security, and data compression considerations you should keep in mind when migrating your Azure Disk Storage drives to Linode Block Storage.

### Migration Time Estimates
This guide covers the creation and migration of two test files: one 10 GB file and another 100 GB file. Depending on your specific server and network configuration, the 10 GB file may take  over 2 minutes to transfer from Azure to Linode at around 58 MB/s, while the 100 GB can take over 2 ½ hours at 11.95MB/s.

As discussed later in this guide, you can exclude the -c rsync flag to skip checksum comparisons for larger file sizes. Doing so significantly speeds up the end-to-end data migration time.

### Migration Egress Costs
The migrations demonstrated in this guide incurred the following costs:

The 10 GB sample dataset migration incurred $2.22 in storage costs, $0.05 in virtual network costs, and < $0.01 in bandwidth costs.

After the 100GB sample dataset migration, $3.88 in storage costs, $0.09 in virtual network costs, and < $0.01 in bandwidth costs were incurred.

### Security and Firewalls

To securely migrate your files, you should execute rsync over SSH using a public key (.pem file) generated on your Azure VM. Your Azure and Linode firewall settings should also be configured to accept inbound or outbound SSH traffic.

## Data Compression

Compressing files to be migrated on the source is generally good practice to shorten data transfer times. The rsync command used in this guide includes the -z flag to enable compression during data transfer, speeding up data transfers and saving network bandwidth.

## Block Storage Migration Workflow Diagram

The following workflow diagram outlines the activities covered in this guide. Steps 1 and 3 may not apply to your scenario if you’ve already prepared your Azure Data Disk and Linode Block Storage volumes.



Azure VM disk storage is prepared.

Test dataset is created on Azure disk storage.

Linux Block Storage volume created and attached to Linode instance.

Azure VM public key (.pem file) copied to Linode instance.

Rsync command issues from Linode instance.

Test dataset copied to Linode instance.

## Block Storage Migration Instructions

### Prerequisites and Assumptions

This guide assumes that you have both a Linux-based Azure VM instance and destination Linode instance up-and-running. Upon creating your Azure VM, an OS disk and data disk should automatically be attached to your instance.



Ensure that you have already generated a public key (.pem file) for your Azure VM instance, as it will be required to securely run rsync over SSH between your Linode in the Akamai Connected Cloud and your VM in the Microsoft Azure environment.

This guide assumes the following source filesystem path for your Azure volume:

/dev/sdc1 mounted to /datadrive

The destination of your Linode migration is assumed to be:

/mnt/linode-bs

Preparing Your Azure Instance with Disk Attached
In the Azure portal, go to your VM and expand the Settings link on the left-hand side. Click on Disks—you should see your OS disk and your Data disk at logical unit number (LUN) 0:



If you SSH into your Azure VM, you can run the  lsblk command, pipe the output to grep,and filter on “sd” to verify information about all your available block devices:

 lsblk -o NAME,HCTL,SIZE,MOUNTPOINT | grep -i "sd"

Your results should resemble the following output:



As you can see, sda is the 30 GB OS disk and sdc is the 1 TB data disk at LUN 0.

Preparing A New Empty Disk
If you’ve just created your Azure VM, the data disk is empty and needs to be prepared. Use the parted and mkfs utility to partition and format the data disk using the XFS filesystem, followed by partprobe to make your OS kernel aware of the new partition and filesystem.

sudo parted /dev/sdc --script mklabel gpt mkpart xfspart xfs 0% 100%

sudo mkfs.xfs /dev/sdc1

sudo partprobe /dev/sdc1

Mounting The Disk
Next, use mkdir to create a directory called /datadrive to mount your filesystem to:

sudo mkdir /datadrive

Use mount to mount the /dev/sdc1 partition to your new /datadrive directory:

sudo mount /dev/sdc1 /datadrive

To ensure that the drive is unmounted automatically after a reboot, you’ll need to add it to your /etc/fstab file. fstab is a configuration table designed to facilitate mounting and unmounting Linux file systems to a machine.

First, use the blkid utility to get the universally unique identifier (UUID) of your drive—you’ll need it to add your drive to /etc/fstab.

sudo blkid

Your results should resemble the following output:



Take note of the UUID for /dev/sdc1. Next, open the /etc/fstab file in a text editor. Add the following line to the end of the file using the UUID value for the /dev/sdc1 and the mountpoint of /datadrive:

UUID=4f6fb6f0-38a3-4f9e-a5de-5a3b0ca9bedd   /datadrive   xfs   defaults,nofail   1   2

Verifying The Disk
You can now use lsblk again to verify the disk and the mountpoint:

lsblk -o NAME,HCTL,SIZE,MOUNTPOINT | grep -i "sd"

Your results should resemble the following output:



As you can see, sdc1 is now mounted at /datadrive.

Creating Sample Data on Your Azure Data Disk
You can now create the test file to migrate from your Azure data disk to your Linode instance.

Start by creating a 10 GB file using the dd command:

sudo dd if=/dev/zero of=/datadrive/dummyfile bs=1M count=10240

Running this command will create a 10 GB test file filled with zeros at /datadrive/dummyfile.

bs=1M sets the block size to 1 MB and count=10240  specifies a total number of 10240 blocks to write. With a block size of 1 MB, this creates a file of 10 GB (10240 MB).

Once the dd command finishes, your results should resemble the following output:



You can verify that your test file was successfully created by navigating to your datadrive directory and typing ls -al:



Preparing you Linode Instance with Attached Block Storage
At this point, your Azure VM and its attached data disk are ready to be migrated. The next step involves preparing your Linode instance and its attached block storage volume to receive the test file.

Creating Your Linode Block Storage Volume
From your Linode Cloud Manager dashboard, click on Volumes on the left-hand side and the Create Volume button on the top right-hand side.

Specify a Label, Region, Linode, and Config. Enter 200 GB  for the volume’s Size.



Once the volume is created, you’ll see it show up on your Volumes page. Click on the Show Config button.



The Volume Configuration pane will appear on the right-hand side. Copy the values from the pane and paste them into your notepad/notes—you’ll need them later when configuring your new volume.



Configuring Your New Linode Block Storage Volume
The steps to configure your new Linode Block Storage volume are similar to the steps you followed previously in configuring your Azure data disk: you will use mkfs to to create a filesystem on your new volume, create a directory to mount the filesystem to using mkdir, then using mount to mount the new volume. You will then edit your /etc/fstab file to ensure that the volume mounts every time your Linode instance reboots.

Log in to your Linode instance. You can either SSH directly, or use the LISH console by expanding the menu on the right-hand side and clicking the Launch LISH Console menu item:



After logging in to your Linode instance, run the commands you previously copied to your notepad (mkfs, mkdir, mount):

mkfs.ext4 "/dev/disk/by-id/scsi-0Linode_Volume_linode-bs”

mkdir "/mnt/linode-bs"

mount "/dev/disk/by-id/scsi-0Linode_Volume_linode-bs" "/mnt/linode-bs”

Your results should resemble the following output:



Open up your /etc/fstab file in a text editor and add the following line to make sure the volume auto-mounts every time your Linode reboots:

/dev/disk/by-id/scsi-0Linode_Volume_linode-bs /mnt/linode-bs ext4 defaults,noatime,nofail 0 2

If you’re using the VI text editor, your changes should look like this:



Save your updated /etc/fstab file. You are now ready to start migrating your Linode Block Storage from Azure Disk Storage.

### Use Rsync to Migrate Block Storage Data

You’ll be using rsync to connect to your Azure VM and migrate your block storage data to your Linode Block Storage volume.

Check Linode and Azure Firewall and Connection Settings
First, make sure the firewall settings on both sides are configured correctly to allow the migration traffic to pass through.

In Linode, click on Firewalls and make sure that any inbound or outbound rules are set to Accept inbound SSH traffic.

For example, this is what it would look like in Linode:



Using Rsync To Migrate the 10 GB Test File
NOTE: Be sure to first copy your Azure VM’s public key (.pem file) to your Linode instance.

Run the rsync command to start migrating the contents of your Azure VM’s /datadrive directory to the /mnt/linode-bs directory on your  Linode instance :

rsync -chavzP --stats -e "ssh -i /path/to/your_azure_vm_key.pem" azureuser@13.93.147.88:/datadrive/ /mnt/linode-bs

Here's a detailed explanation of the key flags and parameters used in the rsync command:

-c: This option tells rsync to use checksum comparison for file differences. Normally, rsync uses file size and modification time to decide if files need to be updated, but -c forces it to compute checksums, which is slower but can be more accurate if you want to be sure that files match exactly.

-h: Human-readable output, which makes file sizes (like transfer statistics) easier to read by using units like KB and MB, rather than raw byte counts.

-a: Archive mode. This option enables several options at once (-rlptgoD), which tells rsync to:

Recursively copy directories (-r).

Preserve symbolic links (-l).

Retain file permissions (-p).

Keep timestamps (-t).

Preserve group ownership (-g).

Maintain file ownership (-o).

Retain device files and special files (-D).

The result of the -a flag is a complete, near-exact copy of the source directory.

-v: Verbose mode. This makes rsync output more detailed information about what it is doing, which is helpful for monitoring the progress of a large transfer or troubleshooting.

-z: Compression. This enables compression during data transfer, which can save bandwidth and speed up the transfer if the network connection is relatively slow.

-P: This option is a combination of two flags:

--progress, which displays progress information for each file transfer.

--partial, which keeps partially transferred files if the transfer is interrupted, allowing it to resume more easily next time.

--stats: This option provides detailed statistics at the end of the transfer, such as total bytes transferred, transfer speed, and file counts.

-e "ssh -i /path/to/your_azure_vm_key.pem": This option specifies a remote shell (ssh) with an identity key file for authentication:

-e lets you specify a remote shell to use (in this case, SSH).

"ssh -i /path/to/your_azure_vm_key.pem" tells rsync to connect to the remote server using SSH, and the -i option specifies an SSH key (/path/to/your_azure_vm_key.pem) for authentication.

azureuser@13.93.147.88:/datadrive/: This specifies the source directory you’re syncing from. Here:

azureuser is the username on the remote server (replace with your username).

13.93.147.88 is the IP address of the remote server (replace with your IP address .

/datadrive/ is the path on the remote server that you want to sync. The trailing slash (/) means rsync will copy the contents of /datadrive, rather than creating a /datadrive directory in the target.

/mnt/linode-bs: This is the destination directory on the local machine where rsync will copy the files to. In this case, it will create an exact copy of /datadrive contents here.

Once you enter the rsync command, the syncing process will start and display your progress in  real-time:



Transferring the 10 GB test file should take a little over 2 minutes, at around 58 MB/s. Once rsync completes, your results should look like the following output:



Navigate to the /mnt/linode-bs directory and issue an  ls -al command to verify that the file has transferred successfully:



Using Rsync To Migrate a 100 GB Test File
Next, you’ll try using rsync on a larger migration: a 100 GB test file. Start by logging in to your Azure VM via SSH and deleting the existing test file:

rm /datadrive/dummyfile

You should also remove the test file in the destination directory of your Linode instance. Use weblish to log back into your Linode instance and remove the existing test file in your destination directory:

rm /mnt/linode-bs/dummyfile

Back in your Azure VM, run the dd command again—this time, specify the creation of  a 100 GB file:

sudo dd if=/dev/zero of=/datadrive/dummyfile bs=10MB count=10000

bs=10M sets the block size to 10 MB and count=10000  specifies a total number of 10000 blocks to write. With a block size of 10 MB, this creates a file of 100 GB.

NOTE: you should use 10 MB blocks to avoid memory exhaustion issues. Also, the creation process will take longer than before (around 5 minutes) due to the significantly larger test file.

Once your test file has been created, log back into your Linode instance and run the rsync command again. This time, remove the -c option to speed up the process for the large test file (the -c flag forces rsync to calculate a checksum for all files).

rsync -havzP --stats -e "ssh -i /path/to/your_azure_vm_key.pem" azureuser@13.93.147.88:/datadrive/ /mnt/linode-bs

rsync will take a longer time to receive the incremental file list. Once it has completed the transfer, your results should resemble the following output:



For the 100 GB test file, the rsync data transfer should take approximately 2 ½ hours at 11.95MB/s.

Verifying Your Rsync Migration
To verify that rsync has synced all the files as expected, re-run the command with the --dry-run –stats flags.

rsync -havzP --stats --dry-run -e "ssh -i /path/to/your_azure_vm_key.pem" azureuser@13.93.147.88:/datadrive/ /mnt/linode-bs

If the output displays files yet to be transferred, then rsync did not fully replicate the files in the destination directory. A successful rsync transfer should look like the following output (note the number of created, deleted, and transferred files equal 0).



Azure Costs
To give you a cost estimate for using rsync to migrate Azure Disk Storage to Linode Block Storage, here’s a snapshot of Azure Cost Analysis after transferring the initial 10 GB test file:



Here’s a snapshot of Azure Cost Analysis after transferring the 100 GB test file (and a few trial runs):



Linode Costs
Linode offers free, unmetered network transfer for all inbound network transfers. You can view network transfer by clicking on Linodes from the left-hand column, selecting your Linode instance, and clicking on the Network tab.

Here’s what the Network pane looks like after transferring the initial 10 GB test file:


---
title: Rescue and Rebuild
description: 'Learn how to rescue and rebuild a Compute Instance by using the recovery tools available in the Cloud Manager.'
keywords: ["rescue", "rebuild"]
tags: ["cloud manager"]
published: 2012-05-31
modified: 2023-05-04
modified_by:
  name: Linode
image: rescue-rebuild.jpg
aliases: ['/troubleshooting/rescue-and-rebuild-classic-manager/','/troubleshooting/rescue-and-rebuild/','/rescue-and-rebuild/','/troubleshooting/finnix-rescue-mode/','/guides/rescue-and-rebuild/']
authors: ["Linode"]
---

Even the best system administrators may need to deal with unplanned events in the operation of their services. The Cloud Manager provides recovery tools that you can leverage if you are having trouble connecting to one of the Compute Instances, and this guide describes those tools:

-  You can boot your Compute Instance into [*Rescue Mode*](#rescuing) to perform system recovery tasks and transfer data off the disks, if necessary.

- If you are unable to resolve the system issues, you can [*rebuild*](#rebuilding) the Compute Instance from a backup or start over with a fresh Linux distribution.

## Troubleshooting Resources

While this guide outlines the recovery tools that Linode makes available to you, it does not provide a specific troubleshooting strategy. Our other guides offer a logical progression of steps you can follow when troubleshooting different symptoms:

- If you are not able to establish basic network connections with the Compute Instance, then review the [Troubleshooting Basic Connection Issues](/docs/products/compute/compute-instances/guides/troubleshooting-connection-issues/) guide.

- If you can ping the instance but can't access SSH, follow the [Troubleshooting SSH](/docs/products/compute/compute-instances/guides/troubleshooting-ssh-issues/) guide.

- If you can access SSH but are experiencing an outage with a web server or other service, review [Troubleshooting Web Servers, Databases, and Other Services](/docs/products/compute/compute-instances/guides/troubleshooting-services/).

- For an overview of all these issues and answers to other questions, check out the [Troubleshooting Overview](/docs/guides/troubleshooting-overview/) guide.

## Rescuing

*Rescue Mode* is a safe environment for performing many system recovery and disk management tasks. Rescue Mode is based on the [Finnix recovery distribution](http://www.finnix.org/), a self-contained and bootable Linux distribution. Within Rescue Mode, you can mount a Compute Instance's disks and run Linux commands to further troubleshoot issues. You can also use Rescue Mode for tasks other than disaster recovery, such as:

- Formatting disks to use different filesystems

- Copying data between disks

- Downloading files from a disk through SSH and SFTP

### Rescue Mode Overview

To access Rescue Mode, you need to [reboot your Compute Instance](#booting-into-rescue-mode) from the Cloud Manager and then connect through [Lish](#connecting-to-a-linode-running-in-rescue-mode) or [SSH](#starting-ssh). After you connect, you can [perform a check on your filesystem](#performing-a-file-system-check) if you suspect that it is corrupted. If you need access to a certain software package to troubleshoot the system, you can [install it](#installing-packages).

The disks are mounted by default, so [mount](#mounting-disks) them in order to access the files. After you mount the primary filesystem, you can [*change root*](#change-root) to have Rescue Mode emulate normal Linux distribution.

### Boot into Rescue Mode

To boot a Compute Instance into Rescue Mode, follow the instructions below.

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Click the **Linodes** link in the sidebar:

    ![Cloud Manager dashboard - Linodes sidebar link highlighted](cloud-manager-dashboard.png)

1.  Click on the **more options ellipsis** next to the Compute Instance that you wish to boot in to Rescue Mode, and click on the **Rescue** option to open the Rescue form:

    ![Cloud Manager Linodes page - rescue option highlighted](cloud-manager-linodes-page.png)

1.  In the **Rescue** form, select the disks you want to mount:

    ![Cloud Manager Rescue form - /dev/sda highlighted](cloud-manager-rescue-form-dev-sda-highlighted.png)

    {{< note >}}
    Make a note of which devices the disks are assigned to (e.g. `/dev/sda`, `/dev/sdb`, etc). For example, in the screenshot shown above, the Ubuntu disk corresponds to `/dev/sda`. These assignments are where you can mount the disks from inside Rescue Mode.
    {{< /note >}}

1.  If you need to assign additional disks to be accessible inside Rescue Mode, click the **Add Disk** option:

    ![Cloud Manager Rescue form - Add Disk highlighted](cloud-manager-rescue-form-add-disk-highlighted.png)

    {{< note >}}
    You can assign up to 7 disks in Rescue Mode. `/dev/sdh` is always assigned to the Finnix recovery distribution.

    For best results, you should review the names that your Compute Instance's disks are using in your [configuration profile](/docs/products/compute/compute-instances/guides/configuration-profiles/) (`/dev/sda`, `/dev/sdb`, etc.) and match those names to the device assignments you specify in the Rescue form before starting Rescue Mode.

    Matching these names will be especially important if you need to [change root](#change-root) within Rescue Mode. The chroot will be able to read your Compute Instance's `/etc/fstab` file, which defines where and how your instance mounts its disks when booting up, to automatically apply the correct mount options and mount directories to your disks.

    A mismatch in the names of your disks between your Compute Instance's configuration profile and your Rescue Mode environment may cause the chroot to mount these disks in the wrong location or with the wrong mount options. As a result, it is important to ensure that these names match.
    {{< /note >}}

1.  Click the **Reboot into Rescue Mode** button. The Compute Instance reboots into Rescue Mode, and the progress percentage appears. When the instance appears as **Running** again, proceed to [Connecting to a Compute Instance Running in Rescue Mode](#connecting-to-a-compute-instance-running-in-rescue-mode).

    ![Cloud Manager Rescue form - reboot progress bar highlighted](cloud-manager-rescue-form-reboot-progress-bar-highlighted.png)

### Connecting to a Compute Instance Running in Rescue Mode

By default, Rescue Mode's Finnix environment does not accept SSH connections. To access the Compute Instance when it's running in Rescue Mode, connect to it through the *Lish* console.

{{< note >}}
It is possible to enable SSH for Rescue Mode by manually starting the SSH daemon. Using SSH can provide a better experience and allows you to copy files off of the server. Review the [Starting SSH](#starting-ssh) section for instructions. You need to use Lish at least once in order to start SSH.
{{< /note >}}

To connect with Lish:

1.  From the Compute Instance's detail page, click the **Launch Console** button:

    ![Cloud Manager Linode detail page - Launch Console button highlighted](cloud-manager-rescue-tab-launch-console-highlighted.png)

1.  A new window appears which displays your Lish console, a `Welcome to Finnix!` message, and a root prompt:

    ![Cloud Manager Lish console](cloud-manager-new-lish-window.png)

Review the [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/) guide for further explanation of the Lish console and alternative methods for accessing it, including [from your computer's terminal application](/docs/products/compute/compute-instances/guides/lish/#through-ssh-using-a-terminal).

### Starting SSH

The Finnix recovery distribution does not automatically start an SSH server, but you can enable one manually. This is useful if your Compute Instance does not boot and you need to copy files off of the disks. You can also copy entire disks over SSH. To start SSH:

1.  Open the [Lish console](#connecting-to-a-compute-instance-running-in-rescue-mode) for your Compute Instance.

1.  Set the `root` password for the Finnix rescue environment by entering the following command:

    ```command
    passwd
    ```

    {{< note >}}
    This root password is separate from the root password of the disk that you normally boot from. Setting the root password for Finnix does not affect the root account of the distribution.
    {{< /note >}}

1.  Enter the new password for the `root` user.

1.  Start the SSH server:

    ```command
    service ssh start
    ```

You can now connect to the server as root with the SSH client on a local computer. You can also access mounted disks with an SFTP client:

- For instructions on connecting with an SFTP client, see the [File Transfer reference manuals](/docs/tools-reference/file-transfer/).

- For instructions on copying an entire disk over SSH, see [Copy a Disk Over SSH](/docs/products/compute/compute-instances/guides/copy-a-disk-image-over-ssh/).

### Performing a File System Check

You can use the `e2fsck` system utility (short for "ext file system check") to check the consistency of filesystems and repair any damage detected on ext file systems. If you suspect that the Compute Instance's filesystem is corrupted, run `e2fsck` to check for and repair any damage on most disks:

1.  Enter the `df -h` command to verify that the primary disks are not currently mounted:

    ```command
    df -h
    ```

    ```output
    Filesystem      Size  Used Avail Use% Mounted on
    udev            1.9G     0  1.9G   0% /dev
    tmpfs           395M  516K  394M   1% /run
    /dev/sr0        503M  503M     0 100% /run/live/medium
    /dev/loop0      426M  426M     0 100% /run/live/rootfs/filesystem.squashfs
    tmpfs           2.0G   17M  2.0G   1% /run/live/overlay
    overlay         2.0G   17M  2.0G   1% /
    tmpfs           2.0G     0  2.0G   0% /dev/shm
    tmpfs           5.0M     0  5.0M   0% /run/lock
    tmpfs           4.0M     0  4.0M   0% /sys/fs/cgroup
    tmpfs           2.0G     0  2.0G   0% /tmp
    tmpfs           395M     0  395M   0% /run/user/0pressed_root
    unionfs         739M 1016K  738M   1% /
    devtmpfs         10M     0   10M   0% /dev
    ```

    The primary disks should not appear in the list. In the [example screenshot](cloud-manager-rescue-form-dev-sda-highlighted.png) from the [Booting into Rescue Mode](#booting-into-rescue-mode) section, the Ubuntu 18.04 disk is assigned to `/dev/sda`. Because this device does not appear in the example output from `df -h`, run a filesystem check on it.

    {{< note type="alert" >}}
    Never run `e2fsck` on a mounted disk. Do not continue unless you're sure that the target disk is unmounted.
    {{< /note >}}

1.  Run `e2fsck` by entering the following command, replacing `/dev/sda` with the location of the disk you want to check and repair:

    ```command
    e2fsck -f /dev/sda
    ```

1.  If no problems are detected, `e2fsck` displays the tests it performed:

    ```output
    e2fsck 1.45.6 (20-Mar-2020)
    Pass 1: Checking inodes, blocks, and sizes
    Pass 2: Checking directory structure
    Pass 3: Checking directory connectivity
    Pass 4: Checking reference counts
    Pass 5: Checking group summary information
    /dev/sda: 44611/2564096 files (0.1% non-contiguous), 602550/10240000 blocks
    ```

1.  If `e2fsck` determines that there is a problem with the filesystem, it prompts you to fix problems as they are found during each test:

    ```output
    e2fsck 1.45.6 (20-Mar-2020)
    ext2fs_open2: Bad magic number in super-block
    e2fsck: Superblock invalid, trying backup blocks...
    Resize inode not valid.  Recreate<y>?
    ```

    Press **enter** to automatically attempt to fix the problems.

    After the filesystem check completes, any problems detected should be fixed. Try rebooting the Compute Instance from the Cloud Manager. If `e2fsck` fixed the issues, the instance should boot normally.

### Installing Packages

The Finnix recovery distribution is based on Debian, so you can use the [`apt` package management system](/docs/guides/apt-package-manager/) to install additional software packages in the temporary rescue environment. For example, you could install and run the `nmon` utility by using the following commands:

```command
apt update
apt install nmon
nmon
```

The software packages you install is available as long as the Compute Instance is running in Rescue Mode.

### Mounting Disks

{{< note >}}
Before you mount the disk check the location of the root partition in the `/etc/fstab` file and update it accordingly. In the following example `/dev/sda` is the location of the disk. For more information, see the [Update your fstab](/docs/products/compute/compute-instances/guides/install-a-custom-distribution/#update-your-fstab) guide.
{{< /note >}}

By default, your disks are not mounted when your Compute Instance boots into Rescue Mode. However, you can manually mount a disk under Rescue Mode to perform system recovery and maintenance tasks.

These instructions mount the `/dev/sda` disk. If you are mounting a different disk, replace `sda` with the name of your disk throughout these instructions.

1.  Create a new directory for your disk:

    ```command
    mkdir -p /media/sda
    ```

1.  Mount the disk to make its contents available at the `/media/sda` directory:

    ```command
    mount -o barrier=0 /dev/sda /media/sda
    ```

1.  View the contents of the disk to confirm you can access them:

    ```command
    ls /media/sda
    ```

    You can now read and write to files on the mounted disk.

{{< note >}}
You can unmount your disk by running the `unmount` command. You may want to unmount your disk to  [run a file system check](#performing-a-file-system-check), for example.

The `umount` command requires you to specify the device you want to unmount. You may specify this device in one of two ways:

- Specify the device name itself:

    ```command
    umount /dev/sda
    ```

- Specify the mount directory:

    ```command
    umount /media/sda
    ```
{{< /note >}}

If you would like to mount or unmount additional disks on your system, repeat these instructions with the appropriate substitutions.

### Change Root

*Changing root* is the process of changing your working root directory. When you change root (abbreviated as *chroot*) to your root disk, you are able to run commands as though you are logged into that system.

Chroot allows you to change user passwords, remove/install packages, and do other system maintenance and recovery tasks in your Compute Instance's normal Linux environment.

1.  Create a new directory for your disk:

    ```command
    mkdir -p /media/sda
    ```

1.  Before you use chroot, mount the root disk:

    ```command
    mount -o exec,barrier=0 /dev/sda /media/sda
    ```

    {{< note >}}
    If you mounted your disk without using the `exec` option prior to reviewing this section, include the `remount` option in your `mount` command:

    ```command
    mount -o remount,exec,barrier=0 /dev/sda /media/sda
    ```
    {{< /note >}}

1.  To create the chroot, you need to mount the temporary filesystems:

    ```command
    cd /media/sda
    mount -t proc proc proc/
    mount -t sysfs sys sys/
    mount -o bind /dev dev/
    mount -t devpts pts dev/pts/
    ```

1.  Chroot to your disk:

    ```command
    chroot /media/sda /bin/bash
    ```

1.  Your Compute Instance may expect its other disks to be mounted in specific directories during its regular operations. These disks and their expected directories are defined in the `/etc/fstab` file. In order for these directories to be accessible within the chroot, you need to mount them from within the chroot. For example, if your instance defines `/dev/sdc` in its `/etc/fstab`, you can the following command to mount it:

    ```command
    mount /dev/sdc
    ```

    {{< note >}}
    This `mount` command only specifies a disk name without specifying a mount point. This causes `mount` to use the `/etc/fstab` file in the chroot to determine the mount point and apply the correct mount options.

    As a result, this command depends on you having made these disks available to your Rescue Mode environment under the same names that they use in your [configuration profile](/docs/products/compute/compute-instances/guides/configuration-profiles/).

    If these names do not match, mounting your disks using only a device name will either fail completely, mount them at the wrong directory, and/or apply the wrong mount options to them.

    The easiest way to alleviate this problem is by [starting a new Rescue Mode session from Cloud Manager](#booting-into-rescue-mode) which properly matches these disk names between your Rescue Mode environment and your configuration profile.
    {{< /note >}}

1.  To exit the chroot and get back to Finnix type "exit" :

    ```command
    exit
    ```

## Rebuilding

If you can't rescue and resolve issues on an existing disk, you likely need to rebuild the Compute Instance. Rebuilding the instance is the process of starting over with a set of known-good disks that you can boot from. There are a few different ways you can do this:

-   If you are subscribed to the [Backup Service](https://www.linode.com/backups), you can [restore from an existing backup](#restoring-from-a-linode-backup) and return the Compute Instance to a previous state.

-   If you aren't subscribed to the Backup Service, you can copy files off an existing disk and then [use the Rebuild feature](#use-the-rebuild-feature) of the Cloud Manager to erase everything and start over again from scratch.

-   If you have a backup system other than the Backup Service in place, you can [rebuild your Compute Instance](#use-the-rebuild-feature) and then restore the data from that backup service. The methods for restoring data varies by the kind of backup system that you use.

{{< note type="alert" >}}
Did an unauthorized intruder gain access to your Compute Instance? Since it is virtually impossible to determine the full scope of an attacker's reach into a compromised system, you should never continue using a compromised system.

Linode recommends that you follow the instructions in [Recovering from a System Compromise](/docs/guides/recovering-from-a-system-compromise/). You need to create a new Compute Instance, copy your existing data from the old instance to the new one, and then swap IP addresses.
{{< /note >}}

### Restoring from a Backup

If you previously enabled the [Backup Service](https://www.linode.com/backups), you may be able to restore one of the backups to the Compute Instance. Review the [Restoring from a Backup](/docs/products/storage/backups/#restore-from-a-backup) section (specifically, the [Restore to an Existing Compute Instance](/docs/products/storage/backups/guides/restore-to-an-existing-linode/) section) of the [The Backup Service](/docs/products/storage/backups/) guide for instructions.

If you created backups with an application other than Linode's Backup Service, review the application's instructions to restore a backup to the Compute Instance.

### Use the Rebuild Feature

The Cloud Manager provides a *Rebuild* feature performs the following two actions:

1.  The current disks are removed.

1.  A new set of disks is provisioned from one of the Cloud Manager's built-in Linux images, or from one of the [saved images](/docs/products/tools/images/).

    {{< note type="alert" >}}
    If you use the Rebuild feature, the data from the disks that are deleted are not retrievable. You may [back up your data manually](/docs/guides/backing-up-your-data/) or [create a snapshot through Linode's Backup Service](/docs/products/storage/backups/#take-a-manual-snapshot) to preserve data before using the Rebuild feature.

    If you'd like to deploy a new Linux distribution without erasing the existing disks, follow the instructions in the [Creating a Disk](/docs/products/compute/compute-instances/guides/disks-and-storage/#creating-a-disk) guide. This is a better option if you need to create a new distribution, but also need to save the existing data.

    The Compute Instance needs to have some amount of unallocated disk space in order to provision a new distribution. If the instance does not have enough unallocated space, you can [shrink your existing disks](/docs/products/compute/compute-instances/guides/disks-and-storage/#resizing-a-disk) to free up space or [resize your Compute Instance](/docs/products/compute/compute-instances/guides/resize/) to a higher resource tier.
    {{< /note >}}

    If you need to copy files from your existing disk to another location before rebuilding, you can [start SSH](#starting-ssh) under Rescue Mode and then use an SFTP client to copy files to your computer.

To use the Rebuild feature:

1.  If you need to copy files from existing disk to another location before rebuilding, you can [start SSH](#starting-ssh) under Rescue Mode and then use an [SFTP client](/docs/tools-reference/file-transfer/) to copy files to your computer, another server, or somewhere else.

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Click on the **Linodes** link in the sidebar:

    ![Cloud Manager dashboard - Linodes sidebar link highlighted](cloud-manager-dashboard.png)

1.  Click on the **more options ellipsis** next to the Compute Instance that will be rebuilt, and click on the Rebuild option to open the Rebuild form:

    ![Cloud Manager Linodes page - rebuild option highlighted](cloud-manager-linodes-rebuild.png)

1.  Complete the Rebuild form. Select an image or StackScript to deploy and enter a root password. Optionally, select one or more SSH keys (if you have not added any SSH Keys via the Cloud Manager, this option does not appear).

    {{< content "password-requirements-shortguide" >}}

1.  Click on **Rebuild** button after completing the form:

    ![Cloud Manager Rebuild form - Rebuild button highlighted](cloud-manager-rebuild-form-rebuild-button-highlighted.png)

1.  The Compute Instance may take several minutes to complete the rebuild process. Select the instance that is being rebuilt and select the `Activity Feed` tab to monitor rebuild progress and confirm that the rebuild has been completed:

    ![Linode Cloud Manager Activity - Activity](cloud-manager-rescue-activity.png)
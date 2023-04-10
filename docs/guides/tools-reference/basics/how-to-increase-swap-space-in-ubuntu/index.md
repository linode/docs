---
slug: how-to-increase-swap-space-in-ubuntu
description: 'Need to know how to increase swap space in Ubuntu? Guard yourself against out-of-memory errors and add swap space to your server today. ✓ Read more here!'
keywords: ['how to increase swap space in ubuntu','ubuntu swap file','linux swap space size','create swap partition ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-12-06
modified: 2023-03-29
modified_by:
  name: Linode
title: "Step-by-Step Guide: How to Increase Swap Space in Ubuntu"
title_meta: "Learn How to Create a Swap File in Ubuntu"
external_resources:
- '[Ubuntu SwapFAQ](https://help.ubuntu.com/community/SwapFaq)'
- '[Linux man page for the dd command](https://pubs.opengroup.org/onlinepubs/7908799/xcu/dd.html)'
- '[Ubuntu man page for the swapon command](https://manpages.ubuntu.com/manpages/focal/man8/swapon.8.html)'
- '[Ubuntu man page for the mkswap command](http://manpages.ubuntu.com/manpages/focal/man8/mkswap.8.html)'
authors: ["Jeff Novotny"]
---

Systems trying to run large, memory-intensive applications with limited RAM can run into serious issues. Operations might become very slow, and the application can sometimes freeze completely or crash with out-of-memory errors. One workaround for this issue is to create extra swap space on the hard drive. The application can use this extra memory supply when RAM is running low. This guide explains the concept of swap space, and demonstrates how to increase swap space on Ubuntu.

## What is Swap?

To understand how swap space works, it is also important to distinguish between two types of computer memory. These are *Random Access Memory* (RAM) and the more permanent *hard disk drive* (HDD) or *solid-state drive* (SSD) storage. RAM memory is volatile and designed to temporarily hold data during program execution. The RAM contents change quickly and require electricity to maintain. If power to the system is shut down, all data in RAM is lost. The storage drives are designed to permanently store data. If the system is rebooted, the data on the drive is still intact. Computer storage drives have a much larger capacity than RAM does, but RAM access is significantly faster.

Swap space is located on the system's storage drive. A swap file is a pre-allocated file that is configured to hold system swap data. A swap file is easier to resize than a partition when more swap space is required. On a virtual machine, where partitions are not available, a swap file is the only available option.

Even though the swap file is located on the storage drive, the system can use this space as if it were part of RAM. Active program data can be temporarily stored in either place. This process is not transparent to the user, as it is not possible to tell where any given piece of data is being stored.

The system uses RAM preferentially, but switches to using the swap space as necessary. As working memory is used up, Ubuntu temporarily stores data or modules in the swap area. Many programs are optimized to keep frequently used information in RAM, while background or inactive data is stored in the swap file. Ubuntu provides the user-configurable `swappiness` variable to indicate how frequently swap space should be used.

As of release 17.04, Ubuntu uses a swap file rather than a partition. However, assuming your Linode is setup with our normal configurations, it has a 512MB swap disk rather than a swap file.

{{< note >}}
To increase the size of the swap partition, first power off your Linode from the Cloud Manager. Then simply navigate to the **Storage** tab of your Linode, and click **Resize** next to your swap partition.
{{< /note >}}

## Advantages and Disadvantages of Using Swap Space

Swap files provide several benefits, but they have a few drawbacks too. Here are some of the advantages of using swap space.

-   It helps guard against out-of-memory errors, along with related program freezes and system crashes.
-   It increases the amount of functional memory and makes it easier to run memory-intensive applications.
-   It enables the use of the Ubuntu hibernation feature. For more information on this feature, consult the [*Ubuntu swap FAQ*](https://help.ubuntu.com/community/SwapFaq).

Here are the main disadvantages of configuring a swap file on Ubuntu.

-   It can cause excessive disk wear on older SSD drives. This is because working memory is accessed far more frequently than the permanent storage drive. Newer SSD drives do not typically have this problem.
-   Accessing swap space is slower than using RAM. The penalty depends on the system architecture. However, programs with strict performance requirements can suffer significant slowdowns.

Overall, it is usually better to treat swap space as a safety mechanism to avoid memory errors and crashes. If a system has to consistently access the swap file during regular operations, consider upgrading it with more RAM.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Increase Swap Space in Ubuntu

The examples that follow are from Ubuntu 22.04 LTS. However, the same steps can be used for Ubuntu 20.04 LTS and 18.04 LTS. On 16.04 LTS, it is necessary to use a swap partition to add swap space. These instructions are only valid for creating a swap file on Ubuntu and are not necessarily accurate on other Linux distributions.

It is important to configure a large enough swap file. However, very large files are typically not necessary. A system with 2GB of RAM or less should have a swap file that is twice as large as the RAM. For larger systems, 4GB should suffice. The optimal amount of swap space depends on the system and how it is used.

It is possible to create multiple swap files. However, it is better to configure one swap file, especially because it is possible to resize it later. You can also use a swap file along with a swap partition.

### How to Create a Swap File on Ubuntu

1.  Some systems automatically configure a swap file during installation. To determine whether the system already has a swap file, use the `swapon --show` command. If any files are displayed, this means one or more swap files already exist. Proceed to the "How to Increase Existing Swap Space" section for information on how to resize a swap file.

    ```command
    sudo swapon --show
    ```

    If a swap file has already been created, it is shown as follows. If there is no swap file, there is no output.

    ```output
    NAME     TYPE      SIZE USED PRIO
    /swapfile file 1024M   0B   -2
    ```

    If you created a Linode using the standard configuration, you should see a swap partition instead:

    ```output
    NAME     TYPE      SIZE USED PRIO
    /dev/sdb partition 512M   0B   -2
    ```

2.  Confirm swap space has not already been allocated using the `free` command. This command can be used on most Linux systems to verify the swap space size.

    ```command
    free -h
    ```
    If the total memory for `Swap` is `0B`, a swap file or partition has not been created yet.

    ```output
                  total       used        free      shared  buff/cache   available
    Mem:          3.8Gi       523Mi       2.7Gi       3.0Mi       643Mi       3.1Gi
    Swap:            0B          0B          0B
    ```

    If you created a Linode using the standard configuration, you should see a approximately 512MB dedicated to swap:

    ```output
                  total        used        free      shared  buff/cache   available
    Mem:           1.9Gi       154Mi       1.4Gi       0.0Ki       410Mi       1.6Gi
    Swap:          511Mi          0B       511Mi
    ```

3.  Ensure there is enough space on the hard drive to create the swap space. Use the `df -h` command and locate the entry for the root directory, which is listed as `/`. The proposed swap file should fit comfortably within the available disk space with some room to spare. The following example indicates the hard drive has 64G of available space. This is more than adequate.

    ```command
    df -h
    ```

    ```output
    Filesystem      Size  Used Avail Use% Mounted on
    ...
    /dev/sda         49G  3.4G   43G   8% /
    ...
    ```

4.  Allocate memory for the swap file using the `fallocate` command. This command is used to reserve a certain amount of disc space for a file in advance. The following command creates a 1G file named `swapfile` in the root directory. Always give a swap file a very obvious name to avoid confusion.

    ```command
    sudo fallocate -l 1G /swapfile
    ```

5.  Change the file permissions for `swapfile` so only `root` can write to it. This prevents other users from accidentally deleting or overwriting the file.

    ```command
    sudo chmod 600 /swapfile
    ```

6.  Run the `ls` command to confirm the swap file has been successfully created. Use the `-l` option to see the size of the file.

    ```command
    ls -hl /swapfile
    ```

    ```output
    -rw------- 1 root root 1.0G Nov 28 13:22 /swapfile
    ```

7.  Use the `mkswap` command to designate the new file as a swap file. This means it can be used for volatile memory when RAM space runs low.

    ```command
    sudo mkswap /swapfile
    ```

    ```output
    Setting up swapspace version 1, size = 1024 MiB (1073737728 bytes)
    no label, UUID=97644d2b-0608-4a32-bfb1-b069af64d86b
    ```

8.  The file swap has now been created, but it is still disabled. Activate it using the `swapon` command.

    ```command
    sudo swapon /swapfile
    ```

9.  The `swapon` command can be used with the `--show` option to confirm the swap space is enabled. If the new swap file is not listed, verify the results of the previous instructions.

    ```command
    sudo swapon --show
    ```

    ```output
    NAME      TYPE       SIZE USED PRIO
    /dev/sdb  partition  512M   0B   -2
    /swapfile file      1024M   0B   -3
    ```

10. To confirm the amount of swap space available on Ubuntu, use the `free` command. The `total` column for the `Swap` entry should display `1.5Gi` of total memory (1.0GB swap file and 0.5GB swap partition).

    ```command
    free -h
    ```

    ```output
                  total        used        free      shared  buff/cache   available
    Mem:           1.9Gi       148Mi       1.4Gi       0.0Ki       416Mi       1.6Gi
    Swap:          1.5Gi          0B       1.5Gi
    ```

### Making the Swap File Changes Permanent

At this point, the new swap file is fully functional and the system can use it. Unfortunately, the file is not permanent. The swap file disappears after a system reboot and must be recreated before it can be used again.

To automatically create the swap file when the system boots, add it to the `/etc/fstab` file. Each entry in this file contains the following fields, in the following order.

-   **Device Name**: This is the full path and name of the swap file. In this example, it is `/swapfile`.
-   **Default Mount Point**: This must be `swap`.
-   **Filesystem Type**: This is also `swap`.
-   **The Mount Options**: Use the keyword `defaults` to use the system defaults.
-   **Dump Options**: Set this to `0`.
-   **Filesystem Check Options**: This must also be set to `0`.

To add an entry to the `fstab` file, follow these steps:

1.  As a precaution, make a backup copy of the existing `fstab` file.

    ```command
    sudo cp /etc/fstab /etc/fstab.bak
    ```

2.  Edit the file using a text editor.

    ```command
    sudo nano /etc/fstab
    ```

3.  Add the following line to the end of the file.

    ```file {title="/etc/fstab" lang="conf"}
    /swapfile       swap            swap    defaults          0     0
    ```

4.  Save and close the file. The swap file should appear automatically after a system reboot.

### Adjust the Swappiness Setting

The *swappiness* property controls how aggressively Ubuntu swaps data out of RAM. This setting extends from 0 to 100. Higher values tell the system to use the swap file more often. Configure a setting at the upper end of this range to ensure RAM is also available for other applications. Unfortunately, a very high setting can compromise performance. A low swappiness setting means the system is less likely to use the swap mechanism. Use a setting closer to zero when application performance is important.

To adjust the `swappiness` setting, use the following procedure.

1.  Verify the current `swappiness` setting. The default value is `60`.

    ```command
    cat /proc/sys/vm/swappiness
    ```

    ```output
    60
    ```

2.  To temporarily adjust the value of `swappiness`, use the `sysctl` utility. The following command lowers the value to `50`.

    ```command
    sudo sysctl vm.swappiness=50
    ```

    ```output
    vm.swappiness = 50
    ```

3.  To permanently change this value, edit the `sysctl.conf` file. Add the following line to the bottom of the file.

    ```file {title="/etc/sysctl.conf" lang="conf"}
    vm.swappiness=50
    ```

### How to Increase Existing Swap Space on Ubuntu

One advantage of using a swap file over the old partitioning method is the relative ease to resize an existing swap. On an Ubuntu system, follow these steps to add swap space.

1.  Disable the swap mechanism. Active applications cannot use the swap file while it is disabled.

    ```command
    sudo swapoff -a
    ```

    {{< note >}}
    This also temporarily disables your swap partition until the next reboot.
    {{< /note >}}

2.  Resize the swap space. `fallocate` can only be used to generate a new file, so the `dd` command must be used instead. Set the individual parameters as follows:

-   `if` must be set to `/dev/zero`.
-   The `of` variable, standing for "output file", must be set to the name of the swap file. In this example it is set to `/swapfile`.
-   Set `bs`, or "block size", to `1G`.
-   The value for `count` indicates how many blocks are allocated. To determine the value of `count`, divide the intended file size by the block size. For example, set the value of `count` to `2` to generate a 2G swap file.

    ```command
    sudo dd if=/dev/zero of=/swapfile bs=1G count=2
    ```

    ```output
    2+0 records in
    2+0 records out
    2147483648 bytes (2.1 GB, 2.0 GiB) copied, 7.86524 s, 273 MB/s
    ```

3.  Ensure the permissions are set correctly.

    ```command
    sudo chmod 600 /swapfile
    ```

4.  Convert the file back into swap format.

    ```command
    sudo mkswap /swapfile
    ```

    ```output
    Setting up swapspace version 1, size = 2 GiB (2147479552 bytes)
    no label, UUID=6e61561d-c03d-4911-9343-8aa4c234576a
    ```

5.  Enable the swap file.

    ```command
    sudo swapon /swapfile
    ```

    {{< note >}}
    To also re-enable the swap partition, use `sudo swapon -a` instead.
    {{< /note >}}

6.  Confirm the file has been resized correctly and is ready for use using either the `free` or `swapon --show` command.

    ```command
    free -h
    ```

    ```output
                  total        used        free      shared  buff/cache   available
    Mem:           1.9Gi       138Mi       1.0Gi       0.0Ki       771Mi       1.6Gi
    Swap:          2.0Gi          0B       2.0Gi
    ```

    ```command
    sudo swapon --show
    ```

    ```output
    NAME      TYPE SIZE USED PRIO
    /swapfile file   2G   0B   -2
    ```

{{< note >}}
It is not necessary to edit `cat /etc/fstab` or edit the swappiness value again, because those items are unaffected by the change.
{{< /note >}}

## A Summary of Swap Space on Ubuntu

A swap file is used to avoid running out of RAM when using memory-intensive applications. Ubuntu uses swap space to store information that would ordinarily be held in RAM on the hard drive. This guards against freezes and crashes, but can negatively affect performance.

Most systems are designed to hold active memory in RAM under normal circumstances. However, the `swappiness` setting configures the system to use the swap space more or less preferentially. This guide provides detailed instructions on how to increase swap space on Ubuntu. The memory for a swap file can be allocated using the Ubuntu `fallocate` command. The file can then be converted into swap space using the `mkswap` command, and enabled with `swapon`.

You can configure swap space on a Linode whenever you are temporarily running a memory-intensive application, or as a preventative measure. Choose from a high-performance [*Dedicated CPU*](https://www.linode.com/products/dedicated-cpu/) service, or a flexible and affordable [*Shared CPU*](https://www.linode.com/products/shared/) alternative.
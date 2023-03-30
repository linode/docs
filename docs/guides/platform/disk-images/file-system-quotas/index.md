---
slug: file-system-quotas
description: 'How to set Filesystem Quotas on Ubuntu 22.04.'
keywords: ["filesystem", "quotas", "disk space", "limit disk", "ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2023-03-14
title: 'Setting Filesystem Quotas on Ubuntu 22.04'
title_meta: 'How To Set Filesystem Quotas on Ubuntu 22.04'
external_resources:
 - '[Official Documentation for Quota subsystem](https://www.kernel.org/doc/html/next/filesystems/quota.html)'
tags: ["ubuntu","filesystem","limit disk"]
authors: ["Rajakavitha Kodhandapani"]
---

In this guide, learn how to use quotas to limit the amount of disk space a user or group can use on a filesystem.

The quota subsystem allows system administrator to set limits on the space used by each file or directory for users or groups.

## Before You Begin

- Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

- Complete the sections of our [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services.

- Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install the Quota Tools

1. Install the quota command line tools using `apt` package manager:

    ```
    sudo apt update
    sudo apt install quota
    ```

1. Verify that the tools are installed:

    ```
    quota --version
    ```

1. Verify that you have the required kernel modules to support quota management:

    ```
    find /lib/modules/ -type f -name '*quota_v*.ko*'
    ```

    The output is similar to:

    ```output
    /lib/modules/5.15.0-60-generic/kernel/fs/quota/quota_v2.ko
    /lib/modules/5.15.0-60-generic/kernel/fs/quota/quota_v1.ko
    ```

    Make a note of the version of the kernel listed in the file path.

    {{< note >}}
    If there are no kernel modules, you can install them using `sudo apt install linux-image-extra-virtual`.
    {{< /note >}}

1. Update the mount options for the filesystem by updating the corresponding entry in `/etc/fstab` configuration file, using an editor of your choice to:

   {{< file "/etc/fstab" >}}
    /etc/fstab: static file system information.
    #
    # Use 'blkid' to print the universally unique identifier for a
    # device; this may be used with UUID= as a more robust way to name devices
    # that works even if disks are added and removed. See fstab(5).
    #
    # <file system> <mount point>   <type>  <options>       <dump>  <pass>
    /dev/sda        /               ext4    usrquota,grpquota 0     1
    /dev/sdb        none            swap    sw                0     0
    {{< /file >}}

    The options `usrquota` and `grpquota` enables quotas on the filesystem for both users and groups. Ensure that you add the new options separated by a comma and no spaces.

1.  Remount the filesystem with the new options:

    ```
    sudo mount -o remount /
    ```
1.  Verify that the new options are used to mount the filesystem:

    ```
    cat /proc/mounts | grep ' / '
    ```
    The output is similar to:

    ```output
    /dev/sda / ext4 rw,relatime,quota,usrquota,grpquota,errors=remount-ro 0 0
    ```
1. Create the `aquota.user`, and `aquota.group` files that contain information about the limits and the usage of the filesystem:

    ```
    sudo quotacheck -ugm /
    ```
    The option `u` creates the `aquota.user` file for users, the `g` option creates the `aquota.group` file groups, and the `m` option disables remounting the filesystem as read-only.
    You can view the quota files that are created using the `ls /` command.

1.   Add the quota modules to the Linux kernel using the `<kernel_version>` that you made a note of:

     ```
     sudo modprobe quota_v1 -S <kernel_version>
     sudo modeprobe quota_v2 -S <kernel_version>
     ```

1.  Turn on the quota system using:

     ```
     sudo quotaon -v /
     ```
    The output is similar to

    ```output
    quotaon: Your kernel probably supports ext4 quota feature but you are using external quota files. Please switch your filesystem to use ext4 quota feature as external quota files on ext4 are deprecated.
    quotaon: using //aquota.group on /dev/sda [/]: Device or resource busy
    quotaon: using //aquota.user on /dev/sda [/]: Device or resource busy
    ```
    You can ignore the message about switching the filesystem to use ext4 quota feature.

### Configure Quotas for a User

1. To edit quota for the sudo user `<example_user>` that you added when securing your Linode compute instance, enter the following:

   ```
   sudo setquota -u <example_user> 100M 110M 0 0 /
   ```
1. Check the new quota for the user:

   ```
   sudo quota -v <example_user>
   ```
   The output is similar to:

   ```output
      Disk quotas for user rajie (uid 1000):
      Filesystem   space   quota   limit   grace   files   quota   limit   grace
       /dev/sda     40K    100M     110M               8       0       0
   ```
1. You can generate a report for the quota usage of all users on a filesystem:

   ```
   sudo repquota -s /
   ```

   The output is similar to:

   ```output
   *** Report for user quotas on device /dev/sda
   Block grace time: 10days; Inode grace time: 10days
                           Space limits                File limits
   User            used    soft    hard  grace    used  soft  hard  grace
   ----------------------------------------------------------------------
   root      --   3746M      0K      0K           119k     0     0
   man       --   1460K      0K      0K            155     0     0
   systemd-timesync --      4K      0K      0K              2     0     0
   syslog    --  23588K      0K      0K              7     0     0
   _apt      --     36K      0K      0K              6     0     0
   tss       --      4K      0K      0K              1     0     0
   pollinate --      4K      0K      0K              2     0     0
   landscape --      8K      0K      0K              3     0     0
   fwupd-refresh --      4K      0K      0K              1     0     0
   example_user     --     24K    200M    220M              8     0     0

If you want your users to be able to check their quotas, even if they do not have sudo access, then you need to give them permission to read the quota files you created. Create a users group, make those files readable by the users group, and then make sure all your users are added in the group.
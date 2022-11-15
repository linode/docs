---
author:
  name: Linode
  email: docs@linode.com
title: "Troubleshooting"
description: "Troubleshooting issues related to the Linode Backup Service."
---

## Linode Backup Disk Won't Boot

If you are restoring a single backup disk to your Linode, then the new disk will have a different UUID than the original. When this happens, configuration files on the Linode may still be referencing the old UUID of the original disk, instead of the new one, causing boot issues. If this is the case, you will likely see errors related to the UUID in your console when booting in [Rescue Mode](/docs/guides/rescue-and-rebuild/#booting-into-rescue-mode):

{{< output >}}
    ALERT!  UUID=xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx does not exist.  Dropping to a shell!
{{< /output >}}

To fix this error, you will need to boot into [Rescue Mode](/docs/guides/rescue-and-rebuild/#booting-into-rescue-mode) and edit your `/etc/fstab` file to account for the new UUID. This can be done in the following steps:

1. Follow the instructions for [Booting Into Rescue Mode](/docs/guides/rescue-and-rebuild/#booting-into-rescue-mode) using our Rescue and Rebuild guide. Once you have successfully completed step 4 in the section to [Change Root](/docs/guides/rescue-and-rebuild/#change-root), proceed to the next step.

1. Enter the following command to obtain the UUID of your current disk:

        blkid

    Output will resemble the following:

    {{< output >}}
    /dev/sda: UUID="ecfd4955-9ce6-44ad-a8e4-275d5ac13ffc" TYPE="ext4"
  {{< /output >}}
    Copy _only_ the string surrounded by the quotation marks defining the `UUID` field in the output to use in the next step.

1. You should now have access to your disk's contents in the recovery environment. Check the contents of your `/etc/fstab` file for any entries pertaining to the UUID. This line may appear as follows:

    {{< output >}}
    UUID=41c22818-fbad-4da6-8196-c816df0b7aa8  /disk2p2      ext3    defaults,errors=remount-ro 0       1
  {{< /output >}}

1. Replace the string defining the UUID in the `/etc/fstab` file with the UUID of the disk you copied from the output of the `blkid` command.

1. After following all of the above steps, you should now be able to reboot your Linode normally.
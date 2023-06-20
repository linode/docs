---
title: "Troubleshooting Backups"
title_meta: "Troubleshooting Issues with the Backup Service"
description: "Get help diagnosing and solving issues related to the Linode Backup service, including backup failures and restore failures."
authors: ["Linode"]
modified: 2023-06-20
---

## Backup Failure

If the Linode Backup service ever fails to create a backup from your Compute Instance, you should receive a ticket or alert notifying you of the failure. In some cases, the underlying issue can resolve itself. However, there may be an issue on your Compute Instance that needs to be addressed before the Backup service can be successfully used. Here are common reasons why a backup failure might occur:

- **Disk can't be mounted:** If your disk is encrypted, formatted using an unsupported file system, or contains multiple partitions, the Backup service will not be able to mount your disk and perform a backup. We recommend reviewing our [Backup Limits and Considerations](/docs/products/storage/backups/#limits-and-considerations) and making sure your disk is compatible.

- **Large number of files:** The Backup service is file-based. Due to this, the overall number of files on your disk affects both the time needed for the backup and the success of that backup. There isn't a specific maximum number of files supported by the service. If you do notice that your backups are failing or taking a long time to run, we recommend auditing the number of files on your disk and considering ways to reduce the number of files. For more assistence, reference the following Community Site question: [Linode Backup Failure: Too Many Files](https://www.linode.com/community/questions/20092/linode-backup-failure-too-many-files)

## Disk Won't Boot After Restoring from a Backup

If you are restoring a single backup disk to your Compute Instance, then the new disk will have a different UUID than the original. When this happens, configuration files on the instance may still be referencing the old UUID of the original disk, instead of the new one, causing boot issues. If this is the case, you will likely see errors related to the UUID in your console when booting in [Rescue Mode](/docs/products/compute/compute-instances/guides/rescue-and-rebuild/#booting-into-rescue-mode):

```output
ALERT!  UUID=xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx does not exist.  Dropping to a shell!
```

To fix this error, you will need to boot into [Rescue Mode](/docs/products/compute/compute-instances/guides/rescue-and-rebuild/#booting-into-rescue-mode) and edit your `/etc/fstab` file to account for the new UUID. This can be done in the following steps:

1.  Follow the instructions for [Booting Into Rescue Mode](/docs/products/compute/compute-instances/guides/rescue-and-rebuild/#booting-into-rescue-mode) using our Rescue and Rebuild guide. Once you have successfully completed step 4 in the section to [Change Root](/docs/products/compute/compute-instances/guides/rescue-and-rebuild/#change-root), proceed to the next step.

1.  Enter the following command to obtain the UUID of your current disk:

    ```command
    blkid
    ```

    Output will resemble the following:

    ```output
    /dev/sda: UUID="ecfd4955-9ce6-44ad-a8e4-275d5ac13ffc" TYPE="ext4"
    ```

    Copy _only_ the string surrounded by the quotation marks defining the `UUID` field in the output to use in the next step.

1.  You should now have access to your disk's contents in the recovery environment. Check the contents of your `/etc/fstab` file for any entries pertaining to the UUID. This line may appear as follows:

    ```output
    UUID=41c22818-fbad-4da6-8196-c816df0b7aa8  /disk2p2      ext3    defaults,errors=remount-ro 0       1
    ```

1.  Replace the string defining the UUID in the `/etc/fstab` file with the UUID of the disk you copied from the output of the `blkid` command.

1.  After following all of the above steps, you should now be able to reboot your Compute Instance normally.
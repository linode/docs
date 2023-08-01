---
title: "Troubleshooting Backups"
title_meta: "Troubleshooting Issues with the Backup Service"
description: "Get help diagnosing and solving issues related to the Linode Backup service, including backup failures and restore failures."
authors: ["Linode"]
modified: 2023-07-07
---

## Backup Failure

If the Linode Backup service ever fails to create a backup from your Compute Instance, you should receive a ticket or alert notifying you of the failure. In some cases, the underlying issue can resolve itself. However, there may be an issue on your Compute Instance that needs to be addressed before the Backup service can be successfully used. Here are common reasons why a backup failure might occur:

- **Disk can't be mounted:** If your disk is encrypted, formatted using an unsupported file system, or contains multiple partitions, the Backup service will not be able to mount your disk and perform a backup. We recommend reviewing our [Backup Limits and Considerations](/docs/products/storage/backups/#limits-and-considerations) and making sure your disk is compatible.

- **Large number of files:** The Backup service is file-based. Due to this, the overall number of files on your disk affects both the time needed for the backup and the success of that backup. There isn't a specific maximum number of files supported by the service. If you do notice that your backups are failing or taking a long time to run, we recommend auditing the number of files on your disk and considering ways to reduce the number of files. For more assistance, refer to the [Too many files](#too-many-files) section below.

If you need help determining why your backups are failing, [contact our Support](https://www.linode.com/support/) team.

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

## Too Many Files

The amount of files on your system impacts the time it takes for the Backup service to generate a backup. In some cases, having a large number of files can contribute to backup failures. If you are experiencing multiple consecutive backup failures that do not resolve on their own, you may wish to audit the number of files on your system. While there isn't a specific limit to the number of files supported by our Backup service, it may be time to consider ways of reducing or consolidating your files if your system has a few million or more files.

To investigate the number of files and learn which directories contain the largest share of these files, log in to your instance and run the command below.

```command
sudo find / -type f | perl -aF/ -lne 'for (my $i=0; $i < @F-1; ++$i) { print join("/",@F[0...$i]); }' | sort | uniq -c | sort -nr | head -30
```

This outputs a list of the 30 directories with the highest file count, beginning with the total file count on your system. Each subsequent line contains the number of files followed by the absolute path of the directory. You can adjust the total number of directories that are displayed by changing the `head -30` portion of the command above.

```output
 294960
  92890 /sys
  75872 /sys/kernel
  74449 /usr
  63057 /proc
  56255 /opt
  50504 /opt/psa
  50096 /sys/kernel/slab
  45838 /opt/psa/admin
  35528 /opt/psa/admin/plib
  25405 /usr/share
  24952 /usr/lib
  24607 /opt/psa/admin/plib/modules
  22695 /usr/src
  ...
```

If the file count is high (which is not the case for the example above), examine the directory paths. If any directories with large file counts contain session data or application logs, you may want to optimize the related applications so that they generate or store less files. To reduce the number of files that have already been generated, you can remove any files that are not important and create an archive of any files you wish to keep. You can do this manually or create a cron job to delete or archive files automatically at regular intervals. Before removing or archiving any files, consult your developers or system administrator.

- [Archiving and Compressing files with GNU Tar and GNU Zip](/docs/guides/archiving-and-compressing-files-with-gnu-tar-and-gnu-zip/)
- [Using Cron to Schedule Tasks for Certain Times or Intervals](/docs/guides/schedule-tasks-with-cron/)
- [Linode Backup Failure: Too Many Files](https://www.linode.com/community/questions/20092/linode-backup-failure-too-many-files) Community Site post
---
title: Backups
description: "Linode Backup service is fully managed, easy, and configurable."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Fully managed automatic daily, weekly, and biweekly backups of your Linode Compute Instances."
toc: true
aliases: ['/security/backups/linode-backup-service/','/platform/disk-images/linode-backup-service-classic-manager/','/platform/backup-service/','/platform/linode-backup-service/','/platform/disk-images/linode-backup-service/','/platform/disk-images/linode-backup-service-new-manager/','/backup-service/','/guides/linode-backup-service/']
---

Safeguard your data with Linode's Backups service, enabling automatic backups of the disks on your Compute Instances. Up to four backups are stored as part of this service, including automated daily, weekly, and biweekly backups in addition to a manual backup snapshot. Each backup is a full file-based snapshot of your disks taken during your preferred scheduled time slot while the Linode Compute Instance is still running. This means that the Backups service is not disruptive and provides you with several complete recovery options.

## Fully Managed

Linode Backups is a managed service that automatically backs up your Linode disks at regular intervals. Use full-system backups to guard against accidental deletions or misconfigurations.

## Convenient & Configurable

Enable the Backup Service with a single click. It activates instantly, and your first backups are automatically scheduled. There is no software to install or configure. You can choose when your Linode backups are generated. Select a two-hour window that suits you.

## Availability

Backups are available across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

The Backup service is available as a paid add-on for Compute Instances. Pricing starts at $2/month for a 1 GB Shared CPU Compute Instance. Review the [Pricing page](https://www.linode.com/pricing/#row--storage) for additional rates based on other Compute Instance plans.

On all plans, the Backup service can store up to four backups, three of which are automatically generated on the date and time range you specify:

- **Daily** *(Less than 24 hours old)*
- **Weekly** *(Less than 7 days old)*
- **Biweekly** *(Between 8 and 14 days old)*
- **Manual Snapshot** *(A user-initiated snapshot that stays the same until another snapshot is initiated)*

The Backup service does not keep automated backups older than 14 days, though there are no restrictions on the age of a manual snapshot.

## Additional Technical Specifications

- Compatible with all Linode Compute Instances, provided their disks contain unencrypted ext3 or ext4 file systems
- File-based backup solution, meaning it operates at the file level and not the block level
- Backups are stored on separate dedicated hardware within the same data center
- Can be managed through the [Cloud Manager](https://cloud.linode.com/), the [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)

## Part of a Multi-Tiered Backup Strategy

Linode's Backup service is one part of a well rounded backup strategy. On-site backups provide a quick and convenient recovery option. While the backups are stored on different hardware, that hardware is located within the same data center as the Compute Instance. It's also recommended to regularly backup your data off-site, such as on a local machine or using a third-party cloud-based service.

## Limits and Considerations

- **Disks are backed up, but not Linode-specific settings such as those stored within Configuration Profiles.**

- **Disks must be unencrypted and able to be mounted.** The Backup service is not compatible with full disk encryption or changes that prevent us from mounting the disk as a file system, such as creating partitions. This is because our service operates at the file level, not at the block level.

- All disks will be restored as an ext4 file system and their UUIDs will be different than the original disks.

- **A large number of files will prolong the backup process and may cause failures.** Because the Backup Service is file-based, the number of files stored on disk impacts both the time it takes for backups and restores to complete, and your ability to successfully take and restore backups. Customers who need to permanently store a large number of files may want to archive bundles of smaller files into a single file, or consider other backup services.

    {{< note >}}
The percentage of customers who may run into this limitation is low. If you are not sure if this limitation applies to you, please [contact Linode Support](/docs/guides/support/#contacting-linode-support).
{{< /note >}}

- Files that have been modified but have the same size and modify time are not be considered "changed" during a subsequent backup. ACLs and extended attributes are *not* tracked.

- The Backup Service uses a snapshot of your disks to take consistent backups while your Linode is running. This method is very reliable, but can fail to properly back up the data files for database services like MySQL. If the snapshot occurs during a transaction, the database's files may be backed up in an unclean state. We recommend scheduling routine dumps of your database to a file on the filesystem. The resulting file is then included in the daily backup, allowing you to restore the contents of the database if you need to restore from a backup.

-  **Volumes attached to a Compute Instance are not backed up as part of the Backup service**.
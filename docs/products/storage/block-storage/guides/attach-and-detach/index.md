---
author:
  name: Linode
  email: docs@linode.com
title: "Attach and Detach a Volume"
description: "Learn how to attach and detach exsting Volumes to or from Compute Instances."
aliases: ['/products/storage/block-storage/guides/attach-volume/','/products/storage/block-storage/guides/detach-volume/']
modified: 2022-08-24
---

Each Volume can to be attached to a single Compute Instance within the same data center, which enables that instance to read and write data to that Volume. Volumes can also be detached, and its data cannot be accessed until it is again attached to any Compute Instance within the same data center.

## Attach a Volume

Follow these steps to attach an existing Block Storage Volume to a Compute Instance.

1.  Log in to the [Cloud Manager](https://cloud.linode.com/linodes) and click on the **Volumes** link in the sidebar.

1.  Locate the desired Volume within the list, click the **more options ellipsis** dropdown menu, and select **Attach**.

1.  Complete the **Attach Volume** form that appears.

    - **Linode:** Use the dropdown menu to select the Compute Instance you'd like to use. The Volume will be attached to this instance.
    - **Config:** If the Compute Instance has multiple Configuration Profiles, select which one the Block Storage Volume should be assigned to. This field will not be displayed if the instance has only a single profile.

    {{< note >}}
The Compute Instance must be located within the same data center as the Block Storage Volume.
{{< /note >}}

    {{< note >}}
If the data center has been upgraded to NVMe Block Storage and your Compute Instance was deployed prior to August 24th, 2021, you may need to reboot the instance for it to properly work with a NVMe Block Storage Volume.
{{</ note >}}

1.  Click the **Save** button to attach the Volume.

1.  To start using the Volume on the Compute Instance, additional internal configuration is required. This includes creating the file system (if the Volume hasn't been used before), mounting the Volume, and configuring your instance to automatically mount the Volume at boot. To learn more about these configuration steps, see [Configuring and Mounting a Volume](/docs/products/storage/block-storage/guides/configure-volume/).

    {{< caution >}}
Do not create a new file system if you wish to retain any existing data on the Volume. Creating a new file system will overwrite any existing data and result in data loss.
{{</ caution >}}

## Detach a Volume

Follow these steps to safely detach a Block Storage Volume from a Compute Instance. A Volume should be detached before it is reattached to a different instance.

1. Log in to the [Cloud Manager](https://cloud.linode.com/linodes) and click on the **Linodes** link in the sidebar.

1. Select the Compute Instance that the Volume is currently attached to.

1. It's recommended to power off the instance. To do this, click **Power Off** on the top right of the Compute Instance details page.

1.  If a Volume is currently mounted, detaching it while the instance is powered on could cause data loss or an unexpected reboot. You can unmount the Volume for safe live-detaching by logging in to the Compute Instance over [SSH or Lish](/docs/guides/set-up-and-secure/#connect-to-the-instance) and running the `umount` command, such as in the example below.

        umount /dev/disk/by-id/scsi-0Linode_Volume_example-volume-1

    Replace the device path with the one for your own Volume (which can be viewed from the *Show Config* link). To avoid additional issues with your Compute Instance, remove the detached volume's line from your `/etc/fstab/` configuration.

        FILE_SYSTEM_PATH /mnt/example-volume-1 ext4 defaults 0 2

1. Navigate to the **Storage** tab.

1. Locate the Volume you wish to detach within the *Volumes* list, click the **more options ellipsis** dropdown menu, and select **Detach**.

1. A confirmation screen appears and explains that the Volume will be detached from the Compute Instance. Click **Detach** to confirm.

Detached Volumes still exist on your account and, as such, you are still billed for the Volume as normal. It can be viewed and deleted within the **Volumes** listing page in the Cloud Manager. See [View, Add, and Delete Volumes](/docs/products/storage/block-storage/guides/manage-volumes/).
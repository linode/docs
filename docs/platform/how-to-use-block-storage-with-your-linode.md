---
author:
  name: Linode
  email: docs@linode.com
description: This tutorial explains how to use Linode's block storage service.
keywords: ["block storage", " volume", " media", " resize", " storage", " disk"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-06-16
modified_by:
  name: Linode
published: 2017-06-16
title: How to Use Block Storage with Your Linode
---

Linode's block storage service allows you to attach additional storage volumes to your Linode. A single volume can range from 1 to 1024 gigabytes in size and costs $0.10/GiB per month. They can be partitioned however you like and can accommodate any filesystem type you choose. Up to eight volumes can be attached to a single linode, be it new or currently-existing, so you do not need to recreate your server to add a block storage volume.


{{< caution >}}
Linode's backup services do NOT cover block storage volumes.
You MUST execute your own backups for this data.
{{< /caution >}}

Block Storage is currently in a free public beta for Linodes in our Newark and Fremont datacenters. Any feedback you can give on the service would also be helpful and is appreciated.

![Block storage title graphic](/docs/assets/block-storage-title-graphic.png)

## How to Add a Block Storage Volume to a Linode

This guide assumes a Linode with the root disk mounted as `/dev/sda` and swap space mounted as `/dev/sdb`. In this scenario, the block storage volume will be available to the operating system as `/dev/disk/by-id/scsi-0Linode_Volume_EXAMPLE`, where `EXAMPLE` is a name you assign the volume. Storage volumes can be added when your Linode is already running, and will show immediately in `/dev/disk/by-id/`.

### Add a Volume from the Linode Dashboard

1.  Go to the dashboard page of the Linode to which you want to attach a block storage volume. Select **Create a new Volume**:

    [![Linode Manager create a volume](/docs/assets/bs-manager-create-new-volume-small.png)](/docs/assets/bs-manager-create-new-volume.png)

2.  Assign the block storage volume a label and size. The label can be up to 32 characters long and consist only of ASCII characters `a-z; 0-9.-_`. The maximum volume size is 1024 GiB (1 terabyte). When finished, click *Add this Volume!*:

    [![Linode Manager add a volume](/docs/assets/bs-add-a-volume.png)](/docs/assets/bs-add-a-volume.png)

    {{< note >}}
Block storage is currently only available to Linodes in our Newark and Fremont datacenters. Contact [Linode Support](https://manager.linode.com/support/ticket/new?summary=Block%20Storage%20Beta) if you would like to migrate your Linode to Newark or Fremont from another location.
{{< /note >}}

     If you receive the message, "Block Storage service is not yet enabled for this Linode's host. Please contact support if you would like a migration," reply to the ticket opened earlier and quote the error's text.

3.  Once you add a volume, you'll be presented with the Volume Attached page as shown below. This page provides customized instructions which show you how to make a filesystem in your volume from any of our supported Linux distributions. The page shows how to mount the volume, and how to add it to `/etc/fstab` so it's mounted automatically whenever you reboot your Linode:

    [![Linode Manager volume instructions](/docs/assets/bs-volume-instructions-small.png)](/docs/assets/bs-volume-instructions.png)

4.  If your Linode is not already running, boot and SSH in to execute the commands as shown on the instructions page. If you need to see the volume mount instructions again, click **Edit** to the right of the volume in that Linode's dashboard:

    [![Linode Manager edit volume](/docs/assets/bs-edit-small.png)](/docs/assets/bs-edit.png)

### Add a Volume from Your Account's Volume List

1.  In the **Linodes** tab of Linode manager, click **Manage Volumes** to see your account's volume list:

    [![Linode Manager add volume](/docs/assets/bs-manage-volumes-small.png)](/docs/assets/bs-manage-volumes.png)

2.  Click the **Attach** option for the volume you want to attach to a Linode:

    [![Linode Manager add volume](/docs/assets/bs-volume-list-small.png)](/docs/assets/bs-volume-list.png)

3.  Select the label of the Linode you want to attach the volume to. Then click **Attach**:

    [![Linode Manager add volume](/docs/assets/bs-volume-attach-small.png)](/docs/assets/bs-volume-attach.png)

    {{< note >}}
Block storage is currently only available to Linodes in our Newark and Fremont datacenters. Contact [Linode Support](https://manager.linode.com/support/ticket/new?summary=Block%20Storage%20Beta) if you would like to migrate your Linode to Newark or Fremont from another location.
{{< /note >}}

     If you receive the message, "Block Storage service is not yet enabled for this Linode's host. Please contact support if you would like a migration," reply to the ticket opened earlier and quote the error's text.

4.  Once you add a volume, you'll be presented with the Volume Attached page as shown below. This page provides customized instructions which show you how to make a filesystem in your volume from any of our supported Linux distributions. The page shows how to mount the volume, and how to add it to `/etc/fstab` so it's mounted automatically whenever you reboot your Linode:

    [![Linode Manager volume instructions](/docs/assets/bs-volume-instructions-small.png)](/docs/assets/bs-volume-instructions.png)

5.  If your Linode is not already running, boot and SSH in to execute the commands as shown on the instructions page. If you need to see the volume mount instructions again, click **Edit** to the right of the volume in that Linode's dashboard:

    [![Linode Manager edit volume](/docs/assets/bs-edit-small.png)](/docs/assets/bs-edit.png)

## How to Detach a Block Storage Volume from a Linode

1.  Go back to the dashboard of the Linode which the volume is attached to. Shut down the Linode.

2.  When the Linode is powered off, click **Detach** under the **Volumes** list:

    [![Linode Manager edit volume](/docs/assets/bs-detach-small.png)](/docs/assets/bs-detach.png)

3.  A confirmation screen appears and explains that the volume will be detached from the Linode. Click **Detach** to confirm:

    [![Linode Manager edit volume](/docs/assets/bs-detach-confirm-small.png)](/docs/assets/bs-detach-confirm.png)

    The Linode's dashboard does not show the volume present anymore:

    [![Linode Manager edit volume](/docs/assets/bs-detached-small.png)](/docs/assets/bs-detached.png)

    The volume still exists on your account and you can see it if you click **View all Volumes**:

    [![Linode Manager edit volume](/docs/assets/bs-volume-list-small.png)](/docs/assets/bs-volume-list.png)

## How to Delete a Block Storage Volume

{{< alert-danger >}}
The removal process is irreversible, and the data will be permanently deleted.
{{< /alert-danger >}}

1.  Shut down the Linode.

2.  Detach the volume as described [above](#how-to-detach-a-block-storage-volume-from-a-linode).

3.  Click the volume's **Remove** option in either the volume list or the attached Linode's dashboard.

## How to Resize a Block Storage Volume

Storage volumes can **not** be sized down, only up. Bear this in mind when sizing your volumes.

1.  Shut down your Linode.

2.  Click the **Edit** option for the volume you want to resize.

3.  Enter the new volume size. The minimum size is 1 GiB and maximum is 1024 GiB. Then click **Save Changes**.

      [![Linode Manager edit volume](/docs/assets/bs-resize-volume-small.png)](/docs/assets/bs-resize-volume.png)

4.  You'll be returned to the volume list and the **Status** column for the volume should say **resizing**.

      [![Linode Manager edit volume](/docs/assets/bs-volume-resizing-small.png)](/docs/assets/bs-volume-resizing.png)

5.  Reboot your Linode and your volume resize will be completed.

## Where to Go From Here?

Need ideas for what to do with space? We have several guides which walk you through installing software that would make a great pairing with large storage volumes:

[Install Seafile with nginx on Ubuntu 16.04](/docs/applications/cloud-storage/install-seafile-with-nginx-on-ubuntu-1604)

[Install Plex Media Server on Ubuntu 16.04](/docs/applications/media-servers/install-plex-media-server-on-ubuntu-16-04)

[Big Data in the Linode Cloud: Streaming Data Processing with Apache Storm](/docs/applications/big-data/big-data-in-the-linode-cloud-streaming-data-processing-with-apache-storm)

[Using Subsonic to Stream Media From Your Linode](/docs/applications/media-servers/install-subsonic-media-server-on-ubuntu-or-debian)

[Install GitLab on Ubuntu 14.04](/docs/development/version-control/install-gitlab-on-ubuntu-14-04-trusty-tahr)

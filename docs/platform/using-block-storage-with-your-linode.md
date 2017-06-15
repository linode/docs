---
author:
  name: Linode
  email: docs@linode.com
description: Using block storage devices with your Linode
keywords: 'block storage, volume, media, resize, storage, disk'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Tuesday, May 23rd, 2017
modified_by:
  name: Linode
published: 'Tuesday, May 23rd, 2017'
title: Using Block Storage with Your Linode
---

Linode's block storage service allows you to attach additional storage volumes to your linode ranging from 1 to 1024 gigabytes in size. They can be partitioned however you like and can accommodate any filesystem type you choose. Up to four volumes can be attached to a single linode, be it new or currently-existing, so you do not need to recreate your server to add a block storage volume. Bear in mind that the Linode backup service does not cover block storage volumes. You should back up this data to your own local storage.

Block Storage is currently in public beta. If you'd like to gain access, open a [support ticket](https://manager.linode.com/support/ticket/new?summary=Block%20Storage%20Beta) to be added. Any feedback you can give on the service would also be helpful and appreciated.

![Block storage title graphic](/docs/assets/block-storage-title-graphic.png)


## How to Add a Block Storage Volume to a Linode

This guide will use a linode with the root disk mounted as `/dev/sda` and swap space mounted as `/dev/sdb`. In this scenario, the block storage volume will be available to the operating system as `/dev/disk/by-id/scsi-0Linode_Volume_*`, where `*` is a name you assign the volume. Storage volumes can be added when your Linode is already running, and will show immediately in `/dev/disk/by-id/`.


### Add a Volume from a Linode's Dashboard

1.  Go to the dashboard page of the linode you want to attach a block storage volume to. Then select **Create a new Volumes**.

    [![Linode Manager create a volume](/docs/assets/bs-manager-create-new-volume-small.png)](/docs/assets/bs-manager-create-new-volume.png)


2.  Assign the block storage volume a label and size. The label can be up to 32 characters long and consist only of ASCII characters 'a-z0-9.-_'. The maximum volume size is 1024 GB (1 terabyte). When finished, click *Add this Volume!*

    [![Linode Manager add volume](/docs/assets/bs-add-a-volume-small.png)](/docs/assets/bs-add-a-volume.png)

  {: .note }
  >
  > At this time, block storage is only available to linodes in our Newark datacenter. Contact [Linode Support](https://manager.linode.com/support/ticket/new?summary=Block%20Storage%20Beta) if you would like your linode migrated to Newark from another location.

3.  You'll then be taken to a basic instructions page which shows you how to make a filesystem in your volume from any of our supported Linux distributions. You'll be shown how to mount it, and how to add the volume to `/etc/fstab` so it's mounted automatically whenever you reboot your linode.

    [![Linode Manager volume instructions](/docs/assets/bs-volume-instructions-small.png)](/docs/assets/bs-volume-instructions.png)

4.  Boot your linode if it is not already running, then SSH into your linode and run the commands give by the instructions page. If you need to see the volume mount instructions again, click **Edit** to the right of the volume in that linode's dashboard.

    [![Linode Manager edit volume](/docs/assets/bs-edit-small.png)](/docs/assets/bs-edit.png)


### Add a Volume from Your Account's Volume List

1.  In the **Linodes** tab of Linode manager, click **Manage Volumes** to see your account's volume list.

    [![Linode Manager add volume](/docs/assets/bs-mmanage-volumes-small.png)](/docs/assets/bs-mmanage-volumes.png)

2.  Click the *Attach* option for the volume you want to attach to a linode.

    [![Linode Manager add volume](/docs/assets/bs-volume-list-small.png)](/docs/assets/bs-volume-list.png)

3.  Select the label of the linode you want to attach the volume to. Then click **Attach**.

    [![Linode Manager add volume](/docs/assets/bs-volume-detaching-small.png)](/docs/assets/bs-volume-attach.png)

  {: .note }
  >
  > At this time, block storage is only available to linodes in our Newark datacenter. Contact Linode Support if you would like your linode migrated to Newark from another location.

4.  You'll then be taken to a basic instructions page which shows you how to make a filesystem in your volume from any of our supported Linux distributions. You'll be shown how to mount it, and how to add the volume to `/etc/fstab` so it's mounted automatically whenever you reboot your linode.

    [![Linode Manager volume instructions](/docs/assets/bs-volume-instructions-small.png)](/docs/assets/bs-volume-instructions.png)

5.  Boot your linode if it is not already running, then SSH into your linode and run the commands give by the instructions page. If you need to see the volume mount instructions again, click **Edit** to the right of the volume in that linode's dashboard.

    [![Linode Manager edit volume](/docs/assets/bs-edit-small.png)](/docs/assets/bs-edit.png)

## How to Detach a Block Storage Volume from a Linode

1.  Go back to the dashboard of the linode which the volume is attached to. Shut down the linode.

2.  When the linode is powered off, click **Detach** under the **Volumes** list:

    [![Linode Manager edit volume](/docs/assets/bs-detach-small.png)](/docs/assets/bs-detach.png)

3.  You'll then be shown a confirmation screen explaining that the volume will be detached from the linode. Click **Detach** to confirm.

    [![Linode Manager edit volume](/docs/assets/bs-detach-confirm-small.png)](/docs/assets/bs-detach-confirm.png)

  You should see that now the linode's dashboad does not show the volume present anymore.

      [![Linode Manager edit volume](/docs/assets/bs-detached-small.png)](/docs/assets/bs-detached.png)

  The volume still exists on your account though, and you can see it if you click **View all Volumes**.

      [![Linode Manager edit volume](/docs/assets/bs-volume-list-small.png)](/docs/assets/bs-volume-list.png)


## How to Delete a Block Storage Volume

Be aware that the removal process is irreversible, and the data will be permanently deleted.

1.  Shut down the linode.

2.  Detach the volume as described above.

3.  Click the volume's **Remove** option in either the volume list or the attached linode's dashboard.


## How to Resize a Block Storage Volume

1.  Shut down your linode.

2.  Click the **Edit** option for the volume you want to resize.

3.  Enter the new volume size. The minimum size is 1 GB and maximum is 1024 GB. Then click **Save Changes**.

      [![Linode Manager edit volume](/docs/assets/bs-resize-volume-small.png)](/docs/assets/bs-resize-volume.png)

4.  You'll be returned to the volume list and the **Status** column for the volume should say **resizing**.

      [![Linode Manager edit volume](/docs/assets/bs-volume-resizing-small.png)](/docs/assets/bs-volume-resizing-volume.png)

5.  Reboot your linode and your volume resize will be completed.


## Where to go From Here?

Need ideas for what to do with space? We have several guides which walk you through installing software that would make a great pairing with large storage volumes:

  [Install Seafile with nginx on Ubuntu 16.04](/docs/applications/cloud-storage/install-seafile-with-nginx-on-ubuntu-1604)

  [Install Plex Media Server on Ubuntu 16.04](/docs/applications/media-servers/install-plex-media-server-on-ubuntu-16-04)

  [Big Data in the Linode Cloud: Streaming Data Processing with Apache Storm](/docs/applications/big-data/big-data-in-the-linode-cloud-streaming-data-processing-with-apache-storm)

  [Using Subsonic to Stream Media From Your Linode](/docs/applications/media-servers/subsonic)
  
  [Install GitLab on Ubuntu 14.04](/docs/development/version-control/install-gitlab-on-ubuntu-14-04-trusty-tahr)
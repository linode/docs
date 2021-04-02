---
title: Get Started
description: "Get started with Linode Block Storage. Learn to add a new Block Storage volume to a Linode, increase the size of an attached volume, and transfer a Block Storage volume to a new Linode."
tab_group_main:
    weight: 20
---

## Add a New Block Storage Volume to a Linode

You can attach a Block Storage Volume to an existing Linode. Storage Volumes cannot be sized down, only up. Keep this in mind when sizing your Volume.

1. Click on the Linodes link in the sidebar.
1. Select the Linode to which you want to attach a Block Storage Volume from the Linode Detail page.
1. Click on the Volumes tab, then click on the Add a Volume button.
1. Select “Create and Attach Volume” to create a new Volume and assign it a unique label and storage size. Then, click submit.
1. Once you add a Volume it appears under your Linode’s Volumes tab. The new Volume’s label, size, and file system path are displayed.
1. Create a file system in your new Volume and mount it to your Linode. This requires you to SSH into your booted Linode. These Volume configuration steps appear in the Cloud Manager’s Volume Configuration panel.


## Increase the Size of an Attached Volume

You can increase the storage capacity of any Block Storage Volume.

1. Shut down your Linode.
1. Navigate to the “Volumes” section of the Cloud Manager and click on the more options ellipsis next to the Volume you would like to resize.
1. Select “Resize” from the dropdown menu.
1. Enter in the new size for your Volume. The maximum size is 10240 GiB. Then click “Submit”.
1. When the resize is complete, reboot your Linode.
1. Unmount your Volume and resize its partition to fill the new Volume size.
1. Mount the Volume back to the filesystem.

## Transfer a Block Storage Volume to a New Linode

1. [Detach your Block Storage Volume](/docs/products/storage/block-storage/guides/detach-volume/) from its current Linode.
1. Navigate to the “Volumes” section of the Cloud Manager and click on the more options ellipsis next to the Volume you would like to attach to a Linode.
1. Select “Attach” from the dropdown menu and a panel appears.
1. From the “Linode” dropdown menu, select the Linode you want the Volume to attach to, and click on “Save”.
1. Mount the Volume to your Linode. This requires you to SSH into your booted Linode. These Volume configuration steps can be accessed by clicking on the more option ellipsis next to the Volume you are transferring and selecting “Show Configuration”.

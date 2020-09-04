---
title: Get Started
description: "Linode’s Block Storage service lets you increase your Linode’s storage capacity by attaching additional high-speed volumes. Volumes are managed independently of Linodes, so your data persists even if you delete your Linode."
tab_group_main:
    weight: 20
---

## Add a New Block Storage Volume to a Linode

You can attach a Block Storage Volume to an existing Linode. Storage Volumes cannot be sized down, only up. Keep this in mind when sizing your Volume.

1. Click on the Linodes link in the sidebar.
1. Select the Linode to which you want to attach a Block Storage Volume from the Linode Detail page.
1. Click on the Volumes tab, then click on the Add a Volume button.
1. Select “Create and Attach Volume” to create a new Volume and assign it a unique label and storage size. Then, click submit.
1. Once you add a Volume it will appear under your Linode’s Volumes tab with the new Volume’s label, size, and file system path.
1. Create a filesystem in your new Volume and mount it to your Linode. This will require you to SSH into your booted Linode. These Volume configuration steps will appear in the Cloud Manager’s Volume Configuration panel.


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
1. Select “Attach” from the dropdown menu and a panel will appear.
1. From the “Linode” dropdown menu, select the Linode you want the Volume to attach to, and click on “Save”.
1. Mount the Volume to your Linode. This will require you to SSH into your booted Linode. These Volume configuration steps can be accessed by clicking on the more option ellipsis next to the Volume you are transferring and selecting “Show Configuration”.
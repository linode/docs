---
author:
  name: Linode
  email: docs@linode.com
description: How to retain Disks with the Linode Images service
keywords: ["linode Images", " imagize"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['platform/linode-images/','linode-images/','platform/disk-images/linode-images-new-manager/']
modified: 2018-08-22
modified_by:
  name: Linode
published: 2014-09-25
title: Linode Images
classic_manager_link: platform/disk-images/linode-images-classic-manager/
---

![Linode Images](linode-images.jpg)

*Linode Images* allows you to take snapshots of your disks, and then deploy them to any Linode under your account. This can be useful for bootstrapping a master image for a large deployment, or retaining a disk for a configuration that you may not need running, but wish to return to in the future. Linode Images will be retained whether or not you have an active Linode on your account, which also makes them useful for long term storage of a private template that you may need in the future. There is no additional charge to store Images for Linode users. Images are limited to 2GB per Image and 3 Images per account. Additionally, images can only be created on disks with ext3 or ext4 filesystems with a single partition.

{{< note >}}
When saving a Linode image, it is the aspects of the Linode that are on the **disk** that are saved, not any additional aspects such as IP addresses, fully qualified domain names, and MAC addresses.
{{< /note >}}

## Capturing Your Image

Linode Images captures an exact copy of your disk at the moment when the process is kicked off. Here's how to capture your first image.

{{< note >}}
While an image can be captured while your Linode is running, we would recommend shutting your Linode down first if you are running any active databases. Capturing an image that includes a running database can cause corruption or data loss in the imaged copy of the database.
{{< /note >}}

1.  Navigate to your the Images page in the Linode Cloud Manager and select **Add an Image**.

    [![Select 'Add an Image'](images-add-an-image-small.png "Select 'Add an Image.')](images-add-an-image.png)

1.  In the **Create an Image** menu select the Linode and disk you would like to freeze, and provide a label. You may also add an optional description of the image. Then, click **Create**.

    ![Create an Image menu](images-create-image-menu.png "Create an Image menu.")

    {{< caution >}}
CoreOS disk images are in RAW format. Images made from CoreOS disks will not be able to be used to deploy new Linodes.
{{< /caution >}}

1.  Once you click the **Create** button, your image will be frozen for later use. You can view the progress under the bell notifications at the top of the page.

    ![Image creation status under the bell notifications.](images-image-being-created.png "Image creation status under the bell notifications.")

    {{< note >}}
Linode Images are limited to 2048MB of data per disk.  You will need to ensure that data within your disk does not exceed this size limit. Additionally, Linode Images cannot be created if you are using raw disks or disks that have been formatted using custom filesystems.   {{< /note >}}

    Once the job has completed, your Linode's disk has been captured and stored.

## Managing Your Images

The images captured from your Linodes are stored for future usage, and can be modified or removed at any time.

1.  Click on the **Images** link in the sidebar.

    [![Manage your Images.](images-manage-images-small.png "Manage your Images.")](images-manage-images.png)

1.  From this page, you can delete existing disks, edit labels and descriptions, and deploy Linodes from disk images.

    [![Select the Image menu.](images-edit-image-menu-small.png "Select the Image menu.")](images-edit-image-menu.png)

## Deploy From A Saved Image

Deploying one of your saved images to any Linode under your account is a simple process.

1.  Navigate to the **Images** page, click on the **more options ellipsis** to open the menu for the Image from which you would like to deploy, and select **Deploy New Linode**.

    [![Select 'Deploy New Linode' from the Image menu](images-select-deploy-from-menu-small.png "Select 'Deploy New Linode' from the Image menu")](images-select-deploy-from-menu.png)

1.  Select your Image from *My Images* under the *Create from Image* tab.

    [![Select your Image from the 'My Images' tab](images-create-linode-from-image-small.png)](images-create-linode-from-image.png)

    {{< caution >}}
You cannot deploy an image that was created from a RAW disk format. Attempting to do so will result in a failure.
{{< /caution >}}

1.  Select your desired Region, Linode Plan, Label, and set your root password, then click **Create** to create a Linode with your saved image.

    [![A new Linode has been created from a disk.](images-master-from-image.png "A new Linode has been created from a disk.")](images-master-from-image.png)

Once you've completed these steps, your saved image will be deployed on your new Linode.

---
title: Get Started
description: "Get started with Linode Images. Learn to create an image with the Linode Images service."
tab_group_main:
    weight: 20
---

{{< content "images-beta-note-shortguide" >}}

All Images stored on your Account are visible from the main **Images** page within the Cloud Manager. Images are divided between two tables: *Manual Images* and *Automatic Images*.

- **Manual Images:** Custom Images that are manually created by a user on the account. These Images were either captured from an existing Linode's disk or uploaded through an image file. Custom Images do not expire and will remain on the account until they are manually deleted.

- **Automatic Images:** Temporary Recovery Images that are automatically created when a Linode is deleted. Recovery Images have a defined expiration data and, once expired, will automatically be deleted. The expiration date is based on how long the Linode was active, as well as a few other factors.

### Creating an Image

Within the **Images** page of the Cloud Manager, click **Create Image**.

- To capture an Image from an existing Linode's disk, complete the form under the **Capture Image** tab. See [Capture an Image](/docs/products/tools/images/guides/capture-an-image/) for full instructions.
- To upload an Image using an image file, complete the form under the **Upload Image** tab. See [Upload an Image](/docs/products/tools/images/guides/upload-an-image/) for full instructions.

### Deploying and Managing Existing Images

To take action on an Image, locate the Image within the **Images** page of the Cloud Manager and click the corresponding **ellipsis** options menu. From here, there are a few actions that can be initiated:

- **Edit:** Change the *Label* and *Description* for the Image.
- **Deploy to a New Linode:** Create a new Linode using the Image. See [Deploy an Image to a New Linode](/docs/products/tools/images/guides/deploy-image-to-new-linode/).
- **Deploy to an Existing Linode:** Rebuild the Linode using the Image. See [Rebuild and Deploy an Image to an Existing Linode](/docs/products/tools/images/guides/deploy-image-to-existing-linode/).
- **Delete** Delete the Image (cannot be undone).


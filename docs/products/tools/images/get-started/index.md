---
title: Get Started
description: "Get started with Linode Images. Learn to create an image with the Linode Images service."
tab_group_main:
    weight: 20
---

All Images stored on your Account are visible from the main **Images** page within the Cloud Manager. Images are divided between two tables: *Custom Images* and *Recovery Images*.

- **Custom Images:** Images that are manually created by a user on the account. These Images were either captured from an existing Compute Instance's disk or uploaded from an image file. Custom Images do not expire and remain on the account until they are manually deleted.

- **Recovery Images:** Temporary Images that are automatically created when a Compute Instance is deleted (provided the Instance has been active for at least 12 hours). Recovery Images have a defined expiration date and, once expired, are automatically deleted. The expiration timeline is typically equal to the number of hours the Instance was active, up to 7 days.

## Creating an Image

Within the **Images** page of the Cloud Manager, click **Create Image**.

- To capture an Image from an existing Compute Instances's disk, complete the form under the **Capture Image** tab. See [Capture an Image](/docs/products/tools/images/guides/capture-an-image/) for full instructions.
- To upload an Image using an image file, complete the form under the **Upload Image** tab. See [Upload an Image](/docs/products/tools/images/guides/upload-an-image/) for full instructions.

## Deploying and Managing Existing Images

To take action on an Image, locate the Image within the **Images** page of the Cloud Manager and click the corresponding **ellipsis** options menu. From here, there are a few actions that can be initiated:

- **Edit:** Change the *Label* and *Description* for the Image.
- **Deploy to a New Compute Instance:** Create a new Compute Instance using the Image. See [Deploy an Image to a New Compute Instance](/docs/products/tools/images/guides/deploy-image-to-new-linode/).
- **Deploy to an Existing Compute Instnace:** Rebuild an Instance or create a new disk using the Image. See [Deploy an Image to an Existing Compute Instance](/docs/products/tools/images/guides/deploy-image-to-existing-linode/).
- **Delete:** Delete the Image (cannot be undone).


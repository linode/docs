---
slug: linode-images
author:
  name: Linode
  email: docs@linode.com
description: Linode's Images product allows you to store disk images in the Cloud and quickly deploy them to new or existing Linodes. This can be useful for bootstrapping a golden image for large scale or rapid deployments, among other use cases.
og_description: Linode's Images product allows you to store disk images in the Cloud and quickly deploy them to new or existing Linodes. This can be useful for bootstrapping a golden image for large scale or rapid deployments, among other use cases.
keywords: ["linode Images", "imagize"]
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/linode-images/','/platform/disk-images/linode-images/','/platform/disk-images/linode-images-classic-manager/','/platform/linode-images/','/platform/disk-images/linode-images-new-manager/']
modified: 2021-04-28
modified_by:
  name: Linode
published: 2014-09-25
title: Images Tutorial
---

Linode's **Images** service allows users to store custom disk images in the Cloud preconfigured with the exact software and settings required for certain applications and workloads. These Images can be quickly deployed to new or existing Linode, saving users time from manually setting up their entire system after each deployment.

## Pricing and Availability

Images are currently available at no charge to Linode customers and can be deployed across [all regions](https://www.linode.com/global-infrastructure/).

{{< content "images-ga-pricing-update-shortguide" >}}

## Types of Images

{{< content "types-of-images-shortguide" >}}

## Creating a New Image

Two different methods can be used to manually create a Custom Image, each of which is discussed within this guide:

- **[Capturing an Image](#capturing-an-image)**
- **[Uploading an Image](#uploading-an-image)**

## Capturing an Image

### Requirements and Considerations

{{< content "capture-image-requirements-shortguide" >}}

Additional overall limits of the Images service are outlined within the [Limits](#limits) section below.

### Capturing an Image through the Cloud Manager

{{< content "capture-image-shortguide" >}}

## Uploading an Image

### Requirements

{{< content "upload-image-requirements-shortguide" >}}

### Creating or Obtaining an Image File

{{< content "create-an-image-file-shortguide" >}}

### Uploading an Image through the Cloud Manager

{{< content "upload-image-shortguide" >}}

## Managing Images

To take action on an Image, locate the Image within the **Images** page of the Cloud Manager and click the corresponding **ellipsis** options menu. From here, there are a few actions that can be initiated:

- **Edit:** Change the *Label* and *Description* for the Image.
- **[Deploy to a New Linode](#deploying-an-image-to-a-new-linode):** Create a new Linode using the Image.
- **[Deploy to an Existing Linode](#rebuilding-and-deploying-an-image-to-an-existing-linode):** Rebuild the Linode using the Image.
- **Delete:** Delete the Image (cannot be undone).

## Deploying an Image to a New Linode

{{< content "deploy-image-to-new-linode-shortguide" >}}

## Rebuilding and Deploying an Image to an Existing Linode

{{< content "deploy-image-to-existing-linode-shortguide" >}}

## Limits

{{< content "images-limits-shortguide" >}}

Additional requirements and considerations apply when [capturing an Image](#capturing-an-image) from a Linode and [uploading an Image](#uploading-an-image) from a file.
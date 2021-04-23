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
modified: 2021-04-23
modified_by:
  name: Linode
published: 2014-09-25
title: Images Tutorial
---

{{< content "images-beta-note-shortguide" >}}

Linode's **Images** product allows you to store disk images in the Cloud and quickly deploy them to new or existing Linodes. This is useful for storing *Golden Images*, preconfigured with the exact software and settings you require. Images can also be used to store a copy of an existing disk on a Linode, allowing you to restore from that moment in time even if your Linode is deleted.

## Types of Images

There are two types of Images that can be stored on an account, both of which are visible from the **Images** page of the Cloud Manager:

- **Manual Images:** Custom Images that are manually created by a user on the account. These Images were either captured from an existing Linode's disk or uploaded through an image file. Custom Images do not expire and will remain on the account until they are manually deleted.

- **Automatic Images:** Temporary Recovery Images that are automatically created when a Linode is deleted. Recovery Images have a defined expiration data and, once expired, will automatically be deleted. The expiration date is based on how long the Linode was active, as well as a few other factors.

## Pricing and Availability

Images are available within all data centers. User created Custom Images cost $0.05/GiB per month. Temporary Recovery Images, generated automatically after a Linode is deleted, are provided at no cost for a finite period of time.

## Creating a New Image

Two different methods can be used to manually create a Custom Image, each of which is discussed within this guide:

- **[Capturing an Image](#capturing-an-image)**
- **[Uploading an Image](#uploading-an-image)**

## Capturing an Image

{{< content "capture-image-shortguide" >}}

## Uploading an Image

{{< content "upload-image-shortguide" >}}


## Managing Images

To take action on an Image, locate the Image within the **Images** page of the Cloud Manager and click the corresponding **ellipsis** options menu. From here, there are a few actions that can be initiated:

- **Edit:** Change the *Label* and *Description* for the Image.
- **[Deploy to a New Linode](#deploying-an-image-to-a-new-linode):** Create a new Linode using the Image.
- **[Deploy to an Existing Linode](#rebuilding-and-deploying-an-image-to-an-existing-linode):** Rebuild the Linode using the Image.
- **Delete** Delete the Image (cannot be undone).

## Deploying an Image to a New Linode

{{< content "deploy-image-to-new-linode-shortguide" >}}

## Rebuilding and Deploying an Image to an Existing Linode

{{< content "deploy-image-to-new-linode-shortguide" >}}

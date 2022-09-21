---
title: "Images"
description: "Custom Images allow for rapid deployments of preconfigured disks to new or existing Compute Instances. They can be easily created by capturing a disk on an existing Instnace or uploading an image file."
keywords: ["linode Images", "imagize"]
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/guides/linode-images/','/linode-images/','/platform/disk-images/linode-images/','/platform/disk-images/linode-images-classic-manager/','/platform/linode-images/','/platform/disk-images/linode-images-new-manager/']
published: 2020-06-02
modified: 2022-07-12
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Create preconfigured disk images that can be rapidly deployed to new or existing Compute Instances."
---

Linode's **Images** service allows users to store custom disk images in the Cloud. These images can be preconfigured with the exact software and settings required for your applications and workloads. Once created, they can be quickly deployed to new or existing Linode Compute Instances, saving users time from manually setting up their entire system after each deployment.

## Create Golden Images

Easily create, store, and deploy *golden images* on your Linode account. A golden image is a term for an image preconfigured with the exact software, settings, and data files you desire for a particular application. Configure your software once and then create a Custom Image based on that environment. This Custom Image can then be rapidly deployed to any Compute Instance, saving you time from having to manually configure each system.

## Retain Disks

Custom Images can also be used to quickly take a snapshot of a disk on an existing Compute Instance. This provides you with a copy of those disks should they need to be restored. For more comprehensive backups, including automated backups, consider using our [Backup Service](/docs/products/storage/backups/).

## Recover Recently Deleted Compute Instances

Accidentally deleting a production server will almost certainly impact your users and business. Linode's Custom Images service makes recovery easier by saving temporary **Recovery Images** on your account. These images can be used to quickly restore the disks from a recently deleted Compute Instance. Linode offers this service as a convenience and it's important to note that a well rounded backup strategy typically involves multiple solutions (see [Backing Up Your Data](/docs/guides/backing-up-your-data/)).

## Recommended Workloads

- Web or software agencies deploying similar starter configurations for clients
- Development workflows requiring the same base image for all developers or applications
- Workflows requiring distributions other than [those provided by Linode](/docs/guides/choosing-a-distribution/)

## Availability

Images can be created and deployed across [all regions](https://www.linode.com/global-infrastructure/).

## Pricing

Custom Images cost $0.10/GB per month.

{{<note>}}
Recovery Images, which are generated automatically after a Compute Instance is deleted, are provided at no charge.
{{</note>}}

## Technical Specifications

- **Maximum image size:** A Custom Image can be up to **6 GB\*** in size.

- **Account limits:** Each account can store up to **25\*** Custom Images, offering **150 GB\*** of combined storage for all images on the account.

- **File system support:** **ext3** and **ext4** file systems are supported. Raw disks or disks that have been formatted using other file systems are not supported.

- **Upload image format and size limits:** The [.img](https://en.wikipedia.org/wiki/IMG_%28file_format%29) file format is supported when uploading an image file. This file should be compressed using [gzip](https://en.wikipedia.org/wiki/Gzip) (`.img.gz`). It can be up to **5GB** when compressed and, when uncompressed, up to the **maximum image size** as stated above.

\* *If you need to store larger images (or more images), contact [Linode Support](https://www.linode.com/support/) with additional details of your applications or intended workloads.*

### Additional Specifications

- [Capture an Image > Requirements and Considerations](/docs/products/tools/images/guides/capture-an-image/#requirements-and-considerations)
- [Upload an Image > Requirements and Considerations](/docs/products/tools/images/guides/upload-an-image/#requirements-and-considerations)
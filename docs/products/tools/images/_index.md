---
title: Images
description: "Custom Images allow for rapid deployments of preconfigured disks to new or existing Compute Instances. They can be easily created by capturing a disk on an existing Instnace or uploading an image file."
keywords: ["linode Images", "imagize"]
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/guides/linode-images/','/linode-images/','/platform/disk-images/linode-images/','/platform/disk-images/linode-images-classic-manager/','/platform/linode-images/','/platform/disk-images/linode-images-new-manager/']
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

## Availability

Images can be created and deployed across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

{{< content "images-ga-pricing-update-shortguide" >}}

User generated Custom Images cost $0.10/GB per month and can have a maximum size of 6GB. Recovery Images, generated automatically after a Compute Instance is deleted, are provided as a free courtesy service.

Keep in mind that Custom Images generated from an uploaded image file are billed based on the _uncompressed_ size of that image.

## Limits and Considerations

### Overall

{{< content "images-limits-shortguide" >}}

### Images Created from a Linode

{{< content "capture-image-requirements-shortguide" >}}

### Images Created from a File

{{< content "upload-image-requirements-shortguide" >}}
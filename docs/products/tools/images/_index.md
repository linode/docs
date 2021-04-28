---
title: Images
description: "Custom Images allow for rapid deployments of preconfigured disks to new or existing Linodes. They can be easily created by capturing a disk on an existing Linode or uploading an image file."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Custom Images allow for rapid deployments of preconfigured disks to new or existing Linodes. They can be easily created by capturing a disk on an existing Linode or uploading an image file."
---

{{< content "images-beta-note-shortguide" >}}

## Availability

Images can be created and deployed across [all regions](https://www.linode.com/global-infrastructure/).

## Pricing

Images are currently available at no charge to Linode customers.

{{< note >}}
**Pricing change:** Images will transition to a paid service with a cost of $0.10/GB per month for each Custom Image stored on an account. This change will be communicated to customers in advance. Recovery Images, generated automatically after a Linode is deleted, are provided at no cost for a finite period of time.
{{</ note >}}

## Features

### Rapid Deployment of Golden Images

Store disk images preconfigured with the software you need. These Custom Images can be used when deploying new Linodes and rebuilding existing Linodes, saving time by avoiding manual software installation and configuration.

### Retain Disks of Existing Linodes

Store a disk image of an existing Linode, enabling you to restore that image if needed and delete the existing Linode while still saving your data.

## Limits

{{< content "images-limits-shortguide" >}}

Additional requirements and considerations apply when [capturing an Image](/docs/products/tools/images/guides/capture-an-image/) from a Linode and [uploading an Image](/docs/products/tools/images/guides/upload-an-image/) from a file.
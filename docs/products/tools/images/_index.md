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

## Availability

Images can be created and deployed across [all regions](https://www.linode.com/global-infrastructure/).

## Pricing

Custom Images has transitioned to a paid service beginning September 1st, 2021. Custom Images now cost $0.10/GB per month. Keep in mind that Custom Images generated from an uploaded image file are billed based on the _uncompressed_ size of that image.

Recovery Images, generated automatically after a Linode is deleted, are provided as a free courtesy service.

## Features

### Rapid Deployment of Golden Images

Store disk images preconfigured with the software you need. These Custom Images can be used when deploying new Linodes and rebuilding existing Linodes, saving time by avoiding manual software installation and configuration.

### Retain Disks of Existing Linodes

Store a disk image of an existing Linode, enabling you to restore that image if needed and delete the existing Linode while still saving your data.

## Limits and Considerations

### Overall

{{< content "images-limits-shortguide" >}}

### Images Created from a Linode

{{< content "capture-image-requirements-shortguide" >}}

### Images Created from a File

{{< content "upload-image-requirements-shortguide" >}}
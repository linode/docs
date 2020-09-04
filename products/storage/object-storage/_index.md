---
title: Object Storage
description: "S3-compatible Linode Object Storage makes it easy and more affordable to manage unstructured data such as content assets, as well as sophisticated and data-intensive storage challenges around artificial intelligence and machine learning."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
---

Object Storage stores data, called objects, in containers, called buckets, and each object is given a unique identifier with which it is accessed. In this way, the physical location of the object does not need to be known. The objects are stored alongside rich, configurable metadata that can be used to describe any number of arbitrary properties about the object. Each object has its own URL, so accessing the data is often as simple as issuing an HTTP request, either by visiting the object in the browser or retrieving it through the command line.

## Availability

Newark, NJ, United States; Frankfurt, Germany; Singapore, Singapore

## Features

### S3 Compatible

Linode Object Storage is a globally-available, S3 Compatible storage solution, maintaining the same performance as your data grows.

### No Linode Necessary

Object storage does not require the use of a Linode. Instead, Object Storage gives each object a unique URL which you can access your data.

### Host Static Sites

Using Object Storage to host your static site files means you do not have to worry about maintaining your site’s infrastructure. It is no longer necessary to perform typical server maintenance tasks, like software upgrades, web server configuration, and security upkeep.

Object Storage provides an HTTP REST gateway to objects, which means a unique URL over HTTP is available for every object. Once your static site is built, making it available publicly over the Internet is as easy as uploading files to an Object Storage bucket.

## Pricing

Linode Object Storage costs a flat rate of $5 a month, and includes 250 gigabytes of storage. This flat rate is prorated, so if you use Object Storage for a fraction of the month you will be charged a fraction of the cost. For example, if you have Object Storage enabled for half of the month and use up to 250 gigabytes of storage you will be billed $2.50 at the end of the month. Each additional gigabyte of storage over the first 250 gigabytes will cost $0.02, and this usage is also prorated based on usage time.

{{< caution >}}
Object Storage is similar to a subscription service. **Once enabled, you will be billed at the flat rate regardless of whether or not there are active buckets on your account.** You must [Cancel Object Storage](/docs/platform/object-storage/how-to-use-object-storage/#cancel-object-storage) to stop billing for this service.
{{</ caution >}}
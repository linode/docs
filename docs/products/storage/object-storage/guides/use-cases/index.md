---
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide provides you with an introduction to Linode Object Storage and also offers you several practical use cases, as well as benefits and limitations."
image: use-cases-for-linode-obj-storage.png
keywords: ['object','storage','s3','use','case']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-26
modified_by:
  name: Linode
title: "Use Cases for Object Storage"
contributor:
  name: Linode
tags: ["linode platform"]
aliases: ['/platform/object-storage/object-storage-use-cases/','/guides/object-storage-use-cases/']
---

## What is Object Storage?

Object Storage is a method of storing data that differs in a number of ways from [Block Storage](/docs/products/storage/block-storage/). Block Storage splits files into small *blocks* of data. Minimal file metadata is stored alongside this data and, in general, descriptive metadata must be stored in a separate file or database. In order to use a Block Storage volume it must be attached to a host server, where it acts like a hard drive.

In contrast, Object Storage stores data, called *objects*, in containers, called *buckets*, and each object is given a unique identifier with which it is accessed. In this way, the physical location of the object does not need to be known. The objects are stored alongside rich, configurable metadata that can be used to describe any number of arbitrary properties about the object. Each object has its own URL, so accessing the data is often as simple as issuing an HTTP request, either by visiting the object in a browser or retrieving it through the command line.

### Benefits and Limitations

Object Storage scales easily because all the objects are stored in a flat, scalable name space. Object Storage does not require a host server in order to be used, meaning many different clients can read from it or write to it.

With that said, there are limitations to Object Storage. Objects in Object Storage cannot be modified at the block level, as with Block Storage, and must be rewritten in their entirety every time a change is made. This makes any scenario with many successive read/write operations – such as the needs of databases or transactional data – a poor choice for Object Storage. Additionally, Object Storage traffic runs over HTTP, so it does not benefit from the I/O speeds of a mounted Block Storage volume. As a rule of thumb, Object Storage shines when files do not need to be updated frequently.

Below are some of the more popular use cases for Object Storage.

## Use Cases

### Static Site Hosting

Because Object Storage buckets provide HTTP access to objects, it's easy to set up a bucket to serve static websites. A static website is a website that does not require a server-side processing language like PHP to render content. And because a static site does not require each page to be processed with every request, they are usually very quick to load. For more information on setting up a static site on Object Storage, read our [Host a Static Site on Linode Object Storage](/docs/guides/host-static-site-object-storage/) guide. For more on static site generators, visit our [How to Choose a Static Site Generator](/docs/guides/how-to-choose-static-site-generator/) guide.

### Website Files

If you don't want to host your entire site on Object Storage (for example: you plan to use a CMS like WordPress), you can still choose to host some of your site's assets, like images and downloads, with Object Storage. This will save disk space on your server and can help reduce your costs.

### Software Storage and Downloads

Similar to hosting website files, hosting software applications on Object Storage is a great use case for developers looking to give quick access to their products. Simply upload the file to a bucket and share its URL.

### Unstructured Data

Unstructured data is any data that does not fit into a traditional database. Object Storage excels at storing large amounts of unstructured data. With the ability to configure custom metadata for each piece of unstructured data, it is easy to extrapolate useful information from each object and to retrieve objects with similar metadata. Examples of unstructured data include [images, video, audio, documents,](#images-video-audio-and-documents) and [Big Data](#big-data).

### Images, Video, Audio, and Documents

Multimedia assets like images, videos, audio files, and documents are a perfect match for Object Storage. In general these types of files do not change frequently, so there is no need to store them on Block Storage volumes. Because each file has its own URL, streaming the content of these files or embedding them in another program or website is simple and does not require the use of a server.

### Big Data

Big Data typically describes data sets that are so large and so diverse that it takes specialized tooling to analyze them. In many cases the data that comprises Big Data is considered unstructured and does not fit neatly into a database, making it a great candidate for Object Storage.

### Artifact Storage

As more and more of the development life cycle becomes automated and tested, more and more artifacts are generated in the process. Object Storage is a great solution for developers looking to store these artifacts, such as the bulk collection of logs. Sharing stored artifacts is as simple as sharing a URL. And if you'd rather your artifacts stay private, you can distribute an access key.

### Cold Storage

Object Storage is, in the majority of cases, significantly cheaper than Block Storage. While Object Storage can incur a cost when retrieving data, the cost benefit for infrequently accessed data can provide you with an overall cost reduction when compared to similar methods.

Similarly, Object Storage has benefits over [tape storage](https://en.wikipedia.org/wiki/Tape_drive). Tape storage is frequently used for archival purposes, but the read times that come with tape storage are many times more than what you'll find with Object Storage. Special considerations have to be made when transferring tape drive data, such as the ability to ship drives safely across long distances. With Object Storage, this data is available through HTTP from anywhere in the world.

{{< note >}}
The outbound data transfer for Linode Object Storage is part of your Linode account's [total transfer pool](/docs/guides/network-transfer/), which will reduce or completely eliminate transfer costs for Object Storage if you are also running Linode instances. If you expend your allotted transfer pool, you will be billed at a rate of $0.01 per GB for outbound transfers.
{{< /note >}}

### Backups

Databases and other critical data can be backed up to Object Storage with little effort using a command line client for easier automation. Objects within Object Storage are replicated and resilient to underlying hardware errors. Additionally, buckets can be versioned so you never lose access to older backups.

### Private File Storage

Objects can be made private and only accessible with a key. By default, all new objects in a bucket are set to private, so they are inaccessible by normal HTTP requests (though it's easy to set public permissions on objects if you'd like). This makes it easy to store secure data.

## Next Steps

If you're curious about how to use Object Storage, you can review the [Create and Manage Buckets](/docs/products/storage/object-storage/guides/manage-buckets/) guide and the [Upload and Manage Files](/docs/products/storage/object-storage/guides/manage-files/) guide for detailed instructions on creating buckets and uploading objects. Read our [Host a Static Site using Linode Object Storage](/docs/guides/host-static-site-object-storage/) to get started with hosting your own site on Object Storage.

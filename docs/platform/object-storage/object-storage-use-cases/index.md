---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use cases for Linode Object Storage'
keywords: ['object','storage','s3','use','case']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-26
modified_by:
  name: Linode
title: "Use Cases for Linode Object Storage"
contributor:
  name: Linode
---

## What is Object Storage?

Object Storage is a method of storing data that differs in a number of ways from Block Storage. Block Storage splits files into small *blocks* of data. Minimal metadata about the contents of the file is stored alongside this data; in general, descriptive metadata must be stored in a separate file or database. In order to use a Block Storage volume it must be attached to a host server, where it acts like a hard drive.

In contrast, Object Storage stores data, called *objects*, in containers, called *buckets*, and each object is given a unique identifier with which it is accessed. In this way, the physical location of the object does not need to be known. These objects are stored alongside rich, configurable metadata that can be used to describe any number of arbitrary properties about the object. Each object has its own URL, so accessing the data is often as simple as issuing an HTTP request, either by visiting the object in a browser or retrieving it through the command line.

### Benefits and Limitations

Object Storage scales easily because all of the objects are stored in a flat, scalable name space. Object Storage does not require a host server in order to be used, so many different clients can read from it or write to it.

With that said, there are limitations to Object Storage. Objects in Object Storage cannot be modified at the block level, as with Block Storage, and must be rewritten in their entirety every time a change is made. This makes any scenario with many successive read/write operations, similar to the needs of databases or transactional data, a poor choice for Object Storage. Additionally, Object Storage traffic runs over HTTP, so it does not benefit from the I/O speeds of a mounted Block Storage volume. As a rule of thumb Object Storage shines when files do not need to be updated frequently.

Below are some of the more popular use cases for Object Storage.

## Use Cases

### Static Site Hosting

Because Object Storage buckets provide HTTP access to objects, it's easy to set up a bucket to serve static websites. A static website is a website that does not require a server-side processing language like PHP to render the content. And because a static site does not require each page to be processed with every request, they are usually very quick to load. For more information on setting up a static site on Object Storage, read our [Host a Static Site on Linode Object Storage](/docs/platform/object-storage/host-static-site-object-storage/) guide. For more on static site generators in general, visit our [How to Choose a Static Site Generator](/docs/websites/static-sites/how-to-choose-static-site-generator/) guide.

### Website Files

If you don't want to host your entire site on Object Storage (for example: because you'd like to use a CMS like WordPress), then you can still choose to host some of your site's assets, like images and downloads, with Object Storage. This will save disk space on your server and can help reduce your costs.

### Software Storage and Downloads

Similar to hosting website files, hosting software applications on Object Storage is a great use case for developers looking to give quick access to their products. Simply upload the file to a bucket and share its URL.

### Unstructured Data

Unstructured data is any data that does not fit into a traditional database. Object Storage excels at storing large amounts of unstructured data. With the ability to configure custom metadata for each piece of unstructured data, it is easy to extrapolate useful information from each object and to retrieve objects with similar metadata. Examples of unstructured data include [images, video, audio, and documents](#images-video-audio-and-documents) and [Big Data](#big-data).

### Images, Video, Audio, and Documents

Multimedia assets like images, videos, audio files, and documents are a perfect match for Object Storage. In general these types of files do not change frequently, so there is not a need to store them on Block Storage Volumes. Because each file has its own URL, streaming the content of these files or embedding them in another program or website is simple and does not require the use of a server.

### Big Data

Big Data typically describes data sets that are so large and so diverse that it takes specialized tooling to analyze them. In many cases much of the data that comprises Big Data is considered unstructured and does not fit neatly into a database, making it a great candidate for Object Storage.

### Artifact Storage

As more and more of the development life cycle becomes automated and tested, more and more artifacts are generated in the process. Object Storage is a great solution for developers looking to store all these artifacts, such as the bulk collection of logs. Sharing these artifacts is as simple as as sharing a URL. If you'd rather these logs stay private, you can also distribute an access key for them.

### Cold Storage

Object Storage is significantly cheaper than Block Storage. While Object Storage does incur a cost when retrieving data, the cost benefit for infrequently accessed data is something that should not be glossed over. As well, the outbound data transfer for Linode Object Storage is part of your Linode account's [total transfer pool](/docs/platform/billing-and-support/network-transfer-quota/), which can further reduce costs if you are running Linode instances too.

Similarly, Object Storage has benefits over [tape storage](https://en.wikipedia.org/wiki/Tape_drive). Tape storage is frequently used for archival purposes, but the read times that come with tape storage are many times more than what you'll find with Object Storage. Special considerations have to be made when transferring tape drive data, such as the ability to ship drives safely across a country. With Object Storage, this data is available through HTTP from anywhere in the world.

### Backups

Databases and other critical data can be easily backed up to Object Storage using a command line client for easier automation. Objects within Object Storage are normally replicated three times, providing resiliency should an error occur with the underlying hardware. Additionally, buckets can be versioned, so that you never lose access to older backups.

### Private File Storage

Objects can be made private and only accessible with a key. By default, [all new objects in a bucket are set to be private](/docs/platform/object-storage/how-to-use-object-storage/#upload-download-and-delete-an-object-with-the-cli), so they are inaccessible by normal HTTP requests (though it's easy to set public permissions on objects if you'd like). This makes it easy to store secure data.

## Next Steps

If you're curious about how to use Object Storage, you can read our guide on [How to Use Linode Object Storage](/docs/platform/object-storage/how-to-use-object-storage/) for detailed instructions on how to create buckets and upload objects. Read our [Host a Static Site using Linode Object Storage](/docs/platform/object-storage/host-static-site-object-storage/) to get started with hosting your own site on Object Storage.

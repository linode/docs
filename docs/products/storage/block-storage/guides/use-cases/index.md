---
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how people use Block Storage to expand their persistent storage on the Linode Platform."
keywords: ['block','storage','use','cases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-27
modified: 2022-08-24
modified_by:
  name: Linode
title: "Common Use Cases for Block Storage"
contributor:
  name: Linode
tags: ["linode platform"]
aliases: ['/platform/block-storage/block-storage-use-cases/','/guides/block-storage-use-cases/']
---

{{< content "nvme-block-storage-notice-shortguide" >}}

## What is Block Storage

Block Storage is a type of persistent cloud data storage that is similar to a traditional block device, like the hard drive in a PC. With Block Storage, your data is divided into *blocks*, which are the small, discrete units that Block Storage can read from and write to. These blocks are assigned unique identifiers, but these are generally not human-readable, so a filesystem is usually installed which maps your files to the underlying blocks they correspond to. This relationship is also analogous to your PC's filesystem and hard drive.

A Block Storage *Volume* houses these blocks of data. Volumes can be *attached* to a cloud computing instance, which makes its data and filesystem available to the instance. If your instance is running Linux, then mounting a Volume's filesystem is just like mounting any other filesystem.

Volumes are stored separately from your cloud instances, but inside the same data center, and they are attached via the data center's private networking. A Volume can be detached from a cloud instance and its data will persist, even if the cloud instance is deleted. The Volume can also be re-attached to a different instance (though only one attachment at a time is possible). Volumes can also be increased in size at any time, independent of an instance's built-in storage.

### Benefits and Limitations

A Block Storage Volume augments the raw storage capacity of a cloud instance, which can be useful if your storage needs are greater than your computing demands. Because a Volume is scalable, it can adapt as your data grows in size. Additionally, all data stored with Linode Block Storage is replicated three times, so your Volumes are highly available and fault tolerant.

{{< note >}}
While the health and uptime of Linode Block Storage is closely monitored by Linode Support, we still recommend [making separate backups](/docs/guides/backing-up-your-data/) of your Volumes.
{{< /note >}}

Because Volumes are directly connected to an instance, their I/O speeds are much faster than those of an alternative storage solution like Object Storage. As well, the nature of Block Storage allows you to read and write small parts of your data, which means that you can incrementally update your files. This is in contrast to Object Storage, which requires a full re-upload of a file to update it.

Some aspects of Block Storage lead to natural limitations. In particular, a Volume needs to be attached to a cloud instance for its data to be accessible. In comparison, a file stored in Object Storage can be downloaded by any internet connected client at any time.

Below you will find some of the more popular use cases for Block Storage.

## Use Cases

### Persistent Storage

Block Storage Volumes can be detached from a cloud instance just as easily as they are attached, meaning that it's possible to create hot-swappable drives with Block Storage. This is useful if you need to perform the same kind of tasks across a fleet of instances with the same data.

{{< caution >}}
While the Block Storage service has full support for hot swapping, it is important to follow the detachment instructions outlined in our [Attach and Detach a Volume](/docs/products/storage/block-storage/guides/attach-and-detach/#detach-a-volume) guide. If a Volume is not safely detached, there is a risk of data loss for the Volume.
{{< /caution >}}

### Container Storage

Containers, like those created with Docker or inside Kubernetes Pods, can benefit from having some type of persistent storage. This helps to keep a container's size down and makes it easy to maintain data outside of the normal lifecycle of the container or Pod.

If you are using Docker, you can use the [Docker Volume Driver for Linode](https://github.com/linode/docker-volume-linode) to create a Docker volume from a Block Storage Volume. Similarly, if you are using Kubernetes you can use the [Container Storage Interface (CSI) Driver for Linode Block Storage](https://github.com/linode/linode-blockstorage-csi-driver) to create a Persistent Volume Claim that's backed by a Block Storage Volume.

### Database Storage

With the release of NVMe Block Storage, our Block Storage service is able to meet the demands of the most resource-intensive database applications. Many enterprise database solutions benefit from ultra-fast NVMe storage, as well as the redundancy and fault tolerance provided by Block Storage. See the Availability section in the [Block Storage Overview](/docs/products/storage/block-storage/#availability) page to learn which data centers have already been upgraded with NVMe Block Storage.

### Running Cloud Software

In a climate where ownership over one's data is an important need for many individuals and organizations, hosting your own cloud software is a great use case for Block Storage. Create and mount a Block Storage Volume, [install an application like OwnCloud](/docs/guides/install-and-configure-owncloud-on-ubuntu-16-04/), and point its data folder to a location on your Volume. If you ever run out of space on your Volume you can always increase its size.

### Storage for Media Library Applications

There are a few media library applications, most notably [Plex](https://www.plex.tv/), that offer media streaming functionality to internet enabled devices. The media libraries these applications serve can quickly grow in size, depending on the number of movie and audio files they contain. Using a Block Storage Volume can provide you with storage capable of growing with the needs of your library.

{{< note >}}
For more information on using Plex with a Block Storage Volume, see our [Using a Block Storage Volume with Plex](/docs/guides/use-block-storage-with-plex-media-server/) guide.
{{< /note >}}

### Ephemeral Storage

Various stages of the software development lifecycle can create large amounts of temporary data, such as buffers, builds, and cache and session data. While this data might only exist for a short period of time, it requires and utilizes storage space. Creating a Block Storage Volume just for ephemeral data is a good use case for times when the storage supplied with your instance is not enough, or for when you need extra space for a short period of time.

### Data Backups

Having backups of your data is always a good idea, and Block Storage Volumes make for scalable and quickly accessible backup mediums. Store anything that you might need to quickly transfer to another instance, or anything that you might need at a moment's notice.

### Boot Disks

You can boot from disk images installed to a Block Storage Volume. This provides a cost effective means of maintaining an image that can be attached to a new Linode. For example, you could save money by creating and removing on-demand Linode instances that boot from a Volume.  As well, you can boot from a Volume to access and recover an instance whose normal operating system may not be running as expected.

{{< note >}}
Linode provides a built-in [Rescue Mode](/docs/guides/rescue-and-rebuild/) feature, but maintaining your own rescue Volume can allow you to include the recovery tools you prefer to use.
{{< /note >}}

## Next Steps

For more information on how to use Block Storage, consult our [Block Storage Overview](/docs/products/storage/block-storage/) guide.

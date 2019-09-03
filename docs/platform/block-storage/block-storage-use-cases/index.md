---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use cases for Linode Block Storage.'
keywords: ['block','storage','use','cases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-27
modified_by:
  name: Linode
title: "Block Storage Use Cases"
contributor:
  name: Linode
---

## What is Block Storage

Block storage is a method of storing data. With Block Storage, data is divided and stored in small *blocks*. The Block Storage *Volume* that houses these blocks is mounted to a file system and acts like a hard drive, providing scalable amounts of additional raw storage capacity to the server it's attached to. Because the Volume is directly connected to the server, the I/O speeds are much faster than those of an alternative storage solution like Object Storage. Additionally, all data stored with Linode Block Storage is replicated three times, creating data that is highly available and fault tolerant. All that's required to get started using Block Storage is to mount the Volume and format it with the file system of your choice.

Below you will find some of the more popular use cases for Block Storage.

## Use Cases

### Databases

Databases require quick read/write operations and, with the ever increasing demands of data, the ability to scale. Block Storage Volumes are mounted directly to the filesystem, so there is a minimal delay in writing and retrieving data. Additionally, it's easy to upsize a Block Storage Volume so one can scale the Volume to match the increasing demands of a database.

### Persistent Storage

Block Storage Volumes can be unmounted just as easily as they are mounted, meaning that it's possible to create hot-swappable drives with Block Storage. This is useful if you need to perform the same kind of tasks across a fleet of servers with the same data.

### Container Storage

Containers, like those created with Docker or Kubernetes Pods, can benefit from having some type of persistent storage. This helps to keep the container size down, and makes it easy to maintain data despite the lifecycle of the container or Pod. If you are using Docker, you can use the [Docker Volume Driver for Linode](https://github.com/linode/docker-volume-linode) to create a Docker volume from a Block Storage Volume. Similarly, if you are using Kubernetes you can use the [Container Storage Interface (CSI) Driver for Linode Block Storage](https://github.com/linode/linode-blockstorage-csi-driver) to create a Block Storage Volume backed Persistent Volume Claim.

### Running Cloud Software

In a climate where ownership over one's own data is an important need for many individuals and organizations, hosting your own cloud software is a great use case for Object Storage. Simply create and mount a Block Storage Volume, [install an application like OwnCloud](https://linode.com/docs/applications/cloud-storage/install-and-configure-owncloud-on-ubuntu-16-04/), and point the data folder to a location on your Volume. If you ever run out of space on your Volume you can always increase its size.

### Storage for Media Library Applications

There are a few media library applications, most notably [Plex](https://www.plex.tv/), that offer media streaming functionality to internet enabled devices. The media libraries these applications serve can quickly grow in size depending on the number of movie and audio files they house. Using a Block Storage Volume can provide you with storage capable of growing with the needs of your library.

### Ephemeral Storage

Various stages of the software development lifecycle can create large amounts of temporary data, such as buffers, builds, and cache and session data. While this data might only exist for a short period of time, it requires and utilizes storage space. Creating a Block Storage Volume just for ephemeral data is a good use case for times when the storage supplied with your server is not  on it's own,   or for when you need extra space for a short period of time.

### Data Backups

Having backups of your data is always a good idea, and Block Storage Volumes make for scalable and quickly accessible backup mediums. Store anything that you might need to quickly transfer to another server, or anything that you might need at a moment's notice.

### Boot Disks

You can boot from disk images installed to a Block Storage Volume. This provides a cost effective means of maintaining an image that can be attached to a new Linode if for some reason you need to restore a failed server.

## Next Steps

For more information on how to use Block Storage, consult our [How to Use Block Storage with Your Linode](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/) guide.

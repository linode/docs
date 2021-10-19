---
slug: how-to-use-object-storage
author:
  name: Linode Community
  email: docs@linode.com
description: "Get started using Linode's Object Storage."
keywords: ['object','storage','bucket']
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-12
modified: 2019-04-12
modified_by:
  name: Linode
title: "How to Use Linode Object Storage"
contributor:
  name: Linode
external_resources:
- '[S3cmd usage and command reference](https://s3tools.org/usage)'
aliases: ['/platform/object-storage/how-to-use-object-storage/']
---

{{< youtube q88OKsr5l6c >}}

{{< content "object-storage-ga-shortguide" >}}

{{< content "object-storage-cancellation-shortguide" >}}

Linode's Object Storage is a globally-available, S3-compatible method for storing and accessing data. Object Storage differs from traditional hierarchical data storage (as in a Linode's disk) and [Block Storage Volumes](/docs/guides/platform/block-storage/). Under Object Storage, files (also called *objects*) are stored in flat data structures (referred to as *buckets*) alongside their own rich metadata.

Additionally, **Object Storage does not require the use of a Linode.** Instead, Object Storage gives each object a unique URL with which you can access the data. An object can be publicly accessible, or you can set it to be private and only visible to you. This makes Object Storage great for sharing and storing unstructured data like images, documents, archives, streaming media assets, and file backups, and the amount of data you store can range from small collections of files up to massive libraries of information. Lastly, Linode Object Storage has the built-in ability to [host a static site](/docs/platform/object-storage/host-static-site-object-storage/).

In this guide you learn about:

 - How to get set-up for object storage by [creating an Object Storage Key Pair](/docs/platform/object-storage/how-to-use-object-storage/#object-storage-key-pair).

 - The variety of first-party and third-party [tools available](/docs/platform/object-storage/how-to-use-object-storage/#object-storage-tools) to access and use the service.

 - How to use Object Storage with the [Cloud Manager](/docs/platform/object-storage/how-to-use-object-storage/#cloud-manager).

## Enabling Object Storage

{{< content "object-storage-enable-shortguide" >}}

## Access Keys

The first step towards using Object Storage is to create a pair of keys for the service. This pair is composed of an *access key* and a *secret key*:

-   The access key allows you to access any objects that you set to have private read permissions.

    {{< note >}}
To use the access key when viewing a private object, you first need to generate a *signed* URL for the object. The signed URL is much like the standard URL for the object, but some extra URL parameters are appended to it, including the access key. Instructions for generating a signed URL can be found for [s3cmd](/docs/products/storage/object-storage/guides/s3cmd/#create-a-signed-url-with-s3cmd) and the [Linode CLI](/docs/products/storage/object-storage/guides/linode-cli/#create-a-signed-url-with-the-cli), outlined in this guide.
{{< /note >}}

-   The secret key is used together with the access key to authenticate the various Object Storage tools with the Linode account. You should not share the secret key.

    {{< note >}}
Each Object Storage key pair on the Linode account has complete access to all of the buckets on the account.
{{< /note >}}

### Generating an Access Key

{{< content "object-storage-access-keys-shortguide" >}}

### Limiting Access through Access Keys

By default, an Access Key is unrestricted and has full access to all Buckets on an account. When creating an Access Key, you can enable **Limited Access** and set more granular permissions for each Bucket. These permissions include **None**, **Read**, and **Read/Write**:

- **None**: Restricts all access to the specified Bucket. This Access Key will still be able to view the Bucket in the list of all Buckets, but will otherwise be unable to access any objects stored within it.

- **Read** *(read_only)*: Access keys with **Read** permissions are able to list and retrieve most information about the specified Bucket and objects stored in that Bucket. Technically, **read** permissions provide access to the following s3 actions (which are used by all s3-compatible clients and tools):

    *GetBucketAcl, GetBucketCORS, GetBucketLocation, GetBucketLogging, GetBucketNotification, GetBucketPolicy, GetBucketTagging, GetBucketVersioning, GetBucketWebsite, GetLifecycleConfiguration, GetObjectAcl, GetObject, GetObjectTorrent, GetReplicationConfiguration, GetObjectVersionAcl, GetObjectVersion, GetObjectVersionTorrent, ListBucketMultipartUploads, ListBucket, ListBucketVersions, ListMultipartUploadParts*

- **Read/Write** *(read_write)*: Access keys with **Read/Write** permissions can list, retrieve, add, delete, and modify most information and objects stored within the specified Bucket. Technically, **read/write** permissions provide access to all of the same s3 actions as **read** permissions, as well as the following:

    *AbortMultipartUpload, DeleteBucketWebsite, DeleteObject, DeleteObjectVersion, DeleteReplicationConfiguration, PutBucketCORS, PutBucketLogging, PutBucketNotification, PutBucketTagging, PutBucketVersioning, PutBucketWebsite, PutLifecycleConfiguration, PutObject, PutObjectAcl, PutObjectVersionAcl, PutReplicationConfiguration, RestoreObject*

A full list of s3 actions is available on [Amazon's S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/API_Operations_Amazon_Simple_Storage_Service.html) documentation.

## Control Access with ACLs and Bucket Policies

Linode Object Storage allows users to share access to objects and buckets with other Object Storage users. There are two mechanisms for setting up sharing: *Access Control Lists (ACLs)*, and *bucket policies*. These mechanisms perform similar functions: both can be used to restrict and grant access to Object Storage resources. [Learn more about ACLs and bucket policies](/docs/guides/how-to-use-object-storage-acls-and-bucket-policies/).

## Bucket Names

Bucket names, also referred to as labels, need to be unique within the same cluster, including buckets on other users' Linode accounts. This also means if you reserve a bucket name in one cluster, it is not automatically reserved in another. For example, if you have `my-bucket.us-east-1.linode.com` and want `my-bucket.eu-central-1.linode.com` you must manually reserve them both. They are separate clusters and not guaranteed. If the label you enter is already in use, then choose a different label. Additionally, bucket labels have the following rules:

- Cannot be formatted as IP addresses.
- Must be between 3 and 63 characters in length.
- Can only contain lower-case characters, numbers, periods, and dashes.
- Must start with a lowercase letter or number.
- Cannot contain underscores (_), end with a dash (-) or period (.), have consecutive periods (.), or use dashes (-) adjacent to periods (.).

{{< content "object-storage-cluster-shortguide" >}}

## Object Storage TLS/SSL Certificates

Object storage supports the importing of custom [TLS/SSL Certificates](/docs/security/ssl/) in order to encrypt connections with your bucket in transit. Currently, you can Upload, View, or Delete TLS/SSL certificates using the following API Endpoints:

- [Upload Object Storage TLS/SSL Cert](/docs/api/object-storage/#object-storage-tlsssl-cert-upload)
- [View Object Storage TLS/SSL Cert](/docs/api/object-storage/#object-storage-tlsssl-cert-view)
- [Delete Object Storage TLS/SSL Cert](/docs/api/object-storage/#object-storage-tlsssl-cert-delete)

Like all API endpoints, TLS/SSL certificates can additionally be added using the [Linode CLI](/docs/platform/api/linode-cli/).

For more information on Object Storage Certificates, including configuration options in the Linode Manager, see our [Guide for Custom Object Storage Certificates](/docs/platform/object-storage/enable-ssl-for-object-storage/)

## Object Storage Tools

There are a number of tools that are available to help manage Linode Object Storage. This guide explains how to install and use the following options:

- The [Linode Cloud Manager](#cloud-manager) can be used to create buckets, and upload and delete objects, as well as create access keys for use with the S3 compatible clients.

- The [Linode CLI](/docs/products/storage/object-storage/guides/linode-cli) has an Object Storage plugin and can be used to create and remove buckets, add and remove objects, and convert a bucket into a static site from the command line.

- [s3cmd](/docs/products/storage/object-storage/guides/s3cmd) is a powerful command line utility that can be used with any S3-compatible object storage service, including Linode's. s3cmd can be used to create and remove buckets, add and remove objects, convert a bucket into a static site from the command line, plus other functions like syncing entire directories up to a bucket.

- [Cyberduck](/docs/products/storage/object-storage/guides/cyberduck) is a graphical utility available for Windows and macOS and is a great option if you prefer a GUI tool.

## Cloud Manager

### Create a Bucket

{{< content "object-storage-create-bucket-shortguide" >}}

### Upload Objects to a Bucket

{{< content "object-storage-upload-objects-shortguide" >}}

### View Bucket Objects

{{< content "object-storage-view-bucket-objects-shortguide" >}}

### Delete Objects from a Bucket

{{< content "object-storage-delete-objects-shortguide" >}}

### Delete a Bucket

{{< content "object-storage-delete-bucket-shortguide" >}}

## Cancel Object Storage

{{< content "object-storage-cancel-shortguide" >}}

## Next Steps

There are S3 bindings available for a number of programming languages, including the popular [Boto](https://github.com/boto/boto3) library for Python, that allow you to interact with Object Storage programmatically.

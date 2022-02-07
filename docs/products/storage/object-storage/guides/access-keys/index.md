---
slug: access-keys
author:
  name: Linode
  email: docs@linode.com
description: "How to create an Access Key for use with Linode Object Storage."
keywords: ['object storage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-28
modified: 2022-02-07
modified_by:
  name: Linode
title: "Managing Access Keys on Linode's Object Storage"
h1_title: "Managing Access Key"
enable_h1: true
aliases: ['/products/storage/object-storage/guides/generate-key-pair/','/products/storage/object-storage/guides/generate-access-keys/']
---

To start integrating Object Storage with your own applications, you need to create an *access key*. When an access key is generated, a corresponding *secret key* is also created.

-   The **access key** allows you to access any objects that you set to have private read permissions.

    {{< note >}}
To use the access key when viewing a private object, you first need to generate a *signed* URL for the object. The signed URL is much like the standard URL for the object, but some extra URL parameters are appended to it, including the access key. Instructions for generating a signed URL can be found for [s3cmd](/docs/products/storage/object-storage/guides/s3cmd/#create-a-signed-url-with-s3cmd) and the [Linode CLI](/docs/products/storage/object-storage/guides/linode-cli/#create-a-signed-url-with-the-cli), outlined in this guide.
{{< /note >}}

-   The **secret key** is used together with the access key to authenticate the various Object Storage tools with the Linode account. You should not share the secret key.

## Viewing Access Keys

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Select the **Object Storage** link in the sidebar and navigate to the **Access Keys** tab.

![Viewing a list of access keys in the Cloud Manager](access-keys-list.png)

This page dispalys a list of all access keys added to your Object Storage account. From here, you can create a new access key, edit the labels on the existing keys, view the permissions, or revoke access (which deletes the access key).

## Create an Access Key

To use Object Storage with any compatible client or command-line tool, you'll need to generate an Access Key. This can be done directly in the Cloud Manager.

1.  Navigate to the **Access Keys** page in the Cloud Manager (see [Viewing Access Keys](#viewing-access-keys)).

1.  Click the **Create Access Key** button, which displays the **Create Access Key** panel.

1.  Enter a label for the access key. This label is how you reference the access key in the Cloud Manager and any S3 compatible client.

1.  Toggle the **Limited Access** switch if you wish to only provide access to certain buckets. This allows you to limit the permissions for the new access key on a per-bucket level. See [Access Key Permissions](#access-key-permissions) for more details.

1.  Click the **Submit** button to create the access key. A dialog box appears that displays the new access key and its secret key. While the access key is always visible within the Cloud Manager, its corresponding secrete key is only visible once and cannot be retrieved again after this window is closed. Store this secret key somewhere secure, such as a password manager.

    ![The access key and secret key displayed within the Cloud Manager](access-keys-display-after-creation.png )

You now have the credentials needed to connect to Object Storage.

## Revoke Access Key

1.  Navigate to the **Access Keys** page in the Cloud Manager (see [Viewing Access Keys](#viewing-access-keys)).

1.  Find the access key you wish to remove and click the corresponding **Revoke** button.

1. A confirmation dialog appears. Click the **Revoke** button to immediately revoke the access key.

## Access Key Permissions

By default, an Access Key is unrestricted and has full access to all Buckets on an account. When creating an Access Key, you can enable **Limited Access** and set more granular permissions for each Bucket. These permissions include **None**, **Read**, and **Read/Write**:

{{< note >}}
Regardless of permissions, all access keys can create new buckets and list all buckets. However, after creating a bucket, depending on what you select here, a limited access key may not be able to access those buckets, add items, remove items, and other actions.
{{</ note >}}

- **None**: Restricts all access to the specified Bucket. This Access Key will still be able to view the Bucket in the list of all Buckets, but will otherwise be unable to access any objects stored within it.

- **Read** *(read_only)*: Access keys with **Read** permissions are able to list and retrieve most information about the specified Bucket and objects stored in that Bucket. Technically, **read** permissions provide access to the following s3 actions (which are used by all s3-compatible clients and tools):

    > *GetBucketAcl, GetBucketCORS, GetBucketLocation, GetBucketLogging, GetBucketNotification, GetBucketPolicy, GetBucketTagging, GetBucketVersioning, GetBucketWebsite, GetLifecycleConfiguration, GetObjectAcl, GetObject, GetObjectTorrent, GetReplicationConfiguration, GetObjectVersionAcl, GetObjectVersion, GetObjectVersionTorrent, ListBucketMultipartUploads, ListBucket, ListBucketVersions, ListMultipartUploadParts*

- **Read/Write** *(read_write)*: Access keys with **Read/Write** permissions can list, retrieve, add, delete, and modify most information and objects stored within the specified Bucket. Technically, **read/write** permissions provide access to all of the same s3 actions as **read** permissions, as well as the following:

    > *AbortMultipartUpload, DeleteBucketWebsite, DeleteObject, DeleteObjectVersion, DeleteReplicationConfiguration, PutBucketCORS, PutBucketLogging, PutBucketNotification, PutBucketTagging, PutBucketVersioning, PutBucketWebsite, PutLifecycleConfiguration, PutObject, PutObjectAcl, PutObjectVersionAcl, PutReplicationConfiguration, RestoreObject*

A full list of s3 actions is available on [Amazon's S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/API_Operations_Amazon_Simple_Storage_Service.html) documentation.

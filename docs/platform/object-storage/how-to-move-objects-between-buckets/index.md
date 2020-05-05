---
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows you how to move your objects stored in Linode's Object Storage from one bucket to another."
og_description: "This guide shows you how to move your objects stored in Linode's Object Storage from one bucket to another."
keywords: ['object','storage','bucket']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-04
modified: 2020-05-04
modified_by:
  name: Linode
title: "How to Move Objects Between Buckets in Linode's Object Storage"
h1_title: "Moving Objects Between Buckets in Linode's Object Storage"
contributor:
  name: Linode
external_resources:
- '[Cyberduck duck documentation](https://trac.cyberduck.io/wiki/help/en/howto/cli)'
---

{{< content "object-storage-ga-shortguide" >}}

Linode’s Object Storage is a globally-available, S3-compatible method for storing and accessing data. With Object Storage more widely available, you may have buckets in multiple locations, this guide will show you how to move objects between buckets quickly and easily.

In this guide you will learn how to move objects between buckets using:

- [Cyberduck's Graphical Interface](#cyberduck-graphical-interface)

- [Cyberduck's CLI, duck](#cyberduck-cli)

## Before You Begin

To learn how to enable Object Storage, see the [How to Use Object Storage](/docs/platform/object-storage/how-to-use-object-storage/) guide.

Object Storage is similar to a subscription service. **Once enabled, you will be billed at the flat rate regardless of whether or not there are active buckets on your account.** [Cancelling Object Storage](/docs/platform/object-storage/how-to-use-object-storage/#cancel-object-storage) will stop billing for this flat rate.

In all Object Storage URLs the cluster where your bucket is hosted is a part of the URL string.

{{< content "object-storage-cluster-shortguide" >}}

## Cyberduck Graphical Interface

The easiest way to move objects between buckets is using a graphical interface like Cyberduck. In this way, you can simply drag and drop objects between buckets.

### Transfer Between Buckets in the Same Cluster

To transfer objects within the same cluster on the same account, you only need one Cyberduck window open.

1.  Open Cyberduck and make a connection to access your buckets as described in [How to Use Linode Object Storage](/docs/platform/object-storage/how-to-use-object-storage/#cyberduck).

1.  Expand the two buckets you wish to transfer objects between by clicking the down arrow to the left of the folders.

1.  Locate the object you wish to transfer.

1.  Drag the item from the source location to the destination.

    ![Drag a File to Move](objStorageMoveFile.png "Drag a File to Move")

1.  You can easily move multiple items or folders this way by selecting everything you wish to move and dragging the group.

    ![Drag Multiple Files to Move](objStorageMoveMultipleFiles.png "Drag Multiple Files to Move")

### Transfer Between Buckets in Different Clusters

To transfer objects between two clusters, whether they are on the same account or not, you will need to open two separate Cyberduck widows so that you can make two separate connections.

{{< note >}}
Transferring objects between two different connections will create a copy of the object(s). If you don't want the original files in the source bucket, you'll need to delete them after the transfer.
{{</ note >}}

1.  With Cyberduck open, click the **File** menu and select **New Browser**. This will open a second interface window where you can create another connection.

1.  In the first window, connect to the source bucket and locate the object you wish to copy.

1.  In the second window, connect to the destination bucket and navigate to the location you wish to place a copy of the object.

1.  Drag the object from the source to the destination.

    ![Select Objects to Move Between Cyberduck Windows](copyObjectsBetweenBuckets.png "Select Objects to Move Between Cyberduck Windows")

{{< note >}}
You can easily copy multiple items, folders, or buckets by selecting everything you wish to move and dragging the group. If you move a bucket to another bucket, it will create a folder with that bucket name.
{{</ note >}}

## Cyberduck CLI

You can also use the Cyberduck CLI, duck, to move objects from bucket to bucket from the command line. Duck is available for Linux, macOS, and Windows.

1.  [Install duck](https://duck.sh) using the instructions for your platform.

1.  Using your access keys and bucket names below, use the following command to move your objects between buckets:

        duck --copy s3://$access_key_source@$bucket_source/source_object_file_name s3://$access_key_destination@$bucket_destination/destination_object_file_name

    After issuing this command, you may be asked for login information.

{{< note >}}
The bucket source and destination names are the fully qualified names including the cluster name, for example: `us-east-1.linodeobjects.com/example_bucket`.
{{</ note >}}



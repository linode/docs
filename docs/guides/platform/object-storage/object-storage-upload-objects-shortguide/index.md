---
slug: object-storage-upload-objects-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to upload objects to a Linode Object Storage bucket.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Upload Objects to a Linode Object Storage Bucket
keywords: ["object storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/object-storage/object-storage-upload-objects-shortguide/']
---

Follow these steps to upload objects to a bucket using the Cloud Manager:

1.  If you have not already, log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Click the **Object Storage** link in the sidebar. A list of all the buckets appears. Click the bucket where you want to upload the objects.

    ![Select an Object Storage Bucket](select-bucket.png "Select an Object Storage Bucket")

1. The bucket's **Objects Listing Page** appears. In the example, the *my-example-bucket* does not yet contain any objects. You can use the **Upload Files Pane** to drag and drop a file from the local computer to the object storage bucket.

    {{< note >}}
You can drag and drop multiple files to the **Upload Files Pane** at one time.
    {{</ note >}}

    ![Drag and drop an object to the bucket](drag-drop-image-bucket.png "Drag and drop an object to the bucket")

    You can also click the **Browse Files** button to bring up the local computer's file browser and select a file to upload to the bucket.

    ![Upload an object to the bucket using the file browser](upload-with-file-browser.png "Upload an object to the bucket using the file browser")

1.  When the upload has completed, the object appears in the **Objects Listing Page**.

    ![Successful upload of the object](successful-object-upload.png "Successful upload of the object")

    {{< note >}}
Individual object uploads are limited to a size of 5GB each, though larger object uploads can be facilitated with multipart uploads. [s3cmd](/docs/platform/object-storage/how-to-use-object-storage/#s3cmd) and [Cyberduck](/docs/platform/object-storage/how-to-use-object-storage/#cyberduck) do this for you automatically if a file exceeds this limit as part of the uploading process.
{{< /note >}}

---
slug: how-to-access-objects-with-linode-object-storage
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows you multiple ways to access your objects stored in Linode's Object Storage."
og_description: "This guide shows you multiple ways to access your objects stored in Linode's Object Storage."
keywords: ['object','storage','bucket']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-01-22
modified: 2020-01-22
modified_by:
  name: Linode
image: AccessingObjectswithLinodeObjectStorage.png
title: "How to Access Objects with Linode Object Storage"
h1_title: "Accessing Objects with Linode Object Storage"
contributor:
  name: Linode
tags: ["linode platform"]
aliases: ['/platform/object-storage/how-to-access-objects-with-linode-object-storage/']
---

{{< content "object-storage-ga-shortguide" >}}

Object Storage gives each object a unique URL with which you can access your data. An object can be publicly accessible, or you can set it to be private and only visible to you. This makes Object Storage great for sharing and storing unstructured data like images, documents, archives, streaming media assets, and file backups, and the amount of data you store can range from small collections of files up to massive libraries of information.

In this guide you will learn how to access the objects you have stored in Linode's Object Storage using:

- [Object URLs](#object-urls)

- [Signed URLs](#signed-urls)

- [Websites](#websites)

## Before You Begin

To learn how to enable Object Storage, see the [How to Use Object Storage](/docs/platform/object-storage/how-to-use-object-storage/) guide.

Object Storage is similar to a subscription service. **Once enabled, you will be billed at the flat rate regardless of whether or not there are active buckets on your account.** [Cancelling Object Storage](/docs/platform/object-storage/how-to-use-object-storage/#cancel-object-storage) will stop billing for this flat rate.

In all Object Storage URLs the cluster where your bucket is hosted is a part of the URL string.

{{< content "object-storage-cluster-shortguide" >}}

## Object URLs

Objects stored in Linode object storage are generally accessible using this format:

    http://my-example-bucket.us-east-1.linodeobjects.com/example.txt

- Replace the following fields with your information:

  - `my-example-bucket` with your bucket name
  - `us-east-1` with the cluster where your bucket is hosted
  - `example.txt` with the object you wish to access

- This assumes that the object is publicly accessible. For more on object permissions, see the [How to Use Object Storage](/docs/platform/object-storage/how-to-use-object-storage/) guide.

## Signed URLs

Creating a **signed URL** will allow you to create a link to objects with limited permissions for a short amount of time. Signed URLs have a similar format:

    http://my-example-bucket.us-east-1.linodeobjects.com/example.txt?AWSAccessKeyId=YOUROBJECTSTORAGEACCESSKEY&Expires=1579725476&Signature=rAnDomKeySigNAtuRe

- This is returned when you use a tool like the [Linode CLI](/docs/platform/object-storage/how-to-use-object-storage/#create-a-signed-url-with-the-cli) or [s3cmd](/docs/platform/object-storage/how-to-use-object-storage/#create-a-signed-url-with-s3cmd) to generate a signed URL.

- Replace the following fields with your information:

  - `my-example-bucket` with your bucket name
  - `us-east-1` with the cluster where your bucket is hosted
  - `example.txt` with the object you are giving access to

- The rest of the URL are the parts that make this URL public for a limited amount of time.

## Websites

Static sites are served from URLs that are different than the standard URLs you would normally use to access objects. Static sites prepend `website-` to the cluster name to create a subdomain such as `website-us-east-1`. Using `my-example-bucket` as an example, a full URL would look like this:

    http://my-example-bucket.website-us-east-1.linodeobjects.com

- Replace the following fields with your information:

  - `my-example-bucket` is your bucket name
  - `website-` is added to the cluster location where your bucket is hosted

{{< note >}}
For more information on hosting a static website with Object Storage, read our [Host a Static Site using Linode Object Storage](/docs/platform/object-storage/host-static-site-object-storage/) guide.
{{</ note >}}

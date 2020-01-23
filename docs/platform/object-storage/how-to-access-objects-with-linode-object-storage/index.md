---
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
title: "How to Access Objects with Linode Object Storage"
h1_title: "Accessing Objects with Linode Object Storage"
contributor:
  name: Linode
---

{{< note >}}
[Linode Object Storage](/docs/platform/object-storage/) is now available to the general public in the Newark data center! Starting November 1, 2019, all customers with the Object Storage service enabled on their account will be billed. For more information, see our [Object Storage Pricing and Limitations](/docs/platform/object-storage/pricing-and-limitations/) guide.
{{</ note >}}

Object Storage gives each object a unique URL with which you can access your data. An object can be publicly accessible, or you can set it to be private and only visible to you. This makes Object Storage great for sharing and storing unstructured data like images, documents, archives, streaming media assets, and file backups, and the amount of data you store can range from small collections of files up to massive libraries of information.

In this guide you will learn how to access the objects you have stored in Linode's Object Storage for:

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

- Replace `my-example-bucket` with your bucket name, `us-east-1` with the cluster where your bucket is hosted, and `example.txt` with the object you wish to access.

- This asssumes that the object is publically accessible. For more on object permissions, see the [How to Use Object Storage](/docs/platform/object-storage/how-to-use-object-storage/) guide.

## Signed URLs

Creating a **signed URL** will allow you to create a link to objects with limited permissions and a time limit to access them. Signed URLs have a similar format:

    http://my-example-bucket.us-east-1.linodeobjects.com/example.txt?AWSAccessKeyId=YOUROBJECTSTORAGEACCESSKEY&Expires=1579725476&Signature=rAnDomKeySigNAtuRe

- This is returned when you use a tool like the [Linode CLI](/docs/platform/object-storage/how-to-use-object-storage/#create-a-signed-url-with-the-cli) or [s3cmd](/docs/platform/object-storage/how-to-use-object-storage/#create-a-signed-url-with-s3cmd) to generate a signed URL.

- `my-example-bucket` will be your bucket name, `us-east-1` will be the cluster where your bucket is hosted, `example.txt` will be the object you are giving access to.

- The rest of the URL are the parts that make this URL public for a limited amount of time.

## Websites

Static sites are accessed from different URLs than other objects in your Object Storage bucket. Static sites are available at the `website-us-east-1` subdomain. Using `my-example-bucket` as an example this would be:

    http://my-example-bucket.website-us-east-1.linodeobjects.com

- `my-example-bucket` is your bucket name and `website-` is added to the cluster location where your bucket is hosted.

{{< note >}}
For more information on hosting a static website with Object Storage, read our [Host a Static Site using Linode Object Storage](/docs/platform/object-storage/host-static-site-object-storage/) guide.
{{</ note >}}

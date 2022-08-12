---
author:
  name: Linode
  email: docs@linode.com
title: "Using the Linode CLI with Object Storage"
description: "Learn how to use the Linode CLI to manage Linodes own Object Storage solution."
modified: 2022-05-02
---

The Linode Command Line Interface (CLI) is a command line utility that allows you complete control over the Linode account. For interacting with Object Storage, there are two separate commands within the Linode CLI.

- `linode object-storage [command]`: This resource provides access to managing Object Storage on a Linode account.
- `linode obj [command]`: With the Object Storage plugin, you can also create and remove buckets, upload objects, and more.

This guide details how to use the `obj` plugin. For `linode object-storage` usage, see [Linode CLI Commands for Object Storage](/docs/products/tools/cli/guides/object-storage/).

## Install and Configure the CLI

Follow the instructions within the [Install and Configure the Linode CLI](/docs/products/tools/cli/guides/install/) guide to get started using the CLI. If you wish to use the obj plugin and perform operations on buckets and objects, be sure to also install the boto library.

## Basic Commands

To get a list of all available buckets, use the `ls` command:

    linode-cli obj ls

To get a list of all objects in a bucket, use the `ls` command with the label of a bucket:

    linode-cli obj ls my-example-bucket

For a complete list of commands available with the Object Storage plugin, use the `--help` flag:

    linode-cli obj --help

## Create a Bucket with the CLI

To create a bucket with the Linode CLI, use the `mb` command. See the [Bucket Name](#bucket-names) section for rules on naming the bucket.

    linode-cli obj mb my-example-bucket

To delete a bucket, use the `rb` command:

    linode-cli obj rb my-example-bucket

Currently, the Linode CLI defaults to creating buckets in the Newark data center. To change the cluster a bucket is created in, use the `--cluster` option, followed by the cluster name below:

  - `us-east-1` for the Newark data center. This is the current default.
  - `eu-central-1` for the Frankfurt data center.
  - `ap-south-1` for the Singapore data center.

{{< note >}}
You need to use the `--cluster` option for every interaction with your bucket if it is not in `us-east-1`.
{{</ note >}}

If the bucket has objects in it, you can not delete it from the Linode CLI immediately. Instead, remove the objects first, then delete the bucket. The [s3cmd](/docs/products/storage/object-storage/guides/s3cmd/) tool has commands for deleting all objects from a bucket, and it can also force-delete a bucket with objects in it.

## Upload, Download, and Delete an Object with the CLI

1.  As an example object, create a text file and fill it with some example text.

        echo 'Hello World!' > example.txt

1.  To upload an object to a bucket using the Linode CLI, use the `put` command. Provide the object name as the first parameter and the bucket label as the second:

        linode-cli obj put --acl-public example.txt my-example-bucket

    - If the bucket is in the Newark data center, the file is accessible at the URL `http://my-example-bucket.us-east-1.linodeobjects.com/example.txt`.
    - If the bucket is in the Frankfurt data center, the file is accessible at the URL `http://my-example-bucket.eu-central-1.linodeobjects.com/example.txt`.
    - If the bucket is in the Singapore data center, the file is accessible at the URL `https://my-example-bucket.ap-south-1.linodeobjects.com/example.txt`

    {{< note >}}
The `--acl-public` flag is used to make the object publicly accessible, meaning that you can access the object from its URL. By default, all objects are set to private. To make a public file private, or a private file public, use the `setacl` command and supply the corresponding flag.

For example, if you want to make a public file private, you would append the `--acl-private` flag:

    linode-cli obj setacl --acl-private my-example-bucket example.txt
{{</ note >}}

1.  To download an object, use the `get` command. Provide the label of the bucket as the first parameter and the name of the file as the second:

        linode-cli obj get my-example-bucket example.txt

1.  To delete an object, use the `rm` or `del` command. Provide the label of the bucket as the first parameter and the name of the object as the second:

        linode-cli obj rm my-example-bucket example.txt

## Create a Signed URL with the CLI

Creating a **signed URL** allows you to create a link to objects with limited permissions and a time limit to access them. To create a signed URL on a preexisting object with the CLI, use the following syntax:

    linode-cli obj signurl my-example-bucket example.txt +300

The output of the command is a URL that can be used for a set period of time to access the object, even if the ACL is set to private. In this case, `+300` represents the amount of time in seconds that the link remains active, or five minutes total. After this time has passed, the link expires and can no longer be used.

## Create a Static Site with the CLI

To create a static website from a bucket:

1.  Use the `ws-create` command, including the `--ws-index` and `--ws-error` flags:

        linode-cli obj ws-create my-example-bucket --ws-index=index.html --ws-error=404.html

    The `--ws-index` and `--ws-error` flags specify which objects the bucket should use to serve the static site's index page and error page, respectively.

1.  You need to separately upload the `index.html` and `404.html` files (or however you have named the index and error pages) to the bucket:

        echo 'Index page' > index.html
        echo 'Error page' > 404.html
        linode-cli obj put index.html 404.html my-example-bucket

1.  Set the `--aclpublic` flag on both the `index.html` and `404.html` files:

        linode-cli obj setacl --acl-public my-example-bucket index.html
        linode-cli obj setacl --acl-public my-example-bucket 404.html

1.  The static site is accessed from a different URL than the generic URL for the Object Storage bucket. Static sites are available at the `website-us-east-1` subdomain for the Newark data center, the `website-eu-central-1` subdomain for the Frankfurt data center, or the `website-ap-south-1` subdomain for the Singapore data center. Using `my-example-bucket` as an example, navigate to either:

    - `http://my-example-bucket.website-us-east-1.linodeobjects.com` or
    - `http://my-example-bucket.website-eu-central-1.linodeobjects.com` or
    - `http://my-example-bucket.website-ap-south-1.linodeobjects.com`

For more information on hosting static websites from Linode Object Storage, see [Host a Static Site on Linode's Object Storage](/docs/guides/host-static-site-object-storage/) guide.

## Creating a New Access Key

If for whatever reason the access key you've set up when initially [Configuring the CLI](#install-and-configure-the-cli) has been revoked or deleted, you may see the following error message:

{{< output >}}
Error: InvalidAccessKeyId
{{< /output >}}

You can create and configure a new Access Key at any time by running the following command:

    linode-cli obj regenerate-keys

After running the command the access is restored, and you can see the new key listed at any time using the following command:

    linode-cli object-storage keys-list

{{< note >}}
Any new object storage keys issued through the CLI is prefixed with `linode-cli` as the label.
{{< /note >}}
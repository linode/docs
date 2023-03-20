---
title: "Using the AWS CLI with Object Storage"
description: "Learn how to use the AWS CLI with Linode's S3-compatible Object Storage."
date: 2022-03-11
authors: ["Linode"]
---

Amazon's [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) is a command-line tool that can be used to interface with Linode's Object Storage service.

{{< note >}}
This instructions within this guide use AWS CLI version 2. Earlier versions may not work. If you are using version 1 (or earlier), you may want to uninstall it before continuing. See [Installing, updating, and uninstalling the AWS CLI (version 1)](https://docs.aws.amazon.com/cli/v1/userguide/cli-chap-install.html).
{{< /note >}}

## Install the AWS CLI

Installing the AWS CLI version 2 is typically accomplished by downloading a package for your operating system and installing that package. Since there is not currently an official way to do this through a package manager, you must download the package manually. To do this, follow the instructions for your operating system on the [Installing or updating the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) guide.

## Configure the AWS CLI

1.  Run the following command in your preferred terminal:

        aws configure

1.  You are then prompted to fill out a few parameters:

    - **AWS Access Key ID:** Enter the access key you wish to use. See [Managing Access Keys](/docs/products/storage/object-storage/guides/access-keys/).
    - **AWS Secret Access Key:** Enter the secret key that corresponds with the access key. This was displayed once when generating the access key.
    - **Default region name:** Press enter without inputting any characters to keep the default `us` region. Do not change this, even if you use Object Storage in region outside the U.S.
    - **Default output format:** Press enter without inputting any characters.

See the following guides from AWS for more details configuring the CLI: [Quick Setup](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html) and [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

## Additional Parameters for AWS CLI Commands

- **Endpoint URL:** When using the AWS CLI with a non-AWS service, like Linode's Object Storage, you must always specify the endpoint url in each command. This is done through the `--endpoint` parameter. When using the commands in this guide, always replace *[endpoint-url]* with the cluster URL that corresponds with the data center you're using (see [Cluster URL (S3 endpoint)](/docs/products/storage/object-storage/guides/urls/#cluster-url-s3-endpoint)).

## Interacting with Buckets

### List Buckets

List all buckets within the data center specified during the configuration process.

**Command:** `aws s3 ls --endpoint=[endpoint-url]`, replacing *[endpoint-url]*

**Example**: List all buckets on the account within the Atlanta data center:

    aws s3 ls --endpoint=https://us-southeast-1.linodeobjects.com

### Create a Bucket

Creates a bucket with the specified bucket label. See the [Create and Manage Buckets](/docs/products/storage/object-storage/guides/manage-buckets/#create-a-bucket) guide for rules on naming the bucket.

**Command:** `aws s3 mb s3://[bucket-label] --endpoint=[endpoint-url] --region=us-east-1`, replacing *[bucket-label]* with the label you'd like to use for the new bucket.

**Example:** Create a bucket with the label of "example-bucket" in the Atlanta data center:

    aws s3 mb s3://example-bucket --endpoint=https://us-southeast-1.linodeobjects.com --region=us-east-1

### Delete a Bucket

Deletes the bucket with the specified label.

**Command:** `s3cmd rb s3://[bucket-label]`, replacing *[bucket-label]* with the label of the bucket you wish to delete.

**Example:** Delete the bucket with the label of "example-bucket":

    s3cmd rb s3://example-bucket

To delete a bucket that has files in it, include the `--recursive` (or `-r`) option *and* the `--force` (or `-f`) option. Use caution when running this command:

    s3cmd rb -r -f s3://example-bucket/
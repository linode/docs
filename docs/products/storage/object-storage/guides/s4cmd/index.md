---
title: "Using s4cmd with Object Storage"
description: "Learn how to use the s4cmd command-line tool with Linode's Object Storage."
authors: ["Linode"]
---

The [s4cmd](https://github.com/bloomreach/s4cmd) software is a command-line tool that can access S3-compatible storage services, such as Linode's Object Storage. It uses the [S3 client](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html) in Amazon's boto3 library. Compared to the popular s3cmd tool, s4cmd is typically much faster but it has less options and is less configurable. For many use cases, the [Linode CLI](/docs/products/storage/object-storage/guides/linode-cli) or [s3cmd](/docs/products/storage/object-storage/guides/s3cmd) is recommended.

## Installing s4cmd

To install S3cmd on both Mac and Linux systems, Python’s package manager [pip](/docs/guides/how-to-manage-packages-and-virtual-environments-on-linux/) can be used.

    sudo pip install s4cmd

Some Linux distributions are also able to install s4cmd from their own package managers, but those versions may not be as up to date. See [Download S3cmd](https://s3tools.org/download) for more information.

Additional methods of installing s4cmd can be found within the s4cmd Readme file under [Installation and Setup](https://github.com/bloomreach/s4cmd#installation-and-setup).

## Configuring Credentials

To access Object Storage buckets and objects, s4cmd needs to know the Access Key and Secret Key to use. By default, s4cmd looks for these credentials in the `~/.s3cfg` file, which is the configuration file that s3cmd uses. If you do not have s3cmd installed and configured, create this file and add the following contents.

```file {title="~/.s3cfg"}
[default]
access_key = YOUR_ACCESS_KEY
secret_key = YOUR_SECRET_KEY
```

Replace `YOUR_ACCESS_KEY` and `YOUR_SECRET_KEY` with the access key and secret key created on your Linode account. If you haven't yet created these credentials, follow the [Managing Access Keys](/docs/products/storage/object-storage/guides/access-keys/) guide.

Additional methods of configuring your credentials can be found on the s4cmd Readme file under [Installation and Setup](https://github.com/bloomreach/s4cmd#installation-and-setup).

## Specifying the Endpoint URL

Originally, s4cmd was used for Amazon S3. To allow this tool to be used by other S3-compatible solutions, the `--endpoint-url` command option was added. When running any s4cmd command, you will need to specify the full endpoint url of the Linode Object Storage Cluster that your bucket resides in. For a full list of Clusters and their associated S3 endpoints, see the[Access Buckets and Files through URLs](/docs/products/storage/object-storage/guides/urls/) guide).

As an example, the following command will list all buckets in the Newark data center:

    s4cmd ls --endpoint-url https://us-east-1.linodeobjects.com

## Interacting with Buckets

### List Buckets

**Command:** `s4cmd ls`

**Example**: List all buckets on the account within the Newark data center:

    s4cmd ls --endpoint-url https://us-east-1.linodeobjects.com

### Create a Bucket

**Command:** `s4cmd mb s3://[bucket-label]`, replacing *[bucket-label]* with the label you'd like to use for the new bucket.

**Example:** Create a bucket with the label of "example-bucket" in the Newark data center:

    s4cmd mb s3://example-bucket --endpoint-url https://us-east-1.linodeobjects.com

### Delete a Bucket

There is currently no defined command for deleting a bucket through s4cmd.

## Interacting with Objects

### List Objects

**Command:** `s4cmd ls [path]`, where *[path]* is the path of the directory you'd like to view within a bucket.

**Example:** List all objects within the bucket called "example-bucket", located in the Newark data center:

    s4cmd ls s3://example-bucket/ --endpoint-url https://us-east-1.linodeobjects.com

### Upload an Object

**Command:** `s4cmd put [file] s3://[bucket-label]/[path]`, replacing *[file]* with the name and path of the file you wish to upload, *[bucket-label]* with the label for your bucket and *[path]* with the optional directory within the bucket.

**Example:** Upload the file "file.txt" to the bucket called "example-bucket", located in the Newark data center:

    s4cmd put file.txt s3://example-bucket/ --endpoint-url https://us-east-1.linodeobjects.com

{{< content "object-storage-character-warning-shortguide" >}}

### Download an Object or Directory

**Command:** `s4cmd get s3://[bucket-label]/[path]`, replacing *[bucket-label]* with the label for your bucket and *[path]* with the full path and optional filename of the file or directory you wish to download.

**Example:** Download the file "file.txt" from the bucket called "example-bucket", located in the Newark data center:

    s4cmd get s3://example-bucket/file.txt --endpoint-url https://us-east-1.linodeobjects.com

### Delete an Object or Directory

**Command:** `s4cmd del s3://[bucket-label]/[path]`, replacing *[bucket-label]* with the label for your bucket and *[path]* with the full path and optional filename of the file or directory you wish to delete.

**Example:** Delete all the files within the "files" directory on the bucket called "example-bucket", located in the Newark data center:

    s4cmd del s3://example-bucket/files/ --endpoint-url https://us-east-1.linodeobjects.com

## Additional Commands

Additional commands and options for s4cmd can be found on the [s4cmd Readme](https://github.com/bloomreach/s4cmd) page or by running `s4cmd --help`.
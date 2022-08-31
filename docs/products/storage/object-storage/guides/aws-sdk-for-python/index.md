---
author:
  name: Linode
  email: docs@linode.com
title: "Using the AWS SDK for Python (boto3) with Object Storage"
image: UsingAWSSDKforPythonboto3withObjectStorage.jpg
description: "Learn how to use the Python AWS SDK with Linode's S3-compatible Object Storage."
---

Amazon's Python AWS SDK, called [boto3](https://github.com/boto/boto3), includes an [S3 client](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html) that enables access to Linode's S3-compatible Object Storage within a Python application or script.

## Before You Begin

1.  Ensure Python 3.6 or later is installed on the machine you intend to use. For Linux-based systems, see the [How to Install Python 3](/docs/guides/how-to-install-python-on-ubuntu-20-04/) guide for installation instructions.

1.  This guide assumes you have a basic understanding of Python development and are comfortable integrating code samples into your application.

1.  It is also assumed that you have a basic understanding of Object Storage concepts, including that files are stored within a flat (non-heirarchial) system alongside rich metadata.

## Installing boto3

The first step is to install the AWS SDK for Python (boto3) through [pip](https://pypi.org/project/pip/), python's package manager that's installed by default on recent versions of Python.

    pip3 install boto3

See [Boto3 Docs > Quickstart](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html#installation).

## Initializing the Client

To access Object Storage buckets and objects, you'll first need to configure your credentials and initialize the S3 client session.

1.  Generate an access key and secret key for Object Storage through the Cloud Manager by following the [Managing Access Keys](/docs/products/storage/object-storage/guides/access-keys/) guide.

2.  Add the following code to your python script, replacing `[access-key]` and `[secret-key]` with the values generated in the previous step. Also replace `[cluster-url]` with the cluster URL corresponding to the data center your buckets are located within (listed on the [Access Buckets and Files through URLs](/docs/products/storage/object-storage/guides/urls/) page).

        import boto3

        linode_obj_config = {
            "aws_access_key_id": "[access-key]",
            "aws_secret_access_key": "[secret-key]",
            "endpoint_url": "[cluster-url]",
        }

        client = boto3.client("s3", **linode_obj_config)

If you intend to share this code with others, it's highly advisable to abstract out both the access key and secret key. There are a few methods to accomplish this, including using AWS configuration files, environment variables through the shell, or a custom environment-specific configuration file. See [Boto3 Docs > Configuration](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html).

## List Buckets

Lists all buckets within a cluster. See [list_buckets()](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.list_buckets) for additional details, syntax, and examples.

### Syntax

    client.list_buckets()

### Example

List all buckets on the account in the previously-specified cluster:

    response = client.list_buckets()
    for bucket in response['Buckets']:
        print(bucket['Name'])

## Create a Bucket

Creates a new bucket, in which you can store objects. For acceptable bucket labels, review the [Create and Manage Buckets](/docs/products/storage/object-storage/guides/manage-buckets/#create-a-bucket) guide. See [create_bucket()](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.create_bucket) for additional details, syntax, and examples.

### Syntax

    client.create_bucket(
        Bucket='[bucket-label]')

-  **Bucket (required):** The label of the bucket you wish to create.

### Example

Create a bucket with the label of "example-bucket" in the previously-specified cluster:

    client.create_bucket(Bucket='example-bucket')

## Delete a Bucket

Deletes the specified *empty* bucket. If the bucket still contains objects, they must be deleted before continuing. See [delete_bucket()](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.delete_bucket) for more details.

### Syntax

    client.delete_bucket(
        Bucket='bucket-label')

-  **Bucket (required):** The label of the bucket you wish to delete.

### Example

Delete the bucket labeled "example-bucket":

    client.delete_bucket(Bucket='example-bucket')

## List Objects

Outputs all the objects within a bucket (and with a certain prefix, if specified). See [list_objects()](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.list_objects) for additional details, syntax, and examples.

### Syntax

    client.list_objects(
        Bucket='bucket-label',
        Prefix='object-prefix')

-  **Bucket [required]:** The label of the bucket you wish to use.
-  **Prefix:** The optional prefix (or pseudo path) of objects you list to view within a bucket. To view all objects, omit the Prefix parameter.

### Examples

-   **List all objects:** List all objects within the bucket called "example-bucket":

        response = client.list_objects(Bucket='example-bucket')
        for object in response['Contents']:
            print(object['Key'])

-   **List all objects within a specific "folder":** List all objects stored in the "assets/" folder within the bucket called "example-bucket". Keep in mind that objects aren't actually stored in folders, but the [prefix value](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html) allows them to appear within a structure.

        response = client.list_objects(Bucket='example-bucket', Prefix='assets/')
        for object in response['Contents']:
            print(object['Key'])

## Upload a File as an Object

Uploads a file as an object stored within the specified bucket. See [upload_file()](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.upload_file) for additional details, syntax, and examples.

### Syntax

    client.upload_file(
        Filename='/path/to/file.ext',
        Bucket='bucket-label',
        Key='object-name')

-  **Filename [required]:** The filename and path of the file to upload.
-  **Bucket [required]:** The label of the bucket you wish to store the file within.
-  **Key [required]:** The name of the object you wish to create, including any prefix/path.

### Examples

-   Upload the file "file.txt", which is located in the same directory as your python script, to the bucket called "example-bucket". Name this new object "file.txt", the same as the filename.

        client.upload_file(Filename='file.txt', Bucket='example-bucket', Key='file.txt')

-   Upload the file "logo.jpg", located within a home folder, to the bucket called "example-bucket". Name this new object "images/logo.jpg", which allows it to be structured within a pseudo folder.

        client.upload_file(Filename='/Users/user/logo.jpg', Bucket='example-bucket', Key='images/logo.jpg')

## Download an Object to a File

Downloads the specified object to a new file on your system. See [download_file()](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.download_file) for additional details, syntax, and examples.

### Syntax

    client.download_file(
        Bucket='bucket-label',
        Key='object-name',
        Filename='/path/to/file.ext')

-  **Bucket [required]:** The label of the bucket the object is stored within.
-  **Key [required]:** The name of the object you wish to download, including any prefix/path.
-  **Filename [required]:** The filename and path of the file to create.

### Example

Download the object "file.txt", stored within the bucket called "example-bucket", to a new file called "file.txt" in the same folder as your python script.

    client.download_file(Bucket='example-bucket', Key='file.txt', Filename='file.txt')

## Delete an Object or Directory

Deletes an object from a bucket. See [delete_object()](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Client.delete_object) for additional details, syntax, and examples.

### Syntax

    client.delete_object(
        Bucket='bucket-label',
        Key='object-name')

-  **Bucket [required]:** The label of the bucket the object is stored within.
-  **Key [required]:** The name of the object you wish to delete, including any prefix/path.

### Example

Delete the object "file.txt", stored within the bucket called "example-bucket":

    client.delete_object(Bucket='example-bucket', Key='file.txt')

## Going Further

Extensive documentation on Boto3 and the S3 Client (including more methods, parameters, and examples) can be found on [Boto3 Docs > S3 > Client](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#client).
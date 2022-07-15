---
author:
  name: Linode
  email: docs@linode.com
title: "Using the AWS SDK for PHP with Object Storage"
description: "Learn how to use the PHP AWS SDK with Linode's S3-compatible Object Storage."
---

The [AWS SDK for PHP](https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/welcome.html) (GitHub: [aws/aws-sdk-php/](https://github.com/aws/aws-sdk-php)) includes an [S3 client](https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/s3-multiregion-client.html) that enables access to Linode's S3-compatible Object Storage within a PHP application or script.

## Before You Begin

1.  Ensure PHP 5.5.0 or later is installed on the machine you intend to use.

1.  Ensure Composer is installed globally. See [Composer Installation > Globally](https://getcomposer.org/doc/00-intro.md#globally).

1.  This guide assumes you have a basic understanding of PHP development and are comfortable integrating code samples into your application.

1.  It is also assumed that you have a basic understanding of Object Storage concepts, including that files are stored within a flat (non-heirarchial) system alongside rich metadata.

## Installing the AWS SDK for PHP

The first step is to install the AWS SDK for PHP through [Composer](https://getcomposer.org/), a common dependency manager for PHP. Run the following command within your project's directory

    composer require aws/aws-sdk-php

See [AWS SDK for PHP Docs > Installing the SDK](https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/getting-started_installation.html) for additional instructions and alternative methods.

## Initializing the Client

To access Object Storage buckets and objects, you'll first need to configure your credentials and initialize the S3 client session.

1.  Generate an access key and secret key for Object Storage through the Cloud Manager by following the [Managing Access Keys](/docs/products/storage/object-storage/guides/access-keys/) guide.

2.  Add the following code to your PHP script, replacing `[access-key]` and `[secret-key]` with the values generated in the previous step. Also replace `[cluster-url]` with the cluster URL corresponding to the data center your buckets are located within (listed on the [Access Buckets and Files through URLs](/docs/products/storage/object-storage/guides/urls/) page).

        require 'vendor/autoload.php';
        use Aws\S3\S3Client;
        use Aws\Exception\AwsException;

        $config =
        [
            'version' => 'latest',
            'region' => '',
            'endpoint' => '[cluster-url]',
            'credentials' =>
            [
                'key' => '[access-key]',
                'secret' => '[secret-key]',
            ],
        ];

        $client = new \Aws\S3\S3Client($config);

See [AWS SDK for PHP Docs > Configuration Options](https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/guide_configuration.html) for more details on how to configure the client. If you intend to share this code with others, it's highly advisable to abstract out both the access key and secret key. There are a few methods to accomplish this, including using AWS configuration files, environment variables through the shell, or a custom environment-specific configuration file.

## List Buckets

Lists all buckets within a cluster. See [listBuckets()](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html#listbuckets) for additional details, syntax, and examples.

### Syntax

    $client->listBuckets();

### Example

List all buckets on the account in the previously-specified cluster:

    $result = $client->listBuckets();
    foreach ($result['Buckets'] as $bucket) {
        echo $bucket['Name'] . "\n";
    }

## Create a Bucket

Creates a new bucket, in which you can store objects. For acceptable bucket labels, review the [Create and Manage Buckets](/docs/products/storage/object-storage/guides/manage-buckets/#create-a-bucket) guide. See [createBucket()](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html#createbucket) for additional details, syntax, and examples.

### Syntax

    $client->createBucket([
        'Bucket' => 'bucket-label'
    ]);

-  **Bucket (required):** The label of the bucket you wish to create.

### Example

Create a bucket with the label of "example-bucket" in the previously-specified cluster:

    $client->createBucket(['Bucket' => 'example-bucket']);

## Delete a Bucket

Deletes the specified *empty* bucket. If the bucket still contains objects, they must be deleted before continuing. See [deleteBucket()](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html#deletebucket) for additional details, syntax, and examples.

### Syntax

    $client->deleteBucket([
        'Bucket' => 'bucket-label'
    ]);

-  **Bucket (required):** The label of the bucket you wish to delete.

### Example

Delete the bucket labeled "example-bucket":

    $client->deleteBucket(['Bucket' => 'example-bucket']);

## List Objects

Outputs all the objects within a bucket (and with a certain prefix, if specified). See [listObjects()](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html#listobjects) for additional details, syntax, and examples.

### Syntax

    $client->listObjects([
        'Bucket' => 'bucket-label',
        'Prefix' => 'object-prefix'
    ]);

-  **Bucket [required]:** The label of the bucket you wish to use.
-  **Prefix:** The optional prefix (or pseudo path) of objects you list to view within a bucket. To view all objects, omit the Prefix parameter.

### Examples

-  **List all objects:** List all objects within the bucket called "example-bucket":

        $result = $client->listObjects(['Bucket' => 'example-bucket']);
        foreach ($result['Contents'] as $object) {
            echo $object['Key'] . "\n";
        }

-  **List all objects within a specific "folder":** List all objects stored in the "assets/" folder within the bucket called "example-bucket". Keep in mind that objects aren't actually stored in folders, but the [prefix value](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html) allows them to appear within a structure.

        $result = $client->listObjects(['Bucket' => 'example-bucket','Prefix' => 'assets/']);
        foreach ($result['Contents'] as $object) {
            echo $object['Key'] . "\n";
        }

## Upload a File as an Object

Uploads a file as an object stored within the specified bucket. See [putObject()](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html#putobject) for additional details, syntax, and examples.

### Syntax

    $client->putObject([
        'Bucket'     => 'bucket-label',
        'Key'        => 'object-name',
        'SourceFile' => '/path/to/file.ext'
    ]);

-  **Bucket [required]:** The label of the bucket you wish to store the file within.
-  **Key [required]:** The name of the object you wish to create, including any prefix/path.
-  **SourceFile [required]:** The filename and path of the file to upload.

### Examples

-  Upload the file "file.txt", which is located in the same directory as your PHP script, to the bucket called "example-bucket". Name this new object "file.txt", the same as the filename.

        $client->putObject(['Bucket'=>'example-bucket','Key'=>'file.txt','SourceFile'=>'file.txt']);

-  Upload the file "logo.jpg", located within a home folder, to the bucket called "example-bucket". Name this new object "images/logo.jpg", which allows it to be structured within a pseudo folder.

        $client->putObject(['Bucket'=>'example-bucket','Key'=>'images/logo.jpg','SourceFile'=>'logo.jpg']);

## Download an Object to a File

Downloads the specified object to a new file on your system. See [getObject()](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html#getobject) for additional details, syntax, and examples.

### Syntax

    $client->getObject([
        'Bucket' => 'bucket-label',
        'Key'    => 'object-name',
        'SaveAs' => '/path/to/new/file.ext'
    ]);

-  **Bucket [required]:** The label of the bucket the object is stored within.
-  **Key [required]:** The name of the object you wish to download, including any prefix/path.
-  **SaveAs [required]:** The filename and path of the file to create.

### Example

Download the object "file.txt", stored within the bucket called "example-bucket", to a new file called "file.txt" in the same folder as your PHP script.

    $client->getObject(['Bucket' => 'example-bucket','Key' => 'file.txt', 'SaveAs' => 'file.txt']);

## Delete an Object or Directory

Deletes an object from a bucket. See [deleteObject()](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html) for additional details, syntax, and examples.

### Syntax

    $client->deleteObject([
        'Bucket' => 'bucket-label',
        'Key' => 'object-name'
    ]);

-  **Bucket [required]:** The label of the bucket the object is stored within.
-  **Key [required]:** The name of the object you wish to delete, including any prefix/path.

### Example

Delete the object "file.txt", stored within the bucket called "example-bucket":

    $client->deleteObject(['Bucket' => 'example-bucket','Key' => 'file.txt']);

## Going Further

Extensive documentation on the S3 Client for the AWS SDK for PHP (including more methods, parameters, and examples) can be found within the [AWS SDK for PHP (API 3.x) > S3 Client](https://docs.aws.amazon.com/aws-sdk-php/v3/api/api-s3-2006-03-01.html).
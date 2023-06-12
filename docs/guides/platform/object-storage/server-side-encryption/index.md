---
slug: server-side-encryption
description: 'This guide teaches you how to secure your Linode Object Storage data with server-side encryption using an example script written in Python.'
og_description: 'Learn how to secure your Linode Object Storage data with server-side encryption.'
keywords: ['object','storage','security', 'sse-c', 'aes-256', 'terraform']
tags: ["linode platform","python","ssl"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-08-14
image: UseServerSideEnc_LinObjStorage.png
modified_by:
  name: Linode
title: "Using Server-Side Encryption with Linode Object Storage"
title_meta: "How to Use Server-Side Encryption with Linode Object Storage"
aliases: ['/platform/object-storage/server-side-encryption/']
authors: ["Ben Bigger"]
---

{{< content "object-storage-ga-shortguide" >}}

{{< content "object-storage-cancellation-shortguide" >}}

Server-side encryption secures data on Linode Object Storage. Using your own encryption key, Linode will encrypt your data at the object level prior to storing it to disk. Once encrypted, Linode will only decrypt data if that same encryption key is provided with the retrieval request. This enables you to use Linode Object Storage to confidently handle sensitive data like [Terraform configurations](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/) that contain passwords and SSH keys.

In this guide, you will [write an example Python script](#python-example-script) that will upload a simple file containing the text "Hello World!" to Linode Object Storage, encrypt the file with server-side encryption using a provided encryption key (SSE-C), decrypt and retrieve the contents of the file, then delete the file. Once completed, the components of this script can be adapted to implement server side encryption for your own specific use case.

## Before You Begin

-   Familiarize yourself with the basics of Linode Object Storage by reviewing the [Get Started with Object Storage](/docs/products/storage/object-storage/get-started/) guide or taking a look through the available [Object Storage guides](/docs/products/storage/object-storage/guides/).
-   [Create an Object Storage bucket](/docs/products/storage/object-storage/guides/manage-buckets/). For demonstration purposes, you can create an Object Storage bucket and delete it after completing this guide.

## Python Example Script

1.  This section requires that Python 3.4 or above is installed on your machine. Check your version of Python with the following command:

        python3 --version

1.  Install [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html), the AWS SDK for Python:

        pip install boto3

1.  [Generate an Object Storage key pair](/docs/products/storage/object-storage/guides/access-keys/), saving the access key and secret key for use in your script.

1.  Choose a 32 character encryption key for use in your script. You can use [OpenSSL](https://www.openssl.org/) to randomly generate 32 hexadecimal characters to use as your encryption key with the following command:

        openssl rand -hex 16

    {{< note type="alert" respectIndent=false >}}
Linode destroys encryption keys immediately after your data is encrypted. Object Storage data that is encrypted with SSE-C is unrecoverable without your encryption key.
    {{< /note >}}

1.  Using a code editor, open a new file labeled `example.py` for your Python script and enter the following:

    {{< file "example.py" python >}}
#!/usr/bin/env python
import boto3

cfg = {
    "aws_access_key_id": "example-access-key",
    "aws_secret_access_key": "example-secret-access-key",
    "endpoint_url": "https://example-cluster-url",
}

# Your encryption key must be 32 characters
ENCRYPTION_KEY = "example-encryption-key-987654321"
ALGO = "AES256"
BUCKET = "example-bucket-name"
FILE = "sse-c-test"
BODY = "Hello World!"

client = boto3.client("s3", **cfg)

print("Uploading file to Object Storage and encrypting with SSE-C.")

r1 = client.put_object(
    SSECustomerKey=ENCRYPTION_KEY,
    SSECustomerAlgorithm=ALGO,
    Bucket=BUCKET,
    Key=FILE,
    Body=BODY
)

if r1["ResponseMetadata"]["HTTPStatusCode"] == 200:
    print("Upload and encryption successful.")

print("Downloading encrypted Object Storage file.")

r2 = client.get_object(
    SSECustomerKey=ENCRYPTION_KEY,
    SSECustomerAlgorithm=ALGO,
    Bucket=BUCKET,
    Key=FILE
)

print("Decrypted object body:", r2["Body"].read())

print("Deleting encrypted Object Storage file.")

r3 = client.delete_object(
    Bucket=BUCKET,
    Key=FILE
)

if r3["ResponseMetadata"]["HTTPStatusCode"] == 204:
    print("Deletion successful.")
    {{< /file >}}

1.  In your script file, `example.py`, replace the following example values with your own unique values created in previous steps and save your changes:

    | Example | Unique Value |
    |:------- |:----------- |
    |`example-access-key` | Your Object Storage access key. |
    |`example-secret-access-key` | Your Object Storage secret key. |
    |`example-cluster-url` | The URL of your Object Storage bucket's cluster. |
    |`example-encryption-key-987654321` | Your 32-character encryption key. |
    |`example-bucket-name` | The name of your Object Storage bucket. |

    {{< content "object-storage-cluster-shortguide" >}}

1.  From your machine's terminal, make your script file executable:

        chmod +x example.py

1.  Run your script:

        ./example.py

    The following output shows that you successfully uploaded, downloaded, and deleted an SSE-C encrypted Linode Object Storage file:

    {{< output >}}
Uploading file to Object Storage and encrypting with SSE-C.
Upload and encryption successful.
Downloading encrypted Object Storage file.
Decrypted object body: b'Hello World!'
Deleting encrypted Object Storage file.
Deletion successful.
    {{</ output >}}

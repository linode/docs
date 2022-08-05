---
author:
  name: Linode
  email: docs@linode.com
title: "Using S3cmd with Object Storage"
description: "Learn how to use the S3cmd command-line tool with Linode's Object Storage."
modified: 2022-08-04
---

S3cmd is a command line utility that you can use for any S3-compatible Object Storage.

## Installing S3cmd

The following commands will install s3cmd on various common operating systems. Additional methods of installing s3cmd can be found within the S3cmd GitHub repository under the [Installation of s3cmd package](https://github.com/s3tools/s3cmd/blob/master/INSTALL.md) file.

### Mac

To install s3cmd on a Mac, [Homebrew](https://brew.sh/) can be used:

    brew install s3cmd

{{< note >}}
On macOS, s3cmd might fail to install if you do not have XCode command line tools installed. If that is the case, run the following command:

    xcode-select --install
{{</ note >}}

### Linux

To install s3cmd on a Linux system (such as CentOS, Ubuntu, or Debian), Python’s package manager [pip](/docs/guides/how-to-manage-packages-and-virtual-environments-on-linux/) can be used.

    sudo pip install s3cmd

Some Linux distributions are also able to install s3cmd from their own package managers, but those versions may not be as up to date. See [Download S3cmd](https://s3tools.org/download) for more information.

## Configuring S3cmd

After s3cmd has been installed, it needs to be configured to work with the buckets and objects on your Linode account.

1.  Run the following command to start the configuration process.

        s3cmd --configure

1.  This command will prompt you with a series of questions. Answer them based on the recommendations below:

    - **Access Key:** Enter the access key you wish to use. See [Managing Access Keys](/docs/products/storage/object-storage/guides/access-keys/).
    - **Secret Key:** Enter the secret key that corresponds with the access key. This was displayed once when generating the access key.
    - **Default Region:** `US` (do not change, even if you use Object Storage in a different region)
    - **S3 Endpoint** (cluster URL): `https://[cluster-id].linodeobjects.com/`, where [cluster-id] is the id of your data center. See [Access Buckets and Files through URLs > Cluster URL (S3 Endpoint)](/docs/products/storage/object-storage/guides/urls/#cluster-url-s3-endpoint) for more details and a list of cluster IDs.
    - **DNS-style bucket+hostname:port template for accessing a bucket:** `%(bucket)s.[cluster-id].linodeobjects.com`, replacing [cluster-id] with the same id used previously.
    - **Encryption password:** Enter your GPG key if you intend to store and retrieve encrypted files (optional).
    - **Path to GPG program:** Enter the path to your GPG encryption program (optional).
    - **Use HTTPS protocol:** `Yes`
    - **HTTP Proxy server name:** (Leave blank)
    - **HTTP Proxy server port:** (Leave blank)

1.  When the prompt appears to test access with the supplied credentials, enter `n` to skip. Currently, this process results in the following error - even when the settings are correct.

    {{<output>}}
Please wait, attempting to list all buckets...
ERROR: Test failed: 403 (SignatureDoesNotMatch)
{{</output>}}

1.  When the prompt appears to save your settings, enter `Y`. A configuration file named `.s3cfg` is created within your home directory.

### Additional Configuration Options

S3cmd offers a number of additional configuration options that are not presented as prompts by the `S3cmd --configure` command. To modify any s3cmd configuration options (including the ones from the previous step), you can edit the configuration file directly. This configuration file is named `.s3cfg` and should be stored with your local home directory. For our purposes, its recommended to adjust the following option:

- **website_endpoint:** `http://%(bucket)s.website-[cluster-url]/`, replacing [cluster-url] with the cluster URL corresponding to the data center your buckets are located within (listed on the [Access Buckets and Files through URLs](/docs/products/storage/object-storage/guides/urls/) page).

## Interacting with Buckets

### List Buckets

List all buckets within the data center specified during the configuration process.

**Command:** `s3cmd ls`

To list the buckets within a different data center, use the `--host` parameter as shown below. Replace `us-east-1` with the cluster ID of the data center you wish to use.

**Example**: List all buckets on the account within the Newark data center when s3cmd has been configured for a different data center:

    s3cmd ls --host=https://us-east-1.linodeobjects.com

### Create a Bucket

Creates a bucket with the specified bucket label. See the [Create and Manage Buckets](/docs/products/storage/object-storage/guides/manage-buckets/#create-a-bucket) guide for rules on naming the bucket.

**Command:** `s3cmd mb s3://[bucket-label]`, replacing *[bucket-label]* with the label you'd like to use for the new bucket.

**Example:** Create a bucket with the label of "example-bucket":

    s3cmd mb s3://example-bucket

### Delete a Bucket

Deletes the bucket with the specified label.

**Command:** `s3cmd rb s3://[bucket-label]`, replacing *[bucket-label]* with the label of the bucket you wish to delete.

**Example:** Delete the bucket with the label of "example-bucket":

    s3cmd rb s3://example-bucket

To delete a bucket that has files in it, include the `--recursive` (or `-r`) option *and* the `--force` (or `-f`) option. Use caution when running this command:

    s3cmd rb -r -f s3://example-bucket/

## Interacting with Objects

### List Objects

**Command:** `s3cmd ls  s3://[bucket-label]/[path]`, replacing *[bucket-label]* with the label for your bucket and *[path]* with the full path of directory you wish to view (optional).

**Example:** List all objects within the bucket called "example-bucket":

    s3cmd ls s3://example-bucket/

### Upload an Object

**Command:** `s3cmd put [file] s3://[bucket-label]/[path]`, replacing *[file]* with the name and path of the file you wish to upload, *[bucket-label]* with the label for your bucket and *[path]* with the optional directory within the bucket.

**Example:** Upload the file "file.txt" to the bucket called "example-bucket":

    s3cmd put file.txt s3://example-bucket/

**Additional command options:**
- `-P`: Makes the object publicly accessible. This will allow the object to be accessed by anyone with the URL. Once successfully uploaded, s3cmd will output the public URL.
- `-e`: Encrypts the object (if you've configured the correct s3cmd options to enable encryption).

{{< content "object-storage-character-warning-shortguide" >}}

### Download an Object or Directory

**Command:** `s3cmd get s3://[bucket-label]/[path]`, replacing *[bucket-label]* with the label for your bucket and *[path]* with the full path and optional filename of the file or directory you wish to download.

**Example:** Download the file "file.txt" from the bucket called "example-bucket":

    s3cmd get s3://example-bucket/file.txt

**Additional command options:**
- `-e`: Decrypts an encrypted object.

### Delete an Object or Directory

**Command:** `s3cmd rm s3://[bucket-label]/[path]`, replacing *[bucket-label]* with the label for your bucket and *[path]* with the full path and optional filename of the file or directory you wish to delete.

**Example:** Delete the "file.txt" file on the bucket called "example-bucket":

    s3cmd rm s3://example-bucket/file.txt

To delete all files in a bucket, include the `--recursive` (or `-r`) option *and* the `--force` (or `-f`) option. Use caution when running this command:

    s3cmd rm -r -f s3://example-bucket/

## Permissions and Access Controls

### Apply a Bucket Policy

**Command:** `s3cmd setpolicy [policy-file] s3://[bucket-label]`, replacing *[bucket-label]* with the label for your bucket and *[policy-file]* with the filename and path of your bucket policy file.

**Example:** Apply the bucket policies defined within the file "policy.json" to the bucket called "example-bucket":

    s3cmd setpolicy policy.json s3://example-bucket

To ensure that it has been applied correctly, you can use the `info` command:

    s3cmd info s3://bucket-policy-example

You should see output like the following:

{{< output >}}
s3://example-bucket/ (bucket):
   Location:  default
   Payer:     BucketOwner
   Expiration Rule: none
   Policy:    b'{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": {"AWS": ["arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"]},\n    "Action": ["s3:PutObject","s3:GetObject","s3:ListBucket"],\n    "Resource": [\n      "arn:aws:s3:::bucket-policy-example/*"\n    ]\n  }]\n}'
   CORS:      none
   ACL:       a0000000-000a-0000-0000-00d0ff0f0000: FULL_CONTROL
{{</ output >}}

## Create a Signed URL with S3cmd

Creating a **signed URL** allows you to create a link to objects with limited permissions and a time limit to access them. To create a signed URL on a preexisting object with s3cmd, use the following syntax:

    s3cmd signurl s3://my-example-bucket/example.txt +300

The output of the command is a URL that can be used for a set period of time to access the object, even if the ACL is set to private. In this case, `+300` represents the amount of time in seconds that the link remains active, or five minutes total. After this time has passed, the link expires and can no longer be used.

## Create a Static Site with S3cmd

You can also create a static website using Object Storage and s3cmd:

1.  To create a website from a bucket, use the `ws-create` command:

        s3cmd ws-create --ws-index=index.html --ws-error=404.html s3://my-example-bucket

    The `--ws-index` and `--ws-error` flags specify which objects the bucket should use to serve the static site's index page and error page, respectively.

1.  You need to separately upload the `index.html` and `404.html` files (or however you have named the index and error pages) to the bucket:

        echo 'Index page' > index.html
        echo 'Error page' > 404.html
        s3cmd put index.html 404.html s3://my-example-bucket

1.  The static site is accessed from a different URL than the generic URL for the Object Storage bucket. Static sites are available at the `website-us-east-1` subdomain for the Newark data center, the `website-eu-central-1` subdomain for the Frankfurt data center, and the `website-ap-south-1` subdomain for the Singapore data center. Using `my-example-bucket` as an example, you would navigate to either:

    - `http://my-example-bucket.website-us-east-1.linodeobjects.com` or
    - `http://my-example-bucket.website-eu-central-1.linodeobjects.com`.

For more information on hosting a static website with Object Storage, read our [Host a Static Site using Linode Object Storage](/docs/guides/host-static-site-object-storage/) guide.

## Syncing Files and Directories

While you can utilize the `put` command to upload entire directories, the `sync` command may offer more desirable behavior. `sync` identifies which files have been added or modified and only uploads those files. This can be especially useful when maintaining large amounts of files, such as the contents of a static site.

**Command:** `s3cmd sync [local-path] s3://[bucket-label]/[path]`, replacing *[local-path]* with the path to the folder you wish to upload, *[bucket-label]* with the label for your bucket, and *[path]* with the remote path you wish to target for the upload.

{{< note >}}
To upload the current directory, replace *[local-path]* with `./`.
{{</ note >}}

**Example:** Upload the current directory to the bucket labeled *example-bucket* and make all files public.

    s3cmd sync ./ s3://example-bucket -P

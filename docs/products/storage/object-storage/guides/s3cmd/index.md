---
author:
  name: Linode
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-28
modified_by:
  name: Linode
title: "How To Use Object Storage with s3cmd"
h1_title: "Using Object Storage with s3cmd"
enable_h1: true
---

s3cmd is a command line utility that you can use for any S3-compatible Object Storage.

## Install and Configure s3cmd

1.  s3cmd can be downloaded using `apt` on Debian and Ubuntu, and [Homebrew](https://brew.sh/) on macOS. To download s3cmd using Homebrew, run the following command:

        brew install s3cmd

    {{< note >}}
On macOS, s3cmd might fail to install if you do not have XCode command line tools installed. If that is the case, run the following command:

    xcode-select --install

You are prompted to agree to the terms and conditions.
{{</ note >}}

    To install s3cmd on Debian or Ubuntu, run the following command:

        apt install s3cmd

1.  After s3cmd has been installed, you need to configure it:

        s3cmd --configure

    A number of questions are presented. To accept the default answer that appears within the brackets, press enter. Here is an example of the answers you need to provide. Substitute `eu-central-1` for the subdomain if the bucket is in the Frankfurt data center:

        Access Key: 4TQ5CJGZS92LLEQHLXB3
        Secret Key: enteryoursecretkeyhere
        Default Region: US
        S3 Endpoint: us-east-1.linodeobjects.com
        DNS-style bucket+hostname:port template for accessing a bucket: us-east-1.linodeobjects.com
        Encryption password: YOUR_GPG_KEY
        Path to GPG program: /usr/local/bin/gpg
        Use HTTPS protocol: False
        HTTP Proxy server name:
        HTTP Proxy server port: 0

    {{< note >}}
It is not necessary to provide a GPG key when configuring s3cmd, though it allows you to store and retrieve encrypted files. If you do not wish to configure GPG encryption, you can leave the `Encryption password` and `Path to GPG program` fields blank.
{{</ note >}}

1.  When you are done, enter `Y` to save the configuration.

## Configure the Public URL

s3cmd offers a number of additional configuration options that are not presented as prompts by the `s3cmd --configure` command. One of those options is `website_endpoint`, which instructs s3cmd on how to construct an appropriate URL for a bucket that is hosting a static site, similar to the `S3 Endpoint` in the above configuration. This step is optional, but ensures that any commands that contain the static site's URL outputs the right text. To edit this configuration file, open the `.s3cfg` file on the local computer. This is most likely located in '/home/$user/.s3cfg' if you are using a Linux-based system. Within this file, modify the following parameters:

{{< file "~/.s3cfg" >}}
host_bucket = %(bucket)s.us-east-1.linodeobjects.com
website_endpoint = http://%(bucket)s.website-us-east-1.linodeobjects.com/
{{< /file >}}

**Note:** Use the `eu-central-1` subdomain for buckets in the Frankfurt data center, and the `ap-south-1` subdomain for buckets in the Singapore data center.

## Create a Bucket with s3cmd

You are now ready to use s3cmd to create a bucket in Object Storage. You can create a bucket with s3cmd using the `mb` command, replacing `my-example-bucket` with the label of the bucket you would like to create. See the [Bucket Name](#bucket-names) section for rules on naming the bucket.

    s3cmd mb s3://my-example-bucket

To remove a bucket, you can use the `rb` command:

    s3cmd rb s3://my-example-bucket

{{< caution >}}
To delete a bucket that has files in it, include the `--recursive` (or `-r`) option *and* the `--force` (or `-f`) option. Use caution when running this command:

    s3cmd rb -r -f s3://my-example-bucket/
{{< /caution >}}

## Upload, Download, and Delete an Object with s3cmd

1.  As an example object, create a text file and fill it with some example text.

        echo 'Hello World!' > example.txt

1.  Now, transfer the text file object to the bucket using s3cmd's `put` command, replacing `my-example-bucket` with the label of the bucket you gave in the last section:

        s3cmd put example.txt s3://my-example-bucket -P

    {{< note >}}
The `-P` flag at the end of the command instructs s3cmd to make the object public. To make the object private, which means you only access it from a tool such as s3cmd, simply leave the '-P' flag out of the command.
{{</ note >}}

    {{< note >}}
If you chose to enable encryption when configuring s3cmd, you can store encrypted objects by supplying the `-e` flag:

    s3cmd put -e encrypted_example.txt s3://my-example-bucket
{{</ note >}}

1.  The object is uploaded to the bucket, and s3cmd provides a public URL for the object:

        upload: 'example.txt' -> 's3://my-example-bucket/example.txt'  [1 of 1]
        13 of 13   100% in    0s   485.49 B/s  done
        Public URL of the object is: http://us-east-1.linodeobjects.com/my-example-bucket/example.txt

    {{< note >}}
The URL for the object that s3cmd provides is one of two valid ways to access the object. The first, which s3cmd provides, places the label of the bucket after the domain name. You can also access the object by affixing the bucket label as a subdomain: `http://my-example-bucket.us-east-1.linodeobjects.com/example.txt`. The latter URL is generally favored.
{{< /note >}}

1.  To retrieve a file, use the `get` command:

        s3cmd get s3://my-example-bucket/example.txt

    If the file you are attempting to retrieve is encrypted, you can retrieve it using the `-e` flag:

        s3cmd get -e s3://my-example-bucket/encrypted_example.txt

1.  To delete a file, you can use the `rm` command:

         s3cmd rm s3://my-example-bucket/example.txt

    {{< caution >}}
To delete all files in a bucket, include the `--recursive` (or `-r`) option *and* the `--force` (or `-f`) option. Use caution when running this command:

    s3cmd rm -r -f s3://my-example-bucket/
{{< /caution >}}

1.  To list all available buckets, use the `ls` command:

        s3cmd ls

1.  To list all objects in a bucket, use the `ls` command and provide a bucket:

        s3cmd ls s3://my-example-bucket

## Create a Signed URL with s3cmd

Creating a **signed URL** allows you to create a link to objects with limited permissions and a time limit to access them. To create a signed URL on a preexisting object with s3cmd, use the following syntax:

    s3cmd signurl s3://my-example-bucket/example.txt +300

The output of the command is a URL that can be used for a set period of time to access the object, even if the ACL is set to private. In this case, `+300` represents the amount of time in seconds that the link remains active, or five minutes total. After this time has passed, the link expires and can no longer be used.

## Create a Static Site with s3cmd

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

For more information on hosting a static website with Object Storage, read our [Host a Static Site using Linode Object Storage](/docs/platform/object-storage/host-static-site-object-storage/) guide.

## Other s3cmd Commands

To upload an entire directory of files, you can use the `sync` command, which automatically syncs all new or changed files. Navigate to the directory you would like to sync, then enter the following:

    s3cmd sync . s3://my-example-bucket -P

This can be useful for uploading the contents of a static site to the bucket.

{{< note >}}
The period in the above command instructs s3cmd to upload the current directory. If you do not want to first navigate to the directory you wish to upload, you can provide a path to the directory instead of the period.
{{</ note >}}
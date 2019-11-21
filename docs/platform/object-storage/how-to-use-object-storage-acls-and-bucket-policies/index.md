---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to use Object Storage Access Control Lists (ACLs) and Bucket Policies to govern access to buckets and objects.'
keywords: ['object','storage','acl','access control list','bucket policy','bucket policies']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-20
modified_by:
  name: Linode
title: "How to Enact Access Control Lists (ACLs) and Bucket Policies with Linode Object Storage"
h1_title: "Enacting Access Control Lists (ACLs) and Bucket Policies with Linode Object Storage"
contributor:
  name: Linode
---

Linode Object Storage allows users to share access to objects and buckets with the use of Access Control Lists (ACLs) and bucket policies. These mechanisms perform similar functions: both can be used to grant users access to buckets and objects while also restricting others.

## Before You Begin

This guide will use the s3cmd command line utility to interact with Object Storage. For s3cmd installation and configuration instructions, visit our (How to Use Object Storage)[https://www.linode.com/docs/platform/object-storage/how-to-use-object-storage/#install-and-configure-s3cmd] guide.

Issue the following command, targeting a bucket on the account of the user you would like to grant access to (you will need to configure s3cmd to use this user's access tokens). Replace `acl-test` with the name of the bucket:

    s3cmd info s3://acl-example

You'll see output similar to the following:

{{< output >}}
s3://acl-example/ (bucket):
   Location:  default
   Payer:     BucketOwner
   Expiration Rule: none
   Policy:    none
   CORS:      none
   ACL:       a0000000-000a-0000-0000-00d0ff0f0000: FULL_CONTROL
{{</ output >}}

The cannonical ID of the owner of the bucket is the long string of letters, dashes, and numbers found in the line labeled `ACL`, which in this case is `a0000000-000a-0000-0000-00d0ff0f0000`.

Alternatively, if a bucket has objects and has already been set to public (with a command like `s3cmd setacl s3://bucket-name --acl-public`), but has not been set to serve static websites, you can retrieve the cannonical ID by curling the bucket and retrieving the Owner ID field of the returned XML:

    curl acl-example.us-east-1.linodeobjects.com

This will result in the following output:

    <ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
      <Name>acl-bucket-example</Name>
      <Prefix/>
      <Marker/>
      <MaxKeys>1000</MaxKeys>
      <IsTruncated>false</IsTruncated>
      <Contents>
        <Key>cpanel_one-click.gif</Key>
        <LastModified>2019-11-20T16:52:49.946Z</LastModified>
        <ETag>"9aeafcb192a8e540e7be5b51f7249e2e"</ETag>
        <Size>961023</Size>
        <StorageClass>STANDARD</StorageClass>
        <Owner>
          <ID>a0000000-000a-0000-0000-00d0ff0f0000</ID>
          <DisplayName>a0000000-000a-0000-0000-00d0ff0f0000</DisplayName>
        </Owner>
        <Type>Normal</Type>
      </Contents>
    </ListBucketResult>

In the above output, the ID is `a0000000-000a-0000-0000-00d0ff0f0000`.

### Access Control Lists

Access Control Lists (ACLs) are a legacy method of defining access. You can apply an ACL to a bucket or to a specific object. There are two main areas of access, private and public, with a few other more granular settings. With s3cmd, you can set a bucket to be public or private with the `setacl` command:

    s3cmd setacl s3://acl-example --acl-public

|Grant|Description|
|-----|-----------|
|**read**| Users with this grant can access buckets, or specific objects within a bucket.|
|**write**| Users with this grant can upload objects to a bucket, or modify a specific object.|
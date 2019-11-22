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
external_resources:
- '[Ceph Bucket Policy Supported Actions](https://docs.ceph.com/docs/master/radosgw/bucketpolicy/#limitations)'
---

Linode Object Storage allows users to share access to objects and buckets through the use of Access Control Lists (ACLs) and bucket policies. These mechanisms perform similar functions: both can be used to restrict and grant access to Object Storage resources. This guide will describe the differences between the two and provide some example instructions on how to use them.

## Before You Begin

This guide will use the s3cmd command line utility to interact with Object Storage. For s3cmd installation and configuration instructions, visit our [How to Use Object Storage](https://www.linode.com/docs/platform/object-storage/how-to-use-object-storage/#install-and-configure-s3cmd) guide.

Issue the following command, targeting a bucket on the account of the user you would like to grant access to (you will need to configure s3cmd to use this user's access tokens). For example, if you would like the user Tux to be able to access your bucket, you will first need to run the following command on a bucket owned by Tux. Replace `acl-example` with the name of the bucket:

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

The canonical ID of the owner of the bucket is the long string of letters, dashes, and numbers found in the line labeled `ACL`, which in this case is `a0000000-000a-0000-0000-00d0ff0f0000`.

Alternatively, if a bucket has objects within it and has already been set to public (with a command like `s3cmd setacl s3://bucket-name --acl-public`), but has not been set to serve static websites, you can retrieve the canonical ID by curling the bucket and retrieving the Owner ID field from the returned XML:

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

In the above output, the canonical ID is `a0000000-000a-0000-0000-00d0ff0f0000`.

## ACLs vs Bucket Policies

ACLs and bucket policies perform similar functions. Both can restrict or grant access to buckets. However, ACLs can also restrict or grant access to *individual objects*. If you can organize objects with similar permission needs into their own buckets, then it's strongly suggested that you use bucket policies. However, if you cannot organize your objects in this fashion, ACLs are still a good option.

ACLs offer permissions with much larger scopes than bucket policies. If you are looking for granular permissions beyond read and write permissions, choose bucket policies over ACLs.

Additionally, object policies are created through applying a written bucket policy file to the bucket. This file cannot exceed 20KB in size. If you have a policy with a lengthy list of policy rules, you may want to look into ACLs instead.

## Access Control Lists

Access Control Lists (ACLs) are a legacy method of defining access to Object Storage resources. You can apply an ACL to a bucket or to a specific object. There are two generalized modes of access, setting buckets and objects to be private or public, with a few other more granular settings.

With s3cmd, you can set a bucket to be public with the `setacl` command and the `--acl-public` flag:

    s3cmd setacl s3://acl-example --acl-public

This will cause the bucket and its contents to be downloadable over the general internet.

To set an object or bucket to private, you can use the `setacl` command and the `--acl-private` flag:

    s3cmd setacl s3://acl-example --acl-private

This will prevent users from accessing the buckets contents over the general internet.

The more granular permissions are as follows:

|Permission|Description|
|-----|-----------|
|**read**| Users with can list objects within a bucket|
|**write**| Users can upload objects to a bucket and delete objects from a bucket.|
|**read_acp**| Users can read the ACL currently applied to a bucket.|
|**write_acp**| Users can change the ACL applied to the bucket.|
|**full_control**| Users have read and write access over both objects and ACLs.|

To apply these more granular permissions for a specific user with s3cmd, use the following `setacl` command with the `--acl-grant` flag. Substitute `acl-example` with the name of the bucket (and the object, if necessary), `PERMISSION` with a permission from the above table, and `CANONICAL_ID` with the canonical ID of the user to which you would like to grant permissions.

    s3cmd setacl s3://acl-example --acl-grant=PERMISSION:CANONICAL_ID

To revoke a specific permission, you can use the `setacl` command with the `acl-revoke` flag:

    s3cmd setacl s3://acl-example --acl-revoke=PERMISSION:CANONICAL_ID

To view the current ACLs applied to a bucket or object, use the `info` command, replacing `acl-example` with the name of your bucket (and object, if necessary):

    s3cmd info s3://acl-example

You should see output like the following:

{{< output >}}
s3://acl-bucket-example/ (bucket):
   Location:  default
   Payer:     BucketOwner
   Expiration Rule: none
   Policy:    none
   CORS:      b'<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><CORSRule><AllowedMethod>GET</AllowedMethod><AllowedMethod>PUT</AllowedMethod><AllowedMethod>DELETE</AllowedMethod><AllowedMethod>HEAD</AllowedMethod><AllowedMethod>POST</AllowedMethod><AllowedOrigin>*</AllowedOrigin><AllowedHeader>*</AllowedHeader></CORSRule></CORSConfiguration>'
   ACL:       a0000000-000a-0000-0000-00d0ff0f0000: FULL_CONTROL
   URL:       http://us-east-1.linodeobjects.com/acl-example/
{{</ output >}}

## Bucket Policies

Bucket policies can offer a finer control over the types of permissions you can grant a user. Below is an example bucket policy:

{{< file "bucket_policy_example.txt" json >}}
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"AWS": [
      "arn:aws:iam:::a0000000-000a-0000-0000-00d0ff0f0000"
    ]},
    "Action": [
      "s3:PutObject",
      "s3:GetObject"
    ],
    "Resource": [
      "arn:aws:s3:::bucket-policy-example/*"
    ]
  }]
}
{{</ file >}}

This policy allows the user with the canonical ID `a0000000-000a-0000-0000-00d0ff0f0000`, known here as the "principal", to interact with the bucket, known as the "resource". The permissions, which are the ability to upload objects to a bucket (`s3:PutObject`) and the ability to retrieve objects from a bucket (`s3:GetObject`), are defined in the "action" section. The "resource" that is listed (`bucket-policy-example`) is the only bucket the user will have access too.

The principal, a.k.a. the user, must have the prefix of `arn:aws:iam:::`, just as the resource, a.k.a. the bucket, must have the prefix of `arn:aws:s3:::`. The `Action` and `Principal.AWS` fields of the bucket policy are arrays, so you can easily add additional users and permissions to the bucket policy, separating them by a comma.

For a full list of of available actions, visit the [Ceph bucket policy documentation](https://docs.ceph.com/docs/master/radosgw/bucketpolicy/#limitations).

To enable the bucket policy, use the `setpolicy` s3cmd command:

    s3cmd setpolicy bucket_policy_example.txt s3://bucket-policy-example

To ensure that it has been applied correctly, you can use the `info` command:

    s3cmd info s3://bucket-policy-example

You should see output like the following:

{{< output >}}
s3://bucket-policy-example/ (bucket):
   Location:  default
   Payer:     BucketOwner
   Expiration Rule: none
   Policy:    b'{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": {"AWS": ["arn:aws:iam:::a0000000-000a-0000-0000-00d0ff0f0000"]},\n    "Action": ["s3:PutObject","s3:GetObject","s3:ListBucket"],\n    "Resource": [\n      "arn:aws:s3:::bucket-policy-test/*"\n    ]\n  }]\n}'
   CORS:      none
   ACL:       a0000000-000a-0000-0000-00d0ff0f0000: FULL_CONTROL
{{</ output >}}

Note that the policy is available in the output.

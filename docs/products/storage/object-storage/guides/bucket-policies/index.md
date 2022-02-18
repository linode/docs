---
author:
  name: Linode
  email: docs@linode.com
title: "Setting Permissions using Bucket Policies"
description: ""
---

Bucket policies can offer finer control over the types of permissions you can grant to a user.

{{< caution >}}
In the examples below, access to all objects within a bucket are defined with a wildcard `*`. While these resources can be defined to target the bucket resource itself by removing the `/*` where the resource is defined. Creating a policy with this rule can cause the bucket to become inaccessible to the Linode Cloud Manager, API, and CLI.
{{< /caution >}}

## Basic Access Policy

Below is an example bucket policy written in JSON:

{{< file "bucket_policy_example.json" json >}}
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "AWS": [
        "arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"
      ]
    },
    "Action": [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket"
    ],
    "Resource": [
      "arn:aws:s3:::bucket-policy-example/*"
    ]
  }]
}
{{</ file >}}

This policy allows the user with the canonical ID `a0000000-000a-0000-0000-00d0ff0f0000`, known here as the "principal", to interact with the bucket, known as the "resource". The "resource" that is listed (`bucket-policy-example`) is the only bucket the user has access to.

{{< note >}}
The principal (a.k.a. the user) must have the prefix of `arn:aws:iam:::user/`, and the resource (a.k.a. the bucket) must have the prefix of `arn:aws:s3:::`.
{{< /note >}}

The permissions are specified in the `Action` array. For the current example, these are:

- `s3:PutObject`: The ability to upload objects to a bucket
- `s3:GetObject`: The ability to retrieve objects from a bucket
- `s3:ListBucket`: The ability to list the contents of the bucket

    {{< note >}}
For a full list of of available actions, visit the [Ceph bucket policy documentation](https://docs.ceph.com/docs/master/radosgw/bucketpolicy/#limitations).
{{< /note >}}

The `Action` and `Principal.AWS` fields of the bucket policy are arrays. Therefore, you can easily add additional users and permissions to the bucket policy, separating them by a comma. To grant permissions to all users, you can supply a wildcard (`*`) to the `Principal.AWS` field.

## Subdirectory Access Policy

You can also define a finer level of control over the level of access to your bucket's directory structure using policy rules.

{{< file "bucket-policy-directories.json" json >}}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"
      },
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::*"
      ]
    },
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"
      },
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::bucket-policy-example/test/*"
      ]
    }
  ]
}
{{</ file >}}

This example shows how you can grant read-only access to a user by allowing them to list buckets and get objects from the bucket only from the `test` directory. However, they can not perform any other actions.

## Denying Access by IP Address

If you wanted to deny all access to a resource and whitelist by IP address, you can change the `Effect` field from `Allow` to `Deny` and supply an IP address in a condition.

{{< file "bucket-policy-deny.json" json >}}
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": "arn:aws:s3:::bucket-policy-example/*",
    "Condition": {
      "NotIpAddress": {
        "aws:SourceIp": "192.0.2.0"
      }
    }
  }]
}
{{</ file >}}

## Combining Rules

Only one policy file [can be enabled](#enable-a-bucket-policy) at a time. Therefore, if you wanted to enact several of the above rules together, instead of enabling them one at a time, you would need to combine them into a single file with each rule listed as items in the `Statements` array.

{{< file "bucket-policy-combo.json" json >}}
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "AWS": [
        "arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"
      ]
    },
    "Action": [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket"
    ],
    "Resource": [
      "arn:aws:s3:::bucket-policy-example/*"
    ]
  },
  {
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"
    },
    "Action": [
      "s3:ListBucket"
    ],
    "Resource": [
      "arn:aws:s3:::*"
    ]
  },
  {
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"
    },
    "Action": [
      "s3:GetObject"
    ],
    "Resource": [
      "arn:aws:s3:::bucket-policy-example/test/*"
    ]
  },
  {
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": "arn:aws:s3:::bucket-policy-example/*",
    "Condition": {
      "NotIpAddress": {
        "aws:SourceIp": "192.0.2.0"
      }
    }
  }]
}
{{</ file >}}

## Enable a Bucket Policy

To enable the bucket policy, use the `setpolicy` s3cmd command, supplying the filename of the bucket policy as the first argument, and the S3 bucket address as the second argument:

    s3cmd setpolicy bucket_policy_example.json s3://bucket-policy-example

To ensure that it has been applied correctly, you can use the `info` command:

    s3cmd info s3://bucket-policy-example

You should see output like the following:

{{< output >}}
s3://bucket-policy-example/ (bucket):
   Location:  default
   Payer:     BucketOwner
   Expiration Rule: none
   Policy:    b'{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": {"AWS": ["arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"]},\n    "Action": ["s3:PutObject","s3:GetObject","s3:ListBucket"],\n    "Resource": [\n      "arn:aws:s3:::bucket-policy-example/*"\n    ]\n  }]\n}'
   CORS:      none
   ACL:       a0000000-000a-0000-0000-00d0ff0f0000: FULL_CONTROL
{{</ output >}}

{{< note >}}
The policy is visible in the output.
{{< /note >}}

---
title: "Define Access and Permissions using Bucket Policies"
description: "Learn how to use bucket policies to set permissions and access controls within Object Storage"
date: 2022-03-11
authors: ["Linode"]
---

Bucket policies are a mechanism for managing permissions and access to Object Storage. When compared to ACLs, bucket policies can only be applied across an entire bucket (not to individual objects), though they offer finer control over the types of permissions you can grant to a user.

## Components of a Policy

Bucket policies are formatted using JSON with the following structure:

 ```file {title="bucket-policy.json" lang="json"}
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": ...,
    "Principal": ...,
    "Action": ...,
    "Resource": ...
  }]
}
```

This file consists of a **Version** string (set to `2012-10-17`, which is the current version) and one or more **Statement** arrays, which define the actual policies you wish to use. Within each statement array are the **Effect**, **Principal**, **Action**, **Resource**, and optional **Condition** elements. Each of these are discussed below.

### Effect

The **Effect** section defines if access is allowed (`Allow`) or denied (`Deny`) to the specified resource. See [IAM JSON policy elements: Effect](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_effect.html).

    "Effect":"Allow"

### Principal

The **Principal** section defines the user or entity to which the policy applies. See [Amazon S3 Principals](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-bucket-user-policy-specifying-principal-intro.html).

-   **Specific user:** Specify an Object Storage canonical ID to have the policy apply to that user. For help finding the canonical ID, see [Find Canonical User ID](/docs/products/storage/object-storage/guides/find-canonical-id/).

        "Principal": {
          "AWS": [
            "arn:aws:iam:::user/a0000000-000a-0000-0000-00d0ff0f0000"
          ]
        }

-   **Public/anonymous access:** Use a wildcard to grant access to everyone. This is commonly used for hosting a website through Object Storage.

        "Principal":"*"

### Action

**Action** are the permissions granted (or removed) by the policy. These actions include the ability to list buckets, view objects, upload objects, and more:

- `s3:PutObject`: Upload objects
- `s3:GetObject`: Retrieve objects
- `s3:ListBucket`: List the contents of a bucket

For a full list of actions, see [Ceph > Bucket Policies](https://docs.ceph.com/en/latest/radosgw/bucketpolicy/#). You can also reference the [Amazon S3 actions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-with-s3-actions.html) guide.

### Resource

A policy is applied to Object Storage **resources**, such as buckets and objects. Bucket resources are formatted as `"arn:aws:s3:::[bucket]"`. To apply a policy to some or all objects within a bucket, use `"arn:aws:s3:::[bucket]/[object]"`. In both cases, replace *[bucket]* with the label for the bucket and *[object]* with either the wildcard value (`*`) that designates all objects or the path and name of the object. See [Amazon S3 resources](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-arn-format.html).

-   **All objects:** Apply the policy to all objects within the bucket labeled *example-bucket*.

        "Resource": [
          "arn:aws:s3:::example-bucket/*"
        ]

-   **All objects in specific directory:** Apply the policy to all objects in the `assets` folder within the bucket labeled *example-bucket*.

        "Resource": [
          "arn:aws:s3:::example-bucket/folder/*"
        ]

-   **Specific object:** Apply the policy to the object `example-file.ext` within the bucket labeled *example-bucket*.

        "Resource": [
          "arn:aws:s3:::example-bucket/example-file.ext"
        ]

{{< note type="alert" >}}
While a resource can target the bucket itself (by removing the `/*` in the first example), this can cause the bucket to become inaccessible to the Cloud Manager, API, and CLI.
{{< /note >}}

## Bucket Policy Examples

### Allow Public Read Access

If you wish to allow anyone to view and download objects within a bucket, use the following policy:

 ```file {title="bucket_policy.json" lang="json"}
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": [
      "s3:GetObject",
      "s3:ListBucket"
    ],
    "Resource": [
      "arn:aws:s3:::bucket-example/*"
    ]
  }]
}
```

### Grant an Account Limited Access to a Directory

This policy file allows a user to list the bucket called `example-bucket` and view/download objects within the `test` directory. They are not able to perform any other actions.

 ```file {title="bucket_policy.json" lang="json"}
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
        "arn:aws:s3:::example-bucket"
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
        "arn:aws:s3:::example-bucket/test/*"
      ]
    }
  ]
}
```

### Allow or Deny Access from a Specific IP Address

By using the **Condition** section and the **IpAddress** and **NotIpAddress** conditions, you can choose to allow or deny traffic from the specified IP address or range.

If the **Effect** is set to `Allow`, use the **IpAddress** condition to specify that *just* traffic from that IP address is allowed and use **NotIpAddress** to allow all traffic *except* from that IP.

If the **Effect** is set to `Deny`, use the **IpAddress** condition to deny traffic from that IP address and use **NotIpAddress** to deny all traffic *except* from that IP.

The example below allows all traffic from only the specified IP address:

 ```file {title="bucket_policy.json" lang="json"}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::example-bucket/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "192.0.2.1/32"
        }
      }
    }
  ]
}
```

## Applying Bucket Policies

After creating your bucket policy file and defining your policies, you need to use a third party tool to apply those policies to a bucket.

### S3cmd

**Command:** `s3cmd setpolicy [policy-file] s3://[bucket-label]`, replacing *[bucket-label]* with the label for your bucket and *[policy-file]* with the filename and path of your bucket policy file.

**Example:** Apply the bucket policies defined within the file "policy.json" to the bucket called "example-bucket":

    s3cmd setpolicy policy.json s3://example-bucket

See [S3cmd > Apply a Bucket Policy](/docs/products/storage/object-storage/guides/s3cmd/#apply-a-bucket-policy) for more details.

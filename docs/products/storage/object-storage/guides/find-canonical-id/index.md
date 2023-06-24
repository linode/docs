---
title: "Find the Canonical User ID for an Account"
description: "How to cancel the Linode Object Storage service."
date: 2022-03-11
authors: ["Linode"]
---

Each Object Storage account is given its own *canonical user ID*, which can be used to identify a specific account or share resources between accounts. This ID consists of a long string of letters, dashes, and numbers, such as `a0000000-000a-0000-0000-00d0ff0f0000`.

{{< note >}}
Each Linode account has a single canonical ID within Object Storage, which means that all users and Object Storage API keys on an account share the same canonical ID.
{{< /note >}}

To retrieve the canonical user ID of an account, choose one of the methods outlined below.

## S3cmd

The S3cmd utility can be used to retrieve the canonical ID by running the `info` command below, replacing *[bucket-label]* with the label of the bucket.

    s3cmd info s3://[bucket-label]

{{< note >}}
S3cmd must be configured to use the Access Key of the account to which the bucket belongs.
{{< /note >}}

Within the output, find an ACL that has the FULL_CONTROL permission and looks similar to the string shown in the example below.

```output
s3://example-bucket/ (bucket):
Location:  default
Payer:     BucketOwner
Expiration Rule: none
Policy:    none
CORS:      none
ACL:       a0000000-000a-0000-0000-00d0ff0f0000: FULL_CONTROL
```

If you see *none* as the ACL, it may indicate that your s3cmd is configured with a different region than the bucket is located within. See the [Additional Configuration Options](/docs/products/storage/object-storage/guides/s3cmd/#additional-configuration-options) of our s3cmd guide to learn how to manually edit the s3cmd configuration.

## AWS CLI

To retrieve the canonical id of *your account* within the AWS CLI, run the following command, replacing *[bucket-url]* with the URL of the bucket. See [Bucket URLs](/docs/products/storage/object-storage/guides/urls/#bucket-url) for instructions on formatting your bucket URL.

    aws s3api list-buckets --query Owner.ID --output text --endpoint=[bucket-url]

{{< note >}}
The AWS CLI must be configured to use the Access Key of the account to which the bucket belongs.
{{< /note >}}

## Curl

Alternatively, you *may* be able to retrieve the canonical ID by curling a bucket and retrieving the Owner ID field from the returned XML. This method is an option when both of these conditions are true:

- The bucket has objects within it and has already been set to public (with a command like `s3cmd setacl s3://other-users-bucket --acl-public`).
- The bucket has not been set to serve static websites.

Run the following curl command, replacing *[bucket-url]* with the URL of the bucket (ex: `example-bucket.us-southeast-1.linodeobjects.com`). See [Bucket URLs](/docs/products/storage/object-storage/guides/urls/#bucket-url) for instructions on formatting your bucket URL.

    curl [bucket-url]

Within the output, the canonical ID is displayed within the `<Owner><ID>` property. In the example output below, the ID is `a0000000-000a-0000-0000-00d0ff0f0000`.

```output
...
<Owner>
    <ID>a0000000-000a-0000-0000-00d0ff0f0000</ID>
    <DisplayName>a0000000-000a-0000-0000-00d0ff0f0000</DisplayName>
</Owner>
...
```
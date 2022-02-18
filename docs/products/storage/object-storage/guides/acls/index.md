---
author:
  name: Linode
  email: docs@linode.com
title: "Setting Permissions using ACLs (Access Control Lists)"
description: "Learn how to use ACLs to set permissions and access controls within Object Storage"
aliases: ['/platform/object-storage/how-to-use-object-storage-acls-and-bucket-policies/', '/guides/how-to-use-object-storage-acls-and-bucket-policies/']
---

Access Control Lists (ACLs) are a method of defining access to Object Storage resources. You can apply ACLs to both buckets and objects, giving users access and controlling their permission level. There are two generalized modes of access: setting buckets and/or objects to be private or public. A few other more granular settings are also available; the [Cloud Manager](#granular-permissions-for-cloud-manager) and [s3cmd](#granular-permissions-for-s3cmd) sections provide information on these respective settings.

## ACLs in the Cloud Manager

In Cloud Manager ACLs can be controlled at both the bucket and object level. ACLs in Cloud Manager go beyond s3cmd's ACLs and combine them with [bucket policies](#bucket-policies-with-s3cmd) for more granular control than just *public* or *private*.

### Granular Permissions for Cloud Manager

| Level | Permission | Description |
| ----- | ---------- | ----------- |
| Bucket | Private | Only you can list, create, overwrite, and delete Objects in this Bucket. *Default* |
| Bucket | Authenticated Read | All authenticated Object Storage users can list Objects in this Bucket, but only you can create, overwrite, and delete them. |
| Bucket | Public Read | Everyone can list Objects in this Bucket, but only you can create, overwrite, and delete them. |
| Bucket | Public Read/Write | Everyone can list, create, overwrite, and delete Objects in this Bucket. *This is not recommended.* |
| Object | Private | Only you can download this Object. *Default* |
| Object | Authenticated Read | All authenticated Object Storage users can download this Object. |
| Object | Public Read | Everyone can download this Object. |

### Bucket Level ACLs in Cloud Manager

{{< note >}}
Existing buckets and any new bucket created in the Cloud Manager have a default ACL permission setting of Private.
{{</ note >}}

1.  If you have not already, log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Click the **Object Storage** link in the sidebar, and then click on the bucket you wish to edit the ACLs for.

    ![Select an Object Storage Bucket](acl-select-bucket.png "Select an Object Storage Bucket")

1.  The Object Storage Bucket detail page appears. Click the **Access** tab.

    ![Object Storage Bucket Detail Page](acl-bucket-detail-page.png "Object Storage Bucket Detail Page")

1.  The Object Storage Bucket Access Page appears.

    ![Object Storage Bucket Access Page](acl-bucket-access-page.png "Object Storage Bucket Access Page")

1.  On this page you can select the ACL for this bucket as well as enable CORS.

    {{< note >}}
CORS is enabled by default on all existing buckets and on all new buckets.
{{</ note >}}

1.  Select the ACL for this bucket from the dropdown menu.

    ![Object Storage Bucket Access Menu](acl-bucket-access-menu.png "Object Storage Bucket Access Menu")

1.  Click the **Save** button to save these settings to the bucket.

    ![Object Storage Bucket Access Page Save Settings](acl-bucket-access-save.png "Object Storage Bucket Access Page Save Settings")

### Object Level ACLs in Cloud Manager

{{< note >}}
Existing objects and any new objects created in the Cloud Manager have a default ACL permission setting of Private.
{{</ note >}}

1.  If you have not already, log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Click the **Object Storage** link in the sidebar, and then click on the bucket that holds the objects that you wish to edit the ACLs for.

    ![Select an Object Storage Bucket](acl-select-bucket.png "Select an Object Storage Bucket")

1.  The Object Storage Bucket detail page appears and displays all the objects in your bucket.

1.  Next to the object you wish to edit the ACL settings for, click the ***more options ellipsis*** and select **Details** from the drop down menu that appears.

    ![Object Storage Object Detail Menu](acl-object-detail-select-menu.png "Object Storage Object Detail Menu")

1.  The Object ACL panel opens.

    ![Object Storage Object ACL Panel](acl-object-panel.png "Object Storage Object ACL Panel")

1.  Select the ACL you wish to set for this object from the dropdown menu.

    ![Object Storage Object ACL Menu Options](acl-object-menu-options.png "Object Storage Object ACL Menu Options")

1.  Click the **Save** button. The panel closes and the ACL is applied to the object.

    ![Object Storage Object ACL Save Settings](acl-object-panel-save.png "Object Storage Object ACL Save Settings")

## ACLs with s3cmd

With s3cmd, you can set a bucket to be public with the `setacl` command and the `--acl-public` flag:

    s3cmd setacl s3://acl-example --acl-public

This causes the bucket and its contents to be downloadable over the public Internet.

To set an object or bucket to private, you can use the `setacl` command and the `--acl-private` flag:

    s3cmd setacl s3://acl-example --acl-private

This prevents users from accessing the bucket's contents over the public Internet.

### Retrieving a Canonical ID

For the s3cmd method, you also need the [*canonical ID*](#retrieving-a-canonical-id) of each account you wish to grant additional permissions to.

{{< note >}}
Each Linode account has a single canonical ID within Object Storage, which means that all users and Object Storage API keys on an account share the same canonical ID.
{{< /note >}}

Choose one of the following methods to determine a bucket owner's canonical ID.

#### Through s3cmd

Run the following command on a bucket belonging to a different Linode customer account, replacing *other-users-bucket* with the name of their bucket.

    s3cmd info s3://other-users-bucket

{{< note >}}
The bucket referred to in this section is an arbitrary bucket on the target user's account. It is not related to the bucket on your account that you would like to set ACLs or bucket policies on.
{{< /note >}}

There are two options for running this command:

- The users you're granting or restricting access to can run this command on one of their buckets and share their canonical ID with you, or:

- You can run this command yourself if you have use of their access tokens (you need to configure s3cmd to use their access tokens instead of your own).

The output is similar to the following:

{{< output >}}
s3://other-users-bucket/ (bucket):
Location:  default
Payer:     BucketOwner
Expiration Rule: none
Policy:    none
CORS:      none
ACL:       a0000000-000a-0000-0000-00d0ff0f0000: FULL_CONTROL
{{</ output >}}

The canonical ID of the owner of the bucket is the long string of letters, dashes, and numbers found in the line labeled `ACL`, which in this case is `a0000000-000a-0000-0000-00d0ff0f0000`. If you see *none* as the ACL, it may indicate that your s3cmd is configured with a different region than the bucket is located within. See the [Additional Configuration Options](/docs/products/storage/object-storage/guides/s3cmd/#additional-configuration-options) of our s3cmd guide to learn how to manually edit the s3cmd configuration.

#### Through curl

Alternatively, you *may* be able to retrieve the canonical ID by curling a bucket and retrieving the Owner ID field from the returned XML. This method is an option when both of these conditions are true:

- The bucket has objects within it and has already been set to public (with a command like `s3cmd setacl s3://other-users-bucket --acl-public`).
- The bucket has not been set to serve static websites.

Run the following curl command, replacing *other-users-bucket* with the bucket name and the cluster URL with the relevant value:

    curl other-users-bucket.us-east-1.linodeobjects.com

{{< content "object-storage-cluster-shortguide" >}}

This results in the following output:

{{< output >}}
<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Name>acl-bucket-example</Name>
    <Prefix/>
    <Marker/>
    <MaxKeys>1000</MaxKeys>
    <IsTruncated>false</IsTruncated>
    <Contents>
    <Key>cpanel_marketplace.gif</Key>
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
{{</ output >}}

In the above output, the canonical ID is `a0000000-000a-0000-0000-00d0ff0f0000`.

### Granular Permissions for s3cmd

The more granular permissions are:

|Permission|Description|
|-----|-----------|
|**read**| Users with can list objects within a bucket|
|**write**| Users can upload objects to a bucket and delete objects from a bucket.|
|**read_acp**| Users can read the ACL currently applied to a bucket.|
|**write_acp**| Users can change the ACL applied to the bucket.|
|**full_control**| Users have read and write access over both objects and ACLs.|

**Setting a permission:** To apply granular permissions for a specific user with s3cmd, use the following `setacl` command with the `--acl-grant` flag:

    s3cmd setacl s3://acl-example --acl-grant=PERMISSION:CANONICAL_ID

Substitute `acl-example` with the name of the bucket (and the object, if necessary), `PERMISSION` with a permission from the above table, and `CANONICAL_ID` with the canonical ID of the user to which you would like to grant permissions.

**Revoking a permission:** To revoke a specific permission, you can use the `setacl` command with the `acl-revoke` flag:

    s3cmd setacl s3://acl-example --acl-revoke=PERMISSION:CANONICAL_ID

Substitute the bucket name (and optional object), `PERMISSION`, and `CANONICAL_ID` with your relevant values.

**View current ACLs:** To view the current ACLs applied to a bucket or object, use the `info` command, replacing `acl-example` with the name of your bucket (and object, if necessary):

    s3cmd info s3://acl-example

You should see output like the following:

{{< output >}}
s3://acl-bucket-example/ (bucket):
   Location:  default
   Payer:     BucketOwner
   Expiration Rule: none
   Policy:    none
   CORS:      b'&lt;CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/"&gt;&lt;CORSRule&gt;&lt;AllowedMethod&gt;GET&lt;/AllowedMethod&gt;&lt;AllowedMethod&gt;PUT&lt;/AllowedMethod&gt;&lt;AllowedMethod&gt;DELETE&lt;/AllowedMethod&gt;&lt;AllowedMethod&gt;HEAD&lt;/AllowedMethod&gt;&lt;AllowedMethod&gt;POST&lt;/AllowedMethod&gt;&lt;AllowedOrigin&gt;*&lt;/AllowedOrigin&gt;&lt;AllowedHeader&gt;*&lt;/AllowedHeader&gt;&lt;/CORSRule&gt;&lt;/CORSConfiguration&gt;'
   ACL:       *anon*: READ
   ACL:       a0000000-000a-0000-0000-00d0ff0f0000: FULL_CONTROL
   URL:       http://us-east-1.linodeobjects.com/acl-example/
{{</ output >}}

{{< note >}}
The owner of the bucket always has the `full_control` permission.
{{< /note >}}

{{< note >}}
If you set an ACL that does not map to an ACL in the Cloud Manager, the Cloud Manager displays this as `Custom`.

![Custom ACL Setting Displayed in Cloud Manager](acl-s3cmd-custom-setting-cloud-manager.png "Custom ACL Setting Displayed in Cloud Manager")
{{</ note >}}
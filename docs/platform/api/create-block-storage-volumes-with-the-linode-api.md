---
author:
  name: Jared Kobos
  email: docs@linode.com
description: Linode’s Block Storage service allows you to attach additional storage volumes to your Linode. This guide demonstrates how to create, attach, clone, and resize Volumes using the Linode API.
og_description: Linode’s Block Storage service allows you to attach additional storage volumes to your Linode. This guide demonstrates how to create, attach, clone, and resize Volumes using the Linode API.
keywords: ["linode api", "block storage", "volume"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-03
modified_by:
  name: Linode
published: 2018-05-03
title: Block Storage Volumes with the Linode API
external_resources:
  - '[API Documentation](https://developers.linode.com/v4/introduction)'
---

<!--- ![Block Storage Volues with the Linode API](/docs/assets/api-block-storage/api-block-storage-smp.png) --->

The Linode API allows you to create, delete, attach/detach, clone, and resize Block Storage Volumes.

## Before You Begin

You will need a Personal Access Token to access the `/volumes` endpoint. Access tokens can be created through the beta [Linode Manager](https://cloud.linode.com). See our [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/) for more information.

When you have a token, store it as a temporary shell variable to simplify repeated requests:

    token=<Access Token>

## Create a Volume

You can create a new Block Storage Volume by making a POST request to the `/volumes` endpoint.

1.  Create the Volume. Adjust the size, region, and label in the request below to the desired values. You can view a list of available regions by sending a GET request to `https://api.linode.com/v4/regions`.

        curl -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -X POST -d '{
          "label": "my-volume",
          "region": "us-east",
          "size": 100
        }' \
        https://api.linode.com/v4/volumes

    {{< note >}}
The Volume and the Linode it will be attached to must be in the same region.
{{< /note >}}

2.  Examine the response JSON object and copy the new Volume's ID (in the `id` field).

    {{< highlight json "linenos=table" >}}
{
   "linode_id":null,
   "label":"my-volume",
   "size":100,
   "updated":"2018-05-07T14:59:48",
   "created":"2018-05-07T14:59:48",
   "id":6830,
   "status":"creating",
   "region":"us-east",
   "filesystem_path":"/dev/disk/by-id/scsi-0Linode_Volume_my-volume"
}
{{< /highlight >}}

3.   Query the Volume using the `/volumes/$volume_id` endpoint to to make sure it was successfully created:

        curl -H "Authorization: Bearer $token" \
        https://api.linode.com/v4/volumes/$volume_id

      If the `status` field in the response is `active`, your Volume is ready to use.

## Attach to a Linode

Before the new Volume can be mounted, it must be attached to a Linode. To do this, you will need the ID of a Linode on your account.

1.  List the Linodes on your account:

        curl -H "Authorization: Bearer $token" \
        https://api.linode.com/v4/linode/instances

    Each Linode instance in the returned list will include an `id` field. Choose a Linode and copy its ID.

2.  Attach the new Volume to your Linode with the `/volumes/$volume_id/attach` endpoint:

        curl -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -X POST -d \
        '{ "linode_id": $linode-id }' \
        https://api.linode.com/v4/volumes/$volume_id/attach

3.  Copy the file path in the `filesystem_path` field:

    {{< highlight json "linenos=table" >}}
{
   "id":1234,
   "status":"active",
   "size":100,
   "label":"my-volume",
   "linode_id":1234567,
   "region":"us-east",
   "updated":"2018-05-07T17:22:27",
   "created":"2018-05-07T17:22:27",
   "filesystem_path":"/dev/disk/by-id/scsi-0Linode_Volume_my-volume"
}
{{< /highlight >}}

    {{< note >}}
If a Linode is not running and has more than one configuration profile, you should also include a `config_id` parameter in the POST request to specify which profile to use.
{{< /note >}}

### Mount the Volume

The API can't directly mount the new Volume after it is attached; you will have to SSH into the Linode and mount manually:

1.  Create a filesystem on the Volume:

        mkfs.ext4 $volume_path

2.  Create a mountpoint:

        mkdir /mnt/my-volume

3.  Mount the Volume:

        mount $volume_path /mnt/my-volume

4.  To have the Volume automatically mount every time your Linode boots, add the following line to your `/etc/fstab` file:

        $volume_path /mnt/my-volume defaults 0 2

### Detach

To detach a Volume from your Linode, use the `/detach` endpoint:

    curl -H "Authorization: Bearer $token" \
    -X POST \
    https://api.linode.com/v4/volumes/$volume_id/detach

### Create and Attach

It is also possible to pass a Linode ID to the API when creating a Volume. This will automatically attach the new Volume to the Linode after it is created:

    curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -X POST -d '{
      "label": "my-volume",
      "region": "us-east",
      "size": 100,
      "linode_id": $linode-id
    }' \
    https://api.linode.com/v4/volumes

{{< highlight json "linenos=table" >}}
{
   "created":"2018-04-30T20:53:19",
   "status":"creating",
   "filesystem_path":"/dev/disk/by-id/scsi-0Linode_Volume_my-volume",
   "updated":"2018-04-30T20:53:19",
   "id":1234,
   "size":100,
   "region":"us-east",
   "linode_id":1234567,
   "label":"my-volume"
}
{{< /highlight >}}

## Clone a Volume

You can copy all of the data in a Block Storage Volume to a new Volume:

    curl -H "Authorization: Bearer $token" \
        -X POST -d '{
          "label": "new-volume"
        }' \
        https://api.linode.com/v4/volumes/$volume_id/clone

## Delete a Volume

You can remove a Volume from your account with a DELETE request. If the Volume is attached to a Linode, you will have to detach it before it can be deleted.

    curl -H "Authorization: Bearer $token" \
    -X DELETE \
    https://api.linode.com/v4/volumes/$volume_id

## Resize a Volume

If you need additional space, you can increase the size of a Volume through the API. It is not possible to reduce the size of a Volume.


Pass the desired size (in gigabytes) using the `size` parameter:

    curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -X POST -d '{
        "size": 200
    }' \
    https://api.linode.com/v4/volumes/$volume_id/resize

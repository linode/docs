---
title: "Manage Block Storage Volumes with the Linode API"
description: "This guide demonstrate how to create, attach, clone, and resize Volumes using the Linode API."
published: 2018-05-14
modified: 2022-12-06
image: manage-block-storage-volumes-with-the-linode-api.png
external_resources:
  - '[API Documentation](/docs/api/)'
keywords: ["linode api", "block storage", "volume"]
tags: ["linode platform"]
aliases: ['/platform/api/create-block-storage-volumes-with-the-linode-api/','/guides/create-block-storage-volumes-with-the-linode-api/','/products/tools/api/guides/block-storage/']
---

The Linode API allows you to create, delete, attach, detach, clone, and resize Block Storage Volumes.

## Before You Begin

You need a Personal Access Token for the Linode API to complete the steps in this guide. See [Manage Personal Access Tokens](/docs/products/tools/api/guides/manage-api-tokens/#create-an-api-token) for more information.

Store the token as a temporary shell variable to simplify repeated requests. Replace `<Access Token>` in this example with your token:

```command
export TOKEN=<token-string>
```

## Create a Block Storage Volume

Create a new Block Storage Volume by making a POST request to the `/volumes` endpoint. You can also automatically attach the new Volume to an existing Compute Instance by passing the instance's ID when creating the Volume.

1. List the Compute Instances on your account:

    ```command
    curl -H "Authorization: Bearer $token" \
        https://api.linode.com/v4/linode/instances
    ```

    Choose a Compute Instance from the returned list and copy its `id` and `region` values.

1. Create a Volume in the same region as the target instance. Use the ID of the target instance and adjust the size (in GB), region, and label to the desired values:

    ```command
    curl -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -X POST -d '{
          "label": "my-volume",
          "region": "us-east",
          "size": 100,
          "linode_id": 1234567
        }' \
        https://api.linode.com/v4/volumes
    ```

    {{< note >}}
    The Volume and Compute Instance must be in the same region.
    {{< /note >}}

1. Examine the response JSON object and copy the values in the `id` and `filesystem_path` fields:

    ```file {lang="json"}
    {
      "linode_id":1234567,
      "label":"my-volume",
      "size":100,
      "updated":"2018-05-07T14:59:48",
      "created":"2018-05-07T14:59:48",
      "id":6830,
      "status":"creating",
      "region":"us-east",
      "filesystem_path":"/dev/disk/by-id/scsi-0Linode_Volume_my-volume"
    }
    ```

1. Query the Volume using the `/volumes/$volume_id` endpoint to make sure it was successfully created:

    ```command
    curl -H "Authorization: Bearer $token" \
        https://api.linode.com/v4/volumes/$volume_id
    ```

    If the `status` field in the response is `active`, your Volume is ready to use.

### Mount the Volume

The API can't directly mount the new Volume after it is attached. SSH into the Linode and mount it manually:

1. Create a filesystem on the Volume:

    ```command
    mkfs.ext4 $volume_path
    ```

1. Create a mountpoint:

    ```command
    mkdir /mnt/my-volume
    ```

1. Mount the Volume:

    ```command
    mount $volume_path /mnt/my-volume
    ```

1. To automatically mount the Volume every time your Compute Instance boots, add the following line to your `/etc/fstab` file:

    ```file {title="/etc/fstab"}
    $volume_path /mnt/my-volume defaults 0 2
    ```

## Attach and Detach the Volume

If you did not specify a Compute Instance when creating the Volume, or would like to attach it to a different instance, use the `/attach` and `/detach` endpoints:

1. Detach the Volume. Replace `$volume_id` with the Volume ID from the previous section:

    ```command
    curl -H "Authorization: Bearer $token" \
        -X POST \
        https://api.linode.com/v4/volumes/$volume_id/detach
    ```

1. Attach the Volume to the new target Compute Instance:

    ```command
    curl -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -X POST -d \
        '{ "linode_id": $linode-id }' \
        https://api.linode.com/v4/volumes/$volume_id/attach
    ```

    {{< note >}}
    If a Compute Instance is not running and has more than one configuration profile, include a `config_id` parameter in the POST request to specify which profile to use. If you do not specify a profile, the first profile will be used by default.
    {{< /note >}}

## Clone a Volume

To copy all of the data in a Block Storage Volume to a new Volume:

```command
curl -H "Authorization: Bearer $token" \
    -X POST -d '{
      "label": "new-volume"
    }' \
    https://api.linode.com/v4/volumes/$volume_id/clone
```

## Delete a Volume

Remove a Volume from your account with a DELETE request. If the Volume is attached to a Compute Instance, you will have to detach it before it can be deleted:

```command
curl -H "Authorization: Bearer $token" \
    -X DELETE \
    https://api.linode.com/v4/volumes/$volume_id
```

## Resize a Volume

If you need additional space, you can increase the size of a Volume through the API. It is not possible to reduce the size of a Volume.

Pass the desired size (in gigabytes) using the `size` parameter:

```command
curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -X POST -d '{
        "size": 200
    }' \
    https://api.linode.com/v4/volumes/$volume_id/resize
```

{{< note >}}
After resizing the Volume, you also need to resize the file system to accommodate the additional space. For instructions, see the last few steps on the [Resize a Volume](/docs/products/storage/block-storage/guides/resize-volume/) guide.
{{< /note >}}
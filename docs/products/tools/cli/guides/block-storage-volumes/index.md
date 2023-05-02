---
title: Block Storage Volumes
description: "How to use the Linode CLI for to manage the Block Storage service."
published: 2020-07-20
modified: 2022-05-02
authors: ["Linode"]
---

1.  List your current Volumes:

        linode-cli volumes list

1.  Create a new Volume, with the size specified in GB:

        linode-cli volumes create --label my-volume --size 100 --region us-east

    Specify a `linode_id` to create the Volume and automatically attach it to a specific Linode:

        linode-cli volumes create --label my-volume --size 100  --linode_id $linode_id

1.  Attach or detach the Volume from a Linode:

        linode-cli volumes attach $volume_id --linode_id $linode_id
        linode-cli volumes detach $volume_id

1.  Resize a Volume (size can only be increased):

        linode-cli volumes resize $volume_id --size 200

1.  Delete a Volume:

        linode-cli volumes delete $volume_id

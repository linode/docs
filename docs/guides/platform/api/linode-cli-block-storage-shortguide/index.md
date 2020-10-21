---
slug: linode-cli-block-storage-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the Block Storage section of the CLI guide.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to manage Block Storage with the CLI
keywords: ["block storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-block-storage-shortguide/']
---

1.  List your current Volumes:

        linode-cli volumes list

1.  Create a new Volume, with the size specified in GiB:

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

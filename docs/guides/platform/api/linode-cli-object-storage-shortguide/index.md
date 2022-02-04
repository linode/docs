---
slug: linode-cli-object-storage-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the Object Storage section of the CLI guide.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2022-01-03
modified_by:
  name: Ryan Syracuse
published: 2020-07-20
title: How to manage Object Storage with the CLI
keywords: ["object storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-object-storage-shortguide/']
---

1.  List the current Object Storage Clusters available to use:

        linode-cli object-storage clusters-list

1.  Create a new Object Storage Key for your account:

        linode-cli object-storage keys-create --label "my-object-storage-key"

1.  List Object Storage Keys for authenticating to the Object Storage S3 API:

        linode-cli object-storage keys-list

1.  Update an Object Storage Key label:

        linode-cli object-storage keys-update --keyId $key_id --label "my-new-object-storage-key"

1.  Upload a TLS/SSL Certificate:

        linode-cli object-storage ssl-upload us-east-1 example-bucket --certificate "my-full-certificate" --private_key "my-full-private-key"

1.  View an Active TLS/SSL Certificate:

        linode-cli object-storage ssl-view us-east-1 example-bucket

1.  Revoke an Object Storage Key:

        linode-cli object-storage keys-delete $key_id

1.  Delete an Active TLS/SSL Certificate:

        linode-cli object-storage ssl-delete us-east-1 example-bucket

1.  Cancel Object Storage on your Account. All buckets on the Account must be empty before Object Storage can be cancelled.

        linode-cli object-storage cancel

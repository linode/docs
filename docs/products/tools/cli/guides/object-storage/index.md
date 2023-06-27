---
title: "Linode CLI Commands for Object Storage"
description: "How to use the Linode CLI to create and manage Linode Object Storage buckets and objects."
published: 2020-07-20
modified: 2022-05-02
authors: ["Linode"]
---

## Basic Commands

List the current Object Storage Clusters available to use.

    linode-cli object-storage clusters-list

## Manage Access Keys

List all access keys on the account.

    linode-cli object-storage keys-list

Create a new access key with the label *example-label*.

    linode-cli object-storage keys-create --label "example-label"

Update the label of an access key, replacing *[id]* with the **ID** of the access key you wish to update.

    linode-cli object-storage keys-update --keyId [id] --label "new-label"

Revoke an access key, replacing *[id]* with the **ID** of the access key you wish to revoke.

    linode-cli object-storage keys-delete [id]

## TLS/SSL Certificates

Upload a TLS/SSL Certificate.

    linode-cli object-storage ssl-upload us-east-1 example-bucket --certificate "my-full-certificate" --private_key "my-full-private-key"

View an Active TLS/SSL Certificate:

    linode-cli object-storage ssl-view us-east-1 example-bucket

Delete an Active TLS/SSL Certificate:

    linode-cli object-storage ssl-delete us-east-1 example-bucket

## Cancel Object Storage

Cancel Object Storage on your Account. All buckets on the Account must be empty before Object Storage can be cancelled.

    linode-cli object-storage cancel
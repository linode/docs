---
title: Guides
title_meta: "Guides and Tutorials for Object Storage"
description: "Find guides on Linode Object Storage management, hosting a static site on Object Storage, access and permissions, and other related topics."
tab_group_main:
    weight: 30
tags: ["education","media"]
---

## Basics

- [Create and Manage Buckets](/docs/products/storage/object-storage/guides/manage-buckets/): Buckets are the primary containers within Object Storage. Learn how to view, create, and delete buckets through the Cloud Manager.

- [Upload and Manage Files (Objects)](/docs/products/storage/object-storage/guides/manage-files/): Learn how to view, upload, download, and delete objects through the Cloud Manager.

- [Manage Access Keys](/docs/products/storage/object-storage/guides/access-keys/): Access keys enable you to access Object Storage through other tools and your own applications. Learn how to generate and manage these in the Cloud Manager.

- [Access Buckets and Files through URLs](/docs/products/storage/object-storage/guides/urls/): Every bucket and file can be accessed by a unique URL. Learn how to obtain these URLs.

- [Configure a Custom Domain (with a TLS/SSL Certificate)](/docs/products/storage/object-storage/guides/custom-domain/): Linode's Object Storage supports accessing buckets and objects through a custom domain. Learn how to configure a custom domain with a TLS/SSL certificate.

- [Cancel Object Storage](/docs/products/storage/object-storage/guides/cancel/): Learn how to cancel the Object Storage service from the Cloud Manager.

- [Object Storage Use Cases](/docs/products/storage/object-storage/guides/use-cases/): Information on the benefits and common use cases of Linode's Object Storage service.

## Set Permissions and Access Controls

- [ACLs (Access Control Lists)](/docs/products/storage/object-storage/guides/acls/): Information on ACLs and how to use them to set permissions on Object Storage resources.

- [Bucket Policies](/docs/products/storage/object-storage/guides/bucket-policies/): Information on bucket policies and how to use them to set permissions on Object Storage resources.

- [Find the Canonical User ID for an Account](/docs/products/storage/object-storage/guides/find-canonical-id/): Learn how to find the canonical user ID for an account.

## Advanced Management

- [Versioning (Retain Object Version History)](/docs/products/storage/object-storage/guides/versioning/): Discover how to enable and manage versioning within Object Storage.

- [Lifecycle Policies](/docs/products/storage/object-storage/guides/lifecycle-policies/): Learn how to define policies to manage the lifecycle and retention history of objects.

## Clients and Tools

Guides for using Object Storage with various clients and command-line tools:

- [Linode CLI](/docs/products/storage/object-storage/guides/linode-cli): An easy to use command-line tool for use with Linode's own services.
- [s3cmd](/docs/products/storage/object-storage/guides/s3cmd): One of the most common command-line tools for interacting with S3-compatible object storage solutions, including Linode Object Storage.
- [s4cmd](/docs/products/storage/object-storage/guides/s4cmd): A faster alternative to the s3cmd command-line tool.
- [Cyberduck](/docs/products/storage/object-storage/guides/cyberduck): A cross-platform graphical interface for interacting with various cloud storage services.

## AWS Tooling

Guides for using Object Storage with various AWS SDKs:

- [AWS CLI](/docs/products/storage/object-storage/guides/aws-cli/)
- [AWS SDK for Python (boto3)](/docs/products/storage/object-storage/guides/aws-sdk-for-python/)
- [AWS SDK for PHP](/docs/products/storage/object-storage/guides/aws-sdk-for-php/)

## Going Further

These additional guides explore targeted topics like setting up a static site and managing access and permissions for your buckets and objects:

- [Deploy a Static Site using Hugo and Object Storage](/docs/guides/host-static-site-object-storage/)
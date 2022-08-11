---
slug: an-overview-of-the-linode-cloud-manager
author:
  name: Linode
  email: docs@linode.com
description: "This guide provides you with an overview of the Linode Cloud Manager and covers how to locate features within Cloud Manager, create Linodes and more."
keywords: ["classic manager","cloud manager","linode"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/platform/manager/a-classic-to-cloud-manager-overview-guide/','/platform/manager/an-overview-of-the-linode-cloud-manager/']
published: 2019-12-20
modified: 2020-01-29
modified_by:
  name: Linode
image: AnOverviewoftheLinodeCloudManager.png
title: "An Overview of the Linode Cloud Manager"
contributor:
  name: Linode
tags: ["linode platform","cloud manager"]
---

The [Linode Cloud Manager](https://cloud.linode.com/) provides a user-friendly interface to manage your infrastructure, user accounts, billing and payments, and to open and track support tickets. You can easily create Linode instances, managed Kubernetes clusters, add backups to your Linodes, deploy Marketplace Apps, track event notifications, create Object Storage buckets, and more. The Cloud Manager is implemented solely atop our [public APIv4](/docs/api), which gives you access to all our latest products and services.

## In this Guide

This guide provides an overview of the features and services available in Linode's Cloud Manager. Some of the topics that will be discussed are:

- An introduction to each section of the Cloud Manager, including links to related guides throughout our documentation library.
- The location of commonly used Cloud Manager features.
- Settings that might make your overall Cloud Manager experience better

## Linodes

{{< content "cloud-linodes-shortguide" >}}

### Find Your Disks

{{< content "cloud-disks-shortguide" >}}

### Reboot Your Linode

{{< content "cloud-reboot-shortguide" >}}

### Delete a Public IP Address

{{< content "cloud-delete-ip-shortguide" >}}

## Volumes

{{< content "cloud-volumes-shortguide" >}}

## Object Storage

{{< content "cloud-object-storage-shortguide" >}}

## NodeBalancers

{{< content "cloud-nodebalancers-shortguide" >}}

## Domains (DNS Manager)

{{< content "cloud-domains-shortguide" >}}

### Zone Files

The Cloud Manager automatically ensures that your Domain's zone file does not contain any errors when a Domain Record is created or updated.

{{< note >}}
This Cloud Manager and [API v4](/docs/api) functionality is currently under active development.
{{</ note >}}

- When creating a Zone File for a Domain, the [Linode API v4](/docs/api) checks for any errors that may exist. If an error is found, the Cloud Manager will respond with the corresponding error. This means that the Cloud Manager will not allow you to create an invalid zone file.

- Once your Domain and corresponding Zone File is created, you can use the `dig` command to further verify that each domain record contains the information you expect. It will take a few moments before a newly created domain record will show up when issuing the `dig` command.

        dig example.com
        dig example.com MX

    See the [Use dig to Perform Manual DNS Queries](/docs/guides/use-dig-to-perform-manual-dns-queries/) guide for more details on the `dig` command.

## Longview

{{< content "cloud-longview-shortguide" >}}

## Marketplace

{{< content "cloud-marketplace-shortguide" >}}

## Kubernetes

{{< content "cloud-kubernetes-shortguide" >}}

## StackScripts

{{< content "cloud-stackscripts-shortguide" >}}

## Images

{{< content "cloud-images-shortguide" >}}

## Account (Management and Billing)

{{< content "cloud-management-and-billing-shortguide" >}}

### Find Credit Remaining

{{< content "cloud-credits-shortguide" >}}

### Printing an Invoice

{{< content "cloud-invoices-shortguide" >}}

### Password Management

The Cloud Manager does not support forcing password expirations. Forcing password resets on a schedule is [bad practice from a security perspective](https://pages.nist.gov/800-63-FAQ/#q-b05). Current security research indicates that forced password changes do more harm than good. If you want to force password resets for users of your Linode account, we recommend using a password manager for this purpose.

## Tags

Linode’s Cloud Manager and [API v4](/docs/api) allow you to create tags to help organize and group your Linode resources. Tags can be applied to [Linodes](#linodes), [Block Storage Volumes](#volumes), [NodeBalancers](#nodebalancers), and [Domains](#domains-dns-manager). See the [Tags and Groups](/docs/guides/tags-and-groups/) guide to learn how to create, apply, and search for tags.

## Events and Activity Feeds

Tasks performed using the Linode Cloud Manager or other account specific tools like Linode’s [CLI](/docs/products/tools/cli/get-started/) or [API](https://www.linode.com/products/api/) will be logged to an individual Linode’s activity feed, or on your account’s [Events Page](https://cloud.linode.com/events). The events and activity pages are user accessible logs, or histories of events taking place on your account. They contain details regarding the most notable events affecting your Linodes, like reboots, shutdowns, migrations, and more.

For more details, see the [Understanding Events and Activity Feeds](/docs/guides/cloud-manager-events-and-activity-feeds/) guide.

## My Profile

The **My Profile** section of Cloud Manager provides access to various settings related to your Linode account's profile. This area of Cloud Manager contains access to the following features and settings:

- [Changing your account's associated email address](/docs/guides/accounts-and-passwords/#changing-your-email-address) and timezone
- [Resetting your Account password](/docs/guides/accounts-and-passwords/#changing-or-resetting-your-linode-cloud-manager-password)
- [Enabling two-factor authentication](/docs/guides/linode-manager-security-controls/#enable-two-factor-authentication)
- [Enabling Third Party Authentication (TPA)](/docs/guides/third-party-authentication/)
- Managing trusted devices
- [Adding and managing public SSH keys](/docs/guides/use-public-key-authentication-with-ssh/#upload-your-ssh-key-to-the-cloud-manager)
- [Managing LISH authentication methods](/docs/guides/using-the-lish-console/#add-your-public-key)
- [Adding and managing personal and third party API v4 access tokens](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token)
- [Creating and managing OAuth Apps](/docs/guides/how-to-create-an-oauth-app-with-the-linode-python-api-library/#obtaining-a-client-id-and-a-client-secret)
- [Accessing Linode referral codes](/docs/guides/understanding-billing-and-payments/#referral-credits)
- Enable email alerts for account activity

### API Keys / API Tokens

{{< content "cloud-api-keys-shortguide" >}}

{{< note >}}
Currently, Cloud Firewall permissions can not be set for Personal Access Tokens using the Linode Cloud Manager and the Linode API should be used directly for this purpose. For more information, see our [API documentation](/docs/api/profile/#personal-access-tokens-list) and our guide on [Getting Started With Cloud Firewall](http://localhost:1313/docs/guides/getting-started-with-cloud-firewall/#limiting-user-access-to-cloud-firewalls-with-the-linode-api)
{{< /note >}}

### OAuth Apps

{{< content "cloud-oauth-apps-shortguide" >}}

### Manage Email Event Notifications

{{< content "cloud-email-notifications-shortguide" >}}

## User Interface Enhancements

### Dark Mode

Cloud Manager provides a Dark Mode that you can toggle on and off depending on your preference.

1. Navigate to your profile by clicking on your username and select **My Settings**.

1. Toggle on **Dark Mode** to change the color scheme of the UI. Dark Mode is disabled by default.

![Dark Mode Enabled](classic-to-cloud-dark-mode.png "Cloud Manager Dark Mode Enabled")

### Accessibility

The Linode Cloud Manager has been built with accessibility in mind. Currently, the Cloud Manager is actively being developed to achieve [WCAG 2.0 Level AA](https://www.w3.org/TR/WCAG20/).

We have received a lot of helpful feedback from our users regarding accessibility. While we have addressed a lot of your feedback, this is still a work in progress and will be iterated upon with time. If you have comments or requests regarding accessibility, let us know by filling out our [feedback form](https://www.linode.com/feedback/).

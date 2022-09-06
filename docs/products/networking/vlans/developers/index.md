---
title: Developers
description: "Use the Linode API v4 and the Linode CLI to create Linode Virtual LANs. You can create secure and private networks in the cloud using Linode Virtual LANs."
tab_group_main:
    weight: 50
---

## Linode API

Linode’s [API v4](/docs/api) provides the ability to programmatically manage the full range of Linode products and services, including VLANs.

- [Creating a Private Network Using Linode API and Linode VLAN](/docs/guides/vlan-api/): This guide shows you how to create a VLAN and attach Linodes to it using the Linode APIv4.

-  **Linode VLANs Endpoint Collection:** Use [VLANs List](/docs/api/networking/#vlans-list) and the [Configuration Profiles View](/docs/api/linode-instances/#configuration-profile-view) (as part of the `interfaces array`) to view VLANs. Create and manage VLANs through the [Configuration Profile Create](/docs/api/linode-instances/#configuration-profile-create) and [Configuration Profile Update](/docs/api/linode-instances/#configuration-profile-update) endpoints.

## Linode CLI

The [Linode CLI](https://github.com/linode/linode-cli) is a wrapper around the Linode API v4 that allows you to manage your Linode account and resources from the command line. Learn how to use the Linode CLI to [create and manage your Linode resources](/docs/products/tools/cli/get-started/).

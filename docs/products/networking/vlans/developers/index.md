---
title: Developers
title_meta: "Developer Resources for VLANs"
description: "Use the Linode API v4 and the Linode CLI to create Linode Virtual LANs. You can create secure and private networks in the cloud using Linode Virtual LANs."
tab_group_main:
    weight: 50
---

## Linode API

Linode’s [API v4](https://techdocs.akamai.com/linode-api/reference/api) provides the ability to programmatically manage the full range of Linode products and services, including VLANs.

- [Creating a Private Network Using Linode API and Linode VLAN](/docs/products/networking/vlans/guides/manage-vlans-using-linode-api/): This guide shows you how to create a VLAN and attach Linodes to it using the Linode APIv4.

-  **Linode VLANs Endpoint Collection:** Use [VLANs List](https://techdocs.akamai.com/linode-api/reference/api-summary#vlans-list) and the [Configuration Profiles View](https://techdocs.akamai.com/linode-api/reference/api-summary#configuration-profile-view) (as part of the `interfaces array`) to view VLANs. Create and manage VLANs through the [Configuration Profile Create](https://techdocs.akamai.com/linode-api/reference/api-summary#configuration-profile-create) and [Configuration Profile Update](https://techdocs.akamai.com/linode-api/reference/api-summary#configuration-profile-update) endpoints.

## Linode CLI

The [Linode CLI](https://github.com/linode/linode-cli) is a wrapper around the Linode API v4 that lets you manage your Linode account and resources from the command line. Learn how to use the Linode CLI to [create and manage your Linode resources](/docs/products/tools/cli/get-started/).

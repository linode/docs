---
slug: vlans-limitations-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that lists the limitations of VLANs on various guides.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-04-07
modified_by:
  name: Linode
published: 2021-04-07
title: "VLANs Limitations"
keywords: []
headless: true
show_on_rss_feed: false
---

## Limitations

- **VLANs are region-specific.**  Once created, a VLAN can only be attached to other Linodes within the same data center.

- **An account can have up to 10 VLANs per region.**

- **A Linode can belong to a maximum of 3 VLANs.** Since there are 3 configurable network interfaces on each Linode, up to 3 VLANs can be attached. If one of those network interfaces is configured for the public internet, there are 2 remaining network interfaces for use with VLANs.

- **VLANs cannot be manually renamed by the user.** If a VLAN's label must be changed, a new VLAN can be created and all required Linodes can be attached to that new VLAN.

- **VLANs cannot be manually deleted by the user.** There is no need to manually delete a VLAN. If a VLAN is no longer needed, simply detach it from all Linodes. After this, it will automatically be deleted within a short timeframe.

- **Network Helper is required for automatic configuration.** If [Network Helper](/docs/guides/network-helper/) has been disabled, the Linode will not *automatically* be able to communicate over the VLAN’s private network. In this case, advanced users can manually adjust their Linode’s internal network configuration files with the appropriate settings for their VLAN. See [Manually configuring a VLAN on a Linode](/docs/products/networking/vlans/guides/manually-configuring-a-vlan/) for instructions.

- **The Public Internet must always use the eth0 network interface.** While VLANs themselves can function without issue on the `eth0` interface, the public internet on Linode will not be networked correctly on other interfaces.
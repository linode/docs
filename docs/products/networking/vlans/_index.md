---
title: Virtual LANs
linkTitle: VLANs
description: "Linode Virutal LANs enable secure and private communication across Linodes within the same data center region. This free service is a great way to keep your cloud workloads secure. Virtual LANs are easy to create using the Linode Cloud Manager, API, and CLI."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-10-22
    product_description: "Linode’s Virtual Local Area Networks (LANs) feature allows you to create private L2 networks in the cloud where Linodes can communicate privately and securely. Two or more Linodes connected via the Virtual LAN can see each other as if they were directly connected to the same physical Ethernet network."
---
{{< content "vlans-beta-note-shortguide" >}}

## Availability

Toronto, Canada; Mumbai, India; Sydney, Australia; Atlanata, GA, USA;

## Features

### Secure and Private Communication

Create a private L2 network and attach your Linodes to it for secure and private communication in the cloud. Two or more Linodes connected via the Private Virtual LAN can see each other as if they were directly connected to the same physical Ethernet network. Devices outside of the network cannot see any traffic within the private network.

### Simple Configuration

Use the Beta Cloud Manager to create a Virtual LAN and attach Linode's to it in just a few clicks. Create up to 10 Virtual LANs per data center, and apply up to 3 Virtual LANs to a single Linode. For more fine-grained control, use the Linode APIv4 or Linode CLI.

### Reduce Network Transfer Costs

Private network transfer is free. Any communication between Linodes over the private Virtual LAN does not count against your monthly [network transfer quota](/docs/guides/network-transfer-quota/).

## Limitations

* A Linode can only be attached to a Virtual LAN that resides within the same data center region as the Linode.

* If a Linode is attached to a Virtual LAN and you wish to migrate the Linode to a different data center region, ensure that the new data center region offers the Virtual LAN service. See the [Availability](#availability) section for details.

    Once the Linode's data center migration is initiated, the Linode is automatically detached from its Virutal LAN. When the migration is complete, you must attach the migrated Linode to a Virtual LAN that resides within the Linode's new data center region.

## Pricing

Virtual LANs are free to use. Communication across your private network does not count against your monthly [network transfer quota](/docs/guides/network-transfer-quota/).

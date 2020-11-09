---
slug: how-to-create-a-private-network-with-linode-vlans-api
author:
  name: Linode Community
  email: docs@linode.com
description: 'Linode''s Private Local Area Network (LAN) allows you to create networks in the cloud where multiple Linodes can communicate privately and securely. This guide demonstrates how to use the Linode APIv4 to create a LAN and attach new and existing Linodes to it.'
og_description: 'Linode''s Private Local Area Network (LAN) allows you to create networks in the cloud where multiple Linodes can communicate privately and securely. This guide demonstrates how to use the Linode APIv4 to create a LAN and attach new and existing Linodes to it.'
keywords: ['networking','lan','private network','secure communication']
tags: ["security", "networking", "linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-08-17
modified_by:
  name: Linode
title: "Creating a Private Network Using Linode APIv4 and Linode VLAN"
h1_title: "How to Create a Private Network Using Linode APIv4 and Linode VLAN"
contributor:
  name: Linode
---

## What is a Private Local Area Network?

Linode’s Virtual Local Area Network (Virtual LAN or VLAN) service allows you to create private L2 networks in the cloud where Linodes can communicate privately and securely. Two or more Linodes connected via the VLAN can see each other as if they were directly connected to the same physical Ethernet network. This network supports all the logical Ethernet features like L2 broadcast and L2 multicast. Devices outside the network cannot see any traffic within the private network.

### Network Interfaces

Linodes are connected to private and public networks via their network interfaces. A single Linode can be connected to:

 - both a private and a public network via a private and a public interface. In this case, the Linode has public IPv4 and IPv6 addresses that it can use to communicate over a public network and a private IPv4 and/or IPv6 address that it can use to communicate over a VLAN's private network.

 - a VLAN's private network via a private interface. In this case, the Linode has a private IPv4 and/or IPv6 address address that it can use to communicate over the LAN.

 - a public network via a Public Interface. In this case, the Linode is assigned public IPv4 and IPv6 addresses. This describes a Linode's default network interface configuration when it is first deployed.

{{< note >}}
When you attach a Linode to a Virtual LAN and reboot the Linode, [Network Helper](/docs/guides/network-helper/#what-is-network-helper) generates network configurations for a public network interface and a private network interface.
{{</ note >}}

Refer to the [Common Use Cases for Linode LAN](/docs/guides/platform/vlan/common-linode-vlan-use-cases) guide to view diagrams demonstrating example scenarios using the network interface configurations described above.

### Limitations

- Linode VLAN is currently in Beta. In order to use this feature, you must sign up through our [Green Light Beta Program](https://www.linode.com/green-light/).

- Linode VLAN is available in Next Generation Network (NGN) [data centers](https://www.linode.com/global-infrastructure/). This includes Toronto (`ca-central`), Mumbai (`ap-west`), and Sydney (`ap-southeast`).

- You can create up to 10 VLANs within each data center region.

- You can assign up to 3 network interfaces per Linode.

  - Only 1 public network interface is allowed per Linode.

## In this Guide
This guide shows you how to use [Linode's API v4](https://developers.linode.com/api/v4) to create a VLAN, attach a Linode to the VLAN, and configure a Linode to communicate over the VLAN's private network.

You can attach a Linode to a VLAN in three different ways using the Linode API v4:

- Send a request to the [VLAN Create]((/docs/api/networking/#vlan-create)) endpoint with an array of Linodes to attach to the VLAN you are creating. See the [Create a VLAN with an Attached Linode](#create-a-vlan-with-an-attached-linode) section for details.

- Send a request to the [Linode Create](/docs/api/linode-instances/#linode-create) endpoint. The request must include the `interfaces` parameter to assign a private network interface that is attached to an existing VLAN. See the [Attach an Existing Linode to a VLAN](#create-a-linode-attached-to-a-vlan) section for details.

- Send a request to the [VLAN Attach](/docs/api/networking/#vlan-attach) endpoint with an array of Linodes to attach to an existing VLAN. See the [Attach an Existing Linode to an Existing VLAN](#attach-an-existing-linode-to-an-existing-vlan) section for details.

The steps in this guide can be adopted to create your own private network for your specific use case.

## Create a Private Network
### Create a VLAN with an Attached Linode

In this section, you create a VLAN using the APIv4's Networking endpoints. In the example, when creating the VLAN, you also attach an existing Linode to the VLAN using the `linodes` parameter. See the [VLAN Create](/docs/api/networking/#vlan-create) endpoint's documentation for more details on each available parameter.

{{< note >}}
A Linode can only be attached to a VLAN that resides within the same data center region as the Linode.
{{</ note >}}

1. To create a VLAN, send a POST request to the `/networking/vlans` endpoint. Replace the values for `description`, `cidr_block`, `region`, and `linodes` with your own.

    {{< note >}}
The `cidr_block` parameter allows for simple IP Address Management (IPAM) for this VLAN. If specified, new Interfaces associated with this LAN are assigned a private IPv4 address from within the `cidr_block` range.
    {{</ note >}}

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
              "description": "My example LAN",
              "region": "ca-central",
              "cidr_block": "10.0.0.0/24",
              "linodes": [
                  789,
                  456
              ]
            }' \
            https://api.linode.com/v4beta/networking/vlans

    {{< note >}}
You can create a VLAN without attaching a Linode to it by omitting the `linodes` array from your request. Use the [VLAN Attach](/docs/api/networking/#vlan-attach) endpoint to attach a Linode to an existing VLAN.
{{</ note >}}

    The API returns the following response:

    {{< output >}}
{
  "id": 1234,
  "description": "My example VLAN",
  "region": "ca-central",
  "cidr_block": "10.0.0.0/24",
  "linodes": [
      {
        "id": 789,
        "ipv4_address": "10.0.0.1/24",
        "mac_address": "ba:c2:6e:8d:14:3e"
      },
      {
        "id": 456,
        "ipv4_address": "10.0.0.2/24",
        "mac_address": "ba:c2:6e:8d:14:71"
      }
  ],
}
  {{</ output >}}

    Your VLAN is created and any Linode's ID that is included in the `linodes` parameter is attached to the VLAN.

1. **Reboot the Linode(s)** in order to apply the new network interfaces to a Linode's [Configuration Profile(s)](/docs/api/linode-instances/#configuration-profiles-list) and have access to their public and private network interfaces.  Replace `{linodeId}` with your own Linode’s ID number. Repeat this step for all the Linodes attached to your VLAN.

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST \
            https://api.linode.com/v4/linode/instances/{linodeId}/reboot

    {{< note >}}
When you attach a Linode to a VLAN and reboot the Linode, [Network Helper](/docs/guides/network-helper/#what-is-network-helper) generates network configurations for a public network interface and a private network interface.

If your Linode does not have Network Helper enabled, you can add the public and/or private network interfaces using the [Interface Create](/docs/api/linode-instances/#interface-create) endpoint. You can also use the Interface Create endpoint for finer-grained control over your Linode's network interfaces.
    {{</ note >}}

Once your Linode is attached to a VLAN and rebooted, you must configure it so that it can communicate across the VLAN's private network. Based on your Linode's distribution use one of the following guides to complete your Linode's configuration:

- [Configure Your CentOS 8 Linode](/docs/products/networking/vlans/guides/configure-your-linode-centos-8/)
- [Configure Your Ubuntu 20.04 Linode](/docs/products/networking/vlans/guides/configure-your-linode-ubuntu-20-04/)
- [Configure Your Debian 10 Linode](/docs/products/networking/vlans/guides/configure-your-linode-debian-10/)

### Create a Linode Attached to a VLAN

In this section, you use the [Create Linode](https://api.linode.com/v4/linode/instances) endpoint to create a new Linode that is attached to an existing VLAN.

{{< note >}}
A Linode can only be attached to a VLAN that resides within the same data center region as the Linode.
{{</ note >}}

1. Create a new Linode attached to a VLAN. Replace the values for `image`, `root_pass`, `label`, `type`, and `region` with your own preferred values. `vlan_id` is the ID of an [existing VLAN](/docs/api/networking/#vlan-attach) on your account.

    **Linode with Public and Private Network Interfaces**:

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
              "image": "linode/debian10",
              "root_pass": "aComplexP@ssword",
              "interfaces": {
                "eth0": {
                  "type": "default"
                },
                "eth1": {
                  "type": "additional",
                  "vlan_id": 1234
                }
              },
              "label": "linode123",
              "type": "g6-standard-2",
              "region": "ca-central"
            }' \
            https://api.linode.com/v4/linode/instances
     This example creates a Linode with **two Network Interfaces**.

      - The `eth0` Interface (`type: default`) is a public interface. This Interface gives you access to external Networks (like the Internet).
      - The `eth1` Interface (`type: additional`) is a **private** interface and can securely communicate with any other Linode connected to the same VLAN.

     **Linode with a Private Network Interface (no Public Interface)**:

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
              "image": "linode/debian10",
              "root_pass": "aComplexP@ssword",
              "interfaces": {
                "eth0": {
                  "type": "additional",
                  "vlan_id": 1234
                }
              },
              "label": "linode123",
              "type": "g6-standard-2",
              "region": "ca-central"
            }' \
            https://api.linode.com/v4/linode/instances

     This example creates a Linode with **a private network interface (no public interface)**.

      - The `eth0` Interface is a **private** interface and can securely communicate with any other Linode connected to the same VLAN. A network interface of `type: additional` creates a private network interface.

    The API returns the example response.

    {{< output >}}
{
  "id": 4567,
  "label": "my-example-linode",
  "group": "",
  "status": "running",
  "created": "2020-08-07T16:24:52",
  "updated": "2020-08-07T16:24:52",
  "type": "g6-standard-2",
  "ipv4": [
    "192.0.2.0"
  ],
  "ipv6": "c001:d00d::1234",
  "image": "linode/debian10",
  "region": "ca-central",
  "specs": {
    "disk": 81920,
    "memory": 4096,
    "vcpus": 2,
    "gpus": 0,
    "transfer": 4000
  },
  "alerts": {
    "cpu": 180,
    "network_in": 10,
    "network_out": 10,
    "transfer_quota": 80,
    "io": 10000
  },
  "backups": {
    "enabled": false,
    "schedule": {
      "day": null,
      "window": null
    },
    "last_successful": null
  },
  "hypervisor": "kvm",
  "watchdog_enabled": true,
  "tags": []
}
  {{</ output >}}

    The response does not return the `interfaces` object in your POST request. You can send a request to the [Interfaces List](/docs/api/linode-instances/#interfaces-list) endpoint to view the Interfaces assigned to your new Linode.

    {{< note >}}
When you create a Linode with only a private interface, the API creates Public IPv4 and IPv6 addresses, but they are not reachable. For example, if you try to SSH into the Linode using the Public IPv4 address, you are denied access. However, you can access a Linode using the [Linode Shell (LISH)](/docs/platform/manager/using-the-linode-shell-lish/).
    {{</ note >}}

    {{< note >}}
When you create a new Linode with network interfaces assigned, the Network Interfaces are added to your Linode's Configuration Profile(s). Send a request to the [List Configuration Profiles](https://developers.linode.com/api/v4/linode-instances-linode-id-configs) to see all Configuration Profiles available for your Linode .
    {{</ note >}}

Once your Linode is attached to a VLAN, you must configure it so that it can communicate across the VLAN's private network. Based on your Linode's distribution use one of the following guides to complete your Linode's configuration:

- [Configure Your CentOS 8 Linode](/docs/products/networking/vlans/guides/configure-your-linode-centos-8/)
- [Configure Your Ubuntu 20.04 Linode](/docs/products/networking/vlans/guides/configure-your-linode-ubuntu-20-04/)
- [Configure Your Debian 10 Linode](/docs/products/networking/vlans/guides/configure-your-linode-debian-10/)

### Attach an Existing Linode to an Existing VLAN

This section shows you how to attach existing Linodes to an existing VLAN using the [VLAN Attach](/docs/api/networking/#vlan-attach) endpoint.

1. Retrieve your VLAN's ID, by sending a request to the [VLANs List](docs/api/networking/#vlans-list) endpoint.

        curl -H "Authorization: Bearer $TOKEN" \
            https://api.linode.com/v4beta/networking/vlans/

    The API returns the example response. In the example, `789` is the VLAN's ID. Do not confuse the VLAN ID with the Linode IDs returned in the `linodes` array.

    {{< output >}}
{
  "data": {
    "cidr_block": "10.0.0.0/24",
    "created": "2020-01-01T00:01:01",
    "description": "My example VLAN",
    "id": 789,
    "linodes": {
      "id": 123,
      "ipv4_address": "10.0.0.1/24",
      "mac_address": "f2:3c:92:8d:bc:00"
    },
    "region": "us-east"
  },
  "page": 1,
  "pages": 1,
  "results": 1
}
    {{</ output >}}

1. Retrieve your Linode's ID, by sending a request to the [VLANs List](docs/api/networking/#vlans-list) endpoint.

        curl -H "Authorization: Bearer $TOKEN" \
            https://api.linode.com/v4/linode/instances

    The API returns the example response:

    {{< output >}}
{
  "data": {
      ...
      "id": 345,
      ...
  },
  "page": 1,
  "pages": 1,
  "results": 1
}
{{</ output >}}

1. Use the VLAN Attach endpoint, along with the Linode ID and VLAN ID you retrieved in the previous steps, to attach your Linode to the VLAN. Replace `345` and `789` with your own Linode ID and VLAN ID, respectively.

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
            "linodes": [
                345
            ]
            }' \
            https://api.linode.com/v4beta/networking/vlans/789/attach

    {{< note >}}
You can attach more than one Linode at a time when sending a request to the VLAN Attach endpoint.
{{</ note >}}

    The API returns the example response:

    {{< output >}}
{
  "cidr_block": "10.0.0.0/24",
  "created": "2020-01-01T00:01:01",
  "description": "My example VLAN",
  "id": 789,
  "linodes": [
      {
        "id": 123,
        "ipv4_address": "10.0.0.1/24",
        "mac_address": "f2:3c:92:8d:bc:00"
      },
      {
        "id": 345,
        "ipv4_address": "10.0.0.2/24",
        "mac_address": "f2:3c:92:8d:bc:3e"
      },
  ],
  "region": "us-east"
}
    {{</ output >}}

Your Linode is now attached to your VLAN. Once your Linode is attached to a VLAN, you must configure it so that it can communicate across the VLAN's private network. Based on your Linode's distribution use one of the following guides to complete your Linode's configuration:

- [Configure Your CentOS 8 Linode](/docs/products/networking/vlans/guides/configure-your-linode-centos-8/)
- [Configure Your Ubuntu 20.04 Linode](/docs/products/networking/vlans/guides/configure-your-linode-ubuntu-20-04/)
- [Configure Your Debian 10 Linode](/docs/products/networking/vlans/guides/configure-your-linode-debian-10/)
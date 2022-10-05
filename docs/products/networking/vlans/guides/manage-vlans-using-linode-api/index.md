---
author:
  name: Linode
  email: docs@linode.com
description: "Want to create your own private networks in the cloud? Here's how you can use the Linode API to do so by attaching new and existing Linodes to VLANs."
keywords: ['linode vlan','linode vlan api']
tags: ["security", "networking", "linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-07
modified_by:
  name: Linode
title: "How to Create a Private Network with VLANs Using Linode's API"
h1_title: "Creating a Private Network with VLANs Using Linode's API"
enable_h1: true
contributor:
  name: Linode
aliases: ['/platform/vlan/how-to-create-a-private-network-with-linode-vlans-api/','/guides/how-to-create-a-private-network-with-linode-vlans-api/','/guides/vlan-api/']
---

This guide shows you how to use [Linode's API](/docs/api) to create and attach a VLAN to a Linode.

You can attach a Linode to a VLAN in three different ways using the Linode API:

- As part of the configuration of a new Linode using the Linode Create ([POST /linodes/instances](/docs/api/linode-instances/#linode-create)) endpoint.
- By creating a new configuration profile for a Linode using the Configuration Profile Create ([POST /linode/instances/{linodeId}/configs](/docs/api/linode-instances/#configuration-profile-create)) endpoint.
- By editing an existing configuration profile of a Linode using the Configuration Profile Update ([/linode/instances/{linodeId}/configs/{configId}](/docs/api/linode-instances/#configuration-profile-update)) endpoint.

The steps in this guide can be adopted to create and use VLANs for your specific use case.

{{< note >}}
When you attach a Linode to a VLAN and reboot the Linode, [Network Helper](/docs/guides/network-helper/) generates network configurations for the specified network interfaces if it is enabled. You can enable Network Helper by default using the Account Settings Update ([PUT /account/settings](/docs/api/account/#account-settings-update)) endpoint. The Linode must be rebooted for any changes within its network interfaces to take effect.
{{< /note >}}

## Configuring VLANs with the Interfaces Array

VLANs are managed by the `interfaces` array of a Linode's configuration profile. The `interfaces` array consists of up to three network interface objects which correspond to the *eth0*, *eth1*, and *eth2* interfaces according to their position in the array as follows:

| Array Order | Array Index | Interface | Example Interface Object |
| ----------- | ----------- | --------- | --------- |
| First       | 0           | eth0      | `{"purpose":"public"}` |
| Second      | 1           | eth1      | `{"purpose":"vlan", "label":"vlan-1", "ipam_address":"10.0.0.1/24"}` |
| Third       | 2           | eth2      | `{"purpose":"vlan", "label":"vlan-2", "ipam_address":"10.0.0.2/24"}` |

{{< note >}}
If no `interfaces` array is submitted with a request, the Linode is automatically configured with its assigned public and private IPv4 addresses only.
{{< /note >}}

### Configuring the Purpose of an Interface

The `purpose` of a network interface is required and used to determine whether an interface provides access to either the public internet or a VLAN:

- `public`: Configures a network interface for the public internet and enables the public (and private) IP address(es) for that Linode. If no network interface is configured as `public`, the Linode will not be able to access the internet or other Linodes within the data center's main private network.

- `vlan`: Configures a network interface for the labeled VLAN and enables the Linode to communicate over the `ipam_address` if one is specified.

{{< caution >}}
The Public Internet must always be set to use the network interface `eth0`.
{{< /caution >}}

### Configuring the Label of an Interface

When configuring a `vlan` purpose network interface, a VLAN can be selected by specifying its `label`. Linodes that are attached to the same VLAN can privately communicate with each other over their respective `vlan` purpose interfaces.

If the `label` doesn't correspond with an existing VLAN, a new VLAN is created. VLANs that already exist on an account can be viewed, along with their region and attached Linodes, using the VLANs List ([GET /network/vlans](/docs/api/networking/#vlans-list)) endpoint.

{{< note >}}
No `label` is specified for `public` purpose interfaces. You can simply omit the property, or enter an empty string or `null`.
{{< /note >}}

### Configuring the IPAM Address of an Interface

IPAM (IP Address Management) is the system that allows users to assign and manage IP addresses for each VLAN configured on a Linode. When attaching a `vlan` purpose interface to a Linode, the `ipam_address` can be specified in address/netmask format. This should be a unique IP address that doesn't already exist within the VLAN or on the public internet. It is common to use an address within the 10.0.0.0/8 range (10.0.0.0 – 10.255.255.255). For example, here are typical IPAM addresses for two Linodes connected to the same VLAN:

- Linode 1: `10.0.0.1/24`
- Linode 2: `10.0.0.2/24`

Just like public and private IP addresses, IPAM addresses for a VLAN are automatically configured on a Linode through [Network Helper](/docs/guides/network-helper/). If Network Helper is disabled or if no `ipam_address` is provided, the Linode will not automatically be able to communicate over the VLAN. In some cases, advanced users may disable Network Helper or refrain from providing an `ipam_address`. When doing so, the Linode's internal network configuration files must be manually adjusted with the desired settings.

{{< note >}}
No `ipam_address` is specified for `public` purpose interfaces. You can simply omit the property, enter an empty string, or enter `null`.
{{< /note >}}

{{< note >}}
IPAM addresses for a Linode must be unique among its interfaces.
{{< /note >}}

### Example Interfaces Array

To illustrate each of the above configurations, the following `interfaces` array configures a Linode's assigned public (and private) IP address(es) configured on eth0, the IPAM address `10.0.0.1/24` for the VLAN labeled `vlan-1` configured on eth1, and the IPAM address `10.0.0.2/24` for the VLAN labeled `vlan-2` configured on eth2:

    "interfaces": [
      {
        "purpose": "public"
      },
      {
        "purpose": "vlan",
        "label": "vlan-1",
        "ipam_address": "10.0.0.1/24"
      },
      {
        "purpose": "vlan",
        "label": "vlan-2",
        "ipam_address": "10.0.0.2/24"
      }
    ]

## Attaching a VLAN to a New Linode

To attach a VLAN to a new Linode, send a request to the Linode Create ([POST /linodes/instances](/docs/api/linode-instances/#linode-create)) endpoint containing an `interfaces` array that includes a `vlan` purpose interface with the VLAN's `label` and the desired `ipam_address`.

The following request creates a 1GB Linode utilizing the example `interfaces` array from [above](#example-interfaces-array):

    curl -k -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -X POST -d '{
        "type": "g6-nanode-1",
        "region": "us-southeast",
        "image": "linode/debian10",
        "root_pass": "pl34s3us34s3cur3p4ssw0rd",
        "interfaces": [
          {
            "purpose": "public"
          },
          {
            "purpose": "vlan",
            "label": "vlan-1",
            "ipam_address": "10.0.0.1/24"
          },
          {
            "purpose": "vlan",
            "label": "vlan-2",
            "ipam_address": "10.0.0.2/24"
          }
        ]
      }' \
      https://api.linode.com/v4/linode/instances

{{< note >}}
An `image` must be specified to set interfaces when creating a new Linode.
{{< /note >}}

## Attaching a VLAN to an Existing Linode

You can attach a VLAN to an existing Linode by either creating a new configuration profile or updating an existing configuration profile for the Linode. In either case, the Linode must be rebooted to allow Network Helper to automatically adjust the necessary network configuration files on the Linode.

The Linode's ID is required to utilize these methods. Use the Linodes List ([GET /linode/instances](/docs/api/linode-instances/#linodes-list)) endpoint to retrieve the IDs of each of your Linodes. To view the Disk IDs of a Linode, use the Disks List ([GET /linode/instances/{linodeId}/disks](/docs/api/linode-instances/#disks-list)) endpoint.

### Creating a Configuration Profile

1.  To attach a VLAN to an existing Linode using a new configuration profile, send a request to the Configuration Profile Create ([POST /instances/{linodeId}/configs](/docs/api/linode-instances/#configuration-profile-create)) endpoint containing an `interfaces` array that includes a `vlan` purpose interface with the VLAN's `label` and the desired `ipam_address`.

    The following request creates a configuration profile utilizing the example `interfaces` array from [above](#example-interfaces-array):

        curl -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -X POST -d '{
            "label": "Example VLAN Config",
            "devices": {
              "sda": {
                "disk_id": 111,
                "volume_id": null
              },
              "sdb": {
                "disk_id": 222,
                "volume_id": null
              }
            },
            "interfaces": [
              {
                "purpose": "public"
              },
              {
                "purpose": "vlan",
                "label": "vlan-1",
                "ipam_address": "10.0.0.1/24"
              },
              {
                "purpose": "vlan",
                "label": "vlan-2",
                "ipam_address": "10.0.0.2/24"
              }
            ]
          }' \
          https://api.linode.com/v4/linode/instances/123/configs

    Note the new Configuration Profile's ID from the response.

1.  Reboot your Linode with the new Configuration Profile's ID using the Linode Reboot ([POST /linode/instances/{linodeId}/reboot](/docs/api/linode-instances/#linode-reboot)) endpoint.

        curl -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -X POST -d '{
            "config_id": 23456
          }' \
          https://api.linode.com/v4/linode/instances/123/reboot

### Updating a Configuration Profile

1.  To attach a VLAN to an existing Linode using an existing configuration profile, first retrieve the Configuration Profile's ID using the Configuration Profiles List ([GET /linode/instances/{linodeId}/configs](/docs/api/linode-instances/#configuration-profiles-list)) endpoint.

        curl -H "Authorization: Bearer $TOKEN" \
          https://api.linode.com/v4/linode/instances/123/configs

1.  Using the Linode's current Configuration Profile ID, send a request to the Configuration Profile Update ([PUT /linode/instances/{linodeId}/configs/{configId}](/docs/api/linode-instances/#configuration-profile-update)) endpoint containing an `interfaces` array that includes a `vlan` purpose interface with the VLAN's `label` and the desired `ipam_address`.

    The following request updates a configuration profile utilizing the example `interfaces` array from [above](#example-interfaces-array):

        curl -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -X PUT -d '{
            "interfaces": [
              {
                "purpose": "public"
              },
              {
                "purpose": "vlan",
                "label": "vlan-1",
                "ipam_address": "10.0.0.1/24"
              },
              {
                "purpose": "vlan",
                "label": "vlan-2",
                "ipam_address": "10.0.0.2/24"
              }
            ]
          }' \
          https://api.linode.com/v4/linode/instances/123/configs/23456

    {{< note >}}
When updating a Configuration Profile's `interfaces` array, the previous interface configurations are overwritten. Any interfaces you wish to keep attached to a Linode must be redefined when updating its Configuration Profile.
{{< /note >}}

1.  Reboot your Linode with the new Configuration Profile's ID using the Linode Reboot ([POST /linode/instances/{linodeId}/reboot](/docs/api/linode-instances/#linode-reboot)) endpoint.

        curl -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -X POST -d '{
            "config_id": 23456
          }' \
          https://api.linode.com/v4/linode/instances/123/reboot
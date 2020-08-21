---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Linode''s Private Local Area Network (LAN) allows you to create networks in the cloud where multiple Linodes can communicate privately and securely. This guide demonstrates how to use the Linode APIv4 to create a LAN and attach new and existing Linodes to it.'
og_description: 'Linode''s Private Local Area Network (LAN) allows you to create networks in the cloud where multiple Linodes can communicate privately and securely. This guide demonstrates how to use the Linode APIv4 to create a LAN and attach new and existing Linodes to it.'
keywords: ['networking','lan','private network','secure communication']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-08-17
modified_by:
  name: Linode
title: "Creating a Private Local Area Network (LAN) Using the Linode APIv4"
h1_title: "How to Create a Private Local Area Network (LAN) Using the Linode APIv4"
contributor:
  name: Linode
---

## What is a Private Local Area Network?

Linode’s Private Local Area Network (LAN) feature allows you to create private L2 networks in the cloud where Linodes can communicate privately and securely. Two or more Linodes connected via the Private LAN can see each other as if they were directly connected to the same physical Ethernet network. This network supports all the logical Ethernet features like L2 broadcast and L2 multicast. Devices outside the network cannot see any traffic within the private network.

### Limitations

- Linode Private LAN is currently in a closed Beta. In order to use this feature, you must sign up through our [Green Light Beta Program](https://www.linode.com/green-light/).

- Linode Private LAN is available in Next Generation Network (NGN) [data centers](https://www.linode.com/global-infrastructure/). This includes Toronto (`ca-central`), Mumbai (`ap-west`), and Sydney (`ap-southeast`).

- You can create up to 10 LANs within each data center region.

- You can assign up to 3 Network Interfaces per Linode.

  - Only 1 public Network Interface is allowed per Linode.

### Network Interfaces

Linodes are connected to Private and Public Networks via their Network Interfaces. A single Linode can be connected to:

 - both a Private and a Public Network via a Private and a Public Interface. In this case, the Linode has public IPv4 and IPv6 addresses and a private IPv4 address that it can use to communicate over the LAN.

 - a Private LAN via a Private Interface. In this case, the Linode has a private IPv4 address that it can use to communicate over the LAN.

 - a Public Network via a Public Interface. In this case, the Linode has public IPv4 and IPv6 addresses. This describes a Linode's default Network Interface configurations when it is first deployed.

Refer to the [Common Use Cases for Linode LAN](/docs/networking/vlan/common-linode-vlan-use-cases/) guide to view graphics demonstrating example scenarios using the Network Interface configurations described above.

## In this Guide
This guide shows you how to use [Linode's APIv4](https://developers.linode.com/api/v4) to create a Private LAN, attach a Linode to the LAN, and configure a Linode to communicate over the LAN. The steps in this guide can be adopted to create your own Private LAN for your specific use case.

## Create a Private Network
### Create a LAN

In this section, you create a LAN using the APIv4's Networking endpoints. In the examples, when creating the LAN, you do not make use of all available endpoint parameters. To view all available parameters, see the APIv4 reference’s Create LANs documentation. Before attaching a Linode to a LAN, the LAN must exist.

1. To create a LAN, send a POST request to the `/networking/vlans` endpoint. Replace the values for `description` and `cidr_block` with your own.

    {{< note >}}
The `cidr_block` parameter allows for simple IP Address Management (IPAM) for this LAN. If specified, new Interfaces associated with this LAN are assigned a private IPv4 address from within the `cidr_block` range.
    {{</ note >}}

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
              "description": "My example LAN",
              "region": "ca-central",
              "cidr_block": "10.0.0.0/24"
            }' \
            https://api.linode.com/v4beta/networking/vlans

    The API returns the following response:

    {{< output >}}
{
  "id": 1234,
  "description": "My example VLAN",
  "region": "ca-central",
  "linodes": [],
  "cidr_block": "10.0.0.0/24"
}
  {{</ output >}}

    Make a note of the LAN ID returned in the response. You need this value when attaching a Linode to the LAN.

    {{< note >}}
For easy reuse, you can store the VLAN ID in an environment variable to reference later.

    export VLAN_ID='1234'
  {{</ note >}}

### Create a Linode Attached to a LAN

After creating a LAN, you can begin assigning Linodes to it. In this section, you use the [Create Linode](https://api.linode.com/v4/linode/instances) endpoint to create a new Linode that is attached to the VLAN you created in the previous section.

{{< note >}}
Your Linode must exist in the same data center region as the LAN you created in the previous section.
{{</ note >}}

1. Create a new Linode attached to a LAN.

    > **Linode with Public and Private Network Interfaces**:
    >
        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
              "image": "linode/debian10",
              "root_pass": "aComplexP@ssword",
              "interfaces": {
                "eth0": {
                  “type”: “default”
                },
                "eth1”: {
                  "type": "additional",
                  "vlan_id": 1234
                }
              },
              "label": "linode123",
              "type": "g6-standard-2",
              "region": "ca-central"
            }' \
            https://api.linode.com/v4/linode/instances

    > This example creates a Linode with **two Network Interfaces**.
     >
     > - The `eth0` Interface is a **Public** Interface. This Interface gives you access to external Networks (like the Internet). A Network Interface of `type: default` creates a Public Network Interface.
     > - The `eth1` Interface is a **Private** Interface and can securely communicate with any other Linode connected to the same LAN.  A Network Interface of `type: additional` creates a Private Network Interface.

    > **Linode with a Private Network Interface (no Public Interface)**:
    >
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

    > This example creates a Linode with **a Private Network Interface (no Public Interface)**.
     >
     > - The `eth0` Interface is a **Private** Interface and can securely communicate with any other Linode connected to the same LAN.  A Network Interface of `type: additional` creates a Private Network Interface.


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

    The response does not return the `interfaces` object. You can send a request to the Interfaces collection to view the Interfaces assigned to your new Linode. Ensure you make note of your Linode's `id`. It is required in the next step.

    {{< note >}}
When you create a Linode with only a Private Interface, the API creates Public IPv4 and IPv6 addresses, but they are not reachable. For example, if you try to SSH into the Linode using the Public IPv4 address, you are denied access.
    {{</ note >}}

    {{< note >}}
When you create a new Linode with Network Interfaces assigned, the Network Interfaces are added to your Linode's Configuration Profile. Send a request to the [List Configuration Profiles](https://developers.linode.com/api/v4/linode-instances-linode-id-configs) to see all Configuration Profiles available for your Linode .
    {{</ note >}}

1. List your Linode's Network Interfaces using the List Interfaces endpoint. This endpoint displays all Network Interfaces attached to a specific Linode. You need your Linode's ID to send a request to this endpoint. Replace `{linodeId}` with your own Linode's `id`.

        curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4beta/linode/instances/{linodeId}/interfaces/


    The API returns the following response:

    > **Linode with Public and Private Network Interfaces**:
    >
    {{< output >}}
{
  "data": [
    {
      "id": 177,
      "type": "default",
      "description": "Public",
      "linode_id": 4567,
      "vlan_id": 0,
      "mac_address": "f2:3c:92:8d:93:79",
      "ip_address": ""
    },
    {
      "id": 178,
      "type": "additional",
      "description": "VLAN interface",
      "linode_id": 4567,
      "vlan_id": 1234,
      "mac_address": "ba:c2:6d:8d:93:79",
      "ip_address": "10.0.0.1"
    }
  ],
  "page": 1,
  "pages": 1,
  "results": 1
}
    {{</ output >}}

    > The response displays two Network Interfaces, each with their own Interface ID.
    >
    > -  A Network Interface's `ip_address` field display a **private** IP address. This means that your Public Interface of `"type": "default"` does not display a value for `ip_address`, since it does not have an assigned private IP address. You can find your Linode's public IP address using the [View Linode](https://developers.linode.com//api/v4/linode-instances-linode-id) endpoint.
    > - The Private Network Interface's IP address (`"ip_address": "10.0.0.1"`) is within the CIDR block subnet designated when you created the LAN.

    > **Linode with a Private Network Interface (no Public Interface)**:
    >
    {{< output >}}
{
  "data": [
    {
      "id": 178,
      "type": "additional",
      "description": "VLAN interface",
      "linode_id": 4567,
      "vlan_id": 1234,
      "mac_address": "ba:c2:6d:8d:93:79",
      "ip_address": "10.0.0.1"
    }
  ],
  "page": 1,
  "pages": 1,
  "results": 1
}
    {{</ output >}}

    > The response displays a Private Network Interface.
    >
    > - The Private Network Interface's IP address (`"ip_address": "10.0.0.1"`) is within the CIDR Block subnet designated when you created the VLAN.

You can now move on to the [Configure your Linode(s) to use Your Private Network](#configure-your-linode-s-to-use-your-private-network) section of the guide. Your Linodes are not able to communicate with each other via the LAN until the steps in that section are completed.

### Attach an Existing Linode to a LAN

Once you have created your LAN, you can attach existing Linodes to it. To attach an existing Linode to a LAN you must create the Network Interface(s) needed by your Linode to communicate over the LAN, update your Linode's Configuration Profile with the Network Interface(s), and then, configure your Linode to communicate over the LAN.

{{< note >}}
When you create a Linode, Network Helper creates your Linode's Network Interfaces for you and no further intervention is need in order to communicate with an External Network using your Linode's Public IP addresses. When attaching a Linode to a Private LAN, however, you must create Interface objects, add them to your Linode's boot Configuration Profile, and configure your Linode to communicate over those Network Interfaces.
{{</ note >}}

{{< note >}}
Before completing the steps in this section, ensure you:

- have [created a LAN](0#create-a-vlan).
- know the ID number of your existing Linode. You can find its ID number by sending a request to the [List Linodes](https://developers.linode.com/api/v4/linode-instances) endpoint.
{{</ note >}}

#### Create a Network Interface

In this section, you use the Create Interface endpoint to create Network Interfaces for your existing Linode. In the examples, when creating Interfaces, you do not make use of all available endpoint parameters. To view all available parameters, see the APIv4 reference's Create Interface documentation.

{{< note >}}
If you do not want your existing Linode to have access a Public Network, you **do not** need to create a **Public Network Interface**.
{{</ note >}}

1. Create the required Network Interfaces for your Linode by sending a POST request to the Interfaces endpoint.

    > **Public Network Interface**:
    >
    > Replace `{linodeId}` with your own Linode's ID number.
    >
         curl -H "Content-Type: application/json" \
              -H "Authorization: Bearer $TOKEN" \
              -X POST -d '{
                "type": "default"
              }' \
              https://api.linode.com/v4beta/linode/instances/{linodeId}/interfaces

    > An Interface of `"type": "default"` creates a Public Network Interface.
    >
    > The response returns the following:
    >
    {{< output >}}
{
    "id": 115,
    "type": "default",
    "name": "Public",
    "linode_id": 989,
    "vlan_id": 0,
    "mac_address": "f2:3c:92:8d:bc:43",
    "ip_address": ""
}
    {{</ output >}}

    > Ensure you make note of the Interface's `id`. You need it in the [Update your Linode's Configuration Profile](#update-your-linode-s-configuration-profile) section.

    > **Private Network Interface**:
    >
    > Replace the value of `"vlan_id"` with your own VLAN ID number and `{linodeId}` with your own Linode's ID number.
    >
        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
              "type": "additional",
              "vlan_id": 1234
            }' \
            https://api.linode.com/v4beta/linode/instances/{linodeId}/interfaces

    > An Interface of `"type": "additional"` creates a Private Network Interface.
    >
    > The response returns the following:
    >
    {{< output >}}
{
    "id": 116,
    "type": "additional",
    "name": "VLAN interface",
    "linode_id": 989,
    "vlan_id": 1234,
    "mac_address": "ba:c2:6d:8d:bc:43",
    "ip_address": "10.0.0.2"
}
    {{</ output >}}

    > Ensure you make note of the Inteface's `id`. You need it in the [Update your Linode's Configuration Profile](#update-your-linode-s-configuration-profile) section.

#### Update your Linode's Configuration Profile

You can now update your Linode's Configuration Profile with the Interfaces you created in the previous section. You use the [Update Configuration Profile](https://developers.linode.com/api/v4/linode-instances-linode-id-configs-config-id/#put) endpoint to complete this.


1. Find your Linode's Configuration Profile ID by sending a GET request to the [List Configuration Profiles](https://developers.linode.com/api/v4/linode-instances-linode-id-configs) endpoint. Replace `{linode_Id}` with your own Linode's ID.

        curl -H "Authorization: Bearer $TOKEN" \
          https://api.linode.com/v4/linode/instances/{linodeId}/configs

    The response resembles the example. If your Linode has multiple Configuration Profiles, ensure you make note of the Linode's **Boot** Configuration Profile `id`. That is the value you need in the next step.

    {{< output >}}
    {
  "data": [
    {
      "id": 34567,
      "label": "My Debian 10 Disk Profile",
      ...
    }
  ],
  "page": 1,
  "pages": 1,
  "results": 1
}
    {{</ output >}}

1. Update your Linode's Boot Configuration Profile with your Network Interface(s) by sending a PUT request to the [Update Configuration Profile](https://developers.linode.com/api/v4/linode-instances-linode-id-configs-config-id/#put) endpoint.

    > **Linode with Public and Private Network Interfaces**:
    >
    > Replace `{linodeId}` with your own Linode’s ID number and `{configId}` with your Linode's Boot Configuration Profile ID.
    >
        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
              "interfaces": {
                "eth0": {
                    "id": 115
                  },
                "eth1": {
                  "id": 116
                  }
                }
            }' \
            https://api.linode.com/v4beta/linode/instances/{linodeId}/configs/{configId}

    > **Linode with a Private Network Interfaces (no Public Network Interface)**:
    >
    > Replace `{linodeId}` with your own Linode’s ID number and `{configId}` with your Linode's Boot Configuration Profile ID.
    >
        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
              "interfaces": {
                "eth0": {
                    "id": 116
                  }
                }
            }' \
            https://api.linode.com/v4beta/linode/instances/{linodeId}/configs/{configId}

1. Reboot your Linode. Replace `{linodeId}` with your own Linode’s ID number

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST \
            https://api.linode.com/v4/linode/instances/{linodeId}/reboot

1. View your Linode's Boot Configuration Profile to verify that the Interfaces have been applied. Replace `{linodeId}` with your own Linode’s ID number and `{configId}` with your Linode's Boot Configuration Profile ID.

        curl -H "Authorization: Bearer $TOKEN" \
          https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}

1. Complete the steps in the [Configure your Linode(s) to Use Your Private Network](#configure-your-linode-s-to-use-your-private-network) section to finish the required configurations. Your Linodes are not able to communicate with each other via the LAN until the steps in that section are completed.

## Configure your Linode(s) to Use Your Private Network

[Linode Network Helper](/docs/platform/network-helper/) is in charge of automatically configuring your **Public** Network Interface, however, you need to **manually** configure your **Private** Network Interfaces. Follow the steps outlined in this section for each Linode that you want to connect to your LAN.

### Configure a Linode with Public and Private Interfaces

The steps in this section cover configuring Network Interfaces for Linodes that have a Public Network Interface and a Private Network Interface that is attached to a LAN.

1. Connect to your Linode via SSH.

        ssh username@192.0.2.0

1. View your Linode's current Network Interfaces by issuing the following command:

        ip l

    Your output displays your Linode's Network Interfaces:

    {{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000
    link/ether f2:3c:92:8d:13:00 brd ff:ff:ff:ff:ff:ff
3: eth1: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether ba:c2:6d:8d:13:00 brd ff:ff:ff:ff:ff:ff
  {{</ output >}}

1. Using a text editor, create a new Network Interface configuration file (`/etc/network/interfaces.d/eth1`) with a configuration entry for the Linode's `eth1` Private Network Interface along with the Interface's Private IP and subnet mask. The subnet mask that you use is the same as your VLAN's `cidr_block`.

    {{< note >}}
The location of the Network Interface configuration file varies based on the Linux distribution deployed to your Linode. The example below was created using a Debian 10 Linode. See our [Network Helper](/docs/platform/network-helper/#what-files-are-modified) guide for information on where different distributions store Network Interface configuration files.
    {{</ note >}}

      {{< file "/etc/network/interfaces.d/eth1">}}
iface eth1 inet static
    address 10.0.0.1/24
      {{</ file >}}

    {{< note >}}
Send a request to the View LANs endpoint (`GET /networking/vlans`) to view all LANs available on your account along with their details, like Private IP address and CIDR Block.

    curl -H "Authorization: Bearer $TOKEN" \
      https://api.linode.com/v4/networking/vlans
{{</ note >}}

1. Apply the new Network Interface configuration file.

        ifup eth1

1. View the `eth1` Network Interface you just configured.

        ip a show eth1

    Your output displays information about your `eth1` Network Interface:

      {{< output >}}
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether ba:c2:6d:8d:93:79 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.1/24 brd 10.0.0.255 scope global eth1
       valid_lft forever preferred_lft forever
    inet6 fe80::b8c2:6dff:fe8d:9379/64 scope link
       valid_lft forever preferred_lft forever
      {{</ output >}}

1. Repeat steps 1 - 5 for any other Linode that is part of your Private Network and has both a Public and a Private Network Interface.

Now that your Private LAN is configured, move on to the [Test Your Private Network](#test-your-private-network) section to verify that communication is successful between Linodes over the LAN.

### Configure a Linode with a Private Interface

The steps in this section are for a Linode that has a Private Network Interface that is attached to a LAN and does **not** have a Public Network Interface. Linodes under this circumstance are not reachable via SSH and their Public IPv4 address, so you must use the [Linode Shell (Lish)](https://www.linode.com/docs/platform/manager/using-the-linode-shell-lish/) to manually configure its Private Network Interface. Lish provides console access to your Linodes, which allows you to connect to a Linode even when you are unable to connect to it directly via SSH

1. Disable Network Helper for your Linode. This requires you to send a request to the [Update Configuration Profile](https://developers.linode.com/api/v4/linode-instances-linode-id-configs-config-id/#put) endpoint to change the `network` field's value from `true` to `false`. Ensure you replace `{linodeId}` and `{configId}` with your own ID numbers.

    {{< disclosure-note "Retrieve your {linodeId} and {configId}" >}}
Retrieve your `{linodeId}` by sending a request to the [List Linodes](https://developers.linode.com/api/v4/linode-instances) endpoint.

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/linode/instances

Find your `{configId}` by sending a request to the [List Configuration Profiles](https://developers.linode.com/api/v4/linode-instances-linode-id-configs) endpoint. Replace `{linodeId}` with your own Linode's ID.

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/linode/instances/{linodeId}/configs

    {{</ disclosure-note >}}

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
              "helpers": {
                "network": false
              }
            }' \
            https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}

    The API returns a similar response (part of the response is truncated for brevity):

    {{< output >}}
    {
      "id": 4567,
    ...
    "helpers": {
        ...
        "network": false,
        ...
      },
      ...
    }
    {{</ output >}}

1. Reboot your Linode so that your Configuration Profile updates can take effect.

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST \
            https://api.linode.com/v4/linode/instances/{linodeId}/reboot

1. Log into your Linode via Lish following the steps in the [Using the Linode Shell](/docs/platform/manager/using-the-linode-shell-lish/#use-a-terminal-application) guide. Ensure you consult the [Use a Web Browser](/docs/platform/manager/using-the-linode-shell-lish/#use-a-web-browser) and [Add Your Public Key](/docs/platform/manager/using-the-linode-shell-lish/#add-your-public-key) sections for additional methods to connect to Lish.

1. Once you have accessed your Linode via Lish, view your Linode's current Network Interfaces by issuing the following command:

        ip l

    Your output displays your Linode's Network Interfaces:

    {{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether ba:c2:6d:8d:86:e0 brd ff:ff:ff:ff:ff:ff
  {{</ output >}}

1. Using a text editor, create a new Network Interface configuration file (`/etc/network/interfaces.d/eth0`) with a configuration entry for the Linode's `eth0` Private Network Interface along with the Interface's Private IP and subnet mask. The subnet mask that you use is the same as your LAN's `cidr_block`.

    {{< note >}}
The location of the Network Interface configuration file varies based on the Linux distribution deployed to your Linode. The example below was created using a Debian 10 Linode. See our [Network Helper](/docs/platform/network-helper/#what-files-are-modified) guide for information on where different distributions store Network Interface configuration files.
    {{</ note >}}

      {{< file "/etc/network/interfaces.d/eth0">}}
iface eth0 inet static
    address 10.0.0.1/24
      {{</ file >}}

    {{< note >}}
Send a request to the View LANs endpoint (`GET /networking/vlans`) to view all LANs available on your account along with their details, like Private IP address and CIDR Block.

    curl -H "Authorization: Bearer $TOKEN" \
      https://api.linode.com/v4/networking/vlans
{{</ note >}}

1. Enable the `eth0` Network Interface to apply the Private LAN settings you configured in the previous step.

        ifup eth0

1. Disable the `eth0` Network Interface. This is required for the next step in order to remove the `eth0` entry that was created by Network Helper when the Linode was first deployed.

        ifdown eth0

1. Update your Linode's `/etc/network/interfaces` file to **remove** the `eth0` entry created by Network Helper when the Linode was first deployed. Referring to the example, remove or comment out lines 16 - 18.

      {{< file "/etc/network/interfaces">}}
# Generated by Linode Network Helper
...
# /etc/network/interfaces

auto lo
iface lo inet loopback

source /etc/network/interfaces.d/*

auto eth
allow-hotplug eth

iface eth inet6 auto

# Remove this entry
iface eth inet static
    address 192.0.2.0/24
    gateway 192.0.2.0.1
      {{</ file >}}

1. Enable the `eth0` Network Interface to apply the Private LAN settings you configured in step 5.

        ifup eth0

1. View the `eth1` Network Interface you just configured.

        ip a show eth0

    Your output displays information about your `eth1` Network Interface:

      {{< output >}}
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether ba:c2:6d:8d:86:e0 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.6/24 brd 10.0.0.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::b8c2:6dff:fe8d:86e0/64 scope link
       valid_lft forever preferred_lft forever
      {{</ output >}}

Now that your Private LAN is configured, move on to the [Test Your Private Network](#test-your-private-network) section to verify that communication is successful between Linodes over the LAN.

## Test Your Private Network

Once you have created your Private Network, verify that you can communicate from one Linode to another in the Private LAN.

1. Connect to your Linode via SSH, if you have not done so already.

        ssh username@1920.2.0

1. Ping another Linode within the Private VLAN via its Private IP address.

        ping 10.0.0.1

    Your output should display ICMP packets successfully transmitted and received from this Linode to the secondary Linode in the Private Network.

    {{< output >}}
PING 10.0.0.1 (10.0.0.1) 56(84) bytes of data.
64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=0.733 ms
64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=0.294 ms
^C
--- 10.0.0.1 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 18ms
rtt min/avg/max/mdev = 0.294/0.513/0.733/0.220 ms
    {{</ output >}}


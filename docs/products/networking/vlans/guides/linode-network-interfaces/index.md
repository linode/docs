---
author:
  name: Linode
  email: docs@linode.com
title: Linode Network Interfaces
description: "This guide describes public and private networks and how they correspond to the network interfaces configured on a Linode that is attached to a Virutal LAN."
---

## Network Interfaces

Linodes are connected to Private and Public Networks via their Network Interfaces. A Private Network is secure and can only be accessed by Linodes attached to the same Virtual LAN via their Private Network Interface. A Public Network, like the Internet, is not secure and is accessed via a Linode's Public Network Interface. A Linode can be connected to:

 - both a Private and a Public Network via a Private and a Public Network Interface. In this case, the Linode has public IPv4 and IPv6 addresses and a private IPv4 and/or IPv6 address address that it can use to communicate over the Virtual LAN.

 - a Private virtual LAN via a Private Interface. In this case, the Linode has a private IPv4 address that it can use to communicate over the Virtual LAN.

 - a Public Network via a Public Interface. In this case, the Linode has public IPv4 and IPv6 addresses. This describes a Linode's default Network Interface configurations when it is first deployed and not attached to a Virtual LAN.

## What Happens When You Attach a Linode to a Virtual LAN

When you attach a Linode to a Virtual LAN and it is rebooted, by default, the following actions are taken:

- A Public and a Private Network Interface is added to the Linode.

- All Configuration Profiles belonging to the Linode are updated with any new Network Interfaces.

- Entries are created in the configured device slots`eth[0-2]` that are available in the Linode's Network Interface configuration file.

    {{< note >}}
By default, the device slot corresponding to the Private Network Interface is down and you must bring it up in order to communicate over the Virtual LAN.
{{</ note >}}

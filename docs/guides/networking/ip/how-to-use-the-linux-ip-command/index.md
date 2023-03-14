---
slug: how-to-use-the-linux-ip-command
description: 'This guide describes the Linux ip command and how to use it, along with a list of the main options.'
keywords: ['linux ip command','config ip command']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-16
modified_by:
  name: Linode
title: "Use the ip Command in Linux"
title_meta: "How to Use the ip Command in Linux"
external_resources:
- '[Ubuntu 22.04 Man page for the ip command](https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html)'
- '[Internet Protocol Wikipedia page](https://en.wikipedia.org/wiki/Internet_Protocol)'
- '[iproute2 Wikipedia page](https://en.wikipedia.org/wiki/Iproute2)'
authors: ["Jeff Novotny"]
---

The Linux `ip` command is a system tool for network administration, but it has many options and can be complicated. Fortunately, most users find the tool easier to use when they understand its main components. This guide explains how to configure a server using the `ip` command. It demonstrates how to accomplish common networking tasks and how to view the state of the network.

## What is the Linux IP Command?

As its name suggests, the `ip` command relates to the [*Internet Protocol*](https://en.wikipedia.org/wiki/Internet_Protocol) (IP). IP Version 4 (Ipv4) and version 6 (Ipv6) jointly define the framework of the modern internet. The IP protocol describes the addressing system used to identify network interfaces and send and receive traffic.

Hosts and routers use the IP system to direct traffic across the internet to the correct destination. Each network interface on a system has a *media access control* (MAC) address and can be assigned one or more IPv4 or Ipv6 addresses. In addition, each server maintains a routing table. The routing table determines which interface to use when transmitting a packet to a given destination IP address.

The Linux `ip` command lets administrators view the system's IP networking information from the command line. It permits them to configure network interfaces, routing information, and Ipv4/Ipv6 addresses. The `ip` command also includes advanced capabilities to set up IP tunneling, route policies, and configure *Address Resolution Protocol* (ARP) information for the system's neighbors.

The `ip` command is part of the Linux [iproute2](https://en.wikipedia.org/wiki/Iproute2) collection of networking utilities. It replaces the old `ifconfig` command, which had more limited functionality and fewer options. The `ip` package is pre-installed on all modern Linux distributions, including Ubuntu.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## ip Command Concepts

Each of the Linux `ip` commands acts upon one or more *ip objects*. An ip object represents a specific component of the networking system, such as the routing table. Some of the `ip` terminology differs from the way networking concepts are more typically discussed. Here is a list of some of the most important `ip` objects, with the shortcuts in parentheses.

-   **link (l)**: A link represents a network device. Most links, other than the loopback link, connect the server to a wider computer network. A link can be logical/abstract or physical.
-   **route (r)**: This represents an entry in the routing table. It is used to determine how and where to send an outgoing packet based on its address.
-   **address (a)**: This is the Ipv4 or Ipv6 address associated with a link.
-   **maddress (m)**: This is the multicast address, if any, configured on a link.
-   **neighbor (n)**: This represents information about a neighboring interface. It includes cached ARP or Ipv6 *Neighbor Discovery* (NDISC) information.
-   **rule (ru)**: This is a policy rule for routing packets. It controls the precedence of the routes in the routing database.

Other ip objects include `addrlabel`, `l2tp`, `mroute` (for multicast route), `tunnel`, and `xfrm`, which is used by the *Internet Protocol Security* (IPsec) protocol. See the [Ubuntu ip documentation](https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html) for more information about the remaining ip objects.

{{< note respectIndent=false >}}
Some of the objects in the `ip` command do not map perfectly to the terminology used in more casual discussions about networking. For instance, the term link often refers to a connection between two systems. The `link` ip object is usually called an interface. To avoid confusion, use the precise names of the ip objects when discussing the `ip` command.
{{< /note >}}

## ip vs ifconfig

The `ip` command is the newer iteration of the established `ifconfig` command. `ip` also includes functionality from other commands including `route` and `arp`. Thus it has a broader scope and more features than the more limited `ifconfig`.

The `ip` utility features other enhancements. For instance, it displays all interfaces, whereas `ifconfig` only displays enabled interfaces. The `ip` command is also more efficient and interacts with the system in a more seamless manner. An `ip` command always requires an object type such as the address or link identifier, whereas `ifconfig` directly references the interface without an ip object.

The `ip` command can be intimidating at first due to its complexity, so some users might initially feel more comfortable using `ifconfig`. Users can still install `ifconfig` using the `apt install net-tools` command, but this is not recommended. Unfortunately, `ifconfig` might still be used by legacy utilities and applications that have not been updated recently.

## How to Use the ip Command

The `ip` command is straightforward to use, but it includes many complex options. It is not possible to use the `ip` command by itself. One of the "ip objects" must also be included. In other words, there is no way to use the command to display all networking information at once. To configure network settings using the `ip` command, include the following information:

-   The `ip` command name.
-   Zero or more options.
-   The name of the "ip object", for example, `link` or `route`. Each object is associated with an abbreviation. For instance, the link object can be abbreviated as `l`. `ip l show` and `ip link show` both refer to the same command.
-   The command, `show` for example, along with any parameters.

Most `ip` commands follow this format:

```command
ip [options] OBJECT COMMAND
```

Non-root users must use `sudo` to execute any `ip` command that changes the network configuration. The `show` commands are available to all users.

The `ip help` directive describes the command syntax and lists all available options. More specific help is available for each ip object. Use the format `ip OBJECT help`. For example, `ip addr help` provides instructions for the address-related commands.

```command
ip addr help
```

{{< output >}}
Usage: ip address {add|change|replace} IFADDR dev IFNAME [ LIFETIME ]
                                                      [ CONFFLAG-LIST ]
       ip address del IFADDR dev IFNAME [mngtmpaddr]
       ip address {save|flush} [ dev IFNAME ] [ scope SCOPE-ID ]
                            [ to PREFIX ] [ FLAG-LIST ] [ label LABEL ] [up]
       ip address [ show [ dev IFNAME ] [ scope SCOPE-ID ] [ master DEVICE ]
                         [ type TYPE ] [ to PREFIX ] [ FLAG-LIST ]
                         [ label LABEL ] [up] [ vrf NAME ] ]
       ip address {showdump|restore}
IFADDR := PREFIX | ADDR peer PREFIX
          [ broadcast ADDR ] [ anycast ADDR ]
          [ label IFNAME ] [ scope SCOPE-ID ] [ metric METRIC ]
...
{{< /output >}}

Here are some of the more useful `ip` options.

-   **-a**: Processes all objects, provided the command supports the option.
-   **-d**: Adds extra details to the output.
-   **-f**: Specifies the protocol family. Some common families have their own shortcuts. `-4` is a shortcut for IPv4, `-6` denotes IPv6, and `M` indicates MPLS.
-   **-j**: Displays the output in JSON format.
-   **-p**: Presents the output in a more readable format.
-   **-s**: Displays extra statistics, including packets transferred and received. The `-s -s` option displays even more information.
-   **-t**: Includes the timestamp in the output.

For a more thorough explanation of all `ip` options, see the [man page for the ip command](https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html).

Because the `ip` command contains so many options, the following examples focus on some of the more common use cases.

{{< note respectIndent=false >}}
Changes made using the `ip` command are not persistent across a system reboot. To automatically configure networking information, add the information to a startup script. Each distribution also provides a method to make networking changes using its system configuration files.
{{< /note >}}

{{< note type="alert" respectIndent=false >}}
Be very careful when making any changes to the network interfaces, addresses, and routes. It is easy to cut the server off from the main network, necessitating a system reboot. Consider using official test addresses and MAC addresses when trying out new commands.
{{< /note >}}

## Using the Address ip Object

The `addr` object allows users to list the IP addresses associated with each link, including the system address. It is also used to add, modify, and remove addresses.

### How to Find Your IP Address

Use the `addr` ip object to find your IP address. The `ip addr show` command displays the addresses for every link configured on the system. Locate the `eth0` link, which connects the host to the wider network on most systems. The `inet` field displays the Ipv4 address. If an Ipv6 address is configured, it is indicated in the `inet6` section.

```command
ip addr show
```

{{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether f2:3c:93:60:50:30 brd ff:ff:ff:ff:ff:ff
    inet 178.79.148.108/24 brd 178.79.148.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 2a01:7e00::f03c:93ff:fe60:5030/64 scope global dynamic mngtmpaddr noprefixroute
       valid_lft 5155sec preferred_lft 1555sec
    inet6 fe80::f03c:93ff:fe60:5030/64 scope link
       valid_lft forever preferred_lft forever
{{< /output >}}

To display information about one particular link, append the name of the link to the end of the command.

```command
ip addr show eth0
```

The `-br` option simplifies the display to the state and IP addresses.

```command
ip -br addr show
```

{{< output >}}
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0             UP             178.79.148.108/24 2a01:7e00::f03c:93ff:fe60:5030/64 fe80::f03c:93ff:fe60:5030/64
{{< /output >}}

{{< note respectIndent=false >}}
There are other methods for determining the IP address of a system. For more information on how to find the IP address of a system, see the Linode guide [How to understand IP addresses](/docs/guides/how-to-understand-ip-addresses/#how-to-find-your-ip-addresses).
{{< /note >}}

### How to Add or Delete an IP Address

To add an IP address to an existing link/interface, use the `addr add` command. The format for the command is `ip addr add ADDRESS/NETMASK dev LINK_ID`. Separate the IP address and the netmask using the `/` symbol.

The following command demonstrates how to add a new address to the `lo` loopback link. You must use `sudo` when modifying any network information. If the rule already exists, `ip` displays the error message `RTNETLINK answers: File exists`.

```command
sudo ip addr add 127.255.255.255/16 dev lo
```

The `addr show` command reflects the new configuration change.

```command
ip addr show dev lo
```

{{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet 127.255.255.255/16 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
{{< /output >}}

To remove an address from a link, use the `addr delete` command.

```command
sudo ip addr delete 127.255.255.255/16 dev lo
```

To configure the address as a broadcast address, use the keyword `brd`.

```command
sudo ip addr add 172.31.255.255 brd + dev eth1
```

## Using the Link ip Object

The `link` object can access and configure information about the network interfaces on the system. It is used to view the status of a network device, or set the administrative state to up or down.

### How to View Network Interfaces

To view information about all network interfaces on the server, use the `ip link show` command. The command shows the state, MTU, and MAC address for each link `object` amongst other information.

```command
ip link show
```

{{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether f2:3c:93:60:50:30 brd ff:ff:ff:ff:ff:ff
{{< /output >}}

When the `-br` option is added, `ip` only displays the most important information.

```command
ip -br link show
```

{{< output >}}
lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
eth0             UP             f2:3c:93:60:50:30 <BROADCAST,MULTICAST,UP,LOWER_UP>
{{< /output >}}

To only show information about links that are operationally active, append the keyword `up`.

```command
ip link show up
```

### How to View Information about a Specific Network Interface

To limit the display to information about a specific interface, append the name of the information to the `ip link show` command. The following command only displays information about the `eth0` network interface. If the interface does not exist, `ip` returns the error message `Device "INTERFACE" does not exist`.

```command
ip link show eth0
```

{{< output >}}
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether f2:3c:93:60:50:30 brd ff:ff:ff:ff:ff:ff
{{< /output >}}

Add the `-s` option to see the link/interface statistics.

```command
ip -s link show dev eth0
```

{{< output >}}
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether f2:3c:93:60:50:30 brd ff:ff:ff:ff:ff:ff
    RX:  bytes packets errors dropped  missed   mcast
      67487882  470575      0       0       0       0
    TX:  bytes packets errors dropped carrier collsns
     112143192  522462      0       0       0       0
{{< /output >}}

Use the `-s -s` double flag to see even more comprehensive statistics, including information about the various errors.

```command
ip -s -s link show dev eth0
```

{{< output >}}
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether f2:3c:93:60:50:30 brd ff:ff:ff:ff:ff:ff
    RX:  bytes packets errors dropped  missed   mcast
      67589398  471467      0       0       0       0
    RX errors:  length    crc   frame    fifo overrun
                     0      0       0       0       0
    TX:  bytes packets errors dropped carrier collsns
     112345201  523306      0       0       0       0
    TX errors: aborted   fifo  window heartbt transns
                     0      0       0       0       2
{{< /output >}}

### How to Change the Status of a Network Interface

Modify the status of any network interface using the `ip link set` command. Use the keyword `up` to enable an interface and the keyword `down` to disable it.

To disable the `eth1` link, use the following command.

```command
sudo ip link set eth1 down
```

To bring `eth1` back up, enter this command.

```command
sudo ip link set eth1 up
```

Use the following command to set the *maximum transmission unit* (MTU) size for the link.

```command
sudo ip link set mtu 1600 eth1
```

## Using the Route ip Object

The `route` object allows users to view the routing tables. It is also used to add and delete a route.

### How to View Routing Information

To view all routes installed in the routing database, use the `ip route show` command.

{{< note respectIndent=false >}}
Many servers access the internet through a default gateway, resulting in relatively few routes. Even if `ip route show` only displays one or two routes, this does not usually indicate a problem.
{{< /note >}}

```command
ip route show
```

{{< output >}}
default via 178.79.148.1 dev eth0 proto static
178.79.148.0/24 dev eth0 proto kernel scope link src 178.79.148.108
{{< /output >}}

It is also possible to list all routes for a particular network using the `list` command.

```command
ip route list 178.79.148.0/24
```

{{< output >}}
178.79.148.0/24 dev eth0 proto kernel scope link src 178.79.148.108
{{< /output >}}

### Adding and Deleting Routes

To add a new route, use the `ip route add` command. There are two ways to add a route. For the first option, specify the IP address and mask of the remote network, and the interface used to access it. The following example adds a new route to `eth0`.

```command
sudo ip route add 192.168.20.0/24 dev eth0
```

Use the `ip route show` command to confirm the route has been added.

```command
ip route show
```

{{< output >}}
default via 178.79.148.1 dev eth0 proto static
178.79.148.0/24 dev eth0 proto kernel scope link src 178.79.148.108
192.168.20.0/24 dev eth0 scope link
{{< /output >}}

For the second method, use the `via` keyword to specify a gateway. All traffic to the network is routed through the specified address. Replace `178.79.148.1` with your actual IP address from the output above.

```command
sudo ip route add 192.168.20.0/24 via 178.79.148.1
```

To delete a route, use the `ip route delete` command. This command only accepts an IP address.

```command
sudo ip route delete 192.168.20.0/24
```

## Using the Neighbor ip Object

The `neigh` command operates on the ARP and NDISC entries for the server's neighbors. The `neighbor` command displays an address and state for each entry. An entry is `REACHABLE` if it is both valid and reachable, and `PERMANENT` if it never expires. `STALE` entries are valid but unreachable, and entries in the `DELAY` state are not yet validated. The `neigh` command can also edit neighbor information.

### How to View Neighbor Information

To see all the neighbors that the system is aware of, use `ip neigh show`.

```command
ip neigh show
```

{{< output >}}
178.79.148.1 dev eth0 lladdr 00:00:0c:9f:f0:02 REACHABLE
fe80::1 dev eth0 lladdr 00:00:0c:9f:f0:02 router STALE
{{< /output >}}

### How to Add and Delete Neighbor Information

ARP information can be added and removed using `ip neigh add` and `ip neigh delete` commands.

{{< note respectIndent=false >}}
The `delete` command is useful for flushing stale ARP or NDISC information. The `neigh add` command can add a permanent ARP entry between two nodes that are continually communicating and have fixed IP and MAC addresses. However, a static ARP entry can cause problems if the information ever changes. Use caution when adding any entries to these tables.
{{< /note >}}

To add a permanent ARP entry for a neighbor, use the following command. Include the MAC address of the neighbor and the link used to access it. The `perm` keyword installs the route permanently.

```command
sudo ip neigh add 192.168.100.100 lladdr 16:12:34:56:78:90 dev eth0 nud perm
ip neigh show
```

{{< output >}}
178.79.148.1 dev eth0 lladdr 00:00:0c:9f:f0:02 REACHABLE
192.168.100.100 dev eth0 lladdr 16:12:34:56:78:90 PERMANENT
fe80::1 dev eth0 lladdr 00:00:0c:9f:f0:02 router STALE
{{< /output >}}

Use `ip neigh delete`, along with the address and interface, to delete a route.

```command
sudo ip neigh delete 192.168.100.100 dev eth0
```

## Conclusion

The Linux `ip` command is available on all Linux distributions, including Ubuntu. It replaces the older and now deprecated `ifconfig` command. The `ip` command can display and administer the network configuration of a system. It is used to view, add, and delete network interfaces, routing table entries, and IP addresses. For more information about the `ip` command, see the [Linux ip documentation](https://manpages.ubuntu.com/manpages/jammy/man8/ip.8.html).
---
slug: ip-failover-bgp
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to use Linode's IP Sharing feature to configure IP failover using FRR, a routing software that implements BGP"
keywords: ['IP failover','elastic IP','frr','bgp']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-11
modified_by:
  name: Linode
title: "Configuring IP Failover over BGP"
contributor:
  name: Linode
external_resources:
- '[FRRouting Documentation](http://docs.frrouting.org/en/latest/overview.html)'
---

{{<note>}}
Not all data centers supports configuring IP failover over BGP. Review the [Configuring IP Failover on a Compute Instance](/docs/guides/ip-failover/) to learn more about IP Sharing / IP failover availability within each data center.
{{</note>}}

This guide covers using Linode's [lelastic](https://github.com/linode/lelastic) tool to configure IP failover on Compute Instances.

## Before You Begin

Prior to following this guide, ensure the following has been done on each Compute Instance used within your IP failover strategy.

1. Set the [hostname](/docs/getting-started/#set-the-hostname) and [updated the hosts file](/docs/getting-started/#update-your-system-s-hosts-file).

1. [Disable Network Helper](/docs/platform/network-helper/#single-per-linode).

## Configure IP Sharing

Before using FRR to configure IP failover for a public or private IPv4 address (not VLANs), you first need to use Linode's IP Sharing feature to share your IP address with other Compute Instances. To do so, follow the instructions within the **Configuring IP Sharing** section of the [Managing IP Addresses](https://www.linode.com/docs/guides/managing-ip-addresses/#configuring-ip-sharing) guide for *each secondary* Compute Instance.

## Install FRR

This section provides instructions for installing FRR on Debian, Ubuntu, and CentOS systems through their native package managers. If you're using a different distribution or prefer to install FRR from source, follow [FRR's official installation instructions](http://docs.frrouting.org/en/latest/installation.html) to install FRR using git.

### Debian and Ubuntu

**Supported distributions:** *Ubuntu 20.04, 18.04, and 16.04 | Debian 11, 10, and 9*

1.  Set the FRR environment variable to the version you would like to install. The possible values are `frr-6`, `frr-7`, `frr-8`, and `frr-stable`, though it is recommended to use `frr-stable` to install the latest stable version.

        FRRVER="frr-stable"

    {{< note >}}
For more information on FRR versions, see the [FRR Debian repository](https://deb.frrouting.org/) and [FRR's Github Releases](https://github.com/FRRouting/frr/releases).
{{< /note >}}

1.  If you're running an older Debian-based system, you may need to install the packages below, which come default with most modern Debian-based distributions.

        sudo apt install apt-transport-https gnupg

1.  Add FRR's GPG key:

        curl -s https://deb.frrouting.org/frr/keys.asc | sudo apt-key add -

1.  Add FRR's Debian repository to your system's source's list:

        echo deb https://deb.frrouting.org/frr $(lsb_release -s -c) $FRRVER | sudo tee -a /etc/apt/sources.list.d/frr.list

1.  Install FRR:

        sudo apt update && sudo apt install frr frr-pythontools

### CentOS/RHEL 7 and 8

**Supported distributions:** *CentOS Stream 9 (and 8), CentOS 8 (and 7), other RHEL derivatives (including AlmaLinux 8, and Rocky Linux 8), and Fedora.*

1.  Set the FRR environment variable to the version you would like to install. The possible values are `frr-6`, `frr-7`, `frr-8`, and `frr-stable`, though it is recommended to use `frr-stable` to install the latest stable version.

        FRRVER="frr-stable"

    {{< note >}}
For more information on FRR versions, see the [FRR RPM repository](https://rpm.frrouting.org/) and [FRR's Github Releases](https://github.com/FRRouting/frr/releases).
{{< /note >}}

1. Add FRR's RPM repository to your system:

    -   **CentOS/RHEL 8**

            curl -O https://rpm.frrouting.org/repo/$FRRVER-repo-1-0.el8.noarch.rpm
            sudo dnf install ./$FRRVER*

    -   **CentOS/RHEL 7**

            curl -O https://rpm.frrouting.org/repo/$FRRVER-repo-1-0.el7.noarch.rpm
            sudo yum install ./$FRRVER*

1.  Install FRR:

    -   **CentOS/RHEL 8**

            sudo dnf install frr frr-pythontools

    -   **CentOS/RHEL 7**

            sudo yum install frr frr-pythontools

## Enable BGP within FRR

FRR works using a variety of protocols. Since we're using FRR for its BGP support, the next step is to explicitly enable the `bgpd` daemon.

1.  Using a text editor of your choice, enable the `bgpd` daemon by updating its value to `yes` in the FRR daemons configuration file:

      {{< file "/etc/frr/daemons" >}}
# The watchfrr and zebra daemons are always started.
#
bgpd=yes
{{</ file >}}

1.  Restart the FRR service:

        sudo systemctl restart frr.service

## Configure FRR

With FRR installed, you can now configure it to enable IP failover.

1.  Gather the following information, which is required for the next step:

    - **Shared IP address** (`[SHARED_IP]`): The shared IP address you've configured for both the primary and secondary instances. See [Configure IP Sharing](#configure-ip-sharing).
    - **Hostname** (`[HOSTNAME]`): The hostname defined on the Compute Instance you are configuring (ex: `atl-bgp-1.example.com`).
    - **Role** (`[ROLE]`): The role of this Compute Instance within your failover strategy.
      - `primary`: All requests are routed to this Compute Instance, provided it is accessible.
      - `secondary`: If the `primary` instance fails, all requests are routed to this Compute Instance, provided it is accessible.
    - **Data center ID** (`[DC_ID]`): The ID of this data center as defined by the list below:
        - Atlanta (USA): `4`
        - Dallas (USA): `2`
        - Frankfurt (Germany): `10`
        - Fremont (USA): `3`
        - London (UK): `7`
        - Mumbai (India): `14`
        - Newark (USA): `6`
        - Singapore: `9`
        - Sydney (Australia): `16`
        - Tokyo (Japan): `11`
        - Toronto (Canada): `15`

1.  The template below should be used for the FRR configuration on Compute Instance within your IP failover setup. Ensure you replace any instances of `[SHARED_IP]`, `[HOSTNAME]`, `[ROLE]`, and `[DC_ID]` as outlined above. Store the template somewhere that you can easily access later. In a later step, you copy the contents of the template and paste them into the VTY interactive shell.

      {{< file "~/ipfailover.conf">}}
hostname [HOSTNAME]

router bgp 65000
no bgp ebgp-requires-policy
coalesce-time 1000
bgp bestpath as-path multipath-relax
neighbor RS peer-group
neighbor RS remote-as external
neighbor RS capability extended-nexthop
neighbor 2600:3c0f:[DC_ID]:34::1 peer-group RS
neighbor 2600:3c0f:[DC_ID]:34::2 peer-group RS
neighbor 2600:3c0f:[DC_ID]:34::3 peer-group RS
neighbor 2600:3c0f:[DC_ID]:34::4 peer-group RS
address-family ipv4 unicast
  network [SHARED_IP]/32 route-map [ROLE]
  redistribute static
exit-address-family
route-map primary permit 10
set large-community 63949:1:1
route-map secondary permit 10
set large-community 63949:1:2
{{</ file >}}

1.  Run the VTY shell:

        sudo vtysh

1.  Enter configuration mode:

        conf t

1.  Copy the contents of your template configuration file and paste them into the VTY shell:

1.  Tell the VTY shell that you are done entering your configurations:

        end

1. Write your configurations to VTY:

        write

1.  Verify that the configurations you entered were correctly written by showing VTY's running configuration:

        show running-config

1.  Exit out of the VTY shell:

        q

## Configure the Network Interface

1.  Configure the Compute Instance's network interface as detailed below. Replace `[SHARED_IP]` with the Shared IP address you've configured.

    - **Debian 10 & Ubuntu 18.04**

        Edit the `/etc/network/interfaces` file with the following entries.

        {{< file >}}
up   ip addr add [SHARED_IP]/32 dev eth0 label eth0
down ip addr del [SHARED_IP]/32 dev eth0 label eth0
{{</ file >}}

        If you configured more than one Shared IP on your instance, you can add additional interface entries to your network interfaces configuration file as follows:

        {{< file >}}
up   ip addr add [SHARED_IP]/32 dev eth0 label eth0
down ip addr del [SHARED_IP]/32 dev eth0 label eth0
up   ip addr add [SHARED_IP2]/32 dev eth0 label eth0
down ip addr del [SHARED_IP2]/32 dev eth0 label eth0
{{</ file >}}

    - **Ubuntu 20.04**

        Edit the `/etc/systemd/network/05-eth0.network` file by adding an `Address` entry for the Shared IP.

        {{< file >}}
[Match]
Name=eth0
...
Address=[SHARED_IP]/32
{{</ file >}}

        If you configured more than one Shared IP, you can add additional interface entries to your network interfaces configuration file as follows:

        {{< file >}}
Address=[SHARED_IP]/32
Address=[SHARED_IP2]/32
{{</ file >}}

    - **CentOS 8**

        Edit the `/etc/sysconfig/network-scripts/ifcfg-eth0` file with the following entry.

        {{< file >}}
IPADDR1=[SHARED_IP]
PREFIX1="32"
{{</ file >}}

        If you configured more than one Shared IP on your instance, you can add additional interface entries to your network interfaces configuration file as follows:

        {{< file >}}
IPADDR1=[SHARED_IP]
PREFIX1="32"

IPADDR2=[SHARED_IP2]
PREFIX2="32"
{{</ file >}}

1.  Apply the `eth0` network interface configuration:

    -   **Debian, Ubuntu 18.04 (and earlier), and CentOS/RHEL**

            sudo ifdown eth0 && sudo ifup eth0

    -   **Ubuntu 20.04 (and later)**

            systemctl restart systemd-networkd

1.  Ensure that your network interface configurations have been applied as expected:

        ip a | grep inet

    You should see a similar output:

    {{< output >}}
inet 127.0.0.1/8 scope host lo
inet6 ::1/128 scope host
inet 192.0.2.0/24 brd 192.0.2.255 scope global dynamic eth0
inet 203.0.113.0/32 scope global eth0
inet6 2600:3c04::f03c:92ff:fe7f:5774/64 scope global dynamic mngtmpaddr
inet6 fe80::f03c:92ff:fe7f:5774/64 scope link
{{</ output >}}

1.  Restart the FRR service:

        sudo systemctl restart frr.service

### Test Shared IPs

Depending on how you configured your Compute Instances and Shared IP(s), testing steps may vary. In general, you can use the `ping` command to test sending packets to your Shared IP from a separate instance, your workstation, or any other computer/server:

    ping [SHARED_IP]

For example, if you have two Compute Instances configured with the same Shared IP:

- Ping the Shared IP when both instances are up. The packets should be received by the primary instance.

- Shut down the primary instance and ping the Shared IP. The packets should be received by the secondary instance.

In each testing scenario, you can monitor ping traffic on a Compute Instance by [inspecting icmp packets with the tcpdump command](https://danielmiessler.com/study/tcpdump/#protocol).
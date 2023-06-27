---
description: "Learn how to use Linode's IP Sharing feature to configure IP failover using FRR, a routing software that implements BGP"
keywords: ['IP failover','elastic IP','frr','bgp']
published: 2022-01-11
modified: 2022-04-28
modified_by:
  name: Linode
title: "Configuring IP Failover over BGP using FRR (Advanced)"
external_resources:
- '[FRRouting Documentation](http://docs.frrouting.org/en/latest/overview.html)'
aliases: ['/guides/ip-failover-bgp-frr/']
authors: ["Linode"]
---

{{< note >}}
Not all data centers support configuring IP failover over BGP. Review the [Configuring Failover on a Compute Instance](/docs/products/compute/compute-instances/guides/failover/) to learn more about IP Sharing / IP failover availability within each data center.
{{< /note >}}

This guide covers using the open source [FRRouting (FRR)](http://docs.frrouting.org/en/latest/overview.html#about-frr) tool to configure failover between two Linode Compute Instances. FRR is a routing service that uses BGP to monitor and fail over components in a high availability configuration. These instructions supplement the general [Configuring Failover on a Compute Instance](/docs/products/compute/compute-instances/guides/failover/) guide and are intended as an advanced alternative to lelastic when more control and customization is needed.

## Before You Begin

Prior to following this guide, ensure the following has been done on each Compute Instance used within your IP failover strategy.

1. Read through the [Configuring Failover on a Compute Instance](/docs/products/compute/compute-instances/guides/failover/) guide to learn more about how failover is implemented within Linode Compute.

1. Set the [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname) and [update the hosts file](/docs/products/compute/compute-instances/guides/set-up-and-secure/#update-your-systems-hosts-file) for each Compute Instance.

1. Verify Python3 is installed. See [FRR's official documentation](http://docs.frrouting.org/en/latest/installation.html#python-dependency-documentation-and-tests) to learn about FRR's Python dependencies.

## Configure Failover

These instructions enable you to configure failover using FRR, which is very configurable and can be used for advanced failover implementation. This guide depends on the general [Configuring Failover on a Compute Instance](/docs/products/compute/compute-instances/guides/failover/) guide for many steps.

To configure failover, complete each section in the order shown:

1. [Configuring Failover on a Compute Instance > Create and Share the Shared IP Address](/docs/products/compute/compute-instances/guides/failover/#create-and-share-the-shared-ip-address)
1. For *each* Compute Instance:
      - [Configuring Failover on a Compute Instance > Add the Shared IP to the Networking Configuration](/docs/products/compute/compute-instances/guides/failover/#add-the-shared-ip-to-the-networking-configuration)
      - [Install FRR](#install-frr)
      - [Configure FRR](#configure-frr)
1. [Configuring Failover on a Compute Instance > Test Failover](/docs/products/compute/compute-instances/guides/failover/#test-failover)

## Install FRR

This section provides instructions for installing FRR on Debian, Ubuntu, and CentOS systems through their native package managers. If you're using a different distribution or prefer to install FRR from source, follow [FRR's official installation instructions](http://docs.frrouting.org/en/latest/installation.html) to install FRR using git.

### Debian and Ubuntu

**Supported distributions:** *Ubuntu 20.04, 18.04, and 16.04 | Debian 11, 10, and 9*

1.  Set the FRR environment variable to the version you would like to install. The possible values are `frr-6`, `frr-7`, `frr-8`, and `frr-stable`, though it is recommended to use `frr-stable` to install the latest stable version.

    ```command
    FRRVER="frr-stable"
    ```

    {{< note >}}
    For more information on FRR versions, see the [FRR Debian repository](https://deb.frrouting.org/) and [FRR's Github Releases](https://github.com/FRRouting/frr/releases).
    {{< /note >}}

1.  If you're running an older Debian-based system, you may need to install the packages below, which come default with most modern Debian-based distributions.

    ```command
    sudo apt update && sudo apt install apt-transport-https gnupg
    ```

1.  Add FRR's GPG key:

    ```command
    curl -s https://deb.frrouting.org/frr/keys.asc | sudo apt-key add -
    ```

1.  Add FRR's Debian repository to your system's source's list:

    ```command
    echo deb https://deb.frrouting.org/frr $(lsb_release -s -c) $FRRVER | sudo tee -a /etc/apt/sources.list.d/frr.list
    ```

1.  Install FRR:

    ```command
    sudo apt install frr frr-pythontools
    ```

### CentOS/RHEL 7 and 8

**Supported distributions:** *CentOS Stream 9 (and 8), CentOS 8 (and 7), other RHEL derivatives (including AlmaLinux 8, and Rocky Linux 8), and Fedora.*

1.  Set the FRR environment variable to the version you would like to install. The possible values are `frr-6`, `frr-7`, `frr-8`, and `frr-stable`, though it is recommended to use `frr-stable` to install the latest stable version.

    ```command
    FRRVER="frr-stable"
    ```

    {{< note >}}
    For more information on FRR versions, see the [FRR RPM repository](https://rpm.frrouting.org/) and [FRR's Github Releases](https://github.com/FRRouting/frr/releases).
    {{< /note >}}

1. Add FRR's RPM repository to your system:

    -   **CentOS/RHEL 8**

        ```command
        curl -O https://rpm.frrouting.org/repo/$FRRVER-repo-1-0.el8.noarch.rpm
        sudo dnf install ./$FRRVER*

    -   **CentOS/RHEL 7**

        ```command
        curl -O https://rpm.frrouting.org/repo/$FRRVER-repo-1-0.el7.noarch.rpm
        sudo yum install ./$FRRVER*
        ```

1.  Install FRR:

    -   **CentOS/RHEL 8**

        ```command
        sudo dnf install frr frr-pythontools
        ```

    -   **CentOS/RHEL 7**

        ```command
        sudo yum install frr frr-pythontools
        ```

## Configure FRR

With FRR installed, you can now configure it to enable IP failover.

1.  FRR works using a variety of protocols. Since we're using FRR for its BGP support, the next step is to explicitly enable the `bgpd` daemon. Using a text editor of your choice, enable the `bgpd` daemon by updating its value to `yes` in the FRR daemons configuration file:

    ```file {title="/etc/frr/daemons"}
    # The watchfrr and zebra daemons are always started.
    #
    bgpd=yes
    ```

1.  Gather the following information, which is required for the next step:

    - **Shared IP address** (`[SHARED_IP]`): The IPv4 address you shared or an address from the IPv6 range that you shared. You can choose any address from the IPv6 range. For example, within the range *2001:db8:e001:1b8c::/64*, the address `2001:db8:e001:1b8c::1` can be used.
    - **Prefix** (`[PREFIX]`): For an IPv4 address, use `32`. For an IPv6 address, use either `56` or `64` depending on the size of the range you are sharing.
    - **Protocol** (`[PROTOCOL]`): Use `ipv4` when sharing an IPv4 address and `ipv6` when sharing an IPv6 address.
    - **Hostname** (`[HOSTNAME]`): The hostname defined on the Compute Instance you are configuring (ex: `atl-bgp-1`).
    - **Role** (`[ROLE]`): The role of this Compute Instance within your failover strategy.
      - `primary`: All requests are routed to this Compute Instance, provided it is accessible.
      - `secondary`: If the `primary` instance fails, all requests are routed to this Compute Instance, provided it is accessible.
    - **Data center ID** (`[DC_ID]`): The ID of your data center. See [IP Sharing Availability](/docs/products/compute/compute-instances/guides/failover/#ip-sharing-availability) for the corresponding ID.

1.  Edit the `/etc/frr/frr.conf` file and add the following lines. Ensure you replace any instances of `[SHARED_IP]`, `[HOSTNAME]`, `[ROLE]`, and `[DC_ID]` as outlined above.

    ```file {title="/etc/frr/frr.conf"}
    hostname [HOSTNAME]

    router bgp 65001
    no bgp ebgp-requires-policy
    coalesce-time 1000
    bgp bestpath as-path multipath-relax
    neighbor RS peer-group
    neighbor RS remote-as external
    neighbor RS ebgp-multihop 10
    neighbor RS capability extended-nexthop
    neighbor 2600:3c0f:[DC_ID]:34::1 peer-group RS
    neighbor 2600:3c0f:[DC_ID]:34::2 peer-group RS
    neighbor 2600:3c0f:[DC_ID]:34::3 peer-group RS
    neighbor 2600:3c0f:[DC_ID]:34::4 peer-group RS

    address-family [PROTOCOL] unicast
      network [SHARED_IP]/[PREFIX] route-map [ROLE]
      redistribute static
    exit-address-family

    route-map primary permit 10
      set community 65000:1
    route-map secondary permit 10
      set community 65000:2

    ipv6 nht resolve-via-default
    ```

1.  Restart the FRR service:

    ```command
    sudo systemctl restart frr
    ```
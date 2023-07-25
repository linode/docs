---
description: "This guide provides Linode users with steps to manually enable an Elastic IP on a Linode. This is meant to support users that are currently using Linode IP Sharing and need an intermediary replacement when migrating to a Next Generation Network data center."
keywords: ['networking','Elastic IP','keywords','and key phrases']
published: 2020-06-02
modified: 2022-01-11
modified_by:
  name: Linode
title: "Enable IP Sharing (Elastic IPs) in Atlanta through FRR"
noindex: true
_build:
  list: false
external_resources:
- '[FRRouting Documentation](http://docs.frrouting.org/en/latest/overview.html)'
aliases: ['/platform/manager/manually-enable-elastic-ip-on-your-linode/','/guides/manually-enable-elastic-ip-on-your-linode/','/guides/ip-sharing-atlanta/']
authors: ["Linode"]
---

The Atlanta data center was upgraded in April of 2021 to improve performance and expand product availability (see the [Linode Atlanta Data Center Upgrades Completed](https://www.linode.com/blog/linode/linode-atlanta-data-center-upgrades-completed/) blog post). As part of this upgrade, the [IP Sharing](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#configuring-ip-sharing) feature was impacted and no longer functions as it did before. Customers that currently use this feature can follow this guide to manually enable IP Sharing (also called *Elastic IPs*) through the open source [FRRouting (FRR)](http://docs.frrouting.org/en/latest/overview.html#about-frr) tool. This allows two Linode Compute Instances to share a single IP address, one serving as the primary and one serving as the secondary. If the primary Compute Instance becomes unavailable, the elastic IP will seamlessly failover to the secondary Compute Instance.

{{< note >}}
This guide discusses a temporary workaround specific to the Atlanta data center. Future planned network upgrades may impact this feature again and may require additional configuration.
{{< /note >}}

## Before You Begin

1. Prior to beginning the process outlined in this guide, make sure that you have received an IPv4 address(es) from Linode Support to use as your Elastic IP(s). To request an additional IPv4 address, [open a new support ticket from the Cloud Manager](/docs/products/platform/get-started/guides/support/#contacting-linode-support).

1. Ensure you have set the [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname) and have updated the [hosts file](/docs/products/compute/compute-instances/guides/set-up-and-secure/#update-your-systems-hosts-file) on your Compute Instances.

1. Ensure Python 3 is installed on your system. See [FRR's official documentation](http://docs.frrouting.org/en/latest/installation.html#python-dependency-documentation-and-tests) to learn about FRR's Python dependencies.

1. [Disable Network Helper](/docs/products/compute/compute-instances/guides/network-helper/#single-per-linode) on the Elastic IP Linodes and reboot them.

## Install FRR

This section provides instructions for installing FRR on Debian, Ubuntu, and CentOS systems through their native package managers. If you're using a different distribution or prefer to install FRR from source, follow [FRR's official installation instructions](http://docs.frrouting.org/en/latest/installation.html) to install FRR using git.

### Ubuntu and Debian

**Supported distributions:** *Ubuntu 20.04, 18.04, and 16.04 | Debian 11, 10, and 9*

1.  Install the package dependencies needed to securely install FRR on your system:

    ```command
    sudo apt-get install apt-transport-https gnupg
    ```

1.  Add FRR's GPG key:

    ```command
    curl -s https://deb.frrouting.org/frr/keys.asc | sudo apt-key add -
    ```

1.  Set the FRR environment variable as `frr-stable` to install the latest FRR release. Specific releases can also be targeted by setting the variable to `frr-8`, `frr-7`, `frr-6` (see [FRR Debian Repository](https://deb.frrouting.org/) for more details).

    ```command
    FRRVER="frr-stable"
    ```

1.  Add FRR's Debian repository to your system's source's list:

    ```command
    echo deb https://deb.frrouting.org/frr $(lsb_release -s -c) $FRRVER | sudo tee -a /etc/apt/sources.list.d/frr.list
    ```

1.  Install the FRR package:

    ```command
    sudo apt update && sudo apt install frr frr-pythontools
    ```

### CentOS/RHEL

**Supported distributions:** *CentOS Stream 9 (and 8), CentOS 8 (and 7), other RHEL derivatives (including AlmaLinux 8, and Rocky Linux 8), and Fedora.*

1.  Set the FRR environment variable as `frr-stable` to install the latest FRR release. Specific releases can also be targeted by setting the variable to `frr-8`, `frr-7`, `frr-6` (see [FRR RPM Repository](https://rpm.frrouting.org/) for more details).

    ```command
    FRRVER="frr-stable"
    ```

1.  Download the FRR's RPM repository.

    **CentOS/RHEL 8**

    ```command
    curl -O https://rpm.frrouting.org/repo/$FRRVER-repo-1-0.el8.noarch.rpm
    ```

    **CentOS/RHEL 7**

    ```command
    curl -O https://rpm.frrouting.org/repo/$FRRVER-repo-1-0.el7.noarch.rpm
    ```

1.  Install the repository.

    ```command
    sudo yum install ./$FRRVER*
    ```

1.  Install the FRR package.

    ```command
    sudo yum install frr frr-pythontools
    ```

## Enable bgpd

Enable the Border Gateway Protocol (BGP) daemon on your system.

1. Using a text editor of your choice, enable the `bgpd` daemon by updating its value to `yes` in `/etc/frr/daemons` (the FRR daemons configuration file):

    ```file {title="/etc/frr/daemons"}
    # The watchfrr and zebra daemons are always started.
    #
    bgpd=yes
    ```

1. Restart the FRR service:

    ```command
    sudo systemctl restart frr.service
    ```

## Configure FRR

With FRR installed, you can now apply the required configurations to enable Elastic IP(s). When following the steps within this section, you need to have the following pieces of information:

- **Elastic IP address** (`[ELASTIC_IP]`): The elastic IP address assigned to your Linode. If you do not yet have this, contact Linode support.
- **Hostname** (`[HOSTNAME]`): The hostname defined on your Linode (ex: `atl-bgp-1.example.com`).
- **Gateway IP** (`[DEFAULT_GW_IPV4]`: This is the Linode's IPv4 address (non-Elastic IP address), which determines the `peer-group HOST` setting. Enter the first 3 octets of the Linode's IPv4 address followed by a `1`. For example, if the Linode's IPv4 address is `192.0.2.0`, the value to enter is `192.0.2.1`.
- **Role** (`[ROLE]`): The role of the Linode's elastic IP address.
  - `primary`: All requests are routed to this Linode's Elastic IP address, as long as the Linode is running.
  - `secondary`: If the `primary` Linode fails, all requests are routed to this Linode's Elastic IP address, as long as the Linode is running.

1.  The template below includes the FRR configuration. Ensure you replace any instances of `[ELASTIC_IP]`, `[HOSTNAME]`, `[ROLE]`, and `[DEFAULT_GW_IPV4]` as outlined above. Store the template with your replaced values somewhere that you can easily access later. In the next step, you copy the contents of the template and paste them into the [VTY interactive shell](https://docs.frrouting.org/en/latest/vtysh.html).

    ```file {title="~/elastic.conf"}
    hostname [HOSTNAME]

    router bgp 65045
    no bgp ebgp-requires-policy
    coalesce-time 1000
    bgp bestpath as-path multipath-relax
    neighbor HOST peer-group
    neighbor HOST remote-as external
    neighbor HOST capability extended-nexthop
    neighbor [DEFAULT_GW_IPV4] peer-group HOST
    address-family ipv4 unicast
      network [ELASTIC_IP]/32 route-map [ROLE]
      redistribute static
    exit-address-family
    route-map primary permit 10
    set large-community 63949:1:1
    route-map secondary permit 10
    set large-community 63949:1:2
    ```

1.  Run the VTY shell:

    ```command
    sudo vtysh
    ```

1.  Enter configuration mode:

    ```command
    conf t
    ```

1.  Copy the contents of your template configuration file and paste them into the VTY shell.

1.  Tell the VTY shell that you are done entering your configurations:

    ```command
    end
    ```

1.  Write your configurations to VTY:

    ```command
    write
    ```

1.  Verify that the configurations you entered were correctly written by showing VTY's running configuration:

    ```command
    show running-config
    ```

1.  Exit out of the VTY shell:

    ```command
    q
    ```

1.  Configure the Linode's interface(s) with the Elastic IP:

    **Debian and Ubuntu (18.04 and 16.04)**

    Edit your Linode's `/etc/network/interfaces` file with the following entries. Replace `[ELASTIC_IP]` with the Elastic IPv4 address:

    ```file {title="/etc/network/interfaces"}
    up   ip addr add [ELASTIC_IP]/32 dev eth0 label eth0
    down ip addr del [ELASTIC_IP]/32 dev eth0 label eth0
    ```

    If you configured more than one Elastic IP on your Linode, you can add additional interface entries to your network interfaces configuration file as follows:

    ```file {title="/etc/network/interfaces"}
    up   ip addr add [ELASTIC_IP]/32 dev eth0 label eth0
    down ip addr del [ELASTIC_IP]/32 dev eth0 label eth0
    up   ip addr add [ELASTIC_IP]_2/32 dev eth0 label eth0
    down ip addr del [ELASTIC_IP]_2/32 dev eth0 label eth0
    ```

    **Ubuntu 20.04**

    Edit your Linode's `/etc/systemd/network/05-eth0.network` file by adding an `Address` entry for the Elastic IP. Replace `[ELASTIC_IP]` with the Elastic IPv4 address:

    ```file {title="/etc/systemd/network/05-eth0.network"}
    [Match]
    Name=eth0
    ...
    Address=[ELASTIC_IP]/32
    ```

    If you configured more than one Elastic IP on your Linode, you can add additional interface entries to your network interfaces configuration file as follows:

    ```file {title="/etc/network/interfaces"}
    Address=[ELASTIC_IP]/32
    Address=[ELASTIC_IP]_2/32
    ```

    **CentOS/RHEL**

    Edit your Linode's `/etc/sysconfig/network-scripts/ifcfg-eth0` file with the following entry. Replace `[ELASTIC_IP]` with the Elastic IPv4 address:

    ```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
    IPADDR1=[ELASTIC_IP]
    PREFIX1="32"
    ```

    If you configured more than one Elastic IP on your Linode, you can add additional interface entries to your network interfaces configuration file as follows:

    ```file {title="/etc/sysconfig/network-scripts/ifcfg-eth0"}
    IPADDR1=[ELASTIC_IP]
    PREFIX1="32"

    IPADDR2=[ELASTIC_IP]_2
    PREFIX2="32"
    ```

1.  Apply the `eth0` network interface configuration:

    **Debian, Ubuntu (18.04 and 16.04), and CentOS/RHEL**

    ```command
    sudo ifdown eth0 && sudo ifup eth0
    ```

    **Ubuntu 20.04**

    ```command
    systemctl restart systemd-networkd
    ```

1.  Ensure that your network interface configurations have been applied as expected:

    ```command
    ip a | grep inet
    ```

    You should see a similar output:

    ```output
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
    inet 192.0.2.0/24 brd 192.0.2.255 scope global dynamic eth0
    inet 203.0.113.0/32 scope global eth0
    inet6 2600:3c04::f03c:92ff:fe7f:5774/64 scope global dynamic mngtmpaddr
    inet6 fe80::f03c:92ff:fe7f:5774/64 scope link
    ```

1.  Restart the FRR service:

    ```command
    sudo systemctl restart frr.service
    ```

### Test Elastic IPs

Depending on how you configured your Linode(s) and Elastic IP(s), testing steps may vary. In general, you can use the `ping` command to test sending packets to your configured Elastic IP(s) from a separate Linode, your workstation, or any other computer/server:

```command
ping [ELASTIC_IP]
```

For example, if you have two Linodes configured with the same Elastic IP:

- Ping the Elastic IP when both Linodes are up. The packets should be received by the primary Linode. You can monitor ping traffic on the Linode by [inspecting icmp packets with the tcpdump command](https://danielmiessler.com/study/tcpdump/#protocol).

- Shut down the primary Linode and ping the Elastic IP. The packets should be received by the secondary Linode. You can monitor ping traffic on the Linode by [inspecting icmp packets with the tcpdump command](https://danielmiessler.com/study/tcpdump/#protocol).
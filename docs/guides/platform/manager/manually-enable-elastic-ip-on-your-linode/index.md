---
slug: manually-enable-elastic-ip-on-your-linode
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide provides Linode users with steps to manually enable an Elastic IP on a Linode. This is meant to support users that are currently using Linode IP Sharing and need an intermediary replacement when migrating to a Next Generation Network data center.'
og_description: 'This guide provides Linode users with steps to manually enable an Elastic IP on a Linode. This is meant to support users that are currently using Linode IP Sharing and need an intermediary replacement when migrating to a Next Generation Network data center.'
keywords: ['networking','Elastic IP','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-06-02
noindex: true
modified_by:
  name: Linode
title: "How to Manually Enable Elastic IP on your Linode"
h1_title: "Manually Enable Elastic IP on your Linode"
_build:
  list: false
contributor:
  name: Linode
external_resources:
- '[FRRouting Documentation](http://docs.frrouting.org/en/latest/overview.html)'
aliases: ['/platform/manager/manually-enable-elastic-ip-on-your-linode/']
---

This guide provides an alternative to [Linode's IP Sharing](/docs/platform/manager/remote-access/#configuring-ip-sharing). If IP sharing is not available in a Next Generation Network (NGN) [data center](https://www.linode.com/global-infrastructure/), you can install the open source tool [FRRouting (FRR)](http://docs.frrouting.org/en/latest/overview.html#about-frr) to enable *Elastic IPs* on your Linode. An Elastic IP is a static and **public IP address** that you can use to route network traffic between Linodes. For example, two Linodes can share one Elastic IP and in the case that one of the Linodes becomes unavailable, failover to a secondary Linode happens seamlessly.

## In this Guide

This guide will cover the following:

- Installing FRRouting (FRR) on your Linode.
- Configuring FRR to enable Elastic IP on a Linode.
- Suggested next steps when moving from IP sharing to Elastic IP.

### Before You Begin

1. Prior to beginning the process outlined in this guide, make sure that you have received an IPv4 address(es) from Linode Support to use as your Elastic IP(s).

1. Ensure you have set your [Linode's hostname](/docs/getting-started/#set-the-hostname) and you have [updated your Linode's hosts file](/docs/getting-started/#update-your-system-s-hosts-file).

1. [Install Git](/docs/development/version-control/how-to-install-git-and-clone-a-github-repository/) on your Linode if it is not already installed. You will need Git to install FRR from source, which is required by some Linux distributions that don't offer an FRR package.

    {{< note >}}
This guide will use Git as the installation method for the FRR tool. For other installation methods see [FRR's official documentation](http://docs.frrouting.org/en/latest/installation.html).
    {{</ note >}}

1. Ensure Python 3 is installed on your system. See [FRR's official documentation](http://docs.frrouting.org/en/latest/installation.html#python-dependency-documentation-and-tests) to learn about FRR's Python dependencies.

1. [Disable Network Helper](/docs/platform/network-helper/#single-per-linode) on the Elastic IP Linodes and reboot them.

## Install FRR on your Linode

This section provides FRR installation methods for Debian 10, Ubuntu 20.04, Ubuntu 18.04, and CentOS 8. If you are using a different Linux distribution, see FRR's official documentation on [installing](http://docs.frrouting.org/en/latest/installation.html) and [building](http://docs.frrouting.org/projects/dev-guide/en/latest/building.html) FRR.

Once you have installed FRR on your Linode, proceed to the [Configure Elastic IP](#configure-floating-ip) section of this guide.

### Debian 10 / Ubuntu 18.04

1. Install the package dependencies needed to securely install FRR on your Debian system:

        sudo apt-get install apt-transport-https gnupg

1. Add FRR's GPG key:

        curl -s https://deb.frrouting.org/frr/keys.asc | sudo apt-key add -

1. Set the FRR environment variable to the version you would like to install. The possible values are `frr-6`, `frr-7`, and `frr-stable`:

        FRRVER="frr-stable"

    {{< note >}}
For more information on Debian FRR versions, see the [FRR Debian Repository](https://deb.frrouting.org/) and [FRR's Github Releases](https://github.com/FRRouting/frr/releases).
  {{< /note >}}

1. Add FRR's Debian repository to your system's source's list:

        echo deb https://deb.frrouting.org/frr $(lsb_release -s -c) $FRRVER | sudo tee -a /etc/apt/sources.list.d/frr.list

1. Install FRR:

        sudo apt update && sudo apt install frr frr-pythontools

1. Using a text editor of your choice, enable the `bgpd` daemon, by updating its value to `yes` in the FRR daemons configuration file:

      {{< file "/etc/frr/daemons" >}}
# The watchfrr and zebra daemons are always started.
#
bgpd=yes
        {{</ file >}}

1. Restart the FRR service:

        sudo systemctl restart frr.service

### Ubuntu 20.04

1. Install all FRR dependencies:

        sudo apt-get install \
          git autoconf automake libtool make libreadline-dev texinfo \
          pkg-config libpam0g-dev libjson-c-dev bison flex python3-pytest \
          libc-ares-dev python3-dev libsystemd-dev python-ipaddress python3-sphinx \
          install-info build-essential libsystemd-dev libsnmp-dev perl \
          libcap-dev python2 cmake libpcre3-dev libpcre3

1. Clone the libyang GitHub repository and move into its directory. FRR depends on libyang, a data modeling language parser and toolkit. libyang is not yet available as a package so it must be built from source.

        git clone https://github.com/CESNET/libyang.git
        cd libyang

1. Create a a new directory named `build` and move into it:

        mkdir build
        cd build

1. Build libyang:

        cmake -DENABLE_LYD_PRIV=ON -DCMAKE_INSTALL_PREFIX:PATH=/usr \
              -D CMAKE_BUILD_TYPE:String="Release" ..
        make
        sudo make install

1. Install Protobuf and ZeroMQ:

        sudo apt-get install protobuf-c-compiler libprotobuf-c-dev libzmq5 libzmq3-dev

1. Add the necessary FRR user and groups:

        sudo groupadd -r -g 92 frr
        sudo groupadd -r -g 85 frrvty
        sudo adduser --system --ingroup frr --home /var/run/frr/ \
          --gecos "FRR suite" --shell /sbin/nologin frr
        sudo usermod -a -G frrvty frr

1. Ensure you are no longer in the libyang directory. For example, you can move into your home directory:

        cd ~

1. Clone the FRR GitHub repository and move into the cloned repository:

        git clone https://github.com/frrouting/frr.git frr
        cd frr

1. Run the `bootstrap.sh` script:

        ./bootstrap.sh

1. Run the `configure` script with the following default configurations:

        ./configure \
            --prefix=/usr \
            --includedir=\${prefix}/include \
            --enable-exampledir=\${prefix}/share/doc/frr/examples \
            --bindir=\${prefix}/bin \
            --sbindir=\${prefix}/lib/frr \
            --libdir=\${prefix}/lib/frr \
            --libexecdir=\${prefix}/lib/frr \
            --localstatedir=/var/run/frr \
            --sysconfdir=/etc/frr \
            --with-moduledir=\${prefix}/lib/frr/modules \
            --with-libyang-pluginsdir=\${prefix}/lib/frr/libyang_plugins \
            --enable-configfile-mask=0640 \
            --enable-logfile-mask=0640 \
            --enable-snmp=agentx \
            --enable-multipath=64 \
            --enable-user=frr \
            --enable-group=frr \
            --enable-vty-group=frrvty \
            --with-pkg-git-version \
            --with-pkg-extra-version=-MyOwnFRRVersion

1. Build FRR:

        make
        sudo make install

1. Install the FRR repository's configuration files to your Linux system:

        sudo install -m 775 -o frr -g frr -d /var/log/frr
        sudo install -m 775 -o frr -g frrvty -d /etc/frr
        sudo install -m 640 -o frr -g frrvty tools/etc/frr/vtysh.conf /etc/frr/vtysh.conf
        sudo install -m 640 -o frr -g frr tools/etc/frr/frr.conf /etc/frr/frr.conf
        sudo install -m 640 -o frr -g frr tools/etc/frr/daemons.conf /etc/frr/daemons.conf
        sudo install -m 640 -o frr -g frr tools/etc/frr/daemons /etc/frr/daemons

1. Using a text editor, edit your `/etc/systctl.conf` file to uncomment the following values. This will enable IPv4 and IPv6 forward and MPLS:

      {{< file "/etc/sysctl.conf">}}
net.ipv4.ip_forward=1

# Uncomment the next line to enable packet forwarding for IPv6
#  Enabling this option disables Stateless Address Autoconfiguration
#  based on Router Advertisements for this host
net.ipv6.conf.all.forwarding=1
      {{</ file >}}

1. Apply these configurations to your running system:

        sudo sysctl -p

1. Install the FRR service files to your system:

        sudo install -m 644 tools/frr.service /etc/systemd/system/frr.service
        sudo systemctl enable frr

1. Start FRR using systemctl:

        sudo systemctl start frr

1. Using a text editor of your choice, enable the `bgpd` daemon, by updating its value to `yes` in the FRR daemons configuration file:

      {{< file "/etc/frr/daemons" >}}
# The watchfrr and zebra daemons are always started.
#
bgpd=yes
        {{</ file >}}

1. Restart the FRR service:

        sudo systemctl restart frr

### CentOS 8

1. Install all FRR dependencies:

        sudo dnf install --enablerepo=PowerTools git autoconf pcre-devel \
          automake libtool make readline-devel texinfo net-snmp-devel pkgconfig \
          groff pkgconfig json-c-devel pam-devel bison flex python3-pytest \
          c-ares-devel python3-devel systemd-devel libcap-devel cmake

1. Clone the libyang GitHub repository and move into its directory. FRR depends on libyang, a data modeling language parser and toolkit. libyang is not yet available as a package so it must be built from source:

        git clone https://github.com/CESNET/libyang.git
        cd libyang

1. Create a a new directory named `build` and move into it:

        mkdir build
        cd build

1. Build libyang:

        cmake -DENABLE_LYD_PRIV=ON -DCMAKE_INSTALL_PREFIX:PATH=/usr \
              -D CMAKE_BUILD_TYPE:String="Release" ..
        make
        sudo make install

1. Add the necessary FRR user and groups:

        sudo groupadd -g 92 frr
        sudo groupadd -r -g 85 frrvty
        sudo useradd -u 92 -g 92 -M -r -G frrvty -s /sbin/nologin \
          -c "FRR FRRouting suite" -d /var/run/frr frr

1. Ensure you are no longer in the libyang directory. For example, you can move into your home directory:

        cd ~

1. Clone the FRR GitHub repository and move into the cloned repository:

        git clone https://github.com/frrouting/frr.git frr
        cd frr

1. Run the `bootstrap.sh` script:

        ./bootstrap.sh

1. Run the `configure` script with the following default configurations:

        ./configure \
            --bindir=/usr/bin \
            --sbindir=/usr/lib/frr \
            --sysconfdir=/etc/frr \
            --libdir=/usr/lib/frr \
            --libexecdir=/usr/lib/frr \
            --localstatedir=/var/run/frr \
            --with-moduledir=/usr/lib/frr/modules \
            --enable-snmp=agentx \
            --enable-multipath=64 \
            --enable-user=frr \
            --enable-group=frr \
            --enable-vty-group=frrvty \
            --enable-systemd=yes \
            --disable-exampledir \
            --disable-ldpd \
            --enable-fpm \
            --with-pkg-git-version \
            --with-pkg-extra-version=-MyOwnFRRVersion \
            SPHINXBUILD=/usr/bin/sphinx-build

1. Build FRR:

        make
        make check
        sudo make install

1. Create FRR configuration files:

        sudo mkdir /var/log/frr
        sudo mkdir /etc/frr
        sudo touch /etc/frr/zebra.conf
        sudo touch /etc/frr/bgpd.conf
        sudo touch /etc/frr/ospfd.conf
        sudo touch /etc/frr/ospf6d.conf
        sudo touch /etc/frr/isisd.conf
        sudo touch /etc/frr/ripd.conf
        sudo touch /etc/frr/ripngd.conf
        sudo touch /etc/frr/pimd.conf
        sudo touch /etc/frr/nhrpd.conf
        sudo touch /etc/frr/eigrpd.conf
        sudo touch /etc/frr/babeld.conf
        sudo chown -R frr:frr /etc/frr/
        sudo touch /etc/frr/vtysh.conf
        sudo chown frr:frrvty /etc/frr/vtysh.conf
        sudo chmod 640 /etc/frr/*.conf

1. Install the FRR repository's daemon config file to your system and change its ownership to the `frr` user and group:

        sudo install -p -m 644 tools/etc/frr/daemons /etc/frr/
        sudo chown frr:frr /etc/frr/daemons

1. Using a text editor, create a new file named `/etc/sysctl.d/90-routing-sysctl.conf` and add the content in the example file. This will enable IPv4 and IPv6 forward and MPLS:

      {{< file "/etc/sysctl.d/90-routing-sysctl.conf" >}}
# Sysctl for routing
#
# Routing: We need to forward packets
net.ipv4.conf.all.forwarding=1
net.ipv6.conf.all.forwarding=1
      {{</ file >}}

1. Apply these configurations to your running system:

        sudo sysctl -p /etc/sysctl.d/90-routing-sysctl.conf

1. Install the FRR service files to your system:

        sudo install -p -m 644 tools/frr.service /usr/lib/systemd/system/frr.service

1. Register the FRR service:

        sudo systemctl preset frr.service

1. Enable FRR to automatically start on boot:

        sudo systemctl enable frr

1. Start the FRR service:

        sudo systemctl start frr

1. Using a text editor of your choice, enable the `bgpd` daemon, by updating its value to `yes` in the FRR daemons configuration file:

      {{< file "/etc/frr/daemons" >}}
# The watchfrr and zebra daemons are always started.
#
bgpd=yes
        {{</ file >}}

1. Restart the FRR service:

        sudo systemctl restart frr.service

## Configure Elastic IP

With FRR installed on your Linode, you can now apply the required configurations to enable Elastic IP(s).

{{< note >}}
Prior to starting this section, ensure that **you have received a `DC_ID` and an `ELASTIC_IP` from Linode Support**. You need these values to configure Elastic IP on a Linode. Refer to the table below for details on each configuration value.

| Value to replace in the configuration template | Description |
| :-------: | :-------: |
| `DC_ID` | The ID number of this data center. |
| `ELASTIC_IP` | The Elastic IP address to assign to this Linode. |
| `NEIGHBOR_IP` | This is the Linode's IPv4 address (non-Elastic IP address), which determines the `peer-group HOST` setting. Enter the first 3 octets of the Linode's IPv4 address followed by a `1`. For example, if the Linode's IPv4 address is `192.0.2.0`, the value to enter is `192.0.2.1`.|

When you configure Elastic IP you need to define the Linode's _ROLE_ within the configuration as `primary` or `secondary`.

- `primary`: All requests are routed to this Linode's Elastic IP address, as long as the Linode is running.
- `secondary`: If the `primary` Linode fails, all requests are routed to this Linode's Elastic IP address, as long as the Linode is running.

| Information | Value to replace in the configuration template |
| :-------: | :-------: |
| This Linode's role (`primary` or `secondary`) | `ROLE` |

{{</ note >}}

1. The template below includes the Elastic IP configurations to apply to your Linode. Ensure you replace any instances of `[NEIGHBOR_IP]`, `[DC_ID]`, and `[ROLE]` with the values sent to you by Linode support and by referencing the table above. Store the template with your replaced values somewhere that you can easily access later. In the next step, you copy the contents of the template and paste them into the VTY interactive shell.

      {{< file "~/elastic.conf">}}
hostname atl-bgp-1.kfubes.com

router bgp 65[DC_ID]5
coalesce-time 1000
bgp bestpath as-path multipath-relax
neighbor HOST peer-group
neighbor HOST remote-as external
neighbor HOST capability extended-nexthop
neighbor [NEIGHBOR_IP] peer-group HOST
address-family ipv4 unicast
  network [ELASTIC_IP]/32 route-map $ROLE
  redistribute static
exit-address-family
route-map primary permit 10
set large-community 65[DC_ID]:[DC_ID]:1
route-map secondary permit 10
set large-community 65[DC_ID]5:[DC_ID]:2
      {{</ file >}}

1. Run the VTY shell:

        sudo vtysh

1. Enter configuration mode:

        conf t

1. Copy the contents of your template configuration file and paste them into the VTY shell:

1. Tell the VTY shell that you are done entering your configurations:

        end

1. Write your configurations to VTY:

        write

1. Verify that the configurations you entered were correctly written by showing VTY's running configuration:

        show running-config

1. Exit out of the VTY shell:

        q

1. Configure the Linode's interface(s) with the Elastic IP:

    > **Debian 10 & Ubuntu 18.04**
    >
    > Edit your Linode's `/etc/network/interfaces` file with the following entries. Replace `[ELASTIC_IP]` with the Elastic IPv4 address:
    > {{< file >}}
up   ip addr add [ELASTIC_IP]/24 dev eth0 label eth0:1
down ip addr del [ELASTIC_IP]/24 dev eth0 label eth0:1
        {{</ file >}}
    >If you configured more than one Elastic IP on your Linode, you can add additional interface entries to your network interfaces configuration file as follows:

    >{{< file >}}
up   ip addr add [ELASTIC_IP]/24 dev eth0 label eth0:1
down ip addr del [ELASTIC_IP]/24 dev eth0 label eth0:1
up   ip addr add [ELASTIC_IP]_2/24 dev eth0 label eth0:2
down ip addr del [ELASTIC_IP]_2/24 dev eth0 label eth0:2
        {{</ file >}}
    > **Ubuntu 20.04**
    >
    > Edit your Linode's `/etc/systemd/network/05-eth0.network` file by adding an `Address` entry for the Elastic IP. Replace `[ELASTIC_IP]` with the Elastic IPv4 address:
    > {{< file >}}
[Match]
Name=eth0
...
Address=[ELASTIC_IP]/24
        {{</ file >}}
    >If you configured more than one Elastic IP on your Linode, you can add additional interface entries to your network interfaces configuration file as follows:

    >{{< file >}}
Address=[ELASTIC_IP]/24
Address=[ELASTIC_IP]_2/24
    {{</ file >}}
    > **CentOS 8**
    >
    > Edit your Linode's `/etc/sysconfig/network-scripts/ifcfg-eth0` file with the following entry. Replace `[ELASTIC_IP]` with the Elastic IPv4 address:
    > {{< file >}}
IPADDR1=[ELASTIC_IP]
PREFIX1="24"
        {{</ file >}}
    >If you configured more than one Elastic IP on your Linode, you can add additional interface entries to your network interfaces configuration file as follows:

    >{{< file >}}
IPADDR1=[ELASTIC_IP]
PREFIX1="24"

IPADDR2=[ELASTIC_IP]_2
PREFIX2="24"
    {{</ file >}}

1. Apply the `eth0` network interface configuration:

    > **Debian 10, Ubuntu 18.04 & CentOS 8**
    >
        sudo ifdown eth0 && sudo ifup eth0
    > **Ubuntu 20.04**
    >
        systemctl restart systemd-networkd

1. Ensure that your network interface configurations have been applied as expected:

        ip a | grep inet

    You should see a similar output:

    {{< output >}}
inet 127.0.0.1/8 scope host lo
inet6 ::1/128 scope host
inet 192.0.2.0/24 brd 192.0.2.255 scope global dynamic eth0
inet 203.0.113.0/24 scope global eth0:1
inet6 2600:3c04::f03c:92ff:fe7f:5774/64 scope global dynamic mngtmpaddr
inet6 fe80::f03c:92ff:fe7f:5774/64 scope link
    {{</ output >}}

1. Restart the FRR service:

        sudo systemctl restart frr.service

### Test Elastic IPs

Depending on how you configured your Linode(s) and Elastic IP(s), testing steps may vary. In general, you can use the `ping` command to test sending packets to your configured Elastic IP(s):

    ping 203.0.113.0

- For example, if you have two Linodes configured with the same Elastic IP:
    - ping the Elastic IP when both Linodes are up. The packets should be received by the primary Linode.
    - shut down the primary Linode and ping the Elastic IP. The packets should be received by the secondary Linode.

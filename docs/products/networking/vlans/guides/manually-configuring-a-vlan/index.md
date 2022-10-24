---
title: Manually Configuring a VLAN on a Linode
tab_group_main:
    weight: 20
modified: 2022-08-23
---

When a VLAN is assigned to a network interface and given an IPAM address, the Compute Instance should automatically be able to communicate over that private network. This is due to [Network Helper](/docs/guides/network-helper/), which is enabled by default on most instances. For compatible distributions, Network Helper adjusts the internal network configuration files. Any network interfaces defined in the Compute Instance's selected [Configuration Profile](/docs/guides/linode-configuration-profiles/) (including those with VLANs attached) are automatically configured.

This guide is for users that have disabled Network Helper on their Compute Instance or prefer not to assign an IPAM address within the Configuration Profile. In these cases, the Compute Instance's internal network configuration files must be manually adjusted. The following sections will cover the changes needed to manually configure a VLAN on common Linux distributions.

## Ubuntu 18.04 and Later

Ubuntu Server 18.04 and later versions use Netplan to configure networking, with systemd-networkd operating as the backend. Network configuration files for each interface are located in `/etc/systemd/network/`:

- **eth0**: `/etc/systemd/network/05-eth0.network`
- **eth1**: `/etc/systemd/network/05-eth1.network`
- **eth2**: `/etc/systemd/network/05-eth2.network`

### Manually Configuring a VLAN in Ubuntu 18.04

1. Verify that Network Helper is disabled to avoid it overwriting any changes on the next reboot. See [Enable or Disable Network Helper](/docs/guides/network-helper/#enable-or-disable-network-helper) for information on adjusting Network Helper settings.

1. Log in to the Compute Instance via [Lish](/docs/guides/using-the-lish-console/). While it's possible to make changes while logged in over SSH, you may get disconnected if changes are made to the network interface assigned to the public internet.

1. Using your preferred editor, edit the configuration file corresponding to the network interface assigned to the VLAN. Replace the contents with the following text. Adjust `Name` to match the correct network interface and `Address` to match your desired IPAM address:

        [Match]
        Name=eth1

        [Network]
        DHCP=no
        Address=10.0.0.1/24

1. Restart the instance or run `sudo netplan apply` for the updated network configuration to take effect.

## Debian and Ubuntu 16.04

Debian 7 and above, as well as Ubuntu 16.04, all use ifup and ifdown to manage networking. Network configuration files are located within `/etc/network/`:

- **Main configuration file**: `/etc/network/interfaces`
- Alternative configuration files for each network interface:
    - **eth0**: `/etc/network/interfaces.d/eth0`
    - **eth1**: `/etc/network/interfaces.d/eth1`
    - **eth2**: `/etc/network/interfaces.d/eth2`

### Manually Configuring a VLAN in Debian and Ubuntu 16.04

1. Check if Network Helper is enabled or disabled. See [Enable or Disable Network Helper](/docs/guides/network-helper/#enable-or-disable-network-helper) for information on locating this setting. Network Helper should not interfere with any of the changes below, but its status may impact the files that you're able to edit.

1. Log in to the Compute Instance via [Lish](/docs/guides/using-the-lish-console/). While it's possible to make changes while logged in over SSH, you may get disconnected if changes are made to the network interface assigned to the public internet.

1. Edit (or create) the specific configuration file corresponding to the network interface assigned to the VLAN. Replace the contents with the following text. Replace `eth1` with the correct network interface and adjust `address` to match your desired IPAM address:

        auto eth1

        iface eth1 inet static
            address 10.0.0.1/24

    If Network Helper is disabled, the above changes can be made directly to the main configuration within `/etc/network/interfaces` if preferred.

1. Restart the instance or run the following series of commands for the updated network configuration to take affect. Replace `eth1` with the correct network interface and replace the reference to the IP address as needed:

        sudo ip address flush dev eth1
        sudo ip address add 10.0.0.1/24 dev eth1
        sudo ip link set eth1 up

## CentOS and Fedora

CentOS 7 and above, as well as Fedora, all use systemd-networkd and NetworkManager. Network configuration files for each interface are located in `/etc/sysconfig/network-scripts/`:

- **eth0**: `/etc/sysconfig/network-scripts/ifcfg-eth0`
- **eth1**: `/etc/sysconfig/network-scripts/ifcfg-eth1`
- **eth2**: `/etc/sysconfig/network-scripts/ifcfg-eth2`

### Manually Configuring a VLAN in CentOS and Fedora

1. Verify that Network Helper is disabled to avoid it overwriting any changes on the next reboot. See [Enable or Disable Network Helper](/docs/guides/network-helper/#enable-or-disable-network-helper) for information on adjusting Network Helper settings.

1. Log in to the Compute Instance via [Lish](/docs/guides/using-the-lish-console/). While it's possible to make changes while logged in over SSH, you may get disconnected if changes are made to the network interface assigned to the public internet.

1. Edit the configuration file corresponding to the network interface assigned to the VLAN. Replace the contents with the following text. If needed, adjust `NAME` and `DEVICE` to match the correct network interface and `IPADDR0` and `PREFIX0` to match your desired IPAM address and prefix:

        DEVICE="eth1"
        NAME="eth1"

        ONBOOT="yes"
        BOOTPROTO="none"

        IPADDR0=10.0.0.1
        PREFIX0=24

1. Restart the Linode or run `sudo ifup eth1` for the updated network configuration to take effect.

## Verify and Test the Updated Configuration

1. First, verify that the network configuration was correctly updated and applied. Run the following `ip address` command, replacing `eth1` with the name of the network interface that was modified.

        ip address show eth1 | grep inet

    This command will output the IP addresses configured for the specified network interface, as seen in the example output below. If no IP address appears or if the wrong IP address appears, review the steps outlined above for your distribution and verify that they were all completed. Restarting the Compute Instance, making sure that Network Helper is disabled, may also force the changes to take affect.

    {{< output >}}
inet 10.0.0.1/24 brd 10.0.0.255 scope global eth1
    {{< /output >}}

2. Test the VLAN's connectivity by pinging another Linode within the VLAN's private network, using the IPAM address assigned to it. For more details, see the *Testing Connectivity* section of the [Getting Started with VLANs](/docs/guides/getting-started-with-vlans/#testing-connectivity) guide.

## Additional Configuration Instructions

For more details regarding manually configuring IP addresses, see the [Manual Network Configuration on a Compute Instance](/docs/guides/manual-network-configuration/) guide.
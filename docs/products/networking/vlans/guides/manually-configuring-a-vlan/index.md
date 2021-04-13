---
title: Manually Configuring a VLAN on a Linode
tab_group_main:
    weight: 20
---

{{< content "vlans-beta-note-shortguide" >}}

For compatible distributions, [Network Helper](/docs/guides/network-helper/) automatically adjusts the internal network configuration files on a Linode to accomodate the network interfaces defined within the selected [Configuration Profile](/docs/guides/disk-images-and-configuration-profiles/#configuration-profiles). If a VLAN is assigned to a network interface and given an IPAM address, the Linode should automatically be able to communicate over that private network.

For users that have disabled Network Helper on their Linode or prefer not to assign an IPAM address within a Linode's Configuration Profile, the Linode's internal network configuration files must be manually adjusted. This guide will discuss the changes that need to be made to enable a VLAN on common Linux distributions.

## Ubuntu 18.04 and later

Ubuntu Server 18.04 and later versions use Netplan to configure networking, with systemd-networkd operating as the backend. Network configuration files for each interface are located in `/etc/systemd/network/`:

- **eth0**: `/etc/systemd/network/05-eth0.network`
- **eth1**: `/etc/systemd/network/05-eth1.network`
- **eth2**: `/etc/systemd/network/05-eth2.network`

### Manually configuring a VLAN in Ubuntu 18.04

1. Verify that Network Helper is disabled to avoid it overwritting any changes on the next reboot. See [Network Helper Settings](/docs/guides/network-helper/#network-helper-settings) for information on adjusting Network Helper settings.

1. Log in to the Linode via [Lish](/docs/guides/using-the-linode-shell-lish/). While it's possible to make changes while logged in over SSH, you may get disconnected if changes are made to the network interface assigned to the public internet.

1. Uisng your preferred editor, edit the configuration file corresponding to the network interface assigned to the VLAN. Replace the contents with the following text. Adjust `Name` to match the correct network interface and `Address` to match your desired IPAM address:

        [Match]
        Name=eth1

        [Network]
        DHCP=no
        Address=10.0.0.1/24

1. Restart the Linode or run `sudo netplan apply` for the updated network configuration to take effect. 

2. Test the VLAN's connectivity by following the Testing Connectivity section of the [Getting Started with VLANs](http://localhost:1313/docs/guides/getting-started-with-vlans/#testing-connectivity) guide.

## Debian and Ubuntu 16.04

Debian 7 and above, as well as Ubuntu 16.04, all use ifup and ifdown to manage networking. Network configuration files are located within `/etc/network/`:

- **Main configuration file**: `/etc/network/interfaces`
- Alternative configuration files for each network interface:
    - **eth0**: `/etc/network/interfaces.d/eth0`
    - **eth1**: `/etc/network/interfaces.d/eth1`
    - **eth2**: `/etc/network/interfaces.d/eth2`

### Manually configuring a VLAN in Debian and Ubuntu 16.04

1. Check if Network Helper is disabled or disabled. See [Network Helper Settings](/docs/guides/network-helper/#network-helper-settings) for information on locating this setting.

1. Log in to the Linode via [Lish](/docs/guides/using-the-linode-shell-lish/). While it's possible to make changes while logged in over SSH, you may get disconnected if changes are made to the network interface assigned to the public internet.

1. Edit (or create) the specific configuration file corresponding to the network interface assigned to the VLAN. Replace the contents with the following text. Replace `eth1` with the correct network interface and adjust `address` to match your desired IPAM adress:

        auto eth1

        iface eth1 inet static
            address 10.0.0.1/24

    If Network Helper is disabled, the above changes can be made directly to the main configuraiton within `/etc/network/interfaces` if preferred.

1. Restart the Linode or run the following series of commands for the updated network configuration to take affect. Replace `eth1` with the correct network interface and any references to the IP address:

        sudo ip addr flush dev eth1
        sudo ip addr add 10.0.0.1/24 dev eth1
        sudo ip link set eth1 up

2. Test the VLAN's connectivity by following the Testing Connectivity section of the [Getting Started with VLANs](http://localhost:1313/docs/guides/getting-started-with-vlans/#testing-connectivity) guide.

## Centos and Fedora

Centos 7 and above, as well as Fedora, all use systemd-networkd and NetworkManager. Network configuration files for each interface are located in `/etc/sysconfig/network-scripts/`:

- **eth0**: `/etc/sysconfig/network-scripts/ifcfg-eth0`
- **eth1**: `/etc/sysconfig/network-scripts/ifcfg-eth1`
- **eth2**: `/etc/sysconfig/network-scripts/ifcfg-eth2`

### Manually configuring a VLAN in Centos and Fedora

1. Verify that Network Helper is disabled to avoid it overwritting any changes on the next reboot. See [Network Helper Settings](/docs/guides/network-helper/#network-helper-settings) for information on adjusting Network Helper settings.

1. Log in to the Linode via [Lish](/docs/guides/using-the-linode-shell-lish/). While it's possible to make changes while logged in over SSH, you may get disconnected if changes are made to the network interface assigned to the public internet.

1. Edit the configuration file corresponding to the network interface assigned to the VLAN. Replace the contents with the following text. If needed, adjust `NAME` and `DEVICE` to match the correct network interface and `IPADDR0` and `PREFIX0` to match your desired IPAM address and prefix:

        DEVICE="eth1"
        NAME="eth1"

        ONBOOT="yes"
        BOOTPROTO="none"

        IPADDR0=10.0.0.1
        PREFIX0=24

1. Restart the Linode or run `sudo ifup eth1` for the updated network configuration to take effect. 

2. Test the VLAN's connectivity by following the Testing Connectivity section of the [Getting Started with VLANs](http://localhost:1313/docs/guides/getting-started-with-vlans/#testing-connectivity) guide.
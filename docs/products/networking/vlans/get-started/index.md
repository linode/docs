---
title: Get Started
description: "Use the Linode Cloud Manager to create a Virtual LAN and attach a Linode to it. When a Linode is attached to a Virtual LAN and configured, it has access to the Virtual LAN's secure and private network."
tab_group_main:
    weight: 20
---

{{< content "vlans-beta-note-shortguide" >}}

1. Log into your [Linode Beta Cloud Manager](https://cloud.beta.linode.com/dashboard) account.

1. From the **Navigation Menu**, click on **Network** and select **Virtual LANs**.

1. Click on the **Create a VLAN** button.

1. From the **Create a Virtual LAN** form, provide values for the following options:

    * **Region**: select the data center region for your Virtual LAN. This option is required.

    {{< note >}}
A Linode can only be attached to a Virtual LAN that resides within the same data center region as the Linode
{{</ note >}}

    * **Label**: provide a name for your Virtual LAN. This name is how you identify your Virtual LAN in the Cloud Manager.

    * **IP Range / Netmask**: Specify the IP range with a netmask (`10.0.0.0/16`) or starting and ending IPs (`10.0.0.0-10.0.0.20`)

    * **Linodes**: Select the Linode(s) to assign to this Virtual LAN. Only Linodes within the same data center region as your Virtual LAN appear in the list. You can skip this option and assign a Linode to your Virtual LAN later, if desired.


    * **Reboot**: Select this option to reboot your Linode(s) after creating the VLAN. When attaching a VLAN to existing Linodes, you **must reboot the Linode** in order to apply the new network interfaces to a Linode's Network Interface configuration file and to the Linode's boot configuration profile.

    Once your Linode is attached to a Virtual LAN, you must configure it so that it can communicate across the Virtual LAN's Private Network. Based on your Linode's distribution use one of the following guides to complete your Linode's configuration:

    - [Configure Your CentOS 8 Linode](/docs/products/networking/vlans/guides/configure-your-linode-centos-8/)
    - [Configure Your Ubuntu 20.04 Linode](/docs/products/networking/vlans/guides/configure-your-linode-ubuntu-20-04/)
    - [Configure Your Debian 10 Linode](/docs/products/networking/vlans/guides/configure-your-linode-debian-10/)

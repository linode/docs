---
title: Get Started
description: "SEO description for this product's Get Started page."
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

    * **Linodes**: Select the Linode(s) to assign to this Virtual LAN. Only Linodes within the same data center region as your Virutal LAN appear in the list. You can skip this option and assign a Linode to your Virtual LAN later, if desired.


    * **Reboot**: Select this option to reboot your Linode(s) after creating the VLAN. When attaching a VLAN to existing Linodes, you **must reboot the Linode** in order to apply the new network interfaces to a Linode's Network Interface configuration file and to the Linode's boot configuration profile.

    Proceed to the [Configure your Linode to Use Your Private Network] section to update your Linode's Network Interface configuration file with the new private interface.

    {{< note >}}
Your Linode cannot communicate over the VLAN's private network until a private network interface is applied to it.
{{</ note >}}

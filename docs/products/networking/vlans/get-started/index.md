---
title: Get Started
description: "Use the Linode Cloud Manager to create a VLAN and attach a Linode to it. When a Linode is attached to a VLAN and configured, it has access to the VLAN's secure and private network."
tab_group_main:
    weight: 20
---

VLANs can be attached to a Linode in one of two methods:

- As part of the configuration options when [creating a new Linode](#attaching-a-vlan-when-creating-a-linode).
- Through an [existing Linode's Configuration Profile](#attaching-a-vlan-to-an-existing-linode)

This guide covers implementing both of these methods using the Cloud Manager. While VLANs can also be created and administered through the API and CLI, that's beyond the scope of this guide.

## Attaching a VLAN When Creating a Linode

1. Log into your [Linode Cloud Manager](https://cloud.linode.com/dashboard) account.

1. At the top of the page, click **Create** and select **Linode**.

1. Fill out all required and desired configuration options in the form that appears, until reaching the **Attach a VLAN** section.

    {{< note >}}
For more information on the configuration options that appear when creating a Linode, see our [Getting Started Guide](/docs/guides/getting-started/).
{{< /note >}}

1. In the *Label* field, enter the label for the VLAN or select a pre-existing VLAN from the dropdown menu. If a VLAN corresponding with the label doesn't yet exist, it will be created.

1. If using [Network Helper](https://www.linode.com/docs/guides/network-helper/) to manage the Linode's internal network configuration (the default for most new Linodes), enter an *IPAM Address*. Doing so will allow the newly created Linode to automatically communicate with other Linodes attached to the same VLAN. The IPAM address should be unique to avoid conflicts in the case other machines share the same address. An example of a valid IPAM address is `10.0.0.1/24`.

1. Complete the Linode Creation form with any additional add-ons and settings you'd like to add. Then click the **Create Linode** button.

By default, the public IP address (and, if added, the private IP address) of the Linode is configured on the *eth0* network interface. The VLAN, if one was attached, is configured on the *eth1* network interface. These network interfaces can be removed or modified by editing the [Configuration Profile](/docs/guides/linode-configuration-profiles/#editing-a-configuration-profile).

## Attaching a VLAN to an Existing Linode

Adding a VLAN to an existing Linode is done by editing the Linode's existing Configuration Profile or creating a new one.

1. Log in to the [Linode Cloud Manager](https://www.cloud.linode.com).

1. Click the **Linodes** link in the sidebar and select a Linode.

1. Within the Linode's detail page, navigate to the **Configurations** tab.

1. Select the **Edit** button next to the configuration profile you'd like to edit or click **Add Configuration** to create a new profile.

1. Scroll down to the **Network Interfaces** section.

1. Select the dropdown menu under the interface you would like to configure your VLAN for, and select *VLAN*.

1. A secondary menu will appear with the option to enter a required Label, or optional IPAM address.

1. In the *Label* field, enter the label for the VLAN or select a pre-existing VLAN from the dropdown menu. If a VLAN corresponding with the label doesn't yet exist, it will be created.

1. If using [Network Helper](https://www.linode.com/docs/guides/network-helper/) to manage the Linode's internal network configuration (the default for most new Linodes), enter an *IPAM Address*. Doing so will allow the newly created Linode to automatically communicate with other Linodes attached to the same VLAN. The IPAM address should be unique to avoid conflicts in the case other machines share the same address. An example of a valid IPAM address is `10.0.0.1/24`.

1. If editing an existing configuration, click on the **Save Changes** button to save the changes and attach the VLAN. If creating a new configuration, change any other settings as needed and click **Add Configuration** to create the new configuration profile.

1. Once saved, the list of configuration profiles will be updated. Select the **Boot** button next to the desired configuration profile. This will reboot using the specified configuration and will attach the VLAN to the Linode.
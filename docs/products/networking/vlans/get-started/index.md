---
title: Get Started
description: "Use the Linode Cloud Manager to create a Virtual LAN and attach a Linode to it. When a Linode is attached to a Virtual LAN and configured, it has access to the Virtual LAN's secure and private network."
tab_group_main:
    weight: 20
---

{{< content "vlans-beta-note-shortguide" >}}

Vlans are created and implemented via three different methods when using the Linode Cloud Manager. These methods are as follows:

- As part of the configuration when [Creating a New Linode]().
- By creating a new [Configuration Profile]().
- By editing a pre-existing configuration profile.

## Creating or Applying a VLAN When Creating a Linode

1. Log into your [Linode Cloud Manager](https://cloud.linode.com/dashboard) account.

1. At the top of the page, click `Create` and select `Linode`.

1. Fill out all required and desired configuration options in the form that appears, until reaching the `Attach a VLAN` section.

    {{< note >}}
For more information on the configuration options that appear when creating a Linode, see our [Getting Started Guide](/docs/guides/getting-started/).
{{< /note >}}

1. Enter a Label for a new VLAN or select a valid pre-existing VLAN from the dropdown menu. If the field does not have any information entered in manually, then no VLAN will be configured. If any new information is entered in the Label field, then a VLAN will automatically be created and configured on the `Eth1` interface automatically when the Linode is created. If a pre-existing VLAN is selected, then it will be automatically configured when the Linode is created.

1. Complete the Linode Creation form with any additional add-ons and settings you'd like to add, and select the `Create Linode` button to complete the Linode creation process.

{{< note >}}
When creating or applying a pre-existing vlan to a new Linode, the eth0 interface will always be accessible both to and from the public internet by default. This can be changed at any time by editing the [Configuration Profile](/docs/guides/disk-images-and-configuration-profiles/#editing-a-configuration-profile)
{{< /note >}}

## Adding a VLAN When Creating a New Configuration Profile

1. Log in to the [Linode Cloud Manager](https://www.cloud.linode.com).

1. Click the `Linodes` link in the sidebar.

1. Select a Linode. The Linode's detail page appears.

1. Click on the **Configurations** tab.

1. Select the `Add Configuration` Button.

1. Find the `Network Interfaces` section.

1. Select the dropdown menu under the interface you would like to configure your VLAN for, and select `VLAN`.

1. A secondary menu will appear with the option to enter a required Label, or optional IPAM address.

1. Enter a Label for a new VLAN or select a valid pre-existing VLAN from the dropdown menu. If the field does not have any information entered in manually, then no VLAN will be configured. If any new information is entered in the Label field, then a VLAN will automatically be created and configured for the selected interface.

1. Click on the `Add Configuration` button to add the new VLAN.

1. Once the configuration profile has been updated, select the **Boot** button next to the new configuration profile. This will reboot using the new configuration profile and apply the new VLAN configuration to the Linode.

## Adding a VLAN When Editing a Configuration Profile

1. Log in to the [Linode Cloud Manager](https://www.cloud.linode.com).

1. Click the `Linodes` link in the sidebar.

1. Select a Linode. The Linode's detail page appears.

1. Click on the **Configurations** tab.

1. Select the `Edit` button next to the configuration profile you'd like to add a VLAN to.

1. Find the `Network Interfaces` section.

1. Select the dropdown menu under the interface you would like to configure your VLAN for, and select `VLAN`.

1. A secondary menu will appear with the option to enter a required Label, or optional IPAM address.

1. Enter a Label for a new VLAN or select a valid pre-existing VLAN from the dropdown menu. If the field does not have any information entered in manually, then no VLAN will be configured. If any new information is entered in the Label field, then a VLAN will automatically be created and configured for the selected interface.

1. Click on the `Edit Configuration` button to add the new VLAN.

1. Once the configuration profile has been updated, select the **Boot** button next to the edited configuration profile on the following page. This will reboot using the edited configuration profile and apply the new VLAN configuration to the Linode.

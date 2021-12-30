---
author:
  name: Linode
  email: docs@linode.com
title: Detach a Linode From Your VLAN
description: "If the Linode no longer requires access a VLAN's private network, the VLAN can be detached by editing the Linode's Configuration Profile."
---

If the Linode no longer requires access a VLAN's private network, the VLAN can be detached by editing the Linode's [Configuration Profile](/docs/guides/linode-configuration-profiles/#editing-a-configuration-profile)

1. Log in to the [Linode Cloud Manager](https://www.cloud.linode.com).

1. Click the **Linodes** link in the sidebar and select a Linode.

1. Within the Linode's detail page, navigate to the **Configurations** tab.

1. Select the **Edit** button next to the configuration profile you'd like to edit.

1. Scroll down to the **Network Interfaces** section.

1. Locate the network interface corresponding to the VLAN you wish to remove. From that interface's drop down menu, select *None* to detach the VLAN from this Linode. If no other network interface is set to *Public Interface*, that option may also be selected to provide public internet access to this Linode.

1. Click on the **Save Changes** button to confirm the changes to the configuration profile.

1. [Reboot the Linode](/docs/products/tools/cloud-manager/guides/cloud-reboot-linode/) to save your changes and completely remove the VLAN configuration. Linodes that have had their configuration profiles updated but have not been rebooted will still be configured to use the VLAN. A reboot is required for any change to take place.

   {{< note >}}
If a VLAN is not applied to any Linode service, it will automatically be deleted.
{{< /note >}}
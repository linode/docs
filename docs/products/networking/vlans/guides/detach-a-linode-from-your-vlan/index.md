---
author:
  name: Linode
  email: docs@linode.com
title: Detach a Linode From Your VLAN
description: "If you no longer want a Linode to have access to a Virutal LAN''s private network,use this guide to learn how to detach a Linode from a Virtual LAN."
---

{{< content "vlans-beta-note-shortguide" >}}

## From the Configuration Details Page

1. Log in to the [Linode Cloud Manager](https://www.cloud.linode.com).

1. Click the `Linodes` link in the sidebar.

1. Select a Linode. The Linode's detail page appears.

1. Click on the **Configurations** tab.

1. Select the `Edit` button next to the configuration profile you'd like to detatch a VLAN from.

1. Find the `Network Interfaces` section.

1. From the dropdown menu under the interface you'd like to remove the VLAN configuration from, select 'None' or 'Public Internet'.

   {{< note >}}
Only the eth0 interface can be used to access the public internet.
{{< /note >}}

1. Click on the `Edit Configuration` button to confirm the changes to the configuration profile.

1. [Reboot the Linode](/docs/products/tools/cloud-manager/guides/cloud-reboot) to save your changes and completely remove the VLAN configuration. Linodes that have had their configuration profiles updated but have not been rebooted will still be configured to use the VLAN. A reboot is required for any change to take place.

   {{< note >}}
If a VLAN is not applied to any Linode Service, it will automatically be deleted.
{{< /note >}}
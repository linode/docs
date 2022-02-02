---
author:
  name: Linode
  email: docs@linode.com
title: "Manage Access Controls"
description: ""
---

Each Managed Database cluster has its own access control list, which grants specific IP addresses or ranges access to the database. By default, all connections (both public and private) are blocked unless they appear on this list.

## View Access Controls

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and select **Databases** from the left navigation menu.

1. Select your Managed Database from the list. This opens the detail page for that database cluster.

1. Within the *Summary* tab, access controls appears under the *Access Controls* section. A list of each allowed IP address or range is displayed.

## Add or Modify IP Addresses or Ranges

1. View your access controls by following the steps within [View Access Controls](#view-access-controls).

1. Click the **Manage Access Controls** button to open the *Manage Access Controls* panel.

1. The list of allowed IP addresses and ranges appears under the *Inbound Sources* section. From here, you can perform the following actions:

    - **Add** a new entry by clicking the **Add an IP** button and enter your desired IP address or range into the new field.
    - **Modify** an existing entry by updating it with the new IP address or range.
    - **Remove** an entry by clicking the **X** icon to the right of the entry.

1. Once you've made your changes, click the **Update Inbound Sources** button to commit them.

## Remove an IP Address or Range

1. View your access controls by following the steps within [View Access Controls](#view-access-controls).

1. Find the IP address or range you wish to remove and click the **Remove** link. A confirmation dialog appears.

1. Click the **Remove IP Address** button to confirm and remove the address.
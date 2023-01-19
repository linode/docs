---
title: Set User Permissions
title_meta: Set User Permissions on a Linode User Account
description: "Learn how to manage permissions and restrict user access on a Linode account."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-11-21
tags: ["linode platform","users","user permissions"]
---

Setting permissions restricts a user's access to certain areas of the Linode Cloud Manager. For example, you could limit a user to a single Linode and prevent them from removing the Linode or adding extra services. Don't worry--these settings aren't permanent. You can add or remove access for a user at any time in the future. User Permissions are divided into three categories. **Global Permissions**, **Billing Access**, and **Specific Permissions**.

Here's how to set a user's access permissions:

1. Click the **Account** link in the sidebar.
1. Click the **Users & Grants** tab.
1. Click the **User Permissions** link for the desired user.
1. Toggle the **Full Account Access** button off to limit the user's account access and show permission categories.

    ![Configure User permissions in the Linode Cloud Manager.](accounts-user-permissions.png "Configure User permissions in the Linode Cloud Manager")

1. Toggle the boxes in the **Global Permissions** section to allow the user to add [Linodes](/docs/products/platform/get-started/), [NodeBalancers](/docs/products/networking/nodebalancers/get-started/), [Domains](/docs/products/networking/dns-manager/), [Longview](/docs/guides/what-is-longview/) clients, [Block Storage Volumes](/docs/products/storage/block-storage/) to the account, create [StackScripts](/docs/products/tools/stackscripts/), frozen [Images](/docs/products/tools/images/), access all billing information, and cancel the entire account. These permissions are exactly as described and will not add any additional permissions.

    {{< note >}}
    Granting access to settings denoted with a dollar sign ($) allows the user to perform actions that incur billing costs, such as adding or resizing a Linode.
    {{< /note >}}

1. Select an option for **Billing Access** permissions. These options are as follows:

    - **None**: The user is unable to view any billing information. This does not prevent a user from creating billable resources, which are instead applied as **Global Permissions** in the previous step.
    - **Read Only**: The user can [View Invoices](/docs/products/platform/billing/guides/view-history/) and [Access Billing Info](/docs/products/platform/billing/guides/access-billing/).
    - **Read-Write**: The user has full access to [Billing Information](/docs/products/platform/billing/guides/access-billing/), can make payments, edit billing information, view billing information, receive copies of all invoices, and receive email related to payments.

1. Select the appropriate permissions (None, Read Only, or Read-Write) in the **Specific Permissions** section to allow the user to access individual Linodes, StackSripts, Block Storage Volumes, Images, NodeBalancers, and Domains. Unlike Global Permissions, Specific Permissions can apply to individual resources and not the service as a whole. Specific Permission options are as follows:

    - **None**: The user can not view or otherwise interact with the selected resource.
    - **Read Only**: The user can view the resource and all of its associated information typically visible within the Linode Manager, however they can not otherwise interact with it through Cloud Manager.
    - **Read-Write**: The user has full access to the selected resource, and can make any changes that only an administrator is otherwise able to. This includes resource deletion, cloning, and all other applicable edits.

1. When you have finished configuring the user's permissions, click **Save**. The user's permissions are saved and effective immediately.
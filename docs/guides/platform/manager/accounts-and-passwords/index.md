---
slug: accounts-and-passwords
author:
  name: Linode
  email: docs@linode.com
description: Our guide to managing accounts and passwords.
keywords: ["accounts", "passwords", "Linode Cloud Manager", "manager"]
tags: ["linode platform","security","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/platform/accounts-and-passwords/','/accounts-and-passwords/','/platform/manager/accounts-and-passwords/','/platform/manager/accounts-and-passwords-classic-manager/','/platform/manager/accounts-and-passwords-new-manager/']
modified: 2018-08-23
modified_by:
  name: Linode
published: 2012-04-03
title: Accounts and Passwords
---

![Accounts and Passwords](Accounts_and_Passwords_smg.jpg)

Maintaining your user Linode Cloud Manager accounts, passwords, and contact information is just as important as administering your Linode. This guide shows you how to control access to the Cloud Manager, update your contact information, and modify account passwords. Note that the information in this guide applies to the Cloud Manager only, except for the section on resetting the root password.

## Users and Permissions

You can grant other people access to your Linode Cloud Manager account by creating *users* and assigning *permissions* to restrict access to certain areas of the control panel. Adding users and configuring permissions is useful for groups that need to grant all team members access to the Linode Cloud Manager, or organizations that just want their billing department to have a separate account to receive invoices and billing information.

 {{< note >}}
A single user was automatically created for your account when you signed up for Linode. If you will be the only person accessing the Linode Cloud Manager, you won't need to create any other users on your account.
{{< /note >}}

### Adding a User

{{< content "accounts-add-users-shortguide" >}}

### Permissions Explained

Setting permissions restricts a user's access to certain areas of the Linode Cloud Manager. For example, you could limit a user to a single Linode and prevent them from removing the Linode or adding extra services. Don't worry--these settings aren't permanent. You can add or remove access for a user at any time in the future. User Permissions are divided into three categories. **Global Permissions**, **Billing Access Permissions**, and **Specific Permissions**.

Here's how to set a user's access permissions:

1.  Click the **Account** link in the sidebar.
1.  Click the **Users** link.
1.  Select the user from the list.
1.  Select the **User Permissions** tab.

    [![Configure User permissions in the Linode Cloud Manager.](accounts-user-permissions-small.png "Configure User permissions in the Linode Cloud Manager")](accounts-user-permissions.png)

1.  Toggle the boxes in the **Global Permissions** section to allow the user to add [Linodes](/docs/getting-started/), [NodeBalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers/), [Domains](/docs/networking/dns/dns-manager-overview/#domain-zones), [Longview](/docs/platform/longview/longview/) clients, [Block Storage Volumes](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/) to the account, create [StackScripts](/docs/platform/stackscripts/), frozen [Images](/docs/platform/disk-images/linode-images/), access all billing information, and cancel the entire account. These permissions are exactly as described and will not add any additional permissions.

    {{< note >}}
Granting access to settings denoted with a dollar sign ($) will allow the user to perform actions that incur billing costs, such as adding or resizing a Linode.
{{< /note >}}

1. Select an option for Billing Access permissions. These options are as follows:

  - **None**: The user will be unable to view any billing information. This does not prevent a user from creating billable resources, which are instead applied as **Global Permissions** in the previous step.
  - **Read Only**: The user can [View Billing Info](https://www.linode.com/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#accessing-billing-history), and will receive copies of all invoices. Will also receive emails related to payments.
  - **Read-Write**: The user has full access to [Billing Information](https://www.linode.com/docs/platform/billing-and-support/manage-billing-in-cloud-manager/#accessing-billing-history), can make payments, edit billing information, view billing information, will receive copies of all invoices, and will receive email related to payments.

1.  Select the appropriate permissions (None, Read Only, or Read-Write) in the **Specific Permissions** section to allow the user to access individual Linodes, StackSripts, Block Storage Volumes, Images, NodeBalancers and Domains. Unlike Global Permissions, Specific Permissions can apply to individual resources and not the service as a whole. Specific Permission options are as follows:

    - **None**: The user will not be able to view or otherwise interact with the selected resource.
    - **Read Only**: The user can view the resource and all of it's associated information typically visible within the Linode Manager, however they will not be able to otherwise interact with it any way.
    - **Read-Write**: The user has full access to the selected resource, and can make any changes that only an administrator is otherwise able to. This includes resource deletion, cloning, and all other applicable edits.

1.  When you have finished configuring the user's permissions, click **Save**. The user's permissions will be saved and effective immediately.

### Recovering a Lost Username

{{< content "accounts-recover-username-shortguide" >}}

### Removing a User

{{< content "accounts-remove-user-shortguide" >}}

### Changing a Username

{{< content "accounts-change-username-shortguide" >}}

## Email Addresses and Contact Information

Linode uses the contact information on file in your account to notify and bill you. Keep this information current to prevent service interruptions. It's especially important to keep your email address current.

Both the *Account & Billing* and *My Profile* pages have an email address field. The email addresses saved on these pages receive different notifications, as described in the following sections. If you are the only user, you should enter your email address on both webpages. If there are multiple users, verify that the primary account holder's email address is current on the *Account* webpage.

{{< note >}}
Only unrestricted users can receive threshold notification emails.
{{</ note >}}

### Updating Contact Information

{{< content "accounts-update-contact-info-shortguide" >}}

### Changing Your Email Address

{{< content "accounts-change-email-shortguide" >}}

## Passwords

Creating strong passwords is essential to protecting your Linode and your Linode Cloud Manager account. If you suspect that an unauthorized user has gained access to one of your accounts, you should change the password immediately. Use the instructions in this section to change your Linode Cloud Manager password and reset the password for the `root` user on the Linode.

### Changing or Resetting Your Linode Cloud Manager Password

{{< content "change-cloud-manager-password-shortguide" >}}

### Resetting the Root Password

{{< content "accounts-reset-root-password-shortguide" >}}

## Next Steps

You can take additional steps to secure your Linode Cloud Manager account by enabling the two-factor authentication and IP address whitelisting features. You can also configure security event notifications and disable API access. For instructions, see the [Security](/docs/security/linode-manager-security-controls/) guide.

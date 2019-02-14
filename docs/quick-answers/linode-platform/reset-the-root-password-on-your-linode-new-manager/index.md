---
author:
  name: Nick Brewer
  email: docs@linode.com
description: 'Change the root user password for the Linux environment running on your Linode.'
keywords: ["linux", "linode", "cloud manager", "image"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-02-11
modified_by:
  name: Linode
published: 2019-02-11
title: Reset the Root Password on your Linode
hiddenguide: true
---

This QuickAnswer will show you how to reset the root password for the Linux distribution running on your Linode. See our [Accounts and Passwords](/docs/platform/manager/accounts-and-passwords-new-manager/#resetting-the-root-password) guide for additional information.

1.  Click the **Linodes** link in the sidebar links.
2.  Select a Linode to pull up its page.
3.  Power off your Linode by selecting the **Power Off** option from the dropdown menu. A progress bar will appear that you can use to monitor the status of this operation.
    ![Shut down your Linode to reset the root password](reset-password-power-down-linode.png)
4.  Click the **Settings** tab.
5.  Under Settings, click on **Reset Root Password** to expand its menu.
6.  Select your primary disk from the **Disk** dropdown menu.
7.  Enter a new password for the `root` user in the **Password** field.
8.  Click **Save**
9.  From the dropdown menu, select **Power On** to power on your Linode.

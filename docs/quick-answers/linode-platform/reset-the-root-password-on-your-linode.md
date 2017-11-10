---
author:
  name: Nick Brewer
  email: docs@linode.com
description: 'Change the root user password for the Linux environment running on your Linode.'
keywords: ["linux", "linode manager", "image"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-05-08
modified_by:
  name: Linode
published: 2017-05-08
title: Reset the Root Password on your Linode
---

This QuickAnswer will show you how to reset the root password for the Linux distribution running on your Linode. See our [Accounts and Passwords](/docs/platform/accounts-and-passwords#resetting-the-root-password) guide for additional information.

1.  Click the **Linodes** tab in the Linode Manager.
2.  Select a Linode to pull up its Dashboard.
3.  Click **Shut down** to turn off your Linode. Monitor the *Host Job Queue* for a message indicating that your Linode has shut down.
4.  Click the **Rescue** tab.
5.  Select your primary disk from the **Filesystem** menu.
6.  Enter a new password for the `root` user in the **New Password** field.
7.  Click **Reset Root Password**. The Linode's dashboard appears.
8.  Click **Boot** to turn on your Linode.

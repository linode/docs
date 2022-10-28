---
slug: reset-the-root-password-on-your-linode
author:
  name: Nick Brewer
  email: docs@linode.com
description: 'Change the root user password for the Linux environment running on your Linode.'
keywords: ["linux", "linode", "cloud manager", "image"]
tags: ["linode platform","cloud manager","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-02-11
modified_by:
  name: Linode
published: 2019-02-11
title: Reset the Root Password on your Linode
aliases: ['/quick-answers/linode-platform/reset-the-root-password-on-your-linode-classic-manager/','/quick-answers/linode-platform/reset-the-root-password-on-your-linode/','/quick-answers/linode-platform/reset-the-root-password-on-your-linode-new-manager/']
---

This Quick Answer will show you how to reset the root password for the Linux distribution running on your Linode.

1.  Click the **Linodes** link in the sidebar.
1.  Select a Linode by clicking its label. The Linode's details page appears.
1.  Click **Power Off** at the top of the details page to turn off your Linode if it is powered on. Ensure the Linode displays its status as "OFFLINE" before proceeding.
1.  Click the **Settings** tab underneath the detail page Summary.
1.  Under the **Reset Root Password** panel, select your primary disk from the **Disk** menu.
1.  Enter a new password for the `root` user in the **Password** field.
1.  Click **Save**. The Linode's dashboard appears.
1.  Click **Power On** to turn on your Linode.

Now you can use the new `root` user password to log in to your Linode. See [Connecting to Your Linode via SSH](/docs/guides/set-up-and-secure/#connect-to-the-instance) for more information about connecting. If you are unable to connect with the `root` credentials via SSH, try connecting with [Lish](/docs/guides/lish/) instead. If you are able to connect via Lish but not SSH, you may need to troubleshoot your SSH configuration and firewall rules.

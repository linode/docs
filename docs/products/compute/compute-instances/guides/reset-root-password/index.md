---
title: Reset the Root Password on a Compute Instance
description: "Change the root user password for the Linux environment running on a Compute Instance."
keywords: ["linux", "linode", "cloud manager", "image"]
tags: ["linode platform","cloud manager","security"]
published: 2019-02-11
modified: 2012-01-18
modified_by:
  name: Linode
aliases: ['/quick-answers/linode-platform/reset-the-root-password-on-your-linode-classic-manager/','/quick-answers/linode-platform/reset-the-root-password-on-your-linode/','/quick-answers/linode-platform/reset-the-root-password-on-your-linode-new-manager/','/guides/reset-the-root-password-on-your-linode/']
---

All Compute Instances that are deployed within a supported distribution image allow you to reset the root password for the installed Linux system. This is useful if you ever lock yourself out of your instance's root account or are simply rotating your password for security.

1. Log in to the [Cloud Manager](https://cloud.linode.com), click the **Linodes** link in the sidebar, and select a Compute Instance from the list.

1. Click the **Power Off** button in the upper right of the Compute Instance's dashboard or within the **ellipsis** menu. Wait until the Compute Instance has been fully powered off before continuing to the next step.

    ![Screenshot of a Compute Instance Details page with the Power Off button highlighted](compute-instance-power-off.png)

1. Navigate to the **Settings** tab.

1. Scroll down to the **Reset Root Password** section.

    ![Screenshot of the Reset Root Password form](reset-root-password.png)

1. Select your primary disk from the **Disk** dropdown menu.

1. Enter a new password for the root user in the **New Root Password** field.

1. Click **Save** to make the change.

1. Click **Power On** button to turn on your Compute Instance.

Now you can use the new work when logging in as root on your Compute Instance's installed system. See [Connecting to Your Compute Instance via SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance) for more information about connecting. If you are unable to connect with the root credentials via SSH, try connecting with [Lish](/docs/products/compute/compute-instances/guides/lish/) instead. If you are able to connect via Lish but not SSH, you may need to troubleshoot your SSH configuration and firewall rules.
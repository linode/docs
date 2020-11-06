---
author:
  name: Linode
  email: docs@linode.com
title: Attach a Linode to Your VLAN
---

{{< content "vlans-beta-note-shortguide" >}}

## Attach an Existing Linode to Your Virtual LAN

1. Log into your [Linode Beta Cloud Manager](https://cloud.beta.linode.com/dashboard) account.

1. From the **Navigation Menu**, click on **Network** and select **Virtual LANs**.

1. Viewing the Virtual LANs listing page, click on the **Details** link to view more information about your Virtual LAN.

1. On your Virtual LAN's details page, click on the **Attach a Linode** button.

1. From the **Attach a Linode** pane, click on the **Linodes** text entry box and begin typing the name of the Linode to attach to your VLAN or select it from the dropdown list that appears.

1. Click on the **Attach** button. Your Linode is now attached to your Virtual LAN.

    Once your Linode is attached to a Virtual LAN, you must configure it so that it can communicate across the Virtual LAN's Private Network. Based on your Linode's distribution use one of the following guides to complete your Linode's configuration:

    - [Configure Your CentOS 8 Linode](/docs/products/networking/vlans/guides/configure-your-linode-centos-8/)
    - [Configure Your Ubuntu 20.04 Linode](/docs/products/networking/vlans/guides/configure-your-linode-ubuntu-20-04/)
    - [Configure Your Debian 10 Linode](/docs/products/networking/vlans/guides/configure-your-linode-debian-10/)

## Create a New Linode That is Attached to Your Virtual LAN

1. Log in to the [Linode Beta Cloud Manager](https://cloud.beta.linode.com/dashboard).

1. From the top of the Cloud Manager, click on the **Create** button and select **Linode**.

1. Select the [Distribution](/docs/quick-answers/linux/choosing-a-distribution/), [Marketplace One Click App](/docs/platform/one-click/how-to-use-one-click-apps-at-linode/), [StackScript](/docs/products/tools/stackscripts/guides/stackscripts-create-linode), [Image](/docs/platform/disk-images/linode-images/), [Backup](/docs/products/storage/backups/guides/restore-to-a-new-linode/), or [existing Linode](/docs/guides/clone-your-linode/) you would like to use.

1. Choose the region where you would like your Linode to reside.

    {{< note >}}
Your Linode must reside in the same data center as your Virtual LAN. During the beta, Virtual LANs are available in the Toronto, Canada; Mumbai, India; and Sydney, Australia data centers.
    {{</ note >}}

1. Select a Linode plan.

1. Give your Linode a label. This is a name to help you easily identify it within the Cloud Manager’s Dashboard. If desired, assign a tag to the Linode in the **Add Tags** field.

1. Create a root password for your Linode in the **Root Password** field. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique.

1. From the **Optional Add-ons** panel, click on the **Virtual LAN** dropdown and select the Virtual LAN to attach the new Linode to.

1. Click **Create**. You are directed back to the Linode's page, and this page reports the status of your Linode as it boots up.

    Your new Linode is created and attached to the Virtual LAN you selected. Once your Linode is attached to a Virtual LAN, you must configure it so that it can communicate across the Virtual LAN's Private Network. Based on your Linode's distribution use one of the following guides to complete your Linode's configuration:

    - [Configure Your CentOS 8 Linode](/docs/products/networking/vlans/guides/configure-your-linode-centos-8/)
    - [Configure Your Ubuntu 20.04 Linode](/docs/products/networking/vlans/guides/configure-your-linode-ubuntu-20-04/)
    - [Configure Your Debian 10 Linode](/docs/products/networking/vlans/guides/configure-your-linode-debian-10/)
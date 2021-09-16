---
slug: magicspam-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "MagicSpam is a powerful anti-spam and email security solution that integrates with popular control panels, like cPanel and Plesk. This tutorial walks you through deploying MagicSpam using the Linode Marketplace."
keywords: ['cPanel','Plesk','Email','Spam']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying Magicspam through the Linode Marketplace"
aliases: ['/guides/deploying-magicspam-marketplace-app/']
external_resources:
- '[MagicSpam](https://magicspam.com/)'
---

MagicSpam is a powerful anti-spam and email security solution for Linux systems. It integrates directly with popular control panels, such as cPanel and Plesk. It's primary function is to stop inbound spam from entering your server right at the SMTP layer, which lowers bandwidth and overhead. It also secure mailboxes on your server from being compromised and used to send outbound spam.

MagicSpam installs directly onto an email server without any need to change A/MX records to protect unlimited users and domains. MagicSpam also integrates natively into many control panel interfaces and comes equipped with log and statistic modules to help with the management of an email server.

{{< note >}}
In an effort to fight spam, Linode restricts outbound connections on ports 25, 465, and 587 on all Linodes for new accounts created after November 5th, 2019. For more information, please see [Sending Email on Linode](https://www.linode.com/docs/email/running-a-mail-server/#sending-email-on-linode).
{{</ note >}}

## Deploying the MagicSpam Marketplace App

{{< content "deploy-marketplace-apps">}}

As MagicSpam is designed to integrate and run alongside with Control Panels, the MagicSpam App also deploys the selected control panel (cPanel or Plesk). Both of these control panels may require purchasing a license. Additionally, a MagicSpam license key is required to deploy MagicSpam on Linode, which you can purchase through the [MagicSpam Store](https://www.magicspam.com/store.php).

If you want to deploy MagicSpam onto an existing Linode Compute Instance, do not follow this guide. Instead, install MagicSpam by following one of the below guides:

* [MagicSpam for cPanel Installation Guide](https://www.magicspam.com/download/products/MSWHMC/InstallationGuide.pdf)
* [MagicSpam for Plesk Installation Guide](https://www.magicspam.com/download/products/MSPPRO/InstallationGuide.pdf)

### MagicSpam Configuration Options

You can configure your MagicSpam App by providing values for the following fields:

 **Field** | **Description**
------------------ | ---------------
 **Control Panel** | The Control Panel to deploy alongside MagicSpam. *Required*.
 **MagicSpam License Key** | Your MagicSpam license key to for the selected Control Panel. *Required*.
 **Hostname** | Your Linode’s hostname. *Required*.

### Linode Configuration Options

After providing the App-specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | CentOS 7 is currently the only image supported by the MagicSpam Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). MagicSpam can be supported on any size Linode, but we suggest you deploy your MagicSpam App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

After providing all required Linode Options, click on the **Create** button. **Your MagicSpam App will complete installation anywhere between 10-15 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

After both the Control Panel and MagicSpam has finished installing, you will be able to access MagicSpam through the control panel interface.

### cPanel

1.  Log into the WHM interface according to the [cPanel Guide](https://www.linode.com/marketplace/apps/cpanel/cpanel/).

2.  Navigate to the MagicSpam Interface.

        WHM Interface >> Plugins >> MagicSpam

3.  Register your MagicSpam license key.

4.  Set the administrator email address.

### Plesk

1.  Log into the Plesk interface according to the [Plesk Guide](https://www.linode.com/marketplace/apps/plesk/plesk/).

2.  Navigate to the MagicSpam Interface.

        Plesk Interface >> Tools & Settings >> Additional Services >> MagicSpam

3.  Register your MagicSpam license key.

4.  Set the administrator email address.

## Next Steps

For more on MagicSpam, check out the following resources:

* [Purchase MagicSpam License Key](https://www.magicspam.com/store)
* [Visit the MagicSpam Official Forums](https://forums.magicspam.com)
* [MagicSpam for cPanel](https://www.magicspam.com/anti-spam-protection-cpanel.php)
* [MagicSpam for Plesk](https://www.magicspam.com/anti-spam-protection-plesk.php)

{{< content "marketplace-update-note-shortguide">}}
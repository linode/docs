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

As MagicSpam is designed to integrate and run alongside with Control Panels, the MagicSpam App also deploys the selected control panel (cPanel or Plesk). Both of these control panels may require purchasing a license. Additionally, a MagicSpam license key is required to deploy MagicSpam on Linode, which you can purchase through the [MagicSpam Store](https://www.magicspam.com/store.php).

If you want to deploy MagicSpam onto an existing Linode Compute Instance, do not follow this guide. Instead, install MagicSpam by following one of the below guides:

* [MagicSpam for cPanel Installation Guide](https://www.magicspam.com/download/products/MSWHMC/InstallationGuide.pdf)
* [MagicSpam for Plesk Installation Guide](https://www.magicspam.com/download/products/MSPPRO/InstallationGuide.pdf)

## Deploying the MagicSpam Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 10-15 minutes after the Linode has finished provisioning.**

## Configuration Options

### MagicSpam Options

You can configure your MagicSpam App by providing values for the following fields:

 **Field** | **Description**
------------------ | ---------------
 **Control Panel** | The Control Panel to deploy alongside MagicSpam. *Required*.
 **MagicSpam License Key** | Your MagicSpam license key to for the selected Control Panel. *Required*.
 **Hostname** | Your Linode’s hostname. *Required*.

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** CentOS 7
- **Recommended minimum plan:** All plan types and sizes can be used.

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
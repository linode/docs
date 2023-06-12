---
description: "This guide shows you how to install and configure MagicSpam, a powerful anti-spam and email security solution using the Linode One-Click App Marketplace."
keywords: ['cPanel','Plesk','Email','Spam']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-08-13
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy MagicSpam through the Linode Marketplace"
aliases: ['/guides/deploying-magicspam-marketplace-app/','/guides/magicspam-marketplace-app/']
external_resources:
- '[MagicSpam](https://magicspam.com/)'
authors: ["Linode"]
---

[MagicSpam](https://magicspam.com/) is a powerful anti-spam and email security solution for Linux systems. It integrates directly with popular control panels, such as cPanel and Plesk. It's primary function is to stop inbound spam from entering your server right at the SMTP layer, which lowers bandwidth and overhead. It also secure mailboxes on your server from being compromised and used to send outbound spam.

MagicSpam installs directly onto an email server without any need to change A/MX records to protect unlimited users and domains. MagicSpam also integrates natively into many control panel interfaces and comes equipped with log and statistic modules to help with the management of an email server.

{{< note >}}
[MagicSpam](https://magicspam.com/store.php), [cPanel](https://cpanel.net/pricing/), and [Plesk](https://www.plesk.com/pricing/) all require a valid license. You can view and purchase licenses individually from each of their respective stores. Licenses are not available directly through Linode.
{{< /note >}}

{{< content "email-warning-shortguide">}}

If you want to deploy MagicSpam onto an existing Linode Compute Instance, do not follow this guide. Instead, install MagicSpam by following one of the below guides:

- [MagicSpam for cPanel Installation Guide](https://www.magicspam.com/download/products/MSWHMC/InstallationGuide.pdf)
- [MagicSpam for Plesk Installation Guide](https://www.magicspam.com/download/products/MSPPRO/InstallationGuide.pdf)

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** MagicSpam should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS 7
- **Recommended minimum plan:** All plan types and sizes can be used.

### MagicSpam Options

- **Control Panel** *(required)*: The Control Panel to deploy alongside MagicSpam.
- **MagicSpam License Key** *(required)*: Your MagicSpam license key to for the selected Control Panel.
- **Hostname** *(required)*: Enter a hostname for your new instance. See [Configure a Custom Hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname) for examples.

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

- [Purchase MagicSpam License Key](https://www.magicspam.com/store)
- [Visit the MagicSpam Official Forums](https://forums.magicspam.com)
- [MagicSpam for cPanel](https://www.magicspam.com/anti-spam-protection-cpanel.php)
- [MagicSpam for Plesk](https://www.magicspam.com/anti-spam-protection-plesk.php)

{{< content "marketplace-update-note-shortguide">}}
---
slug: deploy-magicspam-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'Powerful Anti-Spam and Email Security solution for Control Panels (cPanel and Plesk).'
og_description: 'Powerful Anti-Spam and Email Security solution for Control Panels (cPanel and Plesk).'
keywords: ['cPanel','Plesk','Email','Spam']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-19
modified_by:
  name: Linode
title: "Deploy Magicspam With Marketplace Apps"
h1_title: "How to Deploy Magicspam With Marketplace Apps"
enable_h1: true
external_resources:
- '[MagicSpam](https://magicspam.com/)'
---

## MagicSpam Marketplace App

Powerful Anti-Spam and Email Security solution for Control Panels (cPanel and Plesk).

Stop inbound spam from entering your server right at the SMTP layer to lower bandwidth and overhead, as well as secure mailboxes on your server from being compromised and used to send outbound spam.

Based on the same security technologies used by ISP's and Telco's, MagicSpam is more than just an anti-spam solution and also an email security solution which allows email administrators to configure rule-based and reputation-based policies, blacklists and whitelists, rate limiters, and authentication restrictions.

MagicSpam installs directly onto the email server without any need to change A/MX records to protect unlimited users and domains. MagicSpam also integrates natively into the control panel interface and comes equipped with log and statistic modules to help with the management of an email server. MagicSpam is deployed in over 83 countries worldwide and protects millions of mailboxes everyday.

Get started with MagicSpam on Linode with the MagicSpam One-Click App.

### Deploy a MagicSpam Marketplace App

As MagicSpam is designed to integrate and run alongside with Control Panels, the MagicSpam One-Click App will also deploy the selected Control Panel (e.g. cPanel or Plesk). Additionally, a MagicSpam license key is required to deploy MagicSpam on Linode, which you can purchase through the [MagicSpam Webstore](https://www.magicspam.com/store.php). Please make sure to purchase the appropriate license key for the selected Control Panel.

If you want to deploy MagicSpam onto an existing Linode running a supported Control Panel, please install MagicSpam on your server after purchasing the license key by following these installation guides:

* [MagicSpam for cPanel Installation Guide](https://www.magicspam.com/download/products/MSWHMC/InstallationGuide.pdf)
* [MagicSpam for Plesk Installation Guide](https://www.magicspam.com/download/products/MSPPRO/InstallationGuide.pdf)

For more information about MagicSpam on these Control Panels, please check out the following resources:

* [MagicSpam for cPanel](https://www.magicspam.com/anti-spam-protection-cpanel.php)
* [MagicSpam for Plesk](https://www.magicspam.com/anti-spam-protection-plesk.php)

**Note About Email at Linode:** In an effort to fight spam, Linode restricts outbound connections on ports 25, 465, and 587 on all Linodes for new accounts created after November 5th, 2019. For more information, please see [Sending Email on Linode](https://www.linode.com/docs/email/running-a-mail-server/#sending-email-on-linode).

{{< content "deploy-marketplace-apps">}}

### MagicSpam Options
You can configure your MagicSpam App by providing values for the following fields:

 **Field** | **Description**
------------------ | ---------------
 **Control Panel** | The Control Panel to deploy alongside MagicSpam. *Required*.
 **MagicSpam License Key** | Your MagicSpam license key to for the selected Control Panel. *Required*.
 **Hostname** | Your Linode’s hostname. *Required*.

### Linode Options

After providing the App-specific options, provide configurations for your Linode server:

<!-- Be sure to edit the Select an Image and Linode Plan to match app's needs -->

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | CentOS 7 is currently the only image supported by the MagicSpam Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). MagicSpam can be supported on any size Linode, but we suggest you deploy your MagicSpam App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

<!-- the following disclaimer lets the user know how long it will take
     to deploy the app -->
After providing all required Linode Options, click on the **Create** button. **Your MagicSpam App will complete installation anywhere between 10-15 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

After both the Control Panel and MagicSpam has finished installing, you will be able to access MagicSpam through the control panel interface.

### cPanel

1. Log into the WHM interface according to the [cPanel Guide](https://www.linode.com/marketplace/apps/cpanel/cpanel/).

2. Navigate to the MagicSpam Interface.

    WHM Interface >> Plugins >> MagicSpam

3. Register your MagicSpam license key.

4. Set the administrator email address.

### Plesk

1. Log into the Plesk interface according to the [Plesk Guide](https://www.linode.com/marketplace/apps/plesk/plesk/).

2. Navigate to the MagicSpam Interface.

    Plesk Interface >> Tools & Settings >> Additional Services >> MagicSpam

3. Register your MagicSpam license key.

4. Set the administrator email address.

## Next Steps

For more on MagicSpam, check out the following resources:

* [Purchase MagicSpam License Key](https://www.magicspam.com/store)
* [Visit the MagicSpam Official Forums](https://forums.magicspam.com)
{{< content "marketplace-update-note">}}
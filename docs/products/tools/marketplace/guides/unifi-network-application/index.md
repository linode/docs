---
description: "Deploy UniFi Network Controller, a multi-use networking control panel with a powerful application suite designed to optimize home and business networks with ease, on a Linode Compute Instance."
keywords: ['UniFi','Network','gateway', 'routing']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-06
modified: 2022-09-22
modified_by:
  name: Linode
title: "Deploy the UniFi Network Application through the Linode Marketplace"
authors: ["Linode"]
---

The [UniFi Network Application](https://help.ui.com/hc/en-us/articles/1500012237441-UniFi-Network-Use-the-UniFi-Network-Application) is a versatile control panel developed by [Ubiquiti](https://www.ui.com/). It simplifies network management across regions, customizes access to Wi-Fi networks, and more. Manage and apply updates to UniFi networking devices to ensure your networks are performant and secure.

{{< note >}}
When self-hosting the UniFi Network Application, you are responsible for the security of your server. Follow best practices for securing, updating, and backing up the software on your Compute Instance. See [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/).
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** The UniFi Network Application should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended plan:** All plan types can be used.

## Getting Started after Deployment

### Accessing the UniFi Network Application

1. Open your web browser and navigate to `https://[domain]`, where *[domain]* can be replaced with your Compute Instance's rDNS domain or, if you entered one, the domain you specified when you deployed the instance. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing the rDNS value for your public IPv4 address. The URL is also visible when logging into the new Compute Instance for the first time, either through [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance).

    ```output
    The installation is now complete, and you can access the
    UniFi Network Controller GUI from https://192-0-2-163.ip.linodeusercontent.com
    We recommend using the GUI to complete your configurations of the service
    ```

2. Within the setup screen that appears, enter a name for the Network Application. This is primarily used for managing multiple networks.

    ![Screenshot of the UniFi Network name page](UniFi-network-name.png)

3. After the network has been named, create a username and password and click **Next**. This login will be used from the UniFi Network Application panel and unifi.ui.com

    ![Screenshot of the Ubiquiti Account page](UniFi-account-login.jpg)

4. Once you are logged in to the UniFi Network Application, you can create and manage your UniFi Network. For more information on using UniFi Network Application, see the [official documentation](https://help.ui.com/hc/en-us/articles/1500012237441-UniFi-Network-Use-the-UniFi-Network-Application).

{{< content "marketplace-update-note-shortguide">}}
---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy a Terraria server on Linode using One-Click Apps.'
keywords: ['terraria','one-click app', 'game server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-05
modified: 2019-04-05
modified_by:
  name: Linode
title: "Deploy a Terraria Server with One-Click Apps"
contributor:
  name: Linode
external_resources:
 - '[The Official Terraria Wiki](https://terraria.gamepedia.com/Terraria_Wiki)'
---

## Terraria One-Click App

Terraria is a two-dimensional sandbox game in which players explore the world, collect resources, build structures, and battle enemies in procedurally generated environments. In Terraria a player begins by digging for ore, and the further they dig the more adventure they find. Multiplayer mode can be either cooperative or PvP.

Hosting your own Terraria server gives you control over the world, the players, and the objectives. Your world, your rules.

### Deploy a Terraria One-Click App

{{< content "deploy-one-click-apps">}}

The [Terraria Options](#terraria-options) section of this guide provides details on all available configuration options for this app.

### Terraria Options

You can configure your Terraria One-Click App by providing values for the following fields:

| **Field** | **Description** |
|-----------|-----------------|
| **Steam Username** | Your [Steam username](https://store.steampowered.com). [Steam Guard](https://support.steampowered.com/kb_article.php?ref=4020-ALZM-5519) must be turned off. *Required*. |
| **Steam Password** | Your Steam password. *Required*. |
| **World Name** | The name of the Terraria virtual [world](https://terraria.gamepedia.com/World). *Advanced Configuration*. |
| **Server Password** | The server's password, if you would like to make the server password protected. *Advanced Configuration*. |
| **Message of the Day** | The message of the day text that is displayed whenever a player logs on to the server. *Advanced Configuration*. |
| **Difficulty Level** | The world difficulty level. *Advanced Configuration*. |
| **Maximum Players** | The maximum amount of players allowed on the server. A number from 1-255. *Advanced Configuration*. |
| **Port** | The port number that the game server listens on. *Advanced Configuration*. |
| **Seed** | A [random seed](https://terraria.gamepedia.com/World_Seed) used by the world generation algorithm to create a unique world. For example: `qazwsx123`. *Advanced Configuration*. |


### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Select an Image** | Debian 9 is currently the only image supported by the Terraria One-Click App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Your Terraria server should be sized based on the amount of traffic you are expecting on your server as well as the game play performance you are looking for. We recommend using a 8GB Linode as the smallest plan to ensure good performance of your game server. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Terraria should install between 5-15 minutes after your Linode has successfully provisioned**.

## Getting Started after Deployment

After Terraria has finished installing, you will be able to access your server by copying your Linode's IPv4 address from the [Linode Cloud Manager](https://cloud.linode.com) and then connecting to it within the game.

{{< caution >}}
You must disable Steam Guard to connect to your Terraria server. If you don't disable Steam Guard, you may be locked out of your account and will need to reset your password. To disable Steam Guard, navigate to the Steam Preferences menu, then open the **Account** pane. Click on **Manage Steam Guard Account Security**, then click on **Turn Steam Guard off**.
{{</ caution >}}

To find your Linode's IPv4 address and connect to it:

1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

2. Find the Linode you just created when deploying your app and select it.

3. Navigate to the **Networking** tab.

4. Your IPv4 address will be listed under the **Address** column in the **IPv4** table.

5. Copy the IPv4 address.

6. Open Terraria, then click **Multiplayer**.

7. Click on **Join via IP**.

8. You will be prompted to select a character, or create a new one if you don't have any characters. Select or create a character.

9. Type in your IP address, then click **Accept**.

    ![Enter your Linode's IP address.](terraria-one-click-enter-ip.png)

10. You will be prompted to enter in your Terraria One-Click App's port. If you did not specify a different port in the advanced configuration section, use port 7777. Click **Accept**.

    ![Enter the Terraria server's port](terraria-one-click-enter-port.png)

    You will be connected to the server.

### Software Included

The Terraria One-Click App will install the following required software on your Linode:

| **Software** | **Description** |
|--------------|-----------------|
| [**Terraria**](https://terraria.org) | Game server. |
| [**LinuxGSM**](https://linuxgsm.com) | A command line tool for the deployment and management of Linux game servers. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Port 7777, unless otherwise specified, will allow outgoing and incoming tcp and udp traffic. |
| [**Fail2ban**](https://www.fail2ban.org/wiki/index.php/Main_Page) | Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. |

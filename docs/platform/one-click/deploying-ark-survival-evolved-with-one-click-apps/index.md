---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy a ARK: Survival Evolved Server on Linode using One-Click Apps.'
keywords: ['ark','survival evolved','one-click apps', 'server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-03
modified: 2019-03-03
modified_by:
  name: Linode
title: "Deploy an ARK: Survival Evolved Server with One-Click Apps"
contributor:
  name: Linode
external_resources:
 - '[The Official ARK: Survival Evolved Wiki](https://ark.gamepedia.com/ARK_Survival_Evolved_Wiki)'
---

## Ark: Survival Evolved One-Click App

ARK: Survival Evolved is a multiplayer action-survival game released in 2017. The game places you on a series of fictional islands inhabited by dinosaurs and other prehistoric animals. In ARK, the main objective is to survive. ARK is an ongoing battle where animals and other players have the ability to destroy you. To survive, you must build structures, farm resources, breed dinosaurs, and even set up trading hubs with neighboring tribes.

Hosting an ARK server gives you control of the entire game. You can define the leveling speed, the amount of players, and the types of weapons that are available.

### Deploy an ARK: Survival Evolved One-Click App

{{< content "deploy-one-click-apps">}}

The [ARK Options](#ark-options) section of this guide provides details on all available configuration options for this app.

### ARK Options

You can configure your ARK One-Click App by providing values for the following fields:

| **Field**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | **Description** |
|-----------|-----------------|
| **RCON Password** | Your password for [RCON](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol), a protocol which allows ARK administrators to remotely execute commands on the game server. *Required*. |
| **Server Name** | Your ARK server's name. *Advanced Configuration*. |
| **Message of the Day** | A message that is displayed whenever a player logs on to the server. *Advanced Configuration*. |
| **Server Password** | Your ARK server's password, if you want the game server to be password protected. *Advanced Configuration*. |
| **Hardcore Mode Enabled** | Enables Hardcore mode, which resets a player to level 1 after dying. *Advanced Configuration*. |
| **XP Multiplier** | Increases or decreases the amount of experience awarded for various actions. *Advanced Configuration*. |
| **Server PvE** | Disables player vs player combat and enables player vs environment combat. *Advanced Configuration*. |

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Select an Image** | Debian 9 is currently the only image supported by ARK: Survival Evolved One-Click Apps, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Your ARK server should be sized based on the amount of traffic you are expecting on your server as well as the game play performance you are looking for. We recommend using a 8GB Linode as the smallest plan to ensure good performance of your game server. A 8GB Dedicated plan will provide better game performance as well. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **ARK should install between 5-15 minutes after your Linode has successfully provisioned**.

## Getting Started After Deployment

Ensure that you have [installed Steam](https://store.steampowered.com/about/) on your personal computer and bought the ARK: Survival Evolved game on your Steam account before getting started with this section.

After the Ark: Survival Evolved Server One-Click App has finished installing, you will be able to access your server by copying your Linode's IPv4 address and entering it into the favorite servers list in your computer's Steam client:

1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

1. Find the Linode you just created when deploying your app and select it.

1. Navigate to the **Networking** tab.

1. Your IPv4 address will be listed under the **Address** column in the **IPv4** table. Copy the address.

1. On your personal computer, open Steam. Click on **View > Servers**, then click on the **Favorites** tab.

    ![The Steam favorite servers dialog box.](ark-one-click-steam-favorite-servers.png)

1. Click on **Add a Server**, then paste in your Linode's IP address. Click on **Add This Address to Favorites**.

    ![Add your server to your list of favorite servers.](ark-one-click-add-server.png)

1.  Once you have added your Linode's IP address to your Steam favorites list, open ARK: Survival Evolved. Click on **Join ARK**. At the bottom of the screen, click on the **Session Filter** drop down list and select **Favorites**. Your ARK Linode should appear:

    ![ARK server list containing the Linode that was added to Steam favorites.](ark-one-click-session-filter.png)

    Click on the server and then select **Join** at the bottom of the screen. You will be loaded into your server.

### Software Included

The ARK: Survival Evolved One-Click App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**ARK: Survival Evolved**](https://store.steampowered.com/app/346110/ARK_Survival_Evolved/) | Game server. |
| [**LinuxGSM**](https://linuxgsm.com) | A command line tool for the deployment and management of Linux game servers. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 27015/udp, 7777:7778/udp and 27020/tcp will allow outgoing and incoming traffic. |
| [**Fail2ban**](https://www.fail2ban.org/wiki/index.php/Main_Page) | Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. |

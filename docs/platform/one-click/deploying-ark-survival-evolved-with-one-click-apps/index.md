---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy a ARK: Survival Evolved Server on Linode using One-Click Apps.'
keywords: ['ark','one-click', 'server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-03
modified: 2019-03-03
modified_by:
  name: Linode
title: "Deploy an ARK: Survival Evolved Server with One-Click Apps"
contributor:
  name: Linode
---

## Ark: Survival Evolved One-Click App

ARK: Survival Evolved is a multiplayer action-survival game released in 2017. The game places you on a series of fictional islands inhabited by dinosaurs and other prehistoric animals. In ARK, the main objective is to survive. ARK is an ongoing battle where animals and other players have the ability to destroy you. To survive, you must build structures, farm resources, breed dinosaurs, and even set up trading hubs with neighboring tribes.

Hosting an ARK server gives you control of the entire game. You can define the leveling speed, the amount of players, and the types of weapons that are available.

### Deploy an ARK: Survival Evolved One-Click App

{{< content "deploy-one-click-apps">}}

The [ARK Options](#ark-options) section of this guide provides details on all available configuration options for this app.

### ARK Options

You can configure your ARK: Survival Evolved App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **RCON Password** | The password for your remote console, which allows you to remotely issue commands on the ARK server. *Required*. |
| **SSH Key** | Your SSH public key. *Advanced Configuration* |
| **Server Name** | Your ARK server's name. *Advanced Configuration* |
| **Message of the Day** | The message of the day text that is displayed whenever a player logs on to the server. *Advanced Configuration* |
| **Server Password** | Your ARK server's password. *Advanced Configuration* |
| **Hardcore Mode Enabled** | Enables Hardcore mode. Resets a player to level 1 after dying. *Advanced Configuration* |
| **XP Multiplier** | Increases or decreases the amount of experience awarded for various actions. *Advanced Configuration* |
| **Server PvE** | Disables player vs player combat and enables player vs environment combat. *Advanced Configuration* |

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by ARK: Survival Evolved One-Click Apps, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Your ARK server should be sized based on the amount of traffic you are expecting on your server as well as the game play performance you are looking for. We recommend using a 8GB Linode as the smallest plan to ensure good performance of your game server. A 8GB Dedicated plan will provide better game performance as well. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **ARK should install between 5-15 minutes after your Linode has successfully provisioned**.

### Getting Started After Deployment

After Ark: Survival Evolved has finished installing, you will be able to access your server by copying your Linode's IPv4 address and entering it into your favorite servers list on [Steam](https://store.steampowered.com/about/). To find your Linode's IPv4 address and add it to your Steam favorites:

1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

1. Find the Linode you just created when deploying your app and select it.

1. Navigate to the **Networking** tab.

1. Under the **IPv4** heading, you will find your IPv4 address listed under the **Address** column.

1. Copy the IPv4 address into a browser window.

1. On your personal computer, open Steam. Click on **View > Servers**, then click on the **Favorites** tab.

    ![The Steam favorite servers dialog box.](ark-one-click-steam-favorite-servers.png)

1. Click on **Add a Server**, then paste in your Linode's IP address. Click on **Add This Adddress to Favorites**.

    ![Add your server to your list of favorite servers.](ark-one-click-add-server.png)

1.  Once you have added your Linode's IP address to your Steam favorites list, open ARK: Survival Evolved. Click on **Join ARK**. At the bottom of the screen, click on the **Session Filter** drop down list and select **Favorites**. Your ARK Linode should appear:

    {{< note >}}
You must purchase and added ARK: Survival Evolved to your Steam library, prior to completing this step.
    {{</ note >}}

    ![ARK server list containing the Linode that was added to Steam favorites.](ark-one-click-session-filter.png)

    Click on the server and then select **Join** at the bottom of the screen. You will be loaded into your server.

### Software Included

The ARK: Survival Evolved One-Click App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| **ARK: Survival Evolved** | Game server |
| **Linux GSM** | A command line tool for the deployment and management of Linux game servers. |
| **UFW** | Firewall utility. Ports 27015/udp, 7777:7778/udp and 27020/tcp will allow outgoing and incoming traffic. |
| **Fail2ban** | Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. |
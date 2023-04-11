---
description: "Deploy a Counter-Strike: Global Offensive server on Linode using Marketplace Apps."
keywords: ['counter-strike','cs', 'go','marketplace']
published: 2019-03-28
modified: 2022-05-17
modified_by:
  name: Linode
title: "Deploy Counter-Strike Global Offensive through the Linode Marketplace"
external_resources:
- '[List of CS:GO Cvar Commands to use with RCON](https://developer.valvesoftware.com/wiki/List_of_CS:GO_Cvars)'
tags: ["linode platform","marketplace","cloud-manager"]
aliases: ['/platform/marketplace/deploying-cs-go-with-marketplace-apps/', '/platform/one-click/deploying-cs-go-with-one-click-apps/','/guides/deploying-cs-go-with-one-click-apps/','/guides/deploying-cs-go-with-marketplace-apps/','/guides/counter-strike-go-marketplace-app/']
authors: ["Linode"]
---

{{< youtube aSivuBZxUgw >}}

[Counter-Strike: Global Offensive](https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/) (CS:GO) is a fast-paced first person shooter. Teams compete against each other to complete objectives or to eliminate the opposing team. A competitive match requires two teams of five players, but hosting your own server offers you control over team size and server location, so you and your friends can play with low latency. Up to 64 players can be hosted on a single server.

This Marketplace App deploys the CS:GO server software through [LinuxGSM](https://linuxgsm.com/). While no additional license is required to run the server, each client needs to have a license for the game.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Counter-Strike Global Offensive should be fully installed within 5-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 11, Ubuntu 22.04 LTS
- **Recommended minimum plan:** 4GB Dedicated CPU Compute Instance

### CS:GO Options

- **Game Server Login Token** *(required)*: A Steam game server login token. This is required to publicly list your server. To get a Steam Token, visit the [Steam Game Server Account Management](https://steamcommunity.com/dev/managegameservers) page.
- **RCON Password** *(required)*: Password for [RCON](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol), a protocol which allows CS:GO administrators to remotely execute commands on the game server. Password must be at least 6 characters and contain each of the following characters: uppercase, lowercase, numeric, and special character. *Required*.
- **Message of the Day:** The message of the day text that is displayed whenever a player logs on to the server.
- **Server Name:** Your CS:GO server's name.
- **CS:GO Server Password:** The password for the CS:GO server, if you want to make it password protected. Password must be at least 6 characters and contain each of the following characters: uppercase, lowercase, numeric, and special character.
- **Team Balance Enabled:** When enabled, automatically balances the number of players on a team.
- **Round Time Limit:** The time per round, in minutes.
- **Maximum Rounds:** The maximum amount of rounds before the map changes.
- **Buy Anywhere:** When enabled, allows teams to buy equipment from outside buy zones.
- **Friendly Fire Enabled:** Friendly fire allows teammates to damage and kill each other.

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Connect with the CS:GO Client

After CS:GO has finished installing, you will be able to access your game server by connecting to its IP address. To find your Linode's IPv4 address:

1. Click on the **Linodes** link in the [Linode Cloud Manager](https://cloud.linode.com) sidebar. You will see a list of all your Linodes.

1. Find the Linode you just created when deploying your app and select it.

1. Navigate to the **Networking** tab.

1. Your IPv4 address will be listed under the **Address** column in the **IPv4** table.

1. Copy the IPv4 address.

1. In CS:GO, use the back tick key (**&#96;**) to open the developer's console. If pressing the back tick key does not bring up the developer's console, you might need to enable it in the settings. Under *Game Settings* choose **Enable Developer's Console** and select **Yes**:

    ![Enable the developer's console if it is not currently enabled.](cs-go-enable-developer-console.png)

1. In the CS:GO developer's console, type `connect 192.0.2.240` and click **Submit**, where `192.0.2.240` is the IP address of your Linode.

    {{< note >}}
    If you included a **CS:GO Server Password** in your [CS:GO Options](#cs-go-options) when installing, submit `connect 192.0.2.240; password your_server_password` instead.
    {{< /note >}}

    ![The CS:GO developer's console.](cs-go-developers-console.png)

## Software Included

The CS:GO Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|--------------|-----------------|
| [**Counter-Strike: Global Offensive**](https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/) | Game server. |
| [**LinuxGSM**](https://linuxgsm.com) | A command line tool for the deployment and management of Linux game servers. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 27015, 27020/udp, 27005/udp, will allow outgoing and incoming traffic. |
| [**Fail2ban**](https://www.fail2ban.org/wiki/index.php/Main_Page) | Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. |

{{< content "marketplace-update-note-shortguide">}}

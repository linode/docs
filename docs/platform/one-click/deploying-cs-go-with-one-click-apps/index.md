---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy a Counter-Strike: Global Offensive on Linode using One-Click Apps.'
keywords: ['counter-strike','cs', 'go','one-click']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-28
modified: 2019-03-28
modified_by:
  name: Linode
title: "Deploy Counter-Strike: Global Offensive with One-Click Apps"
contributor:
  name: Linode
external_resources:
- '[List of CS:GO Cvar Commands to use with RCON](https://developer.valvesoftware.com/wiki/List_of_CS:GO_Cvars)'
---

## Counter-Strike: Global Offensive One-Click App

Counter-Strike: Global Offensive (CS:GO) is a fast-paced first person shooter. Teams compete against each other to complete objectives or to eliminate the opposing team.

A competitive match requires two teams of five players, but hosting your own server allows you control over team size and server location, so you and your friends can play with low latency. Up to 64 players can be hosted on a single server.

### Deploy a CS:GO One-Click App

{{< content "deploy-one-click-apps">}}

The [CS:GO Options](#cs-go-options) section of this guide provides details on all available configuration options for this app.

### CS:GO Options

You can configure your CS:GO App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Game Server Login Token** | A Steam game server login token. This is required to publicly list your server. To get a Steam Token, visit the [Steam Game Server Account Management](https://steamcommunity.com/dev/managegameservers) page. *Required*. |
| **RCON Password** | Password for RCON, which allows CS:GO administrators to remotely execute commands on the server. Password must be at least 6 characters and contain each of the following characters: uppercase, lowercase, numeric, and special character. *Required*. |
| **Your SSH public key** | Your SSH public key. *Advanced Configuration* |
| **Message of the Day** | The message of the day text that is displayed whenever a player logs on to the server. *Advanced Configuration* |
| **CS:GO Server Password** | The password for the CS:GO server if you want to make it password protected. Password must be at least 6 characters and contain each of the following characters: uppercase, lowercase, numeric, and special character. *Advanced Configuration* |
| **Team Balance Enabled** | Auto team balance automatically balances the number of players on a team. *Advanced Configuration* |
| **Round Time Limit** | Round time is the time per round, in minutes. *Advanced Configuration* |
| **Maximum Rounds** | Max rounds is the maximum amount of rounds before the map changes. *Advanced Configuration* |
| **Buy Anywhere** | Buy anywhere allows teams to buy from outside zones. *Advanced Configuration* |
| **Friendly Fire Enabled** | Friendly fire allows teammates to damage and kill each other. *Advanced Configuration* |


### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by CS:GO One-Click Apps. *Required* |
| **Region** | Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the route path between you and a data center in each specific region. *Required* |
| **Linode Plan** | Select a Linode plan. Your CS:GO server should be sized based on the amount of traffic you are expecting on your server as well, as the game play performance you are looking for. We recommend using a 4GB Linode as the smallest plan to ensure good performance of your game server. *Required* |
| **Linode Label** | Give your Linode a label. This is a name to help you easily identify it within the Cloud Manager’s Dashboard. |
| **Root Password** | Create a root password for your Linode in the Root Password field. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. *Required* |

When you've provided all required Linode Options, click on the **Create** button. **CS:GO should complete its installation between 5-15 minutes after your Linode has successfully provisioned**.

### Getting Started After Deployment

After CS:GO has finished installing, you will be able to access your game server by connecting to its IP address. To find your Linode's IPv4 address:

1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

2. Find the Linode you just created when deploying your app and select it.

3. Navigate to the **Networking** tab.

4. Under the **IPv4** heading, you will find your IPv4 address listed under the **Address** column.

5. Copy the IPv4 address.

6. In CS:GO, use the back tick key (**&#96;**) to open the developer's console. Type `connect 192.0.2.240` and click **Submit**, where `192.0.2.240` is the IP address of your Linode:

    ![The CS:GO developer's console.](cs-go-developers-console.png)

    If pressing the back tick key does not bring up the developer's console, you might need to enable it in the settings. Under *Game Settings* choose **Enable Developer's Console** and select **Yes**:

    ![Enable the developer's console if it is not currently enabled.](cs-go-enable-developer-console.png)

### Software Included

The CS:GO One-Click App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| **Counter-Strike: Global Offensive** | Game server |
| **Linux GSM** | A command line tool for the deployment and management of Linux game servers. |
| **UFW** | Firewall utility. Ports 27015, 27020/udp, 27005/udp, will allow outgoing and incoming traffic. |
| **Fail2ban** | Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. |

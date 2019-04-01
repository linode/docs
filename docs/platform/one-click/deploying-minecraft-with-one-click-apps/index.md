---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy a Minecraft server on Linode using One-Click Apps.'
keywords: ['minecraft','one-click', 'server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-01
modified: 2019-04-01
modified_by:
  name: Linode
title: "Deploy a Minecraft Server with One-Click Apps"
contributor:
  name: Linode
external_resources:

---

## Minecraft One-Click App

With over 100 million users around the world, Minecraft is the most popular online game of all time. Less of a game and more of a lifestyle choice, you and other players are free to build and explore in a 3D generated world made up of millions of mineable blocks. Collect resources by leveling mountains, taming forests, and venturing out to sea. Choose a home from the varied list of biomes like ice worlds, flower plains, and jungles. Build ancient castles or modern mega cities, and fill them with redstone circuit contraptions and villagers. Fight off nightly invasions of Skeletons, Zombies, and explosive Creepers, or adventure to the End and the Nether to summon the fabled End Dragon and the chaotic Wither. If that is not enough, Minecraft is also highly moddable and customizable. You decide the rules when hosting your own Minecraft server for you and your friends to play together in this highly addictive game.

### Deploy a Minecraft Server One-Click App

{{< content "deploy-one-click-apps">}}

The [Minecraft Options](#minecraft-options) section of this guide provides details on all available configuration options for this app.

### Minecraft Options

You can configure your Minecraft Server App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Drupal admin password** | Password for your Drupal admin profile. *Required*. |
| **Drupal admin username** | Username for your Drupal admin user. *Required*. |
| **E-Mail for your Drupal account** | E-Mail address for your Drupal admin user. *Required*. |
| **Your SSH public key** | Your SSH public key. *Advanced Configuration* |
| **Domain** | Domain for your Drupal site. Note, if you have not added DNS records for your Drupal site's domain, read our [DNS Manager](/docs/platform/manager/dns-manager/) guide for more information. *Advanced Configuration* |

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by Drupal One-Click Apps. *Required* |
| **Region** | Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the route path between you and a data center in each specific region. *Required* |
| **Linode Plan** | Select a Linode plan. Drupal is an extremely flexible CMS that can be supported on any size Linode, but we suggest you deploy your Drupal app on a Linode plan that reflects how much content you plan on featuring as well as how much traffic you expect for your site. For small websites, a 1GB Nanode is sufficient. *Required* |
| **Linode Label** | Give your Linode a label. This is a name to help you easily identify it within the Cloud Manager’s Dashboard. |
| **Root Password** | Create a root password for your Linode in the Root Password field. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. *Required* |

When you've provided all required Linode Options, click on the **Create** button. **Your Drupal app will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

### Getting Started After Deployment

After Drupal has finished installing, you will be able to access your Drupal site by copying your Linode's IPv4 address and entering it in the browser of your choice. To find your Linode's IPv4 address:

1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

2. Find the Linode you just created when deploying your app and select it.

3. Navigate to the **Networking** tab.

4. Under the **IPv4** heading, you will find your IPv4 address listed under the **Address** column.

5. Copy and paste the IPv4 address into a browser window. You should see the Drupal welcome page appear.

    Once you have accessed your Drupal site via the browser, you can log in to your Drupal site using the admin credentials you created when deploying your One-Click Drupal App and begin configuring your site.

    ![Log in to your Drupal site.](drupal-log-in.png)

### Software Included

The Drupal One-Click App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| **MySQL Server** | Database |
| **PHP 7** | Drupal is written in PHP and requires PHP to operate. |
| **Apache HTTP Server** | Web Server used to serve the Drupal site|
| **Drush** | A command line shell for Drupal |
| **Drupal 8** | Content management system |
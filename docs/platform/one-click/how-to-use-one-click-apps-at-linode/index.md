---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to deploy a One-Click App using the Linode Cloud Manager.'
keywords: ['manager','cloud','app','one click', 'marketplace']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-26
modified: 2019-03-26
modified_by:
  name: Linode
title: "How to Use Linode's One-Click Apps"
h1_title: "Using Linode's One-Click Apps"
contributor:
  name: Linode
---

![How to Use Linode's One-Click Apps](how-to-use-linode-oneclick-apps.png "How to Use Linode's One-Click Apps")

One-Click Apps help you easily deploy and configure software on a Linode from a list of various apps that are built into the Linode [Cloud Manager](https://cloud.linode.com), without the hassle of using the command line. Of course, you'll still have full access to your Linode if you want to log in to your server and have a more hands-on approach later on.

When a One-Click App is deployed, a new Linode is created and the appropriate software is installed with the configurations you provide. One-Click Apps do not install software to already-existing Linodes in your account. This guide presents instructions for where to find One-Click Apps in the Cloud Manager and how deploy WordPress blogs, WooCommerce stores, your favorite game servers, and more.

## Deploying an App

{{< content "one-click-deploy-app-shortguide" >}}

## Accessing Your App

{{< content "one-click-access-app-shortguide" >}}

## Adding a Domain Name for Your App

{{< content "one-click-add-domain-shortguide" >}}

## Connecting to your Server Remotely

Every One-Click App is deployed to its own Linode instance, and you can access the operating system for your app's server if you choose to. To gain command-line access to your server, [log in using a Secure Shell (SSH) client](/docs/getting-started/#connect-to-your-linode-via-ssh) on your computer.

When logging in over SSH, use `root` as the username, and supply the root password that you specified when you deployed your app. Follow our [Getting Started guide](/docs/getting-started/#connect-to-your-linode-via-ssh) to learn more about connecting to your Linode via SSH. If you use Windows at home, our [Using SSH on Windows](/docs/networking/ssh/using-ssh-on-windows/) guide has special instructions for Windows SSH clients. If you're new to Linux, some of the guides in our [Linux](/docs/quick-answers/linux/) and [Linux Essentials](/docs/quick-answers/linux-essentials/) sections may be useful.

{{< content "one-click-update-note">}}

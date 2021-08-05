---
slug: deploy-moodle-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: "Moodle is the leading open source learning management system. This tutorial walks you through deploying Moodle using Linode's App Marketplace"
og_description: "Moodle is the leading open source learning management system. This tutorial walks you through deploying Moodle using Linode's App Marketplace"
keywords: ['learning','educator','management', and 'school']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-05
modified: 2021-08-05
modified_by:
  name: Linode
title: "How to Deploy Moodle with Marketplace Apps"
h1_title: "Deploying Moodle with Marketplace Apps"
enable_h1: true
external_resources:
- '[Moodle](https://moodle.org/)'
---

Moodle is the most widely used open source learning management system. It is aimed to provide learners, educators, and administrators with a single robust, secure, and integrated solution to develop customized learning environments.

## Deploy a Moodle Marketplace App

{{< content "deploy-marketplace-apps">}}

### Moodle Configuration Options

You can configure your Moodle App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Password** | Moodle Admin Password. *Required*. |
| **Admin Email** | Moodle Admin email. *Required*. |
| **MySQL Root Password** | MySQL Root Password. *Required*. |
| **MySQL Password** | MySQL Moodle Database Password. *Required*.|
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your Moodle site. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |


### Linode Configuration Options

After providing the App-specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Ubuntu 20.04 LTS is currently the only image supported by the Moodle Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Moodle can be supported on any size Linode, but we suggest you deploy your Moodle App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

After providing all required Linode Options, click on the **Create** button. **Your Moodle App will complete installation anywhere between 5-10 minutes after your Linode has finished provisioning**.

## Getting Started After Deployment

### Access Your Moodle App

To access your Moodle instance, Open a browser and navigate to your Linode rDNS domain `https://li1234-555.members.linode.com`. Replace `https://li1234-555.members.linode.com` with your [Linode's RDNS domain](docs/guides/remote-access/#resetting-reverse-dns).

From there, you can login by clicking the box on the top right of the page. Once you see the login page, you can enter `moodle` as the *username* and the *password* that was entered during the creation of the Linode.

Now that you’ve accessed your dashboard, checkout [the official Moodle documentation](https://docs.moodle.org/311/en/Main_page) to learn how to further configure your instance.

{{< content "marketplace-update-note">}}
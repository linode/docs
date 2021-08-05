---
slug: deploying-splunk-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Splunk is a powerful data solution that collects, monitors, analyzes, and visualizes data for your infrastructure. This tutorial walks you through deploying Splunk through the Linode Marketplace."
og_description: "Splunk is a powerful data solution that collects, monitors, analyzes, and visualizes data for your infrastructure. This tutorial walks you through deploying Splunk through the Linode Marketplace."
keywords: ['monitoring','splunk', 'data solution']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-05
modified: 2021-08-05
modified_by:
  name: Linode
title: "How to Deploy Splunk through the Linode Marketplace"
h1_title: "Deploying Splunk through the Linode Marketplace"
enable_h1: true
external_resources:
- '[Splunk](http://splunk.com/)'
---

Splunk is a powerful log analyzer that can be used to obtain insight into your infrastructure. Splunk collects, monitors, analyzes, and visualizes data from database applications, web servers, cloud networks, and a variety of other sources.

## Deploying the Splunk Marketplace App

{{< content "deploy-marketplace-apps">}}

### Splunk Configuration Options

You can configure your Splunk App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Splunk Username** | This will be the username you use to login the Splunk Dashboard. *Required*. |
| **Splunk Password** | This will be the password you use to login the Splunk Dashboard. *Required*. |
| **The limited sudo user to be created for the Linode** | The username for a new limited user account with sudo privileges. |
| **The password for the limited sudo user** | The password for the new limited user account. |
| **The SSH Public Key that will be used to access the Linode** | A public key belonging to the user that accesses the Linode. If you do not have an authentication key-pair, see the [Securing Your Server](/docs/security/securing-your-server/#create-an-authentication-key-pair) guide for steps on creating one. |
| **Disable root access over SSH** | Disable root user access for the Linode server. |
| **Your Linode API token** | The [Linode API v4](https://developers.linode.com/api/v4) token is required to create a domain name system (DNS) record. See the [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) guide to learn how to generate an API token. |
| **The domain for the Linode's DNS record (Requires API token)** | The hostname to assign to the Linode server.|
| **The subdomain for the Linode's DNS record (Requires API token)** | The domain name to use when creating a DNS record for the Linode.
| **Admin email for the Splunk server** | The email address to use for the Splunk instance's admin user. |

### Linode Configuration Options

After providing the App-specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 10 and Ubuntu 20.04 LTS are currently the only images supported by the Splunk Marketplace App. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Splunk can be supported on any size Linode, but we suggest you deploy your Splunk App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

After providing all required Linode Options, click on the **Create** button. **Your Splunk App will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

### Access your Splunk App
Open a browser and navigate to your [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/) and port `8000`, for example, `http://192.0.2.0:8000/`. You will be presented a login field where you can enter the credentials you previously specified in the *Splunk Username* and *Splunk Password* fields when you deployed the app.

Now that you’ve accessed your dashboard, checkout [the official Splunk documentation](https://docs.splunk.com/Documentation/Splunk) to learn how to further configure your instance.

{{< content "marketplace-update-note">}}
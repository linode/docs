---
slug: splunk-marketplace-app
author:
  name: Linode
  email: docs@linode.com
description: "Splunk is a powerful data solution that collects, monitors, analyzes, and visualizes data for your infrastructure. This tutorial walks you through deploying Splunk through the Linode Marketplace."
keywords: ['monitoring','splunk', 'data solution']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-03
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying Splunk through the Linode Marketplace"
aliases: ['/guides/deploying-splunk-marketplace-app/']
external_resources:
- '[Splunk](http://splunk.com/)'
---

Splunk is a powerful log analyzer that can be used to obtain insight into your infrastructure. Splunk collects, monitors, analyzes, and visualizes data from database applications, web servers, cloud networks, and a variety of other sources.

## Deploying the Splunk Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

### Splunk Options

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

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 10 and Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Access your Splunk App

Open a browser and navigate to your [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/) and port `8000`, for example, `http://192.0.2.0:8000/`. You will be presented a login field where you can enter the credentials you previously specified in the *Splunk Username* and *Splunk Password* fields when you deployed the app.

Now that you’ve accessed your dashboard, checkout [the official Splunk documentation](https://docs.splunk.com/Documentation/Splunk) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}
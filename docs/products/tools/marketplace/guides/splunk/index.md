---
author:
  name: Linode
  email: docs@linode.com
description: "This guide shows you how to install Splunk, a powerful data solution that collects, monitors, analyzes, and visualizes data, using the Linode One-Click Marketplace."
keywords: ['monitoring','splunk', 'data solution']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-03
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploying Splunk through the Linode Marketplace"
aliases: ['/guides/deploying-splunk-marketplace-app/','/guides/splunk-marketplace-app/']
external_resources:
- '[Splunk](http://splunk.com/)'
---

Splunk is a powerful log analyzer that can be used to obtain insight into your infrastructure. Splunk collects, monitors, analyzes, and visualizes data from database applications, web servers, cloud networks, and a variety of other sources.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Splunk should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 10, Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### Splunk Options

- **Splunk Admin user** *(required)*: This will be the username you use to login the Splunk Dashboard.
- **Splunk Admin Password** *(required)*: This will be the password you use to login the Splunk Dashboard.

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Email address for the SOA record:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.

{{< content "marketplace-limited-user-fields-shortguide">}}

## Getting Started after Deployment

### Access your Splunk App

Open a browser and navigate to your [Linode's IP address](/docs/guides/find-your-linodes-ip-address/) and port `8000`, for example, `http://192.0.2.0:8000/`. You will be presented a login field where you can enter the credentials you previously specified in the *Splunk Username* and *Splunk Password* fields when you deployed the app.

Now that you’ve accessed your dashboard, checkout [the official Splunk documentation](https://docs.splunk.com/Documentation/Splunk) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}
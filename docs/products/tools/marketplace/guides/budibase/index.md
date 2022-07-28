---
author:
  name: Linode
  email: docs@linode.com
description: "Deploy Budibase, a low-code platform for building modern business applications, on a Linode Compute Instance."
keywords: ['budibase','CRUD','low-code']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-09
modified_by:
  name: Linode
title: "Deploying Budibase through the Linode Marketplace"
---

[Budibase](https://github.com/Budibase/budibase) is a modern, open source low-code platform for building modern business applications in minutes. Build, design and automate business apps, such as; admin panels, forms, internal tools, client portals and more. Before Budibase, it could take developers weeks to build simple CRUD apps; with Budibase, building CRUD apps takes minutes.
When self-hosting please follow best practices for securing, updating and backing up your server.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Budibase should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS, Debian 11
- **Recommended plan:** All plan types can be used.

## Budibase Options

- **Budibase port:** Enter the port the web UI will listen on. Defaults to 80.

## Getting Started after Deployment

### Accessing the Budibase app

  1. Open your web browser and navigate to `http://[IP]:[Buidbase_port]` where *[IP]* can be replaced with your Linode's IP address and *[Budibase_port]* can be replaced with the port you specified when deploying the Linode. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing rDNS.

  2. On the `Builder` page that appears, input an email and username for the admin user.
  ![Screenshot of the Budibase admin user panel](budibase-admin.png)

  3. Log in with the admin email and password you just set. After additional users are created they can be used to log in.
  ![Screenshot of the Budibase login panel](budibase-login.png)

  4. From the Budibase web app you can manage users, authentication, organizations and themes, as well as developing apps from the supplied templates.
  ![Screenshot of the Budibase web app](Budibase-webapp.png)

  5. For more information on using Budibase for development please see the [Budibase documentation](https://docs.budibase.com/docs).

{{< content "marketplace-update-note-shortguide">}}

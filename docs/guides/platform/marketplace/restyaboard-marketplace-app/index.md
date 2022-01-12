---
slug: restyaboard-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy Restyaboard on a Linode Compute Instance. This provides you with an open source alternative to the popular project management tool Trello."
keywords: ['restyaboard','project','productivity','kanban']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-12
modified_by:
  name: Linode
title: "Deploying Restyaboard through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[Restyaboard](https://restya.com/board)'
aliases: ['/guides/deploying-restyaboard-marketplace-app/']
---

Restyaboard is an open-source alternative to Trello, but with smart additional features like offline sync, diff /revisions, nested comments, multiple view layouts, chat, and more. And since it is self-hosted, data, privacy, and IP security can be guaranteed.

Restyaboard is more like an electronic sticky note for organizing tasks and todos. Apart from this, it is ideal for Kanban, Agile, Gemba board and business process/workflow management. It can be extended with productive plugins

Today, several universities, automobile companies, government organizations, etc from across Europe take advantage of Restyaboard.

## Deploying the Restyaboard Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** CentOS 7, Debian 10, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the Restyaboard App

1.  Open a browser and navigate to your [Instance's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/).

1.  The Restyaboard login page will appear. The default username for this instance will be `admin` and the default password will be 'restya'. Click the **Log In** button.

1.  You can reset the default admin password by visiting admin panel at the bottom right of the Restyaboard panel, or visting `http://192.0.2.0/#/users` and clicking 'change password', replace `192.0.2.0` with your [Instance's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/). 

Now that you’ve accessed your dashboard, check out [the official Restyaboard documentation](https://restya.com/board/docs/install-restyaboard-linode-marketplace-tutorial/) to learn how to add users and further utilize your Restyaboard instance.

{{< content "marketplace-update-note-shortguide">}}
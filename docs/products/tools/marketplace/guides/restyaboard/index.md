---
description: "Deploy Restyaboard on a Linode Compute Instance. This provides you with an open source alternative to the popular project management tool Trello."
keywords: ['restyaboard','project','productivity','kanban']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2022-01-25
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy Restyaboard through the Linode Marketplace"
external_resources:
- '[Restyaboard](https://restya.com/board)'
aliases: ['/guides/deploying-restyaboard-marketplace-app/','/guides/restyaboard-marketplace-app/']
authors: ["Linode"]
---

[Restyaboard](https://restya.com/board) is an open-source alternative to Trello, but with smart additional features like offline sync, revisions, diff, nested comments, multiple view layouts, chat, and more. And since it is self-hosted, data, privacy, and IP security are under your full control.

Restyaboard is like an electronic sticky note for organizing tasks and to-dos. It's ideal for replacing kanban, agile, and Gemba boards as well as managing your business process and workflows. It can also be extended through [Restyaboard Apps](https://restya.com/board/apps), plugins that expand functionality and integrate with third party systems. Today, several universities, automobile companies, government organizations, and other groups from across Europe take advantage of Restyaboard.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Restyaboard should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS 7, Debian 10, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the Restyaboard App

1.  Open a browser and navigate to your Instance's [IP address](/docs/products/compute/compute-instances/guides/manage-ip-addresses/).

1.  The Restyaboard login page appears. The default username for this instance is `admin` and the default password is `restya`. Click the **Log In** button to continue.

1.  You can reset the default admin password by visiting admin panel at the bottom right of the Restyaboard panel. You can also visit the users page direct at `http://192.0.2.0/#/users`, replacing `192.0.2.0` with your instance's IP address.

Now that you’ve accessed your dashboard, check out [the official Restyaboard documentation](https://restya.com/board/docs/install-restyaboard-linode-marketplace-tutorial/) to learn how to add users and further utilize your Restyaboard instance.

{{< content "marketplace-update-note-shortguide">}}
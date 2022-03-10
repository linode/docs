---
slug: peppermint-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows how to install Peppermint, a ticket management system that allows teams to create tickets, and more, with the Linode One-Click Marketplace."
keywords: ["ticket management", "marketplace"]
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-31
modified: 2022-02-04
modified_by:
  name: Linode
title: "Deploying Peppermint through the Linode Marketplace"
external_resources:
- "[Peppermint Github](https://github.com/Peppermint-Lab/Peppermint/blob/master/README.md)"
- "[Peppermint Documentation](https://docs.peppermint.sh/)"
aliases: ['/guides/deploy-peppermint-with-marketplace-apps/']
---

[Peppermint Ticket Management](https://peppermint.sh/) is a ticket management system that allows teams and solo users the ability create & track tickets, todo items, and more. The project is meant to provide help desks and services desks manage internal and customer requests, but Peppermint is a good solution for anyone looking for a ticket management system that is free and easy to use.

{{< caution >}}
While Peppermint is still technically in alpha, it is stable enough for production use.
{{</ caution >}}

## Deploying the Peppermint Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 10, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Access your Peppermint App

After Peppermint has finished installing, you can access your Peppermint server with your Linode's IPv4 address. Copy your Linode’s IPv4 address from the [Linode Cloud Manager](https://cloud.linode.com), and then connect to the server in your browser using your Linode's IPv4 address and port `5001`(for example `192.0.2.0:5001`).

![Peppermint login screen](peppermint.png)

The default credentials to login to your Peppermint Peppermint Ticket Management Panel are:

    email: admin@admin.com
    password: 1234

Once you login to the Peppermint Ticket Management Panel, you need to update the email and password you used to log in. You can do so by clicking the settings gear logo in the top right corner.

![peppermint_settings.png](peppermint_settings.png)

For more on Peppermint, consult the following resources:

- [Peppermint Github](https://github.com/Peppermint-Lab/Peppermint/blob/master/README.md)
- [Peppermint Documentation](https://docs.peppermint.sh/)

{{< content "marketplace-update-note-shortguide">}}
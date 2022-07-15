---
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows how to install Owncast, a self-hosted live video and webchat server that works with common broadcasting software, from the Linode One-Click Marketplace."
keywords: ['live streaming','marketplace','web chat']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-31
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploying Owncast through the Linode Marketplace"
external_resources:
- '[Owncast](https://owncast.online/)'
- '[Owncast Github](https://github.com/owncast/owncast)'
aliases: ['/guides/deploy-owncast-with-marketplace-apps/','/guides/owncast-marketplace-app/']
---

[Owncast](https://owncast.online/) is a self-hosted, "Twitch in a box" live streaming and chat server for use with popular broadcasting software such as OBS. You can use Owncast to live stream anything from gaming with your friends to live events for you and your clients. Like other popular streaming platforms, you can use Owncast's APIs to build things such as chat bots and stream overlays to drive further audience engagement.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Owncast should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended plan:** All plan types and sizes can be used with Owncast.

### Owncast Options

- **Hostname**: Your public hostname for your Owncast server. Required for SSL.
- **Email**: Your email address for configuring SSL.

## Getting Started after Deployment

### Access your Owncast App

After Owncast has finished installing, you can access your server with your Linode's IPv4 address. Copy your Linode’s IPv4 address from the [Linode Cloud Manager](https://cloud.linode.com), and then connect to the server from your browser using your Linode's IPv4 address and port `8080`(for example `192.0.2.0:8080`).

![owncast.png 'The Owncast stream view'](owncast.png)

With Owncast running, you can begin to configure your new server. Visit the Admin settings, located at `/admin` (for example `192.0.2.0:8080/admin`). Visit the [Configuration Instructions](https://owncast.online/docs/configuration/?source=linodemarketplace) to learn how you can change your video settings, web page content, and more.

On the server, Owncast is installed in the  `/opt/owncast` directory. You'll find all your data files there. This is also where you can upgrade your Owncast server in the future.

{{< content "marketplace-update-note-shortguide">}}

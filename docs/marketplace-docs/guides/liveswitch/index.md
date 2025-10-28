---
title: "Deploy LiveSwitch through the Linode Marketplace"
description: "Learn how to deploy LiveSwitch Server, an enterprise video streaming service, through the Linode Marketplace."
published: 2022-05-31
modified: 2025-05-19
keywords: ['liveswitch','streaming','video']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[LiveSwitch](https://www.liveswitch.io/)'
aliases: ['/products/tools/marketplace/guides/liveswitch/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1008123
marketplace_app_name: "LiveSwitch"
---

[LiveSwitch Server](https://www.liveswitch.io/products/liveswitch-server) is a self-hosted WebRTC live video streaming platform for building low-latency video, audio, and data streaming apps using WebRTC with support for P2P, SFU, MCU, recording, and SIP integration.

This Marketplace App deploys a back-end demonstration server, with signalling, media, and TURN services all provided by a single `liveswitch-gateway` container running on one server. It's designed to be tested alongside the official client SDKs for .NET, .NET Core, iOS, Android, Xamarin, Maui, Unity, and more. To download these SDKs, see the [Client SDK](https://developer.liveswitch.io/liveswitch-server/guides/intro.html) documentation.

{{< note >}}
Using LiveSwitch Server may require a paid license. To obtain a license, [contact LiveSwitch](https://support.liveswitch.io/kb-tickets/new). Licenses are not available directly through Akamai.
{{< /note >}}

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** LiveSwitch should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Suggested plan:** All plan types and sizes can be used.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

After deployment, follow the instructions below to access your application.

### Accessing the LiveSwitch App

1. In a web browser, go to `https://[ip-address]/admin`, replacing *[ip-address]* with your Compute Instance's IP address or rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

1. Follow the *Welcome* setup wizard to input your license key and create your user.

After completing the setup, you should see the main Configuration Console for your installation. To learn more about how to manage your instance, see the [Configuration Console documentation](https://developer.liveswitch.io/liveswitch-server/server/configuration/configuration-console.html).

Now that you've accessed your LiveSwitch instance, check out [the official LiveSwitch quick start documentation](https://developer.liveswitch.io/liveswitch-server/get-started/js-server/quickstart-js.html) to learn how to further use your LiveSwitch instance.

## Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **LiveSwitch Gateway** | Main LiveSwitch service for WebRTC communication (signalling, media, TURN) |
| **Docker** | Platform for running the LiveSwitch containers |
| **Docker Compose** | Tool for defining and running multi-container Docker applications |
| **Redis** | In-memory data structure store for signaling and messaging |
| **PostgreSQL** | Database for LiveSwitch configuration and data |
| **RabbitMQ** | Message broker for recording workflows |
| **Nginx** | Web server used as reverse proxy |
| **Fail2ban** | Provides protection against brute force and authentication attempts |
| **UFW** | Firewall utility |
| **Certbot** | Used to obtain HTTPS/TLS/SSL certificates for the provided domain |



{{% content "marketplace-update-note-shortguide" %}}

---
description: "Learn how to deploy LiveSwitch Server, an enterprise video streaming service, through the Linode Marketplace."
keywords: ['liveswitch','streaming','video']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2022-05-31
modified: 2023-04-18
title: "Deploy LiveSwitch through the Linode Marketplace"
external_resources:
- '[LiveSwitch](https://www.liveswitch.io/)'
authors: ["Holden Morris"]
---

[LiveSwitch Server](https://www.liveswitch.io/products/liveswitch-server) is a self-hosted WebRTC live video streaming platform. It provides high quality and reliable streaming for both audio and video media. Here's more from the publisher:

> LiveSwitch is the most flexible video and audio WebRTC SDK on the market. Ultra-low latency meets advanced features for engaging with your audience. LiveSwitch offers a complete solution (front-end and back-end) to develop commercial WebRTC applications.

This Marketplace App deploys a back-end demonstration server, running signalling, media, and TURN together on a single server. It is designed to be tested alongside the official client SDKs for .NET, .NET Core, iOS, Android, Xamarin, Maui, Unity and more. To download these SDKs, see the [Client SDK](https://developer.liveswitch.io/liveswitch-server/guides/intro.html) page on the LiveSwitch Developer documentation site.

{{< note >}}
Using LiveSwitch Server may require a paid license. To obtain a license, [contact LiveSwitch](https://www.liveswitch.io/meetings/jake-steele/linode). Licenses are not available directly through Linode.
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** LiveSwitch should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

After deployment, follow the instructions below to access your application.

### Accessing the LiveSwitch App

1. Open your web browser and navigate to `http://[ip-address]:9090/admin`, replacing *[ip-address]* with your Compute Instance's IP address or rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

1. The *Welcome* setup wizard is displayed. Follow the prompts in this wizard to input your license key and create your user.

1. After completing the setup wizard, you should see the main Configuration Console for your installation. To learn more about how to manage your instance, see the [Configuration Console documentation](https://developer.liveswitch.io/liveswitch-server/server/configuration/configuration-console.html).

Now that you’ve accessed your LiveSwitch instance, check out [the official LiveSwitch quick start documentation](https://developer.liveswitch.io/liveswitch-server/get-started/js-server/quickstart-js.html) to learn how to further utilize your LiveSwitch instance.

{{< content "marketplace-update-note-shortguide">}}

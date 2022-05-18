---
author:
  name: Linode
  email: docs@linode.com
description: "Extremely high quality and reliable audio/video streaming, backed by the top experts in the industry."
keywords: ['liveswitch','streaming','video']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-22
title: "Deploying LiveSwitch through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[LiveSwitch](https://www.liveswitch.io/)'
aliases: ['/guides/liveswitch-marketplace-app/']
---

[LiveSwitch](https://www.liveswitch.io/) provides extremely high quality and reliable audio/video streaming, backed by the top experts in the industry.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** LiveSwitch should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

After deploying your application using, the server will reboot once the installation is complete.

### Accessing the LiveSwitch App

1.  After installation is complete and the instance has rebooted, Open your web browser and navigate to http://{your-ip-v4-goes-here}:9090/admin for the admin panel and http://{your-ip-v4-goes-here:8080/sync for signalling. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#configuring-rdns) guide for information on viewing the the Linodes IPv4 address.

After you have accessed the admin panel for your LiveSwitch instance, you can follow the steps to in the [Configuration Console LiveSwitch documentation](https://developer.liveswitch.io/liveswitch-server/server/configuration/configuration-console.html).

Now that you’ve accessed your LiveSwitch instance, check out [the official LiveSwitch quick start documentation](https://developer.liveswitch.io/liveswitch-server/get-started/js-server/quickstart-js.html) to learn how to further utilize your LiveSwitch instance.

{{< content "marketplace-update-note-shortguide">}}
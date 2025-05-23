---
title: "Deploy WarpSpeed VPN through the Linode Marketplace"
description: "Deploy WarpSpeed on a Linode Compute Instance. This provides you with one of the fastest, easiest to use, and most secure VPN gateway software."
published: 2021-11-12
modified: 2022-03-08
keywords: ['vpn','security','tunnel']
tags: ["marketplace", "linode platform", "cloud manager"]
bundles: ['network-security']
external_resources:
- '[WarpSpeed VPN](https://bunker.services/products/warpspeed)'
aliases: ['/products/tools/marketplace/guides/warpspeed/','/guides/deploying-warpspeed-marketplace-app/','/guides/warpspeed-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 923037
marketplace_app_name: "WarpSpeed"
---

{{< note type="warning" title="This app is no longer available for deployment" >}}
WarpSpeed has been removed from the App Marketplace and can no longer be deployed. This guide is retained for reference only.
{{< /note >}}

WarpSpeed makes it easy for developers to access cloud infrastructure via the powerful WireGuard® VPN protocol. It can also be used to enable remote workers to access the internet securely while on public WiFi.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** WarpSpeed should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### WarpSpeed VPN Options

- **Admin Email:** This is the admin user email to log in to your WarpSpeed instance.
- **Admin Password:** This is the admin user password to log in to your WarpSpeed instance.
- **DNS name:** This is the domain you will be using for your WarpSpeed instance.
- **Data Directory:** This is the directory that your WarpSpeed data will be stored in, default will be `/wirespeed`.

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Accessing the WarpSpeed VPN App

1.  Configure your custom domain to point towards the IPv4 (and IPv6) address of the newly created Compute Instance. Review the [DNS Manager](/docs/products/networking/dns-manager/) guide for instructions on setting up your DNS records in Cloud Manager and read through [DNS Records: An Introduction](/docs/guides/dns-overview/) for general information about how DNS works.

1.  Once your domain has been configured and has finished propagating, enter the domain within a web browser to access the login page.

1.  Enter the *Admin Email* and *Admin Password* you defined during the initial deployment of this Compute Instance.

Now that you’ve accessed your WarpSpeed VPN instance, check out [the official WarpSpeed VPN documentation](https://bunker.services/products/warpspeed/install-linode) to learn how to further configure your WarpSpeed VPN instance.

{{% content "marketplace-update-note-shortguide" %}}
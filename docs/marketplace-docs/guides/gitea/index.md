---
title: "Deploy Gitea through the Linode Marketplace"
description: "This is a step-by-step guide on how to deploy the Gitea application, a community managed, self-hosted Git service, by using the Linode One-Click App Marketplace."
published: 2021-01-04
modified: 2025-04-08
keywords: ['Gitea','version control','git']
tags: ["linode platform","version control system","marketplace","cloud-manager"]
external_resources:
- '[Gitea Documentation](https://docs.gitea.io/)'
aliases: ['/products/tools/marketplace/guides/gitea/','/guides/deploy-gitea-with-one-click-apps/', '/guides/deploy-gitea-with-marketplace-apps/', '/guides/gitea-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 688911
marketplace_app_name: "Gitea"
---

[Gitea](https://gitea.io/) is a community-managed, painless, self-hosted Git service. Gitea is a complete solution for all aspects of your software development. At its core, Gitea serves as your centralized remote Git repository. Gitea also features built-in tools that represent every task in your development workflow, from planning to testing to releasing.

Self-hosting your software development with the Gitea Marketplace App offers total control of your codebase. At the same time, its familiar interface eases collaboration for you and your team. Gitea is one of the most popular self-hosted Git repository platforms, allowing you to benefit from a robust set of integrated tools and an active community.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Gitea should be fully installed within 3-7 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** 4GB Dedicated Compute Instance

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Access your Gitea Site

With Gitea installed, you can access your Gitea site using a web browser to log in and begin using your app.

To access the Gitea site:

1. In a browser, enter your Compute Instance's fully qualified domain name (for example, *ht<span>tp://</span>example.com*) or [Reverse DNS Address](https://techdocs.akamai.com/cloud-computing/docs/configure-rdns-reverse-dns-on-a-compute-instance).

1. Click **Sign In**.

![The Gitea welcome page.](gitea-welcome-page.png 'Gitea welcome page')

## Software Included

The Gitea Marketplace App installs the following software on your Compute Instance:

| **Software** | **Description** |
|:--------------|:------------|
| [**Gitea**](https://gitea.io/) | Open source remote Git repository software. [v1.13.0](https://github.com/go-gitea/gitea/releases/tag/v1.13.0) |
| [**PostgreSQL**](https://www.postgresql.org/) | Open source object-relational database system. |
| [**NGINX**](https://www.nginx.com/) | Open source web server. Used as a reverse proxy by this app. See our guide on [Getting Started with NGINX](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/) for more information. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 are enabled with installation of this app. Additional ports must be opened to send email from your Compute Instance for use with this app. See our guide on [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/) for instructions. |

{{% content "marketplace-update-note-shortguide" %}}

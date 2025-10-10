---
title: "Deploy AzuraCast through the Linode Marketplace"
description: "AzuraCast is a self-hosted web radio station and management suite. Follow this guide to deploy AzuraCast on Linode using Marketplace Apps."
published: 2020-09-28
modified: 2025-07-16
keywords: ['azuracast','marketplace', 'server']
tags: ["debian","ubuntu","marketplace", "web applications","linode platform", "cloud manager"]
image: DeployAzuraCast_OneClickApps.png
external_resources:
- '[AzuraCast Website](https://www.azuracast.com/)'
- '[Troubleshooting AzuraCast](https://www.azuracast.com/docs/help/troubleshooting/)'
- '[AzuraCast Github](https://github.com/azuracast/azuracast)'
aliases: ['/products/tools/marketplace/guides/azuracast/','/platform/marketplace/how-to-deploy-azuracast-with-marketplace-apps/', '/platform/one-click/how-to-deploy-azuracast-with-one-click-apps/','/guides/how-to-deploy-azuracast-with-one-click-apps/','/guides/how-to-deploy-azuracast-with-marketplace-apps/','/guides/deploy-azuracast-with-one-click-apps/','/platform/one-click/deploy-azuracast-with-one-click-apps/','/guides/azuracast-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 662118
marketplace_app_name: "AzuraCast"
---

[AzuraCast](https://www.azuracast.com) is a free self-hosted web radio station and management suite. The installation with Marketplace Apps is simple and the intuitive web interface makes the running a web station easy. After the installation, you can be broadcasting within minutes.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** AzuraCast should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## AzuraCast Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

### Accessing AzuraCast

Once you install AzuraCast:

1.  Open your web browser and navigate to `http://[domain]/admin`, where *[domain]* is the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). To learn more about viewing IP addresses and rDNS, see [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/).

1. Log in with your *Super Administrator* credentials. This account has system-wide permissions and was set up during the installation when you entered your Administrator Email Address.

    !["AzuraCast Login"](azuracast-login.png "AzuraCast Login")

1.  Fill out the required fields in the registration form and click **Create and Continue**.

    !["AzuraCast Create Station"](azuracast-create-station.png "AzuraCast Create Station")

1.  Configure station's settings including the use of a custom URL, if you have one set up. To learn more about using a custom URL with Linode DNS, see [DNS Manager](/docs/products/networking/dns-manager/). Click **Save Changes**.

Your station is now ready and you can start broadcasting. To manage the created station, click **Manage Stations** in the **Dashboard** section. This opens the *Station Dashboard* that you can use to control your station, add songs, add DJs, take requests, and more.

!["AzuraCast Manage Station"](azuracast-manage-station.png "AzuraCast Manage Station")

## Software Included

The AzuraCast Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**AzuraCast**](https://www.azuracast.com/) | All-in-one web radio management suite (includes Liquidsoap, Icecast, NGINX, PHP, and all radio streaming components) |
| [**MariaDB**](https://mariadb.org/) | Open-source relational database for data storage |
| [**Redis**](https://redis.io/) | In-memory data structure store for caching and session management |
| [**Docker**](https://www.docker.com/) | Container runtime for application deployment |
| [**Docker Compose**](https://docs.docker.com/compose/) | Tool for defining and running multi-container Docker applications |

{{% content "marketplace-update-note-shortguide" %}}

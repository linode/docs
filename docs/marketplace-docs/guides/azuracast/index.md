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

[AzuraCast](https://www.azuracast.com) is a free self-hosted web radio station and management suite. Installation is simple with Marketplace Apps, and the intuitive web interface makes running a web station easy. After installation, you can be broadcasting within in minutes.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** AzuraCast should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Azuracast Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

### Accessing AzuraCast

AzuraCast is now installed and ready to use.

1.  Open your web browser and navigate to `http://[domain]/admin`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

1.  The first thing you want to do is login with your *Super Administrator* account that has system-wide permissions. This account was set up during the installation when you entered your Administrator Email Address.

    !["AzuraCast Login"](azuracast-login.png "AzuraCast Login")

1.  Next, AzuraCast prompts you to create a new radio station. Fill out the required fields, then click the **Create and Continue** button at the bottom of the screen to continue.

    !["AzuraCast Create Station"](azuracast-create-station.png "AzuraCast Create Station")

1.  On the next page you can set other settings including using a custom URL if you have one set up. Learn more about using a custom URL with Linode DNS in our [DNS Manager](/docs/products/networking/dns-manager/) guide. When you are finished, click the **Save Changes** button at the bottom of the screen to continue.

1.  Your station is now ready. On the following page, you are taken to the control panel, and you are ready to start broadcasting your station.

1.  To manage the station you just created click the **Manage Stations** button in the **Dashboard** section. This will open the Station Dashboard for the station you created during setup.

    !["AzuraCast Manage Station"](azuracast-manage-station.png "AzuraCast Manage Station")

1.  Here you can control your station, add songs, add DJs, take requests, and more.

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

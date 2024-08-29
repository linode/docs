---
slug: yacht
title: "Deploy Yacht through the Linode Marketplace"
description: "Yacht is a web interface for managing Docker containers, with an emphasis on templating. Learn how to deploy Yacht on Linode using Marketplace Apps."
published: 2021-02-23
modified: 2023-10-27
keywords: ['yacht','marketplace','server', 'docker', 'docker-compose']
tags: ["marketplace", "linode platform", "cloud manager", "docker", "container"]
image: DeployYacht_marketplaceapps.png
aliases: ['/products/tools/marketplace/guides/yacht/','/guides/deploy-yacht-with-marketplace-apps/','/guides/yacht-marketplace-app/']
external_resources:
- '[Getting Started](https://yacht.sh/docs/Installation/Getting_Started)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[Yacht](https://yacht.sh/) is a web interface for managing Docker containers, with an emphasis on templating to provide easy deployments. The ultimate goal of Yacht is to make Docker easy for anyone to use and manage with templates, template variables, and an intuitive UI.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Yacht should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### Yacht Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

- **Yacht Email:** The email address for your Yacht login. The default is admin@yacht.local.
- **Yacht Compose Support:** Support for using Yacht with [Docker Compose](https://yacht.sh/Advanced/docker-compose/).
- **Yacht Theme:** Yacht theme options: Default, RED, and OMV.


## Getting Started after Deployment

### Access your Yacht App

1.  Open your web browser and navigate to `https://DOMAIN/`, where *DOMAIN* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

1. Enter your [Yacht email address and password](#yacht-options):

    ![Yacht Login](yacht-login.png)

    You should see the Yacht administration panel:

    ![Yacht Dashboard](yacht-dashboard.png)


Yacht provides elegant theme customization, templating, easy management of Docker resources (volumes, images, network), applications and projects. Click the page icon on the bottom-left corner to view a live demo and official [Yacht documentation](https://yacht.sh/).

![Yacht Demo](yacht-demo.png)

{{% content "marketplace-update-note-shortguide" %}}
---
title: "Deploy Cribl Stream through the Linode Marketplace"
description: "Deploy Cribl Stream for data routing, shaping, and observability pipeline management"
published: 2025-10-03
keywords: ['cribl', 'stream', 'observability', 'log routing', 'data pipeline']
tags: ["ubuntu", "marketplace", "observability", "developer", "linode platform", "cloud manager"]
external_resources:
- '[Cribl](https://cribl.io/)'
- '[Cribl Stream official documentation](https://docs.cribl.io/stream/)'
- '[Getting Started with Cribl Stream](https://docs.cribl.io/stream/getting-started/)'
aliases: ['/products/tools/marketplace/guides/cribl-stream/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

Cribl Stream is a vendor-agnostic observability pipeline that gives you full control over your data—allowing you to route, shape, enrich, and reduce event data from any source to any destination. It enables organizations to optimize costs and improve observability by filtering and transforming data before it reaches downstream systems like SIEMs, observability platforms, or data lakes. With its intuitive UI and powerful processing engine, Cribl Stream makes it easier to manage high-volume data ingestion without sacrificing visibility.

This guide includes steps for deploying the Cribl Stream Marketplace App on a Linode instance.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Once a Compute Instance finishes provisioning, the Cribl Stream installation takes approximately 3-5 minutes.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though larger instances are recommended for high-volume data processing.

### Cribl Stream Options

- **Limited sudo user** *(required)*: Enter your preferred username for the limited user. Don't use capital letters, spaces, or special characters.
- **Disable root access over SSH** *(required)*: Select whether you want to block the root user from logging in over SSH. You can still switch to the root user once logged in, and you can also log in as root through Lish.

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server. To obtain the credentials:

1. Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

2. Run the following command to access the contents of the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns the admin password and other details that were automatically generated when the instance was deployed. Save them securely. Once saved, you can safely delete the file.

## Getting Started After Deployment

Once you've obtained the credentials, you can access your Cribl instance and open a browser and navigate to your Linode domain entered during deployment or the rDNS domain `https://203-0-113-0.ip.linodeusercontent.com`.

1. In a browser, paste your instance's rDNS domain. Replace `{{< placeholder "https://203-0-113-0.ip.linodeusercontent.com" >}}` with your [Linode's actual rDNS domain](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#viewing-ip-addresses).

2. Log in with the admin username (`admin`) and the password in the credentials file.

3. Follow the [Getting Started with Cribl Stream guide](https://docs.cribl.io/stream/getting-started/) to configure data sources, routes, and destinations.

If you don’t have a Cribl account yet, you can create one for free at [https://cribl.io](https://cribl.io) to access additional resources and support.

{{% content "marketplace-update-note-shortguide" %}}

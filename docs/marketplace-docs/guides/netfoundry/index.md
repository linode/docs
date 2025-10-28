---
title: "Deploy NetFoundry Edge Router through the Linode Marketplace"
description: "Deploy a NetFoundry zero trust optimized connectivity Edge Router"
published: 2020-01-31
modified: 2025-01-31
keywords: ['netfoundry', 'edge', 'networking']
tags: ["ubuntu", "marketplace", "networking", "developer", "linode platform", "cloud manager"]
external_resources:
- '[NetFoundry](https://netfoundry.io/)'
- '[NetFoundry official documentation](https://support.netfoundry.io/hc/en-us)'
- '[Create and Manage Edge Routers - NetFoundry documentation](https://support.netfoundry.io/hc/en-us/articles/360044956032-Create-and-Manage-Edge-Routers)'
aliases: ['/products/tools/marketplace/guides/netfoundry/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

The NetFoundry Edge Router is a lightweight, software-based gateway that provides secure, zero-trust networking between endpoints, cloud environments, and private networks. Acting as a bridge between local networks and the NetFoundry overlay network, it enables encrypted, policy-driven connectivity without requiring traditional VPNs or complex firewall configurations. Edge Routers are deployed at the edge of networks or cloud instances and are key to enabling application-specific networking with high performance and security.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Once a compute instance finishes provisioning, the NetFoundry installation takes 3-5 minutes.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### NetFoundry Options

- **Limited sudo user** *(required)*: Enter your preferred username for the limited user. Don't use capital letters, spaces, or special characters.
- **Disable root access over SSH** *(required)*:  Select whether you want to block the root user from logging in over SSH. You can still switch to the root user once logged in, and you can also log in as root through Lish.
- **Registration Key** *(required)*: Enter your NetFoundry Edge Router registration key. To obtain a registration key, create a [NetFoundry](https://netfoundry.io/) account.

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain the credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

## Getting Started After Deployment

In order to utilize this Marketplace app, we assume you have a working account in the NetFoundry console and have the ability to create and manage endpoints and edge routers. If you don't have an account, you need to [create it](https://netfoundry.zendesk.com/auth/v2/login/registration) and log in to it in order to fully use this deployment.


{{% content "marketplace-update-note-shortguide" %}}
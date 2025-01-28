---
title: "Deploy Uptime Kuma through the Linode Marketplace"
description: "Deploy Uptime Kuma on a Linode Compute Instance. This provides you with an open source monitoring tool like 'Uptime Robot'."
published: 2022-02-22
modified: 2023-10-27
keywords: ['uptime','monitoring','ping']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Uptime Kuma](https://github.com/louislam/uptime-kuma)'
aliases: ['/products/tools/marketplace/guides/uptime-kuma/','/guides/uptimekuma-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[Uptime Kuma](https://github.com/louislam/uptime-kuma) is an open source monitoring tool. It enables you to monitor services over HTTP/S, TCP, DNS, and other protocols. You can receive notification alerts of downtime and even create custom status pages for your users.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Uptime Kuma should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### Uptime Kuma Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.
- **Uptime-Kuma Username** *(required)*: Enter the username to login to your Uptime-Kuma instance.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

## Getting Started After Deployment

To get started:

1.  Open a web browser and navigate to the domain you entered when creating the instance: `https://domain.tld`. If you didn't enter a domain, use your Compute Instance's default rDNS domain (`192-0-2-1.ip.linodeusercontent.com`). To learn more on viewing the rDNS value, see [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/). Make sure to use the `https` prefix in the URL to access the website securely.

1. Check [the official Uptime Kuma Repository](https://github.com/louislam/uptime-kuma) to learn how you can use your Uptime Kuma instance.

{{% content "marketplace-update-note-shortguide" %}}
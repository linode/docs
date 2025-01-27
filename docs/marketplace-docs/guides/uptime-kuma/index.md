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

Once the app has been *fully* deployed, you need to obtain the credentials from the server.

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console:** Within Cloud Manager, navigate to **Linodes** from the left menu, select the Compute Instance you just deployed, and click the **Launch LISH Console** button. Log in as the `root` user. See [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH:** Log in to your Compute Instance over SSH using the `root` user. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

1.  Once logged in, access the credentials file by running the following command:

    ```command
    cat /home/$USERNAME/.credentials
    ```

1.  This displays the passwords that were automatically generated when the instance was deployed. Once you save these passwords, you can safely delete this file.

## Getting Started After Deployment

1.  Open a web browser and navigate to the domain you entered when creating the instance: `https://domain.tld`. If you did not enter a domain, use your Compute Instance's default rDNS domain (`192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing the rDNS value. Ensure that you are securely accessing the website by prefixing `https` to the URL.

Now that you’ve accessed your dashboard, check out [the official Uptime Kuma Repository](https://github.com/louislam/uptime-kuma) to learn how to further use your Uptime Kuma instance.

{{% content "marketplace-update-note-shortguide" %}}
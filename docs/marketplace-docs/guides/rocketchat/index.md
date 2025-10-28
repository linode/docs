---
title: "Deploy Rocket.Chat through the Linode Marketplace"
description: "Deploy Rocket.Chat on a Linode Compute Instance. This provides you with a self-hosted open source chat application (Slack alternative)."
published: 2021-11-12
modified: 2025-06-03
keywords: ['rocketchat','chat','slack','communication']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Rocket.Chat](https://rocket.chat/)'
- '[Rocket.Chat documentation](https://docs.rocket.chat/guides/user-guides)'
aliases: ['/products/tools/marketplace/guides/rocketchat/','/guides/deploying-rocketchat-marketplace-app/','/guides/rocketchat-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 912264
marketplace_app_name: "Rocket.Chat"
---

Rocket.Chat is a self-hosted open source chat application that can be used as an alternative to Slack. Rocket.Chat has many key features that you or your business can use to improve productivity in the workplace such as video conferencing, group chats, and platform integrations with some of the most popular applications.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Rocket.Chat should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### Rocket.Chat Options

{{% content "marketplace-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}
- **Email address for the SOA record:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.

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

## Getting Started after Deployment

### Accessing the Rocket.Chat App

1.  Open a browser and navigate to the domain you created in the beginning of your deployment. You can also use your Compute Instance's rDNS, which will appear like `203-0-113-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing and setting the rDNS value.

1.  Enter your credentials which can be found in the credentials file on the server.

Now that you’ve accessed your Rocket.Chat instance, check out [the official Rocket.Chat documentation](https://docs.rocket.chat/guides/user-guides) to learn how to use the instance.

{{% content "marketplace-update-note-shortguide" %}}
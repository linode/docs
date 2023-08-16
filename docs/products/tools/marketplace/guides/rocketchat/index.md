---
description: "Deploy Rocket.Chat on a Linode Compute Instance. This provides you with a self-hosted open source chat application (Slack alternative)."
keywords: ['rocketchat','chat','slack','communication']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-11-12
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy Rocket.Chat through the Linode Marketplace"
external_resources:
- '[Rocket.Chat](https://rocket.chat/)'
aliases: ['/guides/deploying-rocketchat-marketplace-app/','/guides/rocketchat-marketplace-app/']
authors: ["Linode"]
---

Rocket.Chat is a self-hosted open source chat application that can be used as an alternative to Slack. Rocket.Chat has many key features that you or your business can utilize to improve productivity in the workplace such as video conferencing, group chats, and platform integrations with some of the most popular applications.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Rocket.Chat should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### Rocket.Chat Options

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Email address for the SOA record:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Accessing the Rocket.Chat App

1.  Open a browser and navigate to the domain you created in the beginning of your deployment. You can also use your Compute Instance's rDNS, which will appear like `203-0-113-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing and setting the rDNS value.

1.  From there, Rocket.Chat prompts you to fill out multiple forms to get your instance created and ready to use:

    ![Rocket.Chat Step 1](rocketchat-setup.png)
    ![Rocket.Chat Step 2](rocketchat-setup2.png)
    ![Rocket.Chat Step 3](rocketchat-setup3.png)
    ![Rocket.Chat Step 4](rocketchat-setup4.png)

Now that you’ve gone through the setup and accessed your Rocket.Chat instance, check out [the official Rocket.Chat documentation](https://docs.rocket.chat/guides/user-guides) to learn how to further utilize your Rocket.Chat instance.

{{< content "marketplace-update-note-shortguide">}}
---
title: "Deploy Hermes Agent"
description: "This tutorial will show you how to deploy Hermes Agent as a Quick Deploy App."
published: 2026-06-17
modified: 2026-06-17
keywords: ['AI', 'AI Agent']
tags: ["quick deploy apps", "AI", "AI Agent"]
aliases: []
external_resources:
- '[Hermes Agent](https://hermes-agent.nousresearch.com)'
- '[Hermes Agent Documentation](https://hermes-agent.nousresearch.com/docs)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 2141074
marketplace_app_name: "Hermes"
---

[Hermes Agent](https://hermes-agent.nousresearch.com) is an open-source AI agent platform designed for autonomous task execution through a persistent gateway service. The gateway connects communication channels, tools, and AI models, allowing the agent to receive instructions, perform actions, and automate multi-step workflows. Administrators configure and manage the system through a CLI setup wizard and a local web dashboard. Our Quick Deploy App allows you to connect to the Hermes Agent dashboard via a secure HTTPS endpoint protected by HTPASSWD.

This Quick Deploy App creates a Hermes Agent user on the system called `hermes`.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Hermes Agent should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Hermes Agent Options

- **Email address** *(optional)*: Enter the email address you want to use when configuring the SOA DNS record for a custom domain.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Performing Hermes Agent Onboarding

Once the deployment is complete, `hermes` is installed on the instance but is not running yet. Before you can start using Hermes Agent, you need to go through the setup wizard. This Quick Deploy App triggers the onboarding for you when you log in as root.

1. Log in to the instance:

   If you disabled root login to the server during the setup of the Hermes Agent app, log in to the server as a sudo user.

   ```command
   ssh admin@YOUR_INSTANCE_IP
   ```

   Replace `YOUR_INSTANCE_IP` with the IP address of your Linode instance and `admin` with the sudo user you created.

2. Escalate privileges to root:

   Once you've logged in, you can see the [motd](https://man7.org/linux/man-pages/man5/motd.5.html):

   ```output
   *********************************************************
   Akamai Connected Cloud Hermes Quick Deploy App
   Credentials File: /home/admin/.credentials
   Documentation: https://www.linode.com/docs/marketplace-docs/guides/hermes/
   *********************************************************
   ```

   Copy the sudo password from the `~/.credentials.txt` file and enter the following command in the terminal:

   ```command
   sudo su -
   ```

   When prompted for the password, paste the sudo password you copied from the `~/.credentials.txt` file. When you log in as **root**, the message about the setup wizard appears. If you are ready to perform the onboarding, enter `y` and it takes you to Hermes Agent's & Hermes Gateway setup wizards where you can complete the configuration.

   Once onboarding is complete, the setup script is removed.

### Confirm Hermes and Gateway Statuses

At this point, you've configured Hermes Agent on the server. To verify the Hermes and Hermes gateway are running, you need to become the `hermes` user. Enter the following in the terminal as the **root** user:

```command
su - hermes
```

To view the hermes and gateway statuses, enter the following as the **hermes** user:

```command
hermes agent status

hermes gateway status
```

{{% content "marketplace-update-note-shortguide" %}}

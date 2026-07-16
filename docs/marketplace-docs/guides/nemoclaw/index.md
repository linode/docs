---
title: "Deploy NemoClaw"
description: "This tutorial will show you how to deploy NemoClaw as a Quick Deploy App."
published: 2026-07-16
modified: 2026-07-16
keywords: ['AI', 'AI Agent', 'NVIDIA']
tags: ["quick deploy apps", "AI", "AI Agent"]
aliases: ['/products/tools/marketplace/guides/nemoclaw/','/guides/nemoclaw/']
external_resources:
- '[NemoClaw](https://github.com/NVIDIA/NemoClaw)'
- '[NemoClaw Documentation](https://docs.nvidia.com/nemoclaw/latest/)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 2164119
marketplace_app_name: "NemoClaw"
---

[NemoClaw](https://github.com/NVIDIA/NemoClaw) is an open-source CLI orchestrator from NVIDIA that runs the OpenClaw AI agent inside a Docker sandbox and proxies its network access through a companion process called OpenShell. It is not a typical web app: it is configured through a guided CLI wizard (`nemoclaw onboard`) that picks an inference provider, collects credentials, and starts the sandboxed dashboard. This Quick Deploy App handles all the necessary infrastructure setup so you can focus on running your AI agent workloads in an isolated, secure environment.

This Quick Deploy App creates a limited user on the system called `nemoclaw` and configures systemd services for automatic sandbox management.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** NemoClaw should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** We recommend at least a Linode 8GB or higher plan to comfortably run the OpenClaw agent and associated services.

## NemoClaw Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### What Has Been Installed

After deployment, the following components are installed and ready:

- **NemoClaw CLI**: Ready to orchestrate and manage your AI agent sandbox
- **Docker**: Container runtime for isolating agent execution
- **OpenShell Gateway**: Network proxy for secure sandbox communication
- **Onboarding Script**: Triggered on your first root login to configure your setup

### Performing NemoClaw Onboard

Once the deployment is complete, you need to perform the onboarding wizard to configure your inference provider and start the dashboard. The onboarding is triggered automatically when you log in as root.

1.  Log into the instance.

    If you disabled root login during the setup of the NemoClaw app, you need to log into the server as the root or sudo user.

    ```command
    ssh root@YOUR_INSTANCE_IP
    ```

    Replace `YOUR_INSTANCE_IP` with the IP address of your Linode instance.

1.  Once you've logged in, note the MOTD (message of the day):

    ```output
    *********************************************************
    Akamai Connected Cloud NemoClaw Quick Deploy App
    Dashboard Access: SSH tunnel required (see details below)
    Credentials File: /home/admin/.credentials
    Documentation: https://www.linode.com/docs/marketplace-docs/guides/nemoclaw/
    *********************************************************
    ```
1. The onboarding script will automatically run and you will be prompted to start the setup wizard for NemoClaw

    ```output
    Do you want to run the nemoclaw onboard wizard? [y/n]:
    ```

1.  Complete the onboarding wizard.

    If you are ready to perform the onboarding, enter `y` to start the `nemoclaw onboard` wizard. The wizard will prompt you to:

    - **Select an inference provider**: Choose from supported options including NVIDIA Build/Endpoints, OpenAI, Anthropic, OpenRouter, Gemini, or a self-hosted OpenAI-compatible server.
    - **Supply provider credentials**: Enter the API key or connection details for your chosen provider.

    {{< note >}}
    **Important**: NemoClaw requires an external Large Language Model (LLM) to function. You must provide valid credentials for at least one of the supported inference providers during onboarding. Once setup is complete, the onboarding script automatically removes itself so it won't prompt again on next login.
    {{< /note >}}

### Accessing the Dashboard

The NemoClaw dashboard is not exposed on a public HTTP(S) endpoint. Instead, access it securely through SSH tunneling from your local machine.

1.  On your local machine, establish an SSH tunnel:

    ```command
    ssh -L 18789:127.0.0.1:18789 root@YOUR_INSTANCE_IP
    ```

    Replace `YOUR_INSTANCE_IP` with your Linode instance's IP address. This forwards port 18789 on your local machine to the dashboard port on the instance.

2.  While the tunnel is open, obtain the dashboard URL and token by running this command on the instance:

    ```command
    sudo -i -u nemoclaw nemoclaw dashboard-url
    ```

    This outputs a URL similar to:

    ```output
    Dashboard URL:
    http://127.0.0.1:18789/#token=DbsMSK8L7eyavy2FVR4A1z6YORErn8V9jjWzP4HWL0A
    Treat this URL like a password -- do not log, share, or commit it.
    ```

3.  Open your browser and visit the local URL with the token to access the dashboard.

{{< note >}}
**Security**: The dashboard token is sensitive. Treat it like a password and do not share or commit it to version control.
{{< /note >}}

{{% content "marketplace-update-note-shortguide" %}}

## Next Steps

- Review the [NemoClaw Documentation](https://docs.nvidia.com/nemoclaw/latest/) for advanced features and configurations.
- Check the [NemoClaw GitHub Repository](https://github.com/NVIDIA/NemoClaw) for the latest updates and community support.
- Explore inference provider documentation for optimizing your chosen AI model endpoint.
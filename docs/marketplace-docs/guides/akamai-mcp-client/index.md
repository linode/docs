---
title: "Deploy Akamai MCP Gateway Client"
description: "This tutorial will show you how deploy Akamai MCP Gateway Client as a Quick Deploy App."
published: 2026-05-18
modified: 2026-05-18
keywords: ['LLM', 'AI Agent', 'Akamai MCP', 'Akamai MCP Gateway']
tags: ["quick deploy apps", "AI", "AI Agent", "LLM"]
aliases: ['/products/tools/marketplace/guides/akamai-mcp-client/','/guides/akamai-mcp-client/']
external_resources:
- '[Akamai MCP Gateway](https://techdocs.akamai.com/mcp-gateway/docs/welcome)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 2107652
marketplace_app_name: "Akamai MCP Gateway Client"
---

The [Akamai Model Context Protocol](https://techdocs.akamai.com/mcp-gateway/docs/welcome) (MCP) Gateway is a managed service that helps you bridge AI agents and applications with the Akamai product ecosystem. This Quick Deploy Apps allows customers to connect LLMs as clients to Akamai's MCP Gateway and interact with various APIs from a single source.

This Quick Deploy App configures Claude to Akamai's MCP Gateway so that you can interact with various APIs. In order to use this app, you will need an [Akamai MCP Gateway JWT](https://techdocs.akamai.com/mcp-gateway/docs/configure-the-mcp-server-endpoint) token.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Claude Code should be fully installed within 5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Akamai MCP Gateway Options

- **Akamai JWT token** *(required)*: Enter the JWT token from your Akamai MCP Gateway

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Configuring Claude Code

Once the deployment is complete, you will need to authenticate to your Anthropic account. Claude Code will be installed on the `root` user so you will need to elevate privileges.

1.  Log into the instance.

    If you disabled root login to the server during the setup of the app, you need to log into the server as the sudo user.

    ```command
    ssh admin@YOUR_INSTANCE_IP
    ```

    Replace `YOUR_INSTANCE_IP` with the IP address of your Linode instance and `admin` with the sudo user you created.

1.  Escalate privileges to root.

    Once you've logged in, note the [motd](https://man7.org/linux/man-pages/man5/motd.5.html):

    ```output
    *********************************************************
    Akamai MCP Gateway Client
    Credentials File: /home/admin/.credentials
    Documentation: https://www.linode.com/docs/marketplace-docs/guides/akamai-mcp-gateway
    *********************************************************    
    ```

    Copy the sudo password from `~/.credentials.txt` and enter the following command from the terminal:

    ```command
    sudo su -
    ```

    When prompted for the password, paste the sudo password you got from the `~/.credentials.txt` file.

1. Authenticate to Anthropic

As the `root` user, issue the following command from the terminal:

```command
claude
```

![Claude Code Welcome](claude-welcome.jpg)

Go ahead and proceed with the initial configuration for Claude Code.

### Verify Akamai MCP Gateway Status

To confirm that the Akamai MCP Gateway is connected, you can issue the following command from the terminal:

```command
claude mcp get akamai
```

You will see a similar output:

```output
akamai:
  Scope: User config (available in all your projects)
  Status: ✓ Connected
  Type: http
  URL: https://mcp.akamai.com/mcp?token=**********
```

{{% content "marketplace-update-note-shortguide" %}}

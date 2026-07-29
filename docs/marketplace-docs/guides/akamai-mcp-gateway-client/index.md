---
title: "Deploy Akamai MCP Gateway Client"
description: "This tutorial will show you how deploy Akamai MCP Gateway Client as a Quick Deploy App."
published: 2026-05-18
modified: 2026-05-18
keywords: ['LLM', 'AI Agent', 'Akamai MCP', 'Akamai MCP Gateway']
tags: ["quick deploy apps", "AI", "AI Agent", "LLM"]
aliases: []
external_resources:
- '[Akamai MCP Gateway](https://techdocs.akamai.com/mcp-gateway/docs/welcome)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 2107652
marketplace_app_name: "Akamai MCP Gateway Client"
---

The [Akamai Model Context Protocol (MCP) Gateway](https://techdocs.akamai.com/mcp-gateway/docs/welcome) is a managed service that helps you bridge AI agents and applications with the Akamai product ecosystem. This Quick Deploy App configures Claude to use Akamai's MCP Gateway so that you can interact with Akamai APIs from Claude. In order to deploy this app, you first need an [Akamai MCP Gateway JWT](https://techdocs.akamai.com/mcp-gateway/docs/configure-the-mcp-server-endpoint) token.

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

- **Akamai JWT token** *(required)*: Enter your [Akamai MCP Gateway JWT](https://techdocs.akamai.com/mcp-gateway/docs/configure-the-mcp-server-endpoint) token.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Configure Claude Code

Complete these steps on the Linode instance to authenticate to your Anthropic account:

1.  Log into the Linode instance:

    ```command
    ssh {{< placeholder "YOUR_LINODE_USERNAME" >}}@{{< placeholder "YOUR_LINODE_IP" >}}
    ```

    Replace {{< placeholder "YOUR_LINODE_IP" >}} with the IP address of the new Linode instance, and replace {{< placeholder "YOUR_LINODE_USERNAME" >}} with the sudo user you configured when the Quick Deploy App was deployed.

1.  After you log in, note the [motd](https://man7.org/linux/man-pages/man5/motd.5.html):

    ```output
    *********************************************************
    Akamai MCP Gateway Client
    Credentials File: /home/admin/.credentials
    Documentation: https://www.linode.com/docs/marketplace-docs/guides/akamai-mcp-gateway
    *********************************************************
    ```

    Open and copy the sudo password from `~/.credentials.txt`, which is used in the next step.

1. Switch to the root user:

    ```command
    sudo su -
    ```

    This command prompts you for your sudo password. Paste the sudo password from the `~/.credentials.txt` file.

1. Authenticate to Anthropic by running the `claude` executable:

    ```command
    claude
    ```

    Complete the initial configuration that you are prompted with by Claude.

### Verify Akamai MCP Gateway Status

Confirm that the Akamai MCP Gateway is connected:

```command
claude mcp get akamai
```

Output like the following should appear:

```output
akamai:
  Scope: User config (available in all your projects)
  Status: ✓ Connected
  Type: http
  URL: https://mcp.akamai.com/mcp?token=**********
```

{{% content "marketplace-update-note-shortguide" %}}

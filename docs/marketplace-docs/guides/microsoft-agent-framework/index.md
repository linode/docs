---
title: "Deploy Microsoft Agent Framework"
description: "This tutorial will show you how to deploy Microsoft Agent Framework as a Quick Deploy App."
published: 2026-07-21
keywords: ['AI Framework', 'AI']
tags: ["quick deploy apps", "linode platform", "cloud manager"]
external_resources:
- '[Microsoft Agent Framework Documentation](https://learn.microsoft.com/en-us/agent-framework/)'
aliases: ['/products/tools/marketplace/guides/microsoft-agent-framework/', '/guides/microsoft-agent-framework/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 2165612
marketplace_app_name: "Microsoft Agent Framework"
---

Microsoft Agent Framework is an open source framework for building, orchestrating, and deploying AI agents and multi-agent applications. It provides you with the tools to create intelligent agents that can reason, use tools, collaborate, and automate complex workflows.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Microsoft Agent Framework should be fully installed within 5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## CrewAI Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Testing Python SDK

Once the deployment is complete, the `agent-framework` library should already be installed on your instance. This allows you to import the library into your software. To get started:

1. Create an example directory called `science`.

    ```command
    mkdir science
    ```

2. Create a test Python file called `agent.py` that allows you to use our AI model.

    ```
    cd science
    vim agent.py
    ```

3. Enter the following content into the `agent.py` Python file.

    ```python
    import asyncio
    from openai import AsyncOpenAI
    from agent_framework import Agent
    from agent_framework.openai import OpenAIChatClient

    async def main():
        client = OpenAIChatClient(
            model="Qwen/Qwen3-14B-AWQ",
            base_url="http://localhost:8000/v1",
            api_key="dummy",
        )

        agent = client.as_agent(
            name="Assistant",
            instructions="You are a helpful assistant.",
        )

        result = await agent.run("Why is the sky blue?")

        print(result)

    if __name__ == "__main__":
        asyncio.run(main())
    ```

4. Once you save the file, execute it with the following command.

    ```command
    python3 agent.py
    ```

This example uses a self-hosted model exposed via the LLM's API. If you want to use a provider model, refer to the Microsoft Agent Framework documentation.

{{% content "marketplace-update-note-shortguide" %}}

---
title: "Deploy Haystack"
description: "This tutorial will show you how to deploy Haystack as a Quick Deploy App."
published: 2026-07-21
keywords: ['AI Framework', 'AI']
tags: ["quick deploy apps", "linode platform", "cloud manager"]
external_resources:
- '[Haystack Documentation](https://docs.haystack.deepset.ai/docs/get-started)'
aliases: ['/products/tools/marketplace/guides/haystack/', '/guides/haystack/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 2165521
marketplace_app_name: "Haystack"
---

Haystack is an open source framework for building applications that use large language models (LLMs). Instead of requiring you to write custom orchestration logic for every use case, it provides a structured way to assemble AI functionality through reusable components connected in pipelines. This approach makes it well-suited for creating retrieval-augmented generation (RAG) systems, AI agents, search experiences, chat applications, and other LLM-driven solutions.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Haystack should be fully installed within 5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Haystack Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Testing Python SDK

Once the deployment is complete, the `haystack-ai` library should already be installed on your instance. This allows you to import the library into your software. To get started:

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
    from haystack.components.agents import Agent
    from haystack.components.generators.chat import OpenAIChatGenerator
    from haystack.dataclasses import ChatMessage
    from haystack.tools import ComponentTool
    from haystack.utils import Secret

    agent = Agent(
        chat_generator=OpenAIChatGenerator(
            api_base_url="http://localhost:8000/v1",
            api_key=Secret.from_token("EMPTY"),
            model="Qwen/Qwen3-14B-AWQ",
        ),
        system_prompt="You are a helpful assistant that can search the web for information.",
    )

    result = agent.run(
        messages=[ChatMessage.from_user("What is Haystack AI?")]
    )

    print(result["last_message"].text)
    ```

4. Once you save the file, execute it with the following command.

    ```command
    python3 agent.py
    ```

This example uses a self-hosted model exposed via the LLM's API. If you want to use a provider model, refer to the Haystack documentation.

{{% content "marketplace-update-note-shortguide" %}}

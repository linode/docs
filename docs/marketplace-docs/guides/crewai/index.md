---
title: "Deploy CrewAI"
description: "This tutorial will show you how to deploy CrewAI as a Quick Deploy App."
published: 2026-06-15
modified: 2026-03-15
keywords: ['AI Framework', 'AI', 'AI Agent']
tags: ["quick deploy apps", "AI Framework", "AI", "AI Agent"]
aliases: ['/products/tools/marketplace/guides/crewai/','/guides/crewai/']
external_resources:
- '[CrewAI](https://crewai.com)'
- '[CrewAI Documentation](https://docs.crewai.com/en/introduction)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 2138475
marketplace_app_name: "CrewAI"
---

CrewAI is an open source framework for building and orchestrating AI agents that work together as a team to accomplish complex tasks. Instead of relying on a single large language model prompt, CrewAI allows developers to create specialized agents with distinct roles, responsibilities, and goals. These agents can collaborate, delegate work, share information, and execute multi-step workflows autonomously.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** CrewAI should be fully installed within 5-7 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## CrewAI Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Create Your First Crew

Once the deployment is complete, the `crewai` binary is installed on the instance. This allows you to create the first group of agents.

1. To get started, create an example crew called `research`.

    ```command
    crewai create crew research
    ```

    This command creates a project scaffold with everything that you need to run your agents. To understand more about the project structure, see the [Crew AI documentation](https://docs.crewai.com/en/installation#creating-a-crewai-project).

2. Install the `research` crew. This installs the default crew of agents that comes with CrewAI.

    ```command
    cd research
    crewai install --prerelease=allow
    ```

3. To run the agents, use the following command.

    ```command
    crewai run
    ```

    Once the command is executed, all of the agents and tasks start running. On execution, you can see the agent's reasoning and how they perform tasks assigned to them.

    The default crew for CrewAI allows a group of agents to research AI trends for the year. A Markdown file is created, highlighting the research in a bulleted list.

{{% content "marketplace-update-note-shortguide" %}}

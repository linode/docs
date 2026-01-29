---
title: "Deploy Chroma through the Linode Marketplace"
description: "Learn how to deploy Chroma, the AI-native open-source embedding database, on an Akamai Compute Instance."
published: 2025-12-16
keywords: ['vector database','database','chromadb']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[ChromaDB Official Documentation](https://www.trychroma.com/)'
aliases: ['/products/tools/marketplace/guides/chromadb/','/guides/chromadb-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1976719
marketplace_app_name: "Chroma"
---

[Chroma](https://www.trychroma.com/) is the AI-native open-source embedding database. Chroma makes it easy to build LLM apps by making knowledge, facts, and skills pluggable for LLMs.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Chroma should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions**: Ubuntu 24.04 LTS
- **Recommended plan**: Chroma [recommends](https://docs.trychroma.com/guides/deploy/performance) deploying on a plan with at least 2GB of RAM. In general, running Chroma on higher-tier plans reduces query latency and allows for larger collection sizes.

### Chroma Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Connect Your Application to Chroma Server

This Marketplace App deploys Chroma as a single-node Docker setup secured with Basic Authentication. To start using your Chroma instance, you must configure your client application to connect to this server using the provided credentials. For detailed instructions on setting up a client/server environment, please refer to the officially supported [Chroma Client/Server documentation](https://docs.trychroma.com/docs/run-chroma/client-server).


{{% content "marketplace-update-note-shortguide" %}}
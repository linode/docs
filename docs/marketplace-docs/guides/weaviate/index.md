---
title: "Deploy Weaviate through the Linode Marketplace"
description: "Learn how to deploy Weaviate, an AI-native vector database with GPU-accelerated semantic search capabilities, on an Akamai Compute Instance."
published: 2025-11-14
keywords: ['vector database','database','weaviate']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Weaviate Official Documentation](https://docs.weaviate.io/weaviate)'
aliases: ['/products/tools/marketplace/guides/weaviate/','/guides/weaviate-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1902904 # Need to update
marketplace_app_name: "Weaviate"
---

[Weaviate](https://www.weaviate.io/) is an open-source AI-native vector database designed for building advanced AI applications. It stores and indexes both data objects and their vector embeddings, enabling semantic search, hybrid search, and Retrieval Augmented Generation (RAG) workflows. This deployment includes GPU acceleration for transformer models and comes pre-configured with the sentence-transformers model for high-performance semantic search capabilities.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Weaviate should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions**: Ubuntu 24.04 LTS
- **Recommended plan**: All GPU plan types and sizes can be used.

### Weaviate Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Obtain Your API Keys

Weaviate is a database service accessed programmatically through its API, not through a web-based UI. Your deployment includes two API keys stored in a credentials file.

1.  Log in to your Compute Instance via SSH or Lish. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance, or use the [Lish Console](/docs/products/compute/compute-instances/guides/lish/).

1.  Once logged in, retrieve your API keys from the credentials file:

    ```command
    cat /home/$USER/.credentials
    ```

    The credentials file contains two API keys:
    - **Admin API Key**: Full read/write access to all Weaviate operations
    - **User API Key**: Read-only access for querying data

### Connect Your Application to Weaviate

To integrate Weaviate into your application, use one of the official client libraries. Weaviate provides native clients for multiple programming languages, allowing you to perform all database operations including creating schemas, importing data, and running vector searches.

See the [Weaviate Client Libraries documentation](https://docs.weaviate.io/weaviate/client-libraries) for installation instructions and API references.

For complete examples and advanced usage, refer to the [Weaviate Quickstart Guide](https://docs.weaviate.io/weaviate/quickstart) and the client library documentation for your preferred language.


{{% content "marketplace-update-note-shortguide" %}}
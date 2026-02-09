---
title: "Deploy pgvector through the Linode Marketplace"
description: "Deploy Pgvector, an open-source vector extension for Postgresql for similarity search and AI embeddings."
published: 2026-02-09
modified: 2026-02-09
keywords: ['pgvector', 'postgresql', 'vector database', 'AI', 'embeddings', 'similarity search']
tags: ["ubuntu", "marketplace", "developer", "postgresql", "pgvector", "linode platform", "machine learning"]
external_resources:
- '[pgvector GitHub](https://github.com/pgvector/pgvector)'
- '[pgvector Documentation](https://github.com/pgvector/pgvector#readme)'
- '[PostgreSQL Documentation](https://www.postgresql.org/docs/)'
aliases: ['/products/tools/marketplace/guides/pgvector/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

Pgvector is an open-source PostgreSQL extension that enables vector similarity search directly inside a relational database. It allows you to store embeddings alongside structured data and perform nearest-neighbor searches using cosine similarity, inner product, or Euclidean distance—making it well-suited for AI, semantic search, and retrieval-augmented generation (RAG) workloads.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Pgvector should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Suggested plan:** Dedicated 16GB instance or higher for baseline development and testing with support for GPU instances.

### Pgvector Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

When deployment completes, the system automatically generates credentials to administer your Pgvector instance. These are stored in the limited user’s `.credentials` file.

1. Log in to your Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click **Linodes**, select your instance, and click **Launch LISH Console**. Log in as `root`. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

2. Run the following command to access the contents of the `.credentials` file:

```command
cat /home/$USERNAME/.credentials
```

## Getting Started after Deployment

You can start by connecting to your PostgreSQL database

```command
psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB
```
The connection credentials can be found in the `.credentials` file located at `/home/$USERNAME/.credentials`.

You can then define vector columns and run similarity queries directly in SQL.

Pgvector works with standard PostgreSQL clients and integrates easily with popular AI frameworks and ORMs:

    - **[psycopg](https://www.psycopg.org/)**: PostgreSQL adapter for Python
    - **[SQLAlchemy](https://www.sqlalchemy.org/)**: Python ORM with pgvector support
    - **[pgvector-node](https://github.com/pgvector/pgvector-node)**: Node.js client helpers
    - **[pgvector-go](https://github.com/pgvector/pgvector-go)**: Go utilities for pgvector

If you want to learn more about Pgvector, check out the [official Pgvector documentation](https://github.com/pgvector/pgvector?tab=readme-ov-file#getting-started) to explore indexing strategies, performance tuning, and advanced query patterns.

{{% content "marketplace-update-note-shortguide" %}}
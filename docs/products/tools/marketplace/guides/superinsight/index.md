---
description: "Deploy Superinsight DB, a relational database for unstructured data, on the Linode platform."
keywords: ['superinsight','database','relational','unstructured','postgresql']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-01-23
title: "Deploy Superinsight DB through the Linode Marketplace"
external_resources:
- '[Superinsight DB](https://github.com/superinsight/superinsight-db)'
authors: ["Linode"]
---

[Superinsight DB](https://github.com/superinsight/superinsight-db) is a relational database for unstructured data. Its main purpose is to provide a simple SQL interface to store and search unstructured data. Superinsight is built on top of PostgreSQL, which means you can take advantage of PostgreSQL features and the ability to run machine learning operations using SQL statements.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Superinsight DB should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS and 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

1. Log into your new Compute Instance through [LISH](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance) using the root user and the password you entered when creating the instance.

1. If you log in on the same day you deployed the app, a message is displayed with the username and password for the new database as well as an example database connection string.

    ```output
    Superinsight created the user admin with password: 1d892e9d3584a39471b76121
    You can can connect using a database client with the following connection string postgres://admin:1d892e9d3584a39471b76121@192.0.2.229:5432/superinsight
    For complete source code and information, visit: https://github.com/superinsight/superinsight-db
    ```

    If you don't see this message, you can output it using the command below:

    ```command
    cat /etc/motd
    ```

1. You can now connect to the database using any client that supports the PostgreSQL protocol. You can use the example connection string provided in the last step, which should be similar to the following:

    ```command
    postgres://[username]:[password]@[ip-address]:5432/superinsight
    ```

    For more information regarding connecting to the database and adding data, see the [Superinsight Quickstart Guide](https://docs.superinsight.ai/quickstart/).

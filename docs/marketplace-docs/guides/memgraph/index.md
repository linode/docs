---
title: "Deploy Memgraph"
description: "This guide includes instructions on how to deploy Memgraph, a high-performance graph database platform, on an Akamai Compute Instance."
published: 2026-02-20
modified: 2026-02-20
keywords: ['memgraph', 'graph-database', 'cypher', 'bolt', 'real-time-analytics', 'database', 'graph']
tags: ["quick deploy apps", "linode platform", "cloud manager", "database", "graph-database"]
aliases: ['/products/tools/marketplace/guides/memgraph/']
external_resources:
- '[Memgraph Documentation](https://memgraph.com/docs)'
- '[Memgraph Cypher Manual](https://memgraph.com/docs/querying/cypher)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1878106
marketplace_app_name: "Memgraph"
---

Memgraph is a high-performance, in-memory graph database built for real-time analytics, streaming data, and complex relationship queries. It is fully compatible with the Cypher query language, making it easy for developers familiar with Neo4j-style graph workflows to build and deploy graph-powered applications.

Memgraph is optimized for use cases such as fraud detection, recommendation engines, network analysis, and real-time decision systems. With native support for streaming data pipelines and advanced graph algorithms, Memgraph enables low-latency processing and scalable graph workloads in production environments.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note title="Estimated deployment time" >}}
Memgraph should be fully installed within 3-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Recommended plan:** Shared CPU 4GB or Dedicated CPU 4GB (or larger for production workloads)

{{< note type="warning" >}}
For production deployments handling large graph datasets or real-time streaming workloads, we strongly recommend using a Dedicated CPU plan to ensure consistent performance.
{{< /note >}}

### Memgraph Options

- **Memgraph User** *(required)*: This will be the user for your memgraph database.

- **Email address (for DNS SOA email)** *(optional)*: If you are deploying this with a domain, it will require an email address to add to the SOA record.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

### Obtain the Credentials

When deployment completes, the system automatically generates credentials to administer your Memgraph instance. These are stored in the limited user’s `.credentials` file.

1. Log in to your Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click **Linodes**, select your instance, and click **Launch LISH Console**. Log in as `root`. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

2. Run the following command to access the contents of the `.credentials` file:

```command
cat /home/$USERNAME/.credentials

## Connecting to Memgraph

Memgraph listens on the Bolt protocol by default on port `7687`.

You can connect using:

- **mgconsole (CLI)** installed on the server
- Any Bolt-compatible driver (Python, JavaScript, Go, Java, etc.)

### Example using mgconsole locally on the server


        mgconsole --host 127.0.0.1 --port 7687 --username MEMGRAPH_USER --password YOUR_PASSWORD

## Basic Verification Query

After logging in through the mgconsole, you can run the following just to output the memgraph version and memgraph edition of your deployment:

        CALL dbms.components() YIELD name, version, edition
        RETURN name, version, edition;

Now that you’ve accessed your memgraph instance, check out [the official Memgraph documentation](https://memgraph.com/docs) to learn how to further use your instance.

{{% content "marketplace-update-note-shortguide" %}}
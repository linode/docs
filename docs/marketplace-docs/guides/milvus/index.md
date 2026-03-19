---
title: "Deploy Milvus through the Linode Marketplace"
description: "Deploy Milvus, an open-source vector database for AI, similarity search, and embeddings workloads."
published: 2026-02-09
modified: 2026-02-09
keywords: ['milvus', 'vector database', 'AI', 'embeddings', 'similarity search']
tags: ["ubuntu", "marketplace", "developer", "milvus", "linode platform", "machine learning"]
external_resources:
- '[Milvus.io](https://milvus.io/)'
- '[Milvus Documentation](https://milvus.io/docs)'
- '[Milvus Quickstart Guide](https://milvus.io/docs/install_standalone-docker.md)'
aliases: ['/products/tools/marketplace/guides/milvus/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

Milvus is a high-performance open-source vector database that enables fast similarity search across unstructured data, including image, video, audio, and text embeddings. Designed for AI workloads and large-scale vector indexing, Milvus provides millisecond-level retrieval performance and integrates easily with popular machine learning frameworks and embedding services.

This guide includes steps for deploying the Milvus Standalone Marketplace App on a Linode Compute Instance using Docker Compose.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** After provisioning completes, the Milvus Standalone container stack initializes in approximately 3–5 minutes.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** Dedicated 16GB instance or higher for baseline development and testing with support for GPU instances.

### Milvus Deployment Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

When deployment completes, the system automatically generates credentials for internal MinIO storage and other parameters needed to administer your Milvus instance. These are stored in the limited user’s `.credentials` file.

1. Log in to your Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click **Linodes**, select your instance, and click **Launch LISH Console**. Log in as `root`. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

2. Run the following command to access the `.credentials` file:

```command
cat /home/$USERNAME/.credentials
```

### Getting Started After Deployment

Once the Milvus Standalone container is deployed and running, you can connect to the database and begin creating collections, inserting vectors, and performing searches.

To interact with Milvus, install the a supported client SDK (Python, Go, Java, Node.js).

    - **[pymilvus](https://github.com/milvus-io/pymilvus)**: Python SDK for Milvus Vector Database
    - **[milvus-sdk-node](https://github.com/milvus-io/milvus-sdk-node)**: node.js SDK for Milvus Vector Database
    - **[Milvus Go SDK](https://milvus.io/docs/install-go.md)**: GO SDK for Milvus Vector Database
    - **[Milvus Java SDK](https://milvus.io/docs/install-java.md)**: Java SDK for Milvus Vector Database

### Verify Running Containers

First, confirm that all Milvus-related containers are running:

```command
docker ps
```
You should see containers for Milvus, etcd, and MinIO in a running state.

### Access the MinIO Dashboard
Milvus uses MinIO as its object storage backend. You can access the MinIO web interface to verify bucket creation and storage activity.

To access your MinIO Dashboard, Open a browser and navigate to your Linode rDNS domain `https://203-0-113-0.ip.linodeusercontent.com`. Replace `https://203-0-113-0.ip.linodeusercontent.com` with your [Linode's RDNS domain](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#viewing-ip-addresses). The credentials can be found in the `.credentials` file (/home/$USERNAME/.credentials).

If you want to learn more about Milvus, checkout [the official Milvus documentation](https://milvus.io/docs) to learn how to further utilize your instance.

{{% content "marketplace-update-note-shortguide" %}}
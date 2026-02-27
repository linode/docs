---
title: "Deploy Neo4j"
description: "This guide includes instructions on how to deploy Neo4j, a leading graph database platform, on an Akamai Compute Instance."
published: 2026-02-23
modified: 2026-02-23
keywords: ['neo4j', 'graph-database', 'cypher', 'bolt', 'graph-analytics', 'database', 'graph']
tags: ["quick deploy apps", "linode platform", "cloud manager", "database", "graph-database"]
aliases: ['/products/tools/marketplace/guides/neo4j/']
external_resources:
- '[Neo4j Documentation](https://neo4j.com/docs/)'
- '[Cypher Query Language Manual](https://neo4j.com/docs/cypher-manual/current/)'
- '[Neo4j Operations Manual](https://neo4j.com/docs/operations-manual/current/)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1884304
marketplace_app_name: "Neo4j"
---

Neo4j is a high-performance, native graph database designed to store, manage, and query highly connected data. Using the Cypher query language, Neo4j enables developers to model complex relationships and traverse large datasets efficiently.

Neo4j is widely used for applications such as fraud detection, knowledge graphs, recommendation engines, identity and access management, network analysis, and AI-driven data exploration. Its native graph storage engine and ACID-compliant transactions make it suitable for both development and production workloads.

## Deploying a Quick Deploy App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note title="Estimated deployment time" >}}
Neo4j should be fully installed within 3-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Recommended plan:** Shared CPU 4GB or Dedicated CPU 4GB (or larger for production workloads)

{{< note type="warning" >}}
For production deployments handling large graph datasets, analytics workloads, or high concurrency, we strongly recommend using a Dedicated CPU plan to ensure consistent performance and predictable resource allocation.
{{< /note >}}

### Neo4j Options

- **IP Address Allowed to Access Neo4j UI** *(recommended)*: Any IP that needs to access the Neo4j UI can be added to the firewall. *Please note* If you do not add an IP to this field, the UI will not be exposed. Firewall rules can be added later to allow access to the UI
- **IP addresses allowed to access Bolt** *(recommended)*: Any IP that needs Bolt access can be added to the firewall. *Please note* If you do not add an IP to this field. Firewall rules can be added later to allow access to the UI.
- **Email address (for the Let's Encrypt SSL certificate)** *(optional)*: If deploying with HTTPS enabled for Neo4j Browser or reverse proxy access, this email is used for Let's Encrypt renewal notices.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

### Obtain the Credentials

When deployment completes, the system automatically generates and stores credentials for administering your Neo4j instance. These credentials are stored in the limited user’s `.credentials` file.

1. Log in to your Compute Instance using one of the methods below:

   - **Lish Console**: Log in to Cloud Manager, click **Linodes**, select your instance, and click **Launch LISH Console**. Log in as `root`. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
   - **SSH**: Log in to your instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

2. Run the following command to access the contents of the `.credentials` file:

```command
cat /home/$USERNAME/.credentials
```
### Accessing Neo4j Browser

Once your app has finished deploying, you can log into Neo4j UI using your browser.

1.  Open your web browser and navigate to `https://$DOMAIN$:7473/browser`, where *DOMAIN* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

**Please Note** If you did not add your local IP to the allow list at the beginning of the deployment, you will need to add it to the firewall in order to access the UI. You can utilize [UFW firewall guide](/docs/guides/configure-firewall-with-ufw/) to add your IP to the allow list.

Log in using the credentials from the `/home/$USERNAME/.credentialsoffic` file.

## Connecting via Bolt

Neo4j uses the Bolt protocol for application and driver connections.

## Example: Using cypher-shell on the Server

On your Neo4j instance `cypher-shell` is installed to interact with your neo4j service. You can use the following example to connect to your neo4j database:


        cypher-shell -a bolt://127.0.0.1:7687 -u NEO4J_USER -p YOUR_PASSWORD


## Basic Verification Query

After logging in through Neo4j Browser or `cypher-shell`, run:

        SHOW DATABASES;

This query will return all databases, and confirms that your Neo4j instance is operational. Now that you’ve accessed your instance, check out [the official Neo4j documentation](https://neo4j.com/docs/) to learn how to further use your instance.

{{% content "marketplace-update-note-shortguide" %}}
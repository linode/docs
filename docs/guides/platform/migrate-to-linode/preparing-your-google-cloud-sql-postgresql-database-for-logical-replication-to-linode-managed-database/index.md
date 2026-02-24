---
slug: preparing-your-google-cloud-sql-postgresql-database-for-logical-replication-to-linode-managed-database
title: "Preparing Your Google Cloud SQL PostgreSQL Database for Logical Replication to Linode Managed Database"
description: "Prepare your Google Cloud SQL for PostgreSQL database for logical replication to a Linode Managed Database. Configure server parameters, network access, and a replication user."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2026-02-18
keywords: ['Google Cloud SQL', 'PostgreSQL', 'logical replication', 'Cloud SQL replication', 'Linode Managed Database', 'publication', 'replication user', 'database flags']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Set up logical replication and decoding](https://cloud.google.com/sql/docs/postgres/replication/configure-logical-replication)'
- '[Cloud SQL for PostgreSQL Documentation](https://cloud.google.com/sql/docs/postgres)'
- '[gcloud sql CLI Documentation](https://cloud.google.com/sdk/gcloud/reference/sql)'
---

[Logical replication](https://www.postgresql.org/docs/current/logical-replication.html) continuously synchronizes database tables, allowing you to prepare the destination database in advance. This approach minimizes downtime when you switch application traffic and retire the source database.

This guide explains how to prepare a Google Cloud SQL for PostgreSQL for logical replication to a [Linode Managed Database](https://www.linode.com/products/databases/). Follow this guide before returning to the [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) guide to [create the subscription](https://www.postgresql.org/docs/current/sql-createsubscription.html) on Akamai Cloud.

Follow the steps in this guide to:

-   Configure your Cloud SQL instance to support logical replication.
-   Ensure secure network access from Linode.
-   Create a dedicated replication user.
-   Set up a publication for the tables you wish to replicate.

After completing these steps, return to [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) to configure the subscriber and finalize the setup.

## Before You Begin

1.  Follow the [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) guide up to the **Prepare the Source Database for Logical Replication** section to obtain the public IP address or CIDR range of your Linode Managed Database.

1.  Ensure that you have administrative access to your GCP project, including permissions to modify Cloud SQL instance flags and authorized networks.

1.  Install and authenticate the Google Cloud CLI (`gcloud`) on your local machine.

### Placeholders and Examples

The following placeholders and example values are used in commands throughout this guide:

| Parameter | Placeholder | Example Value |
|------------|--------------|----------------|
| GCP Instance Name | {{< placeholder "GCP_INSTANCE_NAME" >}} | `source-database` |
| Destination IP Address | {{< placeholder "DEST_IP" >}} | `172.232.188.122` |
| Source IP Address | {{< placeholder "SOURCE_HOST" >}} | `35.227.90.130` |
| Source Port | {{< placeholder "SOURCE_PORT" >}} | `5432` |
| Source Username | {{< placeholder "SOURCE_USER" >}} | `postgres` |
| Source Database | {{< placeholder "SOURCE_DB" >}} | `postgres` |
| Source Password | {{< placeholder "SOURCE_PASSWORD" >}} | `thisismysourcepassword` |
| Replication Username | {{< placeholder "REPL_USER" >}} | `linode_replicator` |
| Replication Password | {{< placeholder "REPL_PASSWORD" >}} | `thisismyreplicatorpassword` |
| Publication Name | {{< placeholder "PUBLICATION_NAME" >}} | `my_publication` |

Replace these placeholders with your own connection details when running commands in your environment.

Additionally, the examples used in this guide assume the source database contains three tables (`customers`, `products`, and `orders`) that you want to replicate to a Linode Managed Database.

## Configure Database Flags

Logical replication requires enabling specific PostgreSQL flags on your Cloud SQL for PostgreSQL instance. These flags can be configured using either the Google Cloud Console or the `gcloud` CLI.

{{< tabs >}}
{{< tab "Google Cloud Console" >}}
1.  In the Google Cloud Console, navigate to **SQL** and select your PostgreSQL instance:

    ![Google Cloud SQL instance overview in console.](cloud-sql-console-instance-overview.png)

1.  On the instance page, click **Edit**.

1.  Locate the **Flags and parameters** section, then click **Add a database flag**.

1.  Add the following flags:

    -   `cloudsql.logical_decoding`: `On` (sets `wal_level` to `logical`)
    -   `max_replication_slots`: `10` or higher
    -   `max_wal_senders`: Greater than or equal to `max_replication_slots`, depending on expected replication concurrency

    ![Database flags configuration screen in Cloud SQL console.](cloud-sql-database-flags-configuration.png)

1.  Click **Save** at the bottom of the page.

1.  When prompted, click **Save and restart** to restart and apply the changes:

    ![Restart Cloud SQL instance after setting flags.](cloud-sql-restart-instance-apply-flags.png)

{{< /tab >}}
{{< tab "gcloud CLI" >}}
Run the following `gcloud` command to set Cloud SQL instance database flags from the CLI. Replace {{< placeholder "GCP_INSTANCE_NAME" >}} with your Cloud SQL instance name (e.g., `source-database`)

```command
gcloud sql instances patch {{< placeholder "GCP_INSTANCE_NAME" >}} \
  --database-flags=cloudsql.logical_decoding=on,max_replication_slots=10,max_wal_senders=10
```

```output
The following message will be used for the patch API method.

{
  "name": "source-database",
  "settings": {
    "databaseFlags": [
      {"name": "cloudsql.logical_decoding", "value": "off"},
      {"name": "max_replication_slots", "value": "10"},
      {"name": "max_wal_senders", "value": "10"}
    ]
  }
}

WARNING: This patch modifies database flag values, which may require your
instance to be restarted. Check the list of supported flags -
https://cloud.google.com/sql/docs/postgres/flags - to see if your
instance will be restarted when this patch is submitted.

Do you want to continue (Y/n)?
```

Confirm the request to restart the instance.
{{< /tab >}}
{{< /tabs >}}

## Configure Network Access

Ensure that your Cloud SQL instance allows network access from the Linode Managed Database.

{{< tabs >}}
{{< tab "Google Cloud Console" >}}
1.  In the Google Cloud Console, open your Cloud SQL instance.

1.  Navigate to the **Connections** page, then select the **Networking** tab.

1.  Ensure that the **Public IP** option is checked:

    ![Networking tab showing Public IP enabled in Cloud SQL instance.](cloud-sql-networking-public-ip.png)

1.  In the list of Authorized networks, add the CIDR range of your Linode Managed Database:

    ![Authorized networks list with Linode IP added.](cloud-sql-authorized-networks-add-rule.png)

1.  Click **Save** at the bottom of the page.
{{< /tab >}}
{{< tab "gcloud CLI" >}}
You can also configure authorized networks using the `gcloud` CLI. However, you can only specify a CIDR range (as a comma-separated list) and cannot assign a name for each network.

Add a firewall rule allowing access from your Linode Managed Database. Replace {{< placeholder "DEST_IP" >}} with the IP address from [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) (e.g., `172.232.188.122`):

```command
gcloud sql instances patch {{< placeholder "GCP_INSTANCE_NAME" >}} \
  --authorized-networks="{{< placeholder "DEST_IP" >}}/32"
```

{{< note type="warning" title="Warning: Existing Authorized Networks Are Replaced" >}}
The `--authorized-networks` flag *replaces* any existing authorized networks on the instance. If other networks are already configured, you must include them in the comma-separated list, for example:

```command
gcloud sql instances patch {{< placeholder "GCP_INSTANCE_NAME" >}} \
  --authorized-networks="172.232.188.122/32,172.232.189.35/32"
```
{{< /note >}}
{{< /tab >}}
{{< /tabs >}}

With network access configured, your Linode Managed Database can reach the Cloud SQL instance during the subscription creation step in [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/).

## Create a Replication User

While logical replication can technically be performed using the primary database user, it's best practice to create a dedicated replication user. This user should have the `REPLICATION` privilege and `SELECT` access only to the tables being published.

Follow the steps below to create this dedicated user on your Cloud SQL instance.

1.  Connect to your source PostgreSQL instance using the `psql` client. Replace {{< placeholder "SOURCE_HOST" >}} (e.g., `35.227.90.130`), {{< placeholder "SOURCE_PORT" >}} (e.g., `5432`), {{< placeholder "SOURCE_USER" >}} (e.g., `postgres`), and {{< placeholder "SOURCE_DB" >}} (e.g., `postgres`) with your own values. You can find the connection details under **Connections > Summary** in the Cloud SQL console.


    ```command
    psql \
      -h {{< placeholder "SOURCE_HOST" >}} \
      -p {{< placeholder "SOURCE_PORT" >}} \
      -U {{< placeholder "SOURCE_USER" >}} \
      -d {{< placeholder "SOURCE_DB" >}} \
      "sslmode=require"
    ```

    When prompted, enter your {{< placeholder "SOURCE_PASSWORD" >}} (e.g., `thisismysourcepassword`).

1.  Run the following commands from the source `psql` prompt. Replace {{< placeholder "REPL_USER" >}} (e.g., `linode_replicator`) and {{< placeholder "REPL_PASSWORD" >}} (e.g., `thisismyreplicatorpassword`) with your own values. For simplicity, this example assumes a public schema and three sample tables (customers, products, and orders). Replace the table names with your actual schema as needed.

    ```command {title="Source psql Prompt"}
    CREATE ROLE {{< placeholder "REPL_USER" >}}
           WITH REPLICATION
           LOGIN PASSWORD '{{< placeholder "REPL_PASSWORD" >}}';
    GRANT SELECT ON customers, products, orders TO {{< placeholder "REPL_USER" >}};
    ```

    ```output
    CREATE ROLE
    GRANT
    ```

    {{< note type="secondary" title="Alternative: Grant on All Tables" isCollapsible=yes >}}
    You can also grant privileges on *all* tables with the following command:

    ```command {title="Source psql Prompt"}
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO {{< placeholder "REPL_USER" >}};
    ```

    ```output
    GRANT
    ```
    {{< /note >}}

The newly created user is referenced by the Linode Managed Database when creating the subscription in [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/).

## Create a Publication

A publication defines which tables and changes (e.g., `INSERT`, `UPDATE`, and `DELETE`) should be streamed to the subscriber. At least one publication is required for logical replication, and the subscriber must have matching tables with compatible schemas for replication to succeed.

1.  While still connected to your source database via the `psql` client, use the following command to create a publication. Replace {{< placeholder "PUBLICATION_NAME" >}} (e.g., `my_publication`) and the specific tables you want to replicate (e.g., `customers`, `products`, and `orders`):

    ```command {title="Source psql Prompt"}
    CREATE PUBLICATION {{< placeholder "PUBLICATION_NAME" >}} FOR TABLE customers, products, orders;
    ```

    ```output
    CREATE PUBLICATION
    ```

    {{< note type="secondary" title="Alternative: Publish All Tables" isCollapsible=yes >}}
    You can also create a publication for *all* tables in the database:

    ```command {title="Source psql Prompt"}
    CREATE PUBLICATION {{< placeholder "PUBLICATION_NAME" >}} FOR ALL TABLES;
    ```
    {{< /note >}}

1.  Run the following command to view all existing publications:

    ```command {title="Source psql Prompt"}
    SELECT * FROM pg_publication_tables;
    ```

    ```output
    -[ RECORD 1 ]-----------------------------------------------
    pubname    | my_publication
    schemaname | public
    tablename  | customers
    attnames   | {id,name,email,created_at}
    rowfilter  |
    -[ RECORD 2 ]-----------------------------------------------
    pubname    | my_publication
    schemaname | public
    tablename  | products
    attnames   | {id,name,price,in_stock}
    rowfilter  |
    -[ RECORD 3 ]-----------------------------------------------
    pubname    | my_publication
    schemaname | public
    tablename  | orders
    attnames   | {id,customer_id,product_id,quantity,order_date}
    rowfilter  |
    ```

Your Google Cloud source database is now ready for logical replication. Return to [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) to configure the Linode Managed Database and create the subscription.
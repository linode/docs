---
slug: preparing-your-azure-postgresql-database-for-logical-replication-to-linode-managed-database
title: "Preparing Your Azure PostgreSQL Database for Logical Replication to Linode Managed Database"
description: "Prepare your Azure Database for PostgreSQL for logical replication to a Linode Managed Database. Configure server parameters, network access, and a replication user."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2026-02-18
keywords: ['azure postgresql logical replication','linode managed database','flexible server','pg_publication','azure replication setup']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Logical replication and logical decoding in Azure Database for PostgreSQL](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-logical)'
- '[Server parameters in Azure Database for PostgreSQL](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-server-parameters)'
- '[Azure CLI Documentation for `az postgres`](https://learn.microsoft.com/en-us/cli/azure/postgres?view=azure-cli-latest)'
---

[Logical replication](https://www.postgresql.org/docs/current/logical-replication.html) continuously synchronizes database tables, allowing you to prepare the destination database in advance. This approach minimizes downtime when you switch application traffic and retire the source database.

This guide explains how to prepare an Azure Database for PostgreSQL for logical replication to a [Linode Managed Database](https://www.linode.com/products/databases/). Follow this guide before returning to the [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) guide to [create the subscription](https://www.postgresql.org/docs/current/sql-createsubscription.html) on Akamai Cloud.

Follow the steps in this guide to:

-   Configure your Azure Database instance to support logical replication.
-   Ensure secure network access from Linode.
-   Create a dedicated replication user.
-   Set up a publication for the tables you wish to replicate.

After completing these steps, return to [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) to configure the subscriber and finalize the setup.

## Before You Begin

1.  Follow the [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) guide up to the **Prepare the Source Database for Logical Replication** section to obtain the public IP address or CIDR range of your Linode Managed Database.

1.  Ensure your Azure account has permissions to modify PostgreSQL server parameters, networking settings, and firewall rules.

1.  Install and authenticate the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) on your local machine:

    ```command
    az login
    az account set --subscription {{< placeholder "YOUR_AZURE_SUBSCRIPTION_ID" >}}
    ```

{{< note title="Requirement: Flexible Server" >}}
Ensure you have an *Azure Database for PostgreSQL – Flexible Server* instance. Logical replication requires Flexible Server, as Single Server was retired in March 2025.
{{< /note >}}

### Placeholders and Examples

The following placeholders and example values are used in commands throughout this guide:

| Parameter | Placeholder | Example Value |
|------------|--------------|----------------|
| Azure Server Name | {{< placeholder "AZURE_SERVER_NAME" >}} | `source-database` |
| Azure Resource Group | {{< placeholder "AZURE_RESOURCE_GROUP" >}} | `pg-repl-rg` |
| Destination IP Address | {{< placeholder "DEST_IP" >}} | `172.232.188.122` |
| Source Hostname | {{< placeholder "SOURCE_HOST" >}} | `source-database.postgres.database.azure.com` |
| Source Port | {{< placeholder "SOURCE_PORT" >}} | `5432` |
| Source Username | {{< placeholder "SOURCE_USER" >}} | `azureadmin` |
| Source Database | {{< placeholder "SOURCE_DB" >}} | `postgres` |
| Source Password | {{< placeholder "SOURCE_PASSWORD" >}} | `thisismysourcepassword` |
| Replication Username | {{< placeholder "REPL_USER" >}} | `linode_replicator` |
| Replication Password | {{< placeholder "REPL_PASSWORD" >}} | `thisismyreplicatorpassword` |
| Publication Name | {{< placeholder "PUBLICATION_NAME" >}} | `my_publication` |

Replace these placeholders with your own connection details when running commands in your environment.

Additionally, the examples used in this guide assume the source database contains three tables (`customers`, `products`, and `orders`) that you want to replicate to a Linode Managed Database.

## Configure Server Parameters

To support logical replication, you’ll need to adjust a few parameters on your Azure Database for PostgreSQL instance.

{{< tabs >}}
{{< tab "Azure Portal" >}}
1.  In the Azure Portal, locate your database resource, then navigate to **Settings > Server parameters**:

    ![Azure Database for PostgreSQL Flexible Server - Navigation menu with Server parameters selected.](azure-flexible-server-navigation-server-parameters.png)

1.  In the list of server parameters, use the search filter to find the values for `wal_level`, `max_replication_slots`, and `max_wal_senders`:

    ![Azure portal Server parameters page showing the wal_level parameter set to REPLICA by default.](azure-flexible-server-parameter-wal-level-default.png)

    In order for logical replication to succeed, these values should be as follows:

    -   `max_replication_slots`: Greater than or equal to 1
    -   `max_wal_senders`: Greater than or equal to `max_replication_slots`, depending on expected replication concurrency
    -   `wal_level`: `LOGICAL`

    If these values are already set correctly, skip the remainder of this section and continue with Configure Network Access. Otherwise, you need to modify the parameter group using the instructions below.

1.  Adjust the values as needed, then click **Save**:

    ![Azure portal Server parameters page showing wal_level set to LOGICAL, max_wal_senders and max_replication_slots set to 5, with the Save button highlighted.](azure-flexible-server-parameters-save-logical-replication.png)

1.  When Azure notifies you that you need to restart the server for changes to take effect, click **Save and Restart**.

{{< /tab >}}
{{< tab "Azure CLI" >}}
1.  Run the following `az` CLI command to list the relevant server parameters for the instance. Replace {{< placeholder "AZURE_SERVER_NAME" >}} with your Azure PostgreSQL server name (e.g., `source-database`) and {{< placeholder "AZURE_RESOURCE_GROUP" >}} with your resource group (e.g., `pg-repl-rg`):

    ```command
    az postgres flexible-server parameter list \
      --server-name {{< placeholder "AZURE_SERVER_NAME" >}} \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}} \
      --output json \
      --query "[?name=='wal_level' || name=='max_replication_slots' || name=='max_wal_senders'].{name:name, description:description, dataType:dataType, value:value}"
    ```

    ```output
    [
      {
        "dataType": "Integer",
        "description": "Specifies the maximum number of replication slots that the server can support.",
        "name": "max_replication_slots",
        "value": "10"
      },
      {
        "dataType": "Integer",
        "description": "Sets the maximum number of simultaneously running WAL sender processes.",
        "name": "max_wal_senders",
        "value": "10"
      },
      {
        "dataType": "Enumeration",
        "description": "It determines how much information is written to the WAL.",
        "name": "wal_level",
        "value": "REPLICA"
      }
    ]
    ```

    In order for logical replication to succeed, these values should be as follows:

    -   `max_replication_slots`: Greater than or equal to 1
    -   `max_wal_senders`: Greater than or equal to `max_replication_slots`, depending on expected replication concurrency
    -   `wal_level`: `LOGICAL`

    If these values are already set correctly, skip the remainder of this section and continue with Configure Network Access. Otherwise, you need to modify the parameter group using the instructions below.

    To adjust the values with the Azure CLI, you need to run the `parameter set` command for each parameter.

1.  Use the following command to adjust the value of `max_replication_slots` to `10`:

    ```command
    az postgres flexible-server parameter set \
      --server-name {{< placeholder "AZURE_SERVER_NAME" >}} \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}} \
      --name max_replication_slots \
      --value 10
    ```

1.  Use the following command to adjust the value of `max_wal_senders` to `10`:

    ```command
    az postgres flexible-server parameter set \
      --server-name {{< placeholder "AZURE_SERVER_NAME" >}} \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}} \
      --name max_wal_senders \
      --value 10
    ```

1.  Use the following command to adjust the value of `wal_level` to `logical`:

    ```command {title="Modify server parameters to support logical replication"}
    az postgres flexible-server parameter set \
      --server-name {{< placeholder "AZURE_SERVER_NAME" >}} \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}} \
      --name wal_level \
      --value logical
    ```

1.  After modifying these parameters, restart the database instance:

    ```command
    az postgres flexible-server restart \
      --name {{< placeholder "AZURE_SERVER_NAME" >}} \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}}
    ```
{{< /tab >}}
{{< /tabs >}}

## Configure Network Access

Before the Linode Managed Database can connect to your Azure Database instance, ensure that the instance allows network access from the Linode Managed Database.

{{< tabs >}}
{{< tab "Azure Portal" >}}
1.  Navigate to the **Settings > Networking** page for the instance. Make sure that the **Public access** option is checked.

    ![Azure Database for PostgreSQL Networking page showing the Public access option enabled.](azure-flexible-server-networking-public-access.png)

1.  In the list of firewall rules, add a rule to allow access to your Linode Managed Database. Specify a name for the firewall rule. Enter the IP address of your Linode Managed Database as both the **Start IP address** and the **End IP address**:

    ![Azure PostgreSQL Networking page showing a firewall rule named allow-linode-managed-database with the Linode host IP entered for Start and End addresses.](azure-flexible-server-firewall-rule-linode-managed-database.png)

1.  Click **Save** at the top of the page.
{{< /tab >}}
{{< tab "Azure CLI" >}}
1.  Determine if public network access is enabled:

    ```command
    az postgres flexible-server show \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}} \
      --name {{< placeholder "AZURE_SERVER_NAME" >}} \
      --query "network.publicNetworkAccess"
    ```

    If the output is `"Enabled"`, skip the following command:

    ```output
    "Enabled"
    ```

1.  If the output is `"Disabled"`, use the following command to enable public network access:

    ```command
    az postgres flexible-server update \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}} \
      --name {{< placeholder "AZURE_SERVER_NAME" >}} \
      --public-network-access Enabled
    ```

1.  Add a firewall rule allowing access from your Linode Managed Database. Replace {{< placeholder "DEST_IP" >}} with the IP address from [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) (e.g., `172.232.188.122`):

    ```command
    az postgres flexible-server firewall-rule create \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}} \
      --name {{< placeholder "AZURE_SERVER_NAME" >}} \
      --rule-name allow-linode-managed-database \
      --start-ip-address {{< placeholder "DEST_IP" >}} \
      --end-ip-address {{< placeholder "DEST_IP" >}}
    ```

1.  Verify the firewall rules:

    ```command
    az postgres flexible-server firewall-rule list \
      --resource-group {{< placeholder "AZURE_RESOURCE_GROUP" >}} \
      --name {{< placeholder "AZURE_SERVER_NAME" >}} \
      -o table
    ```

    ```output
    EndIpAddress     Name                           ResourceGroup    StartIpAddress
    ---------------  -----------------------------  ---------------  ----------------
    172.235.145.182  allow-linode-managed-database  pg-repl-rg       172.235.145.182
    ```
{{< /tab >}}
{{< /tabs >}}

With network access configured, your Linode Managed Database can reach the Azure Database instance during the subscription creation step in [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/).

## Create a Replication User

While logical replication can technically be performed using the primary database user, it's best practice to create a dedicated replication user. This user should have the `REPLICATION` privilege and `SELECT` access only to the tables being published.

Follow the steps below to create this dedicated user on your Azure Database instance.

1.  Connect to your source PostgreSQL instance using the `psql` client. Replace {{< placeholder "SOURCE_HOST" >}} (e.g., `source-database.postgres.database.azure.com`), {{< placeholder "SOURCE_PORT" >}} (e.g., `5432`), {{< placeholder "SOURCE_USER" >}} (e.g., `azureadmin`), and {{< placeholder "SOURCE_DB" >}} (e.g., `postgres`) with your own values. You can find the connection details on the **Settings > Connect** page of your Azure Database instance.

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
        pubname     | schemaname | tablename |                       attnames                        | rowfilter
    ----------------+------------+-----------+-------------------------------------------------------+-----------
     my_publication | public     | customers | {customer_id,name,email,created_at}                   |
     my_publication | public     | products  | {product_id,name,price,created_at}                    |
     my_publication | public     | orders    | {order_id,customer_id,product_id,quantity,created_at} |
    (3 rows)
    ```

1.  Type `\q` and press <kbd>Enter</kbd> to exit the source `psql` shell.

Your Azure source database is now ready for logical replication. Return to [Logical Replication to a Linode Managed PostgreSQL Database](/docs/guides/logical-replication-to-a-linode-managed-postgresql-database/) to configure the Linode Managed Database and create the subscription.
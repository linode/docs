---
slug: migrating-from-self-hosted-db-to-managed-db
title: "Migrating From Self-Hosted to Managed Databases"
description: "Two to three sentences describing your guide."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-05-12
keywords: ['managed database','db','self hosted database','database admin','migration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Managed Databases Product Documentation](https://techdocs.akamai.com/cloud-computing/docs/aiven-database-clusters)'
---

## Introduction

Managed databases can offload many day-to-day responsibilities that database administrators (DBAs) traditionally hold when managing self-hosted databases, such as software patching and backup scheduling. By handling these tasks, managed services -- like [Managed Database Clusters](https://techdocs.akamai.com/cloud-computing/docs/aiven-database-clusters) on Akamai Cloud -- allow teams to direct more attention to database performance tuning, data architecture, and operational alignment.

Adopting a managed database also involves giving up certain capabilities typically associated with self-hosted environments. DBAs who are accustomed to full system control may encounter restrictions, particularly in multi-tenant environments where superuser privileges and host-level access are not available. These trade-offs do not eliminate the role of the DBA, rather, they shift the focus toward higher-level responsibilities.

This guide outlines key differences between self-hosted and managed databases. It compares the upsides of both solutions, as well as what techniques can be used to help maintain control and performance within a managed environment.

## Superuser and OS-Level Access

Self-hosted database environments inherently provide a higher level of administrative control than managed databases. This includes access to operating systems and superuser roles, which can affect how certain tasks are performed.

### Benefits of Self-Hosting

Self-hosted environments give DBAs unrestricted access to the operating system (OS) and superuser roles such as `root`, `postgres`, or `mysql`. This level of access enables direct control over user privileges, background processes, file system operations, and system configurations.

In managed environments, users typically interact with the database through a restricted administrative account that doesn't include full superuser privileges. Operating system access is generally not available, and many system-level commands or settings are locked down by the provider.

### Benefits of Managed

Managed database models can reduce the risk of misconfiguration, as well as limit the impact of potential security issues. Tasks like patching, system upgrades, and critical maintenance are handled automatically by the provider.

### How to Adapt

When working with a managed database, begin by **determining what permissions are granted** by the provider to you as the database owner.

For example, in PostgreSQL, run the following command:

```command
psql=> \du+

                           List of roles
     Role name      |                         Attributes
--------------------+------------------------------------------------------
 youruser           | Create role, Create DB, Replication, Bypass RLS
```

In MySQL, the equivalent command would be:

```command
mysql> show grants\G;

*************************** 1. row ***************************
Grants for youruser@%: GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER ON *.* TO "youruser"@"%" WITH GRANT OPTION
*************************** 2. row ***************************
Grants for youruser@%: GRANT REPLICATION_APPLIER,ROLE_ADMIN ON *.* TO "youruser"@"%" WITH GRANT OPTION
*************************** 3. row ***************************
Grants for youruser@%: REVOKE INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EVENT, TRIGGER ON "metrics_user_telegraf".* FROM "youruser"@"%"
*************************** 4. row ***************************
Grants for youruser@%: REVOKE INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EVENT, TRIGGER ON "mysql".* FROM "youruser"@"%"
*************************** 5. row ***************************
Grants for youruser@%: REVOKE INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EVENT, TRIGGER ON "sys".* FROM "youruser"@"%"

5 rows in set (0.06 sec)
```

The resulting list shows you what access and permission limitations the managed database service has in place. From there, you can use the highest-level administrative role available to manage users, roles, and other permissions.

For tasks that normally require OS-level access -- such as inspecting logs or modifying system services -- look for equivalent features exposed via the provider UI or API.

## Configuration Flexibility

Managed databases expose a curated set of configuration parameters. This limits the degree to which environments can be fine-tuned but can simplify administration while reducing the potential for misconfiguration.

### Benefits of Self-Hosting

Self-hosted databases allow full access to configuration files and system parameters, providing DBAs with the ability to fine-tune behavior at every level, from memory usage and query planning to connection handling and timeout values.

In managed environments, access to these settings is typically restricted to a predefined list of modifiable parameters. Some tuning options may be unavailable or applied globally across multiple tenants.

### Benefits of Managed

Managed providers supply sensible defaults optimized for general performance and stability. These defaults are often sufficient for a wide range of workloads and reduce the risk of degraded performance due to manual misconfiguration. Centralized control can also simplify scaling and software upgrades.

### How to Adapt

Use the managed provider's control panel, CLI, or API to configure available settings. Managed environments expose a limited set of PostgreSQL or MySQL parameters that can be changed without superuser access.

For example, some PostgreSQL parameters can be configured dynamically. Examples include:

-   `SET statement_timeout = '7s';` limits query execution time.

-   `SET work_mem = '16MB';` controls memory usage for sort and hash operations.

-   `SET search_path = myschema, public;` defines schema lookup order.

-   `SET client_encoding = 'UTF8';` sets character encoding for the session.

-   `SET TIME ZONE 'America/Los_Angeles';` ensures consistent timestamp behavior.

Retry logic, connection timeouts, and pooling behavior can often be managed through your application's database driver or ORM. This allows greater control over performance characteristics even when backend configuration options are limited.

Below is a basic Node.js example using the `pg` client with a connection pool and retry logic:

```
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000, // 5s to establish a connection
  idleTimeoutMillis: 10000,      // 10s before releasing idle clients
  max: 10                        // max number of clients in the pool
});

async function queryWithRetry(sql, params, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query(sql, params);
        return res;
      } finally {
        client.release();
      }
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`Attempt ${attempt} failed. Retrying...`);
    }
  }
}
```

## Extension and Plugin Support

Managed databases offer specific extensions and plugins, usually curated and tested by the provider to ensure compatibility and stability.

### Benefits of Self-Hosting

In self-hosted environments, DBAs can install any PostgreSQL extension or MySQL plugin supported by the underlying system. This allows teams to extend functionality with third-party or custom-built extensions.

Managed environments do not have the same level of flexibility. There is a predefined list of supported extensions, and installing custom or community plugins may not be permitted.

### Benefits of Managed

The curated extension list provided by managed database services includes commonly used and well-supported options. These are tested for compatibility and maintained across upgrades, reducing the operational risk associated with extension conflicts or outdated binaries.

### How to Adapt

Before migrating from self-hosted to managed, compare the list of extensions required by your applications against what the provider supports. Most providers publish an [extension compatibility matrix](https://aiven.io/docs/products/postgresql/reference/list-of-extensions).

In PostgreSQL, you can view the extensions available in your current environment by running the following query:

```
psql=> SELECT * FROM pg_available_extensions;

             name             | default_version
------------------------------+-----------------
 address_standardizer         | 3.5.0
 address_standardizer_data_us | 3.5.0
 aiven_extras                 | 1.1.16
 amcheck                      | 1.3
 autoinc                      | 1.0
 bloom                        | 1.0
 bool_plperl                  | 1.0
 btree_gin                    | 1.3
 btree_gist                   | 1.7
…
 timescaledb                  | 2.19.2
 tsm_system_rows              | 1.0
 tsm_system_time              | 1.0
 unaccent                     | 1.1
 unit                         | 7
 uuid-ossp                    | 1.1
 vector                       | 0.7.4
 vectorscale                  | 0.6.0
 xml2                         | 1.1
(73 rows)
```

This returns a list of all extensions that can be installed within the current environment, which can be useful for validating compatibility during the planning phase of a migration.

In MySQL, you can query for available plugins and components in your current environment with the below command:

```
mysql> show plugins;
+-----------------------+--------+----------------+--------------------+
| Name                  | Status | Type           | Library            |
+-----------------------+--------+----------------+--------------------+
| binlog                | ACTIVE | STORAGE ENGINE | NULL               |
| mysql_native_password | ACTIVE | AUTHENTICATION | NULL               |
| sha256_password       | ACTIVE | AUTHENTICATION | NULL               |
| caching_sha2_password | ACTIVE | AUTHENTICATION | NULL               |
| sha2_cache_cleaner    | ACTIVE | AUDIT          | NULL               |
...
| ngram                 | ACTIVE | FTPARSER       | NULL               |
| mysqlx_cache_cleaner  | ACTIVE | AUDIT          | NULL               |
| mysqlx                | ACTIVE | DAEMON         | NULL               |
| rpl_semi_sync_master  | ACTIVE | REPLICATION    | semisync_master.so |
| rpl_semi_sync_slave   | ACTIVE | REPLICATION    | semisync_slave.so  |
+-----------------------+--------+----------------+--------------------+
47 rows in set (0.08 sec)
```

{{< note title="MySQL Components" >}}
The query `select * from mysql.component` shows components registered with the MySQL server which extend server functionality differently from traditional plugins.
{{< /note >}}

If a needed extension or plugin is unavailable, consider replicating its functionality in application logic, using companion services, or integrating with external platforms. When direct equivalents exist, evaluate supported alternatives that achieve similar outcomes without requiring unsupported plugins.

## Backups

Managed databases [automate the backup process](https://techdocs.akamai.com/cloud-computing/docs/aiven-manage-database#manage-backups), often providing regular snapshots and recovery options with minimal configuration. However, these backup systems may not offer the same level of customization or retention control as a self-hosted solution.

### Benefits of Self-Hosting

In self-hosted environments, DBAs can schedule backups at highly specific times, select backup formats and destinations, and define retention policies tailored to compliance or business continuity needs. Managed services can abstract some of these options, applying provider-defined scheduling windows and storage durations.

### Benefits of Managed

Automated backups can significantly reduce operational overhead, with free backups included with Akamai's Managed Database Clusters. Backups are handled on a daily basis, are retained for 14 days, and include point-in-time [recovery](https://techdocs.akamai.com/cloud-computing/docs/aiven-database-clusters#disaster-recovery). This helps ensure data safety without requiring manual oversight.

### How to Adapt

To help maintain flexibility, you can use command line tools like [`pg_dump`](https://www.postgresql.org/docs/current/app-pgdump.html) or [`mysqldump`](https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html) to create additional manual backups on your own schedule. Backups can be customized by database, schema, or format.

For example, using `pg_dump`:

```
~/$ pg_dump -\
  --host a123456-prod-default.g2a.akamaidb.net \
  --port 10033 \
  --username akmadmin
  defaultdb > outfile_psql.sql
```

{{< note title="Tip: pg_dumpall" >}}
If permissions allow, you can use [`pg_dumpall`](https://www.postgresql.org/docs/current/app-pg-dumpall.html) to dump all the databases from a single cluster.
{{< /note >}}

And using `mysqldump`:

```
~/$ mysqldump -\
  --host a987654-prod-default.g2a.akamaidb.net \
  --port 10033 \
  --user akmadmin \
  --password \
  defaultdb > outfile_mysql.sql
```

Exported backups can also be stored in Object Storage using tools like [`rclone`](/docs/guides/rclone-object-storage-file-sync/) or [`s3cmd`](https://techdocs.akamai.com/cloud-computing/docs/using-s3cmd-with-object-storage). This approach allows you to enforce your own retention and [access control policies](https://techdocs.akamai.com/cloud-computing/docs/define-access-and-permissions-using-bucket-policies).

You can also test backups by restoring them to a temporary environment to ensure data integrity. This also provides a way to benchmark recovery times and identify potential gaps in coverage.

## Maintenance Scheduling and Version Control

Managed services regularly apply patches and upgrades to ensure security and reliability. This helps remove the burden of manual maintenance, but it can also limit control over when updates occur and how they are tested.

### Benefits of Self-Hosting

In a self-hosted environment, DBA can choose when to apply patches, test updates in staging environments, and defer changes that might disrupt production workloads. This level of control is often not available in managed environments, where providers control the patch cycle.

### Benefits of Managed

Managed providers apply critical updates automatically, reducing exposure to known vulnerabilities and ensuring software remains up-to-date. Some platforms like Akamai Cloud allow users to [define preferred maintenance windows](https://techdocs.akamai.com/cloud-computing/docs/aiven-manage-database#automatic-updates-and-maintenance-window) to avoid peak traffic periods.

### How to Adapt

Although you may be unable to configure database maintenance schedules down to the minute, managed databases let you set a preferred maintenance window (i.e. day of the week, hour of the day) to help reduce impact on production workloads. High-availability clusters also enable automatic failover between nodes to reduce the possibility of downtime.

Consider spinning up additional database instances for development and staging. This way, you can roll out and test proposed database changes before promoting them to production. When rolling out significant changes, use [blue-green deployments](https://en.wikipedia.org/wiki/Blue%E2%80%93green_deployment) to reduce downtime and verify stability before directing traffic to the updated environment.

You can also use schema versioning tools -- such as [Liquibase Open Source](https://www.liquibase.com/open-source) -- to help manage migrations and provide a structured rollback path if issues arise. For example, you can define a `liquibase.properties` file with credentials to access your managed database. Then, define migrations with XML in individual files. See the below example file that creates a `products` table for an ecommerce site database:

```
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                      http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.20.xsd">

    <changeSet id="1" author="alvin">
        <createTable tableName="products">
            <column name="id" type="bigint" autoIncrement="true">
                <constraints primaryKey="true" nullable="false"/>
            </column>
            <column name="name" type="varchar(255)">
                <constraints nullable="false"/>
            </column>
            <column name="description" type="text"/>
            <column name="price" type="decimal(11,2)">
                <constraints nullable="false"/>
            </column>
            <column name="created_at" type="timestamp" defaultValueComputed="CURRENT_TIMESTAMP">
                <constraints nullable="false"/>
            </column>
            <column name="updated_at" type="timestamp" defaultValueComputed="CURRENT_TIMESTAMP">
                <constraints nullable="false"/>
            </column>
        </createTable>
    </changeSet>

</databaseChangeLog>
```

Then, update your database schema by applying your migrations:

```
$ liquibase update

…
Starting Liquibase at 13:53:48 using Java 21.0.6 (version 4.31.1 #6739 built at 2025-02-13 13:46+0000)
Liquibase Version: 4.31.1
Liquibase Open Source 4.31.1 by Liquibase
Running Changeset: db/changelog/changes/01-create-products-table.xml::1::user
Running Changeset: db/changelog/changes/02-add-stock-column.xml::2::user
Running Changeset: db/changelog/changes/03-remove-stock-column.xml::3::user
Running Changeset: db/changelog/changes/04-create-orders-table.xml::4::user

UPDATE SUMMARY
Run:                          4
Previously run:               0
Filtered out:                 0
-------------------------------
Total change sets:            4

Liquibase: Update has been successful. Rows affected: 4
Liquibase command 'update' was executed successfully.
```

You can also roll back migrations incrementally. For example:

```
$ liquibase rollbackCount 2


…
Starting Liquibase at 13:54:12 using Java 21.0.6 (version 4.31.1 #6739 built at 2025-02-13 13:46+0000)
Liquibase Version: 4.31.1
Liquibase Open Source 4.31.1 by Liquibase
Rolling Back Changeset: db/changelog/changes/04-create-orders-table.xml::4::user
Rolling Back Changeset: db/changelog/changes/03-remove-stock-column.xml::3::user
Liquibase command 'rollbackCount' was executed successfully.
```

## Monitoring and Logging

### Benefits of Self-Hosting

### Benefits of Managed

### How to Adapt

## Hardware Tuning and Infrastructure Control

### Benefits of Self-Hosting

### Benefits of Managed

### How to Adapt

## Custom Audit Workflows

### Benefits of Self-Hosting

### Benefits of Managed

### How to Adapt

## Security and Access Control

### Benefits of Self-Hosting

### Benefits of Managed

### How to Adapt

## Conclusion
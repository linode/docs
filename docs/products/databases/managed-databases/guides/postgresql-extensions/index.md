---
author:
  name: Linode
  email: docs@linode.com
title: "PostgreSQL Extensions"
description: "Learn which PostgreSQL extensions are supported by Linode's Managed Database service and how to install them."
published: 2022-06-06
modified: 2022-08-23
---

The functionality of PostgreSQL can be enhanced through the use of [extensions](https://wiki.postgresql.org/wiki/Extensions). Linode's PostgreSQL Managed Database service supports many of these extensions.

## Manage Extensions

Many extensions can be viewed, installed, and removed directly from the PostgreSQL command-line prompt. To access this prompt, connect to your database using the psql tool. See [Connect to a PostgreSQL Database > psql](/docs/products/databases/managed-databases/guides/postgresql-connect/#connect-using-psql-cli).

### View Installed Extensions

To view the extensions that are currently installed on your PostgreSQL Managed Database, run the `\dx` command at the prompt. The output should be similar to the following, displaying each extension along with its version number, schema, and a short description.

{{< output >}}
     Name      | Version |   Schema   |          Description
---------------+---------+------------+--------------------------------
 plpgsql       | 1.0     | pg_catalog | PL/pgSQL procedural language
{{</ output >}}

### View Available Extensions

To see a full list of all the extensions available for your version of PostgreSQL, run the following query. You can also review the [List of Available Extensions](#list-of-available-extensions) below.

    SELECT * FROM pg_available_extensions;

{{< caution >}}
Linode does not provide superuser access to PostgreSQL Managed Databases. As such, some extensions may not function properly or may otherwise encounter permissions issues.
{{</ caution >}}

### Install an Extension

To install one of the available extensions on your database, use the [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command, replacing *[extension_name]* with the name of the extension you wish to install.

    CREATE EXTENSION IF NOT EXISTS [extension_name];

If this command does not work, the extension may either not be compatible or it may need to be manually enabled on your Managed Database by our team. Review the [extensions list](#list-of-available-extensions) below.

### Remove an Extension

To remove an extension, use the [DROP EXTENSION](https://www.postgresql.org/docs/current/sql-dropextension.html) command, replacing *[extension_name]* with the name of the extension you wish to install.

    DROP EXTENSION [extension_name];

## List of Available Extensions

The table below lists all of the PostgreSQL extensions that may be supported by our Managed Database service, along with the compatible PostgreSQL versions.

{{< caution >}}
Linode does not provide superuser access to PostgreSQL Managed Databases. As such, some extensions may not function properly or may otherwise encounter permissions issues. Extensions that are known not to work, such as `adminpack`, have been marked as incompatible in the list below. If you encounter an extension that isn't working as expected due to permissions issues, our team can review the extension. Reach out to [Support](https://www.linode.com/support/) with the extension name, the name of the database for which you wish to use the extension, and your use case.
{{</ caution >}}

| Extension | Compatible PostgreSQL Version(s) | Description |
| -- | -- | -- |
| `address_standardizer` | 11, 12, 13 | Used to parse an address into constituent elements. Generally used to support geocoding address normalization step. |
| `address_standardizer_data_us` | 11, 12, 13 | Example dataset for `address_standardizer`. |
| `adminpack` (**incompatible**) | 10, 11, 12, 13 | Administrative functions for PostgreSQL |
| `amcheck` | 10, 11, 12, 13 | Functions for verifying relation integrity |
| `amcheck_next`| 10, 11 | Functions for verifying relation integrity |
| `autoinc` | 10, 11, 12, 13 | Functions for auto incrementing fields |
| `bloom` | 10, 11, 12, 13 | Bloom access method - signature file based index |
| `btree_gin` | 10, 11, 12, 13 | Support for indexing common data types in GIN |
| `btree_gist` | 10, 11, 12, 13 | Support for indexing common data types in GiST |
| `chkpass` | 10 | Data type for auto-encrypted passwords |
| `citext` | 10, 11, 12, 13 | Data type for case-insensitive character strings |
| `cube` | 10, 11, 12, 13 | Data type for multidimensional cubes |
| `dblink` | 10, 11, 12, 13 | Connect to other PostgreSQL databases from within a database |
| `dict_int` | 10, 11, 12, 13 | Text search dictionary template for integers |
| `dict_xsyn` | 10, 11, 12, 13 | Text search dictionary template for extended synonym processing |
| `earthdistance` | 10, 11, 12, 13 | Calculate great-circle distances on the surface of the Earth |
| `file_fdw` | 10, 11, 12, 13 | Foreign-data wrapper for flat file access |
| `fuzzystrmatch`\* | 10, 11, 12, 13 | Determine similarities and distance between strings |
| `hll` | 10, 11, 12, 13 | Type for storing HyperLogLog data |
| `hstore` | 10, 11, 12, 13 | Data type for storing sets of (key, value) pairs |
| `hstore_plperl` | 10, 11, 12, 13 | Transform between `hstore` and `plperl` |
| `hstore_plperlu` | 10, 11, 12, 13 | Transform between `hstore` and `plperlu` |
| `hypopg` | 11, 12, 13 | Hypothetical indexes for PostgreSQL |
| `insert_username` | 10, 11, 12, 13 | Functions for tracking who changed a table |
| `intagg` | 10, 11, 12, 13 | Integer aggregator and enumerator (obsolete) |
| `intarray` | 10, 11, 12, 13 | Functions, operators, and index support for 1-D arrays of integers |
| `ip4r` | 10, 11, 12, 13 |  |
| `isn` | 10, 11, 12, 13 | Data types for international product numbering standards |
| `jsonb_plperl` | 11, 12, 13 | Transform between `jsonb` and `plperl` |
| `jsonb_plperlu` | 11, 12, 13 | Transform between `jsonb` and `plperlu` |
| `lo` | 10, 11, 12, 13 | Large Object maintenance |
| `ltree` | 10, 11, 12, 13 | Data type for hierarchical tree-like structures |
| `moddatetime` | 10, 11, 12, 13 | Functions for tracking last modification time |
| `orafce` | 10, 11, 12, 13 | Functions and operators that emulate a subset of functions and packages from the Oracle RDBMS |
| `pageinspect` | 10, 11, 12, 13 | Inspect the contents of database pages at a low level |
| `pg_buffercache` | 10, 11, 12, 13 | Examine the shared buffer cache |
| `pg_cron` | 11, 12, 13 | Job scheduler for PostgreSQL |
| `pg_freespacemap` | 10, 11, 12, 13 | Examine the free space map (FSM) |
| `pg_prewarm` | 10, 11, 12, 13 | Prewarm relation data |
| `pg_repack` | 10, 11, 12, 13 | Reorganize tables in PostgreSQL databases with minimal locks |
| `pg_stat_statements` | 10, 11, 12, 13 | Track execution statistics of all SQL statements executed |
| `pg_trgm` | 10, 11, 12, 13 | Text similarity measurement and index searching based on trigrams |
| `pg_visibility` | 10, 11, 12, 13 | Examine the visibility map (VM) and page-level visibility info |
| `pgaudit` | 10, 11, 12, 13 | Provides auditing functionality |
| `pgcrypto` | 10, 11, 12, 13 | Cryptographic functions |
| `pglogical` | 10, 11, 12, 13 | PostgreSQL Logical Replication |
| `pglogical_origin` | 10, 11, 12, 13 | Dummy extension for compatibility when upgrading from Postgres 9.4 |
| `pgrowlocks` | 10, 11, 12, 13 | Show row-level locking information |
| `pgstattuple` | 10, 11, 12, 13 | Show tuple-level statistics |
| `plpgsql` | 10, 11, 12, 13 | PL/pgSQL procedural language |
| `postgis`\* | 10, 11, 12, 13 | PostGIS geometry and geography spatial types and functions |
| `postgis_sfcgal` | 10, 11, 12, 13 | PostGIS SFCGAL functions |
| `postgis_tiger_geocoder` | 10, 11, 12, 13 | PostGIS tiger geocoder and reverse geocoder |
| `postgis_topology` | 10, 11, 12, 13 | PostGIS topology spatial types and functions |
| `postgres_fdw` | 10, 11, 12, 13 | Foreign-data wrapper for remote PostgreSQL servers |
| `prefix` | 10, 11, 12, 13 | Prefix Range module for PostgreSQL |
| `refint` | 10, 11, 12, 13 | Functions for implementing referential integrity (obsolete) |
| `seg` | 10, 11, 12, 13 | Data type for representing line segments or floating-point intervals |
| `sslinfo` | 10, 11, 12, 13 | Information about SSL certificates |
| `tablefunc` | 10, 11, 12, 13 | Functions that manipulate whole tables, including crosstab |
| `tcn` | 10, 11, 12, 13 | Triggered change notifications |
| `timescaledb` | 11, 12, 13 | Enables scalable inserts and complex queries for time-series data |
| `timetravel` | 10, 11 | Functions for implementing time travel |
| `tsm_system_rows` | 10, 11, 12, 13 | TABLESAMPLE method which accepts number of rows as a limit |
| `tsm_system_time` | 10, 11, 12, 13 | TABLESAMPLE method which accepts time in milliseconds as a limit |
| `unaccent` | 10, 11, 12, 13 | Text search dictionary that removes accents |
| `uuid-ossp` | 10, 11, 12, 13 | Generate universally unique identifiers (UUIDs) |
| `xml2` | 10, 11, 12, 13 | XPath querying and XSLT |

*\* This extension may need to be manually enabled by our team. Contact [Support](https://www.linode.com/support/) with the name of the extension and the name of the Managed Database you wish to enable it on.*

If you would like to use an extension that's not currently listed here, contact our [Support](https://www.linode.com/support/) team and they'll be able to send your feedback to our developers.
---
slug: configure-postgresql
description: 'This guide will show you how to tune PostgreSQL for better performance on your Linode'
og_description: 'PostgreSQL is a database server that focuses on standards compliance. Follow this guide to optimize PostgreSQL performance.'
keywords: ["postgresql", "clusters", "databases", "postgres", "database configuration", "database tuning", "configure postgres"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-12-07
modified_by:
  name: Linode
published: 2017-12-07
title: Configure PostgreSQL
external_resources:
 - '[PostgreSQL Documentation](https://www.postgresql.org/docs/)'
tags: ["database","postgresql"]
aliases: ['/databases/postgresql/configure-postgresql/']
authors: ["Angel Guarisma"]
tags: ["saas"]
---

![Configure PostgreSQL](Configure_PostgreSQL.jpg)

## What is PostgreSQL?

[PostgreSQL](https://www.postgresql.org/) is a popular, open source relational database system. Our [PostgreSQL section](/docs/databases/postgresql/) has detailed instructions on how to install PostgreSQL on different distributions. These basic installations will be sufficient for many use cases; however, PostgreSQL provides many advanced configuration options that can help optimize your databases's performance in a production environment.

PostgreSQL can be configured and tuned through a series of configuration files. In this guide you will learn about the configuration files and how to fine-tune your database to fit your specific needs.

## Before You Begin

You should have a working installation of PostgreSQL on your system before beginning this guide. Go through our [How to Install PostgreSQL on Ubuntu guide](/docs/guides/how-to-install-postgresql-on-ubuntu-16-04/) to install PostgreSQL and create a sample database.
{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}


## PostgreSQL Configuration Files

### Understanding postgresql.conf

Most global configuration settings are stored in `postgresql.conf`, which is created automatically when you install PostgreSQL. Open this file in your preferred text editor:

{{< file "/etc/postgresql/9.5/main/postgresql.conf" txt >}}
 -----------------------------
# PostgreSQL configuration file
# -----------------------------
#
# This file consists of lines of the form:
#
#   name = value
#
# (The "=" is optional.) Whitespace may be used. Comments are introduced with
# "#" anywhere on a line. The complete list of parameter names and allowed
# values can be found in the PostgreSQL documentation.
{{</ file >}}

The contents of the configuration file are broken up into different sections:

| Directive | Use |
| -- | -- |
| File Locations | Defines where values of the database will be stored |
| Connections and Authentications | Allows you to define the settings for connections, security, and authentication |
| Resource Usage | Defines the parameters (memory, space) usable by PostgreSQL. |
| Write Ahead Log | Configures *Write-Ahead logging*, which if properly configured, can result in a lower amount of disk writes. |
| Replication | Control the way replications and replication data is handled by the server. |
| Query Tuning | This set of directives can help you optimize the process of querying to the database. |
| Error Reporting and Logging | Defines how and where the database logging will take place. |
| Runtime Statistics | Modifies the tracking of runtime data. |
| Autovacuum Parameters | A maintenance feature that runs a daemon and periodically reuses previously occupied disk space. |
| Client Connection Defaults | This is one of the directives that controls a wide range of features within PostgreSQL |
| Lock Management | Sets a timer that functions as a fail-safe. If the database is queried and locks-down, the timer will check for a [dead-lock condition](https://www.postgresql.org/docs/9.1/static/explicit-locking.html#LOCKING-DEADLOCKS), and will restore the database if it is found. |
| Version/Platform Compatibility | Allows you to set version-specific compatibility options |
| Error Handling | Defines the behavior upon an error. |
| Config File Includes | Lists the config files that will be included when Postgres looks for configuration files |
| Customized Options | Allows you to add settings that may not fit in a particular section, or to keep your settings organized within this section. |

{{< note >}}
Some of the directives in this configuration file are **extremely** use-case specific. Please consider all effects carefully before changing directives.
{{< /note >}}

### Common Postgres Configuration Options

Configuring a PostgreSQL database can be a complex process. Below are some basic configuration settings recommended when using PostgreSQL on a Linode. All of these options are explained in further detail in the [PostgreSQL Tuning Guide](https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server):

| Directive | Objective |
| -- | -- |
| `listen_addresses = 'localhost'` | By default, Postgres only listens on localhost. However, by editing this section and replacing `localhost` with an IP, you can force Postgres to listen on another IP. Use '*' to listen on all IP addresses. |
| `max_connections = 50` | Sets the exact maximum number of client connections allowed. The higher the setting the more resources Postgres will require. Adjust this value based on the size of your Linode and the traffic you expect your DB to receive. |
| `shared_buffers = 128MB` | As detailed in the [official documentation](https://www.postgresql.org/docs/current/static/runtime-config-resource.html#GUC-SHARED-BUFFERS), this directive is initially set to a low value. On the Linode platform, this can be 1/4 of the RAM on your Linode. |
| `wal_level` | It is important to consider [Write-Ahead Logging](https://www.postgresql.org/docs/9.1/static/wal-intro.html) (WAL) when configuring your Postgres instance. WAL, can save your database in an emergency, by writing and logging at the same time. So your changes are written even if your machine loses power. Before configuring, read [DSHL's guide to understanding WAL](https://www.depesz.com/2011/07/14/write-ahead-log-understanding-postgresql-conf-checkpoint_segments-checkpoint_timeout-checkpoint_warning/), and the [official chapter on WAL Reliability](https://www.postgresql.org/docs/current/static/wal-reliability.html). |
| `synchronous_commit = off` | When using a Linode, it is okay to turn this Directive to `off`. |
| `archive_mode = on` | Turning archive mode on is a viable strategy to increase the redundancy of your backups. |

### Tune Authentication Options through pg_hba.conf

The `pg_hba.conf` file handles the default authentication options for client connections to the database. Entries in this file take the form:

      TYPE  DATABASE        USER            ADDRESS                 METHOD

The following entries are included by default:

{{< file "/etc/postgresql/9.5/main/pg_hba.conf" >}}
TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer

local   all             all                                     peer

host    all             all             127.0.0.1/32            md5

host    all             all             ::1/128                 md5
{{< /file >}}

Each entry specifies how matching requests are authenticated. By default, if you type `psql` at the command line on the host where PostgreSQL is running, the **peer** authentication method will be used. It will attempt to log you in as the database user whose name matches the currently logged in Linux user. To require password authentication by default, set the **METHOD** field for the **local** entry to **password**.

To allow a user on a remote system to log in to the `example` database using a non-hashed password, add a new line to this file, replacing `192.0.2.0` with the remote computer's public IP address:

{{< file "/etc/postgresql/9.5/main/pg_hba_conf" >}}
host    example         exampleuser      192.0.2.0             password
{{< /file >}}

The entries in this table are read in order for each incoming connection attempt. The first entry that matches will be applied to the connection. As a result, more general configurations (matching all users, all databases, or all IP addresses) should come at the end of the file, and should generally have tighter restrictions. More specific matches with less stringent authentication methods (such as the example above) should be placed at the beginning of the list.

{{< note >}}
See the [official pg_hba documentation](https://www.postgresql.org/docs/9.3/static/auth-pg-hba-conf.html) for details about each of the configuration options.
{{< /note >}}

### Match System Users to Database Users with pg_ident.conf

Sometimes, especially when connecting from remote hosts, a user's Linux username may not match their PostgreSQL database username. In these cases, you can specify a mapping in `/etc/postgresql/9.5/main/pg_ident.conf` to match each system user with the correct database user. Entries in this file take the form:

      MAPNAME     SYSTEM-USERNAME     PG-USERNAME

- **MAPNAME** can be arbitrary.
- **SYSTEM-USERNAME** is the user's Linux username.
- **PG-USERNAME** is the matching database user.

In the following example, `exampleuser` can log in to postgres as the database user `db_user`:

      examplemap       exampleuser     db_user

If you specify a mapping in this file, you must add `map=map-name` after the authentication method in the appropriate entry in `pg_hba.conf`. To allow the example user from the earlier `pg_hba.conf` example to log in as `db_user`, the complete entry would look like this:

{{< file "/etc/postgresql/9.5/main/pg_hba.conf" >}}
host    example         exampleuser      192.0.2.0             password map=examplemap
{{< /file >}}

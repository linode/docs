---
author:
  name: Angel
  email: docs@linode.com
description: 'This guide will show you how to tune PostgreSQL for better performance on your Linode'
og_description: 'This guide will detail the basic configuration tuning profile for PostgreSQL'
keywords: ["postgresql", "clusters", "databases"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-12-07
modified_by:
  name: Linode
published: 2017-12-07
title: Configure PostgreSQL
external_resources:
 - '[PostgreSQL Documentation](https://www.postgresql.org/docs/)'
---

Understanding how your PostgreSQL enviroment works is important if you want to use PostgreSQL in a production environment. Configuring your database to fine-tune its performance is a critical part of the process.


## Before You Begin

You should have a working installation of PostgreSQL on your system before beginning this guide. Go through our [How to Install PostgreSQL on Ubuntu guide](/docs/databases/postgresql/how-to-install-postgresql-on-ubuntu-16-04) to install PostgreSQL and create a sample database.
{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}


## PostGRESQL Configuration Files

PostgreSQL can be configured and tuned through a series of configuration files. In this guide you will learn about the configuration files and how to fine-tune your database to fit your specific need.



### postgresql.conf

Most global configuration settings are stored in `postgresql.conf`, which is created automatically when you install PostgreSQL. Open this file in your preferred text editor.


{{< file-excerpt "/etc/postgresql/9.5/main/postgresql.conf" yaml >}}

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

{{</ file-excerpt >}}

The contents of the configuration file are broken up into different sections:

|Directive   | Use   |
|---|---|
|File Locations   | This directive defines where values of the database will be stored   |
|Connections and Authentications   | This directive allows you to define the settings for connections, security, and authentication   |
|Resource Usage   | The resource usuage directive defines the paramaters (memory, space) usable by PostgreSQL.   |
|Write Ahead Log   | This directive configures Write-Ahead logging, which if properly configured can result in a lower amount of disk writes.   |
|Replication   | These directives control the way replications and replication data is handled by the server.   |
|Query Tuning   | This set of directives can help you optimize the process of querying to the database.   |
|Error Reporting and Logging   | This directive defines how and where the database logging will take place.   |
|Runtime Statistics   | This is modifies the tracking of runtime data.   |
|Autovacuum Parameters   | Autovacuum is a maintance feature that runs a daemon, and periodically reuses previously occupied disk space.   |
|Client Connection Defaults   | This is one of the directives that controls a wide range of features within PostgreSQL  |
|Lock Management   |This directive sets a timer that functions as a fail-safe. If the database is queried and locks-down, the timer will check for a dead-lock condition, and will restore the database if it is found.  |
|Version/Platform Compatibility   | Allows you to set version specific compatibility options  |
|Error Handling   | Defines the behaviour upon an error.  |
|Config File Includes   | Lists the config files that will be included when Postgres looks for configuration files  |
|Customized Options   | This section allows you to add settings that may not fit in a particular section, or keep your settings organized by doing that. |

{{< note >}}
Some of the directives in this configuration file are **extremely** use-case specific. Please consider your specific use-case before changing directives.
{{< /note >}}

#### Common Configuration Options

There is a reasonable level of complexity attached to configuring your Postgres database. However, below are some common configuration settings detailed in the [PostgreSQL Tuning Guide](https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server), and specific to Linode's Documentation best practices:


|Directive   | Objective   |
|---|---|
|listen_addresses = 'localhost'   | Postgres, by default, listens only on localhost. However, by editing this section and replacing `localhost` with an IP, you can force Postgres to listen on another IP. Use '*' to listen on all IP addresses.  |
|max_connections = 50   | This directive sets the exact maxmimum number of client connections allowed. The higher the setting the more resources Postgres will require. Depending on the size of your Linode, and the traffic you expect your DB to recive, adjust accordingly.    |
|shared_buffers = 128MB   | As detailed in the [official documentation](https://www.postgresql.org/docs/current/static/runtime-config-resource.html#GUC-SHARED-BUFFERS), this directive is initally set to a low value. On the Linode platform, this can be a 1/4 of the RAM on your Linode. |
|wal_level |It is important to consider [Write-Ahead Logging](https://www.postgresql.org/docs/9.1/static/wal-intro.html) when configuring your Postgres instance. WAL, can save your database in an emergency, by writing and logging at the same time. So your changes are written even if your machine loses power. Before configuring, read [this](https://www.depesz.com/2011/07/14/write-ahead-log-understanding-postgresql-conf-checkpoint_segments-checkpoint_timeout-checkpoint_warning/), and [this](https://www.postgresql.org/docs/current/static/wal-reliability.html).  |
|synchronous_commit = off |In the case of Linode, it is okay to turn this Directive to `off`.
|archive_mode = on |Turning archive mode on is a viable strategy to increase the redundancy of your backups.|


### pg_hba.conf

The `pg_hba.conf` file handles the default authentication options for client connections to the database. Entries in this file take the form:

      TYPE  DATABASE        USER            ADDRESS                 METHOD


The following entries are included by default:

{{< file-excerpt "/etc/postgresql/9.5/main/pg_hba.conf" conf >}}
TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer

local   all             all                                     peer

host    all             all             127.0.0.1/32            md5

host    all             all             ::1/128                 md5
{{< /file-excerpt >}}

Each entry specifies how matching requests are authenticated. By default, if you type `psql` at the command line on the host where PostgreSQL is running, the **peer** authentication method will be used: it will attempt to log you in as the database user whose name matches the currently logged in Linux user. To require password authentication by default, set the **METHOD** field for the **local** entry to **password**.

To enable a user on a remote system to log in to the `example` database using a non-hashed password, add a new line to this file, replacing `192.0.2.0` with the remote computer's public IP address:

{{< file-excerpt "/etc/postgresql/9.5/main/pg_hba_conf" conf >}}
host    example         exampleuser      192.0.2.0             password
{{< /file-excerpt >}}

The entires in this table are read in order for each incoming connection attempt. The first entry that matches will be applied to the connection. As a result, more general configurations (matching all users, all databases, or all IP addresses) should come at the end of the file, and should generally have tighter restrictions. More specific matches with less stringent authentication methods (such as the example above) should be placed at the beginning of the list.

{{< note >}}
See the [official docs](https://www.postgresql.org/docs/9.3/static/auth-pg-hba-conf.html) for details about each of the configuration options.
{{< /note >}}

### pg_ident.conf

Sometimes, especially when connecting from remote hosts, a user's Linux username may not match their PostgreSQL database username. In these cases, you can specify a mapping in `/etc/postgresql/9.5/main/pg_ident.conf` to match each system user with the correct database user. Entries in this file take the form:

      MAPNAME     SYSTEM-USERNAME     PG-USERNAME

The **MAPNAME** can be arbitrary. **SYSTEM-USERNAME** is the user's Linux username and **PG-USERNAME** is the matching database user. In the following example, exampleuser can log in to postgres as the database user db_user:

      examplemap       exampleuser     db_user

If you specify a mapping in this file, you must add `map=map-name` after the authentication method in the appropriate entry in `pg_hba.conf`. To allow the example user from the earlier `pg_hba.conf` example to log in as db_user, the complete entry would look as follows:

{{< file-excerpt "/etc/postgresql/9.5/main/pg_hba.conf" conf >}}
host    example         exampleuser      192.0.2.0             password map=examplemap
{{< /file-excerpt >}}

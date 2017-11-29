---
author:
  name: Angel
  email: docs@linode.com
description: 'This guide will show you how to tune PostgreSQL for better performance on your Linode'
og_description: 'This guide will detail the basic configuration tuning profile for PostgreSQL'
keywords: ["postgresql", "clusters", "databases"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-09-19
modified_by:
  name: Linode
published: 2017-09-19
title: Configure PostgreSQL
external_resources:
 - '[PostgreSQL Documentation](https://www.postgresql.org/docs/)'
---

Understanding how your PostgreSQL enviroment works is important, if you want to use PostgreSQL in a production environment. Configuring your database to fine-tune its performance is a critical part of the process. LETS ROLL!


### Before You Begin

You should have a working installation of PostgreSQL on your system before beginning this guide. Go through our [How to Install PostgreSQL on Ubuntu guide](/docs/databases/postgresql/how-to-install-postgresql-on-ubuntu-16-04) to install PostgreSQL and create a sample database.
{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}


## The PostGRESQL Configuration File

PostgreSQL, can be configured and tuned through a series of configuration files. In this guide you will learn about the configuration files and how to fine-tune your database to fit your specific need.



### postgresql.conf

In your preferred text-editor, open up the configuration file. 


{{< file-excerpt "postgresql.conf" yaml >}}

 -----------------------------
# PostgreSQL configuration file
# -----------------------------
#
# This file consists of lines of the form:
#
#   name = value
#
# (The "=" is optional.)  Whitespace may be used.  Comments are introduced with
# "#" anywhere on a line.  The complete list of parameter names and allowed
# values can be found in the PostgreSQL documentation.

{{</ file-excerpt >}}

The contents of the configuration file are broken up into different sections:

|Directive   | Use   |
|---|---|
|File Locations   | This directive defines where values of the database will be stored   |
|Connections and Authentications   | This directive allows you to define the settings for connections, security, and authentication   |
|Resource Usage   | The resource usuage directive defines the paramaters (memory, space) usable by PostgreSQL.   |
|Write Ahead Log   | This directive configures Write-Ahead logging, which if properly configured, can result in a lower amount of disk writes.   |
|Replication   | These directives control the way replications, and replication data is handled by the server.   |
|Query Tuning   | This set of directives can help you optimize the process of querying to the database.   |
|Error Reporting and Logging   | This directive defines how, and where, the database logging will take place.   |
|Runtime Statistics   | This is modifies the tracking of runtime data.   |
|Autovacuum Parameters   | Autovacuum, is a maintance feature that runs a daemon, and periodically reuses previously occupied disk space.   |
|Client Connection Defaults   | This is one of the directives that controls a wide range of features within PostgreSQL  | 
|Lock Management   |This directive sets a timer that functions as a fail-safe. If the database is queried, and locks-down, the timer will check for a dead-lock condition, and will restore the database if it is found.  | 
|Version/Platform Compatibility   | Allows you to set version specific compatibility options  | 
|Error Handling   | Defines the behaviour upon an error.  | 
|Config File Includes   | Lists the config files that will be included when Postgres looks for configuration files  | 
|Customized Options   | This section allows you to add settings that may not fit in a particular section, or keep your settings organized by doing that. |

{{< note >}}
Some of the directives in this configuration are **extremely** use-case specific. Please consider your specific use-case, before changing directives.
{{< /note >}}


#### The Connections and Authentications Section
<!--- This is commented for now, and if it is still here by the copy edit stage, please delete it.
{{< file-excerpt "postgresql.conf" yaml >}}
#------------------------------------------------------------------------------
# CONNECTIONS AND AUTHENTICATION
#------------------------------------------------------------------------------

# - Connection Settings -

#listen_addresses = 'localhost'         # what IP address(es) to listen on;
                                        # comma-separated list of addresses;
                                        # defaults to 'localhost'; use '*' for all
                                        # (change requires restart)
port = 5432                             # (change requires restart)
max_connections = 100                   # (change requires restart)
#superuser_reserved_connections = 3     # (change requires restart)
unix_socket_directories = '/var/run/postgresql' # comma-separated list of directories
                                        # (change requires restart)
#unix_socket_group = ''                 # (change requires restart)
#unix_socket_permissions = 0777         # begin with 0 to use octal notation
                                        # (change requires restart)
#bonjour = off                          # advertise server via Bonjour
                                        # (change requires restart)
#bonjour_name = ''                      # defaults to the computer name
                                        # (change requires restart)

# - Security and Authentication -

#authentication_timeout = 1min          # 1s-600s
ssl = true                              # (change requires restart)
#ssl_ciphers = 'HIGH:MEDIUM:+3DES:!aNULL' # allowed SSL ciphers
                                        # (change requires restart)
#ssl_prefer_server_ciphers = on         # (change requires restart)
#ssl_ecdh_curve = 'prime256v1'          # (change requires restart)
ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'          # (change requires rest\
art)
ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'         # (change requires rest\
art)
#ssl_ca_file = ''                       # (change requires restart)
#ssl_crl_file = ''                      # (change requires restart)
#password_encryption = on
#db_user_namespace = off
#row_security = on

# GSSAPI using Kerberos
#krb_server_keyfile = ''
#krb_caseins_users = off

# - TCP Keepalives -
# see "man 7 tcp" for details

#tcp_keepalives_idle = 0                # TCP_KEEPIDLE, in seconds;
                                        # 0 selects the system default
#tcp_keepalives_interval = 0            # TCP_KEEPINTVL, in seconds;
                                        # 0 selects the system default
#tcp_keepalives_count = 0               # TCP_KEEPCNT;
                                        # 0 selects the system default


{{< /file-excerpt >}}
--->
### Configuring PostgreSQL

There is a reasonable level of complexity attached to configuring your Postgres database. However, below are some common configuration settings detailed in the [PostgreSQL Tuning Guide](https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server), and specific to Linode's Documentation best practices:


|Directive   | Objective   |
|---|---|
|listen_addresses = 'localhost'   | Postgres, by default, listens only on localhost. However, by editing this section, and replacing `localhost` with an IP, you can force Postgres to listen on another IP.   |
|max_connections = 50   | This directive sets the exact maxmimum number of client connections allowed. The higher the setting the more resources Postgres will require. Depending on the size of your Linode, and the traffic you expect your DB to recive, adjust accordingly.    |
|shared_buffers = 128MB   | As detailed in the [official documentation](https://www.postgresql.org/docs/current/static/runtime-config-resource.html#GUC-SHARED-BUFFERS), this directive is iniitally set very low. On the Linode platform, this can be a 1/4 of the RAM on your Linode. |
|wal_level |It is important to consider [Write-Ahead Logging](https://www.postgresql.org/docs/9.1/static/wal-intro.html) when configuring your Postgres instance. WAL, can save your database in an emergency, by writing and logging at the same time. So your changes are written even if your machine loses power. Before configuring, read [this](https://www.depesz.com/2011/07/14/write-ahead-log-understanding-postgresql-conf-checkpoint_segments-checkpoint_timeout-checkpoint_warning/), and [this](https://www.postgresql.org/docs/current/static/wal-reliability.html).  | 
|synchronous_commit = off |In the case of Linode, it is okay to turn this Directive to `off`. 
|archive_mode = on |Turning archive mode on is a viable strategy to increase the relevancy of your backups.|




---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the PostgreSQL relational database server with Fedora 14.'
keywords: ["postgresql fedora 14", "postgresql database", "relational database"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-12-08
title: Use PostgreSQL Relational Databases on Fedora 14
---

The [PostgreSQL](http://www.postgresql.org/) relational database system is a fast, scalable, and standards-compliant open source database platform. This guide will help you install and configure PostgreSQL on Fedora 14. We assume you've followed the steps detailed in our [getting started guide](/docs/getting-started/), and that you're logged into your Linode as root via SSH.

System Configuration
--------------------

Make sure your `/etc/hosts` file has proper entries, similar to the ones shown below. Replace "12.34.56.78" with your Linode's public address, "servername" with your short hostname, and "mydomain.com" with your system's domain name.

{{< file "/etc/hosts" >}}
local all all ident

{{< /file >}}


Change it to the following to use password authentication:

{{< file-excerpt "/var/lib/pgsql/data/pg\\_hba.conf" >}}
local all all md5

{{< /file-excerpt >}}


As root, restart the Postgresql service:

    service postgresql restart

Resume these instructions as the `postgres` user:

    su - postgres

To grant all privileges on the table "employees" to a user named "alison", issue the following commands:

    psql mytestdb
    GRANT ALL ON employees TO alison;
    \q

To use the database "mytestdb" as "alison", issue the following command:

    psql -U alison -W mytestdb

You will be prompted to enter the password for the "alison" user and given `psql` shell access to the database.

Secure Remote Database Access
-----------------------------

PostgreSQL listens for connections on localhost, and it is not advised to reconfigure it to listen on public IP addresses. If you would like to access your databases remotely using a graphical tool, please follow one of these guides:

-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Windows](/docs/databases/postgresql/pgadmin-windows)
-   [Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](/docs/databases/postgresql/pgadmin-macos-x)

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [PostgreSQL Online Documentation](http://www.postgresql.org/docs/)
- [psql Manual Page](http://www.rootr.net/man/man/psql/1)




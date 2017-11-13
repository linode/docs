---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the Open-source PgAdmin Program to Securely Manage Remote PostgreSQL Databases from a Mac OS X Workstation.'
keywords: ["pgadmin", "mac os x", "postgresql gui", "manage postgresql databases", "ssh tunnel"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-05-11
modified_by:
  name: Phil Zona
published: 2010-04-30
title: Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X
aliases: ['databases/postgresql/pgadmin-macos-x/']
external_resources:
 - '[pgAdmin Documentation](http://www.pgadmin.org/docs/)'
 - '[PostgreSQL Documentation](http://www.postgresql.org/docs/)'
---

pgAdmin is a free, open-source PostgreSQL database administration GUI for Microsoft Windows, Apple Mac OS X and Linux systems. It offers excellent capabilities with regard to database server information retrieval, development, testing, and ongoing maintenance. This guide will help you get up and running with pgAdmin on Mac OS X, providing secure access to remote PostgreSQL databases. It is assumed that you have already installed PostgreSQL on your Linode in accordance with our [PostgreSQL installation guides](/docs/databases/postgresql/).

## Install pgAdmin

1.  Visit the [pgAdmin download page](https://www.pgadmin.org/download/macos4.php) to obtain the most recent version of the program. Save the installer to your desktop and launch it. Read the license agreement and click the "Agree" button to continue.

    [![pgAdmin on Mac OS X installer license agreement dialog](/docs/assets/pg-admin-macosx-license.png)](/docs/assets/pg-admin-macosx-license.png)

2.  After the program has uncompressed itself, you'll see a pgAdmin icon in a Finder window. You may drag this to your Applications folder or your dock.

## Configure SSH Tunnel

While PostgreSQL supports SSL connections, it is not advisable to instruct it to listen on public IP addresses unless absolutely necessary. For this reason, you'll be using following command to create an SSH tunnel to your database server, replacing `username` with your Linux username and `remote-host` with your Linode's hostname or IP address:

    ssh -f -L 5433:127.0.0.1:5432 username@remote-host -N

Although PostgreSQL uses port 5432 for TCP connections, we're using the local port 5433 in case you decide to install PostgreSQL locally later on.

## Use pgAdmin

1.  Launch pgAdmin and you'll be presented with a default view containing no servers. Click "File -> Add Server" as shown below.

    [![pgAdmin III default view on Mac OS X](/docs/assets/pg-admin-macosx-add-server.png)](/docs/assets/pg-admin-macosx-add-server.png)

2.  If you're having problems connectiong you may need to check PostgreSQL's configuration to ensure it accepts connections. Modify the following lines in `/etc/postgresql/9.5/main/postgresql.conf` if necessary:

    {{< file-excerpt "/etc/postgresql/9.5/main/postgresql.conf" aconf >}}
listen_addresses = 'localhost'

port = 5432

{{< /file-excerpt >}}


    Restart PostgreSQL to activate these changes. This command may vary among different distributions:

        sudo systemctl restart postgresql

3.  In the "New Server Registration" dialog that appears, enter appropriate values for your server name and PostgreSQL account credentials. Be sure to specify "localhost" for the "Host" field, as you'll be connecting via your SSH tunnel. In the username and password fields, enter the credentials you specified when setting up PostgreSQL.

    For greater security, uncheck the "Store password" box. Click "OK" to connect to your server.

    [![pgAdmin III new server details dialog on Mac OS X](/docs/assets/pg-admin-macosx-server-details.png)](/docs/assets/pg-admin-macosx-server-details.png)

4.  You will be presented with a full view of the databases that your user account has access to:

    [![pgAdmin III full database view on Mac OS X](/docs/assets/pg-admin-macosx-database-view.png)](/docs/assets/pg-admin-macosx-database-view.png)

Congratulations! You've securely connected to your remote PostgreSQL server with pgAdmin III.

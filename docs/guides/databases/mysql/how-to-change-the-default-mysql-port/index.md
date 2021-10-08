---
slug: mysql-port
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn how to change the default MySQL network port and the MySQL Administrative Port.'
keywords: ["mysql port", "change the mysql port", "port 3306"]
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-10
modified_by:
  name: Linode
title: 'How To Change the Default MySQL Ports'
h1_title: 'How To Change the Default MySQL Ports'
enable_h1: true
contributor:
external_resources:
  - '[MySQL Port Reference Tables](https://dev.mysql.com/doc/mysql-port-reference/en/mysql-ports-reference-tables.html)'
  - '[MySQL Secure Deployment Guide - Enabling Authentication](https://dev.mysql.com/doc/mysql-secure-deployment-guide/5.7/en/secure-deployment-configure-authentication.html)'
  - '[MySQL Server System Variables](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_admin_address)'
---

This article will show you how to change the default MySQL port (the MySQL Client-Server Connection Port) and other ports used by the MySQL database server, including the MySQL Administrative Port.

## Understanding MySQL Ports

MySQL is a relational database management system. Like many such systems, it uses a client-server model. MySQL is the server. The apps and other software that interact with MySQL databases are the clients. Clients connect to the MySQL server over a numbered network port managed by the operating system.

MySQL uses [several network ports](https://dev.mysql.com/doc/mysql-port-reference/en/mysql-ports-reference-tables.html), which serve different purposes:

* The MySQL Client-Server Port is used by clients to access and manage databases. Its default port number is 3306
* The MySQL Administrative Connection Port is an alternative to the Client-Server port for administrative connections. Its default port number is 33062.

In addition to these, MySQL uses a number of other ports, which you can read about in the [MySQL Port Reference Tables](https://dev.mysql.com/doc/mysql-port-reference/en/mysql-ports-reference-tables.html).

When people talk about changing the default MySQL port, they are generally referring to the Client-Server Port. Configuring MySQL to use a different port can improve security. Malicious scripts and bots often target this port. Changing it to a different port number may reduce the attack frequency.

{{< caution >}}
Changing the default MySQL port is not a substitute for a firewall and correctly configured [MySQL authentication](https://dev.mysql.com/doc/mysql-secure-deployment-guide/5.7/en/secure-deployment-configure-authentication.html). While changing the port may confuse unsophisticated bots, a dedicated attacker is likely to find the new port.
{{< /caution >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide.

2.  This guide will use `sudo` wherever possible.

3.  This guide assumes you have some familiarity with MySQL. If you do not, see our [MySQL guides](https://www.linode.com/docs/guides/databases/mysql/) and the MySQL Reference Manual at the [MySQL Documentation site](https://dev.mysql.com/doc/) for more information.

3.  Update your system. On Debian and Ubuntu, enter:

    sudo apt-get update && sudo apt-get upgrade

On Fedora, CentOS, or other Red Hat-derived distributions, enter:

    sudo yum update


## How to Verify a Port is Available

Before attempting to bind a new port, you should make sure it is not already in use.

1.  Use `netstat` to check that another service is not bound to your preferred port.

    netstat -tanp | grep PORT

There is no output if the port is available. If the port is not available, `netstat` prints the services currently using it. For example, if you tried to use the default SSH port (22).

    netstat -tanp | grep 22

    {{< output >}}
    tcp     0   0 0.0.0.0:22        0.0.0.0:*       LISTEN      763/sshd
    tcp6    0   0 :::22             :::*            LISTEN      763/sshd
    {{< /output >}}


If your preferred port is already in use, choose a different port and check again to make sure it is available.

## How To Change The Default MySQL Connection Port

1.  Edit the port configuration variables in the MySQL server's configuration file.

On CentOS 8 and RHEL, the file is:

    /etc/my.cnf.d/mysql-server.cnf

On Ubuntu, the file is:

    /etc/mysql/mysql.conf.d/mysqld.cnf

The file's contents may differ depending on the Linux distribution and how the MySQL server is configured. It is safe to add your configuration below any already present. 

To change the port, add or edit the relevant configuration variable in the file's `mysqld` section. The MySQL Client-Server Port is controlled with the `port` variable. For example, add `port=36785` to change the MySQL Client-Server port to Port 36785.

    {{< output >}}
    [mysqld]
    port=36785
    {{< /output >}}

2. Restart the MySQL Server.

    sudo systemctl restart mysqld


The MySQL server restarts and binds to the new port.


## How To Change The MySQL Administrative Connection Port

Most connections to a MySQL server can use the MySQL Client-Server Port. However, MySQL also provides an Administrative Connection Port for the exclusive use of database administrators and their tools. The Administrative Connection Port is controlled by two configuration variables: `admin_port` and `admin_address`. Both must be set or MySQL will not bind an administrative port.

The `admin_port` variable indicates the new port number. The `admin_address` variable indicates the host or IP address MySQL clients connect to. In many cases, this is the server's local address `127.0.0.1`. However, it may be different, depending on how your network and MySQL server are configured. [The MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_admin_address) has more details about the appropriate format for this value.


1.  Edit the `admin_port` and `admin_address` configuration variables in the MySQL server's configuration file.

On CentOS 8 and RHEL, the file is:

    /etc/my.cnf.d/mysql-server.cnf

On Ubuntu and Debian, the file is:

    /etc/mysql/mysql.conf.d/mysqld.cnf

Add or edit the  `admin_port` and `admin_address` variables.

    {{< output >}}
    [mysqld]
    admin_port=36785
    admin_address=127.0.0.1
    {{< /output >}}

2.  Restart the MySQL Server.

    sudo systemctl restart mysqld

The MySQL server will now restart and bind to the new port.
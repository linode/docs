---
slug: check-mysql-version
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide on how to check which version of MySQL you are running on your Debian, Ubuntu, Fedora, Windows, or Macintosh system.'
og_description: 'How to check the version of MySQL running.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-11
modified_by:
  name: Linode
title: "Check MySQL Version"
h1_title: "How to Check Your MySQL Version"
enable_h1: true
contributor:
external_resources:
- '[Installing and Upgrading MySQL on mysql.com](https://dev.mysql.com/doc/refman/8.0/en/installing.html)'
- '[SHOW VARIABLES Statement on mysql.com](https://dev.mysql.com/doc/refman/8.0/en/show-variables.html)'
---
Knowing what version of MySQL you're running can be important for software compatibility or security. This guide shows how to quickly find the version being run on your Linux, macOS, or Windows system.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide.

2.  This guide will use `sudo` wherever possible. On Windows, you will want run applications as an Administrator.

3.  This guide assumes you have some familiarity with running MySQL. If you do not, see our [MySQL guides](https://www.linode.com/docs/guides/databases/mysql/) and the MySQL Reference Manual at the [MySQL Documentation site](https://dev.mysql.com/doc/) for more information.

4.  Update your system. On Debian and Ubuntu, enter:

        sudo apt-get update && sudo apt-get upgrade
    On Fedora, CentOS, or other Red Hat-derived distributions, either enter:

        sudo dnf update
    Or (on older Red Hat-based systems):

        sudo yum update

    On any other systems (Windows, macOS), use your built-in updater(s).

## Check the MySQL Version on Any OS

No matter if you're on Linux, macOS, or Windows, the fastest way to check the MySQL version is to launch MySQL from the terminal by entering:

        sudo mysql
The output should look like this:

{{< output >}}
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 9
Server version: 8.0.26-0ubuntu0.20.04.2 (Ubuntu)

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective owners.

Reading history-file /mumbly/.mysql_history
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
{{< /output >}}

The line with "Server version" will tell you precisely what version you're using.

### Check an Older Version of MySQL
If you have an older installation of MySQL, it may not show the version when you launch it. In that case, use the `-v` option when you run it from the command line:

        sudo mysql -v

## Check the MySQL Version using `SHOW VARIABLES`

If MySQL is running and you don't want to stop it, you can check it by having MySQL show the variable. At the MySQL prompt, enter:

        mysql> SHOW VARIABLES LIKE 'version';
The output will look like this:
{{< output >}}
+---------------+-------------------------+
| Variable_name | Value                   |
+---------------+-------------------------+
| version       | 8.0.26-0ubuntu0.20.04.2 |
+---------------+-------------------------+
1 row in set (0.00 sec)
{{< /output >}}

## Check the MySQL Version using `STATUS`

Another option to check the version from inside MySQL is the `STATUS` command. At the MySQL prompt, enter:

        mysql> STATUS;
The output will look like this:
{{< output >}}
--------------
mysql  Ver 8.0.26-0ubuntu0.20.04.2 for Linux on x86_64 ((Ubuntu))

Connection id:		11
Current database:
Current user:		mumbly@linode
SSL:			Not in use
Current pager:		stdout
Using outfile:		''
Using delimiter:	;
Server version:		8.0.26-0ubuntu0.20.04.2 (Ubuntu)
Protocol version:	10
Connection:		Localhost via UNIX socket
Server characterset:	utf8mb4
Db     characterset:	utf8mb4
Client characterset:	utf8mb4
Conn.  characterset:	utf8mb4
UNIX socket:		/var/run/mysqld/mysqld.sock
Binary data as:		Hexadecimal
Uptime:			52 min 12 sec

Threads: 2  Questions: 15  Slow queries: 0  Opens: 134  Flush tables: 3  Open tables: 53  Queries per second avg: 0.004
--------------
{{< /output >}}
---
slug: configure-master-master-mysql-database-replication
description: "Learn how to set up master-master MySQL databases replication in this simple step-by-step tutorial."
og_description: "MySQL Master-Master replication adds speed and redundancy. With replication, two separate MySQL servers act as a cluster, particularly useful for high availability website configurations. Use this guide to configure database replication on your Linode."
keywords: ["set up mysql", "replication", "master-master", "high availability"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/databases/mysql/mysql-master-master-replication/','/databases/mysql/mysql-master-master/','/databases/mysql/configure-master-master-mysql-database-replication/']
published: 2014-12-24
modified: 2023-04-04
modified_by:
  name: Linode
title: "Configure Master-Master MySQL Database Replication"
external_resources:
 - '[MySQL Reference Manuals](http://dev.mysql.com/doc/)'
tags: ["ubuntu","debian","database","mysql"]
image: mysql-master-master-replication-title.jpg
authors: ["James Stewart"]
---

## What is MySQL Master-Master Replication?

MySQL Master-Master replication adds speed and redundancy for active websites. With replication, two separate MySQL servers act as a cluster. Database clustering is particularly useful for high availability website configurations. Use two separate Linodes to configure database replication, each with private IPv4 addresses.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.

This guide is written for Ubuntu 18.04 and 20.04.

If you are unsure of which version of MySQL has been installed on your system when following the steps below, enter the following command:

```command
mysql --version
```
{{< /note >}}

## Install MySQL

1.  Use the following commands to install MySQL on each of the Linodes:

    ```command
    sudo apt-get update
    sudo apt-get upgrade -y
    sudo apt-get install mysql-server mysql-client
    ```

2.  Run the MySQL secure installation command. You are prompted to create a root password. It is recommended you select yes to all of the questions:

    ```command
    mysql_secure_installation
    ```

## Edit MySQL's Configuration

1.  Edit the `/etc/mysql/my.cnf` file on `Server 1`, and `Server 2` Linodes. Add or modify the following values:

    **Server 1:**

    ```file {title="/etc/mysql/my.cnf"}
    [mysqld]
    server_id           = 1
    log_bin             = /var/log/mysql/mysql-bin.log
    log_bin_index       = /var/log/mysql/mysql-bin.log.index
    relay_log           = /var/log/mysql/mysql-relay-bin
    relay_log_index     = /var/log/mysql/mysql-relay-bin.index
    expire_logs_days    = 10
    max_binlog_size     = 100M
    log_replica_updates = 1
    auto-increment-increment = 2
    auto-increment-offset = 1
    ```

    **Server 2:**

    ```file {title="/etc/mysql/my.cnf"}
    [mysqld]
    server_id           = 2
    log_bin             = /var/log/mysql/mysql-bin.log
    log_bin_index       = /var/log/mysql/mysql-bin.log.index
    relay_log           = /var/log/mysql/mysql-relay-bin
    relay_log_index     = /var/log/mysql/mysql-relay-bin.index
    expire_logs_days    = 10
    max_binlog_size     = 100M
    log_replica_updates = 1
    auto-increment-increment = 2
    auto-increment-offset = 2
    ```

    {{< note >}}
    If using MySQL 8.0.25 or earlier, replace `log_replica_updates` with `log_slave_updates` (within both Servers 1 and 2). See [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_log_slave_updates) for details.
    {{< /note >}}

2. Edit the `bind-address` configuration in order to use the private IP addresses, for `Server 1` and `Server 2`:

    **Server 1:**

     ```file {title="/etc/mysql/my.cnf"}
    bind-address    = 192.0.2.1
    ```

     **Server 2:**

     ```file {title="/etc/mysql/my.cnf"}
    bind-address    = 192.0.2.2
    ```

3.  Once completed, restart the MySQL application on `Server 1`, and `Server 2`:

    ```command
    sudo systemctl restart mysql
    ```

## Create Replication Users

1.  Log in to MySQL on `Server 1`, and `Server 2` Linodes:

    ```command
    mysql -u root -p
    ```

2.  Configure the replication users on each Linode. Replace `192.0.2.1` and `192.0.2.2` with the private IP address of the `Server 1` and `Server 2` Linodes and replace `password` with a strong password.

    {{< tabs >}}
    {{< tab "MySQL 8 and later" >}}
    **Server 1**

    ```command
    CREATE USER 'replication'@'x.x.x.x' IDENTIFIED BY 'password';
    GRANT REPLICATION SLAVE ON *.* TO 'replication'@'192.0.2.1';
    ```

    **Server 2**

    ```command
    CREATE USER 'replication'@'x.x.x.x' IDENTIFIED BY 'password';
    GRANT REPLICATION SLAVE ON *.* TO 'replication'@'192.0.2.2';
    ```
    {{< /tab >}}
    {{< tab "MySQL 5.7 and earlier" >}}
    **Server 1**

    ```command
    GRANT REPLICATION SLAVE ON *.* TO 'replication'@'192.0.2.1' IDENTIFIED BY 'password';
    ```

    **Server 2**

    ```command
    GRANT REPLICATION SLAVE ON *.* TO 'replication'@'192.0.2.2' IDENTIFIED BY 'password';
    ```
    {{< /tab >}}
    {{< /tabs >}}

3.  Run the following command to test the configuration. Use the private IP address of the respective Linodes:

    **Server 1**

    ```command
    mysql -u replication -p -h 192.0.2.1 -P 3306
    ```

    **Server 2**

    ```command
    mysql -u replication -p -h 192.0.2.2 -P 3306
    ```

    This command should connect you to the remote server's MySQL instance.

## Configure Database Replication

1.  Log into MySQL on `Server 1` as the root user and query the master status:

    ```command
    SHOW MASTER STATUS;
    ```

    Note the file and position values that are displayed:

    ```output
    mysql> SHOW MASTER STATUS;
    +------------------+----------+--------------+------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
    +------------------+----------+--------------+------------------+
    | mysql-bin.000001 |      277 |              |                  |
    +------------------+----------+--------------+------------------+
    1 row in set (0.00 sec)
    ```

2.  On `Server 2` at the MySQL prompt, set up the replica functionality for that database. Replace`192.0.2.1` with the private IP of `Server 1`. Also replace the value for `source_log_file` with the file value from the previous step, and the value for `source_log_pos` with the position value.

    {{< tabs >}}
    {{< tab "MySQL 8.0.22 and later" >}}
    ```command
    STOP REPLICA;
    CHANGE REPLICATION SOURCE TO
        source_host='192.0.2.1',
        source_port=3306,
        source_user='replication',
        source_password='password',
        source_log_file='mysql-bin.000001',
        source_log_pos=277;
    START REPLICA;
    ```
    {{< /tab >}}
    {{< tab "MySQL 8.0.21 and earlier" >}}
    ```command
    STOP SLAVE;
    CHANGE MASTER TO
        master_host='192.0.2.1',
        master_port=3306,
        master_user='replication',
        master_password='password',
        master_log_file='mysql-bin.000001',
        master_log_pos=277;
    START SLAVE;
    ```
    {{< /tab >}}
    {{< /tabs >}}

3.  On `Server 2`, query the master status. Again note the file and position values.

    ```command
    SHOW MASTER STATUS;
    ```

4.  Set the replica database status on `Server 1`, utilizing similar commands as in step 2. When entering the commands, use the IP address of `Server 2` and the file and position values you just collected in the previous step for `Server 2`.

5.  Test by creating a database and inserting a row:

    **Server 1:**

    ```command
    create database test;
    create table test.flowers (`id` varchar(10));
    ```

    **Server 2:**

    ```command
    show tables in test;
    ```

When queried, you should see the tables from `Server 1` replicated on `Server 2`.  Congratulations, you now have a MySQL Master-Master cluster!
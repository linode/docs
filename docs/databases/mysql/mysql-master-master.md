---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Configuring MySQL Master-Master Replication.'
keywords: 'mysql,replication,master-master,high availability'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['databases/mysql/backup-options/']
modified: Thursday, December 18th, 2014
modified_by:
  name: James Stewart
published: 'Tbursday, December 18th, 2014'
title: Configuring MySQL Master-Master Replication
---

MySQL Master-Master replication adds redundancy to your deployment.  This allows two separate MySQL servers to act as a cluster, and is particularly useful for high availability website configurations.  You will need two separate Linodes to configure database replication, each with private IPv4 addresses.

{: .note}
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Install MySQL

Use the following command to install MySQL on each of your Linodes:

    sudo apt-get update
    sudo apt-get upgrade -y
    sudo apt-get install mysql-server mysql-client

##Edit MySQL's Configuration


1.  Edit `/etc/mysql/my.cnf` on each of your Linodes and add the following values. Note that some of these directives may already be in place and need to be modified:

    **Server 1:**

    {: .file-excerpt }
    /etc/mysql/my.cnf
    : ~~~ conf
    server_id           = 1
    log_bin             = /var/log/mysql/mysql-bin.log
    log_bin_index       = /var/log/mysql/mysql-bin.log.index
    relay_log           = /var/log/mysql/mysql-relay-bin
    relay_log_index     = /var/log/mysql/mysql-relay-bin.index
    expire_logs_days    = 10
    max_binlog_size     = 100M
    log_slave_updates   = 1
    auto-increment-increment = 2
    auto-increment-offset = 1
    ~~~

    **Server 2:**

    {: .file-excerpt }
    /etc/mysql/my.cnf
    : ~~~ conf
    server_id           = 2
    log_bin             = /var/log/mysql/mysql-bin.log
    log_bin_index       = /var/log/mysql/mysql-bin.log.index
    relay_log           = /var/log/mysql/mysql-relay-bin
    relay_log_index     = /var/log/mysql/mysql-relay-bin.index
    expire_logs_days    = 10
    max_binlog_size     = 100M
    log_slave_updates   = 1
    auto-increment-increment = 2
    auto-increment-offset = 2
    ~~~

2.  Edit the `bind-address` for each of your Linodes to use its private IP address:

    {: .file-excerpt }
    /etc/mysql/my.cnf
    : ~~~
    bind-address    = x.x.x.x
    ~~~

3.  Once these steps have been completed, restart the MySQL service:

        sudo service mysql restart

##Create Replication Users

1.  Log in to MySQL on each of your Linodes:

        mysql -u root -p

2.  Configure replication users on each Linode.  Replace `x.x.x.x` with the private IP address of the opposing Linode, and `password` with a strong password:

        GRANT REPLICATION SLAVE ON *.* TO 'replication'@'x.x.x.x' IDENTIFIED BY 'password';

3.  Test your configuration by running the following command, using the private IP address of the opposing Linode:

        mysql -ureplication -p -h x.x.x.x -P 3306
        
    This command should connect you to the remote server's MySQL instance.

##Configure Database Replication


1.  On Server 1, while logged into MySQL, query the master status:

        SHOW MASTER STATUS;

    Take note of the file and position values that are displayed:

        mysql> SHOW MASTER STATUS;
        +------------------+----------+--------------+------------------+
        | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
        +------------------+----------+--------------+------------------+
        | mysql-bin.000001 |      277 |              |                  |
        +------------------+----------+--------------+------------------+
        1 row in set (0.00 sec)

2.  On Server 2, at the MySQL prompt set up the slave functionality for that database.  Replace`x.x.x.x` with the private IP from Server 1, the value for `master_log_file` with the file value from the previous step, and the value for `master_log_pos` with the position value.

        SLAVE STOP;
        CHANGE MASTER TO master_host='x.x.x.x', master_port=3306, master_user='replication', master_password='password', master_log_file='mysql-bin.000001', master_log_pos=106;
        SLAVE START;

3.  On Server 2, query the master status, and once again note the file and position values.

        SHOW MASTER STATUS;

4.  Set slave database status on Server 1, replacing the same values swapped in step 2 with those from Server 2.

        SLAVE STOP;
        CHANGE MASTER TO master_host='x.x.x.x', master_port=3306, master_user='replication', master_password='password', master_log_file='mysql-bin.000001', master_log_pos=277;
        SLAVE START;

5.  Test by creating a datbase and inserting a row.

    Server 1:

        create database test;
        create table test.flowers (`id` varchar(10));

    Server 2:

        show tables in test;

You should see the tables from Server 1 replicated on Server 2 when queried.  Congratulations, you now have a MySQL Master-Master cluster!

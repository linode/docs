---
slug: configure-source-replica-replication-in-mysql
description: 'This guide explains how to configure source-replica data replication in the popular MySQL database application to keep copies of your database for emergencies.'
keywords: ['mysql replication']
tags: ['mysql', 'database', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-30
modified_by:
  name: Linode
title: "Configure Source-Replica Replication in MySQL"
external_resources:
- '[MySQL Documentation](https://dev.mysql.com/doc/refman/8.0/en/replication.html)'
authors: ["Jeff Novotny"]
tags: ["saas"]
---

The [*MySQL*](https://dev.mysql.com/) is a relational database management system that is one of the most popular open-source projects. Although known for its stability, MySQL is even more reliable if source-replica replication is configured. In replication, one MySQL server is typically designated the *source*. A source sends any database changes and data updates to one or more *replica* database servers. MySQL's data replication procedure is flexible, and the replica servers do not need to be permanently connected to the source. This guide explains how to configure source-replica data replication in MySQL.

## How MySQL Data Replication Works

The replication process stores data in the source database first and then copies it over to any replicas. After it processes the instruction, the source database server tracks the change in a binary log. The log serves as a sequential record of all the changes to the database structure and contents. `SELECT` statements are not recorded because they do not change the database contents.

Updates happen asynchronously, so the replicas do not have to be continuously connected. This contrasts with the synchronous architectures of high-reliability systems. If real-time synchronization is required, MySQL recommends using the [*NDB Cluster*](https://dev.mysql.com/doc/refman/5.6/en/mysql-cluster.html).

Each replica pulls data from the source by requesting the contents of the source's binary log. The replica then applies the statements in order, effectively replaying the events that occurred on the source. Each replica is independent and keeps track of its current position with the source binary log. Additionally, each replica can synchronize with the source according to its own schedule. Data can be read from any of the servers, including the replicas.

MySQL allows a high degree of granularity. It is possible to replicate over certain databases or even specific tables within a database. The default replication format is *Statement Based Replication* (SBR), in which the entire SQL statement is replicated. However, *Row Based Replication* (RBR) is also available. This format replicates the rows that have been changed. It is also possible to configure more complicated many-to-many configurations. Consult the [MySQL Documentation](https://dev.mysql.com/doc/refman/8.0/en/replication.html) for more information about the different replication options.

{{< note >}}
MySQL previously referred to Source-Replica Replication as "Master-Slave Replication". The MySQL Organization recently changed the terminology, explaining their reasoning in a [terminology update](https://mysqlhighavailability.com/mysql-terminology-updates/). The older term "master" has been changed to "source", while a "slave" is now referred to as a "replica". The old terms might still appear in certain commands and output displays while MySQL updates its codebase. This guide uses MySQL's preferred terms throughout the instructions.
{{< /note >}}

## Advantages of MySQL Data Replication

Enabling source-replica replication offers many significant advantages over a non-redundant system. The list below provides an overview of some benefits:

- It is easy to create a live backup copy at any time. Because the replication process is asynchronous, replication can occur according to any schedule. The replicas do not have to be kept in sync with the source to work reliably.

- Adding a replica can increase uptime and reliability for the entire system. Primary control can switch over to the replica if maintenance is required or the source database is unavailable.

- Each replica provides another readable instance of the database. This allows data mining or analysis programs to query the replica without placing an additional load on the original source database.

- This architecture increases scalability and performance. Database reads and `SELECT` statements can be balanced between the servers, reducing latency.

- Third parties can obtain read-only access to a database via a replica, and no longer require access to the source. A replica database can be created on-demand when it is required and destroyed when it is no longer needed. This technique enhances security and ensures it is impossible to tamper with the original data.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. You must have at least two separate Linodes to configure MySQL source-replica replication. One Linode hosts the source database, while another node is necessary for the replica server.

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Configure Source-Replica Replication in MySQL

To configure source-replica replication, MySQL must be installed on two separate servers that can communicate with each other. These instructions are geared towards the Ubuntu distribution but are generally applicable for all Linux distributions. The process consists of the following steps:

1. Install MySQL.
1. Configure the MySQL Source Database.
1. Configure a New MySQL User for the Replica.
1. Prepare the MySQL Data for Replication.
1. Configure the MySQL Replica Database.
1. Import the Replicated MySQL Data and Activate Replication.

### Install MySQL

If MySQL is not already available on both Linodes, install it using the following steps:

1. Upgrade the Linodes.

        sudo apt-get update && sudo apt-get upgrade

1. Install the MySQL server and client applications on both the source and replica servers.

        sudo apt-get install mysql-server mysql-client -y

1. Configure the security options, including the root password, using the `mysql_secure_installation` command.

        sudo mysql_secure_installation

1. If you are using a firewall such as `ufw`, ensure it allows MySQL traffic through. Add the following rule to open port `3306` on the firewall.

        ufw allow mysql

### Configure the MySQL Source Database

To enable MySQL replication, edit some variables in the main MySQL configuration file. Make the following changes to the source database configuration.

1. Locate the main MySQL configuration file on the source database server. This file is usually found at `/etc/mysql/mysql.conf.d/mysqld.cnf`. However in earlier installations, it might be located at `/etc/my.cnf` or `/etc/mysql/my.cnf`. It could also be referenced from one of the files through an `includedir` directive.

1. Open the MySQL configuration file and change the `bind-address` to the IP address of the source server.

    {{< file "/etc/mysql/mysql.conf.d/mysqld.cnf" aconf >}}
bind-address  = <source_ip_address>
    {{< /file >}}

1. Uncomment or add the lines for `server-id` and `log-bin`. Set the `server-id` to `1`, and `log-bin` to `/var/log/mysql/mysql-bin.log`.

    {{< note respectIndent=false >}}
Ensure the `skip_networking` variable is not declared anywhere. Comment it out if it appears inside this file. To replicate a single database, add the line `binlog_do_db = <database_name>` to the file.
    {{< /note>}}

    {{< file "/etc/mysql/mysql.conf.d/mysqld.cnf" aconf >}}
server-id  = 1
log_bin  = /var/log/mysql/mysql-bin.log
    {{< /file >}}

1. Restart the MySQL service.

        sudo systemctl restart mysql

1. Verify the status of MySQL and ensure it is `active`.

        sudo systemctl status mysql

    {{< output >}}
mysql.service - MySQL Community Server
Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
Active: active (running) since Sun 2021-05-30 13:06:47 UTC; 1 day 1h ago
    {{< /output >}}

### Configure a New MySQL User for the Replica

You must create a new user on the source server to represent the replica. New users are created inside the MySQL shell.

1. Enter the MySQL shell.

        sudo mysql -u root -p

1. Add a user for the replica account using the MySQL `CREATE USER` syntax. The user name must consist of the name of the replica account, a `@` symbol, and the IP address of the replica server. Choose a more secure password for the account in place of `REPLICA_PASSWORD`.

        CREATE USER 'replica_account_name'@'replica_ip_address‘ IDENTIFIED WITH sha256_password BY 'REPLICA_PASSWORD';

    {{< note respectIndent=false >}}
To allow the replica to be able to connect from any address, specify the user as `'replica_account_name'@'%'`. The `%` symbol represents any address or domain. This provides extra flexibility at the expense of some security.
    {{< /note>}}

1. Grant replication rights to the remote replica user.

        GRANT REPLICATION SLAVE ON *.* TO 'replica_account_name'@'replica_ip_address';

### Prepare the MySQL Data for Replication

At this point, it is necessary to flush and lock the source database to stage the data for replication.

1. Remain inside the MySQL shell and flush the privileges to reload the grant tables without restarting the database.

        FLUSH PRIVILEGES;

1. Lock the database to freeze the database at a stable point from which to export the data. Keep the MySQL client running until you export the database. Entering any write command or exiting the MySQL shell releases the lock.

        FLUSH TABLES WITH READ LOCK;

    {{< note type="alert" respectIndent=false >}}
This command blocks all commits to the source database. Export the data before allowing the source to process any more commits. Otherwise, the replica database could become corrupted or inconsistent with the source database. Complete the two remaining steps in this section as soon as possible.
    {{< /note >}}

1. Verify the status of the database using the following command. This command displays the current log file along with the position of the last record in this file. Record this information because it is required to initiate replication on the replica later.

        SHOW MASTER STATUS;

    {{< output >}}
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000002 |     1301 |              |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
1 row in set (0.00 sec)
    {{< /output >}}

1. Using the Linux shell from a different console, export the database using the `mysqldump` tool. Select a memorable name for the destination file. Include the `–master-data` option to add information about the log file and the position of the current record to the log.

        sudo mysqldump -u root -p -–all-databases -–master-data > databasecopy.sql

    {{< note respectIndent=false >}}
To export a single database, include the `--opt <database_name>` option rather than `-–all-databases`.
    {{< /note >}}

1. Back in the original MySQL shell, unlock the source database.

        UNLOCK TABLES;

1. Exit the MySQL shell.

        QUIT;

1. Copy the exported database file to the replica database server, using `ftp`, `scp`, or another method of transferring the file.

        scp databasecopy.sql root@<replica_ip_address>

### Configure the MySQL Replica Database

The following configuration should be applied to the replica database configuration. To install MySQL on the replica server, see the [Install MySQL](#install-mysql) section.

1. Open the main MySQL file, usually located at `/etc/mysql/mysql.conf.d/mysqld.cnf`, and change the `bind-address` to match the IP address of the replica server.

    {{< file "/etc/mysql/mysql.conf.d/mysqld.cnf" aconf >}}
bind-address  = xx.xx.xx.xx
    {{< /file >}}

1. Uncomment or add the lines for `server-id` and `log-bin`. The `server-id` must be set to `2` on the replica, while the `log-bin` variable must be set to `/var/log/mysql/mysql-bin.log`. Add a variable for `relay-log` and set it to `/var/log/mysql/mysql-relay-bin.log`.

    {{< note respectIndent=false >}}
Ensure the `skip_networking` variable is not set anywhere inside this file. To replicate a single database, add the following directive to the file `binlog_do_db = database_name`. To configure more than one replica, number the `server-id` values in a sequentially increasing manner. For instance, a second replica would have a `server-id` of `3`.
    {{< /note >}}

    {{< file "/etc/mysql/mysql.conf.d/mysqld.cnf" aconf >}}
server-id        = 2
log_bin    = /var/log/mysql/mysql-bin.log
relay-log        = /var/log/mysql/mysql-relay-bin.log
    {{< /file >}}

1. Restart the MySQL service to incorporate the changes.

        sudo systemctl restart mysql

1. Verify the status of MySQL and ensure it is `active`.

        sudo systemctl status mysql

    {{< output >}}
mysql.service - MySQL Community Server
     Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset:>
     Active: active (running) since Mon 2021-05-31 16:29:48 UTC; 6s ago
    {{< /output >}}

1. (**Optional**) MySQL recommends using SSL to connect to the source for greater security. More information about configuring SSL can be found in the [MySQL SSL Documentation](https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html). The [*RSA Set-up Tool*](https://dev.mysql.com/doc/refman/8.0/en/mysql-ssl-rsa-setup.html) can be used to expedite this process.

### Import the Replicated MySQL Data and Activate Replication

The next step is to import the copy of the database data, set the replication source, and restart the replica database server. The replica should then be in sync and ready to use.

1. Enter the following command from the Linux shell to import the source database. Specify the database name used to export the data earlier.

        sudo mysql -u root -p < databasecopy.sql

1. Log in to the MySQL shell.

        sudo mysql -u root -p

1. Stop the replica.

        STOP REPLICA;

1. Enter the `CHANGE REPLICATION SOURCE` command, along with the following details. Substitute the IP address of the source database server in place of `source_ip_address`. For `SOURCE_USER` and `SOURCE_PASSWORD`, enter the replica's user name and password details from in the [Configure a new MySQL User for the Replica](#configure-a-new-mysql-user-for-the-replica) section. For the `SOURCE_LOG_FILE` and `SOURCE_LOG_POS` values, enter the information you recorded from the `SHOW MASTER STATUS;` command.

        CHANGE REPLICATION SOURCE TO SOURCE_HOST='source_ip_address',SOURCE_USER='replica_account_name', SOURCE_PASSWORD='REPLICA_PASSWORD', SOURCE_LOG_FILE='log_file_name', SOURCE_LOG_POS=log_position;

    {{< note respectIndent=false >}}
To use SSL for the connection, which MySQL recommends, add the attribute `SOURCE_SSL=1` to the command. More information about using SSL in a source-replica replication context can be found in the [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/replication-solutions-encrypted-connections.html).
    {{< /note>}}

1. Restart the replica.

        START REPLICA;

1. Verify the status of the replica. The replica should be waiting for events, and there should not be any `Last_IO_Error` or `Last_Error` events. The `Slave_SQL_Running_State` entry should state the replica has read the relay log.

        SHOW REPLICA STATUS\G

    {{< output >}}
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 178.79.153.39
                  Master_User: replica
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000006
          Read_Master_Log_Pos: 156
               Relay_Log_File: mysql-relay-bin.000006
                Relay_Log_Pos: 371
        Relay_Master_Log_File: mysql-bin.000006
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
..
                   Last_Errno: 0
                   Last_Error:
..
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 5bed9d10-c140-11eb-bc63-f23c92a2a6ac
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
    {{< /output >}}

## Test MySQL Source-Replica Replication

If the source database was already populated before the replica was instantiated, extra testing is required. In this case, verify the databases and tables that exist on the source are present on the replica after the data is imported. In the `SHOW REPLICA STATUS` display, the `Slave_SQL_Running_State` entry should read `Slave has read all relay log`.

To verify replication is occurring properly, create a new database or table on the source. After a few seconds, the new entry should be present on the replica. Validate the presence of the database using the `SHOW DATABASES;` command. To confirm the presence of a table, switch to the database using `USE databasename;`, and enter `SHOW TABLES;`. It is also a good idea to run the `SHOW REPLICA STATUS` command and scrutinize the output for any errors. The `Last_Error` and `Last_IO_Error` fields should be empty and the replica should remain connected.

## Learn More About MySQL Source-Replica Replication

The best source for information on source-replica replication is the official MySQL documentation. The [section on replication](https://dev.mysql.com/doc/refman/8.0/en/replication.html) contains more extensive information about the architecture and the installation process. The [MySQL Forums](https://forums.mysql.com/) might also be helpful.

---
slug: how-to-set-up-mariadb-clusters-with-galera-and-ubuntu
title: "How to Set up MariaDB Clusters with Galera and Ubuntu"
description: 'This guide explains how to install and configure MariaDB clusters on Ubuntu 22.04 LTS using Galera.'
og_description: 'This guide explains how to install and configure MariaDB clusters on Ubuntu 22.04 LTS using Galera.'
keywords: ['install Galera Ubuntu','MariaDB Galera Cluster','MariaDB Galera Ubuntu','configure database cluster Galera']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-03-22
modified_by:
  name: Linode
external_resources:
- '[MariaDB Galera Cluster](https://mariadb.com/kb/en/galera-cluster/)'
- '[MariaDB Galera Cluster Options](https://mariadb.com/kb/en/configuring-mariadb-galera-cluster/)'
- '[Getting Started with Galera Cluster Guide](https://mariadb.com/kb/en/getting-started-with-mariadb-galera-cluster/)'
- '[Galera Cluster Replication Fact Sheet](https://mariadb.com/kb/en/about-galera-replication/)'
- '[Galera Cluster Known Limitations](https://mariadb.com/kb/en/mariadb-galera-cluster-known-limitations/)'
---

Although MariaDB is a very reliable application, high-availability websites should consider database redundancy. Redundancy protects the database data from node failures and network problems. The [Galera Cluster extension for MariaDB](https://mariadb.com/kb/en/galera-cluster/) adds multi-master replication and redundancy, appearing as a unified database to the user. This guide provides some background on Galera Cluster and explains how to install and configure it on Ubuntu.

## What Is Galera Cluster?

Galera Cluster was developed by Codership as an open source extension for various database applications, including MariaDB and MySQL. It supports most common Linux distributions, including Ubuntu. Galera Cluster enables redundancy by synchronously replicating changes from one database instance to all other databases within the cluster. It is an excellent choice for high-availability applications with stringent uptime environments. If one server in the cluster goes down, database reads and writes can continue using the remaining servers. Galera Cluster also supports disaster and crash recovery.

Galera Cluster implements a multi-master architecture. This allows changes to be made on any server within the cluster. Any changes are immediately broadcast to the other servers. Galera Cluster uses *virtually synchronous* replication. This technique deploys certificates to speed up transactions while guaranteeing data integrity.

Changes are often made on one designated primary server. However, database read requests are typically distributed amongst all servers in the cluster. This allows for better throughput and lower latency. To maintain data consistency and allow for crash recovery, a cluster should contain an odd number of servers. For more information about Galera Cluster replication, see the [Galera Replication Fact Sheet](https://mariadb.com/kb/en/about-galera-replication/).

Galera Cluster uses the InnoDB storage engines. In addition to standard MariaDB port `3306`, Galera Cluster replication also uses ports `4567`, `4568`, and `4444`. Both TCP and UDP can be used.

Some of the main advantages of Galera Cluster are:

-   It is straightforward to install, configure, and use. The entire cluster acts as a single database.
-   Replication is synchronous and very fast without noticeable replication lag or transaction latency.
-   Nodes can reside in different data centers and across the globe.
-   Reads and writes can be performed on any node in the cluster.
-   It guarantees transaction integrity with no data loss. The same transaction order is enforced on each node.
-   Data consistency is enforced between all nodes. Conflicts are automatically detected, provided the cluster has at least three nodes.
-   Database reads are highly scalable.
-   Failed or inaccessible nodes are automatically dropped from the cluster.
-   New nodes can automatically join the cluster, provided they have the proper configuration.
-   Galera Cluster maintains membership control. Nodes can be added to, or removed from, the cluster.
-   Parallel replication happens on the row level.
-   There is thorough integration with the underlying database application, including the same look and feel.

Galera Cluster also has a few limitations. Each table should ideally have a primary key. If a table does not have a primary key, errors might occur during delete operations. Additionally, large transactions, such as `LOAD DATA` queries, can cause performance issues. Certain operations, including `LOCK TABLES` and `FLUSH TABLES WITH READ LOCK`, are unsupported. For more information, see the [List of Known Limitations](https://mariadb.com/kb/en/mariadb-galera-cluster-known-limitations/).

{{< note >}}
Cluster performance is constrained by the slowest node in the cluster. To avoid possible interoperability issues, use the same release of Ubuntu and MariaDB on each node in the cluster.
{{< /note >}}

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides. This guide requires at least two, preferably three, Ubuntu 22.04 LTS instances.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  **Optional**: If all servers are located inside the same data center, consider using private IP addresses in the Galera Cluster configuration files to enhance data security. Be sure to reboot all Linode instances after adding a private IP address.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

The commands, file contents, and other instructions provided throughout this guide may include placeholders. These are typically domain names, IP addresses, usernames, passwords, and other values that are unique to you. The table below identifies these placeholder values and explains what to replace them with:

| Placeholders: | Replace With: |
| -- | -- |
| `LINODE1_IP_ADDRESS` | The public (or private) IP address of your first Linode. |
| `LINODE2_IP_ADDRESS` | The public (or private) IP address of your second Linode. |
| `LINODE3_IP_ADDRESS` | The public (or private) IP address of your third Linode. |

## How to Install MariaDB with Galera Cluster

In earlier releases of MariaDB, Galera Cluster was installed as a separate package. However, since release 10.1, Galera Cluster is included in the MariaDB installation. To install MariaDB and Galera Cluster, follow these steps. These instructions are geared toward Ubuntu 22.04 LTS users, but are generally applicable for earlier versions and other Linux distributions. These steps must be implemented on all nodes in the cluster.

1.  Ensure the system is up to date and reboot if necessary:


    ```command
    sudo apt update -y && sudo apt upgrade -y
    ```

1.  Use `apt` to install the MariaDB server and client, including Galera Cluster:

    ```command
    sudo apt install mariadb-server mariadb-client -y
    ```

    {{< note >}}
    Depending on the specific release of MariaDB being used, it might be necessary to install the `galera-4` package. This includes the Galera write-set replication provider library. On many systems, this package is already installed.

    ```command
    sudo apt install galera-4
    ```
    {{< /note >}}

1.  MariaDB is activated upon installation. Use the `systemctl status` command to confirm if MariaDB is `active (running)`:

    ```command
    sudo systemctl status mariadb
    ```

    ```output
    ● mariadb.service - MariaDB 10.6.12 database server
         Loaded: loaded (/lib/systemd/system/mariadb.service; enabled; vendor preset: enabled)
         Active: active (running) since Thu 2023-09-07 17:04:13 EDT; 1min 29s ago
    ```

    Press the <kbd>Q</kbd> key to exit the `systemctl` output and return to the terminal prompt.

1.  Use `mysql_secure_installation` to improve database security:

    ```command
    sudo mysql_secure_installation
    ```

    The root password can be left unchanged. Unix socket authentication is also not required. However, you should answer `Y` to the following questions:

    -   `Remove anonymous users?`
    -   `Disallow root login remotely?`
    -   `Remove test database and access to it?`
    -   `Reload privilege tables now?`

1.  Repeat the steps in this section for every node in the cluster.

## How to Configure Galera Cluster

MariaDB and Galera manage intra-cluster communications using the settings in the `galera.cnf` file. This file must be configured on each node. With a few exceptions, most of the settings are the same on each node. Galera Cluster only supports the InnoDB storage engine for MariaDB. When configuring the file, pay close attention to the following settings:

-   The `wsrep_node_address` and `wsrep_node_name` settings must reflect the IP address and name of the local database server.
-   Choose a memorable name for the `wsrep_cluster_name` identifier. The cluster name must be the same on each node.
-   The `wsrep_cluster_address` setting must contain a list of all the IP addresses in the cluster. For a two-node setup, it must be set to `gcomm://node1-ip-address,node2-ip-address`. If there are three nodes, it would be `gcomm://node1-ip-address,node2-ip-address,node3-ip-address`, and so forth.

{{< note >}}
For increased security, private IP addresses can be used for `wsrep_cluster_address` and `wsrep_node_address`. Private IP addresses can only be used if all the Linodes in the cluster are part of the same data center. Do not mix public and private addresses together within the same cluster. Hosting the database servers in different data centers increases reliability, while private IP addresses increase security. Each administrator must consider the trade-offs between these two approaches.
{{< /note >}}

To configure each node within the Galera Cluster, follow these steps.

1.  On the first node in the cluster, create a `galera.cnf` file in the `/etc/mysql/conf.d` directory.

    ```command {title="Node #1"}
    sudo nano /etc/mysql/conf.d/galera.cnf
    ```

1.  Add the following contents to the file:

    ```file {title="/etc/mysql/conf.d/galera.cnf" hl_lines="12,13,19,20"}
    [mysqld]
    binlog_format=ROW
    default-storage-engine=innodb
    innodb_autoinc_lock_mode=2
    bind-address=0.0.0.0

    # Galera Provider Configuration
    wsrep_on=ON
    wsrep_provider=/usr/lib/galera/libgalera_smm.so

    # Cluster Configuration
    wsrep_cluster_name="galera_cluster"
    wsrep_cluster_address="gcomm://LINODE1_IP_ADDRESS,LINODE2_IP_ADDRESS,LINODE3_IP_ADDRESS"

    # Galera Synchronization Configuration
    wsrep_sst_method=rsync

    # Node Configuration
    wsrep_node_address="LINODE1_IP_ADDRESS"
    wsrep_node_name="primary"
    ```

    Make the following adjustments before saving:

    -   For the `wsrep_cluster_address` setting, change `LINODE1_IP_ADDRESS` to the IP address of the current Linode. Change `LINODE2_IP_ADDRESS` and `LINODE3_IP_ADDRESS` to the IP addresses of the other Linodes in the cluster, as applicable.
    -   Change the value of `wsrep_node_address` to the IP address of the first Linode. This must be the same address as `LINODE1_IP_ADDRESS`.
    -   Choose a unique cluster name for `wsrep_cluster_name`. This value must be the same for all servers in the cluster.
    -   Enter the name of the node for `wsrep_node_name`. This name must be unique within the cluster.
    -   Most of the other settings in the file must be set to the values shown in the sample file. See the [MariaDB Galera Cluster Documentation](https://mariadb.com/kb/en/configuring-mariadb-galera-cluster/) for more information on the various configuration options.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Repeat these steps on the next node on the cluster. Create `galera.cnf` on the second server in the cluster:

    ```command {title="Node #2"}
    sudo nano /etc/mysql/conf.d/galera.cnf
    ```

1.  Give the `galera.cnf` file on the next server the following contents:

    ```file {title="/etc/mysql/conf.d/galera.cnf" hl_lines="12,13,19,20"}
    [mysqld]
    binlog_format=ROW
    default-storage-engine=innodb
    innodb_autoinc_lock_mode=2
    bind-address=0.0.0.0

    # Galera Provider Configuration
    wsrep_on=ON
    wsrep_provider=/usr/lib/galera/libgalera_smm.so

    # Cluster Configuration
    wsrep_cluster_name="galera_cluster"
    wsrep_cluster_address="gcomm://LINODE1_IP_ADDRESS,LINODE2_IP_ADDRESS,LINODE3_IP_ADDRESS"

    # Galera Synchronization Configuration
    wsrep_sst_method=rsync

    # Node Configuration
    wsrep_node_address="LINODE2_IP_ADDRESS"
    wsrep_node_name="secondary"
    ```

    This should closely resemble the `galera.cnf` file on the first server. However, `wsrep_node_address` must contain the IP address of the second node, and choose a different node name for `wsrep_node_name`.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Repeat this section for any remaining nodes in the cluster. Ensure the value of `wsrep_node_name` is unique within the cluster and set `wsrep_node_address` to the IP address of the node. The rest of the file should remain the same.

## How to Enable MariaDB Replication Using Galera Cluster

When a `galera.cnf` file has been added to each node, cluster replication can be enabled. Replication does not begin automatically. It must be manually enabled. To begin replication, shut down the `mariadb` process on each node. Then use one of the nodes to initialize the cluster. Finally, restart the `mariadb` process on the remaining nodes. To enable MariaDB replication using Galera Cluster, follow these steps.

1.  Use `systemctl stop` to stop the MariaDB process on each node. Run the following command on every node in the cluster:

    ```command
    sudo systemctl stop mariadb
    ```

1.  On the node listed first within the `wsrep_cluster_address` variable, run the `galera_new_cluster` command:

    ```command {title="Node #1"}
    sudo galera_new_cluster
    ```

    This directive initializes the cluster based on the parameters in the local `galera.cnf` file. No output should be seen unless there is an error. If the command results in an error, ensure the `galera.cnf` file is configured correctly. This command also restarts the `mariadb` process, so `systemctl start` is not required.

1.  To confirm the cluster is correctly initialized, execute a SQL query to retrieve the value of `wsrep_cluster_size`:

    ```command {title="Node #1"}
    sudo mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
    ```

    The value should currently be set to `1`:

    ```output
    +--------------------+-------+
    | Variable_name      | Value |
    +--------------------+-------+
    | wsrep_cluster_size | 1     |
    +--------------------+-------+
    ```

1.  Restart the `mariadb` process on the second node using `systemctl`:

    ```command {title="Node #2"}
    sudo systemctl start mariadb
    ```

1.  Execute a SQL query to retrieve `wsrep_cluster_size` on either the first or second node:

    ```command {title="Node #1 or Node #2"}
    sudo mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
    ```

    The value should have increased to `2`:

    ```output
    +--------------------+-------+
    | Variable_name      | Value |
    +--------------------+-------+
    | wsrep_cluster_size | 2     |
    +--------------------+-------+
    ```

1.  Activate the `mariadb` process on any remaining nodes in the cluster. After activation, run the `sudo mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"` query again:

    ```command
    sudo systemctl start mariadb
    sudo mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_cluster_size'"
    ```

    The value should increment each time a new cluster member is activated. After MariaDB has been restarted on all nodes, the cluster is fully operational.

1.  To confirm all databases are synched together, access the MariaDB application and run the following SQL query:

    ```command
    sudo mysql -u root -p -e "SHOW STATUS LIKE 'wsrep_local_state_comment'"
    ```

    The output should display `Synced`:

    ```output
    +---------------------------+--------+
    | Variable_name             | Value  |
    +---------------------------+--------+
    | wsrep_local_state_comment | Synced |
    +---------------------------+--------+
    ```

## How to Validate the Galera Cluster Configuration

It is relatively easy to ensure the cluster is working correctly. Configure a database entity (e.g. a new database or table) on one node, then confirm if it is replicated to the other nodes. To confirm the cluster is operational, follow these steps.

1.  Connect to MariaDB on one of the nodes in the cluster:

    ```command
    sudo mysql -u root -p
    ```

1.  Create a new database inside MariaDB:

    ```command
    CREATE database test1;
    ```

1.  Switch to the new database and create a simple table that contains a primary key:

    ```command
    use test1;
    CREATE TABLE States ( Name varchar(25), Capital varchar(25), PRIMARY KEY (Name) );
    ```

1.  Use the `DESC` keyword to examine the structure of the table:

    ```command
    DESC States;
    ```

    ```output
    +---------+-------------+------+-----+---------+-------+
    | Field   | Type        | Null | Key | Default | Extra |
    +---------+-------------+------+-----+---------+-------+
    | Name    | varchar(25) | NO   | PRI | NULL    |       |
    | Capital | varchar(25) | YES  |     | NULL    |       |
    +---------+-------------+------+-----+---------+-------+
    2 rows in set (0.001 sec)
    ```

1.  Now access MariaDB on a different node in the cluster:

    ```command
    sudo mysql -u root -p
    ```

1.  List the databases:

    ```command
    SHOW databases;
    ```

    The `test1` database should be included even though it was created on a different node:

    ```output
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    | test1              |
    +--------------------+
    ```

1.  Switch to the `test1` database and display the description of the `States` table:

    ```command
    USE test1;
    DESC States;
    ```

    If it is equivalent to the table on the first server, replication is working as expected:

    ```output
    +---------+-------------+------+-----+---------+-------+
    | Field   | Type        | Null | Key | Default | Extra |
    +---------+-------------+------+-----+---------+-------+
    | Name    | varchar(25) | NO   | PRI | NULL    |       |
    | Capital | varchar(25) | YES  |     | NULL    |       |
    +---------+-------------+------+-----+---------+-------+
    ```

1.  Repeat the previous three steps on each node in the cluster and ensure the table definition is present on all nodes. When done, type `exit` and press <kbd>Enter</kbd> to exit the MariaDB shell and return to the standard terminal prompt.

A database, table, or row is replicated to all servers in the cluster no matter which node was used to create it. To further test the cluster, create a database or table on a second node and ensure it is still replicated properly to the other nodes.

## Configuring Firewall Settings for Galera Cluster

Although private IP addresses are more secure, a firewall is still recommended. To configure the `ufw` firewall to permit MariaDB replication, follow these steps.

1.  Configure the firewall to allow OpenSSH connections on both nodes:

    ```command
    sudo ufw allow OpenSSH
    ```

1.  On the first node, allow TCP and UDP connections on four designated ports from the second node in the cluster. Use the format `sudo ufw allow from REMOTE_IP_ADDRESS to any port 3306,4567,4568,4444 proto tcp` and `sudo ufw allow from REMOTE_IP_ADDRESS to any port 3306,4567,4568,4444 proto udp`. Specify the IP address of the second node in place of `REMOTE_IP_ADDRESS`. For instance, the following commands allow MariaDB Galera Cluster access from `192.168.132.33`:

    ```command
    sudo ufw allow from 192.168.132.33 to any port 3306,4567,4568,4444 proto tcp
    sudo ufw allow from 192.168.132.33 to any port 3306,4567,4568,4444 proto udp
    ```

1.  Add similar entries to the first node for any other nodes in the cluster. For instance, if the third node in the cluster is `192.168.132.34`, add the following entries:

    ```command
    sudo ufw allow from 192.168.132.34 to any port 3306,4567,4568,4444 proto tcp
    sudo ufw allow from 192.168.132.34 to any port 3306,4567,4568,4444 proto udp
    ```

1.  Repeat these steps on the remaining nodes in the cluster. Ensure you add entries allowing TCP and UDP connections to these ports from each of the other nodes in the cluster.

1.  After all nodes are configured, enable `ufw`:

    ```command
    sudo ufw enable
    ```

1.  Verify the status of `ufw` on all nodes:

    ```command
    sudo ufw status
    ```

1.  To ensure the firewall is working properly, make a database change on the first node and ensure it is replicated to the other nodes in the cluster.

## Conclusion

Galera Cluster enables data replication for MariaDB databases. It is designed as a multi-master replication system, so reads and writes can be performed on any server in the cluster. Galera Cluster is integrated into recent releases of MariaDB, so installing the MariaDB application also installs Galera Cluster. To configure Galera Cluster, add the cluster details to the `galera.cnf` file. For more information about Galera Cluster on MariaDB, consult the [official documentation](https://mariadb.com/kb/en/galera-cluster/).
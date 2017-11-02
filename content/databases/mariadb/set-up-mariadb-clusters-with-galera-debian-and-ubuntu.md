---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'A guide to configuring MariaDB database replication with Galera on Debian and Ubuntu distributions.'
keywords: ["mariadb", "mysql", "highavailability", "high availability", "HA", "cluster", "debian", "ubuntu"]
aliases: ['databases/mariadb/clustering-with-mariadb-and-galera/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-02-18
modified_by:
  name: James Stewart
published: 2015-02-18
title: Set Up MariaDB Clusters with Galera Debian and Ubuntu
external_resources:
 - '[MariaDB Foundation: Installing MariaDB Galera Cluster on Debian/Ubuntu](https://blog.mariadb.org/installing-mariadb-galera-cluster-on-debian-ubuntu/)'
---

# How to Configure Galera Clusters for MariaDB Replication

MariaDB replication with Galera adds redundancy for a site's database. With database replication, multiple servers act as a database cluster. Database clustering is particularly useful for high availability website configurations. This guide uses three separate Linodes to configure database replication, each with private IPv4 addresses on Debian and Ubuntu.

{{< note >}}
This guide assumes that your Linodes are each configured with a [Private IP Address](/docs/networking/remote-access#adding-private-ip-addresses).
{{< /note >}}

## Install Required Packages

1.  To install the required packages, first add the keys for the Galera repository by running:

		sudo apt-get install python-software-properties
		sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 0xcbcb082a1bb943db

2.  Add the repository for your distribution:

	* Debian Repository:

		  sudo add-apt-repository 'deb http://mirror3.layerjet.com/mariadb/repo/5.5/debian wheezy main'

	* Ubuntu Repository:

		  add-apt-repository 'deb http://mirror3.layerjet.com/mariadb/repo/5.5/ubuntu trusty main'

2.  Install MariaDB, Galera, and Rsync:

		sudo apt-get update && sudo apt-get install -y rsync galera mariadb-galera-server

## Configuring Galera

1.  Create the file `/etc/mysql/conf.d/galera.cnf` on each of the Linodes with the following content.  Replace the IP addresses in the `wsrep_cluster_address` section with the private IP addresses of each of the Linodes:

	{{< file-excerpt "/etc/mysql/conf.d/galera.cnf" aconf >}}
[mysqld]
#mysql settings
binlog_format=ROW
default-storage-engine=innodb
innodb_autoinc_lock_mode=2
query_cache_size=0
query_cache_type=0
bind-address=0.0.0.0
#galera settings
wsrep_provider=/usr/lib/galera/libgalera_smm.so
wsrep_cluster_name="my_wsrep_cluster"
wsrep_cluster_address="gcomm://192.168.1.1,192.168.1.2,192.168.1.3"
wsrep_sst_method=rsync

{{< /file-excerpt >}}


2.  Reboot both of your non-primary servers in the cluster to enable the new `galera.cnf` file settings.

3.  Stop the MariaDB service on each of your Linodes:

		sudo service mysql stop

4.  Restart the MariaDB service on the primary Linode, with the `--wsrep-new-cluster` flag:

		sudo service mysql start --wsrep-new-cluster

5.  Confirm that the cluster has started:

		mysql -u root -p -e 'SELECT VARIABLE_VALUE as "cluster size" FROM INFORMATION_SCHEMA.GLOBAL_STATUS WHERE VARIABLE_NAME="wsrep_cluster_size"'

	You should receive an output of the current cluster size:

		MariaDB [(none)]> SELECT VARIABLE_VALUE as "cluster size" FROM INFORMATION_SCHEMA.GLOBAL_STATUS WHERE VARIABLE_NAME="wsrep_cluster_size";
		+--------------+
		| cluster size |
		+--------------+
		| 1            |
		+--------------+
		1 row in set (0.00 sec)

6.  Start the MariaDB service on the other two Linodes.  Re-run the command from step 5 to ensure that each system has joined the cluster:

		sudo service mysql start

7.  To prevent repeated errors on startup, copy the `/etc/mysql/debian.cnf` file from your primary Linode in the cluster to each of your other Linodes, overwriting the existing copies.

8.  Reboot both of your secondary Linodes to apply the new `debian.cnf` settings.

## Testing database replication

1.  Log in to MariaDB on each of the Linodes:

		mysql -u root -p

1.  To test, create a database and insert a row on your primary Linode:

        create database test;
        create table test.flowers (`id` varchar(10));

2.  From each of the other servers, list the tables in your test database:

		show tables in test;

	You should receive an output of the database and row that you created in the previous step:

		MariaDB [(none)]> show tables in test;
		+----------------+
		| Tables_in_test |
		+----------------+
		| flowers        |
		+----------------+
		1 row in set (0.00 sec)

Congratulations, you have now configured a MariaDB cluster with Galera.

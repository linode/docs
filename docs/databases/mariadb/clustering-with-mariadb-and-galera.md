---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Configuring a MariaDB Cluster with Galera.'
keywords: 'mariadb,mysql,highavailability,high availability,HA,cluster,debian,ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, January 30th, 2015
modified_by:
  name: James Stewart
published: 'Thursday, January 30th, 2015'
title: Configuring a MariaDB Cluster with Galera
external_resources:
 - '[MariaDB Foundation: Installing MariaDB Galera Cluster on Debian/Ubuntu](https://blog.mariadb.org/installing-mariadb-galera-cluster-on-debian-ubuntu/)'
---

MariaDB replication with Galera adds redundancy for the database backend of your websites. With database replication, multiple servers act as a cluster. Database clustering is particularly useful for high availability website configurations. In this example, we will use three separate Linodes to configure database replication, each with private IPv4 addresses. This guide is written for Debian and Ubuntu.

{: .note}
>This guide assumes that your Linodes are each configured with a [Private IP Address](/docs/networking/remote-access#adding-private-ip-addresses).

##Install Required Packages

1.  To install the required packages, you will first need to add the keys for the Galera repository by running the following commands:

		sudo apt-get install python-software-properties
		sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 0xcbcb082a1bb943db

2.  Add the repository for your distribution:

	* Debian Repository:

		  sudo add-apt-repository 'deb http://mirror3.layerjet.com/mariadb/repo/5.5/debian wheezy main'

	* Ubuntu Repository:
	
		  add-apt-repository 'deb http://mirror3.layerjet.com/mariadb/repo/5.5/ubuntu trusty main'

2.  Install MariaDB, Galera, and Rsync:

		sudo apt-get update && sudo apt-get install -y rsync galera mariadb-galera-server

##Configuring Galera

1.  Create the file /etc/mysql/conf.d/galera.cnf on each of your Linodes with the following contents.  Replace the IP addresses in the "wsrep_cluster_address" section with the private IP addresses of each of your Linodes:

	{: .file-excerpt}
    /etc/mysql/conf.d/galera.cnf
    :   ~~~ cnf
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
    ~~~

2.  Reboot both of your non-primary servers in your cluster to enable the new debian.cnf file settings.

3.  Stop the MariaDB service on each of your Linodes:

		sudo service mysql stop

4.  Restart the MariaDB service on your primary Linode, with the --wsrep-new-cluster flag:

		sudo service mysql start --wsrep-new-cluster

5.  Confirm that the cluster has started by running the following command.  You should receive an output of the current cluster size:

		mysql -u root -p -e 'SELECT VARIABLE_VALUE as "cluster size" FROM INFORMATION_SCHEMA.GLOBAL_STATUS WHERE VARIABLE_NAME="wsrep_cluster_size"'

	You should see output similar to the following:

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

8.  Reboot both of your secondary Linodes to apply the new debian.cnf settings.

##Testing database replication

1.  Log in to MariaDB on each of your Linodes:

		mysql -u root -p

1.  Test by creating a database and inserting a row on your primary Linode:

        create database test;
        create table test.flowers (`id` varchar(10));

2.  From each of the other servers, run the following command.  You should receive an output of the datbase and row that you created in the previous step:

		show tables in test;

	You should see output simliar to the following:

		MariaDB [(none)]> show tables in test;
		+----------------+
		| Tables_in_test |
		+----------------+
		| flowers        |
		+----------------+
		1 row in set (0.00 sec)

Congratulations, you have now configured a MariaDB cluster with Galera.

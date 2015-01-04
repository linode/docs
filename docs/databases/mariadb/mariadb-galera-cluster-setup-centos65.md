---
title: Install MariaDB Galera Cluster with HAproxy and KeepAlived on CentOS 6.5
---

About article
-------------

Nowadays High Availability is the main concern of all companies included both small and large.
Minimum downtime per year, continous work of infrastructure etc. is the critical mission which all world want to accomplish.
There are difference approaches, one of them as large companies did, to buy expensive software and support from vendors.
But small companies could not go through these steps, the true power of Open Source comes up at these moments.
You can build your own High Availability solution using free but yet powerfull Open Source projects.
In this article we will show you how to achieve Database Clustering and Load Balancing.
We will use:

1. MariaDB Galera Cluster -
    MariaDB Galera Cluster is a synchronous multi-master cluster for MariaDB.
    It is available on Linux only, and only supports the XtraDB/InnoDB storage engines.
    See [What is MariaDB Galera Cluster?](https://mariadb.com/kb/en/mariadb/documentation/replication/galera/what-is-mariadb-galera-cluster/)

2. 
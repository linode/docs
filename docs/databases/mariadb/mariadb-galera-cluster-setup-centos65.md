---
title: Install MariaDB Galera Cluster with HAproxy and KeepAlived on CentOS 6.5
---

About article
-------------

Nowadays High Availability is the main concern of all companies included both small and large.Minimum downtime per year, continous work of infrastructure etc. is the critical mission which all world want to accomplish.There are difference approaches, one of them as large companies did, to buy expensive software and support from vendors.But small companies could not go through these steps, the true power of Open Source comes up at these moments.You can build your own High Availability solution using free but yet powerfull Open Source projects.In this article we will show you how to achieve Database Clustering and Load Balancing.
We will use:

1. **MariaDB Galera Cluster** -
    MariaDB Galera Cluster is a synchronous multi-master cluster for MariaDB.It is available on Linux only, and only supports the XtraDB/InnoDB storage engines.
    See [What is MariaDB Galera Cluster?](https://mariadb.com/kb/en/mariadb/documentation/replication/galera/what-is-mariadb-galera-cluster/)

2. **HAproxy** - HAProxy is a free, very fast and reliable solution offering high availability, load balancing, and proxying for TCP and HTTP-based applications
    See for further information [HAproxy official site](http://www.haproxy.org/#docs)

3. **KeepAlived** - Keepalived is a routing software written in C. The main goal of this project is to provide simple and robust facilities for loadbalancing and high-availability to Linux system and Linux based infrastructures
    See for further information [KeepAlived official site](http://www.keepalived.org/)
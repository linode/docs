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
    

General Architecture
--------------------

Before diving in the step-by-step guide let's to see what we want to accomplish at the end of tutorial:
    [![General Architecture Overview](/docs/assets/mrdclhakeep-general-overview.png)](/docs/assets/mrdclhakeep-general-overview.png)
    
As diagram shows there must be at least 3 CentOS 6.5 instance for MariaDB Galera Cluster setup, as well as 2 for HAproxy instance.
Total 5 CentOS 6.5 instance with all static local IPs and only 1 public IP for KeepAlived.
So another advantage of this architecture that it will reduce public ip usage to 1.

{: .note }
>
> For this tutorial we will not use public IP as it is an test environment, all CentOSs will use local ips.


Prerequisites
-------------

We need 5 instances of CentOS 6.5 installed as "basic server" (for us all servers are fresh installed).
Also you should give a static ips to all servers.
Here is sample IPs that you may give to your CentOS instances for testing this tutorial:

1. **Node1** - *192.168.1.71*
2. **Node2** - *192.168.1.81*
3. **Node3** - *192.168.1.91*
4. **HAproxy1** - *192.168.1.88*
5. **HAproxy2** - *192.168.1.89*

Also keep in mind that we need another IP for KeepAlived that will act as Virtual IP for HAproxy intances.


Installing and Configuring MariaDB Cluster
------------------------------------------

Installing and Configuring HAproxy
----------------------------------

Installing and Configuring KeepAlived
-------------------------------------

Testing Environment
-------------------


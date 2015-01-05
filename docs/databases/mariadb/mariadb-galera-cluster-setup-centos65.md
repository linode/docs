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

We need 5 instances of CentOS 6.5 (x86_64) installed as **"Basic Server"** (for us all servers are fresh installed).
Also you should give a static ips to all servers.
Here is sample IPs that you may give to your CentOS instances for testing this tutorial:

1. **Node1** (512 MB RAM, 1 CPU VM)- *192.168.1.71*
2. **Node2** (512 MB RAM, 1 CPU VM)- *192.168.1.81*
3. **Node3** (512 MB RAM, 1 CPU VM)- *192.168.1.91*
4. **HAproxy1** - *192.168.1.33*
5. **HAproxy2** - *192.168.1.88*

Also keep in mind that we need another IP for KeepAlived that will act as Virtual IP for HAproxy intances.


Installing and Configuring MariaDB Cluster
------------------------------------------

1. Installing and Running MariaDB Cluster:

The easy way to install is through official yum repo. You should activate MariaDB repo.
Create **MariaDB.repo** file on **'/etc/yum.repos.d/'** directory on all **3 Nodes**:
Add following lines to MariaDB.repo file:

        [mariadb]
        name = MariaDB
        baseurl = http://yum.mariadb.org/10.0/centos6-amd64
        gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
        gpgcheck=1


Save all 3 files on all 3 Nodes. Then run:

        [root@node1 ~]# yum install MariaDB-Galera-server MariaDB-client galera
        [root@node2 ~]# yum install MariaDB-Galera-server MariaDB-client galera
        [root@node3 ~]# yum install MariaDB-Galera-server MariaDB-client galera

All needed packages and dependencies will be resolved automatically and at this point you should be able to start newly installed MariaDBs:

        [root@node1 ~]# service mysql start
        [root@node1 ~]# mysql_secure_installation
        
        [root@node2 ~]# service mysql start
        [root@node2 ~]# mysql_secure_installation
        
        [root@node3 ~]# service mysql start
        [root@node3 ~]# mysql_secure_installation
        
At this point, we have 3 running MariaDB Galera Cluster instances.

2. Installing Several other needed packages:

We need several other packages from epel repo, such as rsync for MaridDB SST [See Documentation](https://mariadb.com/kb/en/mariadb/documentation/replication/galera/galera-cluster-system-variables/#wsrep_sst_method)
That's why we must activate epel repo on all 3 Nodes:

        [root@node1 ~]# yum install wget
        [root@node1 ~]# wget http://mirror.premi.st/epel/6/x86_64/epel-release-6-8.noarch.rpm
        [root@node1 ~]# yum install epel-release-6-8.noarch.rpm
        [root@node1 ~]# yum install socat
        [root@node1 ~]# yum install rsync
        
        
        [root@node2 ~]# yum install wget
        [root@node2 ~]# wget http://mirror.premi.st/epel/6/x86_64/epel-release-6-8.noarch.rpm
        [root@node2 ~]# yum install epel-release-6-8.noarch.rpm
        [root@node2 ~]# yum install socat
        [root@node2 ~]# yum install rsync
        
        
        [root@node3 ~]# yum install wget
        [root@node3 ~]# wget http://mirror.premi.st/epel/6/x86_64/epel-release-6-8.noarch.rpm
        [root@node3 ~]# yum install epel-release-6-8.noarch.rpm
        [root@node3 ~]# yum install socat
        [root@node3 ~]# yum install rsync

3. server.cnf configuration file for MariaDB nodes:

Now we must edit all 3 nodes **server.cnf** (default location is '/etc/my.cnf.d/server.cnf') file to reflect our needs.
Following content is the **same** on all 3 nodes:

        [mysqld]

        # General #
        datadir                       = /var/lib/mysql
        socket                        = /var/lib/mysql/mysql.sock
        default_storage_engine        = InnoDB
        lower_case_table_names        = 1


        # MyISAM #
        key_buffer_size                = 8M
        myisam_recover                 = FORCE,BACKUP


        # SAFETY #
        max_allowed_packet             = 16M
        max_connect_errors             = 1000000
        skip_name_resolve
        sysdate_is_now                 = 1
        innodb                         = FORCE
        thread_stack                   = 262144
        back_log                       = 2048
        performance_schema             = OFF
        skip_show_database
        
        # Binary Logging #
        log_bin                        = /var/lib/mysql/data/mysql-bin
        log_bin_index                  = /var/lib/mysql/data/mysql-bin
        expire_logs_days               = 14
        sync_binlog                    = 1
        binlog_format                  = row
        
        # CACHES AND LIMITS #
        tmp_table_size                 = 16M
        max_heap_table_size            = 16M
        query_cache_type               = 0
        query_cache_size               = 0
        query_cache_limit              = 0
        max_connections                = 10000
        thread_cache_size              = 500
        open-files-limit               = 65535
        table_definition_cache         = 7000
        table_open_cache               = 7000
        
        # InnoDB Related #

        innodb_log_files_in_group      = 2
        innodb_autoinc_lock_mode       =2
        innodb_locks_unsafe_for_binlog =1
        innodb_log_file_size           =100M
        innodb_file_per_table
        innodb_flush_log_at_trx_commit =2
        innodb_buffer_pool_size        =150M

And now we provide per Node settings for configuration file:

**Node1**

        #
        # * Galera-related settings
        #
        [galera]

        wsrep_provider=/usr/lib64/galera/libgalera_smm.so
        wsrep_cluster_address="gcomm://192.168.1.71,192.168.1.81,192.168.1.91"
        wsrep_cluster_name='TestingCluster'
        wsrep_node_address='192.168.1.71'
        wsrep_node_name='node1'
        wsrep_sst_method=rsync
        wsrep_sst_auth=sstuser:12345
        bind-address=0.0.0.0


**Node2**

        #
        # * Galera-related settings
        #
        [galera]
    
        wsrep_provider=/usr/lib64/galera/libgalera_smm.so
        wsrep_cluster_address="gcomm://192.168.1.71,192.168.1.81,192.168.1.91"
        wsrep_cluster_name='TestingCluster'
        wsrep_node_address='192.168.1.81'
        wsrep_node_name='node1'
        wsrep_sst_method=rsync
        wsrep_sst_auth=sstuser:12345
        bind-address=0.0.0.0


**Node3**

        #
        # * Galera-related settings
        #
        [galera]
    
        wsrep_provider=/usr/lib64/galera/libgalera_smm.so
        wsrep_cluster_address="gcomm://192.168.1.71,192.168.1.81,192.168.1.91"
        wsrep_cluster_name='TestingCluster'
        wsrep_node_address='192.168.1.91'
        wsrep_node_name='node1'
        wsrep_sst_method=rsync
        wsrep_sst_auth=sstuser:12345
        bind-address=0.0.0.0


Save file on all 3 nodes and exit file editing.

Afer editing configuration files. On all 3 Nodes you must create *wsrep_sst_auth* user as mentioned in server.cnf file its name is 'sstuser'

        [root@node1 ~]# mysql -u root -p
        MariaDB [(none)]> create user 'sstuser'@'%' identified by '12345';
        MariaDB [(none)]> grant all on *.* to 'sstuser'@'%'
        
        [root@node2 ~]# mysql -u root -p
        MariaDB [(none)]> create user 'sstuser'@'%' identified by '12345';
        MariaDB [(none)]> grant all on *.* to 'sstuser'@'%'
        
        [root@node3 ~]# mysql -u root -p
        MariaDB [(none)]> create user 'sstuser'@'%' identified by '12345';
        MariaDB [(none)]> grant all on *.* to 'sstuser'@'%'
        

4. Creating directory for binary logs:

On all 3 Nodes apply following commands. Our binary logs will reside in **/var/lib/mysql/data**, if it not suitable with your installation change this path in server.cnf file too.

        [root@node1 ~]# cd /var/lib/mysql/
        [root@node1 ~]# mkdir data
        [root@node1 ~]# chown -R mysql:mysql data/
        
        [root@node2 ~]# cd /var/lib/mysql/
        [root@node2 ~]# mkdir data
        [root@node2 ~]# chown -R mysql:mysql data/
        
        [root@node3 ~]# cd /var/lib/mysql/
        [root@node3 ~]# mkdir data
        [root@node3 ~]# chown -R mysql:mysql data/


5. Disable SElinux or set to permissive mode on all 3 Nodes. As SElinux prevents Galera to start:
        
        [root@node1 ~]# setenforce 0
        [root@node2 ~]# setenforce 0
        [root@node3 ~]# setenforce 0


6. **'/etc/hosts'** file contents for MariaDB Nodes:

    **Node1**
    
        [root@node1 ~]# cat /etc/hosts
        127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
        127.0.0.1   node1.localdomain node1
        ::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
    
        192.168.1.71 localhost localhost.localdomain node1.localdomain node1
        192.168.1.81 node2
        192.168.1.91 node3
    
        192.168.1.33 haproxy1
        192.168.1.88 haproxy2

    
    **Node2**
    
        [root@node2 ~]# cat /etc/hosts
        127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
        ::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
        127.0.0.1   node2.localdomain node2
        192.168.1.81 localhost localhost.localdomain node2.localdomain node2
        192.168.1.71 node1
        192.168.1.91 node3
        
        192.168.1.33 haproxy1
        192.168.1.88 haproxy2

    
    **Node3**
    
        [root@node3 ~]# cat /etc/hosts
        127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
        ::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
        127.0.0.1   node3.localdomain node3
        192.168.1.91 localhost localhost.localdomain node3
        192.168.1.71 node1
        192.168.1.81 node2

        192.168.1.33 haproxy1
        192.168.1.88 haproxy2


7. Iptables settings related to MariaDB nodes:

    **Node1**
        
        Portion of /etc/sysconfig/iptables file:
        
        -A INPUT -i eth0 -p tcp -m tcp --source node2 --dport 4567 -j ACCEPT 
        -A INPUT -i eth0 -p tcp -m tcp --source node2 --dport 4568 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node2 --dport 4444 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node2 --dport 3306 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source node3 --dport 4567 -j ACCEPT 
        -A INPUT -i eth0 -p tcp -m tcp --source node3 --dport 4568 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node3 --dport 4444 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node3 --dport 3306 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy1 --dport 9200 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy2 --dport 9200 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy1 --dport 3306 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy2 --dport 3306 -j ACCEPT
        
        
    **Node2**
        
        Portion of /etc/sysconfig/iptables file:
        
        -A INPUT -i eth0 -p tcp -m tcp --source node1 --dport 4567 -j ACCEPT 
        -A INPUT -i eth0 -p tcp -m tcp --source node1 --dport 4568 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node1 --dport 4444 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node1 --dport 3306 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node3 --dport 4567 -j ACCEPT 
        -A INPUT -i eth0 -p tcp -m tcp --source node3 --dport 4568 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node3 --dport 4444 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node3 --dport 3306 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy1 --dport 9200 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy2 --dport 9200 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy1 --dport 3306 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy2 --dport 3306 -j ACCEPT

    
    **Node3**
        
        Portion of /etc/sysconfig/iptables file:
        
        -A INPUT -i eth0 -p tcp -m tcp --source node2 --dport 4567 -j ACCEPT 
        -A INPUT -i eth0 -p tcp -m tcp --source node2 --dport 4568 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node2 --dport 4444 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node2 --dport 3306 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node1 --dport 4567 -j ACCEPT 
        -A INPUT -i eth0 -p tcp -m tcp --source node1 --dport 4568 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node1 --dport 4444 -j ACCEPT  
        -A INPUT -i eth0 -p tcp -m tcp --source node1 --dport 3306 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy1 --dport 9200 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy2 --dport 9200 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy1 --dport 3306 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m tcp --source haproxy2 --dport 3306 -j ACCEPT
        

After applying firewall settings make sure to restart iptables service for reflecting changes.


Bootstrapping(starting) Cluster
-------------------------------

As we have 3 Nodes, one of them must be in some words, the "Head" node, at first time we must choose one of Nodes as start point.
For us this is Node1.
Stop Node1 and run following command:

        
        [root@node1 ~]# service mysql stop
        [root@node1 ~]# service mysql bootstrap
        Bootstrapping the clusterStarting MySQL.. SUCCESS! 
        
Then you must start other 2 nodes as usual:
        
        [root@node2 ~]# service mysql start
        Starting MySQL...SST in progress, setting sleep higher. SUCCESS!
        
        [root@node3 ~]# service mysql start
        Starting MySQL...SST in progress, setting sleep higher. SUCCESS!

        
After success messages login to MariaDB Node1 and run:
        
        MariaDB [(none)]> show status like 'wsrep%';

The important part of output is:

        | wsrep_cluster_conf_id        | 5                                                     |
        | wsrep_cluster_size           | 3                                                     |
        | wsrep_connected              | ON                                                    |
        | wsrep_ready                  | ON                                                    |
        | wsrep_thread_count           | 2       

As you see the cluster size is 3 and it means all 3 Nodes connected and working. Also you can see from output that Cluster is ready for accepting connection.
Let's create database from Node3 and test its creation from other Nodes:

        [root@node3 ~]# mysql -u root -p
        MariaDB [(none)]> create database linode_test;
        Query OK, 1 row affected (0.10 sec)
    
        [root@node2 ~]# mysql -u root -p
        MariaDB [(none)]> show databases like 'lin%';
        +-----------------+
        | Database (lin%) |
        +-----------------+
        | linode_test     |
        +-----------------+
        1 row in set (0.00 sec)
        
        [root@node1 ~]# mysql -u root -p
        MariaDB [(none)]> show databases like 'lin%';
        +-----------------+
        | Database (lin%) |
        +-----------------+
        | linode_test     |
        +-----------------+
        1 row in set (0.00 sec)



Configuring Clustercheck script for cluster health check  
--------------------------------------------------------

[Percona ClusterCheck](https://github.com/olafz/percona-clustercheck) is simple script o make a proxy (i.e HAProxy) capable of monitoring Percona XtraDB Cluster nodes properly.
Also it is originally mentioned for Percona XTRAdb Cluster it works with MariaDB Galera Cluster too. It is just naming taste.

You should setup this script in all 3 Nodes

Installing and Configuring HAproxy
----------------------------------

Installing and Configuring KeepAlived
-------------------------------------

Testing Environment
-------------------


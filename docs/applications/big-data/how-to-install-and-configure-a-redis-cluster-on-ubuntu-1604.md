---
author:
  name: Sam Foo
  email: docs@linode.com
description: 'Learn to set up a Redis cluster using three Linode servers and promoting a slave to become a master node with this guide.'
keywords: ["redis cluster installation", "data store", "cache", "sharding"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/big-data/redis-cluster']
modified: 2017-08-14
modified_by:
  name: Linode
published: 2017-08-14
title: 'How to Install and Configure a Redis Cluster on Ubuntu 16.04'
external_resources:
 - '[Redis Official Website](https://redis.io/)'
 - '[Install and Configure Redis on CentOS 7](/docs/databases/redis/install-and-configure-redis-on-centos-7)'
---

![Redis_banner](/docs/assets/Redis_Cluster.jpg)

Redis clusters have grown to be a popular tool for caches, queues, and more because of its potential for scalability and speed. This guide aims to create a cluster using three Linodes to demonstrate sharding. Then, you will promote a slave to a master - insurance, in the event of a failure.

Prior to starting, we recommend you familiarize yourself with the following:

 * [Firewall settings using iptables or ufw](/docs/security/firewalls/configure-firewall-with-ufw)
 * [Master/Slave Replication ](/docs/databases/redis/deploy-redis-on-ubuntu-or-debian)

## Install Redis on Each Linode
Depending on your version of Linux, it may be possible to install Redis through a package manager. Only Redis 3.0 and above supports clustering. The steps below are for installation of the latest stable branch of Redis.

1.  Install the dependencies:

        sudo apt-get update && sudo apt-get upgrade
        sudo apt install make gcc libc6-dev tcl

    {{< note >}}
Alternatively, you could use `build-essential` to load the dependencies for Redis.
{{< /note >}}

2.  From the documentation, download the current stable branch, then extract:

        wget http://download.redis.io/redis-stable.tar.gz
        tar xvzf redis-stable.tar.gz
        cd redis-stable
        sudo make install

3.  Ensure the installation is successful by running:

        make test

    If installation is successful, the console will output:

    >\o/ All tests passed without errors!

4.  Repeat installation for each and every server that will be part of the cluster.

## Configure Master and Slave Nodes
This guide manually connects each master and slave across three Linodes. Consider using [tmux](https://github.com/tmux/tmux) for management of multiple terminal windows.

Although the official documentation recommends creating six nodes, this guide will use the minimum of three nodes with the following topology:

![Figure demonstrating master-slave across three servers](/docs/assets/redis_cluster_3_nodes.png)

This setup uses three Linodes running two instances of Redis server per Linode. You must ensure each host is independent, and then consider using additional nodes if there is a need to maintain uptime requirements.

1.  SSH into **server 1**. Navigate to `redis-stable/` then copy `redis.conf`. Configuration files in this guide are named consistent with the figure above:

        cp redis.conf c_slave.conf
        mv redis.conf a_master.conf

2. In `a_master.conf`, comment the `bind` directive and enable cluster mode. The ports in this example will range from 6379 to 6381.

   {{< file "/redis-stable/a_master.conf" >}}
# bind 127.0.0.1
protected-mode no
port 6379
pidfile /var/run/redis_6379.pid
cluster-enabled yes
cluster-config-file nodes-6379.conf
cluster-node-timeout 15000

{{< /file >}}


   {{< caution >}}
A node in the Redis cluster requires a defined port and a port higher than 10000. In this instance, TCP ports 6379 and 16379 are both required to be open. Ensure iptables or ufw is configured properly.
{{< /caution >}}

3. In `c_slave.conf`, the configuration will be similar except for an update of the port number. `redis-trib.rb` will be used later to configure this into a slave for the appropriate master, rather than the `slaveof` directive.

   {{< file "/redis-stable/c_slave.conf" >}}
# bind 127.00.1
protected-mode no
port 6381
pidfile /var/run/redis_6381.pid
cluster-enabled yes
cluster-config-file nodes-6381.conf
cluster-node-timeout 15000

{{< /file >}}


4. Repeat this process across the remaining two Linodes, taking care to specify the port numbers for all master slave pairs.

        | Server | Master | Slave |
    |:-------|:-------|:------|
    |    1   |  6379  |  6381 |
    |    2   |  6380  |  6379 |
    |    3   |  6381  |  6380 |

## Connect Master and Slave
Master/slave replication can be achieved across three nodes by running two instances of a Redis server on each node.

1. SSH into **server 1** and start the two Redis instances.

        redis-server redis-stable/a_master.conf
        redis-server redis-stable/c_slave.conf

2. Substitute `a_master.conf` and `c_slave.conf` with the appropriate configuration file for the remaining two servers. All the master nodes should be starting in cluster mode.

   {{< file "Server 1" >}}
_._
                _.-``__ ''-._
           _.-``    `.  `_.  ''-._           Redis 4.0.1 (00000000/0) 64 bit
       .-`` .-```.  ```\/    _.,_ ''-._
      (    '      ,       .-`  | `,    )     Running in cluster mode
      |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
      |    `-._   `._    /     _.-'    |     PID: 10352
      `-._    `-._  `-./  _.-'    _.-'
      |`-._`-._    `-.__.-'    _.-'_.-'|
      |    `-._`-._        _.-'_.-'    |           http://redis.io
       `-._    `-._`-.__.-'_.-'    _.-'
      |`-._`-._    `-.__.-'    _.-'_.-'|
      |    `-._`-._        _.-'_.-'    |
      `-._    `-._`-.__.-'_.-'    _.-'
          `-._    `-.__.-'    _.-'
              `-._        _.-'
                  `-.__.-'

{{< /file >}}


## Create Cluster Using Built-In Ruby Script
At this point, each Linode hosts two independent master nodes. The Redis installation comes with a Ruby script located in `~/redis-stable/src/` that can help create and manage a cluster.

1.  If Ruby is not already installed, it can be found in your package manager:

        sudo apt install ruby

2.  Install the Redis gem:

        gem install redis

3.  Navigate to the source directory to run the script.

        redis-stable/src/redis-trib.rb create ip.of.server1:6379 ip.of.server2:6380 ip.of.server3:6381

4.  Accept the configuration with three masters. Successful set up of the cluster will return the following message:

        >>>Creating cluster
        >>>Performing hash slots allocation on 3 nodes...
        Can I set the above configuration? (type 'yes' to accept): yes
        >>> Nodes configuration updated
        >>> Assign a different config epoch to each node
        >>> Sending CLUSTER MEET messages to join the cluster
        Waiting for the cluster to join.
        [OK] All nodes agree about slots configuration.
        >>> Check for open slots...
        >>> Check slots coverage...
        [OK] All 16384 slots covered.

5.  See all the current nodes connected to the cluster by using the `redis-cli` tool. The `-c` flag specifies connection to the cluster.

        redis-cli -c -h ip.of.server1 -p 6379
        ip.of.server1>CLUSTER NODES

    This will return a list of nodes currently in the cluster identified by their i.d. and slaves - if any exist. To leave the interface, click on `exit`.

        ip.of.server1>exit

    {{< note >}}
Redis keywords are not case sensitive. However, they are written as all capitals in this guide for clarity.
{{< /note >}}

## Add Slaves
The `redis-trib` tool can also be used to add new nodes to the cluster. Using the remaining three nodes, you can manually add them to the selected master.

1.  Connect the slave to a given master using `add-note` and a specified `master_id`.

        ./redis-trib.rb add-node --slave --master-id [master_id_c] ip.of.server1:6381 ip.of.server3:6381

    The resulting output should be:

        >>> Adding node ip.of.server1:6381 to cluster ip.of.server3:6381
        >>> Performing Cluster Check (using node ip.of.server3:6381)
        M: [master_id_c] ip.of.server3:6381
           slots:10923-16383 (5461 slots) master
           0 additional replica(s)
        M: [master_id_a] ip.of.server1:6379
           slots:0-5460 (5461 slots) master
           0 additional replica(s)
        M: [master_id_b] ip.of.server2:6380
           slots:5461-10922 (5462 slots) master
           0 additional replica(s)
        [OK] All nodes agree about slots configuration.
        >>> Check for open slots...
        >>> Check slots coverage...
        [OK] All 16384 slots covered.
        >>> Send CLUSTER MEET to node ip.of.server1:6381 to make it join the cluster.
        Waiting for the cluster to join...
        >>> Configure node as replica of ip.of.server3:6381.

2.  Repeat for the remaining two nodes.

        ./redis-trib.rb add-node --slave --master-id [master_id_a] ip.of.server2:6379 ip.of.server1:6379
        ./redis-trib.rb add-node --slave --master-id [master_id_b] ip.of.server3:6380 ip.of.server2:6380

## Add Key-Value Pairs and Sharding
The command line interface offers a way to `SET` and `GET` keys, in addition to returning information about the cluster. On your local computer, you can connect to any of the master nodes and explore some properties of a Redis cluster.

1.  Repeat the installation of Redis on your local computer, if needed. Check that firewall settings allow communicating with the master nodes.

        redis-cli -c -h ip.of.server1 -p 6379

2.  Use the `CLUSTER INFO` command to see information about the state of the cluster such as size, hash slots, and failures, if any.

        ip.of.server1:6379>CLUSTER INFO
        cluster_state:ok
        cluster_slots_assigned:16384
        cluster_slots_ok:16384
        cluster_slots_pfail:0
        cluster_slots_fail:0
        cluster_known_nodes:6
        cluster_size:3
        cluster_current_epoch:6
        cluster_my_epoch:1
        cluster_stats_messages_ping_sent:8375
        cluster_stats_messages_pong_sent:9028
        cluster_stats_messages_meet_sent:1
        cluster_stats_messages_sent:17404
        cluster_stats_messages_ping_received:9022
        cluster_stats_messages_pong_received:8376
        cluster_stats_messages_meet_received:6
        cluster_stats_messages_received:17404

3.  To check master/slave replication, `INFO replication` returns information about the slave.

        ip.of.server1:6379>INFO replication
        role:master
        connected_slaves:1
        slave0:ip=ip.of.server1,port=6381,state=online,offset=213355,lag=1
        master_replid:cd2e27cba094f2e7ed38b0313dcd6a979ab29b7a
        master_replid2:0000000000000000000000000000000000000000
        master_repl_offset:213355
        second_repl_offset:-1
        repl_backlog_active:1
        repl_backlog_size:1048576
        repl_backlog_first_byte_offset:197313
        repl_backlog_histlen:16043

4.  To demonstrate sharding, you can set a few example key-value pairs. Setting a key will redirect the value to a hash slot among the three master nodes.

        ip.of.server1:6379> SET John Adams
        -> Redirected to slot [6852] located at ip.of.server2:6380
        OK
        ip.of.server2:6380> SET James Madison
        -> Redirected to slot [2237] located at ip.of.server1:6379
        OK
        ip.of.server1:6379> SET Andrew Jackson
        -> Redirected to slot [15768] located at ip.of.server3:6381
        OK
        ip.of.server3:6381> GET John
        -> Redirected to slot [6852] located at ip.of.server2:6380
        "Adams"
        ip.of.server2:6380>

## Promote Slave to Master
Based on the current topology, the cluster will remain online if one of the Linodes fails. At that point, you can expect a slave to promote into a master with the data replicated.

![Figure demonstrating server3 failure](/docs/assets/redis_cluster_server_fail.png)

1.  Add a key value pair.

        ip.of.server1:6379> SET foo bar
        -> Redirected to slot [12182] located at ip.of.server3:6381
        OK
        ip.of.server3:6381> GET foo
        "bar"

    The key `foo` is added to a master on **server 3** and replicated to a slave on **server 1**.

2.  In the event server 3 is down, the slave on **server 1** will become a master and the cluster will remain online.

        ip.of.server1:6379> CLUSTER NODES
        [slave_id_b] ip.of.server3:6380@16380 slave,fail [master_id_b] 1502722149010 1502722147000 6 connected
        [slave_id_a] ip.of.server2:6379@16379 slave [master_id_a] 0 1502722242000 5 connected
        [slave_id_c_promoted] ip.of.server1:6381@16381 master - 0 1502722241651 7 connected 10923-16383
        [master_id_b] ip.of.server2:6380@16380 master - 0 1502722242654 2 connected 5461-10922
        [master_id_c] ip.of.server3:6381@16381 master,fail - 1502722149010 1502722145402 3 connected
        [master_id_a] ip.of.server1:6379@16379 myself,master - 0 1502722241000 1 connected 0-5460

3.  A key that was previously located in a hash slot on **server 3**, the key value pair is now stored on **server 1**.

        ip.of.server1:6379> GET foo
        -> Redirected to slot [12182] located at ip.of.server1:6381
        "bar"

Remember to ensure [firewall settings are adequate for all Redis instances](http://antirez.com/news/96). There is supplemental functionality, such as adding additional nodes, creating multiple slaves, or resharding, which are beyond the scope of this document. For more guidance, consult the official Redis documentation for how to implement these features.




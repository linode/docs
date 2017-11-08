---
author:
  name: Kulshekhar Kabra
  email: docs@linode.com
description: 'This guide shows you how to set up a highly available PostgreSQL cluster using Patroni and HA Proxy on your Linode.'
keywords: ["postgresql", "clusters", "databases"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-09-19
modified_by:
  name: Kulshekhar Kabra
published: 2017-09-19
title: Create a Highly Available PostgreSQL Cluster Using Patroni and HAProxy
external_resources:
 - '[PostgreSQL Documentation](https://www.postgresql.org/docs/)'
 - '[Patroni Repository](https://github.com/zalando/patroni)'
 - '[etcd Documentation](https://coreos.com/etcd/docs/latest/)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

![Create a Highly Available PostgreSQL Cluster Using Patroni and HAProxy](/docs/assets/postgresql-cluster-patroni.jpg "Create a Highly Available PostgreSQL Cluster Using Patroni and HAProxy")

## What is PostgreSQL?

[PostgreSQL](https://www.postgresql.org) (Postgres) is an open-source, fully [ACID compliant](https://en.wikipedia.org/wiki/ACID) relational database that runs on all major operating systems. While Postgres is a highly versatile, feature-rich, and powerful database, it doesn't have a built-in solution for high availability.

This guide shows you how to create a highly available Postgres cluster of three servers using [Patroni](https://github.com/zalando/patroni).

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and familiarize yourself with SSH and connecting to your linode.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account and harden SSH access.

3.  Update your system:

        sudo apt update && sudo apt upgrade

4.  Create five Linodes on your account, all within the same datacenter. Take note of each Linode's [private IP address](/docs/networking/remote-access/#adding-private-ip-addresses)

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install PostgreSQL

Install Postgres on three Linodes in your setup. Because the configuration in this guide uses private IP addresses to communicate between Linodes in the same datacenter, this setup may not meet certain [Highly Available requirements](https://docs.oracle.com/cd/B28359_01/server.111/b28281/hadesign.htm#g1007388). For more information about private IPs, visit our [Remote Access guide](/docs/networking/remote-access/#adding-private-ip-addresses).

The examples in this guide assign the private IP addresses of the three Postgres Linodes `192.0.2.11`, `192.0.2.12` and `192.0.2.13`. To setup a private IP address on a Linode, refer to the [Remote Access guide](/docs/networking/remote-access/#adding-private-ip-addresses) for more information.

1.  On the three Linodes where you want to install Postgres, update the package lists:

        sudo apt update

2.  Install Postgres:

        sudo apt install postgresql-9.5 -y

3.  Upon installation, Postgres automatically runs as a service. Stop the Postgres service so that Patroni can manage it from this point on:

        sudo systemctl stop postgresql

4.  Patroni uses utilities that come installed with Postgres, located in the `/usr/lib/postgresql/9.5/bin` directory by default on Ubuntu 16.04. Create symbolic links in the `PATH` to ensure that Patroni can find the utilities:

        sudo ln -s /usr/lib/postgresql/9.5/bin/* /usr/sbin/

    Instead of creating symlinks, you can include the `/usr/lib/postgresql/9.5/bin` directory in your `PATH`.

5.  Repeat these steps on each of the three Linodes.

## Install Patroni

Patroni is an open-source Python package that manages Postgres configuration. It can be configured to handle tasks like replication, backups and restorations.

In this guide, you will use Patroni to:

 -  Configure the Postgres instance running on the same server
 -  Configure replication from master to slaves
 -  Automatically failover to the best slave in case the master goes down.

1. Install `python` and `pip`:

        sudo apt install python python-pip -y

2. Ensure that you have latest version of the `setuptools` python package:

        sudo pip install --upgrade setuptools

3. Use `pip` to install Patroni:

        sudo pip install patroni

4.  Repeat these steps on each of the three Linodes.

## Install etcd

Etcd is a fault-tolerant, distributed key-value store that is used to store the state of the Postgres cluster. Via Patroni, all of the Postgres nodes make use of etcd to keep the Postgres cluster up and running.

In this guide you use a single-server etcd cluster. However, in production, it may be best to use a larger etcd cluster so that one etcd node fails, it doesn't affect your Postgres servers.

1. On the Linode where you want etcd installed, update the package lists:

        sudo apt update

2. Install etcd:

        sudo apt install etcd -y

The remainder of this guide uses `192.0.2.21` as the private IP address of this Linode.

## Install HAProxy

When developing an application that uses a database, it can be cumbersome to keep track of the database endpoints if they keep changing. Using HAProxy simplifies this by giving a single endpoint to which you can connect the application.

HAProxy forwards the connection to whichever node is currently the master. It does this using a REST endpoint that Patroni provides. Patroni ensures that, at any given time, only the master Postgres node will appear as online, forcing HAProxy to connect to the correct node.

1. On the Linode where you want HAProxy installed, update the package lists:

        sudo apt update

2. Install HAProxy:

        sudo apt install haproxy -y

This guide uses `192.0.2.31` as the private IP address of this server and `203.0.113.1` as its public IP address.

## Current Status

At this stage, you should have a total of five Linodes:

|Example Private IP Address|Software Installed| Example Public IP Address|
|:-:|:-:|:-:|
|192.0.2.11|Postgres, Patroni|-|
|192.0.2.12|Postgres, Patroni|-|
|192.0.2.13|Postgres, Patroni|-|
|192.0.2.21|etcd|-|
|192.0.2.31|HAProxy|203.0.113.1|

## Configure etcd

1. Edit the `/etc/default/etcd` file to add the following configuration:

   {{< file-excerpt "/etc/default/etcd" aconf >}}
ETCD_LISTEN_PEER_URLS="http://192.0.2.21:2380"

ETCD_LISTEN_CLIENT_URLS="http://localhost:2379,http://192.0.2.21:2379"

ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.0.2.21:2380"

ETCD_INITIAL_CLUSTER="etcd0=http://192.0.2.21:2380,"

ETCD_ADVERTISE_CLIENT_URLS="http://192.0.2.21:2379"

ETCD_INITIAL_CLUSTER_TOKEN="cluster1"

ETCD_INITIAL_CLUSTER_STATE="new"

{{< /file-excerpt >}}


2. Save the file, then restart the etcd service:

        sudo systemctl restart etcd

## Configure Patroni

Patroni can be configured using a YAML file which can be placed anywhere. In this guide, you will place this file at `/etc/patroni.yml`.

Create a `patroni.yml` file on all three Linodes that have Postgres and Patroni installed (`192.0.2.11`, `192.0.2.12`, and `192.0.2.13` in this guide). Change `name` to something unique, and change `listen` and `connect_address` (under `postgresql` and `restapi`) to the appropriate values on each Linode.

1. Edit this file to have the following content:

   {{< file "/etc/patroni.yml" >}}
scope: postgres
namespace: /db/
name: postgresql0

restapi:
    listen: 192.0.2.11:8008
    connect_address: 192.0.2.11:8008

etcd:
    host: 192.0.2.21:2379

bootstrap:
    dcs:
        ttl: 30
        loop_wait: 10
        retry_timeout: 10
        maximum_lag_on_failover: 1048576
        postgresql:
            use_pg_rewind: true

    initdb:
    - encoding: UTF8
    - data-checksums

    pg_hba:
    - host replication replicator 127.0.0.1/32 md5
    - host replication replicator 192.0.2.11/0 md5
    - host replication replicator 192.0.2.12/0 md5
    - host replication replicator 192.0.2.13/0 md5
    - host all all 0.0.0.0/0 md5

    users:
        admin:
            password: admin
            options:
                - createrole
                - createdb

postgresql:
    listen: 192.0.2.11:5432
    connect_address: 192.0.2.11:5432
    data_dir: /data/patroni
    pgpass: /tmp/pgpass
    authentication:
        replication:
            username: replicator
            password: rep-pass
        superuser:
            username: postgres
            password: secretpassword
    parameters:
        unix_socket_directories: '.'

tags:
    nofailover: false
    noloadbalance: false
    clonefrom: false
    nosync: false

{{< /file >}}


2. Make note of the `data_dir` value in the above file. The `postgres` user needs the ability to write to this directory. If this directory doesn't exist, create it:

        sudo mkdir /data/patroni -p

3. Make `postgres` the owner of `/data/patroni`:

        sudo chown postgres:postgres /data/patroni

4. Change the permissions on this directory to make it accessible only to the `postgres` user:

        sudo chmod 700 /data/patroni

    Every option in the above file is configurable. View the [latest version of the postgres0.yml file](https://github.com/zalando/patroni/blob/master/postgres0.yml) in Patroni's Github repository.

5. Create a `systemd` script that will allow you to start, stop and monitor Patroni. Create a file at `/etc/systemd/system/patroni.service` with the following content:

   {{< file "/etc/systemd/system/patroni.service" >}}
[Unit]
Description=Runners to orchestrate a high-availability PostgreSQL
After=syslog.target network.target

[Service]
Type=simple

User=postgres
Group=postgres

ExecStart=/usr/local/bin/patroni /etc/patroni.yml

KillMode=process

TimeoutSec=30

Restart=no

[Install]
WantedBy=multi-user.targ

{{< /file >}}


    If `patroni` is installed in a location other than `/usr/local/bin/patroni` on your machine, update the above file accordingly.

6. Start Patroni and Postgres:

        sudo systemctl start patroni

7. Check the status of Patroni:

        sudo systemctl status patroni

    If everything is set up correctly, the output from the first node (leader) will resemble:

        ● patroni.service - Runners to orchestrate a high-availability PostgreSQL
        Loaded: loaded (/etc/systemd/system/patroni.service; enabled; vendor preset: enabled)
        Active: active (running) since Thu 2017-07-29 16:49:18 UTC; 8min ago
        Main PID: 13097 (patroni)

        .
        .
        .

        ... INFO: Lock owner: postgresql0; I am postgresql0
        ... INFO: no action.  i am the leader with the lock

    When starting subsequent nodes, the log will resemble:

        INFO: no action.  i am a secondary and i am following a leader
        Lock owner: postgresql0; I am postgresql2

8.  Repeat these steps on each of the three Linodes with Postgres installed to create a highly available Postgres cluster with one master and two slaves.

## Configure HAProxy

With the Postgres cluster set up, you need a way to connect to the master regardless of which of the servers in the cluster is the master. This is where HAProxy comes in. All Postgres clients (your applications, `psql`, etc.) will connect to HAProxy which will make sure you connect to the master in the cluster.

1. On the Linode that has HAProxy installed, edit the configuration file at `/etc/haproxy/haproxy.cfg` to contain the following:

   {{< file "/etc/haproxy/haproxy.cfg" >}}
global
    maxconn 100

defaults
    log global
    mode tcp
    retries 2
    timeout client 30m
    timeout connect 4s
    timeout server 30m
    timeout check 5s

listen stats
    mode http
    bind *:7000
    stats enable
    stats uri /

listen postgres
    bind *:5000
    option httpchk
    http-check expect status 200
    default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
    server postgresql_192.0.2.11_5432 192.0.2.11:5432 maxconn 100 check port 8008
    server postgresql_192.0.2.12_5432 192.0.2.12:5432 maxconn 100 check port 8008
    server postgresql_192.0.2.13_5432 192.0.2.13:5432 maxconn 100 check port 8008

{{< /file >}}


   This configuration exposes HAProxy stats on a public URL. In a production setup, it might be better to restrict this to an internal network/localhost and access it via an SSH tunnel.

2. Restart HAProxy to use the new settings:

        sudo systemctl restart haproxy

    If HAProxy fails to start, check for syntax errors:

        /usr/sbin/haproxy -c -V -f /etc/haproxy/haproxy.cfg

## Test the Setup

1. Connect Postgres clients to the public IP address of the Linode on which you installed HAProxy (in this guide, `203.0.113.1`) on port `5000`.

2. You can also connect to the HAProxy Linode on port `7000` to see the HAProxy dashboard:

   ![HAProxy dashboard - all servers running](/docs/assets/pgha-haproxy-1-small.png "HAProxy dashboard - all servers running")

   In the `postgres` section, the `postgresql_192.0.2.11_5432` row is highlighted in green. This indicates that `192.0.2.11` is currently acting as the master.

3. If you kill the primary Linode (using `sudo systemctl stop patroni` or by shutting down the server), the dashboard will look similar to:

   ![HAProxy dashboard - when primary fails](/docs/assets/pgha-haproxy-2-small.png "HAProxy dashboard - when primary fails")

   In the `postgres` section, the `postgresql_192.0.2.11_5432` row is now red and the `postgresql_192.0.2.13_5432` row is highlighted in green. This indicates that `192.0.2.13` is currently acting as the master.

   {{< note >}}
In this case, it just so happens that the third Postgres server is promoted to master. This might not always be the case. It is equally likely that the second server may be promoted to master.
{{< /note >}}

When you now bring up the first server, it will rejoin the cluster as a slave and will sync up with the master.

You now have a robust, highly available Postgres cluster ready for use.

## Possible Next Steps

While the setup in this guide should go far in making your Postgres deployment highly available, here are steps you can take to improve it further:

1. Use a larger etcd cluster to improve availability.
2. Use PgBouncer to pool connections.
3. Add another HAProxy server and configure IP failover to create a highly available HAProxy cluster.

---
author:
  name: Kulshekhar Kabra
  email: docs@linode.com
description: 'Deploy PostgreSQL in a highly available setup'
keywords: 'postgresql,clusters,databases'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Wednesday, August 16th, 2017
modified_by:
  name: Kulshekhar Kabra
published: 'Thursday, August 31st, 2017'
title: Deploying a Highly Available PostgreSQL Cluster
external_resources:
 - '[PostgreSQL Documentation](https://www.postgresql.org/docs/)'
 - '[Patroni Repository](https://github.com/zalando/patroni)'
 - '[Etcd Documentation](https://coreos.com/etcd/docs/latest/)'
---

## Introduction

[PostgreSQL](https://www.postgresql.org) (Postgres) is an open source, fully ACID compliant relational database that runs on all the major operating systems. While Postgres is a highly versatile, feature-rich and powerful database, it doesn't have a built-in solution for high availability.

This guide will explain how you can set up a highly available Postgres cluster of three servers using [Patroni](https://github.com/zalando/patroni).

## Before You Begin

1. This guide assumes that you are familiar with setting up new Linodes with private IP addresses.

2. This guide uses Ubuntu 16.04 and assumes familiarity with its package manager and user management.

{: .note}
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## A Brief Introduction to the Tools Being Used

In this guide, we will create a highly available Postgres cluster that will failover automatically in case the Postgres master goes down.

This setup will involve the installation and configuration of:

- Postgres (on three Linodes)
- [etcd](https://coreos.com/etcd) (on one Linode)
- Patroni (on each of the Postgres Linodes)
- [HAProxy](https://www.haproxy.org/) (on one Linode)

While it's obvious why we're using Postgres, let's take a quick look at why we need the other tools.

### etcd

etcd is a fault-tolerant, distributed key-value store that is used to store the state of the Postgres cluster. All the Postgres nodes, via Patroni, make use of etcd to keep the Postgres cluster up and running.

### Patroni

Patroni is an open source python package that manages Postgres configuration. It is installed on the same servers as Postgres and can be configured to handle tasks like replication, backups and restorations.

Patroni, as used in this guide, will:

- Configure the Postgres instance running on the same server
- Configure replication from master to slaves
- Automatically failover to the best slave in case the master goes down.

### HAProxy

When developing an application that uses a database, it can be cumbersome to keep track of the databse endpoints if they keep changing. Using HAProxy simplifies this by giving us a single endpoint that we can connect our application to.

HAProxy takes care of forwarding the connection to whichever node is currently the master. It does this by using a REST endpoint that Patroni provides. Patroni ensures that, at any given time, only one Postgres node (the master) will appear as online, forcing HAProxy to connect to the correct node.

## Installing the Required Tools

This section will guide you through the steps needed to install the above mentioned tools.

### Installing PostgreSQL

On three Linodes where you want Postgres installed, begin by updating the package lists:

    sudo apt-get update

Next, install Postgres:

    sudo apt-get install postgresql-9.5 -y

When you install Postgres, it also starts running as a service. We need to stop Postgres so that Patroni can manage it from this point on:

    sudo systemctl stop postgresql

Postgres comes with some utilities, that Patroni makes use of to manage Postgres. In Ubuntu 16.04, these utilities are installed in the `/usr/lib/postgresql/9.5/bin` directory by default.

To ensure that Patroni can find these utilities, we can create symbolic links to these utilities in a folder that's present in the `PATH`:

    sudo ln -s /usr/lib/postgresql/9.5/bin/* /usr/sbin/

{: .note}
>
> You could also just include the `/usr/lib/postgresql/9.5/bin` directory in you `PATH` instead of creating symlinks.

This guide will assume that the private IP addresses of the three Postgres Linodes are `192.0.2.11`, `192.0.2.12` and `192.0.2.13`.

### Installing Patroni

We will now install Patroni on the three servers that we installed Postgres on. Patroni is a python package and can be installed using the `pip` command.

Begin by installing `python` and `pip`:

    sudo apt-get install python python-pip -y

To install Patroni without errors, make sure that you have  latest versions of the `setuptools` python package:

    sudo pip install --upgrade setuptools

Next, use `pip` to install Patroni:

    sudo pip install patroni

Now that we have three Linodes with Postgres and Patroni installed on each of them, let's install etcd

### Installing etcd

In this guide we will use a one server etcd cluster. However, in production, it would be best to use a larger etcd cluster so that one etcd node going down doesn't affect your Postgres servers.

On the Linode where you want etcd installed, begin by updating the package lists:

    sudo apt-get update

Next, install etcd:

    sudo apt-get install etcd -y

This will install and start etcd on this Linode.

This guide will assume that the private IP address of this server is `192.0.2.21`

### Installing HAProxy

On the Linode where you want HAProxy installed, begin by updating the package lists:

    sudo apt-get update

Next, install HAProxy:

    sudo apt-get install haproxy -y

This guide will assume that the private IP address of this server is `192.0.2.31` and its public IP address is `203.0.113.1`.

At this stage, you should have a total of five Linodes:

|Private IP Address|Software Installed|Public IP Address|
|:-:|:-:|:-:|
|192.0.2.11|Postgres, Patroni|-|
|192.0.2.12|Postgres, Patroni|-|
|192.0.2.13|Postgres, Patroni|-|
|192.0.2.21|etcd|-|
|192.0.2.31|HAProxy|203.0.113.1|

## Configuring the Setup

Now that we have all the required tools installed, it's time to configure them.

### Configuring etcd

Edit the `/etc/default/etcd` file to add the following configuration:

{: .file}
/etc/default/etcd
:   ~~~ conf
    ETCD_LISTEN_PEER_URLS="http://192.0.2.21:2380"

    ETCD_LISTEN_CLIENT_URLS="http://localhost:2379,http://192.0.2.21:2379"

    ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.0.2.21:2380"

    ETCD_INITIAL_CLUSTER="etcd0=http://192.0.2.21:2380,"

    ETCD_ADVERTISE_CLIENT_URLS="http://192.0.2.21:2379"

    ETCD_INITIAL_CLUSTER_TOKEN="cluster1"

    ETCD_INITIAL_CLUSTER_STATE="new"
    ~~~

After saving the file, restart the etcd service:

    sudo systemctl restart etcd

### Configuring Patroni

Patroni can be configured using a YAML file which can be placed anywhere. In this guide, we'll place this file at `/etc/patroni.yaml`.

Edit this file to have the following content:

{: .file}
/etc/patroni.yml
:   ~~~ yaml
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
    ~~~

This file needs to be created on all three Linodes that have Postgres and Patroni installed (`192.0.2.11`, `192.0.2.12` and `192.0.2.13`).

Remember to change the `name` to something unique and `listen` and `connect_address` (under `postgresql` and `restapi`) to the appropriate values on each Linode.

Make note of the `data_dir` value in the above file. This directory needs to be writable by the `postgres` user. Assuming this directory doesn't exist, begin by creating it:

    sudo mkdir /data/patroni -p

Now make `postgres` the owner of this directory:

    sudo chown postgres:postgres /data/patroni

Finally, change the permissions on this directory to make it accessible only to the `postgres` user:

    sudo chmod 700 /data/patroni

All options in the above file are configurable. You can see the [latest version](https://github.com/zalando/patroni/blob/master/postgres0.yml) of this file in Patroni's Github repository.

Let's now create a `systemd` script that will allow us to start, stop and monitor Patroni. Create a file at `/etc/systemd/system/patroni.service` with the following content:

{: .file}
/etc/systemd/system/patroni.service
:   ~~~
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
    ~~~

{: .note}
>
> If `patroni` is installed in a location other than `/usr/local/bin/patroni` on your machine, update the above file accordingly.

To start Patroni (and thereby Postgres), execute the following command:

    sudo systemctl start patroni

To check the status of Patroni, run the following command:

    sudo systemctl status patroni

If everything is setup correctly, this should show an output similar to the following:

    ● patroni.service - Runners to orchestrate a high-availability PostgreSQL
    Loaded: loaded (/etc/systemd/system/patroni.service; enabled; vendor preset: enabled)
    Active: active (running) since Thu 2017-07-29 16:49:18 UTC; 8min ago
    Main PID: 13097 (patroni)

    .
    .
    .

    ... INFO: Lock owner: postgresql0; I am postgresql0
    ... INFO: no action.  i am the leader with the lock

This is what you should see when starting up the first node (leader). When starting up subsequent nodes, you should see a log that contains:

    INFO: no action.  i am a secondary and i am following a leader
    Lock owner: postgresql0; I am postgresql2

Doing this on all the three Linodes will create a highly available Postgres cluster with one master and two slaves.

### Configuring HAProxy

With the Postgres cluster set up, we need a way to connect to the master regardless of which of the servers in the cluster is the master. This is where HAProxy comes in. All Postgres clients (your applications, `psql`, etc.) will connect to HAProxy which will make sure you get connected to the master in the cluster.

On the machine that has HAProxy installed, edit the configuration file at `/etc/haproxy/haproxy.cfg` to contain the following:

{: .file}
/etc/haproxy/haproxy.cfg
:   ~~~
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
    ~~~

{: .note}
>
> The above configuration exposes HAProxy stats on a public URL. In a production setup, it might be better to restrict this to an internal network/localhost and access it via an SSH tunnel.

Restart HAProxy to use the new settings:

    sudo systemctl restart haproxy

## Testing the Setup

With the entire setup created and configured, you can connect Postgres clients to `203.0.113.1` (the public IP address of the Linode that you have installed HAProxy on) on port `5000`.

You can also connect to the HAProxy Linode on port `7000` to see the HAProxy dashboard, as follows:

![HAProxy dashboard - all servers running](/docs/assets/pgha-haproxy-1-small.png)

In the `postgres` section, you can see the row with `postgresql_192.0.2.11_5432` highlighted in green. This indicates that `192.0.2.11` is currently acting as the master.

Now if you kill the primary Linode (using `sudo systemctl stop patroni` or by shutting down the server), wait for a few seconds and refresh the dashboard, you'll see a different kind of dashboard:

![HAProxy dashboard - when primary fails](/docs/assets/pgha-haproxy-2-small.png)

In the `postgres` section, you can see the row with `postgresql_192.0.2.11_5432` is now red and the one with `postgresql_192.0.2.13_5432` is highlighted in green. This indicates that `192.0.2.13` is currently acting as the master.

{: .note}
>
> In this case, it just so happened that the third Postgres server was promoted to master. This might not always be the case. It is equally likely that you might see the second server as the master.

When you now bring up the first server, it will rejoin the cluster as a slave and will sync up with the master.

With this, you now have a robust, highly available Postgres cluster ready for use.

## Possible Next Steps

While the setup as described in this guide should go a long way in making your Postgres deployment highly available, there are steps you can take to improve it further.

1. Use a larger etcd cluster to improve availability.
2. Use PgBouncer to pool connections.
3. Add another HAProxy server and configure IP failover to create a highly available HAProxy cluster.

---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Installing and setting up Riak cluster on Ubuntu 14.04'
keywords: 'riak, nosql, cluster, riak control'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Wednesday, December 21st, 2015'
modified_by:
  name: Sergey Pariev
published: 'Wednesday, December 2nd, 2015'
title: 'Installing and setting up Riak cluster on Ubuntu 14.04'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
external_resources:
  - '[Installing Riak](http://docs.basho.com/riak/latest/installing/debian-ubuntu/)'
  - '[Tune Erlang VM](http://docs.basho.com/riak/latest/ops/tuning/erlang/)'
  - '[Starting Cluster](http://docs.basho.com/riak/latest/ops/building/basic-cluster-setup/)'
  - '[Riak Control](http://docs.basho.com/riak/latest/ops/advanced/riak-control/)'
---

[Riak](http://docs.basho.com/riak/latest/) is a distributed key-value database designed to deliver maximum data availability by distributing data across multiple servers. Riak goal is to provide highly available and scalable data storage which is robust and simple to operate.

This guide uses two separate Linodes with private IPv4 addresses to configure Riak cluster on Ubuntu 14.04 LTS. You will also setup Riak Control web application for monitoring and managing your Riak cluster.

{: .note}
>
>This guide assumes that your Linodes are each configured with a [Private IP Address](/docs/networking/remote-access#adding-private-ip-addresses).

## Before You Begin

    1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

    2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

    3.  Update your system.

            sudo apt-get update && sudo apt-get upgrade

    {: .note}
    >
    >This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install Riak

You will need to install Riak on both Linodes.

1.  Add the GPG key from packagecloud.io

		curl https://packagecloud.io/gpg.key | sudo apt-key add -

2.  Install `apt-transport-https` package to be able to fetch packages via HTTPS:

		sudo apt-get install -y apt-transport-https

3.  Create file `/etc/apt/sources.list.d/basho_riak.list` with the following content:

{: .file}
/etc/apt/sources.list.d/basho_riak.list
:   ~~~
	deb https://packagecloud.io/basho/riak/ubuntu/ trusty main
	deb-src https://packagecloud.io/basho/riak/ubuntu/ trusty main
	~~~

4.  Update your packages with

		sudo apt-get update

5.  Install the riak package with

		sudo apt-get install riak


## Basic System Tuning

Using `sudo` make the following changes in system configuration files on both linodes:

1.  Increase open file limit for `riak` user. Edit file `/etc/security/limits.conf` and add the following lines:

{: .file-excerpt}
/etc/security/limits.conf
:   ~~~ conf
	riak soft nofile 4096
	riak hard nofile 65536
	~~~

2. Edit file `/etc/pam.d/su` and uncomment the line with `session    required   pam_limits.so` to enable the limits you've just added in `/etc/security/limits.conf`

{: .file-excerpt}
/etc/pam.d/su
:   ~~~ conf
	session    required   pam_limits.so
	~~~

2.  Disable swap in `/etc/sysctl.conf`, add the following line to the end of the file:

{: .file-excerpt}
/etc/sysctl.conf
:   ~~~ conf
	vm.swappiness = 0
	~~~

3.  Open riak configuration file `/etc/riak/riak.conf` and add or uncomment the following settings:

{: .file-excerpt}
/etc/riak/riak.conf
:   ~~~ conf
	erlang.schedulers.force_wakeup_interval = 500
	erlang.schedulers.compaction_of_load = false
	~~~

4.  Also in `/etc/riak/riak.conf` set `nodename` to `riak@<linode_private_ip>`, substituting `<linode_private_ip>` with each linode private IP address:


{: .file-excerpt}
/etc/riak/riak.conf
:   ~~~ conf
	nodename = riak@<linode_private_ip>
	~~~


## Verify Riak Installation

On both linodes, do the following to ensure everything is working properly.

1.  Start Riak service with

		sudo riak start

2.  To verify that node is up and working correctly execute

		sudo riak-admin test

	Output should look like the following:

     	Attempting to restart script through sudo -H -u riak
		Successfully completed 1 read/write cycle to 'riak@<linode_private_ip>'

3.  Stop Riak with

		sudo riak stop


## Cluster Setup

{: .note}
>
>The important parameter of the Riak cluster is the *ring size* - number of partitions that make up your cluster. It must be set before cluster creation. For test purposes default value of 64 is good enough, but for production deployment please consult Riak docs [on choosing the ring size](http://docs.basho.com/riak/latest/ops/building/planning/cluster/#Ring-Size-Number-of-Partitions).

1.  On one of the linodes, edit `/etc/riak/riak.conf` and change protobuf listener address to the linode's private IP:

{: .file-excerpt}
/etc/riak/riak.conf
:   ~~~ conf
	listener.protobuf.internal = <linode_private_ip>:8087
	~~~

2.  Start this node with

		sudo riak start

3.  Now change protobuf listener settings on the other linode:

{: .file-excerpt}
/etc/riak/riak.conf
:   ~~~ conf
	listener.protobuf.internal = <linode_private_ip>:8087
	~~~

4.  Start the other node with

		sudo riak start

5.  From this second node, join first node with command

		sudo riak-admin cluster join riak@<first_linode_private_ip>

6.  Plan and commit the changes:

		sudo riak-admin cluster plan
		sudo riak-admin cluster commit

7.  Verify cluster status with

		sudo riak-admin status | grep ring_members

	which should output

	    ring_members : ['riak@<first_linode_private_ip>','riak@<second_linode_private_ip>']

## Install Riak Control

On one of the linodes, enable **Riak Control** on linode public IP. Riak Control is a web-based administrative console for inspecting and manipulating Riak clusters.

{: .note}
>
>In production environment you should only use Riak Control with authentication and HTTPS. For more details please see [Riak security documentation](http://docs.basho.com/riak/latest/ops/running/authz/#Enabling-SSL)

1.  Edit `/etc/riak/riak.conf` and set `riak_control` to `on`, also change http listener address to linode public IP:

{: .file-excerpt}
/etc/riak/riak.conf
:   ~~~ conf
	riak_control = on
	listener.http.internal = <linode_public_ip>:8096
	~~~

2.  Restart the linode with

		sudo riak restart

3.  Riak Control application will be accessible at http://&lt;linode_public_ip&gt;:8098/admin URL.

[![Riak Control main page](/docs/assets/riak_riak_control_small.png)](/docs/assets/riak_riak_control.png)

You can now manage your riak cluster via web interface - start and stop individual nodes, and add or remove nodes from cluster.




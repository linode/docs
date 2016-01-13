---
author:
	name: Linode Community
	email: docs@linide.com
description: 'Install and Running Hadoop on Ubuntu (Single-Node-Cluster)''
keywords: 'hadoop, ubuntu, bigdata, database'
license: '[CC BY-ND 3.0](http://creativecommons.org/lincese/by-nd/3.0/us/)'
title: 'Install and Running Hadoop on Ubuntu 12.04 (Single-node-Cluster)'
contributer:
	name: 'Manikandan'
	link: 'https://github.com/mani90'
externel_resources: 
	- [Apache Hadoop](https://hadoop.apache.org/)
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*

<br/>

[Hadoop](https://hadoop.apache.org/) (formerly known as Hadoop Big data) is an open-source framework that allows to store and process big data in a distributed environment acroses cluster of computers using simple programming models. It is desined to scale up from single server to thousands of machines, each offering local comoutation and storage.

The main goal of this tutorial is to get a simple hadoop installation up and running on ubuntu. So in this tutorial i will describe the required steps for setting up a pseudo-distributed, single node Hadoop cluster backed by the Ubuntu Distributed File System, running on Ubuntu.

# Prerequisites

## Before You Start

1.	Complete the [Getting Started](/docs/getting-started) guide.

2.	Follow the [Securing your Server](/docs/security/securing-your-server) guide to create a standard your account, herden SSH access and remove unnecessary network services.

3.	Login to your Linode via SSH and check for updates using `apt-get` package manager.

					sudo apt-get update && sudo apt-get upgrade

## Sun Java

Hadoop requires a working Java 1.5+ Installation. However, using Java 1.6 is recommended for running Hadoop. Check if Java is already installed on your server using the following command.

				whereis java
				java -version

If Java is already installed, it will output the path of the executable java file and the Java version that is being run, Skip to the next step.

### Install Java

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

To add PPA and install the latest Oracle Java 7 in Ubuntu Linux Server.

	sudo add-apt-repository ppa:webupd8team/java
	sudo apt-get update
	sudo apt-get install oracle-java7-installer

{: .note}
>
> If you're behind a firewall / Router that blocks some of the redirects to download the Oracle Java archive, You can download the JDk tar.gz arcive manually and place it under `/var/cache/oracle-jdk7-installer` then, installing the "oracle-java7-installer" package will use the local archive instead of tring to download it itself.

After installation is finishes, if you wish to see if it was successfull. you can run the following command. 

	java -version

It should return something like this.

	java version "1.7.0_76"
	Java(TM) SE Runtime Environment (build 1.7.0_76-b13)
	Java HotSpot(TM) 64-Bit Server VM (build 24.76-b04, mixed mode)

## Adding a dedicated Hadoop System User

We will use a dedicated Hadoop system user account for running Hadoop. While that's not required it is recommended because it helps to separate the Hadoop installation from the other software applications aunning on the same server.

	sudo addgroup hadoop
	sudo adduser --ingroup adoop hadoopuser

This will add the user `hadoopuser` and the group `hadoop` to your Ubuntu server.

## Configure SSH 

Hadoop requires SSH access manage its nodes. I assume that you have SSH up and running on your Linode server and configured it to allow SSH public key authendication.

First, we have to generate an SSH for the `hadoopuser` user.

	su - hadoopuser
	ssh-keygen -t rsa -P ""
	Generating public/private rsa key pair.
	Enter file in which to save the key (/home/hadoopuser/.ssh/id_rsa):
	Created directory '/home/hadoopuser/.ssh'.
	Your identification has been saved in /home/hadoopuser/.ssh/id_rsa.
	Your public key has been saved in /home/hadoopuser/.ssh/id_rsa.pub.
	The key fingerprint is:
	9b:82:ea:58:b4:e0:35:d7:ff:19:66:a6:ef:ae:0e:d2 hadoopuser@ubuntu
	The key's randomart image is:
	[...snipp...]

The second line will create an RSA key pair with an empty password. Generally, using an empty password is not remonnended. Next you have to enable SSH access to your machine with this newly created key.

	cat $HOME/.ssh/id_rsa.pub >> $HOME/.ssh/authorized_keys

The final step is to test the SSH setup by connecting your local machine with the `hadoopuser` user. 

## Disabling IPv6

One problem with IPv6 on Ubuntu is that using `0.0.0.0` for the various networking related Hadoop confiuration options will result in Hadoop binding to the IPv6 addresses of your Ubuntu.

To disable IPv6 in Ubuntu. open `/etc/sysctl.conf` in the editor of your choice and add the following lines to the end of the file:

{: .file}
/ect/sysctl.conf
:	~~~ conf
	# disable ipv6
	net.ipv6.conf.all.disable_ipv6 = 1
	net.ipv6.conf.default.disable_ipv6 = 1
	net.ipv6.conf.lo.disable_ipv6 = 1
	~~~

You have to reboot your machine in order to make the changes take effect.
You can check whether IPv6 is enabled in your machine with the following command.

	cat /proc/sys/net/ipv6/conf/all/disable_ipv6

A return value of 0 means IPv6 is enabled, a value of 1 means disabled.

# Hadoop Installation

[Download Hadoop](http://www.apache.org/dyn/closer.cgi/hadoop/core) from the Apache Download Mirrors and extract the contents of the Hadoop package to a location of your choice. i picked `/opt/hadoop/`. Make sure to change the owner of all the files to the `hadoopuser` user and `hadoop` group. for example.

	$ cd /opt/
	$ sudo tar xzf hadoop-1.0.3.tar.gz
	$ sudo mv hadoop-1.0.0 hadoop
	$ sudo chown -R hasdoopuser:hasdoop hadoop

## Update .bashrc

Add the following line to the end of the `$HOME/.bashrc` file of user `hadoop`. 

{: .file}
$HOME/.bashrc
:	~~~ bash
	# Set Hadoop-related environment variables
	export HADOOP_HOME=/opt/hadoop

	# Set JAVA_HOME (we will also configure JAVA_HOME directly for Hadoop later on)
	export JAVA_HOME=/usr/lib/jvm/java-7-sun

	# Some convenient aliases and functions for running Hadoop-related commands
	unalias fs &> /dev/null
	alias fs="hadoop fs"
	unalias hls &> /dev/null
	alias hls="fs -ls"

	# If you have LZO compression enabled in your Hadoop cluster and
	# compress job outputs with LZOP (not covered in this tutorial):
	# Conveniently inspect an LZOP compressed file from the command
	# line; run via:
	#
	# $ lzohead /hdfs/path/to/lzop/compressed/file.lzo
	#
	# Requires installed 'lzop' command.
	#
	lzohead () {
	    hadoop fs -cat $1 | lzop -dc | head -1000 | less
	}

	# Add Hadoop bin/ directory to PATH
	export PATH=$PATH:$HADOOP_HOME/bin
	~~~

You can repeat this excercise also for other users who want to use Hahoop.

# Configuration Hadoop

Now, we need to configure Hadoop framework on Ubuntu machine. The following configuration files we can use to do proper configuration. To know more about Hadoop configuration, you can visit [Hadoop wiki page.](http://wiki.apache.org/hadoop/GettingStartedWithHadoop).

### 1. hadoop-env.sh

The only required environment variable we have to configure for Hadoop in this tutorial is `JAVA_HOME`. Open `conf/hadoop-env.sh` in the editor of your choice (if you used the installation path in this tutorial, the full path is `/opt/hadoop/conf/hadoop-env.sh`) and set the `JAVA_HOME` environment variable to the Sun JDK/JRE 7 directory.

{: .Oriinal File}
/opt/hadoop/conf/hadoop-env.sh
:	~~~ bash
	# The java implementation to use.  Required.
	# export JAVA_HOME=/usr/lib/j2sdk1.5-sun
	~~~


{: .Change to}
/opt/hadoop/conf/hadoop-env.sh
:	~~~ bash
	# The java implementation to use.  Required.
	export JAVA_HOME=JAVA_HOME=/usr/lib/jvm/java-7-sun
	~~~

### 2. core-site.xml

In this section, we'll confiure the directory where the Hadoop will store its data files etc. 

First, we need to create temp directory for Hadoop framework. If you need this environmet for testing or quick prototype. I suggest to create folder under `/home/hadoopuser/` directory, otherwise, you should create this folder in a sared place under `shared` folder (like `/user/local/share/`), but you may face some security issue. But it overcome the exceptions tat may caused by security, I have create tmp folder under `hadoopuser` space.

To create this folder and add required ownersip, type the following command,

	$ sudo madir /home/hadoopuser/tmp
	$ sudo chown hadoopuser:hadoop /home/hadoopuser/tmp
	$ sudo chmod 750 /home/hadoopuser/tmp

If you forget to set ownership and permissions, you will see a `java.io.IOException` when you try to format the name node next section.

Add the following snippets between the `<configuration>....</configuration>` tags in the respective xml file.

{: .file}
conf/core-site.xml
:	~~~ xml
	<property>
		<name>hadoop.tmp.dir</name>
		<value>/home/hadoopuser/tmp</value>
		<description>A base for other temporary directories.</description>
	</property>

	<property>
		<name>fs.default.name</name>
		<value>hdfs://localhost:54310</value>
		<description>
			The name of the default file system.  A URI whose scheme and authority determine the FileSystem implementation. The uri's scheme determines the config property (fs.SCHEME.impl) naming the FileSystem implementation class.  The uri's authority is used to determine the host, port, etc. for a filesystem.
		</description>
	</property>
	~~~


### 3. mapred-site.xml

Open the `/opt/hadoop/conf/mapred-site.xml` using your text editor and add the following line 

{: .Mapred-site.xml}
/opt/hadoop/conf/mapred-site.xml
:	~~~ xml
	<property>
		<name>mapred.job.tracker</name>
		<value>localhost:54311</value>
		<description>
			The host and port that the MapReduce job tracker runs at.  If "local", then jobs are run in-process as a single map and reduce task.
		</description>
	</property>
	~~~

### 4. hdfs-site.xml

Open the `/opt/hadoop/conf/hdfs-site.xml` using your text editor and add the following lines for hadoop configuration.

{: .hdfs-site.xml}
/opt/hadoop/conf/hdfs-site.xml
:	~~~ xml
	<property>
		<name>dfs.replication</name>
		<value>1</value>
		<description>
			Default block replication. The actual number of replications can be specified when the file is created. The default is used if replication is not specified in create time.
		</description>
	</property>
	~~~

## Formate the HDFS filesystem

The first step to starting up your Hadoop installation is formatting the Hadoop filesystem which is implemented on top of the local filesystem of your “cluster” (which includes only your local machine if you followed this tutorial). You need to do this the first time you set up a Hadoop cluster.

{: .caution}
>
> Do not format a running Hadoop filesystem as you will lose all the data currently in the cluster (in HDFS)!

To format the filesystem (which simply initializes the directory specified by the `dfs.name.dir` variable), run the command

	$ /opt/hadoop/bin/hadoop namenode -format

The output look like this.

	hadoopuser@ubuntu:/opt/hadoop$ bin/hadoop namenode -format
	12/12/15 16:59:56 INFO namenode.NameNode: STARTUP_MSG:
	/************************************************************
	STARTUP_MSG: Starting NameNode
	STARTUP_MSG:   host = ubuntu/127.0.1.1
	STARTUP_MSG:   args = [-format]
	STARTUP_MSG:   version = 0.20.2
	STARTUP_MSG:   build = https://svn.apache.org/repos/asf/hadoop/common/branches/branch-0.20 -r 911707; compiled by 'chrisdo' on Fri Feb 19 08:07:34 UTC 2010
	************************************************************/
	12/12/15 16:59:56 INFO namenode.FSNamesystem: fsOwner=hduser,hadoop
	12/12/15 16:59:56 INFO namenode.FSNamesystem: supergroup=supergroup
	12/12/15 16:59:56 INFO namenode.FSNamesystem: isPermissionEnabled=true
	12/12/15 16:59:56 INFO common.Storage: Image file of size 96 saved in 0 seconds.
	12/12/15 16:59:57 INFO common.Storage: Storage directory .../hadoop-hduser/dfs/name has been successfully formatted.
	12/12/15 16:59:57 INFO namenode.NameNode: SHUTDOWN_MSG:
	/************************************************************
	SHUTDOWN_MSG: Shutting down NameNode at ubuntu/127.0.1.1
	************************************************************/
	hadoopuser@ubuntu:/opt/hadoop$

## Starting single-node cluster

To start your single-node cluster, type the following command.

	$ /opt/hadoop/bin/start-all.sh

This will startup a Namenode, Datanode, Jobtracker and Tasktracker on your Ubuntu server.

The output look like this

	$ /opt/hadoop$ bin/start-all.sh
	starting namenode, logging to /opt/hadoop/bin/../logs/hadoop-hduser-namenode-ubuntu.out
	localhost: starting datanode, logging to /opt/hadoop/bin/../logs/hadoop-hduser-datanode-ubuntu.out
	localhost: starting secondarynamenode, logging to /opt/hadoop/bin/../logs/hadoop-hduser-secondarynamenode-ubuntu.out
	starting jobtracker, logging to /opt/hadoop/bin/../logs/hadoop-hduser-jobtracker-ubuntu.out
	localhost: starting tasktracker, logging to /opt/hadoop/bin/../logs/hadoop-hduser-tasktracker-ubuntu.out
	
There is nice tool called `jps`. You can use it to ensure that all the services are up.

	hadoopuser@ubuntu: /opt/hadoop$ jps
	2287	TaskTracker
	2156	JobTracker
	1867	DataNode
	2907	secondaryNamenode
	2378	jps
	1467	NameNode

## Stopping Hadoop Cluster

To stop all hadoop services, type the following command.

	$ /opt/hadoop/bin/stop-all.sh




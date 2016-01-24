---
author:
	name: Linode Community
	email: docs@linide.com
description: 'Install and Running Hadoop on Ubuntu 14.04 (Single-Node-Cluster)''
keywords: 'hadoop, ubuntu, bigdata, database'
license: '[CC BY-ND 3.0](http://creativecommons.org/lincese/by-nd/3.0/us/)'
title: 'Install and Running Hadoop on Ubuntu 14.04 (Single-node-Cluster)'
contributer:
	name: 'Manikandan'
	link: 'https://github.com/mani90'
externel_resources: 
	- [Apache Hadoop](https://hadoop.apache.org/)
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*

<br/>

[Hadoop](https://hadoop.apache.org/) (formerly known as Hadoop Big data) is an open-source framework that allows to store and process big data in a distributed environment acroses cluster of computers using simple programming models. It is desined to scale up from single server to thousands of machines, each offering local comoutation and storage.

## Purpose

The main goal of this tutorial is to get a simple hadoop installation up and running on ubuntu. So in this tutorial i will describe the required steps for setting up a pseudo-distributed, single node Hadoop cluster backed by the Ubuntu Distributed File System, running on Ubuntu.

# Prerequisites

1.	Ubuntu 14.must 04 be installed.

2.	Java™ must be installed.

3.	SSH must be installed.

## Before You Start

1.	Complete the [Getting Started](/docs/getting-started) guide.

2.	Follow the [Securing your Server](/docs/security/securing-your-server) guide to create a standard your account, herden SSH access and remove unnecessary network services.

3.	Login to your Linode via SSH and check for updates using `apt-get` package manager.

	sudo apt-get update && sudo apt-get upgrade

## Java

The latest version of Hadoop requires a working Java 1.7+ Installation. However, using Java 1.7.0_15 is recommended for running Hadoop. Hadoop 2.x is build and tested on both OpenJDk and Oracle JDK. Check if Java is already installed on your server using the following command.

	whereis java
	java -version

If Java is already installed, it will output the path of the executable java file and the Java version that is being run, Skip to the next step.

### Install Java

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

To Install Java on ubuntu you can simply follow the below steps. In this tutorial i'm using OpenJDk 8 because, it is very easy to install and upgrade.
To install OpenJDk 8 on your Ubuntu type the followin command on command line.

	$ sudo apt-get install openjdk-8-jdk

After installation is finishes, if you wish to see if it was successfull. you can run the following command. 

	java -version

It should return something like this.

	Openjdk version "1.8.0_01-internal"
	OpenJDK Runtime Environment (build 1.8.0_01-internal-b04)
	OpenJDK 64-Bit Server VM (build 25.40-b08, mixed mode)

## Hadoop installation steps.

### Step 1: Adding a dedicated Haddop user.

We will use a dedicated user for Hadoop installation. But this is optional to use. To add new system user enter the following command on teminal.

	$ sudo addgroup hadoop_group
	$ sudo adduser --ingroup hadoop_group hadoopUser

### Step 2: Configure SSH:

Configurin SSh is very important because Hadoop requires SSH access to manage its nodes. To configure SSH, first we need to generate SSH key for the hadoopUser user.

	$ su - hadoopUser
	$ ssh-keygen -t -rsa -P "" -f ~/.ssh/id_rsa

{: .note}
>
> `P ""` indicates the empty password.

Next we ave to enable SSH access to your local machine with above created key.

	$ cat ~/.ssh/id_rsa.pub >> ~./ssh/authorized_keys

Now you can test the SSH confiuration. This is very important because if there is any error you can correct it now itself. To test the SSH confiuration us the following command.

	$ ssh localhost

### Main Installation

Download Hadoop from the [Apache](https://hadoop.apache.org/releases.html) and extract the Hadoop package to the location of your choice. I picked `/opt/hadoop`. Make sure to change the owner of all files to the `hadoopUser` and `hadoop_group` group.

	$ cd /opt/
	$ sudo tar xzf hadoop-2.6.3.tar.gz 
	$ mv hadoop-2.6.3 hadoop
	$ sudo chown -R hadoopUser:hadoop_group hadoop

Next you have set the environment variable for hadoop

	$ export HADOOP_HOME=/opt/hadoop
	$ export PATH=$PATH:$HADOOP_HOME/bin

### Configuration: hadoop-env.sh

Change the Java installation path in `conf/hadoop-env.sh` file. To change it edit following line in `hadoop-env.sh`.

{: .Original file} 
/opt/hadoop/conf/hadoop-env.sh
:	~~~ bash

	# The java implementation to use.  Required.
	# export JAVA_HOME=/usr/lib/j2sdk1.5-sun
	~~~

{: .Change to}
/opt/hadoop/conf/hadoop-env.sh
:	~~~ bash
	# The java implementation to use.  Required.
	# export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
	~~~

### Configuration: conf/*-site.xml

The `/opt/hadoop/etc/hadoop/core-site.xml` contains configuration properties of that Hadoop users when starting up. This file can be used to override the default settings that Hadoop start with.

In this file, enter the following content in between the `<configuration></configuration>` tag.

{: .core-site.xml}
:	~~~ xml
	<property>
   	<name>fs.default.name</name>
   	<value>hdfs://localhost:9000</value>
	</property>
	~~~

### Confiuration: hdfs-site.xml

The `/opt/hadoop/etc/hadoop/hdfs-site.xml` has to be configured for each host in the cluster that is being used. It is used to specify the directories which will be used as the namenode and the datanode on that host.

Before editing this file, we need to create two directories which will contain the namenode and the datanode for this Hadoop installation. This can be done using the following commands:

	$ mkdir -p /opt/hadoop_store/hdfs/namenode
	$ mkdir -p /opt/hadoop_store/hdfs/datanode


Once tis is done, Enter the following content in between the `<configuration></configuration>` tag.

{: .hdfs-site.xml}
:	~~~ xml
	<property>
		<name>dfs.replication</name>
		<value>1</value>
	</property>
	<property>
		<name>dfs.namenode.name.dir</name>
		<value>file:/opt/hadoop_store/hdfs/namenode</value>
	</property>
	<property>
		<name>dfs.datanode.data.dir</name>
		<value>file:/opt/hadoop_store/hdfs/datanode</value>
	</property>

	~~~

### YARN on single node cluster

The `/opt/hadoop/etc/hadoop/yarn-site.xml` file contains configuration properties that MapReduce uses when starting up. This file can be used to override the default settings that MapReduce starts with. 

In this file, enter the following content in between the `<configuration></configuration>` tag:

{: .yarn.xml}
:	~~~ xml

	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
	<property>
		<name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
		<value>org.apache.hadoop.mapred.ShuffleHandler</value>
	</property>

	~~~

### Confiuration: mapred-site.xml

By default, the `/opt/hadoop/etc/hadoop/` folder contains the `/opt/hadoop/etc/hadoop/mapred-site.xml.template` file which has to be `renamed/copied` with the name mapred-site.xml. This file is used to specify which framework is being used for MapReduce.

This can be done using the following command:

	$ cp /opt/hadoop/etc/hadoop/mapred-site.xml.template /opt/hadoop/etc/hadoop/mapred-site.xml

Once this is done, Enter the following content in between the `<configuration></configuration>` tag.

{: .hdfs-site.xml}
:	~~~ xml
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>

	~~~

### Formate the Hadoop file system

After completing all the configuration in the above stops, the Hadoop filesystem need to be formated. This is done by executing following command.

	$ hdfs namenode -format

{: .note}
>
> This is only needs to be done once before starting hadoop. If this command executes again after Hadoop has beed startd, it'll destroy all the data on the Hadoop file system.

### Start Hadoop

All that remains to be done is starting the newly installed single node cluster. This is done by executing following command.

	$ start-fds.sh

While executing this command, you'll be prompted twice with a message similar to the following:

	Are you sure you want to continue connecting (yes/no)?

Type in `yes` for both these prompts and press the enter key.

Executing the above two commands will get Hadoop up and running.

### verify Hadoop 

You can verify this by typing in the following command:

	$ jps

Executing this command should show you something similar to the following:

	$ jps
	1778	Jps
	1744	NodeManager
	1752	SecondaryNameNode
	1187	NameNode
	1154	ResourceManager
	2234	dataNode	

If you can see a result similar to the depicted in the above, it means that you now have a functional instance of Hadoop running on your VPS.


### Stop Hadoop

When you're done, stop the daemon with 

	$ stop-dfs.sh




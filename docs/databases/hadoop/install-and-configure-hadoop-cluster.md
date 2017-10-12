---
author:
  name: Florent Houbart
  email: docs@linode.com
description: 'Installation and configuration of a 3 nodes Hadoop cluster'
keywords: 'Hadoop, YARN, HDFS'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Friday, October 13th, 2017'
modified: Monday, October 16th, 2017
modified_by:
  name: Linode
title: 'Installation and configuration of a 3 nodes Hadoop cluster'
contributor:
  name: Florent Houbart
external_resources:
- '[YARN Command Reference](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YarnCommands.html)'
- '[HDFS Shell Documentation](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html)'
- '[core-site.xml properties](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/core-default.xml)'
- '[hdfs-site.xml properties](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml)'
- '[mapred-site.xml properties](https://hadoop.apache.org/docs/current/hadoop-mapreduce-client/hadoop-mapreduce-client-core/mapred-default.xml)'
- '[core-site.xml properties](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-common/yarn-default.xml)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----


# Installation and Configuration of a Three-Node Hadoop Cluster

Hadoop is an Open Source Apache project that allow creation of parallel processing applications on large data sets distributed across networked nodes. It is composed of the **Hadoop Distributed File System (HDFS™)** that take care of scalability and redundancy of data across nodes, and **Hadoop YARN**, a framework for job scheduling that executes tasks on every nodes to process data.

![Hadoop logo](/docs/assets/hadoop/hadoop-1-logo.png)

This guide covers the installation and configuration of Hadoop on a distributed architecture of 3 nodes. It also covers the basic usage of MapReduce operations on sample data.

## Before You Begin

  1.  Follow the [Getting Started](/docs/getting-started) guide to create 3 Linodes. They will be referred to throughout this guide as **node-master**, **node1** and **node2**; it is recommended that you set the hostname of each Linode to match this naming convention.

      {:.note}
      > The instructions in this guide will be run from **node-master** unless otherwise specified.

  2.  Follow the [Securing Your Server](/docs/security/securing-your-server) guide to harden your three servers. Take a particular attention on regular user creation to create an ordinary user for your usage, and a user called *hadoop* for Hadoop daemons. Do **not** create SSH keys for hadoop users; SSH keys will be addressed in a later section.

  3.  Install the JDK using the appropriate guide for your distribution, [Debian](/docs/development/install-java-on-debian), [CentOs](/docs/development/install-java-on-centos) or [Ubuntu](/docs/development/install-java-on-ubuntu-16-04), or grab the latest JDK from Oracle

{: .note}
> The 3 nodes, *node-master*, *node1* and *node2* will be assumed to have IP addresses 192.0.2.1, 192.0.2.2 and 192.0.2.3, respectively. Change them accordingly to your own configuration.

{: .note}
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide. All commands in this guide are run with *hadoop* user if not specified otherwise.


## Architecture of a Hadoop Cluster

Before configuring the master and slave nodes, it's important to understand the different components of a Hadoop cluster:

A **master node**  keeps knowledge about the distributed file system (like the `inode` table on an `ext3` filesystems) and schedules resources allocation. *Node-master* will handle this role in this guide, and host two daemons:

*   The **NameNode**: manages the distributed file system and know where are stored data blocks inside the cluster
*   The **ResourceManager**: manages the YARN jobs and take care of scheduling and execution on slave nodes

**Slave nodes** store the actual data and provide processing power to run the jobs. They will be *node1* and *node2*, and will host two daemons:

*   The **DataNode**: manages the actual data physically stored on the node and is called by the NameNode
*   The **NodeManager**: manages execution of tasks on the node


## Configure the System

### Create Host File on Each Node

For each node to be able to communicate with their names, edit the `/etc/hosts` file to add the IP address of the three servers. Don't forget to replace the sample IP with yours:

  {: .file }
  /etc/hosts
  :   ~~~ conf
      192.0.2.1    node-master
      192.0.2.2    node1
      192.0.2.3    node2
      ~~~~

### Distribute Authentication Key-pairs for the Hadoop User

The master node will use ssh connections to other nodes with key-pair authentication to manage the cluster.

1. Login to *node-master* as *hadoop* user, and generate a key:

	   ssh-keygen -b 4096

2. Then copy the key to other nodes. It is a good practice to also copy the key to *node-master* itself so that you can also use it as a DataNode if needed. Type the following commands, and enter hadoop user password when asked for. If you are prompted to add the key to known hosts, say "yes":

        ssh-copy-id -i $HOME/.ssh/id_rsa.pub hadoop@node-master
        ssh-copy-id -i $HOME/.ssh/id_rsa.pub hadoop@node1
        ssh-copy-id -i $HOME/.ssh/id_rsa.pub hadoop@node2

### Download and Unpack Hadoop Binaries

Login to *node-master* as hadoop user, get the tarball of Hadoop from [Hadoop project page](https://hadoop.apache.org/) and unzip it (change the URL according to your nearest mirror):

	cd
	wget http://apache.mindstudios.com/hadoop/common/hadoop-2.8.1/hadoop-2.8.1.tar.gz
	tar -xzf hadoop-2.8.1.tar.gz
	ln -s hadoop-2.8.1 hadoop

### Set Environment Variables

1. Add Hadoop binaries to your PATH. Edit /home/hadoop/.profile and add the following line:

    {: .file-excerpt }
    /home/hadoop/.profile
    :   ~~~ shell
            PATH=/home/hadoop/hadoop/bin:/home/hadoop/hadoop/sbin:$PATH
        ~~~

## Configure the Master Node

Configuration will be done on the master node, and then replicated to other nodes.

### Set JAVA_HOME

1. Get your Java installation path. If you installed open-jdk from your package manager, you can get the path with the command:

        update-alternatives --display java

    Take the value of the current link, and remove the trailing `/bin/java`. For example on Debian, the link is `/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java`  so JAVA_HOME should be `/usr/lib/jvm/java-8-openjdk-amd64/jre`.

    If you installed java from Oracle, JAVA_HOME is the path where you unzipped the java archive.

2. Edit `~/hadoop/etc/hadoop/hadoop-env.sh` and replace the line:

        export JAVA_HOME=${JAVA_HOME}


    by your actual java installation path, for example on a Debian with open-jdk-8:

    {: .file-excerpt }
    ~/hadoop/etc/hadoop/hadoop-env.sh
    :   ~~~ shell
        export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre
        ~~~


### Set NameNode location

On each nodes, update `~/hadoop/etc/hadoop/core-site.xml` to set the NameNode location to *node-master* on port 9000:

{: .file }
~/hadoop/etc/hadoop/core-site.xml
:   ~~~ xml
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
        <configuration>
            <property>
                <name>fs.default.name</name>
                <value>hdfs://node-master:9000</value>
            </property>
        </configuration>
    ~~~

### Set paths for HDFS

Edit `hdfs-site.conf`:

{: .file }
~/hadoop/etc/hadoop/hdfs-site.xml
:   ~~~ xml
    <configuration>
        <property>
                <name>dfs.namenode.name.dir</name>
                <value>/home/hadoop/data/nameNode</value>
        </property>

        <property>
                <name>dfs.datanode.data.dir</name>
                <value>/home/hadoop/data/dataNode</value>
        </property>

        <property>
                <name>dfs.replication</name>
                <value>1</value>
        </property>
    </configuration>
    ~~~

The last property, `dfs.replication`, indicate how many times data is replicated in the cluster. You can set 2 to have all the data duplicated on the two nodes. Don't put a value higher than your actual number of slave nodes.

### Set YARN as job scheduler

1. In `~/hadoop/etc/hadoop/`, rename `mapred-site.xml.template` to `mapred-site.xml` :

        cd ~/hadoop/etc/hadoop
        mv mapred-site.xml.template mapred-site.xml

2. Edit  it to set yarn as the default framework for MapReduce operations:

      {: .file }
      ~/hadoop/etc/hadoop/mapred-site.xml
      :   ~~~ xml
          <configuration>
              <property>
                      <name>mapreduce.framework.name</name>
                      <value>yarn</value>
              </property>
          </configuration>
          ~~~

### Configure YARN

Edit `yarn-site.xml`:

{: .file }
~/hadoop/etc/hadoop/yarn-site.xml
:   ~~~ xml
    <configuration>
        <property>
                <name>yarn.acl.enable</name>
                <value>0</value>
        </property>

        <property>
                <name>yarn.resourcemanager.hostname</name>
                <value>node-master</value>
        </property>

        <property>
                <name>yarn.nodemanager.aux-services</name>
                <value>mapreduce_shuffle</value>
        </property>
    </configuration>
    ~~~

### Configure slaves

The file `slaves` is used by startup scripts to start required daemons on all nodes. Edit `~/hadoop/etc/hadoop/slaves` to be:

{: .file }
~/hadoop/etc/hadoop/slaves
:   ~~~ text
    node1
    node2
    ~~~

## Configure Memory Allocation

Memory allocation can be tricky on low RAM nodes because default values are not suitable for less than 8Gb RAM nodes. This section will highlight how memory allocation work for MapReduce jobs, and provide sample configuration for 2Gb RAM nodes.

### The Memory Allocation Properties

A YARN job is executed with two kind of resources :

-  An *Application Master* (AM) that is responsible of monitoring the application and coordinating distributed executors in the cluster
- Some executors, that are created by the AM and actually run the job, reporting to the AM. For a MapReduce jobs, they will perform map or reduce operation, in parallel.

Both are run in so called *containers*, on slave nodes. Each slave node run a *NodeManager* daemon that is responsible of containers creation on the node. The whole cluster is manager by a *ResourceManager* that schedule containers allocation on all the slaves node depending on capacity requirements and current charge.

Four kind of resource allocation need to be configured properly for the cluster to work:

1. How much memory can be allocated for YARN containers on a single node. This limit should be higher than all the other, otherwise container allocation will be rejected and applications will fail. However, it should not be all the amount of RAM of the node to let some spaces for OS and other daemons.

    This value is configured in `yarn-site.xml` with `yarn.nodemanager.resource.memory-mb`

2. How much memory a single container can consume, and the minimum memory allocation allowed. A container will never be bigger than the maximum (allocation will fail), and will always be allocated a multiple of the minimum.

    Those values are configured in `yarn-site.xml` with `yarn.scheduler.maximum-allocation-mb` and `yarn.scheduler.minimum-allocation-mb`.

3. How much memory the ApplicationMaster will be allocated. This is a constant value, that should fit in the container maximum size

    This is configured in `mapred-site.xml` with property `yarn.app.mapreduce.am.resource.mb`.

4. How much memory each map or reduce operation will be allocated. Again, this should be less than the container maximum size

    This is configured in `mapred-site.xml` with properties `mapreduce.map.memory.mb` and `mapreduce.reduce.memory.mb`

The relations between all those properties can be seen in the following figure:

![Schema of memory allocation properties](/docs/assets/hadoop/hadoop-2-memory-allocation-wide.png)

### Sample Configuration for 2Gb nodes

For 2Gb nodes, a working configuration may be:

{: .table .table-striped}
| Left-Aligned | Centered |
| ---------------- |:-------------:|
| yarn.nodemanager.resource.memory-mb     | 1536          |
| yarn.scheduler.maximum-allocation-mb| 1536 |
| yarn.scheduler.minimum-allocation-mb| 128 |
| yarn.app.mapreduce.am.resource.mb| 512 |
| mapreduce.map.memory.mb| 256 |
| mapreduce.reduce.memory.mb| 256 |


1. Edit `/home/hadoop/hadoop/etc/hadoop/yarn-site.xml` and add the following lines:

    {: .file }
    ~/hadoop/etc/hadoop/yarn-site.xml
    :   ~~~ xml
        <property>
                <name>yarn.nodemanager.resource.memory-mb</name>
                <value>1536</value>
        </property>

        <property>
                <name>yarn.scheduler.maximum-allocation-mb</name>
                <value>1536</value>
        </property>

        <property>
                <name>yarn.scheduler.minimum-allocation-mb</name>
                <value>128</value>
        </property>

        <property>
                <name>yarn.nodemanager.vmem-check-enabled</name>
                <value>false</value>
        </property>
        ~~~

    The last property disable virtual memory checking that can prevent containers to be allocated properly on JDK8.


2. Edit `/home/hadoop/hadoop/etc/hadoop/mapred-site.xml` and add the following lines:

    {: .file }
    ~/hadoop/etc/hadoop/mapred-site.xml
    :   ~~~ xml
        <property>
                <name>yarn.app.mapreduce.am.resource.mb</name>
                <value>512</value>
        </property>

        <property>
                <name>mapreduce.map.memory.mb</name>
                <value>256</value>
        </property>

        <property>
                <name>mapreduce.reduce.memory.mb</name>
                <value>256</value>
        </property>
        ~~~


## Duplicate configuration files to each nodes

1. Copy hadoop binaries to slave nodes

        cd /home/hadoop/
        scp hadoop-*.tar.gz node1:/home/hadoop
        scp hadoop-*.tar.gz node2:/home/hadoop

2. Connect to node1 via ssh (no password required thanks to the ssh keys copyied above):

        ssh node1

3. Unzip the binaries, rename the directory, and exit node1 to get back on node-master:

        tar -xzf hadoop-2.8.1.tar.gz
        ln -s hadoop-2.8.1 hadoop
        exit

4. Repeat steps 2 and 3 for *node2*

4. Copy hadoop configuration files to slave nodes:

        for node in node1 node2; do
            scp ~/hadoop/etc/hadoop/* $node:/home/hadoop/hadoop/etc/hadoop/;
        done

## Format HDFS

HDFS need to be formatted, like any classical file system. On `node-master`, run the following command:

    hdfs namenode -format

Your Hadoop installation is now configured and ready to run!

## Running and monitoring HDFS

This section will go through starting HDFS on NameNode and DataNodes, monitoring that everything is going as expected, and interacting with HDFS data.

### Starting and Stopping HDFS

1. Start the HDFS by running the following script from *node-master*:

        start-dfs.sh

    It will start **NameNode** and **SecondaryNameNode** on node-master, and **DataNode** on node1 and node2, according to configuration in `slaves` config files.

2. Check that every process are running with the `jps` command on each node. You should get on node-master (PID will be differents):

        21922 Jps
        21603 NameNode
        21787 SecondaryNameNode

    and on node1 and node2:

        19728 DataNode
        19819 Jps

3. To stop HDFS on master and slave nodes, run the following command from *node-master*:

        stop-dfs.sh

### Monitoring your HDFS Cluster

1. You can get useful information about your running HDFS cluster with the `hdfs dfsadmin` command. Try for example:

        hdfs dfsadmin -report

    This will print all running DataNodes with informations like capacit usage. To get the description of all available commands, type:

        hdfs dfsadmin -help

2. You can also use the more friendly web UI started automatically by the NameNode on node-master on port 50070. Point your browser to http://node-master:50070 and you'll get a user friendly monitoring console.

![Screenshot of HDFS Web UI](/docs/assets/hadoop/hadoop-3-hdfs-webui-wide.png)

### Putting and Getting Data to HDFS

Writing and reading to HDFS is done with command `hdfs dfs`. First, create your home directory (this must be done manually). All other commands will use path relative to this default home directory:

    hdfs dfs -mkdir -p /user/hadoop

We will put some text book from Gutenberg project as an example.

1. Create a *books* directory in HDFS. The following command will create it in the home directory, `/user/hadoop/books`:

        hdfs dfs -mkdir books

2. Grab a few books from Gutenberg project:

        cd /home/hadoop
        wget -O alice.txt https://www.gutenberg.org/files/11/11-0.txt
        wget -O holmes.txt https://www.gutenberg.org/ebooks/1661.txt.utf-8
        wget -O frankenstein.txt https://www.gutenberg.org/ebooks/84.txt.utf-8

3. Put the three books to HDFS, in `books`directory:

        hdfs dfs -put alice.txt holmes.txt frankenstein.txt books

4. List the content of the `book` directory:

        hdfs dfs -ls books

5. Get back one of the book to local filesystem:

        hdfs dfs -get books/alice.txt

6. You can also directly print them from HDFS:

        hdfs dfs -cat books/alice.txt

There are lot more commands to manage your HDFS, you can look at the [Apache HDFS shell documentation](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/FileSystemShell.html), or print help with:

    hdfs dfs -help

## Running YARN

HDFS is only a distributed storage system, it does not provide any services for running and scheduling tasks in the cluster. This is the role of the YARN framework. This section is about starting, monitoring and submitting jobs to YARN.

### Starting and Stopping YARN

1. Start YARN with the script:

        start-yarn.sh

2. Check that everything is running with `jps` command. You should see in addition to previous HDFS daemon, a **ResourceManager** on node-master, and a **NodeManager** on node1 and node2.

3. To stop YARN, run the following command on node-master:

        stop-yarn.sh

### Monitoring YARN

1. The `yarn` command provides utilities to manage your YARN cluster, like publishing and running applications. You can also get a report of running nodes with the command:

        yarn node -list

    Similarly, you can get a list of running applications with command:

        yarn application -list

    To get all available parameters of the `yarn` command, see [Apache YARN documentation](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YarnCommands.html).

2. As with HDFS, YARN provides a more friendly web UI, started by default on port 8088 of the ResourceManager. Point your browser to http://node-master:8088 and browse the UI:

![Screenshot of YARN Web UI](/docs/assets/hadoop/hadoop-4-yarn-webui-wide.png)

### Submitting MapReduce Jobs to YARN

Yarn jobs are packaged into jar files and submitted to YARN for execution with the command `yarn jar`. Hadoop installation package provides sample applications that can be run to test your cluster. We will use them to run a word count on the three books we previoulsy upload to HDFS.

1. Submit a job with the sample jar to YARN. On node-master, run:

        yarn jar ~/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.1.jar wordcount "books/*" output

    The last argument is where output of the job will be saved, in HDFS.

2. After the job is finished, you can get the result by querying HDFS with `hdfs dfs -ls output`. In case of success, the output will resemble:

        Found 2 items
        -rw-r--r--   1 hadoop supergroup          0 2017-10-11 14:09 output/_SUCCESS
        -rw-r--r--   1 hadoop supergroup     269158 2017-10-11 14:09 output/part-r-00000

3. Print the result with:

        hdfs dfs -cat output/part-r-00000


## What to Do Next

Now that you have a up and running YARN cluster, you can:

-  Learn how to code your own YARN jobs with [Apache documentation](hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-site/WritingYarnApplications.html)
- Install Spark on top on your YARN cluster with [Linode Spark guide](to/be/confirmed)

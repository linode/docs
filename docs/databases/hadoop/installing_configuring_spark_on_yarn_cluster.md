---
author:
  name: Florent Houbart
  email: docs@linode.com
description: 'Installing, configuring and running Spark on top of a YARN cluster'
keywords: 'Spark, Hadoop, YARN, HDFS'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Friday, October 20th, 2017'
modified: 'Monday, October 23rd, 2017'
modified_by:
  name: Linode
title: 'Installing, configuring and running Spark on top of a YARN cluster'
contributor:
  name: Florent Houbart
  link: Github/Twitter Link
external_resources:
- '[Apache Spark project page](https://spark.apache.org/)'
- '[Apache Hadoop project page](http://hadoop.apache.org/)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----

# Install, configure and Run Spark on Top of a YARN Cluster

Spark is a general purpose cluster computing system. It can deploy and run parallel applications on clusters ranging from a single node to thousands of distributed nodes. Spark was originally designed to run Scala applications, but also supports Java, Python and R.

![Spark logo](/docs/assets/spark/spark-logo.png)

Spark can run as a standalone cluster manager, or by taking advantage of dedicated cluster management frameworks like [Apache Hadoop YARN](https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html) or [Apache Mesos](http://mesos.apache.org/). This guide is about installing, configuring and running Spark applications on top of a Hadoop YARN cluster.


## Before You Begin

1. Follow the [Installation & configuration of a 3 nodes Hadoop cluster](docs/databases/hadoop/install-and-configure-hadoop-cluster) guide to set up your YARN cluster. Master node (HDFS NameNode and YARN ResourceManager) is called *node-master* and slave nodes (HDFS DataNode and YARN NodeManager) are called *node1* and *node2*.

    {: note }
    > The instructions in this guide will be run from **node-master** unless otherwise specified.

2. Be sure you have a `hadoop` user that can access to all cluster nodes with SSH keys without password
.
3. Note the path of your Hadoop installation. This guide assume it is installed in `/home/hadoop/hadoop`. If not, change the path accordingly

{:.note}
> If your Hadoop cluster has been installed with above guide, no further configuration should be needed. Otherwise, change the node names, user and path accordingly.

{: .note}
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Dowload and Install Spark Binaries

Spark binaries are available from [Apache Spark download page](https://spark.apache.org/downloads.html).

1.  Get download URL from Spark download page, download it, and uncompress it.

    For Spark 2.2.0 with Hadoop 2.7 or later, log on `node-master` as `hadoop` user, and run:

        cd /home/hadoop
        wget https://d3kbcqa49mib13.cloudfront.net/spark-2.2.0-bin-hadoop2.7.tgz
        tar -xvf spark-2.2.0-bin-hadoop2.7.tgz
        mv spark-2.2.0-bin-hadoop2.7 spark

2.  Add Spark binaries directory to your `PATH`. Edit `/home/hadoop/.profile` and add the following line:

    For Debian/Ubuntu systems:

    {: .file-excerpt }
    /home/hadoop/.profile
      : ~~~ shell
        PATH=/home/hadoop/spark/bin:$PATH
        ~~~

    For RedHat/Fedora/Centos systems:

    {: .file-excerpt }
    /home/hadoop/.profile
      : ~~~ shell
        pathmunge /home/hadoop/spark/bin
        ~~~

## Integrate Spark with YARN

To communicate with YARN Resource Manager, Spark needs to be aware of Hadoop configuration. This is done via `HADOOP_CONF_DIR` environment variable. The `SPARK_HOME` variable is not mandatory, but is useful when submitting Spark jobs in command line.

1. Edit *hadoop* user profile `/home/hadoop/.profile` and add the following lines:

    {: .file-excerpt }
    /home/hadoop/.profile
      : ~~~ shell
        export HADOOP_CONF_DIR=/home/hadoop/hadoop/etc/hadoop
        export SPARK_HOME=/home/hadoop/spark
        export LD_LIBRARY_PATH=/home/hadoop/hadoop/lib/native:$LD_LIBRARY_PATH
        ~~~

    and then restart your session by logging out and logging in again.

2. Rename the spark default template config file:

        mv $SPARK_HOME/conf/spark-defaults.conf.template $SPARK_HOME/conf/spark-defaults.conf

3. Edit `$SPARK_HOME/conf/spark-defaults.conf` to set master to *yarn*:

    {: .file-excerpt }
    $SPARK_HOME/conf/spark-defaults.conf
      : ~~~
        spark.master    yarn
        ~~~

Spark is now ready to interact with YARN cluster.

## Understand Client and Cluster Mode

Spark jobs can run on YARN in two mode : *cluster* mode and *client* mode. Understanding the difference between the two mode is needed for memory allocation configuration, and to submit jobs as expected.

A Spark job consists of 2 parts : some Spark Executors that run the actual tasks, and a Spark Driver, that schedule the Executors.

-  In **cluster** mode, everything run inside the cluster. You can start a job from your laptop and go away, the job will still go on. In this mode, the Spark Driver is encapsulated inside the YARN Application Master.

-  In **client** mode, the Spark driver runs on the client, like your laptop. If the client stop, the job fails. Spark Executors still run on the cluster, and to schedule everything, a small YARN Application Master is created.

Client mode is well suited for interactive jobs, but application will fail if the client stops. For long running jobs, cluster mode is more appropriate.

## Configure Memory Allocation

Allocation of Spark containers to run in YARN containers may fail if memory allocation is not configured properly. For nodes with less than 4Gb RAM, default configuration is not adequate and may trigger lot of swapping and poor performances, or even failure of application initialization due to lack of memory.

Be sure to understand how Hadoop YARN manages memory allocation before editing Spark memory setting so that your changes are compatible with YARN limits.

{:.note}
> See the memory allocation section of the [Install and Configure a 3-Node Hadoop Cluster](docs/databases/hadoop/install-and-configure-hadoop-cluster) guide for more details on managing your YARN cluster's memory.

### Get Your YARN Containers Maximum Allowed Memory

YARN will reject creation of any container if requested memory is above the maximum allowed. If so, your Spark application won't start.

1. Get the value of `yarn.scheduler.maximum-allocation-mb` in `$HADOOP_CONF_DIR/yarn-site.xml`. This is the maximum allowed value, in Mb, for a single container.

2. Make sure that values for Spark memory allocation, configured below in this section, are below the maximum.

{:.note }
> This guide will use a sample value of 1536 for `yarn.scheduler.maximum-allocation-mb`. If your setting are lower, adjust the following samples with your configuration.

### Configure the Spark Driver Memory Allocation in Cluster Mode

In cluster mode, the Spark Driver runs inside YARN Application Master. The amount of memory requested by Spark at initialization is configured either in conf file, or on command line.

1. In `spark-defaults.conf` file, set the default amount of memory allocated to Spark Driver in cluster mode via `spark.driver.memory` (default to 1G). To set it to 512MB, edit the file:

    {:.file-excerpt }
    $SPARK_HOME/conf/spark-defaults.conf
      : ~~~
        spark.driver.memory    512m
        ~~~

2. On the command line, you can specify the amount of memory requested with `--driver-memory` parameter of `spark-submit`. See below section about application submission for examples.

    {:.note }
    > Values given on command line will overwrite whatever has been set in `spark-defaults.conf`

### Configure the Spark Application Master Memory Allocation in Client Mode

In client mode, the Spark driver will not run on the cluster, so the above configuration will have no effect. A YARN Application Master still needs to be created to schedule the Spark executor, and you can set its memory requirements.

1. Set the amount of memory allocated to Application Master in client mode with `spark.yarn.am.memory` (default to 512M)

    {: .file-excerpt }
    $SPARK_HOME/conf/spark-defaults.conf
      : ~~~
        spark.yarn.am.memory    512m
        ~~~

2. This value can not be set on command line via `spark-submit` parameters.

### Configure Spark Executors Memory Allocation

Spark Executors memory allocation is calculated with two parameters inside `$SPARK_HOME/conf/spark-defaults.conf`:

  1. `spark.executor.memory` set the base memory used in calculation
  2. `spark.yarn.executor.memoryOverhead` is added to the base memory. It defaults to 7% of base memory, with a minimum of 384Mb

{:.note}
> Make sure that Executor requested memory, **including** overhead memory, is below the YARN container maximum size, otherwise Spark application won't initialize.

Example for `spark.executor.memory` of 1Gb , required memory is 1024+384=1408Mo. For 512Mb, required memory will be 512+384=896Mb

To set executor memory to 512Mb, edit `$SPARK_HOME/conf/spark-defaults.conf` and add the following line:

{: .file-excerpt }
$SPARK_HOME/conf/spark-defaults.conf
  : ~~~
    spark.executor.memory          512m
    ~~~


## Submitting Spark Application to YARN Cluster

Applications are submitted with `spark-submit` command. Spark installation package contains sample applications, like parallel calculation of *Pi* number, that we will run in this section.

To run the sample *Pi* calculation, use the following command :

    spark-submit --deploy-mode client \
                   --class org.apache.spark.examples.SparkPi \
                   $SPARK_HOME/examples/jars/spark-examples_2.11-2.2.0.jar 10

The first parameter, `--deploy-mode`, specify which mode to use, `client` or `cluster`.

To run the same application in cluster mode, replace `--deploy-mode client`with `--deploy-mode cluster`.


## Monitoring your Spark Applications

When you submit a job, Spark driver automatically starts a web UI on port 4040 that display information about the application. However, when execution is finished, the Web UI is dismissed with the application driver and cannot be accessed anymore.

Spark provide a History Server that collect applications logs from HDFS and display them in a persistent web UI. The following steps will enable log persistance in HDFS:

1. Edit `$SPARK_HOME/conf/spark-defaults.conf` and add the following lines to enable Spark jobs to log in HDFS

    {: .file-excerpt }
    $SPARK_HOME/conf/spark-defaults.conf
    : ~~~ properties
        spark.eventLog.enabled  true
        spark.eventLog.dir hdfs://node-master:9000/spark-logs
        ~~~

2. Create the log directory in hdfs:

        hdfs dfs -mkdir /spark-logs

3. Configure History Server related properties in `$SPARK_HOME/conf/spark-defaults.conf`:

    {: .file-excerpt }
    $SPARK_HOME/conf/spark-defaults.conf
    : ~~~ properties
        spark.history.provider            org.apache.spark.deploy.history.FsHistoryProvider
        spark.history.fs.logDirectory     hdfs://node-master:9000/spark-logs
        spark.history.fs.update.interval  10s
        spark.history.ui.port             18080
        ~~~

    You may want to use a different update interval than the default 10s. If you specify a bigger interval, you will have some delay between what you see in the History Server and the real time status of your application. If you use a shorter interval, you will increase i/o on the HDFS.

4. Run the History Server:

        $SPARK_HOME/sbin/start-history-server.sh

5. Repeat steps from previous section to start a job with `spark-submit` that will put some logs in HDFS

6.  Access the history server with http://node-master:18080

![Screenshot of Spark History Server](/docs/assets/spark/spark-history-server-wide.png)

## Running the Spark Shell

The Spark shell provides an interactive way to play with your data.

1.  Put some data into HDFS for analysis, like for example *Alice In Wonderland* from Gutemberg project

        cd /home/hadoop
        wget -O alice.txt https://www.gutenberg.org/files/11/11-0.txt
        hdfs dfs -mkdir inputs
        hdfs dfs -put alice.txt inputs

2.  Start the Spark shell

        spark-shell

3.  Use Scala Spark API to analyse data:

        var input = spark.read.textFile("inputs/alice.txt")
        // Count the number of non blank lines
        input.filter(line => line.length()>0).count()

Scala Spark API is beyond the scope of this guide, you can find the official documentation on [Official Apache Spark documentation](https://spark.apache.org/docs/latest/quick-start.html).

## Where to Go Next ?

Now that you have a running Spark cluster, you can:

-  Learn any of the Scala/Java/Python/R API to create Spark applications from [Apache Spark Programming Guide](https://spark.apache.org/docs/latest/rdd-programming-guide.html)
- Interact with your data with [Spark SQL](https://spark.apache.org/docs/latest/sql-programming-guide.html)
- Add machine learning capabilities to your applications with [Apache MLib](https://spark.apache.org/mllib/)

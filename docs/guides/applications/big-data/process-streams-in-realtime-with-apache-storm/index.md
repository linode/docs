---
slug: process-streams-in-realtime-with-apache-storm
title: "Create a Realtime Data Stream with Apache Storm"
title_meta: "Process Streams in Realtime With Apache Storm"
description: "Two to three sentences describing your guide."
authors: ["Martin Heller"]
contributors: ["Martin Heller"]
published: 2024-07-01
keywords: ['realtime stream processing','apache storm 2.5','distributed realtime','computation system','apache storm rabbitmq integration','apache storm kafka integration','apache storm kestrel integration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide explains Apache Storm, and how to create a real-time data stream with it on Linode.

## What is Apache Storm?

[Apache Storm](https://storm.apache.org/) is a distributed stream processing computation framework written predominantly in Clojure, which is a dynamic and functional dialect of the Lisp programming language on the Java platform. In Storm, a *stream* is an unbounded sequence of tuples. Storm processes and creates streams in parallel, in a distributed fashion.

A *topology* is a graph of spouts and bolts that are connected with stream groupings; topologies define the logic that processes streams. A *spout* is a source of streams in a topology. *Bolts* perform all processing in topologies.

Storm integrates with many other systems and libraries, including Apache Kafka, Apache Cassandra, Redis, Amazon Kinesis, Kestrel, RabbitMQ (an open-source message-broker software) / AMQP (Advanced Message Queuing Protocol, the core protocol for RabbitMQ), and JMS (Java Message Service).

## Apache Storm Components

These are Storm’s components.

### Tuples

Storm uses tuples as its main data structure, which are named lists of values of any type. Tuples are dynamically typed and have helper methods to retrieve field values without casting. Storm needs to know how to serialize all tuple values, which it can do for primitives, strings, and byte arrays by default. Other types require a custom serializer.

### Topologies

A Storm topology is a package of logic for a real-time application. It's similar to a MapReduce job but runs indefinitely, unlike MapReduce which finishes eventually. A Storm topology is a graph of spouts and bolts connected by stream groupings, as shown in the diagram below.

[Web Editor: Please use the diagram in the link.]
A Storm Topology. Source: https://storm.apache.org/

### Streams

A stream is a sequence of tuples that is processed in parallel and can contain various data types. A stream has a specified schema that names the fields in the stream's tuples, and can be given a custom ID.

### Spouts, bolts and nodes

A spout is a source of streams in a Storm topology. It reads tuples from an external source and emits them into the topology. Spouts can be either reliable or unreliable. Reliable spouts have the capability to replay a tuple if it fails to be processed, whereas unreliable spouts forget about the tuple as soon as it is emitted.

Bolts are the components in Storm that perform processing tasks. They perform various operations such as filtering, aggregations, joins, and talking to databases. Bolts can transform streams, although complex transformations often require multiple bolts.

Apache Storm has two types of nodes, Nimbus (master node), and Supervisor (worker node). Nimbus is the central component of Storm and is responsible for running Storm topologies, analyzing the topology, and determining which tasks to execute.

The Supervisor node manages worker processes, monitors their health, restarts them if necessary, and ensures they're running correctly. It receives heartbeats from workers, reports to Nimbus, distributes tasks, and handles communication between workers and Nimbus. It acts as a bridge between Nimbus and workers, ensuring tasks are executed correctly and Nimbus has up-to-date task status.

## Defining bolts in other languages

To define [bolts](https://storm.apache.org/releases/2.5.0/Concepts.html) in other languages, use the [multi-language protocol](https://storm.apache.org/releases/current/Multilang-protocol.html). Storm is designed to use the language-independent [Thrift](https://thrift.apache.org/) protocol, so this isn’t a big stretch. Support for multiple languages in Storm is implemented using the **ShellBolt**, **ShellSpout**, and **ShellProcess** classes. These classes implement the **IBolt** and **ISpout** interfaces and use the **ProcessBuilder** class in Java to execute scripts or programs via the shell. The **ShellBolt** class and **IBolt** interface are the ones relevant to bolts. There are additional considerations if you are [using non-JVM languages](https://storm.apache.org/releases/current/Using-non-JVM-languages-with-Storm.html).

## Guarantee Message Processing

Storm offers you several levels of [guaranteed message processing](https://storm.apache.org/releases/current/Guaranteeing-message-processing.html), including *best effort*, and *at least once*. To process a message exactly once, use the [Trident](https://storm.apache.org/releases/current/Trident-tutorial.html) interface on top of Storm.

## How to Create a Message Stream with Apache Storm

Before creating your message stream, [install Apache Storm on Linode](https://www.linode.com/docs/guides/big-data-in-the-linode-cloud-streaming-data-processing-with-apache-storm/). For additional information about installing a cluster, consult the official [Storm setup guide](https://storm.apache.org/releases/2.5.0/Setting-up-a-Storm-cluster.html). You should also [install Storm locally](https://storm.apache.org/releases/2.5.0/Local-mode.html) to simulate a cluster for development and testing purposes.

For this guide, install a Java Development Kit on your local machine. One good site for downloading a JDK is [Adoptium](https://adoptium.net/), which offers prebuilt OpenJDK versions for Linux, macOS, and Windows. The latest stable version of OpenJDK (Temurin 17 as of this writing) works. If you prefer Java 8, download the Oracle version from [Java.com](https://www.java.com/en/download/help/download_options.html).

Even though Storm is written in Java, Python, C, JavaScript, and Clojure, you don't need to install Clojure or C for the purposes of this guide, as you can [download pre-compiled Storm releases](https://storm.apache.org/downloads.html') for your local development environment. Java and Clojure both compile to Java byte-code, so Storm releases contain numerous JAR files in their **/lib** folders.

### Generate a Personal Access/API Token

Follow these [instructions](https://www.linode.com/docs/products/tools/api/guides/manage-api-tokens/) to accomplish this. Start by dropping down the menu under your handle at the top right of the Linode console page, and pick **API Tokens** from the **My Profile** section of the dropdown. Then click on **Create a Personal Access Token**, name your token, and save it to your local machine.

### Set up a Local Development Environment

Download the latest Storm release [here](https://storm.apache.org/downloads.html), then unpack it. (This guide uses Storm 2.5.0; yours might be later.) Add the unpacked **/bin** directory to your PATH. On a MacBook Pro, that requires adding these lines to **.zprofile**:
#Set PATH for Storm
export PATH="/Users/martinheller/Downloads/apache-storm-2.5.0/bin:$PATH"

Open a shell and test the installation:
% storm version

This local version allows you to interact with your remote cluster, once you have created it and saved your configuration locally.

### Create Instances for Zookeeper, Nimbus, and Storm Workers

[Create](https://www.linode.com/docs/products/compute/compute-instances/guides/create/) one 2 GB/1 CPU instance to use for a Zookeeper node, one 4 GB/2 CPU instance to use for a Nimbus node, and two 4 GB/2 CPU instances to use for Storm supervisor (worker) nodes. You can expand the cluster later.

Use descriptive labels for the instances, for example storm-zoo, storm-nimbus, storm-super-1, and storm-super -2. You can also add the tag "storm" to each instance.

Pick the Akamai region that is closest to you, or to the bulk of your users, [as measured by ping times](https://www.linode.com/speed-test/) or, when you are targeting your user population, geographically. This guide's closest region is Newark.

The guide also uses Ubuntu 22.04 LTS. Select the newest long-term support (LTS) version of Ubuntu available when you are going through this guide.

To avoid filling out the whole instance creation form four times, click on "Create Using Command Line" and edit the generated command line in a programming editor or IDE to cover the four instances. If you prefer the GUI, you can also use the ["Clone"](https://www.linode.com/docs/products/compute/compute-instances/guides/clone-instance/) button in the dropdown near the top right of the first instance’s status page to create the subsequent machines while avoiding reentry of some of the details. You can change the instance labels and plans as you go.

Once you can connect to your new nodes via SSH, note all the IP addresses and what role each plays, as shown in the screenshot below, and continue with the next section of this guide. 

Downloading the list of instances as a CSV and using the link below and at the right of the list, is a quick way to grab the IP addresses and labels.

https://www.dropbox.com/scl/fi/6c74tfax820104mqru3nj/storm-instances-Screenshot-2023-10-02-at-1.36.58-PM.png?rlkey=96zkvhhyati87t5kciu0gn6md&dl=0

List of Linode instances for a Storm cluster. You need the public IP addresses (4th column) and the labels (1st column) to configure the cluster. If you have many irrelevant instances showing, you can filter the display by the label or by the tag "storm". This view also shows you the status of your instances.

### Install, Configure, Start, and Test Zookeeper, Nimbus, and Storm

The cluster you’re building is sufficient for development and testing, but is not up to production standards. You can expand it later with all the necessary redundancies; for example, additional instances for Zookeeper and Nimbus, and supervision; for example, using [**supervisord**](http://supervisord.org/).

#### Install Zookeeper

Connect to storm-zoo from a terminal on your local machine using **ssh**. Your IP address is going to vary,  consult your list and make a directory for the Zookeeper download.

For a Windows machine, you can run **scp** and **ssh** in cmd.exe, PowerShell, or Windows Terminal, as long as OpenSSH is installed. If you need to install OpenSSH, go to *Settings* > *Apps* > *Optional Features* and select the *OpenSSH client*.

% ssh root@96.126.104.147
root@96.126.104.147's password:
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-83-generic x86_64)
root@localhost:~# mkdir zoo
root@localhost:~# cd zoo/
root@localhost:~/zoo# pwd
/root/zoo
 
*Download* Zookeeper to your local machine. Start by browsing to the [Zookeeper release page](https://zookeeper.apache.org/releases.html), click the link to the latest stable release, and download that file to your local machine. Then *upload* it to storm-zoo, using a separate terminal session. Note the need for a colon between the IP address and the path in the remote destination in the **scp** command.
 
Downloads % scp apache-zookeeper-3.8.2-bin.tar.gz root@96.126.104.147:/root/zoo/
root@96.126.104.147's password:
apache-zookeeper-3.8.2-bin.tar.gz         	100%   13MB  11.6MB/s   00:01
 
Unpack (untar) Zookeeper on storm-zoo:
 
root@localhost:~/zoo# ls -l
total 13028
-rw-r--r-- 1 root root 13338235 Sep 29 15:15 apache-zookeeper-3.8.2-bin.tar.gz
root@localhost:~/zoo# tar -zxvf apache-zookeeper-3.8.2-bin.tar.gz
apache-zookeeper-3.8.2-bin/docs/
apache-zookeeper-3.8.2-bin/docs/images/
apache-zookeeper-3.8.2-bin/docs/skin/
apache-zookeeper-3.8.2-bin/docs/images/2pc.jpg
apache-zookeeper-3.8.2-bin/docs/images/bk-overview.jpg
apache-zookeeper-3.8.2-bin/docs/images/favicon.ico
apache-zookeeper-3.8.2-bin/docs/images/state_dia.dia
apache-zookeeper-3.8.2-bin/docs/images/state_dia.jpg
…
root@localhost:~/zoo# ls
apache-zookeeper-3.8.2-bin  apache-zookeeper-3.8.2-bin.tar.gz
root@localhost:~/zoo# ls apache-zookeeper-3.8.2-bin
bin  conf  docs  lib  LICENSE.txt  NOTICE.txt  README.md  README_packaging.md

Create a Zookeeper configuration file, `apache-zookeeper-3.8.2-bin/conf/zoo.cfg` in your storm-zoo instance, with the following contents:

```file
tickTime=2000
dataDir=/var/zookeeper
clientPort=2181
```

The **nano** editor is convenient for this task. Copy and paste the three lines above.
 
You also need to create the **/var/zookeeper** directory for data:
root@localhost:~/zoo# mkdir /var/zookeeper
 
Install Java:
root@localhost:~/zoo/# sudo apt-get update
Hit:1 http://mirrors.linode.com/ubuntu jammy InRelease
Get:2 http://mirrors.linode.com/ubuntu jammy-updates InRelease
Get:3 http://mirrors.linode.com/ubuntu jammy-backports InRelease
...
root@localhost:~/zoo/# sudo apt-get install default-jdk
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  alsa-topology-conf alsa-ucm-conf at-spi2-core ca-certificates-java dconf-gsettings-backend dconf-service default-jdk-headless default-jre
...
root@localhost:~/zoo/# java --version
openjdk 11.0.20.1 2023-08-24
OpenJDK Runtime Environment (build 11.0.20.1+1-post-Ubuntu-0ubuntu122.04)
OpenJDK 64-Bit Server VM (build 11.0.20.1+1-post-Ubuntu-0ubuntu122.04, mixed mode, sharing)
 
Start Zookeeper:
root@localhost:~/zoo# apache-zookeeper-3.8.2-bin/bin/zkServer.sh start
/usr/bin/java
ZooKeeper JMX enabled by default
Using config: /root/zoo/apache-zookeeper-3.8.2-bin/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
 
This single-server Zookeeper instance works for development and test purposes. To make this production-ready, upgrade to a [replicated Zookeeper](https://zookeeper.apache.org/doc/r3.3.3/zookeeperStarted.html#sc_RunningReplicatedZooKeeper) cluster and clone the instance, using a slightly longer config file on each node, and setting myid files on each node. Next, implement Zookeeper maintenance and supervision on each node, so that, for example, the servers don’t run out of storage because they fill up with old snapshots and log files, and so that you can detect when Zookeeper fails.

#### Install Java on Nimbus and worker machines

Python is listed as a prerequisite for Storm. Since Ubuntu 22.04 has Python 3.10.12 installed by default, you’re all set for Python.

Installing Java is something you’ve already done for the storm-zoo instance. Now you need to do it for the other three instances:

root@localhost:~/zoo/# sudo apt-get update
Hit:1 http://mirrors.linode.com/ubuntu jammy InRelease
Get:2 http://mirrors.linode.com/ubuntu jammy-updates InRelease
Get:3 http://mirrors.linode.com/ubuntu jammy-backports InRelease
...
root@localhost:~/zoo/# sudo apt-get install default-jdk
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  alsa-topology-conf alsa-ucm-conf at-spi2-core ca-certificates-java dconf-gsettings-backend dconf-service default-jdk-headless default-jre
...
root@localhost:~/zoo/# java --version
openjdk 11.0.20.1 2023-08-24
OpenJDK Runtime Environment (build 11.0.20.1+1-post-Ubuntu-0ubuntu122.04)
OpenJDK 64-Bit Server VM (build 11.0.20.1+1-post-Ubuntu-0ubuntu122.04, mixed mode, sharing)

#### Download and extract a Storm release to Nimbus and worker machines

Since you have the latest Storm tarball to your local machine, use **scp** to upload it to all three instances; use the /tmp directory on each server.
Downloads % scp apache-storm-2.5.0.tar.gz root@17.104.210.138:/tmp
 
Once the tarballs are present, you can unpack (detar) them all:
root@localhost:~# mkdir storm
root@localhost:~# cd storm/
root@localhost:~/storm# tar -zxvf /tmp/apache-storm-2.5.0.tar.gz
 
On each instance, you should be able to list the Storm installation:
root@localhost:~/storm# ls apache-storm-2.5.0/
bin              	external   	lib-tools   licenses  README.markdown
conf             	extlib     	lib-webapp  log4j2	RELEASE
DEPENDENCY-LICENSES  extlib-daemon  lib-worker  NOTICE	SECURITY.md
examples         	lib        	LICENSE 	public

#### Edit the storm configuration and upload to all instances

You already have a Storm installation on your local machine, so you can edit the **conf/storm.yaml** file locally. As discussed [here](https://github.com/apache/storm/blob/master/docs/Setting-up-a-Storm-cluster.md#fill-in-mandatory-configurations-into-stormyaml), you need to specify the actual Zookeeper IP address(es), a local directory for state (for example the **/root/storm** directory you created in the previous step, or a separate **/var/storm** directory), the Nimbus IP address(es), and optionally the ports for Storm workers to use. The default is 4 workers. The Storm supervisor nodes register themselves with Zookeeper when they run, and the Nimbus nodes query Zookeeper.
For this guide’s cluster, the active lines in the YAML file are:
storm.zookeeper.servers:
 	- "96.126.104.147"
nimbus.seeds: ["97.107.130.44"]
storm.local.dir: "/root/storm"

Your IP addresses are going to be different than these.

Use **scp** to upload the completed YAML file to the **/root/storm/apache-storm-2.5.0/conf/** directory on each of the three instances that are going to run Storm.

Downloads % scp apache-storm-2.5.0/conf/storm.yaml root@97.107.130.44:/root/storm/apache-storm-2.5.0/conf
 
After the three uploads, change the local directory specification on your local machine, for example to **~/Downloads/storm**, and create the corresponding directory.

#### (Optional) Install a Supervisor Daemon on the Nodes

[Supervisor](http://supervisord.org/index.html), one of a handful of programs that can start, stop, and automatically restart other processes on Linux and Unix systems, including macOS, is a good choice that ensures Zookeeper and Storm restart when they crash.
 
To install it on your Ubuntu servers:

Connect to each server as **root** with **ssh**.

root@localhost:~# apt install python3-pip
root@localhost:~# pip install supervisor
 
An alternative method is to install **supervisor** with **apt**. This has the advantage of integration with Ubuntu, and the disadvantage that it may install an older version.
 
To configure **supervisord**, create a **supervisord.conf** in [one of the supported directories](http://supervisord.org/configuration.html) and add the Storm or Zookeeper executable to the **program** section, depending on which is installed on that particular instance. [Running supervisord](http://supervisord.org/running.html) starts the server program. Relevant command lines are listed in the next section.
 
Despite similar names, Supervisor (**supervisord**) and Storm Supervisor (**/bin/storm supervisor**) are completely different.

#### Start Storm (optionally under Supervision)

On the two storm-super instances, the command to run Storm as a supervisor daemon is:
root@localhost:~# storm/apache-storm-2.5.0/bin/storm supervisor&

Use ctrl-d to logout and get back your local terminal’s command line.
 
On the storm-nimbus instance, the command to run Storm as a nimbus daemon is:
root@localhost:~# storm/apache-storm-2.5.0/bin/storm nimbus&
Use ctrl-d to logout and get back your local terminal’s command line.
 
You can optionally run the Storm UI web server on the storm-nimbus instance:
root@localhost:~# storm/apache-storm-2.5.0/bin/storm ui&

The web site created by this command defaults to port 8080 and shows the status of the cluster, as in the screenshot below.
https://www.dropbox.com/scl/fi/zjnn1sxi0e4wtbbao4gfd/storm-ui-Screenshot-2023-10-03-at-12.34.04-PM.png?rlkey=059l0dr493ksihxfi41ymeoni&dl=0

#### Storm UI prior to uploading topologies
 
To run Storm [under supervision](https://github.com/apache/storm/blob/master/docs/Setting-up-a-Storm-cluster.md#launch-daemons-under-supervision-using-storm-script-and-a-supervisor-of-your-choice), which is preferred for production with **supervisord**, the command line(s) given above (without the trailing ‘&’) is/are the entry/entries to use under **program-storm** in the **supervisord.conf** file. If you chose a different supervisor program than **supervisord**, such as **systemd** (already installed in Ubuntu 22.04) or [**monit**](https://mmonit.com/monit/), consult the documentation for that program.

### Create the Message Stream Locally

The screenshot above shows no topologies, and therefore has no message streams. You can fix this.

The [storm-starter](https://github.com/apache/storm/blob/master/examples/storm-starter/README.markdown) sample, which is in your **apache-storm-<version>/examples/** directory, contains a variety of Storm topologies, ranging from a very simple, one-spout/two bolt example called **ExclamationTopology.java** to more complicated examples. Review these then move up a directory to the other Storm examples.

If Apache [Maven](https://maven.apache.org/) or [IntelliJ IDEA](https://www.jetbrains.com/idea/) are not installed on your local machine, install the latest stable release of Maven, by downloading the archive, unpacking it, and adding its bin directory to your path. You may need to restart your terminal window to see the update. Test it with:
~ % mvn -v

Get basic documentation with:
~ % mvn -h
 
You can now build a Storm "Uber-Jar" locally. Your **cd** command depends on your current directory, the Storm version, and where you unpacked the **apache-storm-<version>** archive.
~ % cd Downloads/apache-storm-2.5.0/examples/storm-starter
m storm-starter % mvn package
[INFO] Scanning for projects...
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/storm/storm/2.5.0/storm-2.5.0.pom
Downloaded from central: https://repo.maven.apache.org/maven2/org/apache/storm/storm/2.5.0/storm-2.5.0.pom (69 kB at 310 kB/s)
Downloading from central: https://repo1.maven.org/maven2/org/apache/apache/30/apache-30.pom
Downloaded from central: https://repo1.maven.org/maven2/org/apache/apache/30/apache-30.pom (23 kB at 352 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/com/theoryinpractise/clojure-maven-plugin/1.8.4/clojure-maven-plugin-1.8.4.pom
Downloaded from central: https://repo.maven.apache.org/maven2/com/theoryinpractise/clojure-maven-plugin/1.8.4/clojure-maven-plugin-1.8.4.pom (10 kB at 785 kB/s)
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/plugin-tools/maven-plugin-annotations/3.6.0/maven-plugin-annotations-3.6.0.pom

You find the JAR file you built at **examples/storm-starter/target/storm-starter-<storm version>.jar**.
 
### A Basic Topology

There are quite a few samples in the Storm repository, most in Java and some that use other languages. The simplest, [**ExclamationTopology.java**](https://github.com/apache/storm/blob/master/examples/storm-starter/src/jvm/org/apache/storm/starter/ExclamationTopology.java), follows. The **run** method of **ExclamationTopology** defines the topology and sets a few parameters. The **execute** method of **ExclamationBolt** adds three exclamation marks to the word received.
 
/**
 * Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.  The ASF licenses this file to you under the Apache License, Version
 * 2.0 (the "License"); you may not use this file except in compliance with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
 
package org.apache.storm.starter;
 
import java.util.Map;
import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.testing.TestWordSpout;
import org.apache.storm.topology.ConfigurableTopology;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.topology.base.BaseRichBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;
 
/**
 * This is a basic example of a Storm topology.
 */
public class ExclamationTopology extends ConfigurableTopology {
 
	public static void main(String[] args) throws Exception {
    	ConfigurableTopology.start(new ExclamationTopology(), args);
	}
 
	@Override
	protected int run(String[] args) {
    	TopologyBuilder builder = new TopologyBuilder();
 
    	builder.setSpout("word", new TestWordSpout(), 10);
    	builder.setBolt("exclaim1", new ExclamationBolt(), 3).shuffleGrouping("word");
    	builder.setBolt("exclaim2", new ExclamationBolt(), 2).shuffleGrouping("exclaim1");
 
    	conf.setDebug(true);
 
    	String topologyName = "test";
 
    	conf.setNumWorkers(3);
 
    	if (args != null && args.length > 0) {
        	topologyName = args[0];
    	}
 
    	return submit(topologyName, conf, builder);
	}
 
	public static class ExclamationBolt extends BaseRichBolt {
    	OutputCollector collector;
 
    	@Override
    	public void prepare(Map<String, Object> conf, TopologyContext context, OutputCollector collector) {
        	this.collector = collector;
    	}
 
    	@Override
    	public void execute(Tuple tuple) {
        	collector.emit(tuple, new Values(tuple.getString(0) + "!!!"));
        	collector.ack(tuple);
    	}
 
    	@Override
    	public void declareOutputFields(OutputFieldsDeclarer declarer) {
        	declarer.declare(new Fields("word"));
    	}
 
	}
}
 
### Upload to your Storm Cluster and Test

The [**storm jar** command](https://github.com/apache/storm/blob/master/examples/storm-starter/README.markdown#packaging-storm-starter-for-use-on-a-storm-cluster) allows you to pick a topology from the uberjar and submit that to your cluster, or to run it locally with the **-local** flag. For example:
storm-starter % storm jar target/storm-starter-*.jar org.apache.storm.starter.RollingTopWords production-topology
 
If you get an error similar to "`Could not find leader nimbus from seed hosts [97.107.130.44]. Did you specify a valid list of nimbus hosts for config nimbus.seeds?`", one possible fix is to restart Zookeeper. Another is to go into your Linode console and enable port 6627 in the firewall for the **storm-nimbus** instance, or to edit your local **storm.yaml** file to have the correct list of Nimbus seed(s). You may need to restart the Nimbus program on the **storm-nimbus** instance. That’s one of the reasons to run Nimbus, and all other Storm components, under supervision.

## Conclusion

You can create a Storm cluster on Linode using four or more instances. You can define Storm topologies on your local machine, build an "uberjar" from them using Maven, and upload specific topologies from the JAR file to your cluster using the **storm jar** command.
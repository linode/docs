---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to install Apache Spark on Ubuntu'
keywords: 'apache, apache spark, spark, big data'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00th, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
title: 'How to install Apache Spark on Ubuntu'
contributor:
  name: Mani kandan
  link: https://github.com/mani90
  
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

Introduction
============

Apache Spark is a fast and flexible open source distributed engine for large-scalable data processing. Apache spark was originally developed in 2009 in UC Berkeley's AMPLAB and open sourced in 2010 as an apache project.

Apache spark run on Hadoop, Mesos and it can run on both standalone and cloud. It provides in memory comoutations for increase speed and data process over mapreduce. 

Advantages of Apache Spark
------------------------

1. **Speed** -- Apache Sparks enables application in Hadoop cluster to run up to 100x faster in momery and 10x faster even when running on disk.

2. **Supports Multiple Languages** -- Spark provides built-in APIs in Java, Scala, Clojure and Pyhton. So you can write applications in diffrent langulages.

3.  **Sophisticated Analisys** -- Spark supports Sophisticated data Analisys. It not only supports Map-reduce also supports SQL queries, streaming data and ML.

4. **Active Community support.**

Install Apache Spark
--------------------
For running Apache Spark on Ubuntu machine should install Java. Using the following command we can check Java installation.

	$ java -version
    
If Java is not installed in your machine, you should install the latest Java in your machine using following command.

	$ sudo apt-add-repository ppa:webupd8team/java
    $ sudo apt-get update
    $ sudo apt-get install oracle-java7-installer
    
after successful installation of Java you will get following output.

	$ java -version
    java version "1.7.0_71S"
    Java(TM) SE Runtime Environment (build 1.7.0_781-b13) 
    Java HotSpot(TM) Client VM (build 24.0-b02, mixed mode)
    
after this you have to set the environment variable `JAVA_HOME` to point to the base directory location where Java is installed on your machine and append the full path of Java compiler location to the system `PATH` using `export` linux command.    
**Install Scala**

Scala is well known as a general purpose functional programming language. One place where scala is shining right now is the world od Big Data. Spark core is developed using Scala. 

Scala programming language is 10x faster than Python for data analysis and processing. The performance is mediocre when Python programming code is used to make calls to Spark libraries but if there is lot of processing involved than Python code becomes much slower than the Scala equivalent code.

So let us begine Scala installation on Ubuntu.

First download the Scala from [here](http://www.scala-lang.org/download/2.12.1.html). Make sure you have admin privilege to proceed. And now, execute the following command at command prompt.

Now you can copy the downloaded file to the location `/opt/scala/`, untar the file.

	$ wget http://www.scala-lang.org/files/archive/scala-2.12.1.tgz
    $ sudo madir /opt/scala
    $ sudo tar xvf scala-2.12.1.tgz /opt/scala
    
 Now, set path variable and restart bashrc or follow the below commands.

	$ export SCALA_HOME=/opt/scala/scala-2.12.1
    $ export PATH=$PATH:$SCALA_HOME/bin;
    $ . .bashrc
    
To check the Scala is installed successfully, use the below command. It will shows installed Scala version.
	
    $ scala -version

**Download and install Apache Spark**

Download the latest version of Apache Spark by visiting Spark official website or follow this [link](https://spark.apache.org/downloads.html). After downloading it you can see the Spark distribution tar file in *Downloads* folder. The another way of downloading Spark distribution is you can use `wget` linux command also.

	$ wget http://d3kbcqa49mib13.cloudfront.net/spark-2.0.2-bin-hadoop2.7.tgz
    
after Spark successfull download, you have to untar Spark distribution and move to `/opt/spark`

	$ tar xvf spark-2.0.2-bin-hadoop2.7.tgz .
    $ mv spark-2.0.2-bin-hadoop2.7 /opt/spark
    
Set up the environment variable for Spark and restart bashrc for easy access.

	$ export PATH=$PATH:/opt/spark/bin
    $ . .bashrc
    
**Verify the Spark installation**
You can verify Spark installation in two different methods, that is scala shell and python shell. For example below command show how to check Spark using scala shell.

	$ spark-shell --master local[5]
    
The `spark-shell` is located in `/opt/spark/bin` directory. The `--master` option specifies the *master URL of a cluster*, or the `local[n]` to run locally with *n* threads. For full list of options and development document you can follow this [link](https://spark.apache.org/docs/latest/).

And now you're done! You can now run the Apache Spark from the terminal no matter where you are.

More Information
----------------
You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

####[Apache Spark Quick Start](http://spark.apache.org/docs/latest/quick-start.html)#####

####[Apache Spark Documentation](http://spark.apache.org/documentation.html)#####


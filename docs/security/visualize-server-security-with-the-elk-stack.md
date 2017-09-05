---
 author:
 name: Linode Community
 email: docs@linode.com
description: 'Utilizing the ELK Stack (ElasticSearch, Logstash, and Kibana), security data and threat alerts can be collected, logged, and visualized with the integration of Wazuh, a branch of the OSSEC Intrusion Detection System.'
keywords: 'ossec, elk stack, elk, ossec-hids'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published:
modified:
modified_by:
  name: Linode
title: 'Visualize Server Security With The ELK Stack'
contributor:
   name: Andrew Lescher
   link: [Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)
external_resources:
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

In this tutorial, you will learn how to Install and link together ElasticSearch, Logstash, Kibana, and Wazuh OSSEC to aid in monitoring and visualizing security threats to your machine. The resulting structure can be broken down into four core components:

    **ElasticSearch**

        - Essentially the heart of the ELK Stack, Elasticsearch provides powerful search and analytical capabilities. It's purpose in the ELK Stack is to centrally store and retrieve data collected by Logstash.

    **Logstash**

        - Ingests data from multiple sources and passes it along to a central database (Elasticsearch) 

    **Kibana**

        - A self-hosted, web based tool which provides a multitude of methods to visualize and represent data stored in Elasticsearch.

    **Wazuh OSSEC**

        - An open source branch of the orignal OSSEC HIDS developed for integration into the ELK Stack. Wazuh provides the OSSEC software with the OSSEC ruleset, aw well as a RESTful API Kibana plugin optimized for displaying and analyzing host IDS alerts.

## Before You Begin

1. Working through this tutorial requires the use of a limited user account. If you have yet to create one, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

{: .note}
> Some of the commands below require elevated privilidges to execute, and must be prefixed with `sudo` when necessary.

# Install Solr

While various ways of installing Solr exist, downloading from the Apache website ensures you will receive the latest version.

## Update System And Install Pre-requisites

1. Update system packages.

    **Debian & Ubuntu**

        apt update -y && apt upgrade -y

    **Fedora & RHEL based**

        yum update -y && yum upgrade -y

    **Arch Linux**

        pacman -Syyu

    **openSUSE**

        zypper up

2. Install Java 8 JDK.

    **Debian & Ubuntu**

    1. Add the Java 8 repository, download the gpg key, and install Java 8. 

            echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee /etc/apt/sources.list.d/webupd8team-java.list

            echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list

            apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886

            apt update

            apt install oracle-java8-installer 

    2. In most systems, the *oracle-java8-set-default* package will also be downloaded and installed. To verify, run the following command and check for matching output. If your output does not match, continue to step 3. Otherwise, Java 8 installation is complete.

            dpkg --list | grep oracle

    *Output*
        
        ii  oracle-java8-installer        8u144-1~webupd8~0            all          Oracle Java(TM) Development Kit (JDK) 8
        ii  oracle-java8-set-default      8u144-1~webupd8~0            all          Set Oracle JDK 8 as default Java

    3. Install the *oracle-java8-set-default* package.

        apt install oracle-java8-set-default

    **Fedora & RHEL based**

        yum install java-1.8.0-openjdk.x86_64

    **Arch Linux**

        pacman -S jre8-openjdk 

    **openSUSE**

        zypper in java-1_8_0-openjdk

    Once Java is installed, verify the installation by running the following command:

        java -version

    Your output should be similar to the lines below:

    *Output*

        openjdk version "1.8.0_144"
        OpenJDK Runtime Environment (IcedTea 3.5.1) (suse-13.3-x86_64)
        OpenJDK 64-Bit Server VM (build 25.144-b01, mixed mode)

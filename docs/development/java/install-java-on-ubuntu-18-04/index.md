---
author:
  name: Linode Community
  email: docs@linode.com
description: Install the Oracle Java Development Kit on Ubuntu Bionic Beaver.
keywords: ["java", "oracle", "openjdk", "jdk"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/development/install-java-on-ubuntu-18-04/','development/install-java-on-ubuntu-18-04/']
modified: 2019-01-23
modified_by:
  name: Linode
published: 2017-05-30T00:00:00.000Z
title: Install Oracle Java SE Development Kit 11 on Ubuntu
contributor:
  name: Phil Zona
  link: 'https://github.com/pbzona'
audiences: ["beginner"]
languages: ["java"]
---

[Java](https://www.oracle.com/java/index.html) is one of the world's most popular programming languages and can be used to create anything from software to basic web applications. Java was orginally developed within Sun Microsystems which was subsequently bought by Oracle, so it's Oracle's Java platform which is usually the first which come to mind. There are others, however, such as [IBM Runtime](https://www.ibm.com/ca-en/marketplace/support-for-runtimes), [Red Hat](https://developers.redhat.com/products/openjdk/overview/), and [Zulu](https://www.azul.com/products/zulu-enterprise/).

Oracle has updated the JDK license with the release of version 11 to be significantly different than previously. In short, Oracle JDK is a paid commercial license but free for development use.

It is Oracle's [OpenJDK](https://jdk.java.net/11) whhich is GPL licensed, and with exception to [cosmetic and packaging differences](https://blogs.oracle.com/java-platform-group/oracle-jdk-releases-for-java-11-and-later), the two development kits are identical. See Oracle's Java [download page and license](https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html) to further help decide which version is appropriate for you.

This guide demonstrates installing Oracle's Java Standard Edition Development Kit (Oracle JDK) on Ubuntu 18.04. Installing OpenJDK is also explained for a free and open source alternative.


## Before You Begin

- You will need root access to your Linode, or a [limited user account](/docs/security/securing-your-server/#add-a-limited-user-account) with `sudo` privilege.

- Update your system.

        sudo apt update && sudo apt upgrade


## Install Oracle JDK


The Linux Uprising [Oracle Java PPA](https://launchpad.net/~linuxuprising/+archive/ubuntu/java) contains packages with install scripts to download and install Oracle JDK from Oracle's website. Alternatively, you can manually [download the binaries](https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html).

1.  Add the PPA to Ubuntu. Apt will automatically refresh the package cache.

        sudo add-apt-repository ppa:linuxuprising/java

1. Install the JDK. You'll be asked to agree to the licensing terms.

        sudo apt install oracle-java11-installer

1.  If you want Oracle JDK as the system default, install `oracle-java11-set-default`:

        sudo apt install oracle-java11-set-default

1.  You can check the install was successful with `java -version`:

    {{< output >}}
root@ubuntu:~# java -version
java version "11.0.2" 2018-10-16 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.2+7-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.2+7-LTS, mixed mode)
{{< /output >}}


1.  Reload `/etc/profile` or log out of your system and back in so the Java environment variables are set:

        source /etc/profile

    {{< output >}}
root@ubuntu:~# echo $JAVA_HOME
/usr/lib/jvm/java-11-oracle
{{< /output >}}


## Install Oracle OpenJDK

OpenJDK includes a runtime environment and compiler which allows you to develop your own Java applications and run them on your Linode. If you only need to run Java applications which you've already downloaded, you can save some disk space by installing only the Java runtime environment. Both are available from Ubuntu's repository.

- Install OpenJDK 11:

        sudo apt install openjdk-11-jdk

- Install OpenJRE 11:

        sudo apt install openjdk-11-jre
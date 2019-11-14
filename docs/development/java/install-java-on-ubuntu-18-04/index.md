---
author:
  name: Linode Community
  email: docs@linode.com
description: Install the Oracle Java Development Kit on Ubuntu Bionic Beaver.
keywords: ["java", "oracle", "openjdk", "jdk"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/development/install-java-on-ubuntu-18-04/','development/install-java-on-ubuntu-18-04/']
modified: 2019-01-28
modified_by:
  name: Linode
published: 2017-05-30
title: How To Install Oracle Java SE Development Kit 11 on Ubuntu 18.04
h1_title: Installing Oracle Java SE Development Kit 11 on Ubuntu 18.04
contributor:
  name: Phil Zona
  link: 'https://github.com/pbzona'
audiences: ["beginner"]
languages: ["java"]
---

[Java](https://www.oracle.com/java/index.html) is one of the world's most popular programming languages and can be used to create anything from software to basic web applications. Java was originally developed at Sun Microsystems, which was bought by Oracle. For this reason, Oracle's Java platform is the most well known. However, there are other such as [IBM Runtimes](https://www.ibm.com/us-en/marketplace/support-for-runtimes), [Red Hat's Open JDK](https://developers.redhat.com/products/openjdk/overview/), and [Zulu](https://www.azul.com/products/zulu-enterprise/).

With the release of version 11, Oracle has updated the JDK license to be significantly different from previous versions. Oracle JDK is now a paid commercial license, but free for development use.

Oracle's [OpenJDK](https://jdk.java.net/11) is GPL licensed. With the exception of [cosmetic and packaging differences](https://blogs.oracle.com/java-platform-group/oracle-jdk-releases-for-java-11-and-later), the OpenJDK and Java SE (Standard Edition) development kits are identical. See Oracle's Java [download page and license](https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html) to further decide which version is appropriate for you.

This guide demonstrates installing Oracle's Java Standard Edition Development Kit (Oracle JDK) on Ubuntu 18.04. Installing OpenJDK is also explained for a free and open source alternative.


## Before You Begin

- You will need root access to your Linode, or a [limited user account](/docs/security/securing-your-server/#add-a-limited-user-account) with `sudo` privileges.

- Connect to your Linode using a remote desktop sharing system such as a VNC. For more information, see [Install VNC on Ubuntu 18.04](/docs/applications/remote-desktop/install-vnc-on-ubuntu-18-04/) guide.

- Create an Oracle account and download Oracle JDK 11 .tar.gz [archive] (https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html). Ensure that the Oracle JDK version is the same as the oracle-java11-installer-local [package version] (https://launchpad.net/~linuxuprising/+archive/ubuntu/java/+packages).


## Install Oracle JDK

The Linux Uprising [Oracle Java PPA](https://launchpad.net/~linuxuprising/+archive/ubuntu/java) uses packages that include install scripts to install the Oracle JDK.

1.  Update your system:

        sudo apt update && sudo apt upgrade

1.  Check that SHA256 checksum of the binary you downloaded matches the [checksum](https://www.oracle.com/webfolder/s/digest/11-0-5-checksum.html):

        cd Downloads/
        sha256sum jdk-11.0.5_linux-x64*

1.  Create a `/var/cache/oracle-jdk11-installer-local/` folder, and copy the Oracle JDK 11 .tar.gz from `Downloads` folder to this folder.

        sudo mkdir -p /var/cache/oracle-jdk11-installer-local/
        sudo cp jdk-11.0.5_linux-x64_bin.tar.gz /var/cache/oracle-jdk11-installer-local/

1.  Add the PPA to Ubuntu. Apt will automatically refresh the package cache.

        sudo add-apt-repository ppa:linuxuprising/java
        sudo apt-get update

1.  Install the oracle JDK.

        sudo apt install oracle-java11-installer-local

1.  If you want Oracle JDK as the system default, install `oracle-java11-set-default-local`:

        sudo apt install oracle-java11-set-default-local

1.  Check that the install was successful with the following command:

        java --version

    {{< output >}}
root@ubuntu:~# java --version
java version "11.0.5" 2019-10-15 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.5+10-LTS)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.5+10-LTS, mixed mode)
{{< /output >}}


1.  Reload `/etc/profile` or log out of your system and back in to set the Java environment variables:

        source /etc/profile

    {{< output >}}
root@ubuntu:~# echo $JAVA_HOME
/usr/lib/jvm/java-11-oracle
{{< /output >}}


## Install Oracle OpenJDK

OpenJDK includes a runtime environment and compiler which allows you to develop your own Java applications and run them on your Linode. If you only need to run Java applications which you've already downloaded, you can save some disk space by only installing the Java runtime environment. Both are available from Ubuntu's repository.

- Install OpenJDK 11:

        sudo apt install openjdk-11-jdk

- Install OpenJRE 11:

        sudo apt install openjdk-11-jre

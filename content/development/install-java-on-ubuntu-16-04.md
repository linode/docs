---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install the Oracle Java development kit'
keywords: ["oracle", "java", "JDK", "install java", "ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/development/install-java-on-ubuntu-16-04/']
modified: 2017-05-30
modified_by:
  name: Phil Zona
published: 2017-05-30
title: 'Install Java on Ubuntu 16.04'
contributor:
  name: Phil Zona
  link: https://github.com/pbzona
external_resources:
 - '[Oracle Java](https://www.oracle.com/java/index.html)'

---

![Java](/docs/assets/Install_Oracle_Java.jpg)

[Java](https://www.oracle.com/java/index.html) is one of the world's most popular programming languages. Java can be used to create anything from software to basic web applications.

In this guide, we'll install the Oracle Java development kit for building Java applications. We'll also cover OpenJDK, an open-source alternative to the Oracle Java development kit.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install Oracle JDK

The Oracle JDK, includes a development environment for building applications with the Java programming language. Please be aware that some elements of the Oracle JDK are proprietary, meaning that there may be licensing implications with respect to applications you develop with it.

1.  Install the `software-properties-common` package if you don't already have it. This provides an easier way to add new repositories:

        sudo apt-get install software-properties-common

2.  Add the Java PPA:

        sudo add-apt-repository ppa:webupd8team/java

    {{< note >}}
This repository is *not* maintained by Oracle. It does not contain actual Java files, but does allow us to download installers for Oracle Java software. Before using the installers, you'll be prompted to accept a license agreement, which can be found in its entirety [here](http://www.oracle.com/technetwork/java/javase/terms/license/index.html).
{{< /note >}}

3.  Update the local package cache:

        sudo apt-get update

4.  Install the metapackage:

        sudo apt-get install oracle-java8-installer

    This package will run an installer for The Oracle JDK 8, which is the current stable release. You may also replace `java8` in the package name with `java7` or `java9` to install different versions, although these releases are not recommended for development.

5.  Verify that Java and the Java compiler have been properly installed:

        java -version
        javac -version

    As of this publication, these commands should return the following:

        java version "1.8.0_131"
        Java(TM) SE Runtime Environment (build 1.8.0_131-b11)
        Java HotSpot(TM) 64-Bit Server VM (build 25.131-b11, mixed mode)

        javac 1.8.0_131

6.  Since the PPA only provides an installer, and not updates for the JDK itself, you may want to delete it when you're finished in order to keep your repositories organized:

        sudo add-apt-repository -r ppa:webupd8team/java

## Set JAVA_HOME

Many applications include code or configuration that references the `JAVA_HOME` environment variable. This variable points them to the Java binary file, allowing them to run Java code.

1.  To set the variable for your system:

        echo "JAVA_HOME=$(which java)" | sudo tee -a /etc/environment

2.  Reload your system's environment variables:

        source /etc/environment

3.  Verify the variable was set correctly:

        echo $JAVA_HOME

    This should return the path to the Java binary.

## OpenJDK

The above installation methods allow you to use the Oracle JDK, which is be bound by licensing terms and includes proprietary components. OpenJDK provides an open-source alternative that is just as easy to install.

To install OpenJDK:

    sudo apt-get install openjdk-8-jdk

The installation will provide you with the OpenJDK, which includes a runtime environment and compiler. This allows you to develop your own Java applications and run them on your Linode.

However, if you only need to run applications that you've already downloaded, you can save a bit of disk space by installing the OpenJRE (Java runtime environment):

    sudo apt-get install openjdk-8-jre

Note that this is unnecessary if you've installed OpenJDK, since it includes the JRE.

{{< caution >}}
OpenJDK and Oracle Java are *not* identical. There may be licensing, performance, and stability differences, and this should be considered carefully when developing production applications.
{{< /caution >}}

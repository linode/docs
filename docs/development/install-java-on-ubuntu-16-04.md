---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install the Oracle Java development kit'
keywords: 'oracle,java,JDK,install java,ubuntu'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, May 22nd, 2014'
title: Install Java on Ubuntu 16.04
contributor:
  name: Phil Zona
  link: https://github.com/pbzona
external_resources:
 - '[Oracle Java](https://www.oracle.com/java/index.html)'
---

[Java](https://www.oracle.com/java/index.html) is one of the world's most popular programming languages. It can be used to create applications ranging from IoT software to basic web applications, and has consistenly shown to be a high-demand skill in the tech industry.

In this guide, we'll learn to install the Oracle Java development kit for building Java applications. We'll also cover OpenJDK, an open-source alternative.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install Oracle JDK

The Oracle JDK, or *Java Development Kit*, includes a development environment for building applications with the Java programming language. Please be aware that some elements of the Oracle JDK are proprietary, meaning that there may be licensing implications with respect to applications you develop with it.

1.  Install the `software-properties-common` package if you don't already have it. This provides an easier way to add new repositories:

        sudo apt-get install software-properties-common

2.  Add the Java PPA:

        sudo add-apt-repository ppa:webupd8team/java

    {: .note}
    > This repository is *not* maintained by Oracle. It does not contain actual Java files, but does allow us to download installers for Oracle Java software. Before using the installers, you'll be prompted to accept a license agreement, which can be found in its entirety [here](http://www.oracle.com/technetwork/java/javase/terms/license/index.html).

3.  Update the local package cache:

        sudo apt-get update

4.  Install the metapackage:

        sudo apt-get install oracle-java8-installer

    This package will run an installer for The Oracle JDK 8, which is the current stable release. You may also replace `java8` in the package name with `java7` or `java9` to install different versions, although these releases are not recommended for development.

## Set JAVA_HOME

1.  Many applications use the `JAVA_HOME` environment variable to determine where Java is installed. To find your installation location:

        which java

    Copy the output and open the `/etc/environment` file in a text editor. Add the following line to the end of the file:

    {: .file-excerpt}
    /etc/environment
    :   ~~~
        JAVA_HOME=/usr/bin/java
        ~~~

    Replace `/usr/bin/java` with the path to the binary you copied previously, if it's different. Save and exit the file.

2.  Reload your system's environment variables:

        source /etc/environment

3.  To test whether the variable was set correctly:

        echo $JAVA_HOME

    This should return the path to the Java binary.

## OpenJDK

The above installation methods allow you to use the Oracle JDK, which is be bound by licensing terms and includes proprietary components. Fortunately, OpenJDK provides an open-source alternative that is just as easy to install.

To install OpenJDK:

    sudo apt-get install openjdk-8-jdk

{: .caution}
> OpenJDK and Oracle Java are *not* identical. There may be licensing, performance, and stability differences, and this should be considered carefully when developing production applications.

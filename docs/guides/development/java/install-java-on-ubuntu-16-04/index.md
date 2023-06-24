---
slug: install-java-on-ubuntu-16-04
description: 'This guide shows how to install the OpenJDK 8 runtime environment to support Java app execution and development on a Linode running Ubuntu version 16.04.'
keywords: ["oracle", "java", "JDK", "install java", "ubuntu"]
tags: ["java","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/development/install-java-on-ubuntu-16-04/','/applications/development/install-java-on-ubuntu-16-04/','/development/java/install-java-on-ubuntu-16-04/']
modified: 2017-05-30
modified_by:
  name: Phil Zona
published: 2017-05-30
title: 'Install Java on Ubuntu 16.04'
external_resources:
 - '[Oracle Java](https://www.oracle.com/java/index.html)'
 - '[Read the FAQ](https://www.oracle.com/technetwork/java/javase/overview/oracle-jdk-faqs.html)'
 - '[from Oracle](https://www.oracle.com/technetwork/java/javase/overview/oracle-jdk-faqs.html)'
audiences: ["beginner"]

languages: ["java"]
relations:
    platform:
        key: install-java
        keywords:
            - distribution: Ubuntu 16.04
authors: ["Phil Zona"]
---

![Java](Install_Oracle_Java.jpg)

[Java](https://www.oracle.com/java/index.html) is one of the world's most popular programming languages. Java can be used to create anything from software to basic web applications.

In this guide, we'll install the Oracle Java development kit for building Java applications. We'll also cover OpenJDK, an open-source alternative to the Oracle Java development kit.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install OpenJDK

The OpenJDK, includes an open-source runtime environment and compiler. This allows you to develop your own Java applications and run them on your Linode.

{{< note respectIndent=false >}}
This "Main" repository is maintained by Canonical, the company that maintains Ubuntu.
{{< /note >}}

1.  Install the "Main" repository with apt:

        sudo apt-get update

2.  Install OpenJDK 8:

        sudo apt-get install openjdk-8-jdk

    This package will run an installer for The OpenJDK 8, which is the latest LTS version available for Ubuntu 16.04 release.

3.  Verify that Java and the Java compiler have been properly installed:

        java -version
        javac -version

    As of this publication, these commands should return the following:

        java version "1.8.0_212"
        OpenJDK Runtime Environment (build 1.8.0_212-8u212-b03-0ubuntu1.16.04.1-b03)
        OpenJDK 64-Bit Server VM (build 25.212-b03, mixed mode)

        javac 1.8.0_212

However, if you only need to run applications that you’ve already downloaded, you can save a bit of disk space by installing the OpenJRE (Java runtime environment):

    sudo apt-get install openjdk-8-jre

Note that this is unnecessary if you’ve installed OpenJDK, since it includes the JRE.

## Set Java Home Environment

Many applications include code or configuration that references the `JAVA_HOME` environment variable. This variable points them to the Java binary file, allowing them to run Java code.

1.  To set the variable for your system:

        echo "JAVA_HOME=$(which java)" | sudo tee -a /etc/environment

2.  Reload your system's environment variables:

        source /etc/environment

3.  Verify the variable was set correctly:

        echo $JAVA_HOME

    This should return the path to the Java binary.

## Oracle JDK

{{< note type="alert" respectIndent=false >}}
In April 2019, Oracle Java downloads now require logging into an Oracle account to download and update Java 8 due to a change in the Oracle JDK licensing terms. [Read the FAQ](https://www.oracle.com/technetwork/java/javase/overview/oracle-jdk-faqs.html) for more details.
{{< /note >}}

Due to the new Oracle agreement and login requirements The PPA to install Oracle JDK 8 is Discontinued. Official note from the PPA:

    The new Oracle Technology Network License Agreement for Oracle Java SE is substantially different from prior Oracle JDK licenses. The new license permits certain uses, such as personal use and development use, at no cost -- but other uses authorized under prior Oracle JDK licenses may no longer be available. Please review the terms carefully before downloading and using this product. An FAQ is available [from Oracle](https://www.oracle.com/technetwork/java/javase/overview/oracle-jdk-faqs.html).

    Oracle Java downloads now require logging in to an Oracle account to download Java updates, like the latest Oracle Java 8u211 / Java SE 8u212. Because of this I cannot update the PPA with the latest Java (and the old links were broken by Oracle).

    For this reason, THIS PPA IS DISCONTINUED (unless I find some way around this limitation).
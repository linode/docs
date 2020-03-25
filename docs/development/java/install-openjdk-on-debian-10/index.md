---
author:
  name: Linode Community
  email: docs@linode.com
description: Install Java Development Kit on Debian.
og_description: Install Java Development Kit on Debian.
keywords: ["java", "openjdk", "jdk", "Debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-03-25
modified_by:
  name: Linode
published: 2020-03-25
title: How To Install Java Development Kit 11 on Debian 10
h1_title: Installing Java Development Kit 11 on Debian 10
contributor:
  name: Rajakavitha Kodhandapani
audiences: ["beginner"]
languages: ["java"]
---

Java is a powerful programming language. Software written in Java can be compiled and run on any system. Unlike Python or C, Java does not come pre-installed on Linode distribution images. This guide installs the OpenJDK 11 runtime environment and development kit in Debian 10. OpenJDK is the free and open-source implementation of the Java SE Development Kit.

This guide demonstrates installing OpenJDK, an open-source alternative to the Oracle Java development kit on Ubuntu 18.04.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install OpenJDK

The OpenJDK, includes an open-source runtime environment and compiler. This allows you to develop your own Java applications and run them on your Linode.

1.  Install OpenJDK 11:

        sudo apt-get install openjdk-11-jdk

    This package will run an installer for The OpenJDK 11, which is the latest LTS version available for Debian 10 release.

3.  Verify that Java and the Java compiler have been properly installed:

        java -version
        javac -version

    As of this publication, these commands should return the following:

        openjdk version "11.0.6" 2020-01-14
        OpenJDK Runtime Environment (build 11.0.6+10-post-Debian-1deb10u1)
        OpenJDK 64-Bit Server VM (build 11.0.6+10-post-Debian-1deb10u1, mixed   mode, sharing)


        javac 11.0.6

{{< note >}} This step is not required if you’ve installed OpenJDK, because it includes the JRE. {{< /note >}}

However, if you only need to run applications that you’ve already downloaded, you can save a bit of disk space by installing the OpenJRE (Java runtime environment):

    sudo apt-get install openjdk-11-jre

## Set Java Home Environment

Many applications include code or configuration that references the `JAVA_HOME` environment variable. This variable points to the Java binary file, allowing applications to run Java code.

1.  To set the variable for your system:

        echo "JAVA_HOME=$(which java)" | sudo tee -a /etc/environment

2.  Reload your system's environment variables:

        source /etc/environment

3.  Verify the variable was set correctly:

        echo $JAVA_HOME

    This should return the path to the Java binary.

## Testing Java Installation (Optional)

To test the java installation you can write a sample `hello_world` java code.

1. Open a text editor and add the following lines in the `hello_world.java` file:

    {{< file "hello_world.java" java >}}
public class helloworld {
public static void main(String[] args) {
System.out.println("Hello Java World!");
}
}
    {{< /file >}}

1. Run the code:

        $ java hello_world.java

    If the installation is successful, the output is:

        Hello Java World!

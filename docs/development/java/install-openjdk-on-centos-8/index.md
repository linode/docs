---
author:
  name: Linode Community
  email: docs@linode.com
description: Install Java Development Kit on CentOS.
og_description: Install Java Development Kit on CentOS.
keywords: ["java", "openjdk", "jdk", "CentOS"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-03-25
modified_by:
  name: Linode
published: 2020-03-25
title: How To Install Java Development Kit 11 on CentOS 8
h1_title: Installing Java Development Kit 11 on CentOS 8
contributor:
  name: Rajakavitha Kodhandapani
audiences: ["beginner"]
languages: ["java"]
---

Java is a powerful programming language. Software written in Java can be compiled and run on any system. Unlike Python or C, Java does not come pre-installed on Linode distribution images. This guide installs the OpenJDK 11 runtime environment and development kit in CentOS 8. OpenJDK is the free and open-source implementation of the Java SE Development Kit.

This guide demonstrates installing OpenJDK, an open-source alternative to the Oracle Java development kit on CentOS 8.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo yum update

## Install OpenJDK

The OpenJDK, includes an open-source runtime environment and compiler. This allows you to develop your own Java applications and run them on your Linode.


1.  Install OpenJDK 11:

        sudo yum install java-11-openjdk-devel

    This package will run an installer for The OpenJDK 11, which is the latest LTS version available for CentOS 8 release.

3.  Verify that Java and the Java compiler have been properly installed:

        java -version
        javac -version

    As of this publication, these commands should return the following:

        openjdk version "11.0.5" 2019-10-15 LTS
        OpenJDK Runtime Environment 18.9 (build 11.0.5+10-LTS)
        OpenJDK 64-Bit Server VM 18.9 (build 11.0.5+10-LTS, mixed mode, sharing)


        javac 11.0.5

{{< note >}} This step is not required if you’ve installed OpenJDK, because it includes the JRE. {{< /note >}}

However, if you only need to run applications that you’ve already downloaded, you can save a bit of disk space by installing the OpenJRE (Java runtime environment):

    sudo yum -y install java-11-openjdk

## Set Java Home Environment

Many applications include code or configuration that references the `JAVA_HOME` environment variable. This variable points to the Java binary file, allowing applications to run Java code.

1.  To set the variable for your system, open a text editor and create `java11.sh` file by adding the following lines in the `/etc/profile.d/java11.sh` file:

    {{< file "java11.sh" sh>}}
    export JAVA_HOME=\$(dirname \$(dirname \$(readlink \$(readlink \$(which javac)))))
    export PATH=\$PATH:\$JAVA_HOME/bin
    export CLASSPATH=.:\$JAVA_HOME/jre/lib:\$JAVA_HOME/lib:\$JAVA_HOME/lib/tools.jar
    {{< /file >}}

2.  Reload your system's environment variables:

        source /etc/profile.d/java11.sh

3.  Verify the variable was set correctly:

        echo $JAVA_HOME

    This should return the path to the Java binary.

## Testing Java Installation (Optional)

To test the java installation you can write a sample `hello_world` java code.

1. Open a text editor and add the following lines in the *hello_world.java* file:

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

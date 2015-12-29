---
author:
    name: 'Sean Webber'
    email: 'swebber@yazzielabs.com'
description: 'Installing the Java Runtime Environment + Developer Kit on Ubuntu 14.04 LTS'
keywords: '14.04,Java,JAVA_HOME,OpenJDK,OpenJRE,LTS,Ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'N/A'
modified: 'Sunday, December 6th, 2015'
title: 'Installing Java on Ubuntu 14.04'
contributor:
    name: 'Sean Webber'
    link: 'https://github.com/seanthewebber'
---

## Introduction

Java is a programming language and software platform based on C and C++ maintained by Oracle. It is widely used by fortune 500 companies, hobbyists, and professional programmers alike. Thus, you probably came here because you tried to install a package that requires Java to run.

This tutorial will guide you through installing the Java Runtime Environment and (optionally) Java Development Kit.

## Prerequisites

1. You need a Linode server running Ubuntu 14.04 to follow this tutorial. We recommend following our [Getting started](/docs/getting-started) guide if you need help setting up your Linode.

2. Before continuing, make sure you actually need to install Java. Environment variables and directory structures sometimes go array, causing programs dependent upon Java to report it missing when it's already installed.

        java -version

3. If the above command prints out a Java version (e.x. **java version "1.7.0_91"**), it's already installed and this guide will not help you. If it reports **The program java can be found in the following packages**, continue on to the next step.

## Installing the Java Runtime Environment

1. Install the open source Java Runtime Environment, **OpenJRE**. This is Java's *interpreter*, the program it uses to execute compiled Java programs and do useful things. Officially maintained by Oracle, they recommended it for Linux systems.

        sudo apt-get install default-jdk

## Installing the Java Development Kit (Optional)

1. If you need to *compile* Java code on your Linode, install the Java Development Kit (JDK). Also open source, this package is known as **OpenJDK**. If you only need to run Java applications and not compile them, feel free to skip this step.

        sudo apt-get install default-jdk

{: .note }
>
> Automated development suites like [Jenkins](https://jenkins-ci.org/) can leverage OpenJDK to compile Java software projects automatically throughout the development process.

## Setting the "JAVA_HOME" Environment variable

1. List the location and number of Java installations on your Linode.

        sudo update-alternatives --config java

2. Using your mouse, highlight and copy (**COMMAND+C** on Mac, **CTRL+C** on Linux + Windows) the **Path** of the most recent version of Java. Like all standard software, the most recent version will have the highest number in its name. (e.x. **Java 7** is newer than **Java 6**).

3. Replace `/usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java` with your Java path (**COMMAND+V** on Mac, **CTRL+SHIFT+V** on Linux + Windows) and add it to the `/etc/environment` file.

        echo 'JAVA_HOME="`/usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java`"' | sudo tee --append /etc/environment

4. Close the Terminal session with your Linode and restart it. This will reload your environment variables and apply the changes you just made in step three.

5. Verify that your variable change took effect.

        echo $JAVA_HOME

If the output matches the environment variable specified in step three, continue on to the next section. If not, return to step one and double check your copy-paste work.

## Verifying your Java Installation

1. Make sure that your Linode recognizes Java has been installed.

        java -version

If the output is **java version "1.7.0_91"** or newer, your Java installation is complete! If not (e.x. **The program java can be found in the following packages**), scroll up and look for any errors or typos in your Terminal history.

## Conclusion

Now that you've installed OpenJRE and (optionally) OpenJDK, your Linode is ready to take on all of the ~~coffee~~ Java you can handle!

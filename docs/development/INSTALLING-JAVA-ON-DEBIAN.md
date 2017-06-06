---
author:
  name: Angel Guarisma
  email: aguarisma@linode.com
description: Install Java on Debian 8
keywords: 'Install Java on Debian, install Java, Debian, Learn Java'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['development/INSTALLING-JAVA-ON-DEBIAN']
modified: Thursday, June 1st, 2017
modified_by:
  name: Angel Guarisma
published: 'Thursday, June 1st, 2017'
title: Install Java on Debian 8
external_resources:
- '[Java Debian Wiki](https://wiki.debian.org/Java)'
---

Java is a powerful programming language. Software written in Java can be compiled and ran on any system. Unlike Python or C, Java does not come preinstalled on Linode distribution images. This guide installs the OpenJDK 7 runtime environment and development kit in Debian 8. OpenJDK is the free and open source implementation of the Java SE Development Kit.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. 

3.  Update your system:

        sudo apt update && sudo apt upgrade


## Installing the Java Runtime Environment

If you don't plan on using Java to write programs, the JRE is all you need. In Debian the JRE metapackage is called `default-jre`, this metapackage pulls several packages needed to run headless Java applications.
	
	sudo apt install default-jre
	
After the installation finishes, you can verify that the JRE was installed by running `dpkg -s default-jre`. The output will contain information about the Java installation, including a status line confirming that Java is installed:
	
        Package: default-jre
        Status: install ok installed
	
## Installing the Java Development Kit

If you plan on using Java to write or edit programs on your Linode, install the JDK. 

	sudo apt install default-jdk

After the installation finishes, verify that the JDK was installed with `dpkg -s default-jdk`. The command's outputs a status line confirming that Java is installed:
	
	Package: default-jdk
	Status: install ok installed

You can also check by running `javac` the Java compiler. If you need to compile a java application on your Linode, run `javac foobar.java`. `javac` will compile the program given no compilation errors. You can run the program using `java foobar` 

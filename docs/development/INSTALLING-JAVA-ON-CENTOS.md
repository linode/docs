---
author:
  name: Angel Guarisma
  email: aguarisma@linode.com
description: Install Java on CentOS
keywords: 'Install Java on CentOS, install Java, CENTOS, Learn Java'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Thursday, June 1st, 2017
modified_by:
  name: Angel Guarisma
published: 'Thursday, June 1st, 2017'
title: Install Java on Centos 7
external_resources:
- '[Fedora Wiki Java Entry](https://fedoraproject.org/wiki/Java)'
---

Java is a powerful programming language, and software written in Java can be compiled and ran on any system. This guide installs the OpenJDK 8 runtime environment and development kit in CentOS 7. OpenJDK is the free and open source implementation of Java SE, and is the platform on which Oracle builds their JRE product.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. 

3.  Update your system:

	sudo yum update

## Installing Java Runtime Environment

If you don't plan on using Java to write software, the JRE is all you need. In CentOS, the JRE package is called `java-$(version)-openjdk`. In this example, we'll install a minimall version of OpenJDK 8 intended for uses that do not require graphical interface.
	
	sudo yum install java-1.8.0-openjdk-headless
	
After the installation finishes, you can verify that the JRE was installed by running `yum list installed | grep java`, the output should be:
	
	java-1.8.0-openjdk-headless.x86_64   1:1.8.0.131-3.b12.el7_3           @updates
        javapackages-tools.noarch            3.4.1-11.el7                      @base
        python-javapackages.noarch           3.4.1-11.el7                      @base
        tzdata-java.noarch                   2017b-1.el7                       @updates
	
## Installing the Java Development Kit

If you plan on using Java to write or edit programs on your Linode, you need to install the JDK.

	sudo yum install java-1.8.0-openjdk-devel

After the installation is finished, verify that the JDK was installed with `yum list installed | grep openjdk-devel`, the output should be: 
	
	java-1.8.0-openjdk-devel.x86_64      1:1.8.0.131-3.b12.el7_3           @updates
	
You can also check by running `javac` the Java compiler. If you need to compile a program in Java, on your Linode, run `javac foobar.java`, and it will compile the program--given no compilation errors. The program can then be run using `java foobar`.

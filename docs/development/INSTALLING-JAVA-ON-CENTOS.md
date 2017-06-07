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

Java is a powerful programming language. Software written in Java can compiles and runs on any system. Unlike Python or C, Java does not come preinstalled on Linode distribution images. This guide installs the OpenJDK 8 runtime environment and development kit in CentOS 7. OpenJDK is the free and open source implementation of the Java SE Development Kit.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. 

3.  Update your system:

		sudo yum update

## Installing Java Runtime Environment

If you don't plan on using Java to write software, the JRE is all you need. In CentOS, the JRE package is `java-$(version)-openjdk`. The `openjdk-headless` package contains a minimal implementation of the JDK for executing Java applications on the command line. In this example, we'll install the  minimal version of OpenJDK 8.
	
	sudo yum install java-1.8.0-openjdk-headless
	
After the installation finishes, verify it using `yum list installed | grep "java"` the output should be:
	
	java-1.8.0-openjdk-headless.x86_64   1:1.8.0.131-3.b12.el7_3           @updates
    javapackages-tools.noarch            3.4.1-11.el7                      @base
    python-javapackages.noarch           3.4.1-11.el7                      @base
    tzdata-java.noarch                   2017b-1.el7                       @updates
	
## Installing the Java Development Kit

If you plan on using Java to write or edit programs on your Linode, install the JDK.

	sudo yum install java-1.8.0-openjdk-devel

After the installation is finished, verify it using `yum list installed | grep "openjdk-devel"`, the output should be: 
	
	java-1.8.0-openjdk-devel.x86_64      1:1.8.0.131-3.b12.el7_3           @updates
	
You can also verify by running the Java compiler, `javac`. If you need to compile Java code on your Linode, run `javac foobar.java`. Then run the application with `java foobar`.

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
## INSTALLING JAVA ON CENTOS
Java is a powerful programming language. Software written in Java can be compiled and ran on any system. Unlike Python or C, Java does not come preinstalled on Linode distribution images. 
This guide installs the Java Development Kit and the Java Runtime Environmenmt on CentOS 7. 


#Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. 

3.  Update your system:

		sudo yum update && sudo yum upgrade


## Installing Java Runtime Environment
If you don't plan on using Java to write software, the JRE is all you need. In CentOS, and other GNU/Linux distributions, the JRE package is called `default-jre`. 
	
	sudo yum install openjdk
After the installation finishes, you can verify that the JRE was installed by running `yum list installed | grep java`, the output should be:
	
	java-1.7.0-openjdk.x86_64               1:1.7.0.141-2.6.10.1.el7_3     @updates
	java-1.7.0-openjdk-headless.x86_64      1:1.7.0.141-2.6.10.1.el7_3     @updates
	javapackages-tools.noarch               3.4.1-11.el7                   @base
	python-javapackages.noarch              3.4.1-11.el7                   @base
	tzdata-java.noarch                      2017b-1.el7                    @updates

	
### Installing the Java Development Kit
If you plan on using Java to write or edit programs on your Linode, you need to install the JDK. 

	sudo yum install java-1.7.0-openjdk-devel

After the installation is finished, verify that the JRE was installed with `yum list installed | grep java-devel`, the output should be: 
	
	installed:
  	java-1.7.0-openjdk-devel.x86_64 1:1.7.0.141-2.6.10.1.el7_3
	
	
You can also check by running `javac` the Java compiler. If you need to compile a program in Java, on your Linode, run `javac foobar.java`, and it will compile the program--given no compilation errors. The program can then be run using `java foobar`. 



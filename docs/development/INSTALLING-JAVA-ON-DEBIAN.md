---
author:
  name: Angel Guarisma
  email: aguarisma@linode.com
description: Install Java on Debian 8
keywords: 'Install Java on Debian, install Java, Debian, Learn Java'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Thursday, June 1st, 2017
modified_by:
  name: Angel Guarisma
published: 'Thursday, June 1st, 2017'
title: Install Java on Debian 8
external_resources:
- '[Java Debian Wiki](https://wiki.debian.org/Java)'
---
## INSTALLING JAVA ON DEBIAN 
Java is a powerful programming language. Programs written in Java can be compiled and ran on any system. Unlike Python or C, Java does not come preinstalled on Linode distribution images. 
This guide installs the Java Development Kit and the Java Runtime Environmenmt on Debian 8. 


#Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. 

3.  Update your system:

		sudo apt-get update && sudo apt-get upgrade


## Installing the Java Runtime Environment
If you don't plan on using Java to write programs, the JRE is all you need. In Debian, and other GNU/Linux distributions, the JRE package is called `default-jre`. 
	
	sudo apt-get install default-jre 
After the installation finishes, you can verify that the JRE was installed by running `dpkg-s default-jre`, the output should be:
	
	package: default-jre
	Status: install ok installed
	Priority: optional
	Section: java
	
### Installing the Java Development Kit
If you plan on using Java to write or edit programs on your Linode, you need to install the JDK. 

	sudo apt-get install default-jdk

After the installation finishes, verify that the JRE was installed with `dpkg -s default-jdk`, the output should be: 
	
	Package: default-jdk
	Status: install ok installed
	Priority: optional
	Section: java
	Installed-Size: 21

You can also check by running `javac` the Java compiler. If you need to compile a program in Java, on your Linode, run `javac foobar.java`, and it will compile the program--given no compilation errors. The program can then be run using `java foobar`. 



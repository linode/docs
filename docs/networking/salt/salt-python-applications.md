---
author:
  name: Joseph Dooley
  email: docs@linode.com
description: 'Salt Master and Salt Minions for with Python files.'
keywords: 'salt, saltstack, python, applications'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, April 9th, 2015
modified_by:
  name: Joseph Dooley
published: 'Wednesday, April 9th, 2015'
title: Salt for Python Applications
---

Salt, also called SaltStack, is designed for server management. A single Salt Master controls many Salt Minions. The master can remotely run commands, transfer files, and can do much more concerning scalability. 

This tutorial is primarily for Salt, although it does display how to create and then remotely run a server-side Python application.

##Install a Salt Master and a Salt Minion
The directions below are for two separate Debian servers. For other operating systems and single server, visit the [Salt installation guides](https://www.docs.saltstack.com/en/latest/topics/installation/).

1.  On both Linode server 1 and Linode server 2, open `/etc/apt/sources.list` and insert the below syntax at the bottom of the file. 

	{:.file }
	/etc/apt/sources.list 
	: ~~~  
	   #Salt
	   deb http://debian.saltstack.com/debian wheezy-saltstack main
	~~~

2.  On both Linode server 1 and Linode server 2, run the wget command below:
	
		wget -q -O- "http://debian.saltstack.com/debian-salt-team-joehealy.gpg.key" | apt-key add -

3.  On both Linode server 1 and Linode server 2, run the update command:

		apt-get update

4.   





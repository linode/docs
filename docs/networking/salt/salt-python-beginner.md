---
author:
  name: Joseph Dooley
  email: docs@linode.com
description: 'Salt Master and Salt Minions remotely running Python files.'
keywords: 'salt, saltstack, python, applications'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, April 9th, 2015
modified_by:
  name: Joseph Dooley
published: 'Thursday, April 30th, 2015'
title: Salt and Python for a Beginner
---

Salt, often referred to as SaltStack, is designed for server management. A single Salt Master controls many Salt Minions. The master can remotely run commands, transfer files, and much more concerning scalability. 

This tutorial is primarily for Salt, although it displays how to create, transfer, and then remotely run a server-side Python application.

##Install a Salt Master and a Salt Minion
The directions below are for two separate Debian 8 Linodes. For other operating systems or single servers, visit the [Salt installation guides](http://docs.saltstack.com/en/latest/topics/installation/). Start with the necessary steps for both servers having the terminal windows side-by-side.

1.  On both Linode 1 and Linode 2, open `/etc/apt/sources.list` and insert the below syntax at the bottom of the file: 
    
        nano /etc/apt/sources.list

	{:.file }
	/etc/apt/sources.list
	: ~~~  
	# salt
	deb http://debian.saltstack.com/debian jessie-saltstack main
	~~~

2.  On both Linode 1 and Linode 2, run the wget command:
	
		wget -q -O- "http://debian.saltstack.com/debian-salt-team-joehealy.gpg.key" | apt-key add -

3.  On both Linode 1 and Linode 2, run the update command:

		apt-get update

###Installing and Configuring the Salt Master

1.  On only Linode 1 the Salt Master, install Salt:

        apt-get install salt-master

2.  On Linode 1 the Salt Master, open `/etc/salt/master`, uncomment the `#interface:` line, and replace `<master's IP address>` below with the local IP address:

        nano /etc/salt/master

    {:.file }
    /etc/salt/master 
    : ~~~  
       # The address of the interface to bind to:
       interface:<master's IP address>
    ~~~

3.  On Linode 1, the Salt Master, restart Salt:

        service salt-master restart

###Installing and Configuring the Salt Minion

1.  On only Linode 2 the Salt Minion, install Salt:

        apt-get install salt-minion
    
2.  On Linode 2 the Salt Minion, open `/etc/salt/minion`, uncomment the `#master: salt` line, and replace "salt" with the IP address of Linode 1, the Salt Master:

        nano /etc/salt/minion

    {:.file }
    /etc/salt/minion 
    : ~~~ 
       # Set the location of the salt master server. If the master server cannot be
       # resolved, then the minion will fail to start. 
       master:<master's IP address>
    ~~~

3.  On Linode 2 the Salt Minion, restart Salt:

        service salt-master restart

##Using the Salt Master

1.  List the known Salt Minions linked to the Salt Master:

        salt-key -L

2.  Accept the listed Salt Minions:

        salt-key -A

3.  Check that the accepted Minions are up:

        salt-run manage.up

4.  Ping the Minions, using '*' for all:

        salt '*' test.ping

##Using the Salt Master with Python

1.  Create a Python hello world app and test it on the Master:

        nano /example-dir/hello.py

    {:.file }
    /example-dir/hello.py 
    : ~~~  
       print "Hello world."
    ~~~

2.  Run the app on the Salt Master:

        python /example-dir/hello.py

3.  Copy the app to the Salt Minions:

        salt-cp '*' /example-dir/hello.py /example-dir/hello.py

4.  Remotely run the app on the Salt Minions:

        salt '*' cmd.run 'python /example-dir/hello.py'

For next steps, continue building a multi-server Python application. This would most likely come in use for servers with a high amount of requests or an application that is handling a great deal of data. Note, there is a [Python client API for Salt](http://docs.saltstack.com/en/latest/ref/clients/). 


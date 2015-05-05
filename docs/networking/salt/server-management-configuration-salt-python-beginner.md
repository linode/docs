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
title: Server Management and Configuration with Salt and Python for a Beginner
---

Salt, often referred to as SaltStack, is designed for server management. A single Salt Master controls many Salt Minions. The master can remotely run commands, transfer files, and much more concerning scalability. 

This tutorial is primarily for Salt, although it displays how to create, transfer, and then remotely run a server-side Python script or application.

##Install a Salt Master and a Salt Minion
The directions below are for two separate Debian 8 Linodes. For other operating systems or single servers, visit the <a href="http://docs.saltstack.com/en/latest/topics/installation/" target="_blank">Salt installation guides</a>. Start with the necessary steps for both servers. Have the terminal windows open side-by-side.

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

2.  On Linode 1 the Salt Master, open `/etc/salt/master`, uncomment the `#interface:` line, and replace `<master's IP address>` from below with the local, Salt Master's, IP address:

        nano /etc/salt/master

    {:.file }
    /etc/salt/master 
    : ~~~  
       # The address of the interface to bind to:
       interface:<master's IP address>
    ~~~


        {: .caution}
    >
    > Ensure that there is a space between the colon, in `interface:`, and the IP address.



3.  On Linode 1 the Salt Master, restart Salt:

        systemctl restart salt-master

###Installing and Configuring a Salt Minion

1.  On only Linode 2 the Salt Minion, install Salt:

        apt-get install salt-minion
    
2.  On Linode 2 the Salt Minion, open `/etc/salt/minion`, uncomment the `#master: salt` line, and replace "salt" with the IP address of Linode 1, the Salt Master:

        nano /etc/salt/minion

    {:.file }
    /etc/salt/minion 
    : ~~~ 
       # Set the location of the salt master server. If the master server cannot be
       # resolved, then the minion will fail to start. 
       master: <master's IP address>
    ~~~

        {: .caution}
    >
    > Ensure that there is a space between the colon, in `master:`, and the IP address.

3.  On Linode 2 the Salt Minion, restart Salt:

        systemctl restart salt-minion

##Using the Salt Master

1.  List the known Salt Minions linked to the Salt Master. On Debian 8, the Minions are listed by default as `Debian`:

        salt-key -L

2.  Accept the listed Salt Minions:

        salt-key -A

3.  Check that the accepted Minions are up:

        salt-run manage.up

4.  Ping the Minions, using '*' for all:

        salt '*' test.ping

##Using Python with Salt 
Python is used as an example for remotely running a server-side language. However, Bash, Perl, Python, or other languages can be used, often interchangeably. For example, transferring a start-up, or on-boot script, might be better written in Bash, but still remotely pushed to all minions through Salt. 

1.  Create a Python hello world app and test it on the Master:

        nano hello.py

    {:.file }
    hello.py 
    : ~~~  
       print "Hello world."
    ~~~

2.  Run the app on the Salt Master:

        python hello.py

3.  Copy the app to the Salt Minions. Replace `full-directory-path` with the Salt Master's correct directory path, and replace `destination-directory-path` with a Salt Minion directory path that already exists.

        salt-cp '*' /full-directory-path/hello.py /destination-directory-path/hello.py

4.  Remotely run the app on the Salt Minions. Replace `destination-directory-path` with the correct Salt Minion's directory path.

        salt '*' cmd.run 'python /destination-directory-path/hello.py'

For possible next steps, continue building a multi-server configuration setup. This would most likely come in use for servers with a high amount of requests or an application that is handling a great deal of data. Note, there is a <a href="http://docs.saltstack.com/en/latest/ref/clients/" target="_blank">Python client API for Salt</a>. 


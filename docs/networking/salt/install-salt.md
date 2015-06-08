---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'Install a Salt Master and Salt Minions.'
keywords: 'salt, saltstack, install, beginner, Debian 8'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, May 27th, 2015
modified_by:
  name: Joseph Dooley
published: 'Wednesday, May 27th, 2015'
title: Install Salt
---

Salt is designed for server management. A single Salt Master controls many Salt Minions.

The directions below are for two separate Debian 8 Linodes.

##Install a Salt Master and a Salt Minion

1.  <a href="http://docs.saltstack.com/en/latest/ref/configuration/nonroot.html" target="_blank">As the root user</a> log into both Linode 1 and Linode 2  and <a href="https://www.linode.com/docs/getting-started#setting-the-hostname" target="_blank">set the hostnames</a>. Without changing the configurations in Salt, the Salt Master's ID and Salt Minions' IDs default to the hostname. 

2. On both Linode 1 and Linode 2, create and open `/etc/apt/sources.list.d/salt.list`, then add the following lines: 
    
	{:.file }
	/etc/apt/sources.list.d/salt.list
	:  ~~~  
	   # salt
	   deb http://debian.saltstack.com/debian jessie-saltstack main
	   ~~~

3.  On both Linode 1 and Linode 2, run the wget command:
	
		wget -q -O- "http://debian.saltstack.com/debian-salt-team-joehealy.gpg.key" | apt-key add -

4.  On both Linode 1 and Linode 2, run the update command:

		apt-get update

###Installing and Configuring the Salt Master

1.  On only Linode 1 the Salt Master, install Salt:

        apt-get install salt-master

2.  On Linode 1 the Salt Master, open `/etc/salt/master`, uncomment the `#interface:` line, and replace `<master's IP address>` below with the public, Salt Master's IP address:

    {:.file }
    /etc/salt/master 
    :   ~~~  
        # The address of the interface to bind to:
          interface: <master's IP address>
        ~~~

        {: .caution}
    >
    > Ensure that there are two spaces in front of "interface" and a space between the colon, in `interface:`, and the IP address. YAML formatting follows two space nesting.



3.  On Linode 1 the Salt Master, restart Salt:

        systemctl restart salt-master

###Installing and Configuring a Salt Minion

1.  On only Linode 2 the Salt Minion, install Salt:

        apt-get install salt-minion
    
2.  On Linode 2 the Salt Minion, open `/etc/salt/minion`, uncomment the `#master: salt` line, and replace "salt" with the IP address of Linode 1, the Salt Master:

    {:.file }
    /etc/salt/minion 
    :   ~~~ 
        # Set the location of the salt master server. If the master server cannot be
        # resolved, then the minion will fail to start. 
          master: <master's IP address>
        ~~~

        {: .caution}
    >
    > Ensure that there are two spaces in front of "master" and a space between the colon, in `master: `, and the IP address. YAML formatting, pronouced like camel, follows two space nesting.


3.  On Linode 2 the Salt Minion, restart Salt:

        systemctl restart salt-minion

##Using the Salt Master

1.  List the known Salt Minions linked to the Salt Master:

        salt-key -L

2.  Accept the listed Salt Minions:

        salt-key -A

3.  Check that the accepted Minions are up:

        salt-run manage.up

4.  Ping the Minions, using '*' for all:

        salt '*' test.ping

For possible next steps, continue building a multi-server configuration setup and read more about <a href="/docs/networking/salt/salt-states-apache-mysql-php-fail2ban" target="_blank">configuration management with Salt States</a>.


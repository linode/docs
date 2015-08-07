---
author:
    name: Linode
    email: docs@linode.com
description: 'Install a Salt Master and Salt Minions.'
keywords: 'salt, saltstack, install, beginner, Debian 8'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, July 2nd, 2015
modified_by:
    name: James Stewart
published: 'Thursday, July 2nd, 2015'
title: Install Salt
---

Salt is a server management platform, designed to control a number of servers from a single master server. The following directions will walk you through configuring a salt master and multiple salt minions, and deploying your first Salt Formula.  These instructions assume that you are using Debian 8, but can be adjusted to function on other distributions.

##Before You Begin

Prior to starting this guide, you will need to ensure that each Linode's [hostname](https://www.linode.com/docs/getting-started#setting-the-hostname) has been set. As the Linode's hostname will be used to identify it within Salt, we recommend using descriptive hostnames. You should also designate one Linode as your Salt master and name it appropriately. If your Linodes are located within the same datacenter, it's also recommended that you configure [private IP addresses](https://www.linode.com/docs/networking/remote-access#adding-private-ip-addresses) for each system.

##Add the Salt Repository

{: .note}
>
> The steps in this section will need to be run on each of your Linodes

1.  Create the file `/etc/apt/sources.list.d/salt.list` and enter the following lines to add the Salt repository: 
    
	{:.file }
	/etc/apt/sources.list.d/salt.list
	:  ~~~  
	   # salt
	   deb http://debian.saltstack.com/debian jessie-saltstack main
	   ~~~

2.  Add the repository key:
	
		wget -q -O- "http://debian.saltstack.com/debian-salt-team-joehealy.gpg.key" | apt-key add -

3.  Update your Linode:

        apt-get update

##Configure your Salt Master

{: .note}
>
> The following steps will be run only on the Linode designated as your Salt master.

1.  Install the 'salt master' package:

        apt-get install salt-master

2.  Open the '/etc/salt/master' file, uncomment the `#interface:` line, and replace `<master's IP address>` below with the address you wish your Salt master to utilize.  If your Linodes are located in the same datacenter, you can utilize your private network address for this purpose:::

    {:.file }
    /etc/salt/master 
    :   ~~~  
        # The address of the interface to bind to:
        interface: <master's IP address>
        ~~~

        {: .note}
        >
        >As part of this step, you can also configure the user you wish to utilize to issue Salt commands to your minions.  Uncomment the `#user:` line and enter your desired username to modify this setting.  You will also need to issue the following command to set the required permissions for the user in question.
        >
        >       chown -R user /etc/salt /var/cache/salt /var/log/salt /var/run/salt
        >       
        >Once this setting has been modified, you will need to issue any further Salt commands on your Salt Master while logged in as that user.


3.  Restart Salt:

        systemctl restart salt-master

##Installing and Configuring a Salt Minion

{: .note}
>
> The following steps will need to be run on each of your Salt minions

1.  Install Salt:

        apt-get install salt-minion
    
2.  Edit the `/etc/salt/minion` file, uncomment the `#master: salt` line, and replace "salt" with the IP address of your Salt Master:

    {:.file }
    /etc/salt/minion 
    :   ~~~ 
        # Set the location of the salt master server. If the master server cannot be
        # resolved, then the minion will fail to start. 
          master: <master's IP address>
        ~~~

3.  Restart Salt:

        systemctl restart salt-minion

##Configure Salt

1.  On your salt master, issue the following command to list the known Salt Minions linked to the Salt Master:

        salt-key -L

3.  For security purposes, verify the Minions' IDs on both the Salt Master and the Salt Minions. Each Minion will be identified by its hostname.
        
    Run the following command from the salt master to query each minion's key ID:

        salt-key -f <hostname>

    On the Salt Minions:

        salt-call key.finger --local

2.  Once you have verified each of your Minion's ID's, accept the listed Salt Minions.

    To accept all Minions:    

        salt-key -A

    To accept an individual minion, run the command below, replacing the `<hostname>` value with your minion's hostname:

        salt-key -a <hostname>

3.  Check the status of each of the accepted minions:

        salt-run manage.up

4.  Ping the Minions, using '*' for all:

        salt '*' test.ping

##Deploy your first Salt Formula

Salt Formulas create a framework of software and configurations to be deployed to your minions.  Multiple Salt Formulas can be deployed to your Minions, and this will allow you to manage package configuration and maintenance from the Salt Master.  These steps will walk you through installing one of the premade formulas hosted on [Salt's Github](https://github.com/saltstack-formulas).

###Install GitFS

Salt utilizes GitFS to manage remote repositories for Salt Formulas.  These next steps will walk you through installing and configuring GitFS on your Salt Master to retrieve and store Salt Formulas

1.  Install GitFS Dependencies

        apt-get install python-pygit2

2.  Edit `/etc/salt/master` and uncomment the following lines:

    {:.file-excerpt }
    /etc/salt/master
    : ~~~
      fileserver_backend:
        - git
      ~~~

3.  In the same file, uncomment the `gitfs_remotes:` line, and add the path to the Formulas you wish to add below it.  For this example, we're adding the Apache remote.

    {:.file }
    /sample/file.html
    : ~~~
      gitfs_remotes:
        - https://github.com/saltstack-formulas/apache-formula
      ~~~

4.  Restart the salt-master service.

        systemctl restart salt-master

For possible next steps, continue building a multi-server configuration setup and read more about [configuration management with Salt States](/docs/applications/salt/salt-states-apache-mysql-php-fail2ban).


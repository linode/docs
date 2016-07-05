---
author:
    name: Linode
    email: docs@linode.com
description: 'Use Salt States to Create a LAMP Stack and Fail2ban Across All Listed Salt Minions on Debian 8.'
keywords: 'salt,salt state,lamp stack,apache,mysql,php,fail2ban,salt minions,debian 8'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Thursday, July 2nd, 2015
modified_by:
    name: Linode
published: 'Thursday, July 2nd, 2015'
title: Use Salt States to Create LAMP Stack and Fail2ban Across Salt minions.
alias: [applications/salt/salt-states-apache-mysql-php-fail2ban/]
---

Salt States can install and define a server setup on other servers. This tutorial demonstrates the use of Salt States to create a LAMP stack across all Salt Minions.

##Configure the Salt Master
Before configuration, install a Salt Master and Salt Minions with the Linode <a href="/docs/applications/salt/install-salt" target="_blank">Install Salt</a> guide. This tutorial is written for Debian 8, but can easily be adjusted for other Linux Distributions. 

1.  Open the `/etc/salt/master` file. Then search for **file_roots**, optionally read the surrounding "File Server settings" section, and edit the following:
    
    {:.file }
    /etc/salt/master
    :   ~~~
        # Example:
          file_roots:
            base:
              - /etc/salt/base
        ~~~

        {: .note}
    >
    > Copy the above text exactly to ensure the proper two space nesting of YAML formatting. Also notice the other possible Minion States listed under the example base file root. 
    
2.  Create the newly listed file root directory:

        mkdir /etc/salt/base

The Salt Master's configuration file has now been adjusted for a new base directory. The base directory typically contains the SLS files that create a tree like organization for Salt States pertaining to that directory. Additional directories, similar to the base directory, could be created with additional SLS files for different Salt State categories. 


##Create the Top and Additional SLS Files 
The <a href="https://docs.saltstack.com/en/latest/ref/states/top.html" target="_blank">top file</a> creates the top level organization for Salt States and Minions within the directory. Other SLS files typically correspond to the top file listings.

1.  Create the `/etc/salt/base/top.sls` file and add the following. Again, ensure exact formatting for the YAML two space nesting.
    
    {:.file }
    /etc/salt/base/top.sls
    :  ~~~  
       base:
         '*':
            - lamp
            - extras
       ~~~

2.  From step one directly above, a file for the `lamp` listing is needed. Create a `/etc/salt/base/lamp.sls` file and add the following: 

    
    {:.file }
    /etc/salt/base/lamp.sls
    :  ~~~  
       apache2:                # ID declaration
         pkg:                  # state declaration
           - installed         # function declaration

       mysql-server:
         pkg:
           - installed

       php5:
         pkg:
           - installed

       php-pear:
         pkg:
           - installed

       php5-mysql:
         pkg:
           - installed
       ~~~

    The above file defines an extremely simple Salt State using the <a href="http://docs.saltstack.com/en/latest/ref/states/all/salt.states.pkg.html" target="_blank">pkg State module</a>. State modules can be formatted a number of ways. The above text uses only an ID declaration, a state declaration, and the function declaration. 

    This Salt State ensures that a LAMP stack is installed across Minions. 

3.  From step one above, a file for the `extras` listing is needed. Create a `/etc/salt/base/extras.sls` file and add the below syntax:
    
    {:.file }
    /etc/salt/base/extras.sls
    :  ~~~  
       fail2ban:
         pkg:
           - installed
       ~~~

4.  Restart the Salt Master:

        systemctl restart salt-master

##Create the Salt State on the Minions

1.  To install the packages listed above and create a Salt State, run:

        salt '*' state.highstate

2.  For additional verification that the services are active on the minion, run:

        salt '*' cmd.run "service --status-all | grep 'apache2\|mysql\|fail2ban'"

A LAMP stack and Fail2ban Salt State has been created on all listed Salt Minions. To learn how to configure the LAMP Stack, try the [Salt States for Configuration of Apache, MySQL, and PHP (LAMP)](/docs/applications/salt/salt-states-configuration-apache-mysql-php) guide.


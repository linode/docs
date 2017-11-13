---
author:
    name: Linode
    email: docs@linode.com
description: 'Use Salt States to Create a LAMP Stack and Fail2ban Across All Listed Salt Minions on Debian 8.'
keywords: ["salt", "salt state", "lamp stack", "apache", "mysql", "php", "fail2ban", "salt minions", "debian 8"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/salt/use-salt-states-to-create-lamp-stack-and-fail2ban-across-salt-minions/','applications/salt/salt-states-apache-mysql-php-fail2ban/']
modified: 2016-11-22
modified_by:
    name: Edward Angert
published: 2015-07-02
title: Use Salt States to Create LAMP Stack and Fail2ban Across Salt minions
---

Salt States can install and define a server setup on other servers. This tutorial demonstrates the use of Salt States to create a LAMP stack across all Salt Minions.

## Configure the Salt Master
Before configuration, install a Salt Master and Salt Minions with the Linode [Install Salt](/docs/applications/salt/install-salt) guide. This tutorial is written for Debian 8, but can easily be adjusted for other Linux Distributions.

1.  Open the `/etc/salt/master` file. Then search for **file_roots**, optionally read the surrounding "File Server settings" section, and edit the following:

    {{< file "/etc/salt/master" >}}
# Example:
  file_roots:
    base:
      - /etc/salt/base

{{< /file >}}


        {{< note >}}
Copy the above text exactly to ensure the proper two-space nesting of YAML formatting. Also notice the other possible Minion States listed under the example base file root.
{{< /note >}}

2.  Create the newly listed file root directory:

        mkdir /etc/salt/base

The Salt Master's configuration file has now been adjusted for a new base directory. The base directory typically contains the SLS files that create a tree like organization for Salt States pertaining to that directory. Additional directories, similar to the base directory, could be created with additional SLS files for different Salt State categories.

## Create the Top and Additional SLS Files
The [top file](https://docs.saltstack.com/en/latest/ref/states/top.html) creates the top level organization for Salt States and Minions within the directory. Other SLS files typically correspond to the top file listings.

As mentioned in the note above, each of these configuration files requires specific spacing. To ensure consistency, copy the examples below, including

1.  Create the `/etc/salt/base/top.sls` file and add the following. Again, ensure exact formatting for the YAML two space nesting.

    {{< file "/etc/salt/base/top.sls" >}}
base:
  '*':
     - lamp
     - extras

{{< /file >}}


2.  Create the `/etc/salt/base/lamp.sls` file referred to in Step 1, and add the following:

    {{< file "/etc/salt/base/lamp.sls" >}}
lamp-stack:
  pkg.installed:
    - pkgs:
      - mysql-server
      - php5
      - php-pear
      - php5-mysql

{{< /file >}}


    This file defines a simple Salt State using the [pkg State Module](http://docs.saltstack.com/en/latest/ref/states/all/salt.states.pkg.html). This Salt State ensures that a LAMP stack is installed across Minions.

3.  The second bullet listed in `top.sls` declares an `extras` file which will list and install additional software. Create a `/etc/salt/base/extras.sls` file and add the following:

    {{< file "/etc/salt/base/extras.sls" >}}
fail2ban:
  pkg.installed

{{< /file >}}


4.  Restart the Salt Master:

        systemctl restart salt-master

## Create the Salt State on the Minions

1.  To install the packages listed above and create a Salt State, run:

        salt '*' state.highstate

    This process will take a few minutes. If successful, a report will be displayed with a summary similar to the following:

        Summary
        ------------
        Succeeded: 2 (changed=2)
        Failed:    0
        ------------
        Total states run:     2

2.  For additional verification that the services are active on the minion, run:

        salt '*' cmd.run "service --status-all | grep 'apache2\|mysql\|fail2ban'"

A LAMP stack and Fail2ban Salt State has been created on all listed Salt Minions. For more information on how to configure the LAMP Stack, refer to the [Salt States for Configuration of Apache, MySQL, and PHP (LAMP)](/docs/applications/salt/salt-states-configuration-apache-mysql-php) guide.

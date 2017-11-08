---
author:
    name: Linode
    email: docs@linode.com
description: 'Salt is a server management platform that can control a number of servers from a single location. Learn how to install Salt in this simple tutorial.'
keywords: ["Install salt", " salt configuration management", " salt master"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/salt/install-salt/','applications/configuration-management/install-salt/']
modified: 2017-07-10
modified_by:
    name: Linode
published: 2015-09-22
title: Install and Configure Salt Master and Minion Servers
---

[Salt](https://saltstack.com/) is a server management platform, designed to control a number of servers from a single master server. The following directions will walk you through configuring a Salt master and multiple Salt minions, and deploying your first Salt Formula. These instructions assume that you are using Debian 8 but can be adjusted to function on other distributions.

{{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  You will need at least three Linodes: One Salt master, and at least two Salt minions.

2.  Ensure that each Linode's [hostname](https://www.linode.com/docs/getting-started#setting-the-hostname) has been set. As the Linode's hostname will be used to identify it within Salt, we recommend using descriptive hostnames. You should also designate one Linode as your Salt master and name it appropriately. If your Linodes are located within the same datacenter, we recommend that you configure [private IP addresses](https://www.linode.com/docs/networking/remote-access#adding-private-ip-addresses) for each system.

## Add the Salt Repository

{{< note >}}
The steps in this section will need to be run on *each* of your Linodes.
{{< /note >}}

1.  Create the file `/etc/apt/sources.list.d/salt.list` and enter the following lines to add the Salt repository:

	{{< file "/etc/apt/sources.list.d/salt.list" >}}
# salt
deb http://debian.saltstack.com/debian jessie-saltstack main


{{< /file >}}


2.  Add the repository key:

		wget -q -O- "http://debian.saltstack.com/debian-salt-team-joehealy.gpg.key" | apt-key add -

3.  Update your Linode:

        apt-get update

## Configure Your Salt Master

{{< note >}}
The following steps will be run only on the Linode designated as your Salt master.
{{< /note >}}

1.  Install the Salt master package:

        apt-get install salt-master

2.  Open `/etc/salt/master`. Uncomment the `#interface:` line and replace `<master's IP address>` below with the address of your Salt master Linode. If your Linodes are located in the same datacenter, you can utilize your private network address for this purpose.

    {{< file "/etc/salt/master" >}}
# The address of the interface to bind to:
  interface: <master Linode IP address>

{{< /file >}}


        {{< note >}}
As part of this step, you can also configure the user you wish to issue Salt commands to your minions. Uncomment the `#user:` line and enter your desired username to modify this setting. You will also need to issue the following command to set the required permissions for the user in question.

chown -R user /etc/salt /var/cache/salt /var/log/salt /var/run/salt

Once this setting has been modified, you will need to issue any further Salt commands on your Salt Master while logged in as that user.
{{< /note >}}

3.  Restart Salt:

        systemctl restart salt-master

## Installing and Configuring a Salt Minion

{{< note >}}
The following steps will need to be run on *each* of your Salt minions.
{{< /note >}}

1.  Install Salt:

        apt-get install salt-minion

2.  Edit the `/etc/salt/minion` file to uncomment the `#master: salt` line, and replace "salt" with the IP address of your Salt Master:

    {{< file "/etc/salt/minion" >}}
# Set the location of the salt master server. If the master server cannot be
# resolved, then the minion will fail to start.
  master: <master's IP address>

{{< /file >}}


3.  Restart Salt:

        systemctl restart salt-minion

## Configure Salt

1.  On your Salt master, issue the following command to list the known Salt Minions linked to the Salt Master:

        salt-key -L

3.  For security purposes, verify the Minions' IDs on both the Salt Master and the Salt Minions. Each Minion will be identified by its hostname.

    Run the following command from the Salt master to query each minion's key ID:

        salt-key -f <hostname>

    On the Salt Minions:

        salt-call key.finger --local

2.  Once you have verified each of your Minion's ID's, accept the listed Salt Minions.

    To accept all Minions:

        salt-key -A

    To accept an individual minion, run the command below, replacing the `<hostname>` value with your minion's hostname:

        salt-key -a <hostname>

3.  Check the status of accepted minions:

        salt-run manage.up

4.  Ping the Minions, using `*` for all:

        salt '*' test.ping

    It should return the value `True` for each minion.

## Installing Individual Packages with Salt

Once you have completed the previous configuration steps, you can install packages using Salt on all of your minions. Packages can be targeted to individual minions, or installed to all minions via simple commands. For these examples we will use Apache.

1.  To install a package to a specific minion:

        salt 'minionid' pkg.install apache2

2.  To install a package to all minions:

        salt '*' pkg.install apache2

3.  To control services related to the installed package:

        salt '*' service.start apache2
        salt '*' service.stop apache2

4.  To remove a package from minions:

        salt '*' pkg.remove apache2

## Deploy Your First Salt Formula

Salt Formulas create a framework of software and configurations to be deployed to your minions. Multiple Salt Formulas can be deployed to your minions and this will allow you to manage package configuration and maintenance from the Salt Master. These steps will walk you through installing one of the pre-made formulas hosted on [Salt's Github](https://github.com/saltstack-formulas).

1.  Create the directory for storing your Salt states and navigate to that directory:

        mkdir /srv/salt
        cd /srv/salt

2.  Create a state file to store your configuration. For this example, we'll create a simple Apache state:

    {{< file "/srv/salt/apache.sls" yaml >}}
apache2:
  pkg:
    - installed

{{< /file >}}


3.  To install the packages contained within the SLS file and enable the state, execute the following command. You can replace `*` with the ID of a specific minion:

        salt '*' state.apply apache

4.  To disable or re-enable states installed on your Minions, run the following command:

        salt '*' state.disable apache
        salt '*' state.enable apache

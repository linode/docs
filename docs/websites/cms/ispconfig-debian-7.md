#Install ISPConfig control panel on Debian 7 (Wheezy) with ispconfig_setup script

ISPConfig is an open-source control panel completely free and opensource.
It allows you to manage and controll a whole Linux server directly from a great web based console.
The power of this control panel is that it's only a frontend to the base linux systems, and don't use binary
developed from any Commercial Company.

[Before beginning this guide](https://www.linode.com/docs/getting-started/) we assume that you have completed the getting started guide. If you are new 
to Linux server administration, you may be interested in our introduction to [Linux concepts guide](https://www.linode.com/docs/tools-reference/introduction-to-linux-concepts/), 
beginners guide(https://www.linode.com/docs/beginners-guide/) and [administration basics guide](https://www.linode.com/docs/using-linux/administration-basics).

Because ISPConfig requires a lot of work to configure a server, we use a script called "ispconfig_setup",
wich will automate the whole process of installation and let you do only some steps
for the installation.

You can find the script at [ispconfig_setup on GitHUB](https://github.com/servisys/ispconfig_setup)

#Lets start

Login to your server with Debian 7 Wheezy installed through putty or ssh.

First of all be sure that all will be updated

~~~~~~~~~~~~~~~~~~~~~
apt-get update; apt-get upgrade
~~~~~~~~~~~~~~~~~~~~~

if there are packges need to be updated, click 'Y' and update them.

Be sure to unzip is installed in your system running

~~~~~~~~~~~~~~~~~~~~~
apt-get install unzip
~~~~~~~~~~~~~~~~~~~~~

If all is ok, we download and install the script

~~~~~~~~~~~~~~~~~~~~~
wget https://github.com/servisys/ispconfig_setup/archive/master.zip
~~~~~~~~~~~~~~~~~~~~~

now uncompress it....

~~~~~~~~~~~~~~~~~~~~~
unzip master
~~~~~~~~~~~~~~~~~~~~~

and now start the install process

~~~~~~~~~~~~~~~~~~~~~
cd ispconfig_setup-master
./install.sh
~~~~~~~~~~~~~~~~~~~~~

The system will try to detect you system distribution

~~~~~~~~~~~~~~~~~~~~~
=========================================
ISPConfig 3 System installer
=========================================

This script will do a nearly unattended intallation of
all software needed to run ISPConfig 3.
When this script starts running, it'll keep going all the way
So before you continue, please make sure the following checklist is ok:

- This is a clean / standard debian installation
- Internet connection is working properly


The detected Linux Distribution is:  debian7

Is this correct? (y/n)
~~~~~~~~~~~~~~~~~~~~~

In my case all is right, so we can go on clicking 'y'

After that we are prompted for some information

- MySQL Please specify a root password: yorpassword
- WEBSERVER Select server type: Apache ( Nginx is the other alternative)
- Install XCache: yes (we want to use it)
- Install phpMyAdmin: yes
- Mail server: dovecot (courier is the other alternative)
- Update Freshclam DB: yes (we want updated virus definition)
- Quota: yes (Enabling quota for our customers)
- ISPConfig Setup: standard (we want the more unattend install possibile)
- Jailkit: yes (for ssh in chroot environment if needed)
- DKIM: yes (we want DKIM setup for our hostname)
- Webmail client: roundcube (squirelmail is an alternative, but i'll prefer roundcube)

Then fill the information for the autogenrated ssl certficate

- SSL Country
- SSL State
- SSL Locality
- SSL Organization
- SSL Organization Unit

Now look at the screen or go to take a coffe :)

After some time server is working, you'll see a message like that

~~~~~~~~~~~~~~~~~~~~~
===========================================================================================
Attention: When asked 'Configure database for phpmyadmin with dbconfig-common?' select 'NO'
Due to a bug in dbconfig-common, this can't be automated.
===========================================================================================
Press ENTER to continue...
~~~~~~~~~~~~~~~~~~~~~

When the at the screen is presented the up message, select 'NO'

When you are prompted with these message

~~~~~~~~~~~~~~~~~~~~~
If you heaven't done yet add roundcube remote user in ISPConfig, with the following permission: Server functions - Client functions - Mail user functions - Mail alias functions - Mail spamfilter user functions - Mail spamfilter policy functions - Mail fetchmail functions - Mail spamfilter whitelist functions - Mail spamfilter blacklist functions - Mail user filter functions
~~~~~~~~~~~~~~~~~~~~~

Click enter.

You server is now configured with ispconfig, but need a little trick to let rounducube interact correctly.

Login to you new control panel at *https://YOURIP:8080* with user 'admin' and password 'admin'.

Now got to **System -> Remote User -> Add new user**

Now fill the filed

- Username: roundcube
- Password: whethever you want
- Repeat Password:

The check the following Functions

- Server functions 
- Client functions 
- Mail user functions 
- Mail alias functions 
- Mail spamfilter user functions 
- Mail spamfilter policy functions 
- Mail fetchmail functions 
- Mail spamfilter whitelist functions 
- Mail spamfilter blacklist functions 
- Mail user filter functions

Click 'Save'.

The last thinkg, edit the file /var/lib/roundcube/plugins/ispconfig3_account/config/config.inc.php

~~~~~~~~~~~~~~~~~~~~~
nano /var/lib/roundcube/plugins/ispconfig3_account/config/config.inc.php
~~~~~~~~~~~~~~~~~~~~~

and change the value of variable remote_soap_pass with the one you entered for the Remote user for roundcube in ISPConfig,
and the ip address 192.177.167.44, with the ip address of your server

~~~~~~~~~~~~~~~~~~~~~
<?php
$rcmail_config['identity_limit'] = false;
$rcmail_config['remote_soap_user'] = 'roundcube';
$rcmail_config['remote_soap_pass'] = 'roundcube';
$rcmail_config['soap_url'] = 'http://192.177.167.44:8080/remote/';
?>
~~~~~~~~~~~~~~~~~~~~~

That's all!


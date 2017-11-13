---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Install Asterisk and FreePBX on your Linode to use and manage a telephone exchange.'
keywords: ["asterisk ubuntu 9.10", "asterisk", "asterisk linux", "freepbx", "freepbx ubuntu", "pbx", "voip"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['communications/voip-services-ubuntu9-10/']
modified: 2013-08-02
modified_by:
  name: Linode
published: 2010-04-23
title: 'Deploy VoIP Services with Asterisk and FreePBX on Ubuntu 9.10 (Karmic)'
---

Asterisk is an open source telephone solution that runs over the internet instead of running through copper lines like a normal phone would. It offers a variety of features such as voice mail and conference calling, much like a land line telephone can.

Before you begin, you need to make sure a few things are in order. We assume you have followed the [getting started guide](/docs/getting-started/) and have set the hostname, timezone, and configured networking. These last steps are of particular importance for ensuring your Asterisk installation functions normally. If you plan on using Asterisk's email features, you may also wish to [add an A record](/docs/dns-guides/introduction-to-dns#types-of-dns-records) for your domain.

**Please note:** Because of the special configuration options required for this setup, you should not run other services on the Linode you intend to use Asterisk on. It is also worth noting that this guide will walk you through using pv\_grub. Any alterations to the steps in this guide will fall outside the scope of support.

This guide is based largely on [Ryan Tucker's guide](http://blog.hoopycat.com/2009/12/asterisk-freepbx-ubuntu-910-karmic-lighttpd-linode), with some modification to the procedures and software used.

# Prerequisites

There are quite a few prerequisites to satisfy before you can begin installing Asterisk and FreePBX. Most notably, you will need to install a kernel module and change your Linode's configuration profile. We're going to outline the instructions for doing so in this document, however you may wish to take a look at the in-depth information contained in the [pv-grub guide](/docs/tools-reference/custom-kernels-distros/custom-compiled-kernel-with-pvgrub-debian-ubuntu).

### Edit Sources List

You will need to enable the universe repositories in order to install Asterisk. To do so, edit `/etc/apt/sources.list` so that it looks like the following:

{{< file-excerpt "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

{{< /file-excerpt >}}


Issue the following commands to update your package lists and upgrade packages on your Linode:

    apt-get update
    apt-get upgrade

### Create Asterisk User

We're going to create a user to run Asterisk as so that we're not running everything as root. Issue the following command:

    adduser asterisk

You will be prompted for a password and some details for the user such as name and phone number. You need to fill out the password, but you may safely hit "Enter" for the other entries.

# Configure the Kernel

You will need to use the "pv-grub" kernel provided by Linode. This method works, however any kernel problems that arise from editing the kernel beyond the steps outlined in this document will not be supported by Linode support. You'll need to prepare your Linode before updating your configuration profile by following the commands below.

Asterisk uses the "dahdi\_dummy" kernel module, which requires you to edit a few things in the kernel as well as your Linode's configuration profile. You will need to use the EC2 image in order to use Asterisk without compiling your own kernel. This is a straightforward process; issue the following command:

    apt-get install linux-image-ec2

### Install and Configure Grub

GRUB is a [bootloader](http://en.wikipedia.org/wiki/Booting#Boot_loader) that will allow you to boot the kernel we're setting up. You will need to install and create a default configuration file for it. Issue the following commands:

    apt-get install grub
    update-grub

You will receive a warning about the `/boot/grub/menu.lst` file not existing and be asked if you would like to create one. Enter "y" to create a new file. You will now need to edit the `/boot/grub/menu.lst` file, particularly the "groot" line. **Please note:** Directives in this file look like the are commented out. **Leave the hash marks ("\#") as they are.**

Change the groot line to resemble the following:

{{< file-excerpt "/boot/grub/menu.lst" >}}
## default grub root device
## e.g. groot=(hd0,0)
# groot=(hd0)

{{< /file-excerpt >}}

You will also want to change the indomU line to resemble the following:

{{< file-excerpt "/boot/grub/menu.lst" >}}
# indomU=false

{{< /file-excerpt >}}

You will now need to update grub again in order to apply the changes. Issue the following command:

    update-grub

### Edit Configuration Profile

You will now need to log in to the Linode Manager in order to change your Linode's configuration profile. To do so, navigate to the Dashboard page of the Linode you are going to use for Asterisk. Click the profile you are currently using and select "pv-grub-x86\_32" (or "pv-grub-x86\_64" if you are using a 64 bit system) from the kernel drop down. Save this configuration profile. You may wish to change the name of it to indicate that this is no longer a default profile.

Reboot your system to make sure that these changes are applied. You will need to do this before you can proceed. It is a good idea to watch the shutdown and reboot phases via Lish to see if there are any errors.

### Troubleshooting

It's very important that you follow the steps outlined above carefully or your system may not boot. It is highly recommended that you watch the console during the shutdown and reboot phases via [Lish](/docs/troubleshooting/using-lish-the-linode-shell). If your Linode does not boot and you get an error, change your configuration profile back to the latest Paravirt kernel and read over this guide to make sure you have not missed any steps.

# Install the Dahdi Module

You now need to install the Dahdi module to allow features like conference calling. Issue the following commands:

    apt-get install build-essential module-assistant
    module-assistant -t update
    module-assistant -t prepare
    apt-get install gawk
    apt-get install dahdi dahdi-dkms dahdi-linux

# Install Asterisk

You're now ready to install Asterisk. There are a few packages related to Asterisk that you may not need, however we've included them below. Unless you know what you will need, it's wise to install these packages.

Install Asterisk and some extra features with the following command:

    apt-get install asterisk asterisk-config asterisk-doc asterisk-mp3 asterisk-mysql asterisk-sounds-main asterisk-sounds-extra

If you plan on having a US telephone number, enter "1" for the ITU-T telephone code. If you would like to use a number in another country, please select the corresponding [code for your country](http://www.itu.int/itudoc/itu-t/ob-lists/icc/e164_763.html).

By default, Asterisk includes voice prompts in English. However, support for other languages can be installed using the command(s) below:

    apt-get install asterisk-prompt-de # German voice prompts for the Asterisk PBX
    apt-get install asterisk-prompt-es-co # Colombian Spanish voice prompts for Asterisk
    apt-get install asterisk-prompt-fr-armelle # French voice prompts for Asterisk by Armelle Desjardins
    apt-get install asterisk-prompt-fr-proformatique # French voice prompts for Asterisk
    apt-get install asterisk-prompt-fr # French voice prompts for Asterisk
    apt-get install asterisk-prompt-it # Italian voice prompts for the Asterisk PBX
    apt-get install asterisk-prompt-se # Swedish voice prompts for Asterisk

To start Asterisk, issue the following command:

    asterisk

Now check to see if asterisk is running by issuing:

    asterisk -r

You will be connected to the Command Line Interface (CLI) for Asterisk; you can disconnect from this process by typing `exit`. If you would like to view available commands, type `help`.

At this time, you will want to reboot your Linode to see that everything functions normally. In particular, check that Asterisk has started by issuing the `asterisk -r` command. You are encouraged to use the Linode Manager to reboot your Linode.

# Installing FreePBX

FreePBX is a PHP application that allows you to control your Asterisk installation through a web interface.

### Set Up LAMP Stack

Before you can use FreePBX, you will need to set up a LAMP stack. An overview is provided here, but you may wish to consult our [LAMP documentation](/docs/lamp-guides/ubuntu-9-10-karmic/) for more information. To begin installing Apache, issue the following command:

    apt-get install apache2

By default, Apache listens on all IP addresses available to it. We must configure it to listen only on addresses we specify.

Begin by modifying the `NameVirtualHost` entry in `/etc/apache2/ports.conf` as follows:

{{< file-excerpt "/etc/apache2/ports.conf" apache >}}
NameVirtualHost 12.34.56.78:80

{{< /file-excerpt >}}


Be sure to replace "12.34.56.78" with your Linode's public IP address.

Now, modify the default site's virtual hosting in the file `/etc/apache2/sites-available/default` so that the `<VirtualHost >` entry reads:

{{< file-excerpt "/etc/apache2/sites-available/default" apache >}}
<VirtualHost 12.34.56.78:80>

{{< /file-excerpt >}}


You will now need to install MySQL. To begin the installation, issue the following command:

    apt-get install mysql-server

After this completes, you will want to secure the default installation by issuing the following command:

    mysql_secure_installation

You will need to create some databases, which we will use later on. Issue the following commands:

    mysql -p

You will be asked for the password you created when you installed MySQL, then you will be taken to the MySQL command line interface. Be sure to change the password ("CHANGEME") to something secure that you will remember.

    create database asterisk;
    create database asteriskcdr;
    GRANT ALL PRIVILEGES ON asteriskcdr.* TO asterisk@localhost IDENTIFIED BY 'CHANGEME';
    GRANT ALL PRIVILEGES ON asterisk.* TO asterisk@localhost IDENTIFIED BY 'CHANGEME';
    flush privileges;
    exit

Next, you will need to install PHP. Issue the following commands:

    apt-get install php5 php-pear php5-mysql php5-suhosin php5-cgi php-pear php-db

You will need to edit PHP's configuration file in order to ensure FreePBX can function properly. In particular you need to ensure that the "memory\_limit" directive is set to "100M" or else you may run into problems.

{{< file-excerpt "/etc/php5/apache2/php.ini" >}}
max_execution_time = 30
memory_limit = 100M
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
log_errors = On
error_log = /var/log/php.log
register_globals = Off

{{< /file-excerpt >}}


FreePBX requires you to disable "magic quotes" in PHP. Find the following directives in your php.ini file and change them to reflect the example below:

{{< file-excerpt "/etc/php5/apache2/php.ini" >}}
magic_quotes_gpc = Off

{{< /file-excerpt >}}


For this installation, we want Apache to run as the Asterisk user. This will allow Apache to access all of the files it needs in order to run FreePBX. Make sure your `/etc/apache2/envvars` file resembles the following:

{{< file-excerpt "/etc/apache2/envvars" >}}
export APACHE_RUN_USER=asterisk
export APACHE_RUN_GROUP=asterisk

{{< /file-excerpt >}}


Finally, restart Apache to make sure everything is loaded correctly:

    /etc/init.d/apache2 restart

### Download and Extract FreePBX

Obtain FreePBX and unpack it by issuing the following commands:

    cd /opt
    wget http://mirror.freepbx.org/freepbx-2.6.0.tar.gz
    tar -xvf freepbx-2.6.0.tar.gz
    chown -R asterisk:asterisk freepbx*
    su - asterisk
    cd /opt/freepbx-2.6.0

The FreePBX directory contains SQL files that you can insert into the database that we created previously. Issue the following commands to insert this data:

    mysql -p asterisk < SQL/newinstall.sql
    mysql -p asteriskcdr < SQL/cdr_mysql_table.sql
    exit

### Configuration

The FreePBX configuration process will ask you a series of questions that you will want to pay attention to. Some of the default values are fine for a production system, however you will want to change the passwords to prevent someone from accessing the system while you are setting it up.

You need to pass the credentials of the MySQL user and database you created above to the configuration script. Issue the following command, making sure to change the password ("CHANGEME") to the password you created when you created the MySQL users and databases:

    ./install_amp --username=asterisk --password=CHANGEME

### Create VirtualHost

Before you continue your FreePBX installation, you will want to configure a `VirtualHost` for the web interface. You will also want to secure your installation using SSL and .htaccess.

You will need to create a `VirtualHost` for your FreePBX installation. By default, FreePBX installs files to `/var/www/html/`; you may leave this as it is. Your `VirtualHost` may resemble the following:

{{< file "VirtualHost Entry" apache >}}
<VirtualHost 12.34.56.78:80>
    ServerAdmin webmaster@e-cabi.net
    ServerName pbx.e-cabi.net
    ServerAlias pbx.e-cabi.net
    DocumentRoot /var/www/html
</VirtualHost>

{{< /file >}}


To update your Apache configuration, you will need to restart the server. Issue the following command:

    /etc/init.d/apache2 restart

You will also need to edit your `nano /etc/rc.local` file to enable some features of FreePBX on boot. You will need to add the "perl /var/www/html/panel/op\_server.pl -d" line to this file. **Please note:** You need to add this line before any lines that way "exit", as follows:

{{< file-excerpt "/etc/rc.local" bash >}}
# [..]

perl /var/www/html/panel/op_server.pl -d
exit 0

{{< /file-excerpt >}}


You should now be able to visit your Linode's IP address or the A record you have pointed at your Linode in your web browser. You will need to log in using the `asterisk` username, and the password you selected for the FreePBX installation above. Once you have successfully logged in, you will be able to control your Asterisk installation through FreePBX!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Asterisk Documentation](http://www.asterisk.org/docs)
- [Asterisk Community](http://www.asterisk.org/community)
- [FreePBX Documentation](http://www.freepbx.org/support/documentation)
- [FreePBX Community](http://www.freepbx.org/community)




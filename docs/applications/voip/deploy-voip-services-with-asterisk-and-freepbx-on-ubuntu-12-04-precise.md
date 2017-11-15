---
deprecated: true
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Install Asterisk and FreePBX on Your Linode to Use and Manage a Telephone Exchange.'
keywords: ["ubuntu 12.04", "asterisk", "freepbx", "pbx", "voip", "google voice", "grub", "lamp stack", "apache", "php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: [ 'communications/voip-services-ubuntu-12-04/' ]
modified: 2014-06-17
modified_by:
  name: Alex Fornuto
published: 2014-06-17
title: 'Deploy VoIP Services with Asterisk and Freepbx on Ubuntu 12.04'
external_resources:
 - '[Asterisk Documentation](http://www.asterisk.org/docs)'
 - '[Asterisk Community](http://www.asterisk.org/community)'
 - '[FreePBX Documentation](http://www.freepbx.org/support/documentation)'
 - '[FreePBX Community](http://www.freepbx.org/community)'
---

Asterisk is an open-source telephone solution that runs over the Internet instead of running through copper lines. It offers a variety of features such as voicemail and conference calling, much like a landline telephone can.

For this guide we will install Asterisk from source rather than from Ubuntu's repositories. The newer version offers several additional features, including the ability to integrate a Google Voice account as a trunk. We will use FreePBX as a web interface for our Asterisk configuration.

**Please note:** Because of the special configuration options required for this setup, you should not run other services on the Linode you intend to use Asterisk on. It is also worth noting that this guide will walk you through using PV-GRUB. Any alterations to the steps in this guide will fall outside the scope of support.

 {{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Terms

If you're new to the idea of running a digital phone system, you may want to brush up on some of the protocols and acronyms used most frequently.

-   **PBX** Private Branch Exchange - A system that provides telephone switching and connection for an internal system. Asterisk with the FreePBX front-end will serve as our PBX.
-   **Trunk** - A service provider that will deliver phone calls to and from your PBX platform. There are [many](http://www.voip-info.org/wiki/view/Sip+Trunking+Providers) providers offering a variety of solutions. In this guide we'll cover using Google Voice as your trunk, but you can replace those instructions with those provided by another trunk provider to complete your setup.
-   **DID** Direct Inward Dialing number - Usually assigned by the trunk provider, this is the phone number (or numbers) used by the outside world to call into your PBX system.
-   **SIP** Session Initiation Protocol - This protocol works over Internet Protocol (IP) to establish multimedia connections. Our PBX server will use SIP to communicate with the trunk provider as well as the client device.

The diagram below shows the relationship between each of the components that allow a standard phone and your SIP client to communicate:

[![](/docs/assets/1748-asterisk-flowchart.png)](/docs/assets/1748-asterisk-flowchart.png)

## Prerequisites

Before you begin, you need to make sure a few things are in order. We assume you have followed the [Getting Started](/docs/getting-started/) guide and have set the hostname and timezone, and have configured networking for the Linode. These last steps are of particular importance for ensuring your Asterisk installation functions normally. If you plan on using Asterisk's email features, you may also wish to [add an A record](/docs/dns-guides/introduction-to-dns#types-of-dns-records) for your domain.

There are quite a few prerequisites to satisfy before you can begin installing Asterisk and FreePBX. Most notably, you will need to install a kernel module and change your Linode's configuration profile. We're going to outline the instructions for doing so in this document. If you want a more detailed explanation, you may wish to take a look at the in-depth information contained in the [PV-GRUB guide](/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub).

This guide includes instructions for integrating a Google Voice account. You will need a Google account that's already configured with a [Google Voice](https://www.google.com/voice) number to complete these steps.

### Install Required System Packages

1.  Issue the following commands to update your package lists and upgrade packages on your Linode:

        apt-get update
        apt-get upgrade

2.  Install the set of programs below, which we will need later to build the Asterisk software from source:

        apt-get install build-essential wget libssl-dev libncurses5-dev libnewt-dev  libxml2-dev libsqlite3-dev uuid-dev libiksemel-utils libiksemel-dev

### Create Asterisk User

We're going to create a user to run the Asterisk process, so that we're not running everything as root. Issue the following command:

    adduser asterisk

You will be prompted for a password and some details for the user such as name and phone number. You need to fill out the password, but you may safely hit `Enter` for the other entries.

## Install the Kernel

You will need to use the PV-GRUB kernel provided by Linode. This method works, but any kernel problems that arise from editing the kernel beyond the steps outlined in this document will not be supported by Linode. You'll need to prepare your Linode before updating your configuration profile by following the commands in the next section.

Asterisk uses the dahdi\_dummy kernel module, which requires you to edit a few things in the kernel as well as your Linode's configuration profile. This is a straightforward process; issue the following command:

    apt-get install linux-virtual

You will be presented with a menu like the one below asking you to choose a disk to install GRUB on. You can continue without choosing an option, since this version will be purged in the next step.

[![A Grub option menu.](/docs/assets/1671-asterisk-1.png)](/docs/assets/1671-asterisk-1.png)

### Install and Configure Grub

1.  GRUB is a [bootloader](http://en.wikipedia.org/wiki/Booting#Boot_loader) that will allow you to boot the kernel we're setting up. You will need to install and create a default configuration file for it. Issue the following commands:

        apt-get purge grub2 grub-pc
        apt-get install grub
        update-grub

    You will receive a warning about the `/boot/grub/menu.lst` file not existing and be asked if you would like to create one. Enter **y** to create a new file.

2.  Edit the `/boot/grub/menu.lst` at the "groot" line. **Please note:** Directives in this file look as if they are commented out. **Leave the hash marks ("\#") as they are.**

    Change the `groot` line to resemble the following:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
## default grub root device
## e.g. groot=(hd0,0)
# groot=(hd0)

{{< /file-excerpt >}}

3.  Change the `indomU` line to resemble the following:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# indomU=false

{{< /file-excerpt >}}

4.  Save and exit the file. You will now need to update GRUB again in order to apply the changes. Issue the following command:

        update-grub

### Edit Configuration Profile

You will now need to log in to the Linode Manager in order to change your Linode's configuration profile.

1.  Navigate to the **Dashboard** page of the Linode you are going to use for Asterisk.
2.  Click the profile you are currently using and select **pv-grub-x86\_64** (or **pv-grub-x86\_32** if you are using a 32 bit system) from the kernel drop down.
3.  Save this configuration profile. You may wish to change its name to indicate that this is no longer a default profile.
4.  Reboot your system to make sure that these changes are applied. You will need to do this before you can proceed. It is a good idea to watch the shutdown and reboot phases via [LISH](/docs/using-lish-the-linode-shell) to see if there are any errors.

### Troubleshoot

It's very important that you follow the steps outlined above carefully or your system may not boot. It is highly recommended that you watch the console during the shutdown and reboot phases via [LISH](/docs/troubleshooting/using-lish-the-linode-shell). If your Linode does not boot and you get an error, change your configuration profile back to the latest Paravirt kernel and read over this guide to make sure you have not missed any steps.

## Install Asterisk

1.  The version of Asterisk in the Ubuntu repository is outdated and can't support all the features needed for this guide, so begin by downloading the current build of Asterisk 11 directly. You will also need to download the libpri library and the DAHDI module:

        cd /usr/src/
        wget http://downloads.asterisk.org/pub/telephony/libpri/libpri-1.4-current.tar.gz
        wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-11-current.tar.gz
        wget http://downloads.asterisk.org/pub/telephony/dahdi-linux-complete/dahdi-linux-complete-current.tar.gz

2.  Extract the files:

        tar zxvf dahdi*
        tar zxvf libpri*
        tar zxvf asterisk*

3.  Build DAHDI:

        cd /usr/src/dahdi-linux-complete*
        make
        make install
        make config

4.  Build libpri:

        cd /usr/src/libpri*
        make
        make install

5.  Begin Building Asterisk:

        cd /usr/src/asterisk*
        ./configure
        make menuselect

6.  This will bring up a menu of additional modules to install. Make sure that under `Resource Modules`, `res_xmpp` is selected.

7.  Now go up to `Channel Drivers` and select `cham_motif`.

    [![The chan\_motiff option.](/docs/assets/1678-asterisk-8.png)](/docs/assets/1678-asterisk-8.png)

8.  Finally, under `Compiler Flags` uncheck `BUILD_NATIVE`.

    [![The BUILD\_NATIVE flag.](/docs/assets/1750-asterisk-12-small.png)](/docs/assets/1749-asterisk-12.png)

9.  When you've selected these and any other modules or build options you may want, use the **Save & Exit** button. Then issue the following commands to finish the installation:

        make
        make install
        make config
        make samples

10. Start the DAHDI and Asterisk services:

        service dahdi start
        service asterisk start

### Verify the Installation

1.  To make sure all the required packages are installed properly, launch the Asterisk CLI:

        asterisk -rvvv

    The output should be similar to the excerpt below:

        Asterisk 11.8.1, Copyright (C) 1999 - 2013 Digium, Inc. and others.
        Created by Mark Spencer <markster@digium.com>
        Asterisk comes with ABSOLUTELY NO WARRANTY; type 'core show warranty' for details.
        This is free software, with components licensed under the GNU General Public
        License version 2 and other licenses; you are welcome to redistribute it under
        certain conditions. Type 'core show license' for details.
        =========================================================================
        Connected to Asterisk 11.8.1 currently running on localhost (pid = 6963)
        localhost*CLI>

2.  The following commands and output serve to verify that DAHDI and libpri are properly installed:

        localhost*CLI> dahdi show version
        DAHDI Version: 2.9.0 Echo Canceller:
        localhost*CLI> pri show version
        libpri version: 1.4.14

## Install FreePBX

FreePBX is a PHP application that allows you to control your Asterisk installation through a web interface.

### Set Up LAMP Stack

Before you can use FreePBX, you will need to set up a LAMP stack. An basic step-by-step how-to is provided here, but you may wish to consult our [LAMP documentation](/docs/lamp-guides/ubuntu-9-10-karmic/) for more information.

1.  Begin by installing Apache:

        apt-get install apache2

2.  Install MySQL:

        apt-get install mysql-server

    MySQL will ask you to set a root user password. Remember what you choose, as you will need to use it again later on.

3.  Secure the default installation by issuing the following command:

        mysql_secure_installation

    Assuming you set a strong root user password in the previous step, you can skip the first option to change the root password. For all other suggestions, choose **Y**.

4.  Create the databases to be used by the Asterisk system. Start by launching the MySQL CLI:

        mysql -p

    You will be asked for the password you created when you installed MySQL, then you will be taken to the MySQL command line interface.

5.  Run the following commands, in this order. Be sure to change the password (**CHANGEME**) to something secure that you will remember. These commands will create two databases named **asterisk** and **astieriskcdr**, and give the `asterisk` system user permission to access and modify their contents.

        create database asterisk;
        create database asteriskcdr;
        GRANT ALL PRIVILEGES ON asteriskcdr.* TO asterisk@localhost IDENTIFIED BY 'CHANGEME';
        GRANT ALL PRIVILEGES ON asterisk.* TO asterisk@localhost IDENTIFIED BY 'CHANGEME';
        flush privileges;
        exit

6.  Install PHP and related packages:

        apt-get install php5 php-pear php5-mysql php5-suhosin php5-cgi php-pear php-db libapache2-mod-php5

7.  For this installation, we want Apache to run as the Asterisk user. This will allow Apache to access all of the files it needs in order to run FreePBX. Make sure your `/etc/apache2/envvars` file resembles the following:

    {{< file-excerpt "/etc/apache2/envvars" >}}
export APACHE_RUN_USER=asterisk
		export APACHE_RUN_GROUP=asterisk

{{< /file-excerpt >}}

8.  Change ownership of the Apache lock file:

        chown asterisk:asterisk /var/lock/apache2/

9.  Finally, restart Apache to make sure everything is loaded correctly:

        service apache2 restart

### Download and Extract FreePBX

1.  Obtain FreePBX and unpack it by issuing the following commands:

        cd /opt
        wget http://mirror.freepbx.org/freepbx-2.11.0.25.tgz
        tar -xvf freepbx-2.11.0.25.tgz
        chown -R asterisk:asterisk freepbx*
        su - asterisk
        cd /opt/freepbx/

    {{< note >}}
This is the latest version of FreePBX at the time of this guide's publication. You can check [this page](http://www.freepbx.org/downloads/freepbx-distro/) for the latest build of FreePBX.
{{< /note >}}

2.  The FreePBX directory contains SQL files that you can insert into the database we created previously. Issue the following commands to insert this data:

        mysql -p asterisk < SQL/newinstall.sql
        mysql -p asteriskcdr < SQL/cdr_mysql_table.sql
        exit

### Configuration

The FreePBX configuration process will ask you a series of questions that you should pay attention to. Some of the default values are fine for a production system, but you will want to change the passwords to prevent unauthorized access.

You need to pass the credentials of the MySQL user and database you created above to the configuration script. Issue the following command:

    cd /opt/freepbx/
    ./install_amp

### Create VirtualHost

Before you continue your FreePBX installation, you will want to configure a `VirtualHost` for the web interface. You should also secure your installation using SSL and an `.htaccess` file. By default, FreePBX installs files to `/var/www/html/`; you may leave this as it is. Your `VirtualHost` may resemble the following:

{{< file "VirtualHost Entry" apache >}}
<VirtualHost *:80>
    ServerAdmin webmaster@example.com
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/html
</VirtualHost>

{{< /file >}}


To update your Apache configuration, you will need to restart the server. Issue the following command:

    service apache2 reload

You should now be able to visit your Linode's IP address or the domain you've pointed at your Linode in your web browser. The first page should prompt you to create a user and password to administer the system from:

[![](/docs/assets/1673-asterisk-3.png)](/docs/assets/1673-asterisk-3.png)

## Configure FreePBX

Now we will use the FreePBX web interface to configure your phone server.

### Update the Modules

From your web browser, go to your FreePBX web interface.

1.  Under the **Admin** menu select **Module Admin**.

    [![The Module Admin button.](/docs/assets/1674-asterisk-4.png)](/docs/assets/1674-asterisk-4.png)

2.  Select the **Unsupported** repository, then press the **Check Online** button.

    [![Module Administration Options.](/docs/assets/1675-asterisk-5.png)](/docs/assets/1675-asterisk-5.png)

3.  Select the **Upgrade All** link. Under the Connectivity section, select **Google Voice/Chan Motif**. If there are other modules on this list you want to install, select them now.
4.  When finished, press the **Process** button, and then **Confirm**.

    {{< note >}}
If downloading modules fails, from the terminal run this command from the terminal: `su asterisk -c 'mkdir /var/www/html/admin/modules/_cache'`. This should resolve the issue.
{{< /note >}}

5.  You will now see a red **Apply Config** button. Use it to enable the modules and updates you just downloaded.

    [![Menu bar with Apply Config.](/docs/assets/1676-asterisk-6.png)](/docs/assets/1676-asterisk-6.png)

6.  To prevent a bug later on, go back to your terminal and issue the following commands:

        cd /etc/asterisk
        rm ccss.conf confbridge.conf features.conf sip.conf iax.conf logger.conf extensions.conf sip_notify.conf

    Then repeat *Steps 1-4*\* but select instead to install or reinstall the `Camp on` module.

### Create an Extension

Your PBX system will need at least one defined extension to send incoming calls to. Note that you can repeat this section for additional extensions.

1.  Under the **Applications** menu select **Extensions**.
2.  Unless you have a custom device to configure, keep the drop down menu at `Generic SIP Device` and hit submit.

    [![Creating the new extension.](/docs/assets/1680-asterisk-10.png)](/docs/assets/1680-asterisk-10.png)

3.  Create your SIP extension. The only fields required are the Extension itself, a Display Name, and a secret (password).

    [![Extension info.](/docs/assets/1681-asterisk-11.png)](/docs/assets/1681-asterisk-11.png)

## Configure Integration with Google Voice

The steps in this section will let your Asterisk server use Google Voice as a trunk for sending and receiving phone calls.

1.  From the FreePBX web interface, under the **Connectivity** menu select **Google Voice (Motif)**. Fill out your Google Voice account information and check the options as show below:

    [![Google Voice options.](/docs/assets/1679-asterisk-9.png)](/docs/assets/1679-asterisk-9.png)

2.  Under **Connectivity** go to **Inbound Routes**. Create an inbound route pointing to your extension:

    [![](/docs/assets/1749-asterisk-12.png)](/docs/assets/1749-asterisk-12.png)

3.  Now you can point your SIP client at your Linode, sign in with your extension and password, and begin making and receiving calls.

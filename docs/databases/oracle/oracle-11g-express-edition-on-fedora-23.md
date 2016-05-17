---
author:
  name: Tyler Nelson
  email: tylernelson12@gmail.com
description: 'Install and configure Oracle 11g XE on Fedora 23.'
keywords: 'oracle,oracle 11g,11g,fedora23,23,fedora'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Monday, May 16th, 2016'
modified: Monday, May 16th, 2016
modified_by:
  name: Tyler Nelson
title: 'Oracle 10g Express Edition on Fedora 23'
contributor:
  name: Tyler Nelson
  link: https://github.com/tylerjaynelson/
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

Oracle 11g is a robust, enterprise-grade relational database management system (RDBMS). The Oracle database platform was the first commercially available SQL-based DBMS, and is a great choice for applications that require large, distributed databases. This guide will help you get started with Oracle 11g XE (Express Edition) on your Fedora 23 Linux VPS.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your operating system.

{: .note}
>
>This guide requires having a Oracle Technology Network account which is Free.
>If you do not have one you will be prompted to create an account later in the tutorial.
>

## Configure Linode

Depending on the amount of memory your Linode has, Oracle may require up to a 1,024 MB swap partition. While we normally do not advise using a swap partition larger than 256 MB, in this case it's a good idea to resize your existing swap to 1,025 MB before proceeding with Oracle installation (the extra MB avoids differences in how megabytes are calculated).

{: .caution}
>
>If you're already using all of your allocated disk space, you may need to shrink your main disk first to accommodate the larger swap image.
>
  
1. Log into the Linode Manager and shut down your Linode. 
2. Once your Linode is completely shut down, click the swap disk under the "Disks" heading in the Dashboard. 
3. Change the size to 1,025 MB. 

## Download Oracle 11g

The following steps are layed out to be performed in any browser on your local machine.

1. Go to the following URL:
    
          http://download.oracle.com/otn/linux/oracle11g/xe/oracle-xe-11.2.0-1.0.x86_64.rpm.zip
  
        {: .note}
        > 
        >You will then be prompted to login to your Oracle Technology Network account.
        >If you do not have one Create one by clicking ***Create Account***.
        >
        >File will download automatically once authenticated with Oracle.
        >

2. Transfer the downloaded zip file to your `/tmp` directory on your linode. If you are unsure how to do this refer to the [How do I Upload Files to my Linode](/docs/platform/linode-beginners-guide#how-do-i-upload-files-to-my-linode) Guide.

## Install Oracle Database 11g XE Requirements

Run the following commands on your Linode.

1.  Install required packages with:

        sudo dnf install glibc make binutils gcc libaio rpm java vi

2.  When prompted type `y` to install packages.

## Install and Configure Oracle Database 11g XE

1. Run the Oracle Database XE ***executable oracle-xe-11.2.0-1.0.x86_64.rpm*** to install Oracle Database XE.

        sudo rpm -ivh /tmp/oracle-xe-11.2.0-1.0.x86_64.rpm
        
        {: .note}
        >
        >Assumes file is saved in /tmp directory. If you placed it elsewhere change the path to where you placed the file.
        >

2. When install completes, run the following command:

        sudo /etc/init.d/oracle-xe configure

3. Enter configuration settings as prompted.

        {: .note}
        >
        >* A valid HTTP port for the Oracle Application Express (the default is 8080)
        >* A valid port for the Oracle database listener (the default is 1521)
        >* A password for the **SYS** and ***SYSTEM*** administrative user accounts
        >* Confirm password for ***SYS*** and ***SYSTEM*** administrative user accounts
        >* Whether you want the database to start automatically when the computer starts (next reboot)
        >
        
        {: .note}
        >
        >The password for the ***INTERNAL*** and ***ADMIN*** Oracle Application Express user accounts is initially the same as the ***SYS*** and ***SYSTEM*** administrative user accounts.
        >

## Set Oracle Database 11g XE Environment Variables

After you have installed and configured Oracle Databse XE, users must have their environment set before they can use Oracle Databse XE.

The following must be done for each user that you want to have be able to interact with oracle via ssh.
For this example the user I will use is `testuser` replace it with your desired user's username.

1. Go to users home directory.

        cd ~testuser

2. Open **.bash_profile** (to log in) and/or ***.bashrc*** file (to open a new shell) with one of the following:

        >`sudo vi .bash_profile`
        >
        >OR
        >
        >`sudo vi .bashrc`
    

3. Append the following to the file(s):

        . /u01/app/oracle/product/11.2.0/xe/bin/oracle_env.sh

## Administer Oracle Database 11g XE

### Start Oracle Databse

    /etc/init.d/oracle-xe start

### Stop Oracle Databse

    /etc/init.d/oracle-xe stop

{: .note}
>
>Database creation logs can be found in `$ORACLE_HOME/config/log/*`.

### Make Oracle Accessable to Remote Clients

1. Start SQL*Plus and log in as `SYSTEM`:

        $ sqlplus system
        Enter password: SYSTEM_password
        
2.  At the SQL prompt, run the following command:

        EXEC DBMS_XDB.SETLISTENERLOCALACCESS(FALSE);

## Uninstall Oracle Database 11g XE

1. Run the following command to uninstall:

        rpm -e oracle-xe

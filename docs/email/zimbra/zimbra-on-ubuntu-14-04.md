---
---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install Zimbra OSE 8.6 on Ubuntu 14.04 LTS'
keywords: 'zimbra,mailserver,postfix,webmail,install'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
external_resources:
 - '[Zimbra OSE Documentation](https://www.zimbra.com/documentation/zimbra-collaboration-open-source)'
 - '[Running a Mail Server](/docs/email/running-a-mail-server)'
published: 'Tuesday, August 18th, 2015'
modified: Tuesday, August 18th, 2015
modified_by:
    name: Linode
title: 'Zimbra OSE on Ubuntu 14.04'
contributor:
    name: Bill Bardon
---

#Install Zimbra OSE 8.6 on Ubuntu 14.04 LTS Linode

##Intro

Zimbra is a complete mail server that provides a configured postfix with opendkim, amavis, clam-av, and ngnix, ready to handle mail for one or more domains. Zimbra on a Linode is one of the quickest paths to an up-and-running mail server that you will find. This guide will take you through the Zimbra installation procedure.

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Get your Linode set up

1. Create your Linode

Use a minimum of 4 GB of RAM, Zimbra will not perform well on less.

See [Getting Started](https://www.linode.com/docs/getting-started) for help setting up your host.

2. Deploy an Ubuntu 14.04 LTS image to your Linode. 

I use slightly less than half the available disk space for the first image, keeping the other half for taking a backup image before updates. Your partition size will depend on the number of accounts and volume of mail you expect to handle. Once deployed, boot your new host, and SSH in to the terminal using the command shown on your Remote Access page in Linode Manager, and the password you entered when you created the node.

The base Ubuntu install provides most of the requirements for installing Zimbra 8.6. I needed to install a few that were missing. We will cover that a little further on.

3. Set the hostname.

You must [set the hostname](https://www.linode.com/docs/getting-started#ubuntu-1404--debian-7) and [update /etc/hosts](https://www.linode.com/docs/getting-started#update-etchosts) prior to installing Zimbra. 

4. Configure DNS.

Configure your DNS entries at your DNS provider to provide an A record for the host, and point the domain MX record to your new server. A reverse DNS pointer is highly recommended to prevent mail from your server being rejected. See the Linode Guide on running a mail server in the External Resources for details on setting up DNS.

##Install Zimbra

1. Download the Zimbra install file to your Linode.

Get Zimbra OSE 8.6 from here: [Zimbra Open Source Edition Downloads](https://www.zimbra.com/downloads/zimbra-collaboration-open-source). It's a good idea to read the Release Notes and understand the requirements and caveats before installing. Choose the Ubuntu 14.04 LTS 64-bit release and download it to your Linode with wget. To do this, right-click the _64bit x86_ link in your browser and Copy the link from the Zimbra page. Paste it into your shell command and execute it:

    wget https://files.zimbra.com/downloads/8.6.0_GA/zcs-8.6.0_GA_1153.UBUNTU14_64.20141215151116.tgz

2. Extract the file to your Linode root user directory or a temp directory with sufficient space.

    tar xzf zcs-8.6.0_GA_1153.UBUNTU14_64.20141215151116.tgz

3. Change to the new zcs-8.6.0* directory. Easy way to do this: type

    cd zcs-8

and then press the **Tab** key. Bash will auto-complete the directory name for you. Press **Enter** to complete the command.

4. Run the install.sh file
 
    ./install.sh

After checking some prerequisites, you will be asked to accept the license agreement. Note that while Zimbra OSE is open source, it is not GPL. The link the script displays allows you to read the terms. If you decide not to install, leave the default reply as **N** and press **Enter**. Otherwise type **Y** and press **Enter** to continue. (At any time while running the install script, to accept the default answer shown in brackets, you may simply press **Enter**.)


    root@localhost:~/zcs-8.6.0_GA_1153.UBUNTU14_64.20141215151116# ./install.sh 

    Operations logged to /tmp/install.log.878
    Checking for existing installation...
	zimbra-ldap...NOT FOUND
	zimbra-logger...NOT FOUND
	zimbra-mta...NOT FOUND
	zimbra-dnscache...NOT FOUND
	zimbra-snmp...NOT FOUND
	zimbra-store...NOT FOUND
	zimbra-apache...NOT FOUND
	zimbra-spell...NOT FOUND
	zimbra-convertd...NOT FOUND
	zimbra-memcached...NOT FOUND
	zimbra-proxy...NOT FOUND
	zimbra-archiving...NOT FOUND
	zimbra-core...NOT FOUND


    PLEASE READ THIS AGREEMENT CAREFULLY BEFORE USING THE SOFTWARE.
    ZIMBRA, INC. ("ZIMBRA") WILL ONLY LICENSE THIS SOFTWARE TO YOU IF YOU
    FIRST ACCEPT THE TERMS OF THIS AGREEMENT. BY DOWNLOADING OR INSTALLING
    THE SOFTWARE, OR USING THE PRODUCT, YOU ARE CONSENTING TO BE BOUND BY
    THIS AGREEMENT. IF YOU DO NOT AGREE TO ALL OF THE TERMS OF THIS
    AGREEMENT, THEN DO NOT DOWNLOAD, INSTALL OR USE THE PRODUCT.

    License Terms for the Zimbra Collaboration Suite:
      http://www.zimbra.com/license/zimbra-public-eula-2-5.html



    Do you agree with the terms of the software license agreement? [N]


Answering **Y**, the installer checks for installed software and reports any discrepancies.


    Checking for prerequisites...
	FOUND: NPTL
	FOUND: netcat-openbsd-1.105-7ubuntu1
	FOUND: sudo-1.8.9p5-1ubuntu1.1
	FOUND: libidn11-1.28-1ubuntu2
	FOUND: libpcre3-1:8.31-2ubuntu2.1
	MISSING: libgmp10
	FOUND: libexpat1-2.1.0-4ubuntu1
	FOUND: libstdc++6-4.8.4-2ubuntu1~14.04
	MISSING: libperl5.18
	MISSING: libaio1
	FOUND: resolvconf-1.69ubuntu1.1
	FOUND: unzip-6.0-9ubuntu1.3

    Checking for suggested prerequisites...
	MISSING: pax does not appear to be installed.
	FOUND: perl-5.18.2
	FOUND: sysstat
	MISSING: sqlite3 does not appear to be installed.

    ###WARNING###

    The suggested version of one or more packages is not installed.
    This could cause problems with the operation of Zimbra.

    Do you wish to continue? [N] 


If any _MISSING_ packages are found, answer No and fix the problems. You may need to [install missing packages using apt-get](https://www.linode.com/docs/tools-reference/linux-package-management#debian-and-ubuntu-package-management), for example:

    apt-get install libgmp10 libperl5.18 libaio1 pax sqlite3

Once missing packages are installed, start the installer again. Zimbra will continue with package installation. Accept all the defaults, with the possible exception of the SNMP package if you've no use for SNMP monitoring.

    Checking for installable packages

    Found zimbra-core
    Found zimbra-ldap
    Found zimbra-logger
    Found zimbra-mta
    Found zimbra-dnscache
    Found zimbra-snmp
    Found zimbra-store
    Found zimbra-apache
    Found zimbra-spell
    Found zimbra-memcached
    Found zimbra-proxy


    Select the packages to install

    Install zimbra-ldap [Y] 

    Install zimbra-logger [Y] 

    Install zimbra-mta [Y] 

    Install zimbra-dnscache [Y] 

    Install zimbra-snmp [Y] n

    Install zimbra-store [Y] 

    Install zimbra-apache [Y] 

    Install zimbra-spell [Y] 

    Install zimbra-memcached [Y] 

    Install zimbra-proxy [Y] 
    Checking required space for zimbra-core
    Checking space for zimbra-store
    Checking required packages for zimbra-store
    zimbra-store package check complete.

    Installing:
	zimbra-core
	zimbra-ldap
	zimbra-logger
	zimbra-mta
	zimbra-dnscache
	zimbra-store
	zimbra-apache
	zimbra-spell
	zimbra-memcached
	zimbra-proxy

    The system will be modified.  Continue? [N]


At this point you are ready to allow the install, so answer **Y**. The packages will be installed and most Zimbra settings will be configured to default settings.

    Setting defaults...

    DNS ERROR resolving MX for linodemail.computassist.net
    It is suggested that the domain name have an MX record configured in DNS
    Change domain name? [Yes] 

If you receive an error about a missing MX record, it means your domain DNS records are not matching what Zimbra expects to find, based on the hostname you configured earlier. Check your /etc/hostname file and your [DNS records](https://www.linode.com/docs/networking/dns/introduction-to-dns-records#mx) to resolve the problem.

In this case I am setting up a test server that will not serve an actual domain, so I continue by answering **N** to skip changing the domain name.

Next you are presented the Main menu. The installer displays the current settings for Zimbra and allows you to change them. Enter the number of the main section you want to change, and the submenu for that section will be displayed. Enter the number of the item in the section that you want to change, and enter your preferred value.


    Main menu

      1) Common Configuration:                                                  
      2) zimbra-ldap:                             Enabled                       
      3) zimbra-logger:                           Enabled                       
      4) zimbra-mta:                              Enabled                       
      5) zimbra-dnscache:                         Enabled                       
      6) zimbra-store:                            Enabled                       
	    +Create Admin User:                    yes                           
	    +Admin user to create:                 admin@linodemail.computassist.net
    ******* +Admin Password                        UNSET                         
	    +Anti-virus quarantine user:           virus-quarantine.hz5iaa9xdq@linodemail.computassist.net
	    +Enable automated spam training:       yes                           
	    +Spam training user:                   spam.exape8mcb@linodemail.computassist.net
	    +Non-spam(Ham) training user:          ham.j30qodo1o5@linodemail.computassist.net
	    +SMTP host:                            linodemail.computassist.net   
	    +Web server HTTP port:                 8080                          
	    +Web server HTTPS port:                8443                          
	    +Web server mode:                      https                         
	    +IMAP server port:                     7143                          
	    +IMAP server SSL port:                 7993                          
	    +POP server port:                      7110                          
	    +POP server SSL port:                  7995                          
	    +Use spell check server:               yes                           
	    +Spell server URL:                     http://linodemail.computassist.net:7780/aspell.php
	    +Enable version update checks:         TRUE                          
	    +Enable version update notifications:  TRUE                          
	    +Version update notification email:    admin@linodemail.computassist.net
	    +Version update source email:          admin@linodemail.computassist.net
	    +Install mailstore (service webapp):   yes                           
	    +Install UI (zimbra,zimbraAdmin webapps): yes                           

      7) zimbra-spell:                            Enabled                       
      8) zimbra-proxy:                            Enabled                       
      9) Default Class of Service Configuration:                                
      s) Save config to file                                                    
      x) Expand menu                                                            
      q) Quit                                    

    Address unconfigured (**) items  (? - help) 
					    
At a minimum, you should set the admin password and DNS servers. To set the password, enter **6** to display the zimbra-store menu, then **4** to type a new password at the prompt. Enter **r** to return to the main menu. For DNS, enter the zimbra-dnscache menu, then change the Master DNS IP addresses. Return to the main menu.

{: .note}
>It is common to run mail servers on UTC, as they regularly accept mail from all over the world. This helps when tracing mail flow, when Daylight Saving kicks in or out, and just makes reading logs easier. You may choose to use local time if you prefer.

Enter **a** to apply your changes to the settings. Finally, enter **Y** to continue the install.

    *** CONFIGURATION COMPLETE - press 'a' to apply
    Select from menu, or press 'a' to apply config (? - help) a
    Save configuration data to a file? [Yes] 
    Save config in file: [/opt/zimbra/config.13935] 
    Saving config in /opt/zimbra/config.13935...done.
    The system will be modified - continue? [No] y

The installer will begin the final steps to complete the Zimbra install. It will inform you of its progress at each step. When finished, it will ask if you wish to share notification of your new installation with the folks at the Zimbra home office.

    You have the option of notifying Zimbra of your installation.
    This helps us to track the uptake of the Zimbra Collaboration Server.
    The only information that will be transmitted is:
	    The VERSION of zcs installed (8.6.0_GA_1153_UBUNTU14_64)
	    The ADMIN EMAIL ADDRESS created (admin@linodemail.computassist.net)

    Notify Zimbra of your installation? [Yes] 
    Notifying Zimbra of installation via http://www.zimbra.com/cgi-bin/notify.cgi?VER=8.6.0_GA_1153_UBUNTU14_64&MAIL=admin@linodemail.computassist.net

    Notification complete


    Setting up zimbra crontab...done.


    Moving /tmp/zmsetup08172015-184201.log to /opt/zimbra/log


    Configuration complete - press return to exit 

##Trying out your new mail server

Visit the hostname with your browser, using https and port 7071. For example, https:// `mail.example.com` :7071/. This will open the login page for the admin console. Log in using the admin account and password created during install. From this console you can configure default settings for new accounts (Zimbra calls this a Class Of Service, or COS), add and manage accounts, change passwords, and generally manage your mail server.

{: caution}
>since you haven't installed a trusted cert yet, you will likely get a browser warning about an untrusted site. Bypass the warning for now. Later you can either add Zimbra's self-signed cert to your browser or install a trusted cert in Zimbra.

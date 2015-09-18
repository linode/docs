---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install Zimbra OSE 8.6 on Ubuntu 14.04 LTS Linode'
keywords: 'Zimbra,mail server,postfix,web mail'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Friday, September 4th, 2015'
modified: Friday, September 4th, 2015
modified_by:
    name: Linode
title: 'Install Zimbra OSE 8.6 on Ubuntu 14.04 LTS Linode'
contributor:
    name: Bill Bardon
external_resources:
 - '[Zimbra OSE Documentation](https://www.zimbra.com/documentation/zimbra-collaboration-open-source)'
 - '[Running a Mail Server](/docs/email/running-a-mail-server)'
---

Zimbra is a complete mail server that provides a configured Postfix with OpenDKIM, Amavis, ClamAV, and Nginx, ready to handle mail for one or more domains. Zimbra on a Linode is one of the quickest paths to an up-and-running mail server that you will find. This guide will take you through the Zimbra installation procedure.

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Set up your Linode

1.  Create your Linode. Use a minimum of 4 GB of RAM, Zimbra will not perform well on less. See [Getting Started](https://www.linode.com/docs/getting-started) for help setting up your host.

2.  Deploy an Ubuntu 14.04 LTS image to your Linode. I use slightly less than half the available disk space for the first image, keeping the other half for taking a backup image before updates. Your partition size will depend on the number of accounts and volume of mail you expect to handle. Once deployed, boot your new host, and SSH in to the terminal using the command shown on your Remote Access page in Linode Manager, and the password you entered when you created the node.

    The base Ubuntu install provides most of the requirements for installing Zimbra 8.6. I needed to install a few that were missing. We will cover that a little further on.

3.  Set the hostname.

    You must [set the hostname](https://www.linode.com/docs/getting-started#ubuntu-1404--debian-7) and fully qualified domain name (FQDN), and [update /etc/hosts](https://www.linode.com/docs/getting-started#update-etchosts) prior to installing Zimbra. 

4.  Configure DNS.

    Configure your DNS entries at your DNS provider to provide an A record for the host, and point the domain MX record to your new server. A reverse DNS pointer is highly recommended to prevent mail from your server being rejected. See the Linode Guide on running a mail server in the External Resources for details on setting up DNS.


## Install Zimbra

1.  Download the Zimbra install file to your Linode. Get Zimbra OSE 8.6 from here: [Zimbra Open Source Edition Downloads](https://www.zimbra.com/downloads/zimbra-collaboration-open-source). It's a good idea to read the Release Notes and understand the requirements and caveats before installing. Choose the Ubuntu 14.04 LTS 64-bit release and download it to your Linode with `wget`. To do this, right-click the _64bit x86_ link in your browser and Copy the link from the Zimbra page. Paste it into your shell command and execute it:

        wget https://files.zimbra.com/downloads/8.6.0_GA/zcs-8.6.0_GA_1153.UBUNTU14_64.20141215151116.tgz

2.  Extract the file to your Linode root user directory or a temp directory with sufficient space.

        tar xzf zcs-8.6.0_GA_1153.UBUNTU14_64.20141215151116.tgz

3.  Change to the new zcs-8.6.0* directory:

        cd zcs-8.6.0*

4.  Run the install.sh file
 
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


    If any _MISSING_ packages are found, answer No to quit the installer and fix the problems. You may need to [install missing packages using apt-get](/docs/tools-reference/linux-package-management#debian-and-ubuntu-package-management), for example:

        apt-get install libgmp10 libperl5.18 libaio1 pax sqlite3

    {: .note}
    >This Guide is about setting up a new Zimbra Linode, but if you are upgrading an existing Zimbra installation, it is very important that you read the Release Notes that Zimbra provides! The notes are found on the Download page where you found the software. There may be steps that are required to be performed before or after you upgrade.

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

    If you receive an error about a missing MX record, it means your domain DNS records are not matching what Zimbra expects to find, based on the hostname you configured earlier. Check your `/etc/hostname` file and your [DNS records](/docs/networking/dns/introduction-to-dns-records#mx) to resolve the problem.

    If you are only testing Zimbra and not deploying, continue by answering **N** to skip changing the domain name.

    Next you are presented the Main menu. The installer displays the current settings for Zimbra and allows you to change them. Enter the number of the main section you want to change, and the sub-menu for that section will be displayed. Enter the number of the item in the section that you want to change, and enter your preferred value.


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
					    
    At a minimum, you should set the admin password and DNS servers. To set the password, enter **6** to display the `zimbra-store` menu, then **4** to type a new password at the prompt. Enter **r** to return to the main menu. For DNS, enter the `zimbra-dnscache` menu, then change the Master DNS IP addresses. Return to the main menu.

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


## Trying out Your New Mail Server

Visit the hostname with your browser, using https. For example, `https://mail.example.com`. This will open the login page. Log in using the admin account and password created during the install.

{: .caution}
>Since you haven't installed a trusted cert yet, you will likely get a browser warning about an untrusted site. Bypass the warning for now. Later you can either add Zimbra's self-signed cert to your browser or install a trusted cert in Zimbra.

If you configured the appropriate DNS records (step 4 of **Set up your Linode**), you should be able to send from and receive mail to this account.

##Configuring your Zimbra server

Zimbra provides two ways to manage configuration, a web console and the command line. The command line interface is beyond the scope of this Guide, but you can find it documented in Appendix A of the Administrator's Guide, a link to which is provided in the Help Center in your admin console.

![Open the Help Center](/docs/assets/OpenHelpCenter.png)

![Help Center, with link to Administrator's Guide](/docs/assets/HelpCenter.png)

Visit the hostname with your browser, using https and adding port 7071 after the domain. For example, `https:// mail.example.com:7071`. This will open the login page for the admin console. Log in using the admin account and password created during install. 

![Zimbra admin console](/docs/assets/AdminConsole.png)

You can also reach the admin console if you are already logged in to your Zimbra web mail page. A drop-down menu beside your account name in the upper right of the window provides a link to the admin console. ![Go to the admin console from your email account](/docs/assets/GoToAdminConsole.png)

From this console you can configure default settings for new accounts (Zimbra calls this a Class Of Service, or COS), add and manage accounts, change passwords, and generally manage your mail server.

###Global Settings

Your server was configured when you installed, and most of those settings will work as is. You may want to visit a few in particular to control who it is willing to talk to and eliminate some types of spam. 

1.  From the admin console Home menu, click **Configure** and then **Global Settings**. There is a page menu on the left. Feel free to browse, there are hundreds of options here.

2.  Click the **MTA** page to configure some Postfix settings that can control from whom you will accept mail. If you have known servers on other networks outside your own from which you want to accept mail, you can add them to the **MTA Trusted Networks**. Enter them as space-separated IP network specifications, e.g. "127.0.0.0/8 10.0.0.0/16 12.34.56.78/32". 

3.  Control your **Maximum message size** in the Messages section. Enter your limit in KB, so 25 MB would be 26214400.

4.  The **Protocol checks** can stop many spam messages before they enter your system. You may turn them all on, but at least _Sender address must be fully qualified_ should be checked.

5.  **DNS checks** use Realtime Black Lists to reject mail coming from known spamming servers. The one blocking the most mail on my server is zen.spamhuas.org, but you can also try cbl.abuseat.org and bl.spamcop.net. Enter these domain names into the **List of Client RBLs**.

6.  You can continue on to the other pages in Global Settings, but why not take a second to click the `Save` button up top right now?

7.  Click the **AS/AV** page. Here you determine how "spammy" a message has to be to get tagged or rejected. Zimbra uses SpamAssassin to score every message. A score of zero or less than zero means the message is likely to be worth delivering. A score above zero means there are some indicators that this could be an unwanted email. The **Kill percent** is the score above which Zimbra will not deliver the message at all. The **Tag percent** is the score above which Zimbra will let the message through, but deliver it to the Junk folder. 

    These percentages will vary depending on your incoming mail stream. You have to balance controlling spam with getting false positives on good mail. Also, these numbers apply globally to all your accounts. Experimentation will show you which way to move. Zimbra starts at Kill = 75, Tag = 33. You will probably experience quite a bit of spam still coming through at those values. After much testing and over a year of gradually walking them down, I arrived at Kill = 20, Tag = 4. Please test under your own conditions and learn your own optimal values!

    {: .note}
    >The admin console has built-in descriptions for most settings. Click the label for the input item and a tool tip will appear. Click the **More** button below right and a more detailed note will be shown.

    ![Click label for a tool tip](/docs/assets/Tooltip.png) ![Click More for details](/docs/assets/Tooltipmore.png)

8.  Click the `Save` button again, and then the `Home` button top left.

9.  If you made changes to Global Settings, restart your server before continuing.

###Classes of Service

Zimbra installs a default class of service which will be applied to all new accounts. If you don't need to give different capabilities or settings to different groups of users, this default class will be all you need. You can create additional classes and then assign them to users as required to control their privileges, access to features, quotas, and default settings.

1.  To manage COS in the console, click the **Configure** menu option. The Configure menu opens, and **Class of Service** is already selected. 

    ![Configure menu](/docs/assets/ConfigureMenu.png)

2.  Double-click the **default** COS and the Class of Service page opens. There is a page menu on the left. Each page allows you to modify the settings of this COS.

    ![Class of Service page](/docs/assets/ClassOfService.png)

3.  You will want to go through the **Features** page and decide what you want to offer your users. You may wish to turn off the Briefcase (file saving and sharing) if you don't have enough storage, restrict some forms of sharing, or enable external POP or IMAP access, for example.

4.  Next, comb through **Preferences**, setting each item the way you want it for your users. Remember, all of these settings apply to this class of service only, and you can create other classes if needed.

5.  Finally, view the **Advanced** page. It's recommended to set an **Account quota**, even if it's fairly large, to prevent one user from consuming all the disk space. You can customize your **Quota warning message template** here. Scroll down to set password requirements, lockout options, and Trash and Spam retention policies.

6.  If needed, you can proceed to add more classes of service and define all these settings for another type of user. Different classes could have different quotas, access to more or fewer features, or perhaps one group gets external IMAP or access to the Briefcase tab. Note that individual user account settings can override the COS settings. New user accounts will be assigned the default COS unless you have defined another and choose it when creating the account.
 
###User Accounts

You received an admin account when you installed Zimbra. The Open Source Edition has no limit on the number of accounts you can have. It is only limited by your server's ability to handle the traffic. If you have been through the **Classes of Service**, creating another account will be a trip through familiar territory, as most of the settings are the same, but applicable to this individual account.

####To create an account

1.  from the **Home* page click **Manage**. The **Accounts** page will be displayed.

2.  Click the gear icon top right, then click `New`.

    ![Open the new account dialog](/docs/assets/OpenNewAccount.png)

    ![Create a new account](/docs/assets/NewAccount.png)

3.  The only items _required_ to be filled in are the email address, and the last name. Notice once you have entered those the `Finish` button is enabled. But you will want to create a temporary password, and possibly override the default COS if you've set up others.

4.  If you want to explicitly set other properties on this account, click `Next` to proceed through the pages. At any time, you can `Finish` and accept the defaults for the rest of the properties.

5.  Once you have created the account, it is immediately ready to use.

####Managing accounts

When users forget their passwords, resets are easily accomplished. 

1.  On the **Manage Accounts** page, right-click the account you want to change, and click **Change Password**. 

    ![Change a user password](/docs/assets/ContextChangePassword.png)

2.  Enter a temporary password which you will relay to the user, and also click **Must change password**. The next time they log in, they will be prompted to choose a new password.

    ![Change password dialog](/docs/assets/ChangePassword.png)

###Install an SSL Certificate

Zimbra creates and uses a self-signed SSL security certificate upon installation. If you are planning to offer your email service to others, you will want to install a trusted certificate from a third-party Certificate Authority (CA).

####To create the Certificate Signing Request (CSR)

1.  Log in to the Zimbra admin console

2.  Click the Configure menu, then Certificates.

3.  Click the gear icon in the toolbar and select Install Certificate.

4.  The Zimbra Certificate Installation Wizard will open. Choose your primary domain and click Next.

5.  Select the option to generate the Certificate Signing Request (CSR) and click Next.

6.  For details on how to properly fill the form, I suggest visiting the CA where you are planning to purchase the cert, and following their recommendations. Generally, you will enter your FQDN as the common name, the appropriate country, state/province, city and your own organization name. Leave the Alternative name blank if your cert will only be used for the primary domain, or enter the other forms of your domain (different hosts, subdomains) if you will be getting a wildcard or multi-domain cert. For purposes of email, your cert only needs to authenticate your server's FQDN.

7.  Copy the CSR text and Finish the Zimbra wizard, switch to your third-party CA's web site and follow through their process to purchase your SSL certificate.

####Once you have received your cert files from the CA, install it in Zimbra.

1.  In the Zimbra admin console, click the Configure menu, then Certificates.

2.  Click the gear icon in the toolbar and select Install Certificate.

3.  The Zimbra Certificate Installation Wizard will open. Choose your primary domain and click Next.

4.  Select the option to install the commercially signed certificate and click Next.

5.  Review the information in your CSR one more time, then click Next.

6.  Upload the files received from your CA. Various CAs deliver the certificate, the intermediate CA and root CA files in different ways. You may receive a ZIP file containing everything you need, or you may need to download the root and intermediate CA files from their web site. Again, consult your CA's web site for the correct handling of these files. Once you have all the needed pieces, upload each component using the Browse buttons in the Certificate Installation Wizard. Then click Next.

7.  The wizard will install the new cert. Once finished, you can confirm the install in two ways. In the admin console, go to Configure, Certificates, and double-click your server name. The certificate information will be displayed. Or, visit your server's Zimbra web mail page and display the cert info in your browser.

##Further reading

[Zimbra OSE Documentation](https://www.zimbra.com/documentation/zimbra-collaboration-open-source)

[Running a Mail Server](https://www.linode.com/docs/email/running-a-mail-server)

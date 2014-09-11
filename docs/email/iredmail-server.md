---
author:
  name: Nick Reichley
  email: nick@reichley.co
description: 'Installing and Securing iRedMail'
keywords: 'mail server,linode guide,running a mail server,linode quickstart guide'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['mailserver/']
contributor:
    name: Nick Reichley
modified: Thursday, September 11, 2014
modified_by:
  name: Alex Fornuto
published: ''
title: Installing and Securing iRedMail on your Linode
---


#Introduction
Why should YOU host your own mail server? Running your own mail server allows one to set the size of your mailboxes (and attachments), run hourly/daily email backups and, most importantly, gives you the freedom to use any domain name available. Purchase/secure a [linode] [l], grab a domain name and let's get started!

With [iRedMail] [i], this isn’t a difficult task. Per the iredmail.org website, iRedMail is “A ZERO COST, fully fledged, full-featured mail server solution. All used packages are free and open source, provided by the Linux/BSD distribution venders you trust” and is “an open source project, released under GPLv2, hosted on BitBucket.”

All you’ll need to get your very own mail server up and running in a less than 30 minutes is a domain name, a little command line knowhow, and a linode running Ubuntu 12 or 14 (this How-To uses 14.04). 

##Starting Point  

***This guide assumes you've followed the Linode "Getting Started" documentation and have an Ubuntu 14.04 linode running. If you haven't done so, please click [HERE] [h] and return to this guide following the completion of the "Setting the Hostname" section.***

#The Install  

1 Let's start off by making sure your Ubuntu linode is up-to-date by running the following commands (hereafter RTFCs) as root:

    apt-get update
    apt-get upgrade


2 Now let's check our hostname to ensure we have a FQDN with a subdomain by RTFCs.

    hostname -f

*NOTE: This is a requirement when installing iRedMail. The installation will not progress if your hostname and proposed virutal domain name are one and the same. Example: hostname = yourdomain.com, requested virtualdomain name (part of email address following the "@") = yourdomain.com will NOT work. Instead try mx.yourdomain.com or mail.yourdomain.com for hostname.*

![hostname command](http://i1054.photobucket.com/albums/s500/nicklinode/hostname_zps87005269.png)  

3 It's time to download the latest release of iRedMail and begin the installation. Switch to the root user. The current release (as of 30 August 2014) is 0.8.7 and can be downloaded by RTFCs:


    cd /root/
    wget https://bitbucket.org/zhb/iredmail/downloads/iRedMail-0.8.7.tar.bz2
    tar xjf iRedMail-0.8.7.tar.bz2
    cd iRedMail-0.8.7
    bash iRedMail.sh


![iredmail download](http://i1054.photobucket.com/albums/s500/nicklinode/downloadandrun_zps66a9d76f.png)

4 The remainder of the installation refers to on-screen confirmation of default options and selections. With the exception of the backend and hostname selections, most users will simply confirm the default options and continue the installation. 

Additionally, the next few steps were taken directly from the iRedMail [Ubuntu installation steps][u].  

5 Press ENTER to say "yes" to installing iRedMail. NOTE: Ctrl-C will exit the installation process when pressed at any time prior to step #12.

![iredmail install confirm](http://i1054.photobucket.com/albums/s500/nicklinode/step5_zpsbe09ecfc.png)

``Press ENTER``

6 Press ENTER to accept /var/vmail as the default mail storage directory

![mail storage dir](http://i1054.photobucket.com/albums/s500/nicklinode/step6_zpse32b9957.png)

Press ``ENTER``

7 While most will want MySQL as their backend database, use the UP and DOWN arrow keys to highlight your preferred backend and press SPACE BAR to select the option then press ENTER.

![choose backend db](http://i1054.photobucket.com/albums/s500/nicklinode/step7_zps951fb947.png)

``DOWN ARROW`` to MySQL and Press ``ENTER``

8 Choose a password for your MySQL root administrator and press ENTER. Be sure to commit the password to memory (or paper). 

![mysql password](http://i1054.photobucket.com/albums/s500/nicklinode/step8_zps70283f6c.png)

``******** and Press ENTER``

9 Specify your virtual domain name (which will be the latter half of your desired email address) and press ENTER.

![virtual domain name](http://i1054.photobucket.com/albums/s500/nicklinode/step9_zps267f6637.png)

``yourdomain.com and Press ENTER``

10 By default, iRedMail installs postmaster@yourdomain.com as the default administrator. Enter a password for your iRedMail administrator and press ENTER. Like step 8 above, be sure to make a note of the password.

![admin password](http://i1054.photobucket.com/albums/s500/nicklinode/step10_zps473788aa.png)

``******* and Press ENTER``

11 The next screen lists optional components to be included in your MySQL backend. While none of these are required, I recommend the installation of all components since the benefits of each add to the function and security of your mail server.

![mysql backend](http://i1054.photobucket.com/albums/s500/nicklinode/step11_zps74471b73.png)

``Press ENTER``

12 This step indicates that the configuration is complete, references the location of the SENSITIVE config file and asks (y or n) if you’d like to continue.

![config complete](http://i1054.photobucket.com/albums/s500/nicklinode/step12_zps9bd687d7.png)

``Press y``

13 The installer then downloads and installs the appropriate files. After it completes you will receive a question regarding whether you’d like to use iRedMail’s firewall rules (/etc/default/iptables) and SSHD port identified (y or n)

![iredmail fw and ssh port](http://i1054.photobucket.com/albums/s500/nicklinode/step13_zpsa6a79301.png)

``Press y``


14 After selecting “y” in will ask if you’d like to restart the firewall (y or n)?

![restart firewall](http://i1054.photobucket.com/albums/s500/nicklinode/step14_zpsc6638ae3.png)

``Press y``

15 The installation is now complete! :) While the bottom half of the screen is filled with useful URL information and the location of the iRedMail tips file, a couple emails will be waiting in postmaster@yourdomain.com’s inbox SO simply reboot the linode and navigate to https://mail.yourdomain.com/mail and login as “postmaster@yourdomain.com” to retrieve the necessary info. Oh, and DON’T FORGET to move the config file out of the install location…

![install complete](http://i1054.photobucket.com/albums/s500/nicklinode/step15_zpsa9e8c709.png)

``reboot``

16 Remember to secure your config file (stored in same location you ran the iRedMail.sh script from) and print out and move (or delete) the handy dandy email the server sends to you with all the usernames, passwords, pertinent URLs, and location of important files and directories.

#Certificates, SPF, DKIM, and rDNS

By default iRedMail generates a key and self-signed certificate for the mail (and web, Roundcube webmail) server. We want to rock our own, legitimate certs for both email and the web (because NO ONE likes the pesky "certificate cannot be verified" warning messages on the web and when setting up mail accounts in mail clients)

The process of creating a signing key, submitting a certificate signing request, and receiving your certificate (and other CA certs) is outside the scope of this How-To. We'll assume you have the .key and .crt (or .pem) in hand and are ready to go. NOTE: Be sure to apply for a certificate covering either your subdomain (mail.yourdomain.com) or a wildcard of your domain so all subdomains are covered).

Upon successful install and logging in using the postmaster account you should have two emails waiting for you. The first is titled "Helpful Links iRedMail" and the second is titled "Details of this iRedMail installation." In the 2nd email, there are various filepaths we're interested in since we'll be replacing the SSL certs and need to know the DKIM public key for our DNS TXT entry. First up, cert replacement.

##Certificates

1 After moving your certificate and key onto your linode, make a note of it's location. NOTE: The recommendation is to install in the same directories as the iRedMail default cert and key (cert= /etc/ssl/certs/ key=/etc/ssl/private/).

2 To replace the certs used by Apache2, subsitute the following paths (in /etc/apache2/sites-available/default-ssl.conf) with the location of your certificate and key:

``SSLCertificateFile /etc/ssl/certs/iRedMail_CA.pem``

``SSLCertificateKeyFile /etc/ssl/private/iRedMail.key``


3 To replace the certs used by Postfix, subsitute the following paths (in /etc/postfix/main.cf) with the location of your certificate and key:

``smtpd_tls_cert_file = /etc/ssl/certs/iRedMail_CA.pem``

``smtpd_tls_key_file = /etc/ssl/private/iRedMail.key``


4 To replace the certs used by Postfix, subsitute the following paths (in /etc/dovecot/dovecot.conf) with the location of your certificate and key:

``ssl_cert = </etc/ssl/certs/iRedMail_CA.pem``

``ssl_key = </etc/ssl/private/iRedMail.key``


5 To apply the certificate changes to both your web and mail server, run the following commands: *(NOTE: There should be no errors noted)*

```sh
service apache2 restart
service dovecot restart
service postfix restart
```

##SPF, DKIM and rDNS
With your certificates out of the way, the last thing we’ll cover is the insertion of SPF and DKIM records in your DNS entry. SPF allows us to specify the authority to send mail from our domain to specific ip addresses. DKIM is another way of proving the validity of a sender of email by allowing the receiver to check a public key (mail server’s dns txt record) against the dkim key included in every email message sent by your mail server.

###SPF

1 Navigate to your DNS provider (either where you purchased your domain name or Linode, if you’ve transferred your DNS) and enter the following bits of information in your subdomain area to activate SPF:


hostname	 | ip address/url | record type | ttl
-----------  | -------------- | ----------  | ---
@	 | v=spf1 ip4:xx.xxx.xx.xxx -all | txt | 1800

2 The “xxx” is, of course, your server’s ip address and the “-all” states that NO OTHER ip addresses may serve mail for the domain. Now, on to DKIM

3 If this was a bit confusing you can check out the [SPF website link][s] recommended by iRedMail. 

###DKIM

1 In the same area of your DNS host records, add the following entry to enable DKIM:

hostname | ip address/url | record type | ttl
-----------  | -------------- | ----------- | ---
dkim._domainkey | v=DKIM1; p=MIGFdfs… | txt | 1800

2 The ip address/url entry following the “p=“ is your public DKIM key, which can be found in your “Details of this iRedMail installation” email about halfway down under the “DNS record for DKIM support” section. Copy everything BETWEEN the double quotes and place after the “p=“ portion of the dkim._domainkey DNS entry.

![dns spf entry](http://i1054.photobucket.com/albums/s500/nicklinode/dns_spf_dkim_zps5e0e6a13.png)

3 A good way to test your mail server’s DKIM is to RTFC (as root, of course):

```sh
amavisd-new testkeys
```

You should receive a “=> pass”

4 If, like my SPF directions above, you run into any problems you can check out the [DKIM website link][d]
recommended by iRedMail.

###rDNS (optional but gives cred to mail server’s IP/DNS)

To set your rDNS, [check out Linode’s entry][r].

#Apache Authentication fix (Cluebringer and AWStats login) AND Greylisting recommendation

##Apache Authentication fix (Cluebringer and AWStats login)

**Problem: mod-auth-mysql doesn't work in Apache 2.4**

**Fix: 	install libaprutil1-dbd-mysql**
	**enable dbd and authn_dbd apache modules**
	**edit apache2.conf, awstats.conf, and cluebringer.conf**

install libaprutil1-dbd-mysql
```sh
apt-get install libaprutil1-dbd-mysql
```

enable the two dbd apache modules
```sh
a2enmod dbd authn_dbd
```

edit /etc/apache2/conf/apache2.conf by adding below to end of file (make sure to comment out existing Auth_MySQL lines at the end of config)

```
#MySQL auth (mod_dbd, libaprutil1-dbd-mysql)
<IfModule mod_dbd.c>
	DBDriver mysql
 DBDParams "host=127.0.0.1 dbname=vmail user=vmail pass=(SUBSTITUTE WITH YOUR PASSWORD: see in your iRedMail.tips file)"
	DBDMin 1
	DBDKeep 8
	DBDMax 20
	DBDExptime 300
</IfModule>
```
edit /etc/apache2/conf-available/awstats.conf
mirror your awstats.conf to the conf text below (adding dbd connection info and commenting out Auth_MySQL stuff)
```
<Directory /usr/lib/cgi-bin/>
    DirectoryIndex awstats.pl
    Options ExecCGI
    AuthType Basic
    AuthName "Authorization Required"

    ###############
    # mod_auth_mysql (deprecated)#
    ###############
    # AuthMYSQL on
    # AuthBasicAuthoritative Off
    # AuthUserFile /dev/null
    #
    # # Database related.
    # AuthMySQL_Password_Table mailbox
    # Auth_MySQL_Username_Field username
    # Auth_MySQL_Password_Field password
    #
    # # Password related.
    # AuthMySQL_Empty_Passwords off
    # AuthMySQL_Encryption_Types Crypt_MD5
    # Auth_MySQL_Authoritative On
    # #AuthMySQLUserCondition "isglobaladmin=1"

    #########
    # mod_authn_dbd #
    #########
    # Password related.
    AuthBasicProvider dbd
    AuthDBDUserPWQuery "SELECT password FROM mailbox WHERE mailbox.username=%s"

    Order allow,deny
    Allow from all
    Require valid-user
</Directory>
```

edit /etc/apache2/conf-available/cluebringer.conf 
mirror your awstats.conf to the conf text below (adding dbd connection info and commenting out Auth_MySQL stuff)

```
<Directory /usr/share/postfix-cluebringer-webui/webui/>
    DirectoryIndex index.php
    AuthType basic
    AuthName "Authorization Required"

    ###############
    # mod_auth_mysql (deprecated)#
    ###############
    # AuthMYSQL on
    # AuthBasicAuthoritative Off
    # AuthUserFile /dev/null
    #
    # # Database related.
    # AuthMySQL_Password_Table mailbox
    # Auth_MySQL_Username_Field username
    # Auth_MySQL_Password_Field password
    #
    # # Password related.
    # AuthMySQL_Empty_Passwords off
    # AuthMySQL_Encryption_Types Crypt_MD5
    # Auth_MySQL_Authoritative On

    #########
    # mod_authn_dbd #
    #########
    # Password related.
    AuthBasicProvider dbd
  AuthDBDUserPWQuery "SELECT password FROM mailbox WHERE mailbox.username=%s"

    Order allow,deny
    Allow from all
    Require valid-user
</Directory>
```
Restart Apache for changes to take effect (and test by logging in to either cluebringer or awstats)
```sh
service apache2 restart
```
*NOTE: You MAY removed the libapache2-mod-auth-mysql module completely or disable apache module by entering (a2dismod auth_mysql)* 

##Greylisting recommendation

By default Cluebringer starts up with the greylisting feature enabled. While the implementation of greylisting does protect a mail server from receiving spam, there are unintended consequences to its operation. I noticed this after sending a few test emails from a well-known "free" email account to my new mail server. Most of the "free" email SMTP services are provided by SEVERAL SMTP servers THAT, upon receiving the 4XX reply code from your server since the hostname/ip of the SMTP server isn't "known," does retransmit the email BUT USUALLY from either another host or from the same host BUT from another IP address. The greylisting feature of Cluebringer either severely delayed (or completely denied) a few of my test emails. For this reason the author recommends turning this module off. NOTE: Since being disabled on the author's mail server, neither DELAYS nor DENIALS of email have been observed on the author's mail server. Additionally, the mail server has yet to receive any spam (yup, 0).

edit Cluebringer config file to disable Greylisting module
```sh
nano /etc/cluebringer/cluebringer.conf
```
search 
```sh
(Ctrl + W)[Greylisting]
```
change the "1" to "0" to disable

restart cluebringer to complete changes
```sh
service postfix-cluebringer restart
```
#Final Testing and Conclusion
This is my favorite part. We’re almost finished. Why not finish on a GREAT note? There are two services I use to test mail server operation and “spaminess.” I mean, no one wants their emails to be delivered to a friend, coworker, or family member’s SPAM folder because of a misconfigured mail server, right?

 *NOTE: While some DNS records update almost instantaneously, some records take awhile and you may experience a lower “score on the following tests.*

##Mail Tester

Point a browser to [Mail Tester][m], copy the automatically generated email address, and send with your new mail server’s postmaster account. A simple “test” or “check” in both the subject and body should suffice. Wait 10-15 seconds and head back to the webpage and click the “THEN CHECK YOUR SCORE” button. If you’ve followed this guide (to include SPF, DKIM, and rDNS), you should receive a score of 10/10. If not, the results will indicate what portion of your message/mail server needs improved upon. 

![mail tester](http://i1054.photobucket.com/albums/s500/nicklinode/10_10_zpsdd211731.png)

*NOTE: Remember, your DNS entries (SPF and DKIM) may take awhile to push through. If so, just wait a few hours and try the test again.*

##Port25 Solutions EMAIL VERIFICATION
This is much simpler. Compose an email to <mailto:check-auth@verifier.port25.com> (checks “mail_from” header) and <mailto:check-auth2@verifier.port25.com> (checks “from” header), add some random text to the subject and body, and send! A few minutes later you’ll receive the results in your inbox.

#Conclusion
That wasn’t too hard,  now was it? I recommend you familiarize yourself with the various files, configs, settings, etc. listed in the iRedMail emails (and website) and start adding users to your mail server. This is pretty simple and can be accomplished by navigating to your iRedMail iredamin page and logging in as postmaster (https://mail.yourdomain.com/iredadmin). Happy Mailing! 

[l]:https://www.linode.com
[i]:http://www.iredmail.org
[h]:https://library.linode.com/getting-started
[u]:http://www.iredmail.org/install_iredmail_on_ubuntu.html
[d]:https://code.google.com/p/iredmail/wiki/DNS_DKIM
[s]:https://code.google.com/p/iredmail/wiki/DNS_SPF
[m]:http://www.mail-tester.com
[r]:https://library.linode.com/dns-manager#sph_setting-reverse-dns
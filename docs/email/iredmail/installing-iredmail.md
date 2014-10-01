---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Installing and Securing iRedMail on your Linode.'
keywords: 'email,mail,iredmail'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['installing-iredmail/']
contributor:
    name: Nick Reichley
modified: Tuesday, September 23rd, 2014
modified_by:
  name: James Stewart
published: 'Tuesday, September 23rd, 2014'
title: 'Installing and Securing iRedMail on your Linode'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $100 per published guide.*

Running your own mail server has many benefits. It allows you to manage the size of your mailboxes and attachments, run hourly/daily email backups, view mail logs, and gives you the freedom to use any domain name available. The drawback is usually the in-depth and sometimes complicated process of installing all the necessary parts. This guide uses a streamlined process, the iRedMail install script, and should have you up and running your mail server in under 15 minutes.

# Prerequisites

All you’ll need to get your mail server up and running in less than 30 minutes is:

- A domain name.
- A little command line know-how.
- A Linode running Ubuntu 12 or 14 (this how-to uses 14.04).

 {: .note }
>This guide assumes you've followed the Linode "Getting Started" documentation and have an Ubuntu  14.04 linode running. If you haven't done so, please click [HERE] [h] and return to this guide following the completion of the "Setting the Hostname" section.

####MX Record

An MX record tells the internet where to send your domain's mail. Setting this record in your domain name settings, either through Linode or where you purchased your domain name, is a pretty straightforward process. Navigate to your DNS settings page for your domain and fill in the *host name, mailserver host name, preference, and ttl.* If there isn't a separate section for mail server records, you may have to specify the MX record. An example MX record can be found on the Linode [Introduction to DNS records] [a] page.

##The Install  

1. Let's start off by making sure your Ubuntu linode is up-to-date by running the following commands as **root**: 

     {: .note }
     >The remaining commands in this tutorial should be run as root as well.

        apt-get update
        apt-get upgrade


2. Now let's check our hostname to ensure we have a FQDN with a subdomain:

        hostname -f

     {: .note }
    >This is a requirement when installing iRedMail. The installation will not progress if your hostname and proposed virutal domain name are one and the same. Example: hostname = yourdomain.com, requested virtualdomain name (part of email address following the "@") = yourdomain.com will NOT work. Instead try mx.yourdomain.com or mail.yourdomain.com for hostname.

    ![hostname command](/docs/assets/hostname-command.png)  

3. It's time to download the latest release of iRedMail and begin the installation. The current release, as of 16 September 2014, is 0.8.7 and can be downloaded by entering the following:

	    cd /root/
	    wget https://bitbucket.org/zhb/iredmail/downloads/iRedMail-0.8.7.tar.bz2
	    tar xjf iRedMail-0.8.7.tar.bz2
	    cd iRedMail-0.8.7
	    bash iRedMail.sh

    ![iredmail download](/docs/assets/iredmail-download.png)

4. The remainder of the installation refers to on-screen confirmation of default options and selections. With the exception of the backend and hostname selections, most users will simply confirm the default options and continue the installation.

    {: .note }
    >Additionally, the next few steps were taken directly from the iRedMail [Ubuntu installation steps][u].  

5. Press ENTER to say "yes" to installing iRedMail. NOTE: Ctrl-C will exit the installation process when pressed at any time prior to step #12.

    ![iredmail install confirm](/docs/assets/iredmail-install-confirm.png)

	Press ENTER

6. Press ENTER to accept /var/vmail as the default mail storage directory

    ![mail storage dir](/docs/assets/mail-storage-dir.png)

	Press ENTER

7. While most will want MySQL as their backend database, use the UP and DOWN arrow keys to highlight your preferred backend and press SPACE BAR to select the option then press ENTER.

    ![choose backend db](/docs/assets/choose-backend-db.png)

	DOWN ARROW to MySQL and Press ENTER

8. Choose a password for your MySQL root administrator and press ENTER. Be sure to commit the password to memory or paper.

    ![mysql password](/docs/assets/mysql-password.png)

	******** and Press ENTER

9. Specify your virtual domain name, which will be the latter half of your desired email address, and press ENTER.

    ![virtual domain name](/docs/assets/virtual-domain-name.png)

	yourdomain.com and Press ENTER

10. By default, iRedMail installs postmaster@yourdomain.com as the default administrator. Enter a password for your iRedMail administrator and press ENTER. Like step 8 above, be sure to make a note of the password.

    ![admin password](/docs/assets/admin-password.png)

	******** and Press ENTER

11. The next screen lists optional components to be included in your MySQL backend. While none of these are required, I recommend the installation of all components since the benefits of each add to the function and security of your mail server.

    ![mysql backend](/docs/assets/mysql-backend.png)

	Press ENTER

12. This step indicates that the configuration is complete, references the location of the SENSITIVE config file and asks (y or n) if you’d like to continue.

    ![config complete](/docs/assets/config-complete.png)

	Press y

13. The installer then downloads and installs the appropriate files. After it completes, you will receive a question regarding whether you would like to use iRedMail’s firewall rules (/etc/default/iptables) and SSHD port identified (y or n)

    ![iredmail fw and ssh port](/docs/assets/iredmail-fw-and-ssh-port.png)

	Press y


14. After selecting “y”, the install screen will ask if you’d like to restart the firewall (y or n)?

    ![restart firewall](/docs/assets/restart-firewall.png)

	Press y

15. The installation is now complete! While the bottom half of the screen is filled with useful URL information and the location of the iRedMail tips file, a couple emails will be waiting in postmaster@yourdomain.com’s inbox. Reboot the linode and navigate to https://mail.yourdomain.com/mail and login as “postmaster@yourdomain.com” to retrieve the necessary info.

    ![install complete](/docs/assets/install-complete.png)
	
	Reboot your Linode to complete the configuration.

16. As a security precaution, we will remove the config file. The file, after a successful iRedMail install, is no longer needed AND contains sensitive info (usernames/passwords) about your mail server configuration. We don't want to leave it sitting on the server.

        rm /root/iRedMail-0.8.7/config

###Adding Users

iRedMail is packaged with a nice mail server account configuration called iRedAdmin. Below are the steps required to add a user/mailbox to your mail server.

1. To access iRedAdmin, navigate to https://yourdomain.com/iredadmin and log in with your postmaster@yourdomain.com user.

    ![adduser1](/docs/assets/adduser1.png)

2. Once the dashboard page loads, navigate to the "add" tab/dropdown and select "user."

    ![adduser2](/docs/assets/adduser2.png)

3. Once the address, password, display name, and mailbox quota blocks are filled in, clicking "add" will complete the process.

    ![adduser3](/docs/assets/adduser3.png)

##Certificates, SPF, DKIM, and rDNS

By default, iRedMail generates a key and self-signed certificate for the mail server, web server, Roundcube webmail server. We, however, are going to take the certificate process a step further and create or obtain our own.

The process of creating a signing key, submitting a certificate signing request, and receiving your certificate, and other CA certs, is outside the scope of this how-to. There is, however, a GREAT linode *Obtaining a commercial ssl certificate* guide [HERE] [c] to get you ready for the **Certificate** section below. We'll assume you have the .key and .crt (or .pem) in hand and are ready to go. NOTE: Be sure to apply for a certificate covering either your subdomain (mail.yourdomain.com) or a wildcard of your domain so all subdomains are covered).

Upon successful install and logging in using the postmaster account, you should have two emails waiting for you. The first is titled "Helpful Links iRedMail" and the second is titled "Details of this iRedMail installation." In the 2nd email, there are various filepaths we're interested in since we'll be replacing the SSL certs and need to know the DKIM public key for our DNS TXT entry. First up, cert replacement.

###Certificates

1. After moving your certificate and key onto your linode, make a note of its location. The recommendation is to install in the same directories as the iRedMail default cert and key, which are cert= /etc/ssl/certs/ and key=/etc/ssl/private/.

2. To replace the certs used by Apache2, subsitute the following paths in /etc/apache2/sites-available/default-ssl.conf with the location of your certificate and key:

	    SSLCertificateFile /etc/ssl/certs/iRedMail_CA.pem
    	SSLCertificateKeyFile /etc/ssl/private/iRedMail.key


3. To replace the certs used by Postfix, subsitute the following paths in /etc/postfix/main.cf with the location of your certificate and key:

	    smtpd_tls_cert_file = /etc/ssl/certs/iRedMail_CA.pem
    	smtpd_tls_key_file = /etc/ssl/private/iRedMail.key


4. To replace the certs used by Postfix, subsitute the following paths in /etc/dovecot/dovecot.conf with the location of your certificate and key:

	    ssl_cert = </etc/ssl/certs/iRedMail_CA.pem
    	ssl_key = </etc/ssl/private/iRedMail.key


5. To apply the certificate changes to both your web and mail server, run the following commands: *(NOTE: There should be no errors noted)*

	    service apache2 restart
	    service dovecot restart
	    service postfix restart

###SPF, DKIM and rDNS

With your certificates out of the way, the last thing we’ll cover is the insertion of SPF and DKIM records in your DNS entry. SPF allows us to specify the authority to send mail from our domain to specific IP addresses. DKIM is another way of proving the validity of a sender of email by allowing the receiver to check a public key, or the mail server’s dns txt record, against the DKIM key included in every email message sent by your mail server.

####SPF

1. Navigate to your DNS provider, either where you purchased your domain name or Linode if you’ve transferred your DNS, and enter the following bits of information in your subdomain area to activate SPF:

        hostname	 | ip address/url | record type | ttl
        -----------  | -------------- | ----------  | ---
        @	 | v=spf1 ip4:xx.xxx.xx.xxx -all | txt | 1800

2. The “xxx” is, of course, your server’s IP address and the “-all” states that NO OTHER IP addresses may serve mail for the domain. Now, on to DKIM.

3. If this was a bit confusing, you can check out the [SPF website link][s] recommended by iRedMail.

####DKIM

1. In the same area of your DNS host records, add the following entry to enable DKIM:

        hostname | ip address/url | record type | ttl
        -----------  | -------------- | ----------- | ---
        dkim._domainkey | v=DKIM1; p=MIGFdfs… | txt | 1800

2. The IP address/url entry following the “p=“ is your public DKIM key, which can be found in your “Details of this iRedMail installation” email about halfway down under the “DNS record for DKIM support” section. Copy everything BETWEEN the double quotes and place after the “p=“ portion of the dkim._domainkey DNS entry.

    ![dns spf entry](/docs/assets/dns-spf-entry.png)

3. A good way to test your mail server’s DKIM is to enter the folllowing command:

	    amavisd-new testkeys

    You should receive a “=> pass”

4. If, like my SPF directions above, you run into any problems, you can check out the [DKIM website link][d] recommended by iRedMail.

####rDNS 

To set your rDNS, [check out Linode’s entry][r]. This is optional but gives credibility to mail server’s IP/DNS.

##Apache Authentication Fix, Cluebringer and AWStats Login, and Greylisting Recommendation

Due to "mod-auth-mysql" not working with Apache 2.4 (this module hasn't been updated in several years and various bug reports on the internet document this), the default installation doesn't allow us to utilize the module to log in to Cluebringer or AWStats. Below is the fix, which can also be found in [this] [f] iRedMail forum post.

1. Install libaprutil1-dbd-mysql:

        apt-get install libaprutil1-dbd-mysql


2.  Enable the two dbd apache modules:

	    a2enmod dbd authn_dbd


3.  Edit /etc/apache2/conf/apache2.conf by adding the below text to the end of the file (make sure to comment out existing Auth_MySQL lines at the end of config).

        #MySQL auth (mod_dbd, libaprutil1-dbd-mysql)
        <IfModule mod_dbd.c>
	    DBDriver mysql
        DBDParams "host=127.0.0.1 dbname=vmail user=vmail pass=(SUBSTITUTE WITH YOUR PASSWORD: see in your iRedMail.tips file)"
	        DBDMin 1
	        DBDKeep 8
	        DBDMax 20
	        DBDExptime 300
        </IfModule>

4.  Edit /etc/apache2/conf-available/awstats.conf and mirror your awstats.conf to the conf text below (adding dbd connection info and commenting out Auth_MySQL text).

        <Directory /usr/lib/cgi-bin/>
            DirectoryIndex awstats.pl
            Options ExecCGI
            AuthType Basic
            AuthName "Authorization Required"
        
            ##############################
            # mod_auth_mysql (deprecated)#
            ##############################
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
        
            #################
            # mod_authn_dbd #
            #################
            # Password related.
            AuthBasicProvider dbd
            AuthDBDUserPWQuery "SELECT password FROM mailbox WHERE mailbox.username=%s"
        
            Order allow,deny
            Allow from all
            Require valid-user
        </Directory>

5.  Edit /etc/apache2/conf-available/cluebringer.conf and mirror your cluebringer.conf to the conf text below (adding dbd connection info and commenting out Auth_MySQL text).

         <Directory /usr/share/postfix-cluebringer-webui/webui/>
            DirectoryIndex index.php
            AuthType basic
            AuthName "Authorization Required"
        
            ##############################
            # mod_auth_mysql (deprecated)#
            ##############################
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
        
		    #################
            # mod_authn_dbd #
            #################
            # Password related.
            AuthBasicProvider dbd
            AuthDBDUserPWQuery "SELECT password FROM mailbox WHERE mailbox.username=%s"
        
            Order allow,deny
            Allow from all
            Require valid-user
        </Directory>

6.  Restart Apache for the changes to take effect, then test them by logging in to either cluebringer or awstats.

	    service apache2 restart

     {: .note }
    >You *may* remove the libapache2-mod-auth-mysql module completely or disable apache module by entering (a2dismod auth_mysql)*

###Greylisting Recommendation

By default, cluebringer starts with the greylisting feature enabled. While the implementation of greylisting does protect a mail server from receiving spam, there are unintended consequences to its operation. This was tested by sending a few emails from a well-known "free" email account to my new mail server. Most of the "free" email SMTP services are provided by SEVERAL SMTP servers that upon receiving the 4XX reply code from your server, since the hostname and IP of the SMTP server isn't "known", does retransmit the email. However, usually, the retransmitted email is from either another host or from the same host but from another IP address. The greylisting feature of cluebringer either severely delayed, or completely denied, a few of the test emails. 

For this reason, the author recommends turning this module off. Note, since being disabled, neither *delays* nor *denials* of email have been observed on the author's mail server. Additionally, the mail server has yet to receive any spam.

1. Edit cluebringer config file to disable Greylisting module:

        nano /etc/cluebringer/cluebringer.conf

2.  Search.

	    (Ctrl + W)[Greylisting]

3.  Change the "1" to "0" to disable.

4.  Restart cluebringer to complete the changes.

	    service postfix-cluebringer restart

#Final Testing and Conclusion

We’re almost finished. Of the many services available to test the mail server's operation and “spaminess”, we'll be using the Mail Tester and Port25 solution services.

 {: .note }
>While some DNS records update almost instantaneously, some records take awhile and you may experience a lower score on the following tests.

###Mail Tester

Point a web browser to [Mail Tester][m], copy the automatically generated email address, and send with your new mail server’s postmaster account. A simple “test” or “check” in both the subject and body should suffice. Wait 10-15 seconds, then head back to the webpage and click the “THEN CHECK YOUR SCORE” button. If you’ve followed this guide (to include SPF, DKIM, and rDNS), you should receive a score of 10/10. If not, the results will indicate what portion of your mail server needs improvement.

![mail tester](/docs/assets/mail-tester.png)

Remember, your DNS entries (SPF and DKIM) may take awhile to push through. If so, just wait a few hours and try the test again.

###Port25 Solutions Email Verification
The Port25 soulution is much simpler. Compose an email to <mailto:check-auth@verifier.port25.com> (checks “mail_from” header) and <mailto:check-auth2@verifier.port25.com> (checks “from” header), add some random text to the subject and body, and send. A few minutes later you’ll receive the results in your inbox.

##Conclusion
Familiarize yourself with the various files, configs, and settings listed in the iRedMail emails and website and start adding users to your mail server. Happy Mailing!

[l]:https://www.linode.com
[i]:http://www.iredmail.org
[h]:https://library.linode.com/getting-started
[u]:http://www.iredmail.org/install_iredmail_on_ubuntu.html
[d]:https://code.google.com/p/iredmail/wiki/DNS_DKIM
[s]:https://code.google.com/p/iredmail/wiki/DNS_SPF
[m]:http://www.mail-tester.com
[r]:https://library.linode.com/dns-manager#sph_setting-reverse-dns
[c]:https://www.linode.com/docs/websites/ssl/obtaining-a-commercial-ssl-certificate
[a]:https://www.linode.com/docs/networking/dns/introduction-to-dns-records#mx
[f]:http://www.iredmail.org/forum/post30654.html#p30654

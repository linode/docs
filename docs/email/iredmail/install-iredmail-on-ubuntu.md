---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide shows how to install your own iRedMail mail server on Linode with Ubuntu.'
keywords: ["email", "mail", "iredmail"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['installing-iredmail/','email/iredmail/installing-iredmail/']
contributor:
    name: Nick Reichley
    link: https://github.com/reichley
modified: 2017-10-27
modified_by:
  name: James Stewart
published: 2014-10-06
title: 'Install iRedmail, Open-Source Mail Server, on Ubuntu'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---


## Why Run a Mail Server?

Running your own mail server has many benefits. It allows you to manage the size of your mailboxes and attachments, run hourly/daily email backups, view mail logs, and gives you the freedom to use any domain name available. The drawback is usually the in-depth and sometimes complicated process of installing all the necessary parts. This guide uses a streamlined process, the iRedMail install script, and should have you up and running your mail server in under 15 minutes.

![Installing iRedMail on your Linode](/docs/assets/iredmail_tg.png "Installing iRedMail on your Linode")

## Prerequisites

Before beginning this guide you should have:

- A domain name.
- An understanding of the [Linux command line](/docs/networking/ssh/using-the-terminal).
- A Linode running Ubuntu 14.04.

This guide assumes you've followed the Linode [Getting Started](/docs/getting-started) documentation If you haven't done so, read through the guide, and return here following the completion of the "Setting the Hostname" section.

The steps required in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

### MX Record

A DNS MX record tells the internet where to send email directed at you domain. Before your Linode can receive email for addresses at a domain, an MX record must be created for that domain, pointing to your Linode's IP address. An example MX record can be found on the Linode [Introduction to DNS records] [a] page.

## Install iRedMail

1. Start by making sure your Linode is up-to-date by running the following commands:

        apt-get update
        apt-get upgrade


2. Check your hostname to ensure a FQDN with a subdomain:

        hostname
        hostname -f

    iRedMail requires that you have a properly formatted Fully Qualified Domain Name (FQDN). The format is `hostname.domain.com`. If your hostname is only your domain name, iRedMail will not install properly. Common hostnames for mail servers include `mail` and `mx`.

        user@hostname:~$ hostname
        mail
        user@hostname:~$ hostname -f
        mail.domain.com


3. Download the latest release of iRedMail. The current release, as of 16 September 2014, is 0.8.7 and can be downloaded by entering the following:

	    cd /root/
	    wget https://bitbucket.org/zhb/iredmail/downloads/iRedMail-0.8.7.tar.bz2

4. Uncompress the package and run the script:

	    tar xjf iRedMail-0.8.7.tar.bz2
	    cd iRedMail-0.8.7
	    bash iRedMail.sh


    The remainder of the installation refers to on-screen confirmation of default options and selections. With the exception of the backend and hostname selections, most users will simply confirm the default options and continue the installation.

    {{< note >}}
The next few steps were taken directly from the iRedMail [Ubuntu installation steps][u].
{{< /note >}}

5. Press "enter" to say "yes" to installing iRedMail. NOTE: Ctrl-C will exit the installation process when pressed at any time prior to step #12.

    ![iredmail install confirm](/docs/assets/iredmail-install-confirm.png)

6. Press "enter" to accept /var/vmail as the default mail storage directory

    ![mail storage dir](/docs/assets/mail-storage-dir.png)

7. Use the "up" and down arrow keys to highlight your preferred backend. Press "space" to select your preferred option, then press "enter". If you're unsure, choose `MySQL`.

    ![choose backend db](/docs/assets/choose-backend-db.png)

8. Choose a password for your MySQL root administrator and press "enter". Be sure to commit the password to memory or paper.

    ![mysql password](/docs/assets/mysql-password.png)

9. Enter your domain name as the first virtual domain name and press "enter".

    ![virtual domain name](/docs/assets/virtual-domain-name.png)

10. By default, iRedMail configures postmaster@yourdomain.com as the default administrator. Enter a password for your iRedMail administrator and press "enter".

    ![admin password](/docs/assets/admin-password.png)

11. The next screen lists optional components to be included in your MySQL backend. While none of these are required, We recommend the installation of all components, since the benefits of each add to the function and security of your mail server.

    ![mysql backend](/docs/assets/mysql-backend.png)

12. This step indicates that the configuration is complete, references the location of the SENSITIVE config file and asks (y or n) if you’d like to continue. Type "y".

    ![config complete](/docs/assets/config-complete.png)

13. The installer then downloads and installs the appropriate files. After it completes, you will receive a prompt asking whether you would like to use iRedMail’s firewall rules at `/etc/default/iptables`, and identifies your SSHD port. Type "y" to accept, or "n" if you want to configure your firewall manually.

    ![iredmail fw and ssh port](/docs/assets/iredmail-fw-and-ssh-port.png)


14. After typing "y", the install screen will ask if you’d like to restart the firewall. Type "y".

    ![restart firewall](/docs/assets/restart-firewall.png)

15. The installation is now complete! While the bottom half of the screen is filled with useful URL information and the location of the iRedMail tips file, a couple emails will be waiting in postmaster@yourdomain.com’s inbox.

    ![install complete](/docs/assets/install-complete.png)

16.  Reboot the Linode and navigate to `https://mail.yourdomain.com/mail` and login as “postmaster@yourdomain.com” to retrieve the necessary info.

17. As a security precaution, we will remove the config file. This file is no longer needed after a successful iRedMail install, and contains sensitive information (usernames/passwords) about your mail server configuration.

        rm /root/iRedMail-0.8.7/config

## Add Users

iRedMail is packaged with a mail server account configuration called iRedAdmin. Below are the steps required to add a user/mailbox to your mail server.

1. To access iRedAdmin, navigate to `https://yourdomain.com/iredadmin` and log in with your postmaster@yourdomain.com user.

    ![adduser1](/docs/assets/adduser1.png)

2. Once the dashboard page loads, navigate to the `Add` dropdown and select `User`.

    ![adduser2](/docs/assets/adduser2.png)

3. Fill in the address, password, display name, and mailbox quota blocks then click **Add** will complete the process.

    ![adduser3](/docs/assets/adduser3.png)

## Certificates, SPF, DKIM, and rDNS

By default, iRedMail generates a key and self-signed certificate for the mail server, and web server. To avoid other email servers marking email from our server as spam, we're going to install a trusted certificate.

The process of obtaining a trusted certificate is outside the scope of this guide. You can follow the [Obtaining a Commercial SSL Certificate] [c] guide to obtain a certificate.

The next section assumes you have the .key and .crt (or .pem) file in hand and are ready to go.

{{< note >}}
Be sure to apply for a certificate covering either your subdomain (mail.yourdomain.com) or a wildcard of your domain so all subdomains are covered).
{{< /note >}}

After first logging in to the postmaster account, you should have two emails waiting for you. The first is titled "Helpful Links iRedMail" and the second is titled "Details of this iRedMail installation." In the 2nd email, there are various file paths we'll need, since we'll be replacing the SSL certificate and need to know the DKIM public key for our DNS TXT entry. First up, certificate replacement.

{{< note >}}
For if your certificate issuer uses `.pem` files instead of `.crt`, be sure to replace the file extension in the instructions below.
{{< /note >}}

### Certificates

1. After moving your certificate and key onto your Linode, make a note of its location. The recommendation is to install in the same directories as the iRedMail default certificate and key. The certificate is located in `/etc/ssl/certs/` and the key is in `/etc/ssl/private/`.

        mv mail.yourdomain.com.crt /etc/ssl/certs/
        mv mail.yourdomain.com.key /etc/ssl/private/

2. To replace the certificates used by Apache2, substitute the following paths in `default-ssl.conf` with the location of your certificate and key:

    {{< file-excerpt "/etc/apache2/sites-available/default-ssl.conf" aconf >}}
SSLCertificateFile /etc/ssl/certs/mail.yourdomain.com.crt
SSLCertificateKeyFile /etc/ssl/private/mail.yourdomain.com.key

{{< /file-excerpt >}}



3. To replace the certificates used by Postfix, substitute the following paths in `main.cf` with the location of your certificate and key:

    {{< file-excerpt "/etc/postfix/main.cf" aconf >}}
smtpd_tls_cert_file = /etc/ssl/certs/mail.yourdomain.com.crt
   smtpd_tls_key_file = /etc/ssl/private/mail.yourdomain.com.key

{{< /file-excerpt >}}


4. To replace the certs used by Postfix, substitute the following paths in `dovecot.conf` with the location of your certificate and key:

    {{< file-excerpt "/etc/dovecot/dovecot.conf" aconf >}}
ssl_cert = </etc/ssl/certs/mail.yourdomain.com.crt
   ssl_key = </etc/ssl/private/mail.yourdomain.com.key

{{< /file-excerpt >}}

<!-- syntax highlighting fix-->

5. To apply the certificate changes to both your web and mail server, run the following commands:

	    service apache2 restart
	    service dovecot restart
	    service postfix restart

    If you encounter error messages during these commands, go back and confirm the correct paths are in place for your certificates.

### SPF, DKIM and rDNS

This section covers the insertion of SPF and DKIM records in your DNS entry. SPF records allow us to specify the authority to send mail from our domain to specific IP addresses. DKIM records are another way of proving the validity of an email by allowing the receiver to check a public key, or the mail server’s DNS TXT record, against the DKIM key included in every email message sent by your mail server.

#### SPF

1. Navigate to your DNS provider, either where you purchased your domain name or Linode if you’ve transferred your DNS, and enter the following bits of information in your subdomain area to activate SPF. If you are using Linode's DNS manager, you can leave the name field blank, but other DNS providers may require you to specify @ for the hostname.

    [![SPF Record](/docs/assets/iredmail-spf_preview.png)](/docs/assets/iredmail-spf.png)

        hostname  | ip address/url                | record type | ttl
        --------  | ----------------------------- | ----------- | ---
               @  | v=spf1 ip4:12.34.56.78 -all   | txt         | 1800

2.  For more information, you can check out the [SPF website link][s] recommended by iRedMail.

#### DKIM

1. In the same area of your DNS host records, add the following entry to enable DKIM. The IP address/url entry following the “p=“ is your public DKIM key, which can be found in your “Details of this iRedMail installation” email about halfway down under the “DNS record for DKIM support” section. Copy everything BETWEEN the double quotes and place after the “p=“ portion of the dkim._domainkey DNS entry.


    [![DKIM Record](/docs/assets/iredmail-dkim_preview.png)](/docs/assets/iredmail-dkim.png)

        hostname        | ip address/url      | record type | ttl
        --------------  | ------------------- | ----------- | ---
        dkim._domainkey | v=DKIM1; p=MIGFdfs… | txt         | 1800


3. A good way to test your mail server’s DKIM is to enter the following command:

	    amavisd-new testkeys

    You should receive `=> pass` as output.

4. For more information on DKIM records, you can check out the [DKIM website link][d] recommended by iRedMail.

#### rDNS

To set your rDNS, check out the [Setting Reverse DNS][r] section of the DNS Manager guide. This is optional but gives additional credibility to a mail server for certain spam filters.

### Apache Authentication Fix for Cluebringer and AWStats Login

Cluebringer (a.k.a. PolicyD v2) is a policy server utility for our mail transfer agent, Postfix. It provides a web-based interface ([example] [p]) where you can fine tune policies applied to Postfix. For more info, see the Policy D [documentation] [d].

AWStats quickly analyzes and displays log files/server activity via a few web-based (or command line) statistical graphs. Using the configuration outlined below, it will display the # of emails sent, the total size of the emails, sender and receiver, time (hourly/daily/monthly), and SMTP error codes. An example can be seen [here] [w]. For more info, see the AWStats [documentation] [e].

**Due to "mod-auth-mysql" not working with Apache 2.4, the default installation cannot use the module to log in to Cluebringer or AWStats. Below is the fix, which can also be found in [this] [f] iRedMail forum post.**

1. Install libaprutil1-dbd-mysql:

        apt-get install libaprutil1-dbd-mysql


2.  Enable the two dbd apache modules:

	    a2enmod dbd authn_dbd


3.  Edit `apache2.conf` by adding the text block below to the end of the file. Make sure to comment out the existing Auth_MySQL lines at the end of the file.

    {{< file-excerpt "/etc/apache2/conf/apache2.conf" aconf >}}
#MySQL auth (mod_dbd, libaprutil1-dbd-mysql)
<IfModule mod_dbd.c>
	    DBDriver mysql
DBDParams "host=127.0.0.1 dbname=vmail user=vmail pass=(SUBSTITUTE WITH YOUR PASSWORD: see in your iRedMail.tips file)"
 DBDMin 1
 DBDKeep 8
 DBDMax 20
 DBDExptime 300
</IfModule>

{{< /file-excerpt >}}


4.  Edit `awstats.conf` to mirror the example text below, by adding the `mod_authn_dbd` section and commenting out the `Auth_MySQL` section.

    {{< file "/etc/apache2/conf-available/awstats.conf" aconf >}}
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

{{< /file >}}


5.  Edit `cluebringer.conf` to mirror the example text below, by adding the `mod_authn_dbd` section and commenting out `Auth_MySQL` section).

    {{< file "/etc/apache2/conf-available/cluebringer.conf" aconf >}}
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

{{< /file >}}


6.  Restart Apache for the changes to take effect, then test them by logging in to either Cluebringer or Awstats.

	    service apache2 restart


### Greylist a Recommendation

By default, Cluebringer starts with the greylisting feature enabled. While the implementation of greylisting does protect a mail server from receiving spam, there are unintended consequences to its operation. This was tested by sending a few emails from a well-known "free" email account to my new mail server. Most of the "free" email SMTP services are provided by SEVERAL SMTP servers that upon receiving the 4XX reply code from your server, since the hostname and IP of the SMTP server isn't "known", does retransmit the email. However, usually, the retransmitted email is from either another host or from the same host but from another IP address. The greylisting feature of Cluebringer either severely delayed, or completely denied, a few of the test emails.

For this reason, the author recommends turning this module off. Note, since being disabled, neither *delays* nor *denials* of email have been observed on the author's mail server. Additionally, the mail server has yet to receive any spam.

1. Edit the Cluebringer config file (/etc/cluebringer/cluebringer.conf) to disable the Greylisting module.

2.  Search for the term "Greylisting" (without the quotation marks).

3.  Change the "1" to "0" to disable.

4.  Restart Cluebringer to complete the changes.

	    service postfix-cluebringer restart

## Final Test and Conclusion

As a final test, you can utilize a service such as [Mail Tester][m] to ensure that your records have been configured correctly. If you have followed this guide precisely, you should receive a score of 10/10 on Mail Tester's site. If not, Mail Tester will provide you with a report indicating what portion of your configuration needs improvement.

 {{< note >}}
While some DNS records update almost instantaneously, updates can take up to 24 hours to propagate. You may receive a lower score on these tests if your records have not yet updated.
{{< /note >}}

### Conclusion
Familiarize yourself with the various files, configs, and settings listed in the iRedMail emails and website and start adding users to your mail server. Happy Mailing!

[l]:https://www.linode.com
[i]:http://www.iredmail.org
[h]:https://www.linode.com/docs/getting-started
[u]:http://www.iredmail.org/docs/install.iredmail.on.debian.ubuntu.html
[d]:https://code.google.com/p/iredmail/wiki/DNS_DKIM
[s]:https://code.google.com/p/iredmail/wiki/DNS_SPF
[m]:http://www.mail-tester.com
[r]:/docs/networking/dns/configure-your-linode-for-reverse-dns/
[c]:https://www.linode.com/docs/websites/ssl/obtaining-a-commercial-ssl-certificate
[a]:https://www.linode.com/docs/networking/dns/introduction-to-dns-records#mx
[f]:http://www.iredmail.org/forum/post30654.html#p30654
[p]:http://wiki.policyd.org/_detail/policyd_web_gui.png?id=screenshots
[d]:http://wiki.policyd.org/documentation
[w]:http://www.awstats.org/awstats.mail.html
[e]:http://www.awstats.org/docs/index.html

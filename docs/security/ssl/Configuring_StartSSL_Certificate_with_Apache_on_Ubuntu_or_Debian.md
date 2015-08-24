---
author:
    name: Linode
    email: docs@linode.com
description: 'Configuring StartSSL with Apache on Ubuntu/Debian'
keywords: 'SSL,StartSSL,Certificate,Apache,Ubuntu,Debian,HTTPS'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, August 23rd, 2015'
modified: Weekday, August 23rd, 2015
modified_by:
    name: James Stewart
title: 'Configuring StartSSL Certificate with Apache on Ubuntu/Debian'
contributor:
    name: Yang Liu
    link: 
---

This guide is going to show you how to sign-up a free StartSSL Certificate and configure it with Apache. If you are a Nginx user, follow this link: [How to Install Nginx and a StartSSL Certificate on Debian 7 (Wheezy)](/docs/websites/nginx/how-to-install-nginx-and-a-startssl-certificate-on-debian-7-wheezy)

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

### Prerequisites

This guide assumes you are running Apache 2.4 or higher on Ubuntu 14.04 or Debian 8 or above. Make sure you have followed these steps:

 - [Getting Started](/docs/getting-started)
 - [Hosting a Website](/docs/hosting-website)

### Obtain free StartSSL Certificate

1. Visit [StartSSL Control Panel](https://www.startssl.com/?app=12) in your browser and click `Express Lane`.

    ![description](/docs/assets/1_Control_Panel.png)
    
2. Fill in the blanks with your information and click `Continue`.

    ![description](/docs/assets/2_Register_Info.png)
    
3. Check your inbox for the verification code. Type code and click `Continue`(You may wait several minutes for verification email before doing next step).

    ![description](/docs/assets/3_Complete_Registration.png)
    
4. Then StartSSL will generate a private key for your client certificate to authenticate your identity when you sign-in. Click `Continue` with default 2048 high grade. 

5. Click `Install` to install your certificate.

    ![description](/docs/assets/4_Install_Certificate.png)

    {: .note}
    >
    >Make sure to backup your certificate or you will never sign-in. See [How do I backup my client certificates?](https://www.startssl.com/?app=25#4)
    
6. Click `Finish` and your account will sign in automatically.

    ![description](/docs/assets/5_Congratulations.png)

7. Click `Validations Wizard` button. Select `Domain Name Validation` and then click `Continue`. 

8. Type your domain name and click `Continue`.

    ![description](/docs/assets/6_Enter_Domain_Name.png)
    
9. Choose a email address you could receive verification email and click `Continue`.

    ![description](/docs/assets/7_Select_Verification_Email.png)
    
    {: .note}
    >
    >If you don't have a email address with your domain name, you can disable Whois Protection temporarily before doing this step. Then you can choose the email address in your Domain Contact.
    
10. Once you have received verification code, type it and click `Continue`.
    
11. Click `Finish` for successful verification.
    
12. Click `Certificates Wizard` button and select `Web Server SSL/TLS Certificate`. Then you have to set a password for your private key. Take it easy, you just need to remember the password for 10 minutes.

    ![description](/docs/assets/8_Generate_Private_Key.png)
    
13. The webpage will let you save your key. Now you have to log-in with your VPS as root via SSH to save your private key.

    ![description](/docs/assets/9_Save_Private_Key.png)

14. First, you need to create a new directory for key and certificate: 

        mkdir /etc/ssl/localcerts
        cd /etc/ssl/localcerts
        
15. Create a blank file to save your private key by this command.

        nano ssl.key

16. Copy&Paste your private key. Press **CTRL+X** then press **y** to save.

17. Decrypt Private Key with this command:

        openssl rsa -in ssl.key -out ssl.key
        
18. Enter the password you set before to decrypt. After success, you can forget the password!

19. Now you have to return to browser. Click `Continue`. Add a sub domain and click `Continue`.

    ![description](/docs/assets/10_Add_Domains.png)
    
    {: .note}
    >
    >StartSSL only provides free certificate for your root domain and a sub domain, e.g. example.com & www.example.com. If you don't use "www", you can add the other sub domain. For example, if you want your mail server to run via SSL, you can add its sub domain.
    
20. Then you need to save certificate. Type this command:

        nano ssl.crt
        
21. Copy&Paste your certificate. Press **CTRL+X** then press **y** to save.

22. Install wget to download StartSSL's CA:

        apt-get install wget
        
23. Download StartSSL's CA:

        wget https://www.startssl.com/certs/ca.pem
        wget https://www.startssl.com/certs/sub.class1.server.ca.pem
        
24. Use `cat` to create a certificate chain file:
        
        cat sub.class1.server.ca.pem ca.pem > chain.class1.server.ca.crt
        
25. Delete useless file:

        rm -rf ca.pem
        rm -rf sub.class1.server.ca.pem
        
Now your certificate is ready. Next you need to install your certificate on Apache2.

### Install your Certificate

1. Find and modify lines shown below in your virtual host file. Replace any mentions of `example.com` with your domain.
    
    {: .file-excerpt}
    /etc/apache2/sites-available/default-ssl.conf
    :   ~~~ ini
        <VirtualHost *:443>
            SSLEngine On
            SSLCertificateFile /etc/ssl/localcerts/ssl.crt
            SSLCertificateKeyFile /etc/ssl/localcerts/ssl.key
            SSLCertificateChainFile /etc/ssl/localcerts/chain.class1.server.ca.crt
            
            ServerAdmin info@example.com
            ServerName www.example.com
            DocumentRoot /var/www/example.com/public_html/
            ErrorLog /var/www/example.com/log/error.log
            CustomLog /var/www/example.com/log/access.log combined
        </VirtualHost>
        ~~~

2. Ensure SSL module is enabled:

        a2enmod ssl
        
3. Restart Apache2:

        service apache2 restart
        
Success! Now you can visit your site via https.

### Optional Configurations

This part is going to show you some optional configurations after certificate installation. You don't need to follow all these tips, just choose which you like.

 - Force your site visited via HTTPS

    1. Ensure Rewrite module is enabled:

            a2enmod rewrite
            
    2. Restart Apache2:

            service apache2 restart
            
    3. Edit Apache2 configuration file to let Rewrite module available in `/var/www`. Change `AllowOverride None` to `AllowOverride All` below `<Directory /var/www/>`:

        {: .file-excerpt}
        /etc/apache2/apache2.conf
        :   ~~~ ini
            <Directory /var/www/>
                    Options Indexes FollowSymLinks
                    AllowOverride All
                    Require all granted
            </Directory>
            ~~~
    
    4. Restart Apache2 to let conf file available:

            service apache2 restart
            
    5. Edit .htaccess file (If you can't find this file, just create one), replace `example.com` with your own domain:

        {: .file-excerpt}
        /var/www/example.com/public_html/.htaccess
        :   ~~~ ini
            RewriteEngine On
            RewriteCond %{SERVER_PORT} 80
            RewriteRule ^(.*)$ https://example.com/$1 [R=301,L]
            ~~~
            
 - Let your WordPress running via HTTPS

    If your site runs SSL well, you may try to let your WordPress running via HTTPS.
     
    1. Go to `WordPress Admin Page` -> `Settings` -> `General`.

    2. Modify `WordPress Adress (URL)` and `Site Address (URL)`. Change `http` to `https`.

    {: .note}
    >
    >You can also try some plugins to let your WordPress via SSL.

 - Configure SSL on iRedMail

    This part is only for reader whose certificate sub domain is same as their mail sever. Otherwise skip this part.

    
    {: .note}
    >
    >iRedMail disables SMTPS by default. Want to know the reason and why  enable SMTPS since it's depreciated? See quote below from [iredmail.org](http://www.iredmail.org/docs/enable.smtps.html) and [wikipedia.org](http://en.wikipedia.org/wiki/SMTPS). 
    >
    >Originally, in early 1997, the Internet Assigned Numbers Authority registered 465 for SMTPS. By the end of 1998, this was revoked when STARTTLS has been specified. With STARTTLS, the same port can be used with or without TLS. SMTP was seen as particularly important, because clients of this protocol are often other mail servers, which can not know whether a server they wish to communicate with will have a separate port for TLS. The port 465 is now registered for Source-Specific Multicast audio and video.
    >
    >Even in 2013, there are still services that continue to offer the deprecated SMTPS interface on port 465 in addition to (or instead of!) the RFC-compliant message submission interface on the port 587 defined by RFC 6409. Service providers that maintain port 465 do so because older Microsoft applications (including Entourage v10.0) do not support STARTTLS, and thus not the smtp-submission standard (ESMTPS on port 587). The only way for service providers to offer those clients an encrypted connection is to maintain port 465.
    
    Now there're the steps to enable SSL on your iRedMail.
    
    1. Open Postfix's `master.cf` file and find these lines:

        {: .file-excerpt}
        /etc/postfix/master.cf
        :   ~~~ ini
            #smtps     inet  n       -       -       -       -       smtpd
            #  -o syslog_name=postfix/smtps
            #  -o smtpd_tls_wrappermode=yes
            #  -o smtpd_sasl_auth_enable=yes
            ~~~
            
    2. Delete `#` on line 1, 3 and 4.

    3. Add a new line `  -o smtpd_client_restrictions=permit_sasl_authenticated,reject` below the line  `  -o smtpd_sasl_auth_enable=yes`.

    4. Then your file may looks like this:

        {: .file-excerpt}
        /etc/postfix/master.cf
        :   ~~~ ini
            smtps     inet  n       -       -       -       -       smtpd
            #  -o syslog_name=postfix/smtps
              -o smtpd_tls_wrappermode=yes
              -o smtpd_sasl_auth_enable=yes
              -o smtpd_client_restrictions=permit_sasl_authenticated,reject
            ~~~

    5. Configure the Certificate on Postfix and Dovecot by modifying configuration file below.

        {: .file-excerpt}
        /etc/postfix/main.cf
        :   ~~~ ini
            smtpd_tls_cert_file = /etc/ssl/localcerts/ssl.crt
            smtpd_tls_key_file = /etc/ssl/localcerts/ssl.key
            ~~~
    
        {: .file-excerpt}
        /etc/dovecot/dovecot.conf
        :   ~~~ ini
            ssl_cert = </etc/ssl/localcerts/ssl.crt
            ssl_key = </etc/ssl/localcerts/ssl.key
            ~~~
            
    6. Open port in firewall (If you disabled firewall ,skip this step):

        {: .file-excerpt}
        /etc/iptables.firewall.rules
        :   ~~~ ini
            #  Allow HTTP and HTTPS connections from anywhere (the normal ports for websites and SSL).
            -A INPUT -p tcp --dport 80 -j ACCEPT
            -A INPUT -p tcp --dport 443 -j ACCEPT
            -A INPUT -p tcp --dport 465 -j ACCEPT
            -A INPUT -p tcp --dport 587 -j ACCEPT
            -A INPUT -p tcp --dport 995 -j ACCEPT
            ~~~
            
    7. Activate the firewall rules:

            sudo iptables-restore < /etc/iptables.firewall.rules
            
    8. Check whether your firewall rules work:

            sudo iptables -L

    9. Restart to apply changes:

            service apache2 restart
            service postfix restart
            service dovecot restart
            
    Now you can enjoy your mail via POP3S (port 995) and SMTPS (port 465).
---
deprecated: false
author:
  name: Linode Community
  email: contribute@linode.com
description: 'Install Nginx and Deploy a StartSSL Certificate on Debian 7 (Wheezy).'
keywords: ["startssl", "nginx", "install nginx", "ssl certificate", "debian 7", "wheezy", "nginx repositories", "certificate signing request", " CSR", "domain name)"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nginx/startssl-wth-latest-nginx-debian-7/','websites/nginx/how-to-install-nginx-and-a-startssl-certificate-on-debian-7-wheezy/','websites/nginx/install-nginx-and-a-startssl-certificate-on-debian-7-wheezy/']
modified: 2015-07-13
modified_by:
  name: Ryan Laverdiere
published: 2014-10-20
title: 'Install Nginx and a StartSSL Certificate on Debian 7 (Wheezy)'
contributor:
    name: Ryan Laverdiere
    link: https://github.com/capecodrailfan
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

This guide is going to show you how to install the latest stable version of Nginx on Debian Wheezy. It will also deploy a free SSL certificate from StartSSL that will get you an A on the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). In order to achieve an "A" on the test, we are going to configure Nginx to prefer server ciphers, only use strong ciphers, and disable vulnerable protocols SSLv2 and SSLv3.

### Prerequisites

This article assumes that you already have Debian 7 Wheezy running on a Linode. If you do not, follow the [Getting Started guide](https://www.linode.com/docs/getting-started) and them come back here.

Please note, in order to obtain an SSL certificate for your Linode, you must have registered a domain name, and have access to an email account like webmaster@yourdomain.com. This is necessary for StartSSL to verify that you have control of the domain you are requesting an SSL certificate for.

All of the commands below should be executed as the ``root`` user.

### Add the Nginx Debian Repository to Your Linode Package Sources

1.  Create a new file in `/etc/apt/sources.list.d/` that instructs the package manager to download packages from the Nginx repositories using your favorite text editor. Here we'll use `nano`, but you could also use `vi` or `emacs`. If you have not used Nano before, I highly recommend reading [Using Nano](https://www.linode.com/docs/tools-reference/tools/using-nano) before continuing.

        nano /etc/apt/sources.list.d/nginx.list

2.  Add the following lines to the file. Save your changes and exit your text editor.

        deb http://nginx.org/packages/debian/ wheezy nginx
        deb-src http://nginx.org/packages/debian/ wheezy nginx

3.  Download the PGP key used to sign the packages in the Nginx repository using wget:

        wget http://nginx.org/keys/nginx_signing.key

4.  Import the PGP key into the keyring used by the package manager to verify the authenticity of packages downloaded from the repository:

        apt-key add nginx_signing.key

5.  Delete the PGP key from the file system:

        rm nginx_signing.key

6.  Update your list of available packages:

        apt-get update

### Install Nginx

1.  Instruct the package manager to install the Nginx package:

        apt-get install nginx

### Generate a Private Key and Certificate Signing Request (CSR)

1.  Create a directory to store your certificate and private key. On Debian systems, the default location for storing certificates and private keys is in `/etc/ssl/`. To keep things simple we are going to create a new `/etc/ssl/nginx` directory to store your certificate and private key for Nginx:

        mkdir /etc/ssl/nginx

2.  Navigate to the newly created directory:

        cd /etc/ssl/nginx

3.  Generate a 2048 bit RSA private key. If you are paranoid you could change 2048 to 4096 to create a 4096 bit private key. Currently, most certificate authorities are requring customers to use a 2048 bit or higher RSA private key.

        openssl genrsa -out server.key 2048

4. Generate a certificate signing request (CSR). When prompted for a `Common Name`, be sure to enter the domain name that you will be using to access your Linode, all other fields can be filled as you see fit. Optionally, you may enter a sub domain, for instance www.yourdomain.com. This must be a domain that you have control over and which you can receive email sent to webmaster@yourdomain.com. Any certificate issued for *yourname*.yourdomain.com is also valid for yourdomain.com.

        openssl req -new -key server.key -out server.csr

    [![CSR Creation](/docs/assets/1751-CSR.jpg)](/docs/assets/1751-CSR.jpg)

### Sign-up With StartSSL

1.  Launch a web browser and naviagte to the [StartSSL Control Panel](https://www.startssl.com/?app=12). If this is your first time requesting a certificate from StartSSL, click on the "Sign-up" button. If you have already requested a certificate from StartSSL, log into your account, and skip to the next section.

    [![StartSSL Control Panel](/docs/assets/1752-StartSSL-Control-Panel-Preview.jpg)](/docs/assets/1752-StartSSL-Control-Panel.jpg)

2. Provide the requested information and a click "Continue >> >>"

    [![StartSSL Sign-up Page](/docs/assets/1753-StartSSL-Register.jpg)](/docs/assets/1753-StartSSL-Register.jpg)

3.  A verification code will be sent to the email address provided. Log into your email account and provide the verification code. Then click "Continue >> >>".

4.  Once your email address has been verified. Choose to generate a high grade private key. This private key and certificate pair will be used to identify you to StartSSL. If you ever loose it, you will be unable to regain access to your account, make sure to backup this certificate and private key.

    [![StartSSL Generate Private Key Page](/docs/assets/1754-StartSSL-Generate-Private-Key.jpg)](/docs/assets/1754-StartSSL-Generate-Private-Key.jpg)

5.  Click "Install >> >>" to install your personal certificate into your browser to identify yourself to StartSSL.

    [![StartSSL Certificate Installation Page](/docs/assets/1755-StartSSL-Install-Certificate.jpg)](/docs/assets/1755-StartSSL-Install-Certificate.jpg)

6.  Click "Finish >> >>".

You should now be logged into your StartSSL account.

### Verify Your Domain Name with StartSSL

1.  If you have already verified your domain name within the past 30 days, you may skip to the next step. Click on the "Validations Wizard" button in your StartSSL account.

2.  Select "Domain Name Validation" and click "Continue >> >>".

    [![StartSSL Validation Wizard Start Page](/docs/assets/1756-StartSSL-Validation-Wizard-Preview.jpg)](/docs/assets/1756-StartSSL-Validation-Wizard.jpg)

3.  Enter your domain name and click "Continue >> >>".

    [![StartSSL Validation Wizard Domain Name Validation Page](/docs/assets/1757-StartSSL-Validation-Wizard-Domain-Preview.jpg)](/docs/assets/1757-StartSSL-Validation-Wizard-Domain.jpg)

4.  Choose an email address @ your domain that you access to and click "Continue >> >>". Note that the domain being used for this tutorial has been omitted from the screenshot below.

    [![StartSSL Validation Wizard Domain Control Email Validation Page](/docs/assets/1758-StartSSL-Validation-Wizard-Email-Preview.jpg)](/docs/assets/1758-StartSSL-Validation-Wizard-Email.jpg)

5.  A verification code should be sent to the email address selected. Access your email account and provide the verification code and click "Continue >> >>".

    [![StartSSL Validation Wizard Email Verification Code Page](/docs/assets/1759-StartSSL-Validation-Wizard-Validation-Preview.jpg)](/docs/assets/1759-StartSSL-Validation-Wizard-Validation.jpg)

6.  Your domain has now been verified. Click "Finish >> >>".

    ![StartSSL Validation Wizard Complete Page](/docs/assets/1760-StartSSL-Validation-Wizard-Complete-Preview.jpg)

### Submit Your Certificate Signing Request to StartSSL

1.  Click on the "Certificates Wizard" button in your StartSSL account.

2.  From the "Certificate Target" drop down menu select "Web Server SSL/TLS Certicate" and click "Continue >> >>".

    [![StartSSL Certificates Wizard Start](/docs/assets/1761-StartSSL-Certificates-Wizard-Target-Preview.jpg)](/docs/assets/1761-StartSSL-Certificates-Wizard-Target.jpg)

3.  Click "Skip >> >>" to skip generating a RSA private key. In the previous step an RSA private key was generated before creating a certificate signing request.

    [![StartSSL Certificates Wizard Skip Creating a RSA Private Key](/docs/assets/1762-StartSSL-Certificates-Wizard-Private-Key-Preview.jpg)](/docs/assets/1762-StartSSL-Certificates-Wizard-Private-Key.jpg)

4.  Using the text editor of your choice, open up your certificate signing request and copy it. If you're using Putty on Windows, highlight the entire certificate signing request to copy it to the clipboard, then exit the text editor.

        nano /etc/ssl/nginx/server.csr

5.  Paste your certificate signing request into the empty text box and then click "Continue >> >>".

    [![StartSSL Certificates Wizard Submit CSR](/docs/assets/1763-StartSSL-Certificates-Wizard-CSR-Preview.jpg)](/docs/assets/1763-StartSSL-Certificates-Wizard-CSR.jpg)

6.  Click "Continue >> >>".

    ![StartSSL Certificates Wizard CSR Received](/docs/assets/1764-StartSSL-Certificates-Wizard-CSR-Received-Preview.jpg)

7.  Choose the domain you would like a certificate for and click "Continue >> >>".

    ![StartSSL Certificates Wizard CSR Domain Selection](/docs/assets/1765-StartSSL-Certificates-Wizard-CSR-Domain-Preview.jpg)

8.  Enter the sub domain you entered when creating the CSR before (ex. www.yourdomain.com, server1.yourdomain.com), or if your entered yourdomain.com before, enter www into this field to make your certificate valid for www.yourdomain.com as well. Then click "Continue >> >>".

    [![StartSSL Certificates Wizard Choose a SubDomain](/docs/assets/1766-StartSSL-Certificates-Wizard-CSR-SubDomain-Preview.jpg)](/docs/assets/1766-StartSSL-Certificates-Wizard-CSR-SubDomain.jpg)

9.  Click "Continue >> >>".

    [![StartSSL Certificates Wizard CSR Ready for Issuing Certificate](/docs/assets/1767-StartSSL-Certificates-Wizard-CSR-Ready-Preview.jpg)](/docs/assets/1767-StartSSL-Certificates-Wizard-CSR-Ready.jpg)

10. Once your certificate has been issued paste the certificate into a new server.crt file. Then save your changes and exit the editor.

        nano /etc/ssl/nginx/server.crt

11. You can now exit the StartSSL website.

### Gather Additional Required Certificate Files
1.  Navigate to the directory you are storing your certificate and private key in:

        cd /etc/ssl/nginx

2.  Download the StartSSL CA Certificate using wget:

        wget http://www.startssl.com/certs/ca.pem

3.  Download the StartSSL Intermediate CA Certificate using wget:

        wget http://www.startssl.com/certs/sub.class1.server.ca.pem

4.  Create a unified CA Certificate file:

        cat sub.class1.server.ca.pem >> ca.pem

5. Delete the no longer needed StartSSL Intermediate CA Certificate file:

        rm -rf sub.class1.server.ca.pem

6.  Create a single file containing your signed certificate and the StartSSL CA certificates for Nginx:

        cat server.crt ca.pem > nginx.crt

### Install Your StartSSL Certificate

1.  By default, Nginx is configured to only serve HTTP requests on TCP port 80. You need to configure Nginx to server HTTPS requests on TCP port 443. Open up the sample Nginx SSL virtual host configuration file.

        nano /etc/nginx/conf.d/example_ssl.conf

2.  Adjust your configuration so it matches the example below.

        # HTTPS server
        #
        server {
            listen       443 ssl;
            server_name  YOUR DOMAIN OR SUB DOMAIN NAME HERE;

            ssl_certificate      /etc/ssl/nginx/nginx.crt;
            ssl_certificate_key  /etc/ssl/nginx/server.key;

            ssl_session_cache shared:SSL:10m;
            ssl_session_timeout  5m;

            ssl_ciphers  "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !EXPORT !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";
            ssl_prefer_server_ciphers   on;

            ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

            location / {
                root   /usr/share/nginx/html;
                index  index.html index.htm;
            }
        }

    {{< note >}}
The changes are to `server_name`, `ssl_certificate`, `ssl_certificate_key`, `ssl_session_cache`, `ssl_ciphers`, and the removal of # signs. Also note, the addition of `ssl_protocols`.
{{< /note >}}

3.  Restart Nginx to apply your changes.

        service nginx restart

### Test

Launch a web browser and navigate to https://yourdomainorsubdomainhere and you should see the default nginx page. Please note, this will not work until you have created an A record for your hostname at your domain provider pointing to the IP address of your Linode. Please contact your domain provider if you need assistance.

  [![Up and Running](/docs/assets/1768-Up-And-Running.jpg)](/docs/assets/1768-Up-And-Running.jpg)

You have successfully installed the latest version of Nginx and configured your free StartSSL SSL Certificate. You can now run an [SSL test](https://www.ssllabs.com/ssltest/) on your server and get an A! Now you can place any files you would like Nginx to make available in the /usr/share/nginx/html folder.

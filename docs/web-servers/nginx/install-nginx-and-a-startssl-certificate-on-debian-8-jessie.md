---
author:
  name: Linode Community
  email: contribute@linode.com
description: 'How to Install Nginx and a StartSSL Certificate on Debian 8 (Jessie)'
keywords: ["startssl", "nginx", "debian 8", "ssl certificate", "generate CSR"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nginx/how-to-install-nginx-and-a-startssl-certificate-on-debian-8-jessie/','websites/nginx/install-nginx-and-a-startssl-certificate-on-debian-8-jessie/']
published: 2015-10-21
modified: 2016-08-18
modified_by:
  name: Phil Zona
title: 'Install nginx and a StartSSL Certificate on Debian 8 (Jessie)'
contributor:
  name: Ryan Laverdiere
  link: https://github.com/capecodrailfan
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

This guide will show you how to install the latest stable version of nginx on Debian Jessie. It will also deploy a free SSL certificate from StartSSL that, when combined with our guide on [SSL and TLS deployment best practices](/docs/websites/nginx/nginx-ssl-and-tls-deployment-best-practices), will result in an "A+" grade on the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). In this guide we are going to configure nginx to prefer strong server-side cipher suites and disable the vulnerable SSLv2 and SSLv3 protocols.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of [Securing Your Server](/docs/security/securing-your-server) to harden SSH access, remove unnecessary network services and enable firewall rules for a web server.

3.  In order to obtain an SSL certificate for your Linode, you must have a registered domain name with correct [DNS records](/docs/networking/dns/dns-records-an-introduction). It is also recommended you have access to an email account associated with your domain, or the email address listed in its WHOIS information. This is the simplest way for StartSSL to verify that you have control of the domain for which you are requesting an SSL certificate.

4.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
Many steps in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install nginx

If you simply want the latest stable version of nginx, you may follow the steps to [install it from the nginx package repository](/docs/web-servers/nginx/install-nginx-web-server-on-debian-8/#from-nginx-package-repository). However, if you want to implement *all* of the options in our [SSL and TLS deployment best practices guide](/docs/websites/nginx/nginx-ssl-and-tls-deployment-best-practices), you will need to compile nginx from source to ensure compatibility.

### Install and Compile nginx from Source

While installing from the nginx package repository suffices in many cases, HTTP/2 will not be compatible with all browsers using that method. Google Chrome now only allows HTTP/2 connections with *application-layer protocol negotiation* (ALPN), which is supported in OpenSSL version 1.0.2 or newer. This version is not included in the default Debian package repositories, so you will need to add it manually and compile nginx against the newer OpenSSL to enable full support for HTTP/2.

Please understand that when using this method, you will be responsible for updating nginx to include the latest updates.

1.  Add the [Debian Backports](https://backports.debian.org/) repository to the list of files that the package manager checks for updates:

        echo "deb http://ftp.debian.org/debian jessie-backports main " >> /etc/apt/sources.list.d/backports.list

2.  Update your list of available packages:

        apt-get update

3.  Install the latest version of OpenSSL and its library from the backports repository:

        apt-get install -t jessie-backports openssl libssl-dev

4.  Install the remaining nginx dependencies:

        apt-get install libpcre3-dev build-essential

5.  Download the [latest stable version](http://nginx.org/en/download.html) of nginx to your `/opt` directory. At the time of this publication, the latest stable version is nginx 1.11.2:

        cd /opt
        wget http://nginx.org/download/nginx-1.11.2.tar.gz

6.  Extract the file, then navigate to the new directory:

        tar -zxvf nginx-1.*.tar.gz
        cd /opt/nginx-1.*

7.  Configure the build options. The options shown here provide a good starting point, and will allow HTTP/2 compatibility. However, you may wish to add [other options](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/) as well, depending on your needs:

        ./configure --prefix=/opt/nginx --conf-path=/etc/nginx/nginx.conf --user=nginx --group=nginx --with-debug --with-threads --with-http_ssl_module --with-ipv6 --with-http_v2_module

    You will see an output of your configuration summary when this step is complete. Be sure to note the given file paths, since you'll need them shortly.

8.  Build and install nginx using the options you specified in Step 7:

        make
        make install

9.  Create an nginx system user:

        sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx

10. Create a systemd service script to run nginx:

    {{< file "/lib/systemd/system/nginx.service" shell >}}
[Unit]
Description=A high performance web server and a reverse proxy server
After=network.target

[Service]
Type=forking
PIDFile=/opt/nginx/logs/nginx.pid
ExecStartPre=/opt/nginx/sbin/nginx -t -q -g 'daemon on; master_process on;'
ExecStart=/opt/nginx/sbin/nginx -g 'daemon on; master_process on;'
ExecReload=/opt/nginx/sbin/nginx -g 'daemon on; master_process on;' -s reload
ExecStop=-/sbin/start-stop-daemon --quiet --stop --retry QUIT/5 --pidfile /opt/nginx/logs/nginx.pid
TimeoutStopSec=5
KillMode=mixed

[Install]
WantedBy=multi-user.target

{{< /file >}}


    If you used the build configuration options shown in Step 7, you may use this script exactly as shown. However, if you specified your own file paths, you may need to adjust the value for `PIDFile` to match your PID file, and the paths in the lines beginning with `Exec` to match your nginx binary file path. These files paths were included in the output in Step 7.

11. Make the `nginx.service` script executable:

        chmod +x /lib/systemd/system/nginx.service

12. Start nginx:

        systemctl start nginx

    Optionally, you can enable nginx to start automatically on boot:

        systemctl enable nginx

{{< note >}}
If you compile from a source distribution as above, some of the files referenced in this and other nginx guides may not be created by default. You may create those files yourself at their specified file paths, and nginx will work as intended. For more information, refer to our guide on [how to configure nginx](/docs/websites/nginx/how-to-configure-nginx).
{{< /note >}}

## Generate a Private Key and Certificate Signing Request (CSR)

1.  Create a directory to store your certificate and private key. On Debian systems, the default location for storing certificates and private keys is in `/etc/ssl/`. You are going to create a new `nginx` directory at that location to store your certificate and private key for nginx:

        mkdir /etc/ssl/nginx

2.  Navigate to the newly created directory:

        cd /etc/ssl/nginx

3.  Generate a 4096-bit private RSA key. Most certificate authorities currently require customers to use at least a 2048-bit private RSA key.

        openssl genrsa -out server.key 4096

4.  Generate a certificate signing request (CSR). In this example, `server.key` is the RSA private key file created above, and `server.csr` is the name of our CSR file:

        openssl req -new -key server.key -out server.csr

    When prompted for a `Common Name`, be sure to enter the domain name that you will be using to access your Linode. All other fields can be filled as you see fit.

    Optionally, you may enter a subdomain, for instance `www.yourdomain.com`. This must be a domain that you have control over and which you can receive email sent to `webmaster@yourdomain.com`. Any certificate issued for `yourname.yourdomain.com` is also valid for `yourdomain.com`.

    [![CSR Creation](/docs/assets/1751-CSR.jpg)](/docs/assets/1751-CSR.jpg)

## Sign-up With StartSSL

1.  Launch a web browser and navigate to the [StartSSL Control Panel](https://www.startssl.com/?app=12). If this is your first time requesting a certificate from StartSSL, click on the **Sign-up** button. If you have already requested a certificate from StartSSL, log into your account, and skip to the next section.

2. Provide the requested information and click **Continue**.

3.  A verification code will be sent to the email address provided. Log into your email account and provide the verification code. Then click **Continue**.

4.  Once your email address has been verified, choose to generate a high grade private key. This private key and certificate pair will be used to identify you to StartSSL. If you ever lose it, you will be unable to regain access to your account. Make sure to back up this certificate and private key.

5.  Click **Install** to incorporate your personal certificate into your browser, which will identify you to StartSSL. Once you've done this, click **Finish**.

You should now be logged into your StartSSL account.

## Verify Your Domain Name with StartSSL

1.  Click on the "Validations Wizard" tab. If you have already verified your domain name within the past 30 days, you may skip to the next section.

2.  Select "Domain Name Validation" and click **Continue**.

    [![StartSSL Validation Wizard Start Page](/docs/assets/startssl-domain-validation1.png)](/docs/assets/startssl-domain-validation1.png)

3.  Enter your domain name and click **Continue**.

    [![StartSSL Validation Wizard Domain Name Validation Page](/docs/assets/startssl-domain-validation2.png)](/docs/assets/startssl-domain-validation2.png)

4.  Choose an email address from the list and click **Send Verification Code**.

    [![StartSSL Validation Wizard Domain Control Email Validation Page](/docs/assets/startssl-domain-validation3.png)](/docs/assets/startssl-domain-validation3.png)

    A verification code should be sent to the email address selected. Access your email account and provide the verification code, then click **Validation**.

    Alternatively, if you do not have access to an email address at your domain, you may use "Website Control Validation." You will be prompted to download an HTML file and upload it to your site's root directory. This directory may vary depending on how you installed and configured nginx.

    [![StartSSL Validation Wizard Website Control Validation](/docs/assets/startssl-domain-validation4.png)](/docs/assets/startssl-domain-validation4.png)

    Once this is complete, click the button that says, "The verification file is ready in website, Continue..."

5.  Your domain has now been verified. Click **Finish**.

### Submit Your Certificate Signing Request to StartSSL

1.  Click on the "Certificates Wizard" button in your StartSSL account.

2.  Select "Web Server SSL/TLS Certicate" and click **Continue**.

    [![StartSSL Certificates Wizard Start](/docs/assets/startssl-certificate1.png)](/docs/assets/startssl-certificate1.png)

3.  Enter the full domains that will use your certificate. The first entry will be designated as the "Common Name," which consists of your domain name and TLD without a subdomain. You may enter up to 5 hostnames in this section if you're obtaining a free certificate, although support for additional hostnames is available with paid StartSSL plans.

    [![StartSSL Certificates Wizard CSR Domain Selection](/docs/assets/startssl-certificate2.png)](/docs/assets/startssl-certificate2.png)

4.  On the same page, you will be prompted to submit the certificate signing request (CSR) which you generated previously. In our example, this file was located at `/etc/ssl/nginx/server.csr`. Copy the contents of your CSR file and paste them into the text box. Click **Submit**.

    [![StartSSL Certificates Wizard Submit CSR](/docs/assets/startssl-certificate3.png)](/docs/assets/startssl-certificate3.png)

5.  Click "Certificates List" to navigate to a list of your certificates. Find the certificate that corresponds with the "Common Name" you specified in Step 3, and click the **Retrieve** button on that line.

    [![StartSSL Certificates Wizard Retrieve Certificate](/docs/assets/startssl-certificate4.png)](/docs/assets/startssl-certificate4.png)

    This will prompt you to download a .zip archive that contains several repositories of certificate files for different web servers and applications.

6.  Within the archive, extract the `NginxServer.zip` archive, which contains a file with the extension `.crt`. This is your SSL certificate. Open the file in a text editor on your local computer and copy the *entire* contents to your clipboard.

    {{< note >}}
The text of the `.crt` file will appear to have two certificates in it. It is important to copy everything in this file, in the order shown. Failure to do so will prevent your SSL certificate from working properly.
{{< /note >}}

7.  Paste the content of this file into a new file called `/etc/ssl/nginx/server.crt` on your Linode and save it. You can replace `server.crt` with your own certificate name, but it is recommended to leave the `.crt` extension for organization.

### Gather Additional Required Certificate Files

1.  Make sure you are still working in the directory where your nginx SSL files are located:

        cd /etc/ssl/nginx

2.  Download the StartSSL CA Certificate:

        wget http://www.startssl.com/certs/ca.pem

3.  Append the StartSSL Intermediate CA Certificate to that file, creating a unified CA Certificate file:

        curl http://www.startssl.com/certs/sub.class1.server.ca.pem >> ca.pem

4.  Create a single file containing your signed certificate and the StartSSL CA certificates for nginx:

        cat server.crt ca.pem > nginx.crt

## Install Your StartSSL Certificate

1.  By default, nginx is configured to only serve HTTP requests on TCP port 80. To make use of SSL, you will need to configure nginx to serve HTTPS requests on TCP port 443. Open the sample nginx SSL server block configuration file and adjust your configuration so that it matches the example below.

    {{< file "/etc/nginx/conf.d/example_ssl.conf" aconf >}}
# HTTPS server
#
server {
    listen       443 ssl;
    server_name  example.com;

    ssl_certificate      /etc/ssl/nginx/nginx.crt;
    ssl_certificate_key  /etc/ssl/nginx/server.key;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout  5m;

    ssl_ciphers  "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH !RC4";
    ssl_prefer_server_ciphers   on;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    location / {
        root   /opt/nginx/html;
        index  index.html index.htm;
    }
}

{{< /file >}}


    Replace the value of `server_name` with your domain or subdomain name. Make sure that the values of `ssl_certificate` and `ssl_certificate_key` match the file paths of the certificate and private key you created. The lines `ssl_session_cache`, `ssl_ciphers`, and `ssl_protocols` should match the above configuration.

    Depending on how you installed nginx, this file may not have been created by default. For example, if you compiled nginx from source, you will need to create the `example_ssl.conf` file and copy this configuration into it. If that is the case, you will also need to add the following line to the `http` block in your main nginx configuration file:

    {{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
include     /etc/nginx/conf.d/*.conf;

{{< /file-excerpt >}}


3.  Restart nginx to apply your changes.

        systemctl restart nginx

## Test Your Configuration

Launch a web browser and navigate to your domain. You should see the default nginx page. Please note that this will not work unless you've created an "A" record for your domain at your DNS host, which points to your Linode's IP address. Please contact your domain registrar or DNS hosting provider if you need assistance.

[![Up and Running](/docs/assets/1768-Up-And-Running.jpg)](/docs/assets/1768-Up-And-Running.jpg)

You have successfully installed the latest version of nginx and configured your free StartSSL SSL certificate. You can now run an [SSL test](https://www.ssllabs.com/ssltest/) on your website to evaluate your SSL parameters. Please keep in mind that the above configuration is a starting point only. For further information on how to optimize nginx for SSL, follow our guide on [SSL and TLS deployment best practices](/docs/websites/nginx/nginx-ssl-and-tls-deployment-best-practices).

You may also refer to our guide [How to Configure nginx](/docs/websites/nginx/how-to-configure-nginx) for further configuration options.

---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Serve SSL-enabled websites with the Apache 2 web server on CentOS.'
keywords: ["apache ssl", "ssl on centos", "web server", "centos 5", "centos 6", "centos 7"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/ssl-guides/centos/','security/ssl/ssl-certificates-with-apache-2-on-centos-5-6','web-servers/ssl/ssl-certificates-with-apache-2-on-centos-5-6']
modified: 2014-10-21
modified_by:
  name: Dave Russell
published: 2010-02-26
title: 'SSL Certificates with Apache 2 on CentOS'
---

This guide will assist you with enabling SSL for websites served under the Apache web server. We assume you've completed the steps detailed in our [getting started guide](/docs/getting-started/), and that you've successfully set up Apache for serving virtual hosts as outlined in our [Apache 2 installation guide](/docs/websites/apache/apache-2-web-server-on-centos-6). These steps should be performed via an SSH session to your Linode as the root user.

# Use a Self-Signed SSL Certificate with Apache

These instructions will help you generate a generic self-signed certificate, which may be used to provide SSL service for all name-based hosts on your Linode. Please note that self-signed certificates will generate warnings in a visitor's browser; proceed to "Installing a Commercial SSL Certificate" if you need to set up SSL on a domain using a certificate signed by a commercial SSL provider.

### Generate a Self-Signed Certificate

At the shell prompt, issue the following commands to install SSL for Apache and generate a certificate:

    yum install mod_ssl
    mkdir /etc/httpd/ssl
    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/httpd/ssl/httpd.pem -keyout /etc/httpd/ssl/httpd.key

You will be asked for several configuration values. Enter values appropriate for your organization and server, as shown here. This example will create a certificate valid for 365 days; you may wish to increase this value. We've specified the FQDN (fully qualified domain name) of the Linode for the "Common Name" entry, as this certificate will be used for generic SSL service.

    Generating a 1024 bit RSA private key
    ...................................++++++
    ..............................++++++
    writing new private key to '/etc/httpd/ssl/httpd.pem'
    -----
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [GB]:US
    State or Province Name (full name) [Berkshire]:New Jersey
    Locality Name (eg, city) [Newbury]:Absecon
    Organization Name (eg, company) [My Company Ltd]:SoftwareDev, LLC
    Organizational Unit Name (eg, section) []:Web Services
    Common Name (eg, YOUR name) []:archimedes.mydomain.com
    Email Address []:support@mydomain.com

### Configure Apache to use the Self-Signed Certificate

We'll need to edit the virtual host configuration directives for sites that you would like to enable SSL on. For each virtual host, you must add the following stanza, changing the values as appropriate for each site. Note that we've essentially duplicated the configuration for a non-SSL site, with the addition of three lines for SSL.

{{< file-excerpt "/etc/httpd/conf.d/vhost.conf" apache >}}
NameVirtualHost 12.34.56.78:443

<VirtualHost 12.34.56.78:443>
    SSLEngine On
    SSLCertificateFile /etc/httpd/ssl/httpd.pem
    SSLCertificateKeyFile /etc/httpd/ssl/httpd.key

    ServerAdmin info@mydomain.com
    ServerName www.mydomain.com
    DocumentRoot /srv/www/mydomain.com/public_html/
    ErrorLog /srv/www/mydomain.com/logs/error.log
    CustomLog /srv/www/mydomain.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Restart Apache:

    service httpd restart

You should now be able to visit your site with SSL enabled (after accepting your browser's warnings about the certificate).

# Install a Commercial SSL Certificate

Follow these instructions to get a commercial SSL certificate installed on your server. Please note that commercial SSL certificates require a unique IP address for SSL-enabled sites.

### Create a Certificate Signing Request

Issue these commands to create a certificate signing request (CSR) for the site which you'd like to use with SSL. Be sure to change "www.mydomain.com" to reflect the fully qualified domain name (subdomain.domainname.com) of the site you'll be using SSL with. Leave the challenge password blank. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial CA (certificate authority).

    mkdir /etc/httpd/ssl
    cd /etc/httpd/ssl
    openssl req -new -days 365 -nodes -keyout www.mydomain.com.key -out www.mydomain.com.csr

Here are the values we entered for our example certificate. Note that you can ignore the extra attributes.

    Generating a 1024 bit RSA private key
    ......................................................++++++
    ....++++++
    writing new private key to 'www.mydomain.com.key'
    -----
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [GB]:US
    State or Province Name (full name) [Berkshire]:New Jersey
    Locality Name (eg, city) [Newbury]:Absecon
    Organization Name (eg, company) [My Company Ltd]:SoftwareDev, LLC
    Organizational Unit Name (eg, section) []:Web Services
    Common Name (eg, YOUR name) []:archimedes.mydomain.com
    Email Address []:support@mydomain.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

Execute the following command to protect the key:

    chmod 400 /etc/httpd/ssl/www.mydomain.com.key

Files for your domain will be created in `/etc/httpd/ssl`. You may now submit the file ending in `.csr` to a commercial SSL provider for signing. You will receive a signed file after the CA signs the request. Save this file as `/etc/httpd/ssl/www.mydomain.com.crt`.

Execute the following command to protect the signed certificate:

    chmod 400 /etc/httpd/ssl/www.mydomain.com.crt

### Get the CA Root Certificate

Now you'll need to get the root certificate for the CA that you paid to sign your certificate. You may obtain the root certs for various providers from these sites:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://www.globalsign.com/en//)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

For example, if we downloaded a root cert for Verisign, we would save it to `/etc/httpd/ssl/verisign.cer`.

### Configure Apache to use the Signed SSL Certificate

In the following example, edit the virtual host configuration file for the site you would like to enable SSL on (www.mydomain.com in our example). Add the following stanza to your virtual hosting configuration file, (e.g. `/etc/httpd/conf.d/vhost.conf`). Note that we've reproduced the configuration for the non-SSL version of the site, with the addition of four lines for SSL. This example uses the CA certificate file for a certificate signed by Verisign.

{{< file-excerpt "/etc/httpd/conf.d/vhost.conf" apache >}}
<VirtualHost 12.34.56.78:443>
     SSLEngine On
     SSLCertificateFile /etc/httpd/ssl/www.mydomain.com.crt
     SSLCertificateKeyFile /etc/httpd/ssl/www.mydomain.com.key
     SSLCACertificateFile /etc/httpd/ssl/verisign.cer

     ServerAdmin info@mydomain.com
     ServerName www.mydomain.com
     DocumentRoot /srv/www/mydomain.com/public_html/
     ErrorLog /srv/www/mydomain.com/logs/error.log
     CustomLog /srv/www/mydomain.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Restart Apache:

    service httpd restart

You should now be able to visit your site with SSL enabled. Congratulations, you've installed a commercial SSL certificate!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Installing Apache on CentOS](/docs/websites/apache/apache-2-web-server-on-centos-6)
- [Official Apache Documentation](http://httpd.apache.org/docs/2.0/)




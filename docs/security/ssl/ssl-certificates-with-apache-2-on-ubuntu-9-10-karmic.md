---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Serve SSL-enabled websites with the Apache 2 web server on Ubuntu 9.10 (Karmic).'
keywords: ["ssl", "apache ssl", "ssl on ubuntu", "web sever", "ubuntu", "ubuntu karmic", "ubuntu 9.10"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/ssl-guides/ubuntu-9-10-karmic/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-02-26
title: 'SSL Certificates with Apache 2 on Ubuntu 9.10 (Karmic)'
---



This guide will assist you with enabling SSL for websites served under the Apache web server. We assume you've completed the steps detailed in our [getting started guide](/docs/getting-started/), and that you've successfully set up Apache for serving virtual hosts as outlined in our [Apache 2 on Ubuntu 9.10 (Karmic) guide](/docs/web-servers/apache/installation/ubuntu-9-10-karmic). These steps should be performed via an SSH session to your Linode as the root user.

# Use a Self-Signed SSL Certificate with Apache

These instructions will help you generate a generic self-signed certificate, which may be used to provide SSL service for all name-based hosts on your Linode. Please note that self-signed certificates will generate warnings in a visitor's browser; proceed to "Installing a Commercial SSL Certificate" if you need to set up SSL on a domain using a certificate signed by a commercial SSL provider.

### Generate a Self-Signed Certificate

At the shell prompt, issue the following commands to enable SSL for Apache and generate a certificate:

    a2enmod ssl
    mkdir /etc/apache2/ssl
    openssl req -new -x509 -sha256 -days 365 -nodes -out /etc/apache2/ssl/apache.pem -keyout /etc/apache2/ssl/apache.key

You will be asked for several configuration values. Enter values appropriate for your organization and server, as shown here. This example will create a certificate valid for 365 days; you may wish to increase this value. We've specified the FQDN (fully qualified domain name) of the Linode for the "Common Name" entry, as this certificate will be used for generic SSL service.

    Generating a 1024 bit RSA private key
    ...................................++++++
    ..............................++++++
    writing new private key to '/etc/apache2/ssl/apache.pem'
    -----
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:New Jersey
    Locality Name (eg, city) []:Absecon
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:SoftwareDev, LLC
    Organizational Unit Name (eg, section) []:Web Services
    Common Name (eg, YOUR name) []:archimedes.mydomain.com
    Email Address []:support@mydomain.com

### Configure Apache to use the Self-Signed Certificate

SSL name-based virtual hosts are still not supported in `/etc/apache2/ports.conf`, we'll need to add an entry for a specific IP address on your Linode as follows. You may use a single IP to provide self-signed SSL service for multiple vhosts.

{{< file-excerpt "/etc/apache2/ports.conf" apache >}}
NameVirtualHost 12.34.56.78:443

{{< /file-excerpt >}}


Replace "12.34.56.78" with your Linode's IP address. Next, edit the virtual host configuration files for sites which you would like to enable SSL on. For each virtual host, you must add the following stanza (change the values as appropriate for each site). Note that we've essentially reproduced the configuration for a non-SSL site, with the addition of three lines for SSL.

{{< file-excerpt "Apache virtual hosting file" apache >}}
<VirtualHost 12.34.56.78:443>
     SSLEngine On
     SSLCertificateFile /etc/apache2/ssl/apache.pem
     SSLCertificateKeyFile /etc/apache2/ssl/apache.key

     ServerAdmin info@mydomain.com
     ServerName www.mydomain.com
     DocumentRoot /srv/www/mydomain.com/public_html/
     ErrorLog /srv/www/mydomain.com/logs/error.log
     CustomLog /srv/www/mydomain.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Restart Apache:

    /etc/init.d/apache2 restart

You should now be able to visit your site with SSL enabled (after accepting your browser's warnings about the certificate).

# Install a Commercial SSL Certificate

Follow these instructions to get a commercial SSL certificate installed on your server. Please note that commercial SSL certificates require a unique IP address for SSL-enabled sites.

### Create a Certificate Signing Request

Issue these commands to create a certificate signing request (CSR) for the site which you'd like to use with SSL. Be sure to change "www.mydomain.com" to reflect the fully qualified domain name (subdomain.domainname.com) of the site you'll be using SSL with. Leave the challenge password blank. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial CA (certificate authority).

    mkdir /etc/apache2/ssl
    cd /etc/apache2/ssl
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
    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:New Jersey
    Locality Name (eg, city) []:Absecon
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:MyDomain, LLC
    Organizational Unit Name (eg, section) []:Web Services
    Common Name (eg, YOUR name) []:www.mydomain.com
    Email Address []:support@mydomain.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

Execute the following command to protect the key:

    chmod 400 /etc/apache2/ssl/www.mydomain.com.key

Files for your domain will be created in `/etc/apache2/ssl`. You may now submit the file ending in `.csr` to a commercial SSL provider for signing. You will receive a signed file after the CA signs the request. Save this file as `/etc/apache2/ssl/www.mydomain.com.crt`.

Execute the following command to protect the signed certificate:

    chmod 400 /etc/apache2/ssl/www.mydomain.com.crt

### Get the CA Root Certificate

Now you'll need to get the root certificate for the CA that you paid to sign your certificate. You may obtain the root certs for various providers from these sites:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://www.globalsign.com/en//)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

For example, if we downloaded a root cert for Verisign, we would save it to `/etc/apache2/ssl/verisign.cer`.

### Configure Apache to use the Signed SSL Certificate

Next, we'll add an entry to `/etc/apache2/ports.conf` for the IP address you'll be using to host your SSL-enabled site.

    {{< file-excerpt "/etc/apache2/ports.conf" apache>}}
NameVirtualHost 12.34.56.78:443
{{< /file-excerpt >}}

Replace "12.34.56.78" with the IP address of your SSL-enabled site. Next, edit the virtual host configuration file for the site you would like to enable SSL on (www.mydomain.com in our example). Add the following stanza; note that we've essentially reproduced the configuration for the non-SSL version of the site, with the addition of four lines for SSL. This example uses the CA certificate file for a certificate signed by Verisign.

{{< file-excerpt "Apache virtual hosting file" apache >}}
<VirtualHost 12.34.56.78:443>
     SSLEngine On
     SSLCertificateFile /etc/apache2/ssl/www.mydomain.com.crt
     SSLCertificateKeyFile /etc/apache2/ssl/www.mydomain.com.key
     SSLCACertificateFile /etc/apache2/ssl/verisign.cer

     ServerAdmin info@mydomain.com
     ServerName www.mydomain.com
     DocumentRoot /srv/www/mydomain.com/public_html/
     ErrorLog /srv/www/mydomain.com/logs/error.log
     CustomLog /srv/www/mydomain.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Restart Apache:

    /etc/init.d/apache2 restart

You should now be able to visit your site with SSL enabled. Congratulations, you've installed a commercial SSL certificate!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Installing Apache on Ubuntu 9.10 (Karmic)](/docs/web-servers/apache/installation/ubuntu-9-10-karmic)
- [Official Apache Documentation](http://httpd.apache.org/docs/2.0/)




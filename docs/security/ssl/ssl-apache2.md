---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve SSL-enabled websites with the Apache web server.'
keywords: 'apache SSL,ssl on debian,web sever,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, November 19th, 2014
modified_by:
  name: James Stewart
published: 'Wednesday, November 19th, 2014'
title: 'SSL Certificates with Apache'
---

This guide will assist you with enabling SSL for websites served under the Apache web server, in order to ensure secure access to your website and services.

Prerequisites
-------------

Thsi guide assumes that you are running Apache2 on Debian7 or Ubuntu 14.04. Prior to following this guide, you will also need to ensure that the following steps have been taken on your Linode.

- Follow our [getting started guide](/docs/getting-started/) to configure your Linode.

- Follow our [hosting a website guide](/docs/websites/hosting-a-website), and create a site that you wish to secure with SSL.

- Follow our guide for obtaining either a [self signed](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate) or [commercial](/docs/security/ssl/obtaining-a-commercial-ssl-certificate) SSL certificate.

NameVirtualHost Configuration
-----------------------------

You will need to add a NameVirtualHost entry for the IP address that you wish to use for SSL. You may use a single IP to provide self-signed SSL service for multiple vhosts.  If you wish to host multiple sites with commercial SSL certificates, you will need to [contact support](/docs/platform/support) to request an additional IP address, and create an entry as shown below for each IP you are using for SSL.  Replace 12.34.56.78 with the IP address that you wish to use for SSL.

{: .file-excerpt }
/etc/apache2/ports.conf
:   ~~~ apache
    NameVirtualHost 12.34.56.78:443
    ~~~

Configure Apache to use a Self-Signed Certificate
---------------------------------------------------

You will need to edit the virtual host configuration files located in /etc/apache2/sites-available, to provide the certificate files that should be used by each virtual host. For each virtual host, you will need to replicate the configuration shown below. You'll need to replace 12.34.56.78 with your Linode's IP address, and any mentions of mydomain.com with your own domain as provided when configuring your certificate. Note that we've essentially reproduced the configuration for a non-SSL site, with the addition of three lines for SSL.

{: .file-excerpt }
Apache virtual hosting file
:   ~~~ apache
    <VirtualHost 12.34.56.78:443>
         SSLEngine On
         SSLCertificateFile /etc/ssl/localcerts/www.mydomain.com.crt
         SSLCertificateKeyFile /etc/ssl/localcerts/www.mydomain.com.key

         ServerAdmin info@mydomain.com
         ServerName www.mydomain.com
         DocumentRoot /var/www/mydomain.com/public_html/
         ErrorLog /var/www/mydomain.com/logs/error.log
         CustomLog /var/www/mydomain.com/logs/access.log combined
    </VirtualHost>
    ~~~

Restart Apache:

    service apache2 restart

You should now be able to visit your site with SSL enabled (after accepting your browser's warnings about the certificate).

Configure Apache to use a Commercial SSL Certificate
----------------------------------------------------

###Get the CA Root Certificate

You will need to download the root certificate for the provider that issued your commercial certificate before you can begin using it. You may obtain the root certs for various providers from these sites:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://secure.globalsign.net/cacert/)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

Most providers will provide a root certificate file as either a .cer or .pem file. Save the provided root certificate in /etc/ssl/localcerts.

### Configure Apache to use the Signed SSL Certificate

You will need to edit the virtual host configuration files located in /etc/apache2/sites-available, to provide the certificate files that should be used by each virtual host.For each virtual host, you will need to replicate the configuration shown below. You'll need to replace 12.34.56.78 with your Linode's IP address, and any mentions of mydomain.com with your own domain as provided when configuring your certificate. You will also need to ensure that the SSLCACertificateFile value is configured to point to the CA root certificate downloaded in the previous step.

{: .file-excerpt }
Apache virtual hosting file
:   ~~~ apache
    <VirtualHost 12.34.56.78:443>
         SSLEngine On
         SSLCertificateFile /etc/ssl/localcerts/www.mydomain.com.crt
         SSLCertificateKeyFile /etc/ssl/localcerts/www.mydomain.com.key
         SSLCACertificateFile /etc/ssl/localcerts/ca.pem

         ServerAdmin info@mydomain.com
         ServerName www.mydomain.com
         DocumentRoot /var/www/mydomain.com/public_html/
         ErrorLog /var/www/mydomain.com/logs/error.log
         CustomLog /var/www/mydomain.com/logs/access.log combined
    </VirtualHost>
    ~~~

Restart Apache:

    service apache2 restart

You should now be able to visit your site with SSL enabled. Congratulations, you've installed a commercial SSL certificate!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Apache HTTP Server Version 2.0 Documentation](http://httpd.apache.org/docs/2.0/)

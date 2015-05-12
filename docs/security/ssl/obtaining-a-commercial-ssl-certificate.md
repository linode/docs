---
author:
  name: Linode
  email: docs@linode.com
description: 'How to prepare and submit a request for a commercially-signed SSL certificate.'
keywords: 'openssl,commercial ssl cert,apache ssl,ssl linux'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['security/ssl-certificates/commercial/']
modified: Tuesday, November 18th, 2014
modified_by:
  name: James Stewart
published: 'Monday, November 16th, 2009'
title: Obtaining a Commercial SSL Certificate
external_resources:
 - '[OpenSSL Documentation](http://www.openssl.org/docs/)'
---

Follow these instructions to get a commercial SSL certificate installed on your server. Please note that commercial SSL certificates require a unique IP address for each certificate. As SSL certificates may be used by many kinds of software, these instructions are generic in nature. If you're intending to use your SSL certificate on a website powered by Apache, you should follow our [Apache SSL guides](/docs/web-servers/apache/ssl-guides/) instead.

## Install OpenSSL

Issue the following command to install required packages for OpenSSL, the open source SSL toolkit.

Debian/Ubuntu users:

    apt-get update
    apt-get upgrade
    apt-get install openssl
    mkdir /etc/ssl/localcerts

CentOS/Fedora users:

    yum install openssl
    mkdir /etc/ssl/localcerts

## Create a Certificate Signing Request

Issue these commands to create a certificate signing request (CSR) for the site which you'd like to use with SSL. Be sure to change "www.mydomain.com" to reflect the fully qualified domain name (subdomain.domainname.com) of the site you'll be using SSL with. Leave the challenge password blank. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial CA (certificate authority).

    cd /etc/ssl/localcerts
    openssl req -new -newkey rsa:2048 -nodes -days 365 -keyout www.mydomain.com.key -out www.mydomain.com.csr

Here are the values we entered for our example certificate. Note that you can ignore the extra attributes.

    Generating a 2048 bit RSA private key
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

    chmod 400 /etc/ssl/localcerts/www.mydomain.com.key

Files for your domain will be created in `/etc/ssl/localcerts`. You may now submit the file ending in `.csr` to a commercial SSL provider for signing. You will receive a signed file after the CA signs the request. Save this file as `/etc/ssl/localcerts/www.mydomain.com.crt`.

Execute the following command to protect the signed certificate:

    chmod 400 /etc/ssl/localcerts/www.mydomain.com.crt

## Get the CA Root Certificate

Now you'll need to get the root certificate for the CA that you paid to sign your certificate. You may obtain the root certs for various providers from these sites:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://www.globalsign.com/en//)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

For example, if we downloaded a root cert for Verisign, we would save it to `/etc/ssl/localcerts/verisign.cer`. Note that many Linux distributions offer a package that contains updated root certificates for major certificate authorities; check your distribution's repositories for a package named "ca-certificates". If you have this package installed, the root CA certs will be installed under `/etc/ssl/certs`.

## Next Steps

Once your certificate has been generated, you will need to configure your web server to utilize the new certificate.  Instructions for doing so with several popular platforms can be found at the links below.

- [SSL Certificates with Apache on Debian and Ubuntu](/docs/security/ssl/ssl-apache2-debian-ubuntu)
- [SSL Certificates with Apache on CentOS 7](/docs/security/ssl/ssl-apache2-centos)
- [SSL Certificates with Nginx](/docs/security/ssl/ssl-certificates-with-nginx)

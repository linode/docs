---
author:
  name: Linode
  email: docs@linode.com
description: 'How to prepare and submit a request for a commercially-signed SSL certificate.'
keywords: 'openssl,commercial ssl cert,apache ssl,ssl linux'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['security/ssl-certificates/commercial/']
modified: Wednesday, August 17th, 2016
modified_by:
  name: Nick Brewer
published: 'Monday, November 16th, 2009'
title: Obtaining a Commercial SSL Certificate
external_resources:
 - '[OpenSSL Documentation](http://www.openssl.org/docs/)'
---

These instructions will show you how to install a commercial SSL certificate on your Linode. As SSL certificates can be used by many kinds of software, the steps provided are generic in nature. If you intend to use your SSL certificate on a website powered by Apache, you can continue to our Apache SSL guides for [Debian & Ubuntu](/docs/security/ssl/ssl-apache2-debian-ubuntu) or [CentOS](/docs/security/ssl/ssl-apache2-centos) once you've completed the process outlined here. 

For an SSL setup with Nginx, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide. 

If you're hosting multiple websites with commercial SSL certificates on the same IP address, you'll need to use the [SNI](https://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI) extension of TLS. SNI is accepted by most modern web browsers, but if you expect to receive connections from clients running legacy browsers (Like Internet Explorer for Windows XP), you will need to [contact support](/docs/platform/support) to request an additional IP address.

## Install OpenSSL

Issue the following commands to install required packages for OpenSSL, the open source SSL toolkit.

Debian/Ubuntu users:

    apt-get update && apt-get upgrade
    apt-get install openssl
	mkdir /etc/ssl/localcerts

CentOS/Fedora users:

    yum update
    yum install openssl
	mkdir /etc/ssl/localcerts

## Create a Certificate Signing Request

Issue these commands to create a certificate signing request (CSR) for the site which you'd like to use with SSL. Be sure to change "www.mydomain.com" to reflect the fully qualified domain name (subdomain.domainname.com) of the site you'll be using SSL with. Leave the challenge password blank. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial certificate authority (CA).

    cd /etc/ssl/localcerts
    openssl req -new -newkey rsa:2048 -nodes -sha256 -days 365 -keyout www.example.com.key -out www.example.com.csr

Here are the values we entered for our example certificate. Note that you can ignore the extra attributes.

    Generating a 2048 bit RSA private key
    ......................................................++++++
    ....++++++
    writing new private key to 'www.example.com.key'
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
    Email Address []:support@example.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

Execute the following command to protect the key:

    chmod 400 /etc/ssl/localcerts/www.example.com.key

Files for your domain will be created in `/etc/ssl/localcerts`. You may now submit the file ending in `.csr` to a commercial SSL provider for signing. You will receive a signed file after the CA signs the request. Save this file as `/etc/ssl/localcerts/www.example.com.crt`.

Execute the following command to protect the signed certificate:

    chmod 400 /etc/ssl/localcerts/www.example.com.crt

## Get the CA Root Certificate

Most modern distributions come with the majority of root CA certificates installed under `/etc/ssl/certs` as part of the "ca-certificates" package. To check if this package is installed, you can run this command:

Debian/Ubuntu:

	apt-cache policy ca-certificates

CentOS/Fedora:

	yum list installed ca-certificates

If you're using an older distribution that does not have the "ca-certificates" package, you will need to download your root certificate from the CA that issued it. Some of the most common commercial certificate authorities are listed below:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://www.globalsign.com/en//)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

Once you've downloaded your root certificate, you'll need to add it to the `/etc/ssl/localcerts` directory. For example, if you were to download a root certificate for Verisign, you would save it to `/etc/ssl/localcerts/verisign.cer`. 



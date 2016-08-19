---
author:
  name: Linode
  email: docs@linode.com
description: 'How to prepare and submit a request for a commercially-signed SSL certificate on CentOS or Fedora'
keywords: 'openssl,commercial ssl cert,apache ssl,ssl linux, centos ssl, fedora ssl'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['security/ssl-certificates/commercial/']
modified: Friday, August 19th, 2016
modified_by:
  name: Nick Brewer
published: 'Friday, August 19th, 2016'
title: Obtaining a Commercial SSL Certificate on CentOS & Fedora
external_resources:
 - '[OpenSSL Documentation](http://www.openssl.org/docs/)'
---

These instructions will show you how to install a commercial SSL certificate on your Linode. As SSL certificates can be used by many kinds of software, the steps provided are generic in nature. If you intend to use your SSL certificate on a website powered by Apache, you can continue to our [SSL Certificates with Apache on CentOS 7](/docs/security/ssl/ssl-apache2-centos) guide once you've completed the process outlined here.

For an SSL setup with Nginx, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide.

If you're hosting multiple websites with commercial SSL certificates on the same IP address, you'll need to use the [SNI](https://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI) extension of TLS. SNI is accepted by most modern web browsers, but if you expect to receive connections from clients running legacy browsers (Like Internet Explorer for Windows XP), you will need to [contact support](/docs/platform/support) to request an additional IP address.

{: .note}
>
>This guide assumes that you are logged in as the root user, and that you will not need to prepend commands with `sudo`.

## Install OpenSSL

Issue the following commands to install required packages for OpenSSL, the open source SSL toolkit.

    yum update
    yum install openssl

## Create a Certificate Signing Request

Issue these commands to create a certificate signing request (CSR) for the site that will be using SSL. Be sure to change "example.com" to reflect the fully qualified domain name (subdomain.example.com) of the site you'll be using SSL with. Leave the challenge password blank. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial certificate authority (CA).

{: .note}
>
>While some CA providers will automatically include the "www" subdomain when issuing certificates for a root domain such as example.com, others do not. If you wish to secure multiple subdomains using the same certificate, you will need to create a [wildcard certificate](https://en.wikipedia.org/wiki/Wildcard_certificate) or make use of [subject alternative names](https://www.linode.com/docs/security/ssl/multiple-ssl-sites-using-subjectaltname).

    cd /etc/ssl/
    openssl req -new -newkey rsa:2048 -nodes -sha256 -days 365 -keyout /etc/pki/tls/private/example.com.key -out example.com.csr

Here are the values we entered for our example certificate. Note that you can ignore the extra attributes.

    Generating a 2048 bit RSA private key
    ......................................................++++++
    ....++++++
    writing new private key to 'example.com.key'
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
    Common Name (eg, YOUR name) []:example.com
    Email Address []:support@example.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

This command will create a `.key` file under `/etc/pki/tls/private` and a `.csr` file under `/etc/ssl`. Issue this command to protect your private key:

    chmod 400 /etc/pki/tls/private/example.com.key

You may now submit the file ending in `.csr` to a commercial SSL provider for signing. You will receive a signed file after the CA signs the request. Save this file as `/etc/pki/tls/certs/example.com.crt`.

Execute the following command to protect the signed certificate:

    chmod 400 /etc/pki/tls/certs/example.com.crt

## Get the CA Root Certificate

Most modern distributions come with common root CA certificates installed as part of the "ca-certificates" package. To check if this package is installed, you can run this command:

    yum list installed ca-certificates

The "ca-certificates" package comes with a bundle of root certs located under `/etc/pki/tls/certs/ca-bundle.crt` that can be used with many prevalent certificate authorities. If you're using an older distribution that does not have the "ca-certificates" package, you will need to download your root certificate from the CA that issued it. Some of the most common commercial certificate authorities are listed below:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://www.globalsign.com/en//)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

Once you've downloaded your root certificate, you can add it to the `/etc/pki/tls/certs` directory. For example, if you were to download a root certificate for Verisign, you would save it to `/etc/pki/tls/certs/verisign.cer`.

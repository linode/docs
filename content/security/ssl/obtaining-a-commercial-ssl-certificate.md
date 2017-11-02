---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'How to prepare and submit a request for a commercially-signed SSL certificate.'
keywords: ["openssl", "commercial ssl cert", "apache ssl", "ssl linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/ssl-certificates/commercial/']
modified: 2016-08-17
modified_by:
  name: Nick Brewer
published: 2009-11-16
title: Obtaining a Commercial SSL Certificate
external_resources:
 - '[OpenSSL Documentation](http://www.openssl.org/docs/)'
---

{{< caution >}}
This guide has been split into two guides, for [Debian & Ubuntu](/docs/security/ssl/obtain-a-commercially-signed-ssl-certificate-on-debian-and-ubuntu) and [CentOS & Fedora](/docs/security/ssl/obtain-a-commercially-signed-ssl-certificate-on-centos-and-fedora).
{{< /caution >}}

These instructions will show you how to install a commercial SSL certificate on your Linode. As SSL certificates can be used by many kinds of software, the steps provided are generic in nature. If you intend to use your SSL certificate on a website powered by Apache, you can continue to our Apache SSL guides for [Debian & Ubuntu](/docs/security/ssl/ssl-apache2-debian-ubuntu) or [CentOS](/docs/security/ssl/ssl-apache2-centos) once you've completed the process outlined here.

For an SSL setup with Nginx, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide.

If hosting multiple websites with commercial SSL certificates on the same IP address, use the [Server Name Identification (SNI) extension](https://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI) of TLS. SNI is accepted by most modern web browsers. If you expect to receive connections from clients running legacy browsers (like Internet Explorer for Windows XP), you will need to [contact support](/docs/platform/support) to request an additional IP address.

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

Issue the following commands to navigate to the `/etc/ssl/localcerts` directory and create a certificate signing request (CSR) for the site that will be using SSL. Change `example.com` to reflect the fully qualified domain name (FQDN) or IP of the site you'll be using SSL with. Leave the challenge password blank. Note that in this example, we entered 365 for the days parameter, as we would be paying for one year of SSL certificate verification from a commercial certificate authority (CA):

    cd /etc/ssl/localcerts
    openssl req -new -newkey rsa:2048 -nodes -sha256 -days 365 -keyout www.example.com.key -out www.example.com.csr

After the first command changes directories, the second command creates a `.csr` and a `.key` file under the `/etc/ssl/localcerts` directory using these options:

* `-nodes` instructs OpenSSL to create a certificate that does not require a passphrase. If this option is excluded, you will be required to enter the passphrase in the console each time the application using it is restarted.

* `-days` determines the length of time in days that the certificate is being issued for. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial certificate authority (CA).

* `rsa:` allows you to specify the size of the RSA key. In this case we've chosen 2048 bits as this is the recommended minimum size.

* `-sha256` ensures that the certificate request is generated using 265-bit SHA (Secure Hash Algorithm).

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

Most modern distributions come with common root CA certificates installed as part of the "ca-certificates" package. To check if this package is installed, you can run this command:

Debian/Ubuntu:

    apt-cache policy ca-certificates

CentOS/Fedora:

    yum list installed ca-certificates

The "ca-certificates" package comes with a bundle of root certs that can be used with commonly accepted certificate authorities. The specific location of the bundle varies depending upon the distribution:

Debian/Ubuntu:

    /etc/ssl/certs/ca-certificates.crt

CentOS/Fedora:

    /etc/pki/tls/certs/ca-bundle.crt


If you're using an older distribution that does not have the "ca-certificates" package, you will need to download your root certificate from the CA that issued it. Some of the most common commercial certificate authorities are listed below:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://www.globalsign.com/en//)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

Once you've downloaded your root certificate, you can add it to the `/etc/ssl/localcerts` directory. For example, if you were to download a root certificate for Verisign, you would save it to `/etc/ssl/localcerts/verisign.cer`.

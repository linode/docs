---
author:
  name: Linode
  email: docs@linode.com
description: 'How to prepare and submit a request for a commercially-signed SSL certificate on Debian or Ubuntu.'
keywords: 'openssl, debian, ubuntu,commercial ssl cert,apache ssl,ssl linux'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['security/ssl-certificates/commercial/']
modified: Friday, August 19th, 2016
modified_by:
  name: Nick Brewer
published: 'Friday, August 19th, 2016'
title: Obtaining a Commercial SSL Certificate on Debian & Ubuntu
external_resources:
 - '[OpenSSL Documentation](http://www.openssl.org/docs/)'
---

These instructions will show you how to install a commercial SSL certificate on your Linode running Debian or Ubuntu. As SSL certificates can be used by many kinds of software, the steps provided are generic in nature. If you intend to use your SSL certificate on a website powered by Apache, you can continue to our [SSL Certificates with Apache on Debian & Ubuntu](/docs/security/ssl/ssl-apache2-debian-ubuntu) guide once you've completed the process outlined here.

For an SSL setup with Nginx, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide.

If you're hosting multiple websites with commercial SSL certificates on the same IP address, you'll need to use the [SNI](https://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI) extension of TLS. SNI is accepted by most modern web browsers, but if you expect to receive connections from clients running legacy browsers (Like Internet Explorer for Windows XP), you will need to [contact support](/docs/platform/support) to request an additional IP address.

## Before You Begin

1. Complete our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides.

2. Ensure that your packages are up to date by running `apt-get update && apt-get upgrade`.

3. Log in to your Linode as the root user, or escalate to root privileges.  

## Create a Certificate Signing Request

Issue these commands to create a certificate signing request (CSR) for the site that will be using SSL. Be sure to change "example.com" to reflect the fully qualified domain name (subdomain.example.com) of the site you'll be using SSL with. Leave the challenge password blank.

{: .note}
>
>While some CA providers will automatically include the "www" subdomain when issuing certificates for a root domain such as example.com, others do not. If you wish to secure multiple subdomains using the same certificate, you will need to create a [wildcard certificate](https://en.wikipedia.org/wiki/Wildcard_certificate).

    cd /etc/ssl/
    openssl req -new -newkey rsa:2048 -nodes -sha256 -days 365 -keyout /etc/ssl/private/example.com.key -out example.com.csr

The first command navigates to the `/etc/ssl` directory. The second command generates a secure key, as well as a certificate signing request. A brief explanation of the options used:

* `-nodes` instructs OpenSSL to create a certificate that does not require a passphrase. If this option is excluded, you will be required to enter the the passphrase in the console each time the application using it is restarted.

* `-days` determines the length of time in days that the certificate is being issued for. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial certificate authority (CA).

* `rsa:` allows you to specify the size of the RSA key. In this case we've chosen 2048 bits as this is the recommended minimum size.

* `-sha256` ensures that the certificate request is generated using 265-bit SHA (Secure Hash Algorithm).

Here are the values we entered for our example certificate. Note that you can ignore the 'extra' attributes.

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
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:example, LLC
    Organizational Unit Name (eg, section) []:Web Services
    Common Name (eg, YOUR name) []:example.com
    Email Address []:support@example.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

This command will create a `.csr` file under the `/etc/ssl` directory, and a `.key` file under `/etc/ssl/private`. You can execute this command to protect your private key:

    chmod 400 /etc/ssl/private/example.com.key

You may now submit the file ending in `.csr` to a commercial SSL provider for signing. You will receive a signed file after the CA signs the request. Save this file as `/etc/ssl/certs/example.com.crt`.

Execute the following command to protect the signed certificate:

    chmod 400 /etc/ssl/certs/example.com.crt

## Get the CA Root Certificate

Most modern distributions come with common root CA certificates installed as part of the "ca-certificates" package. To check if this package is installed, you can run this command:

    apt-cache policy ca-certificates

The "ca-certificates" package comes with a bundle of root certs located under `/etc/ssl/certs/ca-certificates.crt` that can be used with many prevalent certificate authorities. If you're using an older distribution that does not have the "ca-certificates" package, you will need to download your root certificate from the CA that issued it. Some standard commercial certificate authorities are listed below:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://www.globalsign.com/en//)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

## Adding Your Root Certificate to the CA Bundle

If your ca-certificates bundle does not include your certificate authority's root cert, you can add it manually by moving the file to the source directory:

    cp root-example.crt /usr/local/share/ca-certificates/

Issue this command to update the bundle with your new root certificate:

    update-ca-certificates

## Preparing a Chained SSL Certificate

In some cases, CAs have not submitted a Trusted Root CA Certificate to some or all browser vendors. Because of this, you can choose to *chain* roots for certificates to be trusted by web browsers. If you receive several files from your CA ending with `.crt`(collectively referred to as a `chained SSL certificate`), they must be linked into one file, in a specific order, to provide full support with most browsers. The following example uses a chained SSL certificate that was signed by Comodo. Enter the following command to prepare your chained SSL certificate:

        cat example.com.crt COMODORSADomainValidationSecureServerCA.crt  COMODORSAAddTrustCA.crt AddTrustExternalCARoot.crt > www.mydomain.com.crt

    The contents of the resulting file will appear similar to the following (yours will be unique):

        -----BEGIN CERTIFICATE-----
        MIIFSzCCBDOgAwIBAgIQVjCXC0bF9U8FypJOnL9cuDANBgkqhkiG9w0BAQsFADCB
        ................................................................
        ncHG3hwHHwhiEz6ukC2mqxA+D3KILiywgHgWcumnpeCEUQgDzy0Fz2Ip/kR/1Fkv
        DCQzME2NkT1ZdW8fdz+Y
        -----END CERTIFICATE-----
        -----BEGIN CERTIFICATE-----
        MIIGCDCCA/CgAwIBAgIQKy5u6tl1NmwUim7bo3yMBzANBgkqhkiG9w0BAQwFADCB
        ................................................................
        j4rBYKEMrltDR5FL1ZoXX/nUh8HCjLfn4g8wGTeGrODcQgPmlKidrv0PJFGUzpII
        -----END CERTIFICATE-----
        -----BEGIN CERTIFICATE-----
        ZFRydXN0IEV4dGVybmFsIFRUUCBOZXR3b3JrMSIwIAYDVQQDExlBZGRUcnVzdCBF
        ................................................................
        Uspzgb8c8+a4bmYRBbMelC1/kZWSWfFMzqORcUx8Rww7Cxn2obFshj5cqsQugsv5
        -----END CERTIFICATE-----
        -----BEGIN CERTIFICATE-----
        MIIENjCCAx6gAwIBAgIBATANBgkqhkiG9w0BAQUFADBvMQswCQYDVQQGEwJTRTEU
        ................................................................
        6wwCURQtjr0W4MHfRnXnJK3s9EK0hZNwEGe6nQY1ShjTK3rMUUKhemPR5ruhxSvC
        -----END CERTIFICATE-----


    The chart below breaks this down a bit more clearly:

    {: .table .table-striped }
    | Certificate Type:          | Issued to:                              | Issued by:                              |
    |----------------------------|:----------------------------------------|:----------------------------------------|
    | End-user Certificate       | example.com                             | Comodo LLC                              |
    | Intermediate Certificate 1 | Comodo LLC                              | COMODORSADomainValidationSecureServerCA |
    | Intermediate Certificate 2 | COMODORSADomainValidationSecureServerCA | COMODORSAAddTrustCA                     |
    | Root certificate           | COMODORSAAddTrustCA                     | AddTrustExternalCARoot                  |

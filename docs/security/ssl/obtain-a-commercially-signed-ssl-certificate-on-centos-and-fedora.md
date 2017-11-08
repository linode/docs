---
author:
  name: Linode
  email: docs@linode.com
description: 'Prepare and Submit a Request to Obtain a Commercially Signed SSL Certificate on CentOS or Fedora'
keywords: ["ssl certificate", "ssl cert", "commercial", "csr", "centos", "fedora"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/ssl-certificates/commercial/']
modified: 2016-08-19
modified_by:
  name: Nick Brewer
published: 2016-08-19
title: Obtain a Commercially Signed SSL Certificate on CentOS and Fedora
external_resources:
 - '[OpenSSL Documentation](http://www.openssl.org/docs/)'
---

SSL/TLS encryption is the standard for securing web traffic. This guide will show you how to install a commercial SSL certificate on your Linode running CentOS or Fedora. As SSL certificates can be used by many kinds of software, the steps provided are generic in nature.

If you intend to use your SSL certificate on a website powered by Apache, continue to our [SSL Certificates with Apache on CentOS 7](/docs/security/ssl/ssl-apache2-centos) guide once you've completed the process outlined here.

For an SSL setup with Nginx, please start with our [Nginx and SSL](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) guide.

If hosting multiple websites with commercial SSL certificates on the same IP address, use the [Server Name Identification (SNI) extension](https://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI) of TLS. SNI is accepted by most modern web browsers. If you expect to receive connections from clients running legacy browsers (like Internet Explorer for Windows XP), you will need to [contact support](/docs/platform/support) to request an additional IP address.

## Before You Begin

- Complete our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides.

- Ensure that your packages are up to date.

   * On CentOS and Fedora 21 or below:

         sudo yum update

   * On Fedora 22 and above:

         sudo dnf upgrade

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

Replace each instance of `example.com` in this guide with your site's domain name.
{{< /note >}}

## Create a Certificate Signing Request

{{< note >}}
While some Certificate Authorities (CA) will automatically include the "www" subdomain when issuing certificates for a root domain such as example.com, others do not. If you wish to secure multiple subdomains using the same certificate, you will need to create a [wildcard certificate](https://en.wikipedia.org/wiki/Wildcard_certificate).
{{< /note >}}

Issue the following commands to navigate to the `/etc/ssl` directory, and create a certificate signing request (CSR) for the site that will be using SSL. Change `example.com` to reflect the fully qualified domain name (FQDN) of the site you intend to use with SSL. Leave the challenge password blank:

    cd /etc/ssl/
    openssl req -new -newkey rsa:2048 -nodes -sha256 -days 365 -keyout /etc/pki/tls/private/example.com.key -out example.com.csr

After the first command changes directories, the second command creates a `.csr` file under the `/etc/ssl` directory, and a `.key` file under `/etc/pki/tls/private` using these options:

* `-nodes` instructs OpenSSL to create a certificate that does not require a passphrase. If this option is excluded, you will be required to enter the passphrase in the console each time the application using it is restarted.

* `-days` determines the length of time in days that the certificate is being issued for. We entered 365 for the days parameter to the command, as we would be paying for one year of SSL certificate verification from a commercial certificate authority (CA).

* `rsa:` allows you to specify the size of the RSA key. In this case we've chosen 2048 bits as this is the recommended minimum size.

* `-sha256` ensures that the certificate request is generated using 265-bit SHA (Secure Hash Algorithm).

Here are the values we entered for our example certificate. Note that you can ignore the 'extra' attributes:

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

Restrict the private key's file properties to be read only by owner:

    chmod 400 /etc/pki/tls/private/example.com.key

You may now submit the file ending in `.csr` to a commercial SSL provider for signing. You will receive a signed file after the CA signs the request. Save this file as `/etc/pki/tls/certs/example.com.crt`.

Restrict the signed certificate's file properties as well:

    chmod 400 /etc/pki/tls/certs/example.com.crt

## Get the CA Root Certificate

Most modern distributions come with common root CA certificates installed as part of the "ca-certificates" package. To check if this package is installed, run:

    yum list installed ca-certificates

The ca-certificates package comes with a bundle of root certs located under `/etc/pki/tls/certs/ca-bundle.crt` that can be used with many prevalent certificate authorities. If you're using an older distribution that does not have the ca-certificates package, you will need to download your root certificate from the CA that issued it. Some standard commercial certificate authorities are:

-   [Verisign](https://knowledge.verisign.com/support/ssl-certificates-support/index.html)
-   [Thawte](http://www.thawte.com/roots/index.html)
-   [Globalsign](http://www.globalsign.com/en//)
-   [Comodo](https://support.comodo.com/index.php?_m=downloads&_a=view&parentcategoryid=1&pcid=0&nav=0)

## Add Your Root Certificate to the CA Bundle

You can add root certificates to the bundle by enabling dynamic CA configuration:

    update-ca-trust force-enable

Next copy the certificate file to the appropriate directory, and update the bundle:

    cp root-example.crt /etc/pki/ca-trust/source/anchors/
    update-ca-trust extract

## Prepare a Chained SSL Certificate

In some cases, CAs have not submitted a Trusted Root CA Certificate to some or all browser vendors. Because of this, you can choose to *chain* roots for certificates to be trusted by web browsers. If you receive several files from your CA ending with `.crt` (collectively referred to as a "chained SSL certificate"), they must be linked into one file, in a specific order, to ensure full compatibility with most browsers. The example below uses a chained SSL certificate that was signed by Comodo.

Prepare your chained SSL certificate:

    cat example.com.crt COMODORSADomainValidationSecureServerCA.crt  COMODORSAAddTrustCA.crt AddTrustExternalCARoot.crt > www.mydomain.com.crt

The contents of the resulting file will appear similar to the following:

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


Use this table to better visualize the command entered to prepare the chained SSL certificate:

| **Certificate Type:**      | **Issued to:**                          | **Issued by:**                          |
|----------------------------|:----------------------------------------|:----------------------------------------|
| End-user Certificate       | example.com                             | Comodo LLC                              |
| Intermediate Certificate 1 | Comodo LLC                              | COMODORSADomainValidationSecureServerCA |
| Intermediate Certificate 2 | COMODORSADomainValidationSecureServerCA | COMODORSAAddTrustCA                     |
| Root certificate           | COMODORSAAddTrustCA                     | AddTrustExternalCARoot                  |

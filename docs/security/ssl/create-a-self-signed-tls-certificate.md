---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will show you a brief command to create a self-signed TLS certificate with OpenSSL.'
keywords: ["ssl", "tls", "https", "certificate", "self"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/ssl/create-a-self-signed-certificate-on-centos-and-fedora/','security/ssl/create-a-self-signed-certificate-on-debian-and-ubuntu/','security/ssl/how-to-make-a-selfsigned-ssl-certificate/']
modified: 2018-01-09
modified_by:
  name: Linode
published: 2018-01-09
title: 'Create a Self-Signed TLS Certificate'
---

![Create a Self-Signed Certificate title graphic](/docs/assets/create-a-self-signed-tls-certificate-title-graphic.jpg "Create a Self-Signed Certificate title graphic")

Self-signed TLS certificates are suitable for personal use or applications used internally within an organization. If you intend to use your SSL certificate on a website served by Apache or NGINX, see our guides for doing that (Apache, [NGINX](/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/x)) once you’ve completed the process outlined here.


1.  Change users to the `root` user and change directories to where you want to create the certificate and key pair. That location will vary depending on your end use. Here we'll use `/root/certs`.

        su - root
        mkdir /root/certs && cd /root/certs

2.  Create the certificate:

        openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out MyCertificate.crt -keyout MyKey.key

    After entering the command, you will be prompted to add identifying information for your website or organization to the certificate. Since a self-signed cert won't be used publicly, this information isn't necessary. However, if this certificate were being created to be passed on to a certificate authority for signing, the information would need to be as accurate as possible.

    Here is an example of the output:

    {{< output >}}
root@localhost:~# openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out MyCertificate.crt -keyout MyKey.key
Generating a 4096 bit RSA private key
..............................................................................+++
..............................................+++
writing new private key to 'MyKey.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:PA
Locality Name (eg, city) []:Philadelphia
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Linode
Organizational Unit Name (eg, section) []:Docs
Common Name (e.g. server FQDN or YOUR name) []:hostname.example.com
Email Address []:admin@example.com
{{< /output >}}

    Here's a breakdown of the OpenSSL options used in that command. There are many others available, but these will create you something basic which will be good for a year. For more info, see `man openssl` in your terminal.

    * `-newkey rsa:4096` tells OpenSSL to create a 4096 bit RSA key for use with the certificate. RSA 2048 is the default on more recent versions of OpenSSL but to be sure of the key size, you should specify it during creation.

    * `-x509` tells OpenSSL to create a self-signed certificate.

    * `-sha256` generate the certificate request using 265-bit SHA (Secure Hash Algorithm).

    * `-days` determines the length of time in days that the certificate is being issued for. For a self-signed certificate, this value can be increased as necessary.

    * `-nodes` instructs OpenSSL to create a certificate that does not require a passphrase. If this option is excluded, you will be required to enter the passphrase in the console each time the application using it is restarted.

3.  Restrict the key's permissions so that only `root` can access it:

        chmod 400 /root/certs/MyKey.key

4.  Back up your certificate and key to external storage. **This is an important step. Do not skip it!**

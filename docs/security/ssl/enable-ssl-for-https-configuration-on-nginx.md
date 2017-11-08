---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will teach you how to provide encrypted access to resources using TSL/SSL for HTTP connections on Nginx.'
keywords: ["ssl", "tls", "nginx", "https", "secure http", "encryption for HTTP", "SSL certificates with Nginx", "certificate signing request"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/configuration/ssl/','security/ssl/ssl-certificates-with-nginx/index.cfm/','websites/ssl/ssl-certificates-with-nginx.cfm/','security/ssl/ssl-certificates-with-nginx/','security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificates-on-nginx/index.cfm/','security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificated-on-nginx/','security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx/']
modified: 2014-06-10
modified_by:
  name: Alex Fornuto
published: 2010-11-08
title: 'Enable SSL for HTTPS Configuration on nginx'
external_resources:
 - '[Nginx Project Home Page](http://nginx.org)'
 - '[Nginx Project SSL Documentation](http://wiki.nginx.org/NginxHttpSslModule)'
 - '[Nginx Basic Configuration Documentation](/docs/websites/nginx/basic-nginx-configuration)'
 - '[Nginx Installation Documentation](/docs/websites/nginx/)'
---

Transport Layer Security (TLS) and Secure Socket Layer (SSL) provide an easy method to encrypt connections between end-users and web servers. SSL uses a certificate authority system to provide identity verification in order to prevent websites from falsely claiming to be another organization or website. This guide outlines how to provide encrypted access to resources using SSL certificates and nginx.

This document assumes that you have completed the [getting started guide](/docs/getting-started/). If you're new to Linux systems administration, we recommend that you read through the [Linux users and groups guide](/docs/tools-reference/linux-users-and-groups) and the [administration basics guide](/docs/using-linux/administration-basics).

## Install Nginx With SSL Support

Before proceeding, ensure that you've compiled nginx with support for SSL. The [nginx installation guides](/docs/websites/nginx/) provide a more comprehensive explanation on compiling nginx. Follow the appropriate guide for the Linux distribution you deployed and be aware of the following considerations:

-   If you compiled nginx from source code obtained from the upstream, ensure that the `--with-http_ssl_module` argument is added to the `./configure` command as specified in these documents.
-   If you installed nginx using your system's package management tools, make sure that the package is built with SSL support.
-   Take note of the version of nginx you've installed. The method of configuring sites to use SSL with nginx varies slightly between versions of nginx prior to version 0.7.14 and later versions.
-   To see the current version and compile-time options of your `nginx` installation, issue the command `nginx -V`.

## Create and Manage SSL Certificates

Before configuring nginx to use SSL, you must generate SSL certificates. This section outlines the steps for creating SSL certificates and keys for "self-signed" certificates and "certificate signing requests" for commercially-signed certificates.

SSL certificates are only valid for a single domain or host name unless you generate or purchase a certificate with one or more subject alternate names (`SubjectAltName`) or a wild card certificate which supports all sub-domains beneath a certain domain. For additional information, consider the document series on [SSL certificates](/docs/security/ssl//).

These examples store the SSL certificate in the `/srv/ssl/` directory. You may choose to store your SSL certificates and related files in whatever directory makes the most sense for the needs and organization of your deployment.

### Generate a Self-Signed Certificate

The following procedure generates a single self-signed SSL certificate. These certificates do not verify the identity of a server like commercially-signed certificates, but they are useful for encryption purposes. With the `-days 365` argument, the certificate generated will be valid for a full year. Issue the following sequence of commands:

    mkdir /srv/ssl/
    cd /srv/ssl/
    openssl req -new -x509 -sha256 -days 365 -nodes -out /srv/ssl/nginx.pem -keyout /srv/ssl/nginx.key

If you wish to use a 2048-bit certificate, add the following option to the above command:

    -newkey rsa:2048

This produces a self-signed certificate that is valid for 365 days. You may wish to increase this value in the command above. During this process, you will be asked several questions. Provide information that reflects your organization and server, as shown below. Specify the FQDN (fully qualified domain name) for your server in the "Common Name" entry as this certificate will be used for generic SSL service.

    Generating a 1024 bit RSA private key
    ...................................++++++
    ..............................++++++
    writing new private key to '/srv/ssl/nginx.pem'
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
    Common Name (eg, YOUR name) []:username.example.com
    Email Address []:username@example.com

The `Common Name` for your certificate must match the host name that you want to generate a valid certificate for. Continue to configure nginx to serve SSL content.

### Generate a Certificate Signing Request for a Commercial SSL Certificate

Issue the following sequence of commands to create a certificate signing request (CSR) for the site that you'd like to provide with SSL. Be sure to change "example.com" to reflect the fully qualified domain name (`subdomain.domainname.com`) of your server. Leave the challenge password blank. This command creates an SSL certificate that is valid for 365 days. Alter this value as needed for the certificate you wish to purchase.

    mkdir /srv/ssl
    cd /srv/ssl
    openssl req -new -days 365 -nodes -keyout example.com.key -out example.com.csr

The following output of the `openssl` command demonstrates the creation of a certificate signing request. You may safely ignore the `'extra' attributes`.

    Generating a 1024 bit RSA private key
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
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:example Morris
    Organizational Unit Name (eg, section) []:Web Services
    Common Name (eg, YOUR name) []:example.com
    Email Address []:username@example.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

Issue the following command to limit access to the key:

    chmod 400 /srv/ssl/example.com.key

Certificate files for your domain are now located in `/srv/ssl/`. You can provide the `/srv/ssl/example.com.csr` file to a commercial certificate provider for signing. You will receive a signed certificate file after the CA signs the request. Save this file as `/srv/ssl/example.com.crt`.

Use the following command to limit access to the signed certificate:

    chmod 400 /srv/ssl/example.com.crt

In some cases, certificate authorities will sign certificates using a chained authority certificate. This may cause browsers to warn users when trying to connect to your server. To prevent this from affecting your users, issue the following command to create a certificate file that nginx can serve properly:

    cat /srv/ssl/example.com.crt /srv/ssl/authority-chain.crt > /srv/ssl/example.com.combined.crt

Then, specify the `/srv/ssl/example.com.combined.crt` file in the `ssl_certificate` configuration directive within your nginx configuration, as follows:

{{< file-excerpt "nginx.conf" >}}
ssl_certificate /srv/ssl/example.com.combined.crt;

{{< /file-excerpt >}}


You can append as many chain certificates as you require. Make sure that the certificate you generate for your site is at the beginning of the file.

## Optimize Nginx For SSL

Compared to conventional HTTP, HTTPS (or HTTP with SSL) requires additional overhead and server resources. To manage this load, the developers of nginx recommend the following optimizations to your `nginx.conf` configuration.

Begin optimization by setting the number of worker processes. Ensure that the number of worker processes equals the number of accessible processor cores. This allows nginx to use the full processing capability of the server. This configuration directive is placed at the beginning, or "root" level, of the configuration:

{{< file-excerpt "nginx.conf" >}}
worker_processes 4;

{{< /file-excerpt >}}

Within the `http {}` block, add the following directives to control and limit the default SSL session settings:

{{< file-excerpt "nginx.conf" >}}
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

{{< /file-excerpt >}}

Inside of the `server {}` configuration blocks for virtual hosts that serve HTTPS, set the `keepalive_timeout` to 70 seconds. This prevents stale sessions from consuming resources and additional overhead on reconnections.

{{< file-excerpt "nginx.conf" >}}
keepalive_timeout 70;

{{< /file-excerpt >}}


You may now continue to configure virtual hosts for your server.

## Configure Basic SSL Virtual Hosts

HTTPS operates on port 443 instead of port 80. Take note of the version of nginx running on your system with the output of `nginx -V` and model your configuration based on the appropriate example.

### Use SSL with Versions of Nginx Prior to 0.7.14

In addition to basic [nginx virtual host configuration](/docs/websites/nginx/basic-nginx-configuration), using SSL with nginx requires a modification to the `listen` directive and three ssl-related directives as shown in the following examples:

{{< file-excerpt "nginx.conf" nginx >}}
server {

      # [...]

      listen 443;
      ssl on;
      ssl_certificate      /srv/ssl/nginx.pem;
      ssl_certificate_key  /srv/ssl/nginx.key;

      # [...]
}

{{< /file-excerpt >}}


Modify the directives above to point to the proper certificates and keys. If you have a commercially signed certificate, the `ssl_certificate` directive may resemble the following:

    ssl_certificate /srv/ssl/example.com.crt;

Be sure to add other required configuration directives to control the functionality of your web server.

Using SNI it's possible to host multiple SSL-encrypted sites from the same IP address, but some older web browsers may not be compatible with SNI. If you need to host more than one site with SSL for end users on these older systems, you will need to have separate IP addresses for each site. The following example illustrates how each site can listen on its own IP address:

{{< file-excerpt "nginx.conf" nginx >}}
server {
      listen 12.34.56.78:443;
      server_name example.com;

      ssl on;
      ssl_certificate      /srv/ssl/example.com.pem;
      ssl_certificate_key  /srv/ssl/example.com.key;

      # [...]
}

server {
      listen 12.34.56.79:443;
      server_name example.com;

      ssl on;
      ssl_certificate      /srv/ssl/example.com.pem;
      ssl_certificate_key  /srv/ssl/example.com.key;

      # [...]
}

{{< /file-excerpt >}}


### Use SSL with Versions of Nginx After 0.7.14

Following version 0.7.14 of nginx, you may omit the `ssl` directive and include these declarations as arguments to the `listen` directive. This modification is optional, but is the preferred syntax. The following example illustrates the preferred usage of SSL declarations:

{{< file-excerpt "nginx.conf" nginx >}}
server {

      # [...]

      listen 443 ssl;
      ssl_certificate      /srv/ssl/nginx.pem;
      ssl_certificate_key  /srv/ssl/nginx.key;

      # [...]
}

{{< /file-excerpt >}}


Modify the directives above to point to the proper certificates and keys. If you have a commercially signed certificate, the `ssl_certificate` directive may resemble the following:

    ssl_certificate /srv/ssl/example.com.crt;

Be sure to add other required configuration directives to control the functionality of your web server.

There is no consistent way to host more than one site using SSL on a single IP. If you need to host more than one site with SSL, you will need to have separate IP addresses for each site. The following example illustrates how each site can listen on its own IP address:

{{< file-excerpt "nginx.conf" nginx >}}
server {
      listen 12.34.56.78:443 ssl;
      server_name example.com;

      ssl_certificate      /srv/ssl/example.com.pem;
      ssl_certificate_key  /srv/ssl/example.com.key;

      # [...]
}

server {
      listen 12.34.56.79:443 ssl;
      server_name example.com;

      ssl_certificate      /srv/ssl/example.com.pem;
      ssl_certificate_key  /srv/ssl/example.com.key;

      # [...]
}

{{< /file-excerpt >}}


## Configure Multiple Sites with a Single SSL Certificate

If you have access to a certificate that is valid for multiple host names, such as a wild card certificate or a certificate with "subject alternate names", configure nginx in the following manner:

{{< file-excerpt "nginx.conf" nginx >}}
http {
    ssl_certificate   /srv/ssl/example.com.crt;
    ssl_certificate_key  /srv/ssl/example.com.key;

    server {
       listen       12.3.45.6:443;
       server_name      example.com www.example.com;
       ssl on;

       location / {
             root /srv/www/example.com/public_html;
       }
    }
    server {
       listen       12.3.45.7:443;
       server_name      team.example.com;
       ssl on;

       location / {
             root /srv/www/team.example.com/public_html;
       }

    # [...]
    }

{{< /file-excerpt >}}


In this example, the wild card certificate is specified once in the root level of the `http {}` configuration, and the domains `example.com`, `www.example.com`, and `team.example.com` are all served using the `/srv/ssl/example.com.crt` certificate.

If you are running a version of nginx newer than 0.7.14, omit the `ssl on;` directive and specify the ssl option as an argument to the `listen` directive.

## Redirect HTTP Virtual Hosts to HTTPS

If you want to redirect all HTTP traffic for a domain to HTTPS, insert the following `rewrite` directive in a `location / {}` configuration block:

{{< file-excerpt "nginx.conf" nginx >}}
rewrite ^ https://example.com$request_uri permanent;

{{< /file-excerpt >}}


Once you have added this line, your config should resemble the following:

{{< file-excerpt "nginx.conf" nginx >}}
server {
      listen 12.34.56.78:80;
      server_name example.com;

      location / {
          rewrite ^ https://$server_name$request_uri permanent;
      }

      # [...]
}
server {
      listen 12.34.56.79:443 ssl;
      server_name example.com;

      ssl_certificate      /srv/ssl/example.com.pem;
      ssl_certificate_key  /srv/ssl/example.com.key;

      # [...]
}

{{< /file-excerpt >}}


Modify the configuration of the `ssl` directive if you're using a version of nginx prior to `0.7.14`.

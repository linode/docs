---
author:
  name: Linode
  email: docs@linode.com
description: 'Install a TLS certificate into NGINX for HTTPS access.'
keywords: ["ssl", "tls", "nginx", "https", "certificate"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/configuration/ssl/','security/ssl/ssl-certificates-with-nginx/','security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificated-on-nginx/','security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx/']
modified: 2018-01-09
modified_by:
  name: Linode
published: 2010-11-08
title: 'Getting Started with NGINX - Part 3: Enable TLS for HTTPS Connections'
---

![HTTPS Configuration on NGINX](/docs/assets/nginx-ssl/Enable_SSL_nginx.jpg)

Transport Layer Security (TLS) is the successor to Secure Socket Layer (SSL), and provides stronger HTTPS access to web servers from browsers and other tools.

A single NGINX installation can host multiple websites. Any number of them can use the same TLS certificate and key, or a cert/key pair exclusively their own. This guide outlines several scenarios for how to add a TLS certificate to your site's NGINX configuration.


## Before You Begin

- This guide is Part 3 of our Getting Started with NGINX series and you will need a working NGINX setup with your site accessible via HTTP. If do not have that, then complete at least [Part 1: Basic Installation and Setup](web-servers/nginx/nginx-basic-installation-and-setup) before going further.

- You will need root access to the system, or a user account with `sudo` privileges.

- You will need a TLS certificate and key for your site. The certificate can be self-signed if this is a private or internal site, or if you are simply experimenting. You can alternatively use a commercial certificate chain if that's what your site requires. If you don't already have a certificate and server key, see our guides for creating a [self-signed certificate](/docs/security/ssl/create-a-self-signed-tls-certificate) or a [certificate signing request](/docs/security/ssl/obtain-a-commercially-signed-tls-certificate).

- If you compiled NGINX from source code, ensure that it was compiled with `--with-http_ssl_module`. Verify in the output of `nginx -V`.


## Credentials Storage Location

There is no official or unanimously preferred place to store your site's certificate and key. The TLS certificate is sent to each device that connects to the server, so it's not a private file. The key, however, is.

Wherever you decide to store your certificate/key pair, you want them to remain untouched by system updates and secured against other system users. As an example, we'll store them in `/root/certs/` but whatever location you decide, you should back up this folder.

1.  Make the storage folder:

        mkdir /root/certs

2.  Move your certificate(s) and key(s) into that folder.

3.  Restrict permissions on the key file:

        chmod 400 /root/certs/example.com.key


## Configure Your http { } Block

Directives you want NGINX to apply to all sites on your server should go into the `http { }` block of `nginx.conf`, including SSL/TLS directives. The directives below assume one website, or all sites on the server, using the same certificate and key.

If you have multiple sites with their own HTTPS credentials, and/or are using a setup with HTTP and HTTPS sites, you'll want to move the `ssl_certificate` and `ssl_certificate_key` lines into the `server { }` block for the appropriate site.

{{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}
http {
    ssl_certificate     /root/certs/example.com.crt;
    ssl_certificate_key /root/certs/example.com.key;
    ssl_ciphers         EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
    }
{{< /file-excerpt >}}


## Configure a Single Site

1.  To have NGINX serve one site via HTTPS, simply use the `http { }` block configuration above. In this scenario, you do not need to add `ssl_*` directives to the site's configuration file. As an example, below is a basic site config file which works with the above `ssl_*` `http { }` header directives.

    {{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}

server {
    listen              203.0.113.4:443 ssl default_server;
    listen              [2001:DB8:32]:443 ssl default_server ;
    server_name         example.com www.example.com;
    root                /var/www/example.com/public_html;
    }
{{< /file-excerpt >}}

2.  Always reload your configuration after making changes to NGINX's configuration files:

        nginx -s reload

3.  Now if you go to your site's address or Linode's IP using `https://`, your site should load over HTTPS. In the case of a self-signed certificate, your browser will warn of an insecure connection.


## Configure Multiple Sites with a Single Certificate

Scenario: You have a certificate that is valid for multiple domains, such as a wild card certificate or a certificate using *SubjectAltName*. 

In this scenario, the `http { }` block directives given above stay the same. You'll need two separate configuration files in `/etc/nginx/conf.d/`, one for each site the credentials will protect. In them it is necessary to specify the IP address for each site with the `listen` directive.

You also don't want to use `default_server` if you have two different websites with different IPs.

1.  The sites `example1.com`, `example2.com` are served using the same certificate and key we placed into `root/certs/` earlier.

    {{< file-excerpt "/etc/nginx/conf.d/example1.com.conf" nginx >}}
server {
    listen              203.0.113.5:443 ssl;
    listen              [2001:DB8:32]:443 ssl;
    server_name         example.com www.example.com;
    root                /var/www/example.com/public_html;
    }
{{< /file-excerpt >}}

    {{< file-excerpt "/etc/nginx/conf.d/example2.com.conf" nginx >}}
server {
    listen              203.0.113.6:443 ssl;
    listen              [2001:DB8:33]:443 ssl;
    server_name         example2.com www.example2.com;
    root                /var/www/example2.com/public_html;
    }
{{< /file-excerpt >}}

2.  Reload your configuration:

        nginx -s reload

3.  Both sites should now be accessible by HTTPS. If you use the browser to inspect the certificate properties, you'll see the one cert is serving both sites.


## Configure Multiple Sites with Different Certificates

Scenario: You have two completely independent websites you want to serve with two different TLS certificate/key pairs.

1.  Make sure your certificate storage is organized properly. Below is an example: 

        /root/certs
        ├── example1.com
        │   ├── example1.com.crt
        │   └── example1.com.key
        └── example2.com
            ├── example2.com.crt
            └── example2.com.key

2.  Configure the `http { }` block of your `nginx.conf` as shown above, but **without the certificate and key locations**. Those will instead go in the individual site's `server { }` blocks since they are different locations for each site. The result should be:

    {{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}

http {
    ssl_ciphers         EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
}
{{< /file-excerpt >}}

3.  Add the `ssl_certificate` and `ssl_certificate_key` directives to each `server { }` block **with the correct path to each site's certificate and key file** (.pem format can also be used).

    {{< file-excerpt "/etc/nginx/conf.d/example1.com.conf" nginx >}}
server {
    listen              203.0.113.5:443 ssl;
    listen              [2001:DB8:32]:443 ssl;
    server_name         example1.com www.example1.com;
    root                /var/www/example1.com/public_html;

    ssl_certificate     /root/certs/example1.com.crt;
    ssl_certificate_key /root/certs/example1.com.key;
    }
{{< /file-excerpt >}}

    {{< file-excerpt "/etc/nginx/conf.d/example2.com.conf" nginx >}}
server {
    listen              203.0.113.6:443 ssl;
    listen              [2001:DB8:33]:443 ssl;
    server_name         example2.com www.example2.com;
    root                /var/www/example2.com/public_html;

    ssl_certificate     /root/certs/example.com.crt;
    ssl_certificate_key /root/certs/example.com.key;
    }
{{< /file-excerpt >}}

4.  Reload your configuration:

        nginx -s reload

5.  Now both sites should be accessible over HTTPS, but using your browser to inspect the certificates will show that site `example1.com` is using `example1.com.crt`, and `example2.com` is using `example2.com.crt`.


## Part 4: SSL/TLS Best Practices

Now that you've got NGINX serving your site over HTTPS, do not simply use the above configurations as-is. They are given as examples only to get HTTPS working on your server but are inherently insecure without further configuration. To harden your server's handling of TLS connections, move on to part 4 of this series: [NGINX TLS Deployment Best Practices](/docs/web-servers/nginx/nginx-tls-deployment-best-practices/). 
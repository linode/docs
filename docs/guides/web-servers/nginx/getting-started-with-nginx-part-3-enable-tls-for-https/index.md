---
slug: getting-started-with-nginx-part-3-enable-tls-for-https
description: "This is part three in our guide to Getting Started with Nginx where you will enable TLS/SSL for HTTPS on your web server and installing a SSL Certificate."
keywords: ["ssl", "tls", "nginx", "https", "certificate"]
tags: ["ssl","web server","security","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/security/ssl/enable-ssl-for-https-configuration-on-nginx/','/docs/web-servers/nginx/install-nginx-and-a-startssl-certificate-on-debian-7-wheezy/','/security/ssl/ssl-certificates-with-nginx/','/docs/web-servers/nginx/install-nginx-and-a-startssl-certificate-on-debian-8-jessie/','/web-servers/nginx/enable-tls-on-nginx-for-https-connections/','/security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificated-on-nginx/','/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx/','/security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificates-on-nginx/index.cfm/','/websites/ssl/ssl-certificates-with-nginx.cfm/','/web-servers/nginx/configuration/ssl/','/guides/enable-tls-on-nginx-for-https-connections/']
modified: 2018-02-09
modified_by:
  name: Linode
published: 2018-02-09
title: "Getting Started with NGINX (Part 3): Enable TLS/SSL for HTTPS"
title_meta: "Getting Started with NGINX: Enable TLS/SSL"
authors: ["Linode"]
---

![Getting Started with NGINX - Part 3: Enable TLS for HTTPS Connections](getting-started-with-nginx-part-3-smg.jpg)

Transport Layer Security (TLS) is the successor to Secure Socket Layer (SSL). It provides stronger and more efficient HTTPS, and contains enhancements not found in SSL such as Forward Secrecy, compatibility with modern OpenSSL cipher suites, and HSTS.

A single NGINX installation can host multiple websites and any number of them can use the same TLS certificate and key, or a cert/key pair exclusively their own. This guide outlines several scenarios for how to add a TLS certificate to your site's NGINX configuration.


## Before You Begin

* This guide is Part 3 of our *Getting Started with NGINX* series and you will need a working NGINX setup with your site accessible via HTTP. If do not already have that, complete at least [Part 1: Basic Installation and Setup](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/) before going further.

* You will need root access to the system, or a user account with `sudo` privileges.

* You will need a TLS certificate and key for your site. The certificate can be self-signed if this is a private or internal site, or if you are simply experimenting. Alternatively, use a commercial certificate chain if that's what your site requires. If you don't already have a certificate and server key, see our guides for creating a [self-signed certificate](/docs/guides/create-a-self-signed-tls-certificate/) or a [certificate signing request](/docs/guides/obtain-a-commercially-signed-tls-certificate/).

* If you compiled NGINX from source code, ensure that it was compiled with `--with-http_ssl_module`. Verify in the output of `nginx -V`.

## Credentials Storage Location

There is no official or unanimously preferred place to store your site's TLS certificate and key. The certificate is sent to each device that connects to the server, so it's not a private file. The key, however, is private.

Wherever you decide to store your certificate/key pair, you want them to remain untouched by system updates and secured against other system users. As an example, we'll store them in `/root/certs/` but **whatever location you decide, you should back up that folder**.

1.  Make the storage folder:

        mkdir /root/certs/example.com/

2.  Move your certificate(s) and key(s) into that folder.

3.  Restrict permissions on the key file:

        chmod 400 /root/certs/example.com/example.com.key

## Configure the http Block

Directives you want NGINX to apply to all sites on your server should go into the `http` block of `nginx.conf`, including SSL/TLS directives. The directives below assume one website, or all sites on the server, using the same certificate and key.

If you have multiple sites with their own HTTPS credentials, and/or are using a setup with both HTTP and HTTPS sites, move the `ssl_certificate` and `ssl_certificate_key` directives into the `server` block for the appropriate site (`.pem` format can also be used).

{{< file "/etc/nginx/nginx.conf" nginx >}}
http {
    ssl_certificate     /root/certs/example.com/example.com.crt;
    ssl_certificate_key /root/certs/example.com/example.com.key;
    ssl_ciphers         EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH;
    ssl_protocols       TLSv1.1 TLSv1.2;
{{< /file >}}

## Configure a Single HTTPS Site

Scenario: You have a certificate issued for one domain, and a single website you'd like NGINX to serve over HTTPS.

With only one site to work with, simply use the `http` block configuration [in the previous section](#configure-your-http-block). In this scenario, you do not need to add `ssl_*` directives to the site's configuration file. However, you do need to tell NGINX that the site should be listening on port `443` for HTTPS connections instead of port `80`. See the [SSL module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html) section of the NGINX docs for more information.

1. As an example, below is a basic site configuration which works with the `http ` block given above. This `server` block makes your site available over IPv4 and IPv6 but *only* over HTTPS-you will have no HTTP access. You will also need to type `https://` into the browser to access your site.

    This is only a starting step, you likely wouldn't want to use this configuration without HSTS or redirecting HTTP requests to port 443. We'll get to those in part 4 of this series.

    {{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen              443 ssl default_server;
    listen              [::]:443 ssl default_server ;
    server_name         example.com www.example.com;
    root                /var/www/example.com;
    }
{{< /file >}}

2.  Reload your configuration after making changes to NGINX's config files:

        nginx -s reload

3.  Go to your site's address or Linode's IP in a web browser, making sure to specify `https://` in the URL. Your site should load over HTTPS. If you're using a self-signed certificate, the browser will warn of an insecure connection. Bypass the warning and connect anyway.

## Configure Multiple Sites with a Single Certificate

Scenario: You have a certificate that is valid for multiple domains, such as a wildcard certificate or a certificate using *SubjectAltName*.

In this scenario, the directives in the `http` block given in the [Configure the HTTP Block](#configure-the-http-block) section stay the same. You'll need two separate configuration files in `/etc/nginx/conf.d/`, one for each site the credentials will protect. In them it is necessary to specify the IP address for each site with the `listen` directive. You do not want to use `default_server` if you have two different websites with different IPs.

1.  The sites `example1.com`, `example2.com` are served using the same certificate and key we placed into `/root/certs/example.com/` [earlier](#credentials-storage-location).

    {{< file "/etc/nginx/conf.d/example1.com.conf" nginx >}}
server {
    listen              203.0.113.30:443 ssl;
    listen              [2001:DB8::5]:443 ssl;
    server_name         example1.com www.example1.com;
    root                /var/www/example1.com;
    }
{{< /file >}}

    {{< file "/etc/nginx/conf.d/example2.com.conf" nginx >}}
server {
    listen              203.0.113.40:443 ssl;
    listen              [2001:DB8::6]:443 ssl;
    server_name         example2.com www.example2.com;
    root                /var/www/example2.com;
    }
{{< /file >}}

2.  Reload your configuration:

        nginx -s reload

3.  Both sites should now be accessible by HTTPS. If you use your browser to inspect the certificate properties, you'll see the one cert is serving both sites.

## Configure Multiple Sites with Different SSL Certificates

Scenario: You have two (or more) completely independent websites you want to serve with two (or more) different TLS certificate/key pairs.

1.  Make sure your certificate storage is well organized. Below is an example:

        /root/certs/
        ├── example1.com/
        │   ├── example1.com.crt
        │   └── example1.com.key
        └── example2.com/
            ├── example2.com.crt
            └── example2.com.key

2.  Configure the `http` block of your `nginx.conf` as shown [above](#configure-the-http-block), but **without the certificate and key locations**. Those will instead go in the individual site's `server` block since the locations are different for each site. The result should be:

    {{< file "/etc/nginx/nginx.conf" nginx >}}
http {
    ssl_ciphers         EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
}
{{< /file >}}

3.  Add the `ssl_certificate` and `ssl_certificate_key` directives to each `server` block with the correct path to each site's certificate and key file.

    {{< file "/etc/nginx/conf.d/example1.com.conf" nginx >}}
server {
    listen              203.0.113.55:443 ssl;
    listen              [2001:DB8::7]:443 ssl;
    server_name         example1.com www.example1.com;
    root                /var/www/example1.com;

    ssl_certificate     /root/certs/example.com/example1.com.crt;
    ssl_certificate_key /root/certs/example.com/example1.com.key;
    }
{{< /file >}}

    {{< file "/etc/nginx/conf.d/example2.com.conf" nginx >}}
server {
    listen              203.0.113.65:443 ssl;
    listen              [2001:DB8::8]:443 ssl;
    server_name         example2.com www.example2.com;
    root                /var/www/example2.com;

    ssl_certificate     /root/certs/example2.com/example.com.crt;
    ssl_certificate_key /root/certs/example2.com/example.com.key;
    }
{{< /file >}}

4.  Reload your configuration:

        nginx -s reload

5.  Both sites should be accessible over HTTPS, but using your browser to inspect the certificates will show that site `example1.com` is using `example1.com.crt`, and `example2.com` is using `example2.com.crt`.

## Part 4: TLS Best Practices For NGINX

Now that you've got NGINX serving your site over HTTPS, do not simply use the above configurations as-is. It only gets HTTPS working on your server and is inherently insecure without further configuration.

To harden your server's handling of TLS connections, continue to Part 4 of this series: [TLS Deployment Best Practices for NGINX](/docs/guides/getting-started-with-nginx-part-4-tls-deployment-best-practices/).

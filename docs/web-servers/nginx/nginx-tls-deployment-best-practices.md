---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide details best practices for deploying TLS in conjunction with NGINX.'
keywords: ["ssl", "tls", "nginx", "https", "certificate"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nginx/nginx-ssl-and-tls-deployment-best-practices/','web-servers/nginx/nginx-ssl-and-tls-deployment-best-practices/']
published: 2018-01-09
modified: 2017-12-27
modified_by:
  name: Linode
title: 'Getting Started with NGINX - Part 4: TLS Deployment Best Practices'
contributor:
  name: Ryan Laverdiere
  link: https://github.com/capecodrailfan
---

The best way to ensure any server remains secure is to configure it properly and follow best security practices at all times. This guide intends to be one of several steps toward creating the most secure NGINX environment possible, but is by no means a complete guide to securing NGINX or your Linode.


## Before you Begin

- This guide is Part 4 of our Getting Started with NGINX series and you will need a working NGINX setup with at least one `server { }` block in an HTTPS configuration. If do not have that, then complete at least [Part 1: Basic Installation and Setup](web-servers/nginx/nginx-basic-installation-and-setup) and [Part 3: Enable TLS for HTTPS Connections](/docs/web-servers/nginx/nginx-enable-tls-for-https-connections/) before going further.

- You will need root access to the system, or a user account with `sudo` privileges.

- Most options and directives in this guide can be added either to NGINX's `http { }` block, or individual site/virtual hosts' `server { }` block(s). **Anything in the `http { }` block will be applied to all sites hosted on the server.** If you're only hosting one website, or if you want your sites to have the same NGINX parameters, then keeping everything in the `http { }` block is fine.

- You may want to make another backup of your `nginx.conf` and site configuration file(s) so you have a snapshot of the work you've done up to this point. The commands below are intended as quick examples. By now you've likely put a significant amount of work into this setup, so you should think of a more resilient backup scheme to preserve your site data.

        cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup-pt4
        cp -r /etc/nginx/conf.d/ /etc/nginx/conf.d-backup-pt4

- To enable any configuration change you make, you need to run as root: `nginx -s reload`.


## Redirect Incoming HTTP Traffic HTTPS

Google is now ranking websites that accept encrypted HTTPS connections higher in search results, so redirecting HTTP requests to HTTPS is one possible way to increase your page rank.

1.  Assuming you already have a working HTTPS connection from part 3 of this series with a site configuration file similar to the second `server { }` block below, add the HTTP `server { }` block above it as shown.

    The `return 301` directives will be what handles the redirects. Whether to include directives for both `example.com` or `www.example.com`, depends on which domain your TLS certificate was issued for, if not both.

    {{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen              80;
    server_name         example.com www.example.com;
    return 301 https://example.com$request_uri; 
    return 301 https://www.example.com$request_uri;
    }

server {
    listen              203.0.113.4:443 ssl default_server;
    listen              [2001:DB8:32]:443 ssl default_server ;
    server_name         example.com www.example.com;
    root                /var/www/example.com/public_html;
    }
{{< /file-excerpt >}}

    {{< note >}}
Why use `return 301` instead of `rewrite`? The [NGINX docs](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#taxing-rewrites) prefer it.
{{< /note >}}

2.  Reload NGINX:

        nginx -s reload

3.  Go to your site's domain or IP address in a web browser, specifying `http://`. You should be redirected to HTTPS.


## HTTP Strict Transport Security (HSTS)

[HSTS](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security_Cheat_Sheet) is used to force browsers to only connect using HTTPS. This means your site will no longer be accessible over HTTP. When HSTS is enabled and a valid HSTS header is stored in a users browser cache, the user will be unable to access your site if presented with a self-signed or expired certificate, or a certificate issued by an untrusted authority. The user will also be unable to bypass any certificate warnings unless your HSTS header expires or their browser cache is cleared.

For more information on HSTS in NGINX, [see NGINX's blog](https://www.nginx.com/blog/http-strict-transport-security-hsts-and-nginx/).

1.  Add the HSTS header directive to the `http { }` block of `/etc/nginx/nginx.conf`. If you choose to put it elsewhere, remember that **HTTP response header fields are [not inherited](/docs/web-servers/nginx/nginx-advanced-configurations/#http-response-header-fields) from parent blocks.**

        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

2.  Reload NGINX:

        nginx -s reload

3.  Test that HSTS is working:

        root@localhost:~# curl -s -D- https://example.com | grep Strict
        ***


## Create a Larger Diffie-Hellman Prime

A Diffie-Hellman parameter is a set of randomly generated data used when establishing Perfect Forward Secrecy for an HTTPS connection. The default size is usually 1024 or 2048 bits, depending on the server's OpenSSL version, but a 4096 bit key will provide greater security.

1.  Change directories to where you maintain your site's TLS certificates from. We're maintaining the server's certificates out of `/root/certs`, so we'll continue with that here.

        cd /root/certs

2.  Create a 4096 bit Diffie-Hellman prime. Depending on the size of your Linode, this could take approximately 10 minutes to complete.

        openssl genpkey -genparam -algorithm DH -out /root/certs/dhparam4096.pem -pkeyopt dh_paramgen_prime_len:4096

    {{< note >}}
According to the [OpenSSL manual](https://wiki.openssl.org/index.php/Manual:Openssl(1)#STANDARD_COMMANDS), `genpkey -genparam` supersedes `dhparam`.
{{< /note >}}

3.  Add the new DH prime to the `http { }` block of `/etc/nginx/nginx.conf`:

        ssl_dhparam /root/certs/dhparam4096.pem;


## Enforce Server-Side Cipher Suite Preferences

This tells NGINX to use its TLS cipher suite choices over those of a connecting browser, provided the browser supports those cipher suites. If you have selected a good cipher suite combination with the `ssl_ciphers` directive, you are increasing the connection's security because NGINX is telling the browser it only wants to communicate through strong cipher and hashing algorithms.

Add the `ssl_prefer_server_ciphers` directive to the `http { }` block of `/etc/nginx/nginx.conf`:

    ssl_prefer_server_ciphers on;


## Enable HTTP/2 Support

[HTTP/2](https://http2.github.io/) is the successor to the HTTP/1.1 standard which, among other benefits, reduces page load times and bandwidth used. While the HTTP/2 specification applies to both HTTP and HTTP traffic, web browsers currently [do not support](https://http2.github.io/faq/#does-http2-require-encryption) unencrypted HTTP/2, so it can only be used with TLS.

The [Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation) (ALPN) standard used with HTTP/2 requires OpenSSL 1.0.2+, so if you intend to enable HTTP/2 on a Linux distribution which uses a prior version of OpenSSL, you will first need to compile and install OpenSSL 1.0.2 or later. Second, you will then need to compile NGINX with that version of OpenSSL.

To check your distribution's version of OpenSSL:

    root@localhost:~# openssl version
    OpenSSL 1.0.2g  1 Mar 2016

1.  Add the `http2` option to the `listen` directive in your site configuration's `server { }` block for both IPv4 and IPv6. It should look like below:

        listen    203.0.113.5:443 ssl http2;
        listen    [2001:DB8:32]:443 ssl http2;

2.  Reload NGINX:

        nginx -s reload

3.  Verify HTTP/2 is enabled with the [KeyCDN HTTP/2 Test](https://tools.keycdn.com/http2-test). The result should tell you that your site supports HTTP/2.

    ![HTTP2 Report](/docs/assets/keycdn-http2-test.jpg)


## OCSP Stapling

When enabled, NGINX will make [OCSP](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol) requests on behalf of connecting browsers. The response received from the OCSP server is added to NGINX's browser response. This eliminates the need for browsers to verify a certificate's revocation status by connecting directly to an OCSP server.

{{< note >}}
If you need to combine your CA's root and intermediate certificates, do that with: `cat example.com.crt ca-root.crt intermediate.crt > ocsp-combined.crt`.
{{< /note >}}

Add the following directives to your `nginx.conf` file, or to the `server { }` block of your HTTPS site. Point NGINX to your site's certificate and any intermediate certificates used. If using a self-signed certificate, then you simply use that `.crt` or `.pem` file. If you have been following this series, you'll know that we're storing our certificates in `/root/certs/`.

    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /root/certs/example1/cert.crt;


## Further Reading and Examples

Above is just a small amount of ways you can harden connections made to NGINX from client devices, but they are some of the most significant. Here are external sites 

While you should consider them recommended reading, Linode does not guarantee their accuracy over time.

-  NGINX Docs, [SSL module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html)

-  NGINX Docs, [HTTPS configurations](https://nginx.org/en/docs/http/configuring_https_servers.html)

-  Strong SSL Security on nginx, [raymii.org](https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html)


## Verify Full Configuration

1.  Reload your NGINX configuration so you're sure that the server is using all the directives you specified above:

        nginx -s reload

2.  The Qualys [SSL Server Test](https://www.ssllabs.com/ssltest/) is one of the most comprehensive SSL/TLS connection tests available. Enter your domain in the form field and run the test.

Analyze the results carefully, and compare the NGINX options you changed in this guide with the test results. Is everything showing as enabled or otherwise working properly? If not, check through your configuration again. Note that the Qualys test doesn't work with self-signed certificates.

List results***


## Next Steps
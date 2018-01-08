---
author:
  name: Linode
  email: docs@linode.com
description: 'Install a TLS certificate into NGINX for HTTPS access.'
keywords: ["ssl", "tls", "nginx", "https", "certificate"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/configuration/ssl/','security/ssl/ssl-certificates-with-nginx/index.cfm/','websites/ssl/ssl-certificates-with-nginx.cfm/','security/ssl/ssl-certificates-with-nginx/','security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificates-on-nginx/index.cfm/','security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificated-on-nginx/','security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx/']
modified: 2017-12-22
modified_by:
  name: Linode
published: 2010-11-08
title: 'Getting Started with NGINX - Part 3: Enable TLS for HTTPS Connections'
---

![HTTPS Configuration on NGINX](/docs/assets/nginx-ssl/Enable_SSL_nginx.jpg)

Transport Layer Security (TLS) is the successor to Secure Socket Layer (SSL), and provides stronger HTTPS access to web servers from browsers and other utilities. This guide outlines several scenarios for how to add an SSL/TLS certificate to your site's NGINX configuration.

## Before You Begin

- You will need a working NGINX configuration. See ***

- If you compiled NGINX from source code, ensure that it was compiled with `--with-http_ssl_module`. To see the current NGINX version and compiled options of your installation, run the command `nginx -V`.

- You will need a TLS certificate and key for your site. The certificate can be self-signed if this is a private or internal site, or you can use a commercial certificate chain if that's what your site calls for. If you don't already have one of these, see our guides for creating a [self-signed certificate](/docs/security/ssl/create-a-self-signed-tls-certificate) or a [certificate signing request](/docs/security/ssl/obtain-a-commercially-signed-tls-certificate).

## Configure a Single Virtual Host

A virtual host basically equates to a website in NGINX speak. A single NGINX installation can host one virtual server, or many, and any number of them can use the same TLS certificate and key, or a cert/key pair exclusively their own.

The TLS certificate is sent to each device that connects to the server, so it's not a private file. The key, however, is. We'll store them in a folder in the root user's home directory. You can point NGINX to your site's TLS certificate and key in `/etc/nginx/nginx.conf`.

There is no official or ideal place to store the certificate and key so while you can generally keep them wherever you want on the server, you want them to remain untouched by system updates, other administrators and such things. You also will want to back up these files.

1.  Make the storage folder:

        mkdir /root/certs

2.  Move your certificate(s) and key(s) into that folder.

3.  Restrict permissions on the key file:

        chmod 400 /root/certs/example.com.key

4.  Add/edit the appropriate lines of your `nginx.conf`. The NGINX root directory where it will look for your website's content will be `/usr/share/nginx/`, but older versions used `/var/www/html`.

    Whether to include directives for both `example.com` or `www.example.com`, depends on which domain your TLS certificate was issued for, if not both.

    {{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}

worker_processes auto;

http {
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_certificate     /root/certs/example.com.crt;
    ssl_certificate_key /root/certs/example.com.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    keepalive_timeout   70;

    server {
        listen              443 ssl;
        server_name         example.com www.example.com;
        }
}
{{< /file-excerpt >}}

5.  Reload your configuration:

        nginx -s reload

6.  Now go to your Linode's IP address or your site's domain in a browser with an `https://` at the front of the URL. Your site should load over HTTPS, or in the case of a self-signed certificate, your browser will warn of an insecure connection.

See the NGINX docs for more information on the [SSL module](https://nginx.org/en/docs/http/ngx_http_ssl_module.html) and [HTTPS configurations](https://nginx.org/en/docs/http/configuring_https_servers.html).


## Configure Multiple Sites with a Single Certificate

If you have a certificate that is valid for multiple host names, such as a wild card certificate or a certificate using *SubjectAltName*, you'll need two separate `server { }` blocks in your `nginx.conf` file, one per site IP address. The directives for the `http { }` block from above stay the same, and note how each site's IP is joined with the port number in the `listen` line.

{{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}

    server {
        listen              203.0.113.5:443 ssl;
        server_name         example.com www.example.com;
        root /var/www/example.com/public_html;
        }

    server {
        listen              203.0.113.6:443 ssl;
        server_name         subdomain.example.com;
        root /var/www/subdomain.example.com/public_html;
        }
{{< /file-excerpt >}}

In this example, the domains `example.com`, `www.example.com`, and `subdomain.example.com` are all served using the `/srv/ssl/example.com.crt` certificate. If you instead have two completely independent websites with independent domains, then just fill out the directives accordingly.

Reload your configuration after editing `nginx.conf`:

        nginx -s reload

## Redirect Incoming HTTP Traffic HTTPS

If your site is set up for HTTPS, you will likely also want to capture HTTP traffic to your domain and redirect it to HTTPS. To do this, you need two `server { }` blocks in your `nginx.conf` file: one as configured earlier to listen on port 443, and a second to listen on port 80.

1.  Add the following server block to your NGINX configuration file. This must exist inside the `http { }` block.

{{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}
server {
        listen              80;
        server_name         example.com www.example.com;
        return 301 https://example.com$request_uri;
        return 301 https://www.example.com$request_uri;
        }
}
{{< /file-excerpt >}}

2.  Reload your configuration:

        nginx -s reload


Below is an example of a full `nginx.conf` file which redirects HTTP to HTTPS and has gzip enabled:

{{< file "/etc/nginx/nginx.conf" nginx >}}

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_certificate     /root/certs/example.com.crt;
    ssl_certificate_key /root/certs/example.com.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  70;

    gzip  on;

    include /etc/nginx/conf.d/*.conf;

    server {
        listen              80;
        server_name         example.com www.example.com;
        return 301 https://example.com$request_uri;
        return 301 https://www.example.com$request_uri;
 }

    server {
        listen              443 ssl;
        server_name         example.com www.example.com;
        index index.php index.htm index.html;
        root /var/www/example.com/public_html;
        }
}
{{< /file >}}


## Best Practices

Now that you've got NGINX serving your site over HTTPS, you'll want to see our [NGINX TLS Deployment Best Practices](/docs/web-servers/nginx/nginx-tls-deployment-best-practices/) guide to further tune your server.
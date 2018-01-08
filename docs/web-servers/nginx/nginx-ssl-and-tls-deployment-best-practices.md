---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide details best practices for deploying TLS in conjunction with NGINX.'
keywords: ["nginx", "ssl", "tls"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nginx/nginx-ssl-and-tls-deployment-best-practices/','web-servers/nginx/nginx-ssl-and-tls-deployment-best-practices/']
published: 2016-08-18
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

- You will need root access to the system, or a user account with `sudo` privileges.

- You will need a working NGINX server with at least one `server { }` block in an HTTPS configuration. If you do not already have this, then see [our guide](/docs/web-servers/nginx/enable-ssl-for-https-configuration-on-nginx) on setting up NGINX with a SSL/TLS certificate before going further.

- Most options and directives in this guide can be added either to NGINX's `http { }` block, or individual site/virtual hosts' `server { }` block(s). Anything in the `http { }` block will be applied to all sites hosted on the server. If you're only hosting one website, or if you want your sites to have the same NGINX parameters, then keeping everything in the `http { }` block is fine.

    If you have multiple sites/virtual hosts you intend to have different settings for (for example: one served over HTTPS, another over HTTP), then you will want to put the options and directives below into the appropriate site's `server { }` block, not in the `http { }` block. Unless where specifically noted, the instructions below are given without defining which of those two areas of the configuration file to put them. This is because whether you add it to the `http { }` or `server { }` block is unique to your use case.

- Create a backup of your configuration file. Depending on how you installed NGINX and what version it is, your config file could be located at `/etc/nginx/sites-enabled/default`, `/etc/nginx/conf.d/example_ssl.conf`, or included in `/etc/nginx/nginx.conf`. For this guide, `/etc/nginx/niginx.conf` will be used.

        mv etc/nginx/nginx.conf etc/nginx/nginx.conf.bak

## Enable HTTP/2 Support

[HTTP/2](https://http2.github.io/) is a new version of the HTTP standard replacing HTTP/1.1 to reduce page load time and requires less bandwidth. The [Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation) (ALPN) standard used with HTTP/2 requires OpenSSL 1.0.2+. If you intend to enable HTTP/2 on a Linux distribution which uses an older version of OpenSSL, you will need to compile and install OpenSSL 1.0.2 or later, and then compile NGINX to use that version of OpenSSL.

1.  To enable HTTP/2, find the `listen    443 ssl;` line in the `server { }` block (or server blocks if you're serving multiple sites) of your virtual host configuration file. Remember, depending on how you installed NGINX, this could be located at `/etc/nginx/sites-enabled/default`, `/etc/nginx/conf.d/example_ssl.conf`, or included in `/etc/nginx/nginx.conf`.

2.  Add `http2` to the end of the line so it looks like below:

        listen    443 ssl http2;

3.  Reload NGINX:

        nginx -s reload

4.  Go to the [KeyCDN HTTP/2 Test](https://tools.keycdn.com/http2-test) in a web browser. This free tool will check your server and let you know if HTTP/2 and ALPN are enabled and functioning correctly.

Enter your site's domain in the text box and click *Test*. Uncheck the *Public* checkbox if you do not want your results displayed publicly. If HTTP/2 is functioning properly, your report should look like this:

    ![HTTP2 Report](/docs/assets/HTTP2_Report.jpg)

## Redirect HTTP Traffic to HTTPS

Google is now ranking websites that accept encrypted HTTPS connections higher in search results, so redirecting HTTP requests to HTTPS is one possible way to increase your page rank. Before following these steps, however, be sure to research compatibility issues that may arise with older browsers.


1.  Add the following to your configuration's `server { }` block, and be sure to replace `example.com` with your site's domain. Whether to include directives for both `example.com` or `www.example.com`, depends on which domain your TLS certificate was issued for, if not both.

    {{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}
server {
        listen              80;
        server_name         example.com www.example.com;
        return 301 https://example.com$request_uri; 
        return 301 https://www.example.com$request_uri;
        }
}
{{< /file-excerpt >}}

    {{< note >}}
Why use `return 301` instead of `rewrite`? The [NGINX docs](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#taxing-rewrites) prefer it.
{{< /note >}}

2.  Reload NGINX:

        nginx -s reload

3.  Go to your site's domain or IP address in a web browser, specifying `http://`. You should be redirected to HTTPS.

## OCSP Stapling

The *Online Certificate Status Protocol* (OCSP) was created to speed up the process that operating systems and browsers use to check for SSL/TLS certificate revocation. Prior to OCSP, your operating system or browser would download a *certificate revocation list* (CRL). CRLs have grown so large that browser vendors are now creating their own CRLs and distributing them to users.

The problem with OCSP is that a certificate authority can now track users as they move from website to website with certificates provided by the same vendor or certificate authority. To prevent this, you can enable OCSP stapling.

When OCSP stapling is enabled, NGINX will make an OCSP request for the client. The response received from the OCSP server is added to NGINX's response to the user's browser. This eliminates the need for the user's browser to connect to an OCSP server to check the revocation status of your site's certificate.

To enable OCSP stapling, you must point NGINX to your certificate authority's TLS certificate, and any intermediate certificates used. If using a self-signed certificate, then you simply use that `.crt` file.

1.  If you need to combine your CA's root and intermediate certificates, here is how to do that. You can add additional certificates to the command if you have others to incorporate.

        cat example.com.crt ca-root.crt intermediate.crt > ocsp-combined.crt

2.  Add the following to your `nginx.conf` or virtual host configuration file, depending on how you installed NGINX. Whether you have the `ssl_*` directives in the `http { }` or `server { }` block will depend on your needs. The `ssl_trusted_certificate` is either the combined file you made in the previous step, your CA's root certificate, or your self-signed cert.

        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /path/to/cert.crt;

2.  Reload NGINX:

        nginx -s reload

3.  Go to the Qualys [SSL Server Test](https://www.ssllabs.com/ssltest/) in a web browser. Enter your site's domain and click *Submit*. Check the *Do not show the results on the boards* checkbox if you do not want your results displayed publicly.

    Once the test is complete, scroll down to the *Protocol Details* section. Look for the *OCSP stapling* line. This test will return *Yes* if NGINX is configured correctly.

    ![SSL Server Test OCSP](/docs/assets/OCSP_Stapling_SSL_Test.jpg)

## HTTP Strict Transport Security (HSTS)

[HSTS](https://www.owasp.org/index.php/HTTP_Strict_Transport_Security_Cheat_Sheet) is used to force browsers to only connect using HTTPS. This means your site will no longer be accessible over HTTP. When HSTS is enabled and a valid HSTS header is stored in a users browser cache, the user will be unable to access your site if presented with a self-signed or expired certificate, or a certificate issued by an untrusted authority. The user will also be unable to bypass any certificate warnings unless your HSTS header expires or their browser cache is cleared.

With all traffic being redirected from HTTP to HTTPS, you may want to allow users to only connect using HTTPS. Before enabling HSTS, be sure that you understand the potential impact on compatibility with older browsers. Thus,dDo not follow these steps if you want users to be able to access your site over HTTP!

1.  Add the following to your `nginx.conf` or virtual host configuration file, depending on how you installed NGINX. The `ssl_trusted_certificate` is either the combined file you made in the previous step, your CA's root certificate, or your self-signed cert.

        add_header Strict-Transport-Security "max-age=31536000; includeSubdomains; always";

    The `max-age` attribute sets the expiration date for this header in seconds. In the above configuration, the header will expire after 1 year. You can configure this to be longer or shorter if you choose, but a period of less than 180 days is considered too short for the Qualys test. The `includeSubdomains` argument enforces HSTS on all subdomains.

2.  Reload NGINX:

        nginx -s reload

3.  If you ran a Qualys test as explained above, clear your browser cache.

4.  Go to the Qualys [SSL Server Test](https://www.ssllabs.com/ssltest/) again and test your site's domain.

    Once the test is complete, scroll down to the *Protocol Details* section. Look for the *Strict Transport Security (HSTS)* line. This test will return *Yes* if NGINX is configured correctly.

    ![SSL Server Test HSTS](/docs/assets/HSTS_SSL_Test.jpg)

## Strengthen the Diffie-Hellman Key Exchange

A Diffie-Hellman parameter is a set of randomly generated data used when establishing Perfect Forward Secrecy for an HTTPS connection. The default size is 2048 bits at most, depending on the server's OpenSSL version, but a 4096 bit key will provide greater security.

1.  Change directories to where you maintain your site's TLS certificates from. Some people do this right from `/etc/ssl/certs`, but that mixes your site's stuff with certificates provided by the system's `ca-certificates` package. In our guides for creating a [self-signed](/docs/security/ssl/create-a-self-signed-certificate) and [certificate signing request](/docs/security/ssl/obtain-a-commercially-signed-tls-certificate), we maintain the server's certificates out of `/root/certs`, so we'll continue with that here.

        cd /root/certs

2.  Create a 4096 bit Diffie-Hellman prime. Depending on the size of your Linode, this could take approximately 10 minutes to complete.

        openssl genpkey -genparam -algorithm DH -out /root/certs/dhparam4096.pem -pkeyopt dh_paramgen_prime_len:4096

    {{< note >}}
According to the [OpenSSL manual](https://wiki.openssl.org/index.php/Manual:Openssl(1)#STANDARD_COMMANDS), `genpkey -genparam` supersedes `dhparam`.
{{< /note >}}

3.  Add the new DH prime to your configuration. Remember to adjust the path as per step 1 above.

        ssl_dhparam /root/certs/dhparam4096.pem;

4.  Reload NGINX:

        nginx -s reload

## Example Configurations

These examples are not meant to be used for production sites. They are only meant to show examples of how the `server { }` block or blocks can be used inside the `http { }` block.

**Example 1**

This configuration below has all SSL/TLS directives in the `http { }` header. It implements all of the directives from above, and from our guide for [setting up SSL/TLS on NGINX](/docs/web-servers/nginx/enable-ssl-for-https-configuration-on-nginx), and applies them to all `server { }` blocks nested inside the `http { }` block.

Connections to `example.com` or `www.example.com` over port 80 are redirected to 443, though NGINX is listening for incoming connections for those domains directly to port 443 too. HTTPS is limited to taking place over TLS 1.2 using cipher suites which take advantage of [authenticated encryption](https://en.wikipedia.org/wiki/Authenticated_encryption). This is a setup with high connection security but could cause problems with older browsers.

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
    ssl_protocols       TLSv1.2;
    ssl_ciphers  "AEAD";
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/cert.crt;
    ssl_dhparam /root/certs/dhparam4096.pem;

    server_tokens       off;
    add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;

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
        listen              443 ssl http2;
        server_name         example.com www.example.com;
        root                /var/www/example.com/public_html;
        index               index.php index.htm index.html;
        }
}
{{< /file >}}

**Example 2**

The configuration below is for two independent websites. Each site has its own `server { }` block within the `http { }` block which names its specific IP address, and each site also has its own directory on the NGINX server where its files are served from.

One site is accessible over plain HTTP as `example.com` or `www.example.com`, and the second site is accessible only by HTTPS as `example.com`. The HTTPS connection uses the tweaks above, with exception of redirecting from port 80, since that is an independent site. The HTTPS connection security is good, but must not as strong as in the previous example. This does allow for better compatibility with older browsers.

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

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    server_tokens       off;

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
        listen              203.0.113.10:80;
        server_name         example1.com www.example1.com;
        root                /var/www/example.com/public_html;
        index               index.html;
        }

    server {
        listen              198.51.100.4:443 ssl http2;
        server_name         example2.com;
        root                /var/www/example2.com/public_html;
        index               index.php;

        ssl_session_cache   shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_certificate     /root/certs/example2.com.crt;
        ssl_certificate_key /root/certs/example2.com.key;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /path/to/cert.crt;
        ssl_dhparam /root/certs/dhparam4096.pem;
        add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";
        }
}
{{< /file >}}

## Test Your Configuration

When you've finished configuring NGINX, test your configuration with the Qualys [SSL Server Test](https://www.ssllabs.com/ssltest/) one last time to ensure it's working as intended. The steps in this guide should earn you an A+. If you are getting a lesser rating, check your configuration for errors and that the site is returning a 200 HTTP response code, as that may also affect your rating. This information can be found in the *Miscellaneous* section at the bottom of your SSL Server Test report.

The best way to ensure security is by following best practices at all times, not simply relying on your configuration, so be sure to monitor for updates and apply them to your server as needed.

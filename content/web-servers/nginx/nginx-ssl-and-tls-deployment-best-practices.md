---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide details best practices for deploying SSL and TLS in conjunction with nginx.'
keywords: ["nginx", "ssl", "tls"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nginx/nginx-ssl-and-tls-deployment-best-practices/']
published: 2016-08-18
modified: 2016-08-18
modified_by:
  name: Linode
title: 'Nginx SSL and TLS Deployment Best Practices'
contributor:
  name: Ryan Laverdiere
  link: https://github.com/capecodrailfan
external_resources:
- '[Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/)'
- '[KeyCDN HTTP/2 Test](https://tools.keycdn.com/http2-test)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*
<hr>

This guide is intended to inform you of some additional configuration options that nginx uses when serving HTTPS. While these features help optimize nginx for SSL and TLS, this is by no means a complete guide to securing nginx or your Linode. The best way to ensure your server remains secure is to not only configure it properly, but to follow best security practices at all times. This guide is intended to be one of many steps toward creating the most secure environment possible.

## Before you Begin

1.  This guide is a continuation of our tutorial on how to [install nginx and a StartSSL certificate on Debian 8 (Jessie)](/docs/websites/nginx/install-nginx-and-a-startssl-certificate-on-debian-8-jessie). The principles here can be adapted to an SSL/TLS deployment on any system, but at a minimum, you will need a Linode with the latest stable version of nginx and an SSL certificate installed.

2.  Update your system:

        apt-get update && apt-get upgrade

{{< note >}}
The commands in this guide are written for a root user. If you're following along as a non-root user, commands that require elevated privileges should prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

For more information, please review our guides on [basic nginx configuration](/docs/websites/nginx/how-to-configure-nginx), [Linux security basics](/docs/security/linux-security-basics) and [securing your server](/docs/security/securing-your-server).

## Disable nginx Server Tokens

By default, nginx will share its version number with anyone who connects to your server. For example, if a directory is not found, nginx will return a 404 error that includes its version number. Disabling server tokens makes it more difficult to determine the version of nginx running on your Linode, and therefore more difficult to implement version-specific exploits.

[![404 With nginx Version Number](/docs/assets/404_Not_Found.jpg)](/docs/assets/404_Not_Found.jpg)

1.  To disable `server_tokens`, open your `/etc/nginx/nginx.conf` file. Inside of the `http` block, append or uncomment the following line:

    {{< file-excerpt "/etc/nginx/nginx.conf" >}}
server_tokens       off;

{{< /file-excerpt >}}


2.  Save your changes and restart nginx.

        systemctl restart nginx

After restarting, direct your web browser to a directory of your server that does not exist, and nginx will no longer share its version number.

[![404 With Server Tokens Disabled](/docs/assets/404_Not_Found_Server_Tokens_Off.jpg)](/docs/assets/404_Not_Found_Server_Tokens_Off.jpg)

## Enable HTTP/2 Support

In September 2010, Google released the SPDY protocol for all versions of Chrome 6. SPDY is currently being phased out in favor of HTTP/2. Support for SPDY in Chrome was removed in May 2016. SPDY is supported only in nginx 1.8.x or older, whereas versions beginning with 1.9.5 are beginning to support HTTP/2. To check your nginx version:

    nginx -v

{{< note >}}
If you installed nginx from source without modifying your environment variables, invoke the full path to the binary:

/opt/nginx/sbin/nginx -v
{{< /note >}}

HTTP/2 is a new version of the HTTP standard replacing HTTP/1.1 to reduce page load time. Traditionally, when a user accessed a web page, a separate HTTP connection was established to load each resource (e.g. HTML, CSS, JavaScript, or images). HTTP/2 allows concurrent requests on a single connection to download assests in parallel. The server also compresses assets before sending them to the client, which requires less bandwdith.

{{< note >}}
Chrome has deprecated Next Protocol Negotiation (NPN) and now requires Application-Layer Protocol Negotiation (ALPN) for HTTP/2 compatibility. However, ALPN requires OpenSSL 1.0.2+. Many distributions, such as Debian 8 (Jessie) do not include this package in their repositories. If you intend to enable HTTP/2, you will need to use a version of nginx compiled with OpenSSL 1.0.2+. See our instructions on [compiling nginx from source](/docs/web-servers/nginx/install-nginx-and-a-startssl-certificate-on-debian-8-jessie/#install-and-compile-nginx-from-source) for more information.
{{< /note >}}

1.  To enable HTTP/2, open your nginx SSL virtual host configuration file. Depending on how you installed nginx, this could be located at `/etc/nginx/sites-enabled/default` or at `/etc/nginx/conf.d/example_ssl.conf`. Look for the `listen` line within the "SSL Configuration" section. Uncomment the following line if necessary and add `http2` to the end before the semicolon.

    {{< file-excerpt "/etc/nginx/conf.d/example_ssl.conf" aconf >}}
listen       443 ssl http2;

{{< /file-excerpt >}}


2.  Save your changes and restart nginx.

        systemctl restart nginx

3.  Open a web browser and navigate to [the KeyCDN HTTP/2 Test](https://tools.keycdn.com/http2-test), enter your Linode's domain name or hostname in the text box and click "Test." Optionally, uncheck the Public checkbox if you do not want your results displayed publicly. This free tool will check your server and let you know if HTTP/2 and ALPN are enabled and functioning correctly.

    If HTTP/2 is functioning properly, your report should look like this:

    [![HTTP/2 Report](/docs/assets/HTTP2_Report.jpg)](/docs/assets/HTTP2_Report.jpg)

## Redirect HTTP Traffic to HTTPS

Google is now ranking websites that accept encrypted HTTPS connections higher in search results, so redirecting HTTP requests to HTTPS is one possible way to increase your page rank. Before following these steps, however, be sure to research compatibility issues that may arise with older browsers.

1.  Open your HTTP nginx virtual host configuration file, which can be located at `/etc/nginx/conf.d/default.conf`, `/etc/nginx/nginx.conf` or `/etc/nginx/sites-enabled/default` depending on how you installed nginx. Change `example.com` to match your Linode's domain name or hostname:

    {{< file-excerpt "/etc/nginx/conf.d/default.conf" aconf >}}
server_name example.com

{{< /file-excerpt >}}


2.  Append the following line below the `server_name` line.

    {{< file-excerpt "/etc/nginx/conf.d/default.conf" aconf >}}
rewrite        ^ https://$server_name$request_uri? permanent;

{{< /file-excerpt >}}


3.  Comment out (place `#` in front of) all other lines so your configuration looks like this:

    {{< file-excerpt "/etc/nginx/conf.d/default.conf" aconf >}}
server {
    listen       80;
    server_name  example.com;
    rewrite      ^ https://$server_name$request_uri? permanent;
}

{{< /file-excerpt >}}


4. Save your changes and restart nginx.

        systemctl restart nginx

5.  Navigate to your Linode's domain name in your browser, specifying `http://`. You should now be redirected to HTTPS.

## OCSP Stapling

The *Online Certificate Status Protocol* (OCSP) was created to speed up the process that operating systems and browsers use to check for certificate revocation. For instance, when you use Internet Explorer or Google Chrome on a Windows machine, Windows is configured by default to check for certificate revocation. Prior to OCSP, your operating system or browser would download a *certificate revocation list* (CRL). CRLs have grown so large that browser vendors are now creating their own CRLs and distributing them to users.

The problem with OCSP is that a certificate authority can now track users as they move from website to website with certificates provided by the same vendor or certificate authority. To prevent this, you can enable OCSP stapling.

When OCSP stapling is enabled, nginx on your Linode will make an OCSP request for the client. The response recieved from the OCSP server is added to nginx's reponse to the user. This eliminates the need for the user to connect to an OCSP server to check the revocation status of your server certificate.

Before enabling OCSP stapling you will need to have a file on your system that stores the CA certificates used to sign the server certificate. This section assumes that you have followed our guide on [how to install nginx and a StartSSL certificate](/docs/websites/nginx/install-nginx-and-a-startssl-certificate-on-debian-8-jessie). If you have not, complete Steps 1-3 in the [Gather Additional Required Certificate Files](/docs/web-servers/nginx/install-nginx-and-a-startssl-certificate-on-debian-8-jessie/#gather-additional-required-certificate-files) section of that guide before proceeding here.

1.  Open your HTTPS nginx virtual host configuration file, which can be located at `/etc/nginx/conf.d/example_ssl.conf` or `/etc/nginx/sites-enabled/default` depending on how you installed and configured nginx. Add the following lines inside the `server` block:

    {{< file-excerpt "/etc/nginx/conf.d/example_ssl.conf" aconf >}}
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/ssl/nginx/ca.pem;

{{< /file-excerpt >}}


2.  Save your changes and restart nginx.

        systemctl restart nginx

3.  In a web browser, navigate to the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). Enter the domain name or hostname of your Linode and click "Submit". Optionally, you may uncheck the checkbox to prevent your test from being shown publicly.

    Once the test is complete, scroll down to the "Protocol Details" section. Look for the "OCSP stapling" line. If nginx is configured correctly, this test will return "Yes."

    [![SSL Server Test OCSP](/docs/assets/OCSP_Stapling_SSL_Test.jpg)](/docs/assets/OCSP_Stapling_SSL_Test.jpg)

## HTTP Strict Transport Security (HSTS)

Google Chrome, Mozilla Firefox, Opera, and Safari currently honor HSTS headers. HSTS is used to force browsers to only connect using secure encrypted connections. This means your site will no longer be accessible over HTTP. When HSTS is enabled and a valid HSTS header is stored in a users browser cache, the user will be unable to access your site if presented with a self-signed, expired, or SSL certificate issued by an untrusted certificate authority. The user will also be unable to bypass any certificate warnings unless your HSTS header expires or the browser cache is cleared.

With all traffic being redirected from HTTP to HTTPS, you may want to allow users to only connect using HTTPS. Before enabling HSTS, be sure that you understand the potential impact on compatibility with older browsers.

**Do not follow these steps if you want users to be able to access your site over HTTP!**

1.  Open up your nginx HTTPS virtual host configuration file. This may be located at `/etc/nginx/sites-enabled/default` or at `/etc/nginx/conf.d/example_ssl.conf`. Append the following line inside your `server` block:

    {{< file-excerpt "/etc/nginx/conf.d/example_ssl.conf" aconf >}}
add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";

{{< /file-excerpt >}}


    The `max-age` attribute sets the expiration date for this header in seconds; in the above configuration, the header will expire after 1 year. You can configure this to be longer or shorter if you choose, but a period of less than 180 days is considered too short for the Qualys test. The `includeSubdomains` argument enforces HSTS on all subdomains.

2.  Save your changes and restart nginx.

        systemctl restart nginx

3.  Navigate to the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). Enter the domain name or hostname of your Linode and click "Submit." Optionally, you may uncheck the checkbox to not show your results on the boards.

    {{< note >}}
If you've already conducted a test from one of the above sections, use the **Clear cache** link to initiate a new scan.
{{< /note >}}

    Once the test is complete, scroll down to the "Protocol Details" section. Look for the "Strict Transport Security (HSTS)" line. If nginx is configured correctly this test will return "Yes."

    [![SSL Server Test HSTS](/docs/assets/HSTS_SSL_Test.jpg)](/docs/assets/HSTS_SSL_Test.jpg)

## Disable Content Sniffing

Content sniffing allows browsers to inspect a byte stream in order to "guess" the file format of its contents. It is generally used to help sites that do not correctly identify the MIME type of their web content, but it also presents a vulnerability to cross-site scripting and other attacks. To disable content sniffing, add the following line to your nginx SSL configuration file in the `server` block:

{{< file "/etc/nginx/conf.d/example_ssl.conf" aconf >}}
add_header X-Content-Type-Options nosniff;

{{< /file >}}


## Disable or Limit Embedding

The HTTPS header `X-Frame-Options` can specify whether a page is able to be rendered in a frame, iframe, or object. If left unset, your site's content may be embedded into other sites' HTML code in a clickjacking attack. To disable the embedding of your content, add the following line to your SSL configuration file in the `server` block:

{{< file "/etc/nginx/conf.d/example_ssl.conf" aconf >}}
add_header X-Frame-Options DENY;

{{< /file >}}


If you'd like to limit embedding rather than disabling it altogether, you can replace `DENY` with `SAMEORIGIN`. This will allow you to use your page in a frame as long as the site attempting to do so is the same one serving your page.

## Create a Custom Diffie-Hellman Key Exchange

We're using a 4096-bit RSA private key to sign the Diffie-Hellman key exchange, but the default parameters for Diffie-Hellman only specify 1024 bits, often making it the weakest link in the SSL cipher suite. We should generate our own custom parameters for the key exchange to provide greater security.

1.  Navigate to your `certs` directory:

        cd /etc/ssl/certs

2.  Create custom parameters for the TLS handshake. Here we will use a 4096-bit key for high security:

        openssl dhparam -out dhparam.pem 4096

3.  Specify the new parameter by adding the following line to your nginx SSL configuration file in the `server` block:

    {{< file "/etc/nginx/conf.d/example_ssl.conf" aconf >}}
ssl_dhparam /etc/ssl/certs/dhparam.pem;

{{< /file >}}


4.  Save your changes and restart nginx:

        systemctl restart nginx

## Test Your Configuration

If you have been following along, starting with the guide on installing the latest version of nginx for Debian Wheezy or Jessie and getting a StartSSL certificate, your `/etc/nginx/conf.d/example_ssl.conf` should now look similar to this:

{{< file "/etc/nginx/conf.d/example_ssl.conf" aconf >}}
# HTTPS server
#
server {
    listen       443 ssl http2;

    add_header   Strict-Transport-Security "max-age=31536000; includeSubdomains";
    add_header   X-Content-Type-Options nosniff;
    add_header   X-Frame-Options DENY;

    server_name  example.com;

    ssl_certificate      /etc/ssl/nginx/nginx.crt;
    ssl_certificate_key  /etc/ssl/nginx/server.key;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout  5m;

    ssl_ciphers  "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH !RC4";
    ssl_prefer_server_ciphers   on;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/nginx/ca.pem;

    ssl_dhparam /etc/ssl/certs/dhparam.pem;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
}

{{< /file >}}


Now that you've optimized nginx for SSL and TLS, you can test your configuration at [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). This configuration should earn you a grade of "A+." If you are getting a lesser rating, check your configuration for errors. Additionally, check that your site is enabled and returning a 200 HTTP response code, as that may also affect your rating. This information can be found in the "Miscellaneous" section at the bottom of your SSL Server Test report.

Again, the best way to ensure security is by following best practices at all times, not simply relying on your configuration, so be sure to monitor for updates and apply them to your server as needed. With proper maintenance, your server will remain secure and safe from attack.

---
author: 
  name: Linode Community
  email: docs@linode.com
description: 'This guide details best practices for deploying SSL and TLS in conjunction with nginx.'
keywords: 'nginx,ssl,tls'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Monday, March 28th, 2016'
modified: Monday, March 28th, 2016
modified_by:
  name: Linode
title: 'Nginx SSL and TLS Deployment Best Practices'
contributor:
  name: 
  link: https://github.com/capecodrailfan
  external_resources:
- '[Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*
<hr>

This guide is intended to inform you of some additional configuration options that nginx uses when serving HTTPS. While these features help optimize nginx for SSL and TLS, this is by no means a complete guide to securing nginx or your Linode. The best way to ensure your server remains secure is to not only to configure it properly, but to follow best security practices at all times. This guide is intended to be one of many steps toward creating the most secure environment possible. 

Please note that you will need root privileges for some of the commands that follow.

For more information, please review our guides on [basic nginx configuration](/docs/websites/nginx/how-to-configure-nginx), [Linux security basics](/docs/security/linux-security-basics), and [securing your server](/docs/security/securing-your-server).

### Disable Nginx Server Tokens

By default, nginx will share its version number with anyone who connects to your server. For example, if a directory is not found, nginx will return a 404 error that includes its version number. Disabling server tokens makes it more difficult to determine the version of nginx running on your Linode, and therefore more difficult to implement version-specific exploits.

[![404 With Nginx Version Number](/docs/assets/404_Not_Found.jpg)](/docs/assets/404_Not_Found.jpg)

1.  To disable `server_tokens` open up your `nginx.conf` using your text editor of choice.
        
	    nano /etc/nginx/nginx.conf

2.  Inside of the `http` block, append the following line before the ending `}`. Depending on where you installed nginx from this line may already exist but may be commented out. To make it active just remove the `#` sign in front.

        server_tokens       off;

3.  Exit your text editor and restart nginx.

        systemctl restart nginx

After restarting, browse to a directory of your server that does not exist, and nginx will no longer share its version number.

[![404 With Server Tokens Disabled](/docs/assets/404_Not_Found_Server_Tokens_Off.jpg)](/docs/assets/404_Not_Found_Server_Tokens_Off.jpg) 

### Enable SPDY Support

SPDY is an open networking protocol developed primarily by Google to decrease page load time over an HTTP or HTTPS connection. Currently browsers only use SPDY when establishing a secure, encrypted HTTPS connection. SPDY decreases page load time by only utilizing a single HTTPS connection to provide all assests to load a page. Traditionally when you access a web page a separate HTTP connection is established to load each resource (ex. HTML, CSS, JavaScript, or images). The server also compresses assests before sending them to the client requiring less bandwdith. 

{.note}
> SPDY is currently being phased out in favor of HTTP/2. SPDY is supported only in nginx 1.8.x or older, whereas newer versions are beginning to support HTTP/2. However, most nginx packages shipped with current stable distros do support SPDY.

1.  To enable SPDY, open your nginx SSL virtual host configuration file. Depending on how you installed nginx this could be located at `/etc/nginx/sites-enabled/default` or at `/etc/nginx/conf.d/example_ssl.conf`.

        nano /etc/nginx/conf.d/example_ssl.conf

2.  Look for the `listen` line and add `spdy` to the end before the semicolon.

        listen       443 ssl spdy;

3.  Below the listen line append the following line telling browsers that your Linode supports SPDY.

        add_header   Alternate-Protocol  443:npn-spdy/3;

4.  Save your changes and restart nginx.

        systemctl restart nginx

5.  Open a web browser and navigate to [SPDYCheck.org](http://SPDYCheck.org), enter your Linode's domain name or hostname in the text box and click "Check". This free tool will check to server and let you know if SPDY is enabled and functioning correctly. 

If SPDY is functioning properly, your report should look like this.
[![SPDY Report](/docs/assets/SPDY_Report_Resized.jpg)](/docs/assets/SPDY_Report.jpg)

### Redirect HTTP Traffic to HTTPS

Google is now ranking websites that accept encrypted HTTPS connections higher in search results, why not force clients to use HTTPS and increase your page rank? 

1.  Open up your HTTP nginx virtual host configuration file, which can be located at `/etc/nginx/conf.d/default.conf` or `/etc/nginx/sites-enabled/default` depending on how you installed nginx.

        nano /etc/nginx/conf.d/default.conf

2.  Change `your-domain` to match your Linode's domain name or hostname.

        server_name your-domain

3.  Append the following line below the `server_name` line.
       
        rewrite        ^ https://$server_name$request_uri? permanent;

4.  Comment out (place # signs in front) all other lines so that your configuration looks like this:

        server {
            listen       80;
            server_name  Your Domain Name or Hostname Here;
            rewrite      ^ https://$server_name$request_uri? permanent;
        }

5. Exit your text editor saving your changes and restart nginx.

        systemctl restart nginx

Now if you run a SPDYCheck again, your report should indicate HTTP connections are no longer accepted.

[![SPDY Report HTTP Redirect](/docs/assets/SPDY_Report_Redirect.jpg)](/docs/assets/SPDY_Report_Redirect.jpg)

### OCSP Stapling

The *Online Certificate Status Protocol* (OCSP) was created to speed up the process that operating systems and browsers use to check for certificate revocation. For instance, when you use Internet Explorer or Google Chrome on a Windows machine, Windows is configured by default to check for certificate revocation. Prior to OCSP, your operating system or browser would download a *certificate revocation list* (CRL). CRLs have grown so large that browser vendors are now creating their own CRLs and distributing them to users.

The problem with OCSP is that a certificate authority can now track user as they move from website to website with certificates provided by the same vendor or certificate authority. To prevent this, you can enable OCSP stapling.

When OCSP stapling is enabled, nginx on your Linode will make an OCSP request for the client. The response recieved from the OCSP server is then added to nginx's reponse to the user. This eliminates the need for the user to connect to an OCSP server to check the revocation status of your server certificate.

Before enabling OCSP stapling you will need to create a file on your system that stores the CA certificates used to sign your server certificate. This tutorial assumes that you have a free certificate from StartSSL. If you need help with this, contact your certificate issuer.

1.  Navigate to your `/etc/nginx` directory.

        cd /etc/nginx

2.  Download the StartSSL CA Certificate.

        wget http://www.startssl.com/certs/ca.pem

3.  Download the StartSSL Class 1 Intermediate CA Certificate.

        wget http://www.startssl.com/certs/sub.class1.server.ca.pem

4.  Combine the two CA Certificates into a single file.

        cat sub.class1.server.ca.pem >> /etc/nginx/ca.pem

5.  Delete the no longer needed certificate file.

        rm sub.class1.server.ca.pem

6.  Open up your HTTPS Nginx virtual host configuration file this can be located at `/etc/nginx/conf.d/example_ssl.conf` or `/etc/nginx/sites-enabled/default` depending on how you installed nginx.

        nano /etc/nginx/conf.d/example_ssl.conf

7.  Append the following lines inside of the `server` block:

        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /etc/nginx/ca.pem;

8.  Save your changes exiting your text editor and restart nginx.

        systemctl restart nginx

9.  Navigate to the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). Enter the domain name or hostname of your Linode and click "Submit". Optionally, you may uncheck the checkbox to not show your results on the boards.

Once the test is complete, scroll down to the "Protocol Details" section. Look for the "OCSP stapling" line. If nginx is confiugred correctly this test will return "Yes".

[![SSL Server Test OCSP](/docs/assets/OCSP_Stapling_SSL_Test.jpg)](/docs/assets/OCSP_Stapling_SSL_Test.jpg)

### HTTP Strict Transport Security (HSTS)

Google Chrome, Mozilla Firefox, Opera, and Safari currently honor HSTS headers. HSTS is used to force browsers to only connect using secure encrypted connections. This means your site will no longer be accessible over HTTP. When HSTS is enabled and a valid HSTS header is stored in a users browser cache, the user will be unable to access your site if presented with a self-signed, expired, or SSL certificate issued by an untrusted certificate authority. The user will also be unable to bypass any certificate warnings unless your HSTS header expires or the browser cache is cleared.

With all traffic being redirected from HTTP to HTTPS why not tell visitors browsers to only connect using HTTPS?

**Do not follow these steps if you want users to access your site over HTTP!**

1.  Open up your Nginx HTTPS virtual host configuration file. This may be located at `/etc/nginx/sites-enabled/default` or at `/etc/nginx/conf.d/example_ssl.conf`.

        nano /etc/nginx/conf.d/example_ssl.conf

2.  Append the following line inside of your server block. `max-age` sets the expiration date for this header in seconds; in this configuration, the header will expire after 1 year. You can configure this to be longer or shorter if you choose. The `includeSubdomains` argument enforces HSTS on all subdomains.

        add_header Strict-Transport-Security "max-age=31536000; includeSubdomains";

3.  Save your changes exiting your text editor and restart Nginx.

        systemctl restart nginx

4.  Navigate to the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). Enter the domain name or hostname of your Linode and click "Submit". Optionally, you may uncheck the checkbox to not show your results on the boards.

Once the test is complete, scroll down to the "Protocol Details" section. Look for the "Strict Transport Security (HSTS)" line. If nginx is configured correctly this test will return "Yes".

[![SSL Server Test HSTS](/docs/assets/HSTS_SSL_Test.jpg)](/docs/assets/HSTS_SSL_Test.jpg)

### Disable Content Sniffing

Content sniffing allows browsers to inspect a byte stream in order to "guess" the file format of its contents. It is generally used to help sites that do not correctly identify the MIME type of their web content, but it also presents a vulnerability to cross-site scripting and other attacks. To disable content sniffing, add the following line to your nginx SSL configuration file in the `server` block:

{: .file}
/etc/nginx/conf.d/example_ssl
:   ~~~conf
    add_header X-Content-Type-Options nosniff;
    ~~~

### Disable or Limit Embedding

This HTTPS header can specify whether a page is able to be rendered in a frame, iframe, or object. If left unset, your site's content may be embedded into other sites' HTML code in a clickjacking attack. To disable the embedding of your content, add the following line to your SSL configuration file in the `server` block:

{: .file}
/etc/nginx/conf.d/example_ssl
:   ~~~conf
    add_header X-Frame-Options DENY;
    ~~~

If you'd like to limit embedding rather than disabling it altogether, you can replace `DENY` with `SAMEORIGIN`. This will allow you to use your page in a frame as long as the site attempting to do so is the same one serving your page.

### Create a Custom Diffie-Hellman Key Exchange

We're using a 2048 bit RSA private key to sign the Diffie-Hellman key exchange, but the default parameters for Diffie-Hellman only specify 1024 bits, often making it the weakest link in the SSL cipher suite. We should generate our own custom parameters for the key exchange to provide greater security.

1.  Navigate to your `certs` directory:

        cd /etc/ssl/certs

2.  Create custom parameters for the handshake. Here we will use 2048 bits, but you can increase this to 4096 if you'd like even greater security:

        openssl dhparam -out dhparam.pem 2048

3.  Specify the new parameter by adding the following line to your nginx SSL configuration file in the `server` block:

{: .file}
/etc/nginx/conf.d/example_ssl
:   ~~~conf
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    ~~~

## Test Your Configuration

If you have been following along, starting with the guide on installing the latest version of Nginx for Debian Wheezy or Jessie and getting a StartSSL certificate, your `/etc/nginx/conf.d/example_ssl.conf` should now look similar to this:

{: .file}
/etc/nginx/conf.d/example_ssl
:   ~~~conf
    # HTTPS server
    #
    server {
        listen       443 ssl spdy;
        
        add_header   Alternate-Protocol  443:npn-spdy/3;
        add_header   Strict-Transport-Security "max-age=31536000; includeSubdomains";
        add_header   X-Content-Type-Options nosniff;
        add_header   X-Frame-Options DENY;
        
        server_name  your-domain;

        ssl_certificate      /etc/ssl/nginx/nginx.crt;
        ssl_certificate_key  /etc/ssl/nginx/server.key;

        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout  5m;

        ssl_ciphers  "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+EDH+aRSA !RC4 !EXPORT !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";
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
    ~~~

Now that you've optimized nginx for SSL and TLS, you can test your configuration at [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). This configuration should earn you an 'A+' rating. Again, the best way to ensure security is by following best practices at all times, not simply relying on your configuration, so be sure to monitor for updates and apply them to your server as needed. With proper maintenance, your server will remain secure and safe from attack.
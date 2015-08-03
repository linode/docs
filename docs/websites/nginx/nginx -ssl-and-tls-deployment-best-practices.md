This guide is intended to inform you of some additional features and cofigurations options that Nginx offers. While you may want to make these configurations changes this guide is by no means a complete guide to securing Nginx or your Linode.

### Disable Nginx Server Tokens

By default Nginx will share its version number to anyone who connect to your server. Disabling server tokens makes it more difficult to determine the version of Nginx running on your Linode.

For example if a directory is not found Nginx will return a 404 error with its version number.

[![404 With Nginx Version Number](/docs/assets/404_Not_Found.jpg)](/docs/assets/404_Not_Found.jpg)

1.  To disable `server_tokens` open up your `nginx.conf` using your text editor of choice.
        
	  nano /etc/nginx/nginx.conf

2.  Inside of the http block append the following line before the ending `}`. Depending on where you installed Nginx from this line may already exist but may be commented out. To make it active just remove the `#` sign in front.

        server_tokens       off;

3.  Exit your text editor and restart Nginx.

        service nginx restart

After restarting Nginx browse to a directory of your server that does not exist, and Nginx will no longer share its version number.

[![404 With Server Tokens Disabled](/docs/assets/404_Not_Found_Server_Tokens_Off.jpg)](/docs/assets/404_Not_Found_Server_Tokens_Off.jpg)

### Enable SPDY Support

SPDY is a open networking portocol developed primarily by Google to decrease page load time over an HTTP or HTTPS connection. Currently browsers only use SPDY when establishing s ecure encrypted HTTPS connection. SPDY decreases page load time by only utilizing a single HTTPS connection to provide all assests to load a page. Traditionally when you access a web page a separate HTTP connection is established to load each resource (ex. HTML, CSS, JavaScript, or images). The server also compresses assests before sending them to the client requiring less bandwdith. SPDY is currently be phased out in favor of HTTP/2 but is still useful until Nginx adds support for HTTP/2.

1.  To enable SPDY open up your Nginx SSL virtual host configuration file. Depending on where you installed Nginx from this could be located at `/etc/nginx/sites-enabled/default` or at `/etc/nginx/conf.d/example_ssl.conf`.

        nano /etc/nginx/conf.d/example_ssl.conf

2.  Look for the `listen` line and add `spdy` to the end before the semicolon.

        listen       443 ssl spdy;

3.  Below the listen line append the following line telling browsers that your Linode supports SPDY.

        add_header   Alternate-Protocol  443:npn-spdy/3;

4.  Exit your text editor and restart Nginx.

        service nginx restart

5.  Open a web browser and navigate to [SPDYCheck.org](http://SPDYCheck.org), enter your Linode's domain name or hostname in the text box and click "Check". This free tool will check to server and let you know if SPDY is enabled and functioning correctly. 

If SPDY is functioning properly, your report should look like this.
[![SPDY Report](/docs/assets/SPDY_Report_Resized.jpg)](/docs/assets/SPDY_Report.jpg)

### Redirect HTTP Traffic to HTTPS

Google is now ranking websites that accept encrypted HTTPS connections higher in search results, why not force clients to use HTTPS and increase your page rank?

1.  Open up your HTTP Nginx virtual host configuration file this can be located at `/etc/nginx/conf.d/default.conf` or `/etc/nginx/sites-enabled/default` depending on where you installed Nginx from.

        nano /etc/nginx/conf.d/default.conf

2.  Change the `server_name` to match your Linode's domain name or hostname.

        server_name Your Domain Name or Hostname Here.

3.  Append the following line below the `server_name` line.
       
        rewrite        ^ https://$server_name$request_uri? permanent;

4.  Comment out (place # signs in front) or delete all other lines so that your configuration looks like this.

        server {
            listen       80;
            server_name  Your Domain Name or Hostname Here;
            rewrite        ^ https://$server_name$request_uri? permanent;
        }

5. Exit your text editor saving your changes and restart Nginx.

        service nginx restart

Now if you run a SPDYCheck again, your report should indicate HTTP connections are no longer accepted.

[![SPDY Report HTTP Redirect](/docs/assets/SPDY_Report_Redirect.jpg)](/docs/assets/SPDY_Report_Redirect.jpg)

### OCSP Stapling

The Online Certificate Status Protocol (OCSP) was created to speed up the process that operating systems and browsers use to check for certificate revocation. For instance, when you use Internet Explorer or Google Chrome on a Windows machine, Windows is configured by default to check for certificate revocation. Prior to OCSP, your operating system or browser would download a a certificate revocation list or CRL. CRL's have grone so large now that browser vendors are creating there own CRL's and distributing them to users.

The problem with OCSP is that a certificate authority can now track user as they move from website to website with certificates provided by the same vendor or certificate authority. To prevent this you can enable OCSP Stapling.

When OCSP Stapling is enabled, Nginx on your Linode will make an OCSP request for the client. The response recieved from the OCSP server is then added to Nginx's reponse to the user. This eliminates the need for the user to connect to an OCSP server to check the revocation status of your server certificate.

Before enabling OCSP Stapling you will need to create a file on your system that stores the CA certificates used to sign your server certificate. This tutorial assumes that you have a free certificate from StartSSL. If you need help with this, contact your certificate issuer.

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

6.  Open up your HTTPS Nginx virtual host configuration file this can be located at `/etc/nginx/conf.d/example_ssl.conf` or `/etc/nginx/sites-enabled/default` depending on where you installed Nginx from.

        nano /etc/nginx/conf.d/example_ssl.conf

7.  Append the following lines inside of the server block.

        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /etc/nginx/ca.pem;

8.  Save your changes exiting your text editor and restart Nginx.

        service nginx restart

9.  Navigate to the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). Enter the domain name or hostname of your Linode and click "Submit". Optionally you may uncheck the checkbox to not show your results on the boards.

Once the test is complete scroll down to the "Protocol Details" section. Look for the "OCSP stapling" line. If Nginx is confiugred correctly this test will return "Yes", otherwise it will return "No".

[![SSL Server Test OCSP](/docs/assets/OCSP_Stapling_SSL_Test.jpg)](/docs/assets/OCSP_Stapling_SSL_Test.jpg)

### HTTP Strict Transport Security (HSTS)

Google Chrome, Mozilla Firefox, Opera, and Safari currently honor HSTS headers. HSTS is used to force browsers to only connect using secure encrypted connections. This means your site will no longer be accessible over HTTP. When HSTS is enabled and a valid HSTS header is stored in a users browser cache, the user will be unable to access your site if presented with a self-signed, expired, or SSL certificate issued by an untrusted certificate authority. The user will also be unable to bypass any certificate warnings unless your HSTS header expires or the browser cache is cleared.

With all traffic being redirected from HTTP to HTTPS why not tell visitors browsers to only connect using HTTPS?

**Do not follow these steps if you want users to access your site over HTTP!**

1.  Open up your Nginx HTTPS virtual host configuration file. This may be located at `/etc/nginx/sites-enabled/default` or at `/etc/nginx/conf.d/example_ssl.conf`.

        nano /etc/nginx/conf.d/example_ssl.conf

2.  Append the following line inside of your server block. This header will expire after 1 year. You can configure this to be longer or shorter by changing max-age to your desired number of seconds.

        add_header Strict-Transport-Security "max-age=31536000";

3.  Save your changes exiting your text editor and restart Nginx.

        service nginx restart

4.  Navigate to the [Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/). Enter the domain name or hostname of your Linode and click "Submit". Optionally you may uncheck the checkbox to not show your results on the boards.

Once the test is complete scroll down to the "Protocol Details" section. Look for the "Strict Transport Security (HSTS)" line. If Nginx is confiugred correctly this test will return "Yes", otherwise it will return "No".

[![SSL Server Test HSTS](/docs/assets/HSTS_SSL_Test.jpg)](/docs/assets/HSTS_SSL_Test.jpg)

If you have been following along starting with my guide on installing the latest version of Nginx for Debian Wheezy or Jessie and getting a StartSSL certificate your `/etc/nginx/conf.d/example_ssl.conf` should now look like this.

    # HTTPS server
    #
    server {
        listen       443 ssl spdy;
        
        add_header   Alternate-Protocol  443:npn-spdy/3;
        add_header Strict-Transport-Security "max-age=31536000";
        
        server_name  Your hostname or domain here;

        ssl_certificate      /etc/ssl/nginx/nginx.crt;
        ssl_certificate_key  /etc/ssl/nginx/server.key;

        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout  5m;

        ssl_ciphers  "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !EXPORT !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";
        ssl_prefer_server_ciphers   on;

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /etc/nginx/ca.pem;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }
    }


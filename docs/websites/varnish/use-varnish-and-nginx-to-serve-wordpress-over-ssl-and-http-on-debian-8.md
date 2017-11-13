---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn to integrate Varnish with nginx to serve cached WordPress content for both SSL and plain HTTP websites.'
keywords: ["Varnish", "cache", "Nginx", "WordPress", "SSL", "PHP-FPM"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
published: 2016-11-23
modified: 2016-11-23
modified_by:
    name: Nick Brewer
title: Use Varnish & nginx to Serve WordPress over SSL & HTTP on Debian 8
contributor:
  name: Frederick Jost Zweig
  link: https://github.com/Fred-Zweig
external_resources:
 - '[Varnish Documentation](https://varnish-cache.org/docs/index.html)'
 - '[NGINX Documentation](https://nginx.org/en/docs/)'
image: https://linode.com/docs/assets/varnish-nginx-ssl.png
---


*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

**Varnish** is a powerful and flexible caching HTTP reverse proxy. It can be installed in front of any web server to cache its contents, which will improve speed and reduce server load. When a client requests a webpage, Varnish first tries to send it from the cache. If the page is not cached, Varnish forwards the request to the backend server, fetches the response, stores it in the cache, and delivers it to the client.

![Use Varnish & nginx to Serve WordPress over SSL & HTTP on Debian 8](/docs/assets/use_varnish_nginx_to_serve_wordpress_over_ssl_http_on_debian_8.png "Use Varnish & nginx to Serve WordPress over SSL & HTTP on Debian 8")

When a cached resource is requested through Varnish, the request doesn't reach the web server or involve PHP or MySQL execution. Instead, Varnish reads it from memory, delivering the cached page in a matter of microseconds.

One Varnish drawback is that it doesn't support SSL-encrypted traffic. You can circumvent this issue by using **nginx** for both SSL decryption and as a backend web server. Using nginx for both tasks reduces the complexity of the setup, leading to fewer potential points of failure, lower resource consumption, and fewer components to maintain.

Both Varnish and nginx are versatile tools with a variety of uses. This guide uses Varnish 4.0, which comes included in Debian 8 repositories, and presents a basic setup that you can refine to meet your specific needs.

## How Varnish and nginx Work Together

In this guide, we will configure nginx and Varnish for two WordPress sites:

  * `www.example-over-http.com` will be an unencrypted, HTTP-only site.
  * `www.example-over-https.com` will be a separate, HTTPS-encrypted site.

For HTTP traffic, Varnish will listen on port `80`. If content is found in the cache, Varnish will serve it. If not, it will pass the request to nginx on port `8080`. In the second case, nginx will send the requested content back to Varnish on the same port, then Varnish will store the fetched content in the cache and deliver it to the client on port `80`.

For HTTPS traffic, nginx will listen on port `443` and send decrypted traffic to Varnish on port `80`. If content is found in the cache, Varnish will send the unencrypted content from the cache back to nginx, which will encrypt it and send it to the client. If content is not found in the cache, Varnish will request it from nginx on port `8080`, store it in the cache, and then send it unencrypted to frontend nginx, which will encrypt it and send it to the client's browser.

Our setup is illustrated below. Please note that frontend nginx and backend nginx are one and the same server:

[![Nginx-Varnish-Nginx server configuration diagram](/docs/assets/varnish-cache.png)](/docs/assets/varnish-cache.png "Nginx-Varnish-Nginx server configuration diagram")

## Before You Begin

This tutorial assumes that you have SSH access to your Linode running Debian 8 (Jessie). Before you get started:

1.  Complete the steps in our [Getting Started](/docs/getting-started) and [Securing your Server](/docs/security/securing-your-server) guides. You'll need a standard user account with `sudo` privileges for many commands in this guide.

2.  Follow the steps outlined in our [LEMP on Debian 8](/docs/websites/lemp/lemp-server-on-debian-8) guide. Skip the nginx configuration section, since we'll address it later in this guide.

3.  After configuring nginx according to this guide, follow the steps in our [WordPress](/docs/websites/cms/how-to-install-and-configure-wordpress) guide to install and configure WordPress. We'll include a step in the instructions to let you know when it's time to do this.

## Install and Configure Varnish

For all steps in this section, replace `203.0.113.100` with your Linodes public IPv4 address, and `2001:DB8::1234` with its IPv6 address.

1.  Update your package repositories and install Varnish:

        sudo apt-get update
        sudo apt-get install varnish

2.  Open `/etc/default/varnish` with sudo rights. To make sure Varnish starts at boot, under `Should we start varnishd at boot?` set the `START` to `yes`:

    {{< file-excerpt "/etc/default/varnish" aconf >}}
START=yes

{{< /file-excerpt >}}


3. In the `Alternative 2` section, make the following changes to `DAEMON_OPTS`:

    {{< file-excerpt "/etc/default/varnish" aconf >}}
DAEMON_OPTS="-a :80 \
            -T localhost:6082 \
            -f /etc/varnish/custom.vcl \
            -S /etc/varnish/secret \
            -s malloc,1G"

{{< /file-excerpt >}}


    This will set Varnish to listen on port `80` and will instruct it to use the `custom.vcl` configuration file. The custom configuration file is used so that future updates to Varnish do not overwrite changes to `default.vcl`.

    The `-s malloc,1G` line sets the maximum amount of RAM that will be used by Varnish to store content. This value can be adjusted to suit your needs, taking into account the server's total RAM along with the size and expected traffic of your website. For example, on a system with 4 GB of RAM, you can allocate 2 or 3 GB to Varnish.

    When you've made these changes, save and exit the file.

### Create a Custom Varnish Configuration File

1.  To start customizing your Varnish configuration, create a new file called `custom.vcl`:

        sudo touch /etc/varnish/custom.vcl

2.  Varnish configuration uses a domain-specific language called Varnish Configuration Language (VCL). First, specify the VCL version used:

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
vcl 4.0;

{{< /file-excerpt >}}


3.  Specify that the backend (nginx) is listening on port `8080`, by adding the `backend default` directive:

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
backend default {
.host = "localhost";
.port = "8080";
}

{{< /file-excerpt >}}


4.  Allow cache-purging requests only from localhost using the `acl` directive:

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
acl purger {
"localhost";
"203.0.113.100";
"2001:DB8::1234";
}

{{< /file-excerpt >}}


    Remember to substitute your Linode's actual IP addresses for the example addresses.

5.  Create the `sub vcl_recv` routine, which is used when a request is sent by a HTTP client.

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
sub vcl_recv {


}

{{< /file-excerpt >}}


    The settings in the following steps should be placed **inside** the `sub vcl_recv` brackets:

    -  Redirect HTTP requests to HTTPS for our SSL website:

        {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
if (client.ip != "127.0.0.1" && req.http.host ~ "example-over-https.com") {
set req.http.x-redir = "https://www.example-over-https.com" + req.url;
return(synth(850, ""));
}

{{< /file-excerpt >}}


        Remember to replace the example domain with your own.

    -   Allow cache-purging requests only from the IP addresses in the above `acl purger` section (Step 4). If a purge request comes from a different IP address, an error message will be produced:

        {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
if (req.method == "PURGE") {
if (!client.ip ~ purger) {
return(synth(405, "This IP is not allowed to send PURGE requests."));
  }
return (purge);
}

{{< /file-excerpt >}}


    -   Change the `X-Forwarded-For` header:

        {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
if (req.restarts == 0) {
if (req.http.X-Forwarded-For) {
set req.http.X-Forwarded-For = client.ip;
  }
}

{{< /file-excerpt >}}


    -   Exclude POST requests or those with basic authentication from caching:

        {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
if (req.http.Authorization || req.method == "POST") {
return (pass);
}

{{< /file-excerpt >}}


    -   Exclude RSS feeds from caching:

        {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
if (req.url ~ "/feed") {
return (pass);
}

{{< /file-excerpt >}}


    -   Tell Varnish not to cache the WordPress admin and login pages:

        {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
if (req.url ~ "wp-admin|wp-login") {
return (pass);
}

{{< /file-excerpt >}}


    -   WordPress sets many cookies that are safe to ignore. To remove them, add the following lines:

        {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
set req.http.cookie = regsuball(req.http.cookie, "wp-settings-\d+=[^;]+(; )?", "");
set req.http.cookie = regsuball(req.http.cookie, "wp-settings-time-\d+=[^;]+(; )?", "");
if (req.http.cookie == "") {
unset req.http.cookie;
  }

{{< /file-excerpt >}}


        {{< note >}}
This is the final setting to be placed inside the `sub vcl_recv` routine. All directives in the following steps (from Step 6 onward) should be placed after the closing `}`.
{{< /note >}}

6.  Redirect HTTP to HTTPS using the `sub vcl_synth` directive with the following settings:

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
sub vcl_synth {
 if (resp.status == 850) {
     set resp.http.Location = req.http.x-redir;
     set resp.status = 302;
     return (deliver);
 }
}

{{< /file-excerpt >}}


7.  Cache-purging for a particular page must occur each time we make edits to that page. To implement this, we use the `sub vcl_purge` directive:

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
sub vcl_purge {
 set req.method = "GET";
 set req.http.X-Purger = "Purged";
 return (restart);
}

{{< /file-excerpt >}}


8.  The `sub vcl_backend_response` directive is used to handle communication with the backend server, nginx. We use it to set the amount of time the content remains in the cache. We can also set a *grace period*, which determines how Varnish will serve content from the cache even if the backend server is down. Time can be set in seconds (s), minutes (m), hours (h) or days (d). Here, we've set the caching time to 24 hours, and the grace period to 1 hour, but you can adjust these settings based on your needs:

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
sub vcl_backend_response {
 set beresp.ttl = 24h;
 set beresp.grace = 1h;

{{< /file-excerpt >}}


9.  Before closing the `vcl_backend_response` block with a bracket, allow cookies to be set only if you are on admin pages or WooCommerce-specific pages:

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
if (bereq.url !~ "wp-admin|wp-login|product|cart|checkout|my-account|/?remove_item=") {
unset beresp.http.set-cookie;
}
        }

{{< /file-excerpt >}}


    Remember to include in the above series any page that requires cookies to work, for example `phpmyadmin|webmail|postfixadmin`, etc. If you change the WordPress login page from `wp-login.php` to something else, also add that new name to this series.

    {{< note >}}
The "WooCommerce Recently Viewed" widget, which displays a group of recently viewed products, uses a cookie to store recent user-specific actions and this cookie prevents Varnish from caching product pages when they are browsed by visitors. If you want to cache product pages when they are only browsed, before products are added to the cart, you must disable this widget.

Special attention is required when enabling widgets that use cookies to store recent user-specific activities, if you want Varnish to cache as many pages as possible.
{{< /note >}}

10. Change the headers for purge requests by adding the `sub vcl_deliver` directive:

    {{< file-excerpt "/etc/varnish/custom.vcl" aconf >}}
sub vcl_deliver {
if (req.http.X-Purger) {
set resp.http.X-Purger = req.http.X-Purger;
  }
}

{{< /file-excerpt >}}


    This concludes the `custom.vcl` configuration. You can now save and exit the file. The final `custom.vcl` file will look like [this](/docs/assets/custom.vcl).

    {{< note >}}
You can download the complete sample configuration file using the link above and `wget`. If you do, remember to replace the variables as described above.
{{< /note >}}

### Edit the Varnish Startup Configuration

1.  For Varnish to work properly, we also need to edit the `/lib/systemd/system/varnish.service` file to use our custom configuration file.  Specifically, we'll tell it to use the custom configuration file and modify the port number and allocated memory values to match the changes we made in our `/etc/default/varnish` file.

    Open `/lib/systemd/system/varnish.service` and find the two lines beginning with `ExecStart`. Modify them to look like this:

    {{< file-excerpt "/lib/systemd/system/varnish.service" aconf >}}
ExecStartPre=/usr/sbin/varnishd -C -f /etc/varnish/custom.vcl
ExecStart=/usr/sbin/varnishd -a :80 -T localhost:6082 -f /etc/varnish/custom.vcl -S /etc/varnish/secret -s malloc,1G

{{< /file-excerpt >}}


2.  After saving and exiting the file, reload the `systemd` process:

        sudo systemctl daemon-reload

## Install and Configure PHP

Before configuring nginx, we have to install *PHP-FPM*. FPM is short for FastCGI Process Manager, and it allows the web server to act as a proxy, passing all requests with the `.php` file extension to the PHP interpreter.

1.  Install PHP-FPM:

        sudo apt-get install php5-fpm php5-mysql

2.  Open the `/etc/php5/fpm/php.ini` file. Find the directive `cgi.fix_pathinfo=`, uncomment and set it to `0`. If this parameter is set to `1`, the PHP interpreter will try to process the file whose path is closest to the requested path; if it's set to `0`, the interpreter will only process the file with the exact path, which is a safer option.

    {{< file-excerpt "/etc/php5/fpm/php.ini" ini >}}
cgi.fix_pathinfo=0

{{< /file-excerpt >}}


    After you've made this change, save and exit the file.

3.  Open `/etc/php5/fpm/pool.d/www.conf` and confirm that the `listen =` directive, which specifies the socket used by nginx to pass requests to PHP-FPM, matches the following:

    {{< file-excerpt "/etc/php5/fpm/pool.d/www.conf" aconf >}}
listen = /var/run/php5-fpm.sock

{{< /file-excerpt >}}


    Save and exit the file.

4.  Restart PHP-FPM:

        sudo systemctl restart php5-fpm

5.  Open `/etc/nginx/fastcgi_params` and find the `fastcgi_param  HTTPS` directive. Below it, add the following two lines, which are necessary for nginx to interact with the FastCGI service:

    {{< file-excerpt "/etc/nginx/fastcgi_params" nginx >}}
fastcgi_param  SCRIPT_FILENAME    $request_filename;
fastcgi_param  PATH_INFO          $fastcgi_path_info;

{{< /file-excerpt >}}


    Once you're done, save and exit the file.

## Configure nginx

1.  Open `/etc/nginx/nginx.conf` and comment out the `ssl_protocols` and `ssl_prefer_server_ciphers` directives. We'll include these SSL settings in the server block within the `/etc/nginx/sites-enabled/default` file:

    {{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}
# ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
# ssl_prefer_server_ciphers on;

{{< /file-excerpt >}}


2.  Since the access logs and error logs will be defined for each individual website in the server block, comment out the `access_log` and `error_log` directives:

    {{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}
# access_log /var/log/nginx/access.log;
# error_log /var/log/nginx/error.log;

{{< /file-excerpt >}}


    Save and exit the file.

3.  Next, we'll configure the HTTP-only website, `www.example-over-http.com`. Begin by making a backup of the default server block (virtual host) file:

        sudo mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default-backup

4.  Open a new `/etc/nginx/sites-available/default` file and add the following blocks:

    {{< file-excerpt "/etc/nginx/sites-available/default" nginx >}}
server {
  listen  8080;
  listen  [::]:8080;
  server_name  example-over-http.com;
  return       301 http://www.example-over-http.com$request_uri;
}

server {
  listen 8080;
  listen [::]:8080;
  server_name  www.example-over-http.com;
  root /var/www/html/example-over-http.com/public_html;
  port_in_redirect off;
  index index.php;
  location / {
  try_files $uri $uri/ /index.php?$args;
       }

  location ~ \.php$ {
       try_files $uri =404;
       fastcgi_split_path_info ^(.+\.php)(/.+)$;
       include fastcgi_params;
       fastcgi_index index.php;
       fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
       fastcgi_pass unix:/var/run/php5-fpm.sock;
       }

error_log /var/www/html/example-over-http.com/logs/error.log notice;

}

{{< /file-excerpt >}}


    A few things to note here:

    *   The first server block is used to redirect all requests for `example-over-http.com` to `www.example-over-http.com`. This assumes you want to use the `www` subdomain and have added a DNS A record for it.
    *   `listen [::]:8080;` is needed if you want your site to be also accesible over IPv6.
    *   `port_in_redirect off;` prevents nginx from appending the port number to the requested URL.
    *   `fastcgi` directives are used to proxy requests for PHP code execution to PHP-FPM, via the FastCGI protocol.

5.  To configure nginx for the SSL-encrypted website (in our example we called it `www.example-over-https.com`), you need two more server blocks. Append the following server blocks to your `/etc/nginx/sites-available/default` file:

    {{< file-excerpt "/etc/nginx/sites-available/default" nginx >}}
server {
   listen  443 ssl;
   listen  [::]:443 ssl;
   server_name  www.example-over-https.com;
   port_in_redirect off;

   ssl                  on;
   ssl_certificate      /etc/nginx/ssl/ssl-bundle.crt;
   ssl_certificate_key  /etc/nginx/ssl/example-over-https.com.key;
   ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
   ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS;
   ssl_prefer_server_ciphers   on;

   ssl_session_cache   shared:SSL:20m;
   ssl_session_timeout 60m;

   add_header Strict-Transport-Security "max-age=31536000";
   add_header X-Content-Type-Options nosniff;

   location / {
     proxy_pass http://127.0.0.1:80;
     proxy_set_header Host $http_host;
     proxy_set_header X-Forwarded-Host $http_host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Forwarded-Proto https;
     proxy_set_header HTTPS "on";

     access_log /var/www/html/example-over-https.com/logs/access.log;
     error_log  /var/www/html/example-over-https.com/logs/error.log notice;
     }
}

server {
   listen 8080;
   listen [::]:8080;
   server_name  www.example-over-https.com;
   root /var/www/html/example-over-https.com/public_html;
   index index.php;
   port_in_redirect off;

   location / {
      try_files $uri $uri/ /index.php?$args;
   }

   location ~ \.php$ {
       try_files $uri =404;
       fastcgi_split_path_info ^(.+\.php)(/.+)$;
       include fastcgi_params;
       fastcgi_index index.php;
       fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
       fastcgi_param HTTPS on;
       fastcgi_pass unix:/var/run/php5-fpm.sock;
       }
}

{{< /file-excerpt >}}


    For an SSL-encrypted website, you need one server block to receive traffic on port 443 and pass decrypted traffic to Varnish on port `80`, and another server block to serve unencrypted traffic to Varnish on port `8080`, when Varnish asks for it.

    {{< caution >}}
The `ssl_certificate` directive must specify the location and name of the SSL certificate file. Take a look at our guide to using [SSL on nginx](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) for more information, and update the `ssl_certificate` and `ssl_certificate_key` values as needed.
{{< /caution >}}

    Alternately, if you don't have a commercially-signed SSL certificate (issued by a CA), you can issue a self-signed SSL certificate using *openssl*, but this should be done only for testing purposes. Self-signed sites will return a "This Connection is Untrusted" message when opened in a browser.

    Now, let's review the key points of the previous two server blocks:

    *   `ssl_session_cache   shared:SSL:20m;` creates a 20MB cache shared between all worker processes. This cache is used to store SSL session parameters to avoid SSL handshakes for parallel and subsequent connections. 1MB can store about 4000 sessions, so adjust this cache size according to the expected traffic for your website.
    *   `ssl_session_timeout 60m;` specifies the SSL session cache timeout. Here it's set to 60 minutes, but it can be decreased or increased, depending on traffic and resources.
    *   `ssl_prefer_server_ciphers   on;` means that when an SSL connection is established, the server ciphers are preferred over client ciphers.
    *   `add_header Strict-Transport-Security "max-age=31536000";` tells web browsers they should only interact with this server using a secure HTTPS connection. The `max-age` specifies in seconds what period of time the site is willing to accept HTTPS-only connections.
    *   `add_header X-Content-Type-Options nosniff;` this header tells the browser not to override the response content's MIME type. So, if the server says the content is text, the browser will render it as text.
    *   `proxy_pass http://127.0.0.1:80;` this directive proxies all the decrypted traffic to Varnish, which listens on port `80`.
    *   `proxy_set_header` directives add specific headers to requests, so SSL traffic can be recognized.
    *   `access_log` and `error_log` indicate the location and name of the respective types of logs. Adjust these locations and names according to your setup, and make sure the `www-data` user has permissions to modify each log.
    *   `fastcgi` directives present in the last server block are necessary to proxy requests for PHP code execution to PHP-FPM, via the FastCGI protocol.

6.  **Optional:** To prevent access to your website via direct input of your IP address into a browser, you can put a catch-all default server block right at the top of the file:

    {{< file-excerpt "/etc/nginx/sites-available/default" nginx >}}
server {
  listen 8080 default_server;
  listen [::]:8080;
  server_name _;
  root /var/www/html;
  index index.html;
}

{{< /file-excerpt >}}


    The `/var/www/html/index.html` file can contain a simple message like "Page not found!"

7.  Restart nginx, then start Varnish:

        sudo systemctl restart nginx
        sudo systemctl start varnish

8.  Install WordPress, following our [How to Install and Configure WordPress](/docs/websites/cms/how-to-install-and-configure-wordpress) guide. Once WordPress is installed, continue with this guide.

9.  After installing WordPress, restart Varnish to clear any cached redirects to the setup page:

        sudo systemctl restart varnish

## Install the WordPress "Varnish HTTP Purge" Plugin

When you edit a WordPress page and update it, the modification won't be visible even if you refresh the browser because it will receive the cached version of the page. To purge the cached page automatically when you edit a page, you must install a free WordPress plugin called "Varnish HTTP Purge."

To install this plugin, log in to your WordPress website and click **Plugins** on the main left sidebar. Select **Add New** at the top of the page, and search for **Varnish HTTP Purge**. When you've found it, click **Install Now**, then **Activate**.

## Test Your Setup

1.  To test whether Varnish and nginx are doing their jobs for the HTTP website, run:

        wget -SS http://www.example-over-http.com

    The output should look like this:

            --2016-11-04 16:48:43--  http://www.example-over-http.com/
            Resolving www.example-over-http.com (www.example-over-http.com)... your_server_ip
            Connecting to www.example-over-http.com (www.example-over-http.com)|your_server_ip|:80... connected.
            HTTP request sent, awaiting response...
              HTTP/1.1 200 OK
              Server: nginx/1.6.2
              Date: Sat, 26 Mar 2016 22:25:55 GMT
              Content-Type: text/html; charset=UTF-8
              Link: <http://www.example-over-http.com/wp-json/>; rel="https://api.w.org/"
              X-Varnish: 360795 360742
              Age: 467
              Via: 1.1 varnish-v4
              Transfer-Encoding: chunked
              Connection: keep-alive
              Accept-Ranges: bytes
            Length: unspecified [text/html]
            Saving to: \u2018index.html.2\u2019

            index.html              [ <=>                  ]  12.17K  --.-KB/s   in 0s

            2016-03-27 00:33:42 (138 MB/s) - \u2018index.html.2\u2019 saved [12459]

    The third line specifies the connection port number: `80`. The backend server is correctly identified: `Server: nginx/1.6.2`. And the traffic passes through Varnish as intended: `Via: 1.1 varnish-v4`. The period of time the object has been kept in cache by Varnish is also displayed in seconds: `Age: 467`.

2.  To test the SSL-encrypted website, run the same command, replacing the URL:

        wget -SS https://www.example-over-https.com

    The output should be similar to that of the HTTP-only site.

    {{< note >}}
If you're using a self-signed certificate while testing, add the `--no-check-certificate` option to the `wget` command:

wget -SS --no-check-certificate https://www.example-over-https.com
{{< /note >}}

## Next Steps

By using nginx in conjunction with Varnish, the speed of any WordPress website can be drastically improved while making best use of your hardware resources.

You can strengthen the security of the SSL connection by generating a [custom Diffie-Hellman (DH) parameter](/docs/web-servers/nginx/nginx-ssl-and-tls-deployment-best-practices/#create-a-custom-diffie-hellman-key-exchange), for a more secure cryptographic key exchange process.

An additional configuration option is to enable Varnish logging for the plain HTTP website, since now Varnish will be the first to receive the client requests, while nginx only receives requests for those pages that are not found in the cache. For SSL-encrypted websites, the logging should be done by nginx because client requests pass through it first. Logging becomes even more important if you use log monitoring software such as [Fail2ban](/docs/security/using-fail2ban-for-security), Awstats or Webalizer.

---
slug: getting-started-with-nginx-part-2-advanced-configuration
description: "Configure and optimize NGINX to best suit your web server needs. Host multiple sites, configure caching, disable content sniffing, and more."
keywords: ["nginx", "web server", "nginx configuration", "multiple sites", "configure caching"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-servers/nginx/configure-nginx-for-optimized-performance/','/web-servers/nginx/slightly-more-advanced-configurations-for-nginx/','/websites/nginx/configure-nginx-for-optimized-performance/', '/guides/slightly-more-advanced-configurations-for-nginx/']
modified: 2021-12-29
modified_by:
  name: Linode
published: 2018-02-09
title: "Getting Started with NGINX (Part 2): Advanced Configuration"
title_meta: "Getting Started with NGINX: Advanced Configuration"
tags: ["web server","nginx"]
image: Getting-Started-with-NGINX-Part-2-smg.jpg
authors: ["Linode"]
---

![Getting Started with NGINX - Part 2](Getting-Started-with-NGINX-Part-2-smg.jpg)

## Before You Begin

-   This guide is Part 2 of our *Getting Started with NGINX* series, and you will need a working NGINX setup with a website accessible via HTTP. If you do not already have that, complete [Part 1: Basic Installation and Setup](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/).

-   You will need root access to the system, or a user account with `sudo` privilege.

-   You may want to make another backup of your `nginx.conf` so you have a snapshot of the work you've done up to this point:

        cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup-pt2

## Configuration Notes

The internet has no shortage of sites, posts, and other places listing "tuning", "tweaking", or "optimizing" procedures for NGINX.

However, rarely are these configurations tested to deduce if there is in fact a performance increase. Of those that are, the author's use case may be completely different than yours, so there's no guarantee you'll experience the same benefit using their configuration.

Favor simplicity and your own results; do not blindly follow tuning guides you find on the internet which haphazardly present their configuration as one-size-fits-all advice. There are some config options which are virtually universal, and we use many of them in this series. Beyond that, you could actually be decreasing your server's performance and/or security.

Truly advanced system tuning for web services, such as adjusting Linux kernel parameters and TCP stack functionality, is out of the scope of this series. If you would like to explore the topic further, a good place to start is [this NGINX blog post](https://www.nginx.com/blog/tuning-nginx/).

## Host Multiple Websites

In NGINX speak, a *Server Block* basically equates to a website (same as *Virtual Host* in Apache terminology). NGINX can host multiple websites, and **each site's configuration should be in its own file**, with the name formatted as `example.com.conf`. That file should be located at `/etc/nginx/conf.d/`.

If you then want to disable the site *example.com*, then rename `example.com.conf` to `example.com.conf.disabled`. When hosting multiple sites, be sure to separate their access and error logs with specific directives inside each site's server block. See [*Server Block Examples*](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/) in the NGINX docs for more information.

1.  Provided that you already have one site configuration running on NGINX, all the second site's configuration file needs is a server block inside:

    {{< file "/etc/nginx/conf.d/example2.com.conf" nginx >}}
server {
    listen       80;
    listen       [::]:80;
    server_name  example2.org www.example2.org;
    access_log   logs/example2.access.log main;
    error_log    logs/example2.error error;

    root         /var/www/example2.com/;
}
{{< /file >}}

2.  Reload NGINX:

        nginx -s reload

    Your second website should be visible at its domain and/or IP address.

## Basic NGINX Caching

NGINX can cache files served by web applications and frameworks such as WordPress, Drupal and Ruby on Rails. Though covering caching at this point steps out of the basic workflow so far (we haven't set up any application with data to cache yet), it's worth mentioning here briefly.

For more information, see the [NGINX docs](https://nginx.org/en/docs/http/ngx_http_proxy_module.html), [NGINX admin guide](https://www.nginx.com/resources/admin-guide/content-caching/), and the [NGINX blog](https://www.nginx.com/blog/nginx-caching-guide/).

1.  Create a folder to store cached content:

        mkdir /var/www/example.com/cache/

2.  Add the `proxy_cache_path` directive to NGINX's `http` block. Make sure the file path references the folder you just created in Step 1.

      {{< file "/etc/nginx/nginx.conf" nginx >}}
proxy_cache_path /var/www/example.com/cache/ keys_zone=one:10m max_size=500m inactive=24h use_temp_path=off;
{{< /file >}}

    * `keys_zone=one:10m` sets a 10 megabyte shared storage zone (simply called `one`, but you can change this for your needs) for cache keys and metadata.

    * `max_size=500m` sets the actual cache size at 500 MB.

    * `inactive=24h` removes anything from the cache which has not been accessed in the last 24 hours.

    * `use_temp_path=off` writes cached files directly to the cache path. This setting is [recommended by NGNIX](https://www.nginx.com/blog/nginx-caching-guide/).

3.  Add the following to your site configuration's `server` block. If you changed the name of the storage zone in the previous step, change the directive below from `one` to the zone name you chose.

    Replace *ip-address* and *port* with the URL and port of the upstream service whose files you wish to cache. For example, you would fill in `127.0.0.1:9000` if using [WordPress](https://www.nginx.com/resources/wiki/start/topics/recipes/wordpress/) or `127.0.0.1:2638` with [Ghost](https://docs.ghost.org/v1/docs/config#section-server).

    {{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
proxy_cache one;
    location / {
    proxy_pass http://ip-address:port;
    }
{{< /file >}}

4.  If you need to clear the cache, [the easiest way](http://nginx.2469901.n2.nabble.com/best-way-to-empty-nginx-cache-td3017271.html#a3017429) is with the command:

        find /var/www/example.com/cache/ -type f -delete

    If you want more than just a basic cache clear, you can use the [proxy_cache_purge](https://www.nginx.com/products/nginx/caching/#purging) directive.

## HTTP Response Header Fields

Use [*add_header*](https://nginx.org/en/docs/http/ngx_http_headers_module.html) directives in your configuration carefully. Unlike other directives, an `add_header` directive is not inherited from parent configuration blocks. If you have the directive in both, an `add_header` directive in a `server` block will override any in your `http` area.

For this reason, you should include them in one of two different ways:

* Put all `add_header` directives in the `http` block. This isn't practical unless you want every header directive to apply to every site in your configuration.

* Add the desired `add_header` directives only to the `server` block (or an [include file](https://nginx.org/en/docs/ngx_core_module.html#include)) of the site you want those directives applied to. This is the best scenario if you have multiple websites and want some header directives applied to some sites, but not all sites you're hosting.

Below are some of the more universally-applicable header modifications. There are many more available, and you should read through the [OWASP Secure Headers Project](https://www.owasp.org/index.php/OWASP_Secure_Headers_Project) for more information.

### Disable Content Sniffing

Content sniffing allows browsers to inspect a byte stream in order to determine the file format of its contents. It is generally used to help sites that do not correctly identify the MIME type of their content, but it also presents a vector for cross-site scripting and other attacks. To disable content sniffing, add the following line to your configuration's `http` block:

    add_header X-Content-Type-Options nosniff;

### Limit or Disable Content Embedding

Content embedding is when a website renders a 3rd party element (div, img, etc.), or even an entire page from a completely different website, in a  `<frame>`, `<iframe>`, or `<object>` HTML block on its own site.

The `X-Frame-Options` HTTP header stops content embedding so your site can't be presented from an embedded frame hosted on someone else's website, one undesirable outcome being a clickjacking attack. See [*X-Frame-Options, Mozilla Developer Network*](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) for more information.

To disallow the embedding of your content from any domain other than your own, add the following line to your configuration:

    add_header X-Frame-Options SAMEORIGIN;

To disallow embedding entirely, even from within your own site's domain:

    add_header X-Frame-Options DENY;

### Cross-Site Scripting (XSS) Filter

This header signals to a connecting browser to enable its cross-site scripting filter for the request responses. XSS filtering is usually enabled by default in modern browsers, but there are occasions where it's disabled by the user. Forcing XSS filtering for your website is a security precaution, especially when your site offers dynamic content like login sessions:

    add_header X-XSS-Protection "1; mode=block";

See the [X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) page on MDN for more information and other options.

### Referrer Policy

This header controls policy of referrer information that should be included with requests. The example below sends the origin, path, and query string when performing a *same-origin* request. For secure (HTTPS -> HTTPS) *cross-origin* requests, only the origin is sent.

    add_header Referrer-Policy strict-origin-when-cross-origin;

See the [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) page on MDN for more information and other options.

### Content Security Policy

Another way to minimize cross-site scripting attacks is by only allowing user agents to load resources specified in the directives of this header. For example, to only allow loading resources from the same origin (URL and port number), and to upgrade insecure requests (HTTP) to HTTPS:

    add_header Content-Security-Policy "default-src 'self'; upgrade-insecure-requests;";

See the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) on MDN for complete list of directives.

### Feature Policy (Experimental)

You can allow or deny browser features with this header, depending on whether your site and browser supports the feature. This header should be set on a per site basis. For example, to allow the site to use encrypted media on the same origin and deny automatic playing media without user actions, you could add the following line:

    add_header Feature-Policy "encrypted-media 'self'; autoplay 'none'";

## Configuration Recap

To summarize where we are so far:

* We're continuing with the configuration from [Part 1](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/#configuration-recap), so we have a single site being served over HTTP.

* We've added the caching and HTTP header changes mentioned above.

* The site's configuration file looks like this:

    {{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen         80 default_server;
    listen         [::]:80 default_server;
    server_name    example.com www.example.com;
    root           /var/www/example.com;
    index          index.html;

    proxy_cache one;
        location / {
            proxy_pass http://localhost:8000;
        }

    gzip             on;
    gzip_comp_level  3;
    gzip_types       text/html text/plain text/css image/*;

    add_header     Feature-Policy "encrypted-media 'self'; autoplay 'none'"
}
{{< /file >}}

* Here is the server's `nginx.conf` file. Again, our additions are at the bottom of the block so we know what we added:

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

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;


    add_header    X-Content-Type-Options nosniff;
    add_header    X-Frame-Options SAMEORIGIN;
    add_header    X-XSS-Protection "1; mode=block";
    add_header    Referrer-Policy strict-origin-when-cross-origin;
    add_header    Content-Security-Policy "default-src 'self'; upgrade-insecure-requests;";

    proxy_cache_path    /var/www/example.com/cache/ keys_zone=one:10m inactive=60m use_temp_path=off;
    server_tokens       off;
}
{{< /file >}}

## Part 3: Enable TLS for HTTPS Connections

If a well-running HTTP site is all you're looking for, the configurations in this guide will meet that requirement. If you plan to serve your site over HTTPS, then continue to Part 3 of this series: [Enable TLS for HTTPS Connections](/docs/guides/getting-started-with-nginx-part-3-enable-tls-for-https/).

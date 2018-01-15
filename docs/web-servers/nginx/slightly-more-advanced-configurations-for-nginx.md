---
author:
  name: Linode
  email: docs@linode.com
description: 'Configure and optimize NGINX.'
keywords: ["nginx", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/configure-nginx-for-optimized-performance/','web-servers/nginx/how-to-configure-nginx/']
modified: 2018-01-09
modified_by:
  name: Linode
published: 2018-01-09
title: 'Getting Started with NGINX - Part 2: (Slightly More) Advanced Configurations'
---

## Before You Begin

- This guide is part 2 of our *Getting Started with NGINX* series and you will need a working NGINX setup with a website accessible via HTTP. If do not already have that, then complete [Part 1: Basic Installation and Setup](/docs/web-servers/nginx/nginx-installation-and-basic-setup/).

- You will need root access to the system, or a user account with `sudo` privileges.

- You may want to make another backup of your `nginx.conf` so you have a snapshot of the work you've done up to this point.

        cp etc/nginx/nginx.conf etc/nginx/nginx.conf.backup-pt2


## Configuration Notes

The internet has no shortage of sites, posts, Gists and other places listing vast amounts of "tuning", "tweaking", or "optimizing" procedures for NGINX.

However, rarely are these configurations tested to deduce if there is in fact a performance increase. Of those that are, the author's use case may be completely different than yours, so there's no guarantee you'll experience the same benefit using their configuration.

Favor simplicity and your own results; do not blindly follow tuning guides you find on the internet which haphazardly present their configuration as one-size-fits-all advice. There are some config options which are virtually universal, and we use many of those in this series. Beyond that, you could actually be decreasing your server's performance and/or security.

Truly advanced system tuning for web services, such as adjusting Linux kernel parameters and TCP stack functionality, is out of the scope of this series. If you would like to explore the topic further though, take a look at [this NGINX blog post](https://www.nginx.com/blog/tuning-nginx/) to start.


## Hosting Multiple Websites

In NGINX speak, a *server block* basically equates to a website (same as *virtual host* in Apache terminology). NGINX can host multiple websites, and **each site's configuration should be in its own file**, with the name formatted as `example.com.conf` and that file located at `/etc/nginx/conf.d/`.

If you then want to disable the site *example.com*, then rename `example.com.conf` to `example.com.conf.disabled`. When hosting multiple sites, be sure to separate their access and error logs with specific directives inside each site's server block. See *[Server Block Examples](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/)* in the NGINX docs for more info.

1.  All the second site's configuration file needs is a server block inside:

    {{< file "/etc/nginx/conf.d/example2.com.conf" nginx >}}
server {
    listen       80;
    listen       [::]:80;
    server_name  example2.org www.example2.org;
    access_log   logs/example2.access.log main;
    error_log    logs/example2.error error;

    root         /var/www/example2.com/;
        ...
    }
{{< /file >}}

2.  Then reload NGINX. Your second website should be visible at its domain and/or IP address:

        nginx -s reload


## Enable Basic Caching

For more information, see the [NGINX docs](https://nginx.org/en/docs/http/ngx_http_proxy_module.html), [NGINX admin guide](https://www.nginx.com/resources/admin-guide/content-caching/), and the [NGINX blog](https://www.nginx.com/blog/nginx-caching-guide/).

1. Create a folder to store cache content:

        mkdir /var/www/example.com/cache/

2.  Add the `proxy_cache_path` directive to NGINX's `http { }` block. Make sure the file path references the folder you just created above. The full directive with options we're using is:

        proxy_cache_path /var/www/example.com/cache/ keys_zone=one:10m inactive=60m use_temp_path=off;

    - `keys_zone=one:10m` sets a 10 megabyte shared storage zone (simply called *one*, but you can change this for your needs) for cache keys and metadata.

    - `inactive=60m` removes anything from the cache which has not been access in the last 60 minutes.

    - `use_temp_path=off` writes cache files directly to the cache path. [Recommended by NGNIX](https://www.nginx.com/blog/nginx-caching-guide/).


3.  Add the following to your site configuration's `server { }` block. If you changed the name of the storage zone in the step above, make sure you change the directive below from *one* to the zone name you chose.

    {{< file "/etc/nginx/conf.d/example.com" nginx >}}
proxy_cache one;
    location / {
    proxy_pass http://localhost:8000;
    }
{{< /file >}}


## HTTP Response Header Fields

Use *[add_header](https://nginx.org/en/docs/http/ngx_http_headers_module.html)* directives in your configuration carefully. Unlike other directives, an `add_header` directive is not inherited from parent configuration blocks if you have the directive in both, meaning an `add_header` directive in a `server { }` block will cancel out any in your `http { }` area.

For this reason, you should include them in one of two different ways:

- Put all `add_header` directives in the `http { }` block. This isn't practical if you don't want every header directive to apply to every site in your configuration.

-  Add the desired `add_header` directives only to the `server { }` block (or an [include](https://nginx.org/en/docs/ngx_core_module.html#include) file) of the site you want those directives to apply to. This is the best scenario if you have multiple websites and want some header directives applied to some sites, but not all sites you're hosting.

Below are some of the more universally-applicable header modifications. There are many more available, and you should read through the [OWASP Secure Headers Project](https://www.owasp.org/index.php/OWASP_Secure_Headers_Project) for more information.


### Disable Content Sniffing

Content sniffing allows browsers to inspect a byte stream in order to determine the file format of its contents. It is generally used to help sites that do not correctly identify the MIME type of their web content, but it also presents a vulnerability to cross-site scripting and other attacks. To disable content sniffing, add the following line to your configuration's `http { }` block:

    add_header X-Content-Type-Options nosniff;

### Limit or Disable Content Embedding

Content embedding is when a website renders a 3rd party element (div, img, etc.), or even an entire page from a completely different website, in a  `<frame>`, `<iframe>`, or `<object>` HTML block on their own site.

The `X-Frame-Options` HTTP header stops content embedding so your site can't be presented from an embedded frame hosted on someone else's website, with a worst-case scenario being a clickjacking attack. See *[X-Frame-Options, Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)* for more information.

To disallow the embedding of your content from any domain other than your own, add the following line to your configuration:

    add_header X-Frame-Options SAMEORIGIN;

If you'd like to disallow embedding entirely, even from within own site's domain, use:

    add_header X-Frame-Options DENY;


### Cross-Site Scripting Filter

This header signals to a connecting browser to enable its cross-site scripting filter for the request responses. XSS filtering is usually enabled by default in modern browsers, but there are occasions where it's disabled by the user. Forcing XSS filtering for your website is a security precaution, especially when your site offers dynamic content like login sessions.

    add_header X-XSS-Protection "1; mode=block";


## Configuration Recap

To summarize where we are thus far:

- We're continuing with the configuration from [part 1](http://localhost:1313/docs/web-servers/nginx/nginx-installation-and-basic-setup/#configuration-recap), so we have a single site being served over HTTP.

- We've added the caching and HTTP header changes mentioned above.

- The site's configuration file is given below:

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
}
{{< /file >}}

- Here's the server's `nginx.conf` file. Again, our additions are at the bottom of the block so we know what we added.

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

    proxy_cache_path    /var/www/example.com/cache/ keys_zone=one:10m inactive=60m use_temp_path=off;
    server_tokens       off;
}
{{< /file >}}


## Part 3: Enable TLS for HTTPS Connections

If a well-running HTTP site is all you're looking for, the this page's configuration recap will meet that requirement. If you plan to serve your site over HTTPS, then move to part 3 of this series: [Enable TLS for HTTPS Connections](/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/).

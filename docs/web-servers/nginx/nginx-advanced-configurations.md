---
author:
  name: Linode
  email: docs@linode.com
description: 'Getting started with assessing, installing and configuring NGINX.'
keywords: ["nginx", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/configure-nginx-for-optimized-performance/','web-servers/nginx/how-to-configure-nginx/']
modified: 2018-01-09
modified_by:
  name: Linode
published: 2018-01-09
title: 'Getting Started with NGINX - Part 2: (A bit more) Advanced Configuration'
---


## Before You Begin

- This guide is Part 2 of our Getting Started with NGINX series and you will need a working NGINX setup with your site accessible via HTTP. If do not have that, then complete [Part 1: Basic Installation and Setup](web-servers/nginx/nginx-basic-installation-and-setup).

- You will need root access to the system, or a user account with `sudo` privileges.

- You may want to make another backup of your `nginx.conf` so you have a snapshot of the work you've done up to this point.

        mv etc/nginx/nginx.conf etc/nginx/nginx.conf.backup-pt2


## Hosting Multiple Websites

In NGINX speak, a *server block* basically equates to a website (same as *virtual host* in Apache terminology). NGINX can host multiple websites, and each site's configuration should be in a file named as `example.com.conf` located at `/etc/nginx/conf.d/`. If you then want to disable a site, rename the `example.com.conf` file to `example.com.conf.disabled`. When hosting multiple sites, be sure to separate the access and error logs from each other with specific directives inside each site's server block.

1.  All the site file needs is a server block inside:

    {{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
    server {
        listen      80;
        server_name example.org www.example.org;
        access_log logs/example.access.log main;
        error_log logs/example.error error;

        root /var/www/example.com/htd
        ...
    }
{{< /file >}}

2.  Then reload NGINX. Your site should be visible at its domain and/or IP address:

        nginx -s reload

See [Server Block Examples](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/) in the NGINX docs for more info.

## Enable Caching

## Keepalive Timespan





## HTTP Response Header Fields

Be careful when using `add_header` directives in your configuration. They are not inherited from parent configuration blocks, meaning an `add_header` directive to a `server { }` block will cancel out any you may have in your `http { }` block.

For this reason, you should add them in one of three different ways:

- All in the `http { }` block. May not be practical if you don't want to apply every `add_header` directive to every site in your configuration.

- Add an `include` location to the relevant `server { }` block. This ensures you can assign different header directives to different sites. An example of that would look like:

https://nginx.org/en/docs/http/ngx_http_headers_module.html


https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#tab=Headers


**Disable Content Sniffing**

Content sniffing allows browsers to inspect a byte stream in order to determine the file format of its contents. It is generally used to help sites that do not correctly identify the MIME type of their web content, but it also presents a vulnerability to cross-site scripting and other attacks. To disable content sniffing, add the following line to your configuration's `http { }` block:

        add_header    X-Content-Type-Options nosniff;

- **Limit or Disable Content Embedding**

    The `X-Frame-Options` header allows or disallows a browser (a [modern browser](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options#Browser_compatibility), because not all browsers support `X-Frame-Options`), to render a page in a  `<frame>`, `<iframe>`, or `<object>` HTML blocks. This is usually not specified by default, so your site's content could be embedded into other sites' HTML code, with a worst-case scenario being a clickjacking attack. 

    To disable the embedding of your content from any domain other than your own, add the following line to your configuration:

        add_header    X-Frame-Options SAMEORIGIN;

    If you'd like to disallow embedding altogether, you can replace `SAMEORIGIN` with `DENY`. See *[X-Frame-Options, Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)* for more information.

- **Cross-Site Scripting Filter**
    This header signals to a user's browser to enable cross-site scripting filter for the request responses. XSS filtering is usually enabled by default in modern browsers, but there are occasions where it's disabled by the user. Forcing XSS filtering for your website is a security precaution, especially when your site offers dynamic content like login sessionsß.

        add_header    X-XSS-Protection "1; mode=block";


## Part 3: Configure HTTPS
---
author:
  name: Linode
  email: docs@linode.com
description: 'Assessing, installing, and configuring NGINX.'
keywords: ["nginx", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/configuration/ssl/','security/ssl/ssl-certificates-with-nginx/index.cfm/','web-servers/nginx/install-nginx-web-server-on-debian-8/','web-servers/nginx/how-to-install-nginx-on-debian-7-wheezy/']
modified: 2018-01-09
modified_by:
  name: Linode
published: 2018-01-09
title: 'Getting Started with NGINX - Part 1: Installation and Basic Setup'
---

This series will walk you through installing NGINX Open Source from the NGINX repositories, ***

## Before You Begin

- You will need root access to the system, or a user account with `sudo` privileges.

- Set your system's [hostname](/docs/getting-started/#setting-the-hostname).

- System's firewall.***

- Fully update your system's packages.


## Installing NGINX

### Stable vs. Mainline

The first decision you'll have to make about your installation is whether you want the *stable* or *mainline* version of NGINX Open Source. Stable is recommended, and will be what this series uses. More on NGINX versions [here](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/#stable_vs_mainline).

### Binary vs. Compiling

There are three primary ways to install NGINX Open Source. Two are from pre-built binaries, one is to manually compile from source code.

- A pre-built binary from your Linux distribution's repositories. This is the easiest installation method because you simply use your package manager to install the `nginx` package. However, for distributions which provide binaries (as opposed to build scripts), you'll be running an older version of NGINX than the current stable or mainline release. Patches are also slightly slower to come to distro repositories from upstream.

- A pre-built binary from NGINX Inc.'s repository. Still an easy installation process, requiring only to add the repository to your system and then install as normal. Has the benefit of the most vanilla, upstream configuration by default, with quicker updates and newer releases than a Linux distribution's repository. Compile-time options often differ from those of the NGINX binary in distribution repositories, and you can use `nginx -V` to see the compile options your binary was built with. **This is the installation method used in this series.**

- Compiling from source. The most complicated method of installation but still not difficult when following [NGINX's documentation](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/). Source code is still updated frequently with patches and maintained at the newest stable or mainline releases, and building can be easily automated. This is the most customizable installation method because you can include or omit any compiling options and flags you choose. For example, one common reason people compile their own NGINX build is so they can use the server with a newer version of OpenSSL than what their Linux distribution provides.

### Installation Instructions

NGINX, Inc. has so well documented the installation process that it would be useless to recreate here. The [NGINX admin guide](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/) gives clear and accurate instructions for any installation method and NGINX version you choose. Use it to complete your installation, then return here to continue the series.


## Configuration Notes

As use of NGINX the product has grown, the company has worked to distance itself from configurations and terminology that were used in the past when trying to ease adoption for people already accustomed to Apache.

If you're at all familiar with Apache, you'll know that multiple sites (called *virtual hosts* in Apache terminology) are stored at `/etc/apache/sites-available/`, which symlink to files in `/etc/apache/sites-enabled/`. However, you'll find many guides and blog posts on NGINX dictating this same configuration. As you could expect, this has led to some confusion, and the assumption that NGINX regularly uses the `../sites-available/` and `../sites-enabled/` directories, and the `www-data` user. It does not.

Sure, it can. The NGINX packages in Debian and Ubuntu repositories have changed their configurations to this for quite a while now, so serving sites whose configuration files are stored in `/sites-available/` and symlinked to `/sites-enabled/` is certainly a working setup. However it is entirely unnecessary, and the Debian Linux family is the only one which does it. NGINX is NGINX, so use it as NGINX. Don't force Apache configurations onto a web server that isn't Apache.

Instead, multiple site configuration files should be stored in `/etc/nginx/conf.d/` as `example.com.conf`, or `example.com.disabled`. Do not add `server { }` blocks directly to `/etc/nginx/nginx.conf` either, even if your configuration is relatively simple. The NGINX process also runs as the username `ngnix` in the `nginx` group, so keep that in mind when adjusting permissions for website directories. For more information, see *[Creating NGNIX Plus Configuration Files](https://www.nginx.com/resources/admin-guide/configuration-files/)* .

Last, [as the NGINX docs point out](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/), the term *virtual host* is an Apache term, even though it's used by Debian and Ubuntu `nginx.conf` file supplied from the repos, and some of NGINX's old documentation. A *server block* is the NGINX equivalent, so that is the phrase you'll see in this series on NGINX.


## Configure for General Best Practices

There is an endless amount of customizations you can do to NGINX to fit it better to your needs. Many of those will be exclusive to your use case though; what works great for one person may not work at all for another.

This series will provide configurations that are general enough to be useful in just about any production scenario, but which you can build on for your own specialized setup. Everything in the section below is considered a best practice and none are reliant on each other. They're not essential to the function of your site or server, but they can have ugly consequences if disregarded.

Two quick points:

- Before going further, first preserve the default `nginx.conf` file so you have something to restore to if your customizations get so convoluted they don't work.

        cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup-original

- After implementing a change below, you'll want to reload your configuration with:

        nginx -s reload


### Set the NGINX Root Directory

Where NGNIX sets its root directory will differ depending on how you installed it. At the time of this writing, NGINX supplied from NGINX Inc.'s repository uses `/usr/share/nginx/`.

The NGINX docs warn that relying on the default location can result in the loss of site data when upgrading NGINX. In short, use `/var/www`, `/srv`, or some other location that won't be touched by package updates/upgrades. For more explanation, see *[Using the default document root](
https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#using-the-default-document-root)* and *[Not using standard document root locations](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#not-using-standard-document-root-locations)*.

This series will use `/var/www/example.com/` in its examples. The root directory for your site or sites should be added to their corresponding `server { }` block in your configuration, so for example:

{{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen         80;
    server_name    example.com;
    root           /var/www/example.com;
}
{{< /file-excerpt >}}

Once you specify the root location, don't forget to create the directory and give the `nginx` user read/write access to it.

    mkdir -p /var/www/example.com
    chown -R nginx:nginx /var/www/example.com


### Use Multiple Worker Processes

Add the following to `/etc/nginx/nginx.conf`, in the area just before the `http { }` block. This is called the `main { }` block, or context, though it's not marked in `nginx.conf` like the `http { }` block is. The first choice would be to set it to `auto`, or the amount of CPU cores available to your Linode.

    worker_processes    auto;

For more information, see the sections on worker processes in [the NGINX docs](https://nginx.org/en/docs/ngx_core_module.html#worker_processes) and [this blog post](https://www.nginx.com/blog/tuning-nginx/).


### Disable Server Tokens

NGINX's version number is visible by default with any connection made to the server, whether a successful 201 connection by cURL, or a 404 returned to a browser. Disabling server tokens makes it more difficult to determine NGINX's version, and therefore more difficult to implement version-specific attacks.

Server tokens enabled:

![NGNINX server tokens enabled](/docs/assets/nginx-server-tokens-enabled.jpg)

Server tokens disabled:

![NGINX server tokens disabled](/docs/assets/404_Not_Found_Server_Tokens_Off.jpg)

Add the following line to the `http { }` block of `/etc/nginx/nginx.conf`:

    server_tokens    off;


### Listen on Your Public IP Addresses

Your Linode has one public IPv4 address and one public IPv6 address by default (read how to find them [here](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/). These are the primary IP addresses your domain registrar will resolve to for users connecting to your site. Default NGINX configurations listen on port 80 and on all IP addresses. Example:

    listen    80;

NGINX only needs to listen for incoming traffic on your server's public IPs. It's better to be precise and absolute in configuration files than vague, so specify the IP addresses you want NGINX listening on. This is also useful when your system binds specific IPs to network interfaces.

Additionally, NGINX listens only on your server's public IPv4 address by default. Unless you intend your site to be inaccessible over IPv6 (or are unable to provide it for some reason), NGINX should also listen for incoming IPv6 traffic. Add the line below to your configuration's `server { }` block. Replace the example IP addresses with your Linode's public IPv4 and IPv6 address.

    server {
        listen     203.0.113.0:80 default_server;
        listen     [2001:DB8:32]:80 default_server;
        }

The `default_server` parameter assigns that server block as the default for those IP:port pairs. See the [NGINX docs](https://nginx.org/en/docs/http/ngx_http_core_module.html#listen) for more info on the `listen` directive.

{{< note >}}
Should your server's IP addresses change for any reason, you will need to update this config to reflect the new IPs.
{{< /note >}}

### About Compression

You do not want to universally enable gzip compression on any web server because, depending on your site's content and whether you set session cookies, you risk vulnerability to [CRIME](https://en.wikipedia.org/wiki/CRIME) and [BREACH](http://www.breachattack.com/) exploits.

Compression has been disabled in NGNINX [for years now](http://mailman.nginx.org/pipermail/nginx/2012-September/035600.html), so is not vulnerable to CRIME out of the box. Modern browsers have also taken steps to mitigate these exploits, but web servers can still be configured irresponsibly.

On the other hand, if you leave gzip compression totally disabled, you rule out those vulnerabilities and use less CPU cycles, but at the expense of decreasing your site's performance. There are various server-side mitigations possible and TLS 1.3 will further contribute to minimizing the risk of compressing encrypted data, but for now, and unless you know what you're doing, the best solution is to compress only static site content such as images and HTML, CSS, markdown, or other text files. You can view all available mime types with `cat /etc/nginx/mime.types`.

To do that, you would add what's below to your configuration. Though `gzip` directives can go in the `http { }` block if you want it to apply to all sites served by NGINX, it's safer to use it only inside `server { }` blocks for individual sites and content types.

    gzip          on;
    gzip_types    text/html text/plain text/css image/*;


In cases where NGINX is serving multiple websites, some using SSl/TLS and some not, an example will look like below. The `gzip` directive is added to the HTTP site's `server { }` block, which ensures it remains disabled for any HTTPS sites.

    server {
        listen         80;
        server_name    example1.com;
        gzip           on;
        gzip           types text/html text/css image/*;
    }

    server {
        listen         443 ssl;
        server_name    example2.com;
        gzip           off;
    }

There are various other options available to NGINX's gzip module. See the [NGINX docs]](https://nginx.org/en/docs/http/ngx_http_gzip_module.html) for more info, and if if you prefer to compile you NGINX build, you can include the *[ngx_http_gzip_static_module](https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html)* which would further suit compression of static content.


## Configuration Recap

To summarize where we are thus far:

- The *stable* version of NGINX Open Source was installed from the *nginx.org* repository.

- We have one basic website accessible, whose root directory is located at `/var/www/example.com` and configuration file is located at `/etc/nginx/conf.d/example.com.conf`.

    {{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen         203.0.113.0:80 default_server;
    listen         [2001:DB8:32]:80 default_server;
    server_name    example.com;
    root           /var/www/example.com;
    index          index.html;

    gzip    on;
    gzip_comp_level 3;
    gzip_types    text/html text/plain text/css image/*;
}
{{< /file >}}

- Changes we want NGINX to apply universally were added to the `html { }` block of `/etc/nginx/nginx.conf`. Our changes were put at the bottom of the block so we know what we added compared to what is provided by default. `nginx.conf` now looks like below. Note that `nginx.conf` does not contain any `server { }` blocks.

    {{< file "/etc/nginx/conf" nginx >}}
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


    server_tokens       off;
    add_header    X-Content-Type-Options nosniff;
    add_header    X-Frame-Options SAMEORIGIN;
    add_header    X-XSS-Protection "1; mode=block";
}
{{< /file >}}


## Part 2: (a bit more) Advanced Configuration

This page got you set up with a base installation and a some foundational settings to get you started. [Part 2](/docs/web-servers/nginx/nginx-advanced-configurations.md) of this series gets more advanced with its configurations, but still applicable to anyone hosting a site on a Linode.
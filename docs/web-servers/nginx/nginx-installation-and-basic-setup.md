---
author:
  name: Linode
  email: docs@linode.com
description: 'Assessing, installing, and configuring NGINX.'
keywords: ["nginx", "web server", "configure nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/configuration/ssl/','security/ssl/ssl-certificates-with-nginx/index.cfm/','web-servers/nginx/install-nginx-web-server-on-debian-8/','web-servers/nginx/how-to-install-nginx-on-debian-7-wheezy/']
modified: 2018-01-09
modified_by:
  name: Linode
published: 2018-01-09
title: 'Getting Started with NGINX - Part 1: Installation and Basic Setup'
---

This guide is the first of a four-part series. Parts one and two will walk you through installing NGINX Open Source from the NGINX repositories and making some configuration changes to increase performance and security. Parts three and four set up NGIX to serve your site over HTTPS and harden the TLS connection.

## Before You Begin

- You will need root access to the system, or a user account with `sudo` privileges.

- Set your system's [hostname](/docs/getting-started/#setting-the-hostname).

- Update your system.


## Install NGINX

### Stable vs. Mainline

The first decision you'll have to make about your installation is whether you want the *stable* or *mainline* version of NGINX Open Source. Stable is recommended, and will be what this series uses. More on NGINX versions [here](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/#stable_vs_mainline).

### Binary vs. Compiling

There are three primary ways to install NGINX Open Source.

- A pre-built binary from your Linux distribution's repositories. This is the easiest installation method because you simply use your package manager to install the `nginx` package. However, for distributions which provide binaries (as opposed to build scripts), you'll be running an older version of NGINX than the current stable or mainline release. Patches can also be slower to land in distro repositories from upstream.

- A pre-built binary from NGINX Inc.'s repository. Still an easy installation process, requiring only to add the repository to your system and then install as normal. Has the benefit of the most vanilla, upstream configuration by default, with quicker updates and newer releases than a Linux distribution's repository. Compile-time options often differ from those of the NGINX binary in distribution repositories, and you can use `nginx -V` to see the compile options your binary was built with. **This is the installation method used in this series.**

- Compiling from source. This is the most complicated method of installation but still not difficult when following [NGINX's documentation](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/). Source code is updated frequently with patches and maintained at the newest stable or mainline releases, and building can be easily automated. This is the most customizable installation method because you can include or omit any compiling options and flags you choose. For example, one common reason people compile their own NGINX build is so they can use the server with a newer version of OpenSSL than what their Linux distribution provides.

### Installation Instructions

This guide will use the official NGINX instructions for installing pre-built binaries on Ubuntu from the NGINX repository. See the [NGINX admin guide](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/) if you would like to use another distribution or installation method.

1.  Add the NGINX signing key:

        wget http://nginx.org/keys/nginx_signing.key
        apt-key add nginx_signing.key

2.  Open `/etc/apt/sources.list` in a text editor and add the following two lines. Replace **codename** with the codename of your Ubuntu version (for example **xenial** for Ubuntu 16.04).

      {{< file-excerpt "/etc/apt/sources.list" conf >}}
deb http://nginx.org/packages/mainline/ubuntu/ codename nginx
deb-src http://nginx.org/packages/mainline/ubuntu/ codename nginx
{{< /file-excerpt >}}

3.  Remove any older NGINX installations and update your system:

        apt remove nginx-common
        apt update

4.  Install and start NGINX:

        apt install nginx
        nginx

5.  Verify that NGINX is running on your server:

        curl -I 127.0.0.1

    {{< output >}}
HTTP/1.1 200 OK
Server: nginx/1.11.9
{{< /output >}}

## Configuration Notes

As use of NGINX the product has grown, the company has worked to distance itself from configurations and terminology that were used in the past when trying to ease adoption for people already familiar with Apache.

If you have used Apache, you'll know that multiple sites (called *virtual hosts* in Apache terminology) are stored at `/etc/apache/sites-available/`, which symlink to files in `/etc/apache/sites-enabled/`. However, many guides and blog posts on NGINX recommend this same configuration. As you could expect, this has led to some confusion, and the assumption that NGINX regularly uses the `../sites-available/` and `../sites-enabled/` directories, and the `www-data` user. It does not.

Sure, it can. The NGINX packages in Debian and Ubuntu repositories have changed their configurations to this for quite a while now, so serving sites whose configuration files are stored in `/sites-available/` and symlinked to `/sites-enabled/` is certainly a working setup. However it is entirely unnecessary, and the Debian Linux family is the only one which does it. NGINX is NGINX, so use it as NGINX. Don't force Apache configurations onto a web server that isn't Apache.

Instead, multiple site configuration files should be stored in `/etc/nginx/conf.d/` as `example.com.conf`, or `example.com.disabled`. Do not add `server { }` blocks directly to `/etc/nginx/nginx.conf` either, even if your configuration is relatively simple. The NGINX process also runs as the username `ngnix` in the `nginx` group, so keep that in mind when adjusting permissions for website directories. For more information, see *[Creating NGNIX Plus Configuration Files](https://www.nginx.com/resources/admin-guide/configuration-files/)* .

Last, [as the NGINX docs point out](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/), the term *virtual host* is an Apache term, even though it's used by Debian and Ubuntu `nginx.conf` file supplied from the repos, and some of NGINX's old documentation. A *server block* is the NGINX equivalent, so that is the phrase you'll see in this series on NGINX.


## Configure for General Best Practices

There is an endless amount of customizations you can do to NGINX to fit it better to your needs. Many of those will be exclusive to your use case though; what works great for one person may not work at all for another.

This series will provide configurations that are general enough to be useful in just about any production scenario, but which you can build on for your own specialized setup. Everything in the section below is considered a best practice and none are reliant on each other. They're not essential to the function of your site or server, but they can have ugly consequences if disregarded.

Two quick points:

- Before going further, first preserve the default `nginx.conf` file so you can restore the default configuration if your files become unusable:

        cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup-original

- After implementing each of the changes below, reload your configuration:

        nginx -s reload

### Use Multiple Worker Processes

Add or edit the following line in `/etc/nginx/nginx.conf`. Set this value to `auto`, or the number of CPU cores available to your Linode.

{{< file-excerpt "/etc/nginx/nginx.conf" conf >}}
worker_processes auto;
{{< /file-excerpt >}}

For more information, see the sections on worker processes in [the NGINX docs](https://nginx.org/en/docs/ngx_core_module.html#worker_processes) and [this NGINX blog post](https://www.nginx.com/blog/tuning-nginx/).


### Disable Server Tokens

NGINX's version number is visible by default with any connection made to the server, whether a successful 201 connection by cURL, or a 404 returned to a browser. Disabling server tokens makes it more difficult to determine NGINX's version, and therefore more difficult to implement version-specific attacks.

Server tokens enabled:

![NGNINX server tokens enabled](/docs/assets/nginx-basics/nginx-server-tokens-enabled.jpg)

Server tokens disabled:

![NGINX server tokens disabled](/docs/assets/nginx-basics/404_Not_Found_Server_Tokens_Off.jpg)

Add the following line to the `http { }` block of `/etc/nginx/nginx.conf`:

{{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}
server_tokens off;
{{< /file-excerpt >}}

### Set the NGINX Root Directory

Where NGNIX sets its root directory will differ depending on how you installed it. At the time of this writing, NGINX supplied from NGINX Inc.'s repository uses `/usr/share/nginx/`.

The NGINX docs warn that relying on the default location can result in the loss of site data when upgrading NGINX. You should use `/var/www/`, `/srv/`, or some other location that won't be touched by package or system updates. For more explanation, see *[Using the default document root](
https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#using-the-default-document-root)* and *[Not using standard document root locations](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#not-using-standard-document-root-locations)*.

This series will use `/var/www/example.com/` in its examples; in each instance, replace `example.com` with the IP address or domain name of your Linode.

1.  The root directory for your site or sites should be added to the corresponding `server { }` block in your configuration:

      {{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen         80;
    server_name    example.com;
    root           /var/www/example.com;
}
{{< /file-excerpt >}}

2.  Create the root directory:

        mkdir -p /var/www/example.com

### Serve Over IPv4 and IPv6

Default NGINX configurations listen on port 80 and on all IPv4 addresses. Unless you intend your site to be inaccessible over IPv6 (or are unable to provide it for some reason), you should tell NGINX to also listen for incoming IPv6 traffic.

Add a second `listen` directive for IPv6 as shown below:

{{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen  80;
    listen [::]:80;
{{< /file-excerpt >}}

If your site uses TLS, add the following line:

{{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
listen [::]:443 ssl;
{{< /file-excerpt >}}


{{< note >}}
You can also specify your Linode's public IP addresses for NGINX to listen on. The line would then be, for example, `listen 203.0.113.4:80;`.
{{< /note >}}


### About Compression

You do not want to universally enable gzip compression because, depending on your site's content and whether you set session cookies, you risk vulnerability to [CRIME](https://en.wikipedia.org/wiki/CRIME) and [BREACH](http://www.breachattack.com/) exploits.

Compression has been disabled by default in NGINX [for years now](http://mailman.nginx.org/pipermail/nginx/2012-September/035600.html), so is not vulnerable to CRIME out of the box. Modern browsers have also taken steps against these exploits, but web servers can still be configured irresponsibly.

On the other hand, if you leave gzip compression totally disabled, you rule out those vulnerabilities and use less CPU cycles, but at the expense of decreasing your site's performance.

There are various server-side mitigations possible and TLS 1.3 will further contribute to that, but for now, and unless you know what you're doing, the best solution is to compress only static site content such as images and HTML and CSS.

Enable static asset compression by setting `gzip on` in a `server` block. It is also possible to enable compression for all sites served by NGINX by putting this directive within a `http` block. However, it's safer to use it only inside `server` blocks for individual sites and content types:

{{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    gzip          on;
    gzip_types    text/html text/plain text/css image/*;
}
{{< /file-excerpt >}}

{{< note >}}
You can view all available mime types with `cat /etc/nginx/mime.types`.
{{< /note >}}

Below is an example where NGINX is serving multiple websites, some using SSl/TLS and some not. The `gzip` directive is added to the HTTP site's `server { }` block, which ensures it remains disabled for the HTTPS site.

{{< file "/etc/nginx/conf.d/example1.com.conf" nginx >}}
server {
    listen         80;
    server_name    example1.com;
    gzip           on;
    gzip           types text/html text/css image/jpg image/jpeg image/png image/svg;
}
{{< /file >}}

{{< file "/etc/nginx/conf.d/example2.com.conf" nginx >}}
server {
    listen         443 ssl;
    server_name    example2.com;
    gzip           off;
}
{{< /file >}}

There are various other options available to NGINX's gzip module. See the [NGINX docs](https://nginx.org/en/docs/http/ngx_http_gzip_module.html) for more info, and if if you prefer to compile you NGINX build, you can include the *[ngx_http_gzip_static_module](https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html)* which would further suit compression of static content.


## Configuration Recap

To summarize where we are thus far:

- The *stable* version of NGINX Open Source was installed from the *nginx.org* repository.

- We have one basic website accessible, whose root directory is located at `/var/www/example.com/` and configuration file is located at `/etc/nginx/conf.d/example.com.conf`.

    {{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen         80 default_server;
    listen         [::]:80 default_server;
    server_name    example.com www.example.com;
    root           /var/www/example.com;
    index          index.html;

    gzip             on;
    gzip_comp_level  3;
    gzip_types       text/plain text/css application/javascript image/*;
}
{{< /file >}}

- Changes we want NGINX to apply universally were added to the `html` block of `/etc/nginx/nginx.conf`. Our addition is put at the bottom of the block so we know what was added compared to what's provided by default. `nginx.conf` now looks like below. Note that `nginx.conf` does not contain any `server` blocks.

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


    server_tokens       off;
}
{{< /file >}}


## Part 2: (Slightly More) Advanced Configurations

By now you should have a basic NGINX installation and a some foundational settings to get you started. For slightly more advanced configurations, yet still applicable to anyone hosting a site on a Linode, see part 2 of this series: [(Slightly more) Advanced Configurations](/docs/web-servers/nginx/slightly-more-advanced-configurations-for-nginx/)

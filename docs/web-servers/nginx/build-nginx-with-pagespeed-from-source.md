---
author:
  name: Linode
  email: docs@linode.com
description: 'Compile NGINX to use the PageSpeed module.'
keywords: ["nginx","pagespeed"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/nginx-with-pagespeed-on-ubuntu-14-04/','web-servers/nginx/install-nginx-pagespeed-module-on-ubuntu1604']
published: 2018-01-29
modified: 2018-01-29
modified_by:
  name: Linode
title: 'Build NGINX with PageSpeed From Source'
---

[PageSpeed](https://www.modpagespeed.com/) is a set of modules for NGINX and Apache which optimize and measure page performance of websites. Optimization is done by 'minifying' static assets such as CSS and JavaScript, and this decreases page load time. [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) is another aspect of PageSpeed which measures your site's performance, and makes recommendations for further modifications based on the results.

There are currently two ways to get PageSpeed and NGINX working together:

-  Compile NGINX with support for PageSpeed, then compile PageSpeed.
-  Compile PageSpeed as a [dynamic module](https://www.nginx.com/blog/compiling-dynamic-modules-nginx-plus/) to use with NGINX, whether NGINX was installed from source or a binary.

**This guide will compile both NIGNX and PageSpeed.** If you would prefer to use PageSpeed as a module for NGINX, see [this NGINX blog post](https://www.nginx.com/blog/optimize-website-google-pagespeed-dynamic-module-nginx-plus/) for instructions.


## Before You Begin

-  You should not have a pre-existing installation of NGINX. If you do, back up the configuration files if you want to retain their information, and then purge NGINX from the system.

-  You will need root access to the system, or a user account with `sudo` privileges.

-  Set your system's [hostname](/docs/getting-started/#setting-the-hostname).

-  Fully update your system's packages.


## Considerations for a Self-Compiled NGINX Installation

**Filesystem Locations**: When you compile NGINX from source, the entire installation, including configuration files, is located at `/usr/local/nginx/nginx/`. This is in contrast to an installation from your distribution's repository or NGINX's, which places its configuration files in `/etc/nginx/`.

**Built-in Modules**: When you compile NGINX from source, no additional modules are included by default, not even for HTTPS. Below you can see the output of `nginx -V` using the PageSpeed automated install command on Ubuntu 16.04 with no additional modules or options specified. Note that you even need to call the binary with the exact path, because the system is unaware of the installation.

```
root@localhost:~# /usr/local/nginx/sbin/nginx -V
nginx version: nginx/1.13.8
built by gcc 5.4.0 20160609 (Ubuntu 5.4.0-6ubuntu1~16.04.5)
configure arguments: --add-module=/root/incubator-pagespeed-ngx-latest-stable
```

Contrast that to the same command run on the same Ubuntu system but with the binary installed from NGINX's repository (but built upstream on Ubuntu 14.04).

```
root@localhost:~# nginx -V
nginx version: nginx/1.13.8
built by gcc 4.8.4 (Ubuntu 4.8.4-2ubuntu1~14.04.3)
built with OpenSSL 1.0.1f 6 Jan 2014 (running with OpenSSL 1.0.2g  1 Mar 2016)
TLS SNI support enabled
configure arguments: --prefix=/etc/nginx --sbin-path=/usr/sbin/nginx --modules-path=/usr/lib/nginx/modules --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --http-client-body-temp-path=/var/cache/nginx/client_temp --http-proxy-temp-path=/var/cache/nginx/proxy_temp --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp --http-scgi-temp-path=/var/cache/nginx/scgi_temp --user=nginx --group=nginx --with-compat --with-file-aio --with-threads --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module --with-mail --with-mail_ssl_module --with-stream --with-stream_realip_module --with-stream_ssl_module --with-stream_ssl_preread_module --with-cc-opt='-g -O2 -fstack-protector --param=ssp-buffer-size=4 -Wformat -Werror=format-security -Wp,-D_FORTIFY_SOURCE=2 -fPIC' --with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro -Wl,-z,now -Wl,--as-needed -pie'
```


## Build NGINX and PageSpeed

The official [PageSpeed documentation](https://www.modpagespeed.com/doc/) gives a bash command which pulls script to automate the process, from installation of dependencies (with one exception), to compiling NGINX and PageSpeed, and installing them into the system.

1.  If you plan to offer your website using TLS, install the SSL libraries needed to compile the HTTPS module for NGINX. In RedHat based distributions (CentOS, Fedora), the package is called `openssl-devel`. In Debian-based distributions, the library is `libssl-dev`.

2.  Run the **[Automated Install](https://www.modpagespeed.com/doc/build_ngx_pagespeed_from_source)** bash command to start the installation.

3.  Shortly into the build process, you'll be asked if you want to build NGINX with any additional modules. The PageSpeed module is already included, so you don't need to add it here. However, if you want your site to support HTTPS connections, paste the `--with-http_ssl_module` option into the prompt.

    ![NGINX add HTTPS module](/docs/assets/nginx-add-https-module.png "NGINX add HTTPS module")

    Remember, only the PageSpeed module will be built unless you specify anything further. We recommend starting with the options below in addition to anything more specialized you may also choose to add. These retain the directory paths, user and group names of pre-built NGINX binaries, and enables the SSL and HTTP/2 modules for HTTPS connections.

        --prefix=/etc/nginx --sbin-path=/usr/sbin/nginx --modules-path=/usr/lib/nginx/modules --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --http-client-body-temp-path=/var/cache/nginx/client_temp --http-proxy-temp-path=/var/cache/nginx/proxy_temp --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp --http-scgi-temp-path=/var/cache/nginx/scgi_temp --user=nginx --group=nginx --with-http_ssl_module --with-http_v2_module

4.  Next you'll be asked if you want to build NGINX. You'll be shown the destination directories for logs, configuration files and binaries. If these look correct, answer *Y* to continue.

    ![NGINX installation directories](/docs/assets/nginx-from-source-installation-directories.png "NGINX installation directories")

5.  NGINX should then finish building and return you to a new terminal line. If the build was successful, you'll see a message near the end of the build output explaining so:

    ![NGINX build successful](/docs/assets/nginx-finished-compiling-with-pagespeed.png "NGINX build successful")

6.  When you want to update NGINX, back up your configuration files and repeat steps two through four above to build with the new source version.


## Controlling NGINX

**Using systemd**

1.  Grab the contents for an NGINX systemd unit file from [the NGINX wiki](https://www.nginx.com/resources/wiki/start/topics/examples/systemd/) and put them into the file at the path it gives on the page.

2.  Enable NGINX to start on boot and start the server:

        systemctl enable nginx
        systemctl start nginx

3.  From here, starting, stopping and reloading NGINX is the same as with any other systemd-controlled process.

**By Calling the Binary**

You can use NGINX's binary to control the process directly without having to make a startup file for your init system. While you can use these commands when you're managing the NGINX process with a systemd unit or an rc.x file, you should pick one method or the other.

For example, if you start NGINX using the command below, systemd won't be aware of it and will try to start another NGINX instance if you run `systemctl start nginx`, which will fail.

Start NGINX:

    /usr/sbin/nginx

Reload the configuration:

    /usr/sbin/nginx -s reload

Stop NGINX:

    /usr/sbin/nginx -s stop


## Post-Installation Configuration

1.  Since the compiled-in options we specified are different than the source's defaults, give NGINX a few things it needs to start properly, and organize a few others. Replace *example.com* with the domain of your website.

        useradd --no-create-home nginx
        mkdir -p /var/cache/nginx/client_temp
        mkdir /etc/nginx/conf.d/
        mkdir /var/www/example.com
        chown nginx:nginx /var/www/example.com
        mv /etc/nginx/nginx.conf.default /etc/nginx/nginx.conf.backup-default

2.  In NGINX speak, a *Server Block* basically equates to a website (same as *Virtual Host* in Apache terminology). Each NGINX site's configuration should be in its own file with the name formatted as `example.com.conf`, located at `/etc/nginx/conf.d/`.

    If you followed this guide or our [Getting Started with NGINX](/docs/web-servers/nginx/nginx-installation-and-basic-setup/) series, then your site's configuration will be in a `server { }` block in a file stored in `/etc/nginx/conf.d/`. If you do not have this setup, then you likely have the `server { }` block directly in `/etc/nginx/nginx.conf`. See *[Server Block Examples](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/)* in the NGINX docs for more info.

    Create a configuration file for your site with a basic server block inside:

    {{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen       80;
    listen       [::]:80;
    server_name  example.com www.example.com;
    access_log   logs/example.access.log main;
    error_log    logs/example.error error;

    root         /var/www/example.com/;

    }
{{< /file-excerpt >}}

3.  Start NGINX:

    For systemd:

        systemctl start nginx

    For other init systems:

        /usr/sbin/nginx

4.  Verify NGINX is working by going to your site's domain or IP address in a web browser. You should see the NGINX welcome page:

    ![NGINX welcome page](/docs/assets/nginx-welcome.png "NGINX welcome page")


## Configure PageSpeed

1.  Create PageSpeed's cache location and change its ownership to the `nginx` user and group:

        mkdir /var/cache/ngx_pagespeed/
        chown nginx:nginx /var/cache/ngx_pagespeed/

2.  Add the PageSpeed directives to your site configuration's `server { }` block as shown below.

    {{< file-excerpt "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {

      ...

    pagespeed on;
    pagespeed FileCachePath "/var/cache/ngx_pagespeed/";
    pagespeed RewriteLevel OptimizeForBandwidth;

    location ~ "\.pagespeed\.([a-z]\.)?[a-z]{2}\.[^.]{10}\.[^.]+" {
        add_header "" "";
        }

    location ~ "^/pagespeed_static/" { }
    location ~ "^/ngx_pagespeed_beacon$" { }

    }
{{< /file-excerpt >}}

    {{< note >}}
`RewriteLevel OptimizeForBandwidth` is a [safer choice](https://www.modpagespeed.com/doc/optimize-for-bandwidth) than the default CoreFilters rewrite level.
{{< /note >}}

3.  NGINX supports HTTPS by default, so if your site already is set up with a TLS certificate, add the two directives below to your site's `server { }` block, pointing to the correct location [depending on your system](https://www.modpagespeed.com/doc/https_support#configuring_ssl_certificates).

        pagespeed SslCertDirectory directory;
        pagespeed SslCertFile file;

4.  Reload your configuration:

        /usr/sbin/nginx/ -s reload

5.  Test PageSpeed is running and NGINX is successfully serving pages. Substitute *example.com* in the cURL command with your domain or Linode's IP address.

        curl -I -X GET example.com

    The output should be similar to below. You're looking for an HTTP 200 response and *X-Page-Speed* listed in the header with the PageSpeed version number. These mean everything is working correctly.

        HTTP/1.1 200 OK
        Server: nginx/1.13.8
        Content-Type: text/html
        Transfer-Encoding: chunked
        Connection: keep-alive
        Vary: Accept-Encoding
        Date: Tue, 23 Jan 2018 16:50:23 GMT
        X-Page-Speed: 1.12.34.3-0
        Cache-Control: max-age=0, no-cache

6.  Use [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) to test your site for additional improvement areas.
---
slug: securing-nginx-with-modsecurity
description: 'ModSecurity is a free web application firewall that can prevent attacks like XSS and SQL Injection. This guide shows how to install ModSecurity with NGINX.'
keywords: ["nginx security", "nginx best practices security", "secure nginx config"]
tags: ["security","web server","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-03-26
modified_by:
  name: Linode
published: 2021-03-26
title: Securing Nginx With ModSecurity
title_meta: How to Secure Nginx With ModSecurity
aliases: ['security/basics/securing-nginx-with-modsecurity/']
image: SecureNginx_ModSecurity.png
relations:
    platform:
        key: securing-web-servers-with-modsecurity
        keywords:
            - web server: NGINX
authors: ["Hackersploit"]
---

## What is ModSecurity?

ModSecurity is a free and open source web application that started out as an Apache module and grew to a fully-fledged web application firewall. It works by inspecting requests sent to the web server in real time against a predefined rule set, preventing typical web application attacks like XSS and SQL Injection.

While originally an Apache module, ModSecurity can also be installed on Nginx as detailed in this guide.

## Prerequisites & Requirements

In order to install and configure ModSecurity, you need to have a Linux server with the following services running:

- Nginx

For instructions, see our guide on [How to Install NGINX on Ubuntu 18.04 LTS](/docs/guides/how-to-install-nginx-ubuntu-18-04/). Installation instructions for several other Linux distributions are also accessible from this guide.

{{< note respectIndent=false >}}
This demonstration has been performed on Ubuntu 18.04. However, all techniques demonstrated are distribution agnostic with the exception of package names and package managers.
{{< /note >}}

## Downloading & Building ModSecurity

While ModSecurity is not officially supported as a module for Nginx, a workaround exists involving the [ModSecurity-nginx connector](https://github.com/SpiderLabs/ModSecurity-nginx). The ModSecurity-nginx connector is the connection point between Nginx and libmodsecurity (ModSecurity v3). Said another way, the ModSecurity-nginx connector provides a communication channel between Nginx and libmodsecurity.

The ModSecurity-nginx connector takes the form of an Nginx module that provides a layer of communication between Nginx and ModSecurity.

To begin the installation process, follow the steps outlined below:

1.  Install all the dependencies required for the build and compilation process with the following command:

        sudo apt-get install bison build-essential ca-certificates curl dh-autoreconf doxygen \
          flex gawk git iputils-ping libcurl4-gnutls-dev libexpat1-dev libgeoip-dev liblmdb-dev \
          libpcre3-dev libpcre++-dev libssl-dev libtool libxml2 libxml2-dev libyajl-dev locales \
          lua5.3-dev pkg-config wget zlib1g-dev zlibc libxslt libgd-dev

1.  Ensure that git is installed:

        sudo apt install git

1.  Clone the ModSecurity Github repository from the `/opt` directory:

        cd /opt && sudo git clone https://github.com/SpiderLabs/ModSecurity

1.  Change your directory to the ModSecurity directory:

        cd ModSecurity

1.  Run the following git commands to initialize and update the submodule:

        sudo git submodule init
        sudo git submodule update

1.  Run the `build.sh` script:

        sudo ./build.sh

1.  Run the `configure` file, which is responsible for getting all the dependencies for the build process:

        sudo ./configure

1.  Run the `make` command to build ModSecurity:

        sudo make

1.  After the build process is complete, install ModSecurity by running the following command:

        sudo make install

## Downloading ModSecurity-Nginx Connector

Before compiling the ModSecurity module, clone the Nginx-connector from the `/opt` directory:

    cd /opt && sudo git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git

## Building the ModSecurity Module For Nginx

You can now build the ModSecurity module from a downloaded copy of your Nginx version by following the steps outlined below:

1.  Enumerate the version of Nginx you have installed:

        nginx -v

    For example, the following output shows that Nginx version 1.14.0 is installed on the system:

    {{< output >}}
nginx version: nginx/1.14.0 (Ubuntu)
{{< /output >}}

    In each of the following commands, replace `1.14.0` with your version of Nginx.

1.  Download the exact version of Nginx running on your system into the `/opt` directory:

        cd /opt && sudo wget http://nginx.org/download/nginx-1.14.0.tar.gz

1.  Extract the tarball:

        sudo tar -xvzmf nginx-1.14.0.tar.gz

1.  Change your directory to the tarball directory you just extracted:

         cd nginx-1.14.0

1.  Display the configure arguments used for your version of Nginx:

        nginx -V

    Here is an example output for Nginx 1.14.0:

    {{< output >}}
nginx version: nginx/1.14.0 (Ubuntu)
built with OpenSSL 1.1.1  11 Sep 2018
TLS SNI support enabled
configure arguments: --with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-GkiujU/nginx-1.14.0=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -Wdate-time -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_geoip_module=dynamic --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_sub_module --with-http_xslt_module=dynamic --with-stream=dynamic --with-stream_ssl_module --with-mail=dynamic --with-mail_ssl_module
{{< /output >}}

1.  To compile the Modsecurity module, copy all of the arguments following `configure arguments:` from your output of the above command and paste them in place of `<Configure Arguments>` in the following command:

        sudo ./configure --add-dynamic-module=../ModSecurity-nginx <Configure Arguments>

1.  Build the modules with the following command:

        sudo make modules

1.  Create a directory for the Modsecurity module in your system's Nginx configuration folder:

        sudo mkdir /etc/nginx/modules

1.  Copy the compiled Modsecurity module into your Nginx configuration folder:

        sudo cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules

## Loading the ModSecurity Module in Nginx

Open the `/etc/nginx/nginx.conf` file with a text editor such a vim and add the following line:

    load_module /etc/nginx/modules/ngx_http_modsecurity_module.so;

Here is an example portion of an Nginx configuration file that includes the above line:

{{< file "/etc/nginx/nginx.conf" nginx >}}
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;
load_module /etc/nginx/modules/ngx_http_modsecurity_module.so;
{{< /file >}}

## Setting Up OWASP-CRS

The [OWASP ModSecurity Core Rule Set (CRS)](https://github.com/coreruleset/coreruleset) is a set of generic attack detection rules for use with ModSecurity or compatible web application firewalls. The CRS aims to protect web applications from a wide range of attacks, including the OWASP Top Ten, with a minimum of false alerts. The CRS provides protection against many common attack categories, including SQL Injection, Cross Site Scripting, and Local File Inclusion.

To set up the OWASP-CRS, follow the procedures outlined below.

1.  First, delete the current rule set that comes prepackaged with ModSecurity by running the following command:

        sudo rm -rf /usr/share/modsecurity-crs

1.  Clone the OWASP-CRS GitHub repository into the `/usr/share/modsecurity-crs` directory:

        sudo git clone https://github.com/coreruleset/coreruleset /usr/local/modsecurity-crs

1.  Rename the `crs-setup.conf.example` to `crs-setup.conf`:

        sudo mv /usr/local/modsecurity-crs/crs-setup.conf.example /usr/local/modsecurity-crs/crs-setup.conf

1.  Rename the default request exclusion rule file:

        sudo mv /usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example /usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf

You should now have the OWASP-CRS set up and ready to be used in your Nginx configuration.

## Configuring Modsecurity

ModSecurity is a firewall and therefore requires rules to function. This section shows you how to implement the OWASP Core Rule Set. First, you must prepare the ModSecurity configuration file.

1.  Start by creating a ModSecurity directory in the `/etc/nginx/` directory:

        sudo mkdir -p /etc/nginx/modsec

1.  Copy over the unicode mapping file and the ModSecurity configuration file from your cloned ModSecurity GitHub repository:

        sudo cp /opt/ModSecurity/unicode.mapping /etc/nginx/modsec
        sudo cp /opt/ModSecurity/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf

1. Remove the `.recommended` extension from the ModSecurity configuration filename with the following command:

        sudo cp /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf

1.  With a text editor such as vim, open `/etc/modsecurity/modsecurity.conf` and change the value for `SecRuleEngine` to `On`:

    {{< file "/etc/modsecurity/modsecurity.conf" aconf >}}
# -- Rule engine initialization ----------------------------------------------

# Enable ModSecurity, attaching it to every transaction. Use detection
# only to start with, because that minimises the chances of post-installation
# disruption.
#
SecRuleEngine On
...
{{< /file >}}

1.  Create a new configuration file called `main.conf` under the `/etc/nginx/modsec` directory:

        sudo touch /etc/nginx/modsec/main.conf

1.  Open `/etc/nginx/modsec/main.conf` with a text editor such as vim and specify the rules and the Modsecurity configuration file for Nginx by inserting following lines:

    {{< file "/etc/modsecurity/modsecurity.conf" aconf >}}
Include /etc/nginx/modsec/modsecurity.conf
Include /usr/local/modsecurity-crs/crs-setup.conf
Include /usr/local/modsecurity-crs/rules/*.conf
{{< /file >}}

## Configuring Nginx

Now that you have configured ModSecurity to work with Nginx, you must enable ModSecurity in your site configuration file.

1.  Open the `/etc/nginx/sites-available/default` with a text editor such as vim and insert the following lines in your server block:

        modsecurity on;
        modsecurity_rules_file /etc/nginx/modsec/main.conf;

    Here is an example configuration file that includes the above lines:

    {{< file "/etc/nginx/sites-available/default" nginx >}}
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;

        modsecurity on;
        modsecurity_rules_file /etc/nginx/modsec/main.conf;

        index index.html index.htm index.nginx-debian.html;

        server_name _;
        location / {
                try_files $uri $uri/ =404;
        }
}
{{< /file >}}

1.  Restart the nginx service to apply the configuration:

        sudo systemctl restart nginx

## Testing ModSecurity

Test ModSecurity by performing a simple local file inclusion attack by running the following command:

    curl http://<SERVER-IP/DOMAIN>/index.html?exec=/bin/bash

If ModSecurity has been configured correctly and is actively blocking attacks, the following error is returned:

{{< output >}}
<html>
<head><title>403 Forbidden</title></head>
<body bgcolor="white">
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx/1.14.0 (Ubuntu)</center>
</body>
</html>
{{< /output >}}

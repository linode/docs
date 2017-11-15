---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Plone Content Management System, built on the Zope framework, to deploy complex and content rich sites on Debian 5 (Lenny) systems.'
keywords: ["plone", "zope", "python", "debian", "web framework", "content management systems", "cms"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/cms-guides/plone/']
modified: 2011-06-03
modified_by:
  name: Linode
published: 2010-01-29
title: 'Manage Web Content with Plone on Debian 5 (Lenny)'
---

Plone is an advanced system for managing complex and content rich websites. Written in the Python programing language using the Zope web-framework, Plone provides a flexible substrate on top of the Zope system for developing highly specialized websites and is supported by an active community of developers. Zope provides a vibrant architecture for building complex and usable tools in a Python and web-centric manner. Plone and Zope may strike systems administrators as unique in comparison to other content management systems because they generate content by modifying the behavior of the Zope application server while incoming requests are proxied through a front end server like [Apache](/docs/web-servers/apache/) or [nginx](/docs/web-servers/nginx).

Before installing the Plone content management system, we assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). At the end of this document, we will briefly discuss configuring the [Apache](/content/web-servers/apache/) and [nginx](/content/web-servers/nginx) web servers for use with Plone as a front end server.

# Installing Plone

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Packages for Plone are included in the Debian software repositories. We recommend installing from these packages in order to benefit from the extra testing, security updates, and base configurations provided by the Debian developers' efforts.

The Debian project provides two possible paths to installing the Plone project and its dependencies. First, you may choose to install the `plone3-site` package which installs all dependencies and configures a basic site that you can use to jump start your development process. The second option is to install the `zope-plone3` package and is preferable if you have already developed a Plone site and only need to use your Linode as a production deployment system. To install `zope-plone3`, issue the following command:

    apt-get install zope-plone3

To install the `plone3-site`, issue the following command:

    apt-get install plone3-site

The installation interface will present several questions during the installation process in order to create an administrative user account for this Plone instance. Additionally you will be asked to supply a port for running Plone's HTTP service. If you choose to run Plone on a port *other* than `8081` please make note of this alteration. In general, you may select the default options during the configuration process. When the installation is complete, you can issue the following command to start the Zope server:

    /etc/init.d/zope2.10 start

Now, assuming that you have an [A Record](/docs/networking/dns/dns-records-an-introduction#a-and-aaaa) for the domain `example.com` pointed to the IP address for the Linode that is running this Plone instance, you can visit the address `http://example.com:8081` to visit the new Plone site. To login to the Zope administrative interface, visit `http://example.com:8081/manage` and authenticate using the credentials created during the installation process.

You can now proceed with the development of your Plone website!

# Using Plone in Production Environments

Although the Plone application server is capable of generating and providing dynamic content, it's advisable to use a more general purpose web server as a front end running on port `80`. You can use either the [Apache HTTP server](/docs/web-servers/apache/) or the [nginx server](/docs/web-servers/nginx/). Basic instructions for setting up the front-end proxy servers can be found below. Both options are functionally equivalent, and your choice is simply a matter of personal preference.

### Configuring an Apache Front End Proxy

Begin by installing the Apache web server. You can read more about this process in our documentation for [installing Apache for Debian systems](/docs/web-servers/apache/installation/debian-5-lenny). Issue the following command:

    apt-get install apache2

Edit the `/etc/apache2/mods-available/proxy.conf` file to properly configure the [ProxyPass](/docs/web-servers/apache/proxy-configuration/multiple-webservers-proxypass-debian-5-lenny) as follows:

{{< file-excerpt "/etc/apache2/mods-available/proxy.conf" apache >}}
<IfModule mod_proxy.c>
        #turning ProxyRequests on and allowing proxying from all may allow
        #spammers to use your proxy to send email.

        ProxyRequests Off

        <Proxy *>
                AddDefaultCharset off
                Order deny,allow
                Allow from all
        </Proxy>

        # Enable/disable the handling of HTTP/1.1 "Via:" headers.
        # ("Full" adds the server version; "Block" removes all outgoing Via: headers)
        # Set to one of: Off | On | Full | Block

        ProxyVia On
</IfModule>

{{< /file-excerpt >}}


This enables proxy support in the module's configuration. **Please note** the warning regarding the `ProxyRequests` directive. This setting should be "off" in your configuration. Next, we'll issue the following commands:

    a2enmod proxy
    a2enmod proxy_http
    /etc/init.d/apache2 restart

Apache should restart cleanly. If you encounter any issues, you may wish to inspect the logs available under `/var/log/apache2/` for more information. Now, consider the following virtual hosting configuration directives:

{{< file-excerpt "Apache Virtual Hosting Configuration" apache >}}
<VirtualHost *:80>
     ServerAdmin admin@example.com
     ServerName example.com
     ServerAlias www.example.com

    ProxyPreserveHost On
     ProxyPass / http://localhost:8081/

     # Uncomment the line below if your site uses SSL.
     #SSLProxyEngine On
</VirtualHost>

{{< /file-excerpt >}}


In this configuration all requests for the `VirtualHost` named `example.com` are passed back to the Plone instance. If you want to only serve dynamic content with Plone and use Apache to serve static content, use a virtual hosting configuration that resembles the following. Enable `mod_rewrite` by issuing the following command:

    a2enmod rewrite

Now modify the configuration of your virtual host as follows:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /srv/www/example.com/public_html/

    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    ProxyPreserveHost On
    RewriteEngine On
    RewriteCond /srv/www/example.com/public_html%{REQUEST_FILENAME} !-f
    RewriteRule ^/(.*)$ http://localhost:8081/$1 [proxy,last]
</VirtualHost>

{{< /file-excerpt >}}


Issue the following command to restart apache:

    /etc/init.d/apache2 restart

In this example, requests for content will **only** be proxied to Plone **if** resources matching these requests do not exist in the `DocumentRoot` directory (e.g. `/srv/www/example.com/public_html`). This solution may be able to use system resources more effectively if you have a large Plone site with a great deal of static content.

### Configuring an nginx Front End Proxy

Somewhere in your nginx configuration file, include configuration options which resemble the following:

{{< file-excerpt "Nginx Configuration Directives" nginx >}}
server {
        listen       21.43.65.91:80;
        server_name  example.com www.example.com;

        access_log  logs/example.access.log combined;

        location / {
            proxy_pass   http://localhost:8081;
        }
        location /media/ {
            root   /srv;
        }
        location ~ \.php$ {
            proxy_pass http://127.0.0.1;
        }
}

{{< /file-excerpt >}}


In this example, nginx listens for incoming requests on port `80` of the public IP address `21.43.65.91` and the domain of `example.com`. All requests are passed to the Plone instance running on the local machine on port `8081`. However, requests for locations in `/media/` will be served from the static content located in the `/srv/media` directory. Additionally, all files that terminate in a `.php` extension will be proxied to another HTTP server, presumably Apache, running on the local interface. Nginx will always fulfill the request using the most specific `Location` directive match.

Congratulations, you now have a fully functional Plone system that is ready for deployment in a production environment.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Zope Book](http://docs.zope.org/zope2/zope2book//)
- [Basic nginx configuration](/docs/websites/nginx/basic-nginx-configuration)
- [ProxyPass Apache to Multiple Webservers](/docs/web-servers/apache/proxy-configuration/multiple-webservers-proxypass-debian-5-lenny)




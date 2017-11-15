---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'How to cluster Apache web servers and proxy requests for content to external servers on Ubuntu 10.10 (Maverick).'
keywords: ["clusters", "proxy", "proxy pass", "apache", "httpd"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/proxy-configuration/proxy-and-clustering-services-ubuntu-10-10-maverick/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2010-12-06
title: 'Using Apache for Proxy and Clustering Services on Ubuntu 10.10 (Maverick)'
---



The Apache HTTP server is a versatile and robust engine for providing access to resources over HTTP. With its modular design and standard [configuration system](/docs/web-servers/apache/configuration/configuration-basics), it is a popular and familiar option for systems administrators and architects who require a potentially diverse array of HTTP services, along with a stable and predictable administrative interface. In addition to simply serving content and facilitating the generation of dynamic content, the Apache HTTP server can be deployed as a frontend server to manage clusters of web servers.

This guide provides a number of configuration examples and suggestions for using Apache as a frontend server for other HTTP servers and clusters of servers. If you have not already installed Apache, consider our documentation on [installing Apache](/docs/web-servers/apache/installation/ubuntu-10-10-maverick) before continuing with this guide. Additionally, consider our [getting started](/docs/getting-started/) and [beginner's guide](/docs/beginners-guide/) documents if you are new to Linode, and our [administration basics](/content/using-linux/administration-basics) guide if you are new to Linux server administration.

# Case One: Separating Static Content from Dynamic Content

In this configuration, Apache provides two or more virtual hosts which perform different functions. Here we might configure our site to use `static.example.com` for hosting static resources for direct delivery like images, JavaScript, CSS files, media files, and static HTML, while using `example.com` to host dynamic content including CGI scripts and PHP pages. In this kind of system it becomes easy to move the `static` subdomain to another Linode instance or content delivery system without modifying any internal configuration.

To accomplish this, insert the following configuration directives into your Virtual Hosting configuration:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost example.com:80>
    ServerAdmin admin@example.com
    ServerName static.example.com
    DocumentRoot /srv/www/static.example.com/public_html/
    ErrorLog /srv/www/static.example.com/logs/error.log
    CustomLog /srv/www/static.example.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Create the necessary directories by issuing the following commands:

    mkdir -p /srv/www/static.example.com/public_html/
    mkdir -p /srv/www/static.example.com/logs/

Reload the web server configuration to create the virtual host. Issue the following command at this point and at any point after you've made changes to an Apache configuration file:

    /etc/init.d/apache2 reload

Now, place the static files in the `/srv/www/static.example.com/public_html/` folder and ensure all static content is served from URLs that begin with `http://static.example.com/`. You must create an [A Record](/docs/dns-guides/introduction-to-dns#a_aaaa_records) that points to your Linode's IP for the `static.example.com` domain. You can repeat and expand on this process by effectively creating a small cluster of independent servers that can serve separate components of a single website using sub-domains.

# Case Two: Using ProxyPass to Delegate Services to Alternate Machines

In our guide to using [multiple web servers with ProxyPass](/docs/web-servers/apache/proxy-configuration/multiple-webservers-proxypass-ubuntu-10-10-maverick) we outline a method for configuring multiple websites using Apache's `mod_proxy`. Please follow that guide, particularly the section regarding [configuring mod\_proxy](/docs/web-servers/apache/multiple-web-servers-with-proxypass-on-ubuntu-10-10-maverick/#enabling-the-proxy-module) and ensure that `mod_proxy` is active by issuing the following commands to enable and restart web server:

    a2enmod proxy
    a2enmod proxy_http
    /etc/init.d/apache2 restart

Once `mod_proxy` is enabled and configured, you can insert the following directives into your virtual hosting configuration.

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
ProxyPass /static/ http://static.example.com/
ProxyPass /media http://media.example.com
ProxyPass /wiki/static/ !
ProxyPass /wiki/ http://application.example.com/

{{< /file-excerpt >}}


When added to the virtual host configuration for the `example.com` domain, these directives will have the following effects.

-   All requests for resources located at `http://example.com/static/` will be served by the server running at `http://static.example.com`. As a result, a request from the users perspective for `http://example.com/static/screen.css` will return the resource located at `http://static.example.com/screen.css`. Requests without a trailing slash (i.e. `http://example.com/static`) will not be passed to external server.
-   All requests for resources located at `/media` and paths "below" this location will return resources located at `http://media.example.com`. This functions the same as the `ProxyPass` for `static` above, except it does not include the trailing slash for either domain name. Either form is acceptable, but both the local server address and the proxied URL must agree to ensure that the number of slashes is correct.
-   Requests for `http://example.com/wiki/static/` will **not** be passed to `http://application.example.com/static/` and will be served or processed by the current virtual host in a manner described outside of the current excerpt. Use the `!` directive instead of a URL to add an exception for a subdirectory of a directory that is to be proxy passed. Proxy exclusions must be declared before proxy passes.
-   Requests for resources located below `/wiki/` will be passed to the external server located at `http://application.example.com/` in the conventional manner as described for `/static/` and `/media`. Note that exclusions *must* be declared before proxy passes are declared.

In essence, the `ProxyPass` directive in this manner allows you to distribute serving HTTP resources amongst a larger pool of machines. At the same time, end users will still see a unified and coherent website hosted on a single domain.

# Case Three: Proxy only Some Requests to a Backend

While using `ProxyPass` directives allows you to distribute resources by directory amongst a collection of backend servers, this kind of architecture only makes sense for some specific kinds of deployments. In many situations administrators might like to have much more fine grained control over the requests passed to external servers. In conjunction with [mod\_rewrite](/docs/web-servers/apache/configuration/rewriting-urls), we can configure `mod_proxy` to more flexibly pass requests to alternate backend servers. Follow this guide, particularly the section regarding configuring mod\_proxy, and insure that `mod_proxy` and `mod_rewrite` are active by issuing the following commands to enable and restart web server:

    a2enmod proxy
    a2enmod proxy_http
    a2enmod rewrite
    /etc/init.d/apache2 restart

Once `mod_proxy` is enabled and configured, ensure that the server is [configured properly](/docs/web-servers/apache/proxy-configuration/multiple-webservers-proxypass-ubuntu-10-10-maverick). Now, a number of additional proxy services will be available. Consider the following virtual host configuration:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost example.com:80>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /srv/www/example.com/public_html/

    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    RewriteEngine On
    RewriteRule ^/blog/(.*)\.php$ http://app.example.com/blog/$1.php [proxy]
</VirtualHost>

{{< /file-excerpt >}}


In this example all requests for resources that end with `.php` are proxied to `http://app.example.com/blog/`. This would include requests for `http://example.com/blog/index.php` and `http://example.com/blog/archive/index.php` but not `http://example.com/blog/screen.css` or `http://example.com/blog/` itself. All requests that do not end in `.php` will be served from resources located in the `DocumentRoot`. The `[proxy]` flags tell Apache that the rewritten URL should be passed to the Proxy module: this is equivalent to using the `last` directive as well. When a match is made, rewriting stops and the request is processed.

While this method of specifying resources for proxying is much more limited in some respects, it does allow you to very specifically control and distribute HTTP requests among a group of servers. Use the above example, and the others that follow, as inspiration when constructing the rewrite rules for your deployment:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
RewriteRule ^/(.*)\.js$ http://static.example.com/javascript/$1.js [proxy]
RewriteRule ^/(.*)\.css$ http://static.example.com/styles/$1.css [proxy]
RewriteRule ^/(.*)\.jpg$ http://static.example.com/images/$1.jpg [proxy]

RewriteRule ^/blog/(.*)\.php$ http://app.example.com/wordpress/$1.php [proxy]
RewriteRule ^/wiki/(.*)$ http://app.example.com/mediawiki/$1 [proxy]

{{< /file-excerpt >}}


In the first group we present three examples of requests for specific types of files that will be proxied to various directories in the `http://static.example.com/` host. Note that the entire contents of the parenthetical (e.g. `(.*)` in this case) will be passed to the proxy host. If you do not capture the extension of a request in the regular expression, you must add it to the rewritten location. Using the first example, assuming these rewrite rules are in the `example.com` virtual host, a requests for `http://example.com/toggle.js` and `http://example.com/blog/js/functions.js` are passed to `http://static.example.com/javascript/toggle.js` and `http://static.example.com/javascript/blog/js/functions.js` respectively.

In the second group of examples, rather than passing the entire request back to a proxy, we choose to only pass a part of the request. In the first rule of this group, a request for `http://example.com/blog/index.php` would be served from `http://app.example.com/wordpress/index.php` however a request for `http://example.com/wordpress/style.css` would not be be passed to `app.example.com`; indeed, given the earlier rules, this request would be passed to `http://static.example.com/styles/wordpress/style.css`. In the second rule in this example, every request for a resource that begins with `http://example.com/wiki/` would be passed to `http://app.example.com/mediawiki/`. With this rewrite rule, both `http://example.com/wiki/index.php` and `http://example.com/wiki/info/about.html` would be rewritten as `http://app.example.com/mediawiki/index.php` and `http://app.example.com/mediawiki/info/about.html`.

In order to ensure that your rewrite rules function as predicted, keep in mind the following:

-   If you use the extension to match the request and pass it to a specific backend server, and the backend server expects files with extensions you must add those extensions to the second part of the rewrite rule.
-   When a rewrite rule with a `proxy` flag is used, and a request matches that rewrite rule, the request will be passed to `mod_proxy` even if a more precise rewrite rule matches further down in the configuration. Ensure that your rules are arranged such that less specific rewrite rules are declared after more precise ones to avoid unintentional conflicts.

# Case Four: Forward All Non-Static Content to an External Server

Using `mod_rewrite` to direct requests to proxied resources gives administrators a great deal of power and fine grained control over where and how requests are passed to the backend servers. At the same time, it can add a great deal of complexity to the configuration of the web-server that may be difficult to manage. Minor updates and small changes to configuration can have large and unintended impacts on the function of a website. For this reason it is always crucial that you fully test your configuration before the initial deployment or before you deploy *any* updates.

The following case presents a more streamlined and simple proxy and rewrite example. Consider the following configuration directives:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost example.com:80>
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /srv/www/example.com/public_html/

    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    RewriteEngine On
    RewriteCond /srv/www/example.com/public_html%{REQUEST_FILENAME} !-f
    RewriteRule ^/(.*)$ http://app.example.com/$1 [proxy]
</VirtualHost>

{{< /file-excerpt >}}


In this example, the `RewriteCond` controls the behavior of the `RewriteEngine` so that requests for resources will *only* be passed to the proxied server (e.g. `http://app.example.com/`) if there is no file in the `/srv/www/example.com/public_html/` directory that matches the request. All other requests are passed to `http://app.example.com/`. This kind of configuration is quite useful in situations where your deployment's dynamic content is powered by an application specific HTTP server, but also requires static content that can be more efficiently served directly from Apache.

# Case Five: Deploy an Apache Proxy Cluster

All of the previous cases presented in this document outline configurations for using `mod_proxy` in various configurations to make it possible to use your Apache HTTP server as a frontend for a more complex architecture. This case takes this one step further, by allowing Apache to proxy requests to a group of identical backend servers, and thus be able to handle a much larger load. Issue the following commands to enable the required modules and then restart the server:

    a2enmod proxy
    a2enmod proxy_http
    a2enmod proxy_balancer
    /etc/init.d/apache2 restart

Edit the `/etc/apache2/mods-available/proxy.conf` file as described in [this documentation](/docs/web-servers/apache/multiple-web-servers-with-proxypass-on-ubuntu-10-10-maverick/#enabling-the-proxy-module). Do not omit to reload Apache again once you have fully configured your virtual host and cluster. Consider the following Apache configuration directives:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost example.com:80>
    ServerName example.com
    ServerAlias www.example.com

    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    <Proxy balancer://cluster>
        BalancerMember http://app1.example.com
        BalancerMember http://app2.example.com
        BalancerMember http://app3.example.com
        BalancerMember http://app4.example.com
        BalancerMember http://app5.example.com
    </Proxy>

    ProxyPass / balancer://cluster/

    # ProxyPass / balancer://cluster/ lbmethod=byrequests
    # ProxyPass / balancer://cluster/ lbmethod=bytraffic
    # ProxyPass / balancer://cluster/ lbmethod=bybusyness
</VirtualHost>

{{< /file-excerpt >}}


In this case we establish a cluster of services, running on hosts named `app1.example.com` through `app4.example.com`. You can specify any host name or IP and port combination when creating the initial cluster. The `BalancerMember` directive also takes all of the arguments of the [ProxyPass directive](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html#proxypass) which allow you to customize and limit the behavior of each cluster component. Variables like `min=`, `max=`, and `smax=` allow you to control "minimum" and "maximum" limits for sessions as well as "soft maximum" which sets a soft maximum after which additional connections will be subject to a time to live. Once the cluster is established simply use the `ProxyPass` directive as described in earlier cases to pass requests to the cluster.

The `lbmethod=` argument to the `ProxyPass` directive, controls the method by which Apache distributes requests to the backend server. There are three options displayed in commented lines (e.g. beginning with hash marks, `#`). The first, `lbmethod=byrequests` is the default and equivalent to not specifying a `lbmethod=` argument. `byrequests` distributes requests, so that each backend server receives the same number of requests or the configured share of the requests. By contrast the `bytraffic` and `bybusyness` methods attempt to distribute the traffic between different cluster elements by assessing the amount of actual traffic and load, respectively, on each backend. Test each method your deployment to ensure that you select the most useful load balancer method.

Apache also contains a "Balancer Manager" interface that you can use to first issue the following command to ensure that Apache's `mod_status` is enabled, and restart the server if needed:

    a2enmod status
    /etc/init.d/apache2 restart

Now include the following location directive in the virtual host where your cluster is configured:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<Location /balancer-manager>
    SetHandler balancer-manager
    Order Deny,Allow
    Deny from all
    Allow from 192.168.1.233
</Location>

{{< /file-excerpt >}}


Modify the `Allow from` directive to allow access *only* from your current local machine's IP address, and read more about [rule-based access control](/docs/web-servers/apache/configuration/rule-based-access-control). Now visit `/balancer-manager` of the domain of your virtual host (e.g. `example.com`,) in our example `http://example.com/balancer-manager` to use Apache's tools for managing your cluster. Ensure that the `/balancer-manager` location is **not** established at a location that is to be passed to a proxied server. Congratulations you are now able to configure a fully functional cluster of web servers using the Apache web server as a frontend!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Official Apache Documentation for Proxy Pass](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html)
- [Official Apache Documentation for Proxy Balancer](http://httpd.apache.org/docs/2.2/mod/mod_proxy_balancer.html)
- [Configure ProxyPass and Multiple Web Servers with Apache](/docs/web-servers/apache/proxy-configuration/multiple-webservers-proxypass-ubuntu-10-10-maverick)




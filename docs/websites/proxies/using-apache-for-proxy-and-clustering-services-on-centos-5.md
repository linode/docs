---
author:
  name: Linode
  email: skleinman@linode.com
description: 'How to cluster Apache web servers and proxy requests for content to external servers on Centos 5.'
keywords: 'clusters,proxy,proxy pass,apache,httpd'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-servers/apache/proxy-configuration/proxy-and-clustering-services-centos-5/']
modified: Friday, April 29th, 2011
modified_by:
  name: System
published: 'Monday, March 22nd, 2010'
title: Using Apache for Proxy and Clustering Services on CentOS 5
---

The Apache HTTP server is a versatile and robust engine for providing access to resources over HTTP. With its modular design and standard [configuration system](/docs/web-servers/apache/configuration/configuration-basics), it is a popular and familiar option for systems administrators and architects who require a potentially diverse array of HTTP services, along with a stable and predictable administrative interface. In addition to simply serving content and facilitating the generation of dynamic content, the Apache HTTP server can be deployed as a front end server to mange clusters of web servers.

This guide provides a number of configuration examples and suggestions for using Apache as a front end server for other HTTP servers and clusters of servers. If you have not already installed Apache, consider our documentation on [installing Apache](/docs/web-servers/apache/installation/centos-5) before continuing with this guide. Additionally, consider our [getting started](/docs/getting-started/) and [beginner's guide](/docs/beginners-guide/) documents if you are new to Linode, and our [using Linux](/docs/using-linux/) series including the [administration basics](/docs/using-linux/administration-basics) guide if you are new to Linux server administration.

Case One: Separating Static Content from Dynamic Content
--------------------------------------------------------

In this configuration, Apache provides two or more virtual hosts which perform different functions. Here we might configure our site to use `static.ducklington.org` for hosting static resources for direct delivery like images, JavaScript, CSS files, media files, and static HTML, while using `ducklington.org` to host dynamic content including CGI scripts and PHP pages. In this kind of system it becomes easy to move the `static` subdomain to another Linode instance or content delivery system without modifying any internal configuration.

To accomplish this, insert the following configuration directives into your Virtual Hosting configuration:

{: .file-excerpt }
Apache Virtual Host Configuration
:   ~~~ apache
    <VirtualHost static.ducklington.org:80> 
        ServerAdmin admin@ducklington.org
        ServerName static.ducklington.org
        DocumentRoot /srv/www/static.ducklington.org/public_html/
        ErrorLog /srv/www/static.ducklington.org/logs/error.log 
        CustomLog /srv/www/static.ducklington.org/logs/access.log combined
    </VirtualHost>
    ~~~

Create the necessary directories by issuing the following commands:

    mkdir -p /srv/www/static.ducklington.org/public_html/
    mkdir -p /srv/www/static.ducklington.org/logs/        

Reload the web server configuration to create the virtual host. Issue the following command at this point and at any point after you've made changes to an Apache configuration file:

    /etc/init.d/httpd reload

Now, place the static files in the `/srv/www/static.ducklington.org/public_html/` folder and ensure all static content is served from URLs that begin with `http://static.ducklington.org/`. You must create an [A Record](/docs/dns-guides/introduction-to-dns#a_aaaa_records) that points to your Linode's IP for the `static.ducklington.org` domain. You can repeat and expand on this process by effectively creating a small cluster of independent servers that can serve separate components of a single website using sub-domains.

Case Two: Using ProxyPass to Delegate Services to Alternate Machines
--------------------------------------------------------------------

In our guide to using [multiple web servers with ProxyPass](/docs/web-servers/apache/proxy-configuration/multiple-webservers-proxypass-centos-5) we outline a method for configuring multiple websites using Apache's `mod_proxy`. Follow this guide, particularly the section regarding configuring [mod\_proxy](/docs/web-servers/apache/proxy-configuration/multiple-webservers-proxypass-centos-5#enabling_the_proxy_module) to ensure that `mod_proxy` is active.

Once `mod_proxy` is enabled and configured, you can insert the following directives into your virtual hosting configuration:

{: .file-excerpt }
Apache Virtual Host Configuration
:   ~~~ apache
    ProxyPass /static/ http://static.ducklington.org/
    ProxyPass /media http://media.ducklington.org
    ProxyPass /wiki/static/ !
    ProxyPass /wiki/ http://application.ducklington.org/
    ~~~

When added to the virtual host configuration for the `ducklington.org` domain, these directives will have the following effects.

-   All requests for resources located at `http://ducklington.org/static/` will be served by the server running at `http://static.ducklington.org`. As a result, a request from the user's perspective for `http://ducklington.org/static/screen.css` will return the resource located at `http://static.ducklington.org/screen.css`. Requests without a trailing slash (i.e. `http://ducklington.org/static`) will not be passed to an external server.
-   All requests for resources located at `/media` and paths "below" this location will return resources located at `http://media.ducklington.org`. This functions the same as the `ProxyPass` for `static` above, except it does not include the trailing slash for either domain name. Either form is acceptable, but both the local server address and the proxied URL must agree to ensure that the number of slashes is correct.
-   Requests for `http://ducklington.org/wiki/static/` will **not** be proxied to `http://application.ducklington.org/static/` and will be served or processed by the current virtual host, in a manner described outside of the current excerpt. Use the `!` directive instead of a URL to add an exception for a subdirectory of a directory that is to be proxy passed. Proxy exclusions must be declared before proxy passes.
-   Requests for resources located below `/wiki/` will be passed to the external server located at `http://application.ducklington.org/` in the conventional manner as described for `/static/` and `/media`. Note that exclusions *must* be declared before proxy passes are declared.

In essence, the `ProxyPass` directive in this manner allows you to distribute serving HTTP resources amongst a larger pool of machines. At the same time, end users will still see a unified and coherent website hosted on a single domain.

Case Three: Proxy only Some Requests to a Back End
--------------------------------------------------

While using `ProxyPass` directives allows you to distribute resources by directory amongst a collection of back end servers, this kind of architecture only makes sense for some kinds of deployments. In many situations, administrators might like to have much more fine-grained control over the requests passed to external servers. In conjunction with [mod\_rewrite](/docs/web-servers/apache/configuration/rewriting-urls), we can configure `mod_proxy` to more flexibly pass requests to alternate backends.

Before continuing, ensure that you've completed the ProxyPass guide, particularly the section regarding configuring `mod_proxy`. Do not forget to create and configure the `/etc/httpd/conf.d/proxy.conf` file.

Once `mod_proxy` is enabled and properly configured, ensure that it is configured properly. You can insert the following directives into your virtual hosting configuration. Consider the following example Virtual Hosting configuration:

{: .file-excerpt }
Apache Virtual Host Configuration
:   ~~~ apache
    <VirtualHost ducklington.org:80>
        ServerName ducklington.org
        ServerAlias www.ducklington.org
        DocumentRoot /srv/www/ducklington.org/public_html/

        ErrorLog /srv/www/ducklington.org/logs/error.log 
        CustomLog /srv/www/ducklington.org/logs/access.log combined

        RewriteEngine On
        RewriteRule ^/blog/(.*)\.php$ http://app.ducklington.org/blog/$1.php [proxy]
    </VirtualHost>
    ~~~

In this example all requests for resources that end with `.php` are proxied to `http://app.ducklington.org/blog/`. This would include requests for `http://ducklington.org/blog/index.php` and `http://ducklington.org/blog/archive/index.php`, but not `http://ducklington.org/blog/screen.css` or `http://ducklington.org/blog/` itself. All requests that do not end in `.php` will be served from resources located in the `DocumentRoot`. The `[proxy]` flags tell Apache that the rewritten URL should be passed to the Proxy module; this is equivalent to using the `last` directive as well. When a match is made, rewriting stops and the request is processed.

While this method of specifying resources for proxying is much more limited in some respects, it does allow you to very specifically control and distribute HTTP requests among a group of servers. Use the above example and the others that follow as inspiration when constructing the rewrite rules for your deployment:

{: .file-excerpt }
Apache Virtual Host Configuration
:   ~~~ apache
    RewriteRule ^/(.*)\.js$ http://static.ducklington.org/javascript/$1.js [proxy]
    RewriteRule ^/(.*)\.css$ http://static.ducklington.org/styles/$1.css [proxy]
    RewriteRule ^/(.*)\.jpg$ http://static.ducklington.org/images/$1.jpg [proxy]

    RewriteRule ^/blog/(.*)\.php$ http://app.ducklington.org/wordpress/$1.php [proxy]
    RewriteRule ^/wiki/(.*)$ http://app.ducklington.org/mediawiki/$1 [proxy]
    ~~~

In the first group we present three examples of requests for specific types of files that will be proxied to various directories in the `http://static.ducklington.org/` host. Note that the entire contents of the parenthetical (e.g. `(.*)` in this case) will be passed to the proxy host. If you do not capture the extension of a request in the regular expression, you must add it to the rewritten location. Using the first example, assuming these rewrite rules are in the `ducklington.org` virtual host, requests for `http://ducklington.org/toggle.js` and `http://ducklington.org/blog/js/functions.js` are passed to `http://static.ducklington.org/javascript/toggle.js` and `http://static.ducklington.org/javascript/blog/js/functions.js`.

In the second group of examples, rather than passing the entire request back to a proxy, we choose to only pass a part of the request. In the first rule of this group, a request for `http://ducklington.org/blog/index.php` would be served from `http://app.ducklington.org/wordpress/index.php`. However a request for `http://ducklington.org/wordpress/style.css` would not be be passed to `app.ducklington.org`; indeed, given the earlier rules, this request would be passed to `http://static.ducklington.org/styles/wordpress/style.css`. In the second rule in this example, every request for a resource that begins with `http://ducklington.org/wiki/` would be passed to `http://app.ducklington.org/mediawiki/`. With this rewrite rule, both `http://ducklington.org/wiki/index.php` and `http://ducklington.org/wiki/info/about.html` would be rewritten as `http://app.ducklington.org/mediawiki/index.php` and `http://app.ducklington.org/mediawiki/info/about.html`.

In order to ensure that your rewrite rules function as predicted, keep in mind the following:

-   If you use the extension to match the request and pass it to a specific backend server and the backend server expects files with extensions, you must add those extensions to the second part of the rewrite rule.
-   When a rewrite rule with a `proxy` flag is used and a request matches that rewrite rule, the request will be passed to `mod_proxy` even if a more precise rewrite rule matches further down in the configuration. Ensure that your rules are arranged such that less specific rewrite rules are declared after more precise ones to avoid unintentional conflicts.

Case Four: Forward All Non-Static Content to an External Server
---------------------------------------------------------------

Using `mod_rewrite` to direct requests to proxied resources gives administrators a great deal of power and fine grained control over where and how requests are passed to the back end servers. At the same time, it can add a great deal of complexity to the configuration of the web-server that may be difficult to manage. Minor updates and small changes to configuration can have large and unintended impacts on the function of a website. For this reason it is always crucial that you fully test your configuration before the initial deployment or before you deploy *any* updates.

The following case presents a more streamlined and simple proxy and rewrite example. Consider the following configuration directives:

{: .file-excerpt }
Apache Virtual Host Configuration
:   ~~~ apache
    <VirtualHost ducklington.org:80>
        ServerName ducklington.org
        ServerAlias www.ducklington.org
        DocumentRoot /srv/www/ducklington.org/public_html/

        ErrorLog /srv/www/ducklington.org/logs/error.log 
        CustomLog /srv/www/ducklington.org/logs/access.log combined

        RewriteEngine On
        RewriteCond /srv/www/ducklington.org/public_html%{REQUEST_FILENAME} !-f
        RewriteRule ^/(.*)$ http://app.ducklington.org/$1 [proxy]
    </VirtualHost>
    ~~~

In this example, the `RewriteCond` controls the behavior of the `RewriteEngine` so that requests for resources will *only* be passed to the proxied server (e.g. `http://app.ducklington.org/`) if there is no file in the `/srv/www/ducklington.org/public_html/` directory that matches the request. All other requests are passed to `http://app.ducklington.org/`. This kind of configuration is quite useful in situations where your deployment's dynamic content is powered by an application specific HTTP server but also requires static content that can be more efficiently served directly from Apache.

Case Five: Deploy an Apache Proxy Cluster
-----------------------------------------

All of the previous cases presented in this document outline configurations for using `mod_proxy` in various configurations to make it possible to use your Apache HTTP server as a front end for a more complex architecture. This case takes this one step further by allowing Apache to proxy requests to a group of identical backend servers, and thus be able to handle a much larger load.

Ensure that you have a `/etc/httpd/conf.d/proxy.conf` file as described in the [mod\_proxy](/docs/web-servers/apache/proxy-configuration/multiple-webservers-proxypass-centos-5#enabling_the_proxy_module) documentation. Do not forget to reload the Apache configuration again once you have fully configured your virtual host and cluster. Consider the following Apache configuration directives:

{: .file-excerpt }
Apache Virtual Host Configuration
:   ~~~ apache
    <VirtualHost ducklington.org:80>
        ServerName ducklington.org
        ServerAlias www.ducklington.org

        ErrorLog /srv/www/ducklington.org/logs/error.log 
        CustomLog /srv/www/ducklington.org/logs/access.log combined

        <Proxy balancer://cluster>
            BalancerMember http://app1.ducklington.org
            BalancerMember http://app2.ducklington.org
            BalancerMember http://app3.ducklington.org
            BalancerMember http://app4.ducklington.org
            BalancerMember http://app5.ducklington.org
        </Proxy>

        ProxyPass / balancer://cluster/

        # ProxyPass / balancer://cluster/ lbmethod=byrequests
        # ProxyPass / balancer://cluster/ lbmethod=bytraffic
        # ProxyPass / balancer://cluster/ lbmethod=bybusyness
    </VirtualHost>
    ~~~

In this case we establish a cluster of services running on hosts named `app1.ducklington.org` through `app5.ducklington.org`. You can specify any host name or IP and port combination when creating the initial cluster. The `BalancerMember` directive also takes all of the arguments of the [ProxyPass directive](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html#proxypass) which allow you to customize and limit the behavior of each cluster component. Variables like `min=`, `max=`, and `Max=` allow you to control "minimum" and "maximum" limits for sessions as well as a "soft maximum" which sets a soft maximum after which additional connections will be subject to a time to live. Once the cluster is established simply use the `ProxyPass` directive as described in earlier cases to pass requests to the cluster.

The `lbmethod=` argument to the `ProxyPass` directive controls the method by which Apache distributes requests to the back end server. There are three options displayed in commented lines (e.g. beginning with hash marks, `#`). The first, `lbmethod=byrequests`, is the default and equivalent to not specifying a `lbmethod=` argument. `byrequests` distributes requests so that each backend server receives the same number of requests or the configured share of the requests. By contrast the `bytraffic` and `bybusyness` methods attempt to distribute the traffic between different cluster elements by assessing the amount of actual traffic and load, respectively, on each backend. Test each method with your deployment to ensure that you select the most useful load balancer method.

Apache also contains a "Balancer Manager" interface that you can use to monitor the status of the cluster. Begin by including the following location directive in the virtual host where your cluster is configured:

{: .file-excerpt }
Apache Virtual Host Configuration
:   ~~~ apache
    <Location /balancer-manager>
        SetHandler balancer-manager
        Order Deny,Allow
        Deny from all
        Allow from 192.168.1.233
    </Location>
    ~~~

Modify the `Allow from` directive to allow access *only* from your current local machine's IP address, and read more about [rule-based access control](/docs/web-servers/apache/configuration/rule-based-access-control). Now visit `/balancer-manager` of the domain of your virtual host (e.g. `ducklington.org`,) in our example `http://ducklington.org/balancer-manager` to use Apache's tools for managing your cluster. Ensure that the `/balancer-manager` location is **not** established at a location that is to be passed to a proxied server. Congratulations you are now able to configure a fully functional cluster of web servers using the Apache web server as a front end!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Official Apache Documentation for Proxy Pass](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html)
- [Official Apache Documentation for Proxy Balancer](http://httpd.apache.org/docs/2.2/mod/mod_proxy_balancer.html)




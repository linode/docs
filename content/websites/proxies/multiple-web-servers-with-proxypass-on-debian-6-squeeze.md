---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'How to use separate web servers to host sites or applications using ProxyPass with Apache.'
keywords: ["apache", "proxypass", "apache on debian", "multiple web servers"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/proxy-configuration/multiple-webservers-proxypass-debian-6-squeeze/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2011-04-07
title: 'Multiple Web Servers with ProxyPass on Debian 6 (Squeeze)'
---

In some cases, administrators find that while Apache meets most of their general-purpose web serving needs, other web or application servers are better suited for certain tasks. Fortunately, it's easy to configure Apache to pass certain requests to other web server processes. These secondary (or tertiary) web servers may be running on the same Linode or separate nodes (perhaps via private networking). Our examples use lighttpd as a secondary web server, but they apply to any web server or application you'd like to proxy HTTP requests to.

We assume you already have Apache running on your Linode; if you don't, you may wish to review our [Apache on Debian 6 (Squeeze) guide](/docs/web-servers/apache/installation/debian-6-squeeze) before proceeding. These steps should be performed as root via a shell session.

Enabling the Proxy Module
-------------------------

We'll edit the file `/etc/apache2/mods-available/proxy.conf` as follows:

{{< file-excerpt "/etc/apache2/mods-available/proxy.conf" apache >}}
<IfModule mod_proxy.c>
        # [...]

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


This turns on proxy support in the module configuration. **Please note** the warning regarding the `ProxyRequests` directive. It should be "off" in your configuration. Next, we'll issue the following commands:

    a2enmod proxy
    a2enmod proxy_http
    /etc/init.d/apache2 restart

Apache should restart cleanly. If you encounter any issues, you may wish to inspect the logs available under `/var/log/apache2/` for more information.

Proxying a Domain to Lighttpd
-----------------------------

We already have a site called "www.firstsite.org" running under Apache as a normal virtual host. We'll use Apache to send requests for the site "www.secondsite.org" to lighttpd, which we've configured to run on port 8080 on localhost. Here's the configuration file for "www.secondsite.org":

{{< file "/etc/apache2/sites-available/www.secondsite.org" apache >}}
<VirtualHost *:80>
     ServerAdmin support@secondsite.org
     ServerName secondsite.org
     ServerAlias www.secondsite.org

     ProxyPass / http://localhost:8080/

     # Uncomment the line below if your site uses SSL.
     #SSLProxyEngine On
</VirtualHost>

{{< /file >}}


The `ProxyPass` directive tells Apache to forward all requests for this domain to a web server running on port 8080. If our target server was running on another Linode (as with a server that only answers on the backend private network), we could just specify that address instead. We'll enable the site with the following commands:

    a2ensite www.secondsite.org
    /etc/init.d/apache2 reload

Let's do some testing. Here's the normal Apache-served site "www.firstsite.org" in our browser:

[![Website running under Apache on Debian 6 (Squeeze).](/docs/assets/196-proxypass-apache-site.png)](/docs/assets/196-proxypass-apache-site.png)

Here's the site "www.secondsite.org" being served by lighttpd via ProxyPass:

[![Website running under Lighttpd on Debian 6 (Squeeze).](/docs/assets/197-proxypass-lighttpd-site.png)](/docs/assets/197-proxypass-lighttpd-site.png)

Proxying a Specific URL to Lighttpd
-----------------------------------

If we wanted to have `http://www.firstsite.org/myapp/` served by a web application running under lighttpd, we'd simply modify its configuration file to look like this:

{{< file "/apache2/sites-available/www.firstsite.org" apache >}}
<VirtualHost firstsite.org:80>
     ServerAdmin support@firstsite.org
     ServerName firstsite.org
     ServerAlias www.firstsite.org
     DocumentRoot /srv/www/firstsite.org/public_html/
     ErrorLog /srv/www/firstsite.org/logs/error.log
     CustomLog /srv/www/firstsite.org/logs/access.log combined

     ProxyPass /myapp http://localhost:8080/
</VirtualHost>

{{< /file >}}


Now the location "/myapp" will be served by lighttpd instead of Apache. After reloading the Apache configuration with `/etc/init.d/apache2 reload`, we can see that it's functioning correctly:

[![Web application running under a directory via lighttpd on Debian 6 (Squeeze).](/docs/assets/198-proxypass-lighttpd-directory.png)](/docs/assets/198-proxypass-lighttpd-directory.png)

This is an easy method for hosting multiple application servers (with different web server requirements) under a single domain.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Apache Module mod\_proxy](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html)
- [Apache HTTP Server Version 2.2 Docs](http://httpd.apache.org/docs/2.2/)




---
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction to mod\_alias for managing file system resources with the Apache web server.'
keywords: ["resources", "http", "files", "management", "mod\\_alias", "Alias", "apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/configuration/managing-resources-with-apache-alias/','websites/apache-tips-and-tricks/managing-resources-with-apache-modalias/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-02-24
title: 'Managing Resources with Apache mod_alias'
external_resources:
 - '[Apache Installation](/docs/web-servers/apache/)'
 - '[LAMP Stack Guides](/docs/lamp-guides/)'
 - '[Guide for Redirecting URLs](/docs/web-servers/apache/configuration/redirecting-urls)'
 - '[Guide for URL Rewriting with Apache](/docs/web-servers/apache/configuration/rewriting-urls)'
 - '[Troubleshooting Apache](/docs/web-servers/apache/troubleshooting/)'
 - '[Linode User Community](http://linode.com/community/)'
---

In many cases, all of the resources served by an Apache host are located in that host's `DocumentRoot`. The `DocumentRoot` is a directory specified in the `<VirtualHost>` configuration block. This directory is intended to represent the various files, directories, and resources that users access over HTTP on the file system. However, it is common for administrators to provide HTTP access to a resource on the file system which is *not* located in the `DocumentRoot`. While Apache will follow symbolic links in some situations, this can be difficult to maintain. As a result Apache makes it possible to specify an `Alias` that connects a location in the request to an alternate location.

This document explains how to use the `Alias` directive to manage resources on the file system while still providing access via HTTP. Furthermore, this guide assumes you have a working installation of Apache and have access to modify configuration files. If you have not installed Apache, you might want to consider one of our [Apache installation guides](/docs/web-servers/apache/) or [LAMP stack installation guides](/docs/lamp-guides/). If you want a more thorough introduction to Apache configuration, consider our [Apache configuration basics](/docs/web-servers/apache/configuration/configuration-basics) and [Apache configuration structure](/content/web-servers/apache/configuration/configuration-structure) documents.

## Creating Aliases

Typically, Virtual Host configurations specify a `DocumentRoot` which specifies a directory named, by convention, `public_html/` or `public/`. If the document root for the `example.com` virtual host is `/srv/www/example.com/public_html/`, then a request for `http://www.example.com/index.htm` will return the file located at `/srv/www/example.com/public_html/index.htm`.

If the administrator needed to maintain the `code/` resource on the file system at `/srv/git/public/` but have it be accessible at `http://example.com/code/`, an alias would be required. This is accomplished in the following example:

{{< file-excerpt "Apache Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html/
Alias /code /srv/git/public
<Directory /srv/git/public>
    Order allow,deny
    Allow from all
</Directory>

{{< /file-excerpt >}}


Without the `Alias` directive, a request for `http://example.com/code/` would return resources available in the folder `/srv/www/example.com/public_html/code/`. However, the `Alias` would direct Apache to serve content from the `/srv/git/public` directory. The `<Directory>` section permits remote users to access this directory.

There are a couple of important factors to consider when using `Alias` directives:

-   Directory blocks need to be created **after** `Alias` directives are asserted for the destination of the `Alias`. This makes it possible to permit access and otherwise control the behavior of those sections. In the example above that would be `/srv/git/public`.
-   In general trailing slashes are to be avoided in `Alias` directives. If the above had read `Alias /code/ /srv/git/public/` a request for `http://example.com/code`, without a trailing slash, would be served from the `DocumentRoot`.
-   `Alias` directives need to be created *either* in the root-level server config (e.g. `httpd.conf`) or inside of a `<VirtualHost>` configuration block.

In addition to `Alias`, Apache provides an `AliasMatch` directive that offers similar functionality. `AlaisMatch` provides the additional ability to alias a class of requests for a given resource to a location outside of the `DocumentRoot`. Let us consider another fictive `example.com` virtual host configuration:

{{< file-excerpt "Apache Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html/
AliasMatch /code/projects/(.+) /srv/git/projects/$1
<DirectoryMatch "^/srv/git/projects/.+$">
    Order allow,deny
    Allow from all
</Directory>

{{< /file-excerpt >}}


In this example, requests for URLs such as `http://example.com/code/projects/my_app` and `http://example.com/code/projects/my_app2` will be served resources in `/srv/git/projects/my_app` and `/srv/git/projects/my_app2` respectively. However, `http://example.com/code/projects` would be served from `/srv/www/example.com/public_html/code/projects/` rather than `/srv/git/projects/`, because of the trailing slash in the alias to `/code/projects/(.+)`.

Although the potential use case for `Alias` is somewhat narrow, the functionality is very powerful for maintaining a secure and well organized web server.

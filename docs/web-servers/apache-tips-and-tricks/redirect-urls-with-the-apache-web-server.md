---
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction to redirecting existing URLs to new resources with the Apache HTTP server.'
keywords: ["apache", "redirect", "mod_alias", "URLs", "REST"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/configuration/redirecting-urls/','websites/apache-tips-and-tricks/redirect-urls-with-the-apache-web-server/']
modified: 2017-02-21
modified_by:
  name: Phil Zona
published: 2009-10-13
title: Redirect URLs with the Apache Web Server
external_resources:
 - '[Installing Apache](/docs/websites/apache/)'
 - '[LAMP stack guides](/docs/websites/lamp/)'
 - '[Apache Redirect Guide](https://httpd.apache.org/docs/current/mod/mod_alias.html#redirect)'
 - '[Rewrite URLs with mod_rewrite and Apache](/docs/websites/apache-tips-and-tricks/rewrite-urls-with-modrewrite-and-apache)'
---

In this guide, you'll learn how to redirect URLs with Apache. Redirecting a URL allows you to return an HTTP status code that directs the client to a different URL, making it useful for cases in which you've moved a piece of content. Redirect is part of Apache's [mod_alias](https://httpd.apache.org/docs/current/mod/mod_alias.html) module.

![Redirect URLs with the Apache Web Server](/docs/assets/redirect-urls-with-the-apache-web-server.png "Redirect URLs with the Apache Web Server")

## Before You Begin

1.  This guide assumes you have followed our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and that you have already configured your Apache installation. If you haven't, refer to our [Apache guides](https://www.linode.com/docs/websites/apache/) or [LAMP stack guides](https://www.linode.com/content/websites/lamp/).

2.  In this guide, you will modify the Apache configuration files, so be sure you have the proper permissions to do so.

3.  Update your system.

The Apache virtual host configuration files are found in different places, depending on the distribution of Linux. For example, on CentOS 7: `/etc/httpd/conf.d/vhost.conf`; on Ubuntu 16.04: `/etc/apache2/sites-available/example.com.conf`. For the sake of brevity, configuration file excerpts in this guide will direct you to `Apache configuration option`.

Remember to reload Apache configuration after making changes:

{{< shell "CentOS 7">}}
sudo systemctl restart httpd

{{< /shell >}}

{{< shell "Ubuntu 16.04">}}
sudo systemctl restart apache2

{{< /shell >}}

## The Redirect Directive

`Redirect` settings can be located in your main Apache configuration file, but we recommend you keep them in your virtual host files or directory blocks. You can also use `Redirect` statements in `.httaccess` files. Here's an example of how to use `Redirect`:

{{< file-excerpt "Apache configuration option" apache >}}
Redirect /username http://team.example.com/~username/

{{< /file-excerpt >}}


If no argument is given, `Redirect` sends a temporary (302) status code, and the client is informed that the resource available at `/username` has temporarily moved to `http://team.example.com/~username/`.

No matter where they are located, `Redirect` statements must specify the full file path of the redirected resource, following the domain name. These statements must also include the full URL of the resource's new location.

You can also provide an argument to return a specific HTTP status:

{{< file-excerpt "Apache configuration option" apache >}}
Redirect permanent /username http://team.example.com/~username/
Redirect temp /username http://team.example.com/~username/
Redirect seeother /username http://team.example.com/~username/
Redirect gone /username

{{< /file-excerpt >}}


-   `permanent` tells the client the resource has moved permanently. This returns a 301 HTTP status code.
-   `temp` is the default behavior, and tells the client the resource has moved temporarily. This returns a 302 HTTP status code.
-   `seeother` tells the user the requested resource has been replaced by another one. This returns a 303 HTTP status code.
-   `gone` tells the user that the resource they are looking for has been removed permanently. When using this argument, you don't need to specify a final URL. This returns a 410 HTTP status code.

You can also use the HTTP status codes as arguments. Here's an example using the status code options:

{{< file-excerpt "Apache configuration option" apache >}}
Redirect 301 /username http://team.example.com/~username/
Redirect 302 /username http://team.example.com/~username/
Redirect 303 /username http://team.example.com/~username/
Redirect 410 /username

{{< /file-excerpt >}}


Permanent and temporary redirects can also be done with `RedirectPermanent` and `RedirectTemp`, respectively:

{{< file-excerpt "Apache configuration option" apache >}}
RedirectPermanent /username/bio.html http://team.example.com/~username/bio/
RedirectTemp /username/bio.html http://team.example.com/~username/bio/

{{< /file-excerpt >}}


Redirects can be made with [regex patterns](https://en.wikipedia.org/wiki/Regular_expression) as well, using `RedirectMatch`:

{{< file-excerpt "Apache configuration option" apache >}}
RedirectMatch (.*)\.jpg$ http://static.example.com$1.jpg

{{< /file-excerpt >}}


This matches any request for a file with a `.jpg` extension and replaces it with a location on a given domain. The parentheses allow you to get a specific part of the request, and insert it into the new location's URL as a variable (specified by `$1`, `$2`, etc.). For example:

-   A request for `http://www.example.com/avatar.jpg` will be redirected to `http://static.example.com/avatar.jpg` and
-   A request for `http://www.example.com/images/avatar.jpg` will be redirected to `http://static.example.com/images/avatar.jpg`.

## Beyond URL Redirection

In addition to redirecting users, Apache also allows you to [rewrite URLs](/docs/websites/apache-tips-and-tricks/rewrite-urls-with-modrewrite-and-apache) with `mod_rewrite`. While the features are similar, the main difference is that rewriting a URL involves the server returning a different request than the one provided by the client, whereas a redirect simply returns a status code, and the "correct" result is then requested by the client.

On a more practical level, rewriting a request does not change the contents of the browser's address bar, and can be useful in hiding URLs with sensitive or vulnerable data.

Although redirection allows you to easily change the locations of specific resources, you may find that rewriting better fits your needs in certain situations. For more information, refer to [Apache's mod_rewrite documentation](https://httpd.apache.org/docs/current/mod/mod_rewrite.html).

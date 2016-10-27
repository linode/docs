---
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction to redirecting existing URLs to new resources with the Apache HTTP server.'
keywords: 'apache,redirect,mod\_alias,URLs,REST'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['web-servers/apache/configuration/redirecting-urls/']
modified: Monday, August 22nd, 2011
modified_by:
  name: Linode
published: 'Tuesday, October 13th, 2009'
title: Redirect URLs with the Apache Web Server
external_resources:
 - '[Installing Apache](/docs/web-servers/apache/)'
 - '[LAMP stack guides](/docs/lamp-guides/)'
 - '[Troubleshooting Apache](/docs/web-servers/apache/troubleshooting/)'
 - '[Linode User Community](http://linode.com/community/)'
---

When HTTP resources, or web pages, change locations it is often important to provide some means of alerting users that these resources have moved. HTTP provides a number of "redirection" codes that can be used to facilitate this process, by communicating with the client application without interfering on the users experience.

Apache provides a number of "redirect" configuration directives that allow administrators to specify resources in the configuration file to redirect to another URL. When a request is redirected the server returns a result for that request that instructs the client to initiate a second request for the target resource's new location.

Redirections can tell the client that the requested page has been moved temporarily or permanently. Apache provides tools to easily support these functions. This guide covers the `Redirect` configuration directive, explains how to set various redirect options, and shows how to redirect classes of requests for resources to new locations.

This guide assumes you have a working installation of Apache and have access to modify configuration files. If you have not installed Apache, you might want to use one of our [Apache installation guides](/docs/web-servers/apache/) or [LAMP stack installaiton guides](/docs/lamp-guides/) to get up and running first. If you want a more thorough introduction to Apache configuration, consider our [basic Apache configuration](/docs/web-servers/apache/configuration/configuration-basics) and [Apache configuration structure](/docs/web-servers/apache/configuration/configuration-structure) documents.

## The Redirect Directive

The `Redirect` configuration directive can be located in "main" server configuration files, but we recommend that you keep them in your virtual hosting entry or directory blocks. It is also possible to assert `Redirect` statements in `.httaccess` files. Here is an example of a `Redirect` directive:

{: .file-excerpt }
Apache configuration option
:   ~~~ apache
    Redirect /username http://team.example.com/~username/
    ~~~

If no argument is given, `Redirect` sends a temporary (e.g. 302) status. In this case, the client (user agent) is informed that the resource available at `/username` has moved temporarily to `http://team.example.com/~username/`.

Remember that no matter what configuration file they are located in, `Redirect` statements must specify the full path of the redirected resource following the domain name. These statements must also include the full URL of the resource's new location..

To specify a particular HTTP redirection status, specify one of the following status:

{: .file-excerpt }
Apache configuration option
:   ~~~ apache
    Redirect permanent /username http://team.example.com/~username/
    Redirect temp /username http://team.example.com/~username/
    Redirect seeother /username http://team.example.com/~username/
    Redirect gone /username
    ~~~

This redirection tells the client that the resource has moved permanently, which corresponds to HTTP status 301. The "temp" status is the default behavior, specifying that the redirection is only temporary; this corresponds to HTTP status 302. The "seeother" status sends a signal (HTTP status 303) that says the requested resource has been replaced by another resource. Finally, the "gone" status tells the client that the resource has been removed (permanently); this sends the HTTP status 410, as an alternative to the unavailable "404" status. In the case of the "gone" redirection, omit the final URL.

You can also specify specific HTTP codes, as follows.

{: .file-excerpt }
Apache configuration option
:   ~~~ apache
    Redirect 301 /username http://team.example.com/~username/
    Redirect 302 /username http://team.example.com/~username/
    Redirect 303 /username http://team.example.com/~username/
    Redirect 410 /username
    ~~~

Apache also provides two additional directives for permanent and temporary redirections that are a bit more clear. They are as follows:

{: .file-excerpt }
Apache configuration option
:   ~~~ apache
    RedirectPermanent /username/bio.html http://team.example.com/~username/bio/
    RedirectTemp /username/bio.html http://team.example.com/~username/bio/
    ~~~

Additionally, Apache makes it possible to redirect a given class of requests to match a given regular expression using the `RedirectMatch` directive. For example:

{: .file-excerpt }
Apache configuration option
:   ~~~ apache
    RedirectMatch (.*)\.jpg$ http://static.example.com$1.jpg 
    ~~~

This directive matches against any request for a file with a `.jpg` extension and replaces it with a location on a second domain. Therefore:

-   A request for `http://www.example.com/avatar.jpg` will be redirected to `http://static.example.com/avatar.jpg` and
-   A request for `http://www.example.com/images/avatar.jpg` will be redirected to `http://static.example.com/images/avatar.jpg`.

## Beyond URL Redirection

The `Redirect` directive provides basic functionality to point requests for specific resource to different URLs and can help administrators move content to different servers and locations without breaking existing links. However, many Apache users use the facility to "rewrite" URLs in Apache's `mod_rewrite` module. If you're struggling to keep your Apache configuration organized or need more control than these `Redirect` statements can provide, we encourage you to investigate `mod_rewrite`.

Linode Guides & Tutorials contains an introduction to [rewriting URLs with mod\_rewrite and Apache](/docs/web-servers/apache/configuration/rewriting-urls), which you might find useful.
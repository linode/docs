---
author:
  name: Linode
  email: docs@linode.com
description: 'How to use the mod_rewrite engine to generate URLs with the Apache HTTP server.'
keywords: ["mod_rewrite", "REST", "URLs", "redirect", "apache", "httpd"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/configuration/rewriting-urls/','websites/apache-tips-and-tricks/rewrite-urls-with-modrewrite-and-apache/']
modified: 2017-02-21
modified_by:
  name: Phil Zona
published: 2009-11-06
title: 'Rewrite URLs with mod_rewrite and Apache'
external_resources:
 - '[Installing Apache](/docs/websites/apache/)'
 - '[LAMP stack guides](/docs/websites/lamp/)'
 - '[Apache Rewrite Guide](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)'
 - '[Redirect URLs with the Apache Web Server](/docs/websites/apache-tips-and-tricks/redirect-urls-with-the-apache-web-server)'
---

In this guide, you'll learn how to rewrite URLs with mod_rewrite and Apache. Rewriting a URL is a server-side operation that allows you to serve content from a file system location that doesn't correspond exactly with the client's request. This can be useful for improving URL readability by search engines and users, or updating locations of resources when your site architecture changes.

![Rewrite URLs with mod_rewrite and Apache](/docs/assets/rewrite-urls-with-modrewrite-and-apache.png "Rewrite URLs with mod_rewrite and Apache")

## Before You Begin

1.  This guide assumes you have followed our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and that you have already configured your Apache installation. If you haven't, refer to our [Apache guides](https://www.linode.com/docs/websites/apache/) or [LAMP stack guides](https://www.linode.com/docs/websites/lamp/).

2.  In this guide, we'll be modifying Apache configuration files, so be sure you have the proper permissions to do so.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

## Rewrite URLs

In a `<Directory>` block (usually found a virtual host file) or `.htaccess` file, enable mod_rewrite:

{{< file-excerpt "Apache Configuration Option" apache >}}
RewriteEngine on

{{< /file-excerpt >}}


You may create multiple separate rewrite rules. These rules provide a pattern that the server compares against incoming requests. If a request matches a rewrite pattern, the server modifies the request as described by the rule and processes that request. Here is an example of a rewrite rule:

{{< file-excerpt "Apache Configuration Option" apache >}}
RewriteRule ^post-id/([0-9]+)$ /posts/$1.html

{{< /file-excerpt >}}


Let's explain this rule: The first string is the pattern for matching against incoming requests. The second string specifies the actual files to be served. Rewrite patterns use [regular expression](https://en.wikipedia.org/wiki/Regular_expression) syntax. The `^` defines the beginning of the string, and the `$` defines the end of the string, meaning that the rewrite engine won't rewrite strings that  match only part of the pattern.

The string rewrites all URLs that specify paths beginning with `/post-id/` and contain one or more numbers (eg. `[0-9]+`), serving a corresponding `.html` file in the `/posts/` directory. The parenthetical term or terms in the pattern specify a variable that is passed to the second string as `$1`, `$2`, `$3` and so forth, depending on how many parentheticals are given in the first string..

You can create and apply multiple rewrite rules and these rules are applied sequentially. *The order in which `RewriteRules` are stated can affect which rules are matched*.

Optionally, you can insert a `RewriteBase` directive to modify the behavior of the rewrite rules. Let's assume:

-   These directives are specified for the `/srv/www/example.com/public_html/` directory.
-   Some users make a requests in the form `http://example.com/post-id/200`, where 200 might be any number longer than one digit.
-   Some users make a requests in the form `http://example.com/page/title-of-page`, where "title of page" might represent any string of characters.
-   The files are located on the filesystem at `/srv/www/example.com/public_html/objects/` and match requested object in name, but have an `.html` extension.

{{< file-excerpt "Apache Configuration Options" apache >}}
RewriteEngine on
RewriteBase /objects
RewriteRule ^post-id/([0-9]+)$ $1.html
RewriteRule ^page/([^/]+)$ $1.html

{{< /file-excerpt >}}


The above rewrite rules would take a request for:

-   `http://example.com/post-id/200/` and serve the file located at `/srv/www/example.com/public_html/objects/200.html`
-   `http://example.com/page/free-the-toast/` and serve the file located at `/srv/example.com/public_html/objects/free-the-toast.html`

This is useful when the locations of files on the file system do not correspond to the URLs as requested by the client. This is also particularly useful when all requests are generated dynamically by a single file, for example `index.php`.

## Rewrite URLs Under Specific Conditions

With the `RewriteCond` parameter, you can set conditions under which a `RewriteRule` will be used. Let's take the following example from the default rewrite rules for the [WordPress](/docs/web-applications/cms-guides/wordpress/) application:

{{< file-excerpt "Apache Configuration Option for WordPress" apache >}}
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]

{{< /file-excerpt >}}


In this example, all requests that begin with the top level of the context are affected by the rewrite rules. This is specified by the `RewriteBase /` directive. The context is determined by where the rewrite rules are specified in the virtual host, directory block, or `.htaccess` file.

The `RewriteCond` statements direct Apache to only apply the rule that follows them *if* their conditions are met. In the above example, the requested file name needs to *not* match an existing file on the file system (`!-f`) and *not* match an existing directory on the file system (`!-d`).

If both conditions are true and no file or directory exists that matches the request, Apache applies the rewrite rule. For example, if the user requests `http://example.com/?post=123` or `http://example.com/post/123` the server will return the result for `index.php?post=123` or `index.php/post/123`, respectively.

Multiple `RewriteCond` are connected with logical *AND* operators so that all conditions be true in order for a `RewriteRule` to apply for that request. You may also add an `[OR]` statement to the end of a `RewriteCond` directive to join a list of conditions with a logical *OR* and create several possible conditions where a request would be rewritten by a single `RewriteRule`. Consult [the Apache mod_rewrite documentation](https://httpd.apache.org/docs/current/mod/mod_rewrite.html) for more information about rewrite conditions.

## Redirection Codes in mod_rewrite

Finally, there are a number of codes that you may append to a `RewriteRule` that modify the behavior of the rewrite. In the previous example, `RewriteRule . /index.php [L]`, we used the `[L]` option which stands for "last rule". This prevents Apache from applying any additional rewrite rules after that rule. A few common options are:

-   `F` tells the client that the URL is forbidden, responding with HTTP code 403.
-   `N` forces `mod_rewrite` to begin the rewriting process again, and allows for multi-stage rewriting.
-   `R` tells the client that the requested page has moved, with the HTTP code 302 for temporary redirection. If the page has moved permanently, use "`R=301`."

You may also specify multiple options at the end of a `RewriteRule` separating them with commas: `[L,R=301]`

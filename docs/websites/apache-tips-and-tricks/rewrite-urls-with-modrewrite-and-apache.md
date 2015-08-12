---
author:
  name: Linode
  email: docs@linode.com
description: 'How to use the mod\_rewrite engine to generate useful and attractive URLs with the Apache HTTP server.'
keywords: 'mod\_rewrite,REST,URLs,redirect,apache,httpd'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-servers/apache/configuration/rewriting-urls/']
modified: Wednesday, May 4th, 2011
modified_by:
  name: Linode
published: 'Friday, November 6th, 2009'
title: 'Rewrite URLs with mod_rewrite and Apache'
external_resources:
 - '[Apache Rewrite Guide](http://httpd.apache.org/docs/2.2/rewrite/)'
 - '[Apache URL Redirection Guide](/docs/web-servers/apache/configuration/redirecting-urls)'
---

In contemporary web development, it is common for resources to be accessible over HTTP at locations which do not map to locations and resources on the file system. While [redirect statements](/docs/web-servers/apache/configuration/redirecting-urls) can be used to address this issue to some degree, many deployments have more complicated needs for URL rewriting. Apache's mod\_rewrite provides rewrite functionality so that users can interact with clean and clear URLs while still providing administrators the ability to architect their sites as they see fit.

This guide assumes you have a working installation of Apache and have proper permissions to modify configuration files. If you have not installed Apache, you might want to consider one of our [Apache installation guides](/docs/web-servers/apache/) or [LAMP stack installation guides](/docs/lamp-guides/). If you want a more thorough introduction to Apache configuration, consider our [basic Apache configuration](/docs/web-servers/apache/configuration/configuration-basics) and [Apache configuration structure](/docs/web-servers/apache/configuration/configuration-structure) documents.

## Rewrite URLs

In a `<Directory>` block or `.htaccess` file, enable mod\_rewrite with the following line:

{: .file-excerpt }
Apache Configuration Option
:   ~~~ apache
    RewriteEngine on
    ~~~

You may create any number of separate rewrite rules. These rules provide a pattern that the server compares incoming requests against. If a request matches a rewrite pattern, the server modifies the request as described by the rule and processes that request. Here is an example of a rewrite rule:

{: .file-excerpt }
Apache Configuration Option
:   ~~~ apache
    RewriteRule ^post-id/([0-9]+)$ /posts/$1.html
    ~~~

Let's parse this rule: To begin, note that the first string is the pattern for matching against incoming requests. The second string specifies the actual files to be served. Mod\_rewrite patterns use regular expression syntax: the `^` matches to the beginning of the string, and the `$` matches to the end of the string, meaning that the rewrite engine won't rewrite strings that partially match the pattern.

The string in question rewrites all URLs that specify paths beginning with `/post-id/` and contain one or more numbers (eg. `[0-9]+`), serving a corresponding `.html` file in the `/posts/` directory. The parenthetical term or terms in the pattern specify a variable that is passed to the second string as `$1`, `$2`, `$3` and so forth.

You can create and apply multiple rewrite rules, although these rules are matched sequentially. *The order in which `RewriteRules` are stated can affect which rules are matched*.

Optionally, you can insert a `RewriteBase` directive to modify the behavior of the rewrite rules. Let's assume:

-   These directives are specified for the `/srv/www/example.com/public_html/` directory.
-   Some users make a requests in the form `http://example.com/post-id/200`, where 200 might be any number longer than one digit.
-   Some users make a requests in the form `http://example.com/page/title-of-page`, where "title of page" might represent any string of characters.
-   The files are located on the filesystem at `/srv/www/example.com/public_html/objects/` and match requested object in name, but have an `.html` extension.

{: .file-excerpt }
Apache Configuration Options
:   ~~~ apache
    RewriteEngine on
    RewriteBase /objects
    RewriteRule ^post-id/([0-9]+)$ $1.html
    RewriteRule ^page/([^/]+)$ $1.html
    ~~~

The above set of rewrite rules would take a request for:

-   `http://example.com/post-id/200/` and serve the file located at `/srv/www/example.com/public_html/objects/200.html`
-   `http://example.com/page/free-the-toast/` and serve the file located at `/srv/example.com/public_html/objects/free-the-toast.html`

This is useful when the locations of files on the file system do not correspond to the URLs as requested by the client. This is also particularly useful when all requests are generated dynamically by a single file, for example `index.php`.

## Rewrite URLs Under Specific Conditions

With the `RewriteCond` parameter you can limit the conditions under which a `RewriteRule` will be used. Let's take the following example from the default rewrite rules for the [WordPress](/docs/web-applications/cms-guides/wordpress/) application:

{: .file-excerpt }
Apache Configuration Option for WordPress
:   ~~~ apache
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.php [L]
    ~~~

In this example, all requests that begin with the top level of the context are affected by the rewrite rules. This is specified by the `RewriteBase /` directive. The context is determined by where the directives are specified in the virtual host, directory block, or `.htaccess` file.

The `RewriteCond` statements direct Apache to only apply the rule that follows them *if* their conditions are met. In the above example, the requested file name needs to *not* match a regular file that exists on the file system (e.g. `!-f`) and *not* match an extant directory on the file system (e.g. `!-d`).

In short, if both of are true and no file or directory exists that matches the request, the web server appends the request to `index.php`. That is, f the user requests `http://example.com/?post=123` or `http://example.com/post/123` the server will return the result for `index.php?post=123` or `index.php/post/123` respectively.

Implicitly, multiple `RewriteCond` are connected with logical *AND* operators so that all conditions must evaluate to true to process the `RewriteRule` for that request. You may append an `[OR]` statement to the end of a `RewriteCond` directive to join a list of conditions with a logical *OR* and create several possible conditions whereby a request would be rewritten by a single `RewriteRule`. Consult [this external document for more information about rewrite conditions](http://httpd.apache.org/docs/2.2/mod/mod_rewrite.html#rewritecond)

## Redirection Codes in mod\_rewrite

Finally, there are a number of codes that you may append to a `RewriteRule` which modify the behavior of the rewrite. In the previous example `RewriteRule . /index.php [L]` we see the `[L]` option which stands for "last rule". This prevents Apache from applying any additional rewrite rules. The most prominent additional options include:

-   `F` tells the client that the URL is forbidden, responding with HTTP code 403.
-   `N` forces `mod_rewrite` to begin the rewriting process again, and allows for multi-stage rewriting.
-   `R` tells the client that the requested page has moved, with the HTTP code 302 for temporary redirection. To signify that the page has moved permanently, specify "`R=301`."

You may specify multiple options at the end of a `RewriteRule` separating them with commas, as in: `[L,R=301]`
---
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction to the structure of the Apache web server configuration for maintaining granular configuration.'
og_description: 'This guide is an introduction to the structure of an Apache configuration file. This guide offers a base for begining to understand the different configuration directives Apache has to offer.'
keywords: ["apache", "httpd", "configuration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/configuration/configuration-structure/','websites/apache-tips-and-tricks/apache-configuration-structure/']
modified: 2018-03-06
modified_by:
  name: Linode
published: 2010-02-24
title: Apache Configuration Structure
external_resources:
 - '[Apache Installation](/docs/web-servers/apache/)'
 - '[LAMP Stack Guides](/docs/web-servers/lamp/)'
 - '[Troubleshooting Apache](/docs/troubleshooting/troubleshooting-common-apache-issues/)'
---

Throughout our [Apache section](/docs/web-servers/apache/) and [LAMP stack tutorials](/docs/web-servers/lamp/), a very simple configuration based on `<VirtualHost>` is offered. This configuration is useful for hosting several websites on a single server. However, this approach does not provide granular control over resource usage within each site.

![Apache configuration structure](apache-configuration-structure-headerimg.jpg "Apache configuration structure")

The `<VirtualHost>` block provides administrators with the ability to modify the behavior of the web server on a per-host or per-domain basis; any options specified in the `<VirtualHost>` block apply to the entire domain. However, they don't provide the ability to specify options on a per-directory basis. Thankfully, Apache provides additional possibilities for specific configuration.

This document addresses a number of ways to configure the behavior of your web server on a very narrow per-directory and even per-file level. For more information about specific options, consult our other [Apache configuration guides](/docs/web-servers/apache/) or the official [Apache documentation](http://httpd.apache.org/docs/).

## Directory and Options

The `<Directory>` block refers to a directory within the filesystem and specifies Apache's behavior in that directory. This block is enclosed in angle brackets and begins with the word "Directory" and a path to a directory within the file system. Options set in a directory block apply to the directory and its sub directories as specified. The following is an example of a directory block:

{{< file "Virtual Host Entry in an Apache Configuration file" apache >}}
<Directory /srv/www/example.com/public_html/images>
    Order Allow,Deny
    Allow from all
    Deny 55.1
</Directory>

{{< /file >}}


### Additional Information

-   Directory blocks *cannot* be nested within each other.
-   Directory blocks *can* be nested within `<VirtualHost>` blocks.
-   The path contained in a directory block can contain the wildcard character. The asterisk will match any series of characters while a question mark will match against any single character. This may be useful if you need to control an option for the `DocumentRoot` of all virtual hosts:

  {{<file "Apache Configuration File" apache >}}
<Directory /srv/www/*/public_html>
{{< /file >}}

## File and Location Options

### File Options

If you need further control over specific files within a directory on your server, use the `<Files>` directive. This directive controls the behavior of the web server with regards to a single file. The `<Files>` directives will apply to any file with the specified name. For instance, the following example directive will match any file named `roster.htm` in the filesystem:

{{< file "Files Directive in an Apache Configuration file" apache >}}
<Files roster.htm>
     Order Allow,Deny
     Deny from all
</Files>

{{< /file >}}


If enclosed in the `<VirtualHost>` block, this will apply to all files named `roster.htm` in the `DocumentRoot` or in directories located within the `DocumentRoot` of that Host. If the `<Files>` directive is enclosed in a `<Directory>` block, the options specified will apply to all files named `roster.htm` within the directory, or within sub-directories of the directory specified.

### Location Options

While `<Directory>` and `<Files>` blocks control Apache's behavior with regards to locations in the *filesystem*, the `<Location>` directive controls Apache's behavior with regard to a particular path requested by the client. If a user makes a request for `http://www.example.com/webmail/inbox/`, the web server would look in the `webmail/inbox/` directory beneath the `DocumentRoot` such as `/srv/www/example.com/public_html/webmail/inbox/`. One common use for this functionality is to allow a script to handle requests made to a given path. For example, the following block directs all requests for the specified path to a `mod_python` script:

{{< file "Location Directive in an Apache Configuration file" apache >}}
<Location /webmail/inbox>
    SetHandler python-program
    PythonHandler modpython
    PythonPath "['/srv/www/example.com/application/inbox'] + sys.path"
</Location>

{{< /file >}}


Note that the options specified in `<Location>` directives are processed after the options specified in `<Directory>` blocks and can override any options set in these blocks.

## Override Options with htaccess

In addition to the configuration methods discussed above, by default Apache will read configuration options for a directory from a file located in that directory. This file is typically called `.htaccess`. Look for the following configuration options in your `httpd.conf` and connected files:

{{< file "/etc/httpd/httpd.conf or /etc/apache2/apache2.conf" apache >}}
AccessFileName .htaccess

<Files ~ "^\.ht">
    Order allow,deny
    Deny from all
</Files>

{{< /file >}}


The first line tells Apache to look in `.htaccess` files for configuration options in publicly accessible directories. The second `<Files ~ "^\.ht">` directive tells Apache to deny all requests to serve any file with a name that begins with the characters `.ht`. This prevents visitors from gaining access to configuration options.

You can change the `AccessFileName` to specify another name where Apache can look for these configuration options. If you change this option, be sure to update the `<Files>` directive to prevent unintentional public access.

Any option that can be specified in a `<Directory>` block can be specified in an `.htaccess` file. `.htaccess` files are particularly useful in cases where the operator of a website is a user who has access to edit files in the public directory of website, but not to any of the Apache configuration files.

`.htaccess` files are processed for each request and apply to all requests made for files in the current directory. The directives also apply to all the directories "beneath" the current directory in the file system hierarchy.

Despite the power and flexibility provided by `.htaccess` files, there are disadvantages to using them:

-   If `.htaccess` files are enabled, Apache must check and process the directives in the `.htaccess` file on every request. Furthermore Apache must check for `.htaccess` files in directories above the current directory in the file system. This can cause a slight performance degradation if access files are enabled, and applies even if they're not used.
-   Options set in `.htaccess` files can override options set in `<Directory>` blocks, which can cause confusion and undesirable behavior. Any option set in an `.htaccess` file can be set in a `<Directory>` block.
-   Allowing non-privileged users to modify web-server configurations presents a potential security risk, however the [AllowOverride](http://httpd.apache.org/docs/1.3/mod/core.html#allowoverride) options may mitigate this risk considerably.

If you want to disable `.htaccess` files for a directory or tree of directories, specify the following option in any *directory* block.

{{< file "Apache Directory block" apache >}}
AllowOverride None

{{< /file >}}

{{< note >}}
You can specify `AllowOverride All` for a directory that falls within a directory where overrides have been disabled.
{{</ note >}}

## "Match" Directives and Regular Expressions

In addition to the basic directives described above, Apache also allows server administrators some additional flexibility in how directories, files, and locations are specified. These "Match" blocks allow administrators to define a single set of configuration options for a class of directories, files, and locations. Here is an example:

{{< file "DirectoryMatch Block in an Apache Configuration file" apache >}}
<DirectoryMatch "^.+/images">
    Order Allow,Deny
    Allow from all
    Deny 55.1
</DirectoryMatch>

{{< /file >}}


This block specifies a number of options for any directory that matches the regular expression `^.+/images`. In other words, any path which begins with a number of characters and ends with images will match these options, including the following paths: `/srv/www/example.com/public_html/images/`, `/srv/www/example.com/public_html/objects/images`, and `/home/username/public/www/images`.

Apache also allows an alternate syntax for using regular expressions to define paths within a standard directory block. Adding a tilde (e.g. `~`) between `Directory` and the path causes the specified path to be read as a regular expression. Regular expressions are a standard syntax for pattern matching, and Apache supports standard and Perl regular expression variants.

Though `DirectoryMatch` is preferred, the following block is equivalent to the previous block:

{{< file "Directory Regular Expression Block in an Apache Configuration file" apache >}}
<Directory ~ "^.+/images">
    Order Allow,Deny
    Allow from all
    Deny 55.1
</Directory>

{{< /file >}}


Apache provides similar functionality for using regular expressions to match a class of locations or files to a single set of configuration directives. As a result, the following options all specify valid configurations:

{{< file "File and Location Match Directives" apache >}}
<Files ~ "^\..+">
    Order allow,deny
    Deny from all
</Files>

<FilesMatch "^\..+">
    Order allow,deny
    Deny from all
</FilesMatch>

<Location ~ "inbox$">
    Order Deny,Allow
    Deny from all
    Allow 192.168
</Location>

<LocationMatch "inbox$">
    Order Deny,Allow
    Deny from all
    Allow 192.168
</LocationMatch>

{{< /file >}}


The `<Files>` and `<FilesMatch>` directives above are equivalent, as are the `<Location>` and `<LocationMatch>` directives.


## Order of Precedence

With so many possible locations for configuration options, it is possible to specify one option in one file or block only to have it be overridden by another option later. One of the chief challenges in using the Apache HTTP server is in determining how all of the disparately located configuration options combine to produce specific web server behaviors.

The following list provides a guide to the priority that Apache uses to merge configuration options together. Later operations can override options specified earlier.

1.  `<Directory>` blocks are read first.
2.  `.htaccess` files are read at the same time as `<Directory>` blocks, but can override the options specified in `<Directory>` blocks if permitted by the `AllowOverride` option.
3.  `<DirectoryMatch>` and `<Directory ~>` are read next.
4.  `<Files>` and `<FilesMatch>` are read after directory behaviors have been determined.
5.  Finally, `<Location>` and `<LocationMatch>` are read.

Generally, `<Directory>` options are parsed in order from shortest to longest. In other words, options set for `/srv/www/example.com/public_html/objects` will be processed before options set for `/srv/www/example.com/public_html/objects/images` regardless of what order they appear in the configuration file. All other directives are processed in the order that they appear in the configuration file.

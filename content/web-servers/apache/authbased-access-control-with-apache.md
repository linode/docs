---
author:
  name: Linode
  email: docs@linode.com
description: 'Using HTTP AUTH to limit and control access to resources hosted on websites.'
keywords: ["access control", "http auth", "mod\\_auth", "http", "apache", "web server", "security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/configuration/http-authentication/','websites/apache/authbased-access-control-with-apache/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2009-12-07
title: 'Auth-based Access Control with Apache'
external_resources:
 - '[Installation of the Apache web server](/docs/web-servers/apache/)'
 - '[LAMP stack guides](/docs/lamp-guides/)'
 - '[Authentication and Access Control](http://httpd.apache.org/docs/2.2/howto/auth.html)'
 - '[Basic Authentication Module](http://httpd.apache.org/docs/2.2/mod/mod_auth_basic.html)'
---

In many situations, HTTP services are public and intended to be accessed by anyone with the ability to connect to the server. However, there are a number of cases where site administrators need to have some additional control over which users can access the server. In these contexts, it is useful to require users to submit authentication credentials (e.g. usernames and passwords) to a site before gaining access to a resource.

![Auth-based Access Control with Apache](/docs/assets/auth-based_access_control_with_apache.png "Auth-based Access Control with Apache")

This guide provides an overview of both credential-based and rule-based access control tools for the Apache HTTP server. We assume that you have a working installation of Apache and have access to modify configuration files. If you have not installed Apache, you might want to follow one of our [Apache installation guides](/docs/web-servers/apache/) or [LAMP stack installation guides](/docs/lamp-guides/). If you want a more thorough introduction to Apache configuration, please reference our [Apache HTTP server configuration basics](/docs/web-servers/apache/configuration/configuration-basics) and [Apache configuration structure](/docs/web-servers/apache/configuration/configuration-structure) guides.

## Configuring HTTP Authentication

To enable passwords for a directory, insert the following lines into the appropriate `<Directory>` section of an Apache configuration file. You may also insert authentication information in an `.htaccess` file or in a virtual host configuration section. The required directives are:

{{< file-excerpt "Apache Configuration File" apache >}}
AuthType Basic
AuthUserFile /srv/auth/.htpasswd
AuthName "Sign In Here To Gain Access To the Site"
Require valid-user

{{< /file-excerpt >}}


The `AuthType` directive specifies which authentication method Apache should use when connecting with clients. `Basic` requires that passwords be sent as **clear text** over the network. As a result we don't recommend using this to protect sensitive resources.

The `AuthUserFile` specifies the path (in full) to the password file where the passwords are stored. The `AuthName` directive contains the message which the browser uses to inform the user of what resource they're authenticating to. The value is arbitrary. The `Require valid-user` setting simply tells Apache that any valid user can authenticate.

At this point we need to create a password file. While this file can be located anywhere on the filesystem, we **strongly** recommend that you not place them in a web accessible directory. By default, all files beginning with `.ht` are not web-accessible in most default configurations of Apache, but this should not be assumed.

## Generating HTTP AUTH Passwords

To generate passwords, we need the `htpasswd` tool. For many distributions, this tool may have been installed when you installed Apache itself. Debian and Ubuntu users will have to update their system and install the `apache2-utils` package with the following commands:

    apt-get update
    apt-get upgrade
    apt-get install apache2-utils

To create a new file with a single user, issue the following command:

    htpasswd -c /srv/auth/.htpasswd username

In this example, we instruct the program to create a new `AuthUserFile` with the `-c` option. The file is to be located at `/srv/auth/.htpasswd` and the user name is `username`. `htpasswd` will prompt you to enter a password and then confirm the password.

If you have an existing file, omit the `-c` option. The `-b` option allows you to enter the password as the last parameter of the command, as in this example :

    htpasswd -b /srv/auth/.htpasswd username 5t1ck6

The `AuthUserFile` will, when populated look something like this:

{{< file-excerpt "/srv/auth/.htpasswd" apache >}}
AuthType Basic
AuthUserFile /srv/auth/.htpasswd
AuthGroupFile /srv/auth/.htpgroup
Require group Authorized

{{< /file-excerpt >}}


In this example, we cite the same `AuthUserFile`, but we add an `AuthGroupFile` that specifies user groups. The group file contains a list of user groups and the usernames associated with each group. The `htgroup` file, like the `htpasswd` file, can be located anywhere on the file system. For clarity's sake, we recommend that `htgroup` be in the same directory as the `htpasswd` file. Here is an example of an `htgroup` file:

{{< file-excerpt "/srv/auth/.htgroup" >}}
Authorized: username betty Team: fore hobby

{{< /file-excerpt >}}


Given this `htgroup` file, only the users `username` and `betty` will have access to the above listed resource. The syntax of the group file follows a simple `[groupname]: [username 1] [username 2] [...]`. You can put as many usernames from your `AuthUserFile` into a group entry as you need for the particular resource.

## The Caveats of HTTP Authentication

-   In "Basic" HTTP AUTH credentials are sent unencrypted over the wire, which makes HTTP AUTH particularly subject to so called "man-in-the-middle" attacks. As a result, this authentication method shouldn't be used for protecting sensitive information.
-   In HTTP AUTH session authentication credentials must be exchanged between the client and the server for every request. While most client software can cache this information so that the user only has to enter the username and password once, the authentication credentials must be passed for every request. This can add additional network overhead.
-   When Apache processes an HTTP AUTH request it must parse through the entire `htpasswd` file. When the file only stores a few passwords the processing time is negligible, but when password files grow, requests can longer to process.

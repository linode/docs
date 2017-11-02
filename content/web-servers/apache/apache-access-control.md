---
author:
  name: Linode
  email: docs@linode.com
description: 'Using HTTP AUTH to limit and control access to resources hosted on websites.'
keywords: ["access control", "http auth", "mod_auth", "http", "apache", "web server", "security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/configuration/http-authentication/','websites/apache/authbased-access-control-with-apache/','websites/apache/apache-access-control/']
modified: 2015-11-20
modified_by:
  name: Linode
published: 2009-12-07
title: 'Apache Access Control'
external_resources:
 - '[Installation of the Apache web server](/docs/web-servers/apache/)'
 - '[LAMP stack guides](/docs/lamp-guides/)'
 - '[Authentication and Access Control](http://httpd.apache.org/docs/2.2/howto/auth.html)'
 - '[Basic Authentication Module](http://httpd.apache.org/docs/2.2/mod/mod_auth_basic.html)'
---

While most web server content is created to be available to the public, you may want to restrict some or all of a website to specific users or groups. **HTTP Auth** lets you easily create these restrictions.

This guide provides an overview of both credential-based and rule-based access control tools for Apache.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode’s hostname is set.

2.  Have a working installation of Apache. If you have not installed Apache, you might want to follow one of our [Apache installation guides](/docs/websites/apache/) or [LAMP stack installation guides](/docs/websites/lamp).

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

This guide uses the same example file paths as our [Apache on Debian 8](/docs/websites/apache/apache-web-server-debian-8) guide. Be sure to adjust for your distribution.
{{< /note >}}

## Apache Access Control

To enable passwords for a directory, insert the following lines into the appropriate `<Directory>` section of an Apache configuration file. You may also insert authentication information in an `.htaccess` file or in a virtual host configuration section. The required directives are:

{{< file-excerpt "Apache Configuration File" apache >}}
AuthType Basic
AuthUserFile /var/www/example.com/.htpasswd
AuthName "Sign In Here To Gain Access To the Site"
Require valid-user

{{< /file-excerpt >}}


* The `AuthType` directive specifies which authentication method Apache should use when connecting with clients. `Basic` requires that passwords be sent as **clear text** over the network. As a result we don't recommend using this to protect sensitive resources.

* The `AuthUserFile` specifies the path (in full) to the password file where the passwords are stored. In this example we're using the path `/var/www/example.com/.htpassword`. This is one directory above the `public_html` folder, preventing accidental exposure of the file. By default, all files beginning with `.ht` are not web-accessible in most default configurations of Apache, but this should not be assumed.


* The `AuthName` directive contains the message browser uses to inform the user of what resource they're authenticating to. The value is arbitrary.

* The `Require valid-user` setting simply tells Apache that any valid user can authenticate.

At this point we need to create a password file.

## Generating HTTP AUTH Passwords

To generate passwords, we need the `htpasswd` tool. For many distributions, this tool may have been installed when you installed Apache itself. Debian and Ubuntu users will have to install the `apache2-utils` package with the following commands:

    sudo apt-get install apache2-utils

To create a new file with a single user, issue the following command:

    htpasswd -c /var/www/example.com/.htpasswd username

In this example, we create a new `AuthUserFile` with the `-c` option. The file is located at `/var/www/example.com/.htpasswd` and the user name is `username`. `htpasswd` will prompt you to enter a password and then confirm the password. If you have an existing file, omit the `-c` option.

The `-b` option allows you to enter the password as the last parameter of the command, as in this example :

    htpasswd -b /srv/auth/.htpasswd username 5t1ck6

The `AuthUserFile` will, when populated look something like this:

{{< file-excerpt "/var/www/example.com/.htpasswd" >}}
hobby:isiA3Q4djD/.Q
admin:{SHA}x9VvwHI6dmgk9VTE0A8o6hbCw2s=
username:\$apr1\$vVzQJxvX\$6EyHww61nnZr6IdQv0pVx/

{{< /file-excerpt >}}


Each user is specified on their own line. Each line follows the form `[username]:[hash]`, where the `[hash]` is a cryptographic hash of the users' password. This provides one-way encryption and some small measure of additional security.

In the above example, the first `hobby` user's password is hashed using the "CRYPT" method, which is the default. This is not considered a secure encryption mechanism. If you specify the `-s` option in the `htpasswd` command, the password will be hashed with the SHA algorithm as in the second line of the above example. Finally, if you specify the `-m` option, `htpasswd` will use the MD5 hash to store the password. We recommend using either the SHA or the MD5 hash.

Additionally, if you would prefer to organize and maintain the `AuthUserFile` yourself, you can still use the `htpasswd` tool to generate the user entries. By specifying the `-n` option the program will output the appropriate line in the terminal. In the following example, the `htpasswd` entry is followed by the output of the command:

    htpasswd -nbs user2 strongpassword
    user2:{SHA}KuhoB50pPgoYXGcce82sUd8244U=

You can now append the `user2:{SHA}KuhoB50pPgoYXGcce82sUd8244U=` line to your `AuthUserFile` manually. Once this line is in the password file, the `betty` user credentials will be able to authenticate the HTTP server.

## Access Control Lists with Groups

In the `Require` directive above we specified the `valid-user`. This told Apache that any user who could authenticate against one of the users specified in the `AuthUserFile` could gain access to the site. While you can maintain separate password files for different resources, this is difficult to maintain for deployments with complex authentication needs.

To address this need, Apache allows you to use a single `AuthUserFile`, containing all users that will need to authenticate to the server. To limit the set of valid credentials to a specific subset of the users listed in the `.htpasswd` file, we must specify users in the `Require` directive. Only users specified after the `Require user` directive will be permitted to access the specified resource. For example:

{{< file-excerpt "Apache configuration option" >}}
Require user username admin

{{< /file-excerpt >}}


Given this directive, the users `username` and `admin` will be able to log into the resource. Any subset of users can be specified on the `Require` line. Apache also provides the ability to organize users into groups, and then permit access to resources based on group membership. The configuration directives for this setup would look like this:

{{< file-excerpt "Apache configuration file" apache >}}
AuthType Basic
AuthUserFile /srv/auth/.htpasswd
AuthGroupFile /srv/auth/.htgroup
Require group Authorized

{{< /file-excerpt >}}


In this example, we cite the same `AuthUserFile`, but we add an `AuthGroupFile` that specifies user groups. The group file contains a list of user groups and the usernames associated with each group. The `htgroup` file, like the `htpasswd` file, can be located anywhere on the file system. For clarity's sake, we recommend that `htgroup` be in the same directory as the `htpasswd` file. Here is an example of an `htgroup` file:

{{< file-excerpt "/var/www/example.com/.htgroup" >}}
Authorized: username username2
Team: admin hobby

{{< /file-excerpt >}}


Given this `htgroup` file, only the users `username` and `username2` will have access to the above listed resource. The syntax of the group file follows a simple `[groupname]: [username 1] [username 2] [...]`. You can put as many usernames from your `AuthUserFile` into a group entry as you need for the particular resource.

## The Caveats of HTTP Authentication

-   The `AuthType Basic` directive means credentials are sent unencrypted, which makes HTTP AUTH particularly subject to "man-in-the-middle" attacks. As a result, this authentication method shouldn't be used for protecting sensitive information without first encrypting the traffic over SSL.

-   In HTTP AUTH session authentication credentials must be exchanged between the client and the server for every request. While most client software can cache this information so that the user only has to enter the username and password once, the authentication credentials must be passed for every request. This can add additional network overhead.

-   When Apache processes an HTTP AUTH request it must parse through the entire `htpasswd` file. When the file only stores a few passwords the processing time is negligible, but when password files grow, requests can longer to process.

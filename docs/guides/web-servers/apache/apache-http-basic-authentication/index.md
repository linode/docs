---
slug: apache-http-basic-authentication
title: 'HTTP Basic authentication in Apache'
description: "Configure HTTP Basic authentication in Apache using password files, authenticated users, and group-based access restrictions."
og_description: "Configure HTTP Basic authentication in Apache using password files, authenticated users, and group-based access restrictions."
authors: ["Linode"]
contributors: ["Linode"]
published: 2009-12-07
modified: 2026-05-28
keywords: ["apache", "http authentication", "basic authentication", "htpasswd", "web server security"]
tags: ["http","web server","apache","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-servers/apache/configuration/http-authentication/','/guides/authbased-access-control-with-apache/','/websites/apache/authbased-access-control-with-apache/','/web-servers/apache/authbased-access-control-with-apache/','/websites/authbased-access-control-with-apache/']
external_resources:
 - '[Apache authentication and authorization](https://httpd.apache.org/docs/2.4/howto/auth.html)'
 - '[mod_auth_basic documentation](https://httpd.apache.org/docs/2.4/mod/mod_auth_basic.html)'
---

While most web server content is created to be available to the public, you may want to restrict some or all of a website to specific users or groups. Apache HTTP authentication lets you easily create these restrictions. HTTP authentication verifies a user's identity before Apache grants access to protected resources.

This guide explains how to configure HTTP Basic authentication in Apache using password files, authenticated users, and group-based access restrictions. For IP- and host-based restrictions, see our [Access control in Apache](/docs/guides/apache-access-control/) guide.

## Before you begin

1.  If you do not already have a virtual machine to use, create a compute instance with at least 4 GB of memory. See our [Get started](https://techdocs.akamai.com/cloud-computing/docs/getting-started) and [Create a Linode](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance) guides.

1.  Follow our [Set up and secure a Linode](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Configure HTTP Basic authentication

To require users to authenticate before accessing a directory, add the following directives to the appropriate `<Directory>` block, virtual host configuration, or `.htaccess` file. In most cases, prefer the main Apache configuration files over `.htaccess` files because they avoid per-request filesystem lookups and provide better performance:

```file {title="Apache configuration file" lang="apache"}
AuthType Basic
AuthUserFile /var/www/example.com/.htpasswd
AuthName "Authentication Required"
Require valid-user
```

-   The `AuthType` directive specifies which authentication method Apache should use when connecting with clients. Basic authentication sends credentials encoded but not encrypted over the network. As a result, you should always use HTTPS when protecting resources with Basic authentication.
-   The `AuthUserFile` directive specifies the full path to the password file where passwords are stored. In this example we're using the path `/var/www/example.com/.htpasswd`. This is one directory above the `public_html` folder, preventing accidental exposure of the file. By default, all files beginning with `.ht` are not web-accessible in most default configurations of Apache, but this should not be assumed.
-   The `AuthName` directive contains the message the browser uses to inform the user of what resource they're authenticating to. The value is arbitrary.
-   The `Require valid-user` setting simply tells Apache that any valid user can authenticate.

At this point you must create a password file.

## Generating passwords for HTTP Basic authentication

To generate passwords, we need the `htpasswd` tool. In some distributions, this tool is installed alongside Apache automatically. Debian and Ubuntu users will have to install the `apache2-utils` package with the following commands:

```command {title="Debian-based Linux distributions"}
sudo apt install apache2-utils
```

```command {title="RHEL-based Linux distributions"}
sudo dnf install httpd-tools
```

To create a new file with a single user, issue the following command:

```command
htpasswd -c /var/www/example.com/.htpasswd username
```

In this example, we create a new `AuthUserFile` with the `-c` option. The file is located at `/var/www/example.com/.htpasswd` and the user name is `username`. `htpasswd` will prompt you to enter a password and then confirm the password. If you have an existing file, omit the `-c` option.

The `-b` option allows you to enter the password as the last parameter of the command, as in this example:

```command
htpasswd -b /srv/auth/.htpasswd username 5t1ck6
```

When populated, the `AuthUserFile` looks something like this:

```file {title="/var/www/example.com/.htpasswd"}
hobby:isiA3Q4djD/.Q
admin:{SHA}x9VvwHI6dmgk9VTE0A8o6hbCw2s=
username:\$apr1\$vVzQJxvX\$6EyHww61nnZr6IdQv0pVx/
```

Each user is specified on their own line. Each line follows the form `[username]:[hash]`, where the `[hash]` is a cryptographic hash of the user's password. This stores passwords as one-way hashes rather than plaintext values.

The `htpasswd` utility supports multiple hashing formats, including APR1-MD5, SHA-1, and bcrypt depending on the Apache version and platform.

In the above example, the first `hobby` user's password is hashed using the "CRYPT" method, which is the default. This is not considered a secure hashing method. If you specify the `-s` option in the `htpasswd` command, the password will be hashed with the SHA-1 algorithm as in the second line of the above example. The `-m` option uses the APR1-MD5 hashing format, which remains common in Apache environments but is considered legacy compared to newer hashing methods.

Additionally, if you would prefer to organize and maintain the `AuthUserFile` yourself, you can still use the `htpasswd` tool to generate the user entries. By specifying the `-n` option the program will output the appropriate line in the terminal. In the following example, the `htpasswd` entry is followed by the output of the command:

```command
htpasswd -nbs user2 strongpassword
user2:{SHA}KuhoB50pPgoYXGcce82sUd8244U=
```

You can now append the `user2:{SHA}KuhoB50pPgoYXGcce82sUd8244U=` line to your `AuthUserFile` manually. After adding this line to the password file, the `user2` credentials can authenticate with the HTTP server.

## Access control lists with groups

In the `Require` directive above we specified the `valid-user`. This told Apache that any user who could authenticate against one of the users specified in the `AuthUserFile` could gain access to the site. While you can maintain separate password files for different resources, this is difficult to maintain for deployments with complex authentication needs.

To address this need, Apache allows you to use a single `AuthUserFile`, containing all users that will need to authenticate to the server. To limit the set of valid credentials to a specific subset of the users listed in the `.htpasswd` file, we must specify users in the `Require` directive. Only users specified in the `Require user` directive are permitted to access the resource.

```file {title="Apache configuration file"}
Require user username admin
```

With this directive, the users `username` and `admin` will be able to log into the resource. Any subset of users can be specified on the `Require` line. Apache also provides the ability to organize users into groups, and then permit access to resources based on group membership. The configuration directives for this setup would look like this:

```file {title="Apache configuration file"}
AuthType Basic
AuthUserFile /srv/auth/.htpasswd
AuthGroupFile /srv/auth/.htgroup
Require group Authorized
```

In this example, we cite the same `AuthUserFile`, but we add an `AuthGroupFile` that specifies user groups. The group file contains a list of user groups and the usernames associated with each group. The `htgroup` file, like the `htpasswd` file, can be located anywhere on the file system. For simplicity, we recommend that `htgroup` be in the same directory as the `htpasswd` file. Here is an example of an `htgroup` file:

```file {title="/var/www/example.com/.htgroup"}
Authorized: username username2
Team: admin hobby
```

With this `htgroup` file, only the users `username` and `username2` can access the listed resource. The syntax of the group file follows a simple `[groupname]: [username 1] [username 2] [...]`. You can put as many usernames from your `AuthUserFile` into a group entry as you need for the particular resource.

## Caveats of HTTP Basic authentication

-   The `AuthType Basic` directive sends credentials encoded but not encrypted. Always use HTTPS when protecting resources with HTTP authentication.
-   With HTTP Basic authentication, credentials must be exchanged between the client and server for every request. While most client software can cache this information so that the user only has to enter the username and password once, the authentication credentials must still be passed with each request. This can add additional network overhead.
-   When Apache processes an HTTP Basic authentication request it must parse through the entire `htpasswd` file. When the file only stores a few passwords the processing time is negligible, but when password files grow, requests can take longer to process.
---
slug: configure-access-control-in-apache
title: "Configure Access Control in Apache"
description: "Learn how to configure access control in Apache using the modern Require directive introduced in Apache 2.4. This guide covers IP- and host-based restrictions, rule combinations, and migration from legacy Apache 2.2 configurations."
og_description: "Learn how to configure access control in Apache using the modern Require directive introduced in Apache 2.4. This guide covers IP- and host-based restrictions, rule combinations, and migration from legacy Apache 2.2 configurations."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2026-04-27
keywords: ['access control', 'http auth', 'mod_auth', 'http', 'apache', 'web server', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Apache HTTP Server Documentation](https://httpd.apache.org/docs/current/)'
---

Access control in Apache determines which clients can access specific resources on your server. Apache 2.4 introduced a new authorization model based on the `Require` directive, replacing the deprecated `Order`, `Allow`, and `Deny` directives used in earlier versions.

This guide demonstrates how to configure access control using modern Apache 2.4 directives.

Access control is a fundamental part of securing web applications. By restricting access at the web server level, you can prevent unauthorized users from reaching sensitive resources before application logic is ever executed. Common use cases include limiting access to administrative interfaces, internal tools, staging environments, or API endpoints.

## Before you begin

1.  Install Apache HTTP Server 2.4 or later on your system:

    ```command
    sudo apt update
    sudo apt install apache2 -y
    ```
1.  Ensure you have root or sudo privileges to edit configuration files.

1.  Be familiar with editing configuration files and restarting services.

## Understanding access control in Apache 2.4

Apache 2.4 uses a rule-based authorization system built around the `Require` directive. This replaces the older `Order`, `Allow`, and `Deny` directives used in Apache 2.2.

In Apache 2.4, authorization is explicit and rule-based. Instead of relying on evaluation order, each `Require` directive defines a condition that must be met. These conditions can be combined to create precise access policies without relying on implicit behavior.

Access control rules are typically applied in `<Directory>` and `<Location>` blocks, within virtual host configuration files, or through `.htaccess` files.

Most access control functionality is provided by the `mod_authz_core` and `mod_authz_host` modules. These modules are enabled by default in most Apache installations.

## Basic access control rules

These directives are typically used to establish a default policy. For example, you might deny all access by default and then selectively allow specific clients.

Use the `Require` directive to allow or deny all requests.

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
Require all granted
```

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
Require all denied
```

These rules are often used as a baseline before applying more specific restrictions.

## Restricting access by IP address

IP-based restrictions are the most common form of access control. They are fast, reliable, and do not depend on DNS resolution.

Use `Require ip` to allow specific IP addresses or subnets.

Allow a single IP:

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
Require ip 192.168.1.10
```

Allow a subnet:

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
Require ip 192.168.1.0/24
```

Allow multiple networks:

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
Require ip 192.168.1.0/24
Require ip 10.0.0.0/8
```

## Restricting access by hostname

Hostname-based rules can be useful in environments where clients are identified by domain rather than fixed IP addresses.

Use `Require host` to match client hostnames:

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
Require host example.com
```

Hostname-based rules rely on reverse DNS lookups and can introduce latency or inconsistencies. Prefer IP-based rules when possible.

## Combining access rules

Combine rules using containers to express logical relationships between conditions. For example, requiring multiple conditions to be true, or allowing access if any one condition is satisfied.

### RequireAll

The `RequireAll` container allows access only if all of the enclosed conditions are met. This is useful for enforcing multiple requirements at the same time.

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
<RequireAll>
    Require ip 192.168.1.0/24
    Require not ip 192.168.1.50
</RequireAll>
```

### RequireAny

The `RequireAny` container allows access if any of the enclosed conditions are met. This is useful when multiple independent conditions should grant access.

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
<RequireAny>
    Require ip 192.168.1.0/24
    Require ip 10.0.0.0/8
</RequireAny>
```

### RequireNone

The `RequireNone` container denies access if any of the enclosed conditions are met. This is useful for explicitly blocking specific clients or networks.

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
<RequireNone>
    Require ip 203.0.113.10
</RequireNone>
```

## Applying access control rules

The following example demonstrates how to apply an access control rule to a specific directory and verify the result.

1.  Edit your Apache virtual host configuration file:

    ```command
    sudo nano /etc/apache2/sites-available/000-default.conf
    ```

    {{< note title="RHEL-based systems" type="secondary">}}
    On RHEL-based systems, edit `/etc/httpd/conf/httpd.conf` or a file in `/etc/httpd/conf.d/`.
    {{< /note >}}

    Add a rule to restrict access to a directory:

    ```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
    <Directory /var/www/html/private>
        Require ip 192.168.1.0/24
    </Directory>
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Test the Apache configuration:

    ```command
    sudo apachectl configtest
    ```

    ```output
    Syntax OK
    ```

1.  Restart Apache to apply changes:

    ```command
    sudo systemctl restart apache2
    ```

1.  From an allowed IP address, run:

    ```command
    curl -I http://your-server-ip/private
    ```

    ```output
    HTTP/1.1 200 OK
    ```

1.  From a blocked IP address, run:

    ```command
    curl -I http://your-server-ip/private
    ```

    ```output
    HTTP/1.1 403 Forbidden
    ```

### Using `.htaccess`

You can apply rules in a `.htaccess` file when you cannot modify the main configuration:

```file {title="/var/www/html/.htaccess"}
Require all denied
```

`.htaccess` files introduce performance overhead and should only be used when necessary.

## Migrating from Apache 2.2

Apache 2.2 used a different access control model based on `Order`, `Allow`, and `Deny`.

Because the underlying authorization model changed significantly, older configurations may not behave as expected when copied directly into Apache 2.4 without modification.

| Apache 2.2 Directive | Apache 2.4 Equivalent |
|---------------------|----------------------|
| `Allow from all` | `Require all granted` |
| `Deny from all` | `Require all denied` |
| `Allow from 192.168.1.0/24` | `Require ip 192.168.1.0/24` |
| `Deny from 192.168.1.10` | `Require not ip 192.168.1.10` |

Example conversion:

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
# Apache 2.2
Order deny,allow
Deny from all
Allow from 192.168.1.0/24
```

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
# Apache 2.4
Require ip 192.168.1.0/24
```

Apache 2.4 includes the `mod_access_compat` module for backward compatibility. Avoid using it in new configurations.

## Common access control patterns

The following examples demonstrate common real-world use cases for access control in Apache.

Restrict an admin directory:

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
<Directory /var/www/html/admin>
    Require ip 192.168.1.0/24
</Directory>
```

Block a specific IP:

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
<RequireAll>
    Require all granted
    Require not ip 203.0.113.10
</RequireAll>
```

Allow multiple trusted networks:

```file {title="/etc/apache2/sites-available/000-default.conf" lang="apache"}
<RequireAny>
    Require ip 192.168.1.0/24
    Require ip 10.0.0.0/8
</RequireAny>
```
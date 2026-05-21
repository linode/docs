---
slug: configure-access-control-in-apache
title: "Configure access control in Apache"
description: "Learn how to configure access control in Apache using the modern Require directive introduced in Apache 2.4. This guide covers IP- and host-based restrictions, rule combinations, and migration from legacy Apache 2.2 configurations."
og_description: "Learn how to configure access control in Apache using the modern Require directive introduced in Apache 2.4. This guide covers IP- and host-based restrictions, rule combinations, and migration from legacy Apache 2.2 configurations."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2026-04-27
keywords: ['access control', 'apache', 'apache 2.4', 'require directive', 'web server security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-servers/apache/configuration/http-authentication/','/websites/apache/apache-access-control/','/web-servers/apache/apache-access-control/','/guides/authbased-access-control-with-apache/','/websites/apache/authbased-access-control-with-apache/','/web-servers/apache/authbased-access-control-with-apache/','/websites/authbased-access-control-with-apache/']
external_resources:
- '[Apache HTTP Server Documentation](https://httpd.apache.org/docs/current/)'
---

Access control in Apache determines which clients can access specific resources on your server. Apache 2.4 introduced a new authorization model based on the `Require` directive, replacing the deprecated `Order`, `Allow`, and `Deny` directives used in earlier versions.

Access control is a fundamental part of securing web applications. By restricting access at the web server level, you can prevent unauthorized users from reaching sensitive resources before application logic is ever executed. Common use cases include limiting access to administrative interfaces, internal tools, staging environments, or API endpoints.

This guide demonstrates how to configure access control using modern Apache 2.4 directives.

## Before you begin

1.  Install Apache HTTP Server 2.4 or later on your system:

    ```command {title="Debian-based Linux distributions"}
    sudo apt update
    sudo apt install apache2 -y
    ```

    ```command {title="RHEL-based Linux distributions"}
    sudo dnf install httpd -y
    ```

1.  Ensure you have root or `sudo` privileges to edit configuration files.

1.  Be familiar with editing configuration files and restarting services.

## Understanding access control in Apache 2.4

In Apache 2.4, authorization is explicit and rule-based. Instead of relying on evaluation order, each `Require` directive defines a condition that must be met. These conditions can be combined to create precise access policies without relying on implicit behavior.

Access control rules are typically applied in `<Directory>` and `<Location>` blocks within virtual host configuration files.

The exact configuration file location depends on your Linux distribution and Apache deployment. Debian-based systems commonly use site-specific virtual host configuration files in `/etc/apache2/sites-available/`, such as `/etc/apache2/sites-available/000-default.conf`. RHEL-based systems often use `/etc/httpd/conf/httpd.conf` or site-specific files in `/etc/httpd/conf.d/`.

Access control rules can also be applied via `.htaccess` files.

Most access control functionality is provided by the `mod_authz_core` and `mod_authz_host` modules. These modules are enabled by default in most Apache installations.

## Basic access control rules

These directives are typically used to establish a default policy. For example, you might deny all access by default and then selectively allow specific clients.

Use the `Require` directive to define access control rules.

```file {title="Apache virtual host configuration file" lang="apache"}
Require all granted
```

```file {title="Apache virtual host configuration file" lang="apache"}
Require all denied
```

These rules are often used as a baseline before applying more specific restrictions.

Restrict access to requests originating from the local system:

```file {title="Apache virtual host configuration file" lang="apache"}
Require local
```

You can also negate a condition with `Require not` to exclude specific clients while allowing broader access:

```file {title="Apache virtual host configuration file" lang="apache"}
Require all granted
Require not ip 192.168.1.50
```

## Restricting access by IP address

IP-based restrictions are the most common form of access control. They are fast, reliable, and do not depend on DNS resolution.

Use `Require ip` to allow specific IP addresses or subnets.

Allow a single IP:

```file {title="Apache virtual host configuration file" lang="apache"}
Require ip 192.168.1.10
```

Allow a subnet:

```file {title="Apache virtual host configuration file" lang="apache"}
Require ip 192.168.1.0/24
```

Allow an IPv6 subnet:

```file {title="Apache virtual host configuration file" lang="apache"}
Require ip 2001:db8::/32
```

Allow multiple networks:

```file {title="Apache virtual host configuration file" lang="apache"}
Require ip 192.168.1.0/24
Require ip 10.0.0.0/8
```

## Restricting access by hostname

Hostname-based rules can be useful in environments where clients are identified by domain rather than fixed IP addresses.

Use `Require host` to match client hostnames:

```file {title="Apache virtual host configuration file" lang="apache"}
Require host example.com
```

Hostname-based rules rely on reverse DNS lookups and can introduce latency or inconsistencies. Prefer IP-based rules when possible.

## Combining access rules

Combine rules using containers to express logical relationships between conditions. For example, requiring multiple conditions to be true, or allowing access if any one condition is satisfied.

### RequireAll

The `RequireAll` container allows access only if all of the enclosed conditions are met. This is useful for enforcing multiple requirements at the same time.

```file {title="Apache virtual host configuration file" lang="apache"}
<RequireAll>
    Require ip 192.168.1.0/24
    Require host office.example.com
</RequireAll>
```

### RequireAny

The `RequireAny` container allows access if any of the enclosed conditions are met. This is useful when multiple independent conditions should grant access.

```file {title="Apache virtual host configuration file" lang="apache"}
<RequireAny>
    Require ip 192.168.1.0/24
    Require ip 10.0.0.0/8
</RequireAny>
```

### RequireNone

The `RequireNone` container excludes requests that match any of the enclosed conditions. Because `RequireNone` cannot grant access on its own, use it inside a broader rule such as `RequireAll`:

```file {title="Apache virtual host configuration file" lang="apache"}
<RequireAll>
    Require all granted
    <RequireNone>
        Require ip 203.0.113.10
    </RequireNone>
</RequireAll>
```

In most cases, `Require not` is a simpler alternative, but `RequireNone` is useful when grouping multiple exclusion rules.

## Applying access control rules

The following example demonstrates how to apply an access control rule to a specific directory and verify the result.

1.  Create a test directory and file:

    ```command
    sudo mkdir -p /var/www/html/private
    echo "private test" | sudo tee /var/www/html/private/index.html
    ```

1.  Edit your Apache virtual host configuration file:

    ```command {title="Debian-based Linux distributions"}
    sudo nano /etc/apache2/sites-available/000-default.conf
    ```

    ```command {title="RHEL-based Linux distributions"}
    sudo nano /etc/httpd/conf/httpd.conf
    ```

    Add a rule to restrict access to a directory:

    ```file {title="Apache virtual host configuration file" lang="apache"}
    <Directory /var/www/html/private>
        Require ip 192.168.1.0/24
    </Directory>
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Test the Apache configuration:

    ```command {title="Debian-based Linux distributions"}
    sudo apachectl configtest
    ```

    ```command {title="RHEL-based Linux distributions"}
    sudo httpd -t
    ```

    ```output
    Syntax OK
    ```

    {{< note type="primary" title="AH00558 warning" >}}
    If you see an `AH00558` warning about the server's fully qualified domain name, Apache was unable to determine a global `ServerName`. This warning does not indicate a syntax error and does not prevent Apache from starting.
    {{< /note >}}

1.  Restart Apache to apply changes:

    ```command {title="Debian-based Linux distributions"}
    sudo systemctl restart apache2
    ```

    ```command {title="RHEL-based Linux distributions"}
    sudo systemctl restart httpd
    ```

1.  Verify access to the restricted directory from an allowed IP address:

    ```command
    curl -I http://your-server-ip/private/
    ```

    ```output
    HTTP/1.1 200 OK
    ```

    {{< note type="primary" title="Testing from an external client" >}}
    If you are testing from another system, ensure HTTP traffic on port 80 is allowed by any local firewall applications or Akamai Cloud Firewall. Otherwise, the request may time out before reaching Apache.
    {{< /note >}}

1.  Attempt to access the restricted directory from a blocked IP address:

    ```command
    curl -I http://your-server-ip/private/
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

```file {title="Apache virtual host configuration file" lang="apache"}
# Apache 2.2
Order deny,allow
Deny from all
Allow from 192.168.1.0/24
```

```file {title="Apache virtual host configuration file" lang="apache"}
# Apache 2.4
Require ip 192.168.1.0/24
```

Apache 2.4 includes the `mod_access_compat` module for backward compatibility. Avoid using it in new configurations.

## Common access control patterns

The following examples demonstrate common real-world use cases for access control in Apache.

Restrict an admin directory:

```file {title="Apache virtual host configuration file" lang="apache"}
<Directory /var/www/html/admin>
    Require ip 192.168.1.0/24
</Directory>
```

Block a specific IP:

```file {title="Apache virtual host configuration file" lang="apache"}
<RequireAll>
    Require all granted
    Require not ip 203.0.113.10
</RequireAll>
```

Allow multiple trusted networks:

```file {title="Apache virtual host configuration file" lang="apache"}
<RequireAny>
    Require ip 192.168.1.0/24
    Require ip 10.0.0.0/8
</RequireAny>
```
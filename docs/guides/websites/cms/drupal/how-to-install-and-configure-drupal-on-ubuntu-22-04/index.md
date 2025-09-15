---
slug: 
title: How to Install and Configure Drupal on Ubuntu 22.04
titlee_meta:
description: Step-by-step guide for installing Drupal on Ubuntu 22.04 with contributor-safe practices and legacy notes for Conda users.
author: ["Diana Hoober"]
contributors: ["Diana Hoober"]
published: 2025-9-15
keywords: [Drupal, Ubuntu 22.04, CMS, installation, contributor-safe, Conda]
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

These instructions and examples demonstrate how to install and configure Drupal 11 within a contributor-safe, systems-aware environment. When deployed on an Akamai-optimized infrastructure, Drupal benefits from global edge caching for faster content delivery, intelligent cache purging to ensure timely updates, and enterprise-grade security features such as DDoS protection and web application firewalls. 

Additionally, beginners, legacy users, and contributors benefit from Akamai’s CDN architecture, which offloads traffic from the origin server and allows Drupal to efficiently scale load while maintaining performance and reliability. Integration modules let Drupal directly communicate with Akamai’s caching layers, for a robust solution for structured content management within a secure, high-performance delivery framework.

## System Prerequisites

To ensure Drupal 11 installs cleanly and performs reliably within an Akamai-optimized infrastructure, the following prerequisites must be in place. 

- ✅ OS: Ubuntu 22.04 LTS
- ✅ Apache: Version 2.4.52+
- ✅ PHP: Version 8.1+ (Drupal 11 optimized for PHP 8.3)
- ✅ MariaDB or MySQL: Installed and secured
- ✅ Composer: Installed globally
- ✅ Drupal: Latest stable version (11.2.3 as of Sept 2025)

This setup provides a stable foundation for structured content management, contributor workflows, and integration with Akamai’s caching and security layers.

## Install and Configure the Supporting Stack

This section walks through the varied components that form the foundation for a stable, scalable Drupal deployment.

- Apache2
- MariaDB server
- PHP and required extensions
- Composer (with install command options)
- Optional: Drush, phpMyAdmin

### Initialize the Drupal Application Environment

This phase pulls in Drupal core, scaffolds the file structure, and  prepares the environment for configuration using the Composer action:

    composer create-project drupal/recommended-project my_drupal_site

Replace `my_drupal_site` with your project folder name.

Once the command completes, your new project directory will include a /web folder for public-facing files, a composer.json file that defines dependencies, and a /vendor folder for Composer-managed libraries. This structure supports modular development and secure deployment by clearly separating application logic from public content—making updates easier to manage and reducing security risks.

This structure supports modular development and secure deployment by clearly separating application logic from public content—making updates easier to manage and reducing security risks.

Before proceeding, ensure the web server has permission to interact with the new environment. Set the /web directory and its contents to be owned by www-data (or your system’s web server user), using:

    sudo chown -R www-data:www-data web

This step prevents permission errors during runtime and ensures that Drupal can generate files, manage uploads, and interact with modules safely.

### Configure the Web Server for Drupal

Apache is assumed to be installed and running. This section focuses on enabling the modules and configuration settings Drupal relies on for clean URLs, secure access, and flexible routing. If you're using the default site, the config file is typically located at `/etc/apache2/sites-available/000-default.conf`. For custom setups, use your virtual host file (e.g., /etc/apache2/sites-available/drupal.conf`).

- **Enable `mod_rewrite`**  
  Drupal uses clean URLs, which require Apache’s rewrite module. Enable it with:
  
  sudo a2enmod rewrite
  sudo systemctl restart apache2

- **Set** `AllowOverride` **to** `All`
  Drupal's `.htaccess` file needs permission to override default settings. In your Apache config (typically `/etc/apache2/sites-available/000-default.conf` or a custom virtual host), update the `<Directory>` block:

    <Directory /var/www/html/web>
        AllowOverride All
    </Directory>

- Then reload Apache:

    sudo systemctl reload apache2

- Optional: Configure a Virtual Host
  For local development or multiple site setups, define a virtual host pointing to the Drupal `/web` directory:

<VirtualHost *:80>
    ServerName drupal.local
    DocumentRoot /var/www/html/web

    <Directory /var/www/html/web>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

- Don't forget to update your `/etc/hosts` file:

    127.0.0.1 drupal.local

- And enable the site:

    sudo a2ensite drupal.conf
    sudo systemctl reload apache2

## Local Testing Setup

- Add an entry to /etc/hosts

This maps `drupal.local` to your local machine:

    127.0.0.1 drupal.local

- Test site in your browser

Visit http://drupal.local. If the setup is successful, you’ll see the Drupal installer or welcome screen in your browser. This confirms that Apache, PHP, and file permissions are working correctly.

- Troubleshooting tips (permissions, rewrite module, PHP errors)

If the site doesn't load:

    - Check file permissions on the `/web` directory.
    - Confirm `mod_rewrite` is enabled.
    - Review Apache config for `AllowOverride All`.
    - Look for PHP errors in your logs (`/var/log/apache2/error.log`)

If you see a blank page or 403 error, check that Apache is reading `.htaccess` and that PHP is installed and enabled. Run this in the terminal:

    php -v

If PHP is installed, you'll see version info like this:

    PHP 8.1.2 (cli) (built: ...)

If it's missing, the system will say `command not found`, and you need to install PHP and its Apache integration. Follow this [guide for Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-22-04) to set Apache up before continuing.

## Security and Optimization

1. Run the MySQL hardening script to remove insecure defaults and set a root password:

    sudo mysql_secure_installation

This interactive tool lets you:

- Set or update the root password
- Remove anonymous users
- Disallow remote root login
- Remove the test database
- Reload privilege tables

{{< note>}}
These steps help protect your Drupal site from unauthorized access and are strongly recommended for production environments.

1. Enable SSL (Optional)

If deploying Drupal in a production or pubic-facing environment, configure SSL to encrypt traffic:

- Use *Let's Encrypt* or a self-signed certificate.
- Updae your Apache virtual host to include:

<VirtualHost *:443>
    SSLEngine on
    SSLCerificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.p
'''
</VirtualHost>

For local development, SSL is optional. For public sites it is essential.

1. File permissions and `.htaccess` notes

- Ensure the `/web/site/default` directory is writable by the web server during installation:

    sudo chown -R www-data:www-data web/sites/default

- After installation, lock down permissions:

    sudo chmod 444 web/sites/default/settings.php

- Drupal relies on `.htaccess` for security rules like:

    - Preventing access to sensitive files
    - Blocking directory listings
    - Enforcing clean URLs

{{< Tip>}}
If `.htaccess` rules aren't being applied, double-check `AllowOverride All` in your Apache config.
{{< /Tip>}}

1. Security Checklist
    - Databes hardened with `mysql_secure_installation`
    - File permission set for install and post-install
    - `.htaccess` rules active
    - SSL configured (if pubic-facing)

## Contributor-Safe Notes: Composer-First Workflow

- Legacy bridging for users coming from Drupal 8

Drupal 9+ expects a Compower-managed workflow. Contributors familiar with manual installs or `.tar.gz` packages from Drupal 8 may encounter unexpected behavior. This guide assume Composer-first setup to ensure compatibility with moder module management and depencency resolution.

- Avoiding brittle installs and opaque errors

Composer tracks dependencies explicitly, reducing the risk of missing extensions or mismatched versions. Manual installs often fail silently or introduce hard-to-trace errors. Using `composer create-project` ensures a reproducible, contributor-safe environment.

- Encouraging use of Drush for command-line efficiency

Drush streamlines tasks like site installation, cache clearing, and module management. Once installed via Composer, it becomes available in the project’s `/vendor/bin` directory.

    /vendor/bin/drush/status

## Conclusion: What Comes Next

From here, you can begin customiaing your site:

- Official [Drupal Documentation](https://www.drupal.org/documentation).

- Theme development: Create or install themes to control layout and styling. Browse the [Drupal Themes Directory](https://www.drupal.org/project/project_theme) to get a clear sense of what's possible.

To see demonstrated [Drupal Websites](https://htmlburger.com/blog/drupal-websites-examples/)


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

    composer create-project drupal/recommended-project [project name]

Once the command completes, you’ll see a structured directory layout designed to support modular development and secure deployment. The `/web` folder contains all public-facing files, including `index.php`, assets, and the `.htaccess` configuration. 

The root directory holds the `composer.json` file, which defines project dependencies, and the `/vendor` folder, which contains Composer-managed libraries. This separation ensures clarity between application logic and public content, making it easier to manage updates and enforce security boundaries.

Before proceeding, adjust file ownership to ensure the web server can read and write where needed. Set the `/web` directory and its contents to be owned by `www-data` (or your system’s web server user), with a command like:

    sudo chown -R www-data:www-data web

This step prevents permission errors during runtime and ensures that Drupal can generate files, manage uloads, and interact with modules safely.

### Configure the Web Server for Drupal

Apache is assumed to be installed and running. This section focuses on enabling the modules and configuration settings Drupal relies on for clean URLs, secure access, and flexible routing.

- **Enable `mod_rewrite`**  
  Drupal uses clean URLs, which require Apache’s rewrite module. Enable it with:

  ```bash
  sudo a2enmod rewrite
  sudo systemctl restart apache2

- **Set** `AllowOverride` **to** `All`
  Drupal's `.htaccess` file needs permission to override degault settings. In your Apache config (typically `/etc/apache2/sites-available/000-default.conf` or a custom firtual host), update the `<Directory>` block:

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

## Local Testing Setup- Add entry to /etc/hosts (e.g., 127.0.0.1 drupal.local)

- Test site in browser
- Troubleshooting tips (permissions, rewrite module, PHP errors)

## Security and Optimization- Run mysql_secure_installation

- Enable SSL (optional)
- File permissions and .htaccess notes

## Contributor-Safe Notes- Composer-first workflow

- Legacy bridging for users coming from Drupal 8
- Avoiding brittle installs and opaque errors
- Encouraging use of drush for command-line efficiency

## Conclusion- Summary of setup

- Next steps (theme development, module installation)
- Link to official Drupal documentation

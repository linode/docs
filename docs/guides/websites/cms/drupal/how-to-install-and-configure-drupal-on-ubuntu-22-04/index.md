---
slug: "how-to-install-and-configure-drupal-on-ubuntu-22-04"
title: "How to Install and Configure Drupal on Ubuntu 22.04"
title_meta: "How to Install and Configure Drupal on Ubuntu 22.04"
description: "Step-by-step guide for installing Drupal on Ubuntu 22.04 with contributor-safe practices"
authors: ["Diana Hoober"]
contributors: ["Diana Hoober"]
published: 2025-09-30
modified: 2025-09-30
keywords: ["Drupal", "Ubuntu 22.04", "installation", "contributor-safe", "Composer"]
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/)"
---

Drupal is a flexible content management system (CMS) designed for structured content and scalable site architecture. While it runs well in many hosting environments, Akamai’s compute instance provides a resilient foundation for high-traffic, content-rich deployments. This guide walks through installing and configuring Drupal 11 on Ubuntu 22.04 with systems-aware practices and contributor-safe steps that hold up in real-world scenarios.

## Before You Begin

This guide uses Drupal 11.1.8 to avoid known packaging issues in newer releases. Specifically a syntax error in `drupal/core-recipe-unpack` introduced in 11.2.x (see [Drupal issue #3536487](https://www.drupal.org/project/drupal/issues/3536487)). You'll install the stable version later using Composer after verifying system prerequisites.

## System Prerequisites

This guide is based on a tested configuration that ensures Drupal 11 installs cleanly and performs reliably within an Akamai-optimized infrastructure. The following prerequisites were used for validation.

- ✅ OS: Ubuntu 22.04 LTS
- ✅ Apache: Version 2.4.52+
- ✅ PHP: Version 8.1+ (Drupal 11 optimized for PHP 8.3)
- ✅ MariaDB 10.3.7+ or MySQL: 5.7.8 (Drupal 11) Installed and secured
- ✅ Composer: 2.7.0+ (Drupal 11) Installed globally
- ✅ Drupal: Latest stable version (11.1.8 as of Sept 2025) will be installed after the environment setup

This configuration was verified to support structured content management, contributor workflows, and integration with Akamai’s caching and security layers.

## Environment Setup: Preparing to Install Drupal

This section outlines the steps used to verify system components, establish the file structure, and prepare the database--everything Drupal requires prior to installation.

### Infrastructure Verification

Confirm that required components are correctly installed and active to prevent silent failures during setup.

#### Check PHP Version and Extensions

Use the following commands to check what PHP extensions are available:

    php -v
    php -m | grep -E 'gd|mbstring|xml|curl|zip|mysqli|pdo_mysql|opcache'

If any required PHP extensions are missing, install them with:

    sudo apt install php-gd php-mbstring php-xml php-curl php-zip php-mysql php-opcache

Following installation, restart Apache or Nginx to activate the new extensions.

    sudo systemctl restart apache2

Verify they're active:

    php -m | grep -E 'gd|mbstring|xml|curl|zip|mysqli|pdo_mysql|opcache'

Each one should now be listed.

#### Check Composer

If checking for Composer installation yields a `composer` not found error, you can install it with:

    sudo apt update && sudo apt install composer

To verify installation:

    composer --version

You should see output like `Composer version 2.7.0` or higher.

If the command fails, see [Composer Installation - Manual Download](https://getcomposer.org/doc/00-intro.md#manual-installation) for fallback steps.

#### Verify the Web Server

Before proceeding, make sure your web server has permission to interact with the Drupal environment. Set the `/web` directory and its contents to be owned by `www-data` (or your system’s web server user), using:

    sudo chown -R www-data:www-data web

This step prevents permission errors during runtime and ensures that Drupal can safely generate files, manage uploads, and interact with modules.

{{< note >}}
If you're using Nginx or a different web server, replace `www-data` with your actual server user (e.g., `nginx`, `apache`, or a custom service account).
{{< /note >}}

To confirm ownership was updated, run this from the parent directory of `web`:

    ls -ld web

This confirms the ownership and permissions of the `web` directory:

    drwxr-xr-x 7 www-data -www-data 4096 Sep 16 22:28 web

This means:

- `www-data` owns the directory
- `www-data` is also the group
- The permissions are `drwxr-xr-x` (read/write/execute for owner, read/execute for group and others.)

To verify ownership of individual files, run:

    ls -l path/to/your/file (e.g., 'ls -l web/index.php')

This shows the file's owner and group.

{{< note >}}

If ownership is incorrect, rerun:

    sudo chown -R www-data:www-data web

And replace `www-data` with your actual web server user if different.

{{< /note >}}

#### Drupal Project Presence

To confirm the project was scaffolded correctly, verify the presence of key files and directories:

    ls composer.json
    ls web/index.php
    ls -d vendor/

{{< note >}}
If any of these files are missing, Drupal has not been initialized. See the Initialize the Drupal Application Environment section to scaffold the project using Composer.
{{< /note >}}

Contributor-Safe Tips

- Be sure to consider mentioning file permissions if they are relevant to your environment (e.g., `chmod`, `chown`).
- If `vendor/` is missing but `composer.json` is present, run `composer install`.

If at this point all checks pass the infrastructure is ready for Drupal initialization and configuration.

## Create Project Structure

Creating the project structure sets up Drupal for modular development and secure deployment.

This step separates application logic from public content, making updates easier to manage and reducing security risks.

After you run the `composer create-project` command below, your environment will include the core Drupal files and folder structure:

- `composer.json`
- `web/index.php`
- `vendor/`.

This confirms that setup succeeded, prepares optional configuration scaffolding, and gets the application ready for site installation. *This guide was validated using Drupal 11.1.8 as noted earlier.*

### Create the Drupal Project Structure

- Run the install command to scaffold (create) the Drupal 11.1.8 structure. Customize the "my_drupal_site" name to fit your needs. For
directory layout details, see [Drupal.org's Directory Structure guide](https://www.drupal.org/docs/getting-started/understanding-drupal/directory-structure).

    composer create-project drupal/recommended-project:11.1.8 my_drupal_site

-Then change to your project folder (removing the <> symbols and replacing with your folder name):

    cd <my_drupal_site>

- Inside the scaffolded project folder `my_drupal_site`, confirm the environment after installation with:

    ls composer.json
        Result: `composer.json` confirming the metadata file exists

    ls -ld web/index.php
        Response: `web/index.php` confirms the application entry point file exists.

    ls -ld vendor/
        Response:`vendor/` confirming that the `vendor/` directory was created.

If any of these are missing or return errors, installation may have failed or been interrupted. For troubleshooting see [Installing Drupal - Getting Started Guide](https://www.drupal.org/docs/getting-started/installing-drupal).

**Following Composer Initialization** (scaffolded Drupal Project), confirm your environment against the **Drupal Site Setup checklist**:

- Copy the default settings file.

    cp web/sites/default/default.settings.php web/sites/default/settings.php

This creates the active configuration file that Drupal reads and writes to during installation and runtime.

### Set File Permissions

- This is for `settings.php` (allows the owner to read/write, group and others to read, and the web server to access it during installation). Make sure you are in the Drupal project root folder and then run:

    chmod 644 web/sites/default/settings.php

    *Optional: If you're on a shared host or strict environment, you may need to tighten permissions in the `settings.php` file to `640` or even `600`.*

If you skip this step and Drupal can't write to the file, the installer will fail with a permissions error. Running `chmod 644` now avoids this.

### Create the files directory.

Drupal uses a writable `files` directory to store uploaded content, temporary files, and other runtime assets. From your project root (`my_drupal_site`) run:

    mkdir -p web/sites/default/files
    chmod 755 web/sites/default/files

To verify that it worked, run:

    ls -ld web/sites/default/files

The `chmod` allows owner and group read, write, and execute permissions and others read and execute rights. For stricter environments you can adjust ownership with:

    chown -R www-data web/sites/default/files

Use your actual web server for `www-data`. A writable `files` directory allows Drupal to store uploads (i.e., images or module enablement) or generate cached assets so you don't see any errors.

### Prepare the database.

Before installing Drupal, follow the official guide to create a database and user for Drupal [Database Configuration](https://www.drupal.org/docs/drupal-apis/database-api/database-configuration).

- Once complete, confirm with a contributor-safe verification block:

    mysql -u drupal_user -p -h localhost drupal_db

You should be able to enter the MariaDB shell without errors.
Your database used `utf8mb4` encoding:

    SHOW CREATE DATABASE drupal_db;

- Look for `CHARACTER SET utf8mb4`. Your credentials match what you'll enter in `settings.php`:

$databases['default']['default'] = [

    'driver' => 'mysql',
    'database' => 'drupal_db',
    'username' => 'drupal_user',
    'password' => 'your_secure_password',
    'host' => 'localhost',
    ];

This is located in `sites/default/settings.php`

- File permissions  might need to be temporarily relaxed during setup with:

    chmod 664 sites/default/settings.php

1. Common Errors and Fixes

| Error Message                  | Likely Cause                  | Fix                                      | Resource                                                                 |
|-------------------------------|-------------------------------|------------------------------------------|--------------------------------------------------------------------------|
| Access denied for user        | Wrong username or password    | Double-check credentials in `settings.php` | [Drupal.org: Database Configuration](https://www.drupal.org/docs/drupal-apis/database-api/database-configuration) |
| Unknown database              | Database name typo or missing | Recreate or correct name in config       | [MoldStud: Avoid Common Pitfalls](https://moldstud.com/articles/p-managing-drupal-database-connection-settings-avoid-common-pitfalls) |
| Driver not found              | Incorrect or missing driver   | Use `'driver' => 'mysql'` for MariaDB    | [Drupal.org: Database API Overview](https://www.drupal.org/docs/drupal-apis/database-api/database-configuration) |
| Warning: count() during install | Misconfigured array structure | Ensure `$databases` array is properly nested | [Stack Overflow](https://stackoverflow.com/questions/71596215/how-can-i-set-up-my-drupal-database-correctely) (yes, there is a typo in that title s/b correctly). |

1. Optional: Environment Variables

Sensitive credentials can be abstracted using `.env` files or environment-specific config, see [Drupal.org's environment config practices](https://www.drupal.org/project/env).

### CLI-based Installation

This guide uses the CLI method for consistency, automation, and contributor safety (leveraging Drush 11.x for CLI-based installation, matching Drupal 11/1/8).

**Environment Validation**(Phase 1)

| **Check**               | **Purpose**                              | **Command**                                                | **Expected Output**                                   | **If Output Differs**                                      | 🔗 **Further Info** |
|------------------------|------------------------------------------|------------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|---------------------|
| PHP Version            | Ensure PHP 8.1+ is installed              | `php -v`                                                   | `PHP 8.1.2-` or higher                      | Upgrade PHP or switch environments                          | [PHP Docs](https://www.php.net/manual/en/) |
| Required Extensions    | Confirm required PHP modules              | php -m | grep -E 'pdo|mbstring|xml|json|ctype|tokenizer|curl|openssl|zip' | All listed extensions appear                          | Install missing modules via `apt`, `dnf`, or `brew`         | [Drupal Requirements](https://www.drupal.org/docs/system-requirements) |
| Composer Health Check  | Validate Composer setup                   | `composer diagnose`                                        | All checks return `OK` or `WARNING` (non-blocking)     | Type `yes` if prompted about root; note any warnings*         | [Composer Docs](https://getcomposer.org/doc/) |
| Composer Version       | Ensure Composer 2.x is installed          | `composer --version`                                       | `Composer version 2.x.x`                              | Upgrade Composer if version is < 2                          | [Composer Install Guide](https://getcomposer.org/download/) |

* Running Composer as root is discouraged. Safe for local testing, but avoid in production.

If you experience silent failures during verification and need to install missing components (e.g., PHP extensions):

{{< note >}}
During installation, you may see a prompt like:

`Do you want to continue?[Y/n]`

This is a standard confirmation step. Type `Y` and press Enter to proceed. (If using a different package manager or install method, the prompt may vary slightly--but the intent is the same: confirm you want to install the listed components.)
{{< /note >}}

**Installation** (Phase 2)

Install the Drupal codebase using Composer. This sets up the recommended project scaffold.

Composer and PHP should already be installed and working. See Phase 1 for environment prep.

| **Step**               | **Purpose**                              | **Command**                                                | **Expected Output**                                   | **If Output Differs**                                      | 🔗 **Further Info** |
|------------------------|------------------------------------------|------------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|---------------------|
| Create Project         | Scaffold Drupal site                     | `composer create-project drupal/recommended-project mysite` | `mysite` folder created with Drupal scaffold           | Rename or delete existing folder before retry              | [Drupal Install Guide](https://www.drupal.org/docs/installing-drupal) |
| Install Drush (local)  | Add Drush to project via Composer        | `composer require drush/drush:11.5.1`                      | Drush installed in `vendor/bin/`                       | If error, check Composer version or package constraints*, **, ***     | [Drush Docs](https://www.drush.org/latest/install/) |
| Validate Drush         | Confirm Drush is working                 | `vendor/bin/drush --version`                              | `Drush version 11.5.1` or similar                      | If error, rerun install or check PHP/Composer compatibility**** | [Drush Troubleshooting](https://www.drush.org/latest/install/#troubleshooting) |
| Optional Global Install| Make Drush available system-wide         | Download `drush.phar`, then run:
 `chmod +x drush.phar` and `mv drush.phar /usr/local/bin/drush`
  `drush --version` | `Drush version 11.5.1` from global path     | If not executable, recheck permissions or path             | [Drush Phar Install](https://github.com/drush-ops/drush/releases) |

* Confirm `composer.json` is writable and not locked by another process.
** Make sure your PHP version meets Drush’s minimum requirement (PHP 8.1+ for Drush 11.x).
*** If you see a memory error, try: `COMPOSER_MEMORY_LIMIT=-1 composer require drush/drush:11.5.1`.
**** If Drush throws a `NotFoundHttpException`, it was likely run outside a valid Drupal project root. Navigate to the directory containing `composer.json` before running Drush commands. See: [Drush Usage Guide](https://www.drush.org/latest/usage/) for valid command contexts.

**Post-Install Validation** (Phase 3)

After installation, confirm that setup completed successfully and is complete and ready for configuration.

| **Check**               | **Purpose**                              | **Command**                                                | **Expected Output**                                   | **If Output Differs**                                      | 🔗 **Further Info** |
|------------------------|------------------------------------------|------------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|---------------------|
| Success Confirmation   | Validate install completion               | *Review terminal output*                                     | “Project created successfully” or similar message      | If error shown, rerun with `-vvv` for verbose output        | [Composer Troubleshooting](https://getcomposer.org/doc/articles/troubleshooting.md) |
| Folder Structure        | Confirm expected files exist              | `ls mysite`                                                | `composer.json`, `web/`, `vendor/`, etc.               | If missing, check install logs or rerun install             | [Drupal File Structure](https://www.drupal.org/docs/develop/structure-of-a-drupal-codebase) |
| Optional Cleanup        | Remove message plugin (optional)          | `composer`              | Plugin removed, no errors                              | Check Composer version or plugin dependencies     | [Project Message Plugin](https://www.drupal.org/project/core_project_message) |

### Launch the installer.

Once your project structure is in place and Drush is installed, you can launch the Drupal installer using either a browser or CLI. This confirms that your environment is functional and ready for site configuration.

| **Method**              | **Purpose**                              | **Action / Command**                                       | **Expected Result**                                   | **If Output Differs**                                      | 🔗 **Further Info** |
|-------------------------|------------------------------------------|------------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|---------------------|
| Browser-based install   | Begin visual site setup via browser      | Visit `http://localhost:8888` or `http://localhost/my_drupal_site/web` | Drupal installer page loads                            | Confirm PHP server is running, and `web/` folder exists   | [Drupal Installer Guide](https://www.drupal.org/docs/installing-drupal) |
| CLI-based install       | Install Drupal via Drush                 | `vendor/bin/drush site:install`                            | Site installed with default config                     | Confirm database access, Drush version, and PHP compatibility | [Drush Site Install](https://www.drush.org/latest/commands/site-install/) |

> Using the PHP built-in server, run:
> ```
> php -S localhost:8888 -t web
> ```

> If the installer page is blank or throws errors:
> - Check PHP version and extensions (`pdo`, `gd`, `mbstring`)
> - Confirm file permissions in the `web` folder
> - Ensure `index.php` exists in `web`

### Configure the Web Server for Drupal

Apache is assumed to be installed and running. This section focuses on enabling the modules and configuration settings Drupal relies on for clean URLs, secure access, and flexible routing.

#### Summary Table

| **Step**                  | **Purpose**                                  | **Command / Config**                                                                 |
|---------------------------|----------------------------------------------|--------------------------------------------------------------------------------------|
| Enable `mod_rewrite`      | Support clean URLs                           | `sudo a2enmod rewrite`<br>`sudo systemctl restart apache2`                          |
| Set `AllowOverride All`   | Allow `.htaccess` overrides                  | Edit Apache config file (`000-default.conf` or `drupal.conf`) and set:<br>`AllowOverride All` inside the `<Directory>` block for your `/web` folder                       |
| Reload Apache             | Apply config changes                         | `sudo systemctl reload apache2`                                                     |
| Optional: Virtual Host    | Use custom domain for local dev              | Define `<VirtualHost>` block pointing to `/web` folder in `drupal.conf`                              |
| Update `/etc/hosts`       | Map custom domain to localhost               | Add: `127.0.0.1 drupal.local`                                                            |
| Enable site config        | Activate virtual host                        | `sudo a2ensite drupal.conf`<br>`sudo systemctl reload apache2`                      |
---

#### Line-by-Line Walkthrough

**1. Enable `mod_rewrite`**

Drupal uses clean URLs, which depend on Apache’s rewrite module. Enable it with:

sudo a2enmod rewrite

sudo systemctl restart apache2

This activates `mod_rewrite` and restarts Apache to apply the change.

Success is achieved if there is no error output and Apache restarts cleanly.

If you see an error like `Module rewrite already enabled`, it's safe to proceed--Apache is already configured for clean URLs.

## Local Testing Setup

Before continuing, confirm that your local environment is serving the Drupal site correctly. This section helps validate Apache, PHP, and file permissions using a browser-based test.

### Summary Table

| **Step**                  | **Purpose**                                  | **Command / Action**                                                                 |
|---------------------------|----------------------------------------------|--------------------------------------------------------------------------------------|
| Map domain to localhost   | Access site via `drupal.local`               | Add `127.0.0.1 drupal.local` to `/etc/hosts`                                        |
| Test in browser           | Confirm site is served correctly             | Visit `http://drupal.local`                                                         |
| Troubleshoot blank/error  | Identify common issues                       | Check permissions, Apache config, PHP status                                        |
| Validate PHP install      | Confirm PHP is installed and active          | Run `php -v`                                                                         |

---

### Line-by-Line Walkthrough

**1. Add an entry to `/etc/hosts`**

This maps `drupal.local` to your local machine:

```
127.0.0.1 drupal.local

## Security and Optimization

1. Harden the MySQL Installation

Run the MySQL hardening script to remove insecure defaults and set a root password:

    sudo mysql_secure_installation

This interactive tool lets you:

- Set or update the root password
- Remove anonymous users
- Disallow remote root login
- Remove the test database
- Reload privilege tables

{{< note >}}
These steps help protect your Drupal site from unauthorized access and are strongly recommended for production environments.
{{< /note >}}

2. Enable SSL (Optional)

If deploying Drupal in a production or public-facing environment, configure SSL to encrypt traffic:

- Use *Let's Encrypt* or a self-signed certificate.
- Update your Apache virtual host to include:

<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>

For local development, SSL is optional. For public sites it is essential.

3. File permissions and `.htaccess` notes

- Ensure the `/web/site/default` directory is writable by the web server during installation:

    sudo chown -R www-data:www-data web/sites/default

- After installation, lock down permissions:

    sudo chmod 444 web/sites/default/settings.php

- Drupal relies on `.htaccess` for security rules like:

    - Preventing access to sensitive files
    - Blocking directory listings
    - Enforcing clean URLs

{{< note >}}
If `.htaccess` rules aren't being applied, double-check `AllowOverride All` is set in your Apache config.
{{< /note >}}

4. Security Checklist
    - **Database hardened** with `mysql_secure_installation`
    - **File permission** set for install and post-install
    - **`.htaccess`** rules active
    - **SSL configured** (if public-facing)

---

## Contributor-Safe Notes: Composer-First Workflow

- Legacy Bridging for Users Coming From Drupal 8

Drupal 11.x expects Composer-managed workflow. Composer is now the official and recommended method for managing Drupal core, contributed modules, and dependencies. Contributors familiar with manual installs or `.tar.gz` packages from Drupal 8 may encounter unexpected behavior. This guide assumes a Composer-first setup to ensure compatibility with modern module management and depencency resolution.

- Avoiding brittle Installs and Opaque Errors

Composer tracks dependencies explicitly, reducing the risk of missing extensions or mismatched versions. Manual installs often fail silently or introduce hard-to-trace errors. Using `composer create-project` ensures a reproducible, contributor-safe environment.

- Encouraging use of Drush for Command-Line Efficiency

Drush streamlines tasks like site installation, cache clearing, and module management. Once installed via Composer, it becomes available in the project’s `/vendor/bin` directory. Run Drush from you project directory:

    ./vendor/bin/drush/status

If you see errors about missing Symfony classes or autoloading failures, double-check that:

    - You're inside the correct project folder (with `composer.json`, `vendor/`, and `web/`).
    - Drush is intalled locally--not globally or in `/root/vendor`.
    - You're not running Drush from outside the project root.

To confirm you're in the right place, look for:

    ls
    # Should include: composer.json, vendor/, web/

### Contributor-Safe References

For official Drush installation guidance, see [Drush on Drupal.org](https://www.drupal.org/docs/develop/development-tools/drush).

You can find additional information on [Drupal's Composer guide](https://www.drupal.org/docs/develop/using-composer/using-composer-with-drupal) for deeper context.

## Conclusion: What Comes Next

Your Drupal environment is now scaffolded, validated, and ready for customization. From here, you can begin shaping your site:

- Explore the Official [Drupal Documentation](https://www.drupal.org/documentation) for guidance on modules, configuration, and site building.

- Get into theme development: create or install themes to control layout and styling. Browse the [Drupal Themes Directory](https://www.drupal.org/project/project_theme) to see hat's possible.

To see inspiring real-world [Drupal Websites](https://htmlburger.com/blog/drupal-websites-examples/) explore how others have extended and styled their sites.


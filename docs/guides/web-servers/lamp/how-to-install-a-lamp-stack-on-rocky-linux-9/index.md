---
slug: how-to-install-a-lamp-stack-on-rocky-linux-9
title: "Install a LAMP Stack on Rocky Linux 9 (CentOS 8 Replacement)"
title_meta: "Install a LAMP Stack on Rocky Linux 9 (CentOS 8 Replacement)"
description: 'This guide provides some background about a Linux LAMP stack installation and security hardening and includes step by step instruction on how to install a LAMP stack on Rocky Linux 9 and Ubuntu 22.04.'
authors: ["Diana Hoober"]
contributors: ["Diana Hoober"]
published: 2025-10-10
keywords: ['LAMP stack','LAMP CentOS 8','install LAMP stack', 'install Apache', 'MariaDB', 'PHP on Rocky Linux 9', 'how to install a LAMP Stack on Rocky Linux 9', 'Ubuntu 22.04', 'centos 8', 'centos replacement']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

If you're moving from CentOS 8 to a compatible operating system, this guide walks you through installing a LAMP stack on Rocky Linux 9. The process and commands are nearly identical to what you're used to on CentOS 8 making migration straightforward.

CentOS 8 reached end-of-life in December 2021 and is no longer supported or safe for production use. **Rocky Linux 9 is the recommended replacement**--a free, open-source, enterprise-grade OS created by the original CentOS founder. It's fully compatible with RHEL 9 and serves as a drop-in replacement with the same package manager (`dnf`) and system structure.

## What is a LAMP Stack?

A **LAMP stack** is a collection of four open-source software components that work together to run dynamic websites and web applications. The name is an acronym:

- **Linux**: The operating system running the server
- **Apache**: The web server software that delivers web pages to visitors and handles web requests
- **MariaDB**: Database server
- **PHP**: The programming language that processes logic and creates dynamic content

## Prerequisites

Before installing the LAMP stack, ensure you have:

- A server or virtual machine with Rocky Linux 9 already installed
- Root access or a user account with sudo privileges
- Basic familiarity with the Linux command line
- An active internet connection

{{< note >}}
When setting up a fresh Rocky Linux 9 server, review the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide for initial server configuration (timezone, hostname, SSH hardening, firewall basics).
{{< /note >}}

## Install Apache

Apache is the web server component that handles HTTP requests and serves web pages.

1. Update the system package index:

    ```command
    sudo dnf update -y
    ```

If the system is already fully updated, you might see `Nothing to do.` or `Complete!`. Either message indicates success. The key is that there are no error messages and the command returns you to the command prompt.

2. Install Apache:

    ```command
    sudo dnf install httpd -y
    ```

At the end you should see the key indicators of success:
     httpd-[version]  [and other packages]

   Complete!

3. Start the Apache service:

    ```command
    sudo systemctl start httpd
    ```

Silently returns to the prompt when successful.

4. Enable Apache to start automatically on boot:

    ```command
    sudo systemctl enable httpd
    ```

If you see `Create symlink...` automatic reboot is enabled.

5. Verify Apache is running:

    ```command
    sudo systemctl status httpd
    ```

    You should see output indicating the service is `active (running)`:

    ```output
    ● httpd.service - The Apache HTTP Server
         Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; preset: disabled)
         Active: active (running) since Mon 2025-10-13 10:23:45 UTC; 5s ago
    ```
To exit and get back to your command prompt:

Press **q** (for quit) to END.

### Test Apache

{{< note type="warning" >}}
Before testing Apache, you must configure the firewall to allow HTTP/HTTPS traffic. See the [Configure Firewall](#configure-firewall) section under Security Hardening below.
{{< /note >}}

After configuring the firewall, test Apache by visiting your server's IP address http://your_server_ip (replace with your actual IP address). You should see the default Rocky Linux Apache test page.

## Install MariaDB

MariaDB is the database component that stores and manages data for your applications.

1. Install MariaDB server:

    ```command
    sudo dnf install mariadb-server -y
    ```
You will see "Complete!" when it has successfully installed.

1. Start the MariaDB service:

    ```command
    sudo systemctl start mariadb
    ```

1. Enable MariaDB to start automatically on boot:

    ```command
    sudo systemctl enable mariadb
    ```

4. Secure the MariaDB installation by running the security script:
```command
    sudo mysql_secure_installation
```

    Follow the prompts:
    - Press **Enter** when asked for the current root password (there isn't one yet)

{{< note >}}
On some systems, you may see a message that your root account is already protected with unix socket authentication. If so, you can safely answer **n** to skip this step and continue with the remaining prompts.
{{< /note >}}

Type **Y** to change the root password, then enter and confirm a strong password

{{< note >}}
**Important:** Store this root password securely. You will need it to:
    - Access the MariaDB command line (`mysql -u root -p`)
    - Create databases and users
    - Perform database administration tasks
{{< /note >}}

- Type **Y** to remove anonymous users
- Type **Y** to disallow root login remotely
- Type **Y** to remove the test database
- Type **Y** to reload privilege tables

1. Verify MariaDB is running:

    ```command
    sudo systemctl status mariadb
    ```

    You should see output indicating the service is "active (running)". Press **q** (for quit) to END.

## Install PHP

PHP is the programming language that makes websites interactive and personalized. It processes user actions (like logging in, submitting forms, or searching) and creates customized web pages based on data stored in the database.

1. Install PHP and common modules:

    ```command
    sudo dnf install php php-mysqlnd php-fpm php-opcache php-gd php-xml php-mbstring -y
    ```

    This installs:
    - `php`: Core PHP interpreter
    - `php-mysqlnd`: MySQL Native Driver for database connectivity
    - `php-fpm`: FastCGI Process Manager for better performance
    - `php-opcache`: Opcode cache for improved performance
    - `php-gd`: Graphics library support
    - `php-xml`: XML processing support
    - `php-mbstring`: Multi-byte string support

1. Restart Apache to load PHP:

    ```command
    sudo systemctl restart httpd
    ```
Returns to the prompt silently when successful.

1. Verify the PHP version:

    ```command
    php -v
    ```

    You should see output showing PHP version 8.0 or higher:

    ```output
    PHP 8.0.30 (cli) (built: Aug  3 2023 17:13:08) ( NTS gcc x86_64 )
    ```

### Test PHP Processing

Create a test PHP file to verify that Apache can process PHP code correctly.

{{< note >}}
The following steps create test files directly on the server for verification purposes. In production environments, you should develop code locally and deploy it through version control systems like Git rather than editing files directly on the server.
{{< /note >}}

1. Create a PHP info file:
```command
    sudo nano /var/www/html/info.php
```

2. Add the following content:

    {{< file "/var/www/html/info.php" php >}}
<?php
phpinfo();
?>
    {{< /file >}}

3. Save and exit the file (Ctrl+X, then Y, then Enter).

4. Set appropriate permissions:
```command
    sudo chown apache:apache /var/www/html/info.php
```

    Silently returns to the prompt when successful.

5. Visit `http://your_server_ip/info.php` in a web browser. You should see a detailed PHP information page showing PHP version, loaded modules, and configuration.

{{< note type="warning" >}}
Remove the `info.php` file after testing, as it exposes sensitive system information:
```command
    sudo rm /var/www/html/info.php
```
{{< /note >}}

## Test Database Connectivity

Verify that PHP can connect to MariaDB. This confirms all three components of your LAMP stack are working together.

1. Create a test database:

    ```command
    sudo mysql -u root -p
    ```

    Enter the root password you created during `mysql_secure_installation`.

    You should see the MariaDB prompt:
```output
    MariaDB [(none)]>
```

    The `[(none)]` indicates you're not currently using any specific database, which is expected at this point.

1. At this MariaDB prompt, run these commands:

    ```command
    CREATE DATABASE test_db;
    CREATE USER 'test_user'@'localhost' IDENTIFIED BY 'secure_password';
    GRANT ALL PRIVILEGES ON test_db.* TO 'test_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    ```

1. Create a PHP test file:

    ```command
    sudo nano /var/www/html/db_test.php
    ```

1. Add the following content:

    {{< file "/var/www/html/db_test.php" php >}}
<?php
$servername = "localhost";
$username = "test_user";
$password = "secure_password";
$dbname = "test_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully to database!";
$conn->close();
?>
    {{< /file >}}

1. Visit `http://your_server_ip/db_test.php` in a browser. You should see "Connected successfully to database!"

1. Clean up test files:

    ```command
    sudo rm /var/www/html/db_test.php
    sudo mysql -u root -p -e "DROP DATABASE test_db; DROP USER 'test_user'@'localhost';"
    ```

Enter your MariaDB root password when prompted. The command will silently return to the prompt when successful, having removed the test database and test user.

## Security Hardening for Production

The basic installation above is suitable for development and testing only. **Production environments require** immediate security hardening. Within minutes of exposing a server to the internet, automated bots will begin probing for vulnerabilities. A newly created server can receive hundreds of failed login attempts within the first hour.

Modern servers face constant, automated attacks from across the internet. This section implements essential security measures to protect your LAMP stack from common threats including brute-force attacks, unauthorized access, and application-level vulnerabilities.

### Security Prerequisites

Before hardening the LAMP stack, secure SSH access to your server. SSH is the most frequently attacked service on internet-facing systems--as mentioned, new servers often receive hundreds of unauthorized login attempts within the first hour.

**Complete these essential security steps first:**

- **Securing Your Server[SSH Hub](https://www.linode.com/docs/guides/security/ssh/)** - Create non-root user, configure SSH keys, disable root login
- **[How to Use Fail2ban to Secure Your Server](https://www.linode.com/docs/guides/using-fail2ban-to-secure-your-server-a-tutorial/)** - Automatically block repeated failed login attempts.
- **[What is Fail2Ban with Setup & Configuration? (Detailed Guide)]**(https://runcloud.io/blog/what-is-fail2ban)

These guides **must** be completed before proceeding with LAMP stack hardening to ensure your server has basic protection against the most common attack vectors.

{{< note >}}
If SSH is not secured yet, your server remains vulnerable to automated attacks-even with a hardened LAMP stack. Address SSH security first.
{{< /note >}}

### Configure Firewall

Rocky Linux 9 uses [firewalld](https://firewalld.org/documentation/) to manage network traffic. A properly configured firewall defines your network perimeter, blocking all traffic except explicitly allowed services. This minimizes exposure and prevents unauthorized access.

1. Verify firewalld is running:
```command
    sudo systemctl status firewalld
```

The output should show `enabled` and `active (running)`. If firewalld is not running or not enabled to start on boot, enable and start it:

```command
    sudo systemctl enable --now firewalld
```

2. Allow HTTP and HTTPS for web traffic for your web server:
```command
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
```
The `--permanent` flag ensures these rules persist across reboots.

3. If you changed SSH to a non-standard port (recommended for security), allow it:
```command
    sudo firewall-cmd --permanent --add-port=2222/tcp
```
{{< note >}}
SSH on the default port 22 is already allowed in firewalld's default "public" zone. Only add a custom port rule if you changed SSH to a non-standard port.
{{< /note >}}

4. Reload the firewall to apply changes:
```command
    sudo firewall-cmd --reload
```

5. Confirm that `http`, `https`, and `ssh` appear under **services**, and any custom SSH port appears under **ports**.
```command
    sudo firewall-cmd --list-all
```

```output
    public (active)
      services: cockpit dhcpv6-client http https ssh
      ports:
```
{{< note >}}
Replace `2222` with whatever port number you configured for SSH. Common non-standard SSH ports include 2222, 2200, or any port above 1024 that isn't in use.
{{< /note >}}

### Configure SELinux

Rocky Linux 9 has SELinux (Security-Enhanced Linux) enabled by default. SELinux provides mandatory access control, limiting the damage an attacker can cause even if they compromise a service. Never disable SELinux in production environments.

1. Verify SELinux is enforcing:
2.
```command
    getenforce
```

```output
    Enforcing
```

2. If your web applications need to connect to remote databases or send email, configure the appropriate SELinux booleans:

```command
    # Allow Apache to connect to remote databases
    sudo setsebool -P httpd_can_network_connect_db 1

    # Allow Apache to send email

    sudo setsebool -P httpd_can_sendmail 1
```

{{< note >}}
Only enable these if your applications require them. The `-P` flag makes the setting persistent across reboots.
{{< /note >}}

Then verify both:

```command
    getsebool httpd_can_network_connect_db httpd_can_sendmail
```

Expected output:
```output
httpd_can_network_connect_db --> on
httpd_can_sendmail --> on
```

3. Set correct SELinux contexts for web content:
4.
```command
    sudo semanage fcontext -a -t httpd_sys_content_t "/var/www/html(/.*)?"
    sudo restorecon -Rv /var/www/html
```
Check the SELinux context of the directory:

```command
    ls -Z /var/www/html
    ls -Zd /var/www/html
```

```output
    system_u:object_r:httpd_sys_content_t:s0 /var/www/html
```
The `httpd_sys_content_t` context allows Apache to serve files from this directory.

### Secure Apache Configuration

1. Hide Apache version information by editing the Apache configuration:

```command
    sudo nano /etc/httpd/conf/httpd.conf
```

1. Add or modify these lines:

    {{< file "/etc/httpd/conf/httpd.conf" apache >}}
ServerTokens Prod
ServerSignature Off
    {{< /file >}}

1. Disable directory listing by ensuring this line exists in your configuration:

    {{< file "/etc/httpd/conf/httpd.conf" apache >}}
Options -Indexes FollowSymLinks
    {{< /file >}}

1. Restart Apache to apply changes:

    ```command
    sudo apachectl configtest
    sudo systemctl restart httpd
    sudo systemctl status httpd
    ```
Expected output:
- First command: `Syntax OK`
- Second command: Silent return to prompt (no output)
- Third command: Shows `active (running)` and `Started The Apache HTTP Server`

### Secure MariaDB

1. Edit the MariaDB configuration:

```command
    sudo nano /etc/my.cnf.d/mariadb-server.cnf
```

1. Add these security settings under the `[mysqld]` section:

    {{< file "/etc/my.cnf.d/mariadb-server.cnf" ini >}}
[mysqld]
bind-address = 127.0.0.1
local-infile = 0
    {{< /file >}}

1. Restart MariaDB:

```command
    sudo systemctl restart mariadb
```
1. Verify MariaDB is running:

```command
    sudo systemctl status mariadb
```

### Secure PHP Configuration

1. Edit the PHP configuration:

```command
    sudo nano /etc/php.ini
```

1. Modify these security-related settings:

    {{< file "/etc/php.ini" ini >}}
expose_php = Off
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
disable_functions = exec,passthru,shell_exec,system,proc_open,popen
allow_url_fopen = Off
allow_url_include = Off
    {{< /file >}}

1. Create the PHP log directory:

```command
    sudo mkdir -p /var/log/php
    sudo chown apache:apache /var/log/php
```

1. Restart Apache:

```command
    sudo systemctl restart httpd
```

### Install and Configure ModSecurity (Optional)

ModSecurity is a web application firewall (WAF) that provides additional protection against common web attacks.

1. Install ModSecurity:

These steps enhance the security of your LAMP Stack on Rocky Linux 9, especially for production environments or public-facing servers.

```command
    sudo dnf install mod_security -y
```

Expected output: The terminal will display a summary ending with "Complete!" indicating successful installation.

1. Enable and start ModSecurity:

Restart Apache to load the ModSecurity module:

```command
    sudo systemctl restart httpd
```

A silent return to the prompt indicates success.

1. Verify ModSecurity is loaded:

To confirm that Mod Security is active, use the following command:

```command
    sudo httpd -M | grep security
```

This lists all loaded Apache modules and filters for ModSecurity. If installed correctly, you should see:

```output
    security2_module (shared)
```

{{< note >}}
Some systems may not support `apachectl -M`. Using `httpd -M` is more reliable on Rocky Linux 9.
{{< /note >}}

For detailed ModSecurity configuration and rules:

[Apache ModSecurity Guide](https://www.linode.com/docs/guides/securing-apache2-with-modsecurity/).

[Apache Modsecurity module: A practical guide - Sling Academy](https://www.slingacademy.com/article/apache-mod-security-module-practical-guide/#google_vignette).

[How to Install Modsecurity 2 OWASP CRS with Apache on Ubuntu 24.04/22.04/20.04 - LinuxCapable](https://linuxcapable.com/how-to-install-modsecurity-with-apache-on-ubuntu-linux/).

For advanced rule sets and customization, see the [OWASP ModSecurity Core Rule Set](https://coreruleset.org/) and [Sling Academy’s practical guide](https://www.slingacademy.com/article/apache-mod-security-module-practical-guide/).

### Enable Automatic Security Updates

Security vulnerabilities are discovered constantly. Manually checking for and applying updates creates dangerous gaps where your server remains vulnerable to known exploits. Automatic security updates ensure critical patches are applied promptly, reducing the window of exposure to attacks. This is essential for production servers that need continuous protection without manual intervention. So, it keeps the LAMP stack infrastructure (Apache, MariaDB, PHP, OS) patched and secure automatically.

1. Install the `dnf-automatic` package:

```command
    sudo dnf install dnf-automatic -y
```
Expected output: The terminal will display a summary ending with "Complete!" indicating successful installation.

1. Configure automatic updates by editing the configuration:

```command
    sudo nano /etc/dnf/automatic.conf
```

1. Set `apply_updates` to `yes`:

    {{< file "/etc/dnf/automatic.conf" ini >}}
[commands]
apply_updates = yes
    {{< /file >}}

1. Enable and start the automatic update timer:

```command
    sudo systemctl enable --now dnf-automatic.timer
```

### Configure Log Rotation

Log rotation is enabled by default: Rocky Linux 9 includes `logrotate` as part of its base system, and it's configured to rotate logs for common services like Apache (`httpd`) and MariaDB:

```command
    ls /etc/logrotate.d/
```

-  Lists all service-specific rotation configs.

-  To see configuration files for `httpd` and `mariadb`:

```command
    cat /etc/logrotate.d/httpd
    cat /etc/logrotate.d/mariadb
```
These files define how logs are rotated-for example: weekly rotation, retention of four weeks, and compression of older logs.

## Post-Install Best Practices

For production environments, implement regular backups:

- **Database backups**: Use `mysqldump` or MariaDB's backup tools
- **Web content backups**: Regularly backup `/var/www/html`
- **Configuration backups**: Backup `/etc/httpd` and `/etc/my.cnf.d`
- **Off-site storage**: Store backups in a separate location

## Install SSL/TLS Certificate

For production websites, always use HTTPS with a valid SSL/TLS certificate.

{{< note >}}
See the guide for [Reintech]([https://www.linode.com/docs/guides/enabling-https-using-certbot-with-apache-on-centos-8](https://reintech.io/blog/securing-apache-with-lets-encrypt-rocky-linux-9)/) for detailed instructions. Specifically written for Rocky Linux 9. Alternatively, see [CrownCloud's updated guide](https://wiki.crowncloud.net/?How_to_Install_Lets_Encrypt_SSL_with_LAMP_Stack_on_Rocky_Linux_9) for a Rocky-specific walkthrough.
{{< /note >}}

## Migration-Specific Considerations

If you're migrating an existing site from CentOS 8:

### Application Compatibility

- Test all applications on Rocky Linux 9 before going live
- Check PHP version compatibility (Rocky 9 may have newer PHP)
- Verify all PHP extensions are installed

### Data Migration

- Export databases from CentOS 8: `mysqldump -u root -p --all-databases > backup.sql`
- Transfer web files: `rsync -avz /var/www/html/ user@new-server:/var/www/html/`
- Import databases to Rocky Linux 9: `mysql -u root -p < backup.sql`
- Verify file permissions after transfer

### Testing Checklist

- All pages load correctly
- Database connections work
- Forms submit properly
- File uploads function
- SSL certificate installed and working
- Redirects work correctly
- Cron jobs migrated and running

## Conclusion

Rocky Linux 9 provides a stable, long-term CentOS 8 replacement with identical commands and structure. The LAMP stack installation is straightforward, but production deployment requires the security hardening steps outlined above.

**Key takeaways:**

- Installation process identical to CentOS 8
- Never disable SELinux - configure it properly
- Production hardening is mandatory, not optional
- Test thoroughly before migrating production workloads

## Additional Resources

- [Linode's LAMP Installation Guide](https://www.linode.com/docs/guides/how-to-install-lamp-stack-on-fedora-alma-rocky-linux/) - Complete installation walkthrough
- [Rocky Linux Official SELinux Documentation:](https://docs.rockylinux.org/10/guides/security/learning_selinux/) - Applicable to Rocky Linux 9
- [Rocky Linux Official ModSecurity/WAF Guide:](https://docs.rockylinux.org/guides/web/apache_hardened_webserver/modsecurity/) - Advanced web application firewall

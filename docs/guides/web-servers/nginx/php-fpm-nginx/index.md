---
slug: php-fpm-nginx
title: "Modern PHP-FPM and NGINX Configuration"
description: 'Install and configure PHP-FPM and NGINX using current upstream best practices and Akamai-specific considerations.'
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2026-03-22
keywords: ["php", "php-fpm", "nginx", "web servers", "linux"]
tags:["web-servers", "nginx", "php", "serve"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- [PHP-FPM documentation](https://www.php.net/manual/en/install.fpm.php)
- [NGINX](https://nginx.org/en/docs/)
---

The PHP FastCGI Process Manager (PHP-FPM) manages PHP processes independent of the web server as a modern FastCGI implementation with NGINX.

Use PHP-FPM with NGINX when you need process isolation, independent PHP and web server scaling, or improved resource management for PHP applications compared to mod_php or CGI implementations

This guide demonstrates how to deploy PHP-FPM and NGINX on Akamai cloud compute infrastructure. It covers installation of both components on a supported Linux distribution, NGINX configuration for FastCGI proxy, PHP-FPM pool setup, deployment testing, and application of basic security hardening. It addresses Akamai-specific requirements for instance sizing, firewall configuration through Cloud Manager, and performance tuning.

For complete documentation and configuration options see the official:

- [PHP-FPM documentation](https://www.php.net/manual/en/install.fpm.php)
- [NGINX](https://nginx.org/en/docs/)

## Before You Begin

Complete these prerequisites before installing PHP-FPM and NGINX. For initial server setup and OS installation, see the [Ubuntu Server](https://ubuntu.com/server/docs) documentation and [Akamai's Getting Started](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guides.

### Prerequisites:

- A compute instance running Ubuntu 22.04 LTS
- SSH access to the instance with a non-root user account
- Sudo privileges for package installation and service management
- Cloud Manager access to configure firewall rules
- Basic familiarity with Linux package management (apt)

## Akamai-Specific Considerations

Configure platform-specific settings for your PHP-FPM deployment including firewall rules, instance sizing, and optional storage or load balancing.

### Cloud Firewall Configuration

Configure Cloud Firewall rules to allow web traffic to your instance.

1. Navigate to Cloud Manager and select Firewalls from the sidebar.
2. Create a new firewall or modify an existing one.
3. Add inbound rules for HTTP and HTTPS traffic:

  - HTTP: Protocol: TCP, Port: 80, Source: All IPv4 / All IPv6
  - HTTPS: Protocol: TCP, Port: 443, Source: All IPv4 / All IPv6
4. Apply the firewall to your compute instance.

For detailed firewall configuration, see [Getting Started with Cloud Firewalls](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-cloud-firewalls).

### Instance Sizing

PHP-FPM memory requirements scale with concurrent connections. Select an instance plan based on expected traffic.

#### Development/Testing:

- Shared CPU (1-2 GB RAM) for low-traffic sites or development environments.

#### Production - Low to Medium Traffic:

- Shared CPU (4-8 GB RAM) for small to medium production sites.
- Supports 50-200 concurrent PHP-FPM processes depending on application complexity.

#### Production - High Traffic:

Dedicated CPU (8+ GB RAM) for high-traffic applications requiring sustained CPU performance
Eliminates resource contention for consistent PHP execution times

Monitor CPU and memory usage through Cloud Manager after deployment and resize as needed.

### Optional: Block Storage

Consider attaching Block Storage volumes for user-uploaded content, application file storage exceeding local disk capacity, or separation of application data from system storage. Block Storage volumes are portable between instances and can be resized independently. See [Block Storage](https://techdocs.akamai.com/cloud-computing/docs/block-storage) documentation for setup instructions.

### Optional: Load Balancer Configuration

For high-availability deployments, use NodeBalancers to distribute traffic across multiple PHP-FPM instances. Configure health checks on port 80 or 443, set session persistence if application requires sticky sessions, and ensure backend nodes run identical PHP-FPM and NGINX configurations. NodeBalancer setup is beyond the scope of this guide. See [Getting Started with NodeBalancers](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-nodebalancers).

## Install PHP-FPM

Install PHP-FPM and NGINX packages using the Ubuntu package manager. For comprehensive PHP installation options and configuration reference, see the official [PHP-FPM](https://www.php.net/manual/en/install.fpm.php) documentation.

Install the required packages:
```command
sudo apt update
sudo apt install nginx php8.1-fpm
```

Verify both services are installed and running:
```command
sudo systemctl status nginx
sudo systemctl status php8.1-fpm
```

### Common PHP Extensions

Install additional PHP extensions based on application requirements:
```command
sudo apt install php8.1-mysql php8.1-xml php8.1-mbstring php8.1-curl php8.1-gd
```

**Common extensions**:

- php8.1-mysql: MySQL/MariaDB database connectivity
- php8.1-xml: XML parsing and manipulation
- php8.1-mbstring: Multibyte string handling
- php8.1-curl: HTTP client functionality
- php8.1-gd: Image processing

Install only the extensions your application requires. Restart PHP-FPM after installing extensions:

```command
sudo systemctl restart php8.1-fpm
```

## Configure NGINX for PHP-FPM

NGINX communicates with PHP-FPM through the FastCGI protocol, passing PHP requests to the PHP-FPM process manager for execution. NGINX was installed in the previous section alongside PHP-FPM. For comprehensive NGINX configuration options, see the official [NGINX](https://nginx.org/en/docs/) documentation.

### FastCGI Communication

NGINX forwards PHP requests to PHP-FPM via a Unix socket or TCP connection. The Unix socket method provides better performance for local communication between NGINX and PHP-FPM on the same instance.

Verify the PHP-FPM socket location:

```command
ls -la /run/php/php8.1-fpm.sock
```

The socket path must match the `fastcgi_pass` directive in the NGINX server block configuration.

### Server Block Configuration

Create an NGINX server block to handle PHP requests. This example assumes a site served from `/var/www/example.com`.

Create the server block configuration file:

```command
sudo nano /etc/nginx/sites-available/example.com
```

Add the following configuration:
```
fileserver {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    root /var/www/example.com;
    index index.php index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
    }
}
```
Key directives:

- listen: Defines ports for IPv4 and IPv6
- server_name: Domain names for this server block
- root: Document root directory
- fastcgi_pass: Socket path for PHP-FPM communication
- include snippets/fastcgi-php.conf: Standard FastCGI parameters

Enable the server block and test the configuration:

```command
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t
```

Reload NGINX to apply changes:

```command
sudo systemctl reload nginx
```

### Configure PHP-FPM

PHP-FPM uses pool configuration files to define how the process manager handles requests. The default pool configuration is located at `/etc/php/8.1/fpm/pool.d/www.conf`. For comprehensive configuration options and tuning guidance, see the official PHP-FPM configuration documentation.

### Verify Socket Configuration

Confirm the PHP-FPM socket path matches the NGINX server block configuration.

Open the pool configuration file:

```command
sudo nano /etc/php/8.1/fpm/pool.d/www.conf
```
Locate the `listen` directive:

```file
listen = /run/php/php8.1-fpm.sock
```

This socket path must match the `fastcgi_pass` directive in your NGINX server block. The default configuration is correct for most deployments.

### Process Manager Configuration

PHP-FPM's process manager controls how worker processes are spawned and managed. The `pm` directive defines the process management strategy.

Key process manager directives in `/etc/php/8.1/fpm/pool.d/www.conf`:

```file
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

**Process manager settings:**

- **pm = dynamic**: Spawns child processes based on demand
- **pm.max_children**: Maximum concurrent PHP-FPM processes
- **pm.start_servers**: Processes created at startup
- **pm.min_spare_servers**: Minimum idle processes
- **pm.max_spare_servers**: Maximum idle processes

### Performance Tuning Considerations

Adjust `pm.max_children` based on available memory and expected traffic. Each PHP-FPM process typically consumes 20-50 MB of RAM depending on application complexity.

**Memory calculation:**
```
pm.max_children = (Available RAM - System RAM) / Average Process Memory
```

For a 4 GB instance with 1 GB reserved for system processes and 30 MB per PHP process:
```
pm.max_children = (4096 MB - 1024 MB) / 30 MB ≈ 100
```
Monitor actual memory usage after deployment and adjust accordingly. Exceeding available memory causes swapping and degrades performance.

Restart PHP-FPM to apply configuration changes:
```command
sudo systemctl restart php8.1-fpm
```

### Test the Deployment

Verify PHP-FPM and NGINX are correctly configured by creating a test PHP file and accessing it through a web browser.

### Create Test File

Create a PHP info file in your document root:
```command
sudo nano /var/www/example.com/info.php
```

Add the following content:
```file
<?php
phpinfo();
?>
```

Set appropriate permissions:

```command
sudo chown www-data:www-data /var/www/example.com/info.php
```

### Verify PHP Execution

Access the test file through your web browser using your server's IP address or domain name:

```
http://example.com/info.php
```

A page displaying PHP configuration information confirms PHP-FPM is processing requests correctly. The page shows the PHP version, loaded extensions, and configuration directives.

Verify the Server API line shows `FPM/FastCGI`, confirming NGINX is communicating with PHP-FPM rather than using an alternative PHP handler.

### Remove Test File

Delete the info file after verification to prevent exposing system configuration:

```command
sudo rm /var/www/example.com/info.php
```

The `phpinfo()` function displays sensitive server information including file paths, loaded modules, and environment variables. Remove this file immediately after testing.

## Basic Security Hardening

Apply foundational security measures to protect your PHP-FPM deployment. These settings address common vulnerabilities without requiring application-specific configuration.

### Disable Dangerous PHP Functions

Restrict PHP functions that can execute system commands or access the filesystem in ways that pose security risks.

Edit the PHP configuration file:

```command
sudo nano /etc/php/8.1/fpm/php.ini
```
Locate the `disable_functions` directive and add potentially dangerous functions:

```file
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source
```

Restart PHP-FPM to apply changes:

```command
sudo systemctl restart php8.1-fpm
```
Test your application after disabling functions to ensure required functionality remains intact. Some applications legitimately require these functions.

### Configure File Permissions

Set appropriate ownership and permissions for web files to prevent unauthorized modification.

Set ownership to the web server user:

```command
sudo chown -R www-data:www-data /var/www/example.com
```
Set directory permissions:
```command
sudo find /var/www/example.com -type d -exec chmod 755 {} \;
```
Set file permissions:
```command
sudo find /var/www/example.com -type f -exec chmod 644 {} \;
```

Files should be readable by the web server but writable only by the owner. Directories require execute permissions for traversal.

### Enable HTTPS

Configure TLS/SSL certificates to encrypt traffic between clients and your server. HTTPS prevents credential interception and protects session data.

For TLS/SSL certificate configuration on Akamai cloud compute, see [Enable TLS for HTTPS](??????????).

### Remove Default Content

Delete default NGINX welcome pages and example files to reduce information disclosure:

```command
sudo rm /var/www/html/index.nginx-debian.html
```

Remove or disable the default NGINX server block if not in use:

```command
sudo rm /etc/nginx/sites-enabled/default
```
Reload NGINX after removing default content:

```command
sudo systemctl reload nginx
```

### Production Environment Considerations

Disable PHP error display in production to prevent exposing system information through error messages.

Edit the PHP configuration file:

```command
sudo nano /etc/php/8.1/fpm/php.ini
```
Set the following directives:

```file
display_errors = Off
log_errors = On
error_log = /var/log/php-fpm/error.log
```

Errors are logged to `/var/log/php-fpm/error.log` for debugging without exposing details to users. Restart PHP-FPM after making changes.

Never deploy `phpinfo()` or similar diagnostic scripts to production environments. These scripts expose configuration details including file paths, loaded modules, and environment variables.

## Logging and Monitoring

Monitor NGINX and PHP-FPM through log files and system metrics to identify errors, performance issues, and security events.

### NGINX Logs

NGINX stores access and error logs in `/var/log/nginx/` by default.

**Log locations**:

- Access log: /var/log/nginx/access.log - Records all requests
- Error log: /var/log/nginx/error.log - Records server errors and warnings

View recent NGINX errors:

```command
sudo tail -f /var/log/nginx/error.log
```

Configure custom log locations in server block configurations using the `access_log` and `error_log` directives.

### PHP-FPM Logs

PHP-FPM logs process manager events and PHP errors separately from NGINX.

**Log locations**:

- PHP-FPM process log: /var/log/php8.1-fpm.log - Pool manager events
- PHP error log: Configured in php.ini via the error_log directive

View PHP-FPM process events:

```command
sudo tail -f /var/log/php8.1-fpm.log
```

PHP application errors appear in the location specified by the 1error_log1 directive in `/etc/php/8.1/fpm/php.ini`.

### Performance Monitoring

Monitor CPU, memory, and network usage through Cloud Manager's built-in metrics dashboard. Track PHP-FPM process counts and memory consumption to identify resource constraints.

Key metrics to monitor:

- **CPU usage**: Sustained high CPU indicates insufficient instance sizing or inefficient code
- **Memory usage**: Approaching total RAM triggers swapping and performance degradation
- **PHP-FPM process count**: Reaching `pm.max_children` indicates configuration adjustments needed

For advanced monitoring, integrate with external observability platforms. See the [NGINX](https://nginx.org/en/docs/http/ngx_http_stub_status_module.html) monitoring documentation for enabling the stub status module.

## Troubleshooting

Resolve common issues with PHP-FPM and NGINX deployments. Each section identifies symptoms and provides diagnostic steps.

### NGINX Gateway Errors

**Symptom**: Browser displays "502 Bad Gateway" or "504 Gateway Timeout" errors when accessing PHP pages.

**Causes and solutions:

PHP-FPM not running**:

Check PHP-FPM service status:

```command
sudo systemctl status php8.1-fpm
```

Start the service if stopped:

```command
sudo systemctl start php8.1-fpm
```
**Socket path mismatch**:

Verify the socket path in NGINX configuration matches PHP-FPM pool configuration:

```command
grep "fastcgi_pass" /etc/nginx/sites-available/example.com
grep "listen" /etc/php/8.1/fpm/pool.d/www.conf
```

Both values must be identical. Restart both services after correcting mismatches.
**Insufficient PHP-FPM workers**:

Check if `pm.max_children` limit is reached:
```command
sudo grep "max_children" /var/log/php8.1-fpm.log
```

Increase `pm.max_children` in `/etc/php/8.1/fpm/pool.d/www.conf` if processes are hitting the limit.

### File Permission Issues

**Symptom**: "Permission denied" errors in NGINX error log or blank pages when accessing PHP files.

**Solution**:

Verify NGINX can read PHP files:

```command
sudo -u www-data test -r /var/www/example.com/index.php && echo "Readable" || echo "Permission denied"
```

Set correct ownership:

```command
sudo chown -R www-data:www-data /var/www/example.com
```

Ensure directories are executable and files are readable:

```command
sudo find /var/www/example.com -type d -exec chmod 755 {} \;
sudo find /var/www/example.com -type f -exec chmod 644 {} \;
```

### Firewall Configuration

**Symptom**: Cannot access website from external network, or connection times out.

**Solution**:

Verify Cloud Firewall allows HTTP/HTTPS traffic:

1. Navigate to Cloud Manager > Firewalls
2. Select the firewall attached to your instance
3. Confirm inbound rules allow TCP ports 80 and 443

Check local firewall rules if using UFW or iptables:

```command
sudo ufw status
```

Allow HTTP and HTTPS if blocked:

```command
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### AppArmor Restrictions

**Symptom**: PHP-FPM fails to start or access specific files despite correct permissions.

Ubuntu 22.04 uses AppArmor for mandatory access control. Check AppArmor status:

```command
sudo aa-status
```

Review AppArmor denials in system log:

```command
sudo grep "apparmor" /var/log/syslog
```

PHP-FPM's AppArmor profile is located at `/etc/apparmor.d/php-fpm`. Modify the profile only if legitimate application requirements conflict with default restrictions. Reload AppArmor after profile changes:

```command
sudo systemctl reload apparmor
```

## Next Steps

Expand your PHP-FPM deployment with database connectivity, advanced performance tuning, and high-availability configurations.

### Database Integration

Connect your PHP application to a database server:

- [MySQL on Ubuntu 22.04](https://www.linode.com/docs/???) - Install and configure MySQL for PHP applications
- [PostgreSQL on Ubuntu 22.04](https://www.linode.com/docs/???) - Deploy PostgreSQL database server
- [Akamai Managed Databases](https://techdocs.akamai.com/cloud-computing/docs/aiven-database-clusters) - Fully managed database clusters

### Performance Optimization

Advanced tuning for production workloads:

- [NGINX Performance Tuning](https://nginx.org/en/docs/http/ngx_http_core_module.html???) - Worker processes, connection limits, and buffer sizing
- [PHP-FPM Performance](https://www.php.net/manual/en/install.fpm.configuration.php) - Process manager optimization and OPcache configuration
- [PHP OPcache Configuration](https://www.php.net/manual/en/opcache.configuration.php) - Bytecode caching for improved performance

### Security Hardening

Additional security measures beyond basic hardening:

- [PHP Security Best Practices](https://www.php.net/manual/en/security.php) - Official PHP security guidance
- [NGINX Security Configuration](https://nginx.org/en/docs/http/ngx_http_ssl_module.html) - TLS/SSL configuration and security headers

### High Availability

Scale your deployment across multiple instances:

- [Getting Started with NodeBalancers](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-nodebalancers) - Load balancing for PHP-FPM instances
- [Cloud Firewall Advanced Configuration](https://techdocs.akamai.com/cloud-computing/docs/manage-firewall-rules) - Security rules for multi-instance deployments
---
slug: php-fpm-nginx
title: "Modern PHP-FPM and NGINX Configuration"
description: "Install and configure PHP-FPM and NGINX using current upstream best practices and Akamai-specific considerations."
authors: ['Akamai']
contributors: ['Akamai']
published: 2026-02-20
keywords: ['php', 'php-fpm', 'fpm', 'nginx', 'web servers', 'linux']
tags: ['web-servers', 'nginx', 'php', 'serve', 'fpm']
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)"
external_resources:
- "[PHP-FPM documentation](https://www.php.net/manual/en/install.fpm.php)"
- "[NGINX](https://nginx.org/en/docs/)"
---

PHP FastCGI Process Manager (PHP-FPM) runs PHP processes independently of the web server, enabling process isolation, independent scaling, and better resource management than mod_php or CGI implementations.

This guide shows how to deploy PHP-FPM with NGINX on Akamai cloud compute, including installation, FastCGI proxy configuration, PHP-FPM pool setup, and security hardening for Akamai infrastructure.

For full configuration options, see the official [PHP-FPM](https://www.php.net/manual/en/install.fpm.php) and [NGINX](https://nginx.org/en/docs/) documentation.

## Before You Begin

Complete these prerequisites before installing PHP FPM and NGINX. Create and configure your instance using Akamai’s Creating a Compute Instance and Set Up and Secure a Compute Instance guides.

{{< note>}}:
Before creating your instance, confirm that the plan you select provides enough CPU and RAM for your expected traffic and PHP FPM workload. Use the Instance Sizing Reference below as a quick planning guide.
{{< /note>}}

Create and configure your instance using Akamai's [Creating a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance) and [Set Up and Secure a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guides.

For OS-level documentation, see the [Ubuntu Server](https://ubuntu.com/server/docs) documentation.

### Prerequisites:

- A compute instance running Ubuntu 22.04 LTS
- SSH access to the instance with a non-root user account
- Sudo privileges for package installation and service management
- Cloud Manager access to configure firewall rules
- Basic familiarity with Linux package management (apt)-

**Instance Sizing Reference**

Instance sizing affects PHP FPM performance, especially under concurrent load. Use this table as a planning reference when selecting your instance plan, and revisit it after deployment if you need to resize.

| Workload | Plan | RAM |
|---|---|---|
| Development/Testing | Shared CPU | 1–2 GB |
| Production: Low to Medium Traffic | Shared CPU | 4–8 GB |
| Production: High Traffic | Dedicated CPU | 8+ GB |

After deployment, monitor CPU and memory usage in Cloud Manager and adjust your instance size if needed.

## Akamai-Specific Considerations

Configure platform-specific settings for your PHP-FPM deployment including firewall rules, instance sizing, and optional storage or load balancing.

### Cloud Firewall Configuration

Configure Cloud Firewall rules to allow web traffic to your instance.Work through these steps promptly, as Cloud Manager sessions can time out and unsaved changes will be lost.

1. Navigate to Cloud Manager and select Firewalls from the sidebar under **Networking**.
2. Create a new firewall or modify an existing one.
3. Add each of the following as a separate inbound rule by clicking **Add an Inbound Rule**, completing the fields, and clicking **Add Rule** before starting the next:

  - HTTP: Protocol: TCP, Port: 80, Action: Accept, Source: All IPv4 / All IPv6
  - HTTPS: Protocol: TCP, Port: 443, Action: Accept, Source: All IPv4 / All IPv6

4. To apply the firewall to your compute instance:

  - select the **Linodes** tab within your firewall
  - click **Add Linodes To Firewall**
  - select your instance from the list that appears, then click outside the dropdown to close it
  - then click **Add**..

For detailed firewall configuration, see [Getting Started with Cloud Firewalls](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-cloud-firewalls).

#### Development/Testing:

- Shared CPU (1-2 GB RAM) for low-traffic sites or development environments.

#### Production - Low to Medium Traffic:

- Shared CPU (4-8 GB RAM) for small to medium production sites.
- Supports 50-200 concurrent PHP-FPM processes depending on application complexity.

#### Production - High Traffic:

- Dedicated CPU (8+ GB RAM) for high-traffic applications requiring sustained CPU performance; eliminates resource contention for consistent PHP execution times

Monitor CPU and memory usage through Cloud Manager after deployment and resize as needed.

### Optional: Block Storage

Consider attaching Block Storage volumes for user-uploaded content, application file storage exceeding local disk capacity, or separation of application data from system storage. Block Storage volumes are portable between instances and can be resized independently. See [Block Storage](https://techdocs.akamai.com/cloud-computing/docs/block-storage) documentation for setup instructions.

### Optional: Load Balancer Configuration

For high-availability deployments, use NodeBalancers to distribute traffic across multiple PHP-FPM instances. Configure health checks on port 80 or 443, set session persistence if application requires sticky sessions, and ensure backend nodes run identical PHP-FPM and NGINX configurations. NodeBalancer setup is beyond the scope of this guide. See [Getting Started with NodeBalancers](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-nodebalancers).

## Install PHP-FPM

Log in to your instance as the sudo user you create and install PHP-FPM and NGINX packages using the Ubuntu package manager. For comprehensive PHP installation options and configuration reference, see the official [PHP-FPM](https://www.php.net/manual/en/install.fpm.php) documentation.

Install the required packages:
```command
sudo apt update
sudo apt install nginx php8.1-fpm
```
Type "Y" and enter to continue with installation when prompted about disk space usage.You are returned to the prompt.

Then verify both services are installed and running:
```command
sudo systemctl status nginx
sudo systemctl status php8.1-fpm
```
Both commands should return`active (running)` with worker processes listed. Press `q` to return to the command prompt.

If either service shows a status other than active (running), review the installation steps and check the system logs using `sudo journalctl -u nginx` or `sudo journalctl -u php8.1-fpm`.

### Common PHP Extensions

Install additional PHP extensions based on application requirements:
```command
sudo apt install php8.1-mysql php8.1-xml php8.1-mbstring php8.1-curl php8.1-gd
```
Type "Y" and enter to continue with installation when prompted about disk space usage.You are returned to the prompt.

**Common extensions**:

- php8.1-mysql: MySQL/MariaDB database connectivity
- php8.1-xml: XML parsing and manipulation
- php8.1-mbstring: Multibyte string handling
- php8.1-curl: HTTP client functionality
- php8.1-gd: Image processing

Install only the extensions your application requires.

Restart PHP-FPM after installing extensions:
```command
sudo systemctl restart php8.1-fpm
```

Verify the extensions are active:
```command
php -m | grep -E 'mysql|xml|mbstring|curl|gd'
```

A successful installation output looks like this:
```output
curl
gd
libxml
mbstring
mysqli
mysqlnd
pdo_mysql
xml
xmlreader
xmlwriter
```

Then confirm PHP-FPM restarted cleanly:
```command
sudo systemctl status php8.1-fpm
```

The service should again show `active (running)`. Press `q` to return to the command prompt.

{{< note>}}
On Ubuntu 22.04 with PHP 8.1, the MySQL extension appears as `mysqlnd` in `php -m` output. This is expected behavior and confirms that MySQL support is active.
{{< /note>}}

Troubleshooting: MySql extension does not appear in `php-m`

If the `php -m` doesn't show any of the `mysql` after using the command above to install them, install it explicitly:
```command
sudo apt install php8.1-mysql
```
Then restart:
```command
sudo systemctl restart php8.1-fpm
```
Then, again, verify the extensions are active:
```command
php -m | grep -E 'mysql|xml|mbstring|curl|gd'
```

A successful installation looks like the output shown above and includes mysql in the list and may include additional modules and indicate normal, expected behavior.

## Configure NGINX for PHP-FPM

NGINX communicates with PHP-FPM through the FastCGI protocol, passing PHP requests to the PHP-FPM process manager for execution. NGINX was installed in the previous section alongside PHP-FPM.

The default NGINX installation requires no additional global configuration to work with PHP-FPM. You only need to create a server block that enables FastCGI processing.

For comprehensive NGINX configuration options, see the official [NGINX](https://nginx.org/en/docs/) documentation.

### Verify FastCGI Communication

NGINX forwards PHP requests to PHP-FPM via a Unix socket or TCP connection. The Unix socket method provides better performance for local communication between NGINX and PHP-FPM on the same instance.

**Step 1**: Check the PHP-FPM socket location:

```command
ls -la /run/php/php8.1-fpm.sock
```
This is the type of output you will see:
```
srw-rw---- 1 www-data www-data 0 Feb 24 18:05 /run/php/php8.1-fpm.sock
```

The socket path must match the fastcgi_pass directive in the NGINX server block configuration. If the socket exists and shows the expected ownership and permissions, PHP-FPM is ready for NGINX to connect to it.

### Create the NGINX Server Block

**Step 1**: Create an NGINX server block file to handle PHP requests. This example assumes a site served from `/var/www/example.com`:

```command
sudo nano /etc/nginx/sites-available/example.com
```

**Step 2**: Add the server block configuration:

```nginx
server {
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
**Step 3**: Understand Key directives:

- listen: Defines ports for IPv4 and IPv6
- server_name: Domain names for this server block
- root: Document root directory
- fastcgi_pass: Socket path for PHP-FPM communication
- include snippets/fastcgi-php.conf: Standard FastCGI parameters

**Step 4**: Enable the server block and test the configuration:

```command
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t
```
{{< note>}}
If the symlink already exists, you may see a"File exists" message. This means the site is already enable and you can continue to the next step.
{{< /note>}}

Then after you run the next command you receive a confirmation message that the `syntax is okay` and the `test was successful`.

**Step 5: Reload NGINX to apply changes:

```command
sudo systemctl reload nginx
```
Success returns you to the prompt.

## Configure PHP-FPM

The default pool configuration listens at `/etc/php/8.1/fpm/pool.d/www.conf` which matches the `fastcgi_pass` directive in you NGINX server block. No changes are required for standard deployments (for more information see the official PHP-FPM configuration documentation).

### Verify PHP-FPM Socket Configuration

Confirm the PHP-FPM socket path matches the NGINX server block configuration.

**Step 1**: Open the pool configuration file

```command
sudo nano /etc/php/8.1/fpm/pool.d/www.conf
```

**Step 2**: Locate the `listen` directive:

```file
listen = /run/php/php8.1-fpm.sock
```

This socket path must match the `fastcgi_pass` directive in your NGINX server block. The default configuration is correct for most deployments.

### Process Manager Configuration (Optional)

PHP-FPM's process manager controls how worker processes are spawned and managed. These settings are optional and do not affect basic functionality.

**Default Process Manager Settings**

```file
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

**Directive Description**

- **pm = dynamic**: Spawns child processes based on demand
- **pm.max_children**: Maximum concurrent PHP-FPM processes
- **pm.start_servers**: Processes created at startup
- **pm.min_spare_servers**: Minimum idle processes
- **pm.max_spare_servers**: Maximum idle processes

### Performance Tuning (Advanced, Optional)

Adjust `pm.max_children` based on available memory and expected traffic. Each PHP-FPM process typically consumes 20-50 MB of RAM depending on application complexity.

**Memory Calculation Example**
```text
pm.max_children = (Available RAM - System RAM) / Average Process Memory
```

For a 4 GB instance with 1 GB reserved for system processes and an average PHP-FPM worker size of 80 MB:
```text
pm.max_children = (4096 MB - 1024 MB) / 80 MB ≈ 38
```
This formula is provided as a planning guideline only. It is not a command and does not produce output.

Monitor actual memory usage after deployment and adjust accordingly. Exceeding available memory causes swapping and degrades performance.

Restart PHP-FPM to apply configuration changes if you have made any to the process manager settings:
```command
sudo systemctl restart php8.1-fpm
```

## Test the Deployment

Testing confirms that NGINX and PHP-FRM are communicating correctly.

### Create Test File

**Step 1**: Create a PHP info file in your document root:
```command
sudo nano /var/www/example.com/info.php
```

Add the following content:
```file
<?php
phpinfo();
?>
```

**Step 2**: Set Permissions:

```command
sudo chown www-data:www-data /var/www/example.com/info.php
```
This command produces no output when successful.

### Verify PHP Execution

Access the test file through your web browser using your server's IP address or domain name:
```
http://example.com/info.php
```

A page displaying PHP configuration information confirms PHP-FPM is processing requests correctly.

Verify the Server API line shows:
```
`FPM/FastCGI`
```
This confirms NGINX is communicating with PHP-FPM rather than using an alternative PHP handler.

### Remove the Test File

Delete the info file after verification to prevent exposing system configuration details:

```command
sudo rm /var/www/example.com/info.php
```

The `phpinfo()` function displays sensitive server information including file paths, loaded modules, and environment variables, so removal is necessary.

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

For TLS/SSL certificate configuration on Akamai cloud compute, see [Use Certbot to Enable HTTPS with NGINX on Ubuntu](https://www.linode.com/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu/).Although the linked Akamai guide references Ubuntu 18.04/20.04, the Certbot installation and NGINX integration steps are identical on Ubuntu 22.04. You can safely follow the Akamai guide as written.

For users who prefer the most current upstream reference, [Certbot’s official](https://certbot.eff.org/instructions) Ubuntu 22.04 instructions follow the same workflow and may be used interchangeably.

### Remove Default Content

Remove default NGINX content to prevent exposing server details and reduce your attack surface. Default welcome pages and example configurations can reveal information about your environment and should be removed on production systems.

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

**Critical: Disable PHP Error Display in Production**
Displaying PHP errors in production exposes internal paths, configuration details, and environment information that attackers can exploit. Configure PHP to log errors privately instead.

Edit the PHP configuration file (scroll or page down to the end of the file to place these directives):

```command
sudo nano /etc/php/8.1/fpm/php.ini
```
Set the following directives:

```file
display_errors = Off
log_errors = On
error_log = /var/log/php-fpm/error.log
```
Be sure to save: Ctrl X, "Y", Enter.

Errors are logged to `/var/log/php-fpm/error.log` for debugging without exposing details to users.

Restart PHP-FPM after making changes:
```command
sudo systemctl reload php8.1-fpm

**Never deploy `phpinfo()` or similar diagnostic scripts in production**. These scripts expose details about your PHP environment--including file paths, loaded modules, extensions, environment variables, and configuration values--all of which can be used by attackers to map your system and target vulnerabilities.

## Logging and Monitoring

Monitor NGINX and PHP-FPM through log files and system metrics to identify errors, performance issues, and security events.

### NGINX Logs

NGINX stores access and error logs in `/var/log/nginx/` by default.

**Log locations**:

- Access log: `/var/log/nginx/access.log` - Records all requests
- Error log: `/var/log/nginx/error.log` - Records server errors and warnings

View recent NGINX errors:

```command
sudo tail -f /var/log/nginx/error.log
```
Use `Ctrl+ C` to stop following the log and return to the shell prompt.

If a command opens in a pager (showing a `:` at the bottom), press `q` to exit.

**Searching logs**

Use `grep` to search for specific errors or keywords in large log files:
```command
sudo grep -i "error" /var/log/nginx/error.log
sudo grep -i "timeout" /var/log/nginx/error.log
sudo grep -i "php" /var/log/nginx/error.log
```
This helps locate relevant entries quickly when logs are long or noisy.

**Custom log locations**

Configure custom log locations in server block configurations using the `access_log` and `error_log` directives. For example.
```nginx
access_log /var/log/nginx/example.access.log;
error_log /var/log/nginx/example.log;
```

### PHP-FPM Logs

PHP-FPM logs **process manager events** and **PHP application errors** separately from NGINX.

**Log locations**:

- PHP-FPM process log: `/var/log/php8.1-fpm.log` - pool manager lifecycle events
- PHP application error log: Defined by the `error log` directive in `php.ini`

View PHP-FPM process events:

```command
sudo tail -f /var/log/php8.1-fpm.log
```

Expected output:

When PHP FPM restarts (for example, after a system reboot or a configuration reload), the process log records normal lifecycle events such as:

- `NOTICE: Terminating ...`
- `NOTICE: exiting, bye-bye!`
- `NOTICE: fpm is running, pid <PID>`
- `NOTICE: ready to handle connections`
- `NOTICE: systemd monitor interval set to 10000ms`

These messages indicate that PHP FPM stopped and started cleanly. The `tail -f` command will remain open and display new events as they occur.

PHP application-level errors are written to the file specified by the `error_log` directive in `/etc/php/8.1/fpm/php.ini`.

### Performance Monitoring

Monitor CPU, memory, and network usage through [Cloud Manager's built-in metrics dashboard](https://techdocs.akamai.com/cloud-computing/docs/monitor-and-maintain-a-compute-instance). Track PHP-FPM process counts and memory consumption to identify resource constraints as your application begins handling real traffic.

Key metrics to monitor:

- **CPU usage**: Sustained high CPU means the instance is too small for the workload or the application is doing more work than expected.
- **Memory usage**: High memory usage forces the system to swap to disk, which significantly slows request processing.
- **PHP-FPM process count**: Reaching `pm.max_children` means all workers are busy, so new requests queue and may slow down or time out (configuration adjustments needed).

For deeper visibility into request behavior and PHP-FPM saturation, integrate with an external observability platforms. See the [NGINX](https://nginx.org/en/docs/http/ngx_http_stub_status_module.html) monitoring documentation for enabling the stub status module.

These metrics don’t require a test step during deployment; they become relevant once your application is serving real traffic. For help interpreting these metrics and resolving issues such as PHP-FPM saturation or slow requests, see the Troubleshooting section that follows.

## Troubleshooting

If your PHP-FPM and NGINX configuration isn't working as expected, use the steps below to identify where the issue is occurring and how to resolve it. PHP, PHP FPM, and NGINX each log different types of errors, so knowing which component to check helps you interpret problems quickly and accurately.

These steps don't produce output unless an issue is present. Use them when your application shows errors, slowdowns, or unexpected behavior.

1. Check the NGINX Error Log

NGINX logs routing, FastCGI, and upstream connection issues. Common symptoms include:
- 502 Bad Gateway → NGINX cannot reach PHP-FPM
- 403 or 404 errors → incorrect root path or permissions
- PHP file downloads instead of executing → PHP module not loaded

View the log:
```command
sudo tail -f /var/log/nginx/error.log
```

2. Check the PHP-FPM Service Log

PHP-FPM logs process-level issues such as pool misconfiguration, socket failures, crashes, or resource exhaustion.
```command
sudo tail -f /var/log/php8.1-fpm.log
```
Restart PHP FPM if needed:
```command
sudo systemctl restart php8.1-fpm
```

3. Check PHP Application Errors

PHP application level errors (syntax errors, fatal errors, exceptions) are written to the file defined by the `error_log` directive in:
```command
/etc/php/8.1/fpm/php.ini
```

Some frameworks override this setting. If the file is empty, check your application’s log directory or the NGINX error log.

4. Verify the PHP-FPM Socket or Port

If NGINX cannot reach PHP-FPM, you may see:

- 502 Bad Gateway
- Connection refused
- No such file or directory

Confirm the socket exists:
```command
ls -l /run/php/php8.1-fpm.sock
```

If your configuration uses TCP instead of a socket:
```command
fastcgi_pass 127.0.0.1:9000;
```

Ensure PHP-FPM is listening on that address.

5. Check File and Directory Permissions

Incorrect ownership or permissions can prevent PHP-FPM from reading or executing files. A safe baseline for most deployments:
```command
sudo chown -R www-data:www-data /var/www/example.com
sudo find /var/www/example.com -type d -exec chmod 755 {} \;
sudo find /var/www/example.com -type f -exec chmod 644 {} \;
```

AppArmor Restrictions (Ubuntu Only)

If you’re using custom directories or non-standard paths, AppArmor may block PHP-FPM from reading files even when permissions are correct. Check for denials:
```command
sudo journalctl -xe | grep DENIED
```

If AppArmor is the cause, update the PHP-FPM AppArmor profile or place your files in approved locations.

6. Check for PHP-FPM worker saturation

If your application slows down or returns 504 errors, PHP-FPM may have reached pm.max_children. This means all workers are busy, new requests are waiting in a queue, and some may slow down or time out.

Look for messages such as:

•	server reached pm.max_children setting
•	pool seems busy

These indicate that PHP-FPM cannot spawn additional workers and is under load. See the Performance Monitoring section for guidance on watching process counts and memory usage.

7. Reload or Restart Services

After making configuration changes:
```command
sudo systemctl reload nginx
sudo systemctl restart php8.1-fpm
```

Reloading NGINX applies configuration changes without dropping active connections.

## Next Steps

Expand your PHP-FPM deployment with database connectivity, advanced performance tuning, and high-availability configurations as your application grows.

### Database Integration

Connect your PHP application to a database server:

- [MySQL on Ubuntu 22.04](https://www.linode.com/docs/guides/install-and-configure-mysql-on-ubuntu-22-04/) - Install and configure MySQL for PHP applications
- [PostgreSQL on Ubuntu 22.04](https://www.postgresql.org/download/linux/ubuntu/) - Install PostgreSQL from official Ubuntu packages
- [Akamai Managed Databases](https://techdocs.akamai.com/cloud-computing/docs/aiven-database-clusters) - Fully managed database clusters for production workloads

### Performance Optimization

Improve performance for production environments:

- [NGINX Performance Tuning: Tips and Tricks](https://blog.nginx.org/blog/performance-tuning-tips-tricks) - Worker processes, connection limits, and buffer sizing
- [PHP-FPM Configuration](https://www.php.net/manual/en/install.fpm.configuration.php) - Process manager tuning and OPcache settings
- [PHP OPcache Configuration](https://www.php.net/manual/en/opcache.configuration.php) - Bytecode caching for PHP execution

### Security Hardening

Strengthen your deployment beyond basic hardening:

- [PHP Security Best Practices](https://www.php.net/manual/en/security.php) - Official PHP security guidance
- [NGINX Security Configuration](https://nginx.org/en/docs/http/ngx_http_ssl_module.html) - TLS settings and security headers

### High Availability

Scale your deployment across multiple instances:

- [Getting Started with NodeBalancers](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-nodebalancers) - Load balancing for PHP-FPM instances
- [Cloud Firewall Advanced Configuration](https://techdocs.akamai.com/cloud-computing/docs/manage-firewall-rules) - Security rules for multi-instance deployments


---
slug: lemp-stack-on-centos-7-with-fastcgi
author:
  name: Linode
  email: docs@linode.com
description: "This guide shows how to install and configure a LEMP Stack (Linux, NGINX, MySQL, and PHP) which is a popular alternative to the LAMP stack on CentOS 7."
keywords: ["nginx", "lemp", "php", 'mariadb']
tags: ["lemp","web server","php","mysql","centos","nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-servers/lemp/lemp-server-on-centos-7-with-fastcgi/','/web-servers/lemp/lemp-stack-on-centos-7-with-fastcgi/','/websites/lemp/lemp-server-on-centos-7-with-fastcgi/','/websites/lemp-guides/centos-7/']
modified: 2021-12-29
modified_by:
    name: Linode
published: 2014-12-11
title: "Install a LEMP Stack on CentOS 7"
image: lemp-on-centos-7-title-graphic.jpg
---

## What is a LEMP Stack?

The LAMP stack (Linux, Apache, MariaDB, and PHP) is a popular server configuration for developing and hosting web applications. The four components of the stack are not tightly coupled, making it possible to substitute your preferred technologies. The LEMP stack is a common variant in which the Apache web server is replaced by NGINX.

## Before You Begin

1.  You need root access to the system or a user account with `sudo` privilege.
2.  Set your system's [hostname](/docs/guides/set-up-and-secure/#configure-a-custom-hostname).
3.  Update your system.

## Installation

### NGINX

{{< content "install-nginx-centos" >}}

### MariaDB

1.  Install the MariaDB server and MySQL/MariaDB-PHP support. You may be prompted to set a root password during installation.

        sudo yum install mariadb-server php-mysql

2.  Ensure MariaDB is running and enabled to start automatically on reboot:

        sudo systemctl start mariadb
        sudo systemctl enable mariadb

3.  Run the *[mysql_secure_installation](https://mariadb.com/kb/en/library/mysql_secure_installation/)* script:

        sudo mysql_secure_installation

     If you were not prompted to create a MySQL root user password when installing MariaDB, press enter when prompted for the root password:

        Enter current password for root (enter for none):

     Set a password when prompted:

        Set root password? [Y/n]

     Answer **Y** at the following prompts:

     -  Remove anonymous users?
     -  Disallow root login remotely?
     -  Remove test database and access to it?
     -  Reload privilege tables now?

4.  Log in to MariaDB's SQL shell. Enter the `root` user's password when prompted.

        mysql -u root -p

5.  Create a test database and user with access permission. Replace `testdb` and `testuser` with appropriate names for your setup. Replace `password` with a strong password.

    {{< highlight sql >}}
CREATE DATABASE testdb;
CREATE USER 'testuser' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON testdb.* TO 'testuser';
quit
{{< /highlight >}}

### PHP

1.  Install the PHP FastCGI Processing Manager, which will bring in the core PHP dependencies:

        sudo yum install php-fpm

2.  Ensure PHP-FPM is running and enabled to start automatically on reboots:

        sudo systemctl start php-fpm
        sudo systemctl enable php-fpm

3.  Tell PHP to only accept URIs for files that actually exist on the server. This mitigates a security vulnerability where the PHP interpreter can be tricked into allowing arbitrary code execution if the requested `.php` file is not present in the filesystem. See [this tutorial](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/?highlight=pitfalls#passing-uncontrolled-requests-to-php) for more information about this vulnerability.

        sudo sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/g' /etc/php.ini

4.  PHP is set to run under the `apache` user by default, but this user needs to match the user and group used by NGINX. If you installed NGINX from the NGINX repository as described above, NGINX will use the `nginx` user and group. Change the `user` and `group` variables in `www.conf` to match:

        sudo sed -i 's/user = apache/user = nginx/g' /etc/php-fpm.d/www.conf
        sudo sed -i 's/group = apache/group = nginx/g' /etc/php-fpm.d/www.conf

## Set an NGINX Site Configuration File

1. Create a root directory for your site. Replace *example.com* with your site's domain:

        sudo mkdir -p /var/www/example.com/

2.  Disable the default site configuration provided with the package as an example:

        sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled

3.  Website configuration files should be kept in `/etc/nginx/conf.d/`. Create a configuration file for your site. Again replace *example.com* with your site's domain.

    {{< file "/etc/nginx/conf.d/example.com.conf" nginx >}}
server {
    listen         80 default_server;
    listen         [::]:80 default_server;
    server_name    example.com www.example.com;
    root           /var/www/example.com;
    index          index.html;

    location / {
      try_files $uri $uri/ =404;
    }

    location ~* \.php$ {
      fastcgi_pass 127.0.0.1:9000;
      include         fastcgi_params;
      fastcgi_param   SCRIPT_FILENAME    $document_root$fastcgi_script_name;
      fastcgi_param   SCRIPT_NAME        $fastcgi_script_name;
    }
}
{{< /file >}}

    The `server` block above specifies the following configuration options:

    -  NGINX is listening on port 80 for incoming connections to *example.com* or *www.example.com*.

    -  The site is served out of `/var/www/example.com/` and its index page (`index.html`) is an `.html` file. If your index page will use PHP, substitute `index.php` for `index.html`.

    -  `try_files` tells NGINX to verify that a requested file or directory [actually exist](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files) in the site's root filesystem before further processing the request. If it does not, a `404` is returned.

    -  `location ~* \.php$` tells NGINX to apply this configuration to all .php files (file names are not case sensitive) in your site’s root directory, including any subdirectories containing PHP files.

    -  The `*` in the `~* \.php$` location directive indicates that PHP file names are not case sensitive. This can be removed if you prefer to enforce letter case.

    -  `fastcgi_pass` specifics the [IP address and port](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_pass) where PHP listens for incoming connections from other local processes.

    -  `include fastcgi_params` tells NGINX to process a list of `fastcgi_param` variables at `/etc/nginx/fastcgi_params`.

    -  The `fastcgi_param` directives contain the [location](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#variables) (relative to the site's root directory) and file [naming convention](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_index) of PHP scripts to be served when called by NGINX.

4.  To check the NGINX configuration file syntax by simply typing a command:

        sudo nginx -t

## Test the LEMP Stack

1.  Restart PHP and reload the NGINX configuration:

        sudo systemctl restart php-fpm
        sudo nginx -s reload

2.  Create a test page to verify NGINX can render PHP and connect to the MySQL database. Replace `testuser` and `password`  with the MySQL credentials you created above.

    {{< file "/var/www/example.com/test.php" php >}}
<html>
<head>
    <h2>LEMP Stack Test</h2>
</head>
    <body>
    <?php echo '<p>Hello,</p>';

    // Define PHP variables for the MySQL connection.
    $servername = "localhost";
    $username = "testuser";
    $password = "password";

    // Create a MySQL connection.
    $conn = mysqli_connect($servername, $username, $password);

    // Report if the connection fails or is successful.
    if (!$conn) {
        exit('<p>Your connection has failed.<p>' .  mysqli_connect_error());
    }
    echo '<p>You have connected successfully.</p>';
    ?>
</body>
</html>
{{< /file >}}

2.  Go to `http://example.com/test.php` in a web browser. It should report that *You have connected successfully*. If you see an error message or if the page does not load, re-check your configuration.

3.  Remove the test file once you have confirmed that the stack is working correctly:

        sudo rm /var/www/example.com/test.php

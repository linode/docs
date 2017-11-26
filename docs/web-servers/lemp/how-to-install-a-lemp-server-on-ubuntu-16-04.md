---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will teach you basic setup and configuration of Linux, Nginx, MySQL and PHP on Ubuntu 16.04'
keywords: ["nginx", "lemp", "php", "ubuntu 16.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/lemp/lemp-server-on-ubuntu-16-04/','websites/lemp/lemp-server-on-ubuntu-16-04/','web-servers/lemp/lemp-server-on-ubuntu-16-04/']
modified: 2016-05-06
modified_by:
  name: Phil Zona
published: 2016-05-06
title: 'How to Install a LEMP (Linux, Nginx, MySQL, PHP) Stack on Ubuntu 16.04'
external_resources:
 - '[Basic nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
 - '[Official Nginx Documentation](http://nginx.org/en/docs/#introduction)'
---

This guide describes an alternative to the *LAMP* (Linux, Apache, MySQL, and PHP) stack, known as *LEMP*. The LEMP stack replaces the Apache web server component with nginx (pronounced "engine x," providing the "E" in LEMP). Nginx can increase the ability of the server to scale in response to demand.

![LEMP Server on Ubuntu 16.04](/docs/assets/lemp-server-on-ubuntu-1604.png "LEMP Server on Ubuntu 16.04")

## Before You Begin

- Complete the [Getting Started](/docs/getting-started/) guide, specifically [setting your hostname](/docs/getting-started#setting-the-hostname).

- If you are new to Linux systems administration, you may want to consider the [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts) and the [Linux administration basics guide](/docs/using-linux/administration-basics).

- Update your system:

      sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups Guide](/docs/tools-reference/linux-users-and-groups).
{{< /note >}}

## Nginx

### Install the Nginx Web Server

To ensure compatibility of installation and with future updates, install nginx from the Ubuntu package repository using `apt`:

    sudo apt-get install nginx

### Configure Nginx Virtual Hosting

Older versions of nginx specified site directories and other information in the main `nginx.conf` file, but newer versions, such as the ones included with Ubuntu 16.04, are more compartmentalized. As you read through this section, make note of each file's contents and location so that you are familiar with the structure and know where to go if you need to customize one particular aspect of your web server.

Nginx uses `server` directives to specify name-based virtual hosts. Nginx calls these *server blocks*. All server blocks are contained within `server` directives in site files, located in `/etc/nginx/sites-available`. When activated, these are included in the main nginx configuration by default.

1.  Nginx includes a sample configuration that you may use as a template. To create a new file with a basic server block for configuration, enter the following command, replacing `example.com` with your domain:

        tail /etc/nginx/sites-available/default -n 13 | cut -c 2- | sudo tee /etc/nginx/sites-available/example.com 1> /dev/null

    The command above reads the example server block contained in the last 13 lines of the default site file, cuts out the `#` comment symbols, and outputs the result to a new site file.

    Alternatively, you may manually copy the last section from `/etc/nginx/sites-available/default` into a new file, `/etc/nginx/sites-available/example.com`. You will have to manually remove the `#` in front of the relevant lines.

2.  You should now have the following server block in the nginx virtual host configuration:

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
server {
    listen 80;
    listen [::]:80;

    server_name example.com;

    root   /var/www/example.com;
    index  index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

{{< /file >}}


    Replace `example.com` with your domain name. If your index page uses PHP, add `index.php` to the `index` line:

    {{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
index index.html index.php;

{{< /file-excerpt >}}


3.  The nginx example configuration uses `/var/www/` as a document root, but Ubuntu uses `/var/www/html` as a standard. Additionally, Linode guides encourage the standard practice of using a subdirectory called `public_html` to exclude web files that shouldn't be publicly accesible. Update the `root` directive to match these conventions:

    {{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
root   /var/www/html/example.com/public_html;

{{< /file-excerpt >}}


4.  Create the root directory referenced in this configuration, replacing `example.com` with your domain name:

        sudo mkdir -p /var/www/html/example.com/public_html

5.  Enable the site, disable the default host, and restart the web server:

        sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled
        sudo rm /etc/nginx/sites-enabled/default
        sudo systemctl restart nginx

    To deactivate a site, simply delete the symbolic link:

        sudo rm /etc/nginx/sites-enabled/example.com
        sudo systemctl restart nginx

    The source file is saved, and the site can be re-enabled at any time by recreating the symbolic link.

If you are using nginx to host more than one site, create multiple virtual host files using the method above.

You may also want to edit the `http` block in `/etc/nginx/nginx.conf`, which applies across all sites and allows the following options, among others:

-   Hiding HTTP header information using `server_tokens`
-   Configuring SSL/TLS settings
-   Customizing log file paths

## Deploy PHP with FastCGI

In order to deploy PHP applications, implement the following *PHP-FastCGI* solution to allow nginx to properly handle and serve pages that contain PHP code.

1.  Install the required dependencies:

        sudo apt-get install php7.0-cli php7.0-cgi php7.0-fpm

2.  Modify your virtual host configuration to include the location directive as shown below:

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
server {
        listen 80;
        listen [::]:80;

        server_name example.com;

        root /var/www/html/example.com/public_html;
        index index.html;

        location / {
                try_files $uri $uri/ =404;
        }
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                include fastcgi_params;
                fastcgi_pass unix:/run/php/php7.0-fpm.sock;
                fastcgi_param SCRIPT_FILENAME /var/www/html/example.com/public_html$fastcgi_script_name;
        }
}

{{< /file >}}


3.  Restart the `php7.0-fpm` and `nginx` services:

        sudo systemctl restart php7.0-fpm nginx

Congratulations! You can now deploy PHP scripts with your web server.

## Install the MySQL Database Server

The MySQL database engine is one of the leading open-source relational database engines and is a popular database solution for web-based applications.

1.  Install the MySQL server packages and required PHP support for MySQL:

        sudo apt-get install mysql-server php7.0-mysql

    During the installation process you will be prompted to set a password for the MySQL root user via an [ncurses](https://en.wikipedia.org/wiki/Ncurses) menu. Choose a strong password and keep it in a safe place for future reference.

2.  Log in to the MySQL command line interface (CLI) as the root user. When prompted, provide the password set in Step 1:

        mysql -u root -p

3.  Create a database and user with permissions for it. Replace `web` and `webuser` with appropriate names, and `password` with a strong password:

        CREATE DATABASE web;
        CREATE USER 'webuser' IDENTIFIED BY 'password';
        GRANT ALL PRIVILEGES ON web.* TO 'webuser';
        quit

    You can now provide the credentials for the `web` database and the `webuser` user to your application, which will now be able to use the database for its purposes. To ensure that PHP will be able to access the MySQL connector you just installed, restart the PHP service by issue the following command:

        sudo systemctl restart php7.0-fpm

{{< note >}}
If at any point you need to change the root password, log in as shown in Step 2 and enter the following command, replacing `password` with the new root password:

ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'password';
{{< /note >}}

## Optional: Test and Troubleshoot the LEMP Stack

In this section, you'll create a test page that shows whether nginx can render PHP and connect to the MySQL database. This can be helpful in locating the source of an error if one of the elements of your LEMP stack is not communicating with the others.

1.  Paste the following code into a new file, `phptest.php`, in the `public_html` directory. Modify `webuser` and `password` to match the information entered in the **Install the MySQL Database Server** section above:

    {{< file "/var/www/html/example.com/public_html/phptest.php" php >}}
<html>
<head>
    <title>PHP Test</title>
</head>
    <body>
    <?php echo '<p>Hello World</p>';

    // In the variables section below, replace user and password with your own MySQL credentials as created on your server
    $servername = "localhost";
    $username = "webuser";
    $password = "password";

    // Create MySQL connection
    $conn = mysqli_connect($servername, $username, $password);

    // Check connection - if it fails, output will include the error message
    if (!$conn) {
        exit('<p>Connection failed: <p>' . mysqli_connect_error());
    }
    echo '<p>Connected successfully</p>';
    ?>
</body>
</html>

{{< /file >}}


2.  Navigate to `example.com/phptest.php` from your local machine. If the components of your LEMP stack are working correctly, the browser will display a "Connected successfully" message. If not, the output will be an error message.

3.  Once you've verified that the stack is working, remove the test file:

        sudo rm -rf /var/www/html/example.com/public_html/phptest.php

### Troubleshooting

*   If the site does not load at all, check nginx's status and restart if required:

        systemctl status nginx
        sudo systemctl restart nginx

*   If the site loads, but the page it returns is the default nginx page, return to the [Configure Nginx Virtual Hosting](#configure-nginx-virtual-hosting) section above and check that the `root` directive matches your `example.com/public_html` folder.

*   If the page it returns displays "Index of /" or has a similar folder tree structure, create a test `index.html` file or a test file as shown above.

Congratulations! You now have a fully functional and fully featured LEMP stack for website and application deployment.

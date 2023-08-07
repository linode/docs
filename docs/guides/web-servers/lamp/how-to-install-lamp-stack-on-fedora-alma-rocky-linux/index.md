---
slug: how-to-install-lamp-stack-on-fedora-alma-rocky-linux
title: "How to Install LAMP Stack on Fedora, AlmaLinux, or Rocky Linux"
description: 'This guide explains how to install a LAMP stack on Fedora and the AlmaLinux and Rocky Linux variants.'
og_description: 'This guide explains how to install a LAMP stack on Fedora and the AlmaLinux and Rocky Linux variants.'
keywords: ['LAMP stack Fedora','test LAMP stack','Apache Fedora','MariaDB PHP Fedora']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-08-02
modified_by:
  name: Linode
external_resources:
- '[Apache HTTP server](https://httpd.apache.org/)'
- '[MariaDB](https://mariadb.com/)'
- '[PHP](https://www.php.net/)'
- '[PHP documentation](https://www.php.net/docs.php)'
- '[MySQL](https://dev.mysql.com/)'
- '[LAMP Stack](https://en.wikipedia.org/wiki/LAMP_(software_bundle))'
- '[Apache Virtual Host documentation](https://httpd.apache.org/docs/current/vhosts/)'
---

The most common web architecture for Linux-based systems is the [*LAMP Stack*](https://en.wikipedia.org/wiki/LAMP_(software_bundle)). This stack includes all necessary components for a web application, including an operating system, web server, relational database, and programming language. This guide explains how to install and test a LAMP stack on the Fedora Linux platform and the related AlmaLinux and Rocky Linux distributions.

## What is a LAMP Stack?

The LAMP stack is a core architecture for the open source Linux environment. LAMP is an acronym standing for [Apache](https://httpd.apache.org/), [MySQL](https://dev.mysql.com/) or [MariaDB](https://mariadb.com/), and [PHP](https://www.php.net/). This software stack is sufficient to support most modern web sites and applications, including WordPress.

The main LAMP stack components are as follows. These applications are available in the core Fedora software library.

- **Linux**: Linux is a free open source UNIX-based operating system based on UNIX. It is available in several distinct implementations. This guide uses Fedora, one of the most popular distributions. The same instructions in this guide are also applicable to the similar AlmaLinux and Rocky Linux platforms. Both of these alternatives are binary-compatible with Fedora. Each distribution of Linux has its own software library which includes the other LAMP stack components.
- **Apache HTTP Server**: The open source Apache web server is the most common Linux web server. The Apache Software Foundation produces the free standard edition, containing all components required to host a web site. However, extra modules enable additional features such as authentication and programming language APIs.
- **MariaDB/MySQL**: MySQL and MariaDB are free open source *relational database management systems* (RDBMS). They can be used interchangeably in the LAMP Stack. MariaDB is a fork of the original MySQL code with additional features, higher scalability and faster query speed.
- **PHP**: PHP is the main server-side scripting and programming language for the LAMP stack. PHP commands can be efficiently embedded within a HTML page, so it is a very useful language for web development. It also powers many common open source web applications. PHP is available for free under the PHP License. Alternatives to PHP include Perl and Python. See the [PHP documentation](https://www.php.net/docs.php) for usage instructions.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install a LAMP Stack on Fedora

These instructions are designed for Fedora release 38, but are very similar for AlmaLinux and Rocky Linux. The guide provides additional instructions whenever the process differs between distributions.

To install a LAMP stack on Fedora, follow these steps.

### How to Install the Apache Web Server

1.  Ensure the system is updated.

    ```command
    sudo dnf upgrade
    sudo dnf update
    ```

1.  Install the Apache web server.

    ```command
    sudo dnf install httpd -y
    ```

1.  Start and enable the web server. The `enable` command automatically launches Apache when the system reboots.

    ```command
    sudo systemctl enable httpd
    sudo systemctl start httpd
    ```

1.  Use `systemctl` to ensure the web server is running.

    ```command
    systemctl status httpd
    ```

    ```output
    httpd.service - The Apache HTTP Server
    Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; preset: disabled)
    ...
    Active: active (running) since Wed 2023-08-02 13:14:44 UTC; 8min ago
    ```

1.  Configure the firewall settings to allow HTTP and HTTPS connections.

    ```command
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    ```

1.  Reload the firewall.

    ```command
    sudo firewall-cmd --reload
    ```

    ```output
    success
    ```

1.  Use a web browser to navigate to the IP address of the Fedora system. It should display the default "Fedora Webserver Test Page". This indicates the web server is working but has not been fully configured yet. The AlmaLinux and Rocky Linux distributions have their own web server test pages which are similar but slightly different.

    {{< note >}}
    If the connection is blocked, it could be due to the default *Security-Enhanced Linux* (SELinux) settings. SELinux is a kernel security module packaged with several Linux distributions. The default security setting is the fairly-restrictive `enforcing` mode. To reduce the security level, change the mode to `permissive` using the following command.

    ```command
    sudo setenforce 0
    sudo sed -i 's/^SELINUX=.*/SELINUX=permissive/g' /etc/selinux/config
    ```
    {{< /note >}}

    ![The default Fedora web landing page](Fedora-default-web-page.png)

1.  **Optional** If a web domain is pointed at the server, the domain name can be added to the `/etc/httpd/conf/httpd.conf` file for better performance. Edit this file and add the following information. Replace `example.com` with the fully-qualified domain name.

    ```command
    sudo vi /etc/httpd/conf/httpd.conf
    ```

    ```file {title="/etc/httpd/conf/httpd.conf"}
    ServerAdmin admin@example.com
    ServerName  example.com:80
    ```

    Restart the web server and use a web browser to navigate to the domain name. The browser should display the default Fedora web server page.

    ```command
    sudo systemctl restart httpd
    ```

### How to Install the MariaDB Database

This guide installs MariaDB as the database, but the LAMP stack can also use MySQL. MariaDB is an increasingly-popular fork of the original MySQL application with some performance advantages.

{{< note >}}
To install MySQL instead of MariaDB, use the command `sudo dnf install mysql-server`, then follow the other instructions. To run the `mysql_secure_installation` script in MySQL, add a new password for the root account.
{{< /note >}}

1.  Install the MariaDB server.

    ```command
    sudo dnf install mariadb-server -y
    ```

1.  Enable and start MariaDB.

    ```command
    sudo systemctl enable mariadb
    sudo systemctl start mariadb
    ```

1.  Verify the status of MariaDB. Run the `systemctl status` command and confirm it is `active`.

    ```command
    sudo systemctl status mariadb
    ```

    ```output
    mariadb.service - MariaDB 10.5 database server
    Loaded: loaded (/usr/lib/systemd/system/mariadb.service; enabled; preset: disabled)
    Active: active (running) since Thu 2023-08-03 11:39:51 UTC; 52s ago
    ```

1.  To secure the database, use the interactive `mysql_secure_installation` utility. Provide the following responses to the questions in the script.

    - For `Enter current password for root`, press the **Enter** key. Because the command is run using `sudo` privileges, a password is not required.
    - For `Switch to unit_socket authentication`, answer `n`.
    - For `Change the root password?`, answer `n`. It is safe to permit local `sudo` access with the standard `root` password.
    - For `Remove anonymous users?`, answer `y`.
    - For `Disallow root login remotely?`, answer `y`.
    - For `Remove test database and access to it?`, answer `y`.
    - For `Reload privilege tables now?`, answer `y` to apply the changes.

    ```command
    sudo mysql_secure_installation
    ```

1.  Access the database using `sudo`.

    ```command
    sudo mysql
    ```

    MariaDB displays background information about the application along with the `>` prompt.

    ```output
    Welcome to the MariaDB monitor.  Commands end with ; or \g.
    Your MariaDB connection id is 15
    Server version: 10.5.21-MariaDB MariaDB Server
    Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.
    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    MariaDB [(none)]>
    ```

1.  Create the `webdata` database and a `webuser` account for web application access. In the `CREATE USER` query, provide a secure password in place of `password`. It is also a good idea to rename the `webuser` account to a more meaningful name. Grant full rights to the user. MySQL should respond with `Query OK` after each line.

    ```command
    CREATE DATABASE webdata;
    CREATE USER 'webuser' IDENTIFIED BY 'password';
    GRANT ALL ON webdata.* TO 'webuser';
    FLUSH PRIVILEGES;
    ```

1.  Exit the SQL shell.

    ```command
    quit
    ```

### How to Install PHP

1.  Install the main PHP component, including the `php-mysqlnd` package for database integration.

    ```command
    sudo dnf install php php-common php-mysqlnd -y
    ```

1.  **Optional** Install a selection of other commonly-used PHP extensions. Different applications might require additional PHP packages. Consult the application documentation for details.

    ```command
    sudo dnf install php-cli php-gettext php-mbstring php-mcrypt php-pear php-curl php-gd php-xml php-bcmath php-zip php-json -y
    ```

    {{< note >}}
    AlmaLinux and Rocky Linux do not support the `php-mcrypt` component. Remove this package from the command on those platforms.
    {{< /note >}}

1.  Verify the PHP release to confirm a successful installation.

    ```command
    php -v
    ```

    On Fedora, the current PHP release is `8.2.8`. AlmaLinux and Rocky Linux currently install release `8.0.27`.

    {{< note >}}
    To determine if a more recent release of PHP is available, use the command `dnf module list php`. To select a non-default release, use the command `dnf module enable php:<release_num>`. Substitute the desired release number for `<release_num>`.
    {{< /note >}}

    ```output
    PHP 8.2.8 (cli) (built: Jul  4 2023 14:52:54) (NTS gcc x86_64)
    Copyright (c) The PHP Group
    ```

1.  Restart Apache to activate the PHP Apache API.

    ```command
    sudo systemctl restart httpd
    ```

## How to Verify the LAMP Stack Installation

To verify the stack components, embed a PHP code block containing a database connection inside an HTML page. PHP code can be integrated into an HTML file using the `<?php` tag. The PHP code block can then connect to an SQL-based database using the `mysqli_connect` command. Provide the appropriate database credentials to connect.

To fully test all components of the LAMP stack, follow these steps.

1.  Change to the `var/www/html` directory and create a new `phptest.php` file.

    ```command
    cd /var/www/html
    sudo vi phptest.php
    ```

1.  Add the following contents to the file. Ensure the `servername` variable is set to `localhost`. Replace `username` and `password` with the credentials for the database web user account. After making all changes, save the file.

    ```file {title="/var/www/html/phptest.php" lang="php"}
    <html>
        <head>
            <title>PHP Test</title>
        </head>
        <body>
            <?php echo '<p>Welcome to the Site!</p>';

            // When running this script on a local database, the servername must be 'localhost'. Use the name and password of the web user account created earlier. Do not use the root password.
            $servername = "localhost";
            $username = "webuser";
            $password = "password";

            // Create MySQL connection
            $conn = mysqli_connect($servername, $username, $password);

            // If the conn variable is empty, the connection has failed. The output for the failure case includes the error message
            if (!$conn) {
                die('<p>Connection failed: </p>' . mysqli_connect_error());
            }
            echo '<p>Connected successfully</p>';
            ?>
        </body>
    </html>
    ```

1.  Run the LAMP stack script test. In the address bar of a web browser, enter either the IP address or the domain name followed by `phptest.php`. In the following example, substitute the actual name of the domain for `example.com`.

        http://example.com/phptest.php

1.  If the test is successful, the browser displays the `connected successfully` message.

    {{< note >}}
    If the page displays the `Connection failed` message, verify the database credentials and try again. If an HTML error occurs, ensure the contents of the sample file are complete and correct. To isolate the PHP functionality, replace the contents between `<?php` and `?>`, with `phpinfo();`. This command displays information about the PHP installation and confirms PHP is working.
    {{< /note >}}

    ![Results of the PHP test](PHP-Test.png)

## Additional LAMP Stack Production Considerations

The previous instructions are sufficient for small personal sites. However, commercial sites might require additional configuration. Here are some other issues to potentially consider.

1.  The database is not currently accessible remotely. To access MariaDB through the firewall, use the following commands.

    ```command
    sudo firewall-cmd --add-service=mysql  --permanent
    sudo firewall-cmd --reload
    ```

1.  To run multiple sites from the same server, configure a virtual host for each site. This is considered a more professional configuration even for a single site.

    To configure a virtual host, add a new directory at `/var/www/html/example.com/public_html`. Replace `example.com` with the actual domain name. Add the website files to this directory. Then edit the file at `/etc/httpd/conf/httpd.conf` to add the virtual hosts. Each virtual host must define a `DocumentRoot`, `ServerName`, and `ServerAdmin`.

    Consult the [Apache Virtual Host documentation](https://httpd.apache.org/docs/current/vhosts/) for more information.

1.  To remove the default welcome page, edit the file `/etc/httpd/conf.d/welcome.conf` and comment out all directives using the `#` symbol.

## Conclusion

The Fedora LAMP stack consists of the Linux operating system, Apache web server, the MariaDB/MySQL database, and the PHP programming language. Together, this architecture is suitable for most modern computing environments. All LAMP components are available in the standard Fedora package library and are installed using `dnf`. To test the stack, configure a database for the web user and create a simple script using HTML and PHP.
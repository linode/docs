---
slug: how-to-create-a-lamp-stack-application
title: "How to Create a LAMP Stack on Linux"
title_meta: "How to Create a LAMP Stack Application"
description: 'Learn how to create a LAMP stack application on Linux. Read our guide to learn LAMP stack basics. '
keywords: ['LAMP Stack Application', 'How to create a LAMP stack application', 'LAMP stack', 'LAMP stack on Linux']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Cameron Laird"]
published: 2023-04-05
modified_by:
  name: Linode
external_resources:
- '[LAMP stack](/docs/guides/web-servers/lamp/)'
- '[Model-View-Controller](https://www.guru99.com/mvc-tutorial.html)'
---

[LAMP stack](/docs/guides/web-servers/lamp/) refers to a development framework for Web and mobile applications based on four open-source components:

- [Linux](https://www.linode.com/distributions/) operating system
- [Apache](/docs/guides/web-servers/apache/) Web server
- [MySQL](/docs/guides/databases/mysql/) relational database management system (RDBMS)
- [PHP](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-18-04/), [Perl](/docs/guides/development/perl/), or [Python](/docs/guides/development/python/) programming language

LAMP played a key role in Web work for 20+ years and influenced Facebook, Slack, Wikipedia, and WordPress. It's widely supported by hosting providers. Tens of millions of new LAMP-based sites come online each year. Abundant documentation and rich communities of practitioners make LAMP a default choice for development still.

## How Does LAMP Differ From LEMP?

LAMP collects open-source tools that collectively supply the essentials for a Web application.

It has an underlying Linux OS for hosting, an Apache Web server for presenting a site's user interface and receiving end-user actions, MySQL for storing user information, and app-specific content, and a programming language for defining the app's logic.

### Apache vs. NGINX

LAMP isn't the only open-source Web stack solution. There are alternatives such as [LEMP](/docs/guides/web-servers/lemp/), that replace Apache with [NGINX](/docs/guides/web-servers/nginx/) (pronounced "engine X"). [NGINX is faster than Apache](https://hackr.io/blog/nginx-vs-apache) and newer, but requires more advanced configuration, and is less robust on Windows than Apache.

### RDBMS and Programming Language

Two other variations of LAMP use alternative software for "M" and "P". [MariaDB](/docs/guides/databases/mariadb/) is a drop-in [replacement for MySQL](https://www.guru99.com/mariadb-vs-mysql.html). thought there are differences between the two that are explained in this Guide. In general, everything you do with MySQL applies immediately to MariaDB as well. Several different programming languages work well in a LAMP stack, and while this guide discusses PHP, nearly all the principles of LAMP illustrated below apply equally to the Python programming language and others.

### LAMP Benefits

LAMP is well known, consistent, and reliable. Hundreds of millions of working Web applications depend on LAMP.

LAMP's suitability extends beyond purely technical specifications. For example, one of the advantages of Apache over NGINX is that Apache better supports Windows. Windows is not open-source, and Apache's commercial use on Windows is infrequent. Despite these facts, an organization might favor an open-source solution with the flexibility to support a wide range of operating systems, such as Windows. Portability and licensing considerations make Apache a good solution for many different environments.

## Install the LAMP Stack

Everything that follows assumes the availability of a Linux host, familiarity with command-line work in the Linux filesystem, and permission to run as `root`, or with `sudo` privileges. The installation in this guide focuses purely on the "AMP" layers of LAMP. For a more depth look at installing LAMP, explore [our section of LAMP guides](/docs/guides/web-servers/lamp/).

### Install "A", "M", and "P" Within "L"

Different distributions of Linux require subtly different LAMP installations. The sequence below works across a range of Ubuntu versions and is a good model for other Linuxes based on Debian.

1. After logging into Linux, initialize your host package configuration with the following command:

    ```command
      sudo apt-get update -y
    ```

1. Install the individual LAMP stack components using the following command:

    ```command
    sudo apt-get -y install apache2 php-mysql libapache2-mod-php mysql-server
    ```

    The installation may prompt you for information such as the host's geographic location and timezone.

### Start Services

Start the Apache and MySQL services using the following commands:

```command
sudo service apache2 start
sudo service mysql start
```

### Verify Apache

Confirm that Apache is running with the following steps:

1. You need to [identify the IP address](/docs/guides/find-your-linodes-ip-address/) of the host and enter it in your web browser as a URL, such as `http://localhost` or `http://192.0.2.1` or a similar address.

1. After visiting this URL, your web browser should display the default Apache2 page with the message "It works!" indicating that Apache is running correctly.

1. Confirm that Apache can communicate with PHP by creating a `php-test.php` file at `/var/www/html/` with the contents as follows:

    ```file {title="/var/www/html/php-test.php" lang="php"}
    <?php
    phpinfo();
    ?>
    ```

1. If you now navigate to `php-tedt.php`'s URL, such as `http://localhost/php-test.php` or `http://192.0.2.1/php-test.php`, you can view several pages of diagnostic output as shown below.

    ```output
    PHP Version 8.1.2

    System: Linux NNNNNNNNN 5.10.76-linuxkit #1 SMP Mon Nov 8 ...
    ...

    Configuration:
    Directive                      Local Value      Master Value
    ...
    max_execution_time             30               30
    memory_limit                   128M             128M
    ...

    Loaded Modules:
    Module Name                    Status
    ...
    openssl                        enabled
    mysqli                         enabled
    ...
    ```

    {{< note >}}
    The location of `/var/www/html/php-test.php` is configurable. This means that a particular distribution of Linux and Apache *might* designate a different directory for your program's files. The `/var/www/html` location is quite common, though, especially for a standard Ubuntu installation.
    {{< /note >}}


### Verify MySQL

To verify the MySQL installationL, follow the steps below:

1. On a command-line interface or terminal on your Linux system, enter the following command to start the MySQL monitor:

    ```command
    mysql
    ```

1. If the installation was successful, you should see a welcome message indicating that you have entered the MySQL monitor:

    ```command
    Welcome to the MySQL monitor ...
    ```

    This confirms that MySQL is running and you can access the MySQL command-line interface.

1. To safely exit the MySQL monitor and return to the Linux command line, enter the following command:

     ```command
    \q
    ```

Your LAMP stack is now successfully installed, activated, and ready for application development. In a basic LAMP installation, "application development" typically involves placing your programming source code in the `/var/www/html` directory, and occasionally updating the configurations of the different layers of the LAMP stack as needed.

{{< note >}}
The `/var/www/html` directory is the default document root directory for Apache, where web files are served from.
{{< /note >}}

## Use the LAMP Stack to Create an Example Application

With LAMP in place, you can create a minimal model application that exercises each component and the typical interactions between them. This application collects a record of each Web request made to the server in its backend database for further processing. A more refined version of this application might, for instance, collect sightings of a rare bird at different locations, traffic at voting stations, requests for customer support, or tracking data for a company automobile.

The configuration and source below apply to most LAMP environments. Even if your LAMP stack used different commands during installation because of a different distribution of Linux, or you purchased LAMP-as-a-service from a cloud vendor, or you're running Linux within WSL2, Docker, or Raspberry PI, the directions that follow apply with a minimum of customization, and disruption.


### Prepare a Database to Receive Data

To begin developing an application that uses a MySQL database to store data, you need to configure the database to be ready to receive the data. To do this:

1. Re-enter the MySQL monitor with the `mysql` command

1. Create a new database in a MySQL database management system using the create command. This database will be called `model_application`:

    ```command
    CREATE DATABASE model_application;
    ```

1. Switch to the `model_application` database using the following command:

    ```command
    USE model_application;
    ```

1. Define a table for the program data as follows. In this case, the table `events` houses two types of information, a timestamp and the client's IP address:

    ```command
    CREATE TABLE events (
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      client_ip INT(4) UNSIGNED NOT NULL
    );
    ```

1. Create a new user, `automation`, in a MySQL database and grant them privileges on the `model_application` database using the following commands:

    ```command
    CREATE USER 'automation'@'localhost' IDENTIFIED BY 'abc123';
    GRANT ALL PRIVILEGES ON model_application.* TO 'automation'@'localhost' WITH GRANT OPTION;
    ```

A fully developed and production-ready application would typically implement tighter security privileges for enhanced security, and would not use `abc123` as the password.

### Create Application Source Code

Create an `event.php` file in the `/var/www/html/` directory with the following content:

```file {title="/var/www/html/event.php" lang="php"}
<?php
$connection = new mysqli("127.0.0.1", "automation", "abc123", "model_application");
$client_ip = $_SERVER['REMOTE_ADDR'];
// INET_ATON() packs an IPv4 string representation into
// four octets in a standard way.
$query = "INSERT INTO events(client_ip)
VALUES(INET_ATON('$client_ip'))";
$connection->query($query);
echo 'Your request has successfully created one database record.';
?>
```

### Verify the Operation of the Application

The `event.php` file is the only program source code for our minimal model application. With that in place, navigate to that file in your browser. For instance, if your host has the IP `192.0.2.1`, you'd navigate to `http://192.0.2.1t/event.php` address in the URL of your browser. You see the message "Your request has successfully created one database record".

### View Collected Data

The model application exhibits the behavior you expect from a Web application and your browser reports success. To confirm your page visit updated the database, follow the steps below:

1. Re-enter the MySQL monitor using the `mysql` command.

1. Issue the following query:

    ```command
    select timestamp, inet_ntoa(client_ip) from events;
    ```

1. You see a display such as:

    ```output
    +---------------------+----------------------+
   | timestamp           | inet_ntoa(client_ip) |
   +---------------------+----------------------+
   | 2022-08-03 02:26:44 | 127.0.0.1            |
   | 2022-08-03 02:27:18 | 98.200.8.79          |
   | 2022-08-05 02:27:23 | 127.0.0.1            |
   +---------------------+----------------------+
    ```

This demonstrates the flow of data from a Web browser all the way to the database server. Each row in the `events` table reflects one request from one Web browser to connect to the application. As the application goes into practical use, hundreds or thousands or millions of rows accumulate in the table.

## Application Context

LAMP is a reliable basis for Web development, with decades of successful deliveries over a range of requirements. It directly supports only [server-side processing](https://www.indeed.com/career-advice/career-development/client-side-vs-server-side). The model application above delivers pure HTML to the browser. LAMP is equally capable of serving CSS and [JavaScript](/docs/guides/languages/javascript/) but does not build in tooling for these client-side technologies. Projects reliant on elaborate modern user interface effects, usually choose a framework such as [React](/docs/guides/development/react/).

Server-side processing remains a common approach for many applications, and LAMP handles these types of applications well. Server-side computation typically involves several functions beyond the model application above, including account management, forms processing, security restrictions, analytic, and cost reporting, more robust exception handling, and quality assurance instrumentation. Contemporary applications often build an MVC [model-view-controller](https://www.guru99.com/mvc-tutorial.html) architecture, and/or define a REST [representational state transfer](https://restfulapi.net/) perspective. A commercial-grade installation usually migrates the database server to a separate host, and high-volume applications often introduce load balancers, security-oriented proxies, content delivery network (CDN) service, and other refinements. These functions are layers over the basic data flow between the user, browser, business logic processing, and datastore that the model application embodies.

## Conclusion

You just installed a working LAMP stack, activated it, and created a model application. All the needs of a specific Web application can be realized from these exercises.


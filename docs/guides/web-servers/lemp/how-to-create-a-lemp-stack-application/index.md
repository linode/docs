---
slug: how-to-create-a-lemp-stack-application
description: 'Learn how to create a LEMP stack application on Linux. Read our guide to learn LEMP stack basics. ✓ Click here!'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-27
modified_by:
  name: Linode
title: "Create a LEMP Stack Application"
title_meta: "How to Create a LEMP Stack on Linux"
authors: ["Cameron Laird"]
---

[LEMP stack](/docs/guides/web-servers/lemp/) refers to a development framework for Web and mobile applications based on four open source components:
1.  [Linux](https://www.linode.com/distributions/) operating system
2.  [NGINX](/docs/guides/web-servers/nginx/) Web server
3.  [MySQL](/docs/guides/databases/mysql/) relational database management system (RDBMS)
4.  [PHP](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-18-04/), [Perl](/docs/guides/development/perl/), or [Python](/docs/guides/development/python/) programming language

NGINX contributes to the acronym "LEMP" because English-speakers pronounce NGINX as "engine-x", hence an "E".

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How Does LEMP Differ from LAMP?

[LAMP](/docs/guides/web-servers/lamp/) is just like LEMP, except with Apache in place of NGINX.

LAMP played a crucial role in the Web for [over twenty years](https://www.marpis.net/lamp-history.php). NGINX was released publicly in 2004, largely to address faults in LAMP. LEMP use spread widely after 2008, and NGINX is now the second [most popular Web server](https://kinsta.com/knowledgebase/what-is-nginx/), after the [Apache Web server](/docs/guides/web-servers/apache/) that LAMP uses.

Both LEMP and LAMP combine open source tools to supply the essentials for a Web application. This includes an underlying Linux operating system which hosts everything else, including:
-   The NGINX or Apache Web server that receives and responds to end-user actions.
-   The MySQL RDBMS which stores information including user profile, event histories, and application-specific content which has a lifespan beyond an individual transaction.
-   A programming language for business logic that defines a particular application.

Abundant documentation and rich communities of practitioners make both LEMP and LAMP natural choices for development. The difference between them is confined to the Web server part of the stack.

### Apache Versus NGINX

In broad terms, the two Web servers have much in common. [NGINX is faster than Apache](https://hackr.io/blog/nginx-vs-apache), but requires more expertise in certain aspects of its configuration and use, and is less robust on Windows than Apache. Apache works usefully "out of the box", while, as we see below, NGINX demands a couple of additional steps before its installation is truly usable.

### RDBMS and Programming Language

Two other variations deserve clarity in regard to the initials "M" and "P". [MariaDB](/docs/guides/databases/mariadb/) is a drop-in replacement for MySQL. The differences between the two are explained in [this tutorial](https://www.guru99.com/mariadb-vs-mysql.html). Everything you do with MySQL applies immediately with MariaDB as well.

While several different programming languages work well in a LEMP stack, this guide focuses on PHP. However, nearly all the principles of LEMP illustrated below apply with Python or another alternative.

### LEMP Benefits

LEMP has a deep track record of successful deliveries. Hundreds of millions of working Web applications depend on it.

LEMP's suitability extends beyond purely technical dimensions. Its flexible open-source licensing enables development teams to focus on their programming and operations, with few legal constraints to complicate their engineering.

## Install the LEMP Stack

Linode's support for LEMP begins with abundant documentation, including [How to Install the LEMP Stack on Ubuntu 18.04](/docs/guides/how-to-install-the-lemp-stack-on-ubuntu-18-04/).

Rich collections of documentation are available to readers [new to Linux](https://opensource.com/article/19/7/ways-get-started-linux) and its command line. This guide assumes familiarity with the command line and Linux filesystems, along with permission to run as root or with sudo privileges. With the "L" (Linux) in place, the installation in this Guide focuses purely on the "EMP" layers of LEMP.

### Install "E", "M", and "P" Within "L"

Different distributions of Linux require subtly different LEMP installations. The sequence below works across a range of Ubuntu versions, and is a good model for other Debian-based distributions.

1.  Update your host package index with:

        sudo apt-get update -y

2.  Now upgrade your installed packages:

        sudo apt-get upgrade -y

3.  Install `software-properties-common` and `apt-transport-https`to manage the PHP PPA repository:

        sudo apt-get install software-properties-common apt-transport-https -y

4.  Now provide a reference to the current PHP repository:

        sudo add-apt-repository ppa:ondrej/php -y

5.  Update the package index again:

        sudo apt update -y

6.  Install the rest of the LEMP stack:

        sudo apt-get install nginx php-mysql mysql-server php8.1-fpm -y

The installation demands a small amount of interaction to give information about geographic location and timezone. Depending on circumstances, you may need to verify the country and timezone your server is located in.

### Start Services

1.  Start the "E" (NGINX), "M" (MySQL), and "P" (PHP) services:

        sudo service nginx start
        sudo service mysql start
        sudo service php8.1-fpm start

2.  Check on these services:

        sudo service --status-all

    You should see them all running::

    {{< output >}}
[ + ]  mysql
[ + ]  nginx
[ + ]  php8.1-fpm
{{< /output >}}

### Verify PHP

Verify the healthy operation of these services.

1.  For PHP, launch:

        php -version

    You should see:

    {{< output >}}
PHP 8.1.x (cli) (built: ...
Copyright © The PHP Group ...
{{< /output >}}

2.  Go one step further with verification of the PHP configuration through the command:

        php -m

    The result you see is:

    {{< output >}}
[PHP Modules]
calendar
Core
...
mysqli
mysqlnd
...
{{< /output >}}

This demonstrates that PHP is installed and that the modules needed to communicate with the rest of the LEMP stack are in place.

### Verify NGINX

Verification of NGINX service is a little more involved. The first step is [identification of the IP address](/docs/guides/find-your-linodes-ip-address/) of the host.

1.  Navigate a browser to a URL such as `http://localhost` or `http://23.77.NNN.NNN`, henceforth referred to as `$LEMP_HOST`

    Your Web browser shows a default display of:

    {{< output >}}
Welcome to nginx!
If you see this page, the nginx web server is successfully installed and working.  ...
{{< /output >}}

2.  With the default NGINX configuration verified, update it to enable PHP. Edit the file located at `/etc/nginx/sites-enable/default` and change this section:

    {{< file "/etc/nginx/sites-enabled/default" nginx >}}
location / {
        # First attempt to serve request as file, then
        # as directory, then fall back to displaying a 404.
        try_files $uri $uri/ =404;
}
{{< /file >}}

    To become:

    {{< file "/etc/nginx/sites-enabled/default" nginx >}}
location / {
       # First attempt to serve request as file, then
       # as directory, then fall back to displaying a 404.
       try_files $uri $uri/ =404;
}
location ~ \.php {
       include snippets/fastcgi-php.conf;
       fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
}
{{< /file >}}

3.  Back at the Linux command line, activate this new configuration with:

        service nginx restart

4.  Next, ensure that NGINX communicates with PHP by creating the file `/var/www/html/php-test.php` with contents:

    {{< file "/var/www/html/php-test.php" php >}}
<?php
phpinfo();
?>
{{< /file >}}

5.  Now direct your browser to `http://$LEMP_HOST/php-test.php`.

    Your browser shows several pages of diagnostic output, starting with:

    {{< output >}}
PHP Version 8.1.9
   System Linux ... 5.10.76-linuxkit #1 SMP Mon Nov 8 ...
   ...
{{< /output >}}

The location of `/var/www/html/php-test.php` is configurable. This means that a particular distribution of Linux and NGINX might designate a different directory. `/var/www/html` is common, especially for a new Ubuntu instance with NGINX "out of the box". In practice, it's common to modify the NGINX default a great deal. You can allow for tasks such as caching, special handling for static requests, virtual hosts, and logging security.

### Verify MySQL

When you install MySQL according to the directions above, it doesn't depend on authentication.

1.  No password is required. You only need one command:

        mysql

    And you see:

    {{< output >}}
Welcome to the MySQL monitor ...
{{< /output >}}

2.  You can leave the MySQL monitor and return to the Linux command line with:

        \q

Your LEMP stack is now installed, activated, and ready for application development. For a basic LEMP installation, this consists of placing programming source code in the `/var/www/html` directory, and occasionally updating the configurations of the LEMP layers.

## Use the LEMP Stack to Create an Example Application

You can create a minimal model application that exercises each component and typical interactions between them. This application collects a record of each Web request made to the server in its backend database. A more refined version of this application could be used to collect:
-   Sightings of a rare bird at different locations.
-   Traffic at voting stations.
-   Requests for customer support.
-   Tracking data for a company automobile.

The configuration and source below apply to LEMP environments. Even if your LEMP stack used different commands during installation, the directions that follow apply with a minimum amount of customization or disruption.

### Prepare a Database to Receive Data

Start application development by configuring the database to receive program data.

1.  Re-enter the MySQL monitor with:

        mysql

2.  While connected to MySQL, create a database instance specific to this development:

        CREATE DATABASE model_application;

3.  Enter that database with:

        USE model_application;

4.  Define a table for the program data:

        CREATE TABLE events (
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            client_ip INT(4) UNSIGNED NOT NULL
        );

5.  Create a database account:

        CREATE USER 'automation'@'localhost' IDENTIFIED BY 'abc123';

6.  Now allow PHP to access it:

        GRANT ALL PRIVILEGES ON model_application.* TO 'automation'@'localhost' WITH GRANT OPTION;

7.  Quit MySQL:

        \q

A polished application uses tighter security privileges, but this sample application adopts simple choices to maintain focus on the teamwork between the different LEMP layers.

### Create Application Source Code

Create `/var/www/html/event.php` with the following content:

{{< file "/var/www/html/event.php" php >}}
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
{{< /file >}}

### Verify Operation of the Application

1.  `event.php` is the only program source code for our minimal model application. With it in place, instruct your browser to visit `http://$LEMP_HOST/event.php`.

    You should see:

    {{< output >}}
Your request has successfully created one database record.
{{< /output >}}

2.  You can also exercise the application from different remote browser connections. With a different browser, perhaps from a different desktop, again navigate to `http://$LEMP_SERVER/event.php`.

### View Collected Data

The model application exhibits the expected behavior from a Web application and your browser reports success. Viewed through the Web browser, the application does the right thing.

1.  To confirm it updated the database, re-enter the MySQL monitor:

        mysql

2.  Enter the example application database:

        USE model_application;

3.  Pose the query:

        select timestamp, inet_ntoa(client_ip) from events;

    You should see output such as:

    {{< output >}}
+---------------------+----------------------+
| timestamp           | inet_ntoa(client_ip) |
+---------------------+----------------------+
| 2022-08-03 02:26:44 | 127.0.0.1            |
| 2022-08-03 02:27:18 | 98.200.8.79          |
| 2022-08-05 02:27:23 | 107.77.220.62        |
+---------------------+----------------------+
{{< /output >}}

This demonstrates the flow of data from a Web browser to the database server. Each row in the `events` table reflects one request from a Web browser to connect to the application. As the application goes into practical use, rows accumulate in the table.

## Application Context

LEMP is a trustworthy basis for Web development, with decades of successful deliveries over a range of requirements. It directly supports only [server-side processing](https://www.indeed.com/career-advice/career-development/client-side-vs-server-side). The model application above delivers pure HTML to the browser. However, LEMP is equally capable of serving up CSS and [JavaScript](/docs/guides/languages/javascript/), but does not build in tooling for these client-side technologies. Projects reliant on elaborate user interface effects usually choose a framework focused on the client side. [React](/docs/guides/development/react/) is an example of such a framework.

Server-side orientation remains adequate for many applications, and LEMP fits these well. Server-side computation typically involves several functions beyond the model application above, including:
-   Account Management
-   Forms Processing
-   Security Restrictions
-   Analytic and Cost Reporting
-   Exception Handling
-   Quality Assurance Instrumentation

Contemporary applications often build in a [model-view-controller](https://www.guru99.com/mvc-tutorial.html) (MVC) architecture, and/or define a [representational state transfer](https://restfulapi.net/) (REST) perspective. A commercial-grade installation usually migrates the database server to a separate dedicated host. Additionally, high-volume applications often introduce load balancers, security-oriented proxies, [content delivery network](https://www.digitaljournal.com/pr/content-delivery-network-cdn-services-market-past-research-deep-analysis-and-present-data-with-amazon-web-services-inc-akamai-technologies-inc-google-llc) (CDN) services, and other refinements. These functions are layers over the basic data flow between user, browser, business logic processing, and datastore that the model application embodies. The model application is a good first example.

## Conclusion

You just installed a working LEMP stack, activated it, and created a model application. All the needs of a specific Web application have a place in this same model.
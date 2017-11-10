---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Deploying a standalone MySQL database server on a separate Linode for increased application performance.'
keywords: ["mysql", "standalone myql", "separate mysql", "wordpress"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2011-04-29
modified_by:
  name: Linode
published: 2009-09-30
expiryDate: 2013-04-29
title: Standalone MySQL Server
---

In some kinds of deployments, particularly where rich dynamic applications rely on a large database, separating the database server from the application server can permit your application to scale and accommodate a much larger user base. Designating a separate server to be used solely by MySQL will allow the application's web server to serve content more efficiently, while the database server will be able to respond more quickly.

As a result, these database servers can more effectively support deployments with high traffic loads. This may help you achieve higher performance for a range of applications, from popular packages such as [WordPress](/docs/web-applications/cms-guides/wordpress/) and [Drupal](/docs/web-applications/cms-guides/drupal/) to custom applications written in [Ruby on Rails](/docs/frameworks/) and [Django](/docs/frameworks/).

# Prerequisites

In this guide we will be using two Linodes. Note that this is different than simply deploying a second configuration profile on your existing Linode account, as both servers will need to be running at the same time. We're assuming you have followed the [getting started](/docs/getting-started/) guide for both Linodes.

-   For the Linode running the web server, henceforth the application server, you should already have Apache (or your preferred web server) installed. For a fresh install, follow the [LAMP guide](/docs/lamp-guides/) for your distribution. The LAMP guide includes MySQL, which you do not need to install.
-   The dedicated MySQL Linode should have MySQL installed. Follow the [MySQL database server](/docs/databases/mysql/) installation guide for your distribution. Keep in mind that you do not have to install Apache on the dedicated MySQL server.

Also, you will want to configure aliases for the private IP address of each Linode. You can follow the [Linux Static IP Configuration](/docs/networking/configuring-static-ip-interfaces) guide for assistance with this. **It is important to note that both Linodes should be in the same data center** for private networking to work. This enables the servers to communicate without having the traffic count against your monthly bandwidth quota. It is necessary to reboot both Linodes after configuring the private IP addresses.

# Edit /etc/hosts

You will want to create hostnames for each machine so you can keep track of them later. This also saves work, should you find yourself in a situation where you need to change the IP address of the server. Edit the `/etc/hosts` file to include the **private** IP addresses of each Linode. Use the following excerpt from an example `/etc/hosts` file as an example:

{{< file "/etc/hosts" >}}
> 127.0.0.1 localhost 192.168.192.168 mysql.example.com mysql 192.168.192.169 app.example.com app

Remember to replace `192.168.192.168` and `192.168.192.169` with the actual private IP addresses.

While this step is optional, configuring `hosts` entries will allow you to avoid hard coding application configurations to specific IP addresses. You will be able to quickly migrate your application and database servers to alternate servers if you ever have to change your IP addresses.

# Configuring the MySQL Server

The next step is to modify the `/etc/mysql/my.cnf` file on your MySQL server to listen on your private IP address. Using your favorite editor, open the `/etc/mysql/my.cnf` file and insert the hostname of the MySQL database. For this example, the MySQL database hostname is `mysql`. Locate the `bind-address` line:

{{< file-excerpt "/etc/mysql/my.cnf" >}}
bind-address = mysql
{{< /file-excerpt >}}

You can alternatively use the private IP address. Save the file, and run the following command to restart the MySQL daemon:

    /etc/init.d/mysql restart

# Granting Database Access

On the dedicated database server, you will need to create a database username and password with access rights. This is possible through the MySQL prompt. Issue the following command:

    mysql -u root -p

This will provide a MySQL command line. Issue the following commands, substituting `app` with the hostname of the Linode running the application server and a strong password in place of "PASSWORD":

    CREATE DATABASE webapplications;

    GRANT ALL ON webapplications.* TO admin@'app' IDENTIFIED BY 'PASSWORD';

At this stage your application can successfully access the remote database, and you're ready to begin using the database server.

# Using the Database Server

From this point on, everything is configured and your database server is ready to accept a connection from your web server. You should now be able to point your application at the MySQL server without incident. It is important to remember that when setting up web applications to work with a remote MySQL server you must create a user with rights to the remote system (as shown above).

Using MySQL on a separate database server is very similar to running a local database server. Typically, applications require you to specify "database hostname", and conventionally database servers running on the local machine have a hostname of `localhost`. When you separate database and application servers you will need to specify the hostname, as set above, in the application.

For example, in [WordPress](/docs/web-applications/cms-guides/wordpress/) database settings are contained in the `wp-config.php` file, and the hostname is specified in the following format:

{{< file-excerpt "wp-config.php" >}}
/** MySQL hostname */
define('DB_HOST', 'mysql');
{{< /file-excerpt >}}

Note that the method for setting the hostname varies from application to application. Furthermore, you can substitute the specific IP address of the database server, rather than using the hostname as configured in `/etc/hosts` above.

Also consider referencing the external [MySQL](http://www.mysql.com/) website for MySQL specific queries and related help.

More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Web Application Guides](/docs/web-applications/)
- [Web Application Frameworks](/docs/frameworks/)
- [Database Management Systems](/docs/databases/)




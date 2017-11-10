---
author:
  name: Linode
  email: docs@linode.com
description: 'Install the Apache Tomcat Java servlet engine on Ubuntu 16.04 (Xenial Xerus) by following this guide.'
keywords: ["apache tomcat ubuntu 16.04", "tomcat java", "java ubuntu 16.04", "tomcat ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/frameworks/apache-tomcat-on-ubuntu-16-04/']
modified: 2016-05-09
modified_by:
  name: Phil Zona
published: 2016-05-09
title: 'Install Apache Tomcat on Ubuntu 16.04'
external_resources:
 - '[Tomcat Home Page](http://tomcat.apache.org/)'
 - '[Tomcat FAQ](http://wiki.apache.org/tomcat/FAQ)'
---

Apache Tomcat is an open-source software implementation of the Java Servlet and Java Server Pages technologies. With this guide, you'll run applications within Tomcat using the OpenJDK implementation of the Java development environment.

![Apache Tomcat on Ubuntu 16.04](/docs/assets/tomcat-on-ubuntu-1604.png "Apache Tomcat on Ubuntu 16.04")

## Before You Begin

1.  Ensure that your system is up to date and that you have completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend reviewing our [beginner's guide](/docs/beginners-guide/) and the article concerning [systems administration basics](/docs/using-linux/administration-basics).

2.  Make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

3.  You should also make sure your system is up to date. Enter the following command and install any available updates:

        apt-get update && apt-get upgrade

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Apache Tomcat

Install Tomcat from the Ubuntu repository:

    apt-get install tomcat8

{{< note >}}
OpenJDK will be installed as a dependency when you install the `tomcat8` package. The package `openjdk-8-jre-headless` is included with the `default-jre-headless` metapackage in Ubuntu.
{{< /note >}}

You may also want to install the `tomcat8-docs`, `tomcat8-examples`, and `tomcat8-admin` tools which provide web-based applications that document, test, and allow you to administer Tomcat. You can install all three with the following command:

    apt-get install tomcat8-docs tomcat8-examples tomcat8-admin

If you need to start, stop or restart Tomcat you can use the following commands:

    systemctl start tomcat8
    systemctl stop tomcat8
    systemctl restart tomcat8

## Test and Use Tomcat

You can test your Tomcat installation by pointing your browser at your site's port `:8080`, `http://example.com:8080/`. Note that Tomcat listens on network port 8080 and does not accept forced HTTPS connections by default. By default, Tomcat configuration files are located in the `/var/lib/tomcat8/conf` directory.

To use the `tomcat8-admin` web application, add the following lines to the end of your `/var/lib/tomcat8/conf/tomcat-users.xml` file before the `</tomcat-users>` line, substituting your own username and secure password. If using Tomcat Admin, include both the "manager-gui" role for the manager and the "admin-gui" role for the host-manager application.

If you are not using the web application and plan to manage your application(s) from the command line only, you should not enter these lines, because doing so may expose your server to unauthorized login attempts.

{{< file-excerpt "/var/lib/tomcat8/conf/tomcat-users.xml" xml >}}
<role rolename="manager-gui"/>
<role rolename="admin-gui"/>
<user username="username" password="password" roles="manager-gui,admin-gui"/>

{{< /file-excerpt >}}


Restart the Tomcat server, which will allow these changes to take effect:

    systemctl restart tomcat8

Congratulations! You now have a working Apache Tomcat installation.

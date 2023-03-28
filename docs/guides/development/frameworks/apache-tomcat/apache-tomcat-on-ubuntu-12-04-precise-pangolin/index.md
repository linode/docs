---
slug: apache-tomcat-on-ubuntu-12-04-precise-pangolin
deprecated: true
description: 'Instructions for installing the Apache Tomcat Java servlet engine on Ubuntu 12.04 (Precise Pangolin).'
keywords: ["apache tomcat ubuntu 12.04", "java", "java ubuntu 12.04", "java servlets ubuntu lucid", "java ubuntu"]
tags: ["web applications","java","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/websites/frameworks/apache-tomcat-on-ubuntu-12-04-precise-pangolin/','/development/frameworks/apache-tomcat/apache-tomcat-on-ubuntu-12-04-precise-pangolin/','/frameworks/apache-tomcat/ubuntu-12-04-precise-pangolin/','/development/frameworks/apache-tomcat-on-ubuntu-12-04-precise-pangolin/']
modified: 2012-11-13
modified_by:
  name: Linode
published: 2012-11-13
title: 'Apache Tomcat on Ubuntu 12.04 (Precise Pangolin)'
external_resources:
 - '[Tomcat Home Page](http://tomcat.apache.org/)'
 - '[Tomcat FAQ](http://wiki.apache.org/tomcat/FAQ)'
relations:
    platform:
        key:  apache-tomcat
        keywords:
            - distribution: Ubuntu 12.04
authors: ["Linode"]
---

Apache Tomcat is an open source software implementation of the Java Servlet and Java Server Pages technologies. You'll run applications within Tomcat using the OpenJDK implementation of the Java development environment.

Before following this guide, ensure that your system is up to date and that you have completed the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/). If you are new to Linux server administration, we recommend reviewing our [beginner's guide](/docs/products/compute/compute-instances/faqs/) and the article concerning [systems administration basics](/docs/guides/linux-system-administration-basics/).

## Prerequisites

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/products/platform/get-started/#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

You should also make sure your system is up to date. Enter the following commands, one by one, and install any available updates:

    apt-get update
    apt-get upgrade

## Install Apache Tomcat

To install Tomcat, issue the following command:

    apt-get install tomcat6

{{< note respectIndent=false >}}
OpenJDK will be installed as a dependency when you install the `tomcat6` package. OpenJDK is pulled in by the `default-java` meta package in Ubuntu.
{{< /note >}}

You may also want to install the `tomcat6-docs`, `tomcat6-examples`, and `tomcat6-admin` tools which provide web-based applications that document, test, and allow you to administer Tomcat. You can install all three with the following command:

    apt-get install tomcat6-docs tomcat6-examples tomcat6-admin

Tomcat should now be totally functional, following installation and your next system reboot. If you need to start, stop, or restart Tomcat you can use the following commands:

    /etc/init.d/tomcat6 start
    /etc/init.d/tomcat6 stop
    /etc/init.d/tomcat6 restart

## Test and Use Tomcat

You can test your Tomcat installation by pointing your browser at `http://[yourdomain-or-ip-address]:8080/`. By default, files are located in the `/usr/share/tomcat6` directory. To configure the admin area, you'll need to add the following lines to the end of your `tomcat-users.xml` file, substituting your own username and password. Make sure you keep the "manager" role.

{{< file "/etc/tomcat6/tomcat-users.xml" xml >}}
<role rolename="manager"/>
<user username="username" password="examplemorris" roles="manager"/>

{{< /file >}}


Issue the following command to restart the Tomcat server, which will allow this change to take effect:

    /etc/init.d/tomcat6 restart

Congratulations! You know have a working Apache Tomcat installation.

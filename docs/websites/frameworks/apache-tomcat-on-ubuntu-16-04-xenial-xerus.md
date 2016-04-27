---
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for installing the Apache Tomcat Java servlet engine on Ubuntu 16.04 (Xenial Xerus).'
keywords: 'apache tomcat ubuntu 16.04,java,java ubuntu 16.04,java servlets ubuntu lucid,java ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['frameworks/apache-tomcat/ubuntu-16-4-xenial-xerus/']
modified: Tuesday, April 26, 2016
modified_by:
  name: Edward Angert
published: 'Friday, April 6, 2016'
title: 'Apache Tomcat on Ubuntu 16.04 (Xenial Xerus)'
external_resources:
 - '[Tomcat Home Page](http://tomcat.apache.org/)'
 - '[Tomcat FAQ](http://wiki.apache.org/tomcat/FAQ)'
---

Apache Tomcat is an open source software implementation of the Java Servlet and Java Server Pages technologies. You'll run applications within Tomcat using the OpenJDK implementation of the Java development environment.

## Before You Begin

1.  Ensure that your system is up to date and that you have completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend reviewing our [beginner's guide](/docs/beginners-guide/) and the article concerning [systems administration basics](/docs/using-linux/administration-basics).

2.  Make sure you've followed our instructions for [setting your hostname](/docs/getting-started#sph_setting-the-hostname). Issue the following commands to make sure it is set properly:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

3.  You should also make sure your system is up to date. Enter the following command and install any available updates:

    apt-get update && apt-get upgrade

{: .note }
>The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install Apache Tomcat

Install Tomcat from the Ubuntu repository:

    apt-get install tomcat8

{: .note }
>
> OpenJDK will be installed as a dependency when you install the `tomcat8` package. OpenJDK is included with the `default-java` meta package in Ubuntu.

You may also want to install the `tomcat8-docs`, `tomcat8-examples`, and `tomcat8-admin` tools which provide web-based applications that document, test, and allow you to administer Tomcat. You can install all three with the following command:

    apt-get install tomcat8-docs tomcat8-examples tomcat8-admin

Tomcat should be totally functional following your next system reboot. If you need to start, stop, or restart Tomcat you can use the following commands:

    /etc/init.d/tomcat8 start
    /etc/init.d/tomcat8 stop
    /etc/init.d/tomcat8 restart

## Test and Use Tomcat

Tomcat listens on network port 8080 and does not accept forced HTTPS connections by default. You can test your Tomcat installation by pointing your browser at `http://[yourdomain-or-ip-address]:8080/`. By default, Tomcat files are located in the `/usr/share/tomcat8` directory.

To configure the admin area, you'll need to add the following lines to the end of your `/etc/tomcat8/tomcat-users.xml` file before the `</tomcat-users>` line, substituting your own username and password. Make sure you keep the "manager" role.

{: .file-excerpt }
/etc/tomcat8/tomcat-users.xml
:   ~~~ xml
    <role rolename="manager"/>
    <user username="username" password="examplemorris" roles="manager"/>
    ~~~

Restart the Tomcat server, which will allow this change to take effect:

    /etc/init.d/tomcat8 restart

Congratulations! You now have a working Apache Tomcat installation.
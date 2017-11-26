---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for installing the Apache Tomcat Java servlet engine on Ubuntu 10.10 (Maverick).'
keywords: ["apache tomcat ubuntu 10.10", "java", "java ubuntu 10.10", "java servlets ubuntu maverick", "java ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/apache-tomcat/ubuntu-10-10-maverick/','websites/frameworks/apache-tomcat-on-ubuntu-10-10-maverick/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2010-12-07
title: 'Apache Tomcat on Ubuntu 10.10 (Maverick)'
---



Apache Tomcat is an open source software implementation of the Java Servlet and Java Server Pages technologies. You may choose to run applications within Tomcat using either the OpenJDK implementation or the Sun Microsystems/Oracle implementation of the Java development environment.

Before following this guide, ensure that your system is up to date and that you have completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend reviewing our [beginner's guide](/docs/beginners-guide/) and the article concerning [systems administration basics](/docs/using-linux/administration-basics).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Choose and Install Java Implementation

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade

You must choose which implementation of the Java language you wish to use. Note that there is some variance in the implementations of the Java language, and you should install a version that is compatible with the application that you are hoping to run and/or write.

If you choose to run OpenJDK, you can skip the rest of this section, as OpenJDK will be installed as a dependency when you install the `tomcat6` package; OpenJDK is pulled in by the "default-java" meta package in Ubuntu.

If you would like to run the Sun Microsystems/Oracle implementation of Java, edit the `/etc/apt/sources.list` so that it resembles the following example. This will enable access to the "partner" repository:

{{< file "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ maverick main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ maverick main restricted

deb http://security.ubuntu.com/ubuntu maverick-updates main restricted
deb-src http://security.ubuntu.com/ubuntu maverick-updates main restricted

deb http://security.ubuntu.com/ubuntu maverick-security main restricted
deb-src http://security.ubuntu.com/ubuntu maverick-security main restricted

## universe repositories - uncomment to enable
deb http://us.archive.ubuntu.com/ubuntu/ maverick universe
deb-src http://us.archive.ubuntu.com/ubuntu/ maverick universe

deb http://us.archive.ubuntu.com/ubuntu/ maverick-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ maverick-updates universe

deb http://security.ubuntu.com/ubuntu maverick-security universe
deb-src http://security.ubuntu.com/ubuntu maverick-security universe

## partner repositories
deb http://archive.canonical.com/ubuntu maverick partner
deb-src http://archive.canonical.com/ubuntu maverick partner

deb http://archive.canonical.com/ubuntu maverick-updates partner
deb-src http://archive.canonical.com/ubuntu maverick-updates partner

deb http://archive.canonical.com/ubuntu maverick-security partner
deb-src http://archive.canonical.com/ubuntu maverick-security partner

{{< /file >}}


Issue the following command to update your system's package repositories:

    apt-get update

Now you are ready to install Sun Java with the following command (after agreeing to the license terms):

    apt-get install sun-java6-jdk

# Install Apache Tomcat

To install Tomcat, issue the following command:

    apt-get install tomcat6

You may also want to install the `tomcat6-docs`, `tomcat6-examples`, and `tomcat6-admin` tools which provide web-based applications that document, test, and allow you to administer Tomcat. You can install all three with the following command:

    apt-get install tomcat6-docs tomcat6-examples tomcat6-admin

Tomcat should now be totally functional and should start automatically following installation and your next system reboot. If you need to start, stop, or restart Tomcat you can use the following commands:

    /etc/init.d/tomcat6 start
    /etc/init.d/tomcat6 stop
    /etc/init.d/tomcat6 restart

# Test and Use Tomcat

You can test your Tomcat installation by pointing your browser at `http://[yourdomain-or-ip-address]:8080/`. By default, files are located in the `/usr/share/tomcat6` directory. To configure the admin area, you'll need to add the following lines to the end of your `tomcat-users.xml` file, substituting your own username and password. Make sure you keep the "manager" role.

{{< file-excerpt "/etc/tomcat6/tomcat-users.xml" xml >}}
<role rolename="manager"/>
<user username="username" password="examplemorris" roles="manager"/>

{{< /file-excerpt >}}


Issue the following command to restart the Tomcat server, which will allow this change to take effect:

    /etc/init.d/tomcat6 restart

Congratulations! You know have a working Apache Tomcat installation.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Tomcat Home Page](http://tomcat.apache.org/)
- [Tomcat FAQ](http://wiki.apache.org/tomcat/FAQ)




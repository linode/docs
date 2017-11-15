---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for installing and using the Apache Tomcat Java Servlet engine on Debian 5 (Squeeze.)'
keywords: ["java", "apache tomcat", "java debian", "java lenny"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/apache-tomcat/debian-6-squeeze/','websites/frameworks/apache-tomcat-on-debian-6-squeeze/']
modified: 2011-05-13
modified_by:
  name: Linode
published: 2011-02-17
title: 'Apache Tomcat on Debian 6 (Squeeze)'
---

Apache Tomcat is a free and open source software implementation for JavaServlets. It provides support for Java Server Pages (JSP), which power many popular web-based applications. You may choose to run Tomcat with either Sun's Java implementation or the OpenJDK implementation of Java, and this document provides instructions for using either option.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Choose and Install a Java Implementation

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Before we begin, you must choose which implementation of the Java language you wish to use. Note that there is some variance in these implementations, and you should install a version that is compatible with the application that you are hoping to run and/or write. The "main" repository for Debian comes with the "open-jdk" implementation, which you would install by issuing the following command:

    apt-get install openjdk-6-jdk

If you chose to run OpenJDK, then you can skip the remainder of this section. If you would like to run the Sun Microsystems implementation of Java, you must first edit the `/etc/apt/sources.list` file and append the following two lines, as Sun's licensing terms are considered non-free under the guidelines that govern inclusion in Debian's "main" software repositories.

Add the following line to your `sources.list` file:

{{< file-excerpt "/etc/apt/sources.list" >}}
deb http://ftp.debian.org/debian/ squeeze non-free

{{< /file-excerpt >}}


Update apt to get the necessary package lists:

    apt-get update

Now you are ready to install Sun Java with the following command (acknowledging the license terms):

    apt-get install sun-java6-jdk

Now you are ready to proceed with the Apache Tomcat install.

# Install Apache Tomcat

To install Tomcat, issue the following command:

    apt-get install tomcat6

You may also want to install the `tomcat6-docs`, `tomcat6-examples`, and `tomcat6-admin` tools which provide web-based applications that document, test, and allow you to administer Tomcat. You can install all three with the following command:

    apt-get install tomcat6-docs tomcat6-examples tomcat6-admin

Tomcat should now be totally functional, following installation and your next system reboot. If you need to start, stop, or restart Tomcat you can use the following commands:

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




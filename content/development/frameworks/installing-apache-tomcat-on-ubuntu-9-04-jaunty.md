---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for installing the Apache Tomcat Java servlet engine on Ubuntu 9.04 (Jaunty).'
keywords: ["Tomcat", "Java", "Apache Tomcat", "Ubuntu Jaunty", "Ubuntu 9.04", "Tomcat Linode"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/apache-tomcat/ubuntu-9-04-jaunty/','websites/frameworks/installing-apache-tomcat-on-ubuntu-9-04-jaunty/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2009-08-06
title: 'Installing Apache Tomcat on Ubuntu 9.04 (Jaunty)'
---



Apache Tomcat is an "[open source software implementation of the Java Servlet and JavaServer Pages technologies.](http://tomcat.apache.org/)" You may choose to use either the OpenJDK implementation or the Sun Microsystems implementation of Java when installing Tomcat.

Before beginning this guide we assume that you've completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend considering the [beginner's guide](/docs/beginners-guide/), and the article concerning [systems administration basics](/docs/using-linux/administration-basics). We also assume you're logged into your Linode via SSH as root for this guide.

Choose and Install Java Implementation
--------------------------------------

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

You must choose which implementation of the java language you wish to use. Note that there is some variance in the implementations of the Java language, and you should install a version that is compatible with the application that you are hoping to run and/or write.

If you choose to run OpenJDK, you can skip the rest of this section, as OpenJDK will be installed as a dependency when you install the tomcat6 package; OpenJDK is pulled in by the "default-java" meta package in Ubuntu.

If you would like to run the Sun Microsystems implementation of Java you must first edit the `/etc/apt/sources.list` file and append two package repository sources. Sun's licensing terms are considered "non-free" under the guidelines that govern inclusion in Ubuntu's "main" software repositories.

Add the following two lines to your `sources.list` list:

{{< file-excerpt "/etc/apt/sources.list" >}}
deb http://us.archive.ubuntu.com/ubuntu/ jaunty multiverse
deb-src http://us.archive.ubuntu.com/ubuntu/ jaunty multiverse

{{< /file-excerpt >}}


Update apt to get the necessary package lists:

    apt-get update

Now you are ready to install Sun Java with the following command (acknowledging the license terms):

    apt-get install sun-java6-jdk

Now you are ready to proceed with the Apache Tomcat install.

Installing Apache Tomcat
------------------------

To install Tomcat, issue the following command:

    apt-get install tomcat6

You may also want to install the `tomcat6-docs`, `tomcat6-examples`, and `tomcat6-admin` tools which provide web-based applications that document, test, and allow you to administer Tomcat. You can install all three with the following command:

    apt-get install tomcat6-docs tomcat6-examples tomcat6-admin

Tomcat should now be totally functional and should start automatically with the system. If you need to start, stop, or restart Tomcat you can use the following commands:

    /etc/init.d/tomcat6 start
    /etc/init.d/tomcat6 stop
    /etc/init.d/tomcat6 restart

Test and Use Tomcat
-------------------

You can test your Tomcat installation by pointing your browser at `http://[yourdomain-or-ip-address]:8080/`. By default, files are located in the `/usr/share/tomcat6` directory. To configure the admin area, you'll need to add the following lines to the end of your `tomcat-users.xml` file (replacing "s3cret" with a more appropriate password):

{{< file "/etc/tomcat6/tomcat-users.xml" xml >}}
<role rolename="manager"/>
<user username="tomcat" password="s3cret" roles="manager"/>

{{< /file >}}


Congratulations! You know have a working Apache Tomcat installation.

More Information
----------------

More Information
----------------

More Information
----------------

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Tomcat Home Page](http://tomcat.apache.org/)
- [Tomcat FAQ](http://wiki.apache.org/tomcat/FAQ)
- [Installing Tomacat 6 on Ubuntu @ Howtogeek.com](http://www.howtogeek.com/howto/linux/installing-tomcat-6-on-ubuntu/)




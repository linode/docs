---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for installing the Apache Tomcat Java servlet engine on Ubuntu 9.10 (Karmic).'
keywords: ["apache tomcat ubuntu 9.10", "java", "java ubuntu 9.10", "java servlets ubuntu karmic", "java ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/apache-tomcat/ubuntu-9-10-karmic/','websites/frameworks/apache-tomcat-on-ubuntu-9-10-karmic/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-07-23
title: 'Apache Tomcat on Ubuntu 9.10 (Karmic)'
---



Apache Tomcat is an open source software implementation of the Java Servlet and Java Server Pages technologies. You may choose to run application within Tomcat using either the OpenJDK implementation or the Sun Microsystems implementation of the Java development environment.

Before following this guide, ensure that your system is up to date and that you have completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend reviewing our [beginner's guide](/docs/beginners-guide/) and the article concerning [systems administration basics](/docs/using-linux/administration-basics).

Choose and Install Java Implementation
--------------------------------------

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

You must choose which implementation of the Java language you wish to use. Note that there is some variance in the implementations of the Java language, and you should install a version that is compatible with the application that you are hoping to run and/or write.

If you choose to run OpenJDK, you can skip the rest of this section, as OpenJDK will be installed as a dependency when you install the tomcat6 package; OpenJDK is pulled in by the "default-java" meta package in Ubuntu.

If you would like to run the Sun Microsystems implementation of Java, you must first edit the `/etc/apt/sources.list` file to include the `universe` and `multiverse` repositories. This will make it possible to install "sun-java", because Sun's licensing terms are considered "non-free" under the guidelines that govern inclusion in Ubuntu's "main" software repositories.

Ensure that your `sources.list` list resembles the following:

{{< file "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntu.com/ubuntu karmic-updates main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-updates main restricted

deb http://security.ubuntu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories - uncomment to enable
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe

deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

## multiverse repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic multiverse
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic multiverse

deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates multiverse
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates multiverse

deb http://security.ubuntu.com/ubuntu karmic-security multiverse
deb-src http://security.ubuntu.com/ubuntu karmic-security multiverse

{{< /file >}}


Update apt to get the necessary package lists:

    apt-get update

Now you are ready to install Sun Java with the following command (acknowledging the license terms):

    apt-get install sun-java6-jdk

Install Apache Tomcat
---------------------

To install Tomcat, issue the following command:

    apt-get install tomcat6

You may also want to install the `tomcat6-docs`, `tomcat6-examples`, and `tomcat6-admin` tools, which provide web-based applications that document, test, and allow you to administer Tomcat. You can install all three with the following command:

    apt-get install tomcat6-docs tomcat6-examples tomcat6-admin

Tomcat should now be totally functional and should start automatically following installation and your next system reboot. If you need to start, stop, or restart Tomcat you can use the following commands:

    /etc/init.d/tomcat6 start
    /etc/init.d/tomcat6 stop
    /etc/init.d/tomcat6 restart

Test and Use Tomcat
-------------------

You can test your Tomcat installation by pointing your browser at `http://[yourdomain-or-ip-address]:8080/`. By default, files are located in the `/usr/share/tomcat6` directory. To configure the admin area, you'll need to add the following lines to the end of your `tomcat-users.xml` file, substituting your own username and password. Make sure you keep the "manager" role.

{{< file "/etc/tomcat6/tomcat-users.xml" xml >}}
<role rolename="manager"/>
<user username="tomcat" password="s3cret" roles="manager"/>

{{< /file >}}


Issue the following command to restart the Tomcat server to allow this change to take effect:

    /etc/init.d/tomcat6 restart

Congratulations! You know have a working Apache Tomcat installation.

More Information
----------------

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Tomcat Home Page](http://tomcat.apache.org/)
- [Tomcat FAQ](http://wiki.apache.org/tomcat/FAQ)




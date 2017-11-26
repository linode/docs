---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for installing and using the Apache Tomcat Java Servlet engine on Debian 5 (Lenny).'
keywords: ["java", "apache tomcat", "java debian", "java lenny"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/apache-tomcat/debian-5-lenny/','websites/frameworks/apache-tomcat-on-debian-5-lenny/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2009-09-23
title: 'Apache Tomcat on Debian 5 (Lenny)'
---



Apache Tomcat is a free and open source software implementation for JavaServlets. It provides support for Java Server Pages (JSP), which power many popular web-based applications. You may choose to run Tomcat with either Sun's Java implementation or the OpenJDK implementation of Java, and this document provides instructions for using either option.

This guide assumes that you have a working installation of Debian 5 (Lenny), and have followed our [getting started guide](/docs/getting-started/) to get your system working and up to date. We also assume that you have a functional SSH connection and root access to your server.

Tomcat version 6 was not included as part of Debian Lenny because of concerns that because of how packages work, packaging Tomcat would introduce a unique class of bugs into it. In any case, installing without apt just adds a few extra steps, and is easily accomplished.

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
deb http://mirror.cc.columbia.edu/pub/linux/debian/debian/  lenny non-free

{{< /file-excerpt >}}


Update apt to get the necessary package lists:

    apt-get update

Now you are ready to install Sun Java with the following command (acknowledging the license terms):

    apt-get install sun-java6-jdk

Now you are ready to proceed with the Apache Tomcat install.

# Installing Apache Tomcat

Download the latest version of Tomcat with the following command. You may need to install `wget` first by issuing the command `apt-get install wget`.

    wget http://www.ecoficial.com/apachemirror/tomcat/tomcat-6/v6.0.32/bin/apache-tomcat-6.0.32.tar.gz

Confirm via MD5 hash that you've got an authentic package, by viewing [the md5sum of the tomcat release](http://www.apache.org/dist/tomcat/tomcat-6/v6.0.32/bin/apache-tomcat-6.0.32.tar.gz.md5) and comparing the checksum with the output of the following command on from your server:

    md5sum apache-tomcat-6.0.20.tar.gz

Note that you can (and should) feel free and encouraged to install the latest available version of Tomcat \<http://tomcat.apache.org/download-60.cgi \> available on the tomcat website, although the version numbers and checksums will change accordingly.

Extract the tomcat binary from the tarball with the following command:

    tar -xzvf apache-tomcat-6.0.32.tar.gz

Move the resulting Tomcat directory to a permanent location by issuing this command:

    mv apache-tomcat-6.0.32 /usr/local/tomcat

The scripts for controlling and interacting with Tomcat are located in the `/usr/local/tomcat/bin` directory.

# Enable Tomcat to Start Automatically

Borrowing from the scripts described [here](http://www.howtogeek.com/howto/linux/installing-tomcat-6-on-ubuntu/) you can enable Tomcat to start automatically with your system.

Create a `tomcat` "init" file with the following content:

{{< file "/etc/init.d/tomcat" bash >}}
# Tomcat auto-start
#
# description: Auto-starts tomcat
# processname: tomcat
# pidfile: /var/run/tomcat.pid

export JAVA_HOME=/usr/lib/jvm/java-6-sun

case $1 in
start)
        sh /usr/local/tomcat/bin/startup.sh
        ;;
stop)
        sh /usr/local/tomcat/bin/shutdown.sh
        ;;
restart)
        sh /usr/local/tomcat/bin/shutdown.sh
        sh /usr/local/tomcat/bin/startup.sh
        ;;
esac
exit 0

{{< /file >}}


Remember, if you installed open-jdk the `export JAVA_HOME` line should read:

{{< file-excerpt "/etc/init.d/tomcat" bash >}}
export JAVA_HOME=/usr/lib/jvm/java-6-openjdk

{{< /file-excerpt >}}


Make the script executable by issuing this command:

    chmod +x /etc/init.d/tomcat

Finally, create symbolic links in the startup folders with these commands:

    ln -s /etc/init.d/tomcat /etc/rc1.d/K99tomcat
    ln -s /etc/init.d/tomcat /etc/rc2.d/S99tomcat

Tomcat should now be totally functional and should start automatically with the system. In the future, if you need to start, stop, or restart, you can use the following commands:

    /etc/init.d/tomcat start
    /etc/init.d/tomcat stop
    /etc/init.d/tomcat restart

# Test and use Tomcat

You can test your Tomcat installation by pointing your browser to `http://[yourdomain-or-ip-address]:8080/`. By default, files are located at `/usr/local/tomcat/webapps/`.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Tomcat Home Page](http://tomcat.apache.org/)
- [Tomcat FAQ](http://wiki.apache.org/tomcat/FAQ)




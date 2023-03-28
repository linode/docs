---
slug: apache-tomcat-on-ubuntu-18-04
description: 'Install the Apache Tomcat Java servlet engine on Ubuntu 18.04 by following this guide.'
keywords: ["apache tomcat ubuntu 18.04", "tomcat java", "java ubuntu 18.04", "tomcat ubuntu"]
tags: ["web applications","java","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/websites/frameworks/apache-tomcat-on-ubuntu-18-04/','/development/frameworks/apache-tomcat/apache-tomcat-on-ubuntu-18-04/','/development/frameworks/apache-tomcat-on-ubuntu-18-04/']
modified: 2020-03-25
modified_by:
  name: Linode
published: 2020-03-25
title: 'Installing Apache Tomcat on Ubuntu 18.04'
title_meta: 'How to Install Apache Tomcat on Ubuntu 18.04'
external_resources:
 - '[Tomcat Home Page](http://tomcat.apache.org/)'
 - '[Tomcat FAQ](http://wiki.apache.org/tomcat/FAQ)'
audiences: ["beginner"]
concentrations: ["Web Applications"]
languages: ["java"]
image: ApacheTomcat_Ubuntu1804.png
relations:
    platform:
        key:  apache-tomcat
        keywords:
            - distribution: Ubuntu 18.04
authors: ["Linode"]
---

Apache Tomcat is an open-source software implementation of the Java Servlet and Java Server Pages technologies. With this guide, you'll run applications within Tomcat using the OpenJDK implementation of the Java development environment.

## Before You Begin

1.  Ensure that your system is up to date and that you have completed the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/). If you are new to Linux server administration, we recommend reviewing our [beginner's guide](/docs/products/compute/compute-instances/faqs/) and the article concerning [systems administration basics](/docs/guides/linux-system-administration-basics/).

2.  Make sure you've followed our instructions for [setting your hostname](/docs/products/platform/get-started/#setting-the-hostname). Issue the following commands to make sure it is set properly:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

3.  You should also make sure your system is up to date. Enter the following command and install any available updates:

        apt-get update && apt-get upgrade

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Apache Tomcat

1.  Install Tomcat from the Ubuntu repository:

        sudo apt-get install tomcat9

    {{< note respectIndent=false >}}
OpenJDK will be installed as a dependency when you install the `tomcat9` package. The package `openjdk-11-jre-headless` is included with the `default-jre-headless` metapackage in Ubuntu.
{{< /note >}}

1.  You may also want to install the `tomcat9-docs`, `tomcat9-examples`, and `tomcat9-admin` tools which provide web-based applications that document, test, and allow you to administer Tomcat. You can install all three with the following command:

        sudo apt-get install tomcat9-docs tomcat9-examples tomcat9-admin

1.  Start the Tomcat service.

        sudo systemctl start tomcat9

1.  If you need to stop or restart Tomcat you can use the following commands, respectively:

        sudo systemctl stop tomcat9
        sudo systemctl restart tomcat9

## Test and Use Tomcat

You can test your Tomcat installation by pointing your browser at your domain name, specifying port `8080`. For example, you might use `http://example.com:8080/`, replacing `example.com` with your domain name. Note that Tomcat listens on network port 8080 and does not accept forced HTTPS connections by default. By default, Tomcat configuration files are located in the `/var/lib/tomcat9/conf` directory.

### Configure tomcat9-admin (optional)

If you installed the `tomcat9-admin` web application above, you can configure it by adding the following lines to the end of your `/var/lib/tomcat9/conf/tomcat-users.xml` file before the `</tomcat-users>` line, substituting your own username and secure password. If using Tomcat Admin, include both the "manager-gui" role for the manager and the "admin-gui" role for the host-manager application.

{{< file "/var/lib/tomcat9/conf/tomcat-users.xml" xml >}}
<role rolename="manager-gui"/>
<role rolename="admin-gui"/>
<user username="username" password="password" roles="manager-gui,admin-gui"/>

{{< /file >}}

{{< note respectIndent=false >}}
If you are not using the web application and plan to manage your application(s) from the command line only, you should not enter these lines, because doing so may expose your server to unauthorized login attempts.
{{< /note >}}

Restart the Tomcat server, which will allow these changes to take effect:

    sudo systemctl restart tomcat9

---
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the Webmin control panel to maintain your Linode.'
keywords: ["webmin", "webmin debian", "webmin centos", "webmin ubuntu", "webmin fedora", "linux control panel", "debian", "ubuntu", "centos", "fedora", "control panel", "admin panel"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/control-panels/webmin/installing-webmin/']
modified: 2017-02-21
modified_by:
  name: Nick Brewer
published: 2014-10-08
title: Webmin Control Panel
external_resources:
 - '[Webmin Home Page](http://www.webmin.com/)'
 - '[Webmin Documentation](http://www.webmin.com/docs.html)'
 - '[Webmin Modules](http://www.webmin.com/standard.html)'
 - '[Webmin FAQ](http://www.webmin.com/faq.html)'
---

Webmin is a web interface that allows you to manage configuration files and reload programs without needing to use SSH. It is a popular alternative to administration panels such as cPanel or Plesk and contains many of the features that make them popular. Modules and plugins expand Webmin's functionality and can be found for many popular packages like the [Apache web server](/docs/web-servers/apache/) and [Postfix](/docs/email/postfix/). Many third-party modules exist for different use cases, which contribute to the flexibility of the Webmin control panel.

Installing Webmin is straightforward; however, you may wish to consult the documentation contained at the end of this document for additional information on using Webmin to manage your system.


## Prerequisites

- This guide is written for a Linode running Debian 7 but is also compatible with Ubuntu 14.04.

- The steps required in this guide require root privileges. Be sure to run the steps below as ``root`` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

- Before installing Webmin, we assume that you've completed the [Getting Started](/docs/getting-started/) guide.
- If you are new to Linux server administration, we recommend the [Linode Beginner's Guide](/docs/beginners-guide/) and the article concerning [Systems Administration Basics](/docs/using-linux/administration-basics).

- Issue the following commands to refresh your system's package database and ensure that you're running the most up-to-date software:

        apt-get update
        apt-get upgrade

### Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#ubuntu--debian). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Installing Webmin

Once you have satisfied all dependencies, you will need to download the Webmin package to your Linode.

1. Add the Webmin repository to your known repositories list by creating the file below:

    {{< file "/etc/apt/sources.list.d/webmin.list" >}}
deb http://download.webmin.com/download/repository sarge contrib
deb http://webmin.mirror.somersettechsolutions.co.uk/repository sarge contrib

{{< /file >}}


2. Download and install the GPG key for the repository:

        cd /tmp
        wget http://www.webmin.com/jcameron-key.asc
        apt-key add jcameron-key.asc

3. Update Apt:

        apt-get update

3. Install Webmin:

       apt-get install webmin


After the installation has completed, Webmin will give you a URL to visit to access the web panel. This URL will be in the form of `https://hostname:10000`, where `hostname` is the host name of your Linode. If your Linode does not have a Fully Qualified Domain Name (FQDN) such as `myserver.mydomain.com`, you should use your Linode's IP or a domain pointed at your Linode to access Webmin.

For security reasons, Webmin generates a self-signed SSL certificate for itself when you install it. If you get a warning about an SSL certificate from your browser, you may wish to verify the details of the certificate and accept it.

You will be presented with a login screen; enter your root user credentials.

## Configuring Webmin

We recommend you change the port Webmin runs on to something other than 10000. To do this, select the "Webmin" tab from the menu on the left and click "Webmin Configuration" from the submenu. Select "Ports and Addresses" from the control panel and change the "Listen on Port" to a port that you will remember. When you click the "Save" button, Webmin will change the port it runs on and redirect you to the new page. You are now free to configure the rest of your services with Webmin.

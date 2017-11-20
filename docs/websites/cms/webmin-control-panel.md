---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will teach you how to install
and configure a Webmin control panel for system administration'
keywords: ["webmin", "webmin debian", "webmin ubuntu", "linux control panel", "admin panel"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/control-panels/webmin/installing-webmin/']
modified: 2017-09-15
modified_by:
  name: Linode
published: 2014-10-08
title: How to Install a Webmin Control Panel
external_resources:
 - '[Webmin Home Page](http://www.webmin.com/)'
 - '[Webmin Documentation](http://www.webmin.com/docs.html)'
 - '[Webmin Modules](http://www.webmin.com/standard.html)'
 - '[Webmin FAQ](http://www.webmin.com/faq.html)'
---

Webmin is a web interface that allows you to manage configuration files and reload programs without needing to use SSH. It is a popular alternative to administration panels such as cPanel or Plesk and contains many of the features that make them popular. Modules and plugins expand Webmin's functionality and can be found for many popular packages like the [Apache web server](/docs/web-servers/apache/) and [Postfix](/docs/email/postfix/). Many third-party modules exist for different use cases, which contribute to the flexibility of the Webmin control panel.

Installing Webmin is straightforward; however, you may wish to consult the documentation contained at the end of this document for additional information on using Webmin to manage your system.


## Before You Begin

This guide was written using Debian 8, but will also work with Ubuntu 16.04.

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services. You do not have to complete the Configure a Firewall section; if you choose to set up a firewall, ensure that incoming connections are allowed on port 10000.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade


### Check the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#ubuntu--debian). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Installing Webmin

Once you have satisfied all dependencies, you will need to download the Webmin package to your Linode.

1.  Add the Webmin repository to your known repositories list by creating the file below:

    {{< file "/etc/apt/sources.list.d/webmin.list" >}}
deb http://download.webmin.com/download/repository sarge contrib
deb http://webmin.mirror.somersettechsolutions.co.uk/repository sarge contrib
{{< /file >}}

2.  Download and install the GPG key for the repository:

        cd /tmp
        wget http://www.webmin.com/jcameron-key.asc
        apt-key add jcameron-key.asc

3.  Update Apt:

        sudo apt update

3.  Install Webmin:

        sudo apt install webmin


After the installation has completed, Webmin will give you a URL to visit to access the web panel. This URL will be in the form of `https://hostname:10000`, where `hostname` is the host name of your Linode. If your Linode does not have a Fully Qualified Domain Name (FQDN) such as `myserver.mydomain.com`, you should use your Linode's IP or a domain pointed at your Linode to access Webmin.

For security reasons, Webmin generates a self-signed SSL certificate for itself when you install it. If you get a warning about an SSL certificate from your browser, you may wish to verify the details of the certificate and accept it.

You will be presented with a login screen; enter your root user credentials, or credentials for any user able to execute commands using `sudo`.

## Configuring Webmin

We recommend you change the port Webmin runs on to something other than 10000. To do this, select the "Webmin" tab from the menu on the left and click "Webmin Configuration" from the submenu. Select "Ports and Addresses" from the control panel and change the "Listen on Port" to a port that you will remember. When you click the "Save" button, Webmin will change the port it runs on and redirect you to the new page. You are now free to configure the rest of your services with Webmin.

## Extending Webmin

### Standard Modules
Installing any of Webmin's [standard modules](http://www.webmin.com/standard.html) is simple. For example, to install the Apache module, open your Webmin web panel and find the "Un-used Modules" tab in the menu on the left. Click on the Apache module. If it has not already been installed automatically, you will see a message like this:

![Install Apache Message](/docs/assets/webmin/install_plugin.png)

Click on the "Click Here" button to have Webmin install the module for you.

### Third-Party Modules
There are also many [third party modules](http://www.webmin.com/cgi-bin/search_third.cgi?modules=1) that can be added to Webmin; installing these often requires a few extra steps. This section will demonstrate how to install these modules, using the [Certificate Manager](http://www.webmin.com/virtualmin.html) as an example. This module allows you to generate or import SSL certificates.

1.  Execute the following command from your local machine (or paste the url into a browser window):

        wget http://www.webmin.com/download/modules/certmgr.wbm.gz

2.  From your Webmin web panel, select the "Webmin" tab from the menu on the left and choose "Webmin Configuration" from the submenu.

3.  Click the "Webmin Modules" menu icon, and you will see a menu similar to the picture below:

    ![Install Module Menu](/docs/assets/webmin/install-module-menu.png)

4.  Choose "From uploaded file" and navigate to the file you just downloaded to your local machine. Click "Install Module." You may need to sign out of the web panel and sign in again before you can use the newly installed module.

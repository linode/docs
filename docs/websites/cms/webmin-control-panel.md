---
author:
  name: Amanda Folson
  email: docs@linode.com
description: 'Installing and configuring the Webmin control panel to maintain your Linode.'
keywords: 'webmin,webmin debian,webmin centos,webmin ubuntu,webmin fedora,linux control panel,debian,ubuntu,centos,fedora,control panel,admin panel'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/control-panels/webmin/installing-webmin/']
modified: Thursday, November 17th, 2011
modified_by:
  name: Chris Ciufo
published: 'Thursday, November 10th, 2011'
title: Webmin Control Panel
---

Webmin is a web interface that allows you to manage configuration files and reload programs without needing to use SSH. It is a popular alternative to administration panels such as CPanel or Plesk, and contains many of the features that make them popular. Modules and plugins expand Webmin's functionality and can be found for many popular packages like the [Apache web server](/docs/web-servers/apache/) and [Postfix](/docs/email/postfix/). Many third-party modules exist for different use cases, which contribute to the flexibility of the Webmin control panel.

Installing Webmin is straightforward, however you may wish to consult the documentation contained at the end of this document for additional information on using Webmin to manage your system.

Before installing Webmin, we assume that you've completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend the [beginner's guide](/docs/beginners-guide/) and the article concerning [systems administration basics](/docs/using-linux/administration-basics).

Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#sph_set-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Prerequisites
-------------

Issue the following commands to refresh your system's package database and ensure that you're running the most up to date software:

Debian / Ubuntu:

    apt-get update
    apt-get upgrade --show-upgraded

CentOS / Fedora:

    yum update

Additionally, on CentOS and Fedora systems, you'll need to create a file with the information required to install Webmin through yum. Create the `webmin.repo` file in `/etc/yum.repos.d/` with the following contents:

{: .file }
/etc/yum.repos.d/webmin.repo
:   ~~~
    [Webmin]
    name=Webmin Distribution Neutral
    baseurl=http://download.webmin.com/download/yum
    enabled=1
    ~~~

On CentOS and Fedora systems, you'll also need to run the following command to install the corresponding Webmin GPG key:

    rpm --import http://www.webmin.com/jcameron-key.asc

### Installing Required Packages

You will now need to install a few other packages in order for Webmin to work properly. Issue the following command to install all prerequisites:

Debian / Ubuntu:

    apt-get install perl libnet-ssleay-perl openssl libauthen-pam-perl libio-pty-perl apt-show-versions libapt-pkg-perl

CentOS / Fedora:

    yum install openssl-devel perl perl-Net-SSLeay perl-Crypt-SSLeay

Installing Webmin
-----------------

Once you have satisfied all dependencies, you will need to download the Webmin source to your Linode. To do this, issue the following commands:

Debian / Ubuntu:

    cd /tmp
    wget http://www.webmin.com/download/deb/webmin-current.deb
    dpkg -i webmin-current.deb

CentOS / Fedora:

    yum install webmin

After the installation has completed, Webmin will give you a URL to visit to in order to access the web panel. This URL will be in the form of `https://hostname:10000`, where `hostname` is the host name of your Linode. You should use your Linode's IP or a domain pointed at your Linode to access Webmin if your Linode does not have a Fully Qualified Domain Name (FQDN) such as `myserver.mydomain.com`.

For security reasons, Webmin generates a self-signed SSL certificate for itself when you install it. If you get a warning about an SSL certificate from your browser, you may wish to verify the details of the certificate and accept it.

You will be presented with a login screen; enter your root user credentials.

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the [Webmin development mailing list](http://www.webmin.com/mailing-devel.html) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

When upstream sources offer new releases, repeat the instructions for installing the Webmin software as needed. These practices are crucial for the ongoing security and functioning of your system.

Configuring Webmin
------------------

We recommend you change the port Webmin runs on to something other than 10000. To do this, select the "Webmin" tab from the menu on the left and click "Webmin Configuration" from the submenu. Select "Ports and Addresses" from the control panel, and change the "Listen on Port" to a port that you will remember. When you click the "Save" button, Webmin will change the port it runs on and redirect you to the new page. You are now free to configure the rest of your services with Webmin!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Webmin Home Page](http://www.webmin.com/)
- [Webmin Documentation](http://doxfer.com/Webmin)
- [Webmin Modules](http://doxfer.com/Webmin/Modules)
- [Webmin FAQ](http://www.webmin.com/faq.html)
- [Webmin Tutorials](http://doxfer.com/Webmin/Tutorials)




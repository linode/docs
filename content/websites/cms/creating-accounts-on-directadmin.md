---
author:
  name: Chris Ciufo
  email: docs@linode.com
description: Creating Accounts on DirectAdmin
keywords: ["directadmin", " reseller", " accounts"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/control-panels/directadmin/directadmin-accounts/']
modified: 2013-10-03
modified_by:
  name: Linode
published: 2011-11-02
title: Creating Accounts on DirectAdmin
deprecated: true
---

[DirectAdmin](http://directadmin.com) is a commercial web-based control panel for server systems. It can help ease the burden of common system administration tasks such as website creation, database deployment and management, and more. This article will show you how to create a reseller account on DirectAdmin.

Create a Reseller Package
-------------------------

Before you can create a reseller account on your DirectAdmin Linode, you'll need to set up a package for resellers through your admin login. The first thing you need to do is log into your DirectAdmin panel with your admin user. Then, click on the "Manage Reseller Packages" link under the Server Management section. You'll then need to click the "Add Package" link near the top of the page. You'll want to fill in the form with the limits you wish to impose on the reseller plan you are creating. An example of the completed form is shown here:

[![DirectAdmin Add Package screen.](/docs/assets/843-AddPackage.png)](/docs/assets/843-AddPackage.png)

Create a Reseller Account
-------------------------

Once you have your reseller package created, you can move onto creating your reseller's account. Click the Home icon at the top of the page, then the "Create Reseller" link in the Server Management section. You'll want to fill in the form presented with your reseller client's information:

[![DirectAdmin Create Reseller screen.](/docs/assets/844-CreateReseller.png)](/docs/assets/844-CreateReseller.png)

Make sure you use a valid email address as the DirectAdminsystem will email your reseller their account details! That email will look similar to this:

    Dear Customer,

       Thank you for making us a partner in your web hosting venture.

    Your reseller account has been created with the following details:

    Username:       myuser
    Password:       S0HodzLr
    Domain:         tomydomain.com

    To log in immediately, follow this link, using your username and password:

    http://12.34.56.78:2222

    Once your domain resolves, you will be able to follow this link:

    http://www.mydomain.com:2222

    Bandwidth:      5000 Megabytes
    Disk Space:     1000 Megabytes

    Virtual Domains:        10
    Subdomains:     100

    Number of IPs:  0

    You must use these dns servers for your domain. They can be changed through your domain registrar.

    NS1:    ns1.linode.com
    NS1 IP: 162.159.27.72
    NS2:    ns2.linode.com
    NS2 IP: 162.159.24.39

    POP Email Accounts:     100
    Email Forwarders:       0
    Email Autoresponders:   0
    Email Mailing Lists:    10
    POP Server:     mail.mydomain.com
    SMTP Server:    Your ISP's outgoing mail server
    Login:  myuser2
    Password:       S0HodzLr

    FTP accounts:   1
    Anonymous FTP:  OFF
    FTP Server:     ftp.mydomain.com
    Login:  myuser2
    Password:       S0HodzLr

    IP:     12.34.56.78
    Use 12.34.56.78/~myuser to access it until the domain resolves.

    SSH Access for your users:      OFF
    SSH Access:     OFF
    Overselling:    ON
    MySQL Databases:        20
    Domain Pointers:        unlimited
    Secure Socket Layer:    ON
    CGI:    ON
    PHP:    ON
    DNS control:    OFF
    Once again, thank you for partnering with us.
    Please don't hesitate to contact us if you have any questions

Create a User Package
---------------------

You can create user accounts either through the admin login or any reseller login. If you are logged into the DirectAdmin panel with your Admin login, just click the "» Reseller Level" link located on the top right of the panel. You'll need to create a package for your user accounts, so you'll want to first click the "Add Package" link under the Account Management section. You'll want to fill in the form with the limits you wish to impose on the user account plan you are creating. An example of the completed form is shown here:

[![DirectAdmin Add User Package screen.](/docs/assets/845-AddUserPackage.png)](/docs/assets/845-AddUserPackage.png)

Create a User Account
---------------------

Once you have your user package created, you can move onto creating your user's account. Click the Home icon at the top of the page, then the "Add New User" link in the Server Management section. You'll want to fill in the form presented with your reseller client's information:

[![DirectAdmin Create Reseller screen.](/docs/assets/844-CreateReseller.png)](/docs/assets/844-CreateReseller.png)

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [DirectAdmin Home Page](http://directadmin.com)
- [DirectAdmin Support](http://www.directadmin.com/support.html)
- [DirectAdmin Knowledgebase](http://help.directadmin.com/)
- [DirectAdmin Third Party Plugins](http://www.directadmin.com/forum/showthread.php?t=19688)




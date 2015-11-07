---
author:
    name: Douglas Colby
    email: admin@mulps.pw
description: ‘How to Install Open Web Analytics on CentOS 6.5 and 7’
keywords: ‘open, web, analytics,’
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 
modified: 
modified_by:
    name: 
title: 'Open Web Analytics (OWA) on CentOS 6.5 and 7'
contributor:
    name: Douglas Colby
external_resources:
 - '[OWA Website](http://www.openwebanalytics.com)'
 - '[OWA Forum](http://www.openwebanalytics.com/?page_id=4)'
---

##How to Install Open Web Analytics on CentOS 6.5 and 7 (with MySQL back-end)

Open Web Analytics (OWA) is an open source alternative to commerical web analytics software. Use it to track and analyze traffic on your websites and applications. OWA analytics can easily be added to pages with simple Javascript, PHP, or REST based APIs. OWA also comes with built-in support for tracking websites made with popular content management frameworks such as WordPress and MediaWiki.


This guide assume that you have your Linode already set up and running and that you are familiar with the concept of the command line interface (CLI). Since this guide concerns the installation and configuration of software packages all commands are to be run as the root user.

##1. Install supporting software

1. Install the supporting software packages by running the following command:

    yum install httpd php php-mysql mysql mariadb-server

{: .note}
>
>`yum` will not reinstall packages that already exist on the system. Therefore this command is safe to run even if you have some of the software installed already. 

2. Always a good idea to make sure your system is up-to-date:

    yum update

##2. Set up MySQL

1. Run the following (if you are on CentOS 6.5 skip to the next command):

    chkconfig mariadb on

2. Then (if you already have mysql installed you can skip this step):

    mysql_secure_installation

Answer yes to all questions -- make sure to set a strong password for root (press enter when prompted for current root password since it is initially blank). This is the root user for mysql and is not related the systems root user.

3. Next run the following. Enter your mysql root password when asked:
 
    mysql -u root -p

4. The following SQL commands will create a database named `owadb` with a user named `owadbuser` and with the password `owadbpassword`. Be sure to change the password to something better of your own choice. This information will be needed later to configure OWA.

    CREATE DATABASE owadb;
    GRANT ALL PRIVILEGES ON owadb.* TO owadbuser@localhost IDENTIFIED BY 'owadbpassword';
    FLUSH PRIVILEGES;
    quit

5. Now you need to restart your Linode:

    reboot

##3. Install OWA

1. Once your Linode comes back up, navigate to your document root folder for your webserver, usually `/var/html/www`:

    cd /var/www/html

2. Now download the OWA package:

    wget https://github.com/padams/Open-Web-Analytics/archive/1.5.7.tar.gz

{: .note}
>
>The number 1.5.7 is the current version and may be different by the time you read this. Please check http://www.openwebanalytics.com/ for the latest information.

3. Unpack it:

    tar xf 1.5.7.tar.gz

4. Delete tar file (you may want to wait until everything is finished and working before you do this just in case you need to a fresh version of the OWA files):

    rm -rf 1.5.7.tar.gz

5. Change ownership of the `owa` folder to apache (assuming you are running Apache, if not change it to your httpd’s user).

    chown -R apache:apache Open*

6. Rename the OWA folder to something reasonable:

    mv Open-Web-Analytics-1.5.7 owa

##4. Configure OWA

1. Now navigate to the installation in your webbrowser. (Replace `your.domain` with the domain of your Linode):

    http://your.domain/owa/install.php

2. You should see a configuration page for your OWA installation. The first field will be filled in by OWA with the path to your OWA installation. The other fields on the page should be filled in as follows:
 
	Database Host: localhost

	Database Name: owadb

	Database User: owadbuser

	Database Password: owadbpassword

Of course, `owadbpassword` should be the password with which you created your SQL database in step 2.4.

![Screen shot of OWA set up screen.](/docs/assets/OWA.png)

3. Click "Continue..." and create a user account on the next page. This user account will be how you log in to see your OWA statistics.

##5. Using OWA

You will need to create site profiles and add JavaScript or PHP code to your website pages to use OWA.

1. Log in to your OWA installation. In your browser go to

    http://your.domain/owa/index.php
	
2. This will take you to the Sites Roster page. Click "Add New" at the top left of the page.

3. On the resulting page you will see, near the top, a section named "Add a New Tracked Site Profile". Enter the domain name of the site you want to track and click Save Profile. The other two fields are for your information only and are therefore optional.

{: .caution}
>
>You must click "Save Profile" before trying to enter any of the settings below this button. Failure to do so will result in a blank white page and your new site not being added. Recovery simply requires a click of the back button in your browser.

4. Click on "Reporting" in the top left corner to return to the Sites Roster page. In the list of tracked sites find your new site and click "Get Tracking Code".

5. Copy the tracking code in the language of your choice (JavaScript or PHP) and paste the code into your websites' pages. Now whenever someone loads a page with the tracking code OWA will know about it and the data will show up in the reports.

6.  Click "View Reports" in the Sites Roster page and happy analysing! 



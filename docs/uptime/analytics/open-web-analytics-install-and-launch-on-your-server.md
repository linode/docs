---
author:
    name: Linode Community
    email: contribute@linode.com
description: 'Install Open Web Analytics (OWA) on CentOS 6.5, 7, Debian or Ubuntu with this guide.'
keywords: ‘open web analytics,owa,Centos,mysql,debian,ubuntu’
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-01-05
modified: 2016-01-05
modified_by:
    name: Alex Fornuto
title: 'Open Web Analytics (OWA): Install & Launch on Your Server'
contributor:
    name: Douglas Colby
external_resources:
 - '[OWA Website](http://www.openwebanalytics.com)'
 - '[OWA Forum](http://www.openwebanalytics.com/?page_id=4)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

Open Web Analytics (OWA) is an open-source alternative to commercial web analytics software. Use it to track and analyze traffic on your websites and applications. OWA analytics can easily be added to pages with simple Javascript, PHP, or REST based APIs. OWA also comes with built-in support for tracking websites made with popular content management frameworks such as WordPress and MediaWiki.

## Before you Begin

1.  This guide assumes that you have your Linode already set up and running, that you have followed:

     - The [Getting Started](/docs/getting-started) guide.
     - The [Securing Your Server](/docs/security/securing-your-server) guides.
     - That the Linode's [hostname is set](/docs/getting-started#setting-the-hostname) and has a FQDN.


    {{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

Your server must be configured with a fully qualified domain name (FQDN) and not just an IP address. If needed, you can use the address provided in the Remote Access Tab next to your public IP address.
{{< /note >}}


2.  Make sure your system is up-to-date:

    - **CentOS**

          yum update

    - **Debian & Ubuntu**

          apt-get update && apt-get upgrade

3.  Install the supporting software packages:

    - **CentOS**

          yum install httpd php php-mysql mysql-server mariadb-server

      {{< note >}}
This command is designed to work with CentOS 6, which uses MySQL as the default database and CentOS 7 which uses MariaDB. You will get a notice when installing that the other package is not available.
{{< /note >}}

    - **Debian & Ubuntu**

          apt-get install apache2 php5 php5-mysql mysql-server

4.  CentOS users will need to enable and activate the `httpd` and `mariadb` services:

    - **CentOS 7**

          systemctl enable mariadb
          systemctl start mariadb
          systemctl enable httpd
          systemctl start httpd

    - **CentOS 6**

          chkconfig mysqld on
          service mysqld start
          chkconfig httpd on
          service httpd start

    Debian and Ubuntu users will need to restart the Apache2 daemon:

        service apache2 restart

## Set up MySQL

1.  Run `mysql_secure_installation` to secure your database:

        mysql_secure_installation

    You should answer yes to most of the prompts. CentOS users, make sure to set a strong password for the root user since it is initially blank. This is the root user for `mysql` and is not related to the system's root user.

2.  Enter the MySQL CLI:

        mysql -u root -p

    You'll need to enter the password you set in the step above, or when you installed `mysql-server`.

3.  Create a database named `owadb`:

        CREATE DATABASE owadb;

4.  Create a user named `owadbuser`. Replace the example password, `owadbpassword`, with a strong password of your choice. This information will be needed later to configure OWA.

        GRANT ALL PRIVILEGES ON owadb.* TO owadbuser@localhost IDENTIFIED BY 'owadbpassword';

5.  Exit the MySQL CLI:

        FLUSH PRIVILEGES;
        quit

## OWA

### Install

1.  Navigate to your document root folder for your webserver, usually `/var/www/html` by default.:

        cd /var/www/html

2.  Download the OWA package:

        wget https://github.com/padams/Open-Web-Analytics/archive/1.5.7.tar.gz

    {{< note >}}
Version 1.5.7 is the current version and may be different by the time you read this. Please check [The Open Web Analytics](http://www.openwebanalytics.com/) site for the latest information.
{{< /note >}}

3.  Unpack the downloaded file:

        tar xf 1.*.tar.gz

4.  Change ownership of the `owa` folder to the Apache daemon user:

    - **CentOS**

          chown -R apache:apache Open*

    - **Debian & Ubuntu**

          chown -R www-data:www-data Open*

5.  **Recommended:** Rename the OWA folder:

        mv Open-Web-Analytics-1.5.7 owa

6.  Delete the tar file:

        rm -rf 1.*.tar.gz

### Configure

1.  Navigate to the OWA installation page in your webbrowser. Replace `your.domain` with your Linode's IP address or FQDN:

        http://your.domain/owa/


2.  After clicking on **Let's Get Started**, you should see a configuration page for your OWA installation. OWA will automatically fill in the first field with the path to your OWA installation. You will need to fill in the other fields on the page with the information you set in the MySQL CLI:

    [![Open Web Analytics set up screen.](/docs/assets/owa-install_small.png)](/docs/assets/owa-install.png)

3.  Click **Continue...**.

4.  Create a user account and define a domain to track. You will log in to see your OWA statistics through this user account.

    {{< caution >}}
This process will display your password in plaintext once complete. Be careful if performing these steps in a public location.
{{< /caution >}}

## Using OWA

You will need to create site profiles and add JavaScript or PHP code to your website pages to use OWA.

1.  Log in to your OWA installation. In your browser go to:

        http://your.domain/owa/index.php

2. The first time you login OWA will present you with a tracking tag (a code snippet) for the domain you defined when you created your user account. This code should be added to the html pages of the site you wish to track.

3. Once the tracking tag has been added to your website pages, analysis data can be viewed under the "Reporting" section (click the button at the top of the page) which will take you to the Sites Roster page.

4. To add more sites to track, click "Add New" at the top left of the page.

5.  On the resulting page you will see near the top a section named "Add a New Tracked Site Profile". Enter the domain name of the site you want to track and click Save Profile. The other two fields are for your information only and are, therefore, optional.

    {{< caution >}}
You must click "Save Profile" before trying to enter any of the settings below this button. Failure to do so will result in a  blank white page and your new site not being added. Recovery simply requires a click of the back button in your browser.
{{< /caution >}}

6.  Click on "Reporting" in the top left corner to return to the Sites Roster page. In the list of tracked sites, find your new site and click "Get Tracking Code".

7.  Copy the tracking code in the language of your choice (JavaScript or PHP) and paste the code into your websites' pages. Now whenever someone loads a page with the tracking code, OWA will know about it and the data will show up in the reports.

8.  Click "View Reports" in the Sites Roster page and begin happy analyzing!

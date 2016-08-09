---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to Setup AskBot Question and Answer Forum on CentOS 7'
keywords: 'askbot,askbot setup,askbot install,askbot configure,'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: '9th, August, 2016'
modified: 9th, August, 2016
modified_by:
  name: Linode
title: 'How to Setup AskBot Question and Answer Forum on CentOS 7'
contributor:
  name: Gopal Raha
  link: https://github.com/gopalraha/
  external_resources:
- '[AskBot Documentation](http://askbot.org/doc/index.html)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

## Introduction

Askbot is a question and answer web forum and it looks like StackOverflow Q&A web forums. It is based on Django web framework and written in Python programming language. It is an open source Q&A web forum project maintained and developed by Evgeny Fadeev. Some most popular open source projects like Ask-Fedora and Ask-LibreOffice uses the AskBot to provide support for their users and clients. This project is funded by open source community like Document Foundation to support the development of Askbot. 

AskBot has a responsive layout works with all of the devices and it has professional design. The Source code of AskBot is available at Github known as askbot-devel. It is scalable and works with all large projects with ease. This guide includes setup of AskBot using Apache Web Server with Mod WSGI module, MariaDB Database Server, required library packages and Python modules that is required. In order to accomplish the task you need to follow all the steps carefully. 

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  A CentOS 7 Server.

4.  Update your CentOS 7 system.

        sudo yum update && sudo yum upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Example IP Addresses

Example IPs has used in this documentation address blocks given in IETF RFC 5737. These are:

   192.162.0.1/80

## Install the required packages for AskBot

1. It requires python packages for that we need EPEL repository that contains extra packages. To enable the EPEL repository.

        $ sudo yum install epel-release -y

2. In this step we will install all the required packages from the official CentOS Base Repository and EPEL Repository. We are going to install the Apache Web Server with Mod WSGI module. We will install MariaDB Database Server and required libraries packages. Also we are dealing with python packages for that we will install the Python package manager known as PIP to install required Python modules and Packages. We can install the required packages using yum command.

        $ sudo yum install python-pip python-devel mariadb-server mariadb-devel gcc httpd mod_wsgi -y

## MariaDB Database Configuration for AskBot

1. When installation has done, you can start the MariaDB services.

        $ sudo systemctl start mariadb

2. After that you can enable the MariaDB services to run at every boot.

        $ sudo systemctl enable mariadb

3. You need to run the MySQL secure installation script to set the MariaDB server for production Use:

        $ sudo mysql_secure_installation

   You will be asked for root password, which is blank by default just hit the ENTER to continue. 

        Enter current password for root (enter for none): 
        OK, successfully used password, moving on...

    Afterwards, you will be asked to set the root password, set a strong root password for better security

        Set root password? [Y/n] Y
        New password: 
        Re-enter new password: 
        Password updated successfully!
        Reloading privilege tables..
        ... Success!

    By default there is anonymous user access to MariaDB server just remove it to secure the database for production environment.

        Remove anonymous users? [Y/n] Y
        ... Success!

    To work successfully with python app you should enable the root login remotely for MariaDB.

        Disallow root login remotely? [Y/n] n
        ... skipping.

    By default there is test database and access to MariaDB server just removing it to secure the database for production environment.

        Remove test database and access to it? [Y/n] Y
        - Dropping test database...
        ... Success!
        - Removing privileges on test database...
        ... Success!

    Finally reload the privilege table to enable all the above settings.

        Reload privilege tables now? [Y/n] Y
        ... Success!
        Cleaning up...

4. You will be prompted for the root password just entering the root password to enter the interactive session with MariaDB database.

        $ sudo mysql -u root –p

    First of all we will create a database ‘askbot’ for AskBot project. We'll set UTF-8 for the database this is required by Askbok.

        MariaDB [(none)]> CREATE DATABASE askbot CHARACTER SET UTF8;

    Next, we will create a database user ‘askbotuser’ which we will use to to interact with the MariaDB database. Ensure that Password is strong. 

        MariaDB [(none)]> CREATE USER askbotuser@localhost IDENTIFIED BY 'YOURSTRONGPASSWORD';	

    Now, grant all privileges to DB user ‘askbotuser’ to ‘askbot’ database

        MariaDB [(none)]> GRANT ALL PRIVILEGES ON askbot.* TO askbotuser@localhost;

    Flush all the changes

        MariaDB [(none)]> FLUSH PRIVILEGES;

    Exit from MariaDb prompt

        MariaDB [(none)]> EXIT

5. Finally restart the MariaDB Server to accept all changes.

        $ sudo systemctl restart mariadb

## Install AskBot within a Python Virtual Environment

1. Change the Directory where python virtual environment is to be installed

        $ cd /var/www/

2. Now, upgrade the Python PIP packges

        $ sudo pip install --upgrade pip

3. Now install the Python virtual environment to create the virtual environment where askbot should be installed.

        $ sudo pip install virtualenv

4. Create the virtual environment directory where we can store the python packages.

        $ sudo virtualenv ask

5. Now activate the python virtual environment.

        $ sudo source ask/bin/activate

6. After activating python virtual environment we can install Askbot using PIP installation methods. Also it is required to install the mysqlclient and mysql-python packages to interact with the MariaDB database. We are going to install the Askbot version 0.7.56 which is stable version according to official python pypi packages.

        (ask) $ sudo pip install askbot==0.7.56 mysqlclient mysql-python

7. After that install the Askbot on current directory

        (ask) $ sudo askbot-setup

    Install the Askbot on current directory enter the .

        Enter directory path (absolute or relative) to deploy
        askbot. To choose current directory - enter "."
        > .

    Select the database MySQL you must select 3

        Please select database engine:
        1 - for postgresql, 2 - for sqlite, 3 - for mysql, 4 - oracle
        type 1/2/3/4: 3

    Enter the database Name

        Please enter database name (required)
        > askbot

    Enter the database User

        Please enter database user (required)
        > askbotuser

    Enter the database Password

        Please enter database password (required)
        > YOURSTRONGPASSWORD

## AskBot Configuration

1. When we install askbot successfully then we need to configure it to use with the MariaDB database. We should modify the settings.py file located in installation directory.

        (ask) $ vi settings.py

    Find the Database lines. First of all add localhost in front of host. Final edit looks like given here.

{: .file }
/var/www/settings.html
:   ~~~ py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'askbot',                      # Or path to database file if using sqlite3.
        'USER': 'askbotuser',                      # Not used with sqlite3.
        'PASSWORD': 'YOURSTRONGPASSWORD',                  # Not used with sqlite3.
        'HOST': 'localhost',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
        'TEST_CHARSET': 'utf8',              # Setting the character set and collation to utf-8
        'TEST_COLLATION': 'utf8_general_ci', # is necessary for MySQL tests to work properly.
    }
} 
    ~~~

To save and exit type **:wq** and hit **ENTER**

2. Now copy the WSGI application file

        (ask) $ cp -rv django.wsgi wsgi.py

3. Now collect all files like (.css and .js files) that are static content into base directory location.

        (ask) $ python manage.py collectstatic

4. Now we can synchronize the data structures to MariaDB database.

        (ask) $ python manage.py syncdb

{: .note}
>
>Note: When it asks for superuser defined your answer is NO. We can create the superuser after configuring askbot successfully.

        You just installed Django's auth system, which means you don't have any superusers defined.
        Would you like to create one now? (yes/no): no

5. We can begin by applying all the migrations to MariaDB database.

    Applying AskBot migrations

        (ask) $ python manage.py migrate askbot

    Applying Django AuthopenID migrations

        (ask) $ python manage.py migrate django_authopenid 

    Applying remaining migrations

        (ask) $ python manage.py migrate

6. Finally it’s time to run the AskBot development server on port 80. which checks and ensures that everything works fine:

        (ask) $ python manage.py runserver 192.162.0.1:80

7. Now open Web Browser and the AskBot website is working at
 
        http://192.162.0.1:80

8. Now Askbot appears in your browser. 
  
  https://www.dropbox.com/s/uppinbkpgv9hd0r/1.png?dl=0

    Create a new account at the site this will be your administrator account
  
  https://www.dropbox.com/s/ha13f1y6gs6yd36/2.png?dl=0
  https://www.dropbox.com/s/xtivl403837vu0u/3.png?dl=0

    After completing all check you can stop the development server by hitting CONTROL + C button.

    Now deactivate the python Virtual environment

        (ask) $ deactivate

## Configure the Apache Web Server for AskBot

1. Create virtual Host Directory

        $ sudo mkdir /etc/httpd/sites-available
        $ sudo mkdir /etc/httpd/sites-enabled

2. Enable Virtual Host to work with Apache

        $ sudo vi /etc/httpd/conf/httpd.conf

    Add these after last line.

        IncludeOptional sites-enabled/*.conf

3. Now configure the WSGI pass using Apache virtual host. This will serve your askbot website directly by using apache on port 80. Also we have use daemon mode to run the WSGI process that is recommended method to run python based apps using wsgi.py file. The Apache mod_wsgi is the most resource efficient apache handler for the Python or Django web applications. 

        $ sudo vi /etc/httpd/sites-available/askbot.conf

    Add the given lines

{: .file }
/etc/httpd/sites-available/askbot.html
:   ~~~ conf
<VirtualHost *:80>
DocumentRoot /
Alias /upfiles/ /var/www/askbot/upfiles/
Alias /static/ /var/www/static/
 <Directory "/var/www/askbot/upfiles">
    Order deny,allow
    Allow from all
 </Directory>
 <Directory "/var/www/static/">
    Order allow,deny
    Allow from all
 </Directory>
 <Directory /var/www/ >
        <Files wsgi.py>
            Require all granted
        </Files>
 </Directory>
WSGIDaemonProcess askbot python-path=/var/www/:/var/www/ask/lib/python2.7/site-packages
WSGIProcessGroup askbot
WSGIScriptAlias / /var/www/wsgi.py
</VirtualHost>
    ~~~
 
To save and exit type **:wq** and hit **ENTER**

4. Create Symbolic link of virtual host file
   
        $ sudo ln -s /etc/httpd/sites-available/askbot.conf /etc/httpd/sites-enabled/askbot.conf

5. Now Turn off the Debug Mode Serve the Static file from Directory

        $ vi settings.py

    Find the given lines

        DEBUG = True  # set to True to enable debugging

    Change it to 

        DEBUG = False  # set to True to enable debugging

    Find the given lines

        STATIC_URL = '/m/'#this must be different from MEDIA_URL

    Change it to 

        STATIC_URL = '/static/'#this must be different from MEDIA_URL

    To save and exit type **:wq** and hit **ENTER**

6. Add the Server IP and Fully Qualified Domain NAME (FQDN) to host file

        $ sudo vi /etc/hosts
  
    Add your Server IP and FQDN
  
        # The following lines are desirable for IPv4 capable hosts
        127.0.0.1 askbot askbot 
        127.0.0.1 localhost.localdomain localhost
        127.0.0.1 localhost4.localdomain4 localhost4

        192.162.0.1 YOUR-FQDN
  
        # The following lines are desirable for IPv6 capable hosts
        ::1 askbot askbot
        ::1 localhost.localdomain localhost
        ::1 localhost6.localdomain6 localhost6

## Dealing with Apache Permissions

1. Add ownership of the directory with your-username to Apache group so that it runs under the apache group, group ownership of the file look like you must change the username.

        $ sudo chown -R your-username:apache /var/www

2. You must provide read and write permission to the directory.

        $ sudo chmod -R g+w /var/www/askbot/upfiles
        $ sudo chmod -R g+w /var/www/log

3. When all steps are done finally restart your apache services

        $ sudo systemctl restart httpd

4. You can enable the Apache service so that it starts automatically at every boot

        $ sudo systemctl enable httpd   

5. Now open the web browser and open it with your FQDN to see your website live.

        http://<Your-FQDN>
        
       https://www.dropbox.com/s/09no48uk5fpzpb8/4.png?dl=0

6. Check whether all all are working properly with log files

        $ sudo cat /var/log/httpd/access_log 

## More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

[AskBot Documentation](http://askbot.org/doc/index.html)

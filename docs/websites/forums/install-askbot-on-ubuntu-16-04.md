---
author:
  name: Gopal Raha
  email: gopalraha@outlook.com
description: 'How to Install and Deploy Askbot Question and Answer Forum with LetsEncrypt SSL on Ubuntu 16.04'
keywords: 'askbot, question and answer forum'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Sunday, August 20th, 2017
modified_by:
  name: Gopal Raha
published: 'Sunday, August 20th, 2017'
title: 'Install AskBot with LetsEncrypt on Ubuntu 16.04'
contributor:
  name: Gopal Raha
  link: https://github.com/gopalraha
external_resources:
 - '[AskBot Documentation](https://askbot.org/doc/index.html)'
 - '[AskBot Official Q&A Forum](https://askbot.org)'
 - '[AskBot Official Website](https://askbot.com)'
---    

[AskBot](https://askbot.com) is an open source question and answer forum written in Django web framework and Python. It provides features similar to StackOverflow including a karma based system, voting, content moderation, etc. It is used by popular open source communities like [Ask Fedora](https://ask.fedoraproject.org/en/questions/) and [OpenStack](https://www.openstack.org/).

In this guide, you'll install Askbot with nginx as a web server, MySQL as a database server, Gunicorn as a Python WSGI HTTP Server and LetsEncrypt as a free SSL certificates provider.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:
    	
        sudo apt update && sudo apt upgrade

4.  A Fully-Qualified Domain Name configured to point to your Linode. You can learn how to point domain names to Linode by following the How to [Add DNS records with Linode](/docs/networking/dns/dns-manager-overview#add-records) guide.

{: .note}
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
 
## Installing Required Packages and Creating Database for AskBot

1.  First install the required packages:

	    sudo apt install python-pip python-dev nginx mysql-server libmysqlclient-dev letsencrypt

2.  Log in to MySQL as the root user:
        
        sudo mysql -u root -p

3.  When prompted, enter the root password.

4.  Create a New MySQL User and Database. In below, `askbotdb` is the name of the database, `dbuser` is the database user, and `dbpassword` is the database user’s password.

        CREATE DATABASE askbotdb CHARACTER SET UTF8;
        CREATE USER dbuser@localhost IDENTIFIED BY 'dbpassword';
        GRANT ALL PRIVILEGES ON askbotdb.* TO dbuser@localhost;
        FLUSH PRIVILEGES;
	
5.  Exit MySQL.

        exit

## Installing AskBot

1.  Create a Directory to install the AskBot. In below, `/home/askadmin/askbot` is the location of AskBot installation directory. The user name `askadmin` is used as an example.

        mkdir -p /home/askadmin/askbot

2.  In below we are using the pip to install the python packages now upgrade the **pip** to latest version. 

        sudo pip install --upgrade pip

3.  Now setup the isolated Python virtual environment by installing the **virtualenv** using pip.

        sudo pip install virtualenv

4.  Create a Python virtual environment using **virtualenv** command. In below, `/home/askadmin/askbot/askbotenv` is the location of Python virtual environment.
	
        virtualenv /home/askadmin/askbot/askbotenv

5.  After that Activate the Python virtual environment using **source** command. In below, `/home/askadmin/askbot/askbotenv/bin/activate` is the location of source file that is used to activate the Python virtual environment

        source /home/askadmin/askbot/askbotenv/bin/activate

6.  The **pip** is the best tool to install Askbot and its dependencies like mysqlclient, mysql-python and gunicorn. 

        pip install askbot mysqlclient mysql-python gunicorn

## Configuring AskBot 

1.  Initialize the AskBot setup files by typing command **askbot-setup** . After that In below, **-n** `/home/example_user/askbot/` is the installation location of AskBot, **-e** `3` is the MySQL database type, **-d** `askbotdb` is the name of database, **-u** `dbuser` is the database user, and **-p** `dbpassword` is the database password.

        askbot-setup -n /home/askadmin/askbot/ -e 3 -d askbotdb -u dbuser -p dbpassword

    {: .note}
    > **askbot-setup** command line arguments with more detail for each parameter is available when you type command **askbot-setup –h** 

2.  After that run command collectstatic to place all the static files like (css,js,etc) into AskBot installation directory. In below `/home/askadmin/askbot/manage.py` is the location of **manage.py** file.

        python /home/askadmin/askbot/manage.py collectstatic --noinput

3.  When you install Askbot the first time and anytime when you upgrade the Askbot, you should run these **makemigrations** and **migrate** commands. In below `/home/askadmin/askbot/manage.py` is the location of **manage.py** file.

        python /home/askadmin/askbot/manage.py makemigrations
        python /home/askadmin/askbot/manage.py migrate

4.  Now Turn off the Debug mode in **settings.py** from `True` to `False` to run AskBot in the production environment. In below `/home/askadmin/askbot/settings.py` is the location of **settings.py** file.

        sed -i "s|DEBUG = True|DEBUG = False|" /home/askadmin/askbot/settings.py

5.  After that change the URL of static files (css,js,etc) from `/m/` to `/static/`. In below `/home/askadmin/askbot/settings.py` is the location of **settings.py** file.

        sed -i "s|STATIC_URL = '/m/'|STATIC_URL = '/static/'|" /home/askadmin/askbot/settings.py

## Deploy Askbot with Letsencrypt SSL

1.  We passed **Gunicorn** a module by specifying the relative directory path to **wsgi.py** file, which is used to communicate with the Askbot application. Edit your `wsgi.py` file to add the following lines:

    {: .file-excerpt}
    /home/askadmin/askbot/wsgi.py
    :   ~~~ conf
    import os
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    ~~~

2.  **Gunicorn** can interact with our Askbot application, but we should implement starting and stopping of Gunicorn app. To do this, we'll make a Systemd service file. In below `/home/askadmin/askbot` is the working directory of AskBot, `/home/askadmin/askbot/askbotenv/bin/gunicorn` is the location of Gunicorn application, `unix:askbot.sock` is the askbot sock file. Add the following lines go `gunicorn.service`, and make sure you should replace the `askadmin` user with your desired username.

        {: .file-excerpt}
        /etc/systemd/system/gunicorn.service
        :   ~~~ conf
        [Unit]
        Description=gunicorn daemon
        After=network.target

        [Service]
        User=askadmin
        Group=www-data
        WorkingDirectory=/home/askadmin/askbot
        Environment="PATH=/home/askadmin/askbot/askbotenv/bin"
        ExecStart=/home/askadmin/askbot/askbotenv/bin/gunicorn --workers 3 --bind unix:askbot.sock wsgi:application

        [Install]
        WantedBy=multi-user.target
        ~~~

3.  Now start the Gunicorn service and enable it so that it starts automatically at every boot:

        sudo systemctl start gunicorn
        sudo systemctl enable gunicorn

4.  After that restart the nginx and reload the daemon

        sudo systemctl daemon-reload
        sudo systemctl restart nginx

5.  Now get the [Letsencrypt SSL](/docs/security/ssl/install-lets-encrypt-to-create-ssl-certificates) for your Domain . In below, `admin@example.com` is your email address and `example.com` is your domain name and `www.example.com` is your sub-domain name.

{: .note}
>You should point your Fully-Qualified Domain Name to your Linode this is the required step to get Letsencrypt SSL certificates for your domain name. You can learn how to point domain names to Linode by following the How to [Add DNS records with Linode](/docs/networking/dns/dns-manager-overview#add-records) guide.

	sudo letsencrypt certonly -a webroot --agree-tos --email admin@example.com --webroot-path=/var/www/html -d example.com -d www.example.com

6.  Disable the default nginx welcome site and enable your Askbot site:

        unlink /etc/nginx/sites-available/default
        cp /etc/nginx/sites-available/default /etc/nginx/sites-available/askbot
        rm /var/www/html/index.nginx-debian.html

7.  Add new `askbot` Nginx Server Blocks (Virtual Host) to run AskBot in Production Environment. In below, `example.com` is your domain name and `www.example.com` is your sub-domain name, `/home/askadmin/askbot` is the working directory of AskBot, `unix:/home/askadmin/askbot/askbot.sock` is the location of askbot sock file, `/home/askadmin/askbot/askbot` is the location of askbot media files  (Images, Attachments, etc.) in **upfiles** directory and `/home/askadmin/askbot` is the location of askbot static files (CSS, JS, etc.) in **static** directory.

        {: .file-excerpt}
        /etc/nginx/sites-available/askbot
        :   ~~~ conf
        server {
                listen 80;
                server_name example.com www.example.com;
                return    301 https://$server_name$request_uri;
        }
        
        server {
                listen 443;
                server_name example.com www.example.com;
                
        	 ssl on;
                ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
                ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
                ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
                
        	location ~ /.well-known {
                allow all;
                root /var/www/html;
                }

                location = /favicon.ico { access_log off; log_not_found off; }
                location /static/ {
                root /home/askadmin/askbot;
                }
        	
                location /upfiles/ {
                root /home/askadmin/askbot/askbot;
                }
        	
                location / {
                include proxy_params;
                proxy_pass http://unix:/home/askadmin/askbot/askbot.sock;
                }
        }
        ~~~

Press **CTRL+O** to write then hit **ENTER** to save the file then **CTRL+X** to exit the program.

8.  Add symbolic link between nginx server blocks

        sudo ln -s /etc/nginx/sites-available/askbot /etc/nginx/sites-enabled

9.  The **www-data** group must have access to Askbot installation directory so that nginx can serve static files, media files, access the socket files, etc. So we will add the `example_user` to **www-data** group so that it can open up with necessary permissions. In below replace `example_user` with your desired username: 

        sudo usermod -aG www-data example_user
	
10.  Finally restart nginx to make changes in effect

        sudo systemctl restart nginx

## Setup Askbot Admin Account

1.  Now open web browser and type your **domain name** `example.com` OR **sub-domain** `www.example.com`. You need to replace `example.com` OR `www.example.com` with your domain name.

![access askbot on web browser](/docs/assets/askbot-1.png)
	
2.  After that hit on **create a password-protected account** to create an Admin Account

![create a askbot admin account](/docs/assets/askbot-2.png)

{: .note}
>  The First account created using above method will be treated as **admin account** rest of them are normal accounts.

3.  Create a admin username and password of your choice. In below replace **screen name** with your desired `username`, **Email Address** with your desired `email address`, **Password** with your desired `password` as per your choice:

![create a admin username and password](/docs/assets/askbot-3.png)

4.  Now set your domain name with Askbot using base url settings by hitting on **APP_URL** from Askbot app:

![set your domain name to askbot base url settings](/docs/assets/askbot-4.png)

5.  In below Add your **domain name** `https://example.com/` OR **sub-domain** `https://www.example.com/` in the place of Base URL box after that hit on **Save** to save the configuration. In below you need to replace `https://example.com/` OR `https://www.example.com/` with your domain name.

![add your domain name to askbot base url settings](/docs/assets/askbot-5.png)

6.  Finally, Askbot is ready to run. Now get access to askbot admin interface customize it according to your usages. 

![final access to askbot forum](/docs/assets/askbot-6.png)

##Next Steps

Now you have an Askbot question and answer forum running on your Linode, it’s time to ask some questions and answers, and configure the various options that are available with AskBot. For detailed instructions, check out the [AskBot Documentation](https://askbot.org/doc/index.html).

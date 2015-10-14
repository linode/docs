---
author:
	name: Linode Community
	email: docs@linode.com
description: 'Manually install Odoo 9 on CentOS 7'
keywords: 'Odoo,CentOS 7,How To,ERP,CRM,OpenERP'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
	name: Linode
title: 'How To Install Odoo 9 ERP on CentOS 7.x'
contributor:
	name: Damaso Sanoja
	link: Github/Twitter Link
---

#How To Install Odoo 9 ERP on CentOS 7.x

Odoo (formerly known as OpenERP) is an open-source suite of business applications including: Customer Relationship Management, Sales Pipeline, Project Management, Manufacturing, Invoicing , Accounting, eCommerce and Inventory just to name a few. There are 31 main applications created by Odoo team and over 4,500+ developed by community members covering a wide range of business needs.

Once deployed, Odoo flexibility allows the administrator to install any module combination and configure/customize them at will to satisfy business needs ranging from a small shop to a Enterprise Level Corporation.

This Guide covers how to install and configure Odoo in just 30 minutes using Git source so it will be easy to upgrade, maintain and customize. 

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Prerequisites
1. Complete the [Getting Started](/docs/getting-started) guide. 
2. Follow the [Securing Your Server](/docs/security/securing-your-server/) guide. It's especially important to create and enable the firewall if you plan to deploy Odoo on a production site.
3. This Guide assumes a CentOS 7 "clean installation" in a Linode with a minimum of 1Gb of RAM and 4Gb swap space.

##System preparation

1. Log in to your Linode via SSH.
2. Install Epel Repository using `yum` package manager and then update your server.

		sudo yum install epel-release
		sudo yum update

###Install Database and server dependencies

1. Now we're going to install the PostgreSQL database and other necesary server libraries using `yum` 

		sudo yum install postgresql-server postgresql-devel python-devel python-pip bzr bzrtools libevent-devel libxslt-devel libxml2-devel cyrus-sasl-devel openldap-devel openjpeg xorg-x11-fonts-75dpi xorg-x11-fonts-Type1 libXext zlib-devel bzip2-devel openssl-devel tk-devel libjpeg-turbo-devel openjpeg-devel libtiff-devel libpng12 libyaml-devel

2. We'll also need to install Development Tools:

		sudo yum groupinstall "Development Tools"

3. Before moving forward, we'll upgrade `setuptools` and `pip` package manager to avoid conflicts during compilation:

		sudo easy_install -U setuptools

		sudo pip install --upgrade pip

###Create Odoo user and required directories

1. Create the Odoo system user.

		sudo adduser odoo -d /opt/odoo -r -U

2. Create the Odoo and log directory.

		sudo mkdir /opt/odoo		

		sudo mkdir /var/log/odoo

{: .note}
>
>In the scenario of running multiple Odoo versions on the same Linode you may want to use different users and directories for each instance.

###Install Odoo server files from source

1. Change to the Odoo directory, in our case:

		cd /opt/odoo/

2. Clone the Odoo files on your server.

		sudo git clone https://www.github.com/odoo/odoo --depth 1 --branch 9.0 --single-branch .

{: .note}
>
>Using git brings a great flexibility because any time a new upgrade is available you only need to pull that branch, you can even install a different one alongside the production version, just change the destination directory and the  `--branch X.x` flag. Before doing any operation remember to make a full backup of your database and custom files.

###Prepare PostgreSQL database and user 

1. First we need to initialize the database:

		sudo postgresql-setup initdb

2. Now we can enable Postgresql service to start with server:

		sudo systemctl enable postgresql.service

3. Start database server for the firt time using the command:

		sudo systemctl start postgresql.service

4. Switch to `postgres` user.

		sudo su - postgres

5. In the scenario of a testing or development environment you could create a user with no password. 

		createuser odoo -U postgres -dRS

6. But, if you're deploying a Production server you may want to set a strong password for the database user.

		createuser odoo -U postgres -dRSP

7. You'll be prompted for a password, **save it**, we'll need it shortly.
8. Press **CTRL+D** to exit from `postgres` user session.

{: .note}
>
>If you want to run multiple Odoo instances on the same Linode remember to check pg_hba.conf and change it according your needs.

##Specific dependencies for Odoo applications 

Using `pip` instead of `yum` will guarantee that your installation has the correct versions needed. We'll also abstain of using CentOS's packaged versions of Wkhtmltopdf and Less CSS.

###Install Python dependencies

Install Python libraries using the following commands:

		sudo pip install -r /opt/odoo/doc/requirements.txt
		sudo pip install -r /opt/odoo/requirements.txt


###Install Less CSS via nodejs and npm.

1. Download `nodejs` tar file:

		sudo wget http://nodejs.org/dist/v0.10.40/node-v0.10.40-linux-x64.tar.gz

2. Install `nodejs` in the appropiate directory:

		sudo tar --strip-components 1 -xzvf node-v* -C /usr/local

3. Time to install a newer version of Less via `npm`.

		sudo npm install -g less less-plugin-clean-css

###Install updated Wkhtmltopdf version

1. Switch to a temporally directory of your choice:

		cd /tmp

2. Download the recommended version of wkhtmltopdf for Odoo server, currently **0.12.1**

		sudo wget http://download.gna.org/wkhtmltopdf/0.12/0.12.1/wkhtmltox-0.12.1_linux-centos7-amd64.rpm

3. Install the package using `yum`.

		sudo yum install wkhtmltox-0.12.1_linux-centos7-amd64.rpm

4. To function properly we'll need to copy the binaries to an adequate location.

		sudo cp /usr/local/bin/wkhtmltopdf /usr/bin
		sudo cp /usr/local/bin/wkhtmltoimage /usr/bin

##Odoo server configuration

1. Copy the included configuration file to a more convenient location changing it's name to `odoo-server.conf`

		sudo cp /opt/odoo/debian/openerp-server.conf /etc/odoo-server.conf

2. Next we need to modify the configuration file using `vi` or any other editor of your choice.

		sudo vi /etc/odoo-server.conf

3. The file will show the default options. 

{: .file}
/etc/odoo-server.conf
:   ~~~ conf
[options]
; This is the password that allows database operations:
; admin_passwd = admin
db_host = False
db_port = False
db_user = odoo
db_password = False
addons_path = /usr/lib/python2.7/dist-packages/openerp/addons
    ~~~

4. Start the editing mode pressing the **INSERT** key.
5. `; admin_passwd = admin` Uncomment this line.
6. `db_host = False` Unless you plan to connect to a different database server leave this line untouched.
7. `db_port = False` Odoo uses PostgreSQL default port 5432, change only if necessary.
8. `db_user = odoo` Database user, in this case we used the default name.
9. `db_password = False` Replace `False` with the previously created PostgreSQL user password.
10. `addons_path = /usr/lib/python2.7/dist-packages/openerp/addons` We need to modify this line to read: `addons_path = /opt/odoo/addons`
11. We need to include the path to log files adding a new line:  `logfile = /var/log/odoo/odoo-server.log`
12. Optionally we could include a new line specifying the Odoo Frontend port used for connection `xmlrpc_port = 8069` this only makes sense if you're planning to run multiple Odoo instances (or versions) on the same server. For normal installation you could skip this line and Odoo will connect by default to port 8069.

The finished file should look similar to this depending on your deploying needs:

{: .file}
/etc/odoo-server.conf
:   ~~~ conf
[options]
; This is the password that allows database operations:
admin_passwd = admin
; Change db_host = <server_address> if needed, default is False
db_host = False 
; Change db_port = <PostgreSQL_port> if needed, default is False
db_port = False
; Change db_user = <PostgreSQL_user> default is odoo
db_user = odoo
; Change db_password = <PostgreSQL_user_password> entered previously, default is False
db_password = <PostgreSQL_user_password>
; Change addons_path = </path/to/official/modules, /path/to/custom/modules> if needed
addons_path = /opt/odoo/addons
; Include this line with the location of log file.
logfile = /var/log/odoo/odoo-server.log
; Add the following line if you need to set a different xml-rpc port (default is 8069) 
xmlrpc_port = 8069
    ~~~

When you're done editing the file press the **ESC** key and then exit saving all changes typing **:x** and hitting **ENTER** key.

###Systemd Odoo Service

1. Next step is creating a unit `odoo.service` to gain control over Odoo behavior and use it as a service which starts with the server.

		sudo vi /lib/systemd/system/odoo.service

2. Press **INSERT** key to start editing and paste the following:

{: .file}
/lib/systemd/system/odoo.service
:   ~~~ shell
[Unit]
Description=Odoo Open Source ERP and CRM
Requires=postgresql.service
After=network.target postgresql.service

[Service]
Type=simple
PermissionsStartOnly=true
SyslogIdentifier=odoo-server
User=odoo
Group=odoo
ExecStart=/opt/odoo/openerp-server --config=/etc/odoo-server.conf --addons-path=/opt/odoo/addons/

[Install]
WantedBy=multi-user.target
    ~~~

Press the **ESC** key and then exit saving all changes typing **:x** and hitting **ENTER** key.

##Odoo files ownership and permissions

1. Change the `odoo.service` file permissions and ownership so only root can write to it, while odoo user will only be able to read and execute it.

		sudo chmod 755 /lib/systemd/system/odoo.service
		sudo chown root: /lib/systemd/system/odoo.service

2. Since odoo user will run the application, change its ownership accordingly.

		sudo chown -R odoo: /opt/odoo/

3. We should set odoo user as the owner of log directory as well.

		sudo chown odoo:root /var/log/odoo

4. Finally,  we should protect the server configuration file changing its ownership and permissions so no other non-root user can access it.

		sudo chown odoo: /etc/odoo-server.conf
		sudo chmod 640 /etc/odoo-server.conf

##Opening corresponding port on Firewall

In our case we're using the default port 8069, but could be any port specified in the configuration file.

		sudo firewall-cmd --zone=public --add-port=8069/tcp --permanent
		sudo firewall-cmd --reload

##Testing the server

1. It's time to check that everything is working as expected, lets start the Odoo server.

		sudo systemctl start odoo.service

2. Let's take a look at log file to verify no errors occurred.

		cat /var/log/odoo/odoo-server.log

3. Now we can check if the server stops properly too.

		sudo systemctl stop odoo.service

4. Enter the same command again.

		cat /var/log/odoo/odoo-server.log

##Odoo service on startup and shutdown

1. If the Odoo server log doesn't indicate any problem we can continue and enable Odoo service at startup:

		sudo systemctl enable odoo.service

2. It's a good idea to restart our Linode to see if everything is working.

		sudo shutdown -r now

3. Once restarted verify one more time the log file.

		cat /var/log/odoo/odoo-server.log

##Testing Odoo frontend

1. Open a new browser window and enter in the address bar:

		http://<your_domain_or_IP_address>:8069

2. A screen similar to this would show up.

[![Odoo Db creation](/docs/assets/odoo_db_creation.png)](/docs/assets/odoo_db_creation.png)

3. Congratulations, now you can create your first database and start using Odoo! 

[![Odoo applications](/docs/assets/odoo_applications.png)](/docs/assets/odoo_applications.png)







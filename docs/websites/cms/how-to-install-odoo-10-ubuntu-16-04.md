---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Odoo is an open-source suite of over 5,500 business applications. Odoo allows administrators to install, configure and customize any application to satisfy their needs. This guide covers how to install and configure Odoo using Git source so it will be easy to upgrade and maintain.'
keywords: 'Odoo,Odoo ERP,CMS,Ubuntu,CRM,OpenERP, Odoo 10, Ubuntu 16.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: ''
modified: ''
modified_by:
  name: Linode
title: 'How to Install Odoo 10 on Ubuntu 16.04'
contributor:
  name: Damaso Sanoja
external_resources:
 - '[Odoo User Documentation](https://www.odoo.com/documentation/user/10.0/)'
 - '[Odoo Developer Documentation](https://www.odoo.com/documentation/10.0)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[Odoo](https://www.odoo.com/) (formerly known as OpenERP) is an open-source suite of business applications including: Customer Relationship Management, Sales Pipeline, Project Management, Manufacturing, Invoicing , Accounting, eCommerce and Inventory just to name a few. There are 34 main applications created by Odoo team and over 5,500+ developed by community members covering a wide range of business needs.

Once deployed, Odoo flexibility allows the administrator to install any module combination and configure/customize them at will to satisfy business needs ranging from a small shop to a Enterprise Level Corporation.

This guide covers how to install and configure Odoo in just 35 minutes using Git source so it will be easy to upgrade, maintain and customize. 

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services; this guide will use `sudo` wherever possible. Do **not** follow the *Configuring a Firewall* section--this guide has instructions specifcally for an Odoo production server.

3.  Log in to your Linode via SSH and check for updates using `apt` package manager.

		sudo apt update && sudo apt upgrade

##Open Corresponding Firewall Ports

In this case we're using Odoo's default port 8069, but this could be any port you specify later in the configuration file.

	sudo ufw allow ssh
	sudo ufw allow 8069/tcp
	sudo ufw enable

##Install Database and Server Dependencies

Now we're going to install the PostgreSQL database and other necessary server libraries using `apt` 

    sudo apt install git python-pip postgresql postgresql-server-dev-9.5 python-all-dev python-dev python-setuptools libxml2-dev libxslt1-dev libevent-dev libsasl2-dev libldap2-dev pkg-config libtiff5-dev libjpeg8-dev libjpeg-dev zlib1g-dev libfreetype6-dev liblcms2-dev liblcms2-utils libwebp-dev tcl8.6-dev tk8.6-dev python-tk libyaml-dev fontconfig

###Create Odoo User

Create the Odoo system user.

		sudo adduser --system --home=/opt/odoo --group odoo

{: .note}
>
>In the scenario of running multiple Odoo versions on the same Linode you may want to use different users and directories for each instance.

###Log strategy

Ubuntu 16.04 uses `systemd` and `journald` by default, with that in mind you can setup Odoo 10 logs in several ways. For the purpose of this guide two scenarios will be discussed:

1. To use at the same time journals **and** a separate Odoo log file you'll need to create the corresponding directory:

        sudo mkdir /var/log/odoo

2. To strictly use `journald` for logging you don't need to create any directory.

Using one or another option will depend on your particular needs.

###Install Odoo Server Files from Source

Clone the Odoo files on your server.

		sudo git clone https://www.github.com/odoo/odoo --depth 1 --branch 10.0 --single-branch /opt/odoo

{: .note}
>
>Using git brings a great flexibility because any time a new upgrade is available you only need to pull that branch, you can even install a different one alongside the production version, just change the destination directory and the  `--branch X.x` flag. Before doing any operation remember to make a full backup of your database and custom files.

###Create PostgreSQL User 

1.  Switch to `postgres` user.

		sudo su - postgres

2.  But, if you're deploying a Production server you may want to set a strong password for the database user.

		createuser odoo -U postgres -dRSP

3.  You'll be prompted for a password, **save it**, we'll need it shortly.

	{: .note}
	>
	>In the scenario of a testing or development environment you could create a user with no password using `createuser odoo -U postgres -dRS`.

4.  Press **CTRL+D** to exit from `postgres` user session.

{: .note}
>
>If you want to run multiple Odoo instances on the same Linode remember to check pg_hba.conf and change it according your needs.


##Specific Dependencies for Odoo Applications 

Using `pip` instead of `apt` will guarantee that your installation has the correct versions needed. We'll also abstain of using Ubuntu's packaged versions of [Wkhtmltopdf](http://wkhtmltopdf.org/) and [node-less](http://lesscss.org/).


###Install Python Dependencies

Install Python libraries using the following commands:

	sudo pip install -r /opt/odoo/doc/requirements.txt
	sudo pip install -r /opt/odoo/requirements.txt


###Install Less CSS via nodejs and npm.

1.  Download `nodejs` installation script from nodesource.

		sudo curl -sL https://deb.nodesource.com/setup_0.12 | sudo -E bash -

2.  Now that our repository list is updated install `nodejs` using `apt`.

		sudo apt install -y nodejs=0.12.17-1nodesource1~xenial1

3.  Time to install a newer version of Less via `npm`.

		sudo npm install -g less less-plugin-clean-css


###Install Stable Wkhtmltopdf Version

1.  Switch to a temporally directory of your choice.

		cd /tmp

2.  Download the recommended version of wkhtmltopdf for Odoo server, currently **0.12.1**

		sudo wget http://download.gna.org/wkhtmltopdf/0.12/0.12.1/wkhtmltox-0.12.1_linux-trusty-amd64.deb

3.  Install the package using `dpkg`.

		sudo dpkg -i wkhtmltox-0.12.1_linux-trusty-amd64.deb

4.  To function properly we'll need to copy the binaries to an adequate location.

		sudo cp /usr/local/bin/wkhtmltopdf /usr/bin
		sudo cp /usr/local/bin/wkhtmltoimage /usr/bin

{: .note}
>
>wkhtmltopdf version 0.12.2.4 is available on Ubuntu 16.04 official repository but its not advisable to install it from there due to the great amount of dependencies including: xserver, gstreamer, libcups, wayland, qt5 and many more. There isn't an official "Xenial" package from project page yet, but "Trusty" package from Ubuntu 14.04 is totally compatible. On the other hand, Ubuntu 16.04 also offers nodejs version 4.2.6 in its official repository. The decision to keep legacy node 0.12.17, even when its support ends in 2016, is because Odoo 10 was developed with a similar framework that previous versions. Future Odoo updates should take care of this and move to newer versions.

##Odoo Server Configuration

1.  Copy the included configuration file to a more convenient location changing it's name to `odoo-server.conf`

		sudo cp /opt/odoo/debian/odoo.conf /etc/odoo-server.conf

2.  Next we need to modify the configuration file. The finished file should look similar to this depending on your deploying needs:

	{: .file}
	/etc/odoo-server.conf
	:   ~~~ conf
		[options]
		admin_passwd = admin
		db_host = False 
		db_port = False
		db_user = odoo
		db_password = <PostgreSQL_user_password>
		addons_path = /opt/odoo/addons
        ; Uncomment the line bellow to set a separate log file
        ;logfile = /var/log/odoo/odoo-server.log
		xmlrpc_port = 8069
    	~~~

	*  `admin_passwd = admin` This is the password that allows database operations.
	*  `db_host = False` Unless you plan to connect to a different database server address, leave this line untouched.
	*  `db_port = False` Odoo uses PostgreSQL default port 5432, change only if necessary.
	*  `db_user = odoo` Database user, in this case we used the default name.
	*  `db_password =` The previously created PostgreSQL user password.
	*  `addons_path =` We need to modify this line to read: `addons_path = /opt/odoo/addons`. Add `</path/to/custom/modules>` if needed.
	*  You will need to include the path to log files adding a new line: `logfile = /var/log/odoo/odoo-server.log`. **You can skip this line if you plan to use `journald` for logging.**
	*  Optionally we could include a new line specifying the Odoo Frontend port used for connection: `xmlrpc_port = 8069`. This only makes sense if you're planning to run multiple Odoo instances (or versions) on the same server. For normal installation you could skip this line and Odoo will connect by default to port 8069.

{: .note}
>
>As explained in the "Log strategy" section, you have many options for Odoo logging in Ubuntu 16.04. This configuration file assumes you'll use Ubuntu system journals.

###Odoo Service

Next step is creating a unit `odoo-server` that way your application will behave as a service.

{: .file}
/lib/systemd/system/odoo-server.service
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
ExecStart=/opt/odoo/odoo-bin --config=/etc/odoo-server.conf --addons-path=/opt/odoo/addons/
WorkingDirectory=/opt/odoo/
StandardOutput=journal+console

[Install]
WantedBy=multi-user.target

    ~~~

The most relevant line in this file is `StandardOutput=journal+console`. Configured as above, Odoo logs will be completely managed by the system journal (option 2 in "Log strategy" section). In case you want a separate log file just omit that line **and** configure `odoo-server.conf` accordingly specifying the location of your log file. What you need to remember is that `journald` will always capture Odoo service main activity (service start, stop, reboot, errors), using a separate log file will only exclude from journal "info" messages like webserver messages, rendering engine, etc.

###Odoo Files Ownership and Permissions

1.  Change the `odoo-server` service permissions and ownership so only root can write to it, while Odoo user will only be able to read and execute it.

		sudo chmod 755 /lib/systemd/system/odoo-server.service
		sudo chown root: /lib/systemd/system/odoo-server.service

2.  Since odoo user will run the application, change its ownership accordingly.

		sudo chown -R odoo: /opt/odoo/

3.  We should set odoo user as the owner of log directory as well (this applies only if you decided to use a separate log file):

		sudo chown odoo:root /var/log/odoo

4.  Finally,  we should protect the server configuration file changing its ownership and permissions so no other non-root user can access it.

		sudo chown odoo: /etc/odoo-server.conf
		sudo chmod 640 /etc/odoo-server.conf


##Testing the Server

1.  It's time to check that everything is working as expected, lets start the Odoo server.

		sudo systemctl start odoo-server

2.  Check the service status, it will also include journal logs, you can see an example output in the picture bellow:

        sudo systemctl status odoo-server

[![Odoo service status running](/docs/assets/odoo_servicerunning_small.png)](/docs/assets/odoo_servicerunning.png)

3.  Optionally, you can check database journal:

        sudo journalctl -u postgresql

4.  Now its time to verify the server stops properly too.

		sudo systemctl stop odoo-server

5.  Run again a service status check.

        sudo systemctl status odoo-server

[![Odoo service status inactive](/docs/assets/odoo_servicestopped_small.png)](/docs/assets/odoo_servicestopped.png)


##Enabling Odoo Server as service at Startup and Shutdown

1.  If your system journal doesn't indicate any problem then you can continue and enable `odoo-server` unit to start and stop with the server.

		sudo systemctl enable odoo-server

2.  It's a good idea to restart your Linode to see if everything is working as expected.

		sudo reboot

3.  Once restarted verify one more time your journal messages.

		sudo journalctl -u odoo-server

##Testing Odoo Frontend

1.  Open a new browser window and enter in the address bar:

		http://<your_domain_or_IP_address>:8069

2.  A screen similar to this would show up.

![Odoo 10 database creation](/docs/assets/odoo_10_db_creation.png)

3.  Congratulations, now you can create your first database and start using Odoo 10!

[![Odoo 10 applications](/docs/assets/odoo_10_applications_small.png)](/docs/assets/odoo_10_applications.png)













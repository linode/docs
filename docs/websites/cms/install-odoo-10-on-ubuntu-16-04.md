---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Odoo is an open-source suite of over 5,500 business applications. Odoo allows administrators to install, configure and customize any application to satisfy their needs. This guide covers how to install and configure Odoo using Git source so it will be easy to upgrade and maintain.'
keywords: 'Odoo,Odoo ERP,CMS,Ubuntu,CRM,OpenERP, Odoo 10, Ubuntu 16.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Monday, March 20th, 2017'
modified: 'Monday, March 20th, 2017'
modified_by:
  name: Linode
title: 'Install Odoo 10 on Ubuntu 16.04'
contributor:
  name: Damaso Sanoja
external_resources:
 - '[Odoo User Documentation](https://www.odoo.com/documentation/user/10.0/)'
 - '[Odoo Developer Documentation](https://www.odoo.com/documentation/10.0)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[Odoo](https://www.odoo.com/) (formerly known as OpenERP) is an open-source suite of business applications including customer relationship management (CRM), sales pipeline, project management, manufacturing, invoicing, accounting, eCommerce and inventory just to name a few. There are 34 main applications created by the Odoo team and more than 5,500 developed by community members, covering a wide range of business needs.

Once deployed, Odoo allows the administrator to install any module combination and configure/customize them at will to satisfy business needs ranging from a small shop to a enterprise-level corporation.

This guide covers how to install and configure Odoo in under an hour using Git source code so it will be easy to upgrade, maintain and customize.

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services. This guide will use `sudo` wherever possible. Do **not** follow the *Configuring a Firewall* section--this guide has instructions specifcally for an Odoo production server.

3.  Update your packages:

        sudo apt update && sudo apt upgrade

## Configure Firewall

Before installing Odoo, we'll set up some basic firewall rules to allow SSH connections and access to the Odoo server. In this case we're using Odoo's default port 8069, but this could be any port you specify later in the configuration file. If you plan to run any other services, you can add their ports here as well:

    sudo ufw allow ssh
    sudo ufw allow 8069/tcp
    sudo ufw enable

## Install Database and Server Dependencies

Next, we're going to install the PostgreSQL database and other necessary server libraries:

    sudo apt install git python-pip postgresql postgresql-server-dev-9.5 python-all-dev python-dev python-setuptools libxml2-dev libxslt1-dev libevent-dev libsasl2-dev libldap2-dev pkg-config libtiff5-dev libjpeg8-dev libjpeg-dev zlib1g-dev libfreetype6-dev liblcms2-dev liblcms2-utils libwebp-dev tcl8.6-dev tk8.6-dev python-tk libyaml-dev fontconfig

### Create a PostgreSQL User 

1.  Switch to the `postgres` user:

        sudo su - postgres

2.  Set a strong password for the database user and record it in a secure location:

         createuser odoo -U postgres -dRSP

    Remember the password you enter here; we'll need it shortly.

3.  Press **CTRL+D** to exit the `postgres` user session.

{: .note}
>
>If you want to run multiple Odoo instances on the same Linode remember to check your PostgreSQL client configuration file (located at `/etc/postgresql/9.5/main/pg_hba.conf` as of this publication) and modify it according your needs.

## Create an Odoo User

In order to separate Odoo from other services, we'll need a new system user to run its processes. To create the Odoo system user:

    sudo adduser --system --home=/opt/odoo --group odoo

{: .note}
>
>If you're running multiple Odoo versions on the same Linode, you may want to use different users and directories for each instance.

## Configure Logs

For logging, Ubuntu 16.04 uses `systemd` and `journald` by default. With that in mind, you can set up Odoo 10 logs in several ways. For the purpose of this guide, two scenarios will be discussed:

1.  To use journals **and** a separate Odoo log file at the same time you'll need to create the corresponding directory:

        sudo mkdir /var/log/odoo

2.  To only use `journald` for logging, you don't need to create any directory.

Your choice which option to use will depend on your particular needs.

## Install Odoo

Clone the Odoo files onto your server:

    sudo git clone https://www.github.com/odoo/odoo --depth 1 --branch 10.0 --single-branch /opt/odoo

{: .note}
>
>Using git brings great flexibility because any time a new upgrade is available, you only need to pull that branch. You can even install a different one alongside the production version, just change the destination directory and the  `--branch X.x` flag. Before upgrading, remember to make a full backup of your database and custom files.

### Install Dependencies for Odoo Applications 

Before your Odoo applications are ready to use, we'll need to install some dependencies. Using `pip` instead of `apt` will guarantee that your installation has the correct versions. We'll also refrain from using Ubuntu's packaged versions of [Wkhtmltopdf](http://wkhtmltopdf.org/) and [node-less](http://lesscss.org/).

Be sure to follow the steps in this section as your limited, non-root user (not the `odoo` user).

### Install Python Dependencies

Install the required Python libraries:

    sudo pip install -r /opt/odoo/doc/requirements.txt
    sudo pip install -r /opt/odoo/requirements.txt

These commands use the `requirements.txt` files provided with your Odoo installation to ensure you're getting the correct versions of the packages your applications depend on.

### Install Less CSS via nodejs and npm.

1.  Download and run the `nodejs` installation script from nodesource:

        sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -

2.  Now that our repository list is updated install `nodejs` using `apt`.

        sudo apt install -y nodejs

3.  Time to install a newer version of Less via `npm`, the NodeJS package manager.

        sudo npm install -g less less-plugin-clean-css

### Install Stable Wkhtmltopdf Version

1.  Navigate to a temporary directory:

        cd /tmp

2.  Download the recommended version of wkhtmltopdf for Odoo server, currently **0.12.1**:

        sudo wget http://download.gna.org/wkhtmltopdf/0.12/0.12.1/wkhtmltox-0.12.1_linux-trusty-amd64.deb

3.  Install the package using `dpkg`:

        sudo dpkg -i wkhtmltox-0.12.1_linux-trusty-amd64.deb

4.  To function properly, we'll need to copy the binaries to a location in your executable path:

        sudo cp /usr/local/bin/wkhtmltopdf /usr/bin
        sudo cp /usr/local/bin/wkhtmltoimage /usr/bin

{: .note}
>
>wkhtmltopdf version 0.12.2.4 is available on Ubuntu 16.04 official repository but its not advisable to install it from there due to the large number of dependencies including: `xserver`, `gstreamer`, `libcups`, `wayland`, `qt5` and many more. There isn't an official "Xenial" package from project page yet, but "Trusty" package from Ubuntu 14.04 is totally compatible as of this publication.

## Odoo Server Configuration

1.  Copy the included configuration file to a more convenient location, changing its name to `odoo-server.conf`

        sudo cp /opt/odoo/debian/odoo.conf /etc/odoo-server.conf

2.  Next, we need to modify the configuration file. The complete file should look similar to this, depending on your deployment needs:

  {: .file}
  /etc/odoo-server.conf
  :   ~~~ conf
      [options]
      admin_passwd = admin
      db_host = False 
      db_port = False
      db_user = odoo
      db_password = FALSE
      addons_path = /opt/odoo/addons
      ;Uncomment the following line to enable a custom log
      ;logfile = /var/log/odoo/odoo-server.log
      xmlrpc_port = 8069
      ~~~

*  `admin_passwd = admin` - This is the password that allows database operations. Be sure to change `admin` to something more secure.
*  `db_host = False` - Unless you plan to connect to a different database server address, leave this line untouched.
*  `db_port = False` - Odoo uses PostgreSQL default port 5432, change only if you're using custom PostgreSQL settings.
*  `db_user = odoo` - Name of the PostgreSQL database user. In this case we used the default name, but if you used a different name when creating your user, substitute that here.
*  `db_password = FALSE` - Change `FALSE` to the PostgreSQL password you created previously.
*  `addons_path =` - We need to modify this line to read: `addons_path = /opt/odoo/addons`. Add `</path/to/custom/modules>` if you're using custom modules, substituting your own path.
*  You will need to include the path to log files adding a new line: `logfile = /var/log/odoo/odoo-server.log`. You can skip this line if you plan to only use `journald` for logging.
*  Optionally, we could include a new line specifying the Odoo Frontend port used for connection: `xmlrpc_port = 8069`. This only makes sense if you're planning to run multiple Odoo instances (or versions) on the same server. For normal installation, you can skip this line and Odoo will connect by default to port 8069.

{: .note}
>
>As explained in the "Configure Logs" section, you have many options for Odoo logging in Ubuntu 16.04. This configuration file assumes you'll use Ubuntu system journals in addition to a custom log path.

### Create an Odoo Service

The next step is creating a systemd unit called `odoo-server` to allow your application to behave as a service. Create a new file at `/lib/systemd/system/odoo-server.service` and add the following contents:

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

The most relevant line in this file is `StandardOutput=journal+console`. Configured as above, Odoo logs will be completely managed by the system journal (option 2 in "Configure Logs" section). If you want a separate log file just omit that line **and** configure `odoo-server.conf` accordingly specifying the location of your log file. What you need to remember is that `journald` will always capture Odoo service main activity (service start, stop, reboot, errors), using a separate log file will only exclude from journal "info" messages like webserver messages, rendering engine, etc.

### File Ownership and Permissions

1.  Change the `odoo-server` service permissions and ownership so only root can write to it, while Odoo user will only be able to read and execute it.

        sudo chmod 755 /lib/systemd/system/odoo-server.service
        sudo chown root: /lib/systemd/system/odoo-server.service

2.  Since the `odoo` user will run the application, change its ownership accordingly.

        sudo chown -R odoo: /opt/odoo/

3.  If you chose to use a custom log, set the `odoo` user as the owner of log directory as well (this applies only if you decided to use a separate log file):

        sudo chown odoo:root /var/log/odoo

4.  Finally, we should protect the server configuration file, changing its ownership and permissions so no other non-root user can access it.

        sudo chown odoo: /etc/odoo-server.conf
        sudo chmod 640 /etc/odoo-server.conf

## Test the Server

1.  It's time to check that everything is working as expected. First, let's start the Odoo server:

        sudo systemctl start odoo-server

2.  Check the service status to make sure it's running. This will also include journal logs, you can see an example output in the picture bellow:

        sudo systemctl status odoo-server

    [![Odoo service status running](/docs/assets/odoo_servicerunning_small.png)](/docs/assets/odoo_servicerunning.png)

3.  You can also check the database journal to make sure there are no errors:

        sudo journalctl -u postgresql

4.  Next, verify the server is able to stop properly:

        sudo systemctl stop odoo-server

5.  Run a service status check again to make sure there were no errors:

        sudo systemctl status odoo-server

    Your output should look similar to this:

    [![Odoo service status inactive](/docs/assets/odoo_servicestopped_small.png)](/docs/assets/odoo_servicestopped.png)

## Enable the Odoo Service

1.  If your system journal doesn't indicate any problems, you can continue and enable the `odoo-server` unit to start and stop with the server.

        sudo systemctl enable odoo-server

2.  Log into the Linode Manager and reboot your Linode to see if everything is working as expected.

3.  Once restarted, log in via SSH and verify your journal messages:

        sudo journalctl -u odoo-server

    The output should include a message indicating that Odoo has started successfully.

## Test Odoo

1.  Open a new browser window and enter in the address bar:

        http://<your_domain_or_IP_address>:8069

2.  If everything is working properly, a screen similar to this should appear:

    [![Odoo 10 database creation](/docs/assets/odoo_10_db_creation.png)](/docs/assets/odoo_10_db_creation.png)

3.  Congratulations, now you can create your first database and start using Odoo 10 applications!

    [![Odoo 10 applications](/docs/assets/odoo_10_applications_small.png)](/docs/assets/odoo_10_applications.png)

## Next Steps

If you plan to use Odoo 10 for your business, you may wish to configure SSL/TLS encryption to enable secure connections to your server. To do this, check out our guide on how to [install an SSL certificate with LetsEncrypt](/docs/security/ssl/install-lets-encrypt-to-create-ssl-certificates).

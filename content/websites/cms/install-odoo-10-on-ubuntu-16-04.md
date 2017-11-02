---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Odoo is an open-source suite of over 5,500 business applications. Odoo allows administrators to install, configure and customize any application to satisfy their needs. This guide covers how to install and configure Odoo using Git source so it will be easy to upgrade and maintain.'
keywords: ["Odoo", "Odoo ERP", "CMS", "Ubuntu", "CRM", "OpenERP", "Odoo 10", "Ubuntu 16.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-04-04
modified: 2017-04-04
modified_by:
  name: Linode
title: 'Install Odoo 10 on Ubuntu 16.04'
contributor:
  name: Damaso Sanoja
external_resources:
 - '[Odoo User Documentation](https://www.odoo.com/documentation/user/10.0/)'
 - '[Odoo Developer Documentation](https://www.odoo.com/documentation/10.0)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*
<hr>

[Odoo](https://www.odoo.com/) (formerly known as OpenERP) is an open-source suite of business applications including customer relationship management (CRM), sales pipeline, project management, manufacturing, invoicing, accounting, eCommerce, and inventory tools, just to name a few. There are thirty-four main applications created by the Odoo team and more than 5,500 developed by community members, covering a wide range of business needs.

![Install Odoo 10 ERP on Ubuntu 16.04](/docs/assets/install-odoo-10-on-ubuntu-16-04.png "Install Odoo 10 ERP on Ubuntu 16.04")

Once deployed, Odoo allows the administrator to install any module combination and configure/customize it as needed for business needs ranging from a small shop to an enterprise-level corporation.

This guide covers how to install and configure Odoo in under an hour using Git source code so it will be easy to upgrade, maintain and customize.

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services. **Do not** follow the *Configuring a Firewall* section in the Securing Your Server Guide--we will configure the firewall for an Odoo production server in the next section.

    This guide will use `sudo` wherever possible.

3.  Update your packages:

        sudo apt update && sudo apt upgrade

## Configure UFW Firewall for Odoo

Before installing Odoo, we'll set up some basic firewall rules to allow SSH connections and access to the Odoo server. In this example we'll use Odoo's default port `8069`, but this could be any port you specify later in the configuration file. If you plan to run any other services, you can add their ports here as well. Refer to our guide on how to [Configure a Firewall with UFW](https://www.linode.com/docs/security/firewalls/configure-firewall-with-ufw#use-ufw-to-manage-firewall-rules) for help with rules and settings:

    sudo ufw allow ssh
    sudo ufw allow 8069/tcp
    sudo ufw enable

## Install PostgreSQL Database and Server Dependencies

Install the PostgreSQL database, Python, and other necessary server libraries:

    sudo apt install git python-pip postgresql postgresql-server-dev-9.5 python-all-dev python-dev python-setuptools libxml2-dev libxslt1-dev libevent-dev libsasl2-dev libldap2-dev pkg-config libtiff5-dev libjpeg8-dev libjpeg-dev zlib1g-dev libfreetype6-dev liblcms2-dev liblcms2-utils libwebp-dev tcl8.6-dev tk8.6-dev python-tk libyaml-dev fontconfig

### Create a PostgreSQL User

1.  Switch to the `postgres` user:

        sudo su - postgres

2.  Set a strong password for the database user and record it in a secure location, you'll need it in the following sections:

        createuser odoo -U postgres -dRSP

3.  Press **CTRL+D** to exit the `postgres` user session.

{{< note >}}
If you want to run multiple Odoo instances on the same Linode remember to check your PostgreSQL client configuration file (as of the date this guide is published, located at `/etc/postgresql/9.5/main/pg_hba.conf`) and modify it according your needs.
{{< /note >}}

## Create an Odoo User

In order to separate Odoo from other services, create a new Odoo system user to run its processes:

    sudo adduser --system --home=/opt/odoo --group odoo

{{< note >}}
If you're running multiple Odoo versions on the same Linode, you may want to use different users and directories for each instance.
{{< /note >}}

## Configure Logs

For logging, Ubuntu 16.04 uses `systemd` and `journald` by default. With that in mind, you can set up Odoo 10 logs in several ways. We'll consider two scenarios in this guide. Your choice of option will depend on your particular needs:

1.  To use journals **and** a separate Odoo log file at the same time, create the corresponding directory:

        sudo mkdir /var/log/odoo

2.  To only use `journald` for logging, you don't need to create any directory.

## Install Odoo

Clone the Odoo files onto your server:

    sudo git clone https://www.github.com/odoo/odoo --depth 1 --branch 10.0 --single-branch /opt/odoo

{{< note >}}
Using git offers great flexibility. When a new upgrade is available, pull the new branch. You can even install a different version alongside the production one, just change the destination directory and the `--branch X.x` flag. Before upgrading, remember to make a full backup of your database and custom files.
{{< /note >}}

### Install Dependencies for Odoo Applications

Before your Odoo applications are ready to use, you'll need to install some dependencies. We'll use the Python package manager, `pip`, instead of `apt` to guarantee that you install the correct versions. We'll also refrain from using Ubuntu's packaged versions of [Wkhtmltopdf](http://wkhtmltopdf.org/) and [node-Less](http://lesscss.org/).

Be sure to follow the steps in this section as your limited, non-root user (not the `odoo` user).

### Install Python Dependencies

Install the required Python libraries:

    sudo pip install -r /opt/odoo/doc/requirements.txt
    sudo pip install -r /opt/odoo/requirements.txt

These commands use the `requirements.txt` files provided with your Odoo installation to ensure you're getting the correct versions of the packages your applications depend on.

### Install Less CSS via nodejs and npm

1.  Download and run the `nodejs` installation script from nodesource:

        sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -

2.  Now that our repository list is updated install `nodejs` using `apt`.

        sudo apt install -y nodejs

3.  Install a newer version of Less via `npm`, the NodeJS package manager.

        sudo npm install -g less less-plugin-clean-css

### Install Stable Wkhtmltopdf Version

1.  Navigate to a temporary directory:

        cd /tmp

2.  Download the recommended version of wkhtmltopdf for Odoo server. In this example, we use **0.12.1**. See the [Odoo repository](https://github.com/odoo/odoo/wiki/Wkhtmltopdf) for an up-to-date list of compatible versions:

        sudo wget https://downloads.wkhtmltopdf.org/0.12/0.12.1/wkhtmltox-0.12.1_linux-trusty-amd64.deb

3.  Install the package using `dpkg`:

        sudo dpkg -i wkhtmltox-0.12.1_linux-trusty-amd64.deb

4.  To ensure wkhtmltopdf functions properly, copy the binaries to a location in your executable path:

        sudo cp /usr/local/bin/wkhtmltopdf /usr/bin
        sudo cp /usr/local/bin/wkhtmltoimage /usr/bin

{{< note >}}
While wkhtmltopdf version 0.12.2.4 is available in the official Ubuntu 16.04 repository, we don't advise installing it from there due to the large number of dependencies including: `xserver`, `gstreamer`, `libcups`, `wayland`, `qt5` and many more. There isn't an official Xenial package from the project page yet, but the Trusty package from Ubuntu 14.04 is compatible as of this publication.
{{< /note >}}

## Odoo Server Configuration

1.  Copy the included configuration file to a more convenient location, changing its name to `odoo-server.conf`

        sudo cp /opt/odoo/debian/odoo.conf /etc/odoo-server.conf

2.  Next, modify the configuration file. The complete file should look similar to this, depending on your deployment needs:

      {{< file "/etc/odoo-server.conf" aconf >}}
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

{{< /file >}}


          *  `admin_passwd = admin` - This is the password that allows database operations. Be sure to change `admin` to something more secure.
          *  `db_host = False` - Unless you plan to connect to a different database server address, leave this line untouched.
          *  `db_port = False` - Odoo uses PostgreSQL default port `5432`, change this only if you're using custom PostgreSQL settings.
          *  `db_user = odoo` - Name of the PostgreSQL database user. In this case we used the default name, but if you used a different name when creating your user, substitute that here.
          *  `db_password = FALSE` - Change `FALSE` to the PostgreSQL password you created previously.
          *  `addons_path =` - Modify this line to read: `addons_path = /opt/odoo/addons`. Add `</path/to/custom/modules>` if you're using custom modules, substituting your own path.
          *  Include the path to log files, and add a new line: `logfile = /var/log/odoo/odoo-server.log`. You can skip this line if you plan to only use `journald` for logging.
          *  Optionally, we could include a new line specifying the Odoo Frontend port used for connection: `xmlrpc_port = 8069`. This only makes sense if you're planning to run multiple Odoo instances (or versions) on the same server. For normal installation, you can skip this line and this instance of Odoo will connect by default to port `8069`.

          {{< note >}}
As explained in the [Configure Logs](#configure-logs) section, you have many options for Odoo logging in Ubuntu 16.04. This configuration file assumes you'll use Ubuntu system journals in addition to a custom log path.
{{< /note >}}

### Create an Odoo Service

Create a systemd unit called `odoo-server` to allow your application to behave as a service. Create a new file at `/lib/systemd/system/odoo-server.service` and add the following contents:

{{< file "/lib/systemd/system/odoo-server.service" shell >}}
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

{{< /file >}}


The most relevant line in this file is `StandardOutput=journal+console`. As configured in the example above, Odoo logs will be completely managed by the system journal (Option 2 in the [Configure Logs](#configure-logs) section). If you want a separate log file, omit that line and configure `odoo-server.conf` accordingly, specifying the location of your log file. Remember that `journald` will always capture main Odoo service activity (service start, stop, reboot, errors), using a separate log file will only exclude journal "info" messages like webserver messages, rendering engine, etc.

### Change File Ownership and Permissions

1.  Change the `odoo-server` service permissions and ownership so only root can write to it, while the `odoo` user will only be able to read and execute it.

        sudo chmod 755 /lib/systemd/system/odoo-server.service
        sudo chown root: /lib/systemd/system/odoo-server.service

2.  Since the `odoo` user will run the application, change its ownership accordingly.

        sudo chown -R odoo: /opt/odoo/

3.  If you chose to use a custom log, set the `odoo` user as the owner of log directory as well (this applies only if you decided to use a separate log file):

        sudo chown odoo:root /var/log/odoo

4.  Finally, protect the server configuration file. Change its ownership and permissions so no other non-root user can access it:

        sudo chown odoo: /etc/odoo-server.conf
        sudo chmod 640 /etc/odoo-server.conf

## Test the Server

1.  Confirm that everything is working as expected. First, start the Odoo server:

        sudo systemctl start odoo-server

2.  Check the service status to make sure it's running. This will also include journal logs. You can see an example output in the picture bellow:

        sudo systemctl status odoo-server

    [![Odoo service status running](/docs/assets/odoo_servicerunning_small.png)](/docs/assets/odoo_servicerunning.png)

3.  Check the database journal to make sure there are no errors:

        sudo journalctl -u postgresql

4.  Verify that the server is able to stop properly:

        sudo systemctl stop odoo-server

5.  Run a service status check again to make sure there were no errors:

        sudo systemctl status odoo-server

    Your output should look similar to this:

    [![Odoo service status inactive](/docs/assets/odoo_servicestopped_small.png)](/docs/assets/odoo_servicestopped.png)

## Enable the Odoo Service

1.  If your system journal doesn't indicate any problems, enable the `odoo-server` unit to start and stop with the server:

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

## Updating Odoo

Before updating your Odoo system, you should check that everything will work as expected, especially third-party modules. The safest way to do this is to use a testing environment, which is nothing more than a separate Odoo installation.

Depending on your server resources, security concerns and testing the scope of this second installation can be done alongside the production instance or in another location (remote or local). For the purpose of this guide, we'll use a testing environment running on the same server as the production one.

### Configure UFW Firewall

In order to use the testing environment at the same time than production we need to use a different TCP port for server connections:

    sudo ufw allow 8080/tcp

### Create a Separate Database User

An independent database user is a good idea to keep everything off production, however it's not necessary to use a password as before:

    sudo su - postgres
    createuser odoo-te -U postgres -dRS

Press **CTRL+D** to exit the `postgres` user session.

### Create a Test Odoo User

It's very important to use a different odoo user than production one:

    sudo adduser --system --home=/opt/odoo-te --group odoo-te

### Configure Logs

In the case of the testing environment it's advisable to use a separate log file:

    sudo mkdir /var/log/odoo-te

### Install Odoo Testing Environment

Clone the updated Odoo source which is different from your older production instance:

    sudo git clone https://www.github.com/odoo/odoo --depth 1 --branch 10.0 --single-branch /opt/odoo-te

### Testing Environment Configuration

The advantage of using the same server is that all dependencies are already meet. What is next is to configure the server accordingly.

1.  Copy the original configuration file from the source to appropiate location:

        sudo cp /opt/odoo/debian/odoo.conf /etc/odoo-server-te.conf

2.  Modify the configuration file, paying attention to changes from previous installation especially the inclusion of `logfile` and the communication port:

    {{< file "/etc/odoo-server.conf" aconf >}}
[options]
admin_passwd = admin
db_host = False
db_port = False
db_user = odoo-te
db_password = FALSE
addons_path = /opt/odoo-te/addons
logfile = /var/log/odoo-te/odoo-server-te.log
xmlrpc_port = 8080

{{< /file >}}


3.  Create a systemd unit for the Odoo testing environment. This allows you to run it as an independent service:

    {{< file "/lib/systemd/system/odoo-server-te.service" shell >}}
[Unit]
Description=Odoo Open Source ERP and CRM (Test Env)
Requires=postgresql.service
After=network.target postgresql.service

[Service]
Type=simple
PermissionsStartOnly=true
SyslogIdentifier=odoo-server-te
User=odoo-te
Group=odoo-te
ExecStart=/opt/odoo-te/odoo-bin --config=/etc/odoo-server-te.conf --addons-path=/opt/odoo-te/addons/
WorkingDirectory=/opt/odoo-te/

[Install]
WantedBy=multi-user.target

{{< /file >}}


### Change File Ownership and Permissions

Just as you did before, set permissions for the testing environment:

    sudo chmod 755 /lib/systemd/system/odoo-server-te.service
    sudo chown root: /lib/systemd/system/odoo-server-te.service
    sudo chown -R odoo-te: /opt/odoo-te/
    sudo chown odoo-te:root /var/log/odoo-te
    sudo chown odoo-te: /etc/odoo-server-te.conf
    sudo chmod 640 /etc/odoo-server-te.conf

### Check your Testing Environment

Now you can start your new Odoo service and verify log entries for errors:

    sudo systemctl start odoo-server-te
    sudo systemctl status odoo-server-te
    sudo journalctl -u postgresql
    sudo cat /var/log/odoo-te/odoo-server-te.log

## Prepare your System for Production Tests

At this point, you have a completely independent Odoo installation. Next steps will setup your testing environment to replicate the production one.

1.  Make a backup of your production database using the Odoo graphical interface. Navigate to the following URL in your web browser. This assumes that your are using the default port 8069:

        http://your_domain_or_IP_address:8069/web/database/manager

    ![Back up a database in Odoo](/docs/assets/odoo_backup_db.png "Back up a database in Odoo")

2.  Start your `odoo-server-te` service and restore the production database using the Odoo graphical interface by navigating to the URL below. Note that this time you'll be using port 8080 since that's where the test environment is running:

        http://your_domain_or_IP_address:8080/web/database/manager

    ![Restore a database in Odoo](/docs/assets/odoo_restore_db.png "Restore a database in Odoo")

3.  The final step is to update Odoo modules to newer versions, this is done restarting the service and updating database entries which tells the system to apply changes:

        sudo service odoo-server-te restart -u all -d <production_database_name>

    At this stage, you may encounter errors produced by incompatible changes in modules. This is rarely the case for Odoo standard modules but is not uncommon for ones downloaded from a third-party. If you do encounter an error, you'll need to check for a new version of the module that's causing it, and reinstall it.

4.  If everything goes as expected, you can start your load tests modules "behavior" tests (which are different from code-incompatible errors), and any other tests you've configured.

### Update your Production System

If all your tests pass, you can safely update your production installation.

1.  Download the new code from source:

        cd /opt/odoo
        sudo git fetch origin 10.0

2.  Apply the changes to your repository:

        sudo git reset --hard origin/10.0

3.  Access your new system:

        http://your_domain_or_IP_address:8069

## Next Steps

If you plan to use Odoo 10 for your business, you may wish to configure SSL/TLS encryption to enable secure connections to your server. To do this, check out our guide on how to [install an SSL certificate with LetsEncrypt](/docs/security/ssl/install-lets-encrypt-to-create-ssl-certificates).

---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Odoo is an open-source suite of over 5,500 business applications. Odoo allows administrators to install, configure and customize any application to satisfy their needs. This guide covers how to install and configure Odoo using Git source so it will be easy to upgrade and maintain.'
keywords: ["Odoo", "Odoo ERP", "CMS", "Ubuntu", "CRM", "OpenERP", "Odoo 11", "Ubuntu 16.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-21
modified: 2018-01-21
modified_by:
  name: Linode
title: 'Install an Odoo 11 Stack on Ubuntu 16.04 Using Linode'
contributor:
  name: Damaso Sanoja
  link: https://twitter.com/damasosanoja
external_resources:
  - '[Odoo User Documentation](https://www.odoo.com/documentation/user/11.0/)'
  - '[Odoo Developer Documentation](https://www.odoo.com/documentation/11.0)'
  - '[PostgreSQL 9.6 Documentation](https://www.postgresql.org/docs/9.6/static/index.html)'
---


## What is Odoo?

![Install a Odoo 11 Stack on Ubuntu 16.04 using Linode](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode.png)

[Odoo](https://www.odoo.com/) (formerly known as OpenERP) is a suite of over 10,000 open source apps for a variety of business needs, including CRM, eCommerce, accounting, inventory, point of sale, and project management. These applications are all fully integrated and can be installed and accessed through a web interface, making it easy to automate and manage your company's processes.

For simple installations, Odoo and its dependencies can be installed on a single Linode (see our [Install Odoo 10 on Ubuntu](https://linode.com/docs/websites/cms/install-odoo-10-on-ubuntu-16-04/) guide for details). However, this single-server setup is not suited for production deployments. This guide covers how to configure a production Odoo 11 cluster in which the Odoo server and PostgreSQL database are hosted on separate Linodes, with database replication for extra

## System Requirements

This guide will require the following *minimal* Linode specifications:

* PostgreSQL databases (master and slave) - Linode **2GB**
* Odoo 11 web application - Linode **1GB**

Keep in mind that your implementation may need higher plans depending on the number of end-users you want to serve and the number of modules you plan to incorporate.

{{< note >}}
All nodes will run under Ubuntu 16.04 LTS, if you plan to use a different operating system (like CentOS) then be aware that you will need to adapt the arguments and commands as necessary.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

4.  Install `software-properties-common`:

        sudo apt install software-properties-common

## Firewall Rules

If you want to configure a firewall for your Linodes, ensure that the following ports are open:

| Node | Open TCP Ports |
| ------------ |:--------:|
| Odoo 11 application | `22, 6010, 5432, 8070` |
| PostgreSQL database (Master & Slave) | `22, 6010, 5432` |

Ports `22`, `80` and `5432` are the default for SSH, HTTP and PostgreSQL communications respectively. Port `6010` is used for Odoo communications and port `8070` is used by Odoo's webserver. To open a particular port you can use:

    sudo ufw allow 22/tcp

For more detailed information about firewall setup please read our guide [How to Configure a Firewall with UFW](https://linode.com/docs/security/firewalls/configure-firewall-with-ufw/).

## Hostname Assignment

In order to simplify communication between Linodes, edit `/etc/hosts` and set hostnames for each server. You can use private IPs if the Linodes are all in the same data center, or FQDNs if available. This guide will use the following FQDN and hostname conventions:

| Node | Hostname | FQDN |
| ------------ |:--------:| :-----------:|
| Odoo 11  | odoo | odoo.yourdomain.com |
| PostgreSQL Master | masterdb | masterdb.yourdomain.com |
| PostgreSQL Slave | slavedb | slavedb.yourdomain.com |

1. PostgreSQL Master:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       masterdb.yourdomain.com   masterdb

10.1.1.20       slavedb.yourdomain.com    slavedb
10.1.3.10       odoo.yourdomain.com       odoo

{{< /file-excerpt >}}

2. PostgreSQL Slave:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       slavedb.yourdomain.com    slavedb

10.1.1.10       masterdb.yourdomain.com   masterdb
10.1.3.10       odoo.yourdomain.com       odoo
{{< /file-excerpt >}}

3. Odoo 11 server:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       odoo.yourdomain.com       odoo

10.1.1.10       masterdb.yourdomain.com   masterdb
10.1.1.20       slavedb.yourdomain.com    slavedb
{{< /file-excerpt >}}


    {{< note >}}
Throughout this guide Fully Qualified Domain Names (FQDN) will be used whenever possible to avoid confusing the nodes.
{{< /note >}}

## Postgresql Setup

The first component to configure will be the database backend. A **Master** node will be in charge of all transactions and additionally will be streaming to a secondary server: the **Slave**.

### Install PostgreSQL

PostgreSQL version 9.6 offers significant improvements for database replication but unfortunately is not included in the default Ubuntu 16.04 repositories. Please follow this procedure on all PostgreSQL nodes to install the newest version:

1. Add the official PostgreSQL-Xenial repository to your system:

        sudo add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main"

2. Import the repository key:

        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

3. Update your `apt` cache:

        sudo apt update

4. Install PostgreSQL 9.6 in the database nodes:

        sudo apt install postgresql-9.6 postgresql-server-dev-9.6

### Create PostgreSQL users

Begin with the PostgreSQL user needed for Odoo communications. You must create this user on **Master** and **Slave** nodes:

1. Switch to the `postgres` user and create the database user `odoo` in charge of all operations (provide a strong password and save it in a secure location, you need need it later) :

        sudo -u postgres createuser odoo -U postgres -dRSP

    {{< note >}}
Keep in mind that you should use **the same password** for the Odoo-PostgreSQL user in all nodes. Odoo is not aware of database replication, so it will be easier to trigger an eventual failover procedure if both servers share the same information.
    {{< /note >}}

2. Now you need to create the `replicauser` on the **Master** node:

        sudo -u postgres createuser replicauser -U postgres -P --replication

Note that this user has less privileges than the `odoo` user this is because the `replicauser` only purpose is to allow the **Slave** to read information from the **Master** nodes. Similar to the `odoo` user you will need to set a strong password, this one can be different. The `--replication` option grants the required privilege that `replicauser` need to perform its job.

### Configure Host Based Authentication

1. Stop the PostgreSQL service on all nodes (this is **very** important):

        sudo systemctl stop postgresql


2. Edit the `pg_hba.conf` file to allow PostgreSQL nodes to communicate to each other. Each line provides the client authentication permissions to connect to an specific database. Start adding the following lines to the **Master** database server. For example, the first line allows the **Slave** to connect to the **Master** node using `replicauser` the last line grants to the `odoo` user the rights connect to "all" databases within this server:

    {{< file-excerpt "/etc/postgresql/9.6/main/pg_hba.conf" conf >}}
host    replication     replicauser      slavedb.yourdomain.com         md5
host    all             odoo             odoo.yourdomain.com            md5
{{< /file-excerpt >}}

3. It's a good idea to add a similar configuration in the **Slave** node that way will be much easier to promote it to "master" status if necessary:

    {{< file-excerpt "/etc/postgresql/9.6/main/pg_hba.conf" conf >}}
host    all             odoo             odoo.yourdomain.com            md5
{{< /file-excerpt >}}

From the `pg_hba.conf` file you are setting:

* `host`: enables connections using Unix-domain sockets.
* `replication`: specifies a replication connection for the given user. No dabatase name is required for this type of connection.
* `replicauser`: is the user you created in the previous section.
* `md5`: make use of client-supplied MD5-encrypted password for authentication.
* `all`: match all databases in the server. You could provide specific Odoo database(s) names (separated by commas) if you know them beforehand.
* `odoo`: is the Odoo user responsible of application/database communications.

### Configure Archiving and Replication

1. Create the `archive` directory for WAL files in the **Master** node:

        sudo mkdir -p /var/lib/postgresql/9.6/main/archive/

2. Change the `archive` directory permissions to allow `postgres` user to read and write on it:

        sudo chown postgres: -R /var/lib/postgresql/9.6/main/archive/

3. Now edit the **Master's** `postgresql.conf` uncomment lines as necessary:

    {{< file-excerpt "/etc/postgresql/9.6/main/postgresql.conf" conf >}}
#From CONNECTIONS AND AUTHENTICATION Section
listen_addresses = '*'
#From WRITE AHEAD LOG Section
wal_level = replica
min_wal_size = 80MB
max_wal_size = 1GB
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/9.6/main/archive/%f'
archive_timeout = 1h
#From REPLICATION Section
max_wal_senders = 3
wal_keep_segments = 10

{{< /file-excerpt >}}

4. Next edit the **Slave's** `postgresql.conf`:

    {{< file-excerpt "/etc/postgresql/9.6/main/postgresql.conf" conf >}}
listen_addresses = '*'
#From WRITE AHEAD LOG Section
wal_level = replica
#From REPLICATION Section
max_wal_senders = 3
wal_keep_segments = 10
hot_standby = on

{{< /file-excerpt >}}

From the file above you are setting:

* `listen_addresses`: represent what IP addresses lo listen on. The "*" means that the server will listen to all IP addresses. You can limit this to only include the IP addresses that you consider safe.
* `wal_level`: is set to `replica` to perform the required operations.
* `min_wal_size`: is the minimum size the transaction log will be.
* `max_wal_size`: is the actual target size of WAL at which a new checkpoint is triggered.
* `archive_mode`: set to "on" to activate the archive storage (see below).
* `archive_timeout`: this value forces the server to send a WAL segment periodically (even if `min_wal_size` is not reached). This is useful if you expect little WAL traffic.
* `archive_command`: is the local shell command to execute in order to archive a completed WAL file segment.
* `max_wal_senders`: specifies the maximum number of concurrent connections from **Slave** node.
* `wal_keep_segments`: specifies the minimum number of past log file segments kept in the pg_xlog directory, in case a standby server (**Slave** node) needs to fetch them for streaming replication.
* `hot_standby = on`: specifies that the **Slave** server can connect and run queries during recovery.

### Synchronize Master and Slave Node Data


1. Double check that your **Slave** PostgreSQL service is not running.

        sudo systemctl status postgresql

2. Start your **Master** PostgreSQL service:

        sudo systemctl start postgresql

3. Rename your **Slave's** data directory before continuing:

        sudo mv /var/lib/postgresql/9.6/main /var/lib/postgresql/9.6/main_old


4. Now from your **Slave** node run the following command in order to transfer to it all **Master's** data:

        sudo -u postgres pg_basebackup -h masterdb.yourdomain.com --xlog-method=stream \
         -D /var/lib/postgresql/9.6/main/ -U replicauser -v -P

You will be prompted with the `replicauser` password. Once the transfer is complete your **Slave** will be synchronized with the **Master** database. That means you have an exact replica of your master database.

{{< caution >}}
It's crucial that your **Slave's** PostgreSQL service remains stopped until all configuration is done.
{{< /caution >}}

### Create the Recovery File on the Slave Node

1. Copy the sample recovery file as template for your requirements:

        sudo cp -avr /usr/share/postgresql/9.6/recovery.conf.sample \
        /var/lib/postgresql/9.6/main/recovery.conf

2. Edit the recovery file you just copied:

    {{< file "/var/lib/postgresql/9.6/main/recovery.conf" conf >}}
standby_mode = 'on'
primary_conninfo = 'host=masterdb.yourdomain.com port=5432 user=replicauser password=REPLICAUSER_PWD'
restore_command = 'cp /var/lib/postgresql/9.6/main/archive/%f %p'
trigger_file = '/tmp/postgresql.trigger.5432'
{{< /file >}}

3. Start the PostgreSQL service on the **Slave** node:

        sudo systemctl start postgresql

The parameters are self-explanatory, you are configuring your **Slave** to perform the inverse operation (restore) from what you did in the previous section. Is out of the scope of this guide to discuss a full fail-over configuration, but can add more options as needed as described in the [PostgreSQL documentation for recovery.](https://www.postgresql.org/docs/9.6/static/recovery-config.html)

### Test Replication

It's advisable that you test your setup to check that everything will work as expected.

1. In the **Master** server change to the `postgres` user and verify the replication status:

        sudo -u postgres psql -x -c "select * from pg_stat_replication;"

    {{< output >}}
-[ RECORD 1 ]----+------------------------------
pid              | 6005
usesysid         | 16385
usename          | replicauser
application_name | walreceiver
client_addr      | 66.228.54.56
client_hostname  |
client_port      | 36676
backend_start    | 2018-01-23 19:14:26.573184+00
backend_xmin     |
state            | streaming
sent_location    | 0/6000F60
write_location   | 0/6000F60
flush_location   | 0/6000F60
replay_location  | 0/6000F60
sync_priority    | 0
sync_state       | async
{{< /output >}}

2. Now to see the replication in action create a test database on your **Master** server with the `odoo` user :

        sudo createdb -h localhost -p 5432 -U odoo helloworld

3. In the **Slave** server check the presence of the new database you just created through `postgres` user and `psql` console :

        sudo -u postgres psql

4. List all databases:

        \l

5.  Exit `psql`:

        \q

This test not only confirms that replication is working but also that the `odoo` user is ready to perform database operations.

### Enable PostgreSQL on Startup

Enable the `postgresql` service on both **masterdb** and **slavedb**:

        sudo systemctl enable postgresql

## Odoo 11 Setup

In this section you will configure your Odoo 11 web application to work with Nginx Reverse Proxy and PostgreSQL database backend. The procedure is similar to the one used in our guide: [Install Odoo 10 on Ubuntu 16.04](https://linode.com/docs/websites/cms/install-odoo-10-on-ubuntu-16-04/) but some important differences are in place.

### Create Odoo User

In order to separate Odoo from other services, create a new Odoo system user to run its processes:

    sudo adduser --system --home=/opt/odoo --group odoo

### Configure Logs

This guide will use a separate file for logging Odoo activity:

    sudo mkdir /var/log/odoo

### Install Odoo 11

1.  Install git:

        sudo apt install git

2. Clone the Odoo files onto your server:

        sudo git clone https://www.github.com/odoo/odoo --depth 1 \
        --branch 11.0 --single-branch /opt/odoo

    {{< note >}}
**Important:** Odoo 11 application now uses Python 3.x instead of Python 2.7. If you are using Ubuntu 14.04 this could bring additional steps for your installation. Dependencies are now grouped to highlight the new changes.
{{< /note >}}

3. Enforce the use of POSIX locale this will prevent possible errors during installation (this has nothing to do with the Odoo language):

        export LC_ALL=C

4. Install new Python3 dependencies:

        sudo apt-get install python3 python3-pip python3-suds python3-all-dev \
        python3-dev python3-setuptools python3-tk

5. Install global dependencies (common to Odoo version 10):

        sudo apt install git libxml2-dev libxslt1-dev libevent-dev libsasl2-dev libldap2-dev \
        pkg-config libtiff5-dev libjpeg8-dev libjpeg-dev zlib1g-dev libfreetype6-dev \
        liblcms2-dev liblcms2-utils libwebp-dev tcl8.6-dev tk8.6-dev libyaml-dev fontconfig

6.  Install Odoo 11 specific Python dependencies, please note the use of `pip3` instead of `pip`.

        sudo -H pip3 install --upgrade pip
        sudo -H pip3 install -r /opt/odoo/doc/requirements.txt
        sudo -H pip3 install -r /opt/odoo/requirements.txt

7. Install Less CSS via nodejs and npm, please notice that you'll use Node version 6.x instead of version 4.x from previous guide:

        sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - \
        && sudo apt-get install -y nodejs \
        && sudo npm install -g less less-plugin-clean-css

8. Download to a suitable location `wkhtmltopdf` stable package. Unlike previous guides the stable package is now a *Linux Generic amd64 binary* and not an Ubuntu-specific Debian package. By the time of this writing the latest version is 0.12.4, please check in Github for a newer version and change the link accordingly:

        cd /tmp
        wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz

9. Extract the package:

        tar -xvf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz

10. To ensure that `wkhtmltopdf` functions properly, move the binaries to an adequate location in your executable path and give them the necessary permission for execution:

        sudo mv wkhtmltox/bin/wk* /usr/bin/ \
        && sudo chmod a+x /usr/bin/wk*

{{< note >}}
While wkhtmltopdf version 0.12.2.4 is available in the official Ubuntu 16.04 repository, we don't advise installing it from there due to the large number of dependencies including: `xserver`, `gstreamer`, `libcups`, `wayland`, `qt5` and many more.
{{< /note >}}

### Odoo Server Configuration

1.  Copy the included configuration file to a more convenient location, changing its name to `odoo-server.conf`

        sudo cp /opt/odoo/debian/odoo.conf /etc/odoo-server.conf

2.  Next, modify the configuration file. The complete file should look similar to this, depending on your deployment needs:

    {{< file "/etc/odoo-server.conf" conf >}}
[options]
admin_passwd = admin
db_host = masterdb.yourdomain.com
db_port = False
db_user = odoo
db_password = <ODOO_DB_STRONG_PWD>
addons_path = /opt/odoo/addons
logfile = /var/log/odoo/odoo-server.log
xmlrpc_port = 8070
{{< /file >}}

*  `admin_passwd ` - This is the password that allows administrative operations within Odoo GUI. Be sure to change `admin` to something more secure.
*  `db_host` - This is the PostgreSQL **Master** server FQDN.
*  `db_port` - Odoo uses PostgreSQL default port `5432`, change this only if you're using custom PostgreSQL settings.
*  `db_user` - Name of the PostgreSQL database user. In this case we used the default name, but if you used a different name when creating your user, substitute that here.
*  `db_password` - Use the PostgreSQL `odoo` user password you created previously.
*  `addons_path` - This is the default addons path, you can add custom paths separating them with commas: `</path/to/custom/modules>`
*  `logfile`. This is the path to your Odoo logfiles.
*  `xmlrpc_port`. This is the port used to receive traffic from the Nginx reverse proxy. This argument must match any value used during Nginx configuration, specifically `proxy_pass`.

### Create an Odoo Service

Create a systemd unit called `odoo-server` to allow your application to behave as a service. Create a new file at `/lib/systemd/system/odoo-server.service` and add the following contents:

{{< file "/lib/systemd/system/odoo-server.service" shell >}}
[Unit]
Description=Odoo Open Source ERP and CRM

[Service]
Type=simple
PermissionsStartOnly=true
SyslogIdentifier=odoo-server
User=odoo
Group=odoo
ExecStart=/opt/odoo/odoo-bin --config=/etc/odoo-server.conf --addons-path=/opt/odoo/addons/
WorkingDirectory=/opt/odoo/

[Install]
WantedBy=multi-user.target
{{< /file >}}


### Change File Ownership and Permissions

1.  Change the `odoo-server` service permissions and ownership so only root can write to it, while the `odoo` user will only be able to read and execute it.

        sudo chmod 755 /lib/systemd/system/odoo-server.service \
        && sudo chown root: /lib/systemd/system/odoo-server.service

2.  Since the `odoo` user will run the application, change its ownership accordingly.

        sudo chown -R odoo: /opt/odoo/

3.  Set the `odoo` user as the owner of log directory as well:

        sudo chown odoo:root /var/log/odoo

4.  Finally, protect the server configuration file. Change its ownership and permissions so no other non-root user can access it:

        sudo chown odoo: /etc/odoo-server.conf \
        && sudo chmod 640 /etc/odoo-server.conf

### Testing your Odoo Stack

1.  Confirm that everything is working as expected. First, start the Odoo server:

        sudo systemctl start odoo-server

2.  Check the service status to make sure it's running:

        sudo systemctl status odoo-server

3. In a browser, navigate to `odoo.yourdomain.com` or the IP address of the **odoo** Linode. If your proxy and your DNS configuration are working properly a login screen will appear.

4. Click on the **Manage Databases** link:

    ![Odoo 11 Login Screen](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-login-screen.png)

5.  Now you can see the test database you created before, please click on **Create Database** button and fill out the form with a test database. Check the **Load demonstation data** box to populate your database with sample data.

    ![Odoo 11 Create Database](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-create-db.png)

6. In the browser, you should see a list of available apps, indicating that database creation was successful:

    ![Odoo 11 welcome screen](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-welcome.png)

### Enable the Odoo Service

1.  Enable the `odoo-server` service to start automatically on reboot:

        sudo systemctl enable odoo-server

2.  Reboot your Linode from the Linode Manager.

3.  Check the Odoo logs to verify that the Odoo server is running:

        sudo cat /var/log/odoo/odoo-server.log

## Back Up Odoo Databases

If all components of the Odoo stack are running on a single server, it is simple to back up your databases using the Odoo web interface. However, this will not work with the configuration in this guide, since PostgreSQL was not installed on the **odoo** Linode.

You therefore have two options to backup or transfer your production database:

1. You can install PostgreSQL 9.6 on the **odoo** server using the procedure used for **masterdb** and **slavedb**. This will install `pg_dump` and other utilities, allowing you to use Odoo GUI as before. Since Odoo configuration is explicit about database connection you will not have to worry about anything else: using this method will restore the database to the **masterdb** server rather than **odoo**.

2. You can also use a similar procedure to the one used in [Synchronize Master and Slave Node Data](#synchronize-master-and-slave-node-data). Instead of synchronizing with a slave node, you can synchronize to a test or backup database server.
    1. Edit `/etc/postgresql/9.6/main/pg_hba.conf` on **masterdb** to allow the test server to connect to it.
    2. On the test server, stop the PostgreSQL service, move/rename/delete its current data, and run the `pg_basebackup` command as before:

            sudo systemctl stop postgresql

            sudo mv /var/lib/postgresql/9.6/main /var/lib/postgresql/9.6/main_old

            sudo -u postgres pg_basebackup -h <masterdb public ip> --xlog-method=stream -D /var/lib/postgresql/9.6/main/ -U replicauser -v -P

### Updating Odoo Modules

Once you have restored, transfered or synchronized your production database to the testing server you can update Odoo modules:

From your test server restart the Odoo service using the following flags to indicate the system to search for updates and apply any changes to modules:

      sudo service odoo-server restart -u all -d <production_database_name>

### Update your System

If all your tests pass, you can safely update your installation.

1.  From your Linode download the new code from source:

        cd /opt/odoo \
        && sudo git fetch origin 11.0

2.  Apply the changes to your repository:

        sudo git reset --hard origin/11.0

{{< note >}}
Do not confuse the Odoo system update with Odoo **version** upgrade. With the method explained above, you are updating your Odoo application within the same version rather than **upgrading** to a newer Odoo version. Migrating from one version to another often requires several tests and manual modifications on the PostgreSQL database which are highly dependent on the version of Odoo you are upgrading from.
{{< /note >}}

## Next Steps

For a full production deployment, you should consider expanding this implementation to include SSL/TLS encryption (most likely using a reverse proxy), VPN tunnels between nodes, and Terraform deployment automation. When updating or adding modules, having a separate deployment (the test servers referenced in previous sections) on which to test any changes before deploying to the production servers is also recommended.


* [Install an SSL certificate with LetsEncrypt](/docs/security/ssl/install-lets-encrypt-to-create-ssl-certificates).
* [How to Set up tinc, a Peer-to-Peer VPN](https://linode.com/docs/networking/vpn/how-to-set-up-tinc-peer-to-peer-vpn/)
* [Using Terraform to Provision Linode Environments](https://linode.com/docs/platform/how-to-build-your-infrastructure-using-terraform-and-linode/)

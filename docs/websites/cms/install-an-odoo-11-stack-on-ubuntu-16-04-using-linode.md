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

![Install a Odoo 11 Stack on Ubuntu 16.04 using Linode](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode.png)



[Odoo](https://www.odoo.com/) (formerly known as OpenERP) is a suite of open source business apps that cover all your company needs: CRM, eCommerce, accounting, inventory, point of sale, project management just too name a few. Odoo's unique value proposition is to be at the same time very easy to use and fully integrated. This assertion is backed by more than three million users that grow their business with Odoo.

This guide covers how to deploy an Odoo 11 stack using Linode cloud servers in a way that will be easy to upgrade, maintain and customize to your own needs.

## System Requirements

This guide will require the following *minimal* Linode specifications:

* Nginx Reverse Proxy - Linode **1GB**.
* PostgreSQL database (each node) - Linode **2GB**
* Odoo 11 web application (each node) - Linode **1GB**

Keep in mind that your implementation will probably need higher plans depending on the number of end-users you want to serve and the number of modules you plan to incorporate.

{{< note >}}
All nodes will run under Ubuntu 16.04 LTS, if you plan to use a different operating system (like CentOS) then be aware that you will need to adapt the arguments and commands as necessary.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## About Firewall Rules

This article comprises the deployment of a cloud stack, firewall rules can vary depending on your particular security concerns. As a reference, you will need to setup this minimal rules on your nodes:

| Node | Open TCP Ports |
| ------------ |:--------:|
| Nginx Reverse Proxy | `22, 6010, 80` |
| Odoo 11 application | `22, 6010, 5432, 8070` |
| PostgreSQL database | `22, 6010, 5432` |

Ports `22`, `80` and `5432` are the default for SSH, HTTP and PostgreSQL communications respectively. Port `6010` is used for Odoo communications and port `8070` is used by Odoo's own webserver. To open a particular port you can use:

        sudo ufw allow 22/tcp

That example opens SSH port in your firewall. For more detailed information about firewall setup please read our guide [How to Configure a Firewall with UFW](https://linode.com/docs/security/firewalls/configure-firewall-with-ufw/).

## Why You Need an Odoo Stack

First, let's take a look at the traditional Odoo standalone installation:

![Odoo Stand Alone Deployment](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-deployment-01.png)

As you can see the main components of the Odoo "stack" are:

* **Nginx** (reverse proxy) - totally optional. Can direct traffic from Internet (port 80) to default Odoo webserver port (8069 or 8070).
* **Odoo** - is the core application, responsible of almost all logic operations.
* **PostgreSQL** database - is in charge of main data storage as well as main components (modules) objects.

Is you are planning to use Odoo in a small office with few users then that deployment is totally viable. But what happens if your use case include a high demand environment with dozens or hundreds of users connecting from different locations? What if you need a HA deployment or simply you want an scalable solution? In that case a single server won't offer the best fit.

![Odoo Multi-Server Deployment](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-deployment-02.png)

Now consider the above infrastructure. Traffic from the Internet hits the Nginx reverse-proxy which job is to direct all requests right to Odoo Linode. Then, Odoo connects to the master database node to retrieve the information what it needs. Any change in the master node is automatically replicated in the slave node.

That kind of deployment offers:

* The possibility to "fine-tune" each component of the stack. You can optimize your reverse-proxy (or any other node) without affecting the rest.
* The ability to scale each node independently. Determining the exact requirements for Odoo or PostgreSQL nodes is a complex task. This setup allows you to measure the demand and increase (or decrease) your cloud resources as needed.
* Arguably, this solution offers better security. Some components (as the database) is not exposed directly to the Internet.
* Finally, this setup offers some degree of disaster-recovery flexibility by means of the database replication.

This article will show you the step-by-step process to deploy a production-like infrastructure including a separate stage/testing branch.

![Odoo Deployment for Production and Testing](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-deployment-03.png)

## Hostname Assignment

The Odoo 11 stack will use the following FQDN convention:

| Node | Static IP | FQDN |
| ------------ |:--------:| :-----------:|
| Nginx Reverse Proxy | 10.1.2.10 | proxy.yourdomain.com |
| Odoo 11 Production | 10.1.3.10 | odoo.yourdomain.com |
| Odoo 11 Stage | 10.1.3.20 | odoo-stage.yourdomain.com |
| PostgreSQL Prod. Master | 10.1.1.10 | masterdb.yourdomain.com |
| PostgreSQL Prod. Slave | 10.1.1.20 | slavedb.yourdomain.com |
| PostgreSQL Stage Master | 10.1.1.30 | stage-masterdb.yourdomain.com |
| PostgreSQL Stage Slave | 10.1.1.40 | stage-slavedb.yourdomain.com |


For each node in the stack you will need to edit the `/etc/hosts` file:

        sudo nano /etc/hosts

1. For the PostgreSQL Production Master:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       masterdb.yourdomain.com   masterdb

10.1.1.20       slavedb.yourdomain.com    slavedb
10.1.3.10       odoo.yourdomain.com       odoo

{{< /file-excerpt >}}

2. For the PostgreSQL Production Slave:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       slavedb.yourdomain.com    slavedb

10.1.1.10       masterdb.yourdomain.com   masterdb
10.1.3.10       odoo.yourdomain.com       odoo
{{< /file-excerpt >}}

3. For the Nginx Reverse Proxy:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       proxy.yourdomain.com      proxy

10.1.3.10       odoo.yourdomain.com       odoo
{{< /file-excerpt >}}

4. For the Production Odoo 11 server:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       odoo.yourdomain.com       odoo

10.1.1.10       masterdb.yourdomain.com   masterdb
10.1.1.20       slavedb.yourdomain.com    slavedb
{{< /file-excerpt >}}

5. For the Stage PostgreSQL Master:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       stage-masterdb.yourdomain.com   stage-masterdb

10.1.1.40       stage-slavedb.yourdomain.com    stage-slavedb
10.1.3.20       odoo-stage.yourdomain.com       odoo-stage
{{< /file-excerpt >}}

6. For the Stage PostgreSQL Slave:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       stage-slavedb.yourdomain.com    stage-slavedb

10.1.1.30       stage-masterdb.yourdomain.com   stage-masterdb
10.1.3.20       odoo-stage.yourdomain.com       odoo-stage
{{< /file-excerpt >}}

7. For the Stage Odoo 11 server:

    {{< file-excerpt "/etc/hosts" conf >}}
127.0.0.1       localhost
127.0.1.1       odoo-stage.yourdomain.com       odoo-stage

10.1.1.30       stage-masterdb.yourdomain.com   stage-masterdb
10.1.1.40       stage-slavedb.yourdomain.com    stage-slavedb
{{< /file-excerpt >}}

    {{< note >}}
Throughout this guide Fully Qualified Domain Names (FQDN) will be used whenever possible to avoid confusing the nodes.
{{< /note >}}

## Postgresql Setup

The first component to configure will be the database backend. A **Master** node will be in charge of all transactions and additionally will be streaming to a secondary server: the **Slave**.

### Install PostgreSQL

PostgreSQL version 9.6 offers significant improvements for database replication but unfortunately is not included in the default Ubuntu 16.04 repositories. Please follow this procedure on all PostgreSQL nodes (Production and Stage) to install the newest version:

1. Add the official PostgreSQL-Xenial repository to your system:

        sudo add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main"

2. Import the repository key:

        wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

3. Update your `apt` cache:

        sudo apt update

4. Install PostgreSQL 9.6 in all database nodes:

        sudo apt install postgresql-9.6 postgresql-server-dev-9.6

### Create PostgreSQL users

Here start the difference with the standalone Odoo installation. You will need to create the PostgreSQL user for Odoo on all Database nodes but you will also need to create a special user for replication tasks in the **Master** node of Production and Stage Linodes.

Let's begin with the PostgreSQL user needed for Odoo communications, you must create this user on **Master** and **Slave** nodes (Production and Stage):

1. Switch to the `postgres` user and create the database user `odoo` in charge of all operations (provide a strong password and save it in a secure location, you need need it later) :

        sudo -u postgres createuser odoo -U postgres -dRSP

    {{< note >}}
Keep in mind that you should use **the same password** for the Odoo-PostgreSQL user in all nodes. Odoo is not aware of database replication, will be easier to trigger an eventual failover procedure if both servers share the same information.
    {{< /note >}}

2. Now you need to create the `replicauser` on the **Master** node (Production and Stage):

        sudo -u postgres createuser replicauser -U postgres -P --replication

Note that this user has less privileges than the `odoo` user this is because the `replicauser` only purpose is to allow the **Slave** to read information from the **Master** nodes. Similar to the `odoo` user you will need to set a strong password, this one can be different. The `--replication` option grants the required privilege that `replicauser` need to perform its job.

### Configure Host Based Authentication

1. Stop the PostgreSQL service on all nodes (this is **very** important):

        sudo service postgresql stop

2. The next step is to edit the `pg_hba.conf` file to allow PostgreSQL nodes to communicate to each other. Each line provides the client authentication permissions to connect to an specific database. Start adding the following lines to the Production **Master** database server. For example, the first line allows the **Slave** to connect to the **Master** node using `replicauser` the last line grants to the `odoo` user the rights connect to "all" databases within this server:

    {{< file-excerpt "/etc/postgresql/9.6/main/pg_hba.conf" conf >}}
host    replication     replicauser      slavedb.yourdomain.com         md5
host    replication     replicauser      stage-master.yourdomain.com    md5
host    all             odoo             odoo.yourdomain.com            md5
{{< /file-excerpt >}}

3. Now edit the Stage **Master** node:

    {{< file-excerpt "/etc/postgresql/9.6/main/pg_hba.conf" conf >}}
host    replication     replicauser      master.yourdomain.com                md5
host    replication     replicauser      stage-slavedb.yourdomain.com         md5
host    all             odoo             odoo-stage.yourdomain.com            md5
{{< /file-excerpt >}}

4. It's a good idea to add a similar configuration in the **Slave** node that way will be much easier to promote it to "master" status if necessary:

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

You can configure this file to fit any of your needs, in this implementation we are preparing the **Master** nodes for connections not only to the Odoo and **Slave** nodes but also "master-master" communications. That could be useful as you will discover at the end of the article.

{{< note >}}
You can use `hostssl` option instead of `host`, but that requires SSL encryption support on both ends. Please read our guide [Install Let's Encrypt to Create SSL Certificates](https://www.linode.com/docs/security/ssl/install-lets-encrypt-to-create-ssl-certificates/) for more information on how to get started with SSL.
{{< /note >}}

### Configure Archiving and Replication

1. Edit the **Master's** `postgresql.conf` uncomment lines as necessary (Production and Stage):

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

From the file above you are setting:

* `listen_addresses`: represent what IP addresses lo listen on. The "*" means that the server will listen to all IP addresses. You can limit this to only include the IP addresses that you consider safe.
* `wal_level`: is set to `replica` to perform the required operations.
* `min_wal_size`: is the minimum size the transaction log will be.
* `max_wal_size`: is the actual target size of WAL at which a new checkpoint is triggered.
* `archive_mode`: set to on to activate the archive storage (see below).
* `archive_timeout`: this value forces the server to send a WAL segment periodically (even if `min_wal_size` is not reached). This is useful if you expect little WAL traffic.
* `archive_command`: is the local shell command to execute to archive a completed WAL file segment.
* `max_wal_senders`: specifies the maximum number of concurrent connections from **Slave** node.
* `wal_keep_segments`: specifies the minimum number of past log file segments kept in the pg_xlog directory, in case a standby server (**Slave** node) needs to fetch them for streaming replication.

    {{< note >}}
Please consider this configuration as a starting point. Your implementation could need some fine tuning, especially  the WAL-related parameters. As for the `archive_command` keep in mind that you can also use an external location (like a NAS or Cloud Storage).
{{< /note >}}


2. Create the `archive` directory for WAL files in both **Master** nodes:

        sudo mkdir -p /var/lib/postgresql/9.6/main/archive/

3. Change the `archive` directory permissions to allow `postgres` user to read and write on it:

        sudo chown postgres: -R /var/lib/postgresql/9.6/main/archive/

4. Now edit the both **Slave's** `postgresql.conf`:

    {{< file-excerpt "/etc/postgresql/9.6/main/postgresql.conf" conf >}}
listen_addresses = '*'
#From WRITE AHEAD LOG Section
wal_level = replica
#From REPLICATION Section
max_wal_senders = 3
wal_keep_segments = 10
hot_standby = on

{{< /file-excerpt >}}

As you can see the file looks very similar to the previous one with the exception of `hot_standby = on` which specifies that this server can connect and run queries during recovery.

### Syncronize Master and Slave Node Data

Follow this procedure for Production and Stage PostgreSQL Linodes:

1. Double check that your **Slave** PostgreSQL service is not running.

        sudo service postgresql stop

2. Start your **Master** PostgreSQL service:

        sudo service postgresql start

3. Rename your **Slave's** data directory before continuing:

        sudo mv /var/lib/postgresql/9.6/main /var/lib/postgresql/9.6/main_old

4. Perform a backup of the data directory from **Master** node to the **Slave** node using the PostgreSQL backup utility:

        sudo -u postgres pg_basebackup -h masterdb.yourdomain.com --xlog-method=stream \
         -D /var/lib/postgresql/9.6/main/ -U replicauser -v -P

You will be prompted with the `replicauser` password. Once the transfer is complete your **Slave** will be synchronized with the **Master** database. That means you have an exact replica of your master database.

{{< caution >}}
It's crucial that your **Slave's** PostgreSQL service remains stopped until all configuration is done.
{{< /caution >}}

### Create the Recovery File on the Slave Node

Once again, repeat this procedure for Production and Stage Linodes. Change FQDN as necessary:

1. Copy the sample recovery file as template for your requirements:

        sudo cp -avr /usr/share/postgresql/9.6/recovery.conf.sample \
        /var/lib/postgresql/9.6/main/recovery.conf

2. Edit the recovery file you just copied (remember to use `stage-masterdb.yourdomain.com` for Stage Linode):

    {{< file "/var/lib/postgresql/9.6/main/recovery.conf" conf >}}
standby_mode = 'on'
primary_conninfo = 'host=masterdb.yourdomain.com port=5432 user=replicauser password=REPLICAUSER_PWD'
restore_command = 'cp /var/lib/postgresql/9.6/main/archive/%f %p'
trigger_file = '/tmp/postgresql.trigger.5432'
{{< /file >}}

3. Now you can finally start the PostgreSQL service on the **Slave** node:

        sudo service postgresql start

The parameters are self-explanatory, you are configuring your slave to perform the inverse operation (restore) from what you did in the previous section. Is out of the scope of this guide to discuss a full fail-over configuration, but can add more options as needed as described in the [PostgreSQL documentation for recovery.](https://www.postgresql.org/docs/9.6/static/recovery-config.html)

### Test Replication

It's advisable that you test your setup not only in Production Linodes but also in Stage to check that everything will work as expected.

1. In the **Master** server change to the `postgres` user and verify the replication status:

        sudo -u postgres psql -x -c "select * from pg_stat_replication;"

    ![Master Replication status](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-masterdb-replication-status.png)

2. Now to see the replication in action create a test database on your **Master** server with the `odoo` user :

        sudo createdb -h localhost -p 5432 -U odoo helloworld

3. In the **Slave** server check the presence of the new database you just created though `postgres` user and `psql` console :

        sudo -u postgres psql

4. List all databases, once finished press twice **Ctrl+D** to exit.

        \l

This test not only confirms that replication is working but also that `odoo` user is ready to perform database operations.

### Enable PostgreSQL on Startup

Now that you tested your database backend it's time to enable the nodes to start the service on startup:

        sudo service postgresql enable

Congratulations! You just finished your PostgreSQL installation.

## Nginx Setup

Installation can't be easier, just run from Nginx Linode:

        sudo apt install nginx

In this implementation the only purpose of Nginx is to "direct traffic" to the appropriate Linode:

* Traffic from Internet pointed to `http://yourdomain.com` >> will be directed to the static address: `http://10.1.3.10:8070` (Odoo Production Linode).
* Trafiic from Internet pointed to `http://odoo-stage.yourdomain.com` >> will be directed to the static address: `http://10.1.3.20:8070` (odoo Stage Linode).

Configuring your Name Servers and DNS records is out of the scope of this article, please read our guide [DNS Manager Overview](https://linode.com/docs/networking/dns/dns-manager-overview/) to get step by step instructions on how you can setup your Linodes and Domains.

### Configure Nginx Reverse Proxy

1. Create a configuration file for your Production application:

    {{< file "/etc/nginx/sites-available/yourdomain.com" conf >}}
server {
    listen 80 default_server;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://10.1.3.10:8070/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
{{< /file >}}

2. Now create a configuration file for your Stage Linode:

    {{< file "/etc/nginx/sites-available/odoo-stage.yourdomain.com" conf >}}
server {
    listen 80;
    server_name odoo-stage.yourdomain.com www.odoo-stage.yourdomain.com;

    location / {
        proxy_pass http://10.1.3.20:8070/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
{{< /file >}}

3. Create a symlink to `sites-enabled`:

        sudo ln -s /etc/nginx/sites-available/yourdomain.com \
         /etc/nginx/sites-enabled/yourdomain.com && \
        sudo ln -s /etc/nginx/sites-available/odoo-stage.yourdomain.com \
        /etc/nginx/sites-enabled/odoo-stage.yourdomain.com

4. Remove the default symlink:

        sudo rm /etc/nginx/sites-enabled/default

From the configuration files you can see that the Production Odoo Linode is set as the "default" server you can also notice that both nodes use the same PostgreSQL port, this is possible because they reside in different physical machines with unique IP addresses. For more information about Nginx configuration please read our guide: [How to Use NGINX as a Reverse Proxy](https://linode.com/docs/web-servers/nginx/nginx-reverse-proxy/).

### Enable Nginx Reverse Proxy on Startup

To enable the service on startup use the same procedure as for PostgreSQL:

        sudo service nginx enable


## Odoo 11 Setup

In this section you will configure your Odoo 11 web application to work with Nginx Reverse Proxy and PostgreSQL database backend. The procedure is similar to the one used in our guide: [Install Odoo 10 on Ubuntu 16.04](https://linode.com/docs/websites/cms/install-odoo-10-on-ubuntu-16-04/) but some important differences are in place.

{{< note >}}
Unless specified otherwise the procedure is the same for Production and Stage Odoo Linodes.
{{< /note >}}

### Create Odoo User

In order to separate Odoo from other services, create a new Odoo system user to run its processes:

    sudo adduser --system --home=/opt/odoo --group odoo

{{< note >}}
Don't be confused with the previous `odoo` user you created in the PostgreSQL section, this is a Unix system user.
{{< /note >}}

### Configure Logs

This guide will use a separate file for logging Odoo activity:

        sudo mkdir /var/log/odoo

It's important to note that since Odoo is your main application you could use any location even an external location for saving your log files.

### Install Odoo 11

1. Clone the Odoo files onto your server:

        sudo git clone https://www.github.com/odoo/odoo --depth 1 \
        --branch 11.0 --single-branch /opt/odoo

    {{< note >}}
**Important:** Odoo 11 application now uses Python 3.x instead of Python 2.7. If you are using Ubuntu 14.04 this could bring additional steps for your installation. Dependencies are now grouped to highlight the new changes.
{{< /note >}}

2. Enforce the use of POSIX locale this will prevent possible errors during installation (this has nothing to do with the Odoo language):

        export LC_ALL=C

3. Install new Python3 dependencies:

        sudo apt-get install python3 python3-pip python3-suds python3-all-dev \
        python3-dev python3-setuptools python3-tk

4. Install global dependencies (common to Odoo version 10):

        sudo apt install git libxml2-dev libxslt1-dev libevent-dev libsasl2-dev libldap2-dev \
        pkg-config libtiff5-dev libjpeg8-dev libjpeg-dev zlib1g-dev libfreetype6-dev \
        liblcms2-dev liblcms2-utils libwebp-dev tcl8.6-dev tk8.6-dev libyaml-dev fontconfig

5.  Install Odoo 11 specific Python dependencies, please note the use of `pip3` instead of `pip`.

        sudo -H pip3 install --upgrade pip
        sudo -H pip3 install -r /opt/odoo/doc/requirements.txt
        sudo -H pip3 install -r /opt/odoo/requirements.txt

6. Install Less CSS via nodejs and npm, please notice that you'll use Node version 6.x instead of version 4.x from previous guide:

        sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - \
        && sudo apt-get install -y nodejs \
        && sudo npm install -g less less-plugin-clean-css

7. Download to a suitable location `wkhtmltopdf` stable package. Unlike previous guides the stable package is now a *Linux Generic amd64 binary* and not an Ubuntu-specific Debian package. By the time of this writing the latest version is 0.12.4, please check in Github for a newer version and change the link accordingly:

        cd /tmp
        wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz

8. Extract the package:

        tar -xvf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz

9. To ensure that `wkhtmltopdf` functions properly, move the binaries to an adequate location in your executable path and give them the necessary permission for execution:

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
*  `db_host` - This is the PostgreSQL **Master** server FQDN. *Read the note below.*
*  `db_port` - Odoo uses PostgreSQL default port `5432`, change this only if you're using custom PostgreSQL settings.
*  `db_user` - Name of the PostgreSQL database user. In this case we used the default name, but if you used a different name when creating your user, substitute that here.
*  `db_password` - Use the PostgreSQL `odoo` user password you created previously.
*  `addons_path` - This is the default addons path, you can add custom paths separating them with commas: `</path/to/custom/modules>`
*  `logfile`. This is the path to your Odoo logfiles.
*  `xmlrpc_port`. This is the port used to receive traffic from the Nginx reverse proxy. This argument must match any value used during Nginx configuration, specifically `proxy_pass`.

{{< note >}}
Your Stage server needs to connect to a different database host: `db_host = masterdb-stage.yourdomain.com` the rest of the configuration file is identical to Production.
{{< /note >}}

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

        sudo service odoo-server start

2.  Check the service status to make sure it's running:

        sudo service odoo-server status

3.  Verify that the Odoo server is able to stop properly:

        sudo service odoo-server stop

4.  Run a service status check again to make sure there were no errors:

        sudo service odoo-server status

5. Open a new browser window and enter in the address bar:

        http://yourdomain.com

6. If your proxy and your DNS configuration is working properly a login screen will show up. Please click on **Manage Databases** link:

    ![Odoo 11 Login Screen](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-login-screen.png)

7.  Now you can see the test database you created before, please click on **Create Database** button:

    ![Odoo 11 Create Database](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-create-db.png)

    {{< note >}}
If you didn't change the Administrative password in `odoo-server.conf` a warning message will be displayed as shown. You are encouraged to set the (strong) password now.
{{< /note >}}

8. A pop-up window will appear fill in with your desired Database name, email and strong password. Keep in mind that your email will be your username during authentication. Please check the option to "Load demonstration data" that will create several tables in the database and will fill them with example data which is ideal to test your PostgreSQL nodes. This process can take a while depending on your Linode plan.

    ![Database Creation Form](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-db-form.png)

9. Check the presence of your new database on both PostgreSQL nodes (Master and Slave) Remember to press **CTRL+D** twice to exit from `psql` session and `postgres` user when finished:

        sudo -u postgres psql

        \l

    ![Odoo 11 Database List](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-db-test.png)   

10. Congratulations! Your Odoo 11 implementation is working!

    ![Odoo 11 welcome screen](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-welcome.png)

### Enable the Odoo Service

1.  If neither of your system journals indicate any problems, enable the `odoo-server` unit to start and stop with the server:

        sudo systemctl enable odoo-server

2.  Log into the Linode Manager and reboot your Linode to see if everything is working as expected.

3.  Once restarted, log in via SSH and verify your log messages:

        sudo cat /var/log/odoo/odoo-server.log

    The output should include a message indicating that Odoo has started successfully.

## Updating Odoo

Before updating your Odoo system, you should check that everything will work as expected, especially third-party modules. The safest way to do this is to use a testing environment, which is nothing more than a separate Odoo installation.

You could deploy a third stack (Testing) following the procedures described in this guide or you can simply designate your ready-to-use Stage stack as the testing environment.

### Prepare your System for Production Tests

In our past Odoo guides you were instructed to backup the production database using Odoo's graphical interface:

![Odoo Backup GUI](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-backup-gui-01.png)

![Odoo Backup pop-up](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-backup-gui-02.png)

That is a practical solution to save the database backup in your local machine and then restore it (using the same GUI) to a different server/deployment. The current implementation will not allow you to use Odoo's GUI as you can see below:

![Odoo Backup GUI Error](/docs/assets/install-an-odoo-11-stack-on-ubuntu-16-04-using-linode/odoo-11-backup-gui-error.png)

At this point you have at least two easy solutions to backup/transfer your production database:

1. You could install PostgreSQL 9.6 in Odoo nodes (production and stage) using the same procedure described at the beginning of this guide. That will install `pg_dump` and other utilities allowing you to use Odoo GUI as before. Since Odoo configuration is explicit about database connection you will not have to worry about anything else, using this method will restore the database to PostgreSQL Master node not Odoo's local PostgreSQL installation. However, you need to consider if you want the extra packages installed in your Odoo machines including the associated security cost of doing so.

2. An alternative approach is to use a similar procedure as described in the section: "Syncronize Master and Slave Node data" but this time you will synchronize "Master production to Master stage" nodes. You already have everything in place, you just need to stop the (master) Stage node database service, move/rename/delete its current data and then run the `pg_basebackup` utility:

        sudo service postgresql stop

        sudo mv /var/lib/postgresql/9.6/main /var/lib/postgresql/9.6/main_old

        sudo -u postgres pg_basebackup -h 10.1.1.10 --xlog-method=stream -D /var/lib/postgresql/9.6/main/ -U replicauser -v -P

The only difference you might notice is the use of the static IP address instead of FQDN, you can still use the domain name but only after editing the Stage's `/etc/hosts` to include production database address.

### Updating Odoo Modules

Once you have restored, transfered or synchronized your production database to the stage server you can update Odoo modules:

*  From your Stage Linode restart the Odoo service using the following flags to indicate the system to search for updates and apply any changes to modules:

        sudo service odoo-server restart -u all -d <production_database_name>

At this point, you may encounter errors produced by incompatible changes in modules. This is rarely the case for Odoo standard modules but is not uncommon for ones downloaded from a third-party. If you do encounter an error, you'll need to check for a new version of the module that's causing it, and reinstall it manually.

*  If everything goes as expected, you can start your load tests modules "behavior" tests (which are different from code-incompatible errors), and any other tests you've configured.

### Update your Production System

If all your tests pass, you can safely update your production installation.

1.  From your production Linode download the new code from source:

        cd /opt/odoo \ 
        && sudo git fetch origin 11.0

2.  Apply the changes to your repository:

        sudo git reset --hard origin/11.0

3.  Access your new system:

        http://yourdomain.com

{{< note >}}
Do not confuse the Odoo system update with Odoo **version** upgrade. With the method explained above, you are updating your Odoo application within the same version you're not **upgrading** to a newer Odoo version. Migrating from one version to another often requires several tests and manual modifications on the PostgreSQL database which are highly dependent on the version of Odoo you are upgrading from.
{{< /note >}}

## Next Steps

If you plan to use Odoo 11 for your business, you may wish to expand this implementation to include SSL/TLS encryption, VPN tunnels between nodes or Terraform deployment automation.


* [Install an SSL certificate with LetsEncrypt](/docs/security/ssl/install-lets-encrypt-to-create-ssl-certificates).
* [How to Set up tinc, a Peer-to-Peer VPN](https://linode.com/docs/networking/vpn/how-to-set-up-tinc-peer-to-peer-vpn/)
* [Using Terraform to Provision Linode Environments](https://linode.com/docs/platform/how-to-build-your-infrastructure-using-terraform-and-linode/)

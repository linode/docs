---
author:
  name: Si-Qi Liu
  email: liusq@tsinghua.edu.cn
description: 'Installing the web framework Yesod with the server Nginx and MySQL on Debian 7'
keywords: ["yesod", " nginx", " mysql", " debian 7"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/frameworks/yesod-nginx-mysql-on-debian-7-wheezy/']
contributor:
    name: Si-Qi Liu
modified: 2014-09-25
modified_by:
  name: Linode
published: 2014-09-25
title: 'Yesod, Nginx, and MySQL on Debian 7 (Wheezy)'
external_resources:
 - '[Haskell Platform](http://www.haskell.org/platform/)'
 - '[Haskell Wiki for *cabal-install*](http://www.haskell.org/haskellwiki/Cabal-Install)'
 - '[Information for *yesod-platform*](http://hackage.haskell.org/package/yesod-platform)'
 - '[Yesod Quick Start Guide](http://www.yesodweb.com/page/quickstart)'
---

*This is a Linode Community guide by author Si-Qi Liu. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

Yesod is a web framework based on the purely functional programming language Haskell. It is designed for productive development of type-safe, RESTful, and high performance web applications. This guide describes the required process for deploying Yesod and Nginx web server, MySQL database on Debian 7 (Wheezy).

{{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as root or with the sudo prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites

Before you begin installing and configuring the components described below, please make sure you've followed our instructions in the [Getting Started](/docs/getting-started) guide for setting your hostname. Here's how to check.

1. Enter the following commands to view the hostname:

        hostname

2. And to display the fully qualified domain name (FQDN):

        hostname -f

	If the commands list a previously created hostname, then you can begin the installation.

3. Make sure your system is up to date. Issue the following command to update your system's repository database and upgrade the system:

		apt-get update
		apt-get upgrade

4. You also need Nginx and MySQL software. Please refer to [Websites with Nginx on Debian 7 (Wheezy)](/docs/websites/nginx/websites-with-nginx-on-debian-7-wheezy) and [Using MySQL Relational Databases on Debian 7 (Wheezy)](/docs/databases/mysql/using-mysql-relational-databases-on-debian-7-wheezy) for their installation guides.

## Install Required Packages

Since Yesod is built with the Haskell programming language, the Haskell packages are a preliminary install. The web framework Yesod requires two packages from the Haskell platform.

1. Issue the following command to install the Haskell packages required by Yesod:

   	 apt-get install haskell-platform libpcre3-dev libmysqlclient-dev

    The two `lib*-dev` packages are required by the Haskell module `mysql`. If you would like to use SQLite, then you don't need to install them.

## Install Yesod

Yesod is a large framework, which depends on many of other packages. We will use *cabal* to manage all of them. Cabal is a package manager for the Haskell community's central package archive *Hackage*. Because all packages on Hackage are maintained by the community, the dependency relationships are not well protected. So you might meet the so-called <a href="http://www.haskell.org/haskellwiki/Cabal/Survival#What_is_the_difficulty_caused_by_Cabal-install.3F" target="_blank">cabal dependency hell</a> problem.

To avoid this problem, the maintainers of Yesod created a metapackage named *yesod-platform*. The version numbers of its dependencies are fixed, so you won't meet the "cabal hell". On the other hand, fixed version numbers may cause other problems, especially when you also use cabal to manage other large projects (such as pandoc, a Haskell library for converting markup formats). The solution for this problem is very simple: if you have several large projects to manage, create new users for each of them, and then install them into their users' home folder.

1. So let's create a new user. We can name it "yesod":

        sudo adduser yesod

2. Then switch over to user yesod:

        su - yesod

3. Update cabal:

		cabal update

	Then you will find a new folder ``.cabal`` in yesod's home folder. The configuration files for ``cabal``, all programs, all libraries, and all their documents installed by ``cabal`` will be placed in this folder. In particular, new programs are installed in ``$HOME/.cabal/bin``. To use them, you can add this folder to yesod's PATH:

		echo PATH=\$HOME/.cabal/bin:\$PATH >> .bashrc
        source .bashrc

5. Upgrade *cabal-install* first. The *cabal-install* package offered by the *haskell-platform* package of Debian 7 doesn't have the "sandbox" feature, which is very useful for Yesod, so we need to upgrade it:

        cabal install cabal-install

6. Logout and su again, then check whether the new cabal is in use:

        exit
        su - yesod
        cabal --version

   The version should be greater than 1.20.

7. Upgrade *alex* and *happy*. They are "flex" and "bison" for Haskell. The *language-javascript* package, which is required by Yesod, depends on higher versions of them, so we need to upgrade them:

        cabal install alex happy

8.  Now you can install the ``yesod-platform`` and ``yesod-bin`` packages:

        cabal install --reorder-goals --max-backjumps=-1 yesod-platform yesod-bin

    The ``yesod-bin`` package provides scaffolding, devel server, and some simple code generation helpers for your ``yesod-platform``. We will use it in the next section to construct the scaffold for a new site.

    The flag ``--reorder-goals`` tries to reorder goals according to certain heuristics. It may make backtracking faster. If you don't add this flag, ``cabal`` may get into certain "bad" searching branches, and waste a lot of time and memory here. If your machine doesn't have enough memory, it is even possible that ``cabal`` cannot resolve the dependency relation, and give you an error message.

    The parameter ``--max-backjumps`` set the maximum number of back jumps. The default value is 200. We set it to -1, which means unlimited backtracking. If you don't add this parameter, ``cabal`` may fail, if it cannot find a solution within 200 steps of backtracking.

    It takes about 20 minutes to build the ``yesod-platform`` and ``yesod-bin`` packages on a Linode 1G.

## Use Yesod

To start development of your Yesod site, first construct a scaffold. In development, a scaffold is a placeholder or example set, which is constructed by the defaults of the framework or compiler chosen. The developer can then overwrite the scaffold site.

1. Initiate Yesod development with the commands:

        cd $HOME
        yesod init

	You will be asked the name of your project, and the database you want to use. You must name the project "myblog". This is important later on. And the answer for the second question is "mysql".

2. Enter the project folder created by *Yesod*:

        cd $HOME/myblog

3. Then, issue the following command to initialize the sandbox. The sandbox feature ensures that the dependencies of your site are installed *into* the folder where your site is located, so *cabal* won't destroy the packages installed in */home/yesod/.cabal*. You can develop several sites simultaneously, and you won't need to worry about the "cabal dependency hell":

        cabal sandbox init

    This command will generate a configuration file ``$HOME/myblog/cabal.sandbox.config``, and create a local cabal environment in ``$HOME/myblog/.cabal-sandbox``.

4. Then install the packages required by your project in the sandbox:

         cabal install --enable-tests . --reorder-goals  --max-backjumps=-1 yesod-platform yesod-bin

    It will compile and install all packages needed by our site "myblog" into the sandbox created in the last step. You may notice that the "sandbox" version of ``yesod-platform`` may be newer than the one we installed in the last section, because in the sandbox, ``cabal`` searches for the solution on a smaller tree, so the result could be better.

If you want to construct another site, just go back to ``$HOME`` folder, and issue ``yesod init`` again. Different sites won't affect each other because of the sandbox mechanism.

## Working with MySQL

Before testing the scaffold of your site, you need to create a user and several databases in MySQL. The "yesod" command has generated a configuration file for MySQL, which is located at ``$HOME/myblog/config/mysql.yml``. Take a look.

{{< file-excerpt "$HOME/myblog/config/mysql.yml" >}}
Default: &defaults
  user: myblog
  password: myblog
  host: localhost
  port: 3306
  database: myblog
  poolsize: 10

...

Production:
  database: myblog_production
  poolsize: 100
  <<: *defaults

{{< /file-excerpt >}}


Your site can be started in different environments such as Development, Testing, Staging and Production, and you can give different configurations for them. The configuration for the four different environments is given in the ``Default`` section. You can modify this section, using your own host, port, username, password, database, and so on. If you need different settings in the Production environment, for example, you can write your new settings in the ``Production`` section first, and then import the default ones by ``<<: *defaults``.

We don't need to modify this configuration file, it's acceptable as is. So you only need to create a user "myblog" with password "myblog", and four databases "myblog", "myblog_testing", "myblog_staging", and "myblog_production". Remember to replace "myblog" with the name of your project.

1.  Issue the following command to login the root account of the mysql database management system:

        mysql -u root -p

2.  Create user "myblog" with password "myblog":

        create user 'myblog'@'localhost' identified by 'myblog';

3.  Create databases:

        create database myblog;
        create database myblog_test;
        create database myblog_staging;
        create database myblog_production;

4.  Don't forget to assign the user to the databases:

        grant all privileges on myblog.* to 'myblog'@'localhost';
        grant all privileges on myblog_testing.* to 'myblog'@'localhost';
        grant all privileges on myblog_staging.* to 'myblog'@'localhost';
        grant all privileges on myblog_production.* to 'myblog'@'localhost';

5.  You can exit the mysql database management system now:

        exit;

6. When the MySQL user and databases are ready, you can issue the following command to start the project:

		cd $HOME/myblog
		yesod devel

Please wait for compilation, then you can see the scaffold of your site at http://www.yoursite.com:3000/, where ``www.yoursite.com`` is your FQDN. To stop it, just press ``Enter``.

If your Linode has a firewall, the port ``3000`` is probably inaccessible from outside, so you will not be able to see your site at http://www.yoursite.com:3000/. This port is only for testing or developing, so don't open it on your firewall. Instead, you can set up an SSH tunnel on your Linode, and view your site at http://localhost:3000/ via this tunnel. Please check [Setting up an SSH Tunnel with Your Linode for Safe Browsing](/docs/networking/ssh/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing/) for more details.

You may have noticed that we haven't configure Nginx yet. In fact, Yesod applications contain an http server called Warp, which is written in Haskell, and has a very fast run-time. Without http servers like Apache or Nginx installed, you can run Yesod applications as standalones. This feature is similar to the Express framework on Node.js.

The initial setup of your first Yesod site has been finished. To start more advanced development of your Yesod site, please read [The Yesod Book](http://www.yesodweb.com/book/) for more details.

## Deploy to Nginx


Warp is a fast http server, but it lacks some advanced features like virtual hosts, load balancers, or SSL proxies, so we need Nginx to serve our site with more flexibility. In this section, we will introduce a method to deploy your site to Nginx.

### Prepare Yesod

1.  Before deployment, you need to prepare the files to be deployed. Issue the following commands in the folder ``$HOME/myblog``:

        cabal clean
        cabal configure
        cabal build

    You can regard them as ``make distclean && ./configure && make``, which is the standard way to build a Unix package from its source. But don't run ``cabal install`` here! This command will install your application into its sandbox, which is not what we want.

2.  After issuing the command ``cabal build``, your application (myblog) is built and placed in ``$HOME/myblog/dist/build/myblog/``. This is the program that we are to deploy. You can move the directory anywhere.

    You also need to place the two files ``$HOME/myblog/config`` and ``$HOME/myblog/static`` into the same directory.

    Let's create a folder in ``/var`` to deploy those files. You need root privileges to issue the following commands:

        mkdir /var/myblog
        chmod 755 /var/myblog/
        chown yesod.yesod /var/myblog

    Then copy the files:

        cp $HOME/myblog/dist/build/myblog/myblog /var/myblog
        cp -R $HOME/myblog/config /var/myblog
        cp -R $HOME/myblog/static /var/myblog

3.  Before starting your site, you need to modify the file ``/var/myblog/config/settings.yml``. This file has the same structure as ``mysql.yml``. There is a ``Default`` section and four other sections for various environments. We will only run ``/var/myblog`` in the ``Production`` environment, so we only need to modify the last three lines of this settings file:

    {{< file-excerpt "/var/myblog/config/settings.yml" >}}
Production:
  approot: "http://www.yoursite.com"
  <<: *defaults

{{< /file-excerpt >}}


    Here *www.yoursite.com* should be replaced by your FQDN. You can also use other virtual host names here, like *myblog.yoursite.com*. **Just make sure that it is the same as the one that you will pass to Nginx below during Step 5.**

4.  To start your site, issue the following commands:

        cd /var/myblog
        ./myblog Production

    Your site is now online. You can check it at http://www.yoursite.com:3000/ or http://hostingIP:3000/, if you have set up an SSH tunnel. Note that it doesn't work smoothly yet, because we haven't instructed your site where its static files are. We will do this in the next step. Please press Ctrl-C to stop it now.

5.  If you want your site running as a daemon, which means in a constant state of running, you can create an init.d script. We have created a simple one, here, for your reference:

    {{< file-excerpt "/etc/init.d/myblog" bash >}}
#! /bin/sh
### BEGIN INIT INFO
# Provides:          myblog
# Required-Start:    $network $syslog mysql nginx
# Required-Stop:     $network $syslog mysql nginx
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: MyBlog
# Description:       MyBlog: My First Yesod Application
### END INIT INFO

PATH=/sbin:/bin:/usr/sbin:/usr/bin
DESC="MyBlog"
NAME=myblog
MYROOT=/var/myblog
MYGROUP=yesod
MYUSER=yesod
PIDFILE=/var/opt/myblog/run/$NAME.pid
LOGFILE=/var/opt/myblog/log/$NAME.log
DAEMON=/var/myblog/myblog
DAEMON_ARGS="Production"

. /lib/lsb/init-functions

case "$1" in
start)
        log_daemon_msg "Starting $DESC" "$NAME"

        mkdir -p /var/opt/myblog/run
        mkdir -p /var/opt/myblog/log
        chown -R ${MYUSER}:${MYGROUP} /var/opt/myblog

        start-stop-daemon --start --quiet  --background  \
                --make-pidfile --pidfile $PIDFILE        \
                --chuid $MYUSER:$MYGROUP --chdir $MYROOT \
                --exec /bin/bash -- -c                   \
                "exec $DAEMON $DAEMON_ARGS > $LOGFILE"   \
                || true

        log_end_msg $?
        ;;
stop)
        log_daemon_msg "Stopping $DESC" "$NAME"

        start-stop-daemon --stop --quiet          \
                --pidfile $PIDFILE --exec $DAEMON \
                || true

        rm -f $PIDFILE

        log_end_msg $?
        ;;
status)
        status_of_proc "$DAEMON" "$NAME" && exit 0 || exit $?
        ;;
restart)
        $0 stop
        $0 start
        ;;
*)
        echo "Usage: $SCRIPTNAME {start|stop|status|restart}" >&2
        exit 3
        ;;
esac

exit 0

{{< /file-excerpt >}}


    Don't forget to make it executable:

        chmod +x /etc/init.d/myblog

    You can issue the following command to start your site:

        service myblog start

    You can also stop, restart, or query the status of your site by using the corresponding commands. If there is anything wrong, you can check the log file at ``/var/opt/myblog/log/myblog.log``.

    If you need your site to run on startup, issue the following command to add it to the default run level of your Debian system:

        update-rc.d myblog defaults

### Configure Nginx.

Create the file ``/etc/nginx/sites-available/myblog``:

{{< file "/etc/nginx/sites-available/myblog" nginx >}}
server {

    listen 80;

    server_name www.yoursite.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }

    location /static {
        root /var/myblog;
        expires max;
    }

}

{{< /file >}}


The ``server_name`` should be your FQDN, or the virtual host name you wrote in ``/var/myblog/config/settings.yml``. The location ``/static`` tells Nginx where to find files with url ``http://server_name/static/*``. A highly recommended optimization is to serve static files from a separate domain name, therefore bypassing the cookie transfer overhead. You can find more details on this optimization in the chapter [Deploying your Webapp of The Yesod Book](http://www.yesodweb.com/book/).

Link the above file into ``/etc/nginx/sites-enabled``, and restart ``nginx``:

    ln -s /etc/nginx/sites-available/myblog /etc/nginx/sites-enabled
    service nginx restart

You can check it at *http://www.yoursite.com/* now.

The installation and configuration of Yesod working with Nginx and MySQL are finished.
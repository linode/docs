---
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Create a remote desktop on a Linode'
keywords: 'remote desktop, Apache Guacamole, TeamViewer, VNC, Chrome OS'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, October 16th, 2017
modified_by:
  name: Sam Foo
published: 'Monday, October 16th, 2017'
title: 'Virtual Cloud Desktop Using Apache Guacamole'
external_resources:
 - '[Apache Guacamole](https://guacamole.incubator.apache.org/)'
 - '[Apache Tomcat](https://tomcat.apache.org/)'
---

Apache Guacamole is an HTML5 application useful for remote desktop through RDP, VNC, and other protocols. Create a virtual cloud desktop where applications can be accessed through a web browser. This guide will cover installation of Apache Guacamole through Docker then access a remote desktop environment hosted on a Linode.

# Install Docker
The installation method presented here is will always attempt to install the latest version of Docker. Consult the official documentation to install a specific version or if Docker EE is needed.

1.  Update packages and install dependencies.

        sudo apt-get update
        sudo apt-get install apt-transport-https ca-certificates curl software-properties-common

2.  Add Docker gpg key.

        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

3.  Confirm key fingerprint.

        sudo apt-key fingerprint 0EBFCD88

4.  Add package to repository.

        sudo add-apt-repository \
           "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
           $(lsb_release -cs) \
           stable"

5.  Update and install Docker CE.

        sudo apt-get update
        sudo apt-get install docker-ce

# Initialize Guacamole Authentication with MySQL
PostgreSQL are MariaDB are also supported although MySQL will be demonstrated in this guide.

1.  Pull Docker images for guacamole-server, guacamole-client, and MySQL.

        docker pull guacamole/guacamole
        docker pull guacamole/guacd
        docker pull mysql/mysql-server

2.  Create a database initialization script to create a table for authentication.

        docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --mysql > initdb.sql

3.  Generate a one-time password for MySQL root. View the generated password in the logs.

        docker run --name example-mysql -e MYSQL_RANDOM_ROOT_PASSWORD=yes -e MYSQL_ONETIME_PASSWORD=yes -d mysql/mysql-server
        docker logs example-mysql

    Docker logs should print the password in the terminal.

        [Entrypoint] MySQL Docker Image 5.7.20-1.1.2
        [Entrypoint] No password option specified for new database.
        [Entrypoint]   A random onetime password will be generated.
        [Entrypoint] Initializing database
        [Entrypoint] Database initialized

4.  Rename and move `initdb.sql` into the MySQL container.

        docker cp initdb.sql example-mysql:/guac_db.sql

5.  Open a bash shell within the MySQL Docker container.

        docker exec -it some-mysql bash

6.  Log in using the one-time password. No commands will be accepted until a new password if defined for `root`. Create a new database and user as shown below:

        bash-4.2# mysql -u root -p
        Enter password:
        Welcome to the MySQL monitor.  Commands end with ; or \g.
        Your MySQL connection id is 11
        Server version: 5.7.20

        Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.

        Oracle is a registered trademark of Oracle Corporation and/or its
        affiliates. Other names may be trademarks of their respective
        owners.

        Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

        mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_root_password';
        Query OK, 0 rows affected (0.00 sec)

        mysql> CREATE DATABASE guacamole_db;
        Query OK, 1 row affected (0.00 sec)

        mysql> CREATE USER 'guacamole_user'@'%' IDENTIFIED BY 'guacamole_user_password';
        Query OK, 0 rows affected (0.00 sec)

        mysql> GRANT SELECT,INSERT,UPDATE,DELETE ON guacamole_db.* TO 'guacamole_user'@'%';
        Query OK, 0 rows affected (0.00 sec)

        mysql> FLUSH PRIVILEGES;
        Query OK, 0 rows affected (0.00 sec)

        mysql> quit
        Bye
        bash-4.2# cat guac_db.sql | mysql -u root -p guacamole_db
        Enter password:

7.  While in the bash shell, create tables from the initialization script for the new database.

        cat guac_db.sql | mysql -u root -p guacamole_db

    Verify successful addition of tables. If there are no tables in `guacamole_db`, ensure the previous steps are completed properly.

        mysql> USE guacamole_db;
        Reading table information for completion of table and column names
        You can turn off this feature to get a quicker startup with -A

        Database changed
        mysql> SHOW TABLES;
        +---------------------------------------+
        | Tables_in_guacamole_db                |
        +---------------------------------------+
        | guacamole_connection                  |
        | guacamole_connection_group            |
        | guacamole_connection_group_permission |
        | guacamole_connection_history          |
        | guacamole_connection_parameter        |
        | guacamole_connection_permission       |
        | guacamole_sharing_profile             |
        | guacamole_sharing_profile_parameter   |
        | guacamole_sharing_profile_permission  |
        | guacamole_system_permission           |
        | guacamole_user                        |
        | guacamole_user_password_history       |
        | guacamole_user_permission             |
        +---------------------------------------+
        13 rows in set (0.00 sec)

    Leave the bash shell.

        exit

# Guacamole in Browser

1.  Start guacd in Docker.

        docker run --name example-guacd -d guacamole/guacd

2.  Link containers so Guacamole can verify credentials stored in the MySQL database.

        docker run --name example-guacamole --link example-guacd:guacd --link example-mysql:mysql -e MYSQL_DATABASE='guacamole_db' -e MYSQL_USER='guacamole_user' -e MYSQL_PASSWORD='guacamole_user_password' -d -p 8080:8080 guacamole/guacamole

    {:.note}
    > To see all running and non-running Docker containers:
    >
    >     docker ps -a

3.  If `example-guacamole`, `example-guacd`, and `example-mysql` are all running, navigate to `localhost:8080/guacamole/`. The default login credentials are `guacadmin` and password `guacadmin`. This should be changed as soon as possible.

    ![Guacamole Login](/docs/assets/guac_login.png)

# VNC Server on a Linode
Before sharing a remote desktop, a desktop environment and VNC server must be installed on a Linode. This guide will use Xfce because it is lightweight and does not excessively consume system resources.

1.  Install Xfce on the Linode.

        sudo apt install xfce4 xfce4-goodies

    Alternately Unity if there are less constraints on system resources:

        sudo apt install --no-install-recommends ubuntu-desktop gnome-panel gnome-settings-daemon metacity nautilus gnome-terminal

2.  Install VNC server. Starting VNC server will prompt for a password.

        sudo apt install tightvncserver
        vncserver

    This will prompt for a password in addition to a view-only option. The maximum password length is 8 characters. For setups requiring more security, deploying Guacamole as a [reverse proxy with SSL encryption is highly recommended](https://guacamole.incubator.apache.org/doc/gug/proxying-guacamole.html).

        You will require a password to access your desktops.

        Password:
        Verify:
        Would you like to enter a view-only password (y/n)?

3.  Ensure to start the desktop environment the end of `.vnc/xstartup` otherwise only a gray screen will be displayed.

        echo 'startxfce4 &' | tee -a .vnc/xstartup

    Alternate Unity configuration example:

    {:.file}
    xstartup
    :   ~~~
        #!/bin/sh

        xrdb $HOME/.Xresources
        xsetroot -solid grey
        #x-terminal-emulator -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop" &
        #x-window-manager &
        # Fix to make GNOME work
        export XKL_XMODMAP_DISABLE=1
        /etc/X11/Xsession

        gnome-panel &
        gnome-settings-daemon &
        metacity &
        nautilus &
        ~~~

# New Connection in Guacamole
VNC, RDP, SSH, and Telnet are supported. This section of the guide will show how to navigate the browser interface and add a new connection.

1.  Click the top right drop down menu, select *Settings*. Under *Connections*, press the *New Connection* button. 

    ![Guacamole Settings](/docs/assets/guac_settings.png)

2.  Under **Edit Connection**, choose a name otherwise the hostname of the Linode will be the default. Under **Parameters**, the hostname is the public IP of the Linode. The port is 5900 plus the display number - in this case, port 5901. Enter the 8 character password.

    ![Guacamole VNC Configuration](/docs/assets/guac_vnc_config.png)

    The [official documentation](https://guacamole.incubator.apache.org/doc/gug/configuring-guacamole.html#vnc) has detailed descriptions of all paramter names.

3.  From the top right drop down menu, click *Home*. The new connection is now available.

    **CTRL** + **ALT** + **SHIFT** - Opens menu for clipboard, keyboard/mouse settings, and the navigation menu.

    ![Guacamole Drop Down](/docs/assets/guac_menu.png)

4.  Press back on the browser to return to the *Home* menu.

5.  Additional connections can be made, and simultaneous connections can be made in new browser tabs.

    ![Guacamole Recent Connections](/docs/assets/guac_recent.png)

This guide aimed to streamline the installation process through Docker and demonstrate remote desktop with Apache Guacamole as quickly as possible. There are more features such as screen recording, two factor authentication with Duo, file transfer via SFTP, and much more. As an Apache Incubator project, expect to see further developments in the near future.


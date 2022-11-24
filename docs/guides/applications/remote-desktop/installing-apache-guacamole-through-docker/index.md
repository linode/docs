---
slug: installing-apache-guacamole-through-docker
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to install Apache Guacamole (a remote access gateway for SSH, VNC, and other protocols) through Docker."
keywords: ["Apache Guacamole", "Docker", "VNC", "SSH"]
tags: ["docker", "guacamole"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-10
modified_by:
  name: Linode
title: "How to Install Apache Guacamole through Docker"
h1_title: "Installing Apache Guacamole through Docker"
enable_h1: true
external_resources:
 - '[Apache Guacamole](https://guacamole.incubator.apache.org/)'
---

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Installing Docker

{{< content "installing-docker-shortguide" >}}

After installation, you can pull the following Docker images for use in later steps:

    docker pull guacamole/guacamole
    docker pull guacamole/guacd
    docker pull mysql/mysql-server

## Setting up MySQL for Database Authentication

Apache Guacamole requires a method for user authentication. Database authentication through MySQLis covered in this section, though PostgreSQL and MariaDB are supported as well as other non-database methods. To explore additional options, open the [Guacamole Manual](https://guacamole.apache.org/doc/gug/) and review any sections with "authentication" in their headings.

1.  Create a database initialization script to create a table for authentication:

        docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --mysql > initdb.sql

1.  Generate a one-time password for MySQL root. View the generated password in the logs:

        docker run --name example-mysql -e MYSQL_RANDOM_ROOT_PASSWORD=yes -e MYSQL_ONETIME_PASSWORD=yes -d mysql/mysql-server
        docker logs example-mysql

    Docker logs should print the password in the terminal.

    {{< output >}}
[Entrypoint] GENERATED ROOT PASSWORD: <password>
{{</ output >}}

1.  Rename and move `initdb.sql` into the MySQL container.

        docker cp initdb.sql example-mysql:/guac_db.sql

1.  Open a bash shell within the MySQL Docker container.

        docker exec -it example-mysql bash

    The shell prompt now changes to `bash-4.4#` or something similar.

1.  Within the bash shell prompt for the container, log in to mysql as the root user:

        mysql -u root -p

    The prompt should change again to `mysql>`.

1.  While in the mysql prompt, change the root password, create a database, and create a new user for that database. When running the below commands, replace any instance of *password* with a secure password string for the mysql root user and the new user for your database, respectively.

        ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
        CREATE DATABASE guacamole_db;
        CREATE USER 'guacamole_user'@'%' IDENTIFIED BY 'password';
        GRANT SELECT,INSERT,UPDATE,DELETE ON guacamole_db.* TO 'guacamole_user'@'%';
        FLUSH PRIVILEGES;

1.  Once completed, enter `quit` to exit mysql and return to the bash shell for the container.

1.  While in the bash shell, create tables from the initialization script for the new database.

        cat guac_db.sql | mysql -u root -p guacamole_db

    If you'd like, you can verify that the tables were successfully created by logging back into the mysql prompt and viewing the tables in the database:

        mysql -u guacamole_user -p
        USE guacamole_db;
        SHOW TABLES;
        quit

1.  Leave the bash shell for the container and return to the main shell of your Linux system by entering `exit`.

## Initialize the Guacamole Containers

1.  Start guacd in Docker:

        docker run --name example-guacd -d guacamole/guacd

1.  Start guacamole in Docker, making sure to link the containers so Guacamole can verify credentials stored in the MySQL database. Replace the value for `MYSQL_PASSWORD` with the password you configured for the MySQL database user `guacamole_user`.

        docker run --name example-guacamole --link example-guacd:guacd --link example-mysql:mysql -e MYSQL_DATABASE=guacamole_db -e MYSQL_USER=guacamole_user -e MYSQL_PASSWORD=guacamole_user_password -d -p 127.0.0.1:8080:8080 guacamole/guacamole

1.  To verify that all the docker containers are running properly, run the following command.

        docker ps -a

    You should see each container that you created in previous steps.

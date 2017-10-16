---
author:
  name: Sam Foo
  email: sfoo@linode.com
description: ''
keywords: ''
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, October 16th, 2017
modified_by:
  name: Sam Foo
published: 'Monday, October 16th, 2017'
title: ''
external_resources:
 - '[Apache Guacamole](https://guacamole.incubator.apache.org/)'
---

sudo apt-get update

sudo apt-get install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce

docker pull guacamole/guacamole
docker pull guacamole/guacd
docker pull mysql/mysql-server

docker run --name my-container-name -e MYSQL_RANDOM_ROOT_PASSWORD=yes -e MYSQL_ONETIME_PASSWORD=yes -d mysql/mysql-server:tag
docker logs my-container-name

```
$ mysql -u root -p
Enter password: password
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 233
Server version: 5.5.29-0ubuntu0.12.10.1 (Ubuntu)

Copyright (c) 2000, 2012, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> CREATE DATABASE guacamole_db;
Query OK, 1 row affected (0.00 sec)

mysql> CREATE USER 'guacamole_user'@'localhost' IDENTIFIED BY 'some_password';
Query OK, 0 rows affected (0.00 sec)

mysql> GRANT SELECT,INSERT,UPDATE,DELETE ON guacamole_db.* TO 'guacamole_user'@'localhost';
Query OK, 0 rows affected (0.00 sec)

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.02 sec)

mysql> quit
Bye
$
```

sudo docker cp initdb.mysql some-mysql:/guac_db.sql

cat guac_db.sql | mysql -u root -p guacamole_db

sudo docker exec -it some-mysql bash

docker run --name some-guacd -d guacamole/guacd

docker run --name some-guacd -d -p 4822:4822 guacamole/guacd

sudo docker run --name some-guacamole --link some-guacd:guacd --link some-mysql:mysql -e MYSQL_DATABASE='guacamole_db' -e MYSQL_USER='guacamole_user' -e MYSQL_PASSWORD='' -d -p 8080:8080 guacamole/guacamole



Other helpful commands:

sudo docker ps -a
sudo docker stop [name]
sudo docker rm [name]
sudo docker logs [name]








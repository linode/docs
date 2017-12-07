---
author:
  name: Angel
  email: docs@linode.com
description: 'This tutorial will guide you through setup and configuration of a SHOUTcast DNAS server for media streaming on Linux.'
keywords: ["shoutcast", " internet radio", " streaming media", " streaming audio"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['communications/media-servers/shoutcast/','applications/media-servers/shoutcast/']
modified: 2017-11-16
modified_by:
  name: Linode
published: 2017-11-15
title: Understanding Docker Compose
external_resources:
 - '[SHOUTcast Home Page](http://www.shoutcast.com)'
 - '[SHOUTcast Getting Started Guide](http://wiki.winamp.com/wiki/SHOUTcast_Getting_Started_Guide)'
 - '[SHOUTcast Broadcast Tools](http://www.shoutcast.com/broadcast-tools)'
 - '[SHOUTcast Transcoder MP3 Licensing](http://wiki.winamp.com/wiki/SHOUTcast_DNAS_Transcoder_2#Registering_for_MP3_Stream_Encoding)'
---

# Understanding Docker Compse

This guide will walk you through Docker Compose. Docker Compose is a tool that utilizes a `docker-compose.yaml` file and builds multi-container projects on the fly. The same rules apply for writing a `docker-compose.yaml` file, and writing a Dockerfile. The structure of a `docker-compose` is simple and readable. Here is an example Docker Compose file taken from the [Docker official documentation](https://docs.docker.com/compose/wordpress/#build-the-project):




  {{< file-excerpt "Docker Compose" yaml >}}
version: '3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
volumes:
    db_data:

{{< /file-excerpt >}} 

If you copy that file onto your Linode, and run `docker-compose up -d`, Docker will start a Wordpress container and a MySQL container, navigating to `localhost:3306` will take you directly to your newly installed Wordpress application, just like that. However, running those commands, and copying the `Docker-compose.yml` file alone, will not give you the tools neccesary to modify, or write you rown Docker Compose files. A Docker Compose file is a yaml file that contains specific directives of indvidual [Dockerfiles](https://github.com/dockerfile). You can break the official documentation docs, down into pieces to understand them better:




|Directive    | Use
|---|---|
|image  |This directive sets the image or Dockerfile that will be used in the Docker-Compose file  |
|Services   |In Docker a service is the name for a ["Container in production"](https://docs.docker.com/get-started/part3/#introduction), this line defines the containers that will be started as a part of the Docker Compose instance   |
|db:   | In the case of the example Dockercompose file, `db` is a variable for the container you are about to define.    |
|restart   |This directive tells the container to restart if the system restarts.    |
|volumes  |Mounts a linked path on the host machine that can be used by the container |
|Environment      |These are command line variables, or arguments, passed into the Docker run command.      | 
|depends_on| Sets a service as a dependency for the current block-defined container |
|port   |This directive maps a port from the container to the host in the following manner: `host:container`   | 



### Deconstructing the Docker-Compose file

We can begin writing Docker-Compose files, one directive at a time: 

  {{< file-excerpt "New Docker-Compse" yaml >}}
version: '3'
services:
   db:
     image: mariadb:10.3
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress
volumes:
    db_data:⏎

{{< /file-excerpt >}}

In this example Docker-Compose file, replacing MySQL with MariaDB in the `image` directive and running `docker-compose up -d` will start a MariaDB container, with the default root and database users, and their passwords set to the directives in the Dockerfile.






### Handling Private Environment Variables

Throughout this guide there we have been placing passwords and user variables within the `environment` directive. This can be problematic. If you share your Docker-compose file, whoever has access to it can see where your database is, and what the root and database passwords are. A solution to this involves using a `.env` file, and keeping it safely away from your Docker-Compose file. You can tehn call the `.env` file, from within the Docker-Compose file, and the variables declared in the `.env` file, will be read when Docker builds the containers. 

1. Create a `.env` file within the same directory as the `Docker-compose.yml` file, and populate it with the relevant information:

  {{< file-excerpt ".env" yaml >}}

MYSQL_ROOT_PASSWORD: 1somewordpress
MYSQL_DATABASE: wordpress
MYSQL_USER: wordpress
MYSQL_PASSWORD: wordpress

{{< /file-excerpt >}}

2. Inisde of your Docker-Compose file, add the following directive:

  {{< file-excerpt "Docker-compose.yml" yaml >}}

version: '3'

services:
   db:
     image: mariadb:10.3
     volumes:
       - db_data:/var/lib/mysql
     restart: always

     env_file:
       - .env
volumes:
    db_data:⏎
{{< /file-excerpt >}}

3. Run `docker-compose up -d ` to start the containers.



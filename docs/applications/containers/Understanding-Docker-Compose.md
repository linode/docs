---
author:
  name: Linode
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


### Writing a Docker-Compose.yml file from scratch

1. Define your services:

    {{< file "docker-compose.yml" yaml >}}
version: '3'

services:
  distro:
    image: alpine
    restart: always
{{< /file >}}

Now, run `docker-compose up -d`, in the directory you created the file in. This first `docker-compose.yml` entry simply creates one container with Alpine Linux. 

2. Check the status of your container:

        docker -ps

The `docker -ps` command will have a similar output to this:

    {{< output >}}
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                         PORTS               NAMES
f5e8d0301b08        alpine              "/bin/sh"           14 seconds ago      Restarting (0) 2 seconds ago                       directory_distro_1
{{</ output >}}


3. Bring down your container:

        docker-compose down

#### Adding Services to Docker Compose

With Docker-Compose you can begin to build an eco-system of containers. You can define how they work together and communicate. 

{{< file "docker-compose.yml" yaml >}}
version: '3'

services:
  distro:
    image: alpine
    container_name: Alpine_Distro
    restart: always
    command: echo "Hello World"

  database:
    image: postgres:latest
    container_name: postgres_db
    volumes:
      - ../dumps:/tmp/
    ports:
      - "5432:5432"
{{</ file >}}

In the `docker-compose.yml` file there are two services defined:

* Distro
* Database 
 
The Distro service, is the same as before, however, it now uses `container_name`, and `command: echo "Hello World"`, to name the container, and run a "Hello World". The Database server contains the instructions for a postgres container, and the directives: `volumes: - ../dumps:/tmp` and `ports:-"5432:5432"`, the first directive maps the containerd `/dumps` folder to our local `/tmp` folder. The second directive maps the containers ports to the local host's ports. Mapping the ports allows the local host to serve something on port 80, to something on a mapped port locally. 

Running `docker-compose down`, shows the status of the containers, the port mapping, the names, and the last command running on them. It's important to note that the postgres container reads "docker-entrypoint...", under commands. The Postgres [Docker Entrypoint](https://github.com/docker-library/postgres/blob/master/docker-entrypoint.sh) script is the last thing that launches once the container starts. 


{{< output >}}
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS                    NAMES
d002ceb57126        postgres:latest     "docker-entrypoint..."   9 seconds ago       Up 7 seconds                  0.0.0.0:5432->5432/tcp   postgres_db
c9bcd8760853        alpine              "echo 'Hello World'"     9 seconds ago       Up 7 seconds                                           Alpine_Distro

{{</ output >}}

Now running `docker-compose down` will bring down both containers. 

#### Adding an Nginx Service

Now adding the Nginx Container so that your Docker-Compose file will be ready to serve websites:


{{< file "docker-compose.yml" yaml >}}

services:
  distro:
    image: alpine
    container_name: Alpine_Distro
    restart: always
    command: echo "Hello World"

  database:
    image: postgres:latest
    container_name: postgres_db
    volumes:
      - ../dumps:/tmp/
    ports:
      - "5432:5432"
  web:
    image: nginx:latest
    volumes:
      - ./mysite.template:/etc/nginx/conf.d/mysite.template
    ports:
      - "8080:80"
    environment:
      - NGINX_HOST=example.com
      - NGINX_port=80
    links:
      - database
      - distro
    
{{</ file >}}

This docker-compose file, contains some new directives: *environment* and *links*--the first directive sets runtime level options within the container. **Links**, creates a dependency network between the containers. Each container depends on the other to execute. While you do not need the `links` directive for the containers to talk with each other, `links` can serve as a failsafe when starting the docker-compose application. 


Now if you run, `docker-compose up`, without the `-d` flag, your command line will be flooded with the Alpine container running Hello World, and restarting itself. A quick `ctrl +C` and you will be dropped out of that screen. Running `docker -ps` will show you the status of the containers:

{{< output >}}
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                          PORTS                    NAMES
aac9109b4071        nginx:latest        "nginx -g 'daemon ..."   11 minutes ago      Up 11 minutes                   0.0.0.0:8080->80/tcp     Nginx-server
3d80edb20ae2        postgres:latest     "docker-entrypoint..."   11 minutes ago      Up 11 minutes                   0.0.0.0:5432->5432/tcp   postgres_db
dc5ce239aaff        alpine              "echo 'Hello World'"     11 minutes ago      Restarting (0) 53 seconds ago                            Alpine_Distro
{{</ output >}}

You can also test the Nginx Container, using `curl`:


    curl -L localhost:8080
    
This will return the Nginx default welcome page:


{{</ file-excerpt html >}}

<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>

{{</ file-excerpt >}}

## Next Steps
In conclusion, Docker Compose is a powerful tool for orchestrating sets of containers that can work together. Things like an app, or a development environment, can utilize Docker-compose, the result is a modular and configurable environment that can be deployed anywhere. 

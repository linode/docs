---
author:
  name: Bob Strecansky
description: 'This guide describes how to effectively use Docker in production using a sample NGINX/Flask/Gunicorn/Redis/Postgresql Application Stack.'
keywords: ["docker", "nginx", "flask", "gunicorn", "redis", "postgresql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-12-21
modified_by:
  name: Bob Strecansky
published: 2017-12-20
title: 'Deploying microservices with Docker'
contributor:
  name: Bob Strecansky
  link: https://twitter.com/bobstrecansky
external_resources:
- '[Github Source for Project](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres)'
---


In this guide you will be able to:

* Initialize all of the necessary elements (NGINX, Flask / Gunicorn, Redis, and Postgres)
* Expose and link all of the services to each other
* Externally expose the NGINX proxy to the docker host


## Dockerfile

Dockerfiles are the defacto way to automate installation and configuration of a docker image and it's dependencies.  You can read more about Dockerfiles in the [How To Use Dockerfiles](https://www.linode.com/docs/applications/containers/how-to-use-dockerfiles) Linode article.  Docker has also written a [Dockerfile Best Practices guide](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#sort-multi-line-arguments).  [Labels](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#label) can also be helpful in organization, licensing, automation, etcetera.  Having a common labeling strategy can help to organize your containers in a meaningful way, both from an organizational and automation perspective. The syntax for running a Dockerfile is as follows:
`docker build -f {/path/to/Dockerfile} -t {tag for Dockerfile} .`

The Environment you will build below will do the following:

* Initialize all of the necessary elements (NGINX, Flask / Gunicorn, Redis, and Postgres)
* Expose and link all of the services to each other
* Externally expose the NGINX proxy to the docker host

## Prepare the environment

1. Create the directory for the Docker-Compose files:

        mkdir docker-nginx-flask-redis-postgres
2. Create the proper directory structure for you microservice within the new folder:
        
        cd docker-nginx-flask-redis-postgres
        mkdir nginx postgres test web

3. Create the Dockerfile for Nginx including the `nginx.conf`:

    {{< file "/nginx/Dockerfile" yaml >}}
from nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf

{{</ file >}}

    
    {{< file "/nginx/nginx.conf" conf >}}

user  nginx;
worker_processes 1;
error_log  /dev/stdout info;
error_log off;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
    use epoll;
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /dev/stdout main;
    access_log off;
    keepalive_timeout 65;
    keepalive_requests 100000;
    tcp_nopush on;
    tcp_nodelay on;

    server {
        listen 80;
        proxy_pass_header Server;

        location / {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;

            # app comes from /etc/hosts, Docker added it for us!
            proxy_pass http://flaskapp:8000/;
        }
    }
}

{{</ file >}}
4. Create the `init.sql`:

    {{< file "postgresql/init.sql">}}
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
SET search_path = public, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;
CREATE TABLE visitors (
    site_id integer,
    site_name text,
    visitor_count integer
);

ALTER TABLE visitors OWNER TO postgres;
COPY visitors (site_id, site_name, visitor_count) FROM stdin;
1	linodeexample.com	0
\.
{{</ file >}}


5. Assemble the `/web/` directory, with the following files:

        echo "3.6.0" >> /web/.python-version

     {{< file "/web/Dockerfile" yaml >}}
from python:3.6.2-slim
RUN groupadd flaskgroup && useradd -m -g flaskgroup -s /bin/bash flask
RUN echo "flask ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN mkdir -p /home/flask/app/web
WORKDIR /home/flask/app/web
COPY requirements.txt /home/flask/app/web
RUN pip install --no-cache-dir -r requirements.txt
RUN chown -R flask:flaskgroup /home/flask
USER flask
ENTRYPOINT ["/usr/local/bin/gunicorn", "--bind", ":8000", "linode:app", "--reload", "--workers", "16"]
{{</ file >}}

    {{< file "/web/linode.py" >}}
from flask import Flask
import logging
import psycopg2
import redis
import sys

app = Flask(__name__)
cache = redis.StrictRedis(host='redis', port=6379)

# Configure Logging
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.DEBUG)

def PgFetch(query, method):

    # Connect to an existing database
    conn = psycopg2.connect("host='postgres' dbname='linode' user='postgres' password='linode123'")

    # Open a cursor to perform database operations
    cur = conn.cursor()

    # Query the database and obtain data as Python objects
    dbquery = cur.execute(query)

    if method == 'GET':
        result = cur.fetchone()
    else:
        result = ""

    # Make the changes to the database persistent
    conn.commit()

    # Close communication with the database
    cur.close()
    conn.close()
    return result

@app.route('/')
def hello_world():
    if cache.exists('visitor_count'):
        cache.incr('visitor_count')
        count = (cache.get('visitor_count')).decode('utf-8')
        update = PgFetch("UPDATE visitors set visitor_count = " + count + " where site_id = 1;", "POST")
    else:
        cache_refresh = PgFetch("SELECT visitor_count FROM visitors where site_id = 1;", "GET")
        count = int(cache_refresh[0])
        cache.set('visitor_count', count)
        cache.incr('visitor_count')
        count = (cache.get('visitor_count')).decode('utf-8')
    return 'Hello Linode!  This page has been viewed %s time(s).' % count

@app.route('/resetcounter')
def resetcounter():
    cache.delete('visitor_count')
    PgFetch("UPDATE visitors set visitor_count = 0 where site_id = 1;", "POST")
    app.logger.debug("reset visitor count")
    return "Successfully deleted redis and postgres counters"

{{</ file >}}
        {{< file "requirements.txt" aconf >}}
flask
gunicorn
psycopg2
redis
{{</ file >}}

6. A test file:

    {{< file "/docker-nginx-flask-redis-postgres/test/100curl.sh" >}}
#!/bin/bash
for i in $(seq 1 100)
    do
    curl localhost/
done
{{</file >}}


## The Docker-compose
docker-compose has been used in the sample project in order to be able to handle all of the containers and their configuration settings. This annotated docker-compose file should help you to understand all of the individual pieces that fit together in the docker-compose puzzle. 
This file 
{{< file "docker-compose.yml" yaml >}}
version: '3'
services:
 # defining our flask web application
 flaskapp:

   # build the Dockerfile that is in the web directory: http://bit.ly/2BpBPXq
   build: ./web

   # always restart the container regardless of the exit status; try and restart the container indefinitely
   restart: always

   # expose port 8000 to other containers (not to the host of the machine)
   expose:
     - "8000"

   # mount the web directory (http://bit.ly/2BbJO6k) within the container at /home/flask/app/web
   volumes:
     - ./web:/home/flask/app/web

   # don't create this container until the redis and postgres containers (below) have been created
   depends_on:
     - redis
     - postgres

   # link the redis and postgres containers together so that they can talk to one another
   links:
     - redis
     - postgres

   # pass environment variables to the flask container (this debug lets us see more useful information)
   environment:
     FLASK_DEBUG: 1

   # deploy with 3 replicas in the case of failure of one of the containers
   deploy:
     mode: replicated
     replicas: 3

 # defining the redis docker container for our web application
 redis:

   # use the redis:alpine image: https://hub.docker.com/_/redis/
   image: redis:alpine
   restart: always
   deploy:
     mode: replicated
     replicas: 3

 # defining the redis NGINX forward proxy container for our web application
 nginx:

   # build the nginx Dockerfile: http://bit.ly/2kuYaIv
   build: nginx/
   restart: always

   # Expose port 80 to the host machine
   ports:
     - "80:80"
   deploy:
     mode: replicated
     replicas: 3

   # Our flask application needs to be available for NGINX to make successful proxy requests
   depends_on:
     - flaskapp

 # defining our postgres database for our web application
 postgres:
   restart: always
   # use the postgres alpine image: https://hub.docker.com/_/postgres/
   image: postgres:alpine

   # Mount an initialization script and the persistent postgresql data volume
   volumes:
     - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
     - ./postgres/data:/var/lib/postgresql/data

   # Pass postgres environment variables
   environment:
     POSTGRES_PASSWORD: linode123
     POSTGRES_DB: linode

   # Expose port 5432 to other docker containers
   expose:
     - "5432"
{{</ file >}}


## Test the sample application from the repository

You can get a full, working sample of the application written for this guide using the following steps:

1.  make sure you have Docker installed. [This](https://linode.com/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment/) is a guide to get it installed locally.
2.  start the multi-container example application:

        cd docker-nginx-flask-redis-postgres/ && docker-compose up

You should see all of the services start in your terminal window.  Example output [here](https://gist.github.com/bobstrecansky/29f473b906636fd7180e90284ce964f0)

4.  open a new terminal window and make a request to the example application:
        
        ~ curl localhost
        Hello Linode!  This page has been viewed 1 time(s).

5.  reset the page hit counter:
`~ curl localhost/resetcounter
Successfully deleted redis and postgres counters%`

You should be able to see the standard out log in the initial terminal window that you ran docker-compose on:
`flaskapp_1  | DEBUG in linode [/home/flask/app/web/linode.py:56]:
flaskapp_1  | reset visitor count`



## The Container Commmandments:
Containers should be:
1.  ephemeral (stopped and destroyed and a new one built and put into place with an absolute minimum setup and configuration)
2.  disposable (optimized for failure)
3.  have a short initialization time
4.  as small in size as possible
5.  shut down gracefully when a SIGTERM is received
6.  typically not maintain state (Databases and Key-Value store should be containerized with great hesitation)
7.  have all of the dependencies that are needed for the container runtime available locally
8.  have one responsibility and one process
9.  log to STDOUT.  This uniformity allows the docker daemon to grab the stream easily
10. contain a restart pattern that is suitable for the application

## (1.) Ephemeral
The container produced by the image your Dockerfile should be able to be destroyed and replaced with an absolute minimum of setup and configuration.  The example application uses Dockerfiles like [This one](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/nginx/Dockerfile) which allow you to replace the NGINX configuration for the NGINX forward proxy without making any other changes to the other piece of the application stack.

## (2.)  Disposable
Docker containers should be optimized for failure.  Using a restart: on-failure option in your docker-compose file, as well as having a replica count allows the web application to be able to have some containers fail gracefully while still serving the web application with no degration back to the end user. The example application sets restart logic [here](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/docker-compose.yml#L13) and replication logic [here](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/docker-compose.yml#L38)

## (3.)  Have a short initialization time
Avoiding addititional installation steps in the Docker file, removing dependencies that aren't needed, and building a target image that can be reused are three of the most important steps in making a web application that has a quick initialization time within Docker.  The example applicaion uses short, concise, prebuilt Dockerfiles like [this one](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/nginx/Dockerfile) in order to have a short initialization time.

## (4.)  As small in size as possible
Use the smallest base container that still gives you all of the utilities that are needed to build and run your web application.  Many times particular upstream docker images are based on [Alpine Linux](https://alpinelinux.org/about/), a very small musl, libc, and busybox Linux distribution.  Not having to pull down an entire Ubuntu or Centos image for containerized applications saves a lot of network and operational overhead and greatly increases the performance of container runtime startup time.  The example application uses alpine images where applicable (NGINX, Redis, and Postgresql), and uses a python-slim base image for the gunicorn / flask application.

## (5.)  Shut down gracefully when a SIGTERM is received
Validate that a
`docker kill --signal=SIGINT {APPNAME}`
will indeed kill the application gracefully.  This, alongside a restart condition and a replica condition will ensure that when containers fail, they will be brought back to life in a very quick fashion.

You can validate that this [like so](https://gist.github.com/bobstrecansky/8806f944c20969654f6920c6cdfc724c)

    ~ docker ps -a | grep redis_1
    f63f6b7e521e        redis:alpine                             "docker-entrypoint..."   45 seconds ago      Up 45 seconds       6379/tcp             dockernginxflaskredispostgres_redis_1

    ~ docker kill --signal=SIGINT dockernginxflaskredispostgres_redis_1
    dockernginxflaskredispostgres_redis_1
    20:28:36 bob@blinky ~ docker ps -a | grep redis_1
    f63f6b7e521e        redis:alpine                             "docker-entrypoint..."   About a minute ago   Exited (0) 4 seconds ago                        dockernginxflaskredispostgres_redis_1



## (6.)  Typically not maintain state
Within a dockerized web application, it's advantageous to not maintain state, attempt to maintain ephemeral docker containers (1.), and make sure that docker containers are disposable (2.).  Unfortuantely, there are times where it is necessary to maintain state in modern day web applications.  In our example:

* The example NGINX container does not maintain state, only proxies requests forward to the app servers and logs accordingly to STDOUT (9.).
* The example Gunicorn and Flask container does not maintain state, only serves back responses to requests that are made.
* Thg example Redis container is a key value store that is available but will fail back gracefully to the database should the container not be able to respond.
* The example Postgres container is the only container that maintains a semblance of state.  The container itself doesn't maintain this state, the persistent volume that is attached to the container [here](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/docker-compose.yml#L80) maintains the state for the application, and will get remounted if the Postgres container fails at any point.

## (7.)  Have all the dependences that are needed for container runtime available locally
The example application is written in Python.  The python dependencies are kept in a requirements.txt file [here](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/web/requirements.txt) and are installed when the flask container is initialized. [Vendoring python dependencies with pip](https://medium.com/underdog-io-engineering/vendoring-python-dependencies-with-pip-b9eb6078b9c0) is another way to keep all of your dependencies for container runtime available locally.

## (8.)  Have one responsibility and one process
The example application's Docker containers all have one responsibility and one process:
* NGINX - runs the Nginx forward proxy and runs the nginx process.
* Flask - runs the Flask application with a gunicorn web server process.
* Redis - runs a Redis key value store with a redis-server process.
* Postgresql - runs a Postgresql server with a postgresql-server process

## (9.)  Log to STDOUT
The example application logs to STDOUT.  This is helpful to have all of your logs in one place in order to assist troubleshooting all of the containers together:

NGINX stdout log:  [Error Log](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/nginx/nginx.conf#L3) and [Access Log](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/nginx/nginx.conf#L21)
Python stdout log: [Application Log](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/web/linode.py#L10-L12)

## (10.) Contain a restart pattern that's suitable for the application
The example application restarts all of it's containers if they are exited for any reason.  This is a great way to try and give your Dockerized application high availability and performance, even during periods of change / maintenance.

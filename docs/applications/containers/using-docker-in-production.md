---
author:
  name: Bob Strecansky
  email: bob.strecansky@gmail.com
description: 'This guide describes how to effectively use Docker in production using a sample NGINX/Flask/Gunicorn/Redis/Postgresql Application Stack.'
keywords: 'docker,production,compose,deployment,nginx,flask,gunicorn,redis,postgresql'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: Wednesday, December 20th, 2017
modified: Wednesday, December 20th, 2017
modified_by:
  name Bob Strecansky
title: 'How to Use Docker Effectively in Production'
contributor:
  name: Bob Strecansky
  link: https://twitter.com/bobstrecansky
  external_resources:
- '[Github Source for Project](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres)'
---

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

In this guide, we will run through an example project that uses the following layout:

![ArchitectureDiagram.svg](ArchitectureDiagram.svg)

Each of the services listed above run isolated in their own individual containers.  The reasoning behind this is that each container can be replaced easily, without huge detriment to the entire web application.  Losing parts of these applications may make the end user experience less than optimal, but with ephemeral containers and restart logic baked within the docker-compose file, we have the ability to make sure that services are restarted quickly when they experience a failure.  `docker-compose scale` can also help us to scale up the number of containers available to each of these services, should there be a need for additional resources.  Whether you're running a web service like this one on bare metal servers or in the cloud, it becomes much easier to scale your service based on the resources that you have available to you.

## Dockerfile

Dockerfiles are the defacto way to automate installation and configuration of a docker image and it's dependencies.  You can read more about Dockerfiles in the [How To Use Dockerfiles](https://www.linode.com/docs/applications/containers/how-to-use-dockerfiles) Linode article.  Docker has also written a [Dockerfile Best Practices guide](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#sort-multi-line-arguments).  [Labels](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#label) can also be helpful in organization, licensing, automation, etcetera.  Having a common labeling strategy can help to organize your containers in a meaningful way, both from an organizational and automation perspective. [Here](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/web/Dockerfile) is an example of a Dockerfile that was created in order to run the flask application and gunicorn web server within our sample application.  To build a Docker container it's as simple as:

`docker build -f {/path/to/Dockerfile} -t {tag for Dockerfile} .`

This allows you to create a docker image based on the specified Dockerfile, using a specified tag.

## docker-compose
docker-compose has been used in the sample project in order to be able to handle all of the containers and their configuration settings. The [annotated docker-compose.yml file](https://github.com/bobstrecansky/docker-nginx-flask-redis-postgres/blob/master/docker-compose.yml) should help you to understand all of the individual pieces that fit together in the docker-compose puzzle.  Our main goals within this file are:

* Initialize all of the necessary elements (NGINX, Flask / Gunicorn, Redis, and Postgres)
* Expose and link all of the services to each other
* Externally expose the NGINX proxy to the docker host

## Test the sample application from the repository

You can get a full, working sample of the application written for this guide using the following steps:

1.  make sure you have Docker installed. [This](https://linode.com/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment/) is a guide to get it installed locally.
2.  clone the repository: `git clone git@github.com:bobstrecansky/docker-nginx-flask-redis-postgres.git`
3.  start the multi-container example application:
`cd docker-nginx-flask-redis-postgres/ && docker-compose up`

You should see all of the services start in your terminal window.  Example output [here](https://gist.github.com/bobstrecansky/29f473b906636fd7180e90284ce964f0)

4.  open a new terminal window and make a request to the example application:
`~ curl localhost             
Hello Linode!  This page has been viewed 1 time(s).`

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

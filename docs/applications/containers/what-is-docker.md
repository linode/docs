---
deprecated: true
author:
  name: Jon Chen
  email: docs@linode.com
description: 'An overview of Installing Docker, with an example use case for Nginx'
keywords: ["docker", " ubuntu", " 12.04", " centos", " container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2014-01-28
modified_by:
  name: Alex Fornuto
aliases: ['containers/docker/','applications/containers/docker.md/']
published: 2014-01-28
title: Docker
---

Docker is an extensible, open-source engine powered by [Linux Containers](http://linuxcontainers.org/) that automates the deployment of applications as portable, lightweight, and self-sufficient containers. For purposes of this tutorial, we'll assume you've followed the steps outlined in our [Getting Started Guide](/docs/getting-started/), that your system is up to date, and that you've logged in to your Linode as root via SSH.

# Installation

For the purposes of this guide we will show you how to install Docker on both Ubuntu 12.04 and CentOS 6.4 Docker provides repositories for each of these distributions, which makes installation easy.

### Ubuntu 12.04 64bit

Here we will add the Docker-maintained repository for Ubuntu and install the software.

1.  Docker is available as a package in Docker's Ubuntu repositories, but only for 64bit. First, you will need to add the Docker repository key using `apt-key`:

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9

2.  Add the Docker repository to your apt sources:

        echo "deb http://get.docker.io/ubuntu docker main" | sudo tee /etc/apt/sources.list.d/docker.list

3.  Run the following to apt-get update and install `lxc-docker`:

        sudo apt-get update
        sudo apt-get install lxc-docker

4.  To verify that the installation has completed successfully, launch an example Ubuntu container. This command will automatically grab any missing images, run the container, and provide an interactive bash session:

        sudo docker run -i -t ubuntu /bin/bash

    The output should resemble:

    {{< output >}}
# docker run -i -t ubuntu /bin/bash
Unable to find image 'ubuntu' (tag: latest) locally
Pulling repository ubuntu
8dbd9e392a96: Download complete
b750fe79269d: Download complete
27cf78414709: Download complete
root@145dfc4f6dff:/#
{{< /output >}}

5.  To exit the container, type `exit`.

### CentOS 6 64bit

Docker is available on the [EPEL](https://fedoraproject.org/wiki/EPEL#How_can_I_use_these_extra_packages.3F) repository as the `docker-io` package for 64bit only.

1.  To add the EPEL repository, install the latest [epel-release package](http://download.fedoraproject.org/pub/epel/6/i386/repoview/epel-release.html).
2.  To install Docker, run the following command:

        sudo yum -y install docker-io

3.  To start the Docker daemon, invoke `service`:

        sudo service docker start

4.  If you would like the Docker daemon to start at boot, issue the following command:

        sudo chkconfig docker on

5.  To verify that the installation has completed successfully, launch an example Fedora container. This command will automatically grab any missing images, run the container, and provide an interactive bash session:

        sudo docker run -i -t fedora /bin/bash

6.  To exit the container, type `exit`.

# What Can I Do with Docker?

Docker allows users to package their applications and configurations into lightweight images for deployment as portable containers.

### Hello World

To run a Docker container that prints "hello world", run the following command:

    docker run ubuntu /bin/echo hello world

It should return `hello world`.

This tells Docker to do a number of things:

1.  If the image (Ubuntu) doesn't already exist locally, download it from the [Docker Index](https://index.docker.io/).
2.  Create a new container with the base Ubuntu image with a read-write filesystem and networking interface.
3.  Allocate an IP address to the container; set up NAT to forward traffic to and from the container.
4.  Run the command `/bin/echo hello world`, and print the output.
5.  Having completed the main process, the container will exit.

### Writing a Dockerfile for Nginx

When building an image, Docker follows the instruction set in a file named `Dockerfile`. Note that the file needs to be named `Dockerfile` and all any files or folders required by the Dockerfile need to be under the same directory as the `Dockerfile` itself.

Running a program like `echo` in a Docker container is pretty simple. However, for programs that act as servers, such as [Nginx](http://nginx.com/), you will need to ensure that the program is configured not to self-daemonize.

This is an example Dockerfile for Nginx:

    FROM        ubuntu:12.04
    MAINTAINER  Jon Chen "fly@burrito.sh"

    RUN         echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
    RUN         apt-get update
    RUN         apt-get install -y nginx

    RUN         echo "\ndaemon off;" >> /etc/nginx/nginx.conf
    VOLUME      /etc/nginx/sites-enabled
    VOLUME      /var/log/nginx

    EXPOSE      80
    CMD         ["nginx"]

The Dockerfile syntax looks like this:

    # Comment
    INSTRUCTION arguments

Docker runs through the Dockerfile instructions from top to bottom in order. The first instruction **must** be `FROM`, which specifies the base image from which you wish to build your new image:

    FROM ubuntu:12.04

This sets the [official ubuntu:12.04 image](https://index.docker.io/_/ubuntu/) as the base image. You will also wish to use the MAINTAINER instruction to define the author of the image:

    MAINTAINER Jon Chen "fly@burrito.sh"

Next, the `RUN` instruction will execute commands on the image, and commit the results. Each commit is saved and used for the next instruction. For example, this `RUN` line replaces the contents of `/etc/apt/sources.list` in the image with `deb http://archive.ubuntu.com/ubuntu precise main universe`:

    RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list

The important thing to remember for programs such as Nginx is to ensure that the program doesn't run as a daemon. Nginx's default behavior as a daemon is to fork off worker processes, then exit the master process. As Docker only watches the PID for the original process, the container will halt prematurely instead of running persistently. To disable daemonization, add the [daemon off configuration directive](http://wiki.nginx.org/CoreModule#daemon) to `/etc/nginx/nginx.conf`:

    RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

To expose a port inside the container to the outside of the container, use the EXPOSE instruction:

    EXPOSE 80

The CMD instruction defines the default command to run when the container starts. In our example, we want to run Nginx:

    CMD ["nginx"]

By default, Docker containers do not have persistent storage. In order to share data between containers, use the [VOLUME](http://docs.docker.io/en/latest/use/working_with_volumes/) feature:

    VOLUME /etc/nginx/sites-enabled
    VOLUME /var/log/nginx

In order to mount a directory from the host onto the container, you will need to specify the host directory, corresponding container directory, and directory permissions in the command line when you run the container:

    -v=[]: Create a bind mount with: [host-dir]:[container-dir]:[rw|ro].
    If "host-dir" is missing, then docker creates a new volume.

To build this image, run the following command in the same directory as the Dockerfile. You can specify a repository and tag for your image as well with `-t repo/tag`:

    docker build -t bsdlp/nginx .

Run the following command to add `/etc/nginx/sites-enabled` and `/var/log/nginx` as volumes from the host to the container, start the container as a daemon, and expose port 80 from the container as port 80 on the host:

    docker run -d -p 80:80 -v /etc/nginx/sites-enabled:/etc/nginx/sites-enabled -v /var/log/nginx:/var/log/nginx bsdlp/nginx

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Docker's Getting Started guide](http://www.docker.io/gettingstarted/)
- [Docker on GitHub](https://github.com/dotcloud/docker)
- [Official Docker Image Index](https://index.docker.io/)




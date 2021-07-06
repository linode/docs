---
slug: a-further-introduction-to-docker-images-and-containers
author:
  name: Linode Community
  email: docs@linode.com
contributor:
description: 'A guide that further introduces using a Dockerfile to build Docker Images and Docker Containers and provides examples on your Linode.'
keywords: ["docker", "container", "docker image", "docker images", "docker container", "docker containers"]
tags: ["container","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-29
title: 'A Further Introduction to Docker Images and Containers'
h1_title: 'A Further Introduction to Docker Images and Containers.'
external_resources:
 - '[Best Practices for Writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices)'
 - '[Official Docker Images on Docker Hub](https://hub.docker.com/search?q=&type=image&image_filter=official&page=1)'
 - '[Docker Docs](http://docs.docker.com/)'
---

[Docker images](/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment#pull-docker-images) make it easy to deploy multiple containers without having to maintain the same image across multiple virtual machines. You can use a Dockerfile to automate the installation and configuration of an image and its dependencies. A [Dockerfile](/docs/guides/applications/containers/how-to-use-dockerfiles) is a text file of a list of commands in an order that is used to automate installation and configuration of a Docker image.

## Before You Begin

1.  Familiarize yourself with the [Getting Started](/docs/getting-started/) guide and have a Linode or other Linux system running Docker. For information about installing Docker see, [Installing and Using Docker on Ubuntu and Debian](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/) guide.

2.  This guide assumes you are comfortable with the *command-line interface* (CLI) and working with programs through it.

3.  This guide assumes you are familiar with the steps in the guide, [How to Use a Dockerfile to Build a Docker Image](/docs/guides/applications/containers/how-to-use-dockerfiles).

4.  Update the system with the package manager it uses.

## Create Your Dockerfile for the Docker Image

Docker requires a working Dockerfile for its builds. So, you need to create a Dockerfile that sets up an Ubuntu image with Apache acting as a web server and using the standard HTTP port 80.

1.  Create and change to a new directory by entering `mkdir ~/mydockerbuild && cd ~/mydockerbuild`.

2.  Create the Dockerfile by entering `touch Dockerfile`.

3.  Open `Dockerfile` using `sudo nano Dockerfile` or a text editor of your choice.

4.  Copy and paste the following example:
    {{< file "Dockerfile" docker >}}
FROM ubuntu
MAINTAINER John Doe jdoe@example.com
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install apache2 -y
RUN apt-get install apache2-utils -y
RUN apt-get clean
EXPOSE 80
CMD ["apache2ctl","-D","FOREGROUND"]
{{< /file >}}

5.  Save and close the file.

## Build a Docker Image from the Dockerfile

1.  Build the image using the `docker build` command within the same directory by entering `sudo docker build -t webdev1 .`.

2.  After the build is over and you're returned to the command prompt, enter `docker images.` The output looks similar to this, the *ubuntu* repository is downloaded because in the *FROM ubuntu* line of the Dockerfile ubuntu is mentioned:
  {{< output >}}
REPOSITORY        TAG          IMAGE ID       CREATED          SIZE
webdev1           latest       f63a5cbcc133   12 seconds ago   332MB
ubuntu            latest       7e0aa2d69a15   5 days ago       72.7MB
{{< /output >}}

{{< note >}}
Each image created is tagged *latest*. If you want to change the tag to for example, *development*, format the command as `sudo docker build -t "webdev1:development .`.
{{< /note >}}

## Running your Docker Images as Containers

When you execute the `sudo docker run my-image-name` command, you launch a Docker container tied to the terminal session. This is also referred to as running a process in the *foreground*. When the root process is in the foreground and is tied to a terminal session, the container exits as soon as you close the terminal session. If you want the container to run even after the terminal session is closed, you can run the container in *detached* mode. This runs the container in the *background*.

To run the Docker image as a container in detached mode:

1.  You need to use the `-d` argument. Enter `sudo docker container run -d --name apache webdev1` This also names the container *apache*, otherwise Docker randomly names it something similar to *itinerant_alpaca*; if you aren't worried about naming it, enter `sudo docker container run -d webdev1` and run `sudo docker ps` to see the assigned name.

2.  After you are back at the command prompt, enter `sudo docker ps`. The output of this command displays the webdev1 container, with the name *apache*, running in the background:
  {{< output >}}
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS     NAMES
de0c62fb3935   webdev1   "apache2ctl -D FOREG…"   4 seconds ago   Up 4 seconds   80/tcp    apache
{{</ output>}}

3.  Now you can do the development work with the Apache server and still have access to the command line. When done, stop the container by entering `docker stop apache` for the name or `docker stop de0c62fb3935` for the container ID, but you need to replace that with your own.

4.  Enter `docker ps` again to make sure all the containers are no longer running. The output should look like this:
  {{< output >}}
CONTAINER ID   IMAGE    COMMAND  CREATED        STATUS       PORTS          NAMES
{{</ output>}}

### Configure your Docker Container's Ports

You can use the `run` command's options to configure different aspects of the container. When a container runs on a remote host and serves its running application, you should configure its ports to expose the app to users.

For example, you can configure the `webdev1` container to use host port `80` and container port `80` as displayed in the example command. Notice the `-d` option used in the command to run the container as a detached process.

    docker run --name webdev1 -p 80:80 -d webdev1

The general syntax for this command is the following:

    docker run -–name <container name> -p <network port> <container port> <container image name>

Each parameter is described in the following list:

- `<container name>`: Name of the Docker container
- `<host port>`: Host port that is mapped to the container's open port
- `<container port>`: Port where Docker container listens
- `<container image name>`: Docker image name used for your deployment

## Further Reading

This guide and our [How to Use a Dockerfile to Build a Docker Image](/docs/guides/applications/containers/how-to-use-dockerfiles) covered the basics of using Dockerfiles to build images, but they barely scratch the surface. For more information:

-   visit the official [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/) documentation for more on Dockerfiles;

-   despite its name, Docker's [Get Started](https://docs.docker.com/get-started/) is an in-depth tutorial, which leads into even more in-depth guides (such as deploying applications into the cloud and setting up *CI/CD* (continuous integration and deployment)).
---
slug: docker-images-containers-and-dockerfiles-in-depth
description: 'A guide that further introduces using a Dockerfile to build Docker Images and Docker Containers and provides examples on your Linode.'
keywords: ["docker", "container", "docker image", "docker images", "docker container", "docker containers"]
tags: ["container","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-06-17
modified_by:
  name: Linode
published: 2021-04-29
image: DOCKERS.jpg
title: 'How to Use Docker Images, Containers, and Dockerfiles in Depth'
external_resources:
 - '[Best Practices for Writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices)'
 - '[Official Docker Images on Docker Hub](https://hub.docker.com/search?q=&type=image&image_filter=official&page=1)'
 - '[Docker Docs](http://docs.docker.com/)'
authors: ["Linode"]
---

[Docker images](/docs/guides/introduction-to-docker/#docker-images) make it easy to deploy multiple containers without having to maintain the same image across several virtual machines. You can use a Dockerfile to automate the installation and configuration of an image and its dependencies. A [Dockerfile](/docs/guides/how-to-use-dockerfiles) is a text file of the commands (which are executed in order) used to automate installation and configuration of a Docker image. This article expands on our guide on [How to Use a Dockerfile to Build a Docker Image](/docs/guides/how-to-use-dockerfiles) by covering in-depth utilization of Docker images, containers, and Dockerfiles.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide, create and update a Linode, and install Docker. Alternatively, you can quickly deploy an updated, Docker-enabled Linode with the [Docker Marketplace App](https://www.linode.com/marketplace/apps/linode/docker/).

2.  Ensure your Linode is secure by following our guide on [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/).

3.  This guide assumes you are comfortable with using the Docker command-line interface (CLI). To learn more about the Docker CLI, check out their [documentation](https://docs.docker.com/engine/reference/commandline/cli/).

4.  Review our guide on  to become familiar with the basics of Dockerfiles.

## Create Your Dockerfile for the Docker Image

Docker requires a working Dockerfile for its builds. Here, we will create a Dockerfile that sets up an Ubuntu image with Apache acting as a web server and using the standard HTTP port 80.

1.  At the command prompt (either via SSH or Lish in the Linode Manager), create and change to a new directory:

        mkdir ~/mydockerbuild && cd ~/mydockerbuild

2.  Create an example Dockerfile for your Apache application:

        touch apache_dockerfile

3.  Open the Dockerfile using the text editor of your choice (for this example, we use nano):

        nano apache_dockerfile

4.  Copy the following example into your Dockerfile. This creates a Dockerfile that generates an updated Ubuntu image, sets the maintainer information, installs Apache, opens container port 80, and finally starts an Apache server when run:

    {{< file "apache_dockerfile" docker >}}
FROM ubuntu
MAINTAINER John Doe jdoe@example.com
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install apache2 -y
RUN apt-get clean
EXPOSE 80
CMD ["apache2ctl","-D","FOREGROUND"]
{{< /file >}}

    {{< note respectIndent=false >}}
The `ARG DEBIAN_FRONTEND=noninteractive` instruction ensures that the subsequent `RUN apt-get` commands execute without requiring additional user input when building images. This instruction could also be written using `ENV` instead of `ARG` to make the environment variable persist in containers that are deployed with the image. Because non-interactivity may not be expected when working within such containers, `ARG` is recommended in this case.
{{< /note >}}

5.  Save and close the file.

## Build a Docker Image from the Dockerfile

1.  Build an image labelled `apache_image` from the Dockerfile using the `docker build` command:

        docker build ~/mydockerbuild -f apache_dockerfile -t apache_image

2.  Once the build is over and you're returned to the command prompt, display your system's available images with the following command:

         docker images

    The output should look like this (the "ubuntu" repository is also available due to the "FROM ubuntu" line in the Dockerfile):

    {{< output >}}
REPOSITORY     TAG       IMAGE ID       CREATED         SIZE
apache_image   latest    7e5c14739da5   7 seconds ago   215MB
ubuntu         latest    7e0aa2d69a15   6 weeks ago     72.7MB
{{< /output >}}

    {{< note respectIndent=false >}}
By default, built images are tagged "latest." If you want to change the tag, such as to "development", format the command as follows:

    docker build ~/mydockerbuild -f apache_dockerfile -t apache_image:development
{{< /note >}}

## Running your Docker Images as Containers

When you execute the `docker run` command, you launch a Docker container tied to your terminal session. This is also referred to as running a process in the *foreground*. When your root process is in the foreground and is tied to a terminal session, your container exits as soon as you close the terminal session. If you want your container to run even after your terminal session is closed, you can run your container in *detached* mode. This runs your container in the *background*.

To run the Docker image as a container in detached mode:

1.  Enter the following command to build a container named `apache` with your image, using the `-d` argument to ensure your container runs in the background:

        docker run --name apache -d apache_image

2.  Once you are back at the command prompt, run the following command to list your active containers and confirm that `apache` running in the background:

        docker ps

    {{< output >}}
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
1d5e1da50a86   apache_image   "apache2ctl -D FOREG…"   3 minutes ago   Up 3 minutes   80/tcp    apache
{{</ output>}}

3.  Now you can do your development work with the Apache server and still have access to the command line. However, your container is not publicly accessible as it lacks additional port configurations. In the next section, you will rebuild the container with port configurations that allow you to access the web server. For now, stop the container:

        docker stop apache

    {{< note respectIndent=false >}}
You can enter the container ID in place of `apache` in the above command.
{{< /note >}}

4.  Enter `docker ps` again to make sure all your `apache` container is no longer running.

5.  Now that the container has been stopped, you can remove it:

        docker rm apache

{{< note type="alert" >}}
Removing a container in this way deletes all data within the container. If you have made adjustments that you want to carry to a new container, you can instead use `docker commit` to build a new image that includes your updates:

    docker commit apache apache_image_update

Then, you can deploy a new container based on the new `apache_image_update` image in the next section.
{{< /note >}}

### Configure your Docker Container's Ports

You can use the `run` command's options to configure different aspects of your container. When your container runs on a remote host and serves its application, you can configure its ports to expose the app to users.

For example, you can configure your `apache` container to use host port `8080` and container port `80` as with the example command below. Notice the `-d` option used in the command to run the container as a detached process.

    docker run --name apache -p 8080:80 -d apache_image

The general syntax for this command is the following:

    docker run -–name <container name> -p <network port>:<container port> -d <container image label or ID>

Each parameter is described in the following list:

- `<container name>`: Name of the Docker container
- `<host port>`: Host port that is mapped to the container's open port
- `<container port>`: Port where Docker container listens
- `<container image name>`: Docker image name used for your deployment

Now, navigate to your Linode's IP address at host port 8080 by navigating to `http://<your Linode's IP address>:8080` in a web browser. You should see the "Apache2 Ubuntu Default Page" served from your Docker container.

{{< note type="alert" >}}
When deploying containers with port configurations, Docker may also create host firewall rules to allow public access to those containers. This can override or conflict with the host firewall rules you have configured on your Linode.
{{< /note >}}

## Further Reading

This guide and [How to Use a Dockerfile to Build a Docker Image](/docs/guides/how-to-use-dockerfiles) covered the basics of using Dockerfiles to build images and containers, but they barely scratch the surface of what you can accomplish with Docker. For more information:

-   visit the official [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/) documentation for more on Dockerfiles;

-   and, despite its name, Docker's [Get Started](https://docs.docker.com/get-started/) guide is an in-depth tutorial, which leads into even more in-depth guides, such as deploying applications into the cloud and setting up *CI/CD* (continuous integration and deployment).

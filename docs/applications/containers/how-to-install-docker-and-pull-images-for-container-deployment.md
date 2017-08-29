---
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
description: 'An introduction to using Docker, containers, and dockerfiles on your Linode.'
keywords: 'docker,container,dockerfile,install docker'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, July 17, 2017
modified_by:
  name: Linode
published: 'Monday, July 17, 2017'
title: 'How to Install Docker and Pull Images for Container Deployment'
external_resources:
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
---


![docker_banner](/docs/assets/install_docker.jpg)

In this guide, you'll install Docker and pull down images that can be deployed as containers.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Update your system (this example uses Ubuntu 16.04):

        apt update && apt upgrade

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Getting Started

Install Docker:

    apt install docker.io

You will be presented with all necessary dependencies and asked to accept the installation. Type `y` to accept and complete the installation.

{:.note}
>
>If you are using CentOS 7, use `sudo yum check-update && curl-fsSL https://get.docker.com/ | sh`

Docker installation adds the group `docker` to your Linode. Create the user `exampleuser`, give it `sudo` privileges, and add it to the Docker group:

    adduser exampleuser
    usermod -aG docker exampleuser

## Start and Enable Docker

Start and enable the Docker process to run on boot:

    systemctl start docker
    systemctl enable docker

## Pull Docker Images

The first thing you are going to want to do is pull down an image to be used as the basis for your Docker containers. [Docker Hub](https://hub.docker.com/) is the default registry from which to pull images.

1.  Use the `images` command to check what images already exist on your Linode. This example shows that no images are installed:

        docker images

    ![List Docker Images](/docs/assets/docker/docker-install-images-list.jpg "List Docker Images")

2. Pull the [nginx web server](https://nginx.org/en/), using the `docker pull` command: 

        docker pull nginx

    This will pull the latest official nginx Docker image

    ![Pull Official nginx Image](/docs/assets/docker/docker-install-image-nginx.jpg "Pull the official nginx image")

3.  If you run `docker images` again, you'll see the nginx image:

    ![docker images Shows the nginx Image](/docs/assets/docker/docker-install-image-nginx-installed.jpg "docker images now shows the nginx image")

### Find Unofficial nginx Images

Alternatively, if you don't want to install the official nginx image, use `docker search` to find other nginx images: 

    docker search nginx

This command will list all variant images, along with a respective description, and whether or not they are official.

![Run docker search nginx to Show Other nginx Options](/docs/assets/docker/docker-install-image-nginx-options.jpg "Run docker search nginx to Show Other nginx Options")

Use `docker pull` to pull one of the other images:

    docker pull blacklabelops/nginx

## Ready to Keep Going? 

At this point, you should know how to install Docker and pull down images with which you can then deploy containers. Use `man docker` to dive into the manual or visit our other [Docker Guides](/docs/applications/containers/) to learn more.

---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'LAMP, LEMP, WordPress, Drupal, Node.js with Docker on Linode'
keywords: 'docker, lamp, lemp, wordpress, drupal. node.js, ubuntu, debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, February 28th, 2015
modified_by:
  name: Joseph Dooley
published: 'Friday, February 28th, 2015'
title: LAMP Container with Docker
external_resources:
 - '[Linode Dockerhub Page](https://hub.docker.com/u/linode/)'
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Dockerhub](https://hub.docker.com/)'
---

Docker is a container platform for applications. With Docker, users can quickly download pre-configured apps without the hassle of the installation and configuration process. Docker containers can also build on each other. 

*If you are familiar with Docker containers, also try [Linode Images](/docs/platform/linode-images) to capture and deploy larger system profiles.*

##Install Docker
Use the Docker maintained install script. The install script is for Debian or Ubuntu. For other operating systems, use the [Docker Installation](https://docs.docker.com/en/latest/installation/) page.

1.  Run:

        curl -sSL https://get.docker.com/ | sh

2.  Add the non-root user to the "docker" group:

        sudo usermod -aG docker example_user

##Download the Docker Lamp Image
Visit the Dockerhub [Linode user page here](https://hub.docker.com/u/linode/). 

1.  Search for "linode" user images:

        sudo docker search linode

2.  Download the "linode/lamp" image:

        sudo docker pull linode/lamp

##Run the Docker Container, Apache, and MySQL
When an image downloads, there are no image containers running. 

1.  Run, create, or turn on a new container and forward port 80:

        sudo docker run -p 80:80 -t -i linode/lamp /bin/bash

     {: .caution }
    >
    > This command also changes the terminal prompt to the root user within the new container.

2.  From the container's root user, start Apache:

        service apache2 start

    The website's public, root directory is `/var/www/example.com/public_html/`.

3.  Start MySQL:

        service mysql start

4.  Exit the container while leaving it running, press `ctrl + p` then `ctrl + q`.

5. Enter the IP address in a web browser to test the site.

Congratulations, you have installed a configured LAMP stack using Docker in seven commands. For the LAMP configuration settings, see below. 

##Where to Find Configuration Settings
The LAMP image was installed using the [Hosting a Website](/docs/websites/hosting-a-website) guide on a Ubuntu container. The configuration files and settings can be found there, or on the [Dockerhub linode/lamp](https://registry.hub.docker.com/u/linode/lamp/) page.   










---
slug: how-to-install-docker-and-deploy-a-lamp-stack
description: 'This article gives you step-by-step instructions for installing Docker and using the application to create a LAMP stack within a Docker container.'
keywords: ["docker", "lamp", "LAMP", "ubuntu", "debian"]
tags: ["lamp","container","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/applications/containers/install-docker-and-lamp-stack/','/applications/containers/linode-lamp-container-docker/','/applications/containers/how-to-install-docker-and-deploy-a-lamp-stack/']
modified: 2015-02-23
modified_by:
  name: Linode
published: 2015-02-23
title: 'How to install Docker and deploy a LAMP Stack'
deprecated: true
external_resources:
 - '[Linode Docker Hub Page](https://hub.docker.com/u/linode/)'
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
authors: ["Joe D."]
---

Docker is a container platform for applications. With Docker, users can download pre-configured apps without the hassle of the installation and configuration process. Docker containers can also build on each other.

![How to Install Docker and deploy a LAMP Stack](how-to-install-docker-and-deploy-a-lamp-stack.png)

*If you are familiar with Docker containers, also try [Linode Images](/docs/products/tools/images/) to capture and deploy larger system profiles.*

## Install Prerequisites
Due to a [known issue](https://github.com/docker/docker/issues/23347) with the dependencies of the docker .deb, installing docker on a Debian/Ubuntu VM requires an additional step:

1. Run:

        apt-get install dmsetup && dmsetup mknodes

## Install Docker
Use the Docker-maintained install script for Debian or Ubuntu. For other operating systems, see the [Docker Installation](https://docs.docker.com/en/latest/installation/) guides.

1.  Run:

        curl -sSL https://get.docker.com/ | sh

    {{< note respectIndent=false >}}
The current version of the docker script checks for AUFS support and displays the warning below if support is not found:

Warning: current kernel is not supported by the linux-image-extra-virtual
          package.  We have no AUFS support.  Consider installing the packages
          linux-image-virtual kernel and linux-image-extra-virtual for AUFS support.
          + sleep 10

This message can be safely ignored, as the script will continue the installation using DeviceMapper or OverlayFS.  If you require AUFS support, you will need to configure a [distribution supplied](/docs/guides/run-a-distributionsupplied-kernel-with-pvgrub/) or [custom compiled](/docs/guides/custom-compiled-kernel-with-pvgrub-debian-ubuntu/) kernel.
{{< /note >}}

2.  If necessary, add the non-root user to the "docker" group:

        sudo usermod -aG docker example_user

## Download the Docker Lamp Image
The Docker Hub user page for Linode can be accessed [here](https://hub.docker.com/u/linode/). Select the **lamp** image for configuration information.

1.  Search for **linode** user images:

        sudo docker search linode

2.  Download the **linode/lamp** image:

        sudo docker pull linode/lamp

## Run the Docker Container, Apache, and MySQL
When an image downloads, there are no image containers running.

1.  Run, create, or turn on a new container and forward port 80:

        sudo docker run -p 80:80 -t -i linode/lamp /bin/bash

    {{< note type="alert" >}}
    This command also changes the terminal prompt to the root user within the new container.
    {{< /note >}}

2.  As the container's root user, start Apache:

        service apache2 start

3.  Start MySQL:

        service mysql start

4.  Exit the container while leaving it running by pressing `ctrl + p` then `ctrl + q`.

5. Enter the IP address in a web browser to test the site.

    {{< note respectIndent=false >}}
The website's root directory is `/var/www/example.com/public_html/`.
{{< /note >}}

Congratulations, you have installed a configured LAMP stack using Docker!


## Where to Find Configuration Settings
The LAMP image was installed using the [Hosting a Website](/docs/guides/hosting-a-website-ubuntu-18-04/) guide on a Ubuntu container. The configuration files and settings can be found there, or on the [Docker Hub linode/lamp](https://registry.hub.docker.com/u/linode/lamp/) page.

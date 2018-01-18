---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will show how to create customized Docker images and publish them to Docker Hub, the official Docker repository.'
keywords: ["docker", "dockerhub", "containers", "images"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-09-28
modified: 2017-09-29
modified_by:
  name: Linode
title: 'How to Create and Push Docker Images'
contributor:
  name: Jack Wallen
external_resources:
- '[Docker Hub Official Documentation](https://docs.docker.com/docker-hub/)'
---


Containers are an incredibly powerful tool that allow you to expand your company offerings in ways you might not have been able to previously—at least without having to add considerable overhead to your servers.

Previous guides in this series have covered how to [install Docker](/docs/applications/containers/how-to-install-docker-and-deploy-a-lamp-stack), [pull images](/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment), and [create containers](/docs/applications/containers/how-to-use-dockerfiles). This guide will show how to make changes to a Docker image and save the changes as a new image. Docker also makes it simple to publish customized images to Docker Hub, their official online repository.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt update && sudo apt upgrade

4.  Follow the steps in our [Install Docker and Deploy a LAMP Stack](/docs/applications/containers/how-to-install-docker-and-deploy-a-lamp-stack) guide to install Docker on your Linode. You should also familiarize yourself with the process of pulling Docker images as described in the guide.

5.  You will also need to create a free account on [Docker Hub](https://hub.docker.com/).

## Create an Image

There are already many Docker images available that include a LAMP stack. For the purposes of this guide, however, you will start with the latest Ubuntu image and edit it to include a LAMP stack.

1. Pull the latest Ubuntu image:

        docker pull ubuntu

2.  Create a new container:

        docker run --name lamp-server-template -it ubuntu:latest bash

3.  Install a LAMP stack in the container. The addition of the `bash` option to the `docker` command should open a bash shell within the new container. From there, issue the following commands:

        apt update && apt upgrade
        apt install lamp-server^

    {{< note >}}
Be sure to include the caret (**^**) symbol at the end of `lamp-server`.
{{< /note >}}

    Create (and verify) a MySQL root user password when prompted. When the installation completes, exit the container with the `exit` command.

4.  List the currently available containers to check if the new container is listed using the `ps` ("processes snapshot") command:

        docker ps -a

      Record the container ID for use in the next section.


## Commit Changes to the Image

1. In this section you will commit the changes made to the original image. Substitute the container ID from the previous section into the following command:

        docker commit d09dd0f24b58 lamp-server-template

2. Check to see if the new container is listed:

        docker images

### Tagging an Image

You may want to make further changes to your image at a later time. When this happens, it is helpful have some kind of version control system in place. Fortunately, Docker provides tagging functionality to make this easier.

Most images already include a tag. For instance, when you pull down the Ubuntu image, you will see it tagged as "latest". Docker tags are an easy way to know what version or release you are working with. This is especially useful when you are creating new images from a base image. Say, for instance, you have an Ubuntu image that you use to create all of your new images from, but you use the new images for different purposes. With Docker tags you could tag each image to more easily distinguish them:

    v1.8.10.2017
    v2.8.10.2017
    v3.8.10.2017

1.  Image tags are created at the time of a commit. Using the example above, tag the new image with a version number and date (so it is easy to check exactly when it was created):

        docker commit d09dd0f24b58 lamp-server-template:v1.8.10.2017

2.  Use the `docker images` command to view the new commit and its tag:


        REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
        lamp-server-template   v1.8.10.2017        932cde32b57b        3 seconds ago       593MB
        lamp-server-template   latest              6a9842fd995e        54 seconds ago      593MB
        ubuntu                 latest              2d696327ab2e        9 days ago          122M

## Pushing Your Image to Docker Hub

1.  Add personal information to the image. During the commit command, a description, your full name, and Docker Hub username can be added:

        docker commit -m "Added LAMP Server" -a "FULL NAME" d09dd0f24b58 USERNAME/lamp-server-template:v1.8.10.2017
    Replace FULL NAME with your name and USERNAME with your Docker Hub username.

2.  Log in to Docker Hub:

        docker login

3.  Push your image:

        docker push USERNAME/lamp-server-template:v1.8.10.2017

4.  Open a browser, log in to your Docker Hub account, and go your main repository. You should see the new image listed. Click on the image and then click on the `Tags` tab and you will see the added tag.


    ![Image on Docker Hub](/docs/assets/docker/dockerdev3.jpg)


## How to Deploy Containers with Shipyard

Shipyard offers a web-based GUI, built on Docker Swarm.

For those that have never heard of Shipyard, it is built on Docker Swarm and gives you an easy means of managing your docker resources (such as containers, images, private registries, nodes, accounts, and events). What is really interesting about Shipyard is that it itself is built via a Docker image; so to install Shipyard, you use Docker.

What I want to show you is how to easily install Shipyard and then how to deploy a container using the web-based GUI. I will be demonstrating on a Linode running Ubuntu Server 16.10 with Docker already installed.

### How to Download and Run Shipyard:

Docker has created a simple script that automates the process of deploying Shipyard. In order to use this script, you’ll need to be logged into your Linode as a user who is a part of the docker group. Once logged in, issue the following command:

    curl -sSL https://shipyard-project.com/deploy | bash -s

The downloaded script will run and take care of deploying the Shipyard container. From start to finish, the script shouldn’t take more than a minute or two. Once the command completes, point a browser to `http://SERVER_IP:8080`, where `SERVER_IP` is the actual IP address of your Linode. You will be required to log in using these default credentials:

    Username - admin
    Password - shipyard

---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will show how to create customized Docker images and publish them to Docker Hub, the official Docker repository.'
keywords: 'list,of,keywords,and key phrases'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Thursday, September 28th, 2017'
modified: Friday, September 29th, 2017
modified_by:
  name: Linode
title: 'How to Create and Push Docker Images'
contributor:
  name: Jack Wallen
  link: http://jackwallen.gov
external_resources:
- '[Docker Hub Official Documentation](https://docs.docker.com/docker-hub/)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----

Containers are an incredibly powerful tool that allow you to expand your company offerings in ways you might not have been able to previously—at least without having to add considerable overhead to your servers.

Linode makes working with containers easy, because you already have the Linux platform which to install and run Docker. So far I’ve demonstrated how to install Docker, pull images, and create containers.

But what happens when you want to develop those images (for further usage) or make those images available from the public Docker Hub? Believe it or not, Docker makes it very simple to develop those images and push them to their official repository (Docker Hub). Let’s dive into this process, one step at a time.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

4.  Follow the steps in our [Install Docker and Deploy a LAMP Stack](/docs/applications/containers/how-to-install-docker-and-deploy-a-lamp-stack) guide to install Docker on your Linode. You should also familiarize yourself with the process of pulling Docker images as described in the guide.

5.  You will also need to create a free account on [Docker Hub](https://hub.docker.com/).

## Create an Image

There are already many Docker images available that include a LAMP stack. For the purposes of this guide, however, you will start with the latest Ubuntu image and edit it to include a LAMP stack.

1. Pull the latest Ubuntu image:

        docker pull ubuntu

2.  Create a new container:

        docker run --name lamp-server-template -it ubuntu:latest bash

3.  Install a LAMP stack in the container. The addition of the `bash` option to the `docker` command should open a bash shell within the new container. From there, issue the following commands:

        apt-get update && apt-get upgrade
        apt-get install lamp-server^

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

## Pushing your Image to Docker Hub

1.  Add personal information to the image. During the commit command, a description, your full name, and Docker Hub username can be added:

        docker commit -m "Added LAMP Server" -a "FULL NAME" d09dd0f24b58 USERNAME/lamp-server-template:v1.8.10.2017

    Replace FULL NAME with your name and USERNAME with your Docker Hub username.

2.  Log in to Docker Hub:

        docker login

3.  Push your image:

        docker push USERNAME/lamp-server-template:v1.8.10.2017

4.  Open a browser, log in to your Docker Hub account, and go your main repository. You should see the new image listed. Click on the image and then click on the Tags tab and you will see the added tag (Figure 3).


  ![Image on Docker Hub](/docs/assets/docker/dockerdev3.jpg)

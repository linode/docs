---
slug: how-to-use-dockerfiles
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
description: 'This guide introduces Dockerfiles and how to use them to build a Docker Image on your Linode.'
keywords: ["docker", "container", "dockerfile"]
tags: ["container","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-02
modified_by:
  name: Linode
published: 2017-08-11
title: 'How to Use Dockerfiles'
external_resources:
 - '[Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices)'
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
aliases: ['/applications/containers/how-to-use-dockerfiles/']
---

![How to Use Dockerfiles](how-to-use-dockerfiles.png "How to Use Dockerfiles")

[Docker images](/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment#pull-docker-images) make it easy to deploy multiple containers without having to maintain the same across multiple virtual machines.

You can use a Dockerfile to automate installation and configuration of an image and its dependencies.

## Dockerfile Basics

A `dockerfile` is a text file that contains the necessary commands to assemble an image. Once a Dockerfile is created, the administrator uses the `docker build` command to create an image based on the commands within the file. The commands and information within the `dockerfile` can be configured to use specific software versions and dependencies to ensure consistent and stable deployments.

{{< note >}}
Do not store the Dockerfile in your root directory.

Create a separate directory for the Dockerfile and place all necessary files within the same directory as the Dockerfile.
{{< /note >}}

A Dockerfile uses the following commands for building the images:

*  **ADD**: Copy files from a source on the host to the container's own filesystem at the set destination.
*  **CMD**: Execute a specific command within the container.
*  **ENTRYPOINT**: Set a default application to be used every time a container is created with the image.
*  **ENV**: Set environment variables.
*  **EXPOSE**: Expose a specific port to enable networking between the container and the outside world.
*  **FROM**: Define the base image used to start the build process.
*  **MAINTAINER**: Define the full name and email address of the image creator.
*  **RUN**: Central executing directive for Dockerfiles.
*  **USER**: Set the UID (the username) that will run the container.
*  **VOLUME**: Enable access from the container to a directory on the host machine.
*  **WORKDIR**: Set the path where the command, defined with CMD, is to be executed.

Not every command must be used. You will create a working Dockerfile example in the following section.

## How Do Dockerfiles Work? 

Dockerfiles are scripts that have different commands/instructions that carry out automated actions based on Docker images. Dockerfiles simplify the deployment process making the build process easy.

Docker images hold your environment and your applications/commands. A Docker container on the other hand is created from these Docker images. Finally, Docker registry is where your public or private Docker images are stored. The way Dockerfiles work is by automating image construction to create these Docker containers.


## How Do You Write Dockerfiles?

To create a Dockerfile in a directory, create an empty Dockerfile in your directory by running the following command: 

	touch Dockerfile 

This creates an empty Dockerfile in your directory, which we need to fill up following a certain format. 

A sample Dockerfile format that shows all build instructions and commands is below: 

	# Install a more up to date MongoDB if the current version isn’t the latest one on Ubuntu servers

	FROM ubuntu

	MAINTAINER Jeff Attwood

	RUN apt-key adv --keyserver keyserver.ubuntu.com80 --recv 7F0CEB10

	RUN apt-get update

	RUN apt-get -y install apt-utils 

	RUN apt-get -y install mongodb-10gen

	#RUN 

	CMD [“usr/bin/mongod”, “--config”, “etc/mongodb.conf”]

The following are required when you create a Dockerfile:
1. FROM 
2. MAINTAINER 
3. RUN
4. CMD 

Once defined properly, these Dockerfiles will automate Docker image build based on your instructions. 


## Where Is Dockerfile Stored?

These Dockerfiles are located at the root. You can use the -f argument to specify docker build to look for the right Dockerfile anywhere on your system. 

	$ docker build -f /path/docker_file

“Replace” /path/docker_file with the path to your Dockerfile and run the command.

## Create a Dockerfile

Dockerfiles require specific setup and format with no extra spaces.

Docker reuses cache from the previous step. This may result in commands not running properly or not running at all. To avoid this caching issue, combine `apt` commands into a single `RUN` statement. To avoid other caching issues, combine multiple `RUN` statements for commands like `apt-get update/upgrade/install`.

Note that in the example below, multiple packages are installed on separate lines. This optional step is recommended by the [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#sort-multi-line-arguments) in order to ease future updates and maintenance.

1.  Create and change to a new directory and create a `Dockerfile` file:

        mkdir ~/mydockerbuild && cd ~/mydockerbuild
        touch Dockerfile

2.  Open `Dockerfile` using a text editor and enter the following example to create a Dockerfile that installs `build-essential`, `curl`, and `make` onto a Ubuntu image:

    {{< file "Dockerfile" docker >}}
FROM ubuntu
MAINTAINER NAME EMAIL
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    curl \
    make

{{< /file >}}


        In this example:

        *  **NAME**: Full name of the creator.
        *  **EMAIL**: Email address of the creator.

3.  Save and close `Dockerfile`.

## Build a Docker Image from the Dockerfile

Build the `Dockerfile` using the `docker build` command within the same directory. Substitute `NAME` in the following example with the name of the image to be created:

    docker build --tag=“Build-Essential:Dockerfile” /path/to/file .

To build three images using the same Dockerfile, give each image a new name. In this example, `webdev1`, `webdev2`, `webdev3`:

    docker build -t “webdev1:Dockerfile” .
    docker build -t “webdev2:Dockerfile” .
    docker build -t “webdev3:Dockerfile” .

Each image created will be tagged `Dockerfile`. To change the tag during build, change `Dockerfile`:

    docker build -t “debian-webdev3:dev” .

## Run Docker Image As A Container

Continuing from the Docker images we created in the previous section, let’s see how to run a Docker image as a container using the `Webdev1` Docker image. 

To run a Docker image, use the following syntax:

	$ docker run &lt;Docker image>

To run our `Webdev1` Docker image as a container, we have to run this command: 

	$ docker run Webdev1 

But docker run can do much more, the full set of parameters in docker run are:

	$ docker run [OPTIONS] &lt;Docker image> [COMMAND] [ARG…]

If the docker run command is run and the Docker image is not available on the local directory, it is pulled from the registry instead. 


### Running Docker image As A Container In A Detached Mode

When you execute `docker run <Docker image>`, you launch a Docker container that is tied to your terminal session. This is also referred to as running a process in the foreground. When your root process is in the foreground, tied to a terminal session, your container exits as soon as you close the terminal session. This isn’t helpful if you wish to have Docker Image running as a container even after the terminal session is closed. 

To run a Docker image as a container in a detached mode, use the -d argument. We can run our `Webdev1` in the background by executing the following command:

	$ docker container run -d Webdev1

Once you run this command, the root process keeps running in the background even when the terminal session is closed. To view all such containers running in the background run the following command: 

	$ docker ps

The output of docker ps in our case will be
{{<output>}}
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES

3a4sak1aday2        Webdev1         "bash"   6 minutes ago       Up 29 minutes        2222->3000/tcp   Webdev1

{{</ output>}}

To remove the container we just started, we can use the following command: 

	$ docker rm Webdev1 

To confirm if our container has been removed, run the following command again:

	$ docker ps -all

You should see an output like this with no containers below: 
{{<output>}}

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
{{</ output>}}

## Deploying Docker Containers To Cloud 

Using the syntax below we can deploy and run our Docker container on the cloud:

	docker run –name <container name> -p <network port> <container port> <container image name>

 To deploy our Webdev1 to cloud, we need to define the following parameters:



*   `<container name>` - Name of the Docker container 
*   `<network port>` - Network port that’s available 
*   `<container port>` - The port where Docker container listens 
*   `<container image name>` - Docker image name used for cloud deployment

Let’s deploy our Docker image `Webdev1` at `20:22` ports by running the following command 

	$ docker run --name Webdev1 -p 20:22 -d Webdev1

Notice `-d` in our command above, we added to run Webdev1 container as a detached process. 

To stop and delete this container from the server, run the `docker rm <container_name>` command.

## Just the basics

This guide covered the basics of using Dockerfiles to build images. For more information on Dockerfiles, visit the official [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/) documentation.

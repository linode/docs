---
slug: set-up-mongodb-on-docker
description: 'A guide with examples explaining how to install MongoDB on a Docker container utilizing the MongoDB Docker Hub image.'
keywords: ["docker", "mongodb", "mongodb container", "docker mongodb container", "install mongodb docker", "configure mongodb docker"]
tags: ["container","docker","mongodb"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-27
modified_by:
  name: Linode
title: "Set Up MongoDB on Docker"
title_meta: "How to Set Up MongoDB on Docker"
external_resources:
- '[MongoDB on Docker Hub](https://hub.docker.com/_/mongo/)'
authors: ["Linode"]
---
MongoDB is an open-source NoSQL database utilizing JSON-like documents and schemata that support rapid iterative development. Its scale-out architecture is popular with application developers who use agile methodologies to move quickly. As it's popular within the agile community, using MongoDB with Docker is an excellent approach for a *continuous integration and development* (CI/CD) workflow.

## Before You Begin

To complete the examples in this guide, first set up and secure a Linode with Docker installed. You can accomplish this by utilizing the Docker Marketplace App, or through manual installation. Instructions for both approaches are provided below.

This guide assumes you are comfortable with the *command-line interface* (CLI) on a Unix-like system and using it to work with programs.

### Set up a Linode with Docker

#### Docker Marketplace App

You can quickly set up a secure, updated Linode with the Docker Marketplace App. For instructions, see our guide on [How to Deploy Docker with Marketplace Apps](/docs/products/tools/marketplace/guides/docker/). For the purposes of this guide, we recommend deploying the Docker Marketplace App with the [Docker Options](/docs/products/tools/marketplace/guides/docker/#docker-options):

- The limited sudo user to be created for the Linode
- The password for the limited sudo user
- The limited sudo user SSH Public Key that will be used to access the Linode
- Disable root access over SSH? (yes)

#### Manual Installation

1.  Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for updating your Linode.

1.  Complete the sections of our [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services.

1.  Install Docker on your Linode by following the steps in our guide on [How to Install and Use Docker on Ubuntu and Debian](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/).

### Verify Docker Installation

Verify that Docker is installed on your Linode:

    docker --version

You can expect an output similar to the following:

{{< output >}}
Docker version 20.10.8, build 3967b7d
{{< /output >}}

{{< content "limited-user-note-shortguide" >}}

## How to Install a MongoDB Docker Container

Docker makes creating a MongoDB image very easy, as they keep [an officially maintained version at the Docker Hub](https://hub.docker.com/_/mongo). To install it:

1.  Download and install the MongoDB image from Docker Hub:

        sudo docker pull mongo

    The output as the image downloads should resemble the following:

    {{< output >}}
Using default tag: latest
latest: Pulling from library/mongo
16ec32c2132b: Pull complete
6335cf672677: Pull complete
cbc70ccc8ebe: Pull complete
0d1a3c6bd417: Pull complete
960f3b9b27d3: Pull complete
aff995a136b4: Pull complete
4249be7550a8: Pull complete
cc105ff5aa3c: Pull complete
82819807d07a: Pull complete
81447d2c233f: Pull complete
Digest: sha256:54d24682d00278f64bf21ff62b7ee62b59dae50f65139831a884b345922b0f8a
Status: Downloaded newer image for mongo:latest
docker.io/library/mongo:latest
{{< /output >}}

    {{< note respectIndent=false >}}
This command pulls the latest version by default (as it says in the first line of the output). To pull a specific version, add the tag for that version to the command. For example, to install MongoDB 4.4.6, enter `docker pull mongo:4.4.6`.
{{< /note >}}

2.  Ensure the image has been installed:

        sudo docker images

    The output should look like this:

    {{< output >}}
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
mongo        latest    07630e791de3   2 weeks ago   449MB
{{< /output >}}

3.  Create a container with the `mongo` image in detached mode so that it is still interactive on your system:

        sudo docker run --name mongo_example -d mongo

4.  Ensure the container is running:

        sudo docker ps

    The output should look like this:

    {{< output >}}
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS       NAMES
1f88d00b9e78   mongo     "docker-entrypoint.s…"   4 seconds ago   Up 4 seconds   27017/tcp   mongo_example
{{< /output >}}

MongoDB is now running as a Docker Container.

## How to Log Into MongoDB on the Container

1.  Enter the following to gain the bash prompt within the container:

        sudo docker exec -it mongo_example bash

2.  Once at the container's command prompt, enter the `mongosh` shell:

        mongosh

From the `mongosh` shell, you can test queries and operations directly with your database.

{{< note >}}
The legacy `mongo` shell has been deprecated in MongoDB v5.0, but is still accessible as an alternative to `mongosh`.
{{< /note >}}

## How to Configure MongoDB in a Docker Container

For details on configuring MongoDB, see the [MongoDB manual](https://docs.mongodb.com/manual/). However, `mongod` (MongoDB's primary daemon) flags are usually set to configure MongoDB, and the `docker run` command is designed to pass the `mongod` flags.

For example, to turn off the scripting engine, add the flag to the end of the command like the following:

        sudo docker run --name mongo_example2 -d mongo --noscripting

As another example, to turn off the scripting engine and turn on IPv6, enter the following:

        sudo docker run --name mongo_example3 -d mongo --noscripting --ipv6

## How to Save MongoDB data from a Docker Container

Since MongoDB is being run on a Docker Container, its data won't persist when it's exited (as it saves the data in the /data/db directory in the container itself). If you need the MongoDB data to persist, you must create and mount a Docker Volume or mount a directory from your host system.

### Adding a Docker Volume to a MongoDB Container

Creating and adding a volume for the container to use is straightforward if you are familiar with Docker.

1.  Create a Docker Volume for the data to reside on by entering the following:

        sudo docker volume create mongo_volume

2.  Then create a `docker run` command to attach the volume to the container and map it to the `/data/db` container directory by entering:

        sudo docker run -it -v mongo_volume:/data/db --name mongo_example4 -d mongo

### Mounting a Host System Directory in a MongoDB Docker Container

If you want data to persist and access the data outside of Docker, you can use a directory on your host system.

To mount a host system directory:

1.  Create a directory on your system (if you don't have one you want to use) at the root level of your system by entering:

        sudo mkdir -p /mongo_data_directory

2.  Then execute a `docker run` command to mount the directory and map it to `/data/db` by entering:

        sudo docker run -it -v /mongo_data_directory:/data/db --name mongo_example5 -d mongo

## Further Reading

Learning how to use MongoDB on Docker is vital for CI/CD workflows and rapid iterative development. Continuing with some of Docker's [MongoDB information at the Docker Hub](https://hub.docker.com/_/mongo) is an excellent companion to this article.

To learn more about `mongod` options to be passed in `docker run`, review the `mongod` [MongoDB Package Components](https://docs.mongodb.com/manual/reference/program/mongod/) section of the MongoDB Manual.

Also, if you plan on upgrading to MongoDB Enterprise, see [Install MongoDB Enterprise with Docker](https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-with-docker/) in the MongoDB Manual for instructions `mongod`.

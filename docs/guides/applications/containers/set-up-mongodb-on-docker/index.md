---
slug: set-up-mongodb-on-docker
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide explaining how to install Mongo DB on a Docker container utilizing a Docker image using CentOS 7 on a Linode example.'
keywords: ["docker", "mongodb", "mongodb container", "docker mongodb container", "install mongodb docker", "configure mongodb docker"]
tags: ["container","docker","mongodb"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-20
modified_by:
  name: Linode
title: "How to Set Up MongoDB on Docker"
h1_title: "Set Up MongoDB on Docker."
contributor:
external_resources:
- '[MongoDB on Docker Hub](https://hub.docker.com/_/mongo/)'
---
MongoDB is an open-source NoSQL database utilizing JSON-like documents and schemata that support rapid iterative development. Its scale-out architecture has become popular with application developers who use agile methodologies to move quickly. As it's popular within the agile community, using it with Docker for a *continuous integration and development* (CI/CD) workflow.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and have a Linode (or other systems) running Docker.

2.  This guide assumes you are comfortable with the *command-line interface* (CLI) on a Unix-like system and working with programs through it.

3.  Update your system with the package manager it uses.

## How to Install a MongoDB Docker Container

Docker makes creating a MongoDB image very easy, as they keep [an officially maintained version at the Docker Hub](https://hub.docker.com/_/mongo). To install it:

1.  At the terminal, enter the following:

        docker pull mongodb

The output will progress as it downloads and resembles the following:
    {{< output >}}
Using default tag: latest
latest: Pulling from library/mongo
01bf7da0a88c: Pull complete
f3b4a5f15c7a: Pull complete
57ffbe87baa1: Pull complete
77d5e5c7eab9: Pull complete
43798cf18b45: Pull complete
67349a81f435: Pull complete
590845b1f17c: Pull complete
1f2ff17242ce: Pull complete
6f11b2ce0594: Pull complete
91532386f4ec: Pull complete
705ef0ab262e: Pull complete
e6238126b609: Pull complete
Digest: sha256:8b35c0a75c2dbf23110ed2485feca567ec9ab743feee7a0d7a148f806daf5e86
Status: Downloaded newer image for mongo:latest
docker.io/library/mongo:latest
{{< /output >}}
    {{< note >}}
This command pulls the latest version by default (as it says in the first line of the output). To pull a specific version, add the tag for that version to the command. If you wanted MongoDB 4.4.6, for example, you would enter `docker pull mongo:4.4.6`.
{{< /note >}}

2.  Ensure the image has been installed.

        docker images

The output should look like this:
    {{< output >}}
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
mongo        latest    07630e791de3   2 weeks ago   449MB
{{< /output >}}

3.  Create the container so it's running detached and still interactive on the system, enter:

        docker run --name mongo_example -d mongo

4.  Ensure the container is running:

        docker ps

The output should look like this:
    {{< output >}}
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS       NAMES
1f88d00b9e78   mongo     "docker-entrypoint.s…"   4 seconds ago   Up 4 seconds   27017/tcp   mongo_example
{{< /output >}}

MongoDB is now running as a Docker Container.

## How to Log Into MongoDB on the Container

1.  Enter the following to gain the bash prompt within the container:

        docker exec -it mongo_example bash

2.  Once at the container's command prompt, enter:

        mongo

That will bring you to the `mongo` shell prompt and the output will look something like this:
    {{< output >}}
MongoDB shell version v4.4.6
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("dc011864-879c-4406-96cb-44710c17a6a4") }
MongoDB server version: 4.4.6
Welcome to the MongoDB shell.
For interactive help, type "help".
For more comprehensive documentation, see
    https://docs.mongodb.com/
Questions? Try the MongoDB Developer Community Forums
    https://community.mongodb.com
---
The server generated these startup warnings when booting:
        2021-05-29T16:19:14.757+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
        2021-05-29T16:19:15.760+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
        2021-05-29T16:19:15.761+00:00: /sys/kernel/mm/transparent_hugepage/enabled is 'always'. We suggest setting it to 'never'
        2021-05-29T16:19:15.761+00:00: /sys/kernel/mm/transparent_hugepage/defrag is 'always'. We suggest setting it to 'never'
---
---
        Enable MongoDB's free cloud-based monitoring service, which will then receive and display
        metrics about your deployment (disk utilization, CPU, operation statistics, etc).

        The monitoring data will be available on a MongoDB website with a unique URL accessible to you
        and anyone you share the URL with. MongoDB may use this information to make product
        improvements and to suggest MongoDB products and deployment options to you.

        To enable free monitoring, run the following command: db.enableFreeMonitoring()
        To permanently disable this reminder, run the following command: db.disableFreeMonitoring()
---
{{< /output >}}

## How to Configure MongoDB in a Docker Container

For details on configuring MongoDB, see the [MongoDB manual](https://docs.mongodb.com/manual/). However, `mongod` (MongoDB's primary daemon) flags are usually set to configure MongoDB, and the `docker run` command is designed to pass the `mongod` flags. If you wanted to turn off the scripting engine, for example, you would add the flag to the end of the command, like the following:

        docker run --name mongo_example2 -d mongo --noscripting

If you wanted to turn off the scripting engine and turn on IPv6, the command would be as follows:

        docker run --name mongo_example2 -d mongo --noscripting-ipv6

## How to Save MongoDB data from a Docker Container

Since MongoDB is being run on a Docker Container, its data won't persist when it's exited (as it saves the data in the /data/db directory in the container itself). If you need the MongoDB data to persist, you must create and mount a Docker Volume or mount a directory from your host system.

### Adding a Docker Volume to a MongoDB Container

Creating and adding a volume for the container to use is straightforward if you are familiar with Docker.

1.  Create a Docker Volume for the data to reside on by entering the following:

        docker volume create mongo_volume

2.  Then create a `docker run` command to attach the volume to the container and map it to the `/data/db` directory by entering:

        docker run -it -v mongo_volume:/data/db --name mongo_example3 -d mongo

### Mounting a Host System Directory in a MongoDB Docker Container

If you want data to persist and access the data outside of Docker, then using a directory on your host system will work.

To mount a host system directory:

1.  Create a directory on your system (if you don't have one you want to use) at the root level of your system by entering:

        sudo mkdir -p mongo_data_directory`

2.  Then create a `docker run` command to mount the directory and map it to `/data/db` by entering:

        docker run -it -v /mongo_data_directory:/data/db --name mongo_example4 -d mongo

## Further Reading

Learning how to use MongoDB on Docker is vital for CI/CD workflows and rapid iterative development. Continuing with some of Docker's [MongoDB information at the Docker Hub](https://hub.docker.com/_/mongo) is an excellent companion to this article.

To learn more about the `mongod` options to be passed in `docker run`, see (https://docs.mongodb.com/manual/reference/program/mongod/) in the MongoDB Manual.

Also, if you plan on upgrading to MongoDB Enterprise, they have a ["Install MongoDB Enterprise with Docker"](https://docs.mongodb.com/manual/tutorial/install-mongodb-enterprise-with-docker/) on the MongoDB Manual.